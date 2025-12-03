import { apiClient } from "@/lib/api/client";
import { useMutationWrapper } from "@/hooks/use-mutation";
import { type UserStatus } from "../entities";

export type UpdateMembershipStatusParams = {
  userId: string;
  institutionId: string;
  status: UserStatus;
};

export async function updateMembershipStatus({
  userId,
  institutionId,
  status,
}: UpdateMembershipStatusParams) {
  const response = await apiClient.patch(
    `/users/${userId}/institutions/${institutionId}/status`,
    { status }
  );
  return response.data;
}

/**
 * Custom hook for updating user membership status
 */
export function useUpdateMembershipStatus() {
  return useMutationWrapper({
    mutationFn: updateMembershipStatus,
    invalidateQueries: [{ queryKey: ["users"] }, { queryKey: ["user"] }],
  });
}
