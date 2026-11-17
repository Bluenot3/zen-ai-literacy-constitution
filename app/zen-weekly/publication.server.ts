import "server-only";

import {
  extractZenPublicationVisuals,
  normalizeZenPublicationBlock,
  normalizeZenPublicationIssue,
  publicationPlainText,
  sortZenPublicationBlocks,
  sortZenPublicationIssues,
  type ZenPublicationArticle,
  type ZenPublicationBlock,
  type ZenPublicationIssue,
  type ZenPublicationVisual,
} from "./publication";

type RuntimeEnvironment = {
  SUPABASE_URL?: string;
  SUPABASE_PUBLISHABLE_KEY?: string;
};

type PublicReadResult = {
  available: boolean;
  rows: unknown[];
  total: number;
};

type CacheEntry = {
  expiresAt: number;
  result: Promise<PublicReadResult>;
};

export type ZenDailyLane = {
  issue: ZenPublicationIssue;
  items: Array<{ id: string; title: string; summary: string }>;
};

export type ZenWeeklyHomeData = {
  available: boolean;
  recentIssues: ZenPublicationIssue[];
  archive: {
    issues: ZenPublicationIssue[];
    total: number;
    page: number;
    pageSize: number;
    query: string;
    year: string;
  };
  visuals: {
    items: ZenPublicationVisual[];
    page: number;
    hasNext: boolean;
  };
  latestArticle: ZenPublicationArticle | null;
  daily: ZenDailyLane | null;
};

export type ZenWeeklyArticleResult = {
  available: boolean;
  article: ZenPublicationArticle | null;
  previousIssue: ZenPublicationIssue | null;
  nextIssue: ZenPublicationIssue | null;
};

const PUBLIC_READ_CACHE = new Map<string, CacheEntry>();

export type ZenWeeklyHomeOptions = {
  archivePage?: number;
  visualPage?: number;
  query?: string;
  year?: string;
};
const PUBLIC_READ_CACHE_LIMIT = 96;
const ISSUE_SELECT = [
  "id",
  "tab_slug",
  "issue_date",
  "edition_number",
  "title",
  "subtitle",
  "cover_url",
  "masthead",
  "status",
  "published_at",
  "scheduled_for",
  "expires_at",
  "updated_at",
  "archive_visible",
].join(",");
const SECTION_SELECT = [
  "id",
  "issue_id",
  "kind",
  "position",
  "heading",
  "body",
  "data",
  "is_published",
].join(",");

function runtimeConfig() {
  const runtime: RuntimeEnvironment =
    (
      globalThis as typeof globalThis & {
        __ZEN_RUNTIME_ENV__?: RuntimeEnvironment;
      }
    ).__ZEN_RUNTIME_ENV__ ?? {};
  const nodeRuntime =
    typeof process !== "undefined" ? process.env : {};

  return {
    url: String(runtime.SUPABASE_URL ?? nodeRuntime.SUPABASE_URL ?? "").replace(/\/+$/, ""),
    publishableKey: String(runtime.SUPABASE_PUBLISHABLE_KEY ?? nodeRuntime.SUPABASE_PUBLISHABLE_KEY ?? ""),
  };
}

function pruneCache(now: number) {
  for (const [key, entry] of PUBLIC_READ_CACHE) {
    if (entry.expiresAt <= now) PUBLIC_READ_CACHE.delete(key);
  }
  while (PUBLIC_READ_CACHE.size >= PUBLIC_READ_CACHE_LIMIT) {
    const oldestKey = PUBLIC_READ_CACHE.keys().next().value;
    if (!oldestKey) break;
    PUBLIC_READ_CACHE.delete(oldestKey);
  }
}

async function readPublicTable(
  table: "zen_daily_issues" | "zen_daily_sections",
  query: URLSearchParams,
  cacheSeconds: number,
): Promise<PublicReadResult> {
  const { url, publishableKey } = runtimeConfig();
  if (!url || !publishableKey) return { available: false, rows: [], total: 0 };

  const now = Date.now();
  const cacheKey = `${table}?${query.toString()}`;
  const cached = PUBLIC_READ_CACHE.get(cacheKey);
  if (cached && cached.expiresAt > now) return cached.result;
  if (cached) PUBLIC_READ_CACHE.delete(cacheKey);
  pruneCache(now);

  const result = (async (): Promise<PublicReadResult> => {
    try {
      const response = await fetch(`${url}/rest/v1/${table}?${query.toString()}`, {
        headers: {
          apikey: publishableKey,
          Authorization: `Bearer ${publishableKey}`,
          Prefer: "count=exact",
        },
        cache: "no-store",
        signal: AbortSignal.timeout(5_000),
      });
      if (!response.ok) {
        console.error(`ZEN publication read failed for ${table} with status ${response.status}.`);
        return { available: false, rows: [], total: 0 };
      }
      const body: unknown = await response.json();
      const rows = Array.isArray(body) ? body : [];
      const totalText = response.headers.get("content-range")?.split("/").at(-1) ?? "";
      const parsedTotal = Number(totalText);
      return {
        available: true,
        rows,
        total: totalText && Number.isFinite(parsedTotal) ? parsedTotal : rows.length,
      };
    } catch {
      console.error(`ZEN publication read failed for ${table}.`);
      return { available: false, rows: [], total: 0 };
    }
  })();

  PUBLIC_READ_CACHE.set(cacheKey, {
    expiresAt: now + cacheSeconds * 1_000,
    result,
  });
  return result;
}


type IssueListOptions = {
  limit: number;
  offset?: number;
  query?: string;
  year?: string;
  publishedOnly?: boolean;
  order?: string;
};

function boundedPage(value: number | undefined) {
  return Number.isInteger(value) && Number(value) > 0
    ? Math.min(Number(value), 999)
    : 1;
}
function issueQuery(tabSlug: "weekly" | "today", options: IssueListOptions) {
  const query = new URLSearchParams();
  const nowIso = new Date().toISOString();
  const today = nowIso.slice(0, 10);
  const eligibility = [
    `issue_date.lte.${today}`,
    "or(archive_visible.is.null,archive_visible.eq.true)",
    `or(published_at.is.null,published_at.lte.${nowIso})`,
    `or(scheduled_for.is.null,scheduled_for.lte.${nowIso})`,
    `or(expires_at.is.null,expires_at.gt.${nowIso})`,
  ];
  const year = /^20\d{2}$/.test(options.year ?? "") ? String(options.year) : "";
  if (year) {
    eligibility.push(`issue_date.gte.${year}-01-01`);
    eligibility.push(`issue_date.lte.${year}-12-31`);
  }
  query.set("select", ISSUE_SELECT);
  query.set("tab_slug", `eq.${tabSlug}`);
  query.set("status", options.publishedOnly || tabSlug === "today" ? "eq.published" : "in.(published,archived)");
  query.set("and", `(${eligibility.join(",")})`);
  const search = (options.query ?? "")
    .replace(/[^a-z0-9\s-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
  if (/^\d{1,6}$/.test(search)) {
    // Historical records may carry the issue number in the legacy title suffix without edition_number.
    query.set("or", `(edition_number.eq.${search},title.ilike.*${search}*)`);
  } else if (search) query.set("title", `ilike.*${search.replace(/\s/g, "*")}*`);
  query.set("order", options.order ?? "issue_date.desc,published_at.desc,id.asc");
  query.set("limit", String(Math.max(1, Math.min(options.limit, 500))));
  if (options.offset) query.set("offset", String(Math.max(0, options.offset)));
  return query;
}

async function listIssues(
  tabSlug: "weekly" | "today",
  options: IssueListOptions,
): Promise<{ available: boolean; issues: ZenPublicationIssue[]; total: number }> {
  const result = await readPublicTable("zen_daily_issues", issueQuery(tabSlug, options), 60);
  const publicationType = tabSlug === "weekly" ? "weekly" : "daily";
  const issues = sortZenPublicationIssues(
    result.rows
      .map((row) => normalizeZenPublicationIssue(row, publicationType))
      .filter((issue): issue is ZenPublicationIssue => Boolean(issue)),
  );
  return { available: result.available, issues, total: result.total };
}

async function getIssueById(id: string) {
  const query = issueQuery("weekly", { limit: 1 });
  query.set("id", `eq.${id}`);
  const result = await readPublicTable("zen_daily_issues", query, 60);
  return {
    available: result.available,
    issue: normalizeZenPublicationIssue(result.rows[0], "weekly"),
  };
}

async function getSections(issueId: string) {
  const query = new URLSearchParams();
  query.set("select", SECTION_SELECT);
  query.set("issue_id", `eq.${issueId}`);
  query.set("is_published", "eq.true");
  query.set("order", "position.asc,id.asc");
  query.set("limit", "500");
  const result = await readPublicTable("zen_daily_sections", query, 30);
  const sections = sortZenPublicationBlocks(
    result.rows
      .map(normalizeZenPublicationBlock)
      .filter((section): section is ZenPublicationBlock => Boolean(section))
      .filter((section) => section.issueId === issueId),
  );
  return { available: result.available, sections };
}

async function getVisualsForIssues(issues: readonly ZenPublicationIssue[]) {
  if (!issues.length) return { available: true, visuals: [] as ZenPublicationVisual[] };
  const issueIds = issues.map((issue) => issue.id);
  const query = new URLSearchParams();
  query.set("select", SECTION_SELECT);
  query.set("issue_id", `in.(${issueIds.join(",")})`);
  query.set("kind", "in.(image,gallery)");
  query.set("is_published", "eq.true");
  query.set("order", "issue_id.asc,position.asc,id.asc");
  query.set("limit", String(Math.min(2500, Math.max(250, issueIds.length * 100))));
  const result = await readPublicTable("zen_daily_sections", query, 60);
  const byIssue = new Map<string, ZenPublicationBlock[]>();
  for (const row of result.rows) {
    const section = normalizeZenPublicationBlock(row);
    if (!section || !issueIds.includes(section.issueId)) continue;
    const sections = byIssue.get(section.issueId) ?? [];
    sections.push(section);
    byIssue.set(section.issueId, sections);
  }
  const visuals = issues
    .flatMap((issue) => extractZenPublicationVisuals(issue, byIssue.get(issue.id) ?? []))
    .filter((visual) => {
      try {
        const url = new URL(visual.url);
        return (url.protocol === "http:" || url.protocol === "https:") && !url.username && !url.password;
      } catch {
        return false;
      }
    });
  return { available: result.available, visuals };
}

async function getAdjacentIssue(
  issue: ZenPublicationIssue,
  direction: "older" | "newer",
) {
  const query = issueQuery("weekly", {
    limit: 1,
    order: direction === "older"
      ? "issue_date.desc,published_at.desc,id.asc"
      : "issue_date.asc,published_at.asc,id.desc",
  });
  query.set("issue_date", `${direction === "older" ? "lt" : "gt"}.${issue.issueDate}`);
  const result = await readPublicTable("zen_daily_issues", query, 60);
  return {
    available: result.available,
    issue: normalizeZenPublicationIssue(result.rows[0], "weekly"),
  };
}

function dailyLaneItems(sections: readonly ZenPublicationBlock[]) {
  return sections
    .filter((section) => !["divider", "image", "video", "embed", "gallery", "pdf", "html"].includes(section.kind))
    .map((section) => {
      const text = publicationPlainText(section);
      const title = section.heading || section.media.title || text.slice(0, 100);
      const summarySource = section.heading ? text.replace(section.heading, "").trim() : "";
      return {
        id: section.id,
        title,
        summary: summarySource.length > 180 ? `${summarySource.slice(0, 177).trimEnd()}…` : summarySource,
      };
    })
    .filter((item) => item.title)
    .slice(0, 4);
}

async function getZenDailyLane(): Promise<ZenDailyLane | null> {
  const dailyIssues = await listIssues("today", { limit: 1, publishedOnly: true });
  const issue = dailyIssues.issues[0];
  if (!dailyIssues.available || !issue) return null;
  const sections = await getSections(issue.id);
  if (!sections.available) return null;
  return { issue, items: dailyLaneItems(sections.sections) };
}

export async function getZenWeeklyHome(options: ZenWeeklyHomeOptions = {}): Promise<ZenWeeklyHomeData> {
  const archivePage = boundedPage(options.archivePage);
  const visualPage = boundedPage(options.visualPage);
  const archivePageSize = 24;
  const visualIssuePageSize = 12;
  const archiveQuery = (options.query ?? "").trim().slice(0, 80);
  const archiveYear = /^20\d{2}$/.test(options.year ?? "") ? String(options.year) : "";
  const [latestResult, recent, archive, visualIssues, daily] = await Promise.all([
    listIssues("weekly", { limit: 1, publishedOnly: true }),
    listIssues("weekly", { limit: 5 }),
    listIssues("weekly", {
      limit: archivePageSize,
      offset: (archivePage - 1) * archivePageSize,
      query: archiveQuery,
      year: archiveYear,
    }),
    listIssues("weekly", {
      limit: visualIssuePageSize,
      offset: (visualPage - 1) * visualIssuePageSize,
    }),
    getZenDailyLane(),
  ]);
  const latest = latestResult.issues[0] ?? null;
  const latestSections = latest ? await getSections(latest.id) : null;
  const visualResult = await getVisualsForIssues(visualIssues.issues);
  const latestArticle = latest
    ? { ...latest, sections: latestSections?.sections ?? [] }
    : null;
  return {
    available: latestResult.available && archive.available,
    latestArticle,
    recentIssues: recent.issues.filter((issue) => issue.id !== latest?.id).slice(0, 4),
    archive: {
      issues: archive.issues,
      total: archive.total,
      page: archivePage,
      pageSize: archivePageSize,
      query: archiveQuery,
      year: archiveYear,
    },
    visuals: {
      items: visualResult.visuals,
      page: visualPage,
      hasNext: visualPage * visualIssuePageSize < visualIssues.total,
    },
    daily,
  };
}

export async function getZenWeeklyArticle(id: string): Promise<ZenWeeklyArticleResult> {
  const target = await getIssueById(id);
  if (!target.issue) {
    return {
      available: target.available,
      article: null,
      previousIssue: null,
      nextIssue: null,
    };
  }
  const [sections, older, newer] = await Promise.all([
    getSections(target.issue.id),
    getAdjacentIssue(target.issue, "older"),
    getAdjacentIssue(target.issue, "newer"),
  ]);
  return {
    available: target.available && sections.available,
    article: { ...target.issue, sections: sections.sections },
    previousIssue: older.issue,
    nextIssue: newer.issue,
  };
}

export async function listZenWeeklySitemapIssues(): Promise<ZenPublicationIssue[]> {
  return (await listIssues("weekly", { limit: 500 })).issues;
}

export async function listZenWeeklyFeedIssues(limit = 30): Promise<ZenPublicationIssue[]> {
  return (await listIssues("weekly", { limit: Math.min(Math.max(limit, 1), 50) })).issues;
}
