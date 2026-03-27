import DashboardLayout from "@/components/DashboardLayout";
import { Download, FileText, FileCheck, FileSpreadsheet, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

const iconMap = { report: FileText, agreement: FileCheck, certificate: Award, assessment: FileSpreadsheet };

const goalOptions = [
  { value: "leadership-confidence", label: "Build leadership confidence" },
  { value: "communication-skills", label: "Improve communication skills" },
  { value: "career-growth", label: "Plan career growth and progression" },
  { value: "productivity-focus", label: "Increase productivity and focus" },
  { value: "stress-balance", label: "Manage stress and work-life balance" },
  { value: "other", label: "Other" },
];

const challengeOptions = [
  { value: "self-doubt", label: "Self-doubt or low confidence" },
  { value: "communication-gaps", label: "Communication challenges" },
  { value: "time-management", label: "Time management and priorities" },
  { value: "team-conflict", label: "Team conflict or relationship strain" },
  { value: "clarity-direction", label: "Lack of clarity or direction" },
  { value: "other", label: "Other" },
];

const historyOptions = [
  { value: "none", label: "No previous coaching" },
  { value: "short-program", label: "Short coaching program before" },
  { value: "ongoing-mentorship", label: "Ongoing mentorship/coaching" },
  { value: "therapy-counselling", label: "Therapy/counselling background" },
  { value: "other", label: "Other" },
];

const styleOptions = [
  { value: "structured", label: "Structured and goal-driven" },
  { value: "reflective", label: "Reflective and exploratory" },
  { value: "practical", label: "Practical tools and action steps" },
  { value: "accountability", label: "Strong accountability check-ins" },
  { value: "other", label: "Other" },
];

const availabilityOptions = [
  { value: "weekday-morning", label: "Weekday mornings (8am-12pm)" },
  { value: "weekday-afternoon", label: "Weekday afternoons (12pm-5pm)" },
  { value: "weekday-evening", label: "Weekday evenings (5pm-8pm)" },
  { value: "saturday", label: "Saturday sessions" },
  { value: "flexible", label: "Flexible schedule" },
  { value: "other", label: "Other" },
];

const mapValueToOption = (value: string, options: Array<{ value: string }>) => {
  if (!value) {
    return { selected: "", custom: "" };
  }
  if (options.some((option) => option.value === value)) {
    return { selected: value, custom: "" };
  }
  return { selected: "other", custom: value };
};

const Documents = () => {
  const { data, isLoading, refetch } = useDashboardData();
  const [savingIntake, setSavingIntake] = useState(false);
  const [showIntakeEditor, setShowIntakeEditor] = useState(false);
  const [showEthics, setShowEthics] = useState(false);
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
  const [customIntake, setCustomIntake] = useState({
    goals: "",
    challenges: "",
    history: "",
    preferredStyle: "",
    availability: "",
  });

  const submitIntake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    try {
      setSavingIntake(true);
      const payload = {
        goals: intakeForm.goals === "other" ? customIntake.goals.trim() : intakeForm.goals,
        challenges: intakeForm.challenges === "other" ? customIntake.challenges.trim() : intakeForm.challenges,
        history: intakeForm.history === "other" ? customIntake.history.trim() : intakeForm.history,
        preferredStyle: intakeForm.preferredStyle === "other" ? customIntake.preferredStyle.trim() : intakeForm.preferredStyle,
        availability: intakeForm.availability === "other" ? customIntake.availability.trim() : intakeForm.availability,
        consent: intakeForm.consent,
      };

      await api.post(`/api/dashboard/${data.client.id}/intake-form`, payload);
      toast.success("Intake form submitted and flagged for coach review");
      await refetch();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to submit intake form";
      if (message.includes("404") || message.toLowerCase().includes("request failed")) {
        toast.error("Local API is outdated. Restart API server to load latest routes, then submit again.");
      } else {
        toast.error(message);
      }
    } finally {
      setSavingIntake(false);
    }
  };

  const intake = data?.intakeForm;
  const proposal = data?.proposal;
  const agreement = data?.consentAgreement;
  const ethicsDoc = data?.documents.find((doc) => doc.title.toLowerCase().includes("icf code of ethics"));
  const onboarding = data?.onboarding || {
    portalAccess: true,
    icfCodeOfEthicsAvailable: false,
    intakeCompleted: false,
    coachReviewRequired: false,
    proposalAvailable: false,
    consentCompleted: false,
    agreementSigned: false,
  };
  const intakeNeedsSubmission = intake?.status !== "submitted" && intake?.status !== "reviewed";

  useEffect(() => {
    if (!data) return;

    setShowIntakeEditor(intakeNeedsSubmission);
    const mappedGoals = mapValueToOption(data.intakeForm?.goals || "", goalOptions);
    const mappedChallenges = mapValueToOption(data.intakeForm?.challenges || "", challengeOptions);
    const mappedHistory = mapValueToOption(data.intakeForm?.history || "", historyOptions);
    const mappedStyle = mapValueToOption(data.intakeForm?.preferredStyle || "", styleOptions);
    const mappedAvailability = mapValueToOption(data.intakeForm?.availability || "", availabilityOptions);

    setIntakeForm({
      goals: mappedGoals.selected,
      challenges: mappedChallenges.selected,
      history: mappedHistory.selected,
      preferredStyle: mappedStyle.selected,
      availability: mappedAvailability.selected,
      consent: Boolean(data.intakeForm?.consent),
    });
    setCustomIntake({
      goals: mappedGoals.custom,
      challenges: mappedChallenges.custom,
      history: mappedHistory.custom,
      preferredStyle: mappedStyle.custom,
      availability: mappedAvailability.custom,
    });
  }, [data?.intakeForm?.id, intakeNeedsSubmission]);

  const intakeHasMissingRequired =
    !intakeForm.goals ||
    !intakeForm.challenges ||
    !intakeForm.preferredStyle ||
    !intakeForm.availability ||
    !intakeForm.consent ||
    (intakeForm.goals === "other" && !customIntake.goals.trim()) ||
    (intakeForm.challenges === "other" && !customIntake.challenges.trim()) ||
    (intakeForm.preferredStyle === "other" && !customIntake.preferredStyle.trim()) ||
    (intakeForm.availability === "other" && !customIntake.availability.trim());

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
        <h2 className="text-lg text-navy">Client Portal Access & Documentation</h2>
        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <p className="text-muted-foreground">Portal access: <span className="font-medium text-foreground">Active</span></p>
          <p className="text-muted-foreground">ICF Code of Ethics: <span className="font-medium text-foreground">{onboarding.icfCodeOfEthicsAvailable ? "Available" : "Pending"}</span></p>
          <p className="text-muted-foreground">Intake form: <span className="font-medium text-foreground">{onboarding.intakeCompleted ? "Submitted" : "Pending"}</span></p>
          <p className="text-muted-foreground">Coach review flag: <span className="font-medium text-foreground">{onboarding.coachReviewRequired ? "Flagged" : "Clear"}</span></p>
        </div>
        {ethicsDoc && (
          <div className="mt-4 rounded-md border border-input bg-background p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">ICF Code of Ethics</p>
                <p className="text-xs text-muted-foreground">Read key principles directly here in the dashboard.</p>
              </div>
              <Button type="button" size="sm" variant="outline" onClick={() => setShowEthics((prev) => !prev)}>
                {showEthics ? "Hide" : "Read Here"}
              </Button>
            </div>

            {showEthics && (
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Core ICF Ethics Principles</p>
                <p>1. Integrity and professionalism in all coach-client interactions.</p>
                <p>2. Confidentiality, privacy, and responsible handling of client information.</p>
                <p>3. Clear agreements, scope, and expectations before and during coaching.</p>
                <p>4. Respect for client autonomy, dignity, and informed decision making.</p>
                <p>5. Ongoing competence, accountability, and ethical conduct at all times.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showIntakeEditor && (
        <form onSubmit={submitIntake} className="rounded-lg border border-primary/20 bg-primary/5 p-5 space-y-3">
          <h3 className="text-lg text-foreground">Client Intake Form</h3>
          <p className="text-sm text-muted-foreground">Complete this online intake form to continue onboarding. Submission automatically flags your profile for coach review.</p>

          <div className="space-y-3">
            <label className="text-sm text-muted-foreground">Your top coaching goals</label>
            <select value={intakeForm.goals} onChange={(e) => setIntakeForm({ ...intakeForm, goals: e.target.value })} className="w-full rounded border border-input bg-background px-3 py-2 text-sm">
              <option value="">Select one</option>
              {goalOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            {intakeForm.goals === "other" && (
              <textarea value={customIntake.goals} onChange={(e) => setCustomIntake({ ...customIntake, goals: e.target.value })} rows={2} className="w-full rounded border border-input bg-background px-3 py-2 text-sm" placeholder="Please specify your goal" />
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm text-muted-foreground">Current challenges you want to address</label>
            <select value={intakeForm.challenges} onChange={(e) => setIntakeForm({ ...intakeForm, challenges: e.target.value })} className="w-full rounded border border-input bg-background px-3 py-2 text-sm">
              <option value="">Select one</option>
              {challengeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            {intakeForm.challenges === "other" && (
              <textarea value={customIntake.challenges} onChange={(e) => setCustomIntake({ ...customIntake, challenges: e.target.value })} rows={2} className="w-full rounded border border-input bg-background px-3 py-2 text-sm" placeholder="Please specify your challenge" />
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm text-muted-foreground">Any previous coaching or relevant background (optional)</label>
            <select value={intakeForm.history} onChange={(e) => setIntakeForm({ ...intakeForm, history: e.target.value })} className="w-full rounded border border-input bg-background px-3 py-2 text-sm">
              <option value="">Select one</option>
              {historyOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            {intakeForm.history === "other" && (
              <textarea value={customIntake.history} onChange={(e) => setCustomIntake({ ...customIntake, history: e.target.value })} rows={2} className="w-full rounded border border-input bg-background px-3 py-2 text-sm" placeholder="Optional: add your background details" />
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Preferred coaching style</label>
              <select value={intakeForm.preferredStyle} onChange={(e) => setIntakeForm({ ...intakeForm, preferredStyle: e.target.value })} className="w-full rounded border border-input bg-background px-3 py-2 text-sm">
                <option value="">Select one</option>
                {styleOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
              {intakeForm.preferredStyle === "other" && (
                <textarea value={customIntake.preferredStyle} onChange={(e) => setCustomIntake({ ...customIntake, preferredStyle: e.target.value })} rows={2} className="w-full rounded border border-input bg-background px-3 py-2 text-sm" placeholder="Please specify your preferred style" />
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Availability windows</label>
              <select value={intakeForm.availability} onChange={(e) => setIntakeForm({ ...intakeForm, availability: e.target.value })} className="w-full rounded border border-input bg-background px-3 py-2 text-sm">
                <option value="">Select one</option>
                {availabilityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
              {intakeForm.availability === "other" && (
                <textarea value={customIntake.availability} onChange={(e) => setCustomIntake({ ...customIntake, availability: e.target.value })} rows={2} className="w-full rounded border border-input bg-background px-3 py-2 text-sm" placeholder="Please specify your availability" />
              )}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={intakeForm.consent} onChange={(e) => setIntakeForm({ ...intakeForm, consent: e.target.checked })} className="accent-primary" />
            I have reviewed the ICF Code of Ethics and consent to proceed.
          </label>

          <Button type="submit" disabled={savingIntake || intakeHasMissingRequired}>
            {savingIntake ? "Submitting..." : "Submit Intake Form"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => setShowIntakeEditor(false)}>
            Hide Form
          </Button>
        </form>
      )}

      {!intakeNeedsSubmission && intake && !showIntakeEditor && (
        <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-5 text-sm">
          <p className="font-medium text-foreground">Intake form submitted</p>
          <p className="text-muted-foreground mt-1">Status: {intake.status} {intake.coachReviewRequired ? "(awaiting coach review)" : "(coach reviewed)"}</p>
          <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => setShowIntakeEditor(true)}>
            Edit / Resubmit Intake Form
          </Button>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card p-5 space-y-3">
        <h2 className="text-lg text-navy">Coaching Proposal</h2>
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
              <Button onClick={consentToProposal} disabled={consenting || !onboarding.intakeCompleted}>
                {consenting ? "Submitting Consent..." : "I Consent"}
              </Button>
            )}
          </>
        )}
      </div>

      <div className="rounded-lg border border-border bg-card p-5 space-y-3">
        <h2 className="text-lg text-navy">Consent & Agreement</h2>
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
