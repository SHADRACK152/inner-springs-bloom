import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useState } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { api } from "@/lib/api";

const BookSession = () => {
  const [step, setStep] = useState(1);
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  const services = [
    { id: "mental-health", label: "Mental Health Services", desc: "Book a free intake assessment with a licensed counselor." },
    { id: "coaching", label: "Pre-Coaching Assessment", desc: "30-45 min free session to assess coaching needs and goals." },
    { id: "training", label: "Training Programs Need Analysis", desc: "Free needs assessment for corporate or individual training." },
  ];

  const times = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"];

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await api.post("/api/bookings", {
        service,
        date,
        time,
        ...form,
      });
      toast.success("Assessment booked successfully! Check your email for confirmation details.");
      setStep(5);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to complete booking";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-16 md:pt-20">
        <section className="section-spacing bg-background">
          <div className="container-main max-w-3xl">
            <div className="text-center mb-10">
              <h1 className="text-primary mb-4">Book Your Assessment</h1>
              <p className="text-muted-foreground text-balance">
                Start your journey with a free intake session. No obligations, completely free.
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 mb-10">
              {["Service", "Schedule", "Details", "Confirm"].map((label, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step > i + 1 ? "bg-olive text-white" : step === i + 1 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                  }`}>
                    {step > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-sm hidden sm:block ${step === i + 1 ? "text-foreground font-medium" : "text-muted-foreground"}`}>{label}</span>
                  {i < 3 && <div className={`w-8 h-0.5 ${step > i + 1 ? "bg-olive" : "bg-muted"}`} />}
                </div>
              ))}
            </div>

            <div className="card-surface bg-card p-8 rounded-lg">
              {/* Step 1: Select Service */}
              {step === 1 && (
                <div>
                  <h2 className="text-foreground mb-6 text-2xl">Step 1: Select Service</h2>
                  <div className="space-y-3">
                    {services.map(s => (
                      <label
                        key={s.id}
                        className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                          service === s.id ? "border-primary bg-primary/5" : "border-input hover:border-primary/30"
                        }`}
                      >
                        <input type="radio" name="service" value={s.id} checked={service === s.id} onChange={() => setService(s.id)} className="mt-1 accent-primary" />
                        <div>
                          <p className="font-medium text-foreground">{s.label}</p>
                          <p className="text-sm text-muted-foreground">{s.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <button disabled={!service} onClick={() => setStep(2)} className="btn-primary w-full mt-6 disabled:opacity-40">Continue</button>
                </div>
              )}

              {/* Step 2: Schedule */}
              {step === 2 && (
                <div>
                  <h2 className="text-foreground mb-6 text-2xl">Step 2: Choose Date & Time</h2>
                  <div className="mb-6">
                    <label className="text-sm font-medium text-foreground mb-2 block">Preferred Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-background text-sm border border-input focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Preferred Time</label>
                    <div className="grid grid-cols-3 gap-3">
                      {times.map(t => (
                        <button key={t} onClick={() => setTime(t)} className={`py-3 rounded-lg text-sm font-medium transition-colors ${
                          time === t ? "bg-primary text-white" : "bg-background border border-input text-foreground hover:border-primary"
                        }`}>{t}</button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setStep(1)} className="btn-outline flex-1">Back</button>
                    <button disabled={!date || !time} onClick={() => setStep(3)} className="btn-primary flex-1 disabled:opacity-40">Continue</button>
                  </div>
                </div>
              )}

              {/* Step 3: Your Details */}
              {step === 3 && (
                <div>
                  <h2 className="text-foreground mb-6 text-2xl">Step 3: Your Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name *</label>
                      <input className="w-full px-4 py-3 rounded-lg bg-background text-sm border border-input focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Your name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
                      <input type="email" className="w-full px-4 py-3 rounded-lg bg-background text-sm border border-input focus:outline-none focus:ring-2 focus:ring-primary" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Phone *</label>
                      <input className="w-full px-4 py-3 rounded-lg bg-background text-sm border border-input focus:outline-none focus:ring-2 focus:ring-primary" placeholder="+254 7XX XXX XXX" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Additional Notes</label>
                      <textarea className="w-full px-4 py-3 rounded-lg bg-background text-sm border border-input focus:outline-none focus:ring-2 focus:ring-primary" rows={3} placeholder="Any questions or specific concerns..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setStep(2)} className="btn-outline flex-1">Back</button>
                    <button disabled={!form.name || !form.email || !form.phone} onClick={() => setStep(4)} className="btn-primary flex-1 disabled:opacity-40">Continue</button>
                  </div>
                </div>
              )}

              {/* Step 4: Confirm */}
              {step === 4 && (
                <div>
                  <h2 className="text-foreground mb-6 text-2xl">Step 4: Confirm Booking</h2>
                  <div className="bg-background rounded-lg p-6 space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service</span>
                      <span className="text-foreground font-medium">{services.find(s => s.id === service)?.label}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Date</span>
                      <span className="text-foreground font-medium">{date}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Time</span>
                      <span className="text-foreground font-medium">{time}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Name</span>
                      <span className="text-foreground font-medium">{form.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Email</span>
                      <span className="text-foreground font-medium">{form.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phone</span>
                      <span className="text-foreground font-medium">{form.phone}</span>
                    </div>
                    <div className="border-t border-input pt-3 mt-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Cost</span>
                        <span className="text-olive font-bold">FREE</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(3)} className="btn-outline flex-1">Back</button>
                    <button onClick={handleSubmit} className="btn-primary flex-1" disabled={submitting}>
                      {submitting ? "Confirming..." : "Confirm Booking"}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Success */}
              {step === 5 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-olive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-olive" />
                  </div>
                  <h2 className="text-foreground mb-3 text-2xl">Booking Confirmed!</h2>
                  <p className="text-muted-foreground text-balance mb-2">
                    Your free assessment has been scheduled. A confirmation email has been sent to <strong>{form.email}</strong>.
                  </p>
                  <p className="text-sm text-muted-foreground mb-8">
                    What to expect: A 30-45 minute conversation to discuss your goals. No obligations.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button onClick={() => { setStep(1); setService(""); setDate(""); setTime(""); setForm({ name: "", email: "", phone: "", notes: "" }); }} className="btn-outline">Book Another</button>
                    <a href="/" className="btn-primary inline-block">Return Home</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default BookSession;
