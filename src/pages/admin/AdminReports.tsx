import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import { AlertCircle, ChartNoAxesCombined, CircleDollarSign, Users } from "lucide-react";

interface AdminClient {
  id: string;
  service: "coaching" | "mental-health" | "training";
  status: "active" | "completed" | "on-hold";
  totalCost: number;
  amountPaid: number;
}

const currency = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 0,
});

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

const AdminReports = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-clients"],
    queryFn: () => api.get("/api/admin/clients") as Promise<{ clients: AdminClient[] }>,
  });

  const summary = useMemo(() => {
    const clients = data?.clients || [];
    const totalClients = clients.length;
    const totalContractValue = clients.reduce((acc, c) => acc + c.totalCost, 0);
    const totalRevenue = clients.reduce((acc, c) => acc + c.amountPaid, 0);
    const pendingRevenue = clients.reduce((acc, c) => acc + (c.totalCost - c.amountPaid), 0);
    const averageRevenuePerClient = totalClients > 0 ? totalRevenue / totalClients : 0;
    const collectionRate = totalContractValue > 0 ? (totalRevenue / totalContractValue) * 100 : 0;

    const byService = [
      {
        key: "coaching",
        label: "Coaching",
        clients: clients.filter((c) => c.service === "coaching"),
      },
      {
        key: "mental-health",
        label: "Mental Health",
        clients: clients.filter((c) => c.service === "mental-health"),
      },
      {
        key: "training",
        label: "Training",
        clients: clients.filter((c) => c.service === "training"),
      },
    ].map((service) => {
      const contractValue = service.clients.reduce((acc, c) => acc + c.totalCost, 0);
      const paidValue = service.clients.reduce((acc, c) => acc + c.amountPaid, 0);
      const pendingValue = contractValue - paidValue;
      const share = totalClients > 0 ? (service.clients.length / totalClients) * 100 : 0;

      return {
        key: service.key,
        label: service.label,
        count: service.clients.length,
        paidValue,
        pendingValue,
        share,
      };
    });

    const byStatus = [
      {
        key: "active",
        label: "Active",
        count: clients.filter((c) => c.status === "active").length,
      },
      {
        key: "completed",
        label: "Completed",
        count: clients.filter((c) => c.status === "completed").length,
      },
      {
        key: "on-hold",
        label: "On Hold",
        count: clients.filter((c) => c.status === "on-hold").length,
      },
    ].map((status) => ({
      ...status,
      share: totalClients > 0 ? (status.count / totalClients) * 100 : 0,
    }));

    const topService = byService.reduce(
      (top, item) => (item.count > top.count ? item : top),
      { label: "N/A", count: 0 },
    );

    return {
      totalClients,
      totalContractValue,
      totalRevenue,
      pendingRevenue,
      averageRevenuePerClient,
      collectionRate,
      byService,
      byStatus,
      topService,
    };
  }, [data]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">Loading reports...</div>
      </AdminLayout>
    );
  }

  if (isError) {
    return (
      <AdminLayout>
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-destructive" />
            <div>
              <h2 className="text-base font-semibold text-foreground">Could not load reports</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {error instanceof Error ? error.message : "An unexpected error occurred while loading admin analytics."}
              </p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (summary.totalClients === 0) {
    return (
      <AdminLayout>
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <Users className="mx-auto h-8 w-8 text-muted-foreground" />
          <h2 className="mt-3 text-lg font-semibold text-foreground">No client data yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Reports will automatically appear here once clients are added to the system.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl text-navy">Admin Reports</h1>
          <p className="text-muted-foreground">Track service mix, payment performance, and operational status in one view.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground">Total Contract Value</p>
            <p className="text-2xl font-bold text-foreground">{currency.format(summary.totalContractValue)}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground">Collected Revenue</p>
            <p className="text-2xl font-bold text-secondary">{currency.format(summary.totalRevenue)}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground">Outstanding Revenue</p>
            <p className="text-2xl font-bold text-destructive">{currency.format(summary.pendingRevenue)}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground">Collection Rate</p>
            <p className="text-2xl font-bold text-foreground">{formatPercent(summary.collectionRate)}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-navy">
              <ChartNoAxesCombined className="h-5 w-5" />
              <h3 className="text-lg">Performance Snapshot</h3>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <p className="text-muted-foreground">Clients: <span className="font-medium text-foreground">{summary.totalClients}</span></p>
              <p className="text-muted-foreground">Top Service: <span className="font-medium text-foreground">{summary.topService.label} ({summary.topService.count})</span></p>
              <p className="text-muted-foreground">Avg. Collected / Client: <span className="font-medium text-foreground">{currency.format(summary.averageRevenuePerClient)}</span></p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-navy">
              <CircleDollarSign className="h-5 w-5" />
              <h3 className="text-lg">Clients By Service</h3>
            </div>
            <div className="mt-4 space-y-4">
              {summary.byService.map((service) => (
                <div key={service.key}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <p className="text-foreground">{service.label}</p>
                    <p className="text-muted-foreground">{service.count} ({formatPercent(service.share)})</p>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${Math.max(service.share, 3)}%` }} />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Collected: {currency.format(service.paidValue)}</span>
                    <span>Pending: {currency.format(service.pendingValue)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-navy">
              <Users className="h-5 w-5" />
              <h3 className="text-lg">Clients By Status</h3>
            </div>
            <div className="mt-4 space-y-4">
              {summary.byStatus.map((status) => (
                <div key={status.key}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <p className="text-foreground">{status.label}</p>
                    <p className="text-muted-foreground">{status.count} ({formatPercent(status.share)})</p>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className={`h-2 rounded-full ${
                        status.key === "active"
                          ? "bg-secondary"
                          : status.key === "completed"
                            ? "bg-primary"
                            : "bg-accent"
                      }`}
                      style={{ width: `${Math.max(status.share, 3)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="text-lg text-navy">Operational Notes</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              {summary.byStatus.find((s) => s.key === "active")?.count || 0} clients are currently active and should be prioritized for session scheduling and reminders.
            </li>
            <li>
              Outstanding balance is {currency.format(summary.pendingRevenue)}. Consider automated reminders for upcoming/past-due payments.
            </li>
            <li>
              {summary.topService.label} currently has the highest enrollment share, which can guide facilitator capacity planning.
            </li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
