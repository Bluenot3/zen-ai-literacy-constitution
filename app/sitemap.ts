import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://zenai.world";
  return [
    "",
    "/work",
    "/start",
    "/ai-literacy-constitution",
    "/privacy-policy",
    "/terms-and-conditions",
    "/refund-policy",
    "/accessibility-statement",
  ].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority:
      path === ""
        ? 1
        : path === "/work" || path === "/start"
          ? 0.8
          : path === "/ai-literacy-constitution"
            ? 0.7
            : 0.4,
  }));
}
