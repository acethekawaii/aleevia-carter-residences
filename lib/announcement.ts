/**
 * The strip above the navbar, served by the aleevia-be API.
 *
 * This is the only piece of site content that appears on EVERY page, which
 * drives the two decisions below: it degrades to a hardcoded default instead of
 * disappearing, and it never throws.
 */

import { CONTACT } from "./site";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

/** Matches the blog's cadence: an edit is live within a minute. */
const REVALIDATE_SECONDS = 60;

/** Brand surfaces the CMS can choose between. Mirrors the API's enum exactly. */
export type AnnouncementVariant = "EMERALD" | "GOLD" | "SAGE" | "INK";

export type Announcement = {
  id: string;
  message: string;
  variant: AnnouncementVariant;
  linkLabel: string | null;
  linkHref: string | null;
};

type Envelope<T> = { statusCode: number; message: string; data: T };

/**
 * Shown when the API is unreachable.
 *
 * A blank strip on every page would be a visible, sitewide symptom of a backend
 * blip, and the phone number is the site's primary conversion path. Falling back
 * to the standing invitation means an outage costs nothing a visitor can see.
 * This intentionally duplicates the seeded row in the API — the duplication is
 * the point, since the whole purpose is to survive that row being unreachable.
 */
const FALLBACK: Announcement = {
  id: "fallback",
  message: "Now welcoming private viewings",
  variant: "EMERALD",
  linkLabel: CONTACT.phone,
  linkHref: CONTACT.phoneHref,
};

/**
 * The announcement to render right now.
 *
 * `null` is a real answer meaning "render nothing" — the CMS can unpublish
 * everything deliberately — and is distinct from a failure, which yields the
 * fallback. Only a transport or parse error reaches the fallback path.
 */
export async function getAnnouncement(): Promise<Announcement | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/announcements/active`, {
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) {
      console.error(`[announcement] API responded ${res.status}`);
      return FALLBACK;
    }

    const json = (await res.json()) as Envelope<Announcement | null>;
    return json.data ?? null;
  } catch (error) {
    console.error("[announcement] fetch failed:", error);
    return FALLBACK;
  }
}
