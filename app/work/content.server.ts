import "server-only";

import {
  normalizeSitePageDocument,
  type SitePublication,
} from "./content";

type RuntimeEnvironment = {
  SUPABASE_URL?: string;
  SUPABASE_PUBLISHABLE_KEY?: string;
};

type PublicationRow = {
  page_id?: unknown;
  revision_id?: unknown;
  slug?: unknown;
  document?: unknown;
  published_at?: unknown;
  updated_at?: unknown;
};

const config = () => {
  const runtime =
    (
      globalThis as typeof globalThis & {
        __ZEN_RUNTIME_ENV__?: RuntimeEnvironment;
      }
    ).__ZEN_RUNTIME_ENV__ ?? {};
  const url = String(runtime.SUPABASE_URL ?? "").replace(/\/+$/, "");
  const publishableKey = String(runtime.SUPABASE_PUBLISHABLE_KEY ?? "");
  return { url, publishableKey };
};

const normalizePublication = (
  value: PublicationRow,
): SitePublication | null => {
  if (
    typeof value.page_id !== "string" ||
    typeof value.revision_id !== "string" ||
    typeof value.slug !== "string" ||
    typeof value.published_at !== "string"
  ) {
    return null;
  }

  return {
    pageId: value.page_id,
    revisionId: value.revision_id,
    slug: value.slug,
    document: normalizeSitePageDocument(value.document),
    publishedAt: value.published_at,
    updatedAt:
      typeof value.updated_at === "string"
        ? value.updated_at
        : value.published_at,
  };
};

const readPublications = async (search: string): Promise<SitePublication[]> => {
  const { url, publishableKey } = config();
  if (!url || !publishableKey) return [];

  const response = await fetch(
    `${url}/rest/v1/site_publications?select=page_id,revision_id,slug,document,published_at,updated_at&is_active=eq.true&${search}`,
    {
      headers: {
        apikey: publishableKey,
        Authorization: `Bearer ${publishableKey}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    console.error(
      `ZEN public content request failed with status ${response.status}.`,
    );
    return [];
  }

  const body: unknown = await response.json();
  if (!Array.isArray(body)) return [];
  return body
    .map((row) => normalizePublication(row as PublicationRow))
    .filter((row): row is SitePublication => Boolean(row));
};

export const listPublications = async () => {
  const publications = await readPublications(
    "order=published_at.desc&limit=100",
  );
  return publications.sort(
    (left, right) =>
      left.document.listing.order - right.document.listing.order ||
      right.publishedAt.localeCompare(left.publishedAt),
  );
};

export const getPublication = async (slug: string) => {
  const normalizedSlug = slug.trim().toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedSlug)) return null;
  const publications = await readPublications(
    `slug=eq.${encodeURIComponent(normalizedSlug)}&limit=1`,
  );
  return publications[0] ?? null;
};
