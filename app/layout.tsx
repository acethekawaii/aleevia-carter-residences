import type { Metadata, Viewport } from "next";
import { Albert_Sans, Spectral } from "next/font/google";
import "./globals.css";
import { ConciergeChat } from "@/components/concierge/concierge-chat";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { JsonLd } from "@/components/seo/json-ld";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-heading",
});

const albertSans = Albert_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    // og:image is supplied site-wide by app/opengraph-image.tsx and overridden
    // per-segment (financing, blog posts) by their own opengraph-image files.
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
    locale: "en_PH",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: "#1c4031",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased font-sans",
        albertSans.variable,
        spectral.variable,
      )}
    >
      <body className="flex min-h-full flex-col bg-emerald">
        <JsonLd graph={[organizationSchema(), websiteSchema()]} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-primary focus:px-4 focus:py-2 focus:text-caption focus:font-medium focus:uppercase focus:tracking-label focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <ScrollProgress />
          <Navbar />
          <main id="main" className="relative z-10 flex-1 bg-background">
            {children}
          </main>
          <Footer />
          <ScrollToTop />
          <ConciergeChat />
        </SmoothScroll>
      </body>
    </html>
  );
}
