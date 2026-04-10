import { ArrowUpRight } from "lucide-react";

const footerLinks = {
  company: [
    { label: "About Us", href: "#about" },
    { label: "Our Story", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
  ],
  residences: [
    { label: "1-Bedroom Unit", href: "#residences" },
    { label: "2-Bedroom Unit", href: "#residences" },
    { label: "Floor Plans", href: "#residences" },
    { label: "Virtual Tour", href: "#" },
  ],
  resources: [
    { label: "View Brochure", href: "#brochure" },
    { label: "FAQs", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="sticky bottom-0 z-0 bg-zinc-950 text-white">
      <div className="main-container py-10 sm:py-12 md:py-16">
        {/* Top — Brand + CTA */}
        <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-end lg:justify-between mb-8 sm:mb-10 md:mb-12">
          <div>
            <p className="font-heading text-[0.7rem] sm:text-[0.8rem] font-semibold tracking-[0.25em] uppercase text-zinc-400 mb-2 sm:mb-3">
              Aleevia Carter
            </p>
            <h3 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight leading-[1.1] text-white max-w-lg">
              Living, without <span className="italic font-normal text-zinc-400">boundaries.</span>
            </h3>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-3 bg-white text-zinc-950 w-full sm:w-auto px-7 py-3.5 text-sm font-medium tracking-wide hover:bg-zinc-200 transition-colors self-start lg:self-auto"
          >
            Schedule a Viewing
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Middle — Link Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-10 md:mb-12">
          <div>
            <p className="text-[0.65rem] sm:text-xs tracking-[0.2em] uppercase text-zinc-500 font-semibold mb-3 sm:mb-4">
              Company
            </p>
            <ul className="space-y-2 sm:space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[0.8rem] sm:text-sm text-zinc-400 hover:text-white transition-colors py-0.5 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[0.65rem] sm:text-xs tracking-[0.2em] uppercase text-zinc-500 font-semibold mb-3 sm:mb-4">
              Residences
            </p>
            <ul className="space-y-2 sm:space-y-2.5">
              {footerLinks.residences.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[0.8rem] sm:text-sm text-zinc-400 hover:text-white transition-colors py-0.5 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <p className="text-[0.65rem] sm:text-xs tracking-[0.2em] uppercase text-zinc-500 font-semibold mb-3 sm:mb-4">
              Resources
            </p>
            <ul className="space-y-2 sm:space-y-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[0.8rem] sm:text-sm text-zinc-400 hover:text-white transition-colors py-0.5 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom — Contact + Copyright */}
        <div className="border-t border-zinc-800 pt-5 sm:pt-6 flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-0.5 sm:space-y-1">
            <p className="text-[0.8rem] sm:text-sm text-zinc-400">
              Rodriguez Corridor, Pasay City, Metro Manila, Philippines
            </p>
            <p className="text-[0.8rem] sm:text-sm text-zinc-500">
              info@aleeviacarter.com · +63 (2) 8123 4567
            </p>
          </div>
          <p className="text-[0.65rem] sm:text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} Aleevia Carter Residences. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
