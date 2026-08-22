/**
 * The published broker roster, served by the aleevia-be API.
 *
 * Unlike testimonials, an empty roster does not collapse the section: it
 * renders a written state pointing at the ways to reach a human on this page.
 * A failed fetch degrades to that same empty array — the directory sits on the
 * booking page, so nothing about it may be allowed to take that page down.
 */

import type { Agent } from "@/types/agent";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

/** The roster changes when somebody joins or leaves — rarely, never urgently. */
const REVALIDATE_SECONDS = 300;

type Envelope<T> = { statusCode: number; message: string; data: T };

/**
 * Every published agent, alphabetically by first name then last — the only
 * ordering the API offers. Drafts never appear, so there is nothing to filter
 * here. The endpoint is not paginated, so `data` is the array itself, and it
 * reads no query parameters (extras are ignored rather than rejected).
 *
 * Always resolves. `Array.isArray` guards the shape as well as the status: a
 * malformed or proxied response becomes the empty state instead of a
 * `map is not a function` crash on the site's booking page.
 */
export async function getAgents(): Promise<Agent[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/agents`, {
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) {
      console.error(`[agents] API responded ${res.status}`);
      return [];
    }

    const json = (await res.json()) as Envelope<Agent[]>;
    return Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error("[agents] fetch failed:", error);
    return [];
  }
}
