"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Eye } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ExamAssignment {
  id: string;
  examId: string;
  examTitle: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  assignedGroups: number;
  createdAt: string;
}

interface ExaminerExamParticipationProps {
  userId: string;
}

export function ExaminerExamParticipation({
  userId: _userId,
}: ExaminerExamParticipationProps) {
  // TODO: Replace with actual API call - will use _userId when API is ready
  // Mock data for development
  const examAssignments: ExamAssignment[] = [
    {
      id: "1",
      examId: "exam-1",
      examTitle: "Ujian Matematika Dasar",
      status: "PUBLISHED",
      assignedGroups: 3,
      createdAt: "2024-11-15T10:00:00Z",
    },
    {
      id: "2",
      examId: "exam-2",
      examTitle: "Ujian Fisika Semester 1",
      status: "PUBLISHED",
      assignedGroups: 2,
      createdAt: "2024-11-18T14:30:00Z",
    },
    {
      id: "3",
      examId: "exam-3",
      examTitle: "Ujian Biologi - Sel dan Jaringan",
      status: "DRAFT",
      assignedGroups: 0,
      createdAt: "2024-11-22T09:15:00Z",
    },
    {
      id: "4",
      examId: "exam-4",
      examTitle: "Ujian Kimia Anorganik",
      status: "ARCHIVED",
      assignedGroups: 1,
      createdAt: "2024-10-20T11:00:00Z",
    },
  ];
  const isLoading = false;

  const statusConfig = {
    DRAFT: {
      label: "Draf",
      className: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
    },
    PUBLISHED: {
      label: "Dipublikasikan",
      className: "bg-green-500/10 text-green-700 dark:text-green-400",
    },
    ARCHIVED: {
      label: "Diarsipkan",
      className: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Ujian yang Ditugaskan</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Daftar ujian yang dibuat atau ditugaskan kepada penguji
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
                </div>
              </div>
            </div>
          ) : examAssignments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">
                Penguji belum memiliki ujian yang ditugaskan
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-border/50">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ujian</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Grup Ditugaskan</TableHead>
                    <TableHead>Dibuat Pada</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {examAssignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell>
                        <div className="font-medium">
                          {assignment.examTitle}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={statusConfig[assignment.status].className}
                          variant="secondary"
                        >
                          {statusConfig[assignment.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {assignment.assignedGroups} grup
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {format(
                            new Date(assignment.createdAt),
                            "d MMM yyyy",
                            {
                              locale: idLocale,
                            }
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            href={`/dashboard/admin/exams/${assignment.examId}`}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Lihat Ujian
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
