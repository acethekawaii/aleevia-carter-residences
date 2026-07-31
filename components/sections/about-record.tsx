import { CtaLink } from "@/components/ui/cta-link";
import { Reveal } from "@/components/ui/reveal";
import { BROCHURE_PATH, CONTACT, LEGAL, SITE } from "@/lib/site";

const RECORD = [
  { label: "Developer", value: SITE.developer },
  { label: "Address", value: CONTACT.addressFull },
  {
    label: "Licensing",
    value: `${LEGAL.registration}. ${LEGAL.licenseToSell}. ${LEGAL.issued}.`,
  },
];

/**
 * The registration details, stated plainly. They exist in the footer's fine
 * print already; here they are the point — the one part of the project a
 * visitor can verify against a public register before they ever visit.
 */
export function AboutRecord() {
  return (
    <section
      aria-labelledby="record-heading"
      className="border-y border-border bg-secondary/40 py-20 md:py-24"
    >
      <div className="main-container">
        <Reveal className="grid gap-10 md:grid-cols-12 md:gap-12">
          <h2
            id="record-heading"
            className="font-heading text-h4 font-normal text-foreground md:col-span-4"
          >
            The paperwork.
          </h2>

          <div className="md:col-span-8">
            <dl>
              {RECORD.map((row) => (
                <div
                  key={row.label}
                  className="grid gap-1.5 border-t border-border py-5 first:border-t-0 first:pt-0 sm:grid-cols-12 sm:gap-6"
                >
                  <dt className="text-caption font-medium uppercase tracking-label text-muted-foreground sm:col-span-4">
                    {row.label}
                  </dt>
                  <dd className="text-body text-foreground/85 sm:col-span-8">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>

            <CtaLink
              href={BROCHURE_PATH}
              variant="outline"
              className="mt-10 md:mt-12"
            >
              Download the brochure
            </CtaLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
