import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { saveSession } from "@/lib/auth";
import { toast } from "sonner";

const ClientPortal = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const data = await api.post("/api/auth/login", { email, password });
      saveSession({ token: data.token, user: data.user });
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to login";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

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
              <form onSubmit={handleLogin} className="space-y-4">
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
                <button type="submit" className="btn-primary w-full" disabled={submitting}>
                  {submitting ? "Logging in..." : "Log In"}
                </button>
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
};

export default ClientPortal;
