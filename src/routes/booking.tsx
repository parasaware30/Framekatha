import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Calendar, MapPin, Phone, User, Mail, Sparkles, CheckCircle2 } from "lucide-react";

export function BookingPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [eventType, setEventType] = useState("Wedding");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <SiteLayout>
      <section className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold font-display">Book Your <span className="gradient-text">Shoot</span></h1>
          <p className="text-slate-400 mt-2 text-sm">Lock in your dates with FrameKatha Studio</p>
        </div>

        {submitted ? (
          <div className="glass-strong rounded-3xl p-10 text-center space-y-4 animate-fade-in border border-cyan-500/30">
            <div className="size-16 mx-auto rounded-full bg-cyan-500/20 text-cyan-400 grid place-items-center">
              <CheckCircle2 className="size-10" />
            </div>
            <h2 className="text-2xl font-bold font-display">Booking Request Received!</h2>
            <p className="text-slate-300 text-sm max-w-md mx-auto">
              Thank you <span className="text-cyan-400 font-semibold">{name}</span>! Our lead photographer Paras will contact you at <span className="text-white font-semibold">{phone}</span> within 2 hours to confirm your dates.
            </p>
            <button onClick={() => setSubmitted(false)} className="btn-ghost-neon text-xs mt-4">
              Book Another Shoot
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-strong rounded-3xl p-8 space-y-5 border border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">Your Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    required
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    required
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    required
                    type="email"
                    placeholder="email@domain.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">Event Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    required
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">Event Type</label>
                <select
                  value={eventType}
                  onChange={e => setEventType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14141e] border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                >
                  <option value="Wedding">Wedding & Reception</option>
                  <option value="Pre-Wedding">Pre-Wedding Shoot</option>
                  <option value="Portrait">Portrait / Fashion</option>
                  <option value="Commercial">Commercial / Brand Shoot</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">Location / City</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    required
                    type="text"
                    placeholder="e.g. Udaipur, Mumbai, Delhi"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-neon w-full py-3.5 text-sm font-semibold">
              <Sparkles className="size-4" /> Confirm & Reserve Date
            </button>
          </form>
        )}
      </section>
    </SiteLayout>
  );
}
