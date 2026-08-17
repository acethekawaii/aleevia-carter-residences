---
name: Aleevia Carter Residences
description: Warm, Japandi, unhurried marketing site that turns curiosity into viewing inquiries.
colors:
  background: "oklch(0.965 0.012 92)"
  foreground: "oklch(0.255 0.012 140)"
  card: "oklch(0.984 0.008 92)"
  card-foreground: "oklch(0.255 0.012 140)"
  popover: "oklch(0.984 0.008 92)"
  popover-foreground: "oklch(0.255 0.012 140)"
  primary: "oklch(0.42 0.058 162)"
  primary-foreground: "oklch(0.97 0.012 92)"
  secondary: "oklch(0.915 0.022 150)"
  secondary-foreground: "oklch(0.3 0.02 150)"
  muted: "oklch(0.925 0.016 132)"
  muted-foreground: "oklch(0.435 0.022 145)"
  accent: "oklch(0.915 0.02 146)"
  accent-foreground: "oklch(0.3 0.02 150)"
  gold: "oklch(0.72 0.105 86)"
  gold-foreground: "oklch(0.25 0.03 80)"
  sage: "oklch(0.55 0.046 150)"
  sage-foreground: "oklch(0.97 0.012 92)"
  emerald: "oklch(0.34 0.05 165)"
  emerald-foreground: "oklch(0.965 0.012 92)"
  destructive: "oklch(0.545 0.17 28)"
  destructive-foreground: "oklch(0.985 0.01 85)"
  border: "oklch(0.875 0.014 135)"
  input: "oklch(0.86 0.016 135)"
  ring: "oklch(0.42 0.058 162)"
typography:
  display:
    fontFamily: "Spectral, Georgia, serif"
    fontSize: "clamp(2.75rem, 5.5vw + 1rem, 6rem)"
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "-0.022em"
  headline:
    fontFamily: "Spectral, Georgia, serif"
    fontSize: "clamp(2.5rem, 5vw + 1rem, 5.75rem)"
    fontWeight: 300
    lineHeight: 1.04
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Spectral, Georgia, serif"
    fontSize: "clamp(2rem, 2.5vw + 1.25rem, 2.75rem)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-0.012em"
  body:
    fontFamily: "Albert Sans, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Albert Sans, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.16em"
rounded:
  control: "0.25rem"
  panel: "0.375rem"
  full: "9999px"
spacing:
  xs: "0.5rem"
  sm: "1rem"
  md: "1.5rem"
  lg: "2.5rem"
  xl: "4rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 1.75rem"
    height: "3rem"
  button-primary-hover:
    backgroundColor: "oklch(0.42 0.058 162 / 0.9)"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 1.75rem"
    height: "3rem"
  button-outline-hover:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.background}"
  button-outline-light:
    backgroundColor: "transparent"
    textColor: "{colors.emerald-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 1.75rem"
    height: "3rem"
  nav-item:
    textColor: "oklch(0.255 0.012 140 / 0.7)"
    typography: "{typography.label}"
    size: "0.75rem"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.control}"
    padding: "0.25rem 0.625rem"
    height: "2rem"
  concierge-fab:
    backgroundColor: "{colors.emerald}"
    textColor: "{colors.emerald-foreground}"
    rounded: "{rounded.control}"
    padding: "0.875rem 1.25rem"
  concierge-panel:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.panel}"
    width: "min(24rem, calc(100vw - 2.5rem))"
    height: "min(32rem, calc(100dvh - 8rem))"
---

# Design System: Aleevia Carter Residences

## Overview

**Creative North Star: "The Unhurried Welcome"**

This system feels like being shown around a beautiful home by someone who genuinely wants you to stay. It is **Japandi** — the calm meeting of Japanese restraint and Scandinavian warmth, drawn directly from the project's brochure: warm wood, organic textures, plaster-soft walls, and a spa-like quiet. Color is committed but never loud. A cream/marble canvas carries the page; **sage green** is the ambient brand voice; a single **deep-emerald** voice marks every place the visitor is invited to act; and a rare **brass-gold** (the brochure's logo metal) appears as a jewel accent, brightest on the dark sage and emerald surfaces.

It is built on shadcn (Tailwind v4, base-ui primitives). The semantic tokens in the frontmatter are the contract: components consume `primary`, `secondary`, `muted`, `accent`, `border`, and friends, plus three brand tokens — `gold`, `sage`, `emerald` — for the moments the page leans into color. Surfaces are matte rather than flat: a limewashed plaster texture (see Elevation & Depth) exists so a brand color reads as a wall, not a fill.

Motion is choreographed and gentle, never decorative. Scroll-driven reveals ride an exponential ease-out (`cubic-bezier(0.22, 1, 0.36, 1)`) over 0.8s with a 24px lift; site-wide smooth scrolling runs on Lenis; a hairline reading-progress bar tracks the top of the viewport. Everything honors `prefers-reduced-motion` — Lenis never starts, reveals crossfade in place with no travel, and the concierge's ping and typing dots go static.

It explicitly rejects four things, carried from PRODUCT.md: it must not look like generic SaaS / proptech (gradient heroes, geometric-sans-on-gradient, hero-metric templates), like a listings portal (filter rails, repeated card grids, price tags, clutter), like luxury-flex (gold-on-black, oversized "INVEST NOW" CTAs, gradient text), or like corporate sterile templates (stock handshakes, navy-and-gray). Gold is handled with care precisely so it never tips into luxury-flex: it is a thin accent and a metal on dark green, never a shiny button on black.

**Key Characteristics:**
- Cream/marble canvas, sage ambient voice, one emerald action voice, rare brass-gold accent
- Sage- and emerald-drenched bands (footer, announcement bar, CTA) keep the page from reading as cream monotone
- Limewashed plaster texture so brand surfaces read as material, not as hex
- Editorial whitespace and an unhurried reading rhythm
- Spectral serif display (light, with italic emphasis) paired with Albert Sans body
- Uniformly soft corners: 4px on controls, 6px on panels; full-bleed bands run edge-to-edge. No hard 0px corners — that consistency is the warmth
- Photography and warm material carry the emotion, not borders or chrome

## Colors

A warm-neutral palette built on cream and sage, with an emerald action voice and a brass-gold accent. Values are OKLCH; chroma stays low on the neutrals so they read as warm and calm, never muddy.

### Primary
- **Deep Emerald** (`primary`): The action voice. Primary buttons, links, focus rings, and active states. Cream text clears WCAG AA on it. Drawn from the brochure's deep-green accent walls.

### Secondary
- **Sage** (`sage`): Mid-olive brand wash for drenched bands. Carries large type only — headings and leads clear ≥3:1; do not set body copy on it.
- **Deep Emerald Surface** (`emerald`): Darker than `primary` and deep enough for body copy at cream. The footer, the concierge header and FAB, and the page's base canvas behind the sticky-reveal footer.

### Tertiary
- **Brass Gold** (`gold`): The brochure's logo metal. A rare jewel accent — kickers on imagery, the active-nav underline, footer wordmark and icons, the concierge status dot, hairline flourishes. Low-contrast on cream by design, so it is reserved for dark sage/emerald surfaces and decorative use, never body text on cream.

### Neutral
- **Cream/Marble** (`background`): Default page surface. Warm, never pure white.
- **Paper** (`card` / `popover`): Slightly brighter raised surfaces — the mega-menu panel, the concierge panel.
- **Pale Sage** (`secondary`): Quiet section washes, secondary buttons, assistant chat bubbles.
- **Sage-Stone** (`accent`): shadcn's hover/active wash. A neutral, not the brand voice.
- **Mist** (`muted`) with **Slate-Sage** text (`muted-foreground`): captions and secondary copy, tuned to clear AA on cream.
- **Ink** (`foreground`): Body and heading text. Warm near-black, faintly green-tinted, never `#000`.
- **Hairline** (`border`) and **Field** (`input`): dividers and control strokes, one step apart so an input reads as interactive against a divider.

### Theme

Light is the committed theme — a curious visitor on a phone in everyday indoor light. A `.dark` block exists in `globals.css` for shadcn parity and is kept in sync, but **no theme toggle ships**. Do not build one, and do not treat dark as a design target that needs review.

### Named Rules

**The One Action Voice Rule.** Emerald (`primary`) marks where the visitor acts: the inquiry CTA, links, and focus. Gold decorates; emerald acts. Don't repaint decoration emerald or buttons gold.

**The Gold-on-Dark Rule.** Gold is a metal: it sings on emerald and sage, and whispers (or disappears) on cream. Use it for accents and on dark surfaces, never for body text on the cream canvas.

**The Neutral-Accent Rule.** shadcn's `accent` is a sage-stone hover wash, not a brand color. Never repaint it emerald or gold.

**The Intent-Not-Hex Rule.** Author-facing surfaces (the announcement bar) store a named intent — `EMERALD`, `GOLD`, `SAGE`, `INK` — that resolves to tokens in code. No hex ever reaches the database, so nothing off-brand or unreadable can be published.

## Typography

**Display Font:** Spectral (with Georgia, serif fallback), weights 300/400/500/600, roman and italic
**Body Font:** Albert Sans (with system-ui, sans-serif fallback)

**Character:** Spectral gives the warmth and editorial confidence of a printed page; its light weights and italics echo the brochure's elegant serif. Albert Sans keeps long reading comfortable and plain-spoken. Italic Spectral carries emphasis words ("…in the *heart of the city*", "Living, without *boundaries*"), exactly as the brochure does.

Every heading level ships its own paired line-height and letter-spacing, so a size class carries its own leading and tracking and markup never needs an arbitrary value. Numerals in tables and `<time>` are tabular.

### Hierarchy
- **Display** (300, `clamp(2.75rem, 5.5vw + 1rem, 6rem)`, lh 1, tracking -0.022em): Hero statement. One per page.
- **Headline / h1** (300, `clamp(2.5rem, 5vw + 1rem, 5.75rem)`, lh 1.04): Page openers.
- **h2** (300, `clamp(2.625rem, 5vw + 1.25rem, 4.75rem)`, lh 1.06, tracking -0.016em): Major section openers.
- **Title / h3** (400, `clamp(2rem, 2.5vw + 1.25rem, 2.75rem)`, lh 1.12): Sub-section structure.
- **h4** (`clamp(1.5rem, 1.2vw + 1.2rem, 1.875rem)`, lh 1.2): Card and block headings.
- **Lead** (`clamp(1.25rem, 0.55vw + 1.125rem, 1.5rem)`, lh 1.45): The paragraph directly under a heading.
- **Body** (400, `1.0625rem` / 17px, lh 1.65): The unhurried read. Sized large for a broad audience; cap lines at 65–75ch.
- **Small** (`0.9375rem`, lh 1.55): Chat bubbles, dense supporting copy.
- **Label / Caption** (500, `0.8125rem`, lh 1.5): Buttons, kickers, metadata, nav.

### Named Rules

**The Printed-Page Rule.** Body type is set for sustained reading: 17px, line-height 1.65, lines capped at 65–75ch.

**The Three-Tracking Rule.** Only three tracking values for uppercase text: `label` (0.16em) for buttons and nav, `kicker` (0.22em) for section labels, `monogram` (0.3em) for the wordmark. No arbitrary tracking in markup.

**The Kicker-as-Voice Rule.** The brochure's labelled-section device ("THE PROPERTY", "THE CONCEPT") is used deliberately and sparingly via the `Kicker` component — it is brand voice, not a reflex above every block.

## Layout

**One gutter, everywhere.** `.main-container` is the single page container: centered, `max-width: 87.5rem` (1400px), with padding `1.5rem` → `2.5rem` at `md` → `3rem` at `lg`. Every section uses it, which is what gives the page its consistent vertical rhythm. Full-bleed bands (hero, drenched CTA, announcement bar, footer) are the deliberate exception: the band spans the viewport, its content still aligns to `.main-container`.

Breakpoints are Tailwind v4 defaults — `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px. The meaningful shifts are at `md` (navbar grows 3.5rem → 4rem, gutter widens) and `lg` (the financing mega-menu becomes available; below it, navigation collapses into a sheet drawer).

**The stacking order is a fixed ladder.** Skip link `z-60` → concierge panel `z-50` → navbar, concierge FAB, and back-to-top `z-40` → `<main>` `z-10` → footer `z-0`. The footer sits below the page on purpose: `<body>` is painted emerald, `<main>` is painted cream at `z-10`, and the footer is `position: sticky; bottom: 0` — so the page scrolls up to unveil it rather than pushing it down. Anything new must fit this ladder rather than inventing a higher z-index.

Touch targets stay at or above 44px on mobile — the concierge input is 2.75rem, mobile nav rows are padded to clear it.

## Elevation & Depth

**The system is flat at rest, and it is not sterile.** Surfaces separate by warm tonal steps — cream → paper → pale-sage → sage → emerald — rather than by shadow. Depth comes from tone and from material, not from lift.

The material is `.surface-plaster`: a limewash built from an inline SVG `feTurbulence` tile (180px, `stitchTiles="stitch"` so it repeats seamlessly), desaturated, laid at 22% opacity under `mix-blend-mode: overlay`, plus a top-to-bottom gradient that lightens the upper edge the way pigment settles down a real wall. Because it composites in `overlay`, one texture serves every brand surface: it lightens the light ones and darkens the dark ones, so the same grain works over deep emerald and pale gold without being authored twice. It costs no network request, never goes soft on a retina screen, and is suppressed in `@media print`. It is currently applied to the announcement bar; it is the sanctioned way to make any brand-colored band read as a surface.

### Shadow Vocabulary

Shadows are a response to state, never a default. Three exist:
- **Menu drop** (`shadow-lg`): the open financing mega-menu, so it reads as detached from the header.
- **Concierge lift** (`shadow-lg shadow-emerald/30` + `ring-1 ring-gold/30`): the floating concierge badge, tinted emerald rather than neutral gray so it belongs to the palette.
- **Panel** (`shadow-xl shadow-emerald/10`): the open concierge dialog.

### Named Rules

**The Tonal-Layer Rule.** Separate surfaces with warm tone steps, not shadows. A shadow appears only as a real response to state (an open menu, an open dialog, the concierge badge), never as default decoration.

**The Warm-Shadow Rule.** When a shadow is warranted it is tinted emerald, never neutral black. A gray shadow on this cream canvas reads as dirt.

**The Gentle Arrival Rule.** Elements ease in; they never bounce, snap, or slide aggressively. The one easing is `cubic-bezier(0.22, 1, 0.36, 1)`.

## Shapes

**Soft controls, sharp architecture.** A whisper of radius on the things a visitor touches, nothing on the things they look at.

- **Controls** — buttons, inputs, chips, chat bubbles, the concierge FAB — carry `0.25rem` (4px).
- **Panels** — the concierge dialog, cards, imagery — carry `0.375rem` (6px).
- **Full-bleed bands** — hero, drenched CTA, announcement bar, footer — carry no radius at all, because they meet the viewport edge.
- **Circles** (`9999px`) are reserved for status dots and the ping halo.

Borders are hairlines at `border`, often at reduced opacity (`border-border/70`, `/60`) so a divider suggests a seam rather than drawing a line. There are no decorative side-stripe accent borders anywhere in the system.

Larger radius steps exist in the Tailwind scale but are not part of the language. Reaching for `rounded-2xl` is a signal that something is being designed as an app card rather than as architecture.

### Named Rules

**The No-Hard-Corner Rule.** Nothing interactive is 0px. If a control looks square, it is a bug — the uniform 4px is what makes the system feel warm rather than clinical.

## Components

Built on shadcn (base-ui primitives, `class-variance-authority`). Components consume semantic tokens only; restyle by retuning tokens.

### Buttons

Two families, deliberately kept apart. **`CtaLink`** is the navigational, brand-voiced affordance — uppercase, tracked, arrow-bearing, 3rem tall. **`Button`** is the compact utility control for in-page interaction (menu toggles, send, carousel arrows), 2.5rem at default.

- **Shape:** `0.25rem` (4px) on both. Uppercase label type at `0.16em` tracking.
- **Primary (`CtaLink` `solid`):** Emerald surface, cream text, `0 1.75rem` padding, 3rem tall. Hover drops to 90% opacity; active nudges `translate-y-px`.
- **Outline (`outline`):** Transparent on a hairline `foreground/25` border. Hover inverts — the border goes solid and the fill becomes ink with cream text.
- **Outline Light (`outlineLight`):** The same move for dark sage/emerald bands, using `currentColor/40` and inverting to cream-on-emerald.
- **Link (`link` / `linkLight`):** Inline underlined text at `small`, 1px decoration, 4px offset. The light variant hovers to gold.
- **Hover / Focus:** Color transitions only, 300ms `ease-out`. Focus is a 2px emerald `ring` with a 2px offset in the surface color — on dark bands the ring switches to cream and offsets against emerald.
- **Arrow:** `CtaLink` carries a trailing `ArrowUpRight` that lifts and shifts 2px diagonally on hover over 500ms. Suppressed under reduced motion.

### Inputs / Fields

- **Style:** Transparent fill on a 1px `input` stroke, `0.25rem` radius, 2rem tall at default. Placeholder in `muted-foreground`.
- **Focus:** Border shifts to `ring` and a 1px `ring/50` halo appears. No glow, no lift.
- **Error:** `aria-invalid` drives a destructive border and halo — the attribute is the trigger, never a class.
- **Disabled:** 50% opacity, `input/50` fill, pointer events off.
- **In context:** the concierge overrides height to 2.75rem to clear the 44px touch target.

### Navigation

- **Style:** Sticky translucent-cream header (`background/85` + backdrop blur, tightening to `/75` where `backdrop-filter` is supported), over a hairline border. 3.5rem tall, 4rem at `md`.
- **Layout:** Wordmark alone on the left in Spectral at `monogram` tracking; links and the `Book a viewing` CTA grouped right. Links are 12px uppercase at `label` tracking, `foreground/70`, going solid on hover.
- **Active state:** a 2px **gold** underline at 6px offset. This is the one place gold marks state rather than decorates.
- **Financing mega-menu:** a full-width panel on a paper surface, content aligned to `.main-container` — a bordered intro column plus categories with one-line descriptions. Opens on hover, toggles on click, closes on Escape / outside-click / navigation.
- **Mobile:** a `Sheet` drawer with `details` disclosure groups and 44px rows.

### Announcement Bar

A full-bleed strip above the header, rendered only when an announcement is published — no placeholder, no empty state. It is the system's one **plaster-textured** surface. Four author-selectable variants resolve to tokens: `EMERALD` (gold accent), `GOLD` (emerald hover, since gold-on-gold is invisible), `SAGE` (gold accent), `INK` (gold accent). The trailing icon is derived from the link — `tel:` is a phone, `mailto:` an envelope, anything else an arrow — so an author cannot pick the wrong one.

### Footer

A **sticky reveal**: `position: sticky; bottom: 0; z-index: 0` on a deep-emerald surface, with the page content above it at `z-10`. Scrolling to the bottom unveils it. Carries the gold wordmark at `monogram` tracking, gold section labels, gold icons, real contact details, and link columns.

### Signature: The Inquiry CTA

The whole site exists to drive viewing inquiries, so the primary CTA ("Book a viewing", emerald `solid`) is the signature component — reachable from the header, hero, every closing band, and the footer, and never competing with a second emerald element on the same screen.

### Signature: The Concierge

A floating badge, bottom-right, that is a real chat widget when `NEXT_PUBLIC_API_BASE_URL` is set and a passive presence badge when it is not — the unconfigured path is a designed state, not a fallback. Emerald surface, gold `MessageCircle`, a gold status dot with a ping halo, `shadow-lg shadow-emerald/30` and a `ring-1 ring-gold/30`.

Open, it becomes a non-modal dialog — no backdrop, the page stays usable — on a paper surface with a 6px radius: emerald header with the gold status dot, a scrollable message region, user bubbles in emerald and assistant bubbles in pale sage (both 4px, max 85% width, long URLs wrapped), three pulsing gold dots while a reply streams, suggestion chips on an empty transcript, and a disclaimer under the input. Every failure state routes to a human — phone, Facebook, `/contacts` — so it is never a dead end.

## Do's and Don'ts

### Do:
- **Do** lead with warmth, photography, and material; let tonal cream → sage → emerald layers carry structure.
- **Do** reserve emerald (`primary`) for inquiry actions, links, and focus.
- **Do** use gold as a rare jewel accent, brightest on dark sage/emerald surfaces — plus the one active-nav underline.
- **Do** reach for `.surface-plaster` when a brand-colored band needs to read as a wall rather than a fill.
- **Do** set body type at 17px / lh 1.65 / 65–75ch.
- **Do** align every section to `.main-container`, including the contents of full-bleed bands.
- **Do** ease motion in on `cubic-bezier(0.22, 1, 0.36, 1)` and honor `prefers-reduced-motion`.
- **Do** tint a shadow emerald on the rare occasion one is warranted.

### Don't:
- **Don't** look like generic SaaS / proptech, a listings portal, luxury-flex, or corporate-sterile.
- **Don't** put gold body text on cream (low contrast) or gold buttons on black (luxury-flex).
- **Don't** set body copy on `sage` — it carries large type only. Use `emerald` when a dark band needs paragraphs.
- **Don't** use pure `#000`/`#fff`, side-stripe accent borders, gradient text, or decorative glassmorphism.
- **Don't** repaint shadcn's `accent`; it is the neutral sage-stone hover wash.
- **Don't** add a shadow as decoration, or a neutral-gray shadow at all.
- **Don't** ship a theme toggle. `.dark` exists for shadcn parity only; light is the committed theme.
- **Don't** invent a new z-index above the ladder in Layout.
- **Don't** invent facts, prices, or contact details — the brochure (`/public/brochure.pdf`) and `lib/site.ts` are the source of truth.
