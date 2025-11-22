import { apiClient } from "./client";

// Types based on backend DTOs and responses
export interface Group {
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
}

export interface CreateGroupRequest {
  institutionId: string;
  name: string;
  description?: string;
  memberIds?: string[];
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
}

export interface AddGroupMemberRequest {
  userId: string;
}

export interface AddBatchGroupMembersRequest {
  userIds: string[];
}

export interface GroupsListResponse {
  data: Group[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
}

export interface GroupMembersListResponse {
  data: GroupMember[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

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
 * Get group members with pagination
 */
export async function getGroupMembers(
  groupId: string,
  params?: {
    page?: number;
    limit?: number;
    search?: string;
  }
): Promise<GroupMembersListResponse> {
  const response = await apiClient.get<GroupMembersListResponse>(
    `/groups/${groupId}/members`,
    { params }
  );
  return response.data;
}

/**
 * Create a new group
 */
export async function createGroup(data: CreateGroupRequest): Promise<Group> {
  const response = await apiClient.post<Group>("/groups", data);
  return response.data;
}

/**
 * Update a group
 */
export async function updateGroup(
  id: string,
  data: UpdateGroupRequest
): Promise<Group> {
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
 * Add a member to a group
 */
export async function addGroupMember(
  groupId: string,
  data: AddGroupMemberRequest
): Promise<{
  id: string;
  groupId: string;
  userId: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
  group: Group;
}> {
  const response = await apiClient.post(`/groups/${groupId}/members`, data);
  return response.data;
}

/**
 * Add multiple members to a group
 */
export async function addBatchGroupMembers(
  groupId: string,
  data: AddBatchGroupMembersRequest
): Promise<{
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
export async function removeGroupMember(
  groupId: string,
  userId: string
): Promise<void> {
  await apiClient.delete(`/groups/${groupId}/members/${userId}`);
}

/**
 * Remove multiple members from a group
 */
export async function removeBatchGroupMembers(
  groupId: string,
  userIds: string[]
): Promise<{
  success: number;
  failed: number;
  results: Array<{
    userId: string;
    success: boolean;
    error?: string;
  }>;
}> {
  const response = await apiClient.delete(`/groups/${groupId}/members/batch`, {
    data: { userIds },
  });
  return response.data;
}
