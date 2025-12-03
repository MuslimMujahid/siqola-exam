"use client";

import React from "react";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  Edit,
  Eye,
  FileCheck,
  Clock,
  Users,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data - replace with actual API calls
const mockExams = {
  draft: [
    {
      id: 1,
      title: "Mathematics Final Exam",
      subject: "Mathematics",
      startTime: "2025-11-20 09:00",
      duration: "2 hours",
      examinees: 0,
      submissions: 0,
      status: "draft",
    },
  ],
  published: [
    {
      id: 2,
      title: "Physics Midterm",
      subject: "Physics",
      startTime: "2025-11-15 14:00",
      duration: "1.5 hours",
      examinees: 45,
      submissions: 0,
      status: "published",
    },
  ],
  active: [
    {
      id: 3,
      title: "Chemistry Quiz",
      subject: "Chemistry",
      startTime: "2025-11-09 10:00",
      duration: "1 hour",
      examinees: 38,
      submissions: 12,
      status: "active",
    },
  ],
  closed: [
    {
      id: 4,
      title: "Biology Test",
      subject: "Biology",
      startTime: "2025-11-05 11:00",
      duration: "1 hour",
      examinees: 42,
      submissions: 42,
      status: "closed",
    },
  ],
};

const mockPendingGrading = [
  {
    id: 1,
    examId: 4,
    examTitle: "Biology Test",
    subject: "Biology",
    totalSubmissions: 42,
    gradedSubmissions: 38,
    pendingSubmissions: 4,
    lastSubmissionAt: "2025-11-05 12:50",
  },
  {
    id: 2,
    examId: 3,
    examTitle: "Chemistry Quiz",
    subject: "Chemistry",
    totalSubmissions: 15,
    gradedSubmissions: 12,
    pendingSubmissions: 3,
    lastSubmissionAt: "2025-11-09 11:05",
  },
];

const mockRecentSubmissions = [
  {
    id: 1,
    examineeName: "Alice Brown",
    examTitle: "Chemistry Quiz",
    submittedAt: "2025-11-09 10:58",
    score: "88%",
    status: "graded",
  },
  {
    id: 2,
    examineeName: "Charlie Davis",
    examTitle: "Chemistry Quiz",
    submittedAt: "2025-11-09 10:56",
    score: "95%",
    status: "graded",
  },
  {
    id: 3,
    examineeName: "David Wilson",
    examTitle: "Chemistry Quiz",
    submittedAt: "2025-11-09 10:52",
    score: "82%",
    status: "graded",
  },
];

const mockUser = {
  name: "Dr. Jane Smith",
  email: "jane.smith@university.edu",
  institution: "ABC University",
  role: "Examiner",
};

export function ExaminerDashboard() {
  const [examFilter, setExamFilter] = React.useState<string>("all");

  const allExams = [
    ...mockExams.draft,
    ...mockExams.published,
    ...mockExams.active,
    ...mockExams.closed,
  ];

  const filteredExams =
    examFilter === "all"
      ? allExams
      : allExams.filter((exam) => exam.status === examFilter);

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      {
        variant: "default" | "secondary" | "outline" | "destructive";
        label: string;
      }
    > = {
      draft: { variant: "outline", label: "Draft" },
      published: { variant: "secondary", label: "Published" },
      active: { variant: "default", label: "Active" },
      closed: { variant: "destructive", label: "Closed" },
    };
    const config = variants[status] || variants.draft;
    return (
      <Badge variant={config.variant} size="sm">
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Quick Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Exams</p>
                  <p className="text-3xl font-bold text-primary mt-1">
                    {mockExams.active.length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {mockExams.active.reduce(
                      (acc, exam) => acc + exam.submissions,
                      0
                    )}{" "}
                    submissions
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-primary/10">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Pending Grading
                  </p>
                  <p className="text-3xl font-bold text-primary mt-1">
                    {mockPendingGrading.reduce(
                      (acc, exam) => acc + exam.pendingSubmissions,
                      0
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Needs attention
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-primary/20">
                  <AlertCircle className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Upcoming Exams
                  </p>
                  <p className="text-3xl font-bold text-primary mt-1">
                    {mockExams.published.length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {mockExams.published.reduce(
                      (acc, exam) => acc + exam.examinees,
                      0
                    )}{" "}
                    examinees
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-primary/10">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="flex flex-wrap gap-3"
      >
        <Button asChild>
          <Link href="/dashboard/examiner/exams/create">
            <Plus className="w-4 h-4 mr-2" />
            Create New Exam
          </Link>
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Grading Section - Prominent */}
          {mockPendingGrading.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-primary" />
                        Exams Needing Grading
                      </CardTitle>
                      <CardDescription>
                        Complete grading for these exams
                      </CardDescription>
                    </div>
                    <Badge variant="default" size="lg">
                      {mockPendingGrading.reduce(
                        (acc, exam) => acc + exam.pendingSubmissions,
                        0
                      )}{" "}
                      submissions
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockPendingGrading.map((exam) => {
                    return (
                      <div
                        key={exam.id}
                        className="rounded-lg border border-border/50 bg-background p-4 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">
                                {exam.examTitle}
                              </h4>
                              <span className="text-sm text-muted-foreground">
                                •
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {exam.subject}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {exam.lastSubmissionAt}
                              </div>
                              <span>
                                Graded: {exam.gradedSubmissions} /{" "}
                                {exam.totalSubmissions}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Button size="sm" asChild>
                              <Link
                                href={`/dashboard/examiner/exams/${exam.examId}/grade`}
                              >
                                Grade
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
                <CardFooter className="pb-5">
                  <Button
                    variant="ghost"
                    className="w-full text-sm text-muted-foreground hover:text-foreground"
                    asChild
                  >
                    <Link href="/dashboard/examiner/grading">
                      View All Pending Grading
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {/* All Exams Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Exams</CardTitle>
                    <CardDescription>
                      Manage and monitor your exams
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Select
                      value={examFilter}
                      onValueChange={(value) => setExamFilter(value)}
                    >
                      <SelectTrigger size="sm" className="w-[140px]">
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge variant="secondary" size="lg">
                      {filteredExams.length} exams
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredExams.map((exam, index) => (
                  <motion.div
                    key={exam.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                    className="rounded-lg border border-border/50 p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{exam.title}</h3>
                            {getStatusBadge(exam.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {exam.subject}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              {exam.startTime} • {exam.duration}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Users className="w-4 h-4" />
                              {exam.examinees} examinees
                            </div>
                            <div className="flex items-center gap-1.5">
                              <FileCheck className="w-4 h-4" />
                              {exam.submissions} submissions
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                        <Button variant="outline" size="sm">
                          <Edit className="w-3.5 h-3.5 mr-1.5" />
                          Edit
                        </Button>
                        {exam.status === "draft" && (
                          <Button variant="default" size="sm">
                            <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                            Publish
                          </Button>
                        )}
                        {exam.submissions > 0 && (
                          <>
                            <Button variant="outline" size="sm">
                              <Eye className="w-3.5 h-3.5 mr-1.5" />
                              View Attempts
                            </Button>
                            <Button variant="outline" size="sm">
                              <FileCheck className="w-3.5 h-3.5 mr-1.5" />
                              Grade
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
              <CardFooter className="pb-5">
                <Button
                  variant="ghost"
                  className="w-full text-sm text-muted-foreground hover:text-foreground"
                  asChild
                >
                  <Link href="/dashboard/examiner/exams">View All Exams</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* User Profile Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-lg font-semibold">
                    {mockUser.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{mockUser.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {mockUser.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Submissions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Recent Submissions</CardTitle>
                <CardDescription className="text-xs">
                  Last 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockRecentSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-start justify-between gap-3 text-sm p-3 rounded-md bg-muted/30"
                  >
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="font-medium text-foreground">
                        {submission.examineeName}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {submission.examTitle}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {submission.submittedAt}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-semibold text-primary">
                        {submission.score}
                      </div>
                      <Badge variant="outline" className="text-xs mt-1">
                        {submission.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
