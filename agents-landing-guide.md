# Aleevia Agents — Next.js Landing Integration Guide

Read-only contract for the **Agents** page on the Aleevia Carter Residences
landing site. Everything the Next.js site needs is here — you do **not** need to
read the backend source.

**Scope:** a new `/agents` route (nav position: after **Blog**) listing the
brokers the client publishes from the CMS. Authoring is out of scope; the landing
site only reads **published** agents.

> **One endpoint, one type, no auth, no form.** Nothing on this page writes to the
> API. If a visitor wants to reach a broker they use the email or phone number on
> the row; if they want the building, `/contacts` already exists.

---

## Table of contents

1. [Base URL & conventions](#1-base-url--conventions)
2. [Response envelope](#2-response-envelope--read-this-first)
3. [The endpoint](#3-the-endpoint)
4. [Two distinct empty cases](#4-two-distinct-empty-cases)
5. [Rendering a row](#5-rendering-a-row)
6. [Search, filtering and ordering](#6-search-filtering-and-ordering)
7. [Fields that do not exist](#7-fields-that-do-not-exist)
8. [Fetching](#8-fetching)
9. [Images](#9-images)
10. [Definition of done](#10-definition-of-done)

---

## 1. Base URL & conventions

| Env | API base |
|---|---|
| Local | `http://localhost:8000/api/v1` |
| Production | `https://api.aleeviacarterresidences.com/api/v1` |

Put it in `NEXT_PUBLIC_API_BASE_URL` — the same variable the blog already uses.

- The endpoint is a **public `GET`**. No auth header, no cookie, no API key.
- IDs are UUID strings.
- Rate limit is 100 requests/min per IP. Fetch this **once per render,
  server-side**; do not call it from the browser on keystroke.
- **Packages:** none new. This is `fetch` + `next/image` + your existing UI
  primitives. No data-table library, no search library — see
  [§6](#6-search-filtering-and-ordering).

---

## 2. Response envelope — read this first

**Every** successful response is wrapped by the API:

```json
{ "statusCode": 200, "message": "Success", "data": "<payload>" }
```

So always read `json.data`. Like `GET /testimonials` and unlike `GET /posts`,
this endpoint is **not** paginated — `data` is the array itself, so there is no
`data.data` here.

**Error shape** (any 4xx/5xx) — note errors are **not** enveloped:

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error",
  "path": "/api/v1/agents",
  "timestamp": "2026-08-22T09:00:00.000Z"
}
```

---

## 3. The endpoint

### `GET /agents`

Returns every **published** agent, ordered alphabetically by first name (then
last name). Drafts are never included. Takes **no query parameters** — extras are
ignored, not rejected.

**Payload:** `Agent[]`

```ts
export type AgentRole = 'BROKER' | 'SALES_AGENT';

export type Agent = {
  id: string;
  firstName: string;
  lastName: string;
  role: AgentRole;
  licenseNumber: string | null;  // PRC licence, as printed on the ID
  email: string;                 // real address — put it in a mailto:
  contactNumber: string;         // exactly as typed — put it in a tel:
  photoUrl: string | null;       // absolute URL or /root-relative path
  city: string;
  country: string | null;        // usually null — see §5
};
```

That is the entire public shape. There is deliberately no `status`, no
timestamps, no bio and no slug — see [§7](#7-fields-that-do-not-exist).

**Example** — `GET /api/v1/agents`:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": "00000000-0000-4000-8000-000000000010",
      "firstName": "Jonathan",
      "lastName": "Weiss",
      "role": "BROKER",
      "licenseNumber": "REB 0012345",
      "email": "jonathan.weiss@aleevia.ph",
      "contactNumber": "0943 705 5099",
      "photoUrl": "https://cdn.aleeviacarterresidences.com/posts/2026/08/9f1e….jpg",
      "city": "Makati",
      "country": null
    },
    {
      "id": "00000000-0000-4000-8000-000000000011",
      "firstName": "Maria",
      "lastName": "Santos",
      "role": "SALES_AGENT",
      "licenseNumber": null,
      "email": "maria.santos@aleevia.ph",
      "contactNumber": "+63 917 555 0142",
      "photoUrl": null,
      "city": "Taguig",
      "country": null
    }
  ]
}
```

Note the second row: **no licence number and no photo.** Both are normal.

---

## 4. Two distinct empty cases

Keep these apart — they want opposite handling.

| Case | What you get | What to render |
|---|---|---|
| Nothing published | `data: []` | The page still exists (it is in the nav). Render the heading and a written empty state — *"Our agents will be listed here shortly. In the meantime, [get in touch](/contacts)."* |
| Request failed | a thrown error / non-200 | Same empty state, or a soft error. **Never** let it break the page. |

This differs from the testimonials section, which collapses entirely when empty.
`/agents` is a **route in the navigation** — a visitor who clicks it has to land
on something, so an empty page needs words and an alternative route to `/contacts`,
not a blank frame.

---

## 5. Rendering a row

The reference design is one line per agent: avatar · name · city chip · email
button · phone button. Adapt to the Aleevia design system; the data maps
one-to-one.

- **Name** is `firstName + ' ' + lastName`. Both are always present and non-empty.
- **`role`** is an enum, not display text. Map it:

  ```ts
  const ROLE_LABELS: Record<AgentRole, string> = {
    BROKER: 'Broker',
    SALES_AGENT: 'Sales Agent',
  };
  ```

  Never render the raw `SALES_AGENT`. Handle an unknown value by falling back to
  the empty string, not by crashing — a third role can ship server-side before
  this map is updated.
- **`licenseNumber` is nullable.** When present, render it as a small line under
  the name — `PRC ${licenseNumber}` or `Lic. ${licenseNumber}`. When `null`,
  **collapse the line**. Do not render a dash, "N/A", or an empty element.
- **`email` and `contactNumber` are real and meant to be used.** Wire them up:

  ```tsx
  <a href={`mailto:${agent.email}`}>Email</a>
  <a href={`tel:${agent.contactNumber.replace(/[^\d+]/g, '')}`}>Phone</a>
  ```

  Strip spaces and punctuation for the `tel:` href only — **display the original
  string**. It is stored exactly as the client typed it, in the format Filipino
  readers expect, and reformatting it in the browser undoes that on purpose.
- **`photoUrl` is nullable.** Fall back to initials in a circle, styled like the
  photo. Do not ship a stock silhouette — a monogram reads as deliberate, a grey
  avatar reads as broken.

  ```ts
  const initials = `${agent.firstName[0]}${agent.lastName[0]}`.toUpperCase();
  ```
- **`city` is always present; `country` is usually `null`.** Render
  `country ? `${city}, ${country}` : city`. The country appears only for an agent
  based abroad, which is the only case where it carries information.
- **Accessibility:** the row is a list item, not a table row, unless you genuinely
  build a table. Give each contact link an accessible name that includes the
  person — `aria-label={`Email ${agent.firstName} ${agent.lastName}`}` — or a
  screen-reader user hears "Email, Email, Email" down the whole list.

### A note on publishing contact details

This is the only endpoint in the API that puts a real personal email and mobile
number on an unauthenticated response, and it does so on purpose: a broker
directory whose brokers cannot be reached is a photo gallery. Scrapers will
harvest both. That is accepted and was decided server-side.

If harvesting later becomes a real complaint, **the fix belongs on this page** —
reveal-on-click, exactly like the reference design's "Email" / "Phone" buttons,
so the address is not in the initial HTML. It is not a schema change and not
obfuscation in the API, which would break `mailto:` and `tel:` for everybody.
Building the buttons as reveal-on-click from the start costs nothing and keeps
that option open.

---

## 6. Search, filtering and ordering

The reference design has a *"Search Name, Region, City"* input. **Do all of it in
the browser.**

The endpoint returns the whole published roster in one response — a curated
in-house broker list, in single or low double figures — so there is no `?q=`, no
`?city=` and no `?page=`. Adding one to the URL would be **silently ignored**
rather than erroring, which is the worst of both worlds.

```ts
const term = query.trim().toLowerCase();
const visible = term
  ? agents.filter(a =>
      `${a.firstName} ${a.lastName}`.toLowerCase().includes(term) ||
      a.city.toLowerCase().includes(term) ||
      (a.country ?? '').toLowerCase().includes(term))
  : agents;
```

Because the search runs over an array that is already in memory, the input needs
**no debounce and no loading state**. If you find yourself adding a spinner to
this, something has gone wrong.

**Ordering** is fixed: alphabetical by the name as displayed, first name then last
name. There is no sort parameter and no `displayOrder` field — the client controls
who appears by publishing and unpublishing, not by ranking. If the design offers a
list/grid toggle, that is presentation only; it must not re-sort.

---

## 7. Fields that do not exist

Asked and answered server-side, so nobody has to design around them:

| Not in the payload | Why |
|---|---|
| Bio / "about" | The directory is one line per person. There is no column and no CMS control. |
| Per-agent page / slug | This is one building. An agent profile would only repeat the row you clicked — the reference's "Profile & Listings ›" exists because that site sells many properties. |
| Listing count, sales figures | Nothing behind them. |
| Social / WhatsApp / Viber links | Considered and not built. Email and phone are the contract. |
| Years of experience, languages | Same. |
| `status` | The endpoint already returns published rows only. Filtering again client-side would be a second copy of one rule. |
| `displayOrder` | Deliberately rejected — see [§6](#6-search-filtering-and-ordering). |
| Timestamps | The row shows no date, so the API does not publish one. |

If the design later needs one of these, it is a backend change first. Do not
approximate it client-side.

---

## 8. Fetching

Server component, cached like the other CMS-owned content:

```ts
// lib/agents.ts
import type { Agent } from '@/types/agent';

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function getAgents(): Promise<Agent[]> {
  try {
    const res = await fetch(`${BASE}/agents`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`agents ${res.status}`);

    const json = (await res.json()) as { data: Agent[] };
    return Array.isArray(json.data) ? json.data : [];
  } catch {
    // A failed fetch must not take the page down. An empty array renders the
    // written empty state, which is the same outcome as nothing being published.
    return [];
  }
}
```

```tsx
// app/agents/page.tsx
export default async function AgentsPage() {
  const agents = await getAgents();
  return <AgentDirectory agents={agents} />;   // client component: search only
}
```

**Split the page.** The `page.tsx` fetches on the server; a small client component
owns the search input and filters the array it was handed. Do not make the whole
page a client component to get one input working — the roster should be in the
initial HTML for SEO and for a visitor with a slow connection.

**Caching.** `revalidate: 300` (5 minutes) matches testimonials. The roster changes
when somebody joins or leaves — rarely, and never urgently. If the client reports
"I published an agent and don't see them", that is this cache, and it clears
itself within five minutes.

**Guard the shape, not just the status.** `Array.isArray(json.data)` is doing real
work: it turns a malformed or proxied response into an empty state instead of a
`map is not a function` crash on a page that is in the main navigation.

### SEO

The page is worth indexing. Give it a real `metadata` export (title, description),
and consider one `ProfilePage`/`Person` JSON-LD block per agent if the client
cares about local search. Everything needed for `Person` is in the payload —
`name`, `email`, `telephone`, `image`, `jobTitle`, `address.addressLocality`.

---

## 9. Images

`photoUrl` is either an **absolute `https://` URL** (uploaded through the CMS to
Cloudflare R2) or a **root-relative path** like `/assets/agents/weiss.jpg` shipped
in this repo's `public/`.

If you render it through `next/image`, the R2 host **must** be in
`images.remotePatterns` in `next.config.ts`:

```ts
remotePatterns: [
  { protocol: 'https', hostname: 'cdn.aleeviacarterresidences.com' },
  // …whatever is already listed
],
```

An unlisted host fails with `Invalid src prop … hostname is not configured` in
dev and a `400` from `/_next/image` in production — and nothing warns upstream:
the API stores the URL happily and the CMS displays it fine. This is the same
trap that hit blog covers. If the hostname list is already correct for covers,
agent photos need nothing new.

Root-relative paths bypass all of this. A plain `<img>` also bypasses it, at the
cost of the optimizer.

Size the image for the row (a small circle, typically 40–56px) and pass explicit
`width`/`height` — headshots arrive at whatever size the client uploaded, up to
5 MB.

---

## 10. Definition of done

- [ ] `/agents` route exists and is in the main nav after **Blog**
- [ ] `NEXT_PUBLIC_API_BASE_URL` resolves in dev and prod
- [ ] Roster renders from `GET /agents`; nothing about agents is hardcoded
- [ ] `data: []` renders a written empty state with a link to `/contacts` — not a blank page
- [ ] A failed/500 fetch renders that same state instead of breaking the route
- [ ] `photoUrl: null` renders initials, not a broken image or a grey silhouette
- [ ] `licenseNumber: null` collapses its line — no dash, no "N/A"
- [ ] `country: null` renders the city alone, with no stray comma
- [ ] `role` renders as a label, never as `SALES_AGENT`
- [ ] `mailto:` and `tel:` links work on mobile; the displayed number is unmodified
- [ ] Contact links have accessible names that include the agent's name
- [ ] Search filters in memory, with no debounce, no spinner and no request
- [ ] The roster is in the server-rendered HTML (only the search input is client-side)
- [ ] R2 hostname is in `images.remotePatterns` if photos go through `next/image`
- [ ] `metadata` export is set for the page
- [ ] `next build` passes

---

## Quick reference

| Method | Path | Auth | Returns |
|---|---|---|---|
| `GET` | `/agents` | none | `Agent[]` — published, first name A→Z, possibly `[]` |

Wrapped in `{ statusCode, message, data }`. Not paginated. No query parameters.

---

## Related

- **The envelope and error shapes above are the same across this whole API.** The
  blog, the announcement strip and the `/contacts` form all use them, and the
  landing repo already has a working `lib/` fetcher for each. Copy the pattern
  from whichever is closest rather than inventing a new one — the landing
  codebase is the reference; there is no separate written contract for them any
  more.
- **`/contacts` already exists** and is the site's only inbound channel — it is
  the fallback this page's empty state points at. Do not build a second contact
  form here.
- `docs/guides/agents-cms-guide.md` — the admin side, if you need to see how an
  agent gets published in the first place.
