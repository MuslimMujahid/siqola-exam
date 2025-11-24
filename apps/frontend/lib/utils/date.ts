/**
 * Formats a date into a relative time string in Indonesian
 * @param date - The date to format (Date object or ISO string)
 * @returns Formatted relative time string (e.g., "2 jam yang lalu")
 */
export function formatRelativeTime(date: Date | string): string {
  const createdAt = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - createdAt.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return "Baru saja";
  } else if (diffMins < 60) {
    return `${diffMins} menit yang lalu`;
  } else if (diffHours < 24) {
    return `${diffHours} jam yang lalu`;
  } else {
    return `${diffDays} hari yang lalu`;
  }
}
