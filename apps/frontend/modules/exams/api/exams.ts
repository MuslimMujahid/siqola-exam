import { queryOptions } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import { useMutationWrapper } from "@/hooks/use-mutation";
import {
  ExamListParams,
  ExamListResponse,
  BulkOperationsRequest,
  BulkOperationsResponse,
} from "../types";
import { Exam, Tag } from "../types/exam";

const EXAMS_BASE_URL = "/exams";

/**
 * Get all exams with pagination and filtering
 */
export async function getExams(
  params?: ExamListParams
): Promise<ExamListResponse> {
  const response = await apiClient.get<ExamListResponse>(EXAMS_BASE_URL, {
    params,
  });
  return response.data;
}

/**
 * Get a single exam by ID with detailed info
 */
export async function getExam(id: string): Promise<Exam> {
  const response = await apiClient.get<Exam>(`${EXAMS_BASE_URL}/${id}`);
  return response.data;
}

/**
 * Get all available tags from exams in user's institution
 */
export async function getTags(): Promise<Tag[]> {
  const response = await apiClient.get<Tag[]>(`${EXAMS_BASE_URL}/tags`);
  return response.data;
}

/**
 * Bulk operations on exams (publish, unpublish, delete)
 */
export async function bulkOperations(
  data: BulkOperationsRequest
): Promise<BulkOperationsResponse> {
  const response = await apiClient.post<BulkOperationsResponse>(
    `${EXAMS_BASE_URL}/bulk-operations`,
    data
  );
  return response.data;
}

/** Query options for fetching tags */
export function tagsQueryOptions() {
  return queryOptions({
    queryKey: ["exam-tags"],
    queryFn: () => getTags(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/** Query options for fetching exams */
export function examsQueryOptions(params?: ExamListParams) {
  return queryOptions({
    queryKey: ["exams", params],
    queryFn: () => getExams(params),
  });
}

/** Query options for fetching a single exam */
export function examQueryOptions(examId: string) {
  return queryOptions({
    queryKey: ["exam", examId],
    queryFn: () => getExam(examId),
    enabled: !!examId,
  });
}

/**
 * Custom hook for bulk operations on exams
 */
export function useBulkOperations() {
  return useMutationWrapper({
    mutationFn: bulkOperations,
    invalidateQueries: [{ queryKey: ["exams"] }],
  });
}
