# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People considering Aleevia Carter Residences — a seven-storey residence on E. Rodriguez Street in Pasay City — as a place to live. Most are looking to own one of the one- or two-bedroom loft homes (a limited number are open to rent), helped along by Pag-IBIG or bank financing. They arrive curious rather than committed: browsing on a phone during downtime, comparing a few options, picturing whether they could see themselves here. The audience is broad and spans ages, so the site cannot assume sharp eyes, fast connections, or familiarity with property jargon.

Their job is simple: understand what living here is like and, if it appeals, reach out without friction. They are not signing anything on the site. They want to feel welcomed, not sold to.

Investors are not an audience for this site. Sales-channel blasts pitch the units to "end-users and investors"; that framing belongs to those channels and must not shape the site's copy, structure, or claims.

## Product Purpose

Aleevia Carter Residences is the marketing site for a boutique residential building in Pasay City, developed by Aleevia Carter Development Corporation. It exists to turn casual interest into inquiries: communicate what the place feels like to live in, then make it effortless to ask for more. Success is measured in the volume of qualified viewing inquiries (a booked tour, a call, a message) submitted through the site, so the path from "this looks nice" to "I booked a viewing" should be short, obvious, and available from anywhere on the page.

## Positioning

The differentiator is **specified Japandi interior design** — not a styling layer applied to a generic condo shell, but the building's design DNA, documented unit by unit in the brochure: warm wood accents, sage-walled studies, stone-textured baths, hidden kitchen cabinetry that blends into the walls, organic textures and refined craftsmanship shared across both the 40sqm and 60sqm footprints. A neighboring Pasay development can match the address, the transit access, or the unit count; it cannot truthfully claim this interior program.

Scale, layout, and location are real supporting facts, not the claim. Lead with the design; let the rest corroborate.

## Operating Context

- **The viewing is the conversion event.** A finished model unit is ready to walk. The rest of the building is still in progress, so a viewing means the model unit — not a tour of the buyer's future home, and not a hard-hat site walk.
- **Booking runs on Google Calendar Appointment Scheduling** (30-minute slots, Asia/Manila, Google Meet link attached to every confirmed booking), embedded on `/contacts` and configured via `NEXT_PUBLIC_BOOKING_EMBED_URL`.
- **The human on the other end is Analiza Diaz** — phone `0943 705 5099`, email `diazanne1628@gmail.com`, reachable 7 AM – 4 PM Monday to Saturday. Facebook messages are answered around the clock, and Facebook is in practice a primary inbound channel for this audience.
- **Buyers arrive needing financing.** Pag-IBIG and bank loans are how most of this audience buys, which is why the site carries a Pag-IBIG affordability calculator and Chinabank eligibility/requirements content as first-class routes rather than a footnote.
- **The brochure (`/public/brochure.pdf`) is the project's own document** and the origin of every published fact. `lib/site.ts` is its machine-readable form.
- **An AI concierge and a blog run off a separate backend** (`aleevia-be`), so parts of the experience appear or degrade based on deployment state rather than on user action.

## Capabilities and Constraints

- **Stack:** Next.js 16 (App Router, React 19), Tailwind v4, shadcn on base-ui primitives, `motion` and `lenis` for motion, embla for carousels, biome for lint/format, bun as package manager. Deployed on Vercel.
- **The building:** seven storeys at 614 E. Rodriguez St., Pasay City. 85 units across floors 3–7, each floor 1-bedroom (40sqm) and 2-bedroom (60sqm) loft homes with mezzanines; 38 parking slots on the ground and second floors. Amenities: gym, laundry suite, roof-deck lounge, rooftop multi-purpose court, reception/admin office.
- **Env-gated features, by design:** with `NEXT_PUBLIC_API_BASE_URL` unset, the concierge falls back to a passive presence badge and the blog has no posts — nothing breaks, the feature simply isn't there. Any work touching these must keep the unconfigured path intact.
- **Facts have one source.** Contact details, hours, legal registration, and project figures live in `lib/site.ts`, drawn from the brochure. Never hardcode them into components, and never publish a figure the brochure does not contain.
- **`NEXT_PUBLIC_*` values are inlined at build time** — changing them in Vercel requires a redeploy, not just a save.
- **Undecided / not yet supplied:** the 2-bedroom (60sqm) price, the turnover date, and whether additional bank partners beyond Chinabank will be added. The 1-bedroom price is confirmed — see Evidence on Hand.

## Brand Personality

Warm. Welcoming. Human.

The voice of a good host, not a salesperson. It invites people in, speaks plainly, and makes the next step feel natural. Inviting over impressive; clear over clever. Confidence comes from making people feel at home, never from flexing.

## Brand Commitments

- **Name:** Aleevia Carter Residences (short form "Aleevia Carter"). Developed by Aleevia Carter Development Corporation. The brochure's OCR renders it "Allevia" in places — that is a scanning artifact, not an alternate spelling.
- **Tagline:** "Your Haven in the Heart of the City." Subtitle: "A home built for a life without limits."
- **Domain:** `aleeviacarterresidences.com`.
- **Legal, required on the site:** DHSUD Certificate of Registration No. 0001076, License to Sell No. 0001215, issued January 8, 2026.
- **Assets:** logo at `public/assets/brandlogo.png` (raster only — no SVG has been supplied, so structured data and icon sets fall back to photography).
- **Official social:** one Facebook page. No Instagram, TikTok, or YouTube presence has been confirmed; do not link or imply others.

## Anti-references

- **Generic SaaS / proptech.** Gradient hero, geometric sans, friendly-app voice, the hero-metric template, Poppins-and-pastels. Looks like software, not a home.
- **Listings-portal grammar.** Zillow / Apartments.com density: filter rails, repeated card grids, price tags everywhere, clutter. This site is a feeling, not a database.
- **Luxury-flex.** Gold-on-black, oversized "INVEST NOW" CTAs, gradient text, opulent excess. Cold and exclusionary; the opposite of welcoming.
- **Corporate sterile.** Stock-photo handshakes, navy-and-gray palettes, lifeless enterprise templates. No warmth, no life.

## Evidence on Hand

**Real, usable:**
- The official brochure — `public/brochure.pdf`, transcribed at `docs/brochure.md`. Source of truth for every published fact.
- Architectural renders of interiors (`public/assets/interiors/`, units 1 and 7, hallway, reception lounge), amenities (`public/assets/amenities/`), exterior, floor plans, and location map. These are **renders, not photographs**.
- Verified nearby-landmark distances and drive times (supermarkets, malls, hospitals, schools, churches) from the brochure's location pages.
- Legal registration and license-to-sell numbers.
- A finished model unit that can be walked in person.

**Pricing — 1-bedroom (40sqm) only:**
- **Total Contract Price ₱6,500,000.** The durable figure, and the only price the site may state.
- A **2% discount (₱130,000, netting ₱6,370,000)** exists as a **sales-channel promotion, not a standing term**. It is undated and can be withdrawn. Do not publish it, and do not present ₱6,370,000 as what the unit costs.
- **Reservation fee ₱20,000, non-refundable.** Wherever the fee appears, the non-refundable condition appears with it.
- Payment terms are described as flexible. No schedule, downpayment percentage, or interest terms have been supplied, so none may be stated.
- No **2-bedroom (60sqm)** price exists. Do not derive one by scaling the 1-bedroom figure or by rate-per-sqm.
- Not yet in the codebase. Add to `lib/site.ts` before any component renders it; never hardcode into a section.

**Do not fabricate — these do not exist:**
- **Photography of finished spaces.** Everything shipped is a render. Do not describe imagery as a photo, and do not caption a render as if it were shot on site.
- **Resident testimonials and the resident video.** `components/sections/testimonials.tsx` carries invented names ("Jonathan Pierce", "Samantha Hayes", "David Lim") and an unrelated stock YouTube reel. No resident quote has ever been collected. The owner has decided to keep the section live in the meantime; that decision does not make its contents real. Do not extend it, add names, write new quotes, or cite it as proof anywhere else on the site. When real quotes arrive they replace the set outright.
- **A turnover or move-in date.** None has been committed to publicly.
- **Occupancy, sales velocity, unit-sold counts, awards, or press.** No such evidence has been provided.

## Product Principles

1. **Warmth is the strategy.** Every choice should make a stranger feel invited. If an element reads as cold, corporate, or transactional, soften it or cut it.
2. **Make it easy to say yes.** The goal is inquiries, so a low-friction way to reach out is never more than a glance away. Reduce steps, reduce jargon, reduce hesitation.
3. **Show the life, not the listing.** Lead with what living here feels like, not with specs, filters, or price tags. Avoid portal density.
4. **Plain and human.** Clear, welcoming language over marketing polish. If a sentence could come from any property site, rewrite it.
5. **Built for everyone.** A broad, age-spanning audience means nothing should require sharp eyes, fast hands, or a fast connection.

## Accessibility & Inclusion

WCAG 2.1 AA as the floor, with extra care for an older and broad audience. Comfortable base type size, generous line-height, and large tap targets so nothing requires precise input or sharp eyesight. Verified contrast against the warm background palette. Motion respects `prefers-reduced-motion`. Forms and inquiry flows are fully keyboard-navigable with clear labels and error messages.
