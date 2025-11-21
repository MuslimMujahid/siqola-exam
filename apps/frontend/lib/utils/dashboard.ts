import type { Membership } from "@/store/auth";

/**
 * Determines the appropriate dashboard route based on user's primary role
 */
export function getDashboardRoute(memberships: Membership[] = []): string {
  if (!memberships || memberships.length === 0) {
    return "/dashboard"; // Default fallback
  }

  // Get the primary (first) membership's role
  const primaryRole = memberships[0]?.role;

  switch (primaryRole?.toUpperCase()) {
    case "ADMIN":
      return "/dashboard/admin";
    case "EXAMINER":
      return "/dashboard/examiner";
    case "EXAMINEE":
      return "/dashboard/student";
    default:
      return "/dashboard";
  }
}

/**
 * Gets all available dashboard routes for a user based on their memberships
 */
export function getAvailableDashboards(memberships: Membership[] = []) {
  const uniqueRoles = [
    ...new Set(memberships.map((m) => m.role.toUpperCase())),
  ];

  return uniqueRoles.map((role) => ({
    role,
    route: getDashboardRoute([{ role } as Membership]),
    label: role.toLowerCase().replace(/^\w/, (c) => c.toUpperCase()),
  }));
}
