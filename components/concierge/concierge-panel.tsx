"use client";

import { Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ConciergeMessages } from "@/components/concierge/concierge-messages";
import { useConciergeChat } from "@/components/concierge/use-concierge-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CONTACT } from "@/lib/site";

type ConciergePanelProps = {
  panelId: string;
  onClose: () => void;
};

export function ConciergePanel({ panelId, onClose }: ConciergePanelProps) {
  const { messages, status, announcement, send } = useConciergeChat();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const submit = () => {
    if (!input.trim() || status === "streaming") return;
    void send(input);
    setInput("");
    inputRef.current?.focus({ preventScroll: true });
  };

  return (
    <div
      id={panelId}
      role="dialog"
      aria-label="Aleevia Carter concierge chat"
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
      className="flex h-full flex-col overflow-hidden rounded-md border border-border bg-card shadow-xl shadow-emerald/10"
    >
      <header className="flex items-center gap-3 bg-emerald px-4 py-3.5 text-emerald-foreground">
        <span className="relative flex size-2 shrink-0">
          <span className="relative inline-flex size-2 rounded-full bg-gold" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-caption font-medium uppercase tracking-label">
            Concierge
          </p>
          <p className="truncate text-caption text-emerald-foreground/70">
            Aleevia Carter Residences
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close concierge chat"
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-sm text-emerald-foreground/80 transition-colors hover:bg-emerald-foreground/10 hover:text-emerald-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold active:translate-y-px"
        >
          <X className="size-4" aria-hidden />
        </button>
      </header>

      <ConciergeMessages
        messages={messages}
        status={status}
        onSuggestion={send}
      />

      {status === "error" && (
        <div className="border-t border-border bg-secondary/40 px-4 py-3">
          <p className="text-small text-foreground">
            The concierge is resting.
          </p>
          <p className="mt-1 text-caption text-muted-foreground">
            Call or text{" "}
            <a
              href={CONTACT.phoneHref}
              className="underline underline-offset-2 hover:text-foreground"
            >
              {CONTACT.phone}
            </a>
            , message us on{" "}
            <a
              href={CONTACT.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Facebook
            </a>
            , or{" "}
            <a
              href="/contacts"
              className="underline underline-offset-2 hover:text-foreground"
            >
              book a viewing
            </a>
            .
          </p>
        </div>
      )}
      {status === "rate-limited" && (
        <p className="border-t border-border px-4 py-2.5 text-caption text-muted-foreground">
          A moment, please — you're sending messages quickly.
        </p>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        className="flex items-center gap-2 border-t border-border p-3"
      >
        <label htmlFor={`${panelId}-input`} className="sr-only">
          Message the concierge
        </label>
        <Input
          ref={inputRef}
          id={`${panelId}-input`}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          maxLength={2000}
          autoComplete="off"
          placeholder="Ask about the residences…"
          className="h-11 flex-1 text-small md:text-small"
        />
        <Button
          type="submit"
          size="icon"
          aria-label="Send message"
          disabled={!input.trim() || status === "streaming"}
          className="size-11"
        >
          <Send className="size-4" aria-hidden />
        </Button>
      </form>

      <p className="border-t border-border px-4 py-2.5 text-center text-caption text-muted-foreground">
        Automated concierge — for anything final, talk to our team.
      </p>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {status === "error"
          ? "The concierge is unavailable. Contact details are shown in the chat."
          : announcement}
      </div>
    </div>
  );
}
