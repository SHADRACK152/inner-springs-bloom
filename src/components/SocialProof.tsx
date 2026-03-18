const badges = ["ICF Certified", "NITA Approved", "TVET Certified", "Kenya Counsellors & Psychologists Board", "ISP Certified"];

const SocialProof = () => (
  <section className="py-12 bg-cream overflow-hidden">
    <div className="flex animate-marquee whitespace-nowrap">
      {[...badges, ...badges].map((badge, i) => (
        <div key={i} className="mx-8 flex items-center gap-3 shrink-0">
          <div className="w-3 h-3 rounded-full bg-accent" />
          <span className="font-display text-sm font-medium text-foreground/60 uppercase tracking-wider">{badge}</span>
        </div>
      ))}
    </div>
  </section>
);

export default SocialProof;
