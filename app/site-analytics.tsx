"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const GA_MEASUREMENT_ID = "G-F85YFS8ZPK";
const GA_SCRIPT_ID = "zen-ga4-runtime";

type ZenAnalyticsEvent =
  | "page_view"
  | "cta_click"
  | "navigation_click"
  | "outbound_click"
  | "announcement_impression"
  | "announcement_click"
  | "announcement_dismissed"
  | "zen_weekly_archive_view"
  | "zen_weekly_issue_open"
  | "zen_weekly_art_open"
  | "zen_weekly_share";

type Gtag = (
  command: "config" | "consent" | "event" | "js",
  target: string | Date,
  parameters?: Record<string, unknown>,
) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
    __zenGaConfigured?: boolean;
  }
}

const safeValue = (value: unknown, maximum = 120) =>
  typeof value === "string"
    ? value.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, maximum)
    : "";

const safePath = (value: unknown) => {
  const path = safeValue(value, 240);
  return path.startsWith("/") ? path.split(/[?#]/, 1)[0] || "/" : "/";
};

function browserPrivacySignalIsActive() {
  if (typeof window === "undefined") return true;
  const privacyAwareNavigator = navigator as Navigator & {
    globalPrivacyControl?: boolean;
  };
  return (
    navigator.doNotTrack === "1" ||
    navigator.doNotTrack === "yes" ||
    privacyAwareNavigator.globalPrivacyControl === true
  );
}

function initializeZenAnalytics() {
  if (typeof window === "undefined" || browserPrivacySignalIsActive()) return false;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag =
    window.gtag ??
    ((...args: Parameters<Gtag>) => {
      window.dataLayer?.push(args);
    });

  if (!window.__zenGaConfigured) {
    window.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, {
      send_page_view: false,
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    window.__zenGaConfigured = true;
  }

  if (!document.getElementById(GA_SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = GA_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }

  return true;
}

export function trackZenSiteEvent(
  eventName: ZenAnalyticsEvent,
  parameters: Record<string, unknown> = {},
) {
  if (typeof window === "undefined" || !initializeZenAnalytics()) return;

  const safeParameters = Object.fromEntries(
    Object.entries(parameters)
      .filter(([, value]) =>
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean",
      )
      .map(([key, value]) => [
        safeValue(key, 40),
        typeof value === "string" ? safeValue(value, 240) : value,
      ])
      .filter(([key]) => Boolean(key)),
  );

  window.gtag?.("event", eventName, {
    site_key: "zen_world",
    ...safeParameters,
  });
}

export function ZenSiteAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    initializeZenAnalytics();
    const pagePath = safePath(pathname || window.location.pathname);
    trackZenSiteEvent("page_view", {
      page_path: pagePath,
      page_location: `${window.location.origin}${pagePath}`,
      page_title: safeValue(document.title, 180),
    });
  }, [pathname]);

  useEffect(() => {
    const handleTrackedClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.dataset.zenTrackIgnore === "true") return;

      let destination: URL;
      try {
        destination = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      if (destination.protocol !== "http:" && destination.protocol !== "https:") {
        return;
      }

      const isOutbound = destination.origin !== window.location.origin;
      const explicitEvent = safeValue(anchor.dataset.zenEvent, 40);
      const eventName: ZenAnalyticsEvent =
        explicitEvent === "announcement_click"
          ? "announcement_click"
          : isOutbound
            ? "outbound_click"
            : anchor.dataset.zenCta === "true" ||
                /(?:^|\s)(?:primary-button|secondary-button|[^\s]*cta[^\s]*)(?:\s|$)/i.test(
                  anchor.className,
                )
              ? "cta_click"
              : "navigation_click";

      trackZenSiteEvent(eventName, {
        page_path: safePath(window.location.pathname),
        destination_path: isOutbound ? "" : safePath(destination.pathname),
        destination_host: isOutbound ? safeValue(destination.hostname, 120) : "",
        cta_key: safeValue(anchor.dataset.zenAnalyticsLabel, 100),
        announcement_id: safeValue(anchor.dataset.zenAnnouncementId, 36),
      });
    };

    document.addEventListener("click", handleTrackedClick, { capture: true });
    return () => document.removeEventListener("click", handleTrackedClick, true);
  }, []);

  return null;
}
