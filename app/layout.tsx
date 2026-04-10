import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans, Montserrat } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
const montserratHeading = Montserrat({subsets:['latin'],variable:'--font-heading'});
const notoSans = Noto_Sans({subsets:['latin'],variable:'--font-sans'});
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Aleevia Carter Residences — Elevated Living, Grounded in Serenity",
  description: "Discover a new standard of luxury living. Intelligently designed residences where architectural brilliance meets serene, modern comfort.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", notoSans.variable, montserratHeading.variable)}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}