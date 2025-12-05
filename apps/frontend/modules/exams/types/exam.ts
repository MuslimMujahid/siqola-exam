export enum ExamStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  CLOSED = "CLOSED",
}

export type Creator = {
  id: string;
  email: string;
  fullName: string;
};

export type Institution = {
  id: string;
  name: string;
  logo?: string;
};

export type Tag = {
  id: string;
  name: string;
  institutionId: string | null;
  isPublic: boolean;
};

export interface Exam {
  id: string;
  title: string;
  status: ExamStatus;
  description?: string;
  instructions?: string;
  duration: number; // in minutes
  passingGrade: number;
  shuffleOptions: boolean;
  maxAttempts: number;
  tags: Tag[];
  institutionId: string;
  creatorId: string;
  availableFrom?: string;
  availableUntil?: string;
  createdAt: string;
  updatedAt: string;
  creator?: Creator;
  institution?: Institution;
  _count?: {
    assignments: number;
    attempts: number;
    questions: number;
  };
}

export interface ExamListFilters {
  search?: string;
  status?: ExamStatus | "all";
  dateFrom?: string;
  dateTo?: string;
}
