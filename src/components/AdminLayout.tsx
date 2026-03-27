import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Route,
  Calendar,
  FileText,
  BookOpen,
  CreditCard,
  Bell,
  Users,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { clearSession, getSession } from "@/lib/auth";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Route, label: "My Journey", path: "/admin/journey" },
  { icon: Calendar, label: "Sessions", path: "/admin/sessions" },
  { icon: FileText, label: "Documents", path: "/admin/documents" },
  { icon: BookOpen, label: "Resources", path: "/admin/resources" },
  { icon: CreditCard, label: "Payments", path: "/admin/payments" },
  { icon: Bell, label: "Notifications", path: "/admin/notifications" },
  { icon: Users, label: "All Clients", path: "/admin/clients" },
  { icon: ClipboardList, label: "Bookings & Onboarding", path: "/admin/bookings" },
  { icon: BarChart3, label: "Reports", path: "/admin/reports" },
  { icon: Settings, label: "Admin Settings", path: "/admin/settings" },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const session = getSession();
  const initials = session?.user.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AD";
  const displayName = session?.user.name || "Admin";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-navy transition-transform lg:relative lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center gap-3 border-b border-navy-foreground/10 px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <span className="text-sm font-semibold text-navy-foreground font-sans-brand">InnerSprings</span>
              <p className="text-[10px] text-navy-foreground/50 uppercase tracking-wider">Admin Portal</p>
            </div>
            <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5 text-navy-foreground" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {sidebarLinks.map((link) => {
              const active = location.pathname === link.path || location.pathname.startsWith(`${link.path}/`);
              return (
                <Link key={link.path} to={link.path} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    active ? "bg-primary/20 text-primary" : "text-navy-foreground/70 hover:bg-navy-foreground/5 hover:text-navy-foreground"
                  }`}>
                  <link.icon className="h-4 w-4" /> {link.label}
                </Link>
              );
            })}
          </div>
          <div className="border-t border-navy-foreground/10 p-3">
            <button onClick={() => {
                clearSession();
                navigate("/admin/login");
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-navy-foreground/70 hover:bg-navy-foreground/5 hover:text-navy-foreground transition-colors">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>
      </aside>
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-foreground/20 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center gap-4 border-b border-border bg-card px-6">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}><Menu className="h-5 w-5" /></button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs font-bold text-navy-foreground">{initials}</div>
            <span className="hidden text-sm font-medium text-foreground sm:block">{displayName}</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
