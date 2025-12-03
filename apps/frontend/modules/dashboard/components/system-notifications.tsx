"use client";

import { motion } from "framer-motion";
import { CheckCircle, FileText, AlertCircle, Clock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Notification {
  id: number;
  type: "success" | "info" | "warning" | "reminder";
  message: string;
  time: string;
}

interface SystemNotificationsProps {
  notifications: Notification[];
}

export function SystemNotifications({
  notifications,
}: SystemNotificationsProps) {
  const iconMap = {
    success: CheckCircle,
    info: FileText,
    warning: AlertCircle,
    reminder: Clock,
  };

  const colorMap = {
    success: "text-green-500",
    info: "text-blue-500",
    warning: "text-yellow-500",
    reminder: "text-purple-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Notifikasi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.map((notification) => {
            const Icon = iconMap[notification.type];
            const iconColor = colorMap[notification.type];

            return (
              <div
                key={notification.id}
                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/30 transition-colors"
              >
                <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} />
                <div className="flex-1">
                  <p className="text-xs leading-relaxed">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notification.time}
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
