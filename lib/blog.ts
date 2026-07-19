/**
 * Public blog data layer for the Aleevia Carter landing site.
 *
 * Read-only consumer of the aleevia-be blog API (see
 * docs/blog-frontend-guide.md). Every response is wrapped in a
 * `{ statusCode, message, data }` envelope; list payloads nest a second time as
 * `data.data`. These helpers unwrap that for the rest of the app.
 */

import { SITE } from "./site";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

/** Cards, tags, and posts are stable content; 60s ISR keeps them fresh enough. */
const REVALIDATE_SECONDS = 60;

/** Words-per-minute used for the reading-time estimate. */
const WORDS_PER_MINUTE = 200;

export type Tag = { name: string; slug: string };

/** List-endpoint shape: cards carry no `content`. */
export type PostCard = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: string | null;
  tags: Tag[];
};

/** Detail-endpoint shape: the full post including raw markdown `content`. */
export type PostDetail = PostCard & {
  content: string;
  status: "PUBLISHED";
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
  archivedAt: null;
  authorId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PageMeta = {
  total: number;
  page: number;
  limit: number;
  lastPage: number;
};

export type PostListResult = { data: PostCard[]; meta: PageMeta };

export type PostListParams = {
  page?: number;
  limit?: number;
  tag?: string;
  q?: string;
};

type Envelope<T> = { statusCode: number; message: string; data: T };

class BlogApiError extends Error {
  status: number;
  constructor(status: number, path: string) {
    super(`Aleevia blog API responded ${status} for ${path}`);
    this.name = "BlogApiError";
    this.status = status;
  }
}

async function fetchEnvelope<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!res.ok) throw new BlogApiError(res.status, path);

  const json = (await res.json()) as Envelope<T>;
  return json.data;
}

function emptyResult(params: PostListParams): PostListResult {
  return {
    data: [],
    meta: {
      total: 0,
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      lastPage: 1,
    },
  };
}

/**
 * Published posts, newest first. Resilient by design: a transient API failure
 * degrades to an empty result so the Journal renders its warm empty state
 * rather than a crash. The error is logged server-side for observability.
 */
export async function getPosts(
  params: PostListParams = {},
): Promise<PostListResult> {
  const query = new URLSearchParams();
  if (params.page && params.page > 1) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.tag) query.set("tag", params.tag);
  if (params.q) query.set("q", params.q);

  const suffix = query.toString() ? `?${query}` : "";

  try {
    return await fetchEnvelope<PostListResult>(`/posts${suffix}`);
  } catch (error) {
    console.error("[blog] getPosts failed:", error);
    return emptyResult(params);
  }
}

/**
 * A single published post, or `null` when the slug is unknown / unpublished /
 * archived (404). Any other failure re-throws so a genuine outage surfaces on
 * that specific URL rather than masquerading as a missing post.
 */
export async function getPost(slug: string): Promise<PostDetail | null> {
  try {
    return await fetchEnvelope<PostDetail>(
      `/posts/${encodeURIComponent(slug)}`,
    );
  } catch (error) {
    if (error instanceof BlogApiError && error.status === 404) return null;
    throw error;
  }
}

/** Tags backing at least one published post. Degrades to `[]` on failure. */
export async function getTags(): Promise<Tag[]> {
  try {
    return await fetchEnvelope<Tag[]>("/tags");
  } catch (error) {
    console.error("[blog] getTags failed:", error);
    return [];
  }
}

/* --------------------------------- helpers -------------------------------- */

/**
 * Absolute URL for a stored image path. `coverImageUrl` / `ogImageUrl` may be a
 * relative `public/` path (pre-S3) or already absolute; OpenGraph requires an
 * absolute URL, so relative paths are prefixed with the site origin.
 */
export function toAbsoluteUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE.url}${url.startsWith("/") ? "" : "/"}${url}`;
}

/** "July 18, 2026" for display; returns null for null/invalid input. */
export function formatPostDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/** Whole-minute reading estimate, floored at 1. */
export function readingTimeMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/**
 * The stored markdown opens with an `# H1` that repeats the post title, which
 * the page chrome already renders. Strip that single leading H1 so the title
 * is not duplicated in the body.
 */
export function stripLeadingH1(markdown: string): string {
  return markdown.replace(/^﻿?\s*#\s+.*(?:\r?\n)+/, "");
}

/** Deterministic, GitHub-ish heading slug. Shared by the TOC and the renderer. */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * A slugger that disambiguates repeated heading text with a numeric suffix,
 * mirroring how the body renderer assigns ids. Create one per render so the
 * table of contents and the rendered headings agree.
 */
export function createHeadingSlugger(): (text: string) => string {
  const seen = new Map<string, number>();
  return (text: string) => {
    const base = slugifyHeading(text) || "section";
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count}`;
  };
}

export type TocItem = { id: string; text: string; level: 2 | 3 };

/**
 * Extract h2/h3 headings (after stripping the leading H1) for the in-article
 * table of contents. Fenced code blocks are ignored so a `## comment` inside a
 * snippet never becomes a heading.
 */
export function extractHeadings(markdown: string): TocItem[] {
  const slug = createHeadingSlugger();
  const items: TocItem[] = [];
  let inFence = false;

  for (const line of stripLeadingH1(markdown).split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;

    const level = match[1].length as 2 | 3;
    const text = match[2].trim();
    items.push({ id: slug(text), text, level });
  }

  return items;
}
