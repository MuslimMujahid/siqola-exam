import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Badge } from "../../../components/ui/badge";
import { Bell } from "lucide-react";
import { ComingSoonWrapper } from "@/components/ui/coming-soon-wrapper";

interface NotificationProps {
  newNotificationsCount: number;
  notifications: {
    id: number;
    message: string;
    time: string;
    unread: boolean;
  }[];
}

export function Notification({
  newNotificationsCount,
  notifications,
}: NotificationProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <Bell className="w-5 h-5" />
          {newNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <ComingSoonWrapper topOffset="top-10">
          <div className="flex items-center justify-between px-2 py-1.5">
            <DropdownMenuLabel className="p-0">Notifikasi</DropdownMenuLabel>
            {newNotificationsCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {newNotificationsCount} baru
              </Badge>
            )}
          </div>
          <DropdownMenuSeparator />
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "flex-col items-start gap-1 py-3 cursor-pointer",
                    notification.unread && "bg-primary/5"
                  )}
                >
                  <div className="flex items-start gap-2 w-full">
                    {notification.unread && (
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"></div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            )}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="justify-center text-primary cursor-pointer">
            Lihat semua notifikasi
          </DropdownMenuItem>
        </ComingSoonWrapper>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
