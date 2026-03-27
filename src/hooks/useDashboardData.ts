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
