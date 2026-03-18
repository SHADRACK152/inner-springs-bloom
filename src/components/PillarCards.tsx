import { Link } from "react-router-dom";
import { Heart, Users, BookOpen, BarChart3 } from "lucide-react";

const pillars = [
  {
    icon: Heart,
    title: "Mental Health",
    subtitle: "Professional Care",
    description: "Evidence-based psychological support designed to promote healing and mental wellbeing.",
    cta: "Book for Intake Session (Free)",
    link: "/book",
  },
  {
    icon: Users,
    title: "Coaching",
    subtitle: "Evidence-Based Transformative Journey",
    description: "Personal, executive, and organizational coaching that catalyzes meaningful change.",
    cta: "Book for Intake Session (Free)",
    link: "/book",
  },
  {
    icon: BookOpen,
    title: "Training",
    subtitle: "Professional Development Programs",
    description: "Impactful programs that build capacity and drive organizational excellence.",
    cta: "Book for Need Analysis (Free)",
    link: "/book",
  },
  {
    icon: BarChart3,
    title: "Research",
    subtitle: "Data-Driven Insights",
    description: "Rigorous research informing evidence-based interventions that are scientifically grounded.",
    cta: "Learn More",
    link: "/about",
  },
];

const PillarCards = () => (
  <section className="section-spacing bg-background">
    <div className="container-main">
      <div className="text-center mb-14">
        <h2 className="text-foreground mb-4">Our Services</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
          We bring together psychology, coaching, and training in an integrated framework for deep, lasting transformation.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map(p => (
          <div key={p.title} className="card-surface bg-card p-6 rounded-lg service-card-left group">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <p.icon className="w-6 h-6 text-primary" />
            </div>
            <h4 className="text-foreground mb-1 text-lg">{p.title}</h4>
            <p className="text-sm text-accent font-medium mb-3">{p.subtitle}</p>
            <p className="text-muted-foreground text-sm text-balance mb-4">{p.description}</p>
            <Link to={p.link} className="text-primary text-sm font-medium hover:underline">
              {p.cta} →
            </Link>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PillarCards;
