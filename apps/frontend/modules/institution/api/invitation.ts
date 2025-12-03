import { queryOptions } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import { useMutationWrapper } from "@/hooks/use-mutation";
import { UserRole } from "@/modules/users/entities";

export interface InviteUserParams {
  institutionId: string;
  email: string;
  role: UserRole;
}

export interface GetInvitationDetailsResponse {
  email: string;
  role: string;
  institution: {
    id: string;
    name: string;
    logo?: string;
  };
  isExistingUser: boolean;
  userFullName?: string;
}

export interface AcceptInvitationParams {
  token: string;
  fullName?: string;
  phoneNumber?: string;
  password?: string;
}

export interface InvitationResponse {
  message: string;
}

/**
 * Invite a user to an institution
 */
async function inviteUser({ institutionId, ...data }: InviteUserParams) {
  const response = await apiClient.post("/invitations/invite", data, {
    headers: {
      "x-institution-id": institutionId,
    },
  });
  return response.data;
}

/**
 * Get invitation details
 */
async function getInvitationDetails(
  token: string
): Promise<GetInvitationDetailsResponse> {
  const response = await apiClient.get(`/invitations/${token}`);
  return response.data;
}

/**
 * Accept an invitation
 */
async function acceptInvitation({
  token,
  ...data
}: AcceptInvitationParams): Promise<InvitationResponse> {
  const response = await apiClient.post(
    `/invitations/${token}/accept`,
    data || {}
  );
  return response.data;
}

/**
 * Reject an invitation
 */
async function rejectInvitation(token: string): Promise<InvitationResponse> {
  const response = await apiClient.post(`/invitations/${token}/reject`);
  return response.data;
}

/**
 * Query options for invitation details
 */
export const invitationQueryOptions = (token: string) =>
  queryOptions({
    queryKey: ["invitation", token],
    queryFn: () => getInvitationDetails(token),
    enabled: !!token,
    retry: false,
  });

/**
 * Custom hook to invite a user
 */
export function useInviteUser() {
  return useMutationWrapper({
    mutationFn: inviteUser,
    invalidateQueries: [{ queryKey: ["invitation"] }],
  });
}

/**
 * Custom hook to accept an invitation
 */
export function useAcceptInvitation() {
  return useMutationWrapper({
    mutationFn: acceptInvitation,
    invalidateQueries: (_, params) => [
      { queryKey: ["invitation", params.token] },
    ],
  });
}

/**
 * Custom hook to reject an invitation
 */
export function useRejectInvitation() {
  return useMutationWrapper({
    mutationFn: rejectInvitation,
    invalidateQueries: (_, token) => [{ queryKey: ["invitation", token] }],
  });
}
