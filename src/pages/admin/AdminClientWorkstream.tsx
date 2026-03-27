import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { useAdminClients } from "@/hooks/useAdminClients";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

type WorkstreamSection = "journey" | "sessions" | "documents" | "resources" | "payments" | "notifications";

interface ClientDetailsPayload {
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
}

interface DashboardPayload {
	resources: Array<{
		id: string;
		title: string;
		description: string;
		type: string;
		category: string;
		dateAdded: string;
	}>;
}

function AdminClientWorkstream({ section, title, description }: { section: WorkstreamSection; title: string; description: string }) {
	const { data: clientsData, isLoading: clientsLoading } = useAdminClients();
	const clients = clientsData?.clients || [];
	const [selectedClientId, setSelectedClientId] = useState("");

	useEffect(() => {
		if (!selectedClientId && clients.length > 0) {
			setSelectedClientId(clients[0].id);
		}
	}, [clients, selectedClientId]);

	const selectedClient = useMemo(
		() => clients.find((client) => client.id === selectedClientId) || null,
		[clients, selectedClientId],
	);

	const detailsQuery = useQuery({
		queryKey: ["admin-workstream-details", selectedClientId, section],
		queryFn: () => api.get(`/api/admin/clients/${selectedClientId}`) as Promise<ClientDetailsPayload>,
		enabled: Boolean(selectedClientId) && section !== "journey" && section !== "resources",
	});

	const resourcesQuery = useQuery({
		queryKey: ["admin-workstream-resources", selectedClientId],
		queryFn: () => api.get(`/api/dashboard/${selectedClientId}`) as Promise<DashboardPayload>,
		enabled: Boolean(selectedClientId) && section === "resources",
	});

	if (clientsLoading) {
		return (
			<AdminLayout>
				<div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">Loading clients...</div>
			</AdminLayout>
		);
	}

	if (section === "journey") {
		return (
			<AdminLayout>
				<div className="space-y-6">
					<div>
						<h1 className="text-3xl text-navy">{title}</h1>
						<p className="text-muted-foreground">{description}</p>
					</div>

					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{clients.map((client) => {
							const progress = client.totalSessions > 0
								? Math.round((client.completedSessions / client.totalSessions) * 100)
								: 0;

							return (
								<div key={client.id} className="rounded-lg border border-border bg-card p-5 space-y-3">
									<div className="flex items-start justify-between gap-2">
										<div>
											<p className="text-base font-medium text-foreground">{client.name}</p>
											<p className="text-xs text-muted-foreground capitalize">{client.service.replace("-", " ")}</p>
										</div>
										<span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{progress}%</span>
									</div>
									<div className="h-2 w-full rounded-full bg-muted">
										<div className="h-2 rounded-full bg-primary" style={{ width: `${progress}%` }} />
									</div>
									<p className="text-xs text-muted-foreground">{client.completedSessions}/{client.totalSessions} sessions completed</p>
									<Link to={`/admin/clients/${client.id}`}>
										<Button size="sm" variant="outline" className="w-full">Open Client Profile</Button>
									</Link>
								</div>
							);
						})}
					</div>
				</div>
			</AdminLayout>
		);
	}

	const busy = detailsQuery.isLoading || resourcesQuery.isLoading;
	const details = detailsQuery.data;
	const resources = resourcesQuery.data?.resources || [];

	return (
		<AdminLayout>
			<div className="space-y-6">
				<div className="flex items-start justify-between gap-4 flex-wrap">
					<div>
						<h1 className="text-3xl text-navy">{title}</h1>
						<p className="text-muted-foreground">{description}</p>
					</div>
					{selectedClientId && (
						<Link to={`/admin/clients/${selectedClientId}`}>
							<Button variant="outline">Open Client Profile</Button>
						</Link>
					)}
				</div>

				<div className="max-w-md space-y-2">
					<label className="text-sm font-medium text-foreground">Select Client</label>
					<select
						value={selectedClientId}
						onChange={(e) => setSelectedClientId(e.target.value)}
						className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
					>
						{clients.map((client) => (
							<option key={client.id} value={client.id}>
								{client.name} - {client.service}
							</option>
						))}
					</select>
				</div>

				{busy && (
					<div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">Loading {title.toLowerCase()}...</div>
				)}

				{!busy && section === "sessions" && (
					<div className="rounded-lg border border-border bg-card overflow-hidden">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-border bg-muted/50">
									<th className="px-4 py-3 text-left text-muted-foreground">#</th>
									<th className="px-4 py-3 text-left text-muted-foreground">Title</th>
									<th className="px-4 py-3 text-left text-muted-foreground">Date</th>
									<th className="px-4 py-3 text-left text-muted-foreground">Status</th>
									<th className="px-4 py-3 text-left text-muted-foreground">Cost</th>
								</tr>
							</thead>
							<tbody>
								{(details?.sessions || []).map((session) => (
									<tr key={session.id} className="border-b border-border last:border-0">
										<td className="px-4 py-3">{session.sessionNumber}</td>
										<td className="px-4 py-3">{session.title}</td>
										<td className="px-4 py-3">{session.date} {session.time}</td>
										<td className="px-4 py-3 capitalize">{session.status}</td>
										<td className="px-4 py-3">KES {session.cost.toLocaleString()}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{!busy && section === "documents" && (
					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{(details?.documents || []).map((document) => (
							<div key={document.id} className="rounded-lg border border-border bg-card p-5">
								<p className="text-sm font-medium text-foreground">{document.title}</p>
								<p className="text-xs text-muted-foreground mt-1 capitalize">{document.type}</p>
								<p className="text-xs text-muted-foreground mt-2">Added: {document.dateAdded}</p>
								<p className="text-xs text-muted-foreground">Size: {document.fileSize}</p>
							</div>
						))}
					</div>
				)}

				{!busy && section === "resources" && (
					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{resources.map((resource) => (
							<div key={resource.id} className="rounded-lg border border-border bg-card p-5">
								<p className="text-sm font-medium text-foreground">{resource.title}</p>
								<p className="text-xs text-muted-foreground mt-1 capitalize">{resource.type} • {resource.category}</p>
								<p className="text-sm text-muted-foreground mt-3">{resource.description}</p>
							</div>
						))}
					</div>
				)}

				{!busy && section === "payments" && (
					<div className="rounded-lg border border-border bg-card overflow-hidden">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-border bg-muted/50">
									<th className="px-4 py-3 text-left text-muted-foreground">Session</th>
									<th className="px-4 py-3 text-left text-muted-foreground">Amount</th>
									<th className="px-4 py-3 text-left text-muted-foreground">Method</th>
									<th className="px-4 py-3 text-left text-muted-foreground">Status</th>
									<th className="px-4 py-3 text-left text-muted-foreground">Date</th>
								</tr>
							</thead>
							<tbody>
								{(details?.payments || []).map((payment) => (
									<tr key={payment.id} className="border-b border-border last:border-0">
										<td className="px-4 py-3">{payment.sessionNumber}</td>
										<td className="px-4 py-3">KES {payment.amount.toLocaleString()}</td>
										<td className="px-4 py-3">{payment.method || "-"}</td>
										<td className="px-4 py-3 capitalize">{payment.status}</td>
										<td className="px-4 py-3">{payment.date}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{!busy && section === "notifications" && (
					<div className="space-y-3">
						{(details?.notifications || []).map((notification) => (
							<div key={notification.id} className="rounded-lg border border-border bg-card p-4">
								<p className="text-sm font-medium text-foreground">{notification.title}</p>
								<p className="text-xs text-muted-foreground capitalize mt-1">{notification.type} • {notification.date}</p>
								<p className="text-xs mt-2">
									<span className={notification.read ? "text-secondary" : "text-accent"}>
										{notification.read ? "Read" : "Unread"}
									</span>
								</p>
							</div>
						))}
					</div>
				)}

				{!busy && selectedClient && section !== "journey" && (
					<div className="rounded-lg border border-border bg-muted/20 p-4 text-xs text-muted-foreground">
						Viewing {title.toLowerCase()} for {selectedClient.name}
					</div>
				)}
			</div>
		</AdminLayout>
	);
}

export const AdminJourneyPage = () => (
	<AdminClientWorkstream
		section="journey"
		title="My Journey"
		description="Track journey progress for all active clients."
	/>
);

export const AdminSessionsPage = () => (
	<AdminClientWorkstream
		section="sessions"
		title="Sessions"
		description="Review and monitor session records by client."
	/>
);

export const AdminDocumentsPage = () => (
	<AdminClientWorkstream
		section="documents"
		title="Documents"
		description="View client documents and supporting records."
	/>
);

export const AdminResourcesPage = () => (
	<AdminClientWorkstream
		section="resources"
		title="Resources"
		description="Review resources available to clients from the dashboard library."
	/>
);

export const AdminPaymentsPage = () => (
	<AdminClientWorkstream
		section="payments"
		title="Payments"
		description="Track payment status and collection by client."
	/>
);

export const AdminNotificationsPage = () => (
	<AdminClientWorkstream
		section="notifications"
		title="Notifications"
		description="Review notification history and delivery state per client."
	/>
);
