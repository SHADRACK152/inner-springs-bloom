import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CTASection from "@/components/CTASection";
import aboutMission from "@/assets/about-mission.jpg";
import aboutTeam from "@/assets/about-team.jpg";
import { Target, Award, Lightbulb } from "lucide-react";

const values = [
  { icon: Lightbulb, title: "Potential", text: "We believe every individual, leader, and community carries an inner spring of capacity, resilience, and greatness waiting to be unlocked." },
  { icon: Award, title: "Excellence", text: "We are committed to evidence-based, culturally grounded, and professionally delivered services ensuring the highest standards of integrity and impact." },
  { icon: Target, title: "Transformation", text: "We are driven by deep, lasting change — going beyond surface solutions to cultivate true healing, resilience, and sustainable growth." },
];

const About = () => (
  <>
    <Navbar />
    <main className="pt-16 md:pt-20">
      <section className="section-spacing bg-muted">
        <div className="container-main text-center">
          <h1 className="text-primary mb-6">About Inner Springs Africa</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg text-balance">
            A people development organization dedicated to unlocking human potential across Africa. Based in Kenya, we believe that true healing and thriving begins in the mind.
          </p>
        </div>
      </section>

      <section className="section-spacing bg-card">
        <div className="container-main grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="card-surface bg-background p-8 rounded-lg">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Our Vision</p>
            <p className="font-accent text-foreground text-balance">
              "Nurturing healing within and empowering individuals and communities to thrive beyond their challenges through integrated coaching, mental health services and training."
            </p>
          </div>
          <div className="card-surface bg-background p-8 rounded-lg">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Our Mission</p>
            <p className="font-accent text-foreground text-balance">
              "To empower individuals, organizations, and communities through evidence-based mental health services, transformative coaching and impactful training."
            </p>
          </div>
        </div>
      </section>

      <section className="section-spacing bg-background">
        <div className="container-main grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <img src={aboutMission} alt="Inner Springs team collaborating" className="image-frame w-full rounded-lg" />
          <div>
            <h2 className="text-foreground mb-6">Our Story</h2>
            <p className="text-muted-foreground text-balance mb-4">
              Inner Springs Africa takes an integrated, evidence-based approach to human development, combining rigorous research with transformative practice. Our data-driven insights inform every aspect of our work, ensuring that our interventions are both scientifically grounded and culturally relevant.
            </p>
            <p className="text-muted-foreground text-balance">
              Licensed to operate in Kenya with a vision to serve the entire African continent, we bring together psychology, coaching and training in an integrated framework. We work with individuals, leaders, organizations and communities who are ready to move beyond surface-level change toward deep, lasting transformation and healing.
            </p>
          </div>
        </div>
      </section>

      <section className="section-spacing bg-card">
        <div className="container-main">
          <h2 className="text-foreground text-center mb-14">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map(v => (
              <div key={v.title} className="card-surface bg-background p-8 rounded-lg" style={{ borderTop: "3px solid hsl(var(--accent))" }}>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                  <v.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-foreground mb-3 text-xl">{v.title}</h3>
                <p className="text-muted-foreground text-sm text-balance">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing bg-background">
        <div className="container-main text-center">
          <h2 className="text-foreground mb-6">Our Team</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10 text-balance">
            Our multidisciplinary team is internationally credentialed and locally licensed — including ICF-certified coaches, regulated counselors and psychologists, and professionals certified by ISP, TVET, and NITA.
          </p>
          <img src={aboutTeam} alt="Inner Springs Africa professional team" className="image-frame w-full max-w-4xl mx-auto rounded-lg" />
        </div>
      </section>

      <CTASection />
    </main>
    <Footer />
    <WhatsAppButton />
  </>
);

export default About;
