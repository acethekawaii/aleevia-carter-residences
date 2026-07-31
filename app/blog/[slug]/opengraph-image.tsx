import { ImageResponse } from "next/og";

import { getPost, toAbsoluteUrl } from "@/lib/blog";
import {
  EditorialOg,
  loadPublicImage,
  loadRemoteImage,
  OG_ALT,
  OG_CONTENT_TYPE,
  OG_SIZE,
  ogFonts,
} from "@/lib/og";

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

type Params = { params: Promise<{ slug: string }> };

/**
 * Per-article card. Uses the post's own cover when reachable, then a warm
 * interior, then the branded emerald canvas — a share never renders a broken
 * image regardless of what the API returns.
 */
export default async function Image({ params }: Params) {
  const { slug } = await params;
  const [fonts, post] = await Promise.all([ogFonts(), getPost(slug)]);

  const cover = post
    ? toAbsoluteUrl(post.ogImageUrl ?? post.coverImageUrl)
    : null;
  const photo =
    (await loadRemoteImage(cover)) ??
    (await loadPublicImage("assets/interiors/unit-7/living-dining-area.png"));

  return new ImageResponse(
    EditorialOg({
      eyebrow: post?.tags[0]?.name ?? "Journal",
      titleLines: [post?.title ?? "The Aleevia Carter Journal"],
      titleSize: 50,
      chips: post?.tags.slice(0, 3).map((tag) => tag.name) ?? [],
      cta: "Read the story",
      photo,
    }),
    { ...size, fonts },
  );
}
