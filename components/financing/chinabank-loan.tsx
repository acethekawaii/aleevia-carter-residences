import { BadgeCheck, Briefcase, Building2, FileText } from "lucide-react";
import Image from "next/image";

import { AffordabilityCalculator } from "@/components/financing/affordability-calculator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CtaLink } from "@/components/ui/cta-link";
import { Kicker } from "@/components/ui/kicker";

const HIGHLIGHTS = [
  { label: "Interest rate", value: "From 6.25%", note: "3-year fixing" },
  { label: "Loan term", value: "Up to 25 yrs", note: "Flexible amortization" },
  { label: "Max loanable", value: "Up to 80%", note: "Of property value" },
];

const ELIGIBILITY = [
  "Filipino citizen (or a foreign national allowed by law)",
  "At least 21 years old at application, and not over 65 at loan maturity",
  "Minimum gross monthly income of ₱50,000",
  "If employed: at least 2 years of regular or permanent employment",
  "If self-employed: a business operating profitably for at least 3 years",
];

const DOCUMENTS = [
  {
    title: "Employed applicants",
    icon: Briefcase,
    items: [
      "Completed loan application form",
      "Two valid government-issued IDs",
      "Certificate of Employment with compensation",
      "Latest Income Tax Return or BIR Form 2316",
      "Payslips for the last 3 months",
    ],
  },
  {
    title: "Self-employed / business owners",
    icon: Building2,
    items: [
      "Completed loan application form",
      "Two valid government-issued IDs",
      "DTI or SEC registration",
      "Audited financial statements (last 2 years)",
      "Bank statements for the last 6 months",
    ],
  },
];

const PROCESS = [
  {
    title: "Pre-qualification",
    description: "Share a few basics so we can gauge your borrowing capacity.",
  },
  {
    title: "Application & submission",
    description: "Complete the form and submit the required documents.",
  },
  {
    title: "Credit evaluation",
    description: "The bank reviews your finances and appraises the property.",
  },
  {
    title: "Loan approval",
    description:
      "On approval, you receive a Letter of Guaranty or Notice of Approval.",
  },
  {
    title: "Signing & release",
    description:
      "Sign the documents, settle the fees, and the loan is released.",
  },
];

export function ChinabankLoan() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-secondary/40">
        <div className="main-container pt-32 pb-16 md:pt-40 md:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="order-2 lg:order-1 lg:col-span-7">
              {/* <div className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3.5 py-1.5 text-caption font-medium uppercase tracking-label text-muted-foreground">
                <BadgeCheck className="size-3.5 text-primary" />
                Accredited partner
              </div> */}
              <h1 className="mt-7 font-heading text-h1 font-light text-balance text-foreground">
                Chinabank{" "}
                <span className="italic text-primary">housing loan.</span>
              </h1>
              <p className="mt-6 max-w-[52ch] text-body text-muted-foreground">
                Finance your home at Aleevia Carter through one of the country's
                most trusted banks. Review the eligibility, documents, and
                process below — then talk to our specialists.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <CtaLink href="/contacts" variant="solid">
                  Get pre-qualified
                </CtaLink>
                <CtaLink href="#calculator" variant="outline" arrow={false}>
                  Try the calculator
                </CtaLink>
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-5">
              <figure className="relative aspect-4/5 w-full overflow-hidden rounded-md border border-border bg-card">
                <Image
                  src="/assets/financing/chinabank-housing-loan-hero.webp"
                  alt="A brass house key on a burgundy loan folio and architectural plans in a warm Japandi interior."
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                  priority
                />
              </figure>
            </div>
          </div>

          <div className="mt-16 grid rounded-md border border-border bg-card sm:grid-cols-3 sm:divide-x divide-border">
            {HIGHLIGHTS.map((highlight) => (
              <div
                key={highlight.label}
                className="border-b border-border p-6 last:border-b-0 sm:border-b-0 md:p-8"
              >
                <p className="text-caption font-medium uppercase tracking-label text-muted-foreground">
                  {highlight.label}
                </p>
                <p className="mt-3 font-heading text-h4 font-light text-foreground">
                  {highlight.value}
                </p>
                <p className="mt-1 text-small text-muted-foreground">
                  {highlight.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Details + process */}
      <section className="main-container py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-7">
            <Kicker tone="gold">What you'll need</Kicker>
            <h2 className="mt-6 font-heading text-h3 font-normal text-foreground">
              Eligibility & documents
            </h2>

            <Accordion
              defaultValue={["eligibility"]}
              className="mt-8 border-t border-border"
            >
              <AccordionItem value="eligibility">
                <AccordionTrigger className="py-6 font-heading text-h4 font-normal hover:no-underline">
                  Eligibility criteria
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <ul className="space-y-3 text-body text-muted-foreground">
                    {ELIGIBILITY.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-2.5 size-1.5 shrink-0 bg-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="documents">
                <AccordionTrigger className="py-6 font-heading text-h4 font-normal hover:no-underline">
                  Required documents
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="grid gap-5 md:grid-cols-2">
                    {DOCUMENTS.map((category) => {
                      const Icon = category.icon;
                      return (
                        <div
                          key={category.title}
                          className="rounded-md border border-border bg-card p-6"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex size-9 items-center justify-center rounded-sm border border-border text-primary">
                              <Icon className="size-4" />
                            </span>
                            <h3 className="text-caption font-semibold uppercase tracking-label text-foreground">
                              {category.title}
                            </h3>
                          </div>
                          <ul className="mt-5 space-y-3">
                            {category.items.map((item) => (
                              <li
                                key={item}
                                className="flex items-start gap-3 text-small text-muted-foreground"
                              >
                                <FileText className="mt-0.5 size-3.5 shrink-0 text-foreground/30" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="rounded-md border border-border bg-card">
                <div className="border-b border-border px-6 py-5">
                  <p className="text-caption font-medium uppercase tracking-label text-muted-foreground">
                    Step by step
                  </p>
                  <h3 className="mt-1 font-heading text-h4 font-normal text-foreground">
                    The process
                  </h3>
                </div>
                <ol className="space-y-6 p-6">
                  {PROCESS.map((step, index) => (
                    <li key={step.title} className="flex items-start gap-4">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-sm border border-border text-caption font-medium tabular-nums text-primary">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="text-small font-semibold text-foreground">
                          {step.title}
                        </h4>
                        <p className="mt-1 text-small text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* The Chinabank calculator — the CTA above scrolls here */}
      <section className="border-t border-border bg-secondary/40 py-20 md:py-28">
        <div className="main-container">
          <div className="max-w-[48ch]">
            <Kicker tone="gold">Estimate your loan</Kicker>
            <h2 className="mt-6 font-heading text-h3 font-normal text-foreground">
              Chinabank affordability calculator
            </h2>
            <p className="mt-6 text-body text-muted-foreground">
              A quick estimate using Chinabank's indicative rate. Your actual
              terms are confirmed by the bank during evaluation.
            </p>
          </div>
          <div className="mt-12">
            <AffordabilityCalculator
              id="calculator"
              lenderName="Chinabank"
              interestRate={0.0625}
              maxAmortizationRatio={0.35}
              loanTerms={[5, 10, 15, 20, 25]}
              defaultTerm={20}
              maxLtv={0.8}
              rateNote="3-year fixing"
            />
          </div>
        </div>
      </section>
    </>
  );
}
