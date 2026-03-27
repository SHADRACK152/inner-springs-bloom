import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminClients } from "@/hooks/useAdminClients";
import { Link } from "react-router-dom";

const AdminClients = () => {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useAdminClients();
  const filtered = (data?.clients || []).filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading || !data) {
    return (
      <AdminLayout>
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">Loading clients...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl text-navy">All Clients</h1>
            <p className="text-muted-foreground">Manage and view all client information.</p>
          </div>
          <Link to="/admin/bookings"><Button>+ Review New Bookings</Button></Link>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="w-full rounded-lg border border-input bg-card pl-10 pr-4 py-2.5 text-sm"
          />
        </div>

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Client</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Phone</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Service</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Sessions</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Joined</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Payment</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.email}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{c.phone}</td>
                    <td className="px-4 py-3 capitalize text-foreground">{c.service.replace("-", " ")}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        c.status === "active" ? "bg-secondary/10 text-secondary" :
                        c.status === "completed" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                      }`}>{c.status}</span>
                    </td>
                    <td className="px-4 py-3 text-foreground">{c.completedSessions}/{c.totalSessions}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.joinDate}</td>
                    <td className="px-4 py-3 text-xs">
                      <p className="text-secondary">KES {c.amountPaid.toLocaleString()}</p>
                      <p className="text-destructive">KES {(c.totalCost - c.amountPaid).toLocaleString()} pending</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link to={`/admin/clients/${c.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                        </Link>
                      </div>
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

export default AdminClients;
