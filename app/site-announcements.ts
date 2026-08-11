import { containsRetiredZenSurface } from "./retired-surface-policy";
import {
  ARSENAL_DASHBOARD_LOGIN,
  isDirectSupabaseOAuthUrl,
} from "./arsenal-links";

export type ZenAnnouncementPriority = "low" | "normal" | "high" | "urgent";

export type ZenSiteAnnouncement = {
  id: string;
  title: string;
  body: string;
  priority: ZenAnnouncementPriority;
  background: string;
  textColor: string;
  ctaLabel: string;
  ctaAction: string;
  isDismissible: boolean;
  startsAt: string;
  endsAt: string | null;
  updatedAt: string;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const stringValue = (value: unknown, maximum: number) =>
  typeof value === "string" ? value.trim().slice(0, maximum) : "";

const dateValue = (value: unknown) => {
  if (typeof value !== "string") return "";
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : "";
};

const colorValue = (value: unknown, fallback: string) => {
  const color = stringValue(value, 7);
  return /^#[0-9a-f]{6}$/i.test(color) ? color : fallback;
};

const ctaActionValue = (value: unknown) => {
  const action = stringValue(value, 500);
  if (!action) return "";
  if (action.startsWith("/") && !action.startsWith("//")) return action;

  try {
    const url = new URL(action);
    if (isDirectSupabaseOAuthUrl(url.toString())) {
      return ARSENAL_DASHBOARD_LOGIN;
    }
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString().slice(0, 500)
      : "";
  } catch {
    return "";
  }
};

const priorityValue = (value: unknown): ZenAnnouncementPriority => {
  if (value === "low" || value === "high" || value === "urgent") return value;
  return "normal";
};

export function normalizeZenSiteAnnouncement(
  value: unknown,
): ZenSiteAnnouncement | null {
  if (!isRecord(value) || containsRetiredZenSurface(value)) return null;

  const id = stringValue(value.id, 36);
  const title = stringValue(value.title, 140);
  const body = stringValue(value.body, 320);
  const startsAt = dateValue(value.starts_at);
  const updatedAt = dateValue(value.updated_at) || startsAt;
  const style = isRecord(value.style) ? value.style : {};
  const ctaLabel = stringValue(style.cta_label, 80);
  const ctaAction = ctaActionValue(style.cta_action);

  if (
    !UUID_PATTERN.test(id) ||
    !title ||
    !body ||
    !startsAt ||
    value.type !== "banner"
  ) {
    return null;
  }

  return {
    id,
    title,
    body,
    priority: priorityValue(value.priority),
    background: colorValue(style.bg, "#071b28"),
    textColor: colorValue(style.text, "#f4fbf8"),
    ctaLabel: ctaLabel && ctaAction ? ctaLabel : "",
    ctaAction: ctaLabel && ctaAction ? ctaAction : "",
    isDismissible: value.is_dismissible !== false,
    startsAt,
    endsAt: dateValue(value.ends_at) || null,
    updatedAt,
  };
}
