import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CTASection from "@/components/CTASection";
import mentalHealthImg from "@/assets/mental-health.jpg";
import familyImg from "@/assets/family-therapy.jpg";
import youthImg from "@/assets/youth-mental-health.jpg";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "Individual Clinical Services",
    items: ["Personality & Behavioral Disorders Support", "Neurodevelopmental & Learning Disorders Support", "Anxiety, Depression & Mood Support", "Substance Use & Addiction Support", "Trauma & Emotional Healing", "Grief & Loss Support"],
  },
  {
    title: "Family & Developmental Focus",
    items: ["Youth & Adolescent Mental Health", "Relationship & Family Therapy"],
  },
  {
    title: "Corporate & Organizational Support",
    items: ["Corporate Mental Health Programs", "Crisis Intervention & Psychological First Aid", "Stress, Burnout & Workplace Mental Health"],
  },
];

const journeySteps = [
  { step: "1", title: "Initial Inquiry & Booking", desc: "Book via website with emergency triage for urgent cases and standard booking for routine care." },
  { step: "2", title: "Intake Assessment", desc: "Comprehensive mental health assessment, clinical screening tools, and risk assessment." },
  { step: "3", title: "Client Registration", desc: "CRM profile with clinical notes, GDPR-compliant storage, consent forms, and insurance info." },
  { step: "4", title: "Treatment Plan", desc: "Diagnosis, treatment recommendations, session frequency, and collaborative goal setting." },
  { step: "5", title: "Therapy Sessions", desc: "50-minute sessions with progress notes, regular outcome monitoring, and treatment adjustments." },
  { step: "6", title: "Ongoing Care & Completion", desc: "Session reminders, crisis support, progress reviews, discharge planning, and referrals." },
];

const MentalHealth = () => (
  <>
    <Navbar />
    <main className="pt-16 md:pt-20">
      <section className="section-spacing bg-muted">
        <div className="container-main grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Mental Health</p>
            <h1 className="text-primary mb-6">Mental Health Services</h1>
            <p className="text-muted-foreground text-lg text-balance mb-8">
              Evidence-based psychological support designed to promote healing and mental wellbeing. Our licensed counselors and psychologists provide culturally relevant care.
            </p>
            <Link to="/book" className="btn-primary inline-block">Book Intake Session (Free)</Link>
          </div>
          <img src={mentalHealthImg} alt="Mental health counseling session" className="image-frame w-full rounded-lg" />
        </div>
      </section>

      <section className="section-spacing bg-card">
        <div className="container-main">
          <h2 className="text-foreground text-center mb-14">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map(c => (
              <div key={c.title} className="card-surface bg-background p-7 rounded-lg" style={{ borderTop: "3px solid hsl(var(--accent))" }}>
                <h4 className="text-foreground mb-5 text-lg">{c.title}</h4>
                <ul className="space-y-2.5">
                  {c.items.map(item => (
                    <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-olive mt-2 shrink-0" />
                      {item}
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
          <h2 className="text-foreground text-center mb-4">Your Care Journey</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-14 text-balance">
            A safe, guided process from your first inquiry to lasting wellness.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {journeySteps.map((s, i) => (
              <div key={i} className="relative">
                <div className="card-surface bg-card p-6 rounded-lg h-full">
                  <span className="text-3xl font-serif text-primary/30 font-bold">{s.step}</span>
                  <h4 className="text-foreground mt-2 mb-2 text-base font-medium">{s.title}</h4>
                  <p className="text-muted-foreground text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing bg-card">
        <div className="container-main grid grid-cols-1 md:grid-cols-2 gap-8">
          <img src={familyImg} alt="Family therapy session in Kenya" className="image-frame w-full rounded-lg h-72 object-cover" />
          <img src={youthImg} alt="Youth mental health awareness program" className="image-frame w-full rounded-lg h-72 object-cover" />
        </div>
        <div className="container-main mt-10 text-center">
          <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
            We provide comprehensive mental health support for individuals, families, youth, and organizations — creating safe spaces for healing and growth within Kenya's diverse communities.
          </p>
        </div>
      </section>

      <CTASection />
    </main>
    <Footer />
    <WhatsAppButton />
  </>
);

export default MentalHealth;
