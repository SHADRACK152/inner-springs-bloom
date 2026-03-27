import DashboardLayout from "@/components/DashboardLayout";
import { CheckCircle, Clock, CreditCard } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";

const Payments = () => {
  const { data, isLoading } = useDashboardData();

  if (isLoading || !data) {
    return (
      <DashboardLayout>
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">Loading payments...</div>
      </DashboardLayout>
    );
  }

  const totalCost = data.sessions.length * 10000;
  const paid = data.payments.filter((p) => p.status === "paid");
  const pendingPayments = data.payments.filter((p) => p.status === "pending");
  const totalPaid = paid.reduce((a, b) => a + b.amount, 0);
  const totalPending = pendingPayments.reduce((a, b) => a + b.amount, 0);

  return (
    <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-navy">Payments</h1>
        <p className="text-muted-foreground">Track your coaching program payments.</p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-5 text-center">
          <CreditCard className="mx-auto h-6 w-6 text-primary" />
          <p className="mt-2 text-xs text-muted-foreground">Total Program Cost</p>
          <p className="text-2xl font-bold text-foreground">KES {totalCost.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5 text-center">
          <CheckCircle className="mx-auto h-6 w-6 text-secondary" />
          <p className="mt-2 text-xs text-muted-foreground">Amount Paid</p>
          <p className="text-2xl font-bold text-secondary">KES {totalPaid.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5 text-center">
          <Clock className="mx-auto h-6 w-6 text-destructive" />
          <p className="mt-2 text-xs text-muted-foreground">Pending Amount</p>
          <p className="text-2xl font-bold text-destructive">KES {totalPending.toLocaleString()}</p>
        </div>
      </div>

      {/* Per-session breakdown */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-navy">Payment per Session</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Session</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Method</th>
              </tr>
            </thead>
            <tbody>
              {data.payments.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">Session {p.sessionNumber}</td>
                  <td className="px-4 py-3 text-foreground">KES {p.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.status === "paid" ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"
                    }`}>
                      {p.status === "paid" ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {p.status === "paid" ? "Paid" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.status === "paid" ? p.date : "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.method || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </DashboardLayout>
  );
};

export default Payments;
