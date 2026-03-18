const badges = ["ICF Certified", "NITA Approved", "TVET Certified", "Kenya Counsellors & Psychologists Board", "ISP Certified"];

const SocialProof = () => (
  <section className="py-10 bg-muted overflow-hidden">
    <div className="flex animate-marquee whitespace-nowrap">
      {[...badges, ...badges].map((badge, i) => (
        <div key={i} className="mx-8 flex items-center gap-3 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
          <span className="text-sm font-medium text-foreground/50 uppercase tracking-wider">{badge}</span>
        </div>
      ))}
    </div>
  </section>
);

export default SocialProof;
