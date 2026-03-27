import DashboardLayout from "@/components/DashboardLayout";
import { CheckCircle, Clock, MapPin } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";

const Journey = () => {
  const { data, isLoading } = useDashboardData();

  if (isLoading || !data) {
    return (
      <DashboardLayout>
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">Loading journey...</div>
      </DashboardLayout>
    );
  }

  const completed = data.sessions.filter((s) => s.status === "completed");
  const pending = data.sessions.filter((s) => s.status === "pending");

  return (
    <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-navy">My Journey</h1>
        <p className="text-muted-foreground">Track your progress through your coaching program.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <CheckCircle className="mx-auto h-8 w-8 text-secondary" />
          <p className="mt-2 text-3xl font-bold text-foreground">{completed.length}</p>
          <p className="text-sm text-muted-foreground">Sessions Completed</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <Clock className="mx-auto h-8 w-8 text-accent" />
          <p className="mt-2 text-3xl font-bold text-foreground">{pending.length}</p>
          <p className="text-sm text-muted-foreground">Sessions Pending</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-xl text-navy mb-6">Journey Timeline</h3>
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
          <div className="space-y-6">
            {data.sessions.map((s) => (
              <div key={s.id} className="relative flex items-start gap-4 pl-12">
                <div className={`absolute left-3.5 flex h-3.5 w-3.5 items-center justify-center rounded-full ring-4 ring-card ${
                  s.status === "completed" ? "bg-secondary" : "bg-border"
                }`} />
                <div className="flex-1 rounded-lg border border-border bg-background p-4">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Session {s.sessionNumber}: {s.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{s.date} at {s.time}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      s.status === "completed"
                        ? "bg-secondary/10 text-secondary"
                        : "bg-accent/10 text-accent"
                    }`}>
                      {s.status === "completed" ? "Completed" : "Pending"}
                    </span>
                  </div>
                  {s.achievements && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">Achievement:</span> {s.achievements}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
  );
};

export default Journey;
