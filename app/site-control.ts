import {
  isZenDestinationKey,
  type ZenDestinationKey,
} from "../lib/program-access-links";

export type ZenHomepageSection =
  | "arsenal_story"
  | "business_solutions"
  | "capability_loop"
  | "programs"
  | "proof"
  | "final_router";

export interface ZenHomepageControl {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryDestination: ZenDestinationKey;
  secondaryDestination: ZenDestinationKey;
  featuredCapability: string;
  featuredBusinessSolution: string;
  featuredProgram: string;
  announcementEnabled: boolean;
  sectionOrder: ZenHomepageSection[];
  proofClaimIds: string[];
  featuredMediaId: string | null;
  finalDestination: ZenDestinationKey;
  sectionVisibility: Record<ZenHomepageSection, boolean>;
}

export interface ZenSeoControl {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
}

export interface ZenSiteControl {
  source: "default" | "published";
  publicationId: string | null;
  revision: number | null;
  campaignSlug: string | null;
  campaignAnnouncementId: string | null;
  campaignAttributionTag: string | null;
  homepage: ZenHomepageControl;
  seo: ZenSeoControl;
}

export const ZEN_HOMEPAGE_SECTIONS: ZenHomepageSection[] = [
  "arsenal_story",
  "business_solutions",
  "capability_loop",
  "programs",
  "proof",
  "final_router",
];

export const DEFAULT_ZEN_HOMEPAGE_CONTROL: ZenHomepageControl = {
  eyebrow: "A new treasury of human capability · Series 2026",
  headline: "Intelligence becomes capability.",
  subheadline:
    "ZEN AI Co. builds agentic systems for organizations and landmark literacy programs for people—turning intelligence into useful, human-led capability.",
  primaryDestination: "ARSENAL_BUILD",
  secondaryDestination: "BUSINESS_TRANSFORM",
  featuredCapability: "Business Spaces",
  featuredBusinessSolution: "One Fabric. Every System. One Truth.",
  featuredProgram: "AI Pioneer Program",
  announcementEnabled: true,
  sectionOrder: [...ZEN_HOMEPAGE_SECTIONS],
  proofClaimIds: [],
  featuredMediaId: null,
  finalDestination: "ARSENAL_BUILD",
  sectionVisibility: {
    arsenal_story: true,
    business_solutions: true,
    capability_loop: true,
    programs: true,
    proof: true,
    final_router: true,
  },
};

export const DEFAULT_ZEN_SEO_CONTROL: ZenSeoControl = {
  title: "ZEN AI Co. | Intelligence Into Capability",
  description: "ZEN AI Co. builds Smart Business Solutions and landmark AI and Web3 literacy Programs.",
  canonical: "https://www.zenai.world/",
  ogImage: "https://www.zenai.world/og.png",
};

const objectValue = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

const safeText = (
  value: unknown,
  fallback: string,
  maximumLength: number,
) => {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maximumLength) : fallback;
};

const safeDestination = (
  value: unknown,
  fallback: ZenDestinationKey,
) => (isZenDestinationKey(value) ? value : fallback);

const safeHttpsUrl = (value: unknown, fallback: string) => {
  if (typeof value !== "string") return fallback;
  try {
    const candidate = new URL(value);
    return candidate.protocol === "https:" ? candidate.toString() : fallback;
  } catch {
    return fallback;
  }
};

const safeUuid = (value: unknown) =>
  typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
    ? value
    : null;

const safeSectionOrder = (value: unknown, fallback: ZenHomepageSection[]) => {
  const provided = Array.isArray(value) ? value : [];
  const valid = provided.filter((item): item is ZenHomepageSection =>
    typeof item === "string" && ZEN_HOMEPAGE_SECTIONS.includes(item as ZenHomepageSection));
  return [...new Set([...valid, ...fallback, ...ZEN_HOMEPAGE_SECTIONS])];
};

export function normalizeZenSeoControl(
  value: unknown,
  fallback = DEFAULT_ZEN_SEO_CONTROL,
): ZenSeoControl {
  const row = objectValue(value);
  return {
    title: safeText(row.title, fallback.title, 160),
    description: safeText(row.description, fallback.description, 320),
    canonical: safeHttpsUrl(row.canonical, fallback.canonical),
    ogImage: safeHttpsUrl(row.og_image ?? row.ogImage, fallback.ogImage),
  };
}

export function normalizeZenHomepageControl(
  value: unknown,
  fallback = DEFAULT_ZEN_HOMEPAGE_CONTROL,
): ZenHomepageControl {
  const row = objectValue(value);
  const visibility = objectValue(row.section_visibility);
  const sectionVisibility = { ...fallback.sectionVisibility };
  for (const key of Object.keys(sectionVisibility) as ZenHomepageSection[]) {
    if (typeof visibility[key] === "boolean") {
      sectionVisibility[key] = visibility[key] as boolean;
    }
  }

  return {
    eyebrow: safeText(row.eyebrow, fallback.eyebrow, 120),
    headline: safeText(row.headline, fallback.headline, 160),
    subheadline: safeText(row.subheadline, fallback.subheadline, 500),
    primaryDestination: safeDestination(
      row.primary_destination,
      fallback.primaryDestination,
    ),
    secondaryDestination: safeDestination(
      row.secondary_destination,
      fallback.secondaryDestination,
    ),
    featuredCapability: safeText(
      row.featured_capability,
      fallback.featuredCapability,
      120,
    ),
    featuredBusinessSolution: safeText(
      row.featured_business_solution,
      fallback.featuredBusinessSolution,
      180,
    ),
    featuredProgram: safeText(
      row.featured_program,
      fallback.featuredProgram,
      120,
    ),
    announcementEnabled: row.announcement_enabled !== false,
    sectionOrder: safeSectionOrder(row.section_order, fallback.sectionOrder),
    proofClaimIds: Array.isArray(row.proof_claim_ids)
      ? row.proof_claim_ids.map(safeUuid).filter((id): id is string => Boolean(id)).slice(0, 12)
      : fallback.proofClaimIds,
    featuredMediaId:
      safeUuid(row.featured_media_id) ?? fallback.featuredMediaId,
    finalDestination: safeDestination(
      row.final_destination,
      fallback.finalDestination,
    ),
    sectionVisibility,
  };
}

export function defaultZenSiteControl(): ZenSiteControl {
  return {
    source: "default",
    publicationId: null,
    revision: null,
    campaignSlug: null,
    campaignAttributionTag: null,
    campaignAnnouncementId: null,
    homepage: DEFAULT_ZEN_HOMEPAGE_CONTROL,
    seo: DEFAULT_ZEN_SEO_CONTROL,
  };
}
