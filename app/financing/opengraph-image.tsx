import { ImageResponse } from "next/og";

import {
  EditorialOg,
  loadPublicImage,
  OG_CONTENT_TYPE,
  OG_SIZE,
  ogFonts,
} from "@/lib/og";
import { SITE } from "@/lib/site";

export const alt = `Financing your home at ${SITE.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Card for /financing/* — Pag-IBIG and Chinabank pages. */
export default async function Image() {
  const [fonts, photo] = await Promise.all([
    ogFonts(),
    loadPublicImage("assets/interiors/unit-7/open-plan-living-area.png"),
  ]);

  return new ImageResponse(
    EditorialOg({
      eyebrow: "Financing",
      titleLines: [
        "Own it with",
        <>
          Pag-IBIG or
          <i style={{ fontStyle: "italic", marginLeft: 16 }}>Chinabank</i>
        </>,
      ],
      chips: ["Pag-IBIG ready", "Bank-accredited", "Guided process"],
      cta: "Book a viewing",
      photo,
    }),
    { ...size, fonts },
  );
}
