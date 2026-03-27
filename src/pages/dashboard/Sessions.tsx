import DashboardLayout from "@/components/DashboardLayout";
import { CheckCircle, Clock, Calendar } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";

const Sessions = () => {
  const { data, isLoading } = useDashboardData();

  if (isLoading || !data) {
    return (
      <DashboardLayout>
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">Loading sessions...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-navy">Sessions</h1>
        <p className="text-muted-foreground">Detailed view of all your coaching sessions.</p>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">#</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Session</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date & Time</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Cost</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Details</th>
              </tr>
            </thead>
            <tbody>
              {data.sessions.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{s.sessionNumber}</td>
                  <td className="px-4 py-3 text-foreground">{s.title}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" /> {s.date}
                    </div>
                    <div className="text-xs text-muted-foreground">{s.time}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      s.status === "completed" ? "bg-secondary/10 text-secondary" : "bg-accent/10 text-accent"
                    }`}>
                      {s.status === "completed" ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {s.status === "completed" ? "Completed" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground">KES {s.cost.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {s.status === "completed" ? (
                      <div>
                        <p className="text-xs text-muted-foreground"><span className="font-medium">Achieved:</span> {s.achievements}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">Expected: {s.date}</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cost Summary */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-xl text-navy mb-4">Cost Breakdown: Session 1 to Final</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">Total Program Cost</p>
            <p className="text-2xl font-bold text-foreground">KES {(data.sessions.length * 10000).toLocaleString()}</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-secondary/5">
            <p className="text-xs text-muted-foreground">Completed Sessions Cost</p>
            <p className="text-2xl font-bold text-secondary">KES {(data.sessions.filter(s => s.status === "completed").length * 10000).toLocaleString()}</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-accent/5">
            <p className="text-xs text-muted-foreground">Remaining Sessions Cost</p>
            <p className="text-2xl font-bold text-accent">KES {(data.sessions.filter(s => s.status === "pending").length * 10000).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
  );
};

export default Sessions;
