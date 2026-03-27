import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface AdminClient {
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
}

interface AdminClientsResponse {
  clients: AdminClient[];
}

export function useAdminClients() {
  return useQuery({
    queryKey: ["admin-clients"],
    queryFn: () => api.get("/api/admin/clients") as Promise<AdminClientsResponse>,
  });
}
