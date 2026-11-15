export const ACCOUNT_DASHBOARDS = ["/job-seekers", "/employers", "/admin/dashboard"] as const;

export type AccountDashboard = (typeof ACCOUNT_DASHBOARDS)[number];

export function getAccountDashboard(pathname: string): AccountDashboard {
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return "/admin/dashboard";
  if (pathname === "/employers" || pathname.startsWith("/employers/")) return "/employers";
  return "/job-seekers";
}

export function isAccountDashboard(value: string | null): value is AccountDashboard {
  return ACCOUNT_DASHBOARDS.some((dashboard) => dashboard === value);
}