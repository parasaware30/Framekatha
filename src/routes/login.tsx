import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { useAuth } from "@/lib/auth-context";

export function LoginPage() {
  const nav = useNavigate();
  const { loginWithEmail } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await loginWithEmail(email, password);
      if (email.includes("paras") || email.includes("admin") || email === "admin@framekatha.com") {
        nav({ to: "/admin" });
      } else {
        nav({ to: "/dashboard" });
      }
    } catch (err: any) {
      setError(err?.message || "Invalid email or password. Please try again.");
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
              <Lock className="size-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold font-display">Welcome <span className="gradient-text">back</span></h1>
            <p className="text-sm text-slate-400 mt-2">Access your FrameKatha client dashboard</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-5">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                id="login-email"
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
                id="login-password"
                required
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors text-white text-sm"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="accent-purple-500"
                />
                Remember me
              </label>
              <a href="#" className="text-cyan-400 hover:underline">Forgot?</a>
            </div>
            <button
              id="login-submit"
              disabled={loading}
              className="btn-neon w-full hover:btn-neon-hover disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center text-sm text-slate-400">
            <p>New here? <Link to="/register" className="text-cyan-400 hover:underline font-semibold">Create an account</Link></p>
            <p className="mt-3 text-xs">Admin? Use your studio email to access the <span className="text-cyan-400">admin panel</span></p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
