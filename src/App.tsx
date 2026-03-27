import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigate } from "react-router-dom";
import { getSession } from "@/lib/auth";
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import Coaching from "./pages/Coaching.tsx";
import MentalHealth from "./pages/MentalHealth.tsx";
import Training from "./pages/Training.tsx";
import Contact from "./pages/Contact.tsx";
import Resources from "./pages/Resources.tsx";
import ClientPortal from "./pages/ClientPortal.tsx";
import BookSession from "./pages/BookSession.tsx";
import Login from "./pages/Login.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import Dashboard from "./pages/dashboard/DashboardHome.tsx";
import Journey from "./pages/dashboard/Journey.tsx";
import Sessions from "./pages/dashboard/Sessions.tsx";
import Documents from "./pages/dashboard/Documents.tsx";
import DashboardResources from "./pages/dashboard/DashboardResources.tsx";
import Payments from "./pages/dashboard/Payments.tsx";
import Notifications from "./pages/dashboard/Notifications.tsx";
import DashboardSettings from "./pages/dashboard/DashboardSettings.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminClients from "./pages/admin/AdminClients.tsx";
import AdminClientDetails from "./pages/admin/AdminClientDetails.tsx";
import AdminBookings from "./pages/admin/AdminBookings.tsx";
import {
  AdminDocumentsPage,
  AdminJourneyPage,
  AdminNotificationsPage,
  AdminPaymentsPage,
  AdminResourcesPage,
  AdminSessionsPage,
} from "./pages/admin/AdminClientWorkstream.tsx";
import AdminReports from "./pages/admin/AdminReports.tsx";
import AdminSettings from "./pages/admin/AdminSettings.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, role }: { children: JSX.Element; role: "client" | "admin" }) => {
  const session = getSession();
  if (!session || session.user.role !== role) {
    return <Navigate to={role === "admin" ? "/admin/login" : "/login"} replace />;
  }
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/coaching" element={<Coaching />} />
          <Route path="/mental-health" element={<MentalHealth />} />
          <Route path="/training" element={<Training />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/portal" element={<Navigate to="/login" replace />} />
          <Route path="/book" element={<BookSession />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/dashboard" element={<ProtectedRoute role="client"><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/journey" element={<ProtectedRoute role="client"><Journey /></ProtectedRoute>} />
          <Route path="/dashboard/sessions" element={<ProtectedRoute role="client"><Sessions /></ProtectedRoute>} />
          <Route path="/dashboard/documents" element={<ProtectedRoute role="client"><Documents /></ProtectedRoute>} />
          <Route path="/dashboard/resources" element={<ProtectedRoute role="client"><DashboardResources /></ProtectedRoute>} />
          <Route path="/dashboard/payments" element={<ProtectedRoute role="client"><Payments /></ProtectedRoute>} />
          <Route path="/dashboard/notifications" element={<ProtectedRoute role="client"><Notifications /></ProtectedRoute>} />
          <Route path="/dashboard/settings" element={<ProtectedRoute role="client"><DashboardSettings /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/journey" element={<ProtectedRoute role="admin"><AdminJourneyPage /></ProtectedRoute>} />
          <Route path="/admin/sessions" element={<ProtectedRoute role="admin"><AdminSessionsPage /></ProtectedRoute>} />
          <Route path="/admin/documents" element={<ProtectedRoute role="admin"><AdminDocumentsPage /></ProtectedRoute>} />
          <Route path="/admin/resources" element={<ProtectedRoute role="admin"><AdminResourcesPage /></ProtectedRoute>} />
          <Route path="/admin/payments" element={<ProtectedRoute role="admin"><AdminPaymentsPage /></ProtectedRoute>} />
          <Route path="/admin/notifications" element={<ProtectedRoute role="admin"><AdminNotificationsPage /></ProtectedRoute>} />
          <Route path="/admin/clients" element={<ProtectedRoute role="admin"><AdminClients /></ProtectedRoute>} />
          <Route path="/admin/clients/:clientId" element={<ProtectedRoute role="admin"><AdminClientDetails /></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute role="admin"><AdminBookings /></ProtectedRoute>} />
          <Route path="/admin/manage" element={<ProtectedRoute role="admin"><Navigate to="/admin/clients" replace /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute role="admin"><AdminReports /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute role="admin"><AdminSettings /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
