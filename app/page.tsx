import type { Metadata } from "next";

import { Amenities } from "@/components/sections/amenities";
import { CtaBand } from "@/components/sections/cta-band";
import { FinancingIntro } from "@/components/sections/financing-intro";
import { Hero } from "@/components/sections/hero";
import { Residences } from "@/components/sections/residences";
import { Testimonials } from "@/components/sections/testimonials";
import { Welcome } from "@/components/sections/welcome";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Welcome />
      <Residences />
      <Amenities />
      <Testimonials />
      <FinancingIntro />
      <CtaBand />
    </>
  );
}
