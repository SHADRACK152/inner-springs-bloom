import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { User, Lock, Palette, Save } from "lucide-react";
import { getSession } from "@/lib/auth";

const colorThemes = [
  { name: "Default Teal", primary: "#2A7B8E", sidebar: "#2A4858" },
  { name: "Ocean Blue", primary: "#2563EB", sidebar: "#1E3A5F" },
  { name: "Forest Green", primary: "#059669", sidebar: "#1B4332" },
  { name: "Warm Amber", primary: "#D97706", sidebar: "#78350F" },
  { name: "Rose", primary: "#E11D48", sidebar: "#4C0519" },
];

const DashboardSettings = () => {
  const session = getSession();
  const [name, setName] = useState(session?.user.name || "Client");
  const [email] = useState(session?.user.email || "");
  const [phone, setPhone] = useState(session?.user.phone || "");
  const [selectedTheme, setSelectedTheme] = useState(0);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl text-navy">Settings</h1>
          <p className="text-muted-foreground">Manage your profile and preferences.</p>
        </div>

        {/* Profile */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-navy flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Edit Profile</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <input value={email} readOnly className="mt-1 w-full rounded-lg border border-input bg-muted px-4 py-2.5 text-sm text-muted-foreground" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Username</label>
              <input defaultValue={email.split("@")[0] || "username"} className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm" />
            </div>
            <Button className="gap-2"><Save className="h-4 w-4" /> Save Profile</Button>
          </div>
        </div>

        {/* Password */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-navy flex items-center gap-2"><Lock className="h-5 w-5 text-primary" /> Change Password</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Current Password</label>
              <input type="password" className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm" placeholder="••••••••" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">New Password</label>
              <input type="password" className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm" placeholder="••••••••" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Confirm New Password</label>
              <input type="password" className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm" placeholder="••••••••" />
            </div>
            <Button variant="outline" className="gap-2"><Lock className="h-4 w-4" /> Update Password</Button>
          </div>
        </div>

        {/* Theme */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-navy flex items-center gap-2"><Palette className="h-5 w-5 text-primary" /> Dashboard Theme</h3>
          <p className="text-sm text-muted-foreground mt-1">Customize your dashboard color scheme.</p>
          <div className="mt-4 grid grid-cols-5 gap-3">
            {colorThemes.map((theme, i) => (
              <button
                key={theme.name}
                onClick={() => setSelectedTheme(i)}
                className={`rounded-lg border-2 p-3 transition-colors ${
                  selectedTheme === i ? "border-primary" : "border-border"
                }`}
              >
                <div className="flex gap-1 mb-2">
                  <div className="h-6 w-6 rounded-full" style={{ backgroundColor: theme.primary }} />
                  <div className="h-6 w-6 rounded-full" style={{ backgroundColor: theme.sidebar }} />
                </div>
                <p className="text-[10px] text-muted-foreground">{theme.name}</p>
              </button>
            ))}
          </div>
          <Button variant="outline" className="mt-4 gap-2"><Palette className="h-4 w-4" /> Apply Theme</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardSettings;
