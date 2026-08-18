# Aleevia Testimonials — Next.js Landing Integration Guide

Read-only contract for the **testimonials section** on the Aleevia Carter
Residences landing site. Everything the Next.js site needs is here — you do
**not** need to read the backend source.

**Scope:** replace the hardcoded testimonial cards with content the client edits
in the CMS. Authoring is out of scope; the landing site only reads **published**
quotes.

> **One endpoint, one type, no auth.** If this guide feels short, that is the
> feature. The interesting decisions were made server-side so this section stays
> a `map()` over an array.

---

## 1. Base URL & conventions

| Env | API base |
|---|---|
| Local | `http://localhost:8000/api/v1` |
| Production | `https://api.aleeviacarterresidences.com/api/v1` |

Put it in `NEXT_PUBLIC_API_BASE_URL` — the same variable the blog already uses.

- The endpoint is a **public `GET`**. No auth header, no cookie, no API key.
- IDs are UUID strings.
- Rate limit is 100 requests/min per IP. Fetch this once per render, server-side;
  do not call it from the browser on scroll.

---

## 2. Response envelope — read this first

**Every** successful response is wrapped by the API:

```json
{ "statusCode": 200, "message": "Success", "data": "<payload>" }
```

So always read `json.data`. Unlike `GET /posts`, this endpoint is **not**
paginated — `data` is the array itself, so there is no `data.data` here.

**Error shape** (any 4xx/5xx) — note errors are **not** enveloped:

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error",
  "path": "/api/v1/testimonials",
  "timestamp": "2026-08-17T09:00:00.000Z"
}
```

---

## 3. The endpoint

### `GET /testimonials`

Returns every **published** testimonial, newest first (`createdAt` descending).
Drafts are never included. Takes **no query parameters** — extras are ignored,
not rejected.

**Payload:** `Testimonial[]`

```ts
export type Testimonial = {
  id: string;
  quote: string;              // PLAIN TEXT — not Markdown, not HTML
  authorName: string;
  authorTitle: string | null; // role / employer / publication, or null
};
```

That is the entire public shape. There is deliberately no `status`, no
`createdAt`, no portrait URL and no rating — see [§6](#6-fields-that-do-not-exist).

**Example** — `GET /api/v1/testimonials`:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": "00000000-0000-4000-8000-000000000002",
      "quote": "The mezzanine changes everything. Natural light pours down through the loft and the living area becomes somewhere you actually want to spend your evenings.",
      "authorName": "Maria Santos",
      "authorTitle": "Architectural Digest PH"
    }
  ]
}
```

---

## 4. Two distinct empty cases

Keep these apart — they want opposite handling.

| Case | What you get | What to render |
|---|---|---|
| Nothing published | `data: []` — a **normal, deliberate** state | **Collapse the section entirely.** No heading, no empty frame, no "no testimonials yet" copy. |
| Request failed | a thrown error / non-200 | Fall back to a hardcoded quote, or collapse. Never let it break the page. |

An empty array means the client has intentionally cleared the section. A failure
means the API is unreachable. The first is content; the second is an outage.

Because the whole section can legitimately vanish, **do not let the surrounding
layout depend on it existing** — no fixed heights, no margin that only looks
right when a card is present.

---

## 5. Rendering the quote

- **`quote` is plain text.** Not Markdown, not HTML. Render it as a text node.
  Do **not** reach for `dangerouslySetInnerHTML` or the Markdown pipeline the blog
  body uses — there is nothing to parse, and doing so would add an XSS surface
  where none exists.
- The API stores it trimmed, and rejects whitespace-only and empty quotes, so you
  never need to guard against a blank card.
- Max length is **500 characters**, but the CMS is guided toward ~200–300. Design
  the card to survive 500 without breaking, then stop worrying about it.
- **`authorTitle` is nullable.** When `null`, collapse that line — do not render
  an empty element, a dash, or "—". The gap is visible.
- `authorName` is always present and non-empty.

```tsx
// components/sections/testimonials.tsx
export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null; // §4 — collapse, do not render a frame

  return (
    <section aria-labelledby="testimonials-heading">
      <h2 id="testimonials-heading">What people say</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <blockquote>
              <p>{item.quote}</p>
            </blockquote>
            <cite>
              <span>{item.authorName}</span>
              {item.authorTitle && <span>{item.authorTitle}</span>}
            </cite>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

Use real `<blockquote>` and `<cite>` elements. The decorative `❞` glyph in the
design is presentational — keep it out of the accessibility tree
(`aria-hidden="true"` or a CSS pseudo-element).

### Ordering and how many to show

The array arrives **newest first**, and that is the only ordering the API offers
— there is no `displayOrder` field and no sort parameter. The client controls
prominence by retiring stale quotes, not by numbering them.

If the section should show fewer than all of them, **slice on the client**:

```ts
const featured = testimonials.slice(0, 3); // the three most recent
```

Do not add a `?limit=` param to the request — the API does not read one, and
adding one to the URL will be silently ignored rather than erroring, which is the
worst of both worlds.

---

## 6. Fields that do not exist

Asked and answered server-side, so nobody has to design around them:

| Not in the payload | Why |
|---|---|
| Author photo / avatar | The card is typographic by design. There is no upload for it and no column to store it. |
| Star rating | Not part of the design, so not part of the schema. |
| Date | The card shows no date, so the API does not publish one. |
| `status` | The endpoint already returns published rows only. Filtering again client-side would be a second copy of one rule. |
| `displayOrder` | Deliberately rejected — see "Ordering" above. |

If the design later needs one of these, it is a backend change first. Do not
approximate it client-side.

---

## 7. Fetching

Server component, cached the same way as the announcement strip:

```ts
// lib/testimonials.ts
import type { Testimonial } from '@/types/testimonial';

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await fetch(`${BASE}/testimonials`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`testimonials ${res.status}`);

    const json = (await res.json()) as { data: Testimonial[] };
    return Array.isArray(json.data) ? json.data : [];
  } catch {
    // A failed fetch must not take the page down. An empty array collapses the
    // section, which is the same outcome as the client having cleared it.
    return [];
  }
}
```

```tsx
// app/page.tsx
const testimonials = await getTestimonials();
// ...
<Testimonials items={testimonials.slice(0, 3)} />
```

**Caching.** `revalidate: 300` (5 minutes) is the right trade here — testimonials
change far less often than the announcement strip, which sits at 60s. If the
homepage is already ISR because of the announcement bar, this adds no new cost.

**Guard the shape, not just the status.** `Array.isArray(json.data)` is doing real
work: it turns a malformed or proxied response into an empty section instead of a
`map is not a function` crash on the homepage.

---

## 8. Migrating off the hardcoded section

1. The quote currently in the design ("The mezzanine changes everything…", Maria
   Santos, Architectural Digest PH) is **already seeded** in the API as a
   published row, so wiring this up does not empty the section.
2. **If the landing site has other hardcoded quotes**, tell the backend owner
   before you delete them — they need adding to `prisma/seed-content.ts` or they
   are lost. Do not assume the API has them.
3. Delete the hardcoded array only after `GET /testimonials` returns what you
   expect in the target environment.
4. Keep one hardcoded quote as the catch fallback **only if** the section is
   considered conversion-critical. Otherwise collapsing is cleaner — unlike the
   announcement bar, an absent testimonial section is not a visible defect.

---

## 9. Definition of done

- [ ] `NEXT_PUBLIC_API_BASE_URL` resolves in dev and prod
- [ ] Section renders from `GET /testimonials`; no hardcoded quotes remain
- [ ] `data: []` collapses the section cleanly — no heading, no empty frame, no layout gap
- [ ] A failed/500 fetch does not break the page
- [ ] `authorTitle: null` collapses its line rather than rendering an empty node
- [ ] A 500-character quote does not break the card
- [ ] Quote is rendered as text — no `dangerouslySetInnerHTML` anywhere in this section
- [ ] Semantic `<blockquote>`/`<cite>`; decorative quote glyph hidden from screen readers
- [ ] `next build` passes

---

## Quick reference

| Method | Path | Auth | Returns |
|---|---|---|---|
| `GET` | `/testimonials` | none | `Testimonial[]` — published, newest first, possibly `[]` |

Wrapped in `{ statusCode, message, data }`. Not paginated.

---

## Related

- `docs/guides/blog-frontend-guide.md` — the public blog + announcement strip
  contract for this same site, including the shared envelope and error shapes.
- `docs/guides/testimonials-cms-guide.md` — the admin side, if you need to see
  how a quote gets created in the first place.
