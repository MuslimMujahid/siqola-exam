/**
 * Determines the appropriate dashboard route based on user's role
 */
export function getDashboardRoute(role?: string): string {
  if (!role) {
    return "/dashboard"; // Default fallback
  }

  switch (role.toUpperCase()) {
    case "ADMIN":
      return "/dashboard/admin";
    case "EXAMINER":
      return "/dashboard/examiner";
    case "EXAMINEE":
      return "/dashboard/examinee";
    default:
      return "/dashboard";
  }
}
