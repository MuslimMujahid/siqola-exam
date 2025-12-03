import React from "react";
import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";

export type InvalidateQueriesConfig = {
  queryKey: string[];
}[];

export type MutationOptions = {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export type UseMutationWrapperOptions<TData, TError, TVariables> = {
  mutationFn: (variables: TVariables) => Promise<TData>;
  invalidateQueries?:
    | InvalidateQueriesConfig
    | ((data: TData, variables: TVariables) => InvalidateQueriesConfig);
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: TError, variables: TVariables) => void;
  mutationOptions?: Omit<
    UseMutationOptions<TData, TError, TVariables>,
    "mutationFn" | "onSuccess" | "onError"
  >;
};

/**
 * Generic mutation hook wrapper that handles common patterns:
 * - Query invalidation after successful mutation
 * - Memoized mutation handler
 * - Consistent return interface
 *
 * @example
 * ```ts
 * export function useAddGroupMember() {
 *   return useMutationWrapper({
 *     mutationFn: addGroupMember,
 *     invalidateQueries: [{ queryKey: ["groups"] }],
 *   });
 * }
 * ```
 */
export function useMutationWrapper<
  TData = unknown,
  TError = Error,
  TVariables = void,
>({
  mutationFn,
  invalidateQueries,
  onSuccess,
  onError,
  mutationOptions,
}: UseMutationWrapperOptions<TData, TError, TVariables>) {
  const queryClient = useQueryClient();

  const mutation = useMutation<TData, TError, TVariables>({
    mutationFn,
    onSuccess: (data, variables) => {
      // Invalidate queries if specified
      if (invalidateQueries) {
        const queriesToInvalidate =
          typeof invalidateQueries === "function"
            ? invalidateQueries(data, variables)
            : invalidateQueries;

        queriesToInvalidate.forEach(({ queryKey }) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      // Call custom onSuccess if provided
      onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      // Call custom onError if provided
      onError?.(error, variables);
    },
    ...mutationOptions,
  });

  const mutate = React.useCallback(
    (variables: TVariables, options?: MutationOptions) => {
      return mutation.mutateAsync(variables, options);
    },
    [mutation]
  );

  return {
    mutate,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    data: mutation.data,
    reset: mutation.reset,
  };
}
