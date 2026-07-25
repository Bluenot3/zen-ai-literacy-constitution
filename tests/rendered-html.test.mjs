import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("https://preview.zenai.world/", {
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
  assert.match(html, /A treasury of/);
  assert.match(html, /41\+/);
  assert.match(html, /10\+/);
  assert.match(html, /Recycling intelligence/);
  assert.match(html, /Speech translation bridge/);
  assert.match(html, /Choose what you came to do\./);
  assert.match(html, /https:\/\/arsenal\.world/);
  assert.match(html, /https:\/\/aipioneer\.zen\.ai\//);
  assert.match(html, /https:\/\/us\.zenai\.biz\/guest/);
  assert.match(html, /https:\/\/preview\.zenai\.world\/og\.png/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("removes starter-only preview infrastructure", async () => {
  const [page, layout, packageJson, hub, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/zen-hub.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /<ZenHub \/>/);
  assert.match(layout, /generateMetadata/);
  assert.match(layout, /socialImage/);
  assert.match(hub, /GuillocheField/);
  assert.match(hub, /DestinationDrawer/);
  assert.match(hub, /FIELDWORK/);
  assert.match(hub, /SIGNALS/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
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
