import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono, Noto_Sans_Sinhala } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-context";
import { LanguageProvider } from "@/i18n/i18n-context";
import { ThemeProvider, themeInitScript } from "@/components/theme-context";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sinhala = Noto_Sans_Sinhala({
  variable: "--font-sinhala",
  subsets: ["sinhala"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "RadeeshBike Accesorios | Genuine Bike Spare Parts in Sri Lanka",
    template: "%s | RadeeshBike Accesorios",
  },
  description:
    "Shop genuine bike spare parts and accessories in Sri Lanka: brakes, chains, tyres, engine parts, electrical, suspension and oils. Filter by bike type, brand and price in LKR.",
  applicationName: "RadeeshBike Accesorios",
  keywords: ["bike spare parts", "Sri Lanka", "motorcycle accessories", "brake pads", "chain sprocket", "tyres", "RadeeshBike"],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ea580c" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${sinhala.variable} h-full antialiased`}
    >
      <head>
        {/* Applies saved theme and language before first paint to avoid a flash. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-canvas">
        <LanguageProvider>
          <ThemeProvider>
            <CartProvider>
              <SiteHeader />
              <main id="main" className="flex-1">
                {children}
              </main>
              <SiteFooter />
            </CartProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
