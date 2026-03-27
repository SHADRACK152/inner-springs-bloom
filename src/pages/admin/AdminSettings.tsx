import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { UserPlus, Shield, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const AdminSettings = () => {
  const [form, setForm] = useState({ name: "", email: "", role: "Admin", password: "" });
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => api.get("/api/admin/admins") as Promise<{ admins: AdminUser[] }>,
  });

  const admins = data?.admins || [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/admin/admins", form);
      setForm({ name: "", email: "", role: "Admin", password: "" });
      toast.success("Admin added");
      refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add admin");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/admin/admins/${id}`);
      toast.success("Admin removed");
      refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to remove admin");
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">Loading admin settings...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-3xl text-navy">Admin Settings</h1>
          <p className="text-muted-foreground">Manage administrators and portal settings.</p>
        </div>

        {/* Existing Admins */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-navy flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" /> Administrators
          </h3>
          <p className="text-sm text-muted-foreground mt-1">The portal supports multiple administrators.</p>
          <div className="mt-4 space-y-3">
            {admins.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-xs font-bold text-navy-foreground">
                    {a.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{a.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    a.role === "Super Admin" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                  }`}>{a.role}</span>
                  <Button onClick={() => handleDelete(a.id)} variant="ghost" size="icon" className="h-8 w-8"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Admin */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-navy flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" /> Add New Admin
          </h3>
          <form className="mt-4 space-y-4" onSubmit={handleCreate}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm" placeholder="New admin name" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Email</label>
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm" placeholder="admin@innersprings.africa" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm">
                <option>Admin</option><option>Super Admin</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Temporary Password</label>
              <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm" placeholder="••••••••" />
            </div>
            <Button type="submit" className="gap-2"><UserPlus className="h-4 w-4" /> Add Administrator</Button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
