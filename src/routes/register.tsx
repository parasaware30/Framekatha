import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Mail, Lock, User, AlertCircle, Check } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { useAuth } from "@/lib/auth-context";

export function RegisterPage() {
  const nav = useNavigate();
  const { registerWithEmail } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ["", "bg-red-500", "bg-yellow-500", "bg-cyan-400"];
  const strengthLabels = ["", "Weak", "Fair", "Strong"];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await registerWithEmail(email, password, name);
      nav({ to: "/dashboard" });
    } catch (err: any) {
      setError(err?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-md px-6 py-12">
        <div className="glass-strong rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="size-14 mx-auto rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 grid place-items-center mb-4 shadow-[0_0_24px_rgba(139,92,246,0.4)]">
              <User className="size-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold font-display">Create <span className="gradient-text">account</span></h1>
            <p className="text-sm text-slate-400 mt-2">Join the FrameKatha studio</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-5">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                id="register-name"
                required
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors text-white text-sm"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                id="register-email"
                required
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors text-white text-sm"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                id="register-password"
                required
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors text-white text-sm"
              />
            </div>

            {password.length > 0 && (
              <div>
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= passwordStrength ? strengthColors[passwordStrength] : "bg-white/10"}`} />
                  ))}
                </div>
                <p className="text-xs text-slate-400">Password strength: <span className="text-white">{strengthLabels[passwordStrength]}</span></p>
              </div>
            )}

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                id="register-confirm"
                required
                type="password"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={`w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border focus:outline-none transition-colors text-white text-sm ${
                  confirm && confirm === password ? "border-cyan-400" : confirm ? "border-red-500/50" : "border-white/10 focus:border-cyan-400"
                }`}
              />
              {confirm && confirm === password && (
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-cyan-400" />
              )}
            </div>

            <button
              id="register-submit"
              disabled={loading}
              className="btn-neon w-full hover:btn-neon-hover disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating…" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-slate-400">
            Already have one? <Link to="/login" className="text-cyan-400 hover:underline font-semibold">Sign in</Link>
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
