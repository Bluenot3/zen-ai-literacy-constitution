import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://zenai.world";
  return [
    "",
    "/work",
    "/privacy-policy",
    "/terms-and-conditions",
    "/refund-policy",
    "/accessibility-statement",
  ].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/work" ? 0.8 : 0.4,
  }));
}
