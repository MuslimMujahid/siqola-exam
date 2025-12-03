import { apiClient } from "@/lib/api/client";
import { queryOptions } from "@tanstack/react-query";

export type InstitutionStats = {
  totalExaminers: number;
  totalExaminees: number;
  totalExams: number;
};

export type InstitutionMembership = {
  id: string;
  status: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role?: string;
  };
};

export type Institution = {
  id: string;
  name: string;
  logo?: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  memberships?: InstitutionMembership[];
};

/**
 * Get institution statistics
 */
export async function getInstitutionStats(
  institutionId: string
): Promise<InstitutionStats> {
  const response = await apiClient.get<InstitutionStats>(
    `/institutions/${institutionId}/stats`
  );
  return response.data;
}

/**
 * Get institution details
 */
export async function getInstitution(id: string): Promise<Institution> {
  const response = await apiClient.get<Institution>(`/institutions/${id}`);
  return response.data;
}

/**
 * Query options for institution stats
 */
export function institutionStatsQueryOptions(institutionId: string) {
  return queryOptions({
    queryKey: ["institution-stats", institutionId],
    queryFn: () => getInstitutionStats(institutionId),
    enabled: !!institutionId,
  });
}

/**
 * Query options for institution details
 */
export function institutionQueryOptions(institutionId: string) {
  return queryOptions({
    queryKey: ["institution", institutionId],
    queryFn: () => getInstitution(institutionId),
    enabled: !!institutionId,
  });
}
