import "server-only";

import type { ManagedZenPage } from "./managed-pages";
import type { ZenHomepageControl } from "./site-control";
import {
  EMPTY_MANAGED_ZEN_RESOURCES,
  type ManagedZenComponentResources,
  type ManagedZenPublicClaim,
  type ManagedZenPublicMedia,
} from "./managed-component-renderer";
import { readPublicRpc } from "./managed-pages.server";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const text = (value: unknown, limit: number) => typeof value === "string" ? value.trim().slice(0, limit) : "";

export async function getManagedZenResources(page: ManagedZenPage | null): Promise<ManagedZenComponentResources> {
  if (!page) return EMPTY_MANAGED_ZEN_RESOURCES;
  const mediaIds = Array.from(new Set(page.blocks.map((block) => block.componentProps?.mediaId).filter((value): value is string => Boolean(value))));
  const claimKeys = Array.from(new Set(page.blocks.map((block) => block.componentProps?.claimKey).filter((value): value is string => Boolean(value))));
  if (!mediaIds.length && !claimKeys.length) return EMPTY_MANAGED_ZEN_RESOURCES;

  const [mediaRows, claimRows] = await Promise.all([
    mediaIds.length ? readPublicRpc("list_visible_zen_public_media", { requested_media_ids: mediaIds }) : [],
    claimKeys.length ? readPublicRpc("list_visible_zen_proof_claims", { requested_claim_keys: claimKeys }) : [],
  ]);
  const media = mediaRows.map(normalizeMedia).filter((value): value is ManagedZenPublicMedia => Boolean(value));
  const claims = claimRows.map(normalizeClaim).filter((value): value is ManagedZenPublicClaim => Boolean(value));
  return {
    mediaById: Object.fromEntries(media.map((record) => [record.id, record])),
    claimsByKey: Object.fromEntries(claims.map((record) => [record.claimKey, record])),
  };
}

export async function getZenHomepageResources(
  homepage: ZenHomepageControl,
): Promise<ManagedZenComponentResources> {
  const mediaIds = homepage.featuredMediaId ? [homepage.featuredMediaId] : [];
  const claimIds = homepage.proofClaimIds;
  if (!mediaIds.length && !claimIds.length) return EMPTY_MANAGED_ZEN_RESOURCES;

  const [mediaRows, claimRows] = await Promise.all([
    mediaIds.length
      ? readPublicRpc("list_visible_zen_public_media", { requested_media_ids: mediaIds })
      : [],
    claimIds.length
      ? readPublicRpc("list_visible_zen_proof_claims_by_id", { requested_claim_ids: claimIds })
      : [],
  ]);
  const media = mediaRows.map(normalizeMedia).filter((value): value is ManagedZenPublicMedia => Boolean(value));
  const claims = claimRows.map(normalizeClaim).filter((value): value is ManagedZenPublicClaim => Boolean(value));
  return {
    mediaById: Object.fromEntries(media.map((record) => [record.id, record])),
    claimsByKey: Object.fromEntries(claims.map((record) => [record.claimKey, record])),
  };
}

function normalizeMedia(value: unknown): ManagedZenPublicMedia | null {
  if (!isRecord(value)) return null;
  const id = text(value.id, 40);
  const publicUrl = safeHttps(value.public_url);
  const altText = text(value.alt_text, 300);
  if (!UUID_PATTERN.test(id) || !publicUrl || !altText) return null;
  return { id, publicUrl, altText, title: text(value.title, 160) };
}

function normalizeClaim(value: unknown): ManagedZenPublicClaim | null {
  if (!isRecord(value)) return null;
  const claimKey = text(value.claim_key, 80);
  const wording = text(value.approved_wording, 1200);
  if (!/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/.test(claimKey) || !wording) return null;
  return {
    claimKey,
    wording,
    status: text(value.claim_status, 80).replaceAll("_", " "),
    source: safeHttps(value.evidence_url) || "Evidence retained by ZEN AI Co.",
    validUntil: text(value.valid_until, 20),
  };
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
