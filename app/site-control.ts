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
  campaignAttributionTag: string | null;
  homepage: ZenHomepageControl;
  seo: ZenSeoControl;
}

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
    homepage: DEFAULT_ZEN_HOMEPAGE_CONTROL,
    seo: DEFAULT_ZEN_SEO_CONTROL,
  };
}
