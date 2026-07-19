# Concierge Chat — Frontend Plan

Turns the display-only concierge badge (`components/concierge-chat.tsx`) into a working AI concierge widget. Backend: `aleevia-be` `POST /api/v1/concierge/chat` (see `aleevia-be/docs/concierge-backend-plan.md` for the API's internals, deploy runbook, and knowledge-base operations).

## UX goals

- Feels native to the site: emerald/gold voice, Spectral/Albert Sans, "Gentle Arrival" motion (ease `[0.22,1,0.36,1]`, no bounce), 4px controls / 6px panels.
- Instant perceived response: tokens render as they stream; typing indicator before first token.
- Never a dead end: every failure state routes to a human (Analiza's phone, Facebook, `/contacts`).
- Zero-risk rollout: with `NEXT_PUBLIC_API_BASE_URL` unset the widget renders the current passive badge, unchanged.
- DESIGN.md compliance: no second competing emerald CTA (the badge is the already-sanctioned emerald element; the panel surface is card/cream), shadows only as response to state, reduced-motion honored everywhere.

## Config

`lib/site.ts` (same pattern as `BOOKING`):

```ts
const CONCIERGE_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const CONCIERGE = {
  apiUrl: CONCIERGE_API_BASE_URL,
  chatEndpoint: `${CONCIERGE_API_BASE_URL}/concierge/chat`,
  isConfigured: CONCIERGE_API_BASE_URL.startsWith("http"),
} as const;
```

Also in this change: `SITE.url` fallback corrected to `https://aleeviacarterresidences.com` (confirmed final domain).

| Environment | `NEXT_PUBLIC_API_BASE_URL` | Effect |
|---|---|---|
| local dev | `http://localhost:8000/api/v1` via `.env.local` (gitignored) — same aleevia-be instance as the blog API | widget live against local BE |
| Vercel Production | `https://api.aleeviacarterresidences.com/api/v1` (Settings → Env Vars; **redeploy required** — NEXT_PUBLIC_* is inlined at build) | widget live |
| unset (previews, forgotten env) | — | passive badge, exactly today's behavior |

HTTPS is mandatory in prod (site is HTTPS → http API = mixed-content block). Browser calls the VPS directly; Vercel serverless is not involved.

## Files

| File | Purpose |
|---|---|
| `components/concierge/concierge-chat.tsx` | entry, keeps export name `ConciergeChat`; unconfigured → passive badge verbatim; else FAB + `AnimatePresence` panel + focus return |
| `components/concierge/concierge-panel.tsx` | dialog surface: emerald header, messages region, suggestion chips, input row, disclaimer, error/rate-limit states |
| `components/concierge/concierge-messages.tsx` | scrollable list (`data-lenis-prevent`), bubbles, near-bottom autoscroll, typing indicator, hidden live region |
| `components/concierge/use-concierge-chat.ts` | transcript state machine + streaming fetch + sessionStorage |

Modified: `lib/site.ts` (above) · `app/layout.tsx` (import path only). Deleted: `components/concierge-chat.tsx` (moved into folder).

Reused: `components/ui/button.tsx` (send: `size="icon"`), `components/ui/input.tsx` (h-11 override), `lib/utils.ts` `cn()`, `CONTACT`/`PRIMARY_CTA` from `lib/site.ts`, motion idioms from `scroll-to-top.tsx`/`navbar`.

## Hook design (`use-concierge-chat.ts`)

```ts
type ConciergeMessage = {
  id: string;                              // crypto.randomUUID()
  role: "user" | "assistant";
  content: string;
  state: "done" | "streaming" | "interrupted";
};
type ConciergeStatus = "idle" | "streaming" | "error" | "rate-limited";
```

- `send(text)` — no-op while `streaming` (concurrency guard). Appends user msg, POSTs last 12 messages `{ role, content }`, then:
  - `!res.ok`: `429 → "rate-limited"` (gentle inline notice, input preserved) · anything else → `"error"` (fallback card). Defensive body parse (`try res.json() catch {}` — proxy may return HTML).
  - stream: `res.body.getReader()` + `TextDecoder(..., { stream: true })`, append per chunk to a draft assistant message (setState per chunk; React batches).
  - clean end → finalize `done`, persist, announce via live region.
  - `read()` rejects: partial text → keep, mark `interrupted`, inline contact note; no text → `"error"`.
- AbortController in a ref; aborted on unmount only. Closing the panel does NOT abort — the reply finishes in the background, transcript intact on reopen. Tab close aborts natively → BE cancels the DeepSeek request.
- sessionStorage key `acr-concierge-v1`; write on finalize only (never per token); lazy-init restore; try/catch both directions (Safari private mode → memory-only).
- Input cap 2000 chars (mirrors API DTO); server 400 is the backstop.

## API contract (reference)

`POST {CONCIERGE.chatEndpoint}` with `{ messages: [{ role: 'user'|'assistant', content: string }] }` (1–24 items, content ≤ 2000 chars, last must be `user`). Success = `200` streaming plain-text chunks (raw assistant text, no framing). Errors = JSON `{ statusCode, message, ... }`: 400 validation · 429 throttle (10/min/IP) · 502 model unavailable · 503 knowledge base empty. Mid-stream death = socket abort → reader rejects (partial kept).

## Visual spec

- **FAB**: current badge becomes `motion.button` — same emerald surface, gold `MessageCircle` + ping dot, `shadow-lg shadow-emerald/30 ring-1 ring-gold/30`, `rounded-sm`, `fixed bottom-5 right-5 z-40 sm:bottom-7 sm:right-7`, same 1.1s-delay entrance. Removes `aria-hidden`/`pointer-events-none`/`select-none`. Open state: icon swaps to `X`, label to "Close". Height stays ≤ 48px so `ScrollToTop` (`bottom-[5.75rem] z-40`) still clears it.
- **Panel**: `fixed z-50 right-5 sm:right-7 bottom-[5.5rem] sm:bottom-[6.75rem] w-[min(24rem,calc(100vw-2.5rem))] h-[min(32rem,calc(100dvh-8rem))] flex flex-col overflow-hidden rounded-md border border-border bg-card shadow-xl shadow-emerald/10`. Covers ScrollToTop while open (acceptable — it occupies that corner); skip-link stays above at `z-[60]`. Non-modal: no backdrop, page stays usable.
- **Header**: emerald band (`bg-emerald text-emerald-foreground`), gold status dot, "Concierge" in `text-caption uppercase tracking-label`, subline "Aleevia Carter Residences", ghost close button.
- **Bubbles**: user `bg-primary text-primary-foreground` right-aligned · assistant `bg-secondary text-secondary-foreground` left · both `rounded-sm text-small max-w-[85%] whitespace-pre-wrap break-words [overflow-wrap:anywhere]` (long URLs wrap instead of overflowing). Assistant replies are linkified: bare URLs open in a new tab, `09XX XXX XXXX` numbers become `tel:+63…`, emails become `mailto:` — the model writes plain text; the client renders the anchors.
- **Typing indicator**: three pulsing gold dots while streaming with empty draft; static under reduced motion.
- **Suggestion chips** (empty transcript only): "Tell me about the 1- and 2-bedroom lofts" · "What's nearby in Pasay?" · "How do I book a viewing?" — tap sends immediately.
- **Input row**: `ui/Input` with `h-11 text-small` override (44px touch target) + `ui/Button size="icon"` send (`SendHorizonal`, `aria-label="Send message"`), native `<form onSubmit>`, Enter sends, disabled while streaming/empty, `maxLength=2000`.
- **Disclaimer** under input, `text-caption text-muted-foreground`: "Automated concierge — answers may be imperfect. For anything final, talk to our team."
- **Error card** (`status === "error"`): "The concierge is resting." + tel link (`CONTACT.phoneHref`), Facebook link, `/contacts` CtaLink ("Book a viewing").
- **Rate-limit notice** (`"rate-limited"`): transient inline line "A moment, please — you're sending messages quickly."; input kept.
- **Motion**: panel enter `{opacity:0, y:12, scale:0.98} → {opacity:1, y:0, scale:1}` 0.3s ease `[0.22,1,0.36,1]`, exit mirrors, via `AnimatePresence`. Reduced motion: opacity-only (repo idiom), ping/typing dots static.

## Accessibility

1. FAB: `aria-expanded`, `aria-controls={panelId}`, dynamic `aria-label` ("Open concierge chat" / "Close concierge chat").
2. Panel: `role="dialog"` `aria-label="Aleevia Carter concierge chat"`, **non-modal** (no focus trap/backdrop — standard chat-widget semantics; DOM after `Footer` keeps natural tab order).
3. Open → focus input (`preventScroll`); Esc (panel `onKeyDown`), close button, or FAB toggle → focus returns to FAB.
4. One visually-hidden `aria-live="polite" aria-atomic="true"` region updated only when a reply completes (never per token); error/rate-limit notices announce there too.
5. Messages region: `tabIndex={0}` + `aria-label="Conversation"` so keyboard users can scroll it; **`data-lenis-prevent`** so Lenis (root smooth-scroll) doesn't swallow wheel events inside the panel.
6. Native `button`/`form`/`input` everywhere; icons `aria-hidden`; contrast pairs all AA per DESIGN.md.

## Edge cases

BE down/unreachable/CORS fail → fetch TypeError → error card · 429 → notice, input kept · mid-stream death → partial kept, marked interrupted + contact note · long paste → input maxLength + server 400 backstop · Enter-mash/concurrent send → guard no-op · panel close mid-stream → finishes in background · tab close mid-stream → abort propagates to BE (stops billing) · sessionStorage unavailable → memory-only · non-JSON error body → defensive parse · hydration-safe: FAB markup is state-independent; transcript renders only after open.

## Verification

1. Keyboard-only: Tab → FAB → Enter opens → focus in input → Tab reaches chips/send/close → Esc closes → focus back on FAB; messages scrollable focused.
2. Screen reader announces each completed reply once; FAB announces expanded state.
3. Reduced motion: opacity-only transitions, static dots, native scroll. Lenis ON: wheel scrolls the message list (`data-lenis-prevent`).
4. Unset `NEXT_PUBLIC_API_BASE_URL` + rebuild → passive badge identical to today.
5. Error card links work (tel:, Facebook, /contacts); 429 spam shows notice, input preserved.
6. Kill BE mid-answer → partial reply kept + contact note.
7. Transcript survives reload; fresh per tab; Safari private mode still chats.
8. 360px + desktop: panel clears FAB, ScrollToTop clears FAB when closed, skip-link above all.
9. `bun run lint` (biome) + `bun run build` clean.

## Rollout

Implement + verify locally against local BE → owner deploys BE (runbook in backend plan) → owner sets Vercel `NEXT_PUBLIC_API_BASE_URL` + redeploys → live E2E pass. Until the env flip, production shows the passive badge.

## Later (out of v1)

Retry button on interrupted replies · lead-capture form in chat · conversation analytics · WhatsApp/Messenger deep links · proactive greeting nudges.
