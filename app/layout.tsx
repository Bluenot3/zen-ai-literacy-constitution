import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { Cormorant_Garamond, Manrope, Space_Mono } from "next/font/google";
import { ZenSiteAnalytics } from "./site-analytics";
import { ZenSiteAnnouncementBanner } from "./site-announcement-banner";
import { listVisibleZenSiteAnnouncements } from "./site-announcements.server";
import type { ZenSiteAnnouncement } from "./site-announcements";
import "./globals.css";
import "./treasury-chrome.css";
import "./site-runtime.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const FALLBACK_TRANSITION_ANNOUNCEMENT: ZenSiteAnnouncement = {
  id: "4f6a1f02-572e-4d7a-8c9d-0627e9cb7861",
  title: "Same ZEN. Now connected through Arsenal.",
  body:
    "Activate with Google in one secure click, or continue with the email you already use.",
  priority: "high",
  background: "#071b28",
  textColor: "#f4fbf8",
  ctaLabel: "Activate with Google",
  ctaAction:
    "https://kcyklettzoyexxynqfer.supabase.co/auth/v1/authorize?provider=google&redirect_to=https%3A%2F%2Farsenal.world%2Fdashboard",
  isDismissible: true,
  startsAt: "2026-08-11T00:00:00.000Z",
  endsAt: null,
  updatedAt: "2026-08-11T23:00:00.000Z",
};

const ARSENAL_GOOGLE_ACTIVATION =
  "https://kcyklettzoyexxynqfer.supabase.co/auth/v1/authorize?provider=google&redirect_to=https%3A%2F%2Farsenal.world%2Fdashboard";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.includes("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);
  const socialImage = new URL("/og.png", metadataBase).toString();

  return {
    metadataBase,
    title: {
      default: "ZEN AI Co. | Intelligence Into Capability",
      template: "%s | ZEN AI Co.",
    },
    description:
      "ZEN AI Co. builds Smart Business Solutions and landmark AI and Web3 literacy programs, including the first youth AI literacy program in United States history.",
    icons: {
      icon: "/zen-mark.png",
      shortcut: "/zen-mark.png",
      apple: "/zen-mark.png",
    },
    openGraph: {
      type: "website",
      siteName: "ZEN AI Co.",
      title: "ZEN AI Co. | Intelligence Into Capability",
      description:
        "Smart Business Solutions, custom agentic systems, Arsenal, and the first youth AI literacy program in United States history.",
      images: [
        {
          url: socialImage,
          width: 1672,
          height: 941,
          alt: "ZEN AI Co. — the first youth AI literacy program in United States history.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "ZEN AI Co. | Intelligence Into Capability",
      description:
        "Smart Business Solutions, Arsenal, and landmark AI and Web3 literacy programs. Intelligence into capability.",
      images: [socialImage],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const announcements = await listVisibleZenSiteAnnouncements();
  const visibleAnnouncements = announcements.length
    ? announcements
    : [FALLBACK_TRANSITION_ANNOUNCEMENT];

  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} ${mono.variable}`}>
        <ZenSiteAnalytics />
        <ZenSiteAnnouncementBanner announcements={visibleAnnouncements} />
        {children}
        <nav className="mobile-dock" aria-label="Mobile ZEN shortcuts">
          <Link href="/">Home</Link>
          <a
            className="zen-start-button zen-start-button--mobile"
            href={ARSENAL_GOOGLE_ACTIVATION}
          >
            <span className="zen-start-button__label">Activate / Sign in</span>
            <span className="zen-start-button__arrow" aria-hidden="true">→</span>
          </a>
          <Link href="/#explore-zen">Explore</Link>
        </nav>
      </body>
    </html>
  );
}
