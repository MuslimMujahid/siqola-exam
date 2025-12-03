import { queryOptions } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import { useMutationWrapper } from "@/hooks/use-mutation";
import { UserRole, UserStatus } from "../entities";

// Types based on backend DTOs and responses
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
  memberships?: Array<{
    id: string;
    status: UserStatus;
    institution: {
      id: string;
      name: string;
      logo?: string;
    };
  }>;
  groupMembers?: Array<{
    id: string;
    group: {
      id: string;
      name: string;
    };
  }>;
}

export type GetUsersParams = {
  page?: number;
  limit?: number;
  role?: UserRole | UserRole[];
  status?: UserStatus | UserStatus[];
  institutionId?: string | string[];
  search?: string;
  groupId?: string | string[];
  excludeGroupId?: string | string[];
};

export interface UsersListResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Get all users with pagination
 */
export async function getUsers(
  params?: GetUsersParams
): Promise<UsersListResponse> {
  const response = await apiClient.get<UsersListResponse>("/users", {
    params,
  });
  return response.data;
}

/**
 * Get a single user by ID with detailed info
 */
export async function getUser(id: string): Promise<User> {
  const response = await apiClient.get<User>(`/users/${id}`);
  return response.data;
}

/**
 * Delete a user by ID
 */
export async function deleteUser(userId: string): Promise<User> {
  const response = await apiClient.delete<User>(`/users/${userId}`);
  return response.data;
}

/** Query options for fetching users */
export function usersQueryOptions(params?: GetUsersParams) {
  return queryOptions({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
  });
}

/** Query options for fetching a single user */
export function userQueryOptions(userId: string) {
  return queryOptions({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
  });
}

/**
 * Custom hook for deleting a user
 */
export function useDeleteUser() {
  return useMutationWrapper({
    mutationFn: deleteUser,
    invalidateQueries: [{ queryKey: ["users"] }],
  });
}
