import { publicationDescription } from "../publication";
import { listZenWeeklyFeedIssues } from "../publication.server";

export const dynamic = "force-dynamic";

const canonicalHost = "https://www.zenai.world";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function publicationDate(value: string) {
  const date = new Date(value.includes("T") ? value : `${value}T12:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? new Date(0).toUTCString() : date.toUTCString();
}

export async function GET() {
  const issues = await listZenWeeklyFeedIssues(40);
  const latestDate = issues[0]?.updatedAt ?? issues[0]?.publishedAt ?? issues[0]?.issueDate;
  const items = issues.map((issue) => {
    const url = `${canonicalHost}${issue.canonicalPath}`;
    const published = issue.publishedAt ?? issue.issueDate;
    return [
      "<item>",
      `<title>${escapeXml(issue.title)}</title>`,
      `<link>${escapeXml(url)}</link>`,
      `<guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `<description>${escapeXml(publicationDescription({ ...issue, sections: [] }) ?? issue.title)}</description>`,
      `<pubDate>${publicationDate(published)}</pubDate>`,
      "</item>",
    ].join("");
  }).join("");
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "<channel>",
    "<title>ZEN Weekly</title>",
    `<link>${canonicalHost}/zen-weekly</link>`,
    "<description>ZEN AI Co. long-form intelligence on technology, society, and the systems shaping what comes next.</description>",
    "<language>en-us</language>",
    latestDate ? `<lastBuildDate>${publicationDate(latestDate)}</lastBuildDate>` : "",
    items,
    "</channel>",
    "</rss>",
  ].join("");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}
