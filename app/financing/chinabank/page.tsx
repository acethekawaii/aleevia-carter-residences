import type { Metadata } from "next";

import { ChinabankLoan } from "@/components/financing/chinabank-loan";
import { CtaBand } from "@/components/sections/cta-band";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Chinabank housing loan",
  description:
    "Eligibility, required documents, rates, and process for financing a home at Aleevia Carter Residences through a Chinabank housing loan.",
  alternates: { canonical: "/financing/chinabank" },
};

export default function ChinabankPage() {
  return (
    <>
      <JsonLd
        graph={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Chinabank Housing Loan", path: "/financing/chinabank" },
          ]),
        ]}
      />
      <ChinabankLoan />
      <CtaBand
        title="Ready to start?"
        body="Book a viewing and our specialists will guide you through pre-qualification, step by step."
      />
    </>
  );
}
