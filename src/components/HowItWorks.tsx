import { CalendarCheck, ClipboardList, UserCheck, Sparkles } from "lucide-react";

const steps = [
  { icon: CalendarCheck, step: "01", title: "Book Free Assessment", description: "Schedule a free intake session or needs analysis — no obligation, completely free." },
  { icon: ClipboardList, step: "02", title: "Personalized Plan", description: "Receive a customized proposal with objectives, timeline, and investment details." },
  { icon: UserCheck, step: "03", title: "Begin Your Journey", description: "Access your client portal, complete onboarding, and start your sessions." },
  { icon: Sparkles, step: "04", title: "Transform & Thrive", description: "Experience lasting change with ongoing support, progress tracking, and expert care." },
];

const HowItWorks = () => (
  <section className="section-spacing bg-card">
    <div className="container-main">
      <div className="text-center mb-14">
        <h2 className="text-foreground mb-4">How It Works</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
          Your journey to transformation is simple and guided every step of the way.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((s, i) => (
          <div key={i} className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <s.icon className="w-7 h-7 text-primary" />
            </div>
            <span className="text-xs font-bold text-accent uppercase tracking-widest">Step {s.step}</span>
            <h4 className="text-foreground mt-2 mb-2 text-lg">{s.title}</h4>
            <p className="text-muted-foreground text-sm text-balance">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
