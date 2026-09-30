import { SiteLayout } from "@/components/SiteLayout";
import { Download, Image, Film, CheckCircle2 } from "lucide-react";

export function DashboardPage() {
  return (
    <SiteLayout>
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="glass-strong rounded-3xl p-8 mb-8 border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Client Portal</span>
            <h1 className="text-3xl font-bold font-display mt-1">Welcome to Client Portal</h1>
            <p className="text-slate-400 text-xs mt-1">Manage your event galleries, downloads, and deliverables</p>
          </div>
          <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="size-4" /> Active Booking: Confirmed
          </span>
        </div>

        {/* Deliverables Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-strong rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg font-display flex items-center gap-2">
                <Image className="size-5 text-purple-400" /> Photo Gallery (450 Photos)
              </h3>
              <span className="text-xs text-emerald-400 font-semibold">Ready</span>
            </div>
            <p className="text-xs text-slate-400">High-resolution edited photos ready for digital download and social sharing.</p>
            <div className="flex gap-2">
              <button className="btn-neon text-xs flex-1 cursor-pointer">
                <Download className="size-4" /> Download All (3.2 GB)
              </button>
            </div>
          </div>

          <div className="glass-strong rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg font-display flex items-center gap-2">
                <Film className="size-5 text-cyan-400" /> 4K Teaser & Full Film
              </h3>
              <span className="text-xs text-emerald-400 font-semibold">Ready</span>
            </div>
            <p className="text-xs text-slate-400">Cinematic 4K edit with custom music composition.</p>
            <div className="flex gap-2">
              <button className="btn-neon text-xs flex-1 cursor-pointer">
                <Download className="size-4" /> Download 4K Video
              </button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
