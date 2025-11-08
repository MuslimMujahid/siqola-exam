"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Exam {
  id: number;
  date: string;
  title: string;
}

interface ExamCalendarProps {
  exams: Exam[];
}

export function ExamCalendar({ exams }: ExamCalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  // Check if a date has an exam
  const hasExam = (day: number | null) => {
    if (!day) return false;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    return exams.some((exam) => exam.date === dateStr);
  };

  // Check if a day is today
  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // Navigate to previous month
  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // Get exams for a specific day
  const getExamsForDay = (day: number | null) => {
    if (!day) return [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    return exams.filter((exam) => exam.date === dateStr);
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Exam Schedule</CardTitle>
          <div className="flex items-center gap-1">
            <button
              onClick={previousMonth}
              className="p-1 hover:bg-muted rounded transition-colors"
              aria-label="Previous month"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span className="text-sm font-medium px-2 min-w-[100px] text-center">
              {currentDate.toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
            <button
              onClick={nextMonth}
              className="p-1 hover:bg-muted rounded transition-colors"
              aria-label="Next month"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <div
                key={`${day}-${index}`}
                className="text-xs font-medium text-muted-foreground py-1"
              >
                {day}
              </div>
            ))}
          </div>
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays().map((day, index) => {
              const dayExams = getExamsForDay(day);
              const hasExamOnDay = hasExam(day);
              const isTodayDay = isToday(day);

              return (
                <button
                  key={index}
                  disabled={day === null}
                  title={
                    dayExams.length > 0
                      ? dayExams.map((e) => e.title).join(", ")
                      : undefined
                  }
                  className={`aspect-square rounded-md text-sm transition-colors relative ${
                    day === null
                      ? "invisible"
                      : isTodayDay
                        ? "bg-primary text-primary-foreground font-semibold"
                        : hasExamOnDay
                          ? "bg-primary/20 text-foreground font-medium hover:bg-primary/30"
                          : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {day}
                  {hasExamOnDay && dayExams.length > 1 && (
                    <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-primary rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-4 pt-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-primary"></div>
              <span className="text-muted-foreground">Today</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-primary/20"></div>
              <span className="text-muted-foreground">Has exam</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
