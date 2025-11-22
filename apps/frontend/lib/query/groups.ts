import { queryOptions } from "@tanstack/react-query";
import { getGroup, getGroups } from "../api/groups";

export type GroupsQueryParams = {
  page?: number;
  limit?: number;
  institutionId?: string;
};

export type GroupQueryParams = {
  id: string;
};

export function groupsQueryOptions(params?: GroupsQueryParams) {
  return queryOptions({
    queryKey: ["groups", params],
    queryFn: () => getGroups(params),
    enabled: !!params?.institutionId,
  });
}

export function groupQueryOptions(params?: GroupQueryParams) {
  return queryOptions({
    queryKey: ["group", params?.id],
    queryFn: () => getGroup(params!.id),
    enabled: !!params?.id,
  });
}
