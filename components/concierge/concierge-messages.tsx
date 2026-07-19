"use client";

import { useEffect, useRef } from "react";

import type {
  ConciergeMessage,
  ConciergeStatus,
} from "@/components/concierge/use-concierge-chat";
import { CONTACT } from "@/lib/site";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "Tell me about the 1- and 2-bedroom lofts",
  "What's nearby in Pasay?",
  "How do I book a viewing?",
];

// One capturing group so split() alternates plain text / matched link:
// URLs, emails, and PH mobile numbers (09XX XXX XXXX) as the model writes them.
const LINK_PATTERN =
  /(https?:\/\/[^\s<>()]+[^\s<>().,!?;:'"]|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|\b09\d{2}[ -]?\d{3}[ -]?\d{4}\b)/g;

function hrefFor(link: string): string {
  if (link.startsWith("http")) return link;
  if (link.includes("@")) return `mailto:${link}`;
  return `tel:+63${link.replace(/\D/g, "").slice(1)}`;
}

/** Renders bare URLs / emails / phone numbers in a reply as clickable links. */
function LinkifiedText({ content }: { content: string }) {
  const parts = content.split(LINK_PATTERN);
  return (
    <>
      {parts.map((part, index) => {
        // Stable enough: transcript text is append-only, never reordered.
        const key = `${index}-${part.slice(0, 12)}`;
        if (index % 2 === 0) return <span key={key}>{part}</span>;
        const external = part.startsWith("http");
        return (
          <a
            key={key}
            href={hrefFor(part)}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="underline underline-offset-2 hover:opacity-75"
          >
            {part}
          </a>
        );
      })}
    </>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 px-1 py-1" aria-hidden>
      <span className="size-1.5 rounded-full bg-gold motion-safe:animate-pulse" />
      <span className="size-1.5 rounded-full bg-gold motion-safe:animate-pulse motion-safe:[animation-delay:150ms]" />
      <span className="size-1.5 rounded-full bg-gold motion-safe:animate-pulse motion-safe:[animation-delay:300ms]" />
    </span>
  );
}

type ConciergeMessagesProps = {
  messages: ConciergeMessage[];
  status: ConciergeStatus;
  onSuggestion: (text: string) => void;
};

export function ConciergeMessages({
  messages,
  status,
  onSuggestion,
}: ConciergeMessagesProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);

  // Follow the stream only while the reader is already at the bottom —
  // never fight an upward scroll.
  useEffect(() => {
    const list = listRef.current;
    if (!list || messages.length === 0) return;
    if (stickToBottom.current) {
      list.scrollTop = list.scrollHeight;
    }
  }, [messages]);

  const lastMessage = messages.at(-1);
  const awaitingFirstToken =
    status === "streaming" &&
    (lastMessage?.role !== "assistant" || lastMessage.content === "");

  return (
    <div
      ref={listRef}
      onScroll={() => {
        const list = listRef.current;
        if (!list) return;
        stickToBottom.current =
          list.scrollHeight - list.scrollTop - list.clientHeight < 80;
      }}
      data-lenis-prevent
      // biome-ignore lint/a11y/noNoninteractiveTabindex: scrollable region must be keyboard-reachable to scroll
      tabIndex={0}
      role="log"
      aria-label="Conversation"
      className="flex-1 space-y-3 overflow-x-hidden overflow-y-auto scroll-pt-4 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/40"
    >
      {messages.length === 0 && (
        <div className="flex h-full flex-col justify-end gap-5">
          <div>
            <p className="text-small text-foreground">
              Good day! I'm the Aleevia Carter concierge. Ask me about the
              homes, the neighbourhood, financing, or booking a viewing.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onSuggestion(suggestion)}
                className="rounded-sm border border-border bg-card px-3 py-2 text-left text-caption text-foreground/80 transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:translate-y-px"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.map((message) =>
        message.role === "assistant" && message.content === "" ? null : (
          <div
            key={message.id}
            className={cn(
              "flex flex-col",
              message.role === "user" ? "items-end" : "items-start",
            )}
          >
            <div
              className={cn(
                "max-w-[85%] whitespace-pre-wrap rounded-sm px-3.5 py-2.5 text-small leading-relaxed break-words [overflow-wrap:anywhere]",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground",
              )}
            >
              {message.role === "assistant" ? (
                <LinkifiedText content={message.content} />
              ) : (
                message.content
              )}
            </div>
            {message.state === "interrupted" && (
              <p className="mt-1.5 text-caption text-muted-foreground">
                Connection dropped — try again, or call{" "}
                <a
                  href={CONTACT.phoneHref}
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  {CONTACT.phone}
                </a>
                .
              </p>
            )}
          </div>
        ),
      )}

      {awaitingFirstToken && (
        <div className="flex items-start">
          <div className="rounded-sm bg-secondary px-3.5 py-2.5">
            <TypingDots />
          </div>
        </div>
      )}
    </div>
  );
}
