"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { trackZenSiteEvent } from "./site-analytics";
import type { ZenSiteAnnouncement } from "./site-announcements";

const dismissalKey = (announcement: ZenSiteAnnouncement) =>
  `zen:announcement-dismissed:${announcement.id}:${announcement.updatedAt}`;

const isDismissed = (announcement: ZenSiteAnnouncement) => {
  try {
    return window.localStorage.getItem(dismissalKey(announcement)) === "true";
  } catch {
    return false;
  }
};

export function ZenSiteAnnouncementBanner({
  announcements,
}: {
  announcements: ZenSiteAnnouncement[];
}) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(() => new Set());
  const bannerRef = useRef<HTMLElement>(null);
  const measuredAnnouncementId = useRef("");
  const impressedIds = useRef(new Set<string>());

  useEffect(() => {
    const hydrationCheck = window.setTimeout(() => {
      setDismissedIds(
        new Set(
          announcements
            .filter((announcement) => isDismissed(announcement))
            .map((announcement) => announcement.id),
        ),
      );
    }, 0);

    return () => window.clearTimeout(hydrationCheck);
  }, [announcements]);

  const activeAnnouncement = useMemo(
    () => announcements.find((announcement) => !dismissedIds.has(announcement.id)),
    [announcements, dismissedIds],
  );

  useEffect(() => {
    const element = bannerRef.current;
    if (!element || !activeAnnouncement) return;

    const updateOffset = () => {
      document.documentElement.style.setProperty(
        "--zen-announcement-offset",
        `${Math.ceil(element.getBoundingClientRect().height)}px`,
      );
    };

    updateOffset();
    const observer = new ResizeObserver(updateOffset);
    observer.observe(element);
    measuredAnnouncementId.current = activeAnnouncement.id;

    return () => {
      observer.disconnect();
      if (measuredAnnouncementId.current === activeAnnouncement.id) {
        document.documentElement.style.removeProperty("--zen-announcement-offset");
      }
    };
  }, [activeAnnouncement]);

  useEffect(() => {
    if (!activeAnnouncement || impressedIds.current.has(activeAnnouncement.id)) return;
    impressedIds.current.add(activeAnnouncement.id);
    trackZenSiteEvent("announcement_impression", {
      announcement_id: activeAnnouncement.id,
      announcement_priority: activeAnnouncement.priority,
      page_path: window.location.pathname,
    });
  }, [activeAnnouncement]);

  if (!activeAnnouncement) return null;

  const dismiss = () => {
    trackZenSiteEvent("announcement_dismissed", {
      announcement_id: activeAnnouncement.id,
      announcement_priority: activeAnnouncement.priority,
      page_path: window.location.pathname,
    });

    try {
      window.localStorage.setItem(dismissalKey(activeAnnouncement), "true");
    } catch {
      // The dismissal still applies for this page when storage is unavailable.
    }

    setDismissedIds((current) => {
      const next = new Set(current);
      next.add(activeAnnouncement.id);
      return next;
    });
  };

  const bannerStyle = {
    "--zen-announcement-bg": activeAnnouncement.background,
    "--zen-announcement-text": activeAnnouncement.textColor,
  } as CSSProperties;

  return (
    <aside
      ref={bannerRef}
      className="zen-site-announcement"
      data-priority={activeAnnouncement.priority}
      data-zen-announcement-id={activeAnnouncement.id}
      style={bannerStyle}
      aria-label="ZEN AI Co. announcement"
    >
      <span className="zen-site-announcement__seal" aria-hidden="true">
        <Image
          src="/zen-mark.png"
          alt=""
          width={42}
          height={42}
          unoptimized
        />
      </span>
      <div className="zen-site-announcement__copy">
        <span>ZEN AI Co. &middot; Official release</span>
        <strong>{activeAnnouncement.title}</strong>
        <p>{activeAnnouncement.body}</p>
      </div>
      {activeAnnouncement.ctaLabel && activeAnnouncement.ctaAction ? (
        <a
          className="zen-site-announcement__cta"
          href={activeAnnouncement.ctaAction}
          data-zen-event="announcement_click"
          data-zen-announcement-id={activeAnnouncement.id}
          data-zen-analytics-label="announcement-cta"
        >
          {activeAnnouncement.ctaLabel}
          <span aria-hidden="true">&rarr;</span>
        </a>
      ) : null}
      {activeAnnouncement.isDismissible ? (
        <button
          className="zen-site-announcement__dismiss"
          type="button"
          onClick={dismiss}
          aria-label={`Dismiss ${activeAnnouncement.title}`}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      ) : null}
      <span className="zen-site-announcement__thread" aria-hidden="true" />
    </aside>
  );
}
