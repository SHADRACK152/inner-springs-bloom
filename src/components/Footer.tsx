import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-card py-16">
    <div className="container-main">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <h3 className="font-display text-xl font-semibold text-card mb-3">InnerSprings Africa</h3>
          <p className="font-serif italic text-card/70 text-sm">Healing Within. Thriving Beyond.</p>
        </div>
        <div>
          <h4 className="font-display font-semibold text-card mb-4 text-sm uppercase tracking-wider">Services</h4>
          <div className="space-y-2">
            <Link to="/coaching" className="block text-sm text-card/70 hover:text-accent transition-colors">Coaching</Link>
            <Link to="/mental-health" className="block text-sm text-card/70 hover:text-accent transition-colors">Mental Health</Link>
            <Link to="/training" className="block text-sm text-card/70 hover:text-accent transition-colors">Training & Workshops</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-card mb-4 text-sm uppercase tracking-wider">Company</h4>
          <div className="space-y-2">
            <Link to="/about" className="block text-sm text-card/70 hover:text-accent transition-colors">About Us</Link>
            <Link to="/contact" className="block text-sm text-card/70 hover:text-accent transition-colors">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-card mb-4 text-sm uppercase tracking-wider">Contact</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-card/70"><MapPin className="w-4 h-4 text-accent" /> Nairobi, Kenya</div>
            <div className="flex items-center gap-2 text-sm text-card/70"><Phone className="w-4 h-4 text-accent" /> +254 700 000 000</div>
            <div className="flex items-center gap-2 text-sm text-card/70"><Mail className="w-4 h-4 text-accent" /> info@innerspringsafrica.com</div>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 text-center text-sm text-card/50" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        © {new Date().getFullYear()} Inner Springs Africa. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
