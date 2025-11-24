import { apiClient } from "./client";

export interface InviteUserRequest {
  email: string;
  role: "EXAMINER" | "EXAMINEE";
}

export interface InviteUserResponse {
  message: string;
  invitationUrl: string;
  expiresAt: string;
}

export interface InvitationDetails {
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

export interface AcceptInvitationRequest {
  fullName: string;
  phoneNumber: string;
  password: string;
}

export interface InvitationResponse {
  message: string;
}

export const invitationsApi = {
  inviteUser: async (
    data: InviteUserRequest,
    institutionId: string
  ): Promise<InviteUserResponse> => {
    const response = await apiClient.post("/invitations/invite", data, {
      headers: {
        "x-institution-id": institutionId,
      },
    });
    return response.data;
  },

  getInvitationDetails: async (token: string): Promise<InvitationDetails> => {
    const response = await apiClient.get(`/invitations/${token}`);
    return response.data;
  },

  acceptInvitation: async (
    token: string,
    data?: AcceptInvitationRequest
  ): Promise<InvitationResponse> => {
    const response = await apiClient.post(
      `/invitations/${token}/accept`,
      data || {}
    );
    return response.data;
  },

  rejectInvitation: async (token: string): Promise<InvitationResponse> => {
    const response = await apiClient.post(`/invitations/${token}/reject`);
    return response.data;
  },
};
