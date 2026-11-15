"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

import type { ZenPublicationArticle, ZenPublicationBlock } from "./publication";
import { ZenPublicationBlocks } from "./publication-renderer";
import styles from "./issue-reader.module.css";

const TOPICS = [
  { id: "all", label: "All developments" },
  { id: "aviation", label: "Aviation" },
  { id: "cloud", label: "Cloud & AI" },
  { id: "finance", label: "Banking" },
  { id: "industrial", label: "Infrastructure" },
  { id: "maritime", label: "Maritime" },
  { id: "security", label: "Security" },
  { id: "crypto", label: "Bitcoin & crypto" },
] as const;

type Topic = (typeof TOPICS)[number]["id"];
type EvidenceUpdate = {
  block: ZenPublicationBlock;
  number: string;
  topics: Topic[];
  title: string;
  preview: string;
};

const TOPIC_LABEL: Record<Topic, string> = {
  all: "All developments",
  aviation: "Aviation",
  cloud: "Cloud & AI",
  finance: "Banking",
  industrial: "Infrastructure",
  maritime: "Maritime",
  security: "Security",
  crypto: "Bitcoin & crypto",
};

// Tags classify editorial subjects only. They do NOT imply a common cause.
const KNOWN_TOPICS: Record<number, Topic[]> = {
  1: ["aviation", "cloud", "finance", "crypto"],
  2: ["aviation"],
  3: ["aviation", "maritime", "security"],
  4: ["aviation", "cloud", "maritime"],
  5: ["aviation", "cloud"],
  6: ["crypto", "cloud", "security"],
  7: ["aviation"],
  8: ["industrial", "aviation", "finance", "maritime"],
  9: ["maritime", "industrial"],
  10: ["security", "maritime"],
  11: ["maritime"],
  12: ["maritime", "security"],
  13: ["industrial", "security"],
  14: ["industrial", "security"],
  15: ["maritime", "security"],
  16: ["maritime", "security"],
  17: ["finance", "security"],
  18: ["cloud", "security"],
  19: ["aviation"],
  20: ["maritime", "security"],
};

function cleanMarkdown(value: string): string {
  return value
    .replace(/^\s*#+\s+/g, "")
    .replace(/\*\*/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function updateTitle(block: ZenPublicationBlock): string {
  const candidates = block.body.split("\n").slice(0, 12).map((line) => line.trim());
  const title = candidates.find((line) => /^\*\*(?:Updated|Published|Published update):?/i.test(line));
  if (!title) return block.heading && !/UPDATE 0\d+/i.test(block.heading) ? block.heading : "Developing evidence";
  const candidate = cleanMarkdown(title)
    .replace(/^(?:updated|published(?: update)?)\s*:?\s*/i, "")
    .replace(/^.*?\s+[–—]\s+(?=[a-z])/i, "")
    .replace(/\s*\(America\/New_York\).*$/i, "");
  return candidate.slice(0, 172) || "Developing evidence";
}

function updatePreview(block: ZenPublicationBlock): string {
  const candidates = block.body.split("\n").slice(0, 16).map((line) => line.trim());
  const line = candidates.find((entry) =>
    /^\*\*(?:What (?:this update )?adds|What(?:'s| is) new|New material|ADDED THIS UPDATE|Evidence dossier|New this edition)/i.test(entry),
  );
  return line ? cleanMarkdown(line).slice(0, 240) : "";
}

function inferTopics(block: ZenPublicationBlock): Topic[] {
  const known = KNOWN_TOPICS[block.position];
  if (known) return known;
  const evidence = `${block.heading} ${block.body.slice(0, 850)}`.toLowerCase();
  const inferred: Topic[] = [];
  if (/faa|flight|aviation|airspace|ground stop/.test(evidence)) inferred.push("aviation");
  if (/microsoft|cursor|fireworks|cloud|extension|software|saas/.test(evidence)) inferred.push("cloud");
  if (/fedwire|bank|payment|settlement|funds/.test(evidence)) inferred.push("finance");
  if (/industrial|utility|ethanol|refrigeration|grid|power/.test(evidence)) inferred.push("industrial");
  if (/tanker|ship|port|maritime|sea|hormuz|strait|romania/.test(evidence)) inferred.push("maritime");
  if (/military|drone|missile|cyber|phishing|intrusion/.test(evidence)) inferred.push("security");
  if (/bitcoin|btc|crypto|blockchain/.test(evidence)) inferred.push("crypto");
  return inferred;
}

function withSection(article: ZenPublicationArticle, section: ZenPublicationBlock): ZenPublicationArticle {
  return { ...article, sections: [section] };
}

/**
 * Presentation-only reader for Issue 200. No mutation or summarization of
 * published Supabase bodies occurs here; details retain full original text.
 */
export function ZenIssue200Reader({ article }: { article: ZenPublicationArticle }) {
  const [topic, setTopic] = useState<Topic>("all");
  const [query, setQuery] = useState("");
  const [oldestFirst, setOldestFirst] = useState(false);
  const searchId = useId();
  const root = useRef<HTMLDivElement>(null);

  const original = article.sections.find((section) => section.position === 0);
  const editorialFront = article.sections.filter((section) => section.position < 0);
  const updates = useMemo<EvidenceUpdate[]>(
    () => article.sections
      .filter((section) => section.position > 0)
      .sort((a, b) => a.position - b.position)
      .map((block) => ({
        block,
        number: String(block.position).padStart(3, "0"),
        topics: inferTopics(block),
        title: updateTitle(block),
        preview: updatePreview(block),
      })),
    [article.sections],
  );

  const latest = updates.at(-1) ?? null;
  const shown = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const visible = updates.filter((item) => {
      if (topic !== "all" && !item.topics.includes(topic)) return false;
      if (!normalized) return true;
      return `${item.number} ${item.title} ${item.preview} ${item.block.heading} ${item.block.body}`
        .toLowerCase()
        .includes(normalized);
    });
    return oldestFirst ? visible : [...visible].reverse();
  }, [updates, topic, query, oldestFirst]);

  const toggleAll = (open: boolean) => {
    root.current?.querySelectorAll<HTMLDetailsElement>("details[data-weekly-evidence]")
      .forEach((element) => { element.open = open; });
  };

  const openLatest = () => {
    if (!latest) return;
    setTopic("all");
    setQuery("");
    setOldestFirst(false);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const target = document.getElementById(`update-${latest.number}`) as HTMLDetailsElement | null;
        if (target) {
          target.open = true;
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (!/^#(?:update-\d{3}|original-record)$/.test(hash)) return;
    const target = document.getElementById(hash.slice(1)) as HTMLDetailsElement | null;
    if (target) target.open = true;
  }, []);

  return (
    <div className={styles.reader} ref={root}>
      <div className={styles.readerMasthead}>
        <span>ZEN WEEKLY / THE EVIDENCE DESK</span>
        <span>Issue #200 · Source record preserved</span>
      </div>

      {editorialFront.length ? (
        <section className={styles.front} aria-label="Essential brief">
          <ZenPublicationBlocks article={{ ...article, sections: editorialFront }} />
        </section>
      ) : null}

      <section className={styles.navigator} aria-labelledby="evidence-index-heading" id="evidence-index">
        <div className={styles.navigatorHeader}>
          <div>
            <p className={styles.kicker}>FOLLOW THE EVIDENCE</p>
            <h2 id="evidence-index-heading">The investigation, without the scroll</h2>
            <p>Read the latest findings first or filter the original append-only record by subject. Sorting and collapsing change only the presentation—not a word of published evidence.</p>
          </div>
          <div className={styles.navigatorMetrics}>
            <strong>{String(updates.length).padStart(2, "0")}</strong>
            <span>timestamped updates</span>
            <button type="button" onClick={openLatest} disabled={!latest}>
              Open latest · {latest?.number ?? "—"}
            </button>
          </div>
        </div>

        <div className={styles.filters}>
          <div className={styles.topicList} role="group" aria-label="Filter developing stories by subject">
            {TOPICS.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={topic === option.id}
                className={topic === option.id ? styles.activeTopic : ""}
                onClick={() => setTopic(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className={styles.filterRow}>
            <label htmlFor={searchId}>Search the full evidence record</label>
            <input
              id={searchId}
              type="search"
              placeholder="Search FAA, vendor, date, ship, incident ID…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <label className={styles.sortField}>
              Display order
              <select value={oldestFirst ? "oldest" : "latest"} onChange={(event) => setOldestFirst(event.target.value === "oldest")}>
                <option value="latest">Newest first</option>
                <option value="oldest">Chronological</option>
              </select>
            </label>
          </div>
        </div>
        <div className={styles.controls}>
          <span aria-live="polite">{shown.length} of {updates.length} developing updates shown</span>
          <div>
            <button type="button" onClick={() => toggleAll(true)}>Expand displayed</button>
            <button type="button" onClick={() => toggleAll(false)}>Collapse displayed</button>
          </div>
        </div>
      </section>

      {original ? (
        <details className={styles.original} id="original-record" data-weekly-evidence>
          <summary>
            <span className={styles.recordIndex}>ORIGINAL / NOV 12</span>
            <span className={styles.recordTitle}>
              <strong>Read the complete original investigation</strong>
              <small>Microsoft, TSMC, technical figures and all original citations · preserved in full</small>
            </span>
            <span className={styles.expandGlyph} aria-hidden="true">+</span>
          </summary>
          <div className={styles.fullRecord}><ZenPublicationBlocks article={withSection(article, original)} /></div>
        </details>
      ) : null}

      <section className={styles.updates} aria-labelledby="updates-heading" id="updates">
        <div className={styles.updatesHeading}>
          <p className={styles.kicker}>DEVELOPING EVIDENCE / PERMANENT RECORD</p>
          <h2 id="updates-heading">Every update. Nothing erased.</h2>
          <p>Each section retains its original date, sources, graphics, correction notices and full text. Claims of common attribution require evidence beyond timing alone.</p>
        </div>
        {!shown.length ? (
          <p className={styles.noMatches}>No updates match these filters. Clear the search or choose another subject.</p>
        ) : shown.map((item) => (
          <details className={styles.update} key={item.block.id} id={`update-${item.number}`} data-weekly-evidence>
            <summary>
              <span className={styles.recordIndex}>UPDATE {item.number}</span>
              <span className={styles.recordTitle}>
                <strong>{item.title}</strong>
                {item.preview ? <small>{item.preview}</small> : null}
                <span className={styles.tags}>
                  {item.topics.map((tag) => <span key={tag}>{TOPIC_LABEL[tag]}</span>)}
                </span>
              </span>
              <span className={styles.expandGlyph} aria-hidden="true">+</span>
            </summary>
            <div className={styles.fullRecord}><ZenPublicationBlocks article={withSection(article, item.block)} /></div>
          </details>
        ))}
      </section>
      <div className={styles.integrity}>
        <strong>Editorial integrity</strong>
        <p>All original and appended reporting remains retrievable in full. This interface does not modify the database, remove corrections, assert common causality or substitute unverified forecasts for evidence.</p>
      </div>
    </div>
  );
}
