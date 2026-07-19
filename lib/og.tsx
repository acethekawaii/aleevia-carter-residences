/**
 * Shared toolkit for the site's dynamic Open Graph / Twitter images.
 *
 * Every social share (Facebook, Messenger, Viber, X, LinkedIn) pulls a 1200×630
 * card. These are generated at build time with `next/og` (Satori), so the rules
 * are Satori's, not the browser's:
 *   - flexbox only (no grid), every element that has children needs an explicit
 *     `display: flex`;
 *   - colors must be hex/rgb — `oklch()` is not understood. The palette below is
 *     the sRGB conversion of the brand tokens in `globals.css`.
 *   - fonts must be real font files; the brand faces are vendored in
 *     `assets/fonts/` (latin subsets, woff).
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ReactElement, ReactNode } from "react";

import { SITE } from "./site";

/** 1200×630 is the universally safe card size across every network. */
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png" as const;
export const OG_ALT = `${SITE.name} — ${SITE.tagline}`;

/** Brand palette, converted from the `oklch()` tokens Satori can't parse. */
export const OG = {
  cream: "#f6f3eb",
  creamSoft: "rgba(246, 243, 235, 0.86)",
  ink: "#20241f",
  emerald: "#1c4031",
  emeraldDeep: "#0a2b1e",
  primary: "#2d5743",
  gold: "#c2a052",
  goldInk: "#292010",
  sage: "#5f7963",
} as const;

type FontWeight = 400 | 500 | 600;
type FontStyle = "normal" | "italic";
type OgFont = {
  name: string;
  data: Buffer;
  weight: FontWeight;
  style: FontStyle;
};

const FONT_FILES: ReadonlyArray<{
  file: string;
  name: string;
  weight: FontWeight;
  style: FontStyle;
}> = [
  { file: "spectral-400.woff", name: "Spectral", weight: 400, style: "normal" },
  { file: "spectral-600.woff", name: "Spectral", weight: 600, style: "normal" },
  {
    file: "spectral-400-italic.woff",
    name: "Spectral",
    weight: 400,
    style: "italic",
  },
  {
    file: "albert-500.woff",
    name: "Albert Sans",
    weight: 500,
    style: "normal",
  },
  {
    file: "albert-600.woff",
    name: "Albert Sans",
    weight: 600,
    style: "normal",
  },
];

/** Load every brand font face for an `ImageResponse` `fonts` option. */
export async function ogFonts(): Promise<OgFont[]> {
  return Promise.all(
    FONT_FILES.map(async ({ file, name, weight, style }) => ({
      name,
      data: await readFile(join(process.cwd(), "assets", "fonts", file)),
      weight,
      style,
    })),
  );
}

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

/**
 * Read an image from `public/` and return it as a data URI for use as an
 * `<img src>` inside an OG image. Returns `null` on any failure so a missing
 * asset degrades to the branded emerald canvas instead of failing the build.
 */
export async function loadPublicImage(
  relativePath: string,
): Promise<string | null> {
  try {
    const ext = relativePath.slice(relativePath.lastIndexOf(".")).toLowerCase();
    const mime = MIME[ext] ?? "image/png";
    const data = await readFile(join(process.cwd(), "public", relativePath));
    return `data:${mime};base64,${data.toString("base64")}`;
  } catch {
    return null;
  }
}

/** Cap on remote images pulled into an OG card (well under the 8MB OG limit). */
const MAX_REMOTE_BYTES = 4_000_000;

/**
 * Fetch a remote image (e.g. a blog cover) as a data URI. Returns `null` for
 * anything that isn't a reachable, reasonably sized image — a broken or
 * unreachable cover then falls back to the branded canvas rather than failing.
 */
export async function loadRemoteImage(
  url: string | null | undefined,
): Promise<string | null> {
  if (!url || !/^https?:\/\//i.test(url)) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const type = res.headers.get("content-type") ?? "image/jpeg";
    if (!type.startsWith("image/")) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength > MAX_REMOTE_BYTES) return null;
    return `data:${type};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export type EditorialOgProps = {
  /** Small gold uppercase line above the headline. */
  eyebrow: string;
  /** Headline lines. Wrap a word in `<i>…</i>` for the italic serif accent. */
  titleLines: ReactNode[];
  /** Headline font size in px. Default 68; drop it for longer titles. */
  titleSize?: number;
  /** Up to three quiet pills under the headline. */
  chips?: string[];
  /** Optional gold call-to-action button. */
  cta?: string;
  /** Data URI of the background photograph; falls back to emerald when absent. */
  photo?: string | null;
};

/**
 * The one card layout the whole site shares: a photograph darkened for
 * legibility, the wordmark, a serif headline, a gold rule, quiet detail pills,
 * and a gold CTA. Returns a Satori-ready element.
 */
export function EditorialOg({
  eyebrow,
  titleLines,
  titleSize = 68,
  chips = [],
  cta,
  photo,
}: EditorialOgProps): ReactElement {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: OG.emeraldDeep,
      }}
    >
      {photo ? (
        // biome-ignore lint/performance/noImgElement: Satori renders <img>; next/image is not available inside ImageResponse
        <img
          src={photo}
          alt=""
          width={OG_SIZE.width}
          height={OG_SIZE.height}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : null}

      {/* Vertical scrim: darkens the top band (wordmark) and the base. */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "linear-gradient(180deg, rgba(10,43,30,0.52) 0%, rgba(10,43,30,0.22) 32%, rgba(10,43,30,0.42) 70%, rgba(10,43,30,0.74) 100%)",
        }}
      />
      {/* Emerald panel from the left carries the type; the photo breathes right. */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "linear-gradient(90deg, rgba(10,43,30,0.90) 0%, rgba(10,43,30,0.72) 30%, rgba(10,43,30,0.32) 60%, rgba(10,43,30,0) 82%)",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: 64,
        }}
      >
        {/* Wordmark row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span
              style={{
                fontFamily: "Albert Sans",
                fontWeight: 600,
                fontSize: 25,
                letterSpacing: 6,
                color: OG.cream,
              }}
            >
              ALEEVIA CARTER
            </span>
            <span
              style={{
                fontFamily: "Albert Sans",
                fontWeight: 600,
                fontSize: 25,
                letterSpacing: 6,
                color: OG.gold,
                marginLeft: 12,
              }}
            >
              RESIDENCES
            </span>
          </div>
          <span
            style={{
              fontFamily: "Albert Sans",
              fontWeight: 500,
              fontSize: 16,
              letterSpacing: 4,
              color: OG.creamSoft,
            }}
          >
            PASAY CITY
          </span>
        </div>

        {/* Headline block */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontFamily: "Albert Sans",
              fontWeight: 600,
              fontSize: 20,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: OG.gold,
              marginBottom: 22,
            }}
          >
            {eyebrow}
          </span>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {titleLines.map((line, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed static lines
                key={i}
                style={{
                  display: "flex",
                  fontFamily: "Spectral",
                  fontWeight: 400,
                  fontSize: titleSize,
                  lineHeight: 1.04,
                  color: OG.cream,
                }}
              >
                {line}
              </div>
            ))}
          </div>

          {/* Gold rule */}
          <div
            style={{
              display: "flex",
              width: 72,
              height: 3,
              backgroundColor: OG.gold,
              marginTop: 30,
              marginBottom: 30,
            }}
          />

          {/* Detail pills + CTA */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {chips.map((chip) => (
                <div
                  key={chip}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: 18,
                    paddingRight: 18,
                    paddingTop: 9,
                    paddingBottom: 9,
                    borderRadius: 999,
                    border: `1px solid rgba(194,160,82,0.55)`,
                    backgroundColor: "rgba(246,243,235,0.08)",
                    fontFamily: "Albert Sans",
                    fontWeight: 500,
                    fontSize: 20,
                    color: OG.cream,
                  }}
                >
                  {chip}
                </div>
              ))}
            </div>

            {cta ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 24,
                  paddingRight: 24,
                  paddingTop: 14,
                  paddingBottom: 14,
                  borderRadius: 999,
                  backgroundColor: OG.gold,
                  fontFamily: "Albert Sans",
                  fontWeight: 600,
                  fontSize: 21,
                  color: OG.goldInk,
                }}
              >
                {cta}
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: "6px solid transparent",
                    borderBottom: "6px solid transparent",
                    borderLeft: `9px solid ${OG.goldInk}`,
                    marginLeft: 10,
                  }}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
