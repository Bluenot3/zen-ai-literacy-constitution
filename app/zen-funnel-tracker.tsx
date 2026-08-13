"use client";

import { useEffect } from "react";

const SESSION_KEY = "zen_gateway_session";

function sessionId() {
  const existing = window.sessionStorage.getItem(SESSION_KEY);
  if (existing && /^[0-9a-f-]{36}$/i.test(existing)) return existing;
  const created = crypto.randomUUID();
  window.sessionStorage.setItem(SESSION_KEY, created);
  return created;
}

function campaignContext() {
  const parameters = new URLSearchParams(window.location.search);
  return {
    utm_source: parameters.get("utm_source"),
    utm_medium: parameters.get("utm_medium"),
    utm_campaign: parameters.get("utm_campaign"),
    utm_content: parameters.get("utm_content"),
  };
}

function recordEvent(payload: Record<string, string | null>) {
  const body = JSON.stringify({
    ...payload,
    session_id: sessionId(),
    source_page: window.location.pathname,
    referrer_host: document.referrer
      ? (() => {
          try { return new URL(document.referrer).hostname; } catch { return null; }
        })()
      : null,
    ...campaignContext(),
  });
  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      "/api/zen-funnel",
      new Blob([body], { type: "application/json" }),
    );
    return;
  }
  void fetch("/api/zen-funnel", {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
    keepalive: true,
  });
}

function decorateArsenalDestination(anchor: HTMLAnchorElement, session: string) {
  try {
    const url = new URL(anchor.href, window.location.origin);
    if (url.hostname !== "arsenal.world") return;
    const next = url.searchParams.get("next");
    if (next) {
      const nextUrl = new URL(next, "https://arsenal.world");
      nextUrl.searchParams.set("zen_session", session);
      url.searchParams.set("next", `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
    } else {
      url.searchParams.set("zen_session", session);
    }
    anchor.href = url.toString();
  } catch {
    // Invalid destinations are left untouched; the controlled registry never emits them.
  }
}

export function ZenFunnelTracker() {
  useEffect(() => {
    const currentSession = sessionId();
    document
      .querySelectorAll<HTMLAnchorElement>("a[data-zen-destination-key]")
      .forEach((anchor) => decorateArsenalDestination(anchor, currentSession));

    recordEvent({ event_type: "page_view" });
    const click = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>(
        "a[data-zen-destination-key]",
      );
      if (!anchor) return;
      const destination = anchor.dataset.zenDestinationKey ?? null;
      const cta = anchor.dataset.zenCta ?? null;
      let destinationPath: string | null = null;
      try { destinationPath = new URL(anchor.href, window.location.origin).pathname; } catch { /* no-op */ }
      recordEvent({
        event_type: anchor.hostname === "arsenal.world" ? "destination_handoff" : "cta_click",
        destination_key: destination,
        destination_path: destinationPath,
        cta_id: cta,
        campaign_slug: anchor.dataset.zenCampaign ?? null,
      });
    };
    document.addEventListener("click", click, { capture: true });
    return () => document.removeEventListener("click", click, { capture: true });
  }, []);
  return null;
}
