import { queryOptions } from "@tanstack/react-query";
import { getUsers, GetUsersParams } from "../api/users";

export function usersQueryOptions(params?: GetUsersParams) {
  return queryOptions({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
  });
}
