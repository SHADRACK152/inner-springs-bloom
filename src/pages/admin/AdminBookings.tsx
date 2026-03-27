import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface BookingItem {
  id: string;
  service: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  status: string;
  createdAt: string;
  reviewedAt: string | null;
  convertedClientId: string | null;
}

const AdminBookings = () => {
  const [statusFilter, setStatusFilter] = useState<"pending" | "approved">("pending");
  const [lastProvisioned, setLastProvisioned] = useState<null | {
    name: string;
    email: string;
    password: string;
    clientId: string;
  }>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-bookings", statusFilter],
    queryFn: () => api.get(`/api/admin/bookings?status=${statusFilter}`) as Promise<{ bookings: BookingItem[] }>,
  });

  const handleProvisionClient = async (bookingId: string) => {
    try {
      const payload = await api.post(`/api/admin/bookings/${bookingId}/provision-client`, {} as Record<string, never>) as {
        credentials: {
          name: string;
          email: string;
          password: string;
          clientId: string;
        };
      };
      setLastProvisioned(payload.credentials);
      toast.success("Client profile and login created from booking");
      refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to provision client");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl text-navy">Bookings & Onboarding</h1>
          <p className="text-muted-foreground">Review booking requests and convert approved requests into active client accounts.</p>
        </div>

        <div className="flex gap-2">
          <Button variant={statusFilter === "pending" ? "default" : "outline"} onClick={() => setStatusFilter("pending")}>Pending</Button>
          <Button variant={statusFilter === "approved" ? "default" : "outline"} onClick={() => setStatusFilter("approved")}>Approved</Button>
        </div>

        {lastProvisioned && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
            <p className="font-medium text-foreground">Latest credentials generated</p>
            <p className="text-muted-foreground mt-1">Name: {lastProvisioned.name}</p>
            <p className="text-muted-foreground">Email: {lastProvisioned.email}</p>
            <p className="text-muted-foreground">Password: {lastProvisioned.password}</p>
            <p className="text-muted-foreground">Client ID: {lastProvisioned.clientId}</p>
            <Link to={`/admin/clients/${lastProvisioned.clientId}`} className="text-primary underline">Open client profile</Link>
          </div>
        )}

        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          {isLoading && <p className="text-sm text-muted-foreground">Loading bookings...</p>}

          {(data?.bookings || []).map((b) => (
            <div key={b.id} className="rounded-lg border border-border bg-background p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-sm font-medium text-foreground">{b.name} ({b.service})</p>
                  <p className="text-xs text-muted-foreground">{b.email} • {b.phone}</p>
                  <p className="text-xs text-muted-foreground">Preferred: {b.date} at {b.time}</p>
                  {b.notes && <p className="text-xs text-muted-foreground mt-1">Notes: {b.notes}</p>}
                  {b.convertedClientId && (
                    <Link to={`/admin/clients/${b.convertedClientId}`} className="text-xs text-primary underline mt-1 inline-block">
                      Open linked client profile
                    </Link>
                  )}
                </div>

                {statusFilter === "pending" ? (
                  <Button onClick={() => handleProvisionClient(b.id)} className="h-9">Create Client Login</Button>
                ) : (
                  <span className="text-xs text-secondary font-medium">Approved</span>
                )}
              </div>
            </div>
          ))}

          {!isLoading && (data?.bookings || []).length === 0 && (
            <p className="text-sm text-muted-foreground">No {statusFilter} bookings right now.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
