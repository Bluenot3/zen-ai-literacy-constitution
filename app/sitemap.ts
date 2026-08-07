import type { MetadataRoute } from "next";
import { managedZenHref } from "./managed-pages";
import { listManagedZenNavigation } from "./managed-pages.server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://zenai.world";
  const staticPaths = [
    "",
    "/work",
    "/start",
    "/ai-literacy-constitution",
    "/legacy-dossier",
    "/gallery",
    "/privacy-policy",
    "/terms-and-conditions",
    "/refund-policy",
    "/accessibility-statement",
  ];
  const managedPages = await listManagedZenNavigation();
  const paths = Array.from(
    new Set([
      ...staticPaths,
      ...managedPages
        .filter((page) => page.slug !== "home")
        .map((page) => managedZenHref(page.slug)),
    ]),
  );

  return paths.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority:
      path === ""
        ? 1
        : path === "/work" || path === "/start" || path === "/legacy-dossier"
          ? 0.8
          : path === "/ai-literacy-constitution" || path === "/gallery"
            ? 0.7
            : 0.4,
  }));
}
