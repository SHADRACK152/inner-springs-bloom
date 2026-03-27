import { useMemo, useState } from "react";
import { Bell, Mail, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { useNotificationCenter } from "@/hooks/useNotificationCenter";

const iconMap = { email: Mail, sms: MessageSquare, system: Bell };

const AdminNotifications = () => {
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
      <AdminLayout>
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">Loading notifications...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl text-navy">Notifications</h1>
          <p className="text-muted-foreground">General activity feed across all client and admin actions.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>All</Button>
          <Button variant={filter === "unread" ? "default" : "outline"} size="sm" onClick={() => setFilter("unread")}>Unread</Button>
          <Button variant={filter === "read" ? "default" : "outline"} size="sm" onClick={() => setFilter("read")}>Read</Button>
          <Button variant="ghost" size="sm" onClick={() => markAllAsRead()}>Mark all read</Button>
        </div>

        <div className="space-y-3">
          {filtered.map((item) => {
            const Icon = iconMap[item.type] || Bell;
            return (
              <div key={item.id} className={`rounded-lg border p-4 ${item.read ? "border-border bg-card" : "border-primary/20 bg-primary/5"}`}>
                <div className="flex items-start gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full ${item.read ? "bg-muted" : "bg-primary/10"}`}>
                    <Icon className={`h-4 w-4 ${item.read ? "text-muted-foreground" : "text-primary"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.message}</p>
                        {item.relatedClientName && <p className="mt-1 text-[11px] text-muted-foreground">Client: {item.relatedClientName}</p>}
                      </div>
                      <span className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</span>
                    </div>

                    <div className="mt-3 flex gap-2">
                      {item.actionPath && (
                        <Button size="sm" variant="outline" onClick={() => {
                          markAsRead(item.id);
                          navigate(item.actionPath || "/admin/notifications");
                        }}>
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
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">No notifications in this filter.</div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;
