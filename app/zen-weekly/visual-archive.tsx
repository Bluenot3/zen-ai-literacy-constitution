"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { trackZenSiteEvent } from "../site-analytics";
import type { ZenPublicationVisual } from "./publication";
import styles from "./zen-weekly.module.css";

type VisualFilter = "all" | "cover" | "infographic" | "artwork";

function visualLabel(visual: ZenPublicationVisual) {
  if (visual.role === "cover") return "Cover";
  if (visual.role === "infographic") return "Infographic";
  return "Issue artwork";
}

function issueLabel(visual: ZenPublicationVisual) {
  return visual.editionNumber ? `Issue ${visual.editionNumber}` : "ZEN Weekly";
}

export function ZenWeeklyVisualArchive({ items }: { items: ZenPublicationVisual[] }) {
  const [filter, setFilter] = useState<VisualFilter>("all");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [status, setStatus] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const previousOverflow = useRef("");

  useEffect(() => {
    trackZenSiteEvent("zen_weekly_archive_view", {
      visual_count: items.length,
    });
  }, [items.length]);

  const filteredItems = useMemo(
    () => filter === "all" ? items : items.filter((item) => item.role === filter),
    [filter, items],
  );
  const activeItem = selectedIndex === null ? null : filteredItems[selectedIndex] ?? null;

  const openAt = useCallback((index: number) => {
    const item = filteredItems[index];
    const dialog = dialogRef.current;
    if (!item || !dialog || dialog.open) return;
    setSelectedIndex(index);
    setZoom(1);
    setStatus("");
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    history.replaceState(null, "", `${location.pathname}${location.search}#art-${item.id}`);
    trackZenSiteEvent("zen_weekly_art_open", {
      issue_id: item.issueId,
      artwork_role: item.role,
    });
  }, [filteredItems]);

  useEffect(() => {
    const id = decodeURIComponent(location.hash.replace(/^#art-/, ""));
    if (!id) return;
    const index = filteredItems.findIndex((item) => item.id === id);
    if (index < 0) return;
    const frame = requestAnimationFrame(() => openAt(index));
    return () => cancelAnimationFrame(frame);
  }, [filteredItems, openAt]);

  useEffect(() => () => {
    document.body.style.overflow = previousOverflow.current;
  }, []);

  function closeViewer() {
    dialogRef.current?.close();
  }

  function handleClose() {
    document.body.style.overflow = previousOverflow.current;
    history.replaceState(null, "", `${location.pathname}${location.search}`);
    if (selectedIndex !== null) triggerRefs.current[selectedIndex]?.focus();
    setZoom(1);
  }

  function step(direction: -1 | 1) {
    if (selectedIndex === null || !filteredItems.length) return;
    const nextIndex = (selectedIndex + direction + filteredItems.length) % filteredItems.length;
    setSelectedIndex(nextIndex);
    setZoom(1);
    setStatus("");
    const item = filteredItems[nextIndex];
    history.replaceState(null, "", `${location.pathname}${location.search}#art-${item.id}`);
  }

  async function copyArtworkLink() {
    if (!activeItem) return;
    const link = `${location.origin}${location.pathname}${location.search}#art-${activeItem.id}`;
    try {
      await navigator.clipboard.writeText(link);
      setStatus("Artwork link copied");
      trackZenSiteEvent("zen_weekly_share", {
        issue_id: activeItem.issueId,
        share_kind: "artwork_copy",
      });
    } catch {
      setStatus("Copy unavailable in this browser");
    }
  }

  return (
    <div className={styles.visualArchiveExperience}>
      <div className={styles.visualFilters} aria-label="Filter visual archive">
        {([
          ["all", "All visuals"],
          ["cover", "Covers"],
          ["infographic", "Infographics"],
          ["artwork", "Issue artwork"],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() => {
              setFilter(value);
              setSelectedIndex(null);
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {filteredItems.length ? (
        <div className={styles.visualLedger}>
          {filteredItems.map((visual, index) => (
            <figure className={styles.visualSpecimen} key={`${filter}-${visual.id}`}>
              <button
                ref={(node) => { triggerRefs.current[index] = node; }}
                type="button"
                onClick={() => openAt(index)}
                aria-label={`Open ${visualLabel(visual)} from ${issueLabel(visual)}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={visual.url} alt={visual.alt} loading="lazy" decoding="async" />
              </button>
              <figcaption>
                <span>{visualLabel(visual)} · {issueLabel(visual)}</span>
                <Link href={visual.issuePath}>Read issue</Link>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <p className={styles.emptyIssue}>No real canonical media matches this filter.</p>
      )}

      <dialog
        ref={dialogRef}
        className={`${styles.lightbox} ${styles.visualArchiveDialog}`}
        aria-label={activeItem ? `${visualLabel(activeItem)} from ${issueLabel(activeItem)}` : "ZEN Weekly artwork viewer"}
        onClose={handleClose}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") step(-1);
          if (event.key === "ArrowRight") step(1);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeViewer();
        }}
      >
        {activeItem ? (
          <div className={styles.visualViewerFrame}>
            <header className={styles.visualViewerHeader}>
              <div>
                <span>{visualLabel(activeItem)} · {issueLabel(activeItem)}</span>
                <strong>{activeItem.caption || activeItem.issueTitle}</strong>
              </div>
              <div className={styles.visualViewerActions}>
                <button type="button" onClick={() => setZoom((value) => Math.max(1, value - 0.5))} disabled={zoom <= 1} aria-label="Zoom out">−</button>
                <output aria-live="polite">{Math.round(zoom * 100)}%</output>
                <button type="button" onClick={() => setZoom((value) => Math.min(3.5, value + 0.5))} disabled={zoom >= 3.5} aria-label="Zoom in">+</button>
                <button type="button" onClick={copyArtworkLink}>Copy link</button>
                <button type="button" onClick={closeViewer} aria-label="Close artwork viewer">Close</button>
              </div>
            </header>
            <div className={styles.visualViewerStage} tabIndex={0} aria-label="Zoomable artwork area">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeItem.url}
                alt={activeItem.alt}
                style={{ width: `${zoom * 100}%` }}
              />
            </div>
            <footer className={styles.visualViewerFooter}>
              <button type="button" onClick={() => step(-1)} aria-label="Previous artwork">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 4-8 8 8 8" /></svg>
                Previous
              </button>
              <div>
                {activeItem.credit ? <span>Credit · {activeItem.credit}</span> : null}
                {activeItem.provenanceUrl ? (
                  <a href={activeItem.provenanceUrl} target="_blank" rel="noopener noreferrer">Provenance record ↗</a>
                ) : null}
                {activeItem.chain || activeItem.contract || activeItem.tokenId ? (
                  <small>{[activeItem.chain, activeItem.contract, activeItem.tokenId].filter(Boolean).join(" · ")}</small>
                ) : null}
                <Link href={activeItem.issuePath}>Read issue</Link>
              </div>
              <button type="button" onClick={() => step(1)} aria-label="Next artwork">
                Next
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 4 8 8-8 8" /></svg>
              </button>
            </footer>
            <span className={styles.srOnly} aria-live="polite">{status}</span>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
