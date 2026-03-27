import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Save, Plus } from "lucide-react";
import { useAdminClients } from "@/hooks/useAdminClients";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { AdminInputField, AdminSelectField, AdminTextAreaField } from "@/components/admin/AdminFormFields";

const AdminManage = () => {
  const [selectedClient, setSelectedClient] = useState("c1");
  const [dataType, setDataType] = useState<"session" | "document" | "payment" | "notification">("session");
  const { data, isLoading, refetch } = useAdminClients();
  const [sessionForm, setSessionForm] = useState({ title: "", sessionNumber: "", date: "", time: "", status: "pending", cost: "", notes: "", achievements: "" });
  const [documentForm, setDocumentForm] = useState({ title: "", type: "report", sessionRelated: "", fileSize: "N/A" });
  const [paymentForm, setPaymentForm] = useState({ sessionNumber: "", amount: "", method: "M-Pesa", date: "" });
  const [notificationForm, setNotificationForm] = useState({ title: "", type: "email", message: "" });

  if (isLoading || !data) {
    return (
      <AdminLayout>
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">Loading admin tools...</div>
      </AdminLayout>
    );
  }

  const clients = data.clients;

  const handleSessionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/api/admin/clients/${selectedClient}/sessions`, sessionForm);
      setSessionForm({ title: "", sessionNumber: "", date: "", time: "", status: "pending", cost: "", notes: "", achievements: "" });
      toast.success("Session added");
      refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add session");
    }
  };

  const handleDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/api/admin/clients/${selectedClient}/documents`, {
        ...documentForm,
        sessionRelated: documentForm.sessionRelated ? Number(documentForm.sessionRelated) : null,
      });
      setDocumentForm({ title: "", type: "report", sessionRelated: "", fileSize: "N/A" });
      toast.success("Document added");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add document");
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/api/admin/clients/${selectedClient}/payments`, paymentForm);
      setPaymentForm({ sessionNumber: "", amount: "", method: "M-Pesa", date: "" });
      toast.success("Payment recorded");
      refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to record payment");
    }
  };

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/api/admin/clients/${selectedClient}/notifications`, notificationForm);
      setNotificationForm({ title: "", type: "email", message: "" });
      toast.success("Notification sent");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to send notification");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-3xl text-navy">Client Data Workspace</h1>
          <p className="text-muted-foreground">Manage sessions, documents, payments, and notifications for selected clients.</p>
        </div>

        {/* Client selector */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-medium text-foreground">Select Client</label>
            <Link to={`/admin/clients/${selectedClient}`}>
              <Button variant="outline" className="h-8">Open Client Profile</Button>
            </Link>
          </div>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm"
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name} — {c.service}</option>
            ))}
          </select>
        </div>

        {/* Data type tabs */}
        <div className="flex gap-2 flex-wrap">
          {(["session", "document", "payment", "notification"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setDataType(t)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
                dataType === t ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border hover:bg-muted"
              }`}
            >{t}</button>
          ))}
        </div>

        {/* Forms */}
        <div className="rounded-lg border border-border bg-card p-6">
          {dataType === "session" && (
            <form className="space-y-4" onSubmit={handleSessionSubmit}>
              <h3 className="text-lg font-semibold text-navy">Add Session</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <AdminInputField label="Session Title" value={sessionForm.title} onChange={(value) => setSessionForm({ ...sessionForm, title: value })} placeholder="e.g., Resilience Building" />
                <AdminInputField label="Session Number" value={sessionForm.sessionNumber} onChange={(value) => setSessionForm({ ...sessionForm, sessionNumber: value })} type="number" placeholder="8" />
                <AdminInputField label="Date" value={sessionForm.date} onChange={(value) => setSessionForm({ ...sessionForm, date: value })} type="date" />
                <AdminInputField label="Time" value={sessionForm.time} onChange={(value) => setSessionForm({ ...sessionForm, time: value })} type="time" />
                <AdminSelectField
                  label="Status"
                  value={sessionForm.status}
                  onChange={(value) => setSessionForm({ ...sessionForm, status: value })}
                  options={[{ value: "completed", label: "completed" }, { value: "pending", label: "pending" }]}
                />
                <AdminInputField label="Cost (KES)" value={sessionForm.cost} onChange={(value) => setSessionForm({ ...sessionForm, cost: value })} type="number" placeholder="10000" />
              </div>
              <AdminTextAreaField label="Notes" value={sessionForm.notes} onChange={(value) => setSessionForm({ ...sessionForm, notes: value })} placeholder="Session notes..." rows={3} />
              <AdminTextAreaField label="Achievements" value={sessionForm.achievements} onChange={(value) => setSessionForm({ ...sessionForm, achievements: value })} placeholder="Key achievements..." rows={2} />
              <Button type="submit" className="gap-2"><Plus className="h-4 w-4" /> Add Session</Button>
            </form>
          )}

          {dataType === "document" && (
            <form className="space-y-4" onSubmit={handleDocumentSubmit}>
              <h3 className="text-lg font-semibold text-navy">Add Document</h3>
              <AdminInputField label="Document Title" value={documentForm.title} onChange={(value) => setDocumentForm({ ...documentForm, title: value })} placeholder="e.g., Coaching Log Session 8" />
              <div className="grid gap-4 sm:grid-cols-2">
                <AdminSelectField
                  label="Type"
                  value={documentForm.type}
                  onChange={(value) => setDocumentForm({ ...documentForm, type: value })}
                  options={[
                    { value: "report", label: "report" },
                    { value: "agreement", label: "agreement" },
                    { value: "certificate", label: "certificate" },
                    { value: "assessment", label: "assessment" },
                  ]}
                />
                <AdminInputField label="Related Session #" value={documentForm.sessionRelated} onChange={(value) => setDocumentForm({ ...documentForm, sessionRelated: value })} type="number" />
              </div>
              <AdminInputField label="File Size" value={documentForm.fileSize} onChange={(value) => setDocumentForm({ ...documentForm, fileSize: value })} />
              <Button type="submit" className="gap-2"><Plus className="h-4 w-4" /> Add Document</Button>
            </form>
          )}

          {dataType === "payment" && (
            <form className="space-y-4" onSubmit={handlePaymentSubmit}>
              <h3 className="text-lg font-semibold text-navy">Record Payment</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <AdminInputField label="Session Number" value={paymentForm.sessionNumber} onChange={(value) => setPaymentForm({ ...paymentForm, sessionNumber: value })} type="number" />
                <AdminInputField label="Amount (KES)" value={paymentForm.amount} onChange={(value) => setPaymentForm({ ...paymentForm, amount: value })} type="number" placeholder="10000" />
                <AdminSelectField
                  label="Payment Method"
                  value={paymentForm.method}
                  onChange={(value) => setPaymentForm({ ...paymentForm, method: value })}
                  options={[
                    { value: "M-Pesa", label: "M-Pesa" },
                    { value: "Bank Transfer", label: "Bank Transfer" },
                    { value: "Cash", label: "Cash" },
                  ]}
                />
                <AdminInputField label="Date" value={paymentForm.date} onChange={(value) => setPaymentForm({ ...paymentForm, date: value })} type="date" />
              </div>
              <Button type="submit" className="gap-2"><Plus className="h-4 w-4" /> Record Payment</Button>
            </form>
          )}

          {dataType === "notification" && (
            <form className="space-y-4" onSubmit={handleNotificationSubmit}>
              <h3 className="text-lg font-semibold text-navy">Send Notification</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <AdminInputField label="Title" value={notificationForm.title} onChange={(value) => setNotificationForm({ ...notificationForm, title: value })} placeholder="Session Reminder" />
                <AdminSelectField
                  label="Type"
                  value={notificationForm.type}
                  onChange={(value) => setNotificationForm({ ...notificationForm, type: value })}
                  options={[
                    { value: "email", label: "email" },
                    { value: "sms", label: "sms" },
                    { value: "system", label: "system" },
                  ]}
                />
              </div>
              <AdminTextAreaField label="Message" value={notificationForm.message} onChange={(value) => setNotificationForm({ ...notificationForm, message: value })} rows={4} placeholder="Notification message..." />
              <Button type="submit" className="gap-2"><Save className="h-4 w-4" /> Send Notification</Button>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminManage;
