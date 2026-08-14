import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const PROTECTED_HOSTS =
  /ai-pioneer-courses-20260725\.zenagi\.chatgpt\.site|us-ai-literacy\.lovable\.app/i;

async function render(path = "/", environment = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("containment-test", `${process.pid}-${Date.now()}-${Math.random()}`);
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
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
      ...environment,
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

function decodeSecurityEntities(value) {
  let decoded = value;
  for (let pass = 0; pass < 4; pass += 1) {
    const next = decoded
      .replace(/&#x([0-9a-f]+);?/gi, (_, code) =>
        String.fromCodePoint(Number.parseInt(code, 16)),
      )
      .replace(/&#([0-9]+);?/g, (_, code) =>
        String.fromCodePoint(Number.parseInt(code, 10)),
      )
      .replace(/&(amp|colon|period|sol);/gi, (_, name) =>
        ({ amp: "&", colon: ":", period: ".", sol: "/" })[
          name.toLowerCase()
        ] ?? "",
      );
    if (next === decoded) break;
    decoded = next;
  }
  return decoded;
}

function assertContained(html, surface) {
  assert.doesNotMatch(
    decodeSecurityEntities(html),
    PROTECTED_HOSTS,
    `${surface} emitted a protected external Program origin`,
  );
}

test("homepage, Program discovery, and legacy routes preserve the Arsenal boundary", async () => {
  const homepage = await render("/");
  assert.equal(homepage.status, 200);
  const homepageHtml = await homepage.text();
  assert.match(homepageHtml, /https:\/\/arsenal\.world\/programs\/pioneer/);
  assert.match(homepageHtml, /https:\/\/arsenal\.world\/programs\/vanguard/);
  assertContained(homepageHtml, "homepage");

  const programs = await render("/programs");
  assert.equal(programs.status, 200);
  const programsHtml = await programs.text();
  assert.match(programsHtml, /AI Pioneer Program/);
  assert.match(programsHtml, /ZEN Vanguard/);
  assert.match(programsHtml, /https:\/\/arsenal\.world\/programs\/pioneer/);
  assert.match(programsHtml, /https:\/\/arsenal\.world\/programs\/vanguard/);
  assertContained(programsHtml, "/programs");

  for (const [path, destination] of [
    ["/programs/pioneer", "/programs#pioneer"],
    ["/programs/vanguard", "/programs#vanguard"],
    ["/challenge-page/bb4918ca-0eea-4952-beea-53547a7bde92", "/programs#pioneer"],
  ]) {
    const response = await render(path);
    assert.equal(response.status, 308);
    assert.equal(response.headers.get("location"), `https://preview.zenai.world${destination}`);
  }
  assert.equal((await render("/challenge-page/not-approved")).status, 404);
  assert.equal((await render("/product-page/not-approved")).status, 404);
});

test("managed rich text, embeds, and announcement CTAs fail closed", async () => {
  const originalFetch = globalThis.fetch;
  const timestamp = "2026-08-14T12:00:00.000Z";
  const managedHtmlPage = {
    id: "50000000-0000-4000-8000-000000000001",
    site_key: "zen_world",
    page_role: "page",
    slug: "managed-obfuscated",
    title: "Managed containment",
    description: "Security fixture",
    status: "published",
    nav_group: "Knowledge",
    parent_tab: null,
    nav_label: "Managed containment",
    sort_order: 1,
    icon: "Shield",
    visibility: "public",
    open_in_nav: false,
    nav_locations: [],
    page_type: "ai_html",
    embed_url: null,
    content_html:
      '<a href="https&colon;&sol;&sol;us-ai-literacy&period;lovable&period;app/guide">Open Vanguard guide</a>',
    embed_blocks: [],
    layout_config: { frame: "contained", gap: 24, background: "default", columns: 1 },
    created_at: timestamp,
    updated_at: timestamp,
  };
  const managedEmbedPage = {
    ...managedHtmlPage,
    id: "50000000-0000-4000-8000-000000000002",
    slug: "managed-embed",
    title: "Managed protected embed",
    page_type: "iframe",
    embed_url:
      "//ai-pioneer-courses-20260725.zenagi.chatgpt.site/programs/pioneer/module/one",
    content_html: "",
  };
  const announcement = {
    id: "50000000-0000-4000-8000-000000000003",
    title: "Program access",
    body: "Protected delivery opens through Arsenal.",
    type: "banner",
    priority: "high",
    style: {
      bg: "#071b28",
      text: "#f4fbf8",
      cta_label: "Sign in to access",
      cta_action: "https://us-ai-literacy.lovable.app/guide",
    },
    starts_at: timestamp,
    ends_at: null,
    is_dismissible: true,
    created_at: timestamp,
    updated_at: timestamp,
  };
  const credentialAnnouncement = {
    ...announcement,
    id: "50000000-0000-4000-8000-000000000004",
    title: "Credential URL containment",
    style: {
      ...announcement.style,
      cta_label: "Must not render credential CTA",
      cta_action: "https://preview:access@us-ai-literacy.lovable.app/guide",
    },
  };

  globalThis.fetch = async (input, init) => {
    const url = input instanceof Request ? input.url : String(input);
    if (!url.startsWith("https://managed-content.example/rest/v1/rpc/")) {
      return originalFetch(input, init);
    }
    if (url.endsWith("/get_visible_admin_site_page")) {
      const body = JSON.parse(String(init?.body ?? "{}"));
      return Response.json(
        body.requested_slug === managedHtmlPage.slug
          ? [managedHtmlPage]
          : body.requested_slug === managedEmbedPage.slug
            ? [managedEmbedPage]
            : [],
      );
    }
    if (url.endsWith("/list_visible_site_announcements")) {
      return Response.json([announcement, credentialAnnouncement]);
    }
    return Response.json([]);
  };

  const environment = {
    SUPABASE_URL: "https://managed-content.example",
    SUPABASE_PUBLISHABLE_KEY: "public-test-key",
  };
  try {
    const homepage = await render("/", environment);
    const homepageHtml = await homepage.text();
    assert.match(homepageHtml, /Sign in to access/);
    assert.match(homepageHtml, /https:\/\/arsenal\.world\/programs\/vanguard/);
    assert.doesNotMatch(homepageHtml, /Must not render credential CTA/);
    assertContained(homepageHtml, "announcement CTA");

    const managed = await render("/managed-obfuscated", environment);
    assert.equal(managed.status, 200);
    const managedHtml = await managed.text();
    assert.match(managedHtml, /data-zen-program-containment/);
    assert.match(managedHtml, /https:\/\/arsenal\.world\/programs\/vanguard/);
    assertContained(managedHtml, "managed rich text");

    const embed = await render("/managed-embed", environment);
    assert.equal(embed.status, 200);
    const embedHtml = await embed.text();
    assert.match(embedHtml, /Protected ZEN Programs open through Arsenal/);
    assert.match(embedHtml, /https:\/\/arsenal\.world\/programs\/pioneer/);
    assert.doesNotMatch(embedHtml, /<iframe[^>]+ai-pioneer-courses/i);
    assertContained(embedHtml, "managed embed");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("published Work blocks cannot emit protected curriculum destinations", async () => {
  const originalFetch = globalThis.fetch;
  const timestamp = "2026-08-14T12:00:00.000Z";
  const publication = {
    page_id: "60000000-0000-4000-8000-000000000001",
    revision_id: "60000000-0000-4000-8000-000000000002",
    slug: "program-containment",
    published_at: timestamp,
    updated_at: timestamp,
    document: {
      schemaVersion: 1,
      title: "Program containment record",
      summary: "Adversarial destination fixture.",
      layout: "editorial",
      seo: {},
      listing: { showOnHome: true, order: 1, category: "knowledge" },
      blocks: [
        {
          id: "cta-pioneer",
          type: "cta",
          heading: "AI Pioneer Program",
          body: "Protected delivery belongs in Arsenal.",
          label: "Program access",
          href: "//ai-pioneer-courses-20260725.zenagi.chatgpt.site/lesson/one",
        },
        {
          id: "image-vanguard",
          type: "image",
          url: "//us-ai-literacy.lovable.app/assets/private-module.png",
          alt: "Must not render",
          caption: "Must not render",
        },
        {
          id: "embed-vanguard",
          type: "embed",
          url: "https://us-ai-literacy.lovable.app/modules/one",
          title: "Protected Vanguard module",
          height: 480,
          allowEmbed: true,
        },
        {
          id: "embed-credential-vanguard",
          type: "embed",
          url: "https://preview:access@us-ai-literacy.lovable.app/modules/credentialed",
          title: "Credential-bearing protected embed",
          height: 480,
          allowEmbed: true,
        },
        {
          id: "image-credential-pioneer",
          type: "image",
          url: "https://preview:access@ai-pioneer-courses-20260725.zenagi.chatgpt.site/private/image.png",
          alt: "Credential media must not render",
          caption: "Credential media must not render",
        },
        {
          id: "html-vanguard",
          type: "html",
          title: "Obfuscated protected link",
          html: '<a href="https&colon;&sol;&sol;us-ai-literacy&period;lovable&period;app/guide">Open guide</a>',
          height: 320,
        },
      ],
    },
  };
  globalThis.fetch = async (input) => {
    const url = input instanceof Request ? input.url : String(input);
    if (url.startsWith("https://managed-content.example/rest/v1/site_publications?")) {
      return Response.json([publication]);
    }
    if (url.startsWith("https://managed-content.example/rest/v1/rpc/")) {
      return Response.json([]);
    }
    return originalFetch(input);
  };
  try {
    const response = await render("/work/program-containment", {
      SUPABASE_URL: "https://managed-content.example",
      SUPABASE_PUBLISHABLE_KEY: "public-test-key",
    });
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /Program containment record/);
    assert.match(html, /https:\/\/arsenal\.world\/programs\/pioneer/);
    assert.match(html, /https:\/\/arsenal\.world\/programs\/vanguard/);
    assert.match(html, /data-zen-program-containment/);
    assert.doesNotMatch(html, /<iframe[^>]+(?:ai-pioneer-courses|us-ai-literacy)/i);
    assert.doesNotMatch(html, /Must not render|Credential media must not render/);
    assertContained(html, "published Work page");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("approved homepage proof is gated and protected-origin media is rejected", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input) => {
    const url = input instanceof Request ? input.url : String(input);
    if (url.endsWith("/rest/v1/rpc/get_visible_zen_site_publication")) {
      return Response.json([{
        id: "70000000-0000-4000-8000-000000000001",
        revision: 1,
        content: {
          featured_media_id: "70000000-0000-4000-8000-000000000002",
          proof_claim_ids: ["70000000-0000-4000-8000-000000000003"],
        },
        seo: {},
      }]);
    }
    if (url.endsWith("/rest/v1/rpc/list_visible_zen_public_media")) {
      return Response.json([{
        id: "70000000-0000-4000-8000-000000000002",
        public_url: "https://ai-pioneer-courses-20260725.zenagi.chatgpt.site/private/image.png",
        alt_text: "Protected curriculum screenshot",
        title: "Must not render",
      }]);
    }
    if (url.endsWith("/rest/v1/rpc/list_visible_zen_proof_claims_by_id")) {
      return Response.json([{
        id: "70000000-0000-4000-8000-000000000003",
        claim_key: "program-boundary-proof",
        approved_wording: "Protected delivery crosses the Arsenal boundary.",
        claim_status: "verified",
        evidence_url: "https://us-ai-literacy.lovable.app/private/evidence",
        valid_until: null,
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
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /Protected delivery crosses the Arsenal boundary\./);
    assert.match(html, /https:\/\/arsenal\.world\/programs\/vanguard/);
    assert.doesNotMatch(html, /Protected curriculum screenshot|Must not render/);
    assertContained(html, "homepage proof and media");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("public runtime configuration contains protected hosts only in the denylist", async () => {
  const runtimeRoots = ["app", "lib", "worker", "public"];
  for (const root of runtimeRoots) {
    const directory = new URL(`../${root}/`, import.meta.url);
    for (const entry of await readdir(directory, { recursive: true })) {
      const relative = String(entry).replaceAll("\\", "/");
      let contents;
      try {
        contents = await readFile(new URL(relative, directory), "utf8");
      } catch {
        continue;
      }
      if (PROTECTED_HOSTS.test(contents)) {
        assert.equal(
          `${root}/${relative}`,
          "lib/program-access-links.ts",
          `${root}/${relative} contains a protected host outside the canonical security rule`,
        );
      }
    }
  }
});
