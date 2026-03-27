import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getSession } from "@/lib/auth";

export interface ActivityNotification {
  id: string;
  audience: "admin" | "client" | "both";
  clientId: string | null;
  title: string;
  message: string;
  type: "email" | "sms" | "system";
  actionLabel: string | null;
  actionPath: string | null;
  createdAt: string;
  read: boolean;
  readAt: string | null;
  relatedClientName: string | null;
}

interface NotificationFeed {
  notifications: ActivityNotification[];
  unreadCount: number;
}

function getFeedPath() {
  const session = getSession();
  if (!session) return null;

  if (session.user.role === "admin") {
    return "/api/notifications/admin";
  }

  if (!session.user.clientId) return null;
  return `/api/notifications/client/${session.user.clientId}`;
}

function getReadPath() {
  const session = getSession();
  if (!session) return null;

  if (session.user.role === "admin") {
    return "/api/notifications/admin/read";
  }

  if (!session.user.clientId) return null;
  return `/api/notifications/client/${session.user.clientId}/read`;
}

export function useNotificationCenter() {
  const queryClient = useQueryClient();
  const feedPath = getFeedPath();
  const readPath = getReadPath();

  const query = useQuery({
    queryKey: ["notification-center", feedPath],
    queryFn: () => api.get(feedPath || "") as Promise<NotificationFeed>,
    enabled: Boolean(feedPath),
    refetchInterval: 15000,
  });

  const markReadMutation = useMutation({
    mutationFn: (payload: { notificationId?: string; all?: boolean }) =>
      api.post(readPath || "", payload) as Promise<NotificationFeed>,
    onSuccess: (payload) => {
      queryClient.setQueryData(["notification-center", feedPath], payload);
    },
  });

  const notifications = query.data?.notifications || [];
  const unreadCount = query.data?.unreadCount || 0;

  const sortedNotifications = useMemo(
    () => [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [notifications],
  );

  const latestFive = sortedNotifications.slice(0, 5);

  return {
    notifications: sortedNotifications,
    latestFive,
    unreadCount,
    isLoading: query.isLoading,
    refetch: query.refetch,
    markAsRead: (notificationId: string) => markReadMutation.mutate({ notificationId }),
    markAllAsRead: () => markReadMutation.mutate({ all: true }),
    isMarking: markReadMutation.isPending,
  };
}
