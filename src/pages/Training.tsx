import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CTASection from "@/components/CTASection";
import trainingImg from "@/assets/training.jpg";
import { Link } from "react-router-dom";
import { Heart, TrendingUp, Users, Shield } from "lucide-react";

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

const journeySteps = [
  { step: "1", title: "Program Inquiry", desc: "Browse training catalog. Corporate vs individual training options available." },
  { step: "2", title: "Needs Assessment", desc: "Organizational assessment for corporate, skill level evaluation for individuals." },
  { step: "3", title: "Proposal & Registration", desc: "Training proposal with objectives, schedule, logistics, and payment options." },
  { step: "4", title: "Pre-Training Materials", desc: "Pre-work assignments, reading materials, and LMS login credentials." },
  { step: "5", title: "Training Delivery", desc: "In-person or virtual sessions with interactive activities and assessments." },
  { step: "6", title: "Post-Training & Certificate", desc: "Certificate of completion, training archive, action plan, and 30-day follow-up." },
];

const Training = () => (
  <>
    <Navbar />
    <main className="pt-16 md:pt-20">
      <section className="section-spacing bg-muted">
        <div className="container-main grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Training</p>
            <h1 className="text-primary mb-6">Training & Workshops</h1>
            <p className="text-muted-foreground text-lg text-balance mb-8">
              Impactful programs that build capacity and drive organizational excellence. NITA and TVET certified training tailored to the African context.
            </p>
            <Link to="/book" className="btn-primary inline-block">Book Need Analysis (Free)</Link>
          </div>
          <img src={trainingImg} alt="Corporate training workshop in Nairobi" className="image-frame w-full rounded-lg" />
        </div>
      </section>

      <section className="section-spacing bg-card">
        <div className="container-main">
          <h2 className="text-foreground text-center mb-4">Training Tracks</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-14 text-balance">
            Comprehensive curriculum designed for organizations, leaders, and individuals ready for transformation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tracks.map(t => (
              <div key={t.title} className="card-surface bg-background p-7 rounded-lg service-card-left">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <t.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-foreground text-lg">{t.title}</h4>
                </div>
                <ul className="space-y-2">
                  {t.modules.map((m, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
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

      {/* Training Journey */}
      <section className="section-spacing bg-background">
        <div className="container-main">
          <h2 className="text-foreground text-center mb-4">Your Training Journey</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-14 text-balance">
            From inquiry to certification — a structured path to professional growth.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {journeySteps.map((s, i) => (
              <div key={i} className="card-surface bg-card p-6 rounded-lg">
                <span className="text-3xl font-serif text-primary/30 font-bold">{s.step}</span>
                <h4 className="text-foreground mt-2 mb-2 text-base font-medium">{s.title}</h4>
                <p className="text-muted-foreground text-sm">{s.desc}</p>
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
