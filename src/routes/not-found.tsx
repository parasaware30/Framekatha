import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Camera, ArrowLeft } from "lucide-react";

export function NotFoundPage() {
  return (
    <SiteLayout>
      <section className="max-w-md mx-auto px-4 py-24 text-center space-y-6 animate-fade-in">
        <div className="size-20 mx-auto rounded-3xl bg-gradient-to-br from-purple-600 to-cyan-500 grid place-items-center shadow-[0_0_30px_rgba(139,92,246,0.4)]">
          <Camera className="size-10 text-white" />
        </div>

        <h1 className="text-6xl font-extrabold font-display gradient-text">404</h1>
        <h2 className="text-2xl font-bold font-display text-white">Out of Focus</h2>
        <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
          The creative story or frame you are looking for does not exist or has been moved.
        </p>

        <Link to="/" className="btn-neon text-xs px-6 py-3 inline-flex items-center gap-2">
          <ArrowLeft className="size-4" /> Return to Homepage
        </Link>
      </section>
    </SiteLayout>
  );
}
