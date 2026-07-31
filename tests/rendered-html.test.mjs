import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render(path = "/") {
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
    /<title>ZEN AI Co\. \| Intelligence Into Capability \| ZEN AI Co\.<\/title>/i,
  );
  assert.match(html, /Intelligence/);
  assert.match(html, /becomes capability\./);
  assert.match(html, /Learn it clearly\./);
  assert.match(html, /4/);
  assert.match(html, /learning modules/);
  assert.match(html, /8/);
  assert.match(html, /guided sections/);
  assert.match(html, /Text Genie/);
  assert.match(html, /Image Studio/);
  assert.match(html, /Choose what you came to do\./);
  assert.match(html, /One connected instrument/);
  assert.match(html, /Real work creates its own currency\./);
  assert.match(html, /What will you/);
  assert.match(html, /make real\?/);
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
});

test("removes starter-only preview infrastructure", async () => {
  const [page, layout, packageJson, hub, css, contentServer, contentRenderer] =
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
  ]);

  assert.match(page, /<ZenHub \/>/);
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
