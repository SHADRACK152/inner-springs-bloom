import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import heroLeader from "@/assets/hero-leader.jpg";
import heroWorkshop from "@/assets/hero-workshop.jpg";
import heroCounseling from "@/assets/hero-counseling.jpg";

const slides = [
  {
    image: heroLeader,
    title: "Healing Within. Thriving Beyond.",
    subtitle: "Empowering your journey to wellness and greatness through integrated care.",
    primaryCta: "Book Free Assessment",
    primaryLink: "/book",
    secondaryCta: "Learn More",
    secondaryLink: "/about",
  },
  {
    image: heroWorkshop,
    title: "Evidence-Based Training for Excellence",
    subtitle: "Impactful programs that build capacity and drive organizational growth.",
    primaryCta: "View Programs",
    primaryLink: "/training",
    secondaryCta: "Contact Us",
    secondaryLink: "/contact",
  },
  {
    image: heroCounseling,
    title: "Professional Mental Health Care",
    subtitle: "Culturally relevant psychological support for individuals, families, and organizations.",
    primaryCta: "Book Intake Session",
    primaryLink: "/book",
    secondaryCta: "Our Services",
    secondaryLink: "/mental-health",
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
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

      <div className="absolute inset-0 flex items-end pb-16 md:pb-24">
        <div className="container-main">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="bg-card/95 backdrop-blur-sm p-8 md:p-10 rounded-lg max-w-xl"
              style={{ boxShadow: "var(--shadow-card-hover)" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
            >
              <h1 className="text-3xl md:text-[44px] text-primary mb-3 leading-tight">{slide.title}</h1>
              <p className="text-muted-foreground text-base mb-6 text-balance">{slide.subtitle}</p>
              <div className="flex flex-wrap gap-3">
                <Link to={slide.primaryLink} className="btn-primary">{slide.primaryCta}</Link>
                <Link to={slide.secondaryLink} className="btn-outline">{slide.secondaryCta}</Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
        <motion.div
          className="h-full bg-primary"
          key={current}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 6, ease: "linear" }}
        />
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 right-6 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`w-3 h-3 rounded-full transition-colors ${i === current ? "bg-primary" : "bg-card/50"}`} aria-label={`Go to slide ${i + 1}`} />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
