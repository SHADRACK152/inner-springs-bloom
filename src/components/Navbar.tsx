import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "@/assets/logo.jpg";

const services = [
  { label: "Mental Health Services", path: "/mental-health" },
  { label: "Coaching", path: "/coaching" },
  { label: "Training & Workshops", path: "/training" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const linkClass = (path: string) =>
    `text-[15px] font-medium transition-colors ${isActive(path) ? "text-primary" : "text-foreground hover:text-primary"}`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div className="container-main flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Inner Springs Africa" className="h-10 md:h-12 rounded-md" />
          <span className="font-semibold text-lg text-foreground hidden sm:block">InnerSprings</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-7">
          <Link to="/" className={linkClass("/")}>Home</Link>

          <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
            <button className="text-[15px] font-medium text-foreground hover:text-primary flex items-center gap-1 transition-colors">
              Services <ChevronDown className="w-4 h-4" />
            </button>
            {servicesOpen && (
              <div className="absolute top-full left-0 mt-2 bg-card rounded-lg py-2 min-w-[220px]" style={{ boxShadow: "var(--shadow-card-hover)" }}>
                {services.map(s => (
                  <Link key={s.path} to={s.path} className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors">
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/about" className={linkClass("/about")}>About</Link>
          <Link to="/resources" className={linkClass("/resources")}>Resources</Link>
          <Link to="/contact" className={linkClass("/contact")}>Contact</Link>
          <Link to="/login" className={`${linkClass("/login")} border border-primary px-4 py-2 rounded-lg`}>Client Log In</Link>
          <Link to="/admin/login" className={linkClass("/admin/login")}>Admin Login</Link>
          <Link to="/book" className="btn-primary text-sm">Book a Session</Link>
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-card pb-6 px-6 space-y-3">
          <Link to="/" onClick={() => setMobileOpen(false)} className="block text-[15px] font-medium py-2">Home</Link>
          <p className="text-xs text-muted-foreground uppercase tracking-wider pt-2">Services</p>
          {services.map(s => (
            <Link key={s.path} to={s.path} onClick={() => setMobileOpen(false)} className="block text-[15px] font-medium py-1.5 pl-3 text-muted-foreground">{s.label}</Link>
          ))}
          <Link to="/about" onClick={() => setMobileOpen(false)} className="block text-[15px] font-medium py-2">About</Link>
          <Link to="/resources" onClick={() => setMobileOpen(false)} className="block text-[15px] font-medium py-2">Resources</Link>
          <Link to="/contact" onClick={() => setMobileOpen(false)} className="block text-[15px] font-medium py-2">Contact</Link>
          <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-[15px] font-medium py-2 text-primary">Client Log In</Link>
          <Link to="/admin/login" onClick={() => setMobileOpen(false)} className="block text-[15px] font-medium py-2">Admin Login</Link>
          <Link to="/book" onClick={() => setMobileOpen(false)} className="btn-primary text-sm inline-block text-center w-full mt-2">Book a Session</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
