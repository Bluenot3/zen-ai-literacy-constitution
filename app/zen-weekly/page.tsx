import type { Metadata } from "next";
import Link from "next/link";

import { getZenWeeklyHome } from "./publication.server";
import {
  formatPublicationDate,
  issueNumberLabel,
  publicationDisplayTitle,
  PublicationUnavailable,
  safePublicUrl,
  ZenWeeklyMasthead,
} from "./publication-renderer";
import { publicationReadingMinutes } from "./publication";
import styles from "./zen-weekly.module.css";
import { ZenWeeklyVisualArchive } from "./visual-archive";

export const dynamic = "force-dynamic";

const canonicalUrl = "https://www.zenai.world/zen-weekly";
const description =
  "ZEN Weekly is ZEN AI Co.’s public record of long-form intelligence on technology, society, and the systems shaping what comes next.";

export const metadata: Metadata = {
  title: "ZEN Weekly",
  description,
  alternates: {
    canonical: canonicalUrl,
    types: { "application/rss+xml": `${canonicalUrl}/feed.xml` },
  },
  openGraph: {
    type: "website",
    title: "ZEN Weekly | ZEN AI Co.",
    description,
    url: canonicalUrl,
    images: [{ url: "/og.png", alt: "ZEN AI Co." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZEN Weekly | ZEN AI Co.",
    description,
  },
    images: ["/og.png"],
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const searchValue = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

export default async function ZenWeeklyHomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const data = await getZenWeeklyHome({
    archivePage: Number(searchValue(params.page)),
    visualPage: Number(searchValue(params.visualPage)),
    query: searchValue(params.q),
    year: searchValue(params.year),
  });
  if (!data.available) return <PublicationUnavailable />;

  const latest = data.latestArticle;
  const latestCover = safePublicUrl(latest?.coverUrl);
  const recent = data.recentIssues.slice(0, 3);
  const archivePreview = data.recentIssues.slice(0, 7);
  const readingMinutes = latest ? publicationReadingMinutes(latest.sections) : null;
  const archiveByYear = Array.from(
    data.archive.issues.reduce((years, issue) => {
      const year = /^\d{4}/.exec(issue.issueDate)?.[0] ?? "Archive";
      const issues = years.get(year) ?? [];
      issues.push(issue);
      years.set(year, issues);
      return years;
    }, new Map<string, typeof data.archive.issues>()),
  );

  const archivePageCount = Math.max(1, Math.ceil(data.archive.total / data.archive.pageSize));
  const archiveHref = (page: number) => {
    const query = new URLSearchParams();
    if (data.archive.query) query.set("q", data.archive.query);
    if (data.archive.year) query.set("year", data.archive.year);
    if (page > 1) query.set("page", String(page));
    if (data.visuals.page > 1) query.set("visualPage", String(data.visuals.page));
    const serialized = query.toString();
    return `/zen-weekly${serialized ? `?${serialized}` : ""}#archive`;
  };
  const visualHref = (page: number) => {
    const query = new URLSearchParams();
    if (data.archive.query) query.set("q", data.archive.query);
    if (data.archive.year) query.set("year", data.archive.year);
    if (data.archive.page > 1) query.set("page", String(data.archive.page));
    if (page > 1) query.set("visualPage", String(page));
    const serialized = query.toString();
    return `/zen-weekly${serialized ? `?${serialized}` : ""}#visual-archive`;
  };

  return (
    <main className={styles.publicationPage}>
      <ZenWeeklyMasthead issue={latest} />
      <div className={styles.publicationInner}>
        <div className={styles.frontPageFolio}>
          <span>Latest public edition</span>
          <span aria-hidden="true">ZEN · WEEKLY · RECORD</span>
          <Link href="#archive">Browse the complete archive ↓</Link>
        </div>
        {latest ? (
          <section className={styles.latestGrid} aria-labelledby="latest-issue-heading">
            <article className={styles.latestStory}>
              <div className={styles.latestCopy}>
                <p className={styles.latestLabel}>Latest</p>
                <h1 className={styles.latestHeadline} id="latest-issue-heading">{publicationDisplayTitle(latest.title)}</h1>
                {latest.summary ? <p className={styles.latestSummary}>{latest.summary}</p> : null}
                <div className={styles.editionMeta}>
                  <time dateTime={latest.issueDate}>{formatPublicationDate(latest.issueDate)}</time>
                  {issueNumberLabel(latest) ? <span>{issueNumberLabel(latest)}</span> : null}
                  {latest.byline ? <span>By {latest.byline}</span> : null}
                  {readingMinutes ? <span>{readingMinutes} min read</span> : null}
                </div>
                <Link className={styles.readLink} href={latest.canonicalPath}>Read the full issue</Link>
              </div>
              <Link className={styles.leadMedia} href={latest.canonicalPath} aria-label={`Read ${latest.title}`}>
                {latestCover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={latestCover}
                    alt={latest.coverAlt || `${publicationDisplayTitle(latest.title)} cover`}
                    fetchPriority="high"
                  />
                ) : (
                  <span className={styles.leadMediaEmpty} aria-hidden="true">ZEN Weekly</span>
                )}
              </Link>
            </article>
            <aside className={styles.archivePreview} aria-labelledby="archive-preview-heading">
              <p className={styles.archiveEyebrow}>Institutional record</p>
              <div className={styles.sectionTitle}>
                <h2 id="archive-preview-heading">From the archive</h2>
              </div>
              {archivePreview.length ? (
                <ol className={styles.archivePreviewList}>
                  {archivePreview.map((issue) => (
                    <li key={issue.id}>
                      <Link href={issue.canonicalPath}>
                        <span>
                          {publicationDisplayTitle(issue.title)}
                          <small>
                            {formatPublicationDate(issue.issueDate)}
                            {issueNumberLabel(issue) ? ` · ${issueNumberLabel(issue)}` : ""}
                          </small>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className={styles.emptyIssue}>Earlier public issues will appear here when available.</p>
              )}
            </aside>
          </section>
        ) : (
          <section className={styles.unavailable} aria-labelledby="no-current-issue">
            <span aria-hidden="true">✦</span>
            <h1 id="no-current-issue">No current issue is published</h1>
            <p>The ZEN Weekly archive is available below. A new lead issue will appear here when Arsenal publishes it.</p>
          </section>
        )}

        <div className={styles.recentDailyGrid}>
          <section className={styles.recentIssues} aria-labelledby="recent-issues-heading">
            <div className={styles.sectionTitle}>
              <h2 id="recent-issues-heading">Recent issues</h2>
              <small>{recent.length ? `${recent.length} shown` : "Archive ledger"}</small>
            </div>
            {recent.length ? recent.map((issue) => {
              const cover = safePublicUrl(issue.coverUrl);
              const ordinal = recent.indexOf(issue) + 1;
              return (
                <article className={styles.recentIssue} key={issue.id}>
                  <div className={styles.issueThumb}>
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cover}
                        alt={issue.coverAlt || `${publicationDisplayTitle(issue.title)} cover`}
                        loading="lazy"
                      />
                    ) : <span aria-hidden="true">Z</span>}
                  </div>
                  <div className={styles.editionMeta}>
                    <time dateTime={issue.issueDate}>{formatPublicationDate(issue.issueDate)}</time>
                    {issueNumberLabel(issue) ? <span>{issueNumberLabel(issue)}</span> : null}
                  </div>
                  <div>
                    <h3>{publicationDisplayTitle(issue.title)}</h3>
                    {issue.summary ? <p>{issue.summary}</p> : null}
                  </div>
                  <span className={styles.recentOrdinal} aria-hidden="true">{String(ordinal).padStart(2, "0")}</span>
                  <Link href={issue.canonicalPath}>Read issue →</Link>
                </article>
              );
            }) : <p className={styles.emptyIssue}>No previous public issues are available.</p>}
          </section>

          {data.daily ? (
            <section className={styles.dailyLane} id="zen-daily" aria-labelledby="zen-daily-heading">
              <div className={styles.dailyChronograph} aria-hidden="true">
                <span />
                <i />
                <b>Z</b>
              </div>
              <div className={styles.sectionTitle}>
                <h2 id="zen-daily-heading">ZEN Daily</h2>
                <small>Current intelligence</small>
              </div>
              <p className={styles.dailyIssueDate}>
                <time dateTime={data.daily.issue.issueDate}>{formatPublicationDate(data.daily.issue.issueDate)}</time>
                {data.daily.issue.title !== "ZEN Daily" ? ` · ${data.daily.issue.title}` : ""}
              </p>
              {data.daily.items.length ? (
                <ol className={styles.dailyItems}>
                  {data.daily.items.map((item) => (
                    <li key={item.id}>
                      <h3>{item.title}</h3>
                      {item.summary ? <p>{item.summary}</p> : null}
                    </li>
                  ))}
                </ol>
              ) : <p>No public story summaries are available for this issue.</p>}
            </section>
          ) : null}
        </div>

        <section className={styles.visualArchiveSection} id="visual-archive" aria-labelledby="visual-archive-heading">
          <div className={styles.sectionTitle}>
            <h2 id="visual-archive-heading">Visual archive</h2>
            <small>Canonical covers · artwork · infographics</small>
          </div>
          <p className={styles.archiveIntroduction}>A museum ledger derived directly from published issue covers and public image or gallery sections.</p>
          <ZenWeeklyVisualArchive items={data.visuals.items} />
          {(data.visuals.page > 1 || data.visuals.hasNext) ? (
            <nav className={styles.archivePagination} aria-label="Visual archive pages">
              {data.visuals.page > 1 ? <Link href={visualHref(data.visuals.page - 1)}>← Newer visual ledger</Link> : <span />}
              <small>Visual ledger {data.visuals.page}</small>
              {data.visuals.hasNext ? <Link href={visualHref(data.visuals.page + 1)}>Older visual ledger →</Link> : <span />}
            </nav>
          ) : null}
        </section>

        <section className={styles.archiveSection} id="archive" aria-labelledby="archive-heading">
          <div className={styles.sectionTitle}>
            <h2 id="archive-heading">The archive</h2>
            <small>{data.archive.total} public {data.archive.total === 1 ? "issue" : "issues"}</small>
          </div>
          <p className={styles.archiveIntroduction}>The published ZEN Weekly record, ordered from the current edition through earlier issues.</p>
          <form className={styles.archiveControls} method="get" action="/zen-weekly">
            <label>
              <span>Search title or issue number</span>
              <input name="q" type="search" defaultValue={data.archive.query} placeholder="e.g. intelligence or 195" maxLength={80} />
            </label>
            <label>
              <span>Year</span>
              <input name="year" inputMode="numeric" pattern="[0-9]{4}" defaultValue={data.archive.year} placeholder="2026" maxLength={4} />
            </label>
            {data.visuals.page > 1 ? <input type="hidden" name="visualPage" value={data.visuals.page} /> : null}
            <button type="submit">Search ledger</button>
            {(data.archive.query || data.archive.year) ? <Link href="/zen-weekly#archive">Clear</Link> : null}
          </form>
          {data.archive.issues.length ? (
            <div className={styles.archiveVolumes}>
              {archiveByYear.map(([year, issues]) => (
                <section className={styles.archiveVolume} aria-labelledby={`archive-year-${year}`} key={year}>
                  <header className={styles.archiveYear}>
                    <span>Year ledger</span>
                    <strong id={`archive-year-${year}`}>{year}</strong>
                    <small>{issues.length} {issues.length === 1 ? "edition" : "editions"}</small>
                  </header>
                  <ol className={styles.archiveList}>
                    {issues.map((issue) => {
                      const cover = safePublicUrl(issue.coverUrl);
                      return (
                        <li key={issue.id}>
                          <Link className={styles.archiveRow} href={issue.canonicalPath}>
                            <span className={styles.archivePlate}>
                              {cover ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={cover}
                                  alt={issue.coverAlt || `${publicationDisplayTitle(issue.title)} cover`}
                                  loading="lazy"
                                />
                              ) : <i aria-hidden="true">Z</i>}
                            </span>
                            <span className={styles.archiveDate}><time dateTime={issue.issueDate}>{formatPublicationDate(issue.issueDate)}</time></span>
                            <strong>{publicationDisplayTitle(issue.title)}</strong>
                            <small>{issueNumberLabel(issue) ?? "ZEN Weekly"}</small>
                          </Link>
                        </li>
                      );
                    })}
                  </ol>
                </section>
              ))}
            </div>
          ) : <p className={styles.emptyIssue}>No public ZEN Weekly issues are available.</p>}
          {archivePageCount > 1 ? (
            <nav className={styles.archivePagination} aria-label="Archive pages">
              {data.archive.page > 1 ? <Link href={archiveHref(data.archive.page - 1)}>← Newer editions</Link> : <span />}
              <small>Page {data.archive.page} of {archivePageCount}</small>
              {data.archive.page < archivePageCount ? <Link href={archiveHref(data.archive.page + 1)}>Older editions →</Link> : <span />}
            </nav>
          ) : null}
        </section>

        <footer className={styles.publicationFooter}>
          <Link href="/">ZEN AI Co.</Link>
          <span aria-hidden="true">Z</span>
          <p>One publication source · Public record</p>
        </footer>
      </div>
    </main>
  );
}
