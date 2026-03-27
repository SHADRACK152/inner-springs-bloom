import DashboardLayout from "@/components/DashboardLayout";
import { Download, FileText, FileCheck, FileSpreadsheet, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

const iconMap = { report: FileText, agreement: FileCheck, certificate: Award, assessment: FileSpreadsheet };

const Documents = () => {
  const { data, isLoading, refetch } = useDashboardData();
  const [savingIntake, setSavingIntake] = useState(false);
  const [consenting, setConsenting] = useState(false);
  const [signing, setSigning] = useState(false);
  const [signatureName, setSignatureName] = useState("");
  const [intakeForm, setIntakeForm] = useState({
    goals: "",
    challenges: "",
    history: "",
    preferredStyle: "",
    availability: "",
    consent: false,
  });

  const submitIntake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    try {
      setSavingIntake(true);
      await api.post(`/api/dashboard/${data.client.id}/intake-form`, intakeForm);
      toast.success("Intake form submitted and flagged for coach review");
      await refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to submit intake form");
    } finally {
      setSavingIntake(false);
    }
  };

  const intake = data?.intakeForm;
  const proposal = data?.proposal;
  const agreement = data?.consentAgreement;
  const intakeNeedsSubmission = intake?.status !== "submitted" && intake?.status !== "reviewed";

  const consentToProposal = async () => {
    if (!data || !proposal) return;

    try {
      setConsenting(true);
      await api.post(`/api/dashboard/${data.client.id}/proposals/${proposal.id}/consent`, {} as Record<string, never>);
      toast.success("Consent recorded. Coaching agreement generated and signature requested.");
      await refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to submit consent");
    } finally {
      setConsenting(false);
    }
  };

  const signAgreement = async () => {
    if (!data || !agreement || !signatureName.trim()) return;

    try {
      setSigning(true);
      await api.post(`/api/dashboard/${data.client.id}/agreements/${agreement.id}/sign`, {
        signatureName: signatureName.trim(),
      });
      toast.success("Agreement signed and stored in your portal");
      await refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sign agreement");
    } finally {
      setSigning(false);
    }
  };

  if (isLoading || !data) {
    return (
      <DashboardLayout>
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">Loading documents...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-navy">Documents</h1>
        <p className="text-muted-foreground">Client portal access, onboarding documents, and intake completion.</p>
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <h2 className="text-lg text-navy">Step 4: Client Portal Access & Documentation</h2>
        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <p className="text-muted-foreground">Portal access: <span className="font-medium text-foreground">Active</span></p>
          <p className="text-muted-foreground">ICF Code of Ethics: <span className="font-medium text-foreground">{data.onboarding.icfCodeOfEthicsAvailable ? "Available" : "Pending"}</span></p>
          <p className="text-muted-foreground">Intake form: <span className="font-medium text-foreground">{data.onboarding.intakeCompleted ? "Submitted" : "Pending"}</span></p>
          <p className="text-muted-foreground">Coach review flag: <span className="font-medium text-foreground">{data.onboarding.coachReviewRequired ? "Flagged" : "Clear"}</span></p>
        </div>
      </div>

      {intakeNeedsSubmission && (
        <form onSubmit={submitIntake} className="rounded-lg border border-primary/20 bg-primary/5 p-5 space-y-3">
          <h3 className="text-lg text-foreground">Client Intake Form</h3>
          <p className="text-sm text-muted-foreground">Complete this online intake form to continue onboarding. Submission automatically flags your profile for coach review.</p>

          <textarea value={intakeForm.goals} onChange={(e) => setIntakeForm({ ...intakeForm, goals: e.target.value })} rows={3} className="w-full rounded border border-input bg-background px-3 py-2 text-sm" placeholder="Your top coaching goals" />
          <textarea value={intakeForm.challenges} onChange={(e) => setIntakeForm({ ...intakeForm, challenges: e.target.value })} rows={3} className="w-full rounded border border-input bg-background px-3 py-2 text-sm" placeholder="Current challenges you want to address" />
          <textarea value={intakeForm.history} onChange={(e) => setIntakeForm({ ...intakeForm, history: e.target.value })} rows={2} className="w-full rounded border border-input bg-background px-3 py-2 text-sm" placeholder="Any previous coaching or relevant background (optional)" />

          <div className="grid gap-3 sm:grid-cols-2">
            <input value={intakeForm.preferredStyle} onChange={(e) => setIntakeForm({ ...intakeForm, preferredStyle: e.target.value })} className="rounded border border-input bg-background px-3 py-2 text-sm" placeholder="Preferred coaching style" />
            <input value={intakeForm.availability} onChange={(e) => setIntakeForm({ ...intakeForm, availability: e.target.value })} className="rounded border border-input bg-background px-3 py-2 text-sm" placeholder="Availability windows" />
          </div>

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={intakeForm.consent} onChange={(e) => setIntakeForm({ ...intakeForm, consent: e.target.checked })} className="accent-primary" />
            I have reviewed the ICF Code of Ethics and consent to proceed.
          </label>

          <Button type="submit" disabled={savingIntake}>
            {savingIntake ? "Submitting..." : "Submit Intake Form"}
          </Button>
        </form>
      )}

      {!intakeNeedsSubmission && intake && (
        <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-5 text-sm">
          <p className="font-medium text-foreground">Intake form submitted</p>
          <p className="text-muted-foreground mt-1">Status: {intake.status} {intake.coachReviewRequired ? "(awaiting coach review)" : "(coach reviewed)"}</p>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card p-5 space-y-3">
        <h2 className="text-lg text-navy">Step 5: Coaching Proposal</h2>
        {!proposal && (
          <p className="text-sm text-muted-foreground">Your coach will generate and publish your customized proposal to this portal within 48 hours after intake review.</p>
        )}
        {proposal && (
          <>
            <p className="text-sm text-muted-foreground">Status: <span className="font-medium text-foreground capitalize">{proposal.status}</span></p>
            <p className="text-sm text-muted-foreground">Sent by: <span className="font-medium text-foreground">{proposal.sentAt ? new Date(proposal.sentAt).toLocaleString() : "Pending"}</span></p>
            <p className="text-sm text-muted-foreground">Due by (48h SLA): <span className="font-medium text-foreground">{new Date(proposal.dueBy).toLocaleString()}</span></p>
            <div className="rounded-md border border-input bg-background p-4 space-y-2 text-sm">
              <p><span className="font-medium text-foreground">Coaching objectives:</span> {proposal.objectives}</p>
              <p><span className="font-medium text-foreground">Duration:</span> {proposal.durationSessions} sessions</p>
              <p><span className="font-medium text-foreground">Frequency:</span> {proposal.frequency}</p>
              <p><span className="font-medium text-foreground">Investment:</span> KES {proposal.investment.toLocaleString()}</p>
              <p><span className="font-medium text-foreground">Expected outcomes:</span> {proposal.expectedOutcomes}</p>
            </div>
            {proposal.status === "sent" && (
              <Button onClick={consentToProposal} disabled={consenting || !data.onboarding.intakeCompleted}>
                {consenting ? "Submitting Consent..." : "I Consent"}
              </Button>
            )}
          </>
        )}
      </div>

      <div className="rounded-lg border border-border bg-card p-5 space-y-3">
        <h2 className="text-lg text-navy">Step 6: Consent & Agreement</h2>
        {!agreement && (
          <p className="text-sm text-muted-foreground">After you click I Consent on the proposal, your coaching agreement will be generated here and a digital signature request will appear.</p>
        )}
        {agreement && (
          <>
            <p className="text-sm text-muted-foreground">Consent status: <span className="font-medium text-foreground capitalize">{agreement.status}</span></p>
            <p className="text-sm text-muted-foreground">Signature requested: <span className="font-medium text-foreground">{agreement.signatureRequestedAt ? new Date(agreement.signatureRequestedAt).toLocaleString() : "Pending"}</span></p>
            <p className="text-sm text-muted-foreground">Agreement stored in portal: <span className="font-medium text-foreground">{agreement.agreementDocId ? "Yes" : "Pending"}</span></p>

            {!agreement.signed && (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  className="rounded border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Type your full legal name"
                />
                <Button onClick={signAgreement} disabled={signing || !signatureName.trim()}>
                  {signing ? "Signing..." : "Sign Agreement Electronically"}
                </Button>
              </div>
            )}

            {agreement.signed && (
              <p className="text-sm text-secondary font-medium">Signed by {agreement.signatureName} on {agreement.signedAt ? new Date(agreement.signedAt).toLocaleString() : "-"}</p>
            )}
          </>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.documents.map((doc) => {
          const Icon = iconMap[doc.type];
          return (
            <div key={doc.id} className="rounded-lg border border-border bg-card p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">{doc.type}</span>
              </div>
              <h4 className="mt-3 text-sm font-semibold text-foreground">{doc.title}</h4>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{doc.dateAdded}</span>
                <span>{doc.fileSize}</span>
              </div>
              {doc.sessionRelated && (
                <p className="mt-1 text-xs text-muted-foreground">Related to Session {doc.sessionRelated}</p>
              )}
              <Button variant="outline" size="sm" className="mt-3 w-full gap-2">
                <Download className="h-3 w-3" /> Download
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  </DashboardLayout>
  );
};

export default Documents;
