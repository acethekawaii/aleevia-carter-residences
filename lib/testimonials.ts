/**
 * Published testimonials, served by the aleevia-be API.
 *
 * Unlike the announcement strip, this section is allowed to disappear. An empty
 * array is a deliberate editorial state — the CMS cleared it — and a failed
 * fetch degrades to that same empty array rather than to a hardcoded quote: an
 * absent testimonial section is not a visible defect, whereas a stale invented
 * quote would be a real one.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

/** Quotes turn over far more slowly than the announcement strip's 60s cadence. */
const REVALIDATE_SECONDS = 300;

export type Testimonial = {
  id: string;
  /** Plain text — never Markdown or HTML. Render as a text node. */
  quote: string;
  authorName: string;
  /** Role, employer, or publication. `null` means the line is omitted. */
  authorTitle: string | null;
};

type Envelope<T> = { statusCode: number; message: string; data: T };

/**
 * Every published testimonial, newest first — the only ordering the API offers.
 * This endpoint is not paginated, so `data` is the array itself and takes no
 * query parameters.
 *
 * Always resolves. `Array.isArray` guards the shape as well as the status, so a
 * malformed or proxied response collapses the section instead of reaching the
 * component as a non-array.
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/testimonials`, {
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) {
      console.error(`[testimonials] API responded ${res.status}`);
      return [];
    }

    const json = (await res.json()) as Envelope<Testimonial[]>;
    return Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error("[testimonials] fetch failed:", error);
    return [];
  }
}
