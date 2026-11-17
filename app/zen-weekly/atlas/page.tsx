import type { Metadata } from "next";
import { getZenWeeklyArticle } from "../publication.server";
import { ISSUE_200_ID } from "../incident-atlas/atlas-data";
import { ZenWeeklyIncidentAtlas } from "../incident-atlas/incident-atlas";
import { SNAPSHOT_ISSUE_200, SNAPSHOT_VERIFIED_AT } from "../incident-atlas/atlas-snapshot";

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
    // Preview is functional without inventing a live connection. The fallback
    // is visibly labeled, dated and never represents a changed database record.
    return <ZenWeeklyIncidentAtlas
      article={SNAPSHOT_ISSUE_200}
      retrievedAt={SNAPSHOT_VERIFIED_AT}
      sourceMode="verified-snapshot"
    />;
  }
  return <ZenWeeklyIncidentAtlas article={result.article} retrievedAt={new Date().toISOString()} />;
}
