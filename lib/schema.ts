/**
 * JSON-LD builders. These describe the business, the site, breadcrumbs, and
 * articles to search engines for rich results and knowledge-panel eligibility.
 *
 * Every fact is sourced from `lib/site.ts` — the same single source of truth as
 * the rest of the app. Nothing here is invented.
 */

import { type Agent, ROLE_LABELS } from "@/types/agent";
import type { PostDetail } from "./blog";
import { CONTACT, SITE } from "./site";

/** Stable @id anchors so nodes can reference one another across the graph. */
export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;

const HERO_IMAGE = `${SITE.url}/assets/hero-exterior.jpg`;

/** Absolute URL for a site-relative path. */
function abs(path: string): string {
  return path.startsWith("http") ? path : `${SITE.url}${path}`;
}

/** The selling entity — a local real-estate business in Pasay City. */
export function organizationSchema() {
  return {
    "@type": "RealEstateAgent",
    "@id": ORG_ID,
    name: SITE.name,
    legalName: SITE.developer,
    url: SITE.url,
    image: HERO_IMAGE,
    logo: HERO_IMAGE,
    description: SITE.description,
    telephone: CONTACT.phoneHref.replace("tel:", ""),
    email: CONTACT.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "614 E. Rodriguez St.",
      addressLocality: "Pasay City",
      addressRegion: "Metro Manila",
      addressCountry: "PH",
    },
    areaServed: "Metro Manila, Philippines",
    hasMap: CONTACT.mapsUrl,
    sameAs: [CONTACT.facebook],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "07:00",
        closes: "16:00",
      },
    ],
  };
}

/** The website itself, published by the organization. */
export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE.name,
    url: SITE.url,
    inLanguage: "en-PH",
    publisher: { "@id": ORG_ID },
  };
}

export type Crumb = { name: string; path: string };

/** A breadcrumb trail; pass the trail from home down to the current page. */
export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: abs(crumb.path),
    })),
  };
}

/**
 * A published broker or sales agent, for local search. Every value is read
 * straight from the CMS payload — an unknown `role` simply omits `jobTitle`,
 * and `image` is absolutised because a photo may be stored as a root-relative
 * path.
 */
export function personSchema(agent: Agent) {
  return {
    "@type": "Person",
    name: `${agent.firstName} ${agent.lastName}`,
    jobTitle: ROLE_LABELS[agent.role],
    email: agent.email,
    telephone: agent.contactNumber,
    image: agent.photoUrl ? abs(agent.photoUrl) : undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: agent.city,
      addressCountry: agent.country ?? undefined,
    },
    worksFor: { "@id": ORG_ID },
  };
}

/** A single journal article. */
export function blogPostingSchema(post: PostDetail, cover: string | null) {
  const url = `${SITE.url}/blog/${post.slug}`;
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt ?? undefined,
    image: [cover ?? HERO_IMAGE],
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt,
    inLanguage: "en-PH",
    author: { "@type": "Organization", name: SITE.name, url: SITE.url },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
    mainEntityOfPage: url,
    keywords: post.tags.map((tag) => tag.name).join(", ") || undefined,
  };
}
