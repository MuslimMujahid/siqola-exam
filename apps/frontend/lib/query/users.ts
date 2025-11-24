import { queryOptions } from "@tanstack/react-query";
import { getUsers, getUser, GetUsersParams } from "../api/users";

export function usersQueryOptions(params?: GetUsersParams) {
  return queryOptions({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
  });
}

export function userQueryOptions(userId: string) {
  return queryOptions({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
  });
}
