import React from "react";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createGroup, CreateGroupRequest } from "@/lib/api/groups";

export function useCreateGroup() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createGroupMutation = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      router.push("/dashboard/admin/groups");
    },
    onError: (error) => {
      console.error("Failed to create group:", error);
    },
  });

  const handleCreateGroup = React.useCallback(
    async (data: CreateGroupRequest) => {
      createGroupMutation.reset();
      return createGroupMutation.mutateAsync(data);
    },
    [createGroupMutation]
  );

  return {
    createGroup: handleCreateGroup,
    isLoading: createGroupMutation.isPending,
    error: createGroupMutation.error,
    isSuccess: createGroupMutation.isSuccess,
    reset: createGroupMutation.reset,
  };
}
