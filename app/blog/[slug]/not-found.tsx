import { CtaLink } from "@/components/ui/cta-link";
import { Kicker } from "@/components/ui/kicker";

export default function ArticleNotFound() {
  return (
    <section className="main-container flex min-h-[60svh] items-center pt-32 pb-20 md:pt-40">
      <div className="max-w-[48ch]">
        <Kicker tone="gold">The Journal</Kicker>
        <h1 className="mt-6 font-heading text-h2 font-light text-balance text-foreground">
          We couldn't find that story.
        </h1>
        <p className="mt-6 text-body text-muted-foreground">
          It may have moved, or the link might be off by a letter. Head back to
          the Journal to browse everything we've written — or come see the homes
          in person.
        </p>
        <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
          <CtaLink href="/blog" variant="solid" arrow={false}>
            Back to the Journal
          </CtaLink>
          <CtaLink href="/contacts" variant="link">
            Book a viewing
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
