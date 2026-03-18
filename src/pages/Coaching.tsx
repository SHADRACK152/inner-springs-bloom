import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CTASection from "@/components/CTASection";
import coachingImg from "@/assets/coaching.jpg";
import salesImg from "@/assets/sales-training.jpg";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const programs = [
  { title: "Sales & Leadership Coaching", items: ["Psychology of Sales & Consumer Behavior", "High-Performance Sales Mindset", "Sales Leadership & Team Motivation", "Revenue Growth Strategy"] },
  { title: "Career Transitioning Coaching", items: ["Navigating career changes", "Building new professional identities", "Strategic career planning", "Skills assessment & development"] },
  { title: "Founder Leadership Coaching", items: ["Founder mindset & resilience", "Strategic decision-making", "Team building & culture", "Scaling with purpose"] },
  { title: "Inner Compass Coaching", items: ["Purpose & identity discovery", "Values-driven decision making", "Personal vision development", "Life alignment coaching"] },
];

const journeySteps = [
  { step: "1", title: "Initial Contact", desc: "Reach out via website, phone, or email — or book directly online." },
  { step: "2", title: "Free Pre-Coaching Assessment", desc: "30-45 minute session to assess needs, discuss goals, and explain the process. No payment required." },
  { step: "3", title: "Client Portal Access", desc: "Receive your portal login, complete the intake form, and review the ICF Code of Ethics." },
  { step: "4", title: "Coaching Proposal", desc: "Your coach creates a customized proposal with objectives, sessions, pricing, and expected outcomes." },
  { step: "5", title: "Consent & Agreement", desc: "Review proposal, consent, and digitally sign your coaching agreement." },
  { step: "6", title: "Payment & Booking", desc: "Select your package, pay via M-Pesa or card, and schedule your sessions." },
  { step: "7", title: "Coaching Sessions", desc: "60-minute sessions with real-time notes, progress tracking, and coaching logs in your portal." },
  { step: "8", title: "Final Report & Support", desc: "Receive a comprehensive report, celebration of wins, and access to post-coaching resources." },
];

const Coaching = () => (
  <>
    <Navbar />
    <main className="pt-16 md:pt-20">
      <section className="section-spacing bg-muted">
        <div className="container-main grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Coaching</p>
            <h1 className="text-primary mb-6">Transformative Coaching</h1>
            <p className="text-muted-foreground text-lg text-balance mb-8">
              Personal, executive, and organizational coaching that catalyzes meaningful change and sustainable growth. Our ICF-certified coaches help leaders and teams unlock their full potential.
            </p>
            <Link to="/book" className="btn-primary inline-block">Book Free Assessment</Link>
          </div>
          <img src={coachingImg} alt="Executive coaching session in Kenya" className="image-frame w-full rounded-lg" />
        </div>
      </section>

      <section className="section-spacing bg-card">
        <div className="container-main">
          <h2 className="text-foreground text-center mb-14">Our Coaching Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map(p => (
              <div key={p.title} className="card-surface bg-background p-7 rounded-lg service-card-left">
                <h4 className="text-foreground mb-4 text-lg">{p.title}</h4>
                <ul className="space-y-2.5">
                  {p.items.map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-primary mt-1 shrink-0" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Journey */}
      <section className="section-spacing bg-background">
        <div className="container-main">
          <h2 className="text-foreground text-center mb-4">Your Coaching Journey</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-14 text-balance">
            A step-by-step guided process from initial contact to lasting transformation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {journeySteps.map((s, i) => (
              <div key={i} className="relative">
                <div className="card-surface bg-card p-6 rounded-lg h-full">
                  <span className="text-3xl font-serif text-primary/30 font-bold">{s.step}</span>
                  <h4 className="text-foreground mt-2 mb-2 text-base font-medium">{s.title}</h4>
                  <p className="text-muted-foreground text-sm">{s.desc}</p>
                </div>
                {i < journeySteps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing bg-card">
        <div className="container-main grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <img src={salesImg} alt="Sales leadership training in Nairobi" className="image-frame w-full rounded-lg" />
          <div>
            <h2 className="text-foreground mb-6">Results-Driven Approach</h2>
            <p className="text-muted-foreground text-balance mb-4">
              Our coaching methodology is grounded in evidence-based practices and tailored to the unique challenges of the African business landscape.
            </p>
            <p className="text-muted-foreground text-balance">
              Every session includes coaching logs, progress tracking, and action items — all accessible through your personal client portal.
            </p>
          </div>
        </div>
      </section>

      <CTASection />
    </main>
    <Footer />
    <WhatsAppButton />
  </>
);

export default Coaching;
