import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CTASection from "@/components/CTASection";
import trainingImg from "@/assets/training.jpg";
import { Link } from "react-router-dom";
import { BookOpen, Brain, TrendingUp, Users, Shield, Heart } from "lucide-react";

const tracks = [
  {
    icon: Heart,
    title: "Mental Health & Emotional Wellbeing",
    modules: ["Workplace Mental Health & Psychological Safety", "Stress & Burnout Prevention", "Emotional Intelligence & Self-Leadership", "Trauma Awareness & Psychological First Aid", "Resilience & Adaptive Coping Skills", "Mental Health Awareness for Managers", "Youth Mental Health & School-Based Programs"],
  },
  {
    icon: TrendingUp,
    title: "Sales & Performance Excellence",
    modules: ["Psychology of Sales & Consumer Behavior", "High-Performance Sales Mindset", "Ethical & Consultative Selling", "Sales Leadership & Team Motivation", "Revenue Growth Strategy", "Negotiation & Influence Skills", "Customer Relationship & Retention Strategy"],
  },
  {
    icon: Shield,
    title: "Faith-Based & Values-Driven Leadership",
    modules: ["Emotional & Spiritual Wellness", "Faith & Mental Health Integration", "Faith-based Leadership & Servant Leadership", "Pastoral Care & Basic Counseling Skills", "Purpose, Calling & Identity Development", "Conflict Resolution in Ministry Settings"],
  },
  {
    icon: Users,
    title: "Leadership & Organizational Effectiveness",
    modules: ["Transformational Leadership", "Change Management & Organizational Culture", "Strategic Thinking & Decision-Making", "Governance & Ethical Leadership", "Team Effectiveness & Collaboration", "Performance Management Systems"],
  },
];

const Training = () => (
  <>
    <Navbar />
    <main className="pt-16 md:pt-20">
      <section className="section-spacing bg-secondary/20">
        <div className="container-main grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-display text-sm font-semibold text-accent uppercase tracking-wider mb-3">Pillar 3</p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-6">Training & Workshops</h1>
            <p className="font-body text-muted-foreground text-lg text-balance mb-8">
              Impactful programs that build capacity and drive organizational excellence. NITA and TVET certified training tailored to the African context.
            </p>
            <Link to="/contact" className="btn-primary inline-block">Inquire About Training</Link>
          </div>
          <img src={trainingImg} alt="Corporate training workshop in Nairobi" className="image-frame w-full rounded-2xl" />
        </div>
      </section>

      <section className="section-spacing bg-background">
        <div className="container-main">
          <h2 className="font-display text-3xl font-semibold text-foreground text-center mb-4">Training Tracks</h2>
          <p className="text-muted-foreground font-body text-center max-w-2xl mx-auto mb-16 text-balance">Browse our comprehensive curriculum designed for organizations, leaders, and individuals ready for transformation.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tracks.map(t => (
              <div key={t.title} className="card-surface bg-card p-8 rounded-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <t.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{t.title}</h3>
                </div>
                <ul className="space-y-2.5">
                  {t.modules.map((m, i) => (
                    <li key={i} className="font-body text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </main>
    <Footer />
    <WhatsAppButton />
  </>
);

export default Training;
