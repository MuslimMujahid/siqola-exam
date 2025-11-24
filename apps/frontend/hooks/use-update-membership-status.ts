import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, isApiError } from "@/lib/api/client";

interface UpdateMembershipStatusParams {
  userId: string;
  institutionId: string;
  status: "ACTIVE" | "SUSPENDED";
}

async function updateMembershipStatus({
  userId,
  institutionId,
  status,
}: UpdateMembershipStatusParams) {
  try {
    const response = await apiClient.patch(
      `/users/${userId}/institutions/${institutionId}/status`,
      { status }
    );
    return response.data;
  } catch (error) {
    if (isApiError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to update membership status"
      );
    }
    throw error;
  }
}

/**
 * Custom hook for updating user membership status
 */
export function useUpdateMembershipStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMembershipStatus,
    onSuccess: () => {
      // Invalidate users query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
