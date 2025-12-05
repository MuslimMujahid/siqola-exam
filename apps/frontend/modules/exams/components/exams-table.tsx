"use client";

import React from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  MoreVerticalIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PlayIcon,
  PauseIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Exam, ExamStatus } from "../types/exam";

interface ExamsTableProps {
  exams: Exam[];
  isLoading?: boolean;
  onEdit?: (exam: Exam) => void;
  onDelete?: (exam: Exam) => void;
  onPublish?: (exam: Exam) => void;
  onUnpublish?: (exam: Exam) => void;
  onView?: (exam: Exam) => void;
  selectable?: boolean;
  selectedItems?: string[];
  onSelectItem?: (id: string) => void;
  onSelectAll?: () => void;
  isAllSelected?: boolean;
}

const getStatusBadge = (status: ExamStatus) => {
  const variants = {
    [ExamStatus.DRAFT]: {
      variant: "outline" as const,
      label: "Draft",
    },
    [ExamStatus.PUBLISHED]: {
      variant: "default" as const,
      label: "Dipublikasi",
    },
    [ExamStatus.CLOSED]: {
      variant: "secondary" as const,
      label: "Ditutup",
    },
  };

  const statusConfig = variants[status];

  return (
    <Badge variant={statusConfig.variant} size="sm">
      {statusConfig.label}
    </Badge>
  );
};

export function ExamsTable({
  exams,
  isLoading = false,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
  onView,
  selectable = false,
  selectedItems = [],
  onSelectItem,
  onSelectAll,
  isAllSelected = false,
}: ExamsTableProps) {
  const columns: Column<Exam>[] = [
    {
      key: "title",
      header: "Judul Ujian",
      cell: (exam) => (
        <div className="space-y-1">
          <div className="font-medium">{exam.title}</div>
          {exam.description && (
            <div className="text-sm text-muted-foreground line-clamp-1">
              {exam.description}
            </div>
          )}
        </div>
      ),
      className: "min-w-[250px]",
    },
    {
      key: "status",
      header: "Status",
      cell: (exam) => getStatusBadge(exam.status),
      className: "w-[120px]",
    },
    {
      key: "examinees",
      header: "Peserta",
      cell: (exam) => (
        <div className="text-center">
          {exam._count?.assignments ? exam._count.assignments : "-"}
        </div>
      ),
      className: "w-[100px] text-center",
    },
    {
      key: "createdAt",
      header: "Dibuat",
      cell: (exam) => (
        <div className="text-sm text-muted-foreground">
          {format(new Date(exam.createdAt), "dd MMM yyyy", { locale: id })}
        </div>
      ),
      className: "w-[120px]",
    },
    {
      key: "actions",
      header: "",
      cell: (exam) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreVerticalIcon />
              <span className="sr-only">Menu aksi</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView?.(exam)}>
              <EyeIcon />
              Lihat Detail
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(exam)}>
              <PencilIcon />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {exam.status === ExamStatus.DRAFT && (
              <DropdownMenuItem onClick={() => onPublish?.(exam)}>
                <PlayIcon />
                Publikasikan
              </DropdownMenuItem>
            )}
            {exam.status === ExamStatus.PUBLISHED && (
              <DropdownMenuItem onClick={() => onUnpublish?.(exam)}>
                <PauseIcon />
                Batalkan Publikasi
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete?.(exam)}
              className="text-destructive focus:text-destructive"
            >
              <TrashIcon />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: "w-[60px]",
    },
  ];

  const renderExpandedContent = (exam: Exam) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <div className="text-xs text-muted-foreground mb-1">Percobaan</div>
        <div className="text-sm font-medium">
          {exam._count?.attempts ? exam._count.attempts : "-"}
        </div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground mb-1">Jumlah Soal</div>
        <div className="text-sm font-medium">
          {exam._count?.questions ? `${exam._count.questions} soal` : "-"}
        </div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground mb-1">Durasi</div>
        <div className="text-sm font-medium">{exam.duration} menit</div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground mb-1">Tag</div>
        <div className="flex flex-wrap gap-1">
          {exam.tags && exam.tags.length > 0 ? (
            exam.tags.map((tag) => (
              <Badge key={tag.id} variant="outline" size="sm">
                {tag.name}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">-</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <DataTable
      data={exams}
      columns={columns}
      isLoading={isLoading}
      emptyMessage="Tidak ada ujian ditemukan"
      getRowKey={(exam) => exam.id}
      selectable={selectable}
      selectedItems={selectedItems}
      onSelectItem={onSelectItem}
      onSelectAll={onSelectAll}
      isAllSelected={isAllSelected}
      expandable
      renderExpandedContent={renderExpandedContent}
    />
  );
}
