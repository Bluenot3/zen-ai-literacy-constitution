/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { buildArsenalLoginUrl } from "../lib/program-access-links";

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
    const FORMER_WIX_EXACT_REDIRECTS: Record<string, string> = {
      "/favicon.ico": "/favicon.svg",
      "/legacydossier": "/legacy-dossier",
      "/geo2": "/work?category=accomplishments",
      "/ai-literacy-foundation-zen-ai-co-official-source":
        "/work?category=initiatives",
      "/arsenal": "https://arsenal.world",
      "/solutions": "/#solutions",
      "/groups": "https://arsenal.world/community",
      "/pricing": buildArsenalLoginUrl(
        "/pricing",
        "migration",
        "wix_migration",
      ),
      "/category/all-products": buildArsenalLoginUrl(
        "/marketplace",
        "migration",
        "wix_migration",
      ),
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
