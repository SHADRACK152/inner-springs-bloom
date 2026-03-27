import DashboardLayout from "@/components/DashboardLayout";
import { Calendar, CheckCircle, Clock, CreditCard, AlertCircle, TrendingUp } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";

const Dashboard = () => {
  const { data, isLoading } = useDashboardData();

  if (isLoading || !data) {
    return (
      <DashboardLayout>
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">Loading dashboard...</div>
      </DashboardLayout>
    );
  }

  const completed = data.sessions.filter((s) => s.status === "completed").length;
  const pending = data.sessions.filter((s) => s.status === "pending").length;
  const totalPaid = data.payments.filter((p) => p.status === "paid").reduce((a, b) => a + b.amount, 0);
  const totalPending = data.payments.filter((p) => p.status === "pending").reduce((a, b) => a + b.amount, 0);
  const unreadNotifs = data.notifications.filter((n) => !n.read).length;

  const stats = [
    { icon: CheckCircle, label: "Sessions Completed", value: completed, color: "text-secondary" },
    { icon: Clock, label: "Sessions Pending", value: pending, color: "text-accent" },
    { icon: CreditCard, label: "Amount Paid", value: `KES ${totalPaid.toLocaleString()}`, color: "text-primary" },
    { icon: AlertCircle, label: "Amount Pending", value: `KES ${totalPending.toLocaleString()}`, color: "text-destructive" },
  ];

  return (
    <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-navy">Welcome back, {data.client.name.split(" ")[0]}</h1>
        <p className="text-muted-foreground">Here's an overview of your coaching journey.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-semibold text-foreground">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Progress */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-xl text-navy flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> Journey Progress</h3>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Completed</span>
              <span className="font-medium text-foreground">{completed}/{completed + pending} sessions</span>
            </div>
            <div className="mt-2 h-3 w-full rounded-full bg-muted">
              <div className="h-3 rounded-full bg-primary transition-all" style={{ width: `${(completed / (completed + pending)) * 100}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{Math.round((completed / (completed + pending)) * 100)}% complete</p>
          </div>
        </div>

        {/* Upcoming */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-xl text-navy flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" /> Upcoming Sessions</h3>
          <div className="mt-4 space-y-3">
            {data.sessions.filter((s) => s.status === "pending").slice(0, 3).map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.date} at {s.time}</p>
                </div>
                <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs text-accent font-medium">Pending</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      {unreadNotifs > 0 && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-xl text-navy">Unread Notifications</h3>
          <div className="mt-4 space-y-3">
            {data.notifications.filter((n) => !n.read).map((n) => (
              <div key={n.id} className="flex items-start gap-3 rounded-lg bg-primary/5 border border-primary/10 p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <AlertCircle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </DashboardLayout>
  );
};

export default Dashboard;
