import { useEffect, useState } from "react";
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
  const [portalOpen, setPortalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const linkClass = (path: string) =>
    `rounded-full px-3 py-2 text-[14px] font-medium transition-all ${
      isActive(path)
        ? "bg-primary/10 text-primary"
        : "text-foreground/85 hover:bg-muted hover:text-foreground"
    }`;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
    setPortalOpen(false);
  }, [location.pathname]);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        className={`mx-auto flex w-full max-w-[1240px] items-center justify-between rounded-2xl border px-4 py-3 backdrop-blur-xl transition-all md:px-6 ${
          isScrolled
            ? "border-border/80 bg-card/92 shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
            : "border-border/50 bg-card/82 shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
        }`}
      >
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Inner Springs Africa"
            className="h-10 w-10 rounded-full border border-primary/20 object-cover shadow-sm md:h-11 md:w-11"
          />
          <span className="hidden text-base font-semibold tracking-tight text-foreground sm:block">InnerSprings</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <Link to="/" className={linkClass("/")}>Home</Link>

          <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
            <button
              className={`flex items-center gap-1 rounded-full px-3 py-2 text-[14px] font-medium transition-all ${
                location.pathname === "/mental-health" || location.pathname === "/coaching" || location.pathname === "/training"
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/85 hover:bg-muted hover:text-foreground"
              }`}
              type="button"
            >
              Services <ChevronDown className="w-4 h-4" />
            </button>
            {servicesOpen && (
              <div className="absolute left-0 top-full mt-2 min-w-[260px] overflow-hidden rounded-xl border border-border/60 bg-card/95 py-2 shadow-[0_12px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl">
                {services.map(s => (
                  <Link
                    key={s.path}
                    to={s.path}
                    className={`mx-2 block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      isActive(s.path) ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/about" className={linkClass("/about")}>About</Link>
          <Link to="/resources" className={linkClass("/resources")}>Resources</Link>
          <Link to="/contact" className={linkClass("/contact")}>Contact</Link>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <div className="relative" onMouseEnter={() => setPortalOpen(true)} onMouseLeave={() => setPortalOpen(false)}>
            <button
              className={`flex items-center gap-1 rounded-full border px-4 py-2 text-[14px] font-semibold transition-all ${
                isActive("/login") || isActive("/admin/login")
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-primary/35 bg-primary/5 text-primary hover:border-primary/60 hover:bg-primary/10"
              }`}
              type="button"
            >
              Portal <ChevronDown className="h-4 w-4" />
            </button>
            {portalOpen && (
              <div className="absolute right-0 top-full mt-2 min-w-[210px] overflow-hidden rounded-xl border border-border/60 bg-card/95 py-2 shadow-[0_12px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl">
                <Link
                  to="/login"
                  className={`mx-2 block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive("/login") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                  }`}
                >
                  Client Login
                </Link>
                <Link
                  to="/admin/login"
                  className={`mx-2 block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive("/admin/login") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                  }`}
                >
                  Admin Login
                </Link>
              </div>
            )}
          </div>
          <Link
            to="/book"
            className="rounded-full bg-primary px-4 py-2 text-[14px] font-semibold text-primary-foreground shadow-[0_6px_18px_rgba(0,0,0,0.16)] transition-transform hover:-translate-y-0.5"
          >
            Book a Session
          </Link>
        </div>

        <button
          className="rounded-lg border border-border/70 p-2 text-foreground lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          type="button"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="mx-auto mt-2 w-full max-w-[1240px] rounded-2xl border border-border/70 bg-card/95 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl lg:hidden">
          <div className="space-y-1">
            <Link to="/" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-[15px] font-medium hover:bg-muted">Home</Link>
            <Link to="/about" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-[15px] font-medium hover:bg-muted">About</Link>
            <Link to="/resources" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-[15px] font-medium hover:bg-muted">Resources</Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-[15px] font-medium hover:bg-muted">Contact</Link>
          </div>

          <p className="pb-1 pt-3 text-xs uppercase tracking-wider text-muted-foreground">Services</p>
          {services.map(s => (
            <Link
              key={s.path}
              to={s.path}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2 text-[15px] text-foreground/90 hover:bg-muted"
            >
              {s.label}
            </Link>
          ))}

          <p className="pb-1 pt-3 text-xs uppercase tracking-wider text-muted-foreground">Portal</p>
          <div className="grid gap-2">
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg border border-primary/35 bg-primary/5 px-4 py-2.5 text-center text-sm font-semibold text-primary"
            >
              Client Login
            </Link>
            <Link
              to="/admin/login"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg border border-border px-4 py-2.5 text-center text-sm font-medium text-foreground"
            >
              Admin Login
            </Link>
            <Link
              to="/book"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground"
            >
              Book a Session
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
