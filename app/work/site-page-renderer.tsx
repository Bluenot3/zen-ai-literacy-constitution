import Image from "next/image";
import Link from "next/link";
import { TreasuryBackdrop, TreasuryPageFrame } from "../treasury-chrome";
import type { SiteBlock, SitePageDocument } from "./content";
import styles from "./work.module.css";

const safeLink = (value: string) => {
  const trimmed = value.trim();
  if (trimmed.startsWith("/")) return trimmed;

  try {
    const url = new URL(trimmed);
    if (["https:", "mailto:", "tel:"].includes(url.protocol)) {
      return url.toString();
    }
  } catch {
    return "";
  }

  return "";
};

const safeMedia = (value: string) => {
  const trimmed = value.trim();
  if (trimmed.startsWith("/") || trimmed.startsWith("data:image/")) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    if (url.protocol === "https:") return url.toString();
  } catch {
    return "";
  }

  return "";
};

const sandboxedDocument = (html: string) => {
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
    "</head><body>",
    html,
    "</body></html>",
  ].join("");
};

function Block({ block }: { block: SiteBlock }) {
  switch (block.type) {
    case "heading": {
      const Heading = block.level === 3 ? "h3" : "h2";
      return (
        <header className={styles.sectionHeading}>
          {block.eyebrow ? <p>{block.eyebrow}</p> : null}
          <Heading>{block.text}</Heading>
        </header>
      );
    }
    case "text":
      return (
        <div className={styles.richText}>
          {block.body
            .split(/\n{2,}/)
            .filter(Boolean)
            .map((paragraph, index) => (
              <p key={`${block.id}-${index}`}>{paragraph}</p>
            ))}
        </div>
      );
    case "image": {
      const src = safeMedia(block.url);
      return src ? (
        <figure className={styles.media}>
          {/* Published image URLs are normalized and restricted to HTTPS. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={block.alt || ""} loading="lazy" />
          {block.caption ? <figcaption>{block.caption}</figcaption> : null}
        </figure>
      ) : null;
    }
    case "video": {
      const src = safeMedia(block.url);
      const poster = safeMedia(block.poster);
      return src ? (
        <figure className={styles.media}>
          <video controls preload="metadata" poster={poster || undefined}>
            <source src={src} />
            Your browser cannot play this video.
          </video>
          {block.title ? <figcaption>{block.title}</figcaption> : null}
        </figure>
      ) : null;
    }
    case "embed": {
      const href = safeLink(block.url);
      const canEmbed = block.allowEmbed && href.startsWith("https://");
      return (
        <section className={styles.interactive}>
          <div className={styles.interactiveBar}>
            <strong>{block.title || "Interactive experience"}</strong>
            {href ? (
              <a href={href} target="_blank" rel="noopener noreferrer">
                Open original ↗
              </a>
            ) : null}
          </div>
          {canEmbed ? (
            <iframe
              src={href}
              title={block.title || "Embedded interactive experience"}
              loading="lazy"
              sandbox="allow-scripts allow-forms allow-popups allow-presentation"
              referrerPolicy="no-referrer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              style={{ height: `${block.height}px` }}
            />
          ) : (
            <div className={styles.embedFallback}>
              <p>
                {href
                  ? "Open this experience on its original secure page."
                  : "This experience does not have a valid HTTPS address yet."}
              </p>
              {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  Visit experience ↗
                </a>
              ) : null}
            </div>
          )}
        </section>
      );
    }
    case "html":
      return (
        <section className={styles.interactive}>
          <div className={styles.interactiveBar}>
            <strong>{block.title || "Interactive experience"}</strong>
            <span>Sandboxed HTML</span>
          </div>
          <iframe
            srcDoc={sandboxedDocument(block.html)}
            title={block.title || "Sandboxed HTML experience"}
            loading="lazy"
            sandbox="allow-scripts"
            referrerPolicy="no-referrer"
            style={{ height: `${block.height}px` }}
          />
        </section>
      );
    case "code":
      return (
        <section className={styles.code}>
          <div>
            <strong>{block.title || "Code"}</strong>
            <span>{block.language || "text"}</span>
          </div>
          <pre>
            <code>{block.code}</code>
          </pre>
        </section>
      );
    case "cta": {
      const href = safeLink(block.href);
      return (
        <section className={styles.cta}>
          <div>
            <h2>{block.heading}</h2>
            {block.body ? <p>{block.body}</p> : null}
          </div>
          {href ? <a href={href}>{block.label || "Continue"} →</a> : null}
        </section>
      );
    }
    case "quote":
      return (
        <figure className={styles.quote}>
          <blockquote>{block.quote}</blockquote>
          {block.attribution ? <figcaption>{block.attribution}</figcaption> : null}
        </figure>
      );
    case "divider":
      return <hr className={styles.divider} />;
  }
}

export function SitePageRenderer({
  document,
  slug,
  publishedAt,
}: {
  document: SitePageDocument;
  slug: string;
  publishedAt: string;
}) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(publishedAt));

  const treasuryVariant =
    document.listing.category === "knowledge" ||
    document.listing.category === "partners"
      ? "charter"
      : "archive";

  return (
    <main className={styles.shell}>
      <TreasuryBackdrop variant={treasuryVariant} />
      <TreasuryPageFrame
        chapter={`PUBLIC RECORD / ${document.listing.category}`}
        serial={`ZEN-${slug.toUpperCase()}`}
      />
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand} aria-label="ZEN AI World home">
          <Image src="/zen-mark.png" alt="" width={34} height={34} unoptimized />
          <strong>ZEN AI Co.</strong>
        </Link>
        <nav aria-label="Page navigation">
          <Link href="/work">Public work</Link>
          <a href="https://arsenal.world">Enter Arsenal ↗</a>
        </nav>
      </header>

      <article
        className={`${styles.page} ${styles[`layout_${document.layout}`]}`}
      >
        <header className={styles.hero}>
          <p>{document.listing.category}</p>
          <h1>{document.title}</h1>
          {document.summary ? <div>{document.summary}</div> : null}
          <time dateTime={publishedAt}>Published {formattedDate}</time>
        </header>

        <div className={styles.blocks}>
          {document.blocks.length ? (
            document.blocks.map((block) => (
              <Block block={block} key={block.id} />
            ))
          ) : (
            <div className={styles.empty}>This page is being prepared.</div>
          )}
        </div>
      </article>

      <footer className={styles.footer}>
        <span>ZEN AI Co.</span>
        <span>/work/{slug}</span>
      </footer>
    </main>
  );
}
