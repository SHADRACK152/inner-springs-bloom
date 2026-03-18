import { Link } from "react-router-dom";

const CTASection = () => (
  <section className="section-spacing bg-primary">
    <div className="container-main text-center">
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-primary-foreground mb-4">Ready to Unlock Your Potential?</h2>
      <p className="font-body text-primary-foreground/80 max-w-xl mx-auto mb-8 text-balance">
        We don't just help people cope — we help them thrive. Book a discovery call and take the first step toward deep, lasting transformation.
      </p>
      <Link to="/contact" className="btn-accent inline-block text-lg">Book a Discovery Call</Link>
    </div>
  </section>
);

export default CTASection;
