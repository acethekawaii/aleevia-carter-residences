import { ImageResponse } from "next/og";

import {
  EditorialOg,
  loadPublicImage,
  OG_ALT,
  OG_CONTENT_TYPE,
  OG_SIZE,
  ogFonts,
} from "@/lib/og";

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Site-wide default card. Inherited by every route without its own OG image. */
export default async function Image() {
  const [fonts, photo] = await Promise.all([
    ogFonts(),
    loadPublicImage("assets/hero-exterior.jpg"),
  ]);

  return new ImageResponse(
    EditorialOg({
      eyebrow: "Pre-selling · Pasay City",
      titleLines: [
        "Your Haven in the",
        <>
          Heart of the
          <i style={{ fontStyle: "italic", marginLeft: 16 }}>City</i>
        </>,
      ],
      chips: ["1 & 2-BR lofts", "Pag-IBIG ready", "Japandi design"],
      cta: "Book a viewing",
      photo,
    }),
    { ...size, fonts },
  );
}
