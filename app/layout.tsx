import type { Metadata } from "next";
import { headers } from "next/headers";
import { Cormorant_Garamond, Manrope, Space_Mono } from "next/font/google";
import "./globals.css";
import "./treasury-chrome.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} ${mono.variable}`}>
        {children}
      </body>
    </html>
  );
}
