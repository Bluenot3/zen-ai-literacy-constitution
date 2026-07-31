export type SitePageLayout = "editorial" | "showcase" | "profile";
export type SitePageCategory =
  | "accomplishments"
  | "partners"
  | "initiatives"
  | "knowledge";

type SiteBlockBase = {
  id: string;
};

export type SiteBlock =
  | (SiteBlockBase & {
      type: "heading";
      eyebrow: string;
      text: string;
      level: 2 | 3;
    })
  | (SiteBlockBase & { type: "text"; body: string })
  | (SiteBlockBase & {
      type: "image";
      url: string;
      alt: string;
      caption: string;
    })
  | (SiteBlockBase & {
      type: "video";
      url: string;
      title: string;
      poster: string;
    })
  | (SiteBlockBase & {
      type: "embed";
      url: string;
      title: string;
      height: number;
      allowEmbed: boolean;
    })
  | (SiteBlockBase & {
      type: "html";
      title: string;
      html: string;
      height: number;
    })
  | (SiteBlockBase & {
      type: "code";
      title: string;
      language: string;
      code: string;
    })
  | (SiteBlockBase & {
      type: "cta";
      heading: string;
      body: string;
      label: string;
      href: string;
    })
  | (SiteBlockBase & {
      type: "quote";
      quote: string;
      attribution: string;
    })
  | (SiteBlockBase & { type: "divider" });

export type SitePageDocument = {
  schemaVersion: 1;
  title: string;
  summary: string;
  layout: SitePageLayout;
  seo: {
    title: string;
    description: string;
  };
  listing: {
    showOnHome: boolean;
    order: number;
    category: SitePageCategory;
  };
  blocks: SiteBlock[];
};

export type SitePublication = {
  pageId: string;
  revisionId: string;
  slug: string;
  document: SitePageDocument;
  publishedAt: string;
  updatedAt: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const stringValue = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;

const boundedHeight = (value: unknown) => {
  const height =
    typeof value === "number" && Number.isFinite(value) ? value : 620;
  return Math.min(1200, Math.max(240, Math.round(height)));
};

const categoryValue = (value: unknown): SitePageCategory => {
  if (
    value === "partners" ||
    value === "initiatives" ||
    value === "knowledge"
  ) {
    return value;
  }
  return "accomplishments";
};

const normalizeBlock = (value: unknown, index: number): SiteBlock | null => {
  if (!isRecord(value)) return null;
  const id = stringValue(value.id, `block-${index + 1}`);

  switch (value.type) {
    case "heading":
      return {
        id,
        type: "heading",
        eyebrow: stringValue(value.eyebrow),
        text: stringValue(value.text, "Untitled section"),
        level: value.level === 3 ? 3 : 2,
      };
    case "text":
      return { id, type: "text", body: stringValue(value.body) };
    case "image":
      return {
        id,
        type: "image",
        url: stringValue(value.url),
        alt: stringValue(value.alt),
        caption: stringValue(value.caption),
      };
    case "video":
      return {
        id,
        type: "video",
        url: stringValue(value.url),
        title: stringValue(value.title, "Video"),
        poster: stringValue(value.poster),
      };
    case "embed":
      return {
        id,
        type: "embed",
        url: stringValue(value.url),
        title: stringValue(value.title, "Interactive experience"),
        height: boundedHeight(value.height),
        allowEmbed: value.allowEmbed === true,
      };
    case "html":
      return {
        id,
        type: "html",
        title: stringValue(value.title, "Interactive experience"),
        html: stringValue(value.html),
        height: boundedHeight(value.height),
      };
    case "code":
      return {
        id,
        type: "code",
        title: stringValue(value.title, "Code"),
        language: stringValue(value.language, "text"),
        code: stringValue(value.code),
      };
    case "cta":
      return {
        id,
        type: "cta",
        heading: stringValue(value.heading),
        body: stringValue(value.body),
        label: stringValue(value.label, "Continue"),
        href: stringValue(value.href, "/"),
      };
    case "quote":
      return {
        id,
        type: "quote",
        quote: stringValue(value.quote),
        attribution: stringValue(value.attribution),
      };
    case "divider":
      return { id, type: "divider" };
    default:
      return null;
  }
};

export const normalizeSitePageDocument = (
  value: unknown,
): SitePageDocument => {
  const source = isRecord(value) ? value : {};
  const seo = isRecord(source.seo) ? source.seo : {};
  const listing = isRecord(source.listing) ? source.listing : {};
  const order =
    typeof listing.order === "number" && Number.isFinite(listing.order)
      ? listing.order
      : 100;
  const layout: SitePageLayout =
    source.layout === "showcase" || source.layout === "profile"
      ? source.layout
      : "editorial";

  return {
    schemaVersion: 1,
    title: stringValue(source.title, "Untitled page"),
    summary: stringValue(source.summary),
    layout,
    seo: {
      title: stringValue(seo.title),
      description: stringValue(seo.description),
    },
    listing: {
      showOnHome: listing.showOnHome !== false,
      order: Math.min(10_000, Math.max(0, Math.round(order))),
      category: categoryValue(listing.category),
    },
    blocks: Array.isArray(source.blocks)
      ? source.blocks
          .map(normalizeBlock)
          .filter((block): block is SiteBlock => Boolean(block))
      : [],
  };
};
