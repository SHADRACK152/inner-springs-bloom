import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useState } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Calendar, FileText, CreditCard, BookOpen, Settings, MessageSquare, Target } from "lucide-react";

const ClientPortal = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");

  if (!isLoggedIn) {
    return (
      <>
        <Navbar />
        <main className="pt-16 md:pt-20">
          <section className="section-spacing bg-background">
            <div className="container-main flex items-center justify-center min-h-[60vh]">
              <div className="card-surface bg-card p-8 md:p-10 rounded-lg w-full max-w-md">
                <div className="text-center mb-8">
                  <h1 className="text-primary text-3xl mb-2">Client Portal</h1>
                  <p className="text-muted-foreground text-sm">Log in to access your sessions, documents, and progress.</p>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-lg bg-background text-sm border border-input focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 rounded-lg bg-background text-sm border border-input focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full">Log In</button>
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Don't have an account? <Link to="/book" className="text-primary hover:underline">Book a session</Link> to get started.
                  </p>
                </form>
              </div>
            </div>
          </section>
        </main>
        <Footer />
        <WhatsAppButton />
      </>
    );
  }

  const sideNav = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "journey", icon: Target, label: "My Journey" },
    { id: "sessions", icon: Calendar, label: "Sessions" },
    { id: "documents", icon: FileText, label: "Documents" },
    { id: "payments", icon: CreditCard, label: "Payments" },
    { id: "resources", icon: BookOpen, label: "Resources" },
    { id: "messages", icon: MessageSquare, label: "Messages" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-16 md:pt-20 min-h-screen bg-background">
        <div className="flex">
          {/* Sidebar */}
          <aside className="hidden md:block w-60 bg-card border-r border-input min-h-[calc(100vh-80px)] p-4">
            <div className="mb-6 px-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Client Portal</p>
              <p className="text-sm font-medium text-foreground mt-1">Welcome back, John!</p>
            </div>
            <nav className="space-y-1">
              {sideNav.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    activeTab === item.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>
            <button onClick={() => setIsLoggedIn(false)} className="mt-8 text-sm text-destructive hover:underline px-3">Log Out</button>
          </aside>

          {/* Main Content */}
          <div className="flex-1 p-6 md:p-8">
            {activeTab === "dashboard" && (
              <div>
                <h2 className="text-foreground mb-6">Your Coaching Journey</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="card-surface bg-card p-6 rounded-lg text-center">
                    <p className="text-3xl font-serif text-primary font-bold">8 of 10</p>
                    <p className="text-sm text-muted-foreground mt-1">Sessions Completed</p>
                  </div>
                  <div className="card-surface bg-card p-6 rounded-lg text-center">
                    <p className="text-lg font-medium text-foreground">Oct 5, 2:00 PM</p>
                    <p className="text-sm text-muted-foreground mt-1">Next Session</p>
                  </div>
                  <div className="card-surface bg-card p-6 rounded-lg text-center">
                    <p className="text-3xl font-serif text-primary font-bold">5</p>
                    <p className="text-sm text-muted-foreground mt-1">Documents</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card-surface bg-card p-6 rounded-lg">
                    <h4 className="text-foreground mb-4 text-lg">Action Items</h4>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-sm">
                        <input type="checkbox" className="w-4 h-4 rounded accent-primary" />
                        <span className="text-muted-foreground">Review last session's coaching log</span>
                      </li>
                      <li className="flex items-center gap-3 text-sm">
                        <input type="checkbox" className="w-4 h-4 rounded accent-primary" />
                        <span className="text-muted-foreground">Complete reflection exercise</span>
                      </li>
                      <li className="flex items-center gap-3 text-sm">
                        <input type="checkbox" className="w-4 h-4 rounded accent-primary" defaultChecked />
                        <span className="text-muted-foreground line-through">Submit intake form</span>
                      </li>
                    </ul>
                  </div>

                  <div className="card-surface bg-card p-6 rounded-lg">
                    <h4 className="text-foreground mb-4 text-lg">Recent Documents</h4>
                    <ul className="space-y-3">
                      {[
                        { name: "Session 8 Coaching Log", date: "Oct 1, 2025" },
                        { name: "Session 7 Coaching Log", date: "Sep 24, 2025" },
                        { name: "ICF Code of Ethics", date: "Sep 1, 2025" },
                      ].map((doc, i) => (
                        <li key={i} className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-foreground">
                            <FileText className="w-4 h-4 text-primary" />
                            {doc.name}
                          </span>
                          <span className="text-muted-foreground text-xs">{doc.date}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="card-surface bg-card p-6 rounded-lg mt-6">
                  <h4 className="text-foreground mb-4 text-lg">Upcoming Sessions</h4>
                  <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                    <div>
                      <p className="text-foreground font-medium">Session 9 — October 5, 2025 at 2:00 PM</p>
                      <p className="text-sm text-muted-foreground">Video call with Coach Sarah</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn-primary text-sm py-2">Join Session</button>
                      <button className="btn-outline text-sm py-2">Reschedule</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab !== "dashboard" && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <h3 className="text-foreground mb-2">{sideNav.find(s => s.id === activeTab)?.label}</h3>
                  <p className="text-muted-foreground text-sm">This section will be available soon. Demo content is shown on the Dashboard.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <WhatsAppButton />
    </>
  );
};

export default ClientPortal;
