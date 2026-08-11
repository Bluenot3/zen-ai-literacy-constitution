export const ARSENAL_DASHBOARD_LOGIN =
  "https://arsenal.world/login?next=%2Fdashboard&utm_source=zenai.world&utm_medium=owned&utm_campaign=zen_account_activation";

export const isDirectSupabaseOAuthUrl = (value: string) => {
  try {
    const url = new URL(value);
    return (
      url.hostname === "kcyklettzoyexxynqfer.supabase.co" &&
      url.pathname === "/auth/v1/authorize"
    );
  } catch {
    return false;
  }
};
