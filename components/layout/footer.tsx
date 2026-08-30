import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import { CtaLink } from "@/components/ui/cta-link";
import {
  BROCHURE_PATH,
  CONTACT,
  LEGAL,
  LOCATION,
  PRIMARY_CTA,
  SITE,
} from "@/lib/site";

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] =
  [
    {
      heading: "Explore",
      links: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Journal", href: "/blog" },
      ],
    },
    {
      heading: "Financing",
      links: [
        { label: "Pag-IBIG calculator", href: "/financing/pag-ibig" },
        { label: "Chinabank housing loan", href: "/financing/chinabank" },
      ],
    },
    {
      heading: "Visit",
      links: [
        { label: "Book a viewing", href: "/contacts" },
        { label: "View brochure", href: BROCHURE_PATH },
        { label: "Facebook page", href: CONTACT.facebook },
      ],
    },
  ];

function isExternal(href: string) {
  return href.startsWith("http") || href.endsWith(".pdf");
}

export function Footer() {
  return (
    <footer className="sticky bottom-0 z-0 bg-emerald text-emerald-foreground">
      <div className="main-container py-16 md:py-20">
        {/* Closing line + CTA */}
        <div className="flex flex-col gap-8 border-b border-emerald-foreground/15 pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="font-heading text-2xl font-light tracking-monogram text-gold uppercase">
              Aleevia Carter
            </p>
            <h2 className="mt-5 font-heading text-h3 font-light text-balance text-emerald-foreground">
              Come home to the heart of the city.
            </h2>
          </div>
          <CtaLink href={PRIMARY_CTA.href} variant="outlineLight">
            {PRIMARY_CTA.label}
          </CtaLink>
        </div>

        {/* Link columns + contact */}
        <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <p className="text-caption font-medium uppercase tracking-label text-gold">
                {column.heading}
              </p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) =>
                  isExternal(link.href) ? (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-small text-emerald-foreground/80 transition-colors hover:text-emerald-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-small text-emerald-foreground/80 transition-colors hover:text-emerald-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>
          ))}

          <div>
            <p className="text-caption font-medium uppercase tracking-label text-gold">
              Visit us
            </p>
            <ul className="mt-5 space-y-4 text-small text-emerald-foreground/80">
              <li className="flex items-start gap-3">
                <MapPin
                  aria-hidden
                  className="mt-0.5 size-4 shrink-0 text-gold"
                />
                <a
                  href={LOCATION.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-emerald-foreground"
                >
                  {CONTACT.address}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone
                  aria-hidden
                  className="mt-0.5 size-4 shrink-0 text-gold"
                />
                <a
                  href={CONTACT.phoneHref}
                  className="transition-colors hover:text-emerald-foreground"
                >
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail
                  aria-hidden
                  className="mt-0.5 size-4 shrink-0 text-gold"
                />
                <a
                  href={CONTACT.emailHref}
                  className="break-all transition-colors hover:text-emerald-foreground"
                >
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock
                  aria-hidden
                  className="mt-0.5 size-4 shrink-0 text-gold"
                />
                <span>{CONTACT.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-4 border-t border-emerald-foreground/15 pt-8 text-caption text-emerald-foreground/55 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl">
            {SITE.developer}. {LEGAL.registration}, {LEGAL.licenseToSell}.
          </p>
          <p>
            &copy; {new Date().getFullYear()} {SITE.name}.
          </p>
        </div>
      </div>
    </footer>
  );
}
