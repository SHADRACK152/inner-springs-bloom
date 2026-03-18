import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CTASection from "@/components/CTASection";
import mentalHealthImg from "@/assets/mental-health.jpg";
import familyImg from "@/assets/family-therapy.jpg";
import youthImg from "@/assets/youth-mental-health.jpg";
import { Link } from "react-router-dom";

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

const MentalHealth = () => (
  <>
    <Navbar />
    <main className="pt-16 md:pt-20">
      <section className="section-spacing bg-secondary/20">
        <div className="container-main grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-display text-sm font-semibold text-accent uppercase tracking-wider mb-3">Pillar 2</p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-6">Mental Health Services</h1>
            <p className="font-body text-muted-foreground text-lg text-balance mb-8">
              Evidence-based psychological support designed to promote healing and mental wellbeing. Our licensed counselors and psychologists provide culturally relevant care.
            </p>
            <Link to="/contact" className="btn-primary inline-block">Schedule a Consultation</Link>
          </div>
          <img src={mentalHealthImg} alt="Mental health counseling session" className="image-frame w-full rounded-2xl" />
        </div>
      </section>

      <section className="section-spacing bg-background">
        <div className="container-main">
          <h2 className="font-display text-3xl font-semibold text-foreground text-center mb-16">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map(c => (
              <div key={c.title} className="card-surface bg-card p-8 rounded-2xl gold-top-border">
                <h3 className="font-display text-lg font-semibold text-foreground mb-5">{c.title}</h3>
                <ul className="space-y-3">
                  {c.items.map(item => (
                    <li key={item} className="font-body text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing bg-card">
        <div className="container-main grid grid-cols-1 md:grid-cols-2 gap-8">
          <img src={familyImg} alt="Family therapy session in Kenya" className="image-frame w-full rounded-2xl h-72 object-cover" />
          <img src={youthImg} alt="Youth mental health awareness program" className="image-frame w-full rounded-2xl h-72 object-cover" />
        </div>
        <div className="container-main mt-10 text-center">
          <p className="font-body text-muted-foreground max-w-2xl mx-auto text-balance">
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
