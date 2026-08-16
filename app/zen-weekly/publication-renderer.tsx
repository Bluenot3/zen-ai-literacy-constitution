import Link from "next/link";
import type { ReactNode } from "react";

import { ImageLightbox } from "./image-lightbox";
import styles from "./zen-weekly.module.css";
import type {
  ZenPublicationArticle,
  ZenPublicationBlock,
  ZenPublicationIssue,
} from "./publication";

const INLINE_MARKDOWN =
  /(!?)\[([^\]\n]*)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)|\*\*([^*\n]+)\*\*|`([^`\n]+)`|\*([^*\n]+)\*/g;
const SAFE_EMBED_HOSTS = new Set([
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
  "player.vimeo.com",
  "open.spotify.com",
  "w.soundcloud.com",
  "www.loom.com",
  "codepen.io",
  "codesandbox.io",
  "www.figma.com",
]);

export function safePublicUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value.trim());
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function safeLinkUrl(value: string): string | null {
  if (/^mailto:/i.test(value)) {
    return /^mailto:[^\s@]+@[^\s@]+$/i.test(value) ? value : null;
  }
  return safePublicUrl(value);
}

function youtubeEmbed(url: URL): string | null {
  const host = url.hostname.toLowerCase();
  let id = "";
  if (host === "youtu.be") id = url.pathname.split("/").filter(Boolean)[0] ?? "";
  if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
    id = url.searchParams.get("v") ?? "";
    if (!id && url.pathname.startsWith("/embed/")) id = url.pathname.split("/")[2] ?? "";
    if (!id && url.pathname.startsWith("/shorts/")) id = url.pathname.split("/")[2] ?? "";
  }
  return /^[a-z0-9_-]{6,20}$/i.test(id)
    ? `https://www.youtube-nocookie.com/embed/${id}`
    : null;
}

function vimeoEmbed(url: URL): string | null {
  const id = url.pathname.split("/").filter(Boolean).findLast((part) => /^\d{5,12}$/.test(part));
  return id ? `https://player.vimeo.com/video/${id}` : null;
}

export function allowedEmbedUrl(value: string | null | undefined): string | null {
  const safe = safePublicUrl(value);
  if (!safe) return null;
  const url = new URL(safe);
  const host = url.hostname.toLowerCase();
  if (host === "youtu.be" || host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
    return youtubeEmbed(url);
  }
  if (host === "vimeo.com" || host === "www.vimeo.com" || host === "player.vimeo.com") {
    return vimeoEmbed(url);
  }
  return SAFE_EMBED_HOSTS.has(host) ? safe : null;
}

export function sanitizeHtmlDocument(value: string): string {
  const sanitized = value
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|iframe|object|embed|base|meta|link|form)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<(script|iframe|object|embed|base|meta|link|form)\b[^>]*\/?\s*>/gi, "")
    .replace(/\s(?:on[a-z]+|srcdoc)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(?:javascript|vbscript|data\s*:\s*text\/html)\s*:/gi, "")
    .slice(0, 200_000);
  const policy =
    "default-src 'none'; img-src https: data:; media-src https:; style-src 'unsafe-inline'; font-src https: data:; frame-src 'none'; form-action 'none'; base-uri 'none'";
  return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${policy}"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>${sanitized}</body></html>`;
}

export function formatPublicationDate(value: string): string {
  const date = new Date(`${value}T12:00:00.000Z`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      }).format(date);
}

export function issueNumberLabel(issue: ZenPublicationIssue): string | null {
  if (issue.editionNumber) return `Issue ${issue.editionNumber}`;
  const titleIssue = issue.title.match(/\bissue\s*#?\s*([a-z0-9.-]+)\s*$/i)?.[1];
  return titleIssue ? `Issue ${titleIssue}` : null;
}

export function publicationDisplayTitle(title: string): string {
  return title.replace(/\s*\|\s*ZEN WEEKLY\s*\|\s*ISSUE\s*#?\s*[a-z0-9.-]+\s*$/i, "").trim() || title;
}

function inlineMarkdown(value: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let token = 0;
  for (const match of value.matchAll(INLINE_MARKDOWN)) {
    const index = match.index ?? 0;
    if (index > cursor) nodes.push(value.slice(cursor, index));
    const key = `${keyPrefix}-${token++}`;
    if (match[3]) {
      const isImage = match[1] === "!";
      const label = match[2] || (isImage ? "" : "Source");
      const url = isImage ? safePublicUrl(match[3]) : safeLinkUrl(match[3]);
      nodes.push(
        isImage && url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className={styles.inlineImage} src={url} alt={label} loading="lazy" key={key} />
        ) : url ? (
          <a href={url} target={url.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer" key={key}>
            {label}
          </a>
        ) : (
          label
        ),
      );
    } else if (match[4]) {
      nodes.push(<strong key={key}>{match[4]}</strong>);
    } else if (match[5]) {
      nodes.push(<code key={key}>{match[5]}</code>);
    } else if (match[6]) {
      nodes.push(<em key={key}>{match[6]}</em>);
    }
    cursor = index + match[0].length;
  }
  if (cursor < value.length) nodes.push(value.slice(cursor));
  return nodes;
}

function MarkdownContent({ value }: { value: string }) {
  const chunks = value.replace(/\r\n?/g, "\n").trim().split(/\n{2,}/).filter(Boolean);
  return (
    <div className={styles.markdownBody}>
      {chunks.map((chunk, index) => {
        const key = `markdown-${index}`;
        const fencedCode = /^```([\w+-]*)\n([\s\S]*?)```$/.exec(chunk.trim());
        if (fencedCode) {
          return (
            <pre className={styles.codeBlock} key={key}>
              <code data-language={fencedCode[1] || "text"}>{fencedCode[2]}</code>
            </pre>
          );
        }
        const lines = chunk.split("\n").map((line) => line.trim()).filter(Boolean);
        if (lines.every((line) => /^[-*+]\s+/.test(line))) {
          return (
            <ul key={key}>
              {lines.map((line, itemIndex) => (
                <li key={`${key}-${itemIndex}`}>{inlineMarkdown(line.replace(/^[-*+]\s+/, ""), `${key}-${itemIndex}`)}</li>
              ))}
            </ul>
          );
        }
        if (lines.every((line) => /^\d+[.)]\s+/.test(line))) {
          return (
            <ol key={key}>
              {lines.map((line, itemIndex) => (
                <li key={`${key}-${itemIndex}`}>{inlineMarkdown(line.replace(/^\d+[.)]\s+/, ""), `${key}-${itemIndex}`)}</li>
              ))}
            </ol>
          );
        }
        if (lines.every((line) => /^>\s?/.test(line))) {
          return <blockquote key={key}>{inlineMarkdown(lines.map((line) => line.replace(/^>\s?/, "")).join(" "), key)}</blockquote>;
        }
        const image = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+["']([^"']*)["'])?\)$/.exec(chunk.trim());
        const imageUrl = image ? safePublicUrl(image[2]) : null;
        if (image && imageUrl) {
          return (
            <figure className={styles.editorialFigure} key={key}>
              <ImageLightbox src={imageUrl} alt={image[1]} caption={image[3]} />
              {image[3] ? <figcaption>{image[3]}</figcaption> : null}
            </figure>
          );
        }
        const heading = /^(#{1,3})\s+(.+)$/.exec(lines[0] ?? "");
        if (heading && lines.length === 1) {
          return <h2 key={key}>{inlineMarkdown(heading[2], key)}</h2>;
        }
        if (/^([-*_])\1{2,}$/.test(chunk.trim())) return <hr key={key} />;
        return <p key={key}>{inlineMarkdown(lines.join(" "), key)}</p>;
      })}
    </div>
  );
}

function BlockHeading({ block, marker }: { block: ZenPublicationBlock; marker?: string }) {
  if (!block.heading && !marker) return null;
  return (
    <header className={styles.blockHeading}>
      {marker ? <span>{marker}</span> : null}
      {block.heading ? <h2>{block.heading}</h2> : null}
    </header>
  );
}
function figureClass(block: ZenPublicationBlock) {
  const layoutClass = block.media.layout === "wide"
    ? styles.figureWide
    : block.media.layout === "full"
      ? styles.figureFull
      : block.media.layout === "infographic"
        ? styles.figureInfographic
        : "";
  return `${styles.editorialFigure} ${layoutClass}`.trim();
}

function FigureCaption({ block }: { block: ZenPublicationBlock }) {
  const provenanceUrl = safePublicUrl(block.media.provenanceUrl);
  if (!block.media.caption && !block.media.credit && !provenanceUrl) return null;
  return (
    <figcaption className={styles.figureMeta}>
      {block.media.caption ? <span>{block.media.caption}</span> : null}
      {block.media.credit ? <small>Credit · {block.media.credit}</small> : null}
      {provenanceUrl ? <a href={provenanceUrl} target="_blank" rel="noopener noreferrer">Provenance record ↗</a> : null}
    </figcaption>
  );
}


function EditorialFigure({ block }: { block: ZenPublicationBlock }) {
  const url = safePublicUrl(block.media.url ?? block.body);
  if (!url) return null;
  return (
    <figure className={figureClass(block)}>
      <BlockHeading block={block} />
      <ImageLightbox src={url} alt={block.media.alt || block.heading || block.media.caption || "ZEN Weekly issue artwork"} caption={block.media.caption} />
      <FigureCaption block={block} />
    </figure>
  );
}

function VideoBlock({ block }: { block: ZenPublicationBlock }) {
  const source = block.media.url ?? block.body;
  const embed = allowedEmbedUrl(source);
  const media = safePublicUrl(source);
  if (!embed && !media) return null;
  return (
    <section className={`${styles.articleBlock} ${styles.darkInsert}`}>
      <BlockHeading block={block} marker="Watch" />
      <div className={styles.videoFrame}>
        {embed ? (
          <iframe
            src={embed}
            title={block.heading || "ZEN Weekly video"}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-presentation"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <video src={media ?? undefined} controls playsInline preload="metadata" />
        )}
      </div>
      {block.media.caption ? <p className={styles.mediaCaption}>{block.media.caption}</p> : null}
    </section>
  );
}

function EmbedBlock({ block }: { block: ZenPublicationBlock }) {
  const source = block.media.url ?? block.body;
  const embed = allowedEmbedUrl(source);
  const safeSource = safePublicUrl(source);
  return (
    <section className={`${styles.articleBlock} ${styles.darkInsert}`}>
      <BlockHeading block={block} marker="Media" />
      {embed ? (
        <iframe
          className={styles.embedFrame}
          style={{ height: block.media.height ?? 480 }}
          src={embed}
          title={block.heading || "ZEN Weekly embedded media"}
          loading="lazy"
          sandbox="allow-scripts allow-forms allow-popups allow-presentation"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : safeSource ? (
        <a className={styles.safeMediaLink} href={safeSource} target="_blank" rel="noopener noreferrer">
          Open the published media source
        </a>
      ) : (
        <p className={styles.mediaUnavailable}>This media source is not available on the public allowlist.</p>
      )}
    </section>
  );
}

function GalleryBlock({ block }: { block: ZenPublicationBlock }) {
  const images = (block.media.images ?? [])
    .map((image) => ({ ...image, url: safePublicUrl(image.url) }))
    .filter((image): image is typeof image & { url: string } => Boolean(image.url));
  if (!images.length) return null;
  return (
    <section className={`${styles.articleBlock} ${block.media.layout === "sequence" ? styles.gallerySequence : ""}`}>
      <BlockHeading block={block} marker="Gallery" />
      <div className={styles.gallery}>
        {images.map((image, index) => (
          <figure className={styles.editorialFigure} key={`${image.url}-${index}`}>
            <ImageLightbox src={image.url} alt={image.alt || image.caption || block.heading || "ZEN Weekly gallery artwork"} caption={image.caption} />
            {image.caption ? <figcaption>{image.caption}</figcaption> : null}
          </figure>
        ))}
      </div>
    </section>
  );
}

function LinkBlock({ block }: { block: ZenPublicationBlock }) {
  const url = safeLinkUrl(block.media.url ?? block.body);
  if (!url) return null;
  const image = safePublicUrl(block.media.image);
  return (
    <section className={styles.articleBlock}>
      <BlockHeading block={block} marker={block.media.siteName || "Source"} />
      <a className={styles.sourceLedger} href={url} target="_blank" rel="noopener noreferrer">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" loading="lazy" />
        ) : null}
        <span>
          <strong>{block.media.title || block.heading || url}</strong>
          {block.media.description || block.body ? <small>{block.media.description || block.body}</small> : null}
          <em>{block.media.siteName || new URL(url).hostname}</em>
        </span>
      </a>
    </section>
  );
}

function HtmlBlock({ block }: { block: ZenPublicationBlock }) {
  if (!block.body) return null;
  return (
    <section className={`${styles.articleBlock} ${styles.htmlInsert}`}>
      <BlockHeading block={block} marker="Document insert" />
      <iframe
        className={styles.htmlFrame}
        title={block.heading || "ZEN Weekly HTML document"}
        sandbox=""
        srcDoc={sanitizeHtmlDocument(block.body)}
      />
    </section>
  );
}

function PublicationBlock({ block }: { block: ZenPublicationBlock }) {
  switch (block.kind) {
    case "divider":
      return <div className={styles.editorialDivider} aria-hidden="true"><span>✦</span></div>;
    case "image":
      return <EditorialFigure block={block} />;
    case "video":
    case "youtube":
      return <VideoBlock block={block} />;
    case "embed":
      return <EmbedBlock block={block} />;
    case "gallery":
      return <GalleryBlock block={block} />;
    case "link_card":
    case "tweet":
      return <LinkBlock block={block} />;
    case "pdf": {
      const url = safePublicUrl(block.media.url ?? block.body);
      return url ? (
        <section className={`${styles.articleBlock} ${styles.darkInsert}`}>
          <BlockHeading block={block} marker="Document" />
          <iframe className={styles.pdfFrame} src={url} title={block.heading || "ZEN Weekly PDF"} loading="lazy" sandbox="" />
        </section>
      ) : null;
    }
    case "html":
      return <HtmlBlock block={block} />;
    case "code":
      return (
        <section className={styles.articleBlock}>
          <BlockHeading block={block} marker={block.media.language ? `Technical insert · ${block.media.language}` : "Technical insert"} />
          <pre className={styles.codeBlock}><code>{block.body}</code></pre>
        </section>
      );
    case "quote":
      return (
        <figure className={styles.pullQuote}>
          {block.heading ? <span>{block.heading}</span> : null}
          <blockquote>{block.body}</blockquote>
          {block.media.attribution ? <figcaption>— {block.media.attribution}</figcaption> : null}
        </figure>
      );
    case "callout":
      return (
        <aside className={`${styles.callout} ${styles[`callout_${block.media.tone ?? "info"}`]}`}>
          <BlockHeading block={block} marker="Editor’s note" />
          <MarkdownContent value={block.body} />
        </aside>
      );
    case "agent_feed":
    case "community_feed":
    case "announcement_feed":
      return block.heading || block.body ? (
        <aside className={styles.liveInsert}>
          <BlockHeading block={block} marker="Filed intelligence" />
          <MarkdownContent value={block.body} />
        </aside>
      ) : null;
    case "markdown":
    case "text":
    default:
      return (
        <section className={`${styles.articleBlock} ${styles.longformText}`}>
          <BlockHeading block={block} />
          <MarkdownContent value={block.body} />
        </section>
      );
  }
}

export function ZenPublicationBlocks({ article }: { article: ZenPublicationArticle }) {
  return (
    <div className={styles.articleBody}>
      {article.sections.map((block) => <PublicationBlock block={block} key={block.id} />)}
      {!article.sections.length ? (
        <p className={styles.emptyIssue}>This published issue does not contain public sections yet.</p>
      ) : null}
    </div>
  );
}

export function ZenWeeklyMasthead({ issue, compact = false }: { issue?: ZenPublicationIssue | null; compact?: boolean }) {
  const issueNumber = issue ? issueNumberLabel(issue) : null;
  return (
    <header className={`${styles.masthead} ${compact ? styles.mastheadCompact : ""}`}>
      <nav className={styles.publicationNav} aria-label="ZEN publication navigation">
        <Link href="/">ZEN AI Co.</Link>
        <Link href="/programs">Programs</Link>
        <Link href="/zen-weekly" aria-current="page">ZEN Weekly</Link>
        <Link href="/work">Work / Proof</Link>
        <a href="https://arsenal.world" target="_blank" rel="noopener noreferrer">Arsenal ↗</a>
        <Link href="/start">Start with ZEN</Link>
      </nav>
      <div className={styles.institutionalLine}>
        <Link href="/" aria-label="ZEN AI Co. home">ZEN AI CO.</Link>
        <span className={styles.publicEdition}>Public edition</span>
        <div>
          {issueNumber ? <span>{issueNumber}</span> : null}
          {issue ? <time dateTime={issue.issueDate}>{formatPublicationDate(issue.issueDate)}</time> : null}
        </div>
      </div>
      <div className={styles.mastheadTitle}>
        <span className={styles.seal} aria-hidden="true"><i>Z</i></span>
        <div className={styles.mastheadWordmark}>
          <span className={styles.mastheadOverline}>The public record of ZEN AI Co.</span>
          <Link href="/zen-weekly">ZEN WEEKLY</Link>
          <p>Intelligence · Technology · Society</p>
        </div>
        <span className={styles.seal} aria-hidden="true"><i>W</i></span>
      </div>
      <div className={styles.mastheadRule} aria-hidden="true"><span>✦</span></div>
    </header>
  );
}

export function PublicationUnavailable({ article = false }: { article?: boolean }) {
  return (
    <main className={styles.publicationPage}>
      <ZenWeeklyMasthead compact={article} />
      <section className={styles.unavailable} aria-live="polite">
        <span aria-hidden="true">✦</span>
        <h1>Publication temporarily unavailable</h1>
        <p>The ZEN Weekly reading service could not be reached. The public archive will return here without substituting sample content.</p>
        <Link href="/">Return to ZEN AI Co.</Link>
      </section>
    </main>
  );
}
