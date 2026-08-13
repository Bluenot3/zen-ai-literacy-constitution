import "server-only";

import {
  normalizeManagedZenNavigation,
  normalizeManagedZenPage,
  type ManagedZenNavigationItem,
  type ManagedZenPage,
} from "./managed-pages";

type RuntimeEnvironment = {
  SUPABASE_URL?: string;
  SUPABASE_PUBLISHABLE_KEY?: string;
};

const ZEN_SITE_KEY = "zen_world";

const runtimeConfig = () => {
  const runtime =
    (
      globalThis as typeof globalThis & {
        __ZEN_RUNTIME_ENV__?: RuntimeEnvironment;
      }
    ).__ZEN_RUNTIME_ENV__ ?? {};

  return {
    url: String(runtime.SUPABASE_URL ?? "").replace(/\/+$/, ""),
    publishableKey: String(runtime.SUPABASE_PUBLISHABLE_KEY ?? ""),
  };
};

const responseRows = (value: unknown): unknown[] => {
  if (Array.isArray(value)) return value;
  return value && typeof value === "object" ? [value] : [];
};

export async function readPublicRpc(
  functionName: string,
  payload: Record<string, unknown>,
) {
  const { url, publishableKey } = runtimeConfig();
  if (!url || !publishableKey) return [];

  try {
    const response = await fetch(`${url}/rest/v1/rpc/${functionName}`, {
      method: "POST",
      headers: {
        apikey: publishableKey,
        Authorization: `Bearer ${publishableKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });

    if (!response.ok) {
      console.error(
        `ZEN managed-page request ${functionName} failed with status ${response.status}.`,
      );
      return [];
    }

    return responseRows(await response.json());
  } catch (error) {
    console.error(`ZEN managed-page request ${functionName} failed.`, error);
    return [];
  }
}

export async function listManagedZenNavigation(): Promise<
  ManagedZenNavigationItem[]
> {
  const rows = await readPublicRpc(
    "list_visible_admin_site_pages_for_nav",
    { requested_site_key: ZEN_SITE_KEY },
  );

  return rows
    .map(normalizeManagedZenNavigation)
    .filter((item): item is ManagedZenNavigationItem => Boolean(item))
    .sort(
      (left, right) =>
        left.sortOrder - right.sortOrder || left.title.localeCompare(right.title),
    );
}

export async function getManagedZenPage(
  requestedSlug: string,
): Promise<ManagedZenPage | null> {
  const slug = requestedSlug.trim().toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;

  const rows = await readPublicRpc(
    "get_visible_admin_site_page",
    {
      requested_site_key: ZEN_SITE_KEY,
      requested_slug: slug,
    },
  );

  return normalizeManagedZenPage(rows[0]);
}

export async function getManagedZenHome(): Promise<ManagedZenPage | null> {
  const rows = await readPublicRpc(
    "get_visible_admin_site_home",
    { requested_site_key: ZEN_SITE_KEY },
  );

  return normalizeManagedZenPage(rows[0]);
}
