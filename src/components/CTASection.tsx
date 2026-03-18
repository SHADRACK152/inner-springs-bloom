import { Link } from "react-router-dom";

const CTASection = () => (
  <section className="section-spacing bg-primary">
    <div className="container-main text-center">
      <h2 className="text-primary-foreground mb-4">Ready to Unlock Your Potential?</h2>
      <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8 text-balance">
        We don't just help people cope — we help them thrive. Book a free assessment and take the first step toward deep, lasting transformation.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/book" className="bg-accent text-accent-foreground px-8 py-3 rounded-lg font-medium text-lg hover:brightness-110 transition">Book Free Assessment</Link>
        <Link to="/contact" className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium text-lg hover:bg-white/10 transition">Contact Us</Link>
      </div>
    </div>
  </section>
);

export default CTASection;
