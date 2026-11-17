export type ZenPublicationType = "weekly" | "daily";
export type ZenPublicationStatus = "published" | "archived";

export type ZenPublicationBlockKind =
  | "markdown"
  | "text"
  | "code"
  | "image"
  | "video"
  | "embed"
  | "divider"
  | "quote"
  | "callout"
  | "gallery"
  | "link_card"
  | "tweet"
  | "youtube"
  | "pdf"
  | "html"
  | "agent_feed"
  | "community_feed"
  | "announcement_feed";

export type ZenPublicationMedia = {
  url?: string;
  caption?: string;
  alt?: string;
  attribution?: string;
  language?: string;
  title?: string;
  description?: string;
  siteName?: string;
  image?: string;
  tone?: "info" | "success" | "warn" | "danger";
  height?: number;
  layout?: "inline" | "wide" | "full" | "gallery" | "sequence" | "infographic" | "cover";
  role?: "cover" | "infographic" | "artwork";
  variant?: string;
  credit?: string;
  provenanceUrl?: string;
  chain?: string;
  contract?: string;
  tokenId?: string;
  images?: Array<{
    url: string;
    caption?: string;
    alt?: string;
    credit?: string;
    role?: "infographic" | "artwork";
  }>;
};

export type ZenPublicationBlock = {
  id: string;
  issueId: string;
  kind: ZenPublicationBlockKind;
  position: number;
  heading: string;
  body: string;
  media: ZenPublicationMedia;
};

export type ZenPublicationIssue = {
  id: string;
  publicationType: ZenPublicationType;
  issueDate: string;
  editionNumber: number | null;
  title: string;
  summary: string;
  coverUrl: string | null;
  coverAlt: string;
  byline: string;
  category: string;
  tags: string[];
  status: ZenPublicationStatus;
  publishedAt: string | null;
  updatedAt: string | null;
  canonicalPath: string;
};

export type ZenPublicationArticle = ZenPublicationIssue & {
  sections: ZenPublicationBlock[];
};

export type ZenPublicationVisual = {
  id: string;
  issueId: string;
  issueTitle: string;
  issueDate: string;
  editionNumber: number | null;
  issuePath: string;
  source: "cover" | "image" | "gallery";
  role: "cover" | "infographic" | "artwork";
  url: string;
  alt: string;
  caption: string;
  credit: string;
  provenanceUrl?: string;
  chain?: string;
  contract?: string;
  tokenId?: string;
};

const UUID_PATTERN =
  /[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i;
const CONTROL_CHARACTERS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;
const PUBLIC_BLOCK_KINDS = new Set<ZenPublicationBlockKind>([
  "markdown",
  "text",
  "code",
  "image",
  "video",
  "embed",
  "divider",
  "quote",
  "callout",
  "gallery",
  "link_card",
  "tweet",
  "youtube",
  "pdf",
  "html",
  "agent_feed",
  "community_feed",
  "announcement_feed",
]);

function recordValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function cleanText(value: unknown, maximum = 40_000): string {
  return typeof value === "string"
    ? value.replace(CONTROL_CHARACTERS, " ").trim().slice(0, maximum)
    : "";
}

function cleanInlineText(value: unknown, maximum = 500): string {
  return cleanText(value, maximum).replace(/\s+/g, " ");
}

function validIsoDate(value: unknown): string | null {
  const candidate = cleanInlineText(value, 40);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate)) return null;
  const date = new Date(`${candidate}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : candidate;
}

function validTimestamp(value: unknown): string | null {
  const candidate = cleanInlineText(value, 80);
  if (!candidate) return null;
  const timestamp = new Date(candidate);
  return Number.isNaN(timestamp.getTime()) ? null : timestamp.toISOString();
}

function positiveInteger(value: unknown): number | null {
  const candidate = Number(value);
  return Number.isInteger(candidate) && candidate > 0 ? candidate : null;
}

function safeTone(value: unknown): ZenPublicationMedia["tone"] {
  return value === "success" || value === "warn" || value === "danger"
    ? value
    : value === "info"
      ? "info"
      : undefined;
}

function safeLayout(value: unknown): ZenPublicationMedia["layout"] {
  return value === "wide" || value === "full" || value === "gallery" || value === "sequence" || value === "infographic" || value === "cover"
    ? value
    : value === "inline"
      ? "inline"
      : undefined;
}

function safeRole(value: unknown): ZenPublicationMedia["role"] {
  return value === "cover" || value === "infographic" || value === "artwork" ? value : undefined;
}

function cleanMedia(value: unknown): ZenPublicationMedia {
  const data = recordValue(value);
  const images = Array.isArray(data.images)
    ? data.images
        .map((entry) => {
          const image = typeof entry === "string" ? { url: entry } : recordValue(entry);
          const url = cleanInlineText(image.url, 2_048);
          if (!url) return null;
          return {
            url,
            caption: cleanInlineText(image.caption, 1_000) || undefined,
            credit: cleanInlineText(image.credit ?? image.attribution, 500) || undefined,
            role: image.role === "infographic" ? ("infographic" as const) : image.role === "artwork" ? ("artwork" as const) : undefined,
            alt: cleanInlineText(image.alt, 500) || undefined,
          };
        })
        .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
        .slice(0, 24)
    : undefined;
  const rawHeight = Number(data.height);

  return {
    url: cleanInlineText(data.url ?? data.href, 2_048) || undefined,
    caption: cleanInlineText(data.caption, 1_000) || undefined,
    alt: cleanInlineText(data.alt ?? data.alt_text, 500) || undefined,
    attribution: cleanInlineText(data.attribution, 500) || undefined,
    language: cleanInlineText(data.language, 40) || undefined,
    title: cleanInlineText(data.title, 500) || undefined,
    description: cleanText(data.description, 4_000) || undefined,
    siteName: cleanInlineText(data.site_name ?? data.siteName, 200) || undefined,
    image: cleanInlineText(data.image ?? data.image_url, 2_048) || undefined,
    tone: safeTone(data.tone),
    height: Number.isFinite(rawHeight)
      ? Math.max(240, Math.min(Math.round(rawHeight), 900))
      : undefined,
    layout: safeLayout(data.layout ?? data.presentation),
    role: safeRole(data.role),
    variant: cleanInlineText(data.variant, 120) || undefined,
    credit: cleanInlineText(data.credit ?? data.attribution, 500) || undefined,
    provenanceUrl: cleanInlineText(data.provenance_url ?? data.provenanceUrl, 2_048) || undefined,
    chain: cleanInlineText(data.chain, 120) || undefined,
    contract: cleanInlineText(data.contract, 240) || undefined,
    tokenId: cleanInlineText(data.token_id ?? data.tokenId, 240) || undefined,
    images: images?.length ? images : undefined,
  };
}

export function zenWeeklyTitleSlug(title: string): string {
  const canonicalTitle = title
    .replace(/\s*\|\s*ZEN\s+WEEKLY\s*\|\s*ISSUE\s*#?\s*\d+\s*$/i, "")
    .trim() || title;
  const slug = canonicalTitle
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
  return slug || "issue";
}

export function buildZenWeeklyArticlePath(id: string, title: string): string {
  const uuid = id.match(UUID_PATTERN)?.[0]?.toLowerCase();
  if (!uuid) return "/zen-weekly";
  return `/zen-weekly/${zenWeeklyTitleSlug(title)}--${uuid}`;
}

export function parseZenWeeklyArticleRoute(route: string): string | null {
  return decodeURIComponent(route).match(UUID_PATTERN)?.[0]?.toLowerCase() ?? null;
}

export function normalizeZenPublicationIssue(
  value: unknown,
  publicationType: ZenPublicationType,
  now = Date.now(),
): ZenPublicationIssue | null {
  const row = recordValue(value);
  const id = cleanInlineText(row.id, 64).match(UUID_PATTERN)?.[0]?.toLowerCase();
  const expectedTab = publicationType === "weekly" ? "weekly" : "today";
  const tabSlug = cleanInlineText(row.tab_slug, 40).toLowerCase();
  const status = cleanInlineText(row.status, 20).toLowerCase();
  const issueDate = validIsoDate(row.issue_date);
  const title = cleanInlineText(row.title, 500);
  const publishedAt = validTimestamp(row.published_at);
  const scheduledFor = validTimestamp(row.scheduled_for);
  const expiresAt = validTimestamp(row.expires_at);
  const issueTime = Date.parse(`${issueDate ?? "1970-01-01"}T00:00:00.000Z`);
  if (
    !id ||
    tabSlug !== expectedTab ||
    !issueDate ||
    !title ||
    (status !== "published" && status !== "archived") ||
    row.archive_visible === false ||
    (publishedAt && new Date(publishedAt).getTime() > now) ||
    (scheduledFor && new Date(scheduledFor).getTime() > now) ||
    (expiresAt && new Date(expiresAt).getTime() <= now) ||
    (!publishedAt && issueTime > now)
  ) {
    return null;
  }

  const masthead = recordValue(row.masthead);
  const byline = cleanInlineText(masthead.byline ?? masthead.author, 300);
  const rawTags = Array.isArray(masthead.tags) ? masthead.tags : [];

  return {
    id,
    publicationType,
    issueDate,
    editionNumber: positiveInteger(row.edition_number),
    title,
    summary: cleanText(row.subtitle, 2_000),
    coverUrl: cleanInlineText(row.cover_url, 2_048) || null,
    coverAlt: cleanInlineText(masthead.cover_alt ?? masthead.alt, 500),
    byline,
    category: cleanInlineText(masthead.category ?? masthead.section, 200),
    tags: rawTags.map((tag) => cleanInlineText(tag, 100)).filter(Boolean).slice(0, 12),
    status: status as ZenPublicationStatus,
    publishedAt,
    updatedAt: validTimestamp(row.updated_at),
    canonicalPath:
      publicationType === "weekly"
        ? buildZenWeeklyArticlePath(id, title)
        : "/zen-weekly#zen-daily",
  };
}

export function normalizeZenPublicationBlock(value: unknown): ZenPublicationBlock | null {
  const row = recordValue(value);
  const id = cleanInlineText(row.id, 64);
  const issueId = cleanInlineText(row.issue_id, 64);
  const kind = cleanInlineText(row.kind, 40).toLowerCase() as ZenPublicationBlockKind;
  if (!id || !issueId || row.is_published === false || !PUBLIC_BLOCK_KINDS.has(kind)) return null;
  const position = Number(row.position);
  const body = cleanText(row.body, 250_000);
  const rawMedia = cleanMedia(row.data);
  const media = kind === "image"
    && rawMedia.url
    && !rawMedia.caption
    && body
    && !/^(https?:\/\/|data:image\/|blob:)/i.test(body)
      ? { ...rawMedia, caption: cleanInlineText(body, 1_000) }
      : rawMedia;
  return {
    id,
    issueId,
    kind,
    position: Number.isFinite(position) ? position : Number.MAX_SAFE_INTEGER,
    heading: cleanInlineText(row.heading, 1_000),
    body,
    media,
  };
}

export function sortZenPublicationIssues(
  issues: readonly ZenPublicationIssue[],
): ZenPublicationIssue[] {
  return [...issues].sort((left, right) => {
    const leftTime = Date.parse(left.publishedAt ?? `${left.issueDate}T00:00:00.000Z`);
    const rightTime = Date.parse(right.publishedAt ?? `${right.issueDate}T00:00:00.000Z`);
    return rightTime - leftTime || right.issueDate.localeCompare(left.issueDate) || left.id.localeCompare(right.id);
  });
}

export function extractZenPublicationVisuals(
  issue: ZenPublicationIssue,
  sections: readonly ZenPublicationBlock[],
): ZenPublicationVisual[] {
  const visuals: ZenPublicationVisual[] = [];
  const seen = new Set<string>();
  const add = (visual: ZenPublicationVisual) => {
    const key = visual.url.trim();
    if (!key || seen.has(key)) return;
    seen.add(key);
    visuals.push(visual);
  };

  if (issue.coverUrl) {
    add({
      id: `cover-${issue.id}`,
      issueId: issue.id,
      issueTitle: issue.title,
      issueDate: issue.issueDate,
      editionNumber: issue.editionNumber,
      issuePath: issue.canonicalPath,
      source: "cover",
      role: "cover",
      url: issue.coverUrl,
      alt: issue.coverAlt || `${issue.title} cover`,
      caption: issue.coverAlt,
      credit: "",
    });
  }

  for (const block of sortZenPublicationBlocks(sections)) {
    const shared = {
      issueId: issue.id,
      issueTitle: issue.title,
      issueDate: issue.issueDate,
      editionNumber: issue.editionNumber,
      issuePath: issue.canonicalPath,
      provenanceUrl: block.media.provenanceUrl,
      chain: block.media.chain,
      contract: block.media.contract,
      tokenId: block.media.tokenId,
    };
    const blockRole = block.media.role === "infographic" || block.media.layout === "infographic"
      ? "infographic" as const
      : "artwork" as const;

    if (block.kind === "image") {
      const url = block.media.url || block.body;
      if (url) add({
        ...shared,
        id: block.id,
        source: "image",
        role: blockRole,
        url,
        alt: block.media.alt || block.heading || block.media.caption || `${issue.title} issue artwork`,
        caption: block.media.caption || block.heading,
        credit: block.media.credit || block.media.attribution || "",
      });
    }

    if (block.kind === "gallery") {
      for (const [index, image] of (block.media.images ?? []).entries()) {
        add({
          ...shared,
          id: `${block.id}-${index}`,
          source: "gallery",
          role: image.role === "infographic" ? "infographic" : blockRole,
          url: image.url,
          alt: image.alt || image.caption || block.heading || `${issue.title} gallery artwork`,
          caption: image.caption || block.heading,
          credit: image.credit || block.media.credit || block.media.attribution || "",
        });
      }
    }
  }

  return visuals;
}

export function sortZenPublicationBlocks(
  blocks: readonly ZenPublicationBlock[],
): ZenPublicationBlock[] {
  return [...blocks].sort((left, right) => left.position - right.position || left.id.localeCompare(right.id));
}

export function publicationPlainText(block: ZenPublicationBlock): string {
  return `${block.heading} ${block.body}`
    .replace(/!?(?:\[([^\]]*)\])\(([^)]+)\)/g, "$1")
    .replace(/[`*_>#~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function publicationReadingMinutes(blocks: readonly ZenPublicationBlock[]): number | null {
  const wordCount = blocks
    .map(publicationPlainText)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return wordCount ? Math.max(1, Math.ceil(wordCount / 220)) : null;
}

export function publicationDescription(article: ZenPublicationArticle): string | undefined {
  if (article.summary) return article.summary.slice(0, 200);
  const firstText = article.sections.map(publicationPlainText).find(Boolean);
  return firstText ? `${firstText.slice(0, 197).trimEnd()}${firstText.length > 197 ? "…" : ""}` : undefined;
}
