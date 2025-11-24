import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "@/lib/api/users";

/**
 * Custom hook for deleting a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      // Invalidate users query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
