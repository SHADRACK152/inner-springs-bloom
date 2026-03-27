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

interface LegacyDashboardPayload {
  notifications?: Array<{
    id: string;
    clientId: string;
    title: string;
    message: string;
    type: "email" | "sms" | "system";
    date: string;
    read: boolean;
  }>;
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
  const session = getSession();

  const fetchFeed = async (): Promise<NotificationFeed> => {
    if (!feedPath) {
      return { notifications: [], unreadCount: 0 };
    }

    try {
      return (await api.get(feedPath)) as NotificationFeed;
    } catch {
      // Backward compatibility: older local APIs may not have /api/notifications/* yet.
      if (session?.user.role === "client" && session.user.clientId) {
        try {
          const legacy = await api.get(`/api/dashboard/${session.user.clientId}`) as LegacyDashboardPayload;
          const notifications = (legacy.notifications || []).map((item) => ({
            id: item.id,
            audience: "client" as const,
            clientId: item.clientId || session.user.clientId || null,
            title: item.title,
            message: item.message,
            type: item.type,
            actionLabel: "Open Notifications",
            actionPath: "/dashboard/notifications",
            createdAt: `${item.date}T00:00:00.000Z`,
            read: Boolean(item.read),
            readAt: item.read ? `${item.date}T00:00:00.000Z` : null,
            relatedClientName: null,
          }));

          return {
            notifications,
            unreadCount: notifications.filter((item) => !item.read).length,
          };
        } catch {
          return { notifications: [], unreadCount: 0 };
        }
      }

      return { notifications: [], unreadCount: 0 };
    }
  };

  const query = useQuery({
    queryKey: ["notification-center", feedPath],
    queryFn: fetchFeed,
    enabled: Boolean(feedPath),
    refetchInterval: 15000,
    retry: false,
  });

  const markReadMutation = useMutation({
    mutationFn: async (payload: { notificationId?: string; all?: boolean }) => {
      if (!readPath) {
        return { notifications: query.data?.notifications || [], unreadCount: query.data?.unreadCount || 0 };
      }

      try {
        return (await api.post(readPath, payload)) as NotificationFeed;
      } catch {
        // If read endpoint is unavailable, do local optimistic update.
        const now = new Date().toISOString();
        const updated = (query.data?.notifications || []).map((item) => {
          if (payload.all) {
            return { ...item, read: true, readAt: now };
          }
          if (payload.notificationId && item.id === payload.notificationId) {
            return { ...item, read: true, readAt: now };
          }
          return item;
        });

        return {
          notifications: updated,
          unreadCount: updated.filter((item) => !item.read).length,
        };
      }
    },
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
