import { queryOptions } from "@tanstack/react-query";
import { invitationsApi } from "../api/invitations";

export const invitationQueryOptions = (token: string) =>
  queryOptions({
    queryKey: ["invitation", token],
    queryFn: () => invitationsApi.getInvitationDetails(token),
    enabled: !!token,
    retry: false,
  });
