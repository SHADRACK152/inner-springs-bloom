import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CTASection from "@/components/CTASection";
import coachingImg from "@/assets/coaching.jpg";
import salesImg from "@/assets/sales-training.jpg";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const programs = [
  { title: "Sales & Leadership Coaching", items: ["Psychology of Sales & Consumer Behavior", "High-Performance Sales Mindset", "Sales Leadership & Team Motivation", "Revenue Growth Strategy"] },
  { title: "Career Transitioning Coaching", items: ["Navigating career changes", "Building new professional identities", "Strategic career planning", "Skills assessment & development"] },
  { title: "Founder Leadership Coaching", items: ["Founder mindset & resilience", "Strategic decision-making", "Team building & culture", "Scaling with purpose"] },
  { title: "Inner Compass Coaching", items: ["Purpose & identity discovery", "Values-driven decision making", "Personal vision development", "Life alignment coaching"] },
];

const Coaching = () => (
  <>
    <Navbar />
    <main className="pt-16 md:pt-20">
      <section className="section-spacing bg-secondary/20">
        <div className="container-main grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-display text-sm font-semibold text-accent uppercase tracking-wider mb-3">Pillar 1</p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-6">Coaching</h1>
            <p className="font-body text-muted-foreground text-lg text-balance mb-8">
              Personal, executive, and organizational coaching that catalyzes meaningful change and sustainable growth. Our ICF-certified coaches help leaders and teams unlock their full potential.
            </p>
            <Link to="/contact" className="btn-primary inline-block">Book a Coaching Session</Link>
          </div>
          <img src={coachingImg} alt="Executive coaching session in Kenya" className="image-frame w-full rounded-2xl" />
        </div>
      </section>

      <section className="section-spacing bg-background">
        <div className="container-main">
          <h2 className="font-display text-3xl font-semibold text-foreground text-center mb-16">Our Coaching Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map(p => (
              <div key={p.title} className="card-surface bg-card p-8 rounded-2xl">
                <h3 className="font-display text-xl font-semibold text-foreground mb-5">{p.title}</h3>
                <ul className="space-y-3">
                  {p.items.map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <span className="font-body text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing bg-card">
        <div className="container-main grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <img src={salesImg} alt="Sales leadership training in Nairobi" className="image-frame w-full rounded-2xl" />
          <div>
            <h2 className="font-display text-3xl font-semibold text-foreground mb-6">Results-Driven Approach</h2>
            <p className="font-body text-muted-foreground text-balance mb-4">
              Our coaching methodology is grounded in evidence-based practices and tailored to the unique challenges of the African business landscape.
            </p>
            <p className="font-body text-muted-foreground text-balance">
              We work with individuals, leaders, and organizations who are ready to move beyond surface-level change toward deep, lasting transformation.
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
