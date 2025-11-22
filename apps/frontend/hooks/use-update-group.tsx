import React from "react";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateGroup, UpdateGroupRequest } from "@/lib/api/groups";

export function useUpdateGroup(groupId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const updateGroupMutation = useMutation({
    mutationFn: (data: UpdateGroupRequest) => updateGroup(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      router.push("/dashboard/admin/groups");
    },
    onError: (error) => {
      console.error("Failed to update group:", error);
    },
  });

  const handleUpdateGroup = React.useCallback(
    async (data: UpdateGroupRequest) => {
      updateGroupMutation.reset();
      return updateGroupMutation.mutateAsync(data);
    },
    [updateGroupMutation]
  );

  return {
    updateGroup: handleUpdateGroup,
    isLoading: updateGroupMutation.isPending,
    error: updateGroupMutation.error,
    isSuccess: updateGroupMutation.isSuccess,
    reset: updateGroupMutation.reset,
  };
}
