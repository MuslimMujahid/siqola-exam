import { apiClient } from "@/lib/api/client";
import { useMutationWrapper } from "@/hooks/use-mutation";
import { useAuthStore } from "@/modules/auth/store/auth";
import { queryOptions, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// Types based on backend DTOs and responses
export type Group = {
  id: string;
  institutionId: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  institution?: {
    id: string;
    name: string;
    logo?: string;
  };
  _count?: {
    groupMembers: number;
  };
};

export type GroupsQueryParams = {
  page?: number;
  limit?: number;
  institutionId?: string;
};

export type GroupQueryParams = {
  id: string;
};

export type GroupsListResponse = {
  data: Group[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type AddGroupMemberParams = {
  userId: string;
  groupId: string;
};

export type AddGroupMemberResponse = {
  id: string;
  groupId: string;
  userId: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
  group: Group;
};

export type AddBatchGroupMembersParams = {
  groupId: string;
  userIds: string[];
};

export type RemoveGroupMemberParams = {
  userId: string;
  groupId: string;
};

export type RemoveBatchGroupMembersParams = {
  groupId: string;
  userIds: string[];
};

export type CreateGroupParams = {
  institutionId: string;
  name: string;
  description?: string;
  memberIds?: string[];
};

export type UpdateGroupParams = {
  id: string;
  name?: string;
  description?: string;
};

/**
 * Get all groups with pagination
 */
export async function getGroups(params?: {
  page?: number;
  limit?: number;
  institutionId?: string;
}): Promise<GroupsListResponse> {
  const response = await apiClient.get<GroupsListResponse>("/groups", {
    params,
  });
  return response.data;
}

/**
 * Get a single group by ID with members
 */
export async function getGroup(id: string): Promise<Group> {
  const response = await apiClient.get<Group>(`/groups/${id}`);
  return response.data;
}

/**
 * Add a member to a group
 */
export async function addGroupMember({
  groupId,
  userId,
}: AddGroupMemberParams): Promise<AddGroupMemberResponse> {
  const response = await apiClient.post(`/groups/${groupId}/members`, {
    userId,
  });
  return response.data;
}

/**
 * Add multiple members to a group
 */
export async function addBatchGroupMembers({
  groupId,
  ...data
}: AddBatchGroupMembersParams): Promise<{
  success: number;
  failed: number;
  results: Array<{
    userId: string;
    success: boolean;
    error?: string;
  }>;
}> {
  const response = await apiClient.post(
    `/groups/${groupId}/members/batch`,
    data
  );
  return response.data;
}

/**
 * Remove a member from a group
 */
export async function removeGroupMember({
  groupId,
  userId,
}: RemoveGroupMemberParams): Promise<void> {
  await apiClient.delete(`/groups/${groupId}/members/${userId}`);
}

/**
 * Remove multiple members from a group
 */
export async function removeBatchGroupMembers({
  groupId,
  ...data
}: RemoveBatchGroupMembersParams): Promise<{
  success: number;
  failed: number;
  results: Array<{
    userId: string;
    success: boolean;
    error?: string;
  }>;
}> {
  const response = await apiClient.delete(`/groups/${groupId}/members/batch`, {
    data,
  });
  return response.data;
}

/**
 * Create a new group
 */
export async function createGroup(data: CreateGroupParams): Promise<Group> {
  const response = await apiClient.post<Group>("/groups", data);
  return response.data;
}

/**
 * Update a group
 */
export async function updateGroup({
  id,
  ...data
}: UpdateGroupParams): Promise<Group> {
  const response = await apiClient.patch<Group>(`/groups/${id}`, data);
  return response.data;
}

/**
 * Delete a group
 */
export async function deleteGroup(id: string): Promise<void> {
  await apiClient.delete(`/groups/${id}`);
}

/**
 * Query options for fetching groups list
 */
export function groupQueryOptions(params?: GroupQueryParams) {
  return queryOptions({
    queryKey: ["group", params?.id],
    queryFn: () => getGroup(params!.id),
    enabled: !!params?.id,
  });
}

/**
 * Query options for fetching groups list
 */
export function groupsQueryOptions(params?: GroupsQueryParams) {
  return queryOptions({
    queryKey: ["groups", params],
    queryFn: () => getGroups(params),
    enabled: !!params?.institutionId,
  });
}

/**
 * Hook to add a group member
 */
export function useAddGroupMember() {
  return useMutationWrapper({
    mutationFn: addGroupMember,
    invalidateQueries: [{ queryKey: ["groups"] }],
  });
}

export function useAddBatchGroupMembers() {
  const queryClient = useQueryClient();

  return useMutationWrapper({
    mutationFn: removeBatchGroupMembers,
    invalidateQueries: [
      { queryKey: ["groups"] },
      { queryKey: ["groupMembers"] },
      { queryKey: ["users"] },
    ],
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["group", variables.groupId] });
    },
  });
}

/**
 * Hook to remove a group member
 */
export function useRemoveGroupMember() {
  return useMutationWrapper({
    mutationFn: removeGroupMember,
    invalidateQueries: [{ queryKey: ["groups"] }],
  });
}

export function useRemoveBatchGroupMembers() {
  const queryClient = useQueryClient();

  return useMutationWrapper({
    mutationFn: removeBatchGroupMembers,
    invalidateQueries: [
      { queryKey: ["groups"] },
      { queryKey: ["groupMembers"] },
      { queryKey: ["users"] },
    ],
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["group", variables.groupId] });
    },
  });
}

/**
 * Hook to create a new group
 */
export function useCreateGroup() {
  const router = useRouter();
  const { user } = useAuthStore();

  return useMutationWrapper({
    mutationFn: createGroup,
    invalidateQueries: [{ queryKey: ["groups"] }],
    onSuccess: () => {
      router.push(`/dashboard/${user?.role.toLocaleLowerCase()}/groups`);
    },
  });
}

/**
 * Hook to update a group
 */
export function useUpdateGroup() {
  const router = useRouter();
  const { user } = useAuthStore();

  const queryClient = useQueryClient();

  return useMutationWrapper({
    mutationFn: updateGroup,
    invalidateQueries: [{ queryKey: ["groups"] }],
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["group", variables.id] });
      router.push(`/dashboard/${user?.role.toLocaleLowerCase()}/groups`);
    },
  });
}

/**
 * Hook to delete a group
 */
export function useDeleteGroup() {
  return useMutationWrapper({
    mutationFn: deleteGroup,
    invalidateQueries: [{ queryKey: ["groups"] }],
  });
}
