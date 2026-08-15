import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MotionProvider } from "@/components/primitives/MotionProvider";
import { site } from "@/lib/content";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "product studio",
    "software engineering studio",
    "product design",
    "product strategy",
    "platform engineering",
    "digital product development",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  // The light value, because that is what the page opens in. `ThemeToggle`
  // rewrites this meta tag when the visitor turns the lamp over, so the browser
  // chrome follows the page instead of framing a dark page in bone.
  themeColor: "#f4f2ed",
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

/**
 * Applies the remembered theme BEFORE the first paint.
 *
 * This has to be an inline, synchronous script in the document — anything that
 * waits for React is a visible flash of the wrong theme on every navigation,
 * and the whiter the default the worse it looks. It is deliberately the only
 * inline script on the site.
 *
 * IT DOES NOT READ `prefers-color-scheme`. The light theme is the design; dark
 * is the alternative a visitor can choose, and it is then remembered for good.
 * If that judgement is ever reversed, the change is one clause here — fall back
 * to `matchMedia('(prefers-color-scheme: dark)').matches` when nothing is
 * stored — and nothing else in the codebase moves.
 */
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('quantar-theme');document.documentElement.dataset.theme=t==='dark'?'dark':'light';}catch(e){document.documentElement.dataset.theme='light';}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-GB"
      className={`${geistSans.variable} ${geistMono.variable}`}
      // The script below sets `data-theme` on this element before React
      // hydrates, which is a server/client difference by design.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="bg-paper text-ink antialiased">
        <a
          href="#main"
          className="type-label sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[100] focus:bg-ink focus:px-5 focus:py-3 focus:text-paper"
        >
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
