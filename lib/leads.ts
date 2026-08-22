/**
 * Contact-form submissions, served by the aleevia-be API.
 *
 * The request goes from the browser rather than through a Server Action on
 * purpose: the API rate-limits leads per IP, so posting server-side would turn
 * 5-per-visitor-per-minute into a global cap of 5 submissions per minute for
 * the whole site. CORS is already open to the landing origins for this reason.
 *
 * Write-only — there is no public endpoint that reads leads back; the CMS does
 * that.
 */

import type { LeadPayload, LeadReceipt } from "@/types/lead";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export type SubmitResult =
  | { ok: true; receipt: LeadReceipt }
  | { ok: false; status: number; messages: string[] };

/**
 * Never throws. The form has to render an error state either way, and a
 * rejected promise here would just move that decision somewhere less
 * convenient.
 *
 * Successes are enveloped (`json.data`), failures are not (`json.message`) —
 * the asymmetry is the API's, not a bug here.
 */
export async function submitLead(payload: LeadPayload): Promise<SubmitResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = (await res.json().catch(() => null)) as {
      data?: LeadReceipt;
      message?: string | string[];
    } | null;

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        messages: toMessages(json?.message, res.status),
      };
    }

    return { ok: true, receipt: json?.data as LeadReceipt };
  } catch {
    return {
      ok: false,
      status: 0,
      messages: [
        "We could not reach the server. Check your connection and try again.",
      ],
    };
  }
}

/** `message` is a string array on validation failures and a string otherwise. */
function toMessages(
  message: string | string[] | undefined,
  status: number,
): string[] {
  // Checked before the body, not after it: the throttler answers with
  // "ThrottlerException: Too Many Requests", so passing its wording through
  // would put that in front of a visitor.
  if (status === 429) {
    return ["Too many attempts. Wait a minute, then try again."];
  }
  if (Array.isArray(message) && message.length) return message;
  if (typeof message === "string" && message.trim()) return [message.trim()];
  return [
    "Something went wrong on our end. Please try again, or call us directly.",
  ];
}
