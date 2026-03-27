import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface ClientDetailsPayload {
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
    service: "coaching" | "mental-health" | "training";
    status: "active" | "completed" | "on-hold";
    joinDate: string;
    totalSessions: number;
    completedSessions: number;
    totalCost: number;
    amountPaid: number;
  };
  account: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
  } | null;
  sessions: Array<{
    id: string;
    title: string;
    sessionNumber: number;
    date: string;
    time: string;
    status: "completed" | "pending" | "cancelled";
    cost: number;
  }>;
  documents: Array<{
    id: string;
    title: string;
    type: string;
    dateAdded: string;
    fileSize: string;
  }>;
  notifications: Array<{
    id: string;
    title: string;
    type: string;
    date: string;
    read: boolean;
  }>;
  payments: Array<{
    id: string;
    sessionNumber: number;
    amount: number;
    status: "paid" | "pending";
    method: string;
    date: string;
  }>;
  intakeForm: {
    id: string;
    clientId: string;
    goals: string;
    challenges: string;
    history: string;
    preferredStyle: string;
    availability: string;
    consent: boolean;
    status: "draft" | "submitted" | "reviewed";
    coachReviewRequired: boolean;
    completedAt: string | null;
    coachReviewedAt: string | null;
    updatedAt: string;
  } | null;
  proposal: {
    id: string;
    clientId: string;
    objectives: string;
    durationSessions: number;
    frequency: "weekly" | "bi-weekly";
    investment: number;
    expectedOutcomes: string;
    status: "draft" | "sent" | "accepted" | "rejected";
    generatedAt: string;
    sentAt: string | null;
    dueBy: string;
    reviewedAt: string | null;
  } | null;
  consentAgreement: {
    id: string;
    clientId: string;
    proposalId: string;
    agreementDocId: string | null;
    consented: boolean;
    consentedAt: string | null;
    signatureRequestedAt: string | null;
    signed: boolean;
    signatureName: string | null;
    signedAt: string | null;
    status: "pending" | "consented" | "signed";
  } | null;
}

const AdminClientDetails = () => {
  const { clientId } = useParams();
  const queryClient = useQueryClient();
  const [sessionForm, setSessionForm] = useState({ title: "", sessionNumber: "", date: "", time: "", status: "pending", cost: "", notes: "", achievements: "" });
  const [paymentForm, setPaymentForm] = useState({ sessionNumber: "", amount: "", method: "M-Pesa", date: "" });
  const [documentForm, setDocumentForm] = useState({ title: "", type: "report", sessionRelated: "", fileSize: "N/A" });
  const [notificationForm, setNotificationForm] = useState({ title: "", type: "email", message: "" });
  const [proposalForm, setProposalForm] = useState({
    objectives: "",
    durationSessions: "12",
    frequency: "weekly",
    investment: "120000",
    expectedOutcomes: "",
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-client-details", clientId],
    queryFn: () => api.get(`/api/admin/clients/${clientId}`) as Promise<ClientDetailsPayload>,
    enabled: Boolean(clientId),
  });

  const pendingAmount = useMemo(() => {
    if (!data) return 0;
    return data.client.totalCost - data.client.amountPaid;
  }, [data]);

  const refreshAll = async () => {
    await refetch();
    await queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
  };

  const addSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return;
    try {
      await api.post(`/api/admin/clients/${clientId}/sessions`, sessionForm);
      setSessionForm({ title: "", sessionNumber: "", date: "", time: "", status: "pending", cost: "", notes: "", achievements: "" });
      toast.success("Session added");
      await refreshAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add session");
    }
  };

  const addPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return;
    try {
      await api.post(`/api/admin/clients/${clientId}/payments`, paymentForm);
      setPaymentForm({ sessionNumber: "", amount: "", method: "M-Pesa", date: "" });
      toast.success("Payment recorded");
      await refreshAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to record payment");
    }
  };

  const addDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return;
    try {
      await api.post(`/api/admin/clients/${clientId}/documents`, {
        ...documentForm,
        sessionRelated: documentForm.sessionRelated ? Number(documentForm.sessionRelated) : null,
      });
      setDocumentForm({ title: "", type: "report", sessionRelated: "", fileSize: "N/A" });
      toast.success("Document added");
      await refreshAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add document");
    }
  };

  const addNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return;
    try {
      await api.post(`/api/admin/clients/${clientId}/notifications`, notificationForm);
      setNotificationForm({ title: "", type: "email", message: "" });
      toast.success("Notification sent");
      await refreshAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to send notification");
    }
  };

  const markIntakeReviewed = async () => {
    if (!clientId) return;
    try {
      await api.post(`/api/admin/clients/${clientId}/intake-form/review`, {} as Record<string, never>);
      toast.success("Intake form marked as reviewed");
      await refreshAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to mark intake as reviewed");
    }
  };

  const generateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return;
    try {
      await api.post(`/api/admin/clients/${clientId}/proposal`, {
        ...proposalForm,
        durationSessions: Number(proposalForm.durationSessions),
        investment: Number(proposalForm.investment),
      });
      toast.success("Coaching proposal generated and sent to client portal");
      await refreshAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to generate proposal");
    }
  };

  if (isLoading || !data) {
    return (
      <AdminLayout>
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">Loading client profile...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl text-navy">{data.client.name}</h1>
            <p className="text-muted-foreground">Client profile and tracking workspace</p>
          </div>
          <Link to="/admin/clients"><Button variant="outline">Back to Clients</Button></Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Service</p>
            <p className="text-sm font-medium capitalize text-foreground">{data.client.service.replace("-", " ")}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Session Progress</p>
            <p className="text-sm font-medium text-foreground">{data.client.completedSessions}/{data.client.totalSessions}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Amount Paid</p>
            <p className="text-sm font-medium text-secondary">KES {data.client.amountPaid.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Amount Pending</p>
            <p className="text-sm font-medium text-destructive">KES {pendingAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-5 space-y-2">
            <h3 className="text-lg text-navy">Identity & Login</h3>
            <p className="text-sm text-muted-foreground">Email: {data.client.email}</p>
            <p className="text-sm text-muted-foreground">Phone: {data.client.phone}</p>
            <p className="text-sm text-muted-foreground">Status: {data.client.status}</p>
            <p className="text-sm text-muted-foreground">Joined: {data.client.joinDate}</p>
            {data.account && <p className="text-sm text-muted-foreground">User ID: {data.account.id}</p>}
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-lg text-navy">Recent Activity</h3>
            <p className="text-sm text-muted-foreground mt-2">Sessions: {data.sessions.length}</p>
            <p className="text-sm text-muted-foreground">Documents: {data.documents.length}</p>
            <p className="text-sm text-muted-foreground">Payments: {data.payments.length}</p>
            <p className="text-sm text-muted-foreground">Notifications: {data.notifications.length}</p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5 space-y-3">
          <h3 className="text-lg text-navy">Intake Form & Coach Review</h3>
          {!data.intakeForm && <p className="text-sm text-muted-foreground">No intake form created yet.</p>}
          {data.intakeForm && (
            <>
              <p className="text-sm text-muted-foreground">Status: <span className="font-medium text-foreground">{data.intakeForm.status}</span></p>
              <p className="text-sm text-muted-foreground">Coach review flag: <span className="font-medium text-foreground">{data.intakeForm.coachReviewRequired ? "Required" : "Cleared"}</span></p>
              <p className="text-sm text-muted-foreground">Consent: <span className="font-medium text-foreground">{data.intakeForm.consent ? "Given" : "Pending"}</span></p>
              {data.intakeForm.goals && <p className="text-sm text-muted-foreground">Goals: {data.intakeForm.goals}</p>}
              {data.intakeForm.challenges && <p className="text-sm text-muted-foreground">Challenges: {data.intakeForm.challenges}</p>}
              <div>
                <Button
                  onClick={markIntakeReviewed}
                  disabled={!data.intakeForm.coachReviewRequired}
                >
                  Mark Intake as Reviewed
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <form onSubmit={generateProposal} className="rounded-lg border border-border bg-card p-5 space-y-3">
            <h3 className="text-lg text-navy">Step 5: Generate Coaching Proposal</h3>
            <textarea value={proposalForm.objectives} onChange={(e) => setProposalForm({ ...proposalForm, objectives: e.target.value })} className="w-full rounded border border-input bg-background px-3 py-2 text-sm" rows={3} placeholder="Coaching objectives" />
            <textarea value={proposalForm.expectedOutcomes} onChange={(e) => setProposalForm({ ...proposalForm, expectedOutcomes: e.target.value })} className="w-full rounded border border-input bg-background px-3 py-2 text-sm" rows={3} placeholder="Expected outcomes" />
            <div className="grid grid-cols-2 gap-3">
              <input value={proposalForm.durationSessions} onChange={(e) => setProposalForm({ ...proposalForm, durationSessions: e.target.value })} type="number" className="rounded border border-input bg-background px-3 py-2 text-sm" placeholder="Duration (sessions)" />
              <select value={proposalForm.frequency} onChange={(e) => setProposalForm({ ...proposalForm, frequency: e.target.value })} className="rounded border border-input bg-background px-3 py-2 text-sm">
                <option value="weekly">weekly</option>
                <option value="bi-weekly">bi-weekly</option>
              </select>
            </div>
            <input value={proposalForm.investment} onChange={(e) => setProposalForm({ ...proposalForm, investment: e.target.value })} type="number" className="w-full rounded border border-input bg-background px-3 py-2 text-sm" placeholder="Investment (KES)" />
            <Button type="submit" disabled={!data.intakeForm || data.intakeForm.status !== "reviewed"}>Generate Proposal</Button>
            {(!data.intakeForm || data.intakeForm.status !== "reviewed") && (
              <p className="text-xs text-muted-foreground">Review intake form first before generating a proposal.</p>
            )}
          </form>

          <div className="rounded-lg border border-border bg-card p-5 space-y-2">
            <h3 className="text-lg text-navy">Step 6: Consent & Agreement Status</h3>
            {!data.proposal && <p className="text-sm text-muted-foreground">No proposal sent yet.</p>}
            {data.proposal && (
              <>
                <p className="text-sm text-muted-foreground">Proposal status: <span className="font-medium text-foreground">{data.proposal.status}</span></p>
                <p className="text-sm text-muted-foreground">Sent at: <span className="font-medium text-foreground">{data.proposal.sentAt ? new Date(data.proposal.sentAt).toLocaleString() : "Pending"}</span></p>
                <p className="text-sm text-muted-foreground">Due by: <span className="font-medium text-foreground">{new Date(data.proposal.dueBy).toLocaleString()}</span></p>
              </>
            )}
            {!data.consentAgreement && <p className="text-sm text-muted-foreground">No consent captured yet.</p>}
            {data.consentAgreement && (
              <>
                <p className="text-sm text-muted-foreground">Consent: <span className="font-medium text-foreground">{data.consentAgreement.consented ? "Yes" : "No"}</span></p>
                <p className="text-sm text-muted-foreground">Digital signature: <span className="font-medium text-foreground">{data.consentAgreement.signed ? "Signed" : "Pending"}</span></p>
                {data.consentAgreement.signatureName && <p className="text-sm text-muted-foreground">Signed by: {data.consentAgreement.signatureName}</p>}
              </>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <form onSubmit={addSession} className="rounded-lg border border-border bg-card p-5 space-y-3">
            <h3 className="text-lg text-navy">Add Session</h3>
            <input value={sessionForm.title} onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })} className="w-full rounded border border-input bg-background px-3 py-2 text-sm" placeholder="Session title" />
            <div className="grid grid-cols-2 gap-3">
              <input value={sessionForm.sessionNumber} onChange={(e) => setSessionForm({ ...sessionForm, sessionNumber: e.target.value })} type="number" className="rounded border border-input bg-background px-3 py-2 text-sm" placeholder="Session #" />
              <input value={sessionForm.cost} onChange={(e) => setSessionForm({ ...sessionForm, cost: e.target.value })} type="number" className="rounded border border-input bg-background px-3 py-2 text-sm" placeholder="Cost" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input value={sessionForm.date} onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })} type="date" className="rounded border border-input bg-background px-3 py-2 text-sm" />
              <input value={sessionForm.time} onChange={(e) => setSessionForm({ ...sessionForm, time: e.target.value })} type="time" className="rounded border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <Button type="submit" className="w-full">Save Session</Button>
          </form>

          <form onSubmit={addPayment} className="rounded-lg border border-border bg-card p-5 space-y-3">
            <h3 className="text-lg text-navy">Record Payment</h3>
            <div className="grid grid-cols-2 gap-3">
              <input value={paymentForm.sessionNumber} onChange={(e) => setPaymentForm({ ...paymentForm, sessionNumber: e.target.value })} type="number" className="rounded border border-input bg-background px-3 py-2 text-sm" placeholder="Session #" />
              <input value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} type="number" className="rounded border border-input bg-background px-3 py-2 text-sm" placeholder="Amount" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input value={paymentForm.method} onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })} className="rounded border border-input bg-background px-3 py-2 text-sm" placeholder="Method" />
              <input value={paymentForm.date} onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })} type="date" className="rounded border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <Button type="submit" className="w-full">Save Payment</Button>
          </form>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <form onSubmit={addDocument} className="rounded-lg border border-border bg-card p-5 space-y-3">
            <h3 className="text-lg text-navy">Add Document</h3>
            <input value={documentForm.title} onChange={(e) => setDocumentForm({ ...documentForm, title: e.target.value })} className="w-full rounded border border-input bg-background px-3 py-2 text-sm" placeholder="Document title" />
            <div className="grid grid-cols-2 gap-3">
              <input value={documentForm.type} onChange={(e) => setDocumentForm({ ...documentForm, type: e.target.value })} className="rounded border border-input bg-background px-3 py-2 text-sm" placeholder="Type" />
              <input value={documentForm.fileSize} onChange={(e) => setDocumentForm({ ...documentForm, fileSize: e.target.value })} className="rounded border border-input bg-background px-3 py-2 text-sm" placeholder="File size" />
            </div>
            <Button type="submit" className="w-full">Save Document</Button>
          </form>

          <form onSubmit={addNotification} className="rounded-lg border border-border bg-card p-5 space-y-3">
            <h3 className="text-lg text-navy">Send Notification</h3>
            <input value={notificationForm.title} onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })} className="w-full rounded border border-input bg-background px-3 py-2 text-sm" placeholder="Notification title" />
            <input value={notificationForm.type} onChange={(e) => setNotificationForm({ ...notificationForm, type: e.target.value })} className="w-full rounded border border-input bg-background px-3 py-2 text-sm" placeholder="email / sms / system" />
            <textarea value={notificationForm.message} onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })} className="w-full rounded border border-input bg-background px-3 py-2 text-sm" rows={3} placeholder="Message" />
            <Button type="submit" className="w-full">Send Notification</Button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminClientDetails;
