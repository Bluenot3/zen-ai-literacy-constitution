"use client";

import { useEffect, useState } from "react";
import { trackZenSiteEvent } from "../site-analytics";

import styles from "./zen-weekly.module.css";

type ArticleToolsProps = {
  canonicalUrl: string;
  issueId: string;
  title: string;
};

export function ArticleTools({ canonicalUrl, issueId, title }: ArticleToolsProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    trackZenSiteEvent("zen_weekly_issue_open", { issue_id: issueId });

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const maximum = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(maximum > 0 ? Math.min(100, Math.max(0, (window.scrollY / maximum) * 100)) : 100);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [issueId]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(canonicalUrl);
      setStatus("Canonical link copied");
    } catch {
      trackZenSiteEvent("zen_weekly_share", { issue_id: issueId, share_kind: "copy" });
      setStatus("Copy unavailable in this browser");
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: canonicalUrl });
        setStatus("Share sheet opened");
        return;
        trackZenSiteEvent("zen_weekly_share", { issue_id: issueId, share_kind: "web_share" });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    await copy();
  };

  return (
    <div className={styles.articleTools}>
      <div className={styles.toolButtons}>
        <button type="button" onClick={share} aria-label={`Share ${title}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 12.8 15.8 8m-7.3 3.2 7.3 4.4M18 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM6 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM18 19.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" /></svg>
          Share
        </button>
        <button type="button" onClick={copy}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 8.5h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Zm-4 7H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" /></svg>
          Copy link
        </button>
      </div>
      <div className={styles.progressRail} aria-label={`Reading progress ${Math.round(progress)} percent`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
        <span style={{ width: `${progress}%` }} />
      </div>
      <span className={styles.srOnly} aria-live="polite">{status}</span>
    </div>
  );
}
