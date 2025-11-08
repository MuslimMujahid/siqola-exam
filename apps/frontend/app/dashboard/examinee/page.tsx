"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExamCalendar } from "@/components/dashboard/exam-calendar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, Eye, EyeOff, Building2 } from "lucide-react";

// Mock data - replace with actual API calls
const mockExams = {
  upcoming: [
    {
      id: 1,
      title: "Mathematics Final Exam",
      subject: "Mathematics",
      date: "2025-11-15",
      time: "09:00 AM",
      duration: "2 hours",
      instructor: "Dr. Smith",
      status: "upcoming",
    },
    {
      id: 2,
      title: "Physics Midterm",
      subject: "Physics",
      date: "2025-11-18",
      time: "02:00 PM",
      duration: "1.5 hours",
      instructor: "Prof. Johnson",
      status: "upcoming",
    },
  ],
  ongoing: [
    {
      id: 3,
      title: "Chemistry Quiz",
      subject: "Chemistry",
      date: "2025-11-08",
      time: "10:00 AM",
      duration: "1 hour",
      instructor: "Dr. Brown",
      timeRemaining: "45 minutes",
      status: "ongoing",
    },
  ],
  completed: [
    {
      id: 4,
      title: "Biology Test",
      subject: "Biology",
      date: "2025-11-05",
      time: "11:00 AM",
      duration: "1 hour",
      instructor: "Dr. Davis",
      score: "85%",
      grade: "B+",
      status: "completed",
    },
    {
      id: 5,
      title: "History Essay Exam",
      subject: "History",
      date: "2025-11-02",
      time: "01:00 PM",
      duration: "2 hours",
      instructor: "Prof. Wilson",
      score: "92%",
      grade: "A",
      status: "completed",
    },
  ],
};

const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  institutions: [
    { id: 1, name: "ABC University", studentId: "STU-2024-001" },
    { id: 2, name: "Tech Institute", studentId: "TI-2024-045" },
    { id: 3, name: "Online Academy", studentId: "OA-2024-189" },
  ],
  enrolledCourses: 5,
  completedExams: 12,
};

export default function ExamineeDashboard() {
  const [visibleGrades, setVisibleGrades] = useState<Record<number, boolean>>(
    {}
  );
  const [examFilter, setExamFilter] = useState<"all" | number>("all");

  // Prepare exam data for calendar
  const calendarExams = [...mockExams.upcoming, ...mockExams.ongoing].map(
    (exam) => ({
      id: exam.id,
      date: exam.date,
      title: exam.title,
    })
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Ongoing Exams - Most Prominent */}
        {mockExams.ongoing.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Ongoing Exam</CardTitle>
                    <CardDescription>Complete your exam now</CardDescription>
                  </div>
                  <Badge size="lg">Active</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockExams.ongoing.map((exam) => (
                  <div
                    key={exam.id}
                    className="rounded-lg border border-border/50 bg-background p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{exam.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {exam.subject} • {exam.instructor}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-destructive">
                          {exam.timeRemaining} left
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {exam.duration} total
                        </div>
                      </div>
                    </div>
                    <Button className="w-full" size="sm">
                      Start Exam
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Upcoming Exams - Highlighted */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upcoming Exams</CardTitle>
                  <CardDescription>Your scheduled examinations</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Select
                    value={examFilter.toString()}
                    onValueChange={(value) =>
                      setExamFilter(value === "all" ? "all" : parseInt(value))
                    }
                  >
                    <SelectTrigger size="sm" className="w-[180px]">
                      <SelectValue placeholder="All Institutions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Institutions</SelectItem>
                      {mockUser.institutions.map((inst) => (
                        <SelectItem key={inst.id} value={inst.id.toString()}>
                          {inst.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Badge variant="secondary" size="lg">
                    {mockExams.upcoming.length} exams
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockExams.upcoming.map((exam, index) => (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  className="rounded-lg border border-border/50 p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div>
                        <h3 className="font-semibold">{exam.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {exam.subject} • {exam.instructor}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {exam.date}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {exam.time} • {exam.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Completed Exams */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Completed Exams</CardTitle>
              <CardDescription>Your exam history and grades</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockExams.completed.map((exam) => (
                <div
                  key={exam.id}
                  className="rounded-lg border border-border/50 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <h3 className="font-medium">{exam.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {exam.subject} • {exam.date}
                      </p>
                    </div>
                    {visibleGrades[exam.id] ? (
                      <div className="flex items-start gap-3">
                        <div className="text-right">
                          <div className="text-lg font-semibold text-primary">
                            {exam.score}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Grade: {exam.grade}
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            setVisibleGrades((prev) => ({
                              ...prev,
                              [exam.id]: false,
                            }))
                          }
                          className="p-1.5 rounded-md hover:bg-muted/50 transition-colors text-muted-foreground"
                          title="Hide grade"
                        >
                          <EyeOff className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          setVisibleGrades((prev) => ({
                            ...prev,
                            [exam.id]: true,
                          }))
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-border/50 hover:bg-muted/50 transition-colors text-muted-foreground"
                      >
                        <Eye className="w-4 h-4" />
                        View Grade
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Right Column - Sidebar */}
      <div className="space-y-6">
        {/* User Profile Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
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
                    {mockUser.email}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Institutions
                </div>
                <div className="space-y-2">
                  {mockUser.institutions.map((institution) => (
                    <div
                      key={institution.id}
                      className="flex items-start gap-2 text-sm p-2 rounded-md bg-muted/30"
                    >
                      <Building2 className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground">
                          {institution.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ID: {institution.studentId}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Calendar View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <ExamCalendar exams={calendarExams} />
        </motion.div>
      </div>
    </div>
  );
}
