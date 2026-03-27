import DashboardLayout from "@/components/DashboardLayout";
import { Mail, MessageSquare, Bell, CheckCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useNotificationCenter } from "@/hooks/useNotificationCenter";

const iconMap = { email: Mail, sms: MessageSquare, system: Bell };

const Notifications = () => {
  const navigate = useNavigate();
  const { notifications, isLoading, markAsRead, markAllAsRead } = useNotificationCenter();
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");

  const filtered = useMemo(() => {
    if (filter === "read") return notifications.filter((item) => item.read);
    if (filter === "unread") return notifications.filter((item) => !item.read);
    return notifications;
  }, [filter, notifications]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">Loading notifications...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-navy">Notifications</h1>
        <p className="text-muted-foreground">All activity notifications across your onboarding and coaching journey.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>All</Button>
        <Button variant={filter === "unread" ? "default" : "outline"} size="sm" onClick={() => setFilter("unread")}>Unread</Button>
        <Button variant={filter === "read" ? "default" : "outline"} size="sm" onClick={() => setFilter("read")}>Read</Button>
        <Button variant="ghost" size="sm" onClick={() => markAllAsRead()}>Mark all read</Button>
      </div>

      <div className="space-y-3">
        {filtered.map((n) => {
          const Icon = iconMap[n.type] || Bell;
          return (
            <div key={n.id} className={`rounded-lg border p-4 transition-colors ${
              n.read ? "border-border bg-card" : "border-primary/20 bg-primary/5"
            }`}>
              <div className="flex items-start gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  n.read ? "bg-muted" : "bg-primary/10"
                }`}>
                  <Icon className={`h-4 w-4 ${n.read ? "text-muted-foreground" : "text-primary"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleDateString()}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium ${
                        n.type === "email" ? "bg-primary/10 text-primary" : n.type === "sms" ? "bg-secondary/10 text-secondary" : "bg-accent/10 text-accent"
                      }`}>{n.type}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    {n.actionPath && (
                      <Button size="sm" variant="outline" onClick={() => {
                        markAsRead(n.id);
                        navigate(n.actionPath || "/dashboard/notifications");
                      }}>
                        {n.actionLabel || "Open"}
                      </Button>
                    )}
                    {!n.read && (
                      <Button size="sm" variant="ghost" onClick={() => markAsRead(n.id)}>
                        Mark read
                      </Button>
                    )}
                  </div>
                  {!n.read && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Unread
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">No notifications in this filter.</div>
        )}
      </div>
    </div>
  </DashboardLayout>
  );
};

export default Notifications;
