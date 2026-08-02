import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render(path = "/", environment = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`https://preview.zenai.world${path}`, {
      headers: {
        accept: "text/html",
        host: "preview.zenai.world",
        "x-forwarded-host": "preview.zenai.world",
        "x-forwarded-proto": "https",
      },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
      ...environment,
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the finished ZEN gateway", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /<title>ZEN AI Co\. \| Intelligence Into Capability<\/title>/i,
  );
  assert.match(html, /Intelligence/);
  assert.match(html, /becomes capability\./);
  assert.match(html, /A United States First/);
  assert.match(html, /first youth AI literacy program in United States history/i);
  assert.match(html, /National capability record/);
  assert.match(html, /Historic proclamation/);
  assert.match(html, /src="\/og\.png"/);
  assert.match(html, /Learn it clearly\./);
  assert.match(html, /4/);
  assert.match(html, /learning modules/);
  assert.match(html, /8/);
  assert.match(html, /guided sections/);
  assert.match(html, /Text Genie/);
  assert.doesNotMatch(
    html,
    /Image Studio|Code Agent|Source Explorer|AI Decision Lab|Project Showcase/,
  );
  assert.match(html, /Choose what you came to do\./);
  assert.match(html, /One connected instrument/);
  assert.match(html, /Real work creates its own currency\./);
  assert.match(html, /What will you/);
  assert.match(html, /make real\?/);
  assert.match(html, /A capability company advancing human agency/);
  assert.match(html, /Proof before proclamation\./);
  assert.match(html, /Human-led by design\./);
  assert.match(html, /href="\/start"/);
  assert.match(html, /href="\/ai-literacy-constitution"/);
  assert.match(html, /https:\/\/arsenal\.world/);
  assert.match(
    html,
    /https:\/\/ai-pioneer-courses-20260725\.zenagi\.chatgpt\.site\/programs\/pioneer\/preview/,
  );
  assert.match(html, /https:\/\/us-ai-literacy\.lovable\.app\/programs\/vanguard/);
  assert.match(html, /href="\/work\?category=accomplishments"/);
  assert.doesNotMatch(html, /aipioneer\.zen\.ai|us\.zenai\.biz\/guest/);
  assert.match(html, /https:\/\/preview\.zenai\.world\/og\.png/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("renders canonical admin-managed ZEN pages with a safe home fallback", async () => {
  const originalFetch = globalThis.fetch;
  let managedHomeEnabled = false;
  const timestamp = "2026-08-01T20:00:00.000Z";
  const navigation = [
    {
      id: "10000000-0000-4000-8000-000000000001",
      site_key: "zen_world",
      page_role: "page",
      slug: "managed-lab",
      title: "Managed Lab",
      description: "A page published from the Arsenal admin control plane.",
      status: "published",
      nav_group: "Knowledge",
      parent_tab: null,
      nav_label: "Managed Lab",
      sort_order: 10,
      icon: "Layout",
      visibility: "public",
      open_in_nav: true,
      nav_locations: ["header", "footer"],
      created_at: timestamp,
      updated_at: timestamp,
    },
  ];
  const page = {
    ...navigation[0],
    page_type: "ai_html",
    embed_url: null,
    content_html: "<section><h2>Managed runtime content</h2></section>",
    embed_blocks: [],
    layout_config: {
      frame: "contained",
      gap: 24,
      background: "default",
      chrome: "arsenal",
      columns: 1,
    },
  };
  const home = {
    ...page,
    id: "10000000-0000-4000-8000-000000000002",
    page_role: "home",
    slug: "home",
    title: "Managed ZEN Home",
    nav_label: "Managed ZEN Home",
    nav_locations: [],
    content_html: "<section><h2>Home override is live</h2></section>",
  };

  globalThis.fetch = async (input, init) => {
    const url = input instanceof Request ? input.url : String(input);
    if (!url.startsWith("https://managed-content.example/rest/v1/rpc/")) {
      return originalFetch(input, init);
    }

    if (url.endsWith("/list_visible_admin_site_pages_for_nav")) {
      return Response.json(navigation);
    }
    if (url.endsWith("/get_visible_admin_site_home")) {
      return Response.json(managedHomeEnabled ? [home] : []);
    }
    if (url.endsWith("/get_visible_admin_site_page")) {
      const body = JSON.parse(String(init?.body ?? "{}"));
      return Response.json(body.requested_slug === page.slug ? [page] : []);
    }
    return new Response("Not found", { status: 404 });
  };

  const environment = {
    SUPABASE_URL: "https://managed-content.example",
    SUPABASE_PUBLISHABLE_KEY: "public-test-key",
  };

  try {
    const fallback = await render("/", environment);
    assert.equal(fallback.status, 200);
    const fallbackHtml = await fallback.text();
    assert.match(fallbackHtml, /Intelligence/);
    assert.match(fallbackHtml, /href="\/managed-lab"/);

    const managed = await render("/managed-lab", environment);
    assert.equal(managed.status, 200);
    const managedHtml = await managed.text();
    assert.match(managedHtml, /Managed Lab/);
    assert.match(managedHtml, /Managed runtime content/);
    assert.match(managedHtml, /sandbox="allow-scripts"/);
    assert.doesNotMatch(managedHtml, /allow-same-origin/);

    managedHomeEnabled = true;
    const managedHome = await render("/", environment);
    assert.equal(managedHome.status, 200);
    const managedHomeHtml = await managedHome.text();
    assert.match(managedHomeHtml, /Managed ZEN Home/);
    assert.match(managedHomeHtml, /Home override is live/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("serves the structured ZEN intake and AI literacy charter", async () => {
  const start = await render("/start");
  assert.equal(start.status, 200);
  const startHtml = await start.text();
  assert.match(startHtml, /Start with context\./);
  assert.match(startHtml, /Business or organization/);
  assert.match(startHtml, /Nothing leaves this page|remain in this page/i);

  const constitution = await render("/ai-literacy-constitution");
  assert.equal(constitution.status, 200);
  const constitutionHtml = await constitution.text();
  assert.match(constitutionHtml, /AI Literacy/);
  assert.match(constitutionHtml, /Human agency is the first capability\./);
  assert.match(constitutionHtml, /Living public draft/);

  const missingWork = await render("/work/not-a-real-page");
  assert.equal(missingWork.status, 404);
});

test("serves public policies and preserves legacy public links", async () => {
  const privacy = await render("/privacy-policy");
  assert.equal(privacy.status, 200);
  assert.match(await privacy.text(), /Privacy Policy/);

  const legacy = await render("/legacydossier");
  assert.equal(legacy.status, 308);
  assert.equal(
    legacy.headers.get("location"),
    "https://preview.zenai.world/work?category=accomplishments",
  );

  const favicon = await render("/favicon.ico");
  assert.equal(favicon.status, 308);
  assert.equal(
    favicon.headers.get("location"),
    "https://preview.zenai.world/favicon.svg",
  );
});

test("removes starter-only preview infrastructure", async () => {
  const [
    page,
    layout,
    packageJson,
    hub,
    css,
    contentServer,
    contentRenderer,
    managedServer,
    managedRenderer,
    managedRoute,
  ] =
    await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/zen-hub.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/work/content.server.ts", import.meta.url), "utf8"),
    readFile(
      new URL("../app/work/site-page-renderer.tsx", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../app/managed-pages.server.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/managed-page-renderer.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/[slug]/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /getManagedZenHome/);
  assert.match(page, /<ZenHub managedNavigation=/);
  assert.match(layout, /generateMetadata/);
  assert.match(layout, /socialImage/);
  assert.match(hub, /GuillocheField/);
  assert.match(hub, /DestinationDrawer/);
  assert.match(hub, /FIELDWORK/);
  assert.match(hub, /SIGNALS/);
  assert.match(hub, /CurrencyRail/);
  assert.match(hub, /RouteSigil/);
  assert.match(hub, /IntersectionObserver/);
  assert.match(css, /ecosystem-atlas/);
  assert.match(css, /standard-certificate/);
  assert.match(css, /issuance-section/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(contentServer, /site_publications/);
  assert.match(contentRenderer, /sandbox="allow-scripts"/);
  assert.match(contentRenderer, /allowEmbed/);
  assert.match(managedServer, /list_visible_admin_site_pages_for_nav/);
  assert.match(managedServer, /get_visible_admin_site_page/);
  assert.match(managedServer, /get_visible_admin_site_home/);
  assert.match(managedServer, /requested_site_key: ZEN_SITE_KEY/);
  assert.match(managedRenderer, /sandbox="allow-scripts"/);
  assert.doesNotMatch(managedRenderer, /allow-same-origin/);
  assert.match(managedRoute, /dynamic = "force-dynamic"/);
  assert.match(hub, /managedHeaderItems/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(page, /codex-preview|SkeletonPreview/);

  await assert.rejects(
    access(new URL("../app/_sites-preview/", import.meta.url)),
  );
  await access(new URL("../public/zen-mark.png", import.meta.url));
  await access(new URL("../public/og.png", import.meta.url));
  await assert.rejects(
    access(new URL("public/_sites-preview", templateRoot)),
  );
});
