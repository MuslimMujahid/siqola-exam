"use client";

import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { motion } from "framer-motion";
import { FileText, Eye, ExternalLink } from "lucide-react";
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

interface ExamAttempt {
  id: string;
  examId: string;
  examTitle: string;
  status: "IN_PROGRESS" | "COMPLETED" | "GRADED";
  score: number | null;
  startedAt: string;
  completedAt: string | null;
}

interface ExamineeExamParticipationProps {
  userId: string;
}

export function ExamineeExamParticipation({
  userId,
}: ExamineeExamParticipationProps) {
  // TODO: Replace with actual API call - will use _userId when API is ready
  // Mock data for development
  const examAttempts: ExamAttempt[] = [
    {
      id: "1",
      examId: "exam-1",
      examTitle: "Ujian Matematika Dasar",
      status: "GRADED",
      score: 85,
      startedAt: "2024-11-20T09:00:00Z",
      completedAt: "2024-11-20T10:30:00Z",
    },
    {
      id: "2",
      examId: "exam-2",
      examTitle: "Ujian Fisika Semester 1",
      status: "COMPLETED",
      score: null,
      startedAt: "2024-11-21T13:00:00Z",
      completedAt: "2024-11-21T14:45:00Z",
    },
    {
      id: "3",
      examId: "exam-3",
      examTitle: "Ujian Kimia Organik",
      status: "IN_PROGRESS",
      score: null,
      startedAt: "2024-11-22T08:00:00Z",
      completedAt: null,
    },
  ];
  const isLoading = false;

  const statusConfig = {
    IN_PROGRESS: {
      label: "Sedang Berlangsung",
      className: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    },
    COMPLETED: {
      label: "Selesai",
      className: "bg-green-500/10 text-green-700 dark:text-green-400",
    },
    GRADED: {
      label: "Dinilai",
      className: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
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
              <CardTitle className="text-xl">Partisipasi Ujian</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Daftar ujian yang diikuti peserta
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
          ) : examAttempts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">
                Peserta belum mengikuti ujian apapun
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-border/50">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ujian</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Nilai</TableHead>
                    <TableHead>Tanggal Mulai</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {examAttempts.map((attempt) => (
                    <TableRow key={attempt.id}>
                      <TableCell>
                        <div className="font-medium">{attempt.examTitle}</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={statusConfig[attempt.status].className}
                          variant="secondary"
                        >
                          {statusConfig[attempt.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {attempt.score !== null ? (
                          <span className="font-semibold">{attempt.score}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {format(
                            new Date(attempt.startedAt),
                            "d MMM yyyy, HH:mm",
                            {
                              locale: idLocale,
                            }
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link
                              href={`/dashboard/exams/${attempt.examId}/attempts/${attempt.id}`}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Lihat Percobaan
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/exams/${attempt.examId}`}>
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </Button>
                        </div>
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
