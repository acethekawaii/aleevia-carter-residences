import type { MetadataRoute } from "next";

import { getPosts, toAbsoluteUrl } from "@/lib/blog";
import { SITE } from "@/lib/site";

/** Rebuild the sitemap hourly so new journal posts appear without a deploy. */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE.url}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE.url}/contacts`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/financing/pag-ibig`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE.url}/financing/chinabank`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE.url}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Published posts. The API clamps `limit` to 50, so page through to stay
  // complete. getPosts degrades to an empty list on failure, so a transient
  // outage simply omits posts instead of breaking the sitemap.
  const PAGE_LIMIT = 50;
  const MAX_PAGES = 20;
  const first = await getPosts({ limit: PAGE_LIMIT, page: 1 });
  const posts = [...first.data];
  for (let page = 2; page <= Math.min(first.meta.lastPage, MAX_PAGES); page++) {
    const next = await getPosts({ limit: PAGE_LIMIT, page });
    posts.push(...next.data);
  }

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => {
    const cover = toAbsoluteUrl(post.coverImageUrl);
    return {
      url: `${SITE.url}/blog/${post.slug}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
      changeFrequency: "monthly",
      priority: 0.6,
      images: cover ? [cover] : undefined,
    };
  });

  return [...staticRoutes, ...postRoutes];
}
