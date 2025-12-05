import { Exam, ExamStatus } from "./exam";

export type ExamListParams = {
  page?: number;
  limit?: number;
  institutionId?: string;
  status?: ExamStatus;
  createdFrom?: string;
  createdUntil?: string;
  search?: string;
  tags?: string[];
};

export type ExamListResponse = {
  data: Exam[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type BulkOperationType = "PUBLISH" | "UNPUBLISH" | "DELETE";

export type BulkOperationsRequest = {
  examIds: string[];
  operation: BulkOperationType;
};

export type BulkOperationsResponse = {
  count: number;
};
