import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import {
  managedZenHref,
  managedZenNavigationFor,
  type ManagedZenEmbedBlock,
  type ManagedZenLayout,
  type ManagedZenNavigationItem,
  type ManagedZenPage,
} from "./managed-pages";
import styles from "./managed-page.module.css";
import { TreasuryBackdrop, TreasuryPageFrame } from "./treasury-chrome";
import workStyles from "./work/work.module.css";

const ARSENAL_URL = "https://arsenal.world";

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character,
  );

const safeEmbedUrl = (value: string) => {
  const source = value.trim();
  if (!source || /[\u0000-\u001f\u007f\\]/.test(source)) return "";
  if (source.startsWith("/") && !source.startsWith("//")) return source;

  try {
    const url = new URL(source);
    if (url.protocol !== "https:" || url.username || url.password) return "";
    return url.toString();
  } catch {
    return "";
  }
};

const safeMediaUrl = (value: string) => {
  const source = value.trim();
  if (/^data:image\/(?:avif|gif|jpeg|png|webp);base64,/i.test(source)) {
    return source;
  }
  return safeEmbedUrl(source);
};

const youtubeEmbedUrl = (value: string) => {
  const source = safeEmbedUrl(value);
  if (!source || source.startsWith("/")) return "";

  try {
    const url = new URL(source);
    const host = url.hostname.toLowerCase();
    let id = "";
    if (host === "youtu.be") {
      id = url.pathname.split("/").filter(Boolean)[0] ?? "";
    } else if (
      host === "youtube.com" ||
      host === "www.youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtube-nocookie.com" ||
      host === "www.youtube-nocookie.com"
    ) {
      id = url.searchParams.get("v") ?? "";
      if (!id) {
        const parts = url.pathname.split("/").filter(Boolean);
        const marker = parts.findIndex((part) => part === "embed" || part === "shorts");
        id = marker >= 0 ? parts[marker + 1] ?? "" : "";
      }
    }
    return /^[A-Za-z0-9_-]{6,20}$/.test(id)
      ? `https://www.youtube-nocookie.com/embed/${id}`
      : "";
  } catch {
    return "";
  }
};

const sandboxedDocument = (html: string, title: string) => {
  const policy = [
    '<meta http-equiv="Content-Security-Policy"',
    " content=\"default-src 'none'; base-uri 'none'; form-action 'none';",
    " script-src 'unsafe-inline'; style-src 'unsafe-inline';",
    " img-src data: blob:; media-src data: blob:; font-src data:;",
    " connect-src 'none'; frame-src 'none'\">",
  ].join("");

  return [
    "<!doctype html><html><head>",
    policy,
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${escapeHtml(title)}</title>`,
    "<style>*{box-sizing:border-box}html,body{margin:0;min-height:100%}img,video,canvas,svg{max-width:100%}</style>",
    "</head><body>",
    html,
    "</body></html>",
  ].join("");
};

const markdownDocument = (body: string, title: string) =>
  sandboxedDocument(
    `<main style="max-width:920px;margin:0 auto;padding:clamp(24px,6vw,72px);font:18px/1.75 ui-sans-serif,system-ui,sans-serif;white-space:pre-wrap;color:#102f39">${escapeHtml(body)}</main>`,
    title,
  );

const iframeSandbox =
  "allow-scripts allow-forms allow-popups allow-presentation";

function ManagedHeader({
  navigation,
}: {
  navigation: ManagedZenNavigationItem[];
}) {
  const headerItems = managedZenNavigationFor(navigation, "header");
  return (
    <header className={workStyles.topbar}>
      <Link href="/" className={workStyles.brand} aria-label="ZEN AI World home">
        <Image src="/zen-mark.png" alt="" width={34} height={34} unoptimized />
        <strong>ZEN AI Co.</strong>
      </Link>
      <nav aria-label="Page navigation">
        <Link href="/">Home</Link>
        {headerItems.map((item) => (
          <Link href={managedZenHref(item.slug)} key={item.id}>
            {item.navLabel}
          </Link>
        ))}
        <a href={ARSENAL_URL}>Enter Arsenal ↗</a>
      </nav>
    </header>
  );
}

function ManagedFooter({
  page,
  navigation,
}: {
  page: ManagedZenPage;
  navigation: ManagedZenNavigationItem[];
}) {
  const footerItems = managedZenNavigationFor(navigation, "footer");
  return (
    <footer className={workStyles.footer}>
      <span>ZEN AI Co. · /{page.slug}</span>
      <nav className={styles.footerNav} aria-label="Footer navigation">
        {footerItems.map((item) => (
          <Link href={managedZenHref(item.slug)} key={item.id}>
            {item.navLabel}
          </Link>
        ))}
        <a href={ARSENAL_URL}>Arsenal ↗</a>
      </nav>
    </footer>
  );
}

function BlockedSurface({ title, source }: { title: string; source: string }) {
  const href = safeEmbedUrl(source);
  return (
    <div className={styles.blocked}>
      <div>
        <h2>{title}</h2>
        <p>This source is unavailable or does not use an allowed secure URL.</p>
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer">
            Open source ↗
          </a>
        ) : null}
      </div>
    </div>
  );
}

const blockStyle = (block: ManagedZenEmbedBlock): CSSProperties => ({
  width: `${block.width}%`,
  height:
    block.sizing === "fullscreen"
      ? "calc(100vh - 70px)"
      : `${block.height}px`,
  minHeight: 240,
  maxWidth: "100%",
  resize: block.resizable ? "both" : "none",
});

function Gallery({ block }: { block: ManagedZenEmbedBlock }) {
  const images = block.source
    .split(/[\n,]+/)
    .map(safeMediaUrl)
    .filter(Boolean)
    .slice(0, 24);
  const [hero, ...rest] = images;
  if (!hero) return <BlockedSurface title={block.title} source={block.source} />;

  return (
    <div className={styles.gallery}>
      <div className={styles.galleryHero}>
        {/* Managed media URLs are normalized to HTTPS, a local path, or a safe image data URI. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={hero} alt={block.title} loading="lazy" />
      </div>
      <div className={styles.galleryGrid}>
        {rest.map((url, index) => (
          <div key={`${url}-${index}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`${block.title} ${index + 2}`} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ManagedBlock({ block }: { block: ManagedZenEmbedBlock }) {
  const rawSource = block.embedUrl || block.source;
  const source = block.kind === "html" ? "" : safeEmbedUrl(rawSource);
  const mediaSource = safeMediaUrl(rawSource);
  const style = blockStyle(block);

  return (
    <section className={styles.blockFrame} style={style}>
      <div className={styles.blockBar}>
        <strong>{block.title}</strong>
        {source ? (
          <a href={source} target="_blank" rel="noopener noreferrer">
            Open ↗
          </a>
        ) : (
          <span>{block.kind === "html" ? "Sandboxed HTML" : block.kind}</span>
        )}
      </div>
      {block.kind === "gallery" ? (
        <Gallery block={block} />
      ) : block.kind === "html" ? (
        <iframe
          srcDoc={sandboxedDocument(
            block.contentHtml || block.source,
            block.title,
          )}
          title={block.title}
          sandbox="allow-scripts"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      ) : block.kind === "image" && mediaSource ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={mediaSource} alt={block.title} loading="lazy" />
      ) : block.kind === "video" && mediaSource ? (
        <video src={mediaSource} controls playsInline preload="metadata" />
      ) : block.kind === "youtube" && youtubeEmbedUrl(rawSource) ? (
        <iframe
          src={youtubeEmbedUrl(rawSource)}
          title={block.title}
          sandbox={iframeSandbox}
          referrerPolicy="no-referrer"
          allow="encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      ) : source ? (
        <iframe
          src={source}
          title={block.title}
          sandbox={iframeSandbox}
          referrerPolicy="no-referrer"
          allow="fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <BlockedSurface title={block.title} source={rawSource} />
      )}
    </section>
  );
}

function SinglePageSurface({ page }: { page: ManagedZenPage }) {
  if (page.pageType === "iframe" || page.pageType === "embed") {
    const source = safeEmbedUrl(page.embedUrl);
    return source ? (
      <section className={styles.blockFrame} style={{ height: "min(78vh, 980px)" }}>
        <div className={styles.blockBar}>
          <strong>{page.title}</strong>
          <a href={source} target="_blank" rel="noopener noreferrer">
            Open ↗
          </a>
        </div>
        <iframe
          src={source}
          title={page.title}
          sandbox={iframeSandbox}
          referrerPolicy="no-referrer"
          allow="fullscreen; picture-in-picture"
          allowFullScreen
        />
      </section>
    ) : (
      <section className={styles.blockFrame}>
        <BlockedSurface title={page.title} source={page.embedUrl} />
      </section>
    );
  }

  const document =
    page.pageType === "markdown"
      ? markdownDocument(page.contentHtml, page.title)
      : sandboxedDocument(page.contentHtml, page.title);
  return (
    <section className={styles.blockFrame} style={{ height: "min(78vh, 980px)" }}>
      <div className={styles.blockBar}>
        <strong>{page.title}</strong>
        <span>Sandboxed page</span>
      </div>
      <iframe
        srcDoc={document}
        title={page.title}
        sandbox="allow-scripts"
        referrerPolicy="no-referrer"
      />
    </section>
  );
}

function ManagedPageContent({ page }: { page: ManagedZenPage }) {
  const layout = page.layout;
  const flowClass =
    layout.frame === "split"
      ? `${styles.blockFlow} ${styles.blockSplit}`
      : layout.frame === "grid"
        ? `${styles.blockFlow} ${styles.blockGrid}`
        : styles.blockFlow;
  const flowStyle = {
    "--managed-gap": `${layout.gap}px`,
    "--managed-columns": String(layout.columns),
  } as CSSProperties;

  if (page.pageType === "multi_embed" && page.blocks.length > 0) {
    return (
      <div className={flowClass} style={flowStyle}>
        {page.blocks.map((block) => (
          <ManagedBlock block={block} key={block.id} />
        ))}
      </div>
    );
  }

  return <SinglePageSurface page={page} />;
}

function FullCanvasPage({ page }: { page: ManagedZenPage }) {
  if (page.pageType === "iframe" || page.pageType === "embed") {
    const source = safeEmbedUrl(page.embedUrl);
    return source ? (
      <iframe
        src={source}
        title={page.title}
        sandbox={iframeSandbox}
        referrerPolicy="no-referrer"
        allow="fullscreen; picture-in-picture"
        allowFullScreen
      />
    ) : (
      <BlockedSurface title={page.title} source={page.embedUrl} />
    );
  }

  if (page.pageType !== "multi_embed") {
    const document =
      page.pageType === "markdown"
        ? markdownDocument(page.contentHtml, page.title)
        : sandboxedDocument(page.contentHtml, page.title);
    return (
      <iframe
        srcDoc={document}
        title={page.title}
        sandbox="allow-scripts"
        referrerPolicy="no-referrer"
      />
    );
  }

  return <ManagedPageContent page={page} />;
}

const pageClass = (layout: ManagedZenLayout) => {
  if (layout.frame === "full_bleed") {
    return `${workStyles.page} ${styles.pageFull}`;
  }
  if (layout.background === "dark") {
    return `${workStyles.page} ${styles.pageDark}`;
  }
  if (layout.background === "paper") {
    return `${workStyles.page} ${styles.pagePaper}`;
  }
  return workStyles.page;
};

export function ManagedZenPageRenderer({
  page,
  navigation = [],
}: {
  page: ManagedZenPage;
  navigation?: ManagedZenNavigationItem[];
}) {
  const fullCanvas =
    page.layout.chrome === "none" && page.layout.frame === "full_bleed";
  if (fullCanvas) {
    return (
      <main className={styles.fullCanvas}>
        <FullCanvasPage page={page} />
      </main>
    );
  }

  const updated = page.updatedAt ? new Date(page.updatedAt) : null;
  const formattedUpdated =
    updated && !Number.isNaN(updated.valueOf())
      ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(updated)
      : "";
  const treasuryVariant = /knowledge|partner/i.test(page.navGroup)
    ? "charter"
    : "archive";

  return (
    <main className={workStyles.shell}>
      <TreasuryBackdrop variant={treasuryVariant} />
      <TreasuryPageFrame
        chapter={`ZEN WORLD / ${page.navGroup.toUpperCase()}`}
        serial={`ZEN-${page.slug.toUpperCase()}`}
      />
      {page.layout.chrome !== "none" ? (
        <ManagedHeader navigation={navigation} />
      ) : null}
      <article className={pageClass(page.layout)}>
        <header className={workStyles.hero}>
          <p>{page.navGroup}</p>
          <h1>{page.title}</h1>
          {page.description ? (
            <div className="managed-summary">{page.description}</div>
          ) : null}
          {formattedUpdated ? (
            <time className="managed-time" dateTime={page.updatedAt}>
              Updated {formattedUpdated}
            </time>
          ) : null}
        </header>
        <ManagedPageContent page={page} />
      </article>
      {page.layout.chrome !== "none" ? (
        <ManagedFooter page={page} navigation={navigation} />
      ) : null}
    </main>
  );
}
