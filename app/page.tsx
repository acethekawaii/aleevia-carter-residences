import type { Metadata } from "next";

import { Amenities } from "@/components/sections/amenities";
import { CtaBand } from "@/components/sections/cta-band";
import { FinancingIntro } from "@/components/sections/financing-intro";
import { Hero } from "@/components/sections/hero";
import { Residences } from "@/components/sections/residences";
import { Testimonials } from "@/components/sections/testimonials";
import { Welcome } from "@/components/sections/welcome";
import { getTestimonials } from "@/lib/testimonials";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * How many quotes the homepage carousel features. Sliced here rather than
 * requested from the API, which reads no `limit` parameter — it returns every
 * published quote, newest first, and silently ignores extras on the URL.
 */
const FEATURED_TESTIMONIALS = 3;

export default async function Home() {
  // Fetched here rather than inside the section because the carousel is a
  // client component. Cached for 5 minutes, so this costs one request per
  // revalidation window rather than one per page view.
  const testimonials = await getTestimonials();

  return (
    <>
      <Hero />
      <Welcome />
      <Residences />
      <Amenities />
      <Testimonials items={testimonials.slice(0, FEATURED_TESTIMONIALS)} />
      <FinancingIntro />
      <CtaBand />
    </>
  );
}
