import type { Metadata } from "next";
import Link from "next/link";
import { getZenWeeklyArticle } from "../publication.server";
import { ISSUE_200_ID, ISSUE_200_CANONICAL } from "../incident-atlas/atlas-data";
import { ZenWeeklyIncidentAtlas } from "../incident-atlas/incident-atlas";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Interactive Incident Atlas | ZEN Weekly Issue #200",
  description: "Explore mapped incident evidence, distributed-system dependencies, timelines, official sources and the immutable ZEN Weekly Issue #200 investigation.",
  alternates: { canonical: "https://www.zenai.world/zen-weekly/atlas" },
  openGraph: {
    title: "ZEN Weekly — Interactive Incident Atlas, Issue #200",
    description: "Evidence-linked geographic tracker of the infrastructure and security investigations, with no invented attribution or coordinates.",
    url: "https://www.zenai.world/zen-weekly/atlas",
  },
};

export default async function ZenWeeklyAtlasPage() {
  const result = await getZenWeeklyArticle(ISSUE_200_ID);
  if (!result.available || !result.article || result.article.status !== "published") {
    return (
      <main style={{ minHeight:"100vh", background:"#0c1c27", color:"#e8f0e8", padding:"min(8vw, 5rem)", fontFamily:"Arial, sans-serif" }}>
        <p style={{ color:"#d7bd84" }}>ZEN WEEKLY / SOURCE UNAVAILABLE</p>
        <h1>The Incident Atlas cannot verify its published evidence right now.</h1>
        <p>The existing investigation has not been altered or replaced. The tracker will return when the source service is available.</p>
        <Link href={ISSUE_200_CANONICAL} style={{ color:"#e4cf9c" }}>Open the original Issue #200 investigation ↗</Link>
      </main>
    );
  }
  return <ZenWeeklyIncidentAtlas article={result.article} retrievedAt={new Date().toISOString()} />;
}
