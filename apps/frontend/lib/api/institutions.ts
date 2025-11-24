import { apiClient } from "./client";

export interface InstitutionStats {
  totalExaminers: number;
  totalExaminees: number;
  totalExams: number;
}

export interface InstitutionMembership {
  id: string;
  status: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role?: string;
  };
}

export interface Institution {
  id: string;
  name: string;
  logo?: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  memberships?: InstitutionMembership[];
}

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
