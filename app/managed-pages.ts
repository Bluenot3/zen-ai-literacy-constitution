import { containsRetiredZenSurface } from "./retired-surface-policy";

export type ManagedZenNavLocation = "header" | "footer";

export type ManagedZenPageType =
  | "iframe"
  | "embed"
  | "multi_embed"
  | "blank"
  | "ai_html"
  | "markdown";

export type ManagedZenEmbedKind =
  | "url"
  | "iframe"
  | "html"
  | "youtube"
  | "video"
  | "image"
  | "gallery";

export type ManagedZenEmbedSizing =
  | "fit"
  | "wide"
  | "tall"
  | "fullscreen"
  | "custom";

export type ManagedZenEmbedPermission =
  | "restricted"
  | "standard"
  | "trusted";

export type ManagedZenLayout = {
  frame: "contained" | "full_bleed" | "split" | "stack" | "grid";
  gap: number;
  background: "default" | "dark" | "paper" | "none";
  chrome: "treasury" | "compact" | "none";
  columns: 1 | 2 | 3;
};

export type ManagedZenEmbedBlock = {
  id: string;
  title: string;
  kind: ManagedZenEmbedKind;
  source: string;
  embedUrl: string;
  contentHtml: string;
  sizing: ManagedZenEmbedSizing;
  height: number;
  width: number;
  resizable: boolean;
  permissionProfile: ManagedZenEmbedPermission;
};

export type ManagedZenNavigationItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  navLabel: string;
  navGroup: string;
  sortOrder: number;
  pageRole: "home" | "page";
  navLocations: ManagedZenNavLocation[];
  updatedAt: string;
};

export type ManagedZenPage = ManagedZenNavigationItem & {
  pageType: ManagedZenPageType;
  embedUrl: string;
  contentHtml: string;
  blocks: ManagedZenEmbedBlock[];
  layout: ManagedZenLayout;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const stringValue = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;

const numberValue = (
  value: unknown,
  minimum: number,
  maximum: number,
  fallback: number,
) => {
  const candidate =
    typeof value === "number" && Number.isFinite(value) ? value : fallback;
  return Math.min(maximum, Math.max(minimum, Math.round(candidate)));
};

const validSlug = (value: unknown) => {
  const slug = stringValue(value).trim().toLowerCase();
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ? slug : "";
};

const navLocationsValue = (
  value: unknown,
  openInNav: unknown,
): ManagedZenNavLocation[] => {
  if (openInNav === false || !Array.isArray(value)) return [];
  return Array.from(
    new Set(value.filter((item) => item === "header" || item === "footer")),
  ) as ManagedZenNavLocation[];
};

export function normalizeManagedZenNavigation(
  value: unknown,
): ManagedZenNavigationItem | null {
  if (!isRecord(value) || containsRetiredZenSurface(value)) return null;
  const id = stringValue(value.id);
  const slug = validSlug(value.slug);
  const title = stringValue(value.title).trim();
  const pageRole =
    value.page_role === "home" || value.page_role === "page"
      ? value.page_role
      : null;
  if (
    !id || !slug || !title || !pageRole || value.site_key !== "zen_world" ||
    value.status !== "published" || value.visibility !== "public"
  ) return null;

  return {
    id,
    slug,
    title,
    description: stringValue(value.description).trim(),
    navLabel: stringValue(value.nav_label, title).trim() || title,
    navGroup: stringValue(value.nav_group, "ZEN pages").trim() || "ZEN pages",
    sortOrder: numberValue(value.sort_order, 0, 10_000, 100),
    pageRole,
    navLocations: navLocationsValue(value.nav_locations, value.open_in_nav),
    updatedAt: stringValue(value.updated_at),
  };
}

const pageTypeValue = (value: unknown): ManagedZenPageType => {
  if (
    value === "iframe" ||
    value === "embed" ||
    value === "multi_embed" ||
    value === "blank" ||
    value === "ai_html" ||
    value === "markdown"
  ) {
    return value;
  }
  return "blank";
};

const kindValue = (value: unknown): ManagedZenEmbedKind => {
  if (
    value === "iframe" ||
    value === "html" ||
    value === "youtube" ||
    value === "video" ||
    value === "image" ||
    value === "gallery"
  ) {
    return value;
  }
  return "url";
};

const sizingValue = (value: unknown): ManagedZenEmbedSizing => {
  if (
    value === "wide" ||
    value === "tall" ||
    value === "fullscreen" ||
    value === "custom"
  ) {
    return value;
  }
  return "fit";
};

const permissionValue = (value: unknown): ManagedZenEmbedPermission => {
  if (value === "restricted" || value === "trusted") return value;
  return "standard";
};

const normalizeBlock = (
  value: unknown,
  index: number,
): ManagedZenEmbedBlock | null => {
  if (!isRecord(value)) return null;
  const source = stringValue(value.source).trim();
  const contentHtml = stringValue(value.content_html).trim();
  const embedUrl = stringValue(value.embed_url, source).trim();

  return {
    id: stringValue(value.id, `managed-block-${index + 1}`),
    title: stringValue(value.title, "Embedded surface").trim(),
    kind: kindValue(value.kind),
    source,
    embedUrl,
    contentHtml,
    sizing: sizingValue(value.sizing),
    height: numberValue(value.height, 240, 1_400, 620),
    width: numberValue(value.width, 20, 100, 100),
    resizable: value.resizable === true,
    permissionProfile: permissionValue(value.permission_profile),
  };
};

const normalizeLayout = (value: unknown): ManagedZenLayout => {
  const source = isRecord(value) ? value : {};
  const frame =
    source.frame === "full_bleed" ||
    source.frame === "split" ||
    source.frame === "stack" ||
    source.frame === "grid"
      ? source.frame
      : "contained";
  const background =
    source.background === "dark" ||
    source.background === "paper" ||
    source.background === "none"
      ? source.background
      : "default";
  const chrome =
    source.chrome === "none"
      ? "none"
      : source.chrome === "compact"
        ? "compact"
        : "treasury";
  const columns = source.columns === 2 || source.columns === 3 ? source.columns : 1;

  return {
    frame,
    gap: numberValue(source.gap, 0, 96, 24),
    background,
    chrome,
    columns,
  };
};

export function normalizeManagedZenPage(value: unknown): ManagedZenPage | null {
  const navigation = normalizeManagedZenNavigation(value);
  if (!navigation || !isRecord(value)) return null;

  return {
    ...navigation,
    pageType: pageTypeValue(value.page_type),
    embedUrl: stringValue(value.embed_url).trim(),
    contentHtml: stringValue(value.content_html),
    blocks: Array.isArray(value.embed_blocks)
      ? value.embed_blocks
          .map(normalizeBlock)
          .filter((block): block is ManagedZenEmbedBlock => Boolean(block))
      : [],
    layout: normalizeLayout(value.layout_config),
  };
}

export function managedZenHref(slug: string) {
  return slug === "home" ? "/" : `/${slug}`;
}

export function managedZenNavigationFor(
  items: ManagedZenNavigationItem[],
  location: ManagedZenNavLocation,
) {
  return items.filter(
    (item) => item.pageRole === "page" && item.navLocations.includes(location),
  );
}

export function hasRenderableManagedZenPage(
  page: ManagedZenPage | null,
): page is ManagedZenPage {
  if (!page) return false;
  if (page.blocks.length > 0) return true;
  if (page.embedUrl.trim()) return true;
  return Boolean(page.contentHtml.trim());
}
