import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getSession } from "@/lib/auth";

export interface DashboardPayload {
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
  sessions: Array<{
    id: string;
    clientId: string;
    title: string;
    date: string;
    time: string;
    status: "completed" | "pending" | "cancelled";
    cost: number;
    notes: string;
    achievements: string;
    sessionNumber: number;
    totalSessions: number;
  }>;
  documents: Array<{
    id: string;
    clientId: string;
    title: string;
    type: "report" | "agreement" | "certificate" | "assessment";
    sessionRelated: number | null;
    dateAdded: string;
    fileSize: string;
    hasFile: boolean;
    fileUrl: string | null;
    downloadUrl: string | null;
  }>;
  resources: Array<{
    id: string;
    title: string;
    description: string;
    type: "article" | "video" | "worksheet" | "guide";
    category: string;
    dateAdded: string;
  }>;
  notifications: Array<{
    id: string;
    clientId: string;
    title: string;
    message: string;
    type: "email" | "sms" | "system";
    date: string;
    read: boolean;
  }>;
  payments: Array<{
    id: string;
    clientId: string;
    sessionNumber: number;
    amount: number;
    status: "paid" | "pending";
    date: string;
    method: string;
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
  onboarding: {
    portalAccess: boolean;
    icfCodeOfEthicsAvailable: boolean;
    intakeCompleted: boolean;
    coachReviewRequired: boolean;
    proposalAvailable: boolean;
    consentCompleted: boolean;
    agreementSigned: boolean;
  };
  proposal: {
    id: string;
    clientId: string;
    coachId: string | null;
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
    updatedAt: string;
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
    updatedAt: string;
  } | null;
}

export function useDashboardData() {
  const session = getSession();
  const clientId = session?.user.clientId;

  return useQuery({
    queryKey: ["dashboard-data", clientId],
    queryFn: () => api.get(`/api/dashboard/${clientId}`) as Promise<DashboardPayload>,
    enabled: Boolean(clientId),
  });
}
