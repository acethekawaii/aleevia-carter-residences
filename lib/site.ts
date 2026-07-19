/**
 * Single source of truth for site-wide facts.
 *
 * Every value here is drawn from the official Aleevia Carter Residences brochure
 * (see /public/brochure.pdf). Do not invent contact details, prices, or project
 * figures — if it is not in the brochure, it does not belong on the site.
 */

export const SITE = {
  name: "Aleevia Carter Residences",
  shortName: "Aleevia Carter",
  developer: "Aleevia Carter Development Corporation",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://aleeviacarterresidences.com",
  tagline: "Your Haven in the Heart of the City",
  subtitle: "A home built for a life without limits.",
  description:
    "A seven-storey Japandi residence in the heart of Pasay City. Thoughtful one- and two-bedroom loft homes, curated amenities, and a low-friction way to book a private viewing.",
} as const;

export const CONTACT = {
  contactName: "Analiza Diaz",
  phone: "0943 705 5099",
  phoneHref: "tel:+639437055099",
  email: "diazanne1628@gmail.com",
  emailHref: "mailto:diazanne1628@gmail.com",
  address: "614 E. Rodriguez St., Pasay City",
  addressFull: "614 E. Rodriguez St., Pasay City, Metro Manila, Philippines",
  mapsUrl: "https://maps.google.com/?q=614+E.+Rodriguez+St.,+Pasay+City",
  hours: "7 AM – 4 PM, Monday to Saturday",
  hoursNote: "Messages on Facebook answered around the clock.",
  // Official Facebook page.
  facebook: "https://www.facebook.com/profile.php?id=61592195754339",
} as const;

export const LEGAL = {
  registration: "DHSUD Certificate of Registration No. 0001076",
  licenseToSell: "License to Sell No. 0001215",
  issued: "Issued January 8, 2026",
} as const;

export const BROCHURE_PATH = "/brochure.pdf";

/**
 * Google Calendar Appointment Scheduling.
 *
 * The embed link is the appointment-schedule URL with `?gv=true` (Google
 * attaches a Google Meet link to every confirmed booking). Override per
 * environment with NEXT_PUBLIC_BOOKING_EMBED_URL if the schedule ever changes.
 */
const BOOKING_EMBED_URL =
  process.env.NEXT_PUBLIC_BOOKING_EMBED_URL ??
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ1tQxMU1vnxWf0ul9KSINyIZPw6TUURTds81TlWiROjVV2TAW1htKXVemctPRqZi5XszwlQiv1b?gv=true";

export const BOOKING = {
  embedUrl: BOOKING_EMBED_URL,
  timezone: "Asia / Manila",
  duration: "30 minutes",
  isConfigured: !BOOKING_EMBED_URL.includes("PLACEHOLDER"),
} as const;

/**
 * AI concierge chat API (aleevia-be).
 *
 * Shares NEXT_PUBLIC_API_BASE_URL with the blog — the deployed API base URL
 * including /api/v1 (e.g. https://api.aleeviacarterresidences.com/api/v1).
 * When unset, the concierge renders as the passive presence badge — no chat,
 * nothing broken.
 */
const CONCIERGE_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const CONCIERGE = {
  apiUrl: CONCIERGE_API_BASE_URL,
  chatEndpoint: `${CONCIERGE_API_BASE_URL}/concierge/chat`,
  isConfigured: CONCIERGE_API_BASE_URL.startsWith("http"),
} as const;

export type NavLeaf = { label: string; href: string; description?: string };
export type NavGroup = { category: string; links: NavLeaf[] };
export type NavEntry = NavLeaf | { label: string; menu: NavGroup[] };

export const NAV: NavEntry[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Financing",
    menu: [
      {
        category: "Affordability Calculators",
        links: [
          {
            label: "Pag-IBIG Calculator",
            href: "/financing/pag-ibig",
            description: "Estimate what you can borrow",
          },
        ],
      },
      {
        category: "Bank Partners & Loans",
        links: [
          {
            label: "Chinabank Requirements",
            href: "/financing/chinabank",
            description: "Eligibility, rates & process",
          },
        ],
      },
    ],
  },
  { label: "Blog", href: "/blog" },
];

export const PRIMARY_CTA = {
  label: "Book a viewing",
  href: "/contacts",
} as const;
