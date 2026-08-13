export type NativeProgramId = "pioneer" | "vanguard";

export type ArsenalEntryPath =
  | "/agents/new"
  | "/business-spaces/new"
  | "/dashboard"
  | "/ecosystem"
  | "/marketplace"
  | "/partners/apply"
  | "/pricing";

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
) => {
  const next = new URL(nextPath, "https://arsenal.world");
  next.searchParams.set("utm_source", "zenai.world");
  next.searchParams.set("utm_medium", medium);
  next.searchParams.set("utm_campaign", campaign);
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
  build: buildArsenalLoginUrl("/agents/new", "owned", "build_with_arsenal"),
  business: buildArsenalLoginUrl(
    "/business-spaces/new",
    "owned",
    "business_space_intake",
  ),
  partner: buildArsenalLoginUrl(
    "/partners/apply",
    "owned",
    "partner_with_zen",
  ),
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
