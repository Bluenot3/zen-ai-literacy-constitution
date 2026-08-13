export const MANAGED_ZEN_COMPONENT_KEYS = [
  "arsenal_screenshot_stage",
  "verified_workflow_demonstrator",
  "before_connected_automated",
  "arsenal_capability_exploder",
  "public_program_discovery",
  "institutional_proof_record",
  "power_cell_experimental",
] as const;

export type ManagedZenComponentKey = typeof MANAGED_ZEN_COMPONENT_KEYS[number];

export type ManagedZenComponentProps = {
  eyebrow: string;
  title: string;
  body: string;
  items: string[];
  mediaId: string;
  mediaUrl: string;
  mediaAlt: string;
  claimKey: string;
  ctaLabel: string;
  ctaHref: string;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

export function isManagedZenComponentKey(value: unknown): value is ManagedZenComponentKey {
  return typeof value === "string" && MANAGED_ZEN_COMPONENT_KEYS.includes(value as ManagedZenComponentKey);
}

export function normalizeManagedZenComponentProps(value: unknown): ManagedZenComponentProps {
  const source = isRecord(value) ? value : {};
  return {
    eyebrow: text(source.eyebrow, 80),
    title: text(source.title, 140),
    body: text(source.body, 480),
    items: Array.isArray(source.items) ? source.items.map((item) => text(item, 160)).filter(Boolean).slice(0, 8) : [],
    mediaId: typeof source.media_id === "string" && UUID_PATTERN.test(source.media_id) ? source.media_id : "",
    mediaUrl: safeHttps(source.media_url),
    mediaAlt: text(source.media_alt, 180),
    claimKey: typeof source.claim_key === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(source.claim_key) ? source.claim_key : "",
    ctaLabel: text(source.cta_label, 60),
    ctaHref: safeCta(source.cta_href),
  };
}

function text(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, limit) : "";
}

function safeHttps(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return "";
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" && !url.username && !url.password ? url.toString() : "";
  } catch {
    return "";
  }
}

function safeCta(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return "";
  const candidate = value.trim();
  if (candidate.startsWith("/") && !candidate.startsWith("//")) return candidate.slice(0, 500);
  return safeHttps(candidate).slice(0, 500);
}
