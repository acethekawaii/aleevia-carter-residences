import { HeroSection } from "@/components/hero-section";
import { LocationSection } from "@/components/location-section";
import { AmenitiesSection } from "@/components/amenities-section";
import { UnitShowcase } from "@/components/unit-showcase";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CtaSection } from "@/components/cta-section";

export default function Home() {
  return (
    <main className="relative z-10 flex flex-col min-h-screen bg-background">
      <HeroSection />
      <AmenitiesSection />
      <UnitShowcase />
      <LocationSection />
      <TestimonialsSection />
      <CtaSection />
    </main>
  );
}
