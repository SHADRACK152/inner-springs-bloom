import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/PublicLayout";
import { api } from "@/lib/api";
import { saveSession } from "@/lib/auth";
import { toast } from "sonner";

const Login = () => {
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
    <PublicLayout>
      <section className="flex min-h-[70vh] items-center justify-center py-16">
        <div className="w-full max-w-md rounded-lg bg-card p-8 shadow-lg border border-border">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary mb-4">
              <span className="text-xl font-bold text-primary-foreground">IS</span>
            </div>
            <h1 className="text-3xl text-navy">Client Login</h1>
            <p className="mt-2 text-sm text-muted-foreground">Access your client portal</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm"
                placeholder="••••••••"
              />
            </div>
            <Button variant="hero" className="w-full" type="submit" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            First time? Your login credentials are sent to your email after enrollment.
          </p>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Login;
