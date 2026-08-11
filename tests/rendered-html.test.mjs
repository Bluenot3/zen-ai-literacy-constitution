import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

const assertNoRetiredZenSurface = (html) => {
  assert.doesNotMatch(html, /us\.zenai\.biz|\barena\b/i);
};

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
  assertNoRetiredZenSurface(html);
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
  assert.match(html, /src="\/national-first\.png"/);
  assert.match(html, /property="og:image" content="https:\/\/preview\.zenai\.world\/og\.png"/);
  assert.match(html, /Two divisions\./);
  assert.match(html, /One mission\./);
  assert.match(html, /Smart Business Solutions/);
  assert.match(html, /Custom Agentic Solutions/);
  assert.match(html, /Intelligent Automation/);
  assert.match(html, /AI Strategy &amp; Systems Integration/);
  assert.match(html, /Literacy &amp; Advancement Programs/);
  assert.match(html, /AI Pioneer Program/);
  assert.match(html, /Vanguard Program/);
  assert.match(html, /Web3 literacy/);
  assert.match(html, /ZEN Homeschool Kit/);
  assert.match(html, /Train-a-Trainer/);
  assert.match(html, /AI Literacy Constitution/);
  assert.match(html, /Design a business solution/);
  assert.match(html, /Create a Business Space/);
  assert.doesNotMatch(
    html,
    /Text Genie|Image Studio|Code Agent|Source Explorer|AI Decision Lab|Project Showcase/,
  );
  assert.doesNotMatch(html, /learning modules|guided sections|practical build formats/);
  assert.doesNotMatch(html, /ages 11[–-]18|interactive labs|advanced AI systems/i);
  assert.match(html, /Choose where you want to begin\./);
  assert.match(html, /One connected company/);
  assert.match(html, /Real work turns intelligence into lasting capability\./);
  assert.match(html, /What will you/);
  assert.match(html, /make real\?/);
  assert.match(html, /A capability company advancing human agency/);
  assert.match(html, /A future built to multiply capability\./);
  assert.match(html, /Every milestone becomes a foundation for what comes next\./);
  assert.doesNotMatch(html, /The public record grows when the evidence is ready\./);
  assert.match(html, /_energyField_/);
  assert.match(html, /_symbolOrbit_/);
  assert.match(html, /Human-led by design\./);
  assert.match(html, /Same ZEN\. Now connected through Arsenal\./);
  assert.match(html, /Same ZEN\./);
  assert.match(html, /Vastly more capability\./);
  assert.match(html, /Secure Arsenal sign-in opens your dashboard\./);
  assert.match(html, /Activate \/ Sign in/);
  assert.match(html, /https:\/\/arsenal\.world\/login\?next=%2Fdashboard/);
  assert.doesNotMatch(html, /supabase\.co\/auth\/v1\/authorize/i);
  assert.match(html, /href="\/access"/);
  assert.match(html, /Everything is now connected\./);
  assert.match(html, /Activate \/ Sign in/);
  assert.match(html, /People, groups &amp; collaboration/);
  assert.match(html, /Vanguard literacy &amp; portable proof/);
  assert.match(html, /Official ZEN AI Co\. channels/);
  assert.match(html, /https:\/\/www\.linkedin\.com\/company\/z3nai\//);
  assert.match(html, /https:\/\/x\.com\/ZEN_AGI/);
  assert.match(html, /https:\/\/www\.youtube\.com\/@ZENAIML/);
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
    {
      id: "10000000-0000-4000-8000-000000000004",
      site_key: "zen_world",
      page_role: "page",
      slug: "retired-ai-surface",
      title: "ZEN Arena",
      description: "The former AI Arena at https://us.zenai.biz",
      status: "published",
      nav_group: "Knowledge",
      parent_tab: null,
      nav_label: "AI Arena",
      sort_order: 11,
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
  const announcement = {
    id: "10000000-0000-4000-8000-000000000003",
    title: "A new capability is live",
    body: "Read the release record and enter the next chapter.",
    type: "banner",
    priority: "high",
    style: {
      bg: "#071b28",
      text: "#f4fbf8",
      status: "published",
      cta_label: "Read the release",
      cta_action: "/work",
    },
    starts_at: timestamp,
    ends_at: null,
    is_dismissible: true,
    created_at: timestamp,
    updated_at: timestamp,
  };
  const retiredAnnouncement = {
    ...announcement,
    id: "10000000-0000-4000-8000-000000000005",
    title: "Enter ZEN Arena",
    body: "Open the former experience.",
    style: {
      ...announcement.style,
      cta_action: "https://us.zenai.biz",
    },
  };
  const directOauthAnnouncement = {
    ...announcement,
    id: "10000000-0000-4000-8000-000000000006",
    title: "Activate your Arsenal identity",
    body: "Continue securely to your dashboard.",
    style: {
      ...announcement.style,
      cta_action:
        "https://kcyklettzoyexxynqfer.supabase.co/auth/v1/authorize?provider=google&redirect_to=https%3A%2F%2Farsenal.world%2Fdashboard",
    },
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
    if (url.endsWith("/list_visible_site_announcements")) {
      return Response.json([
        announcement,
        retiredAnnouncement,
        directOauthAnnouncement,
      ]);
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
    assert.match(fallbackHtml, /A new capability is live/);
    assert.match(fallbackHtml, /Read the release record/);
    assert.match(fallbackHtml, /data-zen-announcement-id=/);
    assert.match(fallbackHtml, /href="\/work"/);
    assertNoRetiredZenSurface(fallbackHtml);

    const managed = await render("/managed-lab", environment);
    assert.equal(managed.status, 200);
    const managedHtml = await managed.text();
    assert.match(managedHtml, /Managed Lab/);
    assert.match(managedHtml, /Managed runtime content/);
    assert.match(managedHtml, /sandbox="allow-scripts"/);
    assert.doesNotMatch(managedHtml, /allow-same-origin/);
    assertNoRetiredZenSurface(managedHtml);

    managedHomeEnabled = true;
    const managedHome = await render("/", environment);
    assert.equal(managedHome.status, 200);
    const managedHomeHtml = await managedHome.text();
    assert.match(managedHomeHtml, /Managed ZEN Home/);
    assert.match(managedHomeHtml, /Home override is live/);
    assertNoRetiredZenSurface(managedHomeHtml);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("serves the structured ZEN intake and AI literacy charter", async () => {
  const access = await render("/access");
  assert.equal(access.status, 200);
  const accessHtml = await access.text();
  assertNoRetiredZenSurface(accessHtml);
  assert.match(accessHtml, /Same ZEN\./);
  assert.match(accessHtml, /Now powered by Arsenal\./);
  assert.match(accessHtml, /Activate your Arsenal access\./);
  assert.match(accessHtml, /dashboard destination stays attached/);
  assert.match(accessHtml, /Activate \/ Sign in/);
  assert.match(accessHtml, /Continue with email/);
  assert.doesNotMatch(accessHtml, /recover|recovery/i);
  assert.match(accessHtml, /Everything has a new home\./);
  assert.match(accessHtml, /Members Area/);
  assert.match(accessHtml, /Arsenal account, profile &amp; dashboard/);
  assert.match(accessHtml, /Online Programs/);
  assert.match(accessHtml, /Arsenal Workspace, Files &amp; Vault/);
  assert.match(accessHtml, /Store, Gifts &amp; Plans/);
  assert.match(accessHtml, /Donations, Invoices &amp; Pay Links/);
  assert.match(accessHtml, /What existing users need to know\./);
  assert.match(accessHtml, /Activate \/ Sign in/);
  assert.match(accessHtml, /https:\/\/arsenal\.world\/login\?next=%2Fdashboard/);
  assert.doesNotMatch(accessHtml, /supabase\.co\/auth\/v1\/authorize/i);
  assert.match(accessHtml, /Enter AI Pioneer/);
  assert.match(accessHtml, /Enter Vanguard/);
  assert.match(accessHtml, /Missing existing access\?/);
  assert.match(accessHtml, /https:\/\/www\.linkedin\.com\/company\/z3nai\//);
  assert.match(accessHtml, /https:\/\/x\.com\/ZEN_AGI/);
  assert.match(accessHtml, /https:\/\/www\.youtube\.com\/@ZENAIML/);

  const start = await render("/start");
  assert.equal(start.status, 200);
  const startHtml = await start.text();
  assertNoRetiredZenSurface(startHtml);
  assert.match(startHtml, /Start with context\./);
  assert.match(startHtml, /Business or organization/);
  assert.match(startHtml, /Nothing leaves this page|remain in this page/i);

  const constitution = await render("/ai-literacy-constitution");
  assert.equal(constitution.status, 200);
  const constitutionHtml = await constitution.text();
  assertNoRetiredZenSurface(constitutionHtml);
  assert.match(constitutionHtml, /AI Literacy/);
  assert.match(constitutionHtml, /Human agency is the first capability\./);
  assert.match(constitutionHtml, /Living public draft/);

  const missingWork = await render("/work/not-a-real-page");
  assert.equal(missingWork.status, 404);
});

test("serves the public archive and preserves legacy public links", async () => {
  const privacy = await render("/privacy-policy");
  assert.equal(privacy.status, 200);
  assert.match(await privacy.text(), /Privacy Policy/);

  const dossier = await render("/legacy-dossier");
  assert.equal(dossier.status, 200);
  const dossierHtml = await dossier.text();
  assert.match(dossierHtml, /ZEN Legacy/);
  assert.match(dossierHtml, /ffed4cc81b735d7ddc164ca3c851f9fffb12ae04f23598d7a0b7110212c6a578/i);
  assert.match(dossierHtml, /ZEN-PD-2023-2025-v2/);

  const gallery = await render("/gallery");
  assert.equal(gallery.status, 200);
  const galleryHtml = await gallery.text();
  assertNoRetiredZenSurface(galleryHtml);
  assert.match(galleryHtml, /ZEN field/);
  assert.match(galleryHtml, /Steam the Block 2024/);
  assert.match(galleryHtml, /View the recovered record/);
  assert.doesNotMatch(galleryHtml, /zenai\.world\/whyzen/);

  const work = await render("/work");
  assert.equal(work.status, 200);
  const workHtml = await work.text();
  assertNoRetiredZenSurface(workHtml);
  assert.match(workHtml, /AI Pioneer: the founding public record/);
  assert.match(workHtml, /AI Literacy Constitution/);
  assert.doesNotMatch(workHtml, /Nothing has been published/);

  const legacy = await render("/legacydossier");
  assert.equal(legacy.status, 308);
  assert.equal(
    legacy.headers.get("location"),
    "https://preview.zenai.world/legacy-dossier",
  );

  const favicon = await render("/favicon.ico");
  assert.equal(favicon.status, 308);
  assert.equal(
    favicon.headers.get("location"),
    "https://preview.zenai.world/favicon.svg",
  );

  const whyZen = await render("/whyzen");
  assert.equal(whyZen.status, 308);
  assert.equal(
    whyZen.headers.get("location"),
    "https://preview.zenai.world/gallery",
  );

  const upgrade = await render("/upgrade");
  assert.equal(upgrade.status, 308);
  assert.equal(
    upgrade.headers.get("location"),
    "https://preview.zenai.world/access",
  );

  const account = await render("/account");
  assert.equal(account.status, 308);
  assert.equal(
    account.headers.get("location"),
    "https://preview.zenai.world/access",
  );

  const missing = await render("/retired-wix-page");
  assert.equal(missing.status, 404);
  const missingHtml = await missing.text();
  assert.match(missingHtml, /This path moved\. ZEN did not\./);
  assert.match(missingHtml, /Find your ZEN route/);
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
    analyticsRuntime,
    announcementRuntime,
    announcementServer,
    heritageArchive,
    transitionUpgrade,
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
    readFile(new URL("../app/site-analytics.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/site-announcement-banner.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/site-announcements.server.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/heritage-archive.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/transition-upgrade.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /getManagedZenHome/);
  assert.match(page, /<ZenHub managedNavigation=/);
  assert.match(layout, /generateMetadata/);
  assert.match(layout, /socialImage/);
  assert.match(hub, /GuillocheField/);
  assert.match(hub, /DestinationDrawer/);
  assert.match(hub, /CompanyPortfolio/);
  assert.match(hub, /HeritageArchive/);
  assert.match(hub, /TransitionUpgrade/);
  assert.match(transitionUpgrade, /Vastly more capability/);
  assert.match(heritageArchive, /ZEN Legacy Dossier/);
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
  assert.match(hub, /<ZenCornerLogo position="tl" \/>/);
  assert.match(hub, /<ZenCornerLogo position="tr" \/>/);
  assert.match(hub, /src="\/zen-brand-logo-stencil\.png"/);
  assert.doesNotMatch(hub, /WireZenCornerMark/);
  assert.doesNotMatch(hub, /corner-wire-mark/);
  assert.match(hub, /<SpectralTreasuryThread \/>/);
  assert.match(hub, /security-thread__prism/);
  assert.match(hub, /security-thread__lens/);
  assert.match(hub, /className="seal-spectrum"/);
  assert.match(hub, /className="treasury-fiber-field"/);
  assert.doesNotMatch(hub, /corner corner--tl">Z</);
  assert.doesNotMatch(hub, /corner corner--tr">AI</);
  assert.match(layout, /listVisibleZenSiteAnnouncements/);
  assert.match(layout, /<ZenSiteAnalytics \/>/);
  assert.match(analyticsRuntime, /G-F85YFS8ZPK/);
  assert.match(analyticsRuntime, /allow_google_signals: false/);
  assert.match(analyticsRuntime, /analytics_storage: "denied"/);
  assert.match(analyticsRuntime, /globalPrivacyControl/);
  assert.doesNotMatch(analyticsRuntime, /page_location:\s*window\.location\.href/);
  assert.match(analyticsRuntime, /announcement_impression/);
  assert.match(analyticsRuntime, /outbound_click/);
  assert.match(announcementRuntime, /announcement_dismissed/);
  assert.match(announcementServer, /list_visible_site_announcements/);
  assert.match(announcementServer, /requested_site_key: ZEN_SITE_KEY/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(page, /codex-preview|SkeletonPreview/);

  await assert.rejects(
    access(new URL("../app/_sites-preview/", import.meta.url)),
  );
  await access(new URL("../public/zen-mark.png", import.meta.url));
  await access(new URL("../public/og.png", import.meta.url));
  await access(new URL("../public/national-first.png", import.meta.url));
  await access(new URL("../public/gallery/archive-08.jpg", import.meta.url));
  await access(
    new URL(
      "../public/legacy-dossier/record-case/2023-2025/ZEN_AI_Pioneer_Proof_Dossier_2023-2025%20(2).pdf",
      import.meta.url,
    ),
  );
  await assert.rejects(
    access(new URL("public/_sites-preview", templateRoot)),
  );
});
