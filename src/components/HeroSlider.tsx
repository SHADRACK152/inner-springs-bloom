import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import heroLeader from "@/assets/hero-leader.jpg";
import heroWorkshop from "@/assets/hero-workshop.jpg";
import heroCounseling from "@/assets/hero-counseling.jpg";

const slides = [
  {
    image: heroLeader,
    title: "Unlocking Potential Across Africa",
    subtitle: "Evidence-based coaching, mental health services, and transformative training.",
    cta: "Explore Our Services",
    link: "/coaching",
  },
  {
    image: heroWorkshop,
    title: "Evidence-Based Training for Excellence",
    subtitle: "Impactful programs that build capacity and drive organizational growth.",
    cta: "View Training Programs",
    link: "/training",
  },
  {
    image: heroCounseling,
    title: "Healing Within. Thriving Beyond.",
    subtitle: "Culturally relevant mental health support for individuals, families, and organizations.",
    cta: "Learn More",
    link: "/mental-health",
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative h-[85vh] min-h-[500px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={slide.image}
          alt={slide.title}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
        />
      </AnimatePresence>

      {/* Text on solid background box — no overlay */}
      <div className="absolute inset-0 flex items-end pb-20 md:pb-24">
        <div className="container-main">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="bg-card/95 backdrop-blur-sm p-8 md:p-10 rounded-2xl max-w-xl"
              style={{ boxShadow: "var(--shadow-card-hover)" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
            >
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-3 leading-tight">{slide.title}</h1>
              <p className="text-muted-foreground font-body text-base mb-6 text-balance">{slide.subtitle}</p>
              <Link to={slide.link} className="btn-primary inline-block">{slide.cta}</Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
        <motion.div
          className="h-full bg-accent"
          key={current}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
        />
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 right-6 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`w-3 h-3 rounded-full transition-colors ${i === current ? "bg-accent" : "bg-card/50"}`} aria-label={`Go to slide ${i + 1}`} />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
