"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Notification } from "@/components/dashboard/notification";
import { User, Settings, LogOut } from "lucide-react";

// Mock data - replace with actual API calls
const mockNotifications = [
  {
    id: 1,
    message: "Your Biology Test has been graded",
    type: "grade",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    message: "You are added to Physics Midterm",
    type: "new_exam",
    time: "1 day ago",
    unread: true,
  },
  {
    id: 3,
    message: "Mathematics Final Exam starts in 7 days",
    type: "reminder",
    time: "3 days ago",
    unread: false,
  },
];

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

export default function ExamineeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const newNotificationsCount = mockNotifications.filter(
    (n) => n.unread
  ).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold tracking-tight text-primary">
                SiqolaExam
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {/* Notifications dropdown */}
              <Notification
                newNotificationsCount={newNotificationsCount}
                notifications={mockNotifications}
              />

              {/* User menu dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium hover:bg-primary/20 transition-colors">
                    {mockUser.name.charAt(0)}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="font-semibold text-sm">{mockUser.name}</div>
                    <div className="text-xs text-muted-foreground font-normal mt-0.5">
                      {mockUser.email}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/examinee/profile"
                      className="cursor-pointer"
                    >
                      <User className="w-4 h-4" />
                      View Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/examinee/settings"
                      className="cursor-pointer"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => {
                      // Handle logout
                      window.location.href = "/login";
                    }}
                    className="cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">{children}</main>
    </div>
  );
}
