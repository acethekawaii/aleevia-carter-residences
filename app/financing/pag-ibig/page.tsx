import type { Metadata } from "next";

import { AffordabilityCalculator } from "@/components/financing/affordability-calculator";
import { CtaBand } from "@/components/sections/cta-band";
import { JsonLd } from "@/components/seo/json-ld";
import { Kicker } from "@/components/ui/kicker";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Pag-IBIG calculator",
  description:
    "Estimate your maximum Pag-IBIG home loan and monthly amortization based on your gross monthly income.",
  alternates: { canonical: "/financing/pag-ibig" },
};

export default function PagIbigPage() {
  return (
    <>
      <JsonLd
        graph={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Pag-IBIG Calculator", path: "/financing/pag-ibig" },
          ]),
        ]}
      />
      <section className="main-container pt-28 pb-16 md:pt-32 md:pb-24">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
          <div>
            <Kicker tone="gold">Affordability calculator</Kicker>
            <h1 className="mt-3 font-heading text-h3 font-light text-balance text-foreground">
              Pag-IBIG <span className="italic text-primary">financing.</span>
            </h1>
          </div>
          <p className="max-w-[38ch] text-small text-muted-foreground">
            Drag your income to estimate what you could borrow toward a home at
            Aleevia Carter — using the standard Pag-IBIG computation.
          </p>
        </div>

        <div className="mt-10 md:mt-12">
          <AffordabilityCalculator
            lenderName="Pag-IBIG"
            interestRate={0.0625}
            maxAmortizationRatio={0.35}
            loanTerms={[5, 10, 15, 20, 25, 30]}
            defaultTerm={30}
            rateNote="3-year fixing"
          />
        </div>
      </section>

      <CtaBand
        title="Found a number that works?"
        body="Book a viewing and we'll walk you through the homes — and the financing — in person."
      />
    </>
  );
}
