import AdminLayout from "@/components/AdminLayout";
import { Users, CheckCircle, Clock, DollarSign } from "lucide-react";
import { useAdminClients } from "@/hooks/useAdminClients";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { data, isLoading } = useAdminClients();

  if (isLoading || !data) {
    return (
      <AdminLayout>
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">Loading admin dashboard...</div>
      </AdminLayout>
    );
  }

  const activeClients = data.clients.filter((c) => c.status === "active").length;
  const totalRevenue = data.clients.reduce((a, b) => a + b.amountPaid, 0);
  const pendingRevenue = data.clients.reduce((a, b) => a + (b.totalCost - b.amountPaid), 0);

  return (
    <AdminLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-navy">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of all clients and program status.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-5">
          <Users className="h-6 w-6 text-primary" />
          <p className="mt-2 text-2xl font-bold text-foreground">{data.clients.length}</p>
          <p className="text-xs text-muted-foreground">Total Clients</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <CheckCircle className="h-6 w-6 text-secondary" />
          <p className="mt-2 text-2xl font-bold text-foreground">{activeClients}</p>
          <p className="text-xs text-muted-foreground">Active Clients</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <DollarSign className="h-6 w-6 text-primary" />
          <p className="mt-2 text-2xl font-bold text-foreground">KES {totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Total Revenue</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <Clock className="h-6 w-6 text-destructive" />
          <p className="mt-2 text-2xl font-bold text-foreground">KES {pendingRevenue.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Pending Revenue</p>
        </div>
      </div>

      {/* Quick client list */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border"><h3 className="text-lg font-semibold text-navy">Recent Clients</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Client</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Service</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Progress</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Payment</th>
              </tr>
            </thead>
            <tbody>
              {data.clients.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <Link to={`/admin/clients/${c.id}`} className="font-medium text-foreground hover:text-primary">
                      {c.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{c.email}</p>
                  </td>
                  <td className="px-4 py-3 capitalize text-foreground">{c.service.replace("-", " ")}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      c.status === "active" ? "bg-secondary/10 text-secondary" :
                      c.status === "completed" ? "bg-primary/10 text-primary" :
                      "bg-accent/10 text-accent"
                    }`}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${(c.completedSessions / c.totalSessions) * 100}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{c.completedSessions}/{c.totalSessions}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <p className="text-secondary">Paid: KES {c.amountPaid.toLocaleString()}</p>
                    <p className="text-destructive">Pending: KES {(c.totalCost - c.amountPaid).toLocaleString()}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AdminLayout>
  );
};

export default AdminDashboard;
