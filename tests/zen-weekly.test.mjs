import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const latestId = "11111111-1111-4111-8111-111111111111";
const olderId = "22222222-2222-4222-8222-222222222222";
const draftId = "33333333-3333-4333-8333-333333333333";
const futureId = "44444444-4444-4444-8444-444444444444";
const dailyId = "55555555-5555-4555-8555-555555555555";
const scheduledId = "66666666-6666-4666-8666-666666666666";
const hiddenId = "77777777-7777-4777-8777-777777777777";
const expiredId = "88888888-8888-4888-8888-888888888888";

const weeklyIssues = [
  {
    id: draftId,
    tab_slug: "weekly",
    issue_date: "2026-08-15",
    edition_number: 10,
    title: "Draft Must Stay Private",
    subtitle: "Never public",
    cover_url: null,
    masthead: {},
    status: "draft",
    published_at: null,
    archive_visible: true,
  },
  {
    id: futureId,
    tab_slug: "weekly",
    issue_date: "2099-01-01",
    edition_number: 99,
    title: "Future Release Must Stay Private",
    subtitle: "Never public",
    cover_url: null,
    masthead: {},
    status: "published",
    published_at: "2099-01-01T00:00:00.000Z",
    archive_visible: true,
  },
  {
    id: scheduledId,
    tab_slug: "weekly",
    issue_date: "2026-08-16",
    edition_number: 98,
    title: "Scheduled Release Must Stay Private",
    subtitle: "Never public",
    cover_url: null,
    masthead: {},
    status: "published",
    published_at: null,
    scheduled_for: "2099-01-01T00:00:00.000Z",
    expires_at: null,
    archive_visible: true,
  },
  {
    id: hiddenId,
    tab_slug: "weekly",
    issue_date: "2026-08-06",
    edition_number: 8,
    title: "Archive Hidden Must Stay Private",
    subtitle: "Never public",
    cover_url: null,
    masthead: {},
    status: "archived",
    published_at: "2026-08-06T12:00:00.000Z",
    scheduled_for: null,
    expires_at: null,
    archive_visible: false,
  },
  {
    id: expiredId,
    tab_slug: "weekly",
    issue_date: "2026-08-05",
    edition_number: 7,
    title: "Expired Release Must Stay Private",
    subtitle: "Never public",
    cover_url: null,
    masthead: {},
    status: "published",
    published_at: "2026-08-05T12:00:00.000Z",
    scheduled_for: null,
    expires_at: "2026-08-10T00:00:00.000Z",
    archive_visible: true,
  },
  {
    id: olderId,
    tab_slug: "weekly",
    issue_date: "2026-08-07",
    edition_number: null,
    title: "The Earlier Record | ZEN WEEKLY | Issue #8",
    subtitle: "",
    cover_url: null,
    masthead: {},
    status: "archived",
    published_at: "2026-08-07T12:00:00.000Z",
    archive_visible: true,
  },
  {
    id: latestId,
    tab_slug: "weekly",
    issue_date: "2026-08-14",
    edition_number: 9,
    title: "Sovereign Systems",
    subtitle: "A real public summary from the publication record.",
    cover_url: "https://media.example/sovereign.webp",
    masthead: { byline: "ZEN Editorial", cover_alt: "Engraved system map", category: "Technology", tags: ["AI", "Systems"] },
    status: "published",
    published_at: "2026-08-14T12:00:00.000Z",
    archive_visible: true,
  },
];

const dailyIssue = {
  id: dailyId,
  tab_slug: "today",
  issue_date: "2026-08-15",
  edition_number: null,
  title: "ZEN Daily",
  subtitle: "",
  cover_url: null,
  masthead: {},
  status: "published",
  published_at: "2026-08-15T04:00:00.000Z",
  archive_visible: true,
};

const weeklySections = [
  { id: "s1", issue_id: latestId, kind: "markdown", position: 1, heading: "The Public Contract", body: "**Published evidence** remains authoritative.\n\n- One source\n- Multiple readers\n\n[Source](https://example.com/source)", data: {}, is_published: true },
  { id: "s2", issue_id: latestId, kind: "image", position: 2, heading: "System map", body: "Stored image caption", data: { url: "https://media.example/map.webp", alt: "Stored map alt text" }, is_published: true },
  { id: "s3", issue_id: latestId, kind: "video", position: 3, heading: "Field recording", body: "", data: { url: "https://www.youtube.com/watch?v=abcdefghijk", caption: "Stored video caption" }, is_published: true },
  { id: "s4", issue_id: latestId, kind: "embed", position: 4, heading: "External insert", body: "", data: { url: "https://untrusted.example/embed" }, is_published: true },
  { id: "s5", issue_id: latestId, kind: "html", position: 5, heading: "Document fragment", body: "<script>window.pwned=true</script><p onclick=\"alert(1)\">Safe fragment</p>", data: {}, is_published: true },
  { id: "s6", issue_id: latestId, kind: "quote", position: 6, heading: "", body: "Public truth compounds.", data: { attribution: "ZEN Editorial" }, is_published: true },
  { id: "s7", issue_id: latestId, kind: "gallery", position: 7, heading: "Visual sequence", body: "", data: { layout: "sequence", images: [{ url: "https://media.example/chart.webp", alt: "Published systems chart", caption: "A canonical chart", role: "infographic" }, { url: "https://media.example/art.webp", alt: "Published issue artwork", caption: "Canonical artwork" }] }, is_published: true },
  { id: "s-private", issue_id: latestId, kind: "text", position: 7, heading: "Private section", body: "Must not render", data: {}, is_published: false },
];

function mockedEnvironment() {
  return {
    SUPABASE_URL: "https://publication.example",
    SUPABASE_PUBLISHABLE_KEY: "public-test-key",
  };
}

async function render(path, environment = mockedEnvironment()) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    const url = new URL(typeof input === "string" ? input : input.url);
    if (url.origin !== "https://publication.example") return originalFetch(input, init);
    if (url.pathname.startsWith("/rest/v1/rpc/")) return Response.json([]);
    if (url.pathname.endsWith("/zen_daily_issues")) {
      const tab = url.searchParams.get("tab_slug");
      let rows = tab === "eq.today" ? [dailyIssue] : [...weeklyIssues];
      const requestedId = url.searchParams.get("id")?.replace(/^eq\./, "");
      if (requestedId) rows = rows.filter((row) => row.id === requestedId);
      const allowedStatuses = url.searchParams.get("status") === "eq.published"
        ? new Set(["published"])
        : new Set(["published", "archived"]);
      const now = Date.parse("2026-08-16T12:00:00.000Z");
      rows = rows.filter((row) => {
        const publishedAt = row.published_at ? Date.parse(row.published_at) : null;
        const scheduledFor = row.scheduled_for ? Date.parse(row.scheduled_for) : null;
        const expiresAt = row.expires_at ? Date.parse(row.expires_at) : null;
        return allowedStatuses.has(row.status)
          && row.archive_visible !== false
          && Date.parse(`${row.issue_date}T00:00:00.000Z`) <= now
          && (publishedAt === null || publishedAt <= now)
          && (scheduledFor === null || scheduledFor <= now)
          && (expiresAt === null || expiresAt > now);
      });
      const titleQuery = url.searchParams.get("title")?.replace(/^ilike\.\*/, "").replace(/\*$/, "").replace(/\*/g, " ").toLowerCase();
      if (titleQuery) rows = rows.filter((row) => row.title.toLowerCase().includes(titleQuery));
      const edition = url.searchParams.get("edition_number")?.replace(/^eq\./, "");
      if (edition) rows = rows.filter((row) => String(row.edition_number) === edition);
      const disjunction = url.searchParams.get("or") ?? "";
      const numericEdition = disjunction.match(/edition_number\.eq\.(\d+)/)?.[1];
      const numericTitle = disjunction.match(/title\.ilike\.\*(\d+)\*/)?.[1];
      if (numericEdition && numericTitle) {
        rows = rows.filter((row) =>
          String(row.edition_number) === numericEdition || row.title.includes(numericTitle)
        );
      }
      const andFilter = url.searchParams.get("and") ?? "";
      const year = andFilter.match(/issue_date\.gte\.(20\d{2})-01-01/)?.[1];
      if (year) rows = rows.filter((row) => row.issue_date.startsWith(year));
      rows.sort((left, right) => right.issue_date.localeCompare(left.issue_date));
      const total = rows.length;
      const offset = Number(url.searchParams.get("offset") ?? 0);
      const limit = Number(url.searchParams.get("limit") ?? rows.length);
      rows = rows.slice(offset, offset + limit);
      return Response.json(rows, { headers: { "content-range": `${rows.length ? offset : "*"}-${rows.length ? offset + rows.length - 1 : "*"}/${total}` } });
    }
    if (url.pathname.endsWith("/zen_daily_sections")) {
      const issueFilter = url.searchParams.get("issue_id") ?? "";
      const issueIds = issueFilter.startsWith("eq.")
        ? [issueFilter.slice(3)]
        : issueFilter.replace(/^in\.\(/, "").replace(/\)$/, "").split(",").filter(Boolean);
      let rows = [
        ...weeklySections,
        { id: "d1", issue_id: dailyId, kind: "text", position: 1, heading: "Current signal", body: "A published daily summary.", data: {}, is_published: true },
      ].filter((section) => issueIds.includes(section.issue_id));
      if (url.searchParams.get("is_published") === "eq.true") rows = rows.filter((section) => section.is_published);
      const kinds = url.searchParams.get("kind")?.replace(/^in\.\(/, "").replace(/\)$/, "").split(",");
      if (kinds?.length) rows = rows.filter((section) => kinds.includes(section.kind));
      rows.sort((left, right) => left.position - right.position);
      return Response.json(rows, { headers: { "content-range": `0-${Math.max(0, rows.length - 1)}/${rows.length}` } });
    }
    return Response.json([]);
  };

  try {
    const workerUrl = new URL("../dist/server/index.js", import.meta.url);
    workerUrl.searchParams.set("zen-weekly-test", `${process.pid}-${Date.now()}-${Math.random()}`);
    const { default: worker } = await import(workerUrl.href);
    return await worker.fetch(
      new Request(`https://www.zenai.world${path}`, {
        headers: { accept: "text/html", host: "www.zenai.world", "x-forwarded-host": "www.zenai.world", "x-forwarded-proto": "https" },
      }),
      {
        ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
        ...environment,
      },
      { waitUntil() {}, passThroughOnException() {} },
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test("ZEN Weekly home exposes only ordered public records and the existing ZEN Daily source", async () => {
  const response = await render("/zen-weekly");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>ZEN Weekly \| ZEN AI Co\.<\/title>/);
  assert.match(html, />ZEN WEEKLY</);
  assert.match(html, /Sovereign Systems/);
  assert.match(html, /The Earlier Record/);
  assert.ok(html.indexOf("Sovereign Systems") < html.indexOf("The Earlier Record"));
  assert.doesNotMatch(html, /Draft Must Stay Private|Future Release Must Stay Private|Scheduled Release Must Stay Private|Archive Hidden Must Stay Private|Expired Release Must Stay Private/);
  assert.match(html, new RegExp(`/zen-weekly/sovereign-systems--${latestId}`));
  assert.match(html, /Visual archive/);
  assert.match(html, /https:\/\/media\.example\/map\.webp/);
  assert.match(html, /https:\/\/media\.example\/chart\.webp/);
  assert.match(html, /aria-label="ZEN publication navigation"/);
  assert.match(html, /ZEN Daily/);
  assert.match(html, /Current signal/);
  assert.doesNotMatch(html, /public-test-key|service[_-]?role/i);
});

test("article route canonicalizes stale titles and preserves rich media behind a sanitized public boundary", async () => {
  const staleResponse = await render(`/zen-weekly/old-title-that-must-still-resolve--${latestId}`);
  assert.equal(staleResponse.status, 307);
  assert.equal(new URL(staleResponse.headers.get("location"), "https://www.zenai.world").pathname, `/zen-weekly/sovereign-systems--${latestId}`);

  const response = await render(`/zen-weekly/sovereign-systems--${latestId}`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Sovereign Systems/);
  assert.match(html, /The Public Contract/);
  assert.match(html, /Published evidence/);
  assert.match(html, /src="https:\/\/media\.example\/map\.webp"/);
  assert.match(html, /alt="Stored map alt text"/);
  assert.match(html, /Expand image: Stored image caption/);
  assert.match(html, /Close image viewer/);
  assert.match(html, /<dialog/);
  assert.match(html, /youtube-nocookie\.com\/embed\/abcdefghijk/);
  assert.match(html, /Open the published media source/);
  assert.match(html, /Safe fragment/);
  assert.match(html, /sandbox=""/);
  assert.doesNotMatch(html, /window\.pwned|onclick=|Private section|Must not render/);
  assert.match(html, /rel="canonical" href="https:\/\/www\.zenai\.world\/zen-weekly\/sovereign-systems--11111111-1111-4111-8111-111111111111"/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /NewsArticle/);
});

test("older UUID-only routes canonicalize when optional metadata and media are absent", async () => {
  const legacyResponse = await render(`/zen-weekly/${olderId}`);
  assert.equal(legacyResponse.status, 307);
  assert.equal(new URL(legacyResponse.headers.get("location"), "https://www.zenai.world").pathname, `/zen-weekly/the-earlier-record--${olderId}`);

  const response = await render(`/zen-weekly/the-earlier-record--${olderId}`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /The Earlier Record/);
  assert.doesNotMatch(html, /By undefined|src="null"|Issue null/);
});

test("private issue identities do not leak and archive filtering stays bounded", async () => {
  for (const id of [draftId, futureId, scheduledId, hiddenId, expiredId]) {
    const response = await render(`/zen-weekly/private-title--${id}`);
    assert.equal(response.status, 404);
    assert.doesNotMatch(await response.text(), /Draft Must Stay Private|Future Release Must Stay Private|Scheduled Release Must Stay Private|Archive Hidden Must Stay Private|Expired Release Must Stay Private/);
  }

  const filtered = await render("/zen-weekly?q=Earlier&year=2026");
  assert.equal(filtered.status, 200);
  const html = await filtered.text();
  assert.match(html, /value="Earlier"/);
  assert.match(html, /value="2026"/);
  assert.match(html, /Search ledger/);

  const numeric = await render("/zen-weekly?q=8");
  assert.equal(numeric.status, 200);
  const numericHtml = await numeric.text();
  assert.match(numericHtml, /The Earlier Record/);
  assert.match(numericHtml, /value="8"/);

  const empty = await render("/zen-weekly?q=NoMatch");
  assert.equal(empty.status, 200);
  const emptyHtml = await empty.text();
  assert.match(emptyHtml, /No public ZEN Weekly issues are available/);
  assert.match(emptyHtml, /Search ledger/);
  assert.match(emptyHtml, /value="NoMatch"/);
  assert.match(emptyHtml, />Clear</);
});

test("RSS exposes only canonical public issue summaries", async () => {
  const response = await render("/zen-weekly/feed.xml");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /application\/rss\+xml/);
  const xml = await response.text();
  assert.match(xml, /<rss version="2.0">/);
  assert.match(xml, new RegExp(`sovereign-systems--${latestId}`));
  assert.match(xml, /The Earlier Record/);
  assert.doesNotMatch(xml, /Draft Must Stay Private|Future Release Must Stay Private|Scheduled Release Must Stay Private|Archive Hidden Must Stay Private|Expired Release Must Stay Private/);
});

test("publication service failure preserves the shell without fabricated content", async () => {
  const response = await render("/zen-weekly", {});
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Publication temporarily unavailable/);
  assert.doesNotMatch(html, /Sovereign Systems|Lorem ipsum|Sample article/);
});

test("ZEN Weekly source contract is server-only, filtered, responsive, and indexable", async () => {
  const [server, contract, renderer, home, article, css, sitemap, tools, lightbox, visualArchive, feed, hub] = await Promise.all([
    readFile(new URL("../app/zen-weekly/publication.server.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/zen-weekly/publication.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/zen-weekly/publication-renderer.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/zen-weekly/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/zen-weekly/[articleRoute]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/zen-weekly/zen-weekly.module.css", import.meta.url), "utf8"),
    readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/zen-weekly/article-tools.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/zen-weekly/image-lightbox.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/zen-weekly/visual-archive.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/zen-weekly/feed.xml/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/zen-hub.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(server, /^import "server-only";/);
  assert.match(server, /status.*in\.\(published,archived\)/s);
  assert.match(server, /archive_visible\.eq\.true/);
  assert.match(server, /scheduled_for\.is\.null/);
  assert.match(server, /expires_at\.is\.null/);
  assert.match(server, /archivePageSize = 24/);
  assert.match(server, /issue_id.*in\.\(/s);
  assert.match(server, /is_published.*eq\.true/s);
  assert.match(server, /SUPABASE_PUBLISHABLE_KEY/);
  assert.doesNotMatch(server, /SERVICE_ROLE|service_role/);
  assert.match(contract, /publishedAt.*now/s);
  assert.match(contract, /buildZenWeeklyArticlePath/);
  assert.match(renderer, /sanitizeHtmlDocument/);
  assert.match(contract, /extractZenPublicationVisuals/);
  assert.match(renderer, /SAFE_EMBED_HOSTS/);
  assert.match(renderer, /sandbox=""/);
  assert.match(home, /<h1 className=\{styles\.latestHeadline\}/);
  assert.match(home, /coverAlt \|\| `\$\{publicationDisplayTitle\(.+?\.title\)\} cover`/);
  assert.match(home, /archiveByYear/);
  assert.match(home, /archivePlate/);
  assert.match(article, /type="application\/ld\+json"/);
  assert.match(home, /ZenWeeklyVisualArchive/);
  assert.match(home, /archivePageCount/);
  assert.match(article, /alternates: \{ canonical: canonicalUrl \}/);
  assert.match(css, /@media \(max-width: 640px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(article, /redirect\(article\.canonicalPath\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /\.visualSpecimen button[\s\S]*min-height: 2\.75rem/);
  assert.match(css, /\.archiveYear > small \{ grid-column: 3; grid-row: 1; \}/);
  assert.equal(home.match(/className=\{styles\.archiveControls\}/g)?.length, 1);
  assert.match(sitemap, /listZenWeeklySitemapIssues/);
  assert.match(server, /query\.set\("or",[\s\S]*edition_number\.eq\.[\s\S]*title\.ilike/);
  assert.match(tools, /role="progressbar"/);
  assert.match(tools, /navigator\.share/);
  assert.match(lightbox, /dialog\.showModal\(\)/);
  assert.match(lightbox, /onClose=\{handleClose\}/);
  assert.match(lightbox, /aria-label="Close image viewer"/);
  assert.match(css, /\.lightbox::backdrop/);
  assert.match(css, /\.archiveVolume/);
  assert.match(lightbox, /Zoomable image area/);
  assert.match(visualArchive, /ArrowLeft/);
  assert.match(visualArchive, /ArrowRight/);
  assert.match(visualArchive, /Provenance record/);
  assert.match(visualArchive, /trackZenSiteEvent\("zen_weekly_art_open"/);
  assert.match(feed, /application\/rss\+xml/);
  assert.match(hub, /weekly: "\/zen-weekly"/);
  assert.match(hub, /<a href=\{LINKS\.weekly\}>ZEN Weekly<\/a>/);
  assert.match(css, /\.visualLedger/);
});
