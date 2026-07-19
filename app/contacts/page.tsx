import {
  CalendarClock,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Video,
} from "lucide-react";
import type { Metadata } from "next";

import { BookingEmbed } from "@/components/booking-embed";
import { JsonLd } from "@/components/seo/json-ld";
import { Kicker } from "@/components/ui/kicker";
import { breadcrumbSchema } from "@/lib/schema";
import { BOOKING, CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a viewing",
  description:
    "Book a private viewing of Aleevia Carter Residences. Pick a time and we'll meet you on-site in Pasay City or over Google Meet.",
  alternates: { canonical: "/contacts" },
};

const WHAT_TO_EXPECT = [
  {
    icon: CalendarClock,
    title: "A guided walkthrough",
    description:
      "An unhurried tour of the model unit, the amenities, and the neighbourhood with a dedicated specialist.",
  },
  {
    icon: Clock3,
    title: "Flexible timing",
    description:
      "Reschedule or cancel up to 24 hours before your slot — no questions asked.",
  },
  {
    icon: Video,
    title: "On-site or on Google Meet",
    description:
      "Prefer to stay home? Every booking comes with a Google Meet link, so we can host the tour live over video.",
  },
];

const DIRECT_CONTACT = [
  {
    icon: Phone,
    label: "Call or text",
    value: `${CONTACT.phone} · ${CONTACT.contactName}`,
    href: CONTACT.phoneHref,
  },
  { icon: Mail, label: "Email", value: CONTACT.email, href: CONTACT.emailHref },
  {
    icon: MapPin,
    label: "Showroom",
    value: CONTACT.address,
    href: CONTACT.mapsUrl,
  },
];

export default function ContactsPage() {
  return (
    <>
      <JsonLd
        graph={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Book a viewing", path: "/contacts" },
          ]),
        ]}
      />
      <section className="border-b border-border bg-secondary/40">
        <div className="main-container pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="max-w-[44ch]">
            <Kicker tone="gold">Book a viewing</Kicker>
            <h1 className="mt-6 font-heading text-h1 font-light text-balance text-foreground">
              Schedule a private{" "}
              <span className="italic text-primary">tour.</span>
            </h1>
            <p className="mt-6 text-body text-muted-foreground">
              Pick a time that suits you and a specialist will walk you through
              the model unit, the amenities, and the life that defines Aleevia
              Carter.
            </p>
          </div>
        </div>
      </section>

      <section className="main-container py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <aside className="space-y-12 lg:col-span-4">
            <div>
              <p className="text-caption font-medium uppercase tracking-label text-muted-foreground">
                What to expect
              </p>
              <ul className="mt-6 space-y-7">
                {WHAT_TO_EXPECT.map(({ icon: Icon, title, description }) => (
                  <li key={title} className="flex items-start gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center border border-border text-primary">
                      <Icon className="size-4" />
                    </span>
                    <div>
                      <h3 className="text-small font-semibold text-foreground">
                        {title}
                      </h3>
                      <p className="mt-1.5 text-small text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border pt-10">
              <p className="text-caption font-medium uppercase tracking-label text-muted-foreground">
                Prefer to talk first?
              </p>
              <ul className="mt-6 space-y-5">
                {DIRECT_CONTACT.map(({ icon: Icon, label, value, href }) => {
                  const external = href.startsWith("http");
                  return (
                    <li key={label}>
                      <a
                        href={href}
                        {...(external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="group flex items-start gap-4"
                      >
                        <span className="flex size-10 shrink-0 items-center justify-center border border-border text-primary transition-colors group-hover:border-primary">
                          <Icon className="size-4" />
                        </span>
                        <div>
                          <p className="text-caption font-medium uppercase tracking-label text-muted-foreground">
                            {label}
                          </p>
                          <p className="mt-1 text-small text-foreground transition-colors group-hover:text-primary">
                            {value}
                          </p>
                        </div>
                      </a>
                    </li>
                  );
                })}
                <li className="flex items-start gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center border border-border text-primary">
                    <Clock3 className="size-4" />
                  </span>
                  <div>
                    <p className="text-caption font-medium uppercase tracking-label text-muted-foreground">
                      Office hours
                    </p>
                    <p className="mt-1 text-small text-foreground">
                      {CONTACT.hours}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <div className="mb-6 flex items-baseline justify-between">
              <p className="text-caption font-medium uppercase tracking-label text-muted-foreground">
                Select a time
              </p>
              <p className="text-caption uppercase tracking-label text-muted-foreground">
                {BOOKING.timezone}
              </p>
            </div>
            <BookingEmbed />
            <p className="mt-6 text-small text-muted-foreground">
              Bookings are managed through Google Calendar. A confirmation with
              a Google Meet link is sent the moment you pick a time.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
