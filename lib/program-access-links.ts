export type NativeProgramId = "pioneer" | "vanguard";

export type ArsenalEntryPath =
  | "/agents/new"
  | "/business-spaces/new"
  | "/dashboard"
  | "/command"
  | "/ecosystem"
  | "/marketplace"
  | "/operator-os"
  | "/partners/apply"
  | "/pricing";

export const ZEN_DESTINATION_KEYS = [
  "ARSENAL_BUILD",
  "BUSINESS_TRANSFORM",
  "PROGRAMS",
  "PARTNER",
  "PRICING",
  "MARKETPLACE",
  "OPERATOR",
  "COMMAND_BY_TEXT",
] as const;

export type ZenDestinationKey = (typeof ZEN_DESTINATION_KEYS)[number];

export interface ZenDestinationDefinition {
  key: ZenDestinationKey;
  label: string;
  path: string;
  requiresAuth: boolean;
  host: "zen" | "arsenal";
}

export const ZEN_DESTINATIONS: Record<ZenDestinationKey, ZenDestinationDefinition> = {
  ARSENAL_BUILD: { key: "ARSENAL_BUILD", label: "Build with Arsenal", path: "/agents/new", requiresAuth: true, host: "arsenal" },
  BUSINESS_TRANSFORM: { key: "BUSINESS_TRANSFORM", label: "Transform a Business", path: "/business-spaces/new", requiresAuth: true, host: "arsenal" },
  PROGRAMS: { key: "PROGRAMS", label: "Join a Program", path: "/programs", requiresAuth: false, host: "zen" },
  PARTNER: { key: "PARTNER", label: "Partner with ZEN", path: "/partners/apply", requiresAuth: true, host: "arsenal" },
  PRICING: { key: "PRICING", label: "View Arsenal Pricing", path: "/pricing", requiresAuth: false, host: "arsenal" },
  MARKETPLACE: { key: "MARKETPLACE", label: "Explore Marketplace", path: "/marketplace", requiresAuth: false, host: "arsenal" },
  OPERATOR: { key: "OPERATOR", label: "Become an Operator", path: "/operator-os", requiresAuth: true, host: "arsenal" },
  COMMAND_BY_TEXT: { key: "COMMAND_BY_TEXT", label: "Command by Text", path: "/command", requiresAuth: true, host: "arsenal" },
};

export interface ZenDestinationContext {
  medium?: string;
  campaign?: string;
  cta?: string;
}

const DIRECT_PROGRAM_HOSTS: Readonly<Record<string, NativeProgramId>> = {
  "ai-pioneer-courses-20260725.zenagi.chatgpt.site": "pioneer",
  "us-ai-literacy.lovable.app": "vanguard",
};

const PROGRAM_CAMPAIGNS: Record<NativeProgramId, string> = {
  pioneer: "pioneer_launch",
  vanguard: "vanguard_launch",
};

const trackedArsenalPath = (
  nextPath: string,
  medium: string,
  campaign: string,
  cta?: string,
) => {
  const next = new URL(nextPath, "https://arsenal.world");
  next.searchParams.set("utm_source", "zenai.world");
  next.searchParams.set("utm_medium", medium);
  next.searchParams.set("utm_campaign", campaign);
  if (cta) next.searchParams.set("utm_content", cta);
  return `${next.pathname}${next.search}${next.hash}`;
};

export function buildArsenalLoginUrl(
  nextPath: ArsenalEntryPath,
  medium = "owned",
  campaign = "zen_account_activation",
) {
  const next = trackedArsenalPath(nextPath, medium, campaign);
  return `https://arsenal.world/login?next=${encodeURIComponent(next)}`;
}

export function buildZenDestinationUrl(
  key: ZenDestinationKey,
  context: ZenDestinationContext = {},
) {
  const destination = ZEN_DESTINATIONS[key];
  const medium = context.medium ?? "owned";
  const campaign = context.campaign ?? key.toLowerCase();
  if (destination.host === "zen") {
    const url = new URL(destination.path, "https://zenai.world");
    if (context.campaign) url.searchParams.set("utm_campaign", campaign);
    if (context.cta) url.searchParams.set("utm_content", context.cta);
    return `${url.pathname}${url.search}${url.hash}`;
  }
  const next = trackedArsenalPath(destination.path, medium, campaign, context.cta);
  if (destination.requiresAuth) {
    return `https://arsenal.world/login?next=${encodeURIComponent(next)}`;
  }
  return `https://arsenal.world${next}`;
}

export function isZenDestinationKey(value: unknown): value is ZenDestinationKey {
  return typeof value === "string" && (ZEN_DESTINATION_KEYS as readonly string[]).includes(value);
}

export function buildArsenalProgramLoginUrl(
  programId: NativeProgramId,
  medium = "owned",
  campaign = PROGRAM_CAMPAIGNS[programId],
) {
  const next = trackedArsenalPath(
    `/programs/${programId}`,
    medium,
    campaign,
  );
  return `https://arsenal.world/login?next=${encodeURIComponent(next)}`;
}

export const ARSENAL_GATEWAY_LINKS = {
  build: buildZenDestinationUrl("ARSENAL_BUILD", { campaign: "build_with_arsenal" }),
  business: buildZenDestinationUrl("BUSINESS_TRANSFORM", { campaign: "business_space_intake" }),
  partner: buildZenDestinationUrl("PARTNER", { campaign: "partner_with_zen" }),
} as const;

export const PROGRAM_LOGIN_LINKS = {
  pioneer: buildArsenalProgramLoginUrl("pioneer"),
  vanguard: buildArsenalProgramLoginUrl("vanguard"),
} as const;

export function directProgramIdForUrl(value: string): NativeProgramId | null {
  try {
    const normalized = value.startsWith("//") ? `https:${value}` : value;
    const url = new URL(normalized);
    if (!/^https?:$/.test(url.protocol) || url.username || url.password) {
      return null;
    }
    return DIRECT_PROGRAM_HOSTS[url.hostname.toLowerCase()] ?? null;
  } catch {
    return null;
  }
}

export function isDirectProgramContentUrl(value: string) {
  return directProgramIdForUrl(value) !== null;
}

export function gateZenPublicDestination(value: string) {
  const programId = directProgramIdForUrl(value);
  return programId ? PROGRAM_LOGIN_LINKS[programId] : value;
}

export function gateZenPublicHtml(html: string) {
  return html.replace(
    /(?:https?:)?\/\/(?:ai-pioneer-courses-20260725\.zenagi\.chatgpt\.site|us-ai-literacy\.lovable\.app)[^\s"'<>]*/gi,
    (destination) => gateZenPublicDestination(destination),
  );
}
