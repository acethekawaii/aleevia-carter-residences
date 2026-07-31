import type { Metadata } from "next";
import { AboutRecord } from "@/components/sections/about-record";
import { AboutSection } from "@/components/sections/about-section";
import { CtaBand } from "@/components/sections/cta-band";
import { FloorStack } from "@/components/sections/floor-stack";
import { LocationSection } from "@/components/sections/location-section";
import { Reception } from "@/components/sections/reception";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About",
  description:
    "What Aleevia Carter Residences actually is — a seven-storey building on E. Rodriguez Street in Pasay City holding 85 one- and two-bedroom loft homes, set out floor by floor.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        graph={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />
      {/* Ordered by what a visitor needs first: what the building is, how it
          is laid out, the one shared room inside it, where it sits, then the
          record that says it is real. */}
      <AboutSection />
      <FloorStack />
      <Reception />
      <LocationSection />
      <AboutRecord />
      <CtaBand
        title="Want to see it in person?"
        body="Book a private viewing and we'll show you the model unit, the amenities, and the neighbourhood — no pressure."
      />
    </>
  );
}
