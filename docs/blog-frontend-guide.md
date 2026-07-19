# Aleevia Blog — Frontend Integration Guide

Read-only contract for the **public blog** on the Aleevia Carter landing site.
Everything the Next.js site needs to list and render blog posts is here — you do
**not** need to read the backend source. Content authoring (admin) is out of
scope; the landing only consumes **published** content.

---

## Base URL & conventions

- **Dev:** `http://localhost:8000/api/v1`
- **Prod:** `https://<api-domain>/api/v1`
- Put it in `NEXT_PUBLIC_API_BASE_URL`.
- All blog endpoints are **public** `GET`s — no auth header, no cookies.
- Timestamps are ISO 8601 strings (or `null`). IDs are UUID strings.

---

## Response envelope (read this first)

**Every** response is wrapped by the API:

```json
{ "statusCode": 200, "message": "Success", "data": <payload> }
```

So always read `json.data`. For **list** endpoints the payload is itself
`{ data, meta }` — meaning the array lives at `json.data.data` and pagination at
`json.data.meta`. Yes, `data.data`. Don't trip on it.

**Error shape** (any 4xx/5xx):

```json
{
  "statusCode": 404,
  "message": "Post not found",
  "error": "Not Found",
  "path": "/api/v1/posts/unknown",
  "timestamp": "2026-07-18T09:00:00.000Z"
}
```

Validation errors use the same shape but `message` is a **string array**.

---

## Endpoints

### 1. `GET /posts` — list published posts

Returns published, non-archived posts, newest first (`publishedAt` desc).
Cards only — **no body** (`content` is omitted from lists).

Query params (all optional):

| param   | type       | default | notes                                         |
| ------- | ---------- | ------- | --------------------------------------------- |
| `page`  | int ≥ 1    | `1`     |                                               |
| `limit` | int 1–50   | `10`    | clamped to 50                                 |
| `tag`   | string     | —       | filter by tag **slug** (get slugs from `/tags`) |
| `q`     | string     | —       | search `title` + `excerpt`, case-insensitive  |

**Payload:** `{ data: PostCard[], meta: PageMeta }`

```ts
type PostCard = {
  id: string;
  title: string;
  slug: string;                 // use for the post URL: /blog/[slug]
  excerpt: string | null;
  coverImageUrl: string | null; // see "Images"
  publishedAt: string | null;   // ISO
  tags: { name: string; slug: string }[];
};

type PageMeta = {
  total: number;
  page: number;
  limit: number;
  lastPage: number;             // ceil(total / limit), min 1
};
```

**Example** — `GET /api/v1/posts?tag=amenities&page=1&limit=9`:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "data": [
      {
        "id": "1f8c...",
        "title": "Inside the Amenities of Aleevia Carter Residences",
        "slug": "amenities-at-aleevia-carter",
        "excerpt": "From a panoramic gym to a golden-hour roofdeck, a look at the four shared spaces...",
        "coverImageUrl": "/assets/amenities/lounge-area.png",
        "publishedAt": "2026-07-18T09:00:00.000Z",
        "tags": [
          { "name": "Amenities", "slug": "amenities" },
          { "name": "Lifestyle", "slug": "lifestyle" }
        ]
      }
    ],
    "meta": { "total": 1, "page": 1, "limit": 9, "lastPage": 1 }
  }
}
```

### 2. `GET /posts/:slug` — full post

Full published post, including the raw markdown `content`. Returns **404** if the
slug does not exist, is not `PUBLISHED`, or is archived.

**Payload:** `PostDetail`

```ts
type PostDetail = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  content: string;              // RAW MARKDOWN — render + SANITIZE (see below)
  status: "PUBLISHED";          // public endpoint only ever returns published
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
  publishedAt: string | null;   // ISO
  archivedAt: null;             // always null on the public endpoint
  authorId: string | null;      // no byline name is exposed yet
  createdAt: string;
  updatedAt: string;
  tags: { name: string; slug: string }[];
};
```

### 3. `GET /tags` — tag list

Only tags that back **at least one published post**. Use for filter chips / nav.
Sorted by name.

**Payload:** `Tag[]`

```ts
type Tag = { name: string; slug: string };
```

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    { "name": "Amenities", "slug": "amenities" },
    { "name": "Lifestyle", "slug": "lifestyle" }
  ]
}
```

---

## Rendering the body (markdown)

- `content` is **raw Markdown**, stored **unsanitized**.
- **You must sanitize on render — the backend does not.** Use a markdown pipeline
  with sanitization, e.g. `react-markdown` + `rehype-sanitize`, or `unified`
  (`remark-parse` → `remark-rehype` → `rehype-sanitize` → `rehype-stringify`).
  This is the XSS boundary; do not `dangerouslySetInnerHTML` unsanitized HTML.
- The page **chrome is fixed** (hero, title, cover, tag row, date, body, footer);
  the markdown fills the **body** only.

---

## Images

- `coverImageUrl` and `ogImageUrl` may be:
  - a **relative path** (e.g. `/assets/amenities/lounge-area.png`, served from
    Next `public/`) during the current pre-S3 phase, **or**
  - an **absolute URL** later, once object storage (Garage/S3) is live.
- `next/image` handles a relative path directly. But `og:image` **must be
  absolute** — prepend your site origin when the stored value is relative.
- Any image field can be `null` — always supply a fallback.

---

## SEO (frontend owns it)

The backend **stores** the source fields; Next.js **renders** the tags and builds
the sitemap. There are **no SEO endpoints** on the backend.

Per post:

- **Title:** `metaTitle ?? title`
- **Description:** `metaDescription ?? excerpt`
- **Canonical:** `https://<site>/blog/{slug}`
- **OpenGraph image:** `ogImageUrl` (make absolute)
- **JSON-LD `BlogPosting`:** `headline = title`, `datePublished = publishedAt`,
  `dateModified = updatedAt`, `image = ogImageUrl`.

`sitemap.xml`: page through `GET /posts` (`meta.lastPage`), emit one
`/blog/{slug}` entry per post with `lastmod = updatedAt` (from the detail
endpoint) or `publishedAt`.

```ts
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug); // PostDetail
  const url = `https://aleeviacarter.com/blog/${post.slug}`;
  const image = toAbsolute(post.ogImageUrl ?? post.coverImageUrl);
  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt ?? undefined,
    alternates: { canonical: url },
    openGraph: { title: post.title, url, images: image ? [image] : [] },
  };
}
```

---

## Fetch example (Next.js server component)

```ts
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!; // http://localhost:8000/api/v1

async function getPosts(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/posts?${qs}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`posts ${res.status}`);
  const json = await res.json();
  return json.data as { data: PostCard[]; meta: PageMeta }; // note: json.data.data
}

async function getPost(slug: string) {
  const res = await fetch(`${BASE}/posts/${slug}`, { next: { revalidate: 60 } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`post ${res.status}`);
  const json = await res.json();
  return json.data as PostDetail;
}
```

---

## Out of scope for the landing

- **Auth / login and admin write routes exist** (`/admin/posts` behind JWT), but
  the public site **never** calls them. Content is created by the team via the
  API or the content seed; the landing is read-only.
- No client-side keys or tokens are needed.

---

## Quick reference

| Method | Path            | Returns                                   |
| ------ | --------------- | ----------------------------------------- |
| `GET`  | `/posts`        | `{ data: PostCard[], meta: PageMeta }`    |
| `GET`  | `/posts/:slug`  | `PostDetail` (404 if not published)       |
| `GET`  | `/tags`         | `Tag[]`                                    |

All wrapped in `{ statusCode, message, data }`.
