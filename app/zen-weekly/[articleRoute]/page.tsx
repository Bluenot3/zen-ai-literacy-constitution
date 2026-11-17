import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { ArticleTools } from "../article-tools";
import { ZenIssue200Reader } from "../issue-reader";
import atlasStyles from "../incident-atlas/incident-atlas.module.css";
import { ImageLightbox } from "../image-lightbox";
import {
  parseZenWeeklyArticleRoute,
  publicationDescription,
  publicationReadingMinutes,
} from "../publication";
import { getZenWeeklyArticle } from "../publication.server";
import {
  formatPublicationDate,
  issueNumberLabel,
  publicationDisplayTitle,
  PublicationUnavailable,
  safePublicUrl,
  ZenPublicationBlocks,
  ZenWeeklyMasthead,
} from "../publication-renderer";
import styles from "../zen-weekly.module.css";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ articleRoute: string }>;
};

const canonicalHost = "https://www.zenai.world";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const id = parseZenWeeklyArticleRoute((await params).articleRoute);
  if (!id) return { title: "Issue not found", robots: { index: false, follow: false } };
  const result = await getZenWeeklyArticle(id);
  if (!result.available || !result.article) {
    return {
      title: result.available ? "Issue not found" : "ZEN Weekly",
      robots: { index: false, follow: false },
    };
  }

  const article = result.article;
  const canonicalUrl = `${canonicalHost}${article.canonicalPath}`;
  const description = publicationDescription(article);
  const image = safePublicUrl(article.coverUrl);
  return {
    title: article.title,
    description,
    authors: article.byline ? [{ name: article.byline }] : undefined,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "article",
      siteName: "ZEN AI Co.",
      title: article.title,
      description,
      url: canonicalUrl,
      publishedTime: article.publishedAt ?? undefined,
      modifiedTime: article.updatedAt ?? article.publishedAt ?? undefined,
      authors: article.byline ? [article.byline] : undefined,
      section: article.category || undefined,
      tags: article.tags.length ? article.tags : undefined,
      images: image ? [{ url: image, alt: article.coverAlt || article.title }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: article.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ZenWeeklyArticlePage({ params }: PageProps) {
  const route = (await params).articleRoute;
  const id = parseZenWeeklyArticleRoute(route);
  if (!id) notFound();
  const result = await getZenWeeklyArticle(id);
  if (!result.available) return <PublicationUnavailable article />;
  if (!result.article) notFound();

  const article = result.article;
  const preferredRoute = article.canonicalPath.split("/").at(-1);
  if (preferredRoute && route !== preferredRoute) redirect(article.canonicalPath);
  const canonicalUrl = `${canonicalHost}${article.canonicalPath}`;
  const cover = safePublicUrl(article.coverUrl);
  const readingMinutes = publicationReadingMinutes(article.sections);
  const isIssue200EvidenceReader = article.id === "3d64f3e5-2906-4029-a977-b547346ed66f";
  const articleIssueNumber = issueNumberLabel(article)?.replace(/^Issue\s+/i, "") ?? "W";
  const previousIssue = result.previousIssue;
  const nextIssue = result.nextIssue;
  const description = publicationDescription(article);
  const structuredData = article.publishedAt
    ? {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: article.title,
        description,
        datePublished: article.publishedAt,
        mainEntityOfPage: canonicalUrl,
        dateModified: article.updatedAt ?? article.publishedAt,
        url: canonicalUrl,
        image: cover || undefined,
        articleSection: article.category || undefined,
        keywords: article.tags.length ? article.tags.join(", ") : undefined,
        author: article.byline ? { "@type": "Person", name: article.byline } : undefined,
        publisher: { "@type": "Organization", name: "ZEN AI Co.", url: canonicalHost },
      }
    : null;

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ZEN AI Co.", item: canonicalHost },
      { "@type": "ListItem", position: 2, name: "ZEN Weekly", item: `${canonicalHost}/zen-weekly` },
      {
        "@type": "ListItem",
        position: 3,
        name: publicationDisplayTitle(article.title),
        item: canonicalUrl,
      },
    ],
  };
  return (
    <main className={styles.publicationPage}>
      {structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
      ) : null}
      <ZenWeeklyMasthead issue={article} compact />
      <nav className={styles.articleNav} aria-label="Issue navigation">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData).replace(/</g, "\\u003c") }}
      />
        <Link href="/zen-weekly">← Return to ZEN Weekly</Link>
        <div className={styles.articleNavCenter}>
          {previousIssue ? <Link href={previousIssue.canonicalPath}>← Previous issue</Link> : <span />}
          {nextIssue ? <Link href={nextIssue.canonicalPath}>Next issue →</Link> : <span />}
        </div>
        <ArticleTools canonicalUrl={canonicalUrl} issueId={article.id} title={article.title} />
      </nav>

      <article className={styles.articleStory}>
        <header className={styles.articleHeader}>
          <div className={styles.articleHeaderFrame}>
            <div className={styles.articleIssueSeal} aria-hidden="true">
              <span>ZEN</span>
              <strong>{articleIssueNumber}</strong>
              <small>Weekly</small>
            </div>
            <div className={styles.articleHeadlineGroup}>
              <p className={styles.articleKicker}>{article.category || "ZEN Weekly"}</p>
              <h1 className={styles.articleTitle}>{publicationDisplayTitle(article.title)}</h1>
              {article.summary ? <p className={styles.articleSummary}>{article.summary}</p> : null}
              <div className={styles.editionMeta}>
                <time dateTime={article.issueDate}>{formatPublicationDate(article.issueDate)}</time>
                {issueNumberLabel(article) ? <span>{issueNumberLabel(article)}</span> : null}
                {article.byline ? <span>By {article.byline}</span> : null}
                {readingMinutes ? <span>{isIssue200EvidenceReader ? `Full evidence record · ${readingMinutes} min` : `${readingMinutes} min read`}</span> : null}
              </div>
            </div>
          </div>
        </header>

        {cover ? (
          <figure className={styles.articleLead}>
            <ImageLightbox src={cover} alt={article.coverAlt || article.title} caption={article.coverAlt} priority />
            {article.coverAlt ? <figcaption>{article.coverAlt}</figcaption> : null}
          </figure>
        ) : null}

        {isIssue200EvidenceReader ? (
          <section className={atlasStyles.articleAtlasLaunch} aria-label="Issue 200 interactive incident atlas">
            <div>
              <span>NEW / INTERACTIVE INTELLIGENCE BOARD</span>
              <h2>Explore this investigation on a world atlas</h2>
              <p>Zoom across the incident map, filter the timeline, inspect source-linked evidence, and separate documented dependencies from unproven connections. All {article.sections.filter(section => section.position > 0).length} published updates are searchable.</p>
            </div>
            <Link href="/zen-weekly/atlas">Open the incident atlas <span aria-hidden="true">↗</span></Link>
          </section>
        ) : null}

        <div className={styles.articleReadingShell}>
          <aside className={styles.articleRail} aria-label="Publication details">
            <span>Filed in the public record</span>
            <strong>{issueNumberLabel(article) ?? "ZEN Weekly"}</strong>
            <time dateTime={article.issueDate}>{formatPublicationDate(article.issueDate)}</time>
            <Link href="/zen-weekly#archive">Open archive</Link>
          </aside>
          {isIssue200EvidenceReader ? <ZenIssue200Reader article={article} /> : <ZenPublicationBlocks article={article} />}
        </div>
      </article>

      <nav className={styles.continuation} aria-label="Continue through ZEN Weekly">
        {previousIssue ? (
          <Link href={previousIssue.canonicalPath}>
            <small>Previous issue</small>
            <strong>{publicationDisplayTitle(previousIssue.title)}</strong>
          </Link>
        ) : <span />}
        <Link href="/zen-weekly#archive">
          <small>Archive trail</small>
          <strong>Return to ZEN Weekly</strong>
        </Link>
        {nextIssue ? (
          <Link href={nextIssue.canonicalPath}>
            <small>Next issue</small>
            <strong>{publicationDisplayTitle(nextIssue.title)}</strong>
          </Link>
        ) : <span />}
      </nav>

      <footer className={styles.publicationFooter}>
        <Link href="/">ZEN AI Co.</Link>
        <span aria-hidden="true">Z</span>
        <p>ZEN Weekly · Public archive</p>
      </footer>
    </main>
  );
}
