import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotificationCenter } from "@/hooks/useNotificationCenter";

interface NotificationBellProps {
  fullPagePath: string;
}

const NotificationBell = ({ fullPagePath }: NotificationBellProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { latestFive, unreadCount, markAsRead, markAllAsRead } = useNotificationCenter();

  const handleAction = (notificationId: string, actionPath: string | null) => {
    markAsRead(notificationId);
    setOpen(false);
    if (actionPath) {
      navigate(actionPath);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-md p-1 text-muted-foreground hover:bg-muted"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] text-destructive-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-96 rounded-lg border border-border bg-card shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-foreground">Notifications</p>
            <button type="button" onClick={() => markAllAsRead()} className="text-xs text-primary hover:underline">
              Mark all read
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {latestFive.length === 0 && (
              <p className="px-4 py-6 text-sm text-muted-foreground">No notifications yet.</p>
            )}

            {latestFive.map((item) => (
              <div key={item.id} className="border-b border-border px-4 py-3 last:border-b-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.message}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                  {!item.read && <span className="mt-1 h-2 w-2 rounded-full bg-primary" />}
                </div>

                <div className="mt-2 flex gap-2">
                  {item.actionPath && (
                    <Button size="sm" variant="outline" onClick={() => handleAction(item.id, item.actionPath)}>
                      {item.actionLabel || "Open"}
                    </Button>
                  )}
                  {!item.read && (
                    <Button size="sm" variant="ghost" onClick={() => markAsRead(item.id)}>
                      Mark read
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border px-4 py-2">
            <Link to={fullPagePath} onClick={() => setOpen(false)} className="text-sm text-primary hover:underline">
              View more
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
