import React from "react";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteGroup } from "@/lib/api/groups";

export function useDeleteGroup() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteGroupMutation = useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      router.push("/dashboard/admin/groups");
    },
    onError: (error) => {
      console.error("Failed to delete group:", error);
    },
  });

  const handleCreateGroup = React.useCallback(
    (groupId: string) => {
      deleteGroupMutation.reset();
      return deleteGroupMutation.mutateAsync(groupId);
    },
    [deleteGroupMutation]
  );

  return {
    deleteGroup: handleCreateGroup,
    isLoading: deleteGroupMutation.isPending,
    error: deleteGroupMutation.error,
    isSuccess: deleteGroupMutation.isSuccess,
    reset: deleteGroupMutation.reset,
  };
}
