/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { buildArsenalLoginUrl, buildZenDestinationUrl } from "../lib/program-access-links";

interface WorkerBindings {
  ASSETS: Fetcher;
  DB?: D1Database;
  SUPABASE_URL?: string;
  SUPABASE_PUBLISHABLE_KEY?: string;
  IMAGES: ImagesBinding;
}

type ImageOutputFormat =
  | "image/jpeg"
  | "image/png"
  | "image/gif"
  | "image/webp"
  | "image/avif"
  | "rgb"
  | "rgba";

const normalizeImageOutputFormat = (format: string): ImageOutputFormat => {
  switch (format) {
    case "image/jpeg":
    case "image/png":
    case "image/gif":
    case "image/webp":
    case "image/avif":
    case "rgb":
    case "rgba":
      return format;
    default:
      return "image/webp";
  }
};

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self' mailto:",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.clarity.ms https://*.clarity.ms",
  "connect-src 'self' https://*.supabase.co https://arsenal.world https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://c.bing.com",
  "frame-src https:",
  "media-src 'self' data: blob: https:",
  "upgrade-insecure-requests",
].join("; ");

const withSecurityHeaders = (response: Response, requestUrl: URL) => {
  const headers = new Headers(response.headers);
  headers.set("Content-Security-Policy", CONTENT_SECURITY_POLICY);
  headers.set(
    "Permissions-Policy",
    "camera=(self), microphone=(self), geolocation=(), payment=(self)",
  );
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  if (requestUrl.pathname === "/release.json") {
    headers.set("Access-Control-Allow-Origin", "https://arsenal.world");
    headers.set("Cache-Control", "no-store");
    headers.append("Vary", "Origin");
  }
  if (requestUrl.protocol === "https:") {
    headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

const ZEN_FUNNEL_EVENTS = new Set([
  "page_view",
  "cta_click",
  "destination_handoff",
  "lead_submitted",
]);

const boundedText = (value: unknown, maximum: number) =>
  typeof value === "string" && value.length <= maximum ? value : null;

async function recordZenFunnelEvent(
  request: Request,
  env: WorkerBindings,
  requestUrl: URL,
) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });
  }
  const origin = request.headers.get("origin");
  if (origin && origin !== requestUrl.origin) return new Response("Forbidden", { status: 403 });
  if (Number(request.headers.get("content-length") ?? 0) > 4_096) {
    return new Response("Payload too large", { status: 413 });
  }
  if (!env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY) {
    return new Response("Telemetry unavailable", { status: 503 });
  }

  let input: Record<string, unknown>;
  try {
    input = await request.json<Record<string, unknown>>();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  const eventType = boundedText(input.event_type, 40);
  const sessionId = boundedText(input.session_id, 36);
  const sourcePage = boundedText(input.source_page, 300);
  if (!eventType || !ZEN_FUNNEL_EVENTS.has(eventType) ||
      !sessionId || !/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(sessionId) ||
      !sourcePage || !sourcePage.startsWith("/")) {
    return new Response("Invalid event", { status: 400 });
  }

  const upstream = await fetch(
    `${env.SUPABASE_URL.replace(/\/+$/, "")}/rest/v1/rpc/record_zen_funnel_event`,
    {
      method: "POST",
      headers: {
        apikey: env.SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_PUBLISHABLE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requested_event_type: eventType,
        requested_session_id: sessionId,
        requested_source_page: sourcePage,
        requested_cta_id: boundedText(input.cta_id, 120),
        requested_campaign_slug: boundedText(input.campaign_slug, 120),
        requested_destination_key: boundedText(input.destination_key, 80),
        requested_destination_path: boundedText(input.destination_path, 500),
        requested_utm_source: boundedText(input.utm_source, 120),
        requested_utm_medium: boundedText(input.utm_medium, 120),
        requested_utm_campaign: boundedText(input.utm_campaign, 120),
        requested_utm_content: boundedText(input.utm_content, 120),
        requested_referrer_host: boundedText(input.referrer_host, 255),
      }),
    },
  );
  return new Response(null, {
    status: upstream.ok ? 202 : upstream.status >= 500 ? 503 : 400,
    headers: { "Cache-Control": "no-store" },
  });
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(
    request: Request,
    env: WorkerBindings,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);
    if (url.hostname === "zenai.world") {
      const canonical = new URL(url);
      canonical.hostname = "www.zenai.world";
      return withSecurityHeaders(Response.redirect(canonical, 308), url);
    }

    (
      globalThis as typeof globalThis & {
        __ZEN_RUNTIME_ENV__?: {
          SUPABASE_URL?: string;
          SUPABASE_PUBLISHABLE_KEY?: string;
        };
      }
    ).__ZEN_RUNTIME_ENV__ = {
      SUPABASE_URL: env.SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY: env.SUPABASE_PUBLISHABLE_KEY,
    };

    if (url.pathname === "/api/zen-funnel") {
      return withSecurityHeaders(await recordZenFunnelEvent(request, env, url), url);
    }

    const FORMER_WIX_EXACT_REDIRECTS: Record<string, string> = {
      "/favicon.ico": "/favicon.svg",
      "/legacydossier": "/legacy-dossier",
      "/geo2": "/work?category=accomplishments",
      "/ai-literacy-foundation-zen-ai-co-official-source":
        "/work?category=initiatives",
      "/arsenal": "https://arsenal.world",
      "/solutions": "/#solutions",
      "/groups": "https://arsenal.world/community",
      "/pricing": buildZenDestinationUrl("PRICING", {
        medium: "migration",
        campaign: "wix_migration",
      }),
      "/category/all-products": buildZenDestinationUrl("MARKETPLACE", {
        medium: "migration",
        campaign: "wix_migration",
      }),
      "/challenge-page/bb4918ca-0eea-4952-beea-53547a7bde92":
        "/programs#pioneer",
      "/challenge-page/58da3d0d-6fa1-4f41-8fc6-64dee1d9dc5e":
        "/programs#pioneer",
      "/programs/pioneer": "/programs#pioneer",
      "/programs/vanguard": "/programs#vanguard",
    };
    const wixCompatibilityPath = url.pathname.toLowerCase().replace(/\/$/, "") || "/";
    const compatibilityDestination = FORMER_WIX_EXACT_REDIRECTS[wixCompatibilityPath];
    const isFormerWixGroupPost =
      /^\/group\/[^/]+\/discussion\/[^/]+$/.test(wixCompatibilityPath);
    const isFormerWixGroupLanding =
      /^\/group\/[^/]+\/(?:discussion|about)$/.test(wixCompatibilityPath);

    if (isFormerWixGroupPost) {
      return withSecurityHeaders(
        new Response(
          "This former Wix community post has been retired and was not migrated.",
          {
            status: 410,
            headers: {
              "Cache-Control": "public, max-age=3600",
              "Content-Type": "text/plain; charset=utf-8",
            },
          },
        ),
        url,
      );
    }

    if (isFormerWixGroupLanding) {
      return withSecurityHeaders(
        Response.redirect(new URL("https://arsenal.world/community"), 308),
        url,
      );
    }

    if (compatibilityDestination) {
      return withSecurityHeaders(
        Response.redirect(new URL(compatibilityDestination, url.origin), 308),
        url,
      );
    }


    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      const response = await handleImageOptimization(
        request,
        {
          fetchAsset: (assetPath) =>
            env.ASSETS.fetch(new Request(new URL(assetPath, request.url))),
          transformImage: async (body, { width, format, quality }) => {
            const result = await env.IMAGES.input(body)
              .transform(width > 0 ? { width } : {})
              .output({ format: normalizeImageOutputFormat(format), quality });
            return result.response();
          },
        },
        allowedWidths,
      );
      return withSecurityHeaders(response, url);
    }

    return withSecurityHeaders(await handler.fetch(request, env, ctx), url);
  },
} satisfies ExportedHandler<WorkerBindings>;

export default worker;
