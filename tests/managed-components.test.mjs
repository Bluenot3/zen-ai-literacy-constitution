import assert from "node:assert/strict";
import test from "node:test";

async function render(path, environment) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("managed-components", `${process.pid}-${Date.now()}-${Math.random()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`https://preview.zenai.world${path}`, { headers: { accept: "text/html", host: "preview.zenai.world", "x-forwarded-host": "preview.zenai.world", "x-forwarded-proto": "https" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
    ...environment,
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("renders all seven allowlisted ZEN components and fails closed for unapproved resources", async () => {
  const originalFetch = globalThis.fetch;
  const timestamp = "2026-08-13T18:00:00.000Z";
  const mediaId = "20000000-0000-4000-8000-000000000001";
  const component = (id, componentKey, componentProps) => ({
    id, title: componentKey, kind: "component", source: "", embed_url: "", content_html: "", sizing: "wide", height: 640, width: 100, resizable: false, permission_profile: "restricted", component_key: componentKey, component_props: componentProps,
  });
  const base = { eyebrow: "ZEN controlled component", title: "Verified operating surface", body: "Bounded public content controlled from Arsenal Admin.", items: [], media_id: "", media_url: "", media_alt: "", claim_key: "", cta_label: "", cta_href: "" };
  const page = {
    id: "20000000-0000-4000-8000-000000000002", site_key: "zen_world", page_role: "page", slug: "component-lab", title: "Controlled Component Lab", description: "All allowlisted blocks.", status: "published", nav_group: "Arsenal", nav_label: "Component Lab", sort_order: 20, visibility: "public", open_in_nav: false, nav_locations: [], updated_at: timestamp, page_type: "multi_embed", embed_url: null, content_html: "",
    layout_config: { frame: "contained", gap: 24, background: "default", chrome: "arsenal", columns: 1 },
    embed_blocks: [
      component("c1", "arsenal_screenshot_stage", { ...base, title: "Real Arsenal evidence", media_id: mediaId, media_url: "https://fake.example/not-approved.png", media_alt: "Draft-provided alt" }),
      component("c2", "verified_workflow_demonstrator", { ...base, items: ["Lead arrives", "Human approves"] }),
      component("c3", "before_connected_automated", { ...base, items: ["Before|Fragmented", "Connected|One context", "Automated|Bounded execution"] }),
      component("c4", "arsenal_capability_exploder", { ...base, items: ["Agent", "Knowledge", "Business Space"] }),
      component("c5", "public_program_discovery", { ...base, items: ["AI Pioneer Program", "ZEN Vanguard"], cta_label: "Explore Programs", cta_href: "/programs" }),
      component("c6", "institutional_proof_record", { ...base, claim_key: "approved-milestone" }),
      component("c7", "power_cell_experimental", { ...base, eyebrow: "Generally available", title: "Production Power Cell", body: "Available everywhere" }),
      component("c8", "unregistered_component", base),
    ],
  };

  globalThis.fetch = async (input, init) => {
    const url = input instanceof Request ? input.url : String(input);
    if (!url.startsWith("https://managed-components.example/rest/v1/rpc/")) return originalFetch(input, init);
    if (url.endsWith("/get_visible_admin_site_page")) return Response.json([page]);
    if (url.endsWith("/list_visible_admin_site_pages_for_nav")) return Response.json([]);
    if (url.endsWith("/list_visible_zen_public_media")) return Response.json([{ id: mediaId, title: "Approved Arsenal screenshot", media_kind: "image", public_url: "https://cdn.example/approved-arsenal.png", alt_text: "The real Arsenal Business Space interface" }]);
    if (url.endsWith("/list_visible_zen_proof_claims")) return Response.json([{ id: "20000000-0000-4000-8000-000000000003", claim_key: "approved-milestone", title: "Approved milestone", approved_wording: "A verified institutional milestone.", claim_status: "historical_achievement", evidence_url: "https://zenai.world/work", related_media: [], valid_from: "2026-01-01", valid_until: null }]);
    if (url.endsWith("/list_visible_site_announcements")) return Response.json([]);
    return Response.json([]);
  };

  try {
    const response = await render("/component-lab", { SUPABASE_URL: "https://managed-components.example", SUPABASE_PUBLISHABLE_KEY: "public-test-key" });
    assert.equal(response.status, 200);
    const html = await response.text();
    for (const key of ["arsenal_screenshot_stage", "verified_workflow_demonstrator", "before_connected_automated", "arsenal_capability_exploder", "public_program_discovery", "institutional_proof_record", "power_cell_experimental"]) assert.match(html, new RegExp(`data-zen-component="${key}"`));
    assert.match(html, /https:\/\/cdn\.example\/approved-arsenal\.png/);
    assert.doesNotMatch(html, /fake\.example/);
    assert.match(html, /A verified institutional milestone\./);
    assert.match(html, /Experimental · Hardware-dependent/);
    assert.doesNotMatch(html, /Production Power Cell|Generally available/);
    assert.match(html, /This source is unavailable or does not use an allowed secure URL/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("does not render screenshot or proof value when approval readers return no records", async () => {
  const originalFetch = globalThis.fetch;
  const page = { id: "30000000-0000-4000-8000-000000000001", site_key: "zen_world", page_role: "page", slug: "approval-gate", title: "Approval Gate", description: "", status: "published", nav_group: "Proof", nav_label: "Approval", sort_order: 1, visibility: "public", open_in_nav: false, nav_locations: [], updated_at: "2026-08-13T18:00:00.000Z", page_type: "multi_embed", embed_url: null, content_html: "", layout_config: {}, embed_blocks: [
    { id: "x", title: "Screenshot", kind: "component", source: "", sizing: "wide", height: 640, width: 100, resizable: false, permission_profile: "restricted", component_key: "arsenal_screenshot_stage", component_props: { title: "Secret screenshot", media_id: "30000000-0000-4000-8000-000000000002", media_url: "https://private.example/vault.png", media_alt: "Private" } },
    { id: "y", title: "Claim", kind: "component", source: "", sizing: "wide", height: 640, width: 100, resizable: false, permission_profile: "restricted", component_key: "institutional_proof_record", component_props: { claim_key: "draft-claim" } },
  ] };
  globalThis.fetch = async (input) => {
    const url = input instanceof Request ? input.url : String(input);
    if (!url.startsWith("https://approval-gate.example/rest/v1/rpc/")) return originalFetch(input);
    if (url.endsWith("/get_visible_admin_site_page")) return Response.json([page]);
    return Response.json([]);
  };
  try {
    const response = await render("/approval-gate", { SUPABASE_URL: "https://approval-gate.example", SUPABASE_PUBLISHABLE_KEY: "public-test-key" });
    const html = await response.text();
    assert.ok((html.match(/data-zen-component-unavailable/g) ?? []).length >= 2);
    assert.doesNotMatch(html, /private\.example|Secret screenshot|draft-claim/);
  } finally { globalThis.fetch = originalFetch; }
});
