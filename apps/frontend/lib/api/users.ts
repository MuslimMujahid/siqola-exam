import { UserRole, UserStatus } from "../entities/users";
import { apiClient } from "./client";

// Types based on backend DTOs and responses
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
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
 * Update user membership status (activate/suspend)
 */
export async function updateUserMembershipStatus(
  userId: string,
  institutionId: string,
  status: UserStatus
): Promise<void> {
  await apiClient.patch(
    `/users/${userId}/institutions/${institutionId}/status`,
    {
      status,
    }
  );
}

/**
 * Get users by role and institution (filtered examinees)
 */
export async function getUsersByInstitution(params: {
  institutionId: string;
  role?: "EXAMINEE" | "EXAMINER" | "ADMIN";
  page?: number;
  limit?: number;
}): Promise<UsersListResponse> {
  // For now, this will use the regular users endpoint
  // Later, backend can add filtering by role and institutionId
  const response = await apiClient.get<UsersListResponse>("/users", {
    params,
  });
  return response.data;
}

/**
 * Delete a user by ID
 */
export async function deleteUser(userId: string): Promise<User> {
  const response = await apiClient.delete<User>(`/users/${userId}`);
  return response.data;
}
