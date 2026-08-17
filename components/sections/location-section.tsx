import {
  Building2,
  Church,
  GraduationCap,
  HeartPulse,
  type LucideIcon,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";

import { Kicker } from "@/components/ui/kicker";
import { Reveal } from "@/components/ui/reveal";

type Place = { name: string; distance: string; time: string };
type Category = { title: string; icon: LucideIcon; places: Place[] };

const CATEGORIES: Category[] = [
  {
    title: "Supermarkets",
    icon: ShoppingBag,
    places: [
      { name: "Puregold Libertad", distance: "0.9 km", time: "4 min" },
      { name: "H.A Grocery Store", distance: "1.0 km", time: "5 min" },
      { name: "Metro Supermarket", distance: "1.5 km", time: "7 min" },
      { name: "Liana's Supermarket — Taft", distance: "1.8 km", time: "8 min" },
      { name: "Baclaran Market", distance: "4.9 km", time: "16 min" },
    ],
  },
  {
    title: "Commercial",
    icon: Building2,
    places: [
      { name: "Victory Pasay Mall", distance: "1.1 km", time: "6 min" },
      { name: "Metropoint Mall", distance: "1.9 km", time: "9 min" },
      { name: "SM Mall of Asia", distance: "4.5 km", time: "15–20 min" },
      { name: "S Maison", distance: "5.0 km", time: "22 min" },
      { name: "Newport Mall", distance: "5.5 km", time: "25 min" },
    ],
  },
  {
    title: "Hospitals",
    icon: HeartPulse,
    places: [
      {
        name: "Metro Pasay Hospital & Medical Center",
        distance: "0.7 km",
        time: "4 min",
      },
      {
        name: "Pasay City General Hospital",
        distance: "1.3 km",
        time: "7 min",
      },
      {
        name: "Adventist Medical Center Manila",
        distance: "2.1 km",
        time: "9 min",
      },
      { name: "San Juan De Dios Hospital", distance: "2.5 km", time: "12 min" },
      {
        name: "Ospital ng Maynila Medical Center",
        distance: "3.2 km",
        time: "15 min",
      },
    ],
  },
  {
    title: "Schools",
    icon: GraduationCap,
    places: [
      {
        name: "Juan Sumulong Elementary School",
        distance: "0.5 km",
        time: "3 min",
      },
      {
        name: "Pasay City East High School",
        distance: "0.9 km",
        time: "5 min",
      },
      {
        name: "Padre Zamora Elementary School",
        distance: "1.1 km",
        time: "6 min",
      },
      {
        name: "St. Mary's Academy of Pasay City",
        distance: "1.5 km",
        time: "9 min",
      },
      {
        name: "Arellano University — Jose Abad Santos",
        distance: "2.3 km",
        time: "11 min",
      },
    ],
  },
  {
    title: "Churches",
    icon: Church,
    places: [
      {
        name: "Bible Baptist Church of Pasay",
        distance: "0.4 km",
        time: "2 min",
      },
      {
        name: "Jesus Christ Pasay Blessing Church",
        distance: "0.6 km",
        time: "3 min",
      },
      { name: "San Roque De Pasay Church", distance: "0.8 km", time: "4 min" },
      {
        name: "Pasay City Christian Church",
        distance: "1.1 km",
        time: "5 min",
      },
      { name: "Baclaran Church", distance: "5.5 km", time: "17 min" },
    ],
  },
];

export function LocationSection() {
  return (
    <section
      aria-labelledby="location-heading"
      className="scroll-mt-24 border-t border-border bg-background py-24 md:py-32"
    >
      <div className="main-container">
        <Reveal className="max-w-[44ch]">
          <Kicker tone="gold">The Location</Kicker>
          <h2
            id="location-heading"
            className="mt-6 font-heading text-h2 font-light text-balance text-foreground"
          >
            Come home here.
          </h2>
          <p className="mt-8 text-body text-muted-foreground">
            Aleevia Carter sits along the Rodriguez corridor, one of Pasay
            City's most connected pockets — minutes from the business districts,
            the bay, and the airport, with the whole metro at your doorstep.
          </p>
        </Reveal>

        <Reveal delay={0.05} className="mt-12">
          <figure className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-sage">
            <Image
              src="/assets/map.png"
              alt="Neighbourhood map locating Aleevia Carter Residences in Pasay City, with nearby malls, schools, and hospitals."
              fill
              sizes="(min-width: 1400px) 1304px, (min-width: 768px) calc(100vw - 80px), calc(100vw - 48px)"
              className="object-contain"
            />
          </figure>
        </Reveal>

        <div className="mt-16 md:mt-20">
          <Reveal className="flex items-baseline justify-between gap-6">
            <h3 className="font-heading text-h4 font-normal text-foreground">
              Close to the city, closer to home.
            </h3>
          </Reveal>

          <div className="mt-10 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category, index) => {
              const Icon = category.icon;
              return (
                <Reveal key={category.title} delay={index * 0.05}>
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <Icon aria-hidden className="size-4 text-primary" />
                    <h4 className="text-caption font-semibold uppercase tracking-label text-foreground">
                      {category.title}
                    </h4>
                  </div>
                  <ul className="mt-4 space-y-2.5">
                    {category.places.map((place) => (
                      <li
                        key={place.name}
                        className="flex items-baseline justify-between gap-4 text-small"
                      >
                        <span className="text-foreground/90">{place.name}</span>
                        <span className="shrink-0 text-caption tabular-nums text-muted-foreground">
                          {place.distance} · {place.time}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
