import React from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  addBatchGroupMembers,
  removeBatchGroupMembers,
  removeGroupMember,
} from "@/lib/api/groups";

type HandlerOptions = {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export function useManageGroupMembers(groupId: string) {
  const queryClient = useQueryClient();

  const invalidateQueries = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["group", groupId] });
    queryClient.invalidateQueries({ queryKey: ["groupMembers", groupId] });
    queryClient.invalidateQueries({ queryKey: ["users"] });
  }, [queryClient, groupId]);

  const addMembersMutation = useMutation({
    mutationFn: (userIds: string[]) =>
      addBatchGroupMembers(groupId, { userIds }),
    onSuccess: () => {
      invalidateQueries();
    },
    onError: (error) => {
      console.error("Failed to add members:", error);
    },
  });

  const removeMembersMutation = useMutation({
    mutationFn: (userIds: string[]) =>
      removeBatchGroupMembers(groupId, userIds),
    onSuccess: () => {
      invalidateQueries();
    },
    onError: (error) => {
      console.error("Failed to remove members:", error);
    },
  });

  const removeSingleMemberMutation = useMutation({
    mutationFn: (userId: string) => removeGroupMember(groupId, userId),
    onSuccess: () => {
      invalidateQueries();
    },
    onError: (error) => {
      console.error("Failed to remove member:", error);
    },
  });

  const handleAddMembers = React.useCallback(
    async (userIds: string[], options?: HandlerOptions) => {
      addMembersMutation.reset();
      return addMembersMutation.mutateAsync(userIds, {
        onSuccess: () => {
          options?.onSuccess?.();
        },
        onError: (error) => {
          options?.onError?.(error);
        },
      });
    },
    [addMembersMutation]
  );

  const handleRemoveMembers = React.useCallback(
    async (userIds: string[], options?: HandlerOptions) => {
      removeMembersMutation.reset();
      return removeMembersMutation.mutateAsync(userIds, {
        onSuccess: () => {
          options?.onSuccess?.();
        },
        onError: (error) => {
          options?.onError?.(error);
        },
      });
    },
    [removeMembersMutation]
  );

  const handleRemoveSingleMember = React.useCallback(
    async (userId: string, options?: HandlerOptions) => {
      removeSingleMemberMutation.reset();
      return removeSingleMemberMutation.mutateAsync(userId, {
        onSuccess: () => {
          options?.onSuccess?.();
        },
        onError: (error) => {
          options?.onError?.(error);
        },
      });
    },
    [removeSingleMemberMutation]
  );

  return {
    addMembers: handleAddMembers,
    removeMembers: handleRemoveMembers,
    removeSingleMember: handleRemoveSingleMember,
    isAddingMembers: addMembersMutation.isPending,
    isRemovingMembers: removeMembersMutation.isPending,
    isRemovingSingleMember: removeSingleMemberMutation.isPending,
    isLoading:
      addMembersMutation.isPending ||
      removeMembersMutation.isPending ||
      removeSingleMemberMutation.isPending,
  };
}
