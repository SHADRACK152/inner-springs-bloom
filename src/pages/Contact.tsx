import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import contactBg from "@/assets/contact-bg.jpg";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().max(20).optional(),
  service: z.string().min(1, "Please select a service"),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => { if (err.path[0]) fieldErrors[err.path[0] as string] = err.message; });
      setErrors(fieldErrors);
      return;
    }
    setSending(true);
    // Simulate send
    await new Promise(r => setTimeout(r, 1000));
    toast.success("Message sent successfully! We'll get back to you soon.");
    setForm({ name: "", email: "", phone: "", service: "", message: "" });
    setSending(false);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-background font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow";

  return (
    <>
      <Navbar />
      <main className="pt-16 md:pt-20">
        <section className="section-spacing bg-background">
          <div className="container-main">
            <div className="text-center mb-16">
              <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">Get In Touch</h1>
              <p className="font-body text-muted-foreground max-w-2xl mx-auto text-balance">
                Ready to start your journey? Reach out and let's discuss how we can support your growth.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="space-y-8">
                <img src={contactBg} alt="Nairobi skyline" className="image-frame w-full rounded-2xl h-56 object-cover mb-8" />
                <div className="space-y-6">
                  {[
                    { icon: MapPin, label: "Our Office", text: "Nairobi, Kenya" },
                    { icon: Phone, label: "Phone", text: "+254 700 000 000" },
                    { icon: Mail, label: "Email", text: "info@innerspringsafrica.com" },
                    { icon: Clock, label: "Working Hours", text: "Mon – Fri, 8:00 AM – 6:00 PM EAT" },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-display text-sm font-semibold text-foreground">{item.label}</p>
                        <p className="font-body text-sm text-muted-foreground">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="card-surface bg-card p-8 rounded-2xl space-y-5">
                <div>
                  <label className="font-display text-sm font-medium text-foreground mb-1.5 block">Full Name *</label>
                  <input className={inputClass} placeholder="Your name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ border: `1px solid ${errors.name ? 'hsl(0 84% 60%)' : 'hsl(185 59% 30% / 0.15)'}` }} />
                  {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="font-display text-sm font-medium text-foreground mb-1.5 block">Email Address *</label>
                  <input className={inputClass} type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ border: `1px solid ${errors.email ? 'hsl(0 84% 60%)' : 'hsl(185 59% 30% / 0.15)'}` }} />
                  {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="font-display text-sm font-medium text-foreground mb-1.5 block">Phone Number</label>
                  <input className={inputClass} placeholder="+254 7XX XXX XXX" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={{ border: '1px solid hsl(185 59% 30% / 0.15)' }} />
                </div>
                <div>
                  <label className="font-display text-sm font-medium text-foreground mb-1.5 block">Service of Interest *</label>
                  <select className={inputClass} value={form.service} onChange={e => setForm({...form, service: e.target.value})} style={{ border: `1px solid ${errors.service ? 'hsl(0 84% 60%)' : 'hsl(185 59% 30% / 0.15)'}` }}>
                    <option value="">Select a service</option>
                    <option>Coaching</option>
                    <option>Mental Health Services</option>
                    <option>Training & Workshops</option>
                    <option>Corporate Programs</option>
                    <option>Other</option>
                  </select>
                  {errors.service && <p className="text-destructive text-xs mt-1">{errors.service}</p>}
                </div>
                <div>
                  <label className="font-display text-sm font-medium text-foreground mb-1.5 block">Message *</label>
                  <textarea className={inputClass} rows={4} placeholder="Tell us how we can help..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} style={{ border: `1px solid ${errors.message ? 'hsl(0 84% 60%)' : 'hsl(185 59% 30% / 0.15)'}` }} />
                  {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
                </div>
                <button type="submit" disabled={sending} className="btn-primary w-full disabled:opacity-60">
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default Contact;
