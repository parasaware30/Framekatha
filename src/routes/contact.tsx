import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { sendMessage } from "@/lib/api";
import { Mail, Send, CheckCircle2, Instagram, Github, Linkedin, Youtube, AlertCircle } from "lucide-react";

export function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await sendMessage({ name, email, subject, message });
      setSent(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">Connect With Creator</span>
          <h1 className="text-4xl font-bold font-display mt-1">Get in <span className="gradient-text">Touch</span></h1>
          <p className="text-slate-400 mt-2 text-sm">Have a question about a portfolio project, digital art collaboration, or visual direction?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Info Card */}
          <div className="glass-strong rounded-3xl p-8 border border-white/10 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-display text-white">FrameKatha Studio</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                We are open for creative visual inquiries, editorial photo assignments, custom digital art compositions, and film color grading projects.
              </p>

              <div className="space-y-3 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-3">
                  <Mail className="size-4 text-cyan-400 shrink-0" />
                  <a href="mailto:parasaware05@gmail.com" className="hover:text-cyan-400 transition-colors">
                    parasaware05@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-3">
              <span className="text-xs font-semibold text-slate-400 block">Follow FrameKatha</span>
              <div className="flex gap-3">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-400 transition-colors">
                  <Instagram className="size-4" />
                </a>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-purple-400 transition-colors">
                  <Github className="size-4" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-400 transition-colors">
                  <Linkedin className="size-4" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-red-400 transition-colors">
                  <Youtube className="size-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="glass-strong rounded-3xl p-8 border border-white/10">
            {sent ? (
              <div className="py-12 text-center space-y-4 animate-fade-in">
                <div className="size-14 mx-auto rounded-full bg-cyan-500/20 text-cyan-400 grid place-items-center">
                  <CheckCircle2 className="size-8" />
                </div>
                <h3 className="text-xl font-bold font-display text-white">Message Sent Successfully!</h3>
                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  Thank you for reaching out. Your message has been received and saved in our studio CMS.
                </p>
                <button onClick={() => setSent(false)} className="btn-ghost-neon text-xs mt-4">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Your Name</label>
                  <input
                    required
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Email Address</label>
                  <input
                    required
                    type="email"
                    placeholder="email@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Subject</label>
                  <input
                    required
                    type="text"
                    placeholder="Project Inquiry / Feedback"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-neon w-full py-3 text-xs flex justify-center items-center gap-2 disabled:opacity-60"
                >
                  {loading ? "Sending..." : <><Send className="size-4" /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
