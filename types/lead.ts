/** Exactly what POST /leads accepts. Nothing else — the API rejects extra keys. */
export type LeadPayload = {
  firstName: string; // required
  lastName: string; // required
  email: string; // required
  contactNumber: string; // required
  message?: string | null; // optional; '' and null both store as null
  marketingConsent: boolean; // required — send it even when false
  privacyConsent: true; // required — must literally be true
};

/** What comes back in `data` on 201. */
export type LeadReceipt = {
  id: string;
  createdAt: string; // ISO 8601 UTC
};
