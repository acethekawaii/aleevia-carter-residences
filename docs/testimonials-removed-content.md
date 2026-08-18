# Testimonials — content removed when the section was wired to the API

Inventory of everything that was hardcoded in `components/sections/testimonials.tsx`
before it started reading `GET /testimonials`. Recorded per
`testimonials-landing-guide.md` §8.2: anything the landing site had but the API
does not is lost otherwise.

Captured from commit `24f3387`, 2026-08-18.

---

## ⚠️ Read this before seeding any of it

`PRODUCT.md` line 86 is explicit: **these testimonials are invented.**

> **Resident testimonials and the resident video.** `components/sections/testimonials.tsx`
> carries invented names ("Jonathan Pierce", "Samantha Hayes", "David Lim") and an
> unrelated stock YouTube reel. No resident quote has ever been collected. […]
> Do not extend it, add names, write new quotes, or cite it as proof anywhere else
> on the site. When real quotes arrive they replace the set outright.

So this file is an **archive, not a seeding backlog**. Copying these rows into
`prisma/seed-content.ts` would move fabricated quotes from a placeholder in the
codebase into the CMS, where they read as client-approved published content —
strictly worse than where they were. Seed them only if the owner confirms a real
person actually said the words and consented to attribution.

---

## Text quote (had quote copy)

### Samantha Hayes

| Field | Value |
|---|---|
| `quote` | The full text below |
| `authorName` | `Samantha Hayes` |
| `authorTitle` | `One-bedroom resident` |

> It feels less like a unit and more like a home that was thought through. The
> light, the wood, the way the loft is laid out — every corner has a reason to be
> there.

---

## Video cards (no quote copy existed)

Both were removed with the video treatment. They carried an author, a role and a
video title — **never a quote** — so neither maps onto the `Testimonial` shape,
which is `{ id, quote, authorName, authorTitle }` and has no video field. Adding
them to the API would require writing quotes that nobody has said.

### Jonathan Pierce

| Field | Value |
|---|---|
| Label | `Homeowner Story` |
| Video title | `Why we chose Aleevia Carter` |
| Author | `Jonathan Pierce` |
| Role | `Two-bedroom resident` |

### David Lim

| Field | Value |
|---|---|
| Label | `Design Walkthrough` |
| Video title | `A closer look inside` |
| Author | `David Lim` |
| Role | `Interior Design Weekly` |

**The video itself:** YouTube id `Obaq2ddTYRs`, used for both cards. Stock reel,
unrelated to the project — nothing to preserve. The embed, the thumbnail `<img>`
and the play button were deleted with the section rewrite.

---

## Already on the backend — no action

### Maria Santos

Seeded as a published row per `testimonials-landing-guide.md` §8.1, so it needs
no migration. Kept here only so the before/after set is complete.

| Field | Value |
|---|---|
| `authorName` | `Maria Santos` |
| `authorTitle` | `Architectural Digest PH` |

> The mezzanine changes everything. Natural light pours down through the loft and
> the living area becomes somewhere you actually want to spend your evenings.

Note that `PRODUCT.md` does not name Maria Santos among the invented three, but it
does state that no resident quote has ever been collected. Whether this
publication attribution is real is a question for the owner, not something the
landing site can settle — and it is already live in the CMS either way.
