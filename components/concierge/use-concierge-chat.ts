"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { CONCIERGE } from "@/lib/site";

const STORAGE_KEY = "acr-concierge-v1";
const MAX_INPUT_CHARS = 2000;
const HISTORY_WINDOW = 12;

export type ConciergeMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  state: "done" | "streaming" | "interrupted";
};

export type ConciergeStatus = "idle" | "streaming" | "error" | "rate-limited";

function loadStoredMessages(): ConciergeMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (message): message is ConciergeMessage =>
        typeof message === "object" &&
        message !== null &&
        typeof (message as ConciergeMessage).content === "string" &&
        ((message as ConciergeMessage).role === "user" ||
          (message as ConciergeMessage).role === "assistant"),
    );
  } catch {
    return [];
  }
}

function storeMessages(messages: ConciergeMessage[]) {
  try {
    const settled = messages.filter((message) => message.state !== "streaming");
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(settled));
  } catch {
    // Storage unavailable (private mode, quota) — chat degrades to in-memory.
  }
}

/**
 * Concierge transcript + streaming transport.
 *
 * The reply streams as raw text chunks; a clean stream end is success, a
 * rejected read with partial text is an interruption (kept, marked), and a
 * failed fetch/HTTP error becomes an `error`/`rate-limited` status.
 */
export function useConciergeChat() {
  const [messages, setMessages] =
    useState<ConciergeMessage[]>(loadStoredMessages);
  const [status, setStatus] = useState<ConciergeStatus>("idle");
  const [announcement, setAnnouncement] = useState("");
  const controllerRef = useRef<AbortController | null>(null);

  // Abort on unmount only — closing the panel lets the reply finish in the
  // background so the transcript is complete on reopen.
  useEffect(() => () => controllerRef.current?.abort(), []);

  const send = useCallback(
    async (rawText: string) => {
      const text = rawText.trim().slice(0, MAX_INPUT_CHARS);
      if (!text || status === "streaming") return;

      const userMessage: ConciergeMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        state: "done",
      };
      const history = [...messages, userMessage]
        .slice(-HISTORY_WINDOW)
        .map(({ role, content }) => ({ role, content }));

      setMessages((prev) => {
        const next = [...prev, userMessage];
        storeMessages(next);
        return next;
      });
      setStatus("streaming");
      setAnnouncement("");

      const controller = new AbortController();
      controllerRef.current = controller;

      const assistantId = crypto.randomUUID();
      let draftAdded = false;
      let replyText = "";

      const finalize = (state: "done" | "interrupted") => {
        setMessages((prev) => {
          const next = prev.map((message) =>
            message.id === assistantId
              ? { ...message, content: replyText, state }
              : message,
          );
          storeMessages(next);
          return next;
        });
        setStatus("idle");
        setAnnouncement(replyText);
      };

      try {
        const res = await fetch(CONCIERGE.chatEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          setStatus(res.status === 429 ? "rate-limited" : "error");
          return;
        }

        setMessages((prev) => [
          ...prev,
          {
            id: assistantId,
            role: "assistant",
            content: "",
            state: "streaming",
          },
        ]);
        draftAdded = true;

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          replyText += decoder.decode(value, { stream: true });
          const streamed = replyText;
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantId
                ? { ...message, content: streamed }
                : message,
            ),
          );
        }
        replyText += decoder.decode();
        finalize("done");
      } catch {
        if (controller.signal.aborted) return;
        if (draftAdded && replyText) {
          finalize("interrupted");
          return;
        }
        if (draftAdded) {
          setMessages((prev) =>
            prev.filter((message) => message.id !== assistantId),
          );
        }
        setStatus("error");
      }
    },
    [messages, status],
  );

  return { messages, status, announcement, send };
}
