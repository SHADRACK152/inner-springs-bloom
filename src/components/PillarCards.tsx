import { Link } from "react-router-dom";
import { Users, Heart, BookOpen } from "lucide-react";

const pillars = [
  {
    icon: Users,
    title: "Coaching",
    description: "Personal, executive, and organizational coaching that catalyzes meaningful change and sustainable growth.",
    link: "/coaching",
  },
  {
    icon: Heart,
    title: "Mental Health Services",
    description: "Evidence-based psychological support designed to promote healing and mental wellbeing.",
    link: "/mental-health",
  },
  {
    icon: BookOpen,
    title: "Training & Workshops",
    description: "Impactful programs that build capacity and drive organizational excellence.",
    link: "/training",
  },
];

const PillarCards = () => (
  <section className="section-spacing bg-background">
    <div className="container-main">
      <div className="text-center mb-16">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">Our Core Services</h2>
        <p className="text-muted-foreground font-body max-w-2xl mx-auto text-balance">We bring together psychology, coaching, and training in an integrated framework for deep, lasting transformation.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pillars.map(p => (
          <Link to={p.link} key={p.title} className="card-surface bg-secondary/30 p-8 rounded-2xl group cursor-pointer">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <p.icon className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-3">{p.title}</h3>
            <p className="text-muted-foreground font-body text-sm text-balance mb-4">{p.description}</p>
            <span className="text-primary font-display text-sm font-medium group-hover:underline">Learn more →</span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default PillarCards;
