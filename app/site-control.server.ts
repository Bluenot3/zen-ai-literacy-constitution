import "server-only";

import { readPublicRpc } from "./managed-pages.server";
import {
  defaultZenSiteControl,
  normalizeZenHomepageControl,
  normalizeZenSeoControl,
  type ZenSiteControl,
} from "./site-control";

const recordValue = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

export async function getZenSiteControl(): Promise<ZenSiteControl> {
  const [publicationRows, campaignRows] = await Promise.all([
    readPublicRpc("get_visible_zen_site_publication", {}),
    readPublicRpc("get_visible_zen_campaign", {}),
  ]);
  const publication = recordValue(publicationRows[0]);
  if (typeof publication.id !== "string") return defaultZenSiteControl();

  const campaign = recordValue(campaignRows[0]);
  const campaignPatch = recordValue(campaign.homepage_patch);
  const publishedHomepage = normalizeZenHomepageControl(publication.content);
  const publishedSeo = normalizeZenSeoControl(publication.seo);
  const campaignSeo = recordValue(campaign.seo);
  const homepage = Object.keys(campaignPatch).length
    ? normalizeZenHomepageControl(campaignPatch, publishedHomepage)
    : publishedHomepage;

  return {
    source: "published",
    publicationId: publication.id,
    revision:
      typeof publication.revision === "number" ? publication.revision : null,
    campaignSlug:
      typeof campaign.slug === "string" ? campaign.slug.slice(0, 120) : null,
    campaignAttributionTag:
      typeof campaign.attribution_tag === "string"
        ? campaign.attribution_tag.slice(0, 120)
        : null,
    homepage,
    seo: Object.keys(campaignSeo).length
      ? normalizeZenSeoControl(campaignSeo, publishedSeo)
      : publishedSeo,
  };
}
