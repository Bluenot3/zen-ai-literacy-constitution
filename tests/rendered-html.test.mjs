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
  assert.match(html, /src="\/national-first\.png"/);
  assert.match(html, /property="og:image" content="https:\/\/www\.zenai\.world\/og\.png"/);
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
  assert.match(html, /Train-the-Trainer/);
  assert.match(html, /Institutional Programs/);
  assert.match(html, /AI Literacy Constitution/);
  assert.match(html, /Design a business solution/);
  assert.match(html, /Create a Business Space/);
  assert.match(html, /Build with Arsenal/);
  assert.match(
    html,
    /class="hero-actions"[\s\S]{0,600}class="primary-button"[\s\S]{0,400}Build with Arsenal/i,
    "Build with Arsenal must remain the dominant homepage action",
  );
  assert.match(html, /Transform a Business/);
  assert.match(html, /Join a Program/);
  assert.match(html, /Partner with ZEN/);
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
  assert.match(html, /href="\/start"/);
  assert.match(html, /href="\/ai-literacy-constitution"/);
  assert.match(html, /https:\/\/arsenal\.world/);
  assert.match(html, /https:\/\/arsenal\.world\/programs\/pioneer/);
  assert.match(html, /https:\/\/arsenal\.world\/programs\/vanguard/);
  assert.match(
    html,
    /next=%2Fagents%2Fnew%3Futm_source%3Dzenai\.world%26utm_medium%3Downed%26utm_campaign%3Dbuild_with_arsenal/,
  );
  assert.match(
    html,
    /next=%2Fbusiness-spaces%2Fnew%3Futm_source%3Dzenai\.world%26utm_medium%3Downed%26utm_campaign%3Dbusiness_space_intake/,
  );
  assert.doesNotMatch(html, /ai-pioneer-courses-20260725\.zenagi\.chatgpt\.site/);
  assert.doesNotMatch(html, /us-ai-literacy\.lovable\.app/);
  assert.doesNotMatch(html, /Explore the historic program/);
  assert.match(html, /href="\/work\?category=accomplishments"/);
  assert.doesNotMatch(html, /aipioneer\.zen\.ai|us\.zenai\.biz\/guest/);
  assert.match(html, /https:\/\/www\.zenai\.world\/og\.png/);
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
    content_html: "<section><h2>Managed runtime content</h2><a href=\"https://us-ai-literacy.lovable.app/guide?program_id=vanguard\">Protected Program</a></section>",
    embed_blocks: [],
    layout_config: {
      frame: "contained",
      gap: 24,
      background: "default",
      chrome: "arsenal",
      columns: 1,
    },
  };
  const protectedEmbed = {
    ...page,
    id: "10000000-0000-4000-8000-000000000004",
    slug: "managed-program",
    title: "Managed Program",
    page_type: "iframe",
    embed_url: "https://ai-pioneer-courses-20260725.zenagi.chatgpt.site/programs/pioneer/preview",
    content_html: "",
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
      return Response.json(
        body.requested_slug === page.slug
          ? [page]
          : body.requested_slug === protectedEmbed.slug ? [protectedEmbed] : [],
      );
    }
    if (url.endsWith("/get_visible_zen_site_publication")) {
      return Response.json([{ id: "10000000-0000-4000-8000-000000000005", revision: 3, content: {
        eyebrow: "Controlled from Arsenal Admin",
        headline: "Intelligence, operated from Arsenal.",
        subheadline: "A structured public message with bounded destinations.",
        primary_destination: "ARSENAL_BUILD",
        secondary_destination: "BUSINESS_TRANSFORM",
      }, seo: {}, published_at: timestamp }]);
    }
    if (url.endsWith("/get_visible_zen_campaign")) return Response.json([]);
    if (url.endsWith("/list_visible_site_announcements")) {
      return Response.json([announcement]);
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
    assert.match(fallbackHtml, /Controlled from Arsenal Admin/);
    assert.match(fallbackHtml, /Intelligence, operated from Arsenal\./);
    assert.match(fallbackHtml, /A new capability is live/);
    assert.match(fallbackHtml, /Read the release record/);
    assert.match(fallbackHtml, /data-zen-announcement-id=/);
    assert.match(fallbackHtml, /href="\/work"/);

    const managed = await render("/managed-lab", environment);
    assert.equal(managed.status, 200);
    const managedHtml = await managed.text();
    assert.match(managedHtml, /Managed Lab/);
    assert.match(managedHtml, /Managed runtime content/);
    assert.match(managedHtml, /sandbox="allow-scripts"/);
    assert.doesNotMatch(managedHtml, /allow-same-origin/);
    assert.match(managedHtml, /arsenal\.world\/login\?next=/);
    assert.doesNotMatch(managedHtml, /us-ai-literacy\.lovable\.app/);

    const protectedProgram = await render("/managed-program", environment);
    assert.equal(protectedProgram.status, 200);
    const protectedProgramHtml = await protectedProgram.text();
    assert.match(protectedProgramHtml, /Protected ZEN Programs open through Arsenal/);
    assert.match(protectedProgramHtml, /arsenal\.world\/login\?next=/);
    assert.doesNotMatch(protectedProgramHtml, /<iframe[^>]+ai-pioneer-courses/i);
    assert.doesNotMatch(protectedProgramHtml, /ai-pioneer-courses-20260725\.zenagi\.chatgpt\.site/);

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

test("keeps public Program discovery open and protected delivery in Arsenal", async () => {
  const programs = await render("/programs");
  assert.equal(programs.status, 200);
  const programsHtml = await programs.text();
  assert.match(programsHtml, /AI Pioneer Program/);
  assert.match(programsHtml, /ZEN Vanguard/);
  assert.match(programsHtml, /Homeschool AI Kit/);
  assert.match(programsHtml, /Train-the-Trainer/);
  assert.match(programsHtml, /Institutional Programs/);
  assert.match(programsHtml, /Public understanding\. Protected delivery\./);
  assert.match(
    programsHtml,
    /next=%2Fprograms%2Fpioneer%3Futm_source%3Dzenai\.world/,
  );
  assert.match(
    programsHtml,
    /next=%2Fprograms%2Fvanguard%3Futm_source%3Dzenai\.world/,
  );
  assert.doesNotMatch(programsHtml, /ai-pioneer-courses-20260725\.zenagi\.chatgpt\.site/);
  assert.doesNotMatch(programsHtml, /us-ai-literacy\.lovable\.app/);
});

test("uses explicit former-Wix mappings without wildcard product redirects", async () => {
  const pioneer = await render("/programs/pioneer");
  assert.equal(pioneer.status, 308);
  assert.equal(
    pioneer.headers.get("location"),
    "https://preview.zenai.world/programs#pioneer",
  );

  const approvedChallenge = await render(
    "/challenge-page/bb4918ca-0eea-4952-beea-53547a7bde92",
  );
  assert.equal(approvedChallenge.status, 308);
  assert.equal(
    approvedChallenge.headers.get("location"),
    "https://preview.zenai.world/programs#pioneer",
  );

  const unknownChallenge = await render("/challenge-page/not-in-the-approved-map");
  assert.equal(unknownChallenge.status, 404);

  const unknownProduct = await render("/product-page/not-in-the-approved-map");
  assert.equal(unknownProduct.status, 404);

  const pricing = await render("/pricing");
  assert.equal(pricing.status, 308);
  assert.equal(
    pricing.headers.get("location"),
    "https://arsenal.world/pricing?utm_source=zenai.world&utm_medium=migration&utm_campaign=wix_migration",
  );

  const marketplace = await render("/category/all-products");
  assert.equal(marketplace.status, 308);
  assert.equal(
    marketplace.headers.get("location"),
    "https://arsenal.world/marketplace?utm_source=zenai.world&utm_medium=migration&utm_campaign=wix_migration",
  );
  assert.doesNotMatch(pricing.headers.get("location") ?? "", /\/login\?next=/);
  assert.doesNotMatch(marketplace.headers.get("location") ?? "", /\/login\?next=/);

  const groupPost = await render("/group/example/discussion/unapproved-post");
  assert.equal(groupPost.status, 410);
  assert.match(await groupPost.text(), /former Wix community post/);

  assert.match(
    pioneer.headers.get("content-security-policy") ?? "",
    /frame-ancestors 'none'/,
  );
});

test("serves the public archive and preserves compatibility links", async () => {
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
  assert.match(galleryHtml, /ZEN field/);
  assert.match(galleryHtml, /Steam the Block 2024/);

  const dossierAlias = await render("/legacydossier");
  assert.equal(dossierAlias.status, 308);
  assert.equal(
    dossierAlias.headers.get("location"),
    "https://preview.zenai.world/legacy-dossier",
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
    analyticsRuntime,
    announcementRuntime,
    announcementServer,
    heritageArchive,
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
  ]);

  assert.match(page, /getManagedZenHome/);
  assert.match(page, /<ZenHub[\s\S]*managedNavigation=/);
  assert.match(layout, /generateMetadata/);
  assert.match(layout, /socialImage/);
  assert.match(hub, /GuillocheField/);
  assert.match(hub, /DestinationDrawer/);
  assert.match(hub, /CompanyPortfolio/);
  assert.match(hub, /HeritageArchive/);
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

test("guards public embed surfaces and migration terminology", async () => {
  const [managedRenderer, workRenderer, programLinks, worker, migrationLedger] =
    await Promise.all([
      readFile(new URL("../app/managed-page-renderer.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/work/site-page-renderer.tsx", import.meta.url), "utf8"),
      readFile(new URL("../lib/program-access-links.ts", import.meta.url), "utf8"),
      readFile(new URL("../worker/index.ts", import.meta.url), "utf8"),
      readFile(
        new URL("../docs/ZENAI_WORLD_WIX_MIGRATION.md", import.meta.url),
        "utf8",
      ),
    ]);

  assert.match(managedRenderer, /isDirectProgramContentUrl/);
  assert.match(managedRenderer, /gateZenPublicHtml/);
  assert.match(workRenderer, /isDirectProgramContentUrl/);
  assert.match(workRenderer, /!directProgram/);
  assert.match(workRenderer, /gateZenPublicHtml/);
  assert.match(programLinks, /PROGRAM_LOGIN_LINKS/);
  assert.match(programLinks, /buildArsenalLoginUrl/);
  assert.doesNotMatch(worker, /product-page/);
  assert.doesNotMatch(
    [programLinks, worker, migrationLedger].join("\n"),
    /legacy_redirect|legacyPath|legacyDestination|legacyUser|legacyCourse|isLegacy/,
  );
  assert.match(migrationLedger, /Every individual `\/product-page\/\*` URL/);
});

test("uses a typed revenue destination registry and controlled homepage reader", async () => {
  const [destinations, page, server] = await Promise.all([
    readFile(new URL("../lib/program-access-links.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/site-control.server.ts", import.meta.url), "utf8"),
  ]);

  for (const key of [
    "ARSENAL_BUILD",
    "BUSINESS_TRANSFORM",
    "PROGRAMS",
    "PARTNER",
    "PRICING",
    "MARKETPLACE",
    "OPERATOR",
    "COMMAND_BY_TEXT",
  ]) {
    assert.match(destinations, new RegExp(key));
  }
  assert.match(destinations, /ZEN_DESTINATIONS/);
  assert.match(destinations, /utm_source/);
  assert.match(destinations, /utm_campaign/);
  assert.match(destinations, /next=/);
  assert.match(destinations, /ARSENAL_BUILD[\s\S]*path: "\/agents\/new"/);
  assert.match(destinations, /PRICING[\s\S]*path: "\/pricing", requiresAuth: false/);
  assert.match(destinations, /MARKETPLACE[\s\S]*path: "\/marketplace", requiresAuth: false/);
  assert.match(destinations, /COMMAND_BY_TEXT[\s\S]*path: "\/command"/);
  assert.match(page, /getZenSiteControl/);
  assert.match(page, /getZenHomepageResources/);
  assert.match(page, /siteControl=/);
  assert.match(server, /get_visible_zen_site_publication/);
  assert.match(server, /get_visible_zen_campaign/);
  assert.doesNotMatch(
    [destinations, page, server].join("\n"),
    /legacy_redirect|legacyPath|legacyDestination|legacyUser|legacyCourse|isLegacy/,
  );
});

test("renders published Command Center SEO without trusting invalid URLs", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input) => {
    const url = input instanceof Request ? input.url : String(input);
    if (url.endsWith("/rest/v1/rpc/get_visible_zen_site_publication")) {
      return Response.json([
        {
          id: "10000000-0000-4000-8000-000000000090",
          revision: 4,
          content: {
            featured_capability: "Command by Text",
            featured_business_solution: "Operational intelligence",
            featured_program: "ZEN Vanguard",
            announcement_enabled: false,
            section_order: ["final_router", "arsenal_story", "business_solutions", "capability_loop", "programs", "proof"],
            section_visibility: { programs: false },
            final_destination: "COMMAND_BY_TEXT",
            featured_media_id: "20000000-0000-4000-8000-000000000010",
          },
          seo: {
            title: "ZEN Operations | Controlled",
            description: "Published from the bounded Arsenal control plane.",
            canonical: "https://www.zenai.world/",
            og_image: "https://www.zenai.world/controlled-og.png",
          },
        },
      ]);
    }
    if (url.endsWith("/rest/v1/rpc/get_visible_zen_campaign")) {
      return Response.json([
        {
          slug: "controlled-focus",
          seo: { title: "ZEN Campaign Focus", canonical: "javascript:blocked" },
        },
      ]);
    }
    if (url.endsWith("/rest/v1/rpc/list_visible_site_announcements")) {
      return Response.json([{
        id: "10000000-0000-4000-8000-000000000091",
        title: "This announcement is disabled by homepage control",
        body: "It must not render.",
        type: "banner",
        priority: "normal",
        is_dismissible: true,
        starts_at: "2026-08-13T12:00:00.000Z",
        updated_at: "2026-08-13T12:00:00.000Z",
        style: {},
      }]);
    }
    if (url.endsWith("/rest/v1/rpc/list_visible_zen_public_media")) {
      return Response.json([{
        id: "20000000-0000-4000-8000-000000000010",
        title: "Arsenal command surface",
        media_kind: "image",
        public_url: "https://cdn.example/approved-arsenal.png",
        alt_text: "Real Arsenal command surface showing an agent workflow.",
      }]);
    }
    if (url.includes("/rest/v1/rpc/")) return Response.json([]);
    return originalFetch(input);
  };

  try {
    const response = await render("/", {
      SUPABASE_URL: "https://managed-content.example",
      SUPABASE_PUBLISHABLE_KEY: "public-test-key",
    });
    const html = await response.text();
    assert.match(html, /<title>ZEN Campaign Focus<\/title>/);
    assert.match(
      html,
      /name="description" content="Published from the bounded Arsenal control plane\."/,
    );
    assert.match(
      html,
      /rel="canonical" href="https:\/\/www\.zenai\.world\/"/,
    );
    assert.match(
      html,
      /property="og:image" content="https:\/\/www\.zenai\.world\/controlled-og\.png"/,
    );
    assert.match(html, /Command by Text/);
    assert.match(html, /Operational intelligence/);
    assert.match(html, /ZEN Vanguard/);
    assert.match(html, /data-home-section="final_router"[^>]*style="order:0"/);
    assert.match(html, /Arsenal \/ Intelligent Operations Platform/);
    assert.match(html, /src="https:\/\/cdn\.example\/approved-arsenal\.png"/);
    assert.match(html, /Actual Arsenal interface · no simulated telemetry/);
    assert.match(html, /data-zen-cta="arsenal-product-stage-primary"/);
    assert.match(html, /data-home-section="programs"[^>]*hidden=""/);
    assert.match(html, /next=%2Fcommand%3Futm_source%3Dzenai\.world/);
    assert.doesNotMatch(html, /This announcement is disabled by homepage control/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("exposes only public release metadata to the Arsenal production origin", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("release-cors-test", "release-" + process.pid + "-" + Date.now());
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request("https://www.zenai.world/release.json"),
    { ASSETS: { fetch: async () => Response.json({ sha: "abc1234" }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );

  assert.equal(response.headers.get("access-control-allow-origin"), "https://arsenal.world");
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("advertises the canonical www host in discovery artifacts", async () => {
  const sitemapSource = await readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8");
  const robots = await readFile(new URL("../public/robots.txt", import.meta.url), "utf8");

  assert.match(sitemapSource, /const base = "https:\/\/www\.zenai\.world"/);
  assert.doesNotMatch(sitemapSource, /const base = "https:\/\/zenai\.world"/);
  assert.match(robots, /Sitemap: https:\/\/www\.zenai\.world\/sitemap\.xml/);
  assert.doesNotMatch(robots, /Sitemap: https:\/\/zenai\.world\/sitemap\.xml/);
});

test("canonicalizes the production apex to www without changing preview hosts", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("canonical-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request("https://zenai.world/programs?utm_campaign=canonical-test", {
      headers: { host: "zenai.world", "x-forwarded-host": "zenai.world", "x-forwarded-proto": "https" },
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );

  assert.equal(response.status, 308);
  assert.equal(
    response.headers.get("location"),
    "https://www.zenai.world/programs?utm_campaign=canonical-test",
  );
});

test("bounds anonymous funnel events at the same-origin Worker proxy", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("funnel-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const originalFetch = globalThis.fetch;
  let upstreamBody = null;
  globalThis.fetch = async (input, init) => {
    const url = input instanceof Request ? input.url : String(input);
    if (url.endsWith("/rest/v1/rpc/record_zen_funnel_event")) {
      upstreamBody = JSON.parse(String(init?.body ?? "{}"));
      return Response.json("10000000-0000-4000-8000-000000000099");
    }
    return originalFetch(input, init);
  };

  const environment = {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
    SUPABASE_URL: "https://managed-content.example",
    SUPABASE_PUBLISHABLE_KEY: "public-test-key",
  };
  const context = { waitUntil() {}, passThroughOnException() {} };

  try {
    const accepted = await worker.fetch(
      new Request("https://preview.zenai.world/api/zen-funnel", {
        method: "POST",
        headers: { "content-type": "application/json", origin: "https://preview.zenai.world" },
        body: JSON.stringify({
          event_type: "destination_handoff",
          session_id: "10000000-0000-4000-8000-000000000099",
          source_page: "/",
          cta_id: "homepage-hero-primary",
          destination_key: "ARSENAL_BUILD",
          destination_path: "/login",
        }),
      }),
      environment,
      context,
    );
    assert.equal(accepted.status, 202);
    assert.equal(upstreamBody.requested_event_type, "destination_handoff");
    assert.equal(upstreamBody.requested_destination_key, "ARSENAL_BUILD");
    assert.equal("user_id" in upstreamBody, false);

    const rejected = await worker.fetch(
      new Request("https://preview.zenai.world/api/zen-funnel", {
        method: "POST",
        headers: { "content-type": "application/json", origin: "https://preview.zenai.world" },
        body: JSON.stringify({ event_type: "paid_plan", session_id: "guessed", source_page: "/" }),
      }),
      environment,
      context,
    );
    assert.equal(rejected.status, 400);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
