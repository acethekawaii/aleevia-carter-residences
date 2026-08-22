"use client";

import { type LucideIcon, Mail, Phone, Search, Users } from "lucide-react";
import Image from "next/image";
import { type ReactNode, useId, useState } from "react";

import { CtaLink } from "@/components/ui/cta-link";
import { CONTACT } from "@/lib/site";
import { type Agent, ROLE_LABELS } from "@/types/agent";

/**
 * The published broker roster, below the booking calendar and the message form
 * as this page's third way through to a person — this one by name.
 *
 * A client component because the search runs over the array it is handed: the
 * whole roster is single or low double figures, so there is no request, no
 * debounce and no loading state. It is still server-rendered, which is what
 * keeps the roster itself in the initial HTML.
 */
export function AgentsDirectory({ agents }: { agents: Agent[] }) {
  const [query, setQuery] = useState("");
  const searchId = useId();

  const term = query.trim().toLowerCase();
  const visible = term
    ? agents.filter(
        (agent) =>
          `${agent.firstName} ${agent.lastName}`.toLowerCase().includes(term) ||
          agent.city.toLowerCase().includes(term) ||
          (agent.country ?? "").toLowerCase().includes(term),
      )
    : agents;

  return (
    <section
      aria-labelledby="agents-heading"
      className="border-t border-border bg-background"
    >
      <div className="main-container py-16 md:py-24">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="max-w-[46ch]">
            <h2
              id="agents-heading"
              className="font-heading text-h3 font-light text-balance text-foreground"
            >
              Or reach a broker{" "}
              <span className="italic text-primary">directly.</span>
            </h2>
            <p className="mt-6 text-body text-muted-foreground">
              Prefer to speak with someone by name? Email or call any of our
              brokers and sales agents.
            </p>
          </div>

          {agents.length > 0 && (
            <search className="relative w-full md:w-72 md:shrink-0">
              <label htmlFor={searchId} className="sr-only">
                Search agents by name or city
              </label>
              <Search
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <input
                id={searchId}
                type="search"
                value={query}
                autoComplete="off"
                placeholder="Search name or city"
                onChange={(event) => setQuery(event.target.value)}
                className="h-12 w-full rounded-sm border border-input bg-transparent pr-4 pl-11 text-body text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
              />
            </search>
          )}
        </div>

        {agents.length === 0 ? (
          <EmptyRoster />
        ) : (
          <>
            <p role="status" className="sr-only">
              {visible.length} of {agents.length} agents shown.
            </p>
            {visible.length === 0 ? (
              <NoMatches term={query.trim()} onClear={() => setQuery("")} />
            ) : (
              <ul className="mt-12 border-t border-border/70 md:mt-14">
                {visible.map((agent) => (
                  <AgentRow key={agent.id} agent={agent} />
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function AgentRow({ agent }: { agent: Agent }) {
  const name = `${agent.firstName} ${agent.lastName}`;
  // Typed as the two known roles, but this is a runtime lookup: a third role
  // shipping server-side collapses the label rather than printing itself.
  const roleLabel = ROLE_LABELS[agent.role] ?? "";
  // The country is stored only for an agent based abroad, so on its own the
  // city is the whole location — never a city with a trailing comma.
  const location = agent.country
    ? `${agent.city}, ${agent.country}`
    : agent.city;
  const meta = agent.licenseNumber
    ? `PRC ${agent.licenseNumber} · ${location}`
    : location;

  return (
    <li className="border-b border-border/70 py-7 md:py-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
        <div className="flex min-w-0 flex-1 items-center gap-5">
          <AgentAvatar agent={agent} />
          <div className="min-w-0">
            {roleLabel && (
              <p className="text-caption font-medium uppercase tracking-label text-muted-foreground">
                {roleLabel}
              </p>
            )}
            <h3 className="mt-1 font-heading text-lead font-normal text-foreground">
              {name}
            </h3>
            <p className="mt-1.5 text-small text-muted-foreground">{meta}</p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-1 md:items-end">
          <ContactLink
            href={`mailto:${agent.email}`}
            icon={Mail}
            context={`Email ${name}:`}
          >
            {agent.email}
          </ContactLink>
          {/* Punctuation is stripped for the href only. The number is shown as
              it was typed, which is the format Filipino readers expect. */}
          <ContactLink
            href={`tel:${agent.contactNumber.replace(/[^\d+]/g, "")}`}
            icon={Phone}
            context={`Call ${name}:`}
          >
            {agent.contactNumber}
          </ContactLink>
        </div>
      </div>
    </li>
  );
}

/**
 * A stored headshot, or the initials on the brand's emerald tile. A monogram
 * reads as deliberate where a grey silhouette would read as broken.
 */
function AgentAvatar({ agent }: { agent: Agent }) {
  if (!agent.photoUrl) {
    const initials =
      `${agent.firstName.charAt(0)}${agent.lastName.charAt(0)}`.toUpperCase();

    return (
      <span
        aria-hidden
        // `pl-1` offsets the trailing letter-space of the monogram tracking,
        // which would otherwise leave the pair sitting left of centre.
        className="flex size-14 shrink-0 items-center justify-center rounded-md bg-emerald pl-1 font-heading text-lg font-light uppercase tracking-monogram text-gold"
      >
        {initials}
      </span>
    );
  }

  // Decorative: the name it belongs to is the next thing in the row.
  return (
    <Image
      src={agent.photoUrl}
      alt=""
      width={56}
      height={56}
      className="size-14 shrink-0 rounded-md object-cover"
    />
  );
}

/**
 * The visible text is the address itself, so the person's name is carried in a
 * screen-reader prefix rather than in an `aria-label` that would replace it —
 * otherwise the list reads as "Email, Email, Email" all the way down.
 */
function ContactLink({
  href,
  icon: Icon,
  context,
  children,
}: {
  href: string;
  icon: LucideIcon;
  context: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className="group inline-flex min-h-11 items-center gap-2.5 rounded-sm text-small text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Icon
        aria-hidden
        className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
      />
      <span className="sr-only">{context}</span>
      <span className="break-words">{children}</span>
    </a>
  );
}

/**
 * Nothing published, or the fetch failed — indistinguishable here on purpose.
 * Either way the visitor is handed a person instead of a gap.
 */
function EmptyRoster() {
  return (
    <div className="mt-12 flex flex-col items-start rounded-md border border-border bg-card p-8 md:mt-14 md:p-12">
      <span className="inline-flex size-11 items-center justify-center rounded-sm bg-secondary text-primary">
        <Users className="size-5" aria-hidden />
      </span>
      <h3 className="mt-6 font-heading text-h4 font-normal text-foreground">
        Our agents will be listed here shortly.
      </h3>
      <p className="mt-3 max-w-[52ch] text-body text-muted-foreground">
        We're putting the team's details together. In the meantime, pick a time
        on the calendar above or reach {CONTACT.contactName} directly.
      </p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <CtaLink href={CONTACT.phoneHref} variant="solid" arrow={false}>
          <Phone className="size-4" />
          {CONTACT.phone}
        </CtaLink>
        <CtaLink href={CONTACT.emailHref} variant="outline" arrow={false}>
          <Mail className="size-4" />
          Email us
        </CtaLink>
      </div>
    </div>
  );
}

function NoMatches({ term, onClear }: { term: string; onClear: () => void }) {
  return (
    <p className="mt-12 border-t border-border/70 pt-8 text-body text-muted-foreground md:mt-14">
      No agents match &ldquo;{term}&rdquo;.{" "}
      <button
        type="button"
        onClick={onClear}
        className="rounded-sm text-primary underline decoration-1 underline-offset-4 transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Clear the search
      </button>
      .
    </p>
  );
}
