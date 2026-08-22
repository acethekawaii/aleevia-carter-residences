/**
 * Exactly what GET /agents returns. The endpoint publishes nothing else — no
 * bio, no slug, no `status`, no timestamps and no display order — so nothing
 * here may be approximated client-side.
 */

export type AgentRole = "BROKER" | "SALES_AGENT";

export type Agent = {
  id: string;
  firstName: string;
  lastName: string;
  role: AgentRole;
  /** PRC licence, as printed on the ID. `null` collapses the line entirely. */
  licenseNumber: string | null;
  /** A real address, meant for a `mailto:`. */
  email: string;
  /** Stored exactly as the client typed it — display it unmodified. */
  contactNumber: string;
  /** Absolute URL or root-relative path. `null` falls back to a monogram. */
  photoUrl: string | null;
  city: string;
  /** Only set for an agent based abroad, which is the one case it informs. */
  country: string | null;
};

/**
 * `role` is an enum, never display text. Read through this map rather than
 * switched on, so a third role shipping server-side before this is updated
 * renders no label instead of a raw `SALES_AGENT`.
 */
export const ROLE_LABELS: Record<AgentRole, string> = {
  BROKER: "Broker",
  SALES_AGENT: "Sales Agent",
};
