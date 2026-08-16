import type { MetadataRoute } from "next";
import { managedZenHref } from "./managed-pages";
import { listManagedZenNavigation } from "./managed-pages.server";
import { listZenWeeklySitemapIssues } from "./zen-weekly/publication.server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.zenai.world";
  const staticPaths = [
    "",
    "/work",
    "/programs",
    "/start",
    "/ai-literacy-constitution",
    "/legacy-dossier",
    "/gallery",
    "/privacy-policy",
    "/terms-and-conditions",
    "/refund-policy",
    "/accessibility-statement",
  ];
  const [managedPages, weeklyIssues] = await Promise.all([
    listManagedZenNavigation(),
    listZenWeeklySitemapIssues(),
  ]);
  const paths = Array.from(
    new Set([
      ...staticPaths,
      "/zen-weekly",
      ...managedPages
        .filter((page) => page.slug !== "home")
        .map((page) => managedZenHref(page.slug)),
    ]),
  );

  const pages: MetadataRoute.Sitemap = paths.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path === "" || path === "/zen-weekly" ? "weekly" : "monthly",
    priority:
      path === ""
        ? 1
        : path === "/zen-weekly"
          ? 0.85
          : path === "/work" || path === "/start" || path === "/programs" || path === "/legacy-dossier"
            ? 0.8
            : path === "/ai-literacy-constitution" || path === "/gallery"
              ? 0.7
              : 0.4,
  }));

  return [
    ...pages,
    ...weeklyIssues.map((issue) => ({
      url: `${base}${issue.canonicalPath}`,
      lastModified: issue.updatedAt ?? issue.publishedAt ?? `${issue.issueDate}T00:00:00.000Z`,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];
}
