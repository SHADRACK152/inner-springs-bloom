import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-navy text-white py-16">
    <div className="container-main">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <h3 className="font-serif text-xl mb-3">InnerSprings Africa</h3>
          <p className="font-serif italic text-white/70 text-sm">Healing Within. Thriving Beyond.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/90">Services</h4>
          <div className="space-y-2">
            <Link to="/mental-health" className="block text-sm text-white/60 hover:text-accent transition-colors">Mental Health</Link>
            <Link to="/coaching" className="block text-sm text-white/60 hover:text-accent transition-colors">Coaching</Link>
            <Link to="/training" className="block text-sm text-white/60 hover:text-accent transition-colors">Training & Workshops</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/90">Company</h4>
          <div className="space-y-2">
            <Link to="/about" className="block text-sm text-white/60 hover:text-accent transition-colors">About Us</Link>
            <Link to="/resources" className="block text-sm text-white/60 hover:text-accent transition-colors">Resources</Link>
            <Link to="/portal" className="block text-sm text-white/60 hover:text-accent transition-colors">Client Portal</Link>
            <Link to="/contact" className="block text-sm text-white/60 hover:text-accent transition-colors">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/90">Contact</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-2 text-sm text-white/60"><MapPin className="w-4 h-4 text-accent mt-0.5" /> Kenya Bankers Complex, 3rd Avenue Ngong, Ground Floor</div>
            <div className="flex items-center gap-2 text-sm text-white/60"><Phone className="w-4 h-4 text-accent" /> +254 720 851 710</div>
            <div className="flex items-center gap-2 text-sm text-white/60"><Mail className="w-4 h-4 text-accent" /> info@innersprings.Africa</div>
          </div>
          <div className="flex gap-4 mt-4">
            <a href="https://twitter.com/Innersprings" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-accent text-sm">𝕏</a>
            <a href="https://facebook.com/Innersprings" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-accent text-sm">Facebook</a>
            <a href="https://instagram.com/Innersprings" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-accent text-sm">Instagram</a>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 text-center text-sm text-white/30" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        © {new Date().getFullYear()} Inner Springs Africa. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
