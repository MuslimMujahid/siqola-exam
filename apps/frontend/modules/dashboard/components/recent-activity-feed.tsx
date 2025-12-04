"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Activity {
  id: number;
  type: string;
  message: string;
  time: string;
  icon: LucideIcon;
}

interface RecentActivityFeedProps {
  activities: Activity[];
}

export function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
          <CardDescription>Peristiwa terbaru di institusi Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
        <div className="pt-4 pb-5 px-6">
          <Button
            variant="ghost"
            className="w-full text-sm text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link href="/dashboard/activity">Lihat Semua Log Aktivitas</Link>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
