import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "@/assets/logo.jpg";

const services = [
  { label: "Coaching", path: "/coaching" },
  { label: "Mental Health Services", path: "/mental-health" },
  { label: "Training & Workshops", path: "/training" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div className="container-main flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Inner Springs Africa" className="h-10 md:h-12 rounded-md" />
          <span className="font-display font-semibold text-lg text-foreground hidden sm:block">InnerSprings</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={`font-display text-sm font-medium transition-colors ${isActive("/") ? "text-primary" : "text-foreground hover:text-primary"}`}>Home</Link>
          <Link to="/about" className={`font-display text-sm font-medium transition-colors ${isActive("/about") ? "text-primary" : "text-foreground hover:text-primary"}`}>About</Link>
          
          <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
            <button className="font-display text-sm font-medium text-foreground hover:text-primary flex items-center gap-1 transition-colors">
              Services <ChevronDown className="w-4 h-4" />
            </button>
            {servicesOpen && (
              <div className="absolute top-full left-0 mt-2 bg-card rounded-xl py-2 min-w-[220px]" style={{ boxShadow: "var(--shadow-card-hover)" }}>
                {services.map(s => (
                  <Link key={s.path} to={s.path} className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors font-body">
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/contact" className={`font-display text-sm font-medium transition-colors ${isActive("/contact") ? "text-primary" : "text-foreground hover:text-primary"}`}>Contact</Link>
          <Link to="/contact" className="btn-primary text-sm">Book a Discovery Call</Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card pb-6 px-6 space-y-4">
          <Link to="/" onClick={() => setMobileOpen(false)} className="block font-display text-sm font-medium py-2">Home</Link>
          <Link to="/about" onClick={() => setMobileOpen(false)} className="block font-display text-sm font-medium py-2">About</Link>
          {services.map(s => (
            <Link key={s.path} to={s.path} onClick={() => setMobileOpen(false)} className="block font-display text-sm font-medium py-2 pl-4 text-muted-foreground">{s.label}</Link>
          ))}
          <Link to="/contact" onClick={() => setMobileOpen(false)} className="block font-display text-sm font-medium py-2">Contact</Link>
          <Link to="/contact" onClick={() => setMobileOpen(false)} className="btn-primary text-sm inline-block text-center w-full">Book a Discovery Call</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
