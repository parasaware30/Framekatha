import { SiteLayout } from "@/components/SiteLayout";
import { Camera, Film, Sparkles, Heart, Video, Image, CheckCircle2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function ServicesPage() {
  return (
    <SiteLayout>
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold font-display">Our Premium <span className="gradient-text">Services</span></h1>
          <p className="text-slate-400 mt-2 text-sm max-w-xl mx-auto">Comprehensive photography and film packages designed to capture every detail of your special occasions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-strong rounded-3xl p-8 border border-white/10 hover:border-purple-500/40 transition-all">
            <div className="size-12 rounded-xl bg-purple-500/10 border border-purple-500/30 grid place-items-center mb-6">
              <Camera className="size-6 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold font-display mb-3">Wedding Photography</h2>
            <p className="text-slate-400 text-sm mb-6">Full coverage from Haldi, Mehendi, Sangeet to main Pheras and Reception with dual senior photographers.</p>
            <ul className="space-y-3 text-xs text-slate-300 mb-8">
              <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-cyan-400" /> Unlimited High-Res Edited Photos</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-cyan-400" /> Premium Hardcover Coffee Table Album</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-cyan-400" /> Online Client Cloud Gallery with passcode</li>
            </ul>
            <Link to="/booking" className="btn-neon w-full text-xs">Book Wedding Package</Link>
          </div>

          <div className="glass-strong rounded-3xl p-8 border border-white/10 hover:border-cyan-500/40 transition-all">
            <div className="size-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 grid place-items-center mb-6">
              <Film className="size-6 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold font-display mb-3">4K Cinematic Wedding Films</h2>
            <p className="text-slate-400 text-sm mb-6">Story-driven cinema edit with professional color grading, licensed soundtrack, and drone aerial coverage.</p>
            <ul className="space-y-3 text-xs text-slate-300 mb-8">
              <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-cyan-400" /> 3-5 Min Instagram Teaser Trailer</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-cyan-400" /> 15-20 Min Full Feature Cinematic Film</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-cyan-400" /> 4K Drone Aerial Footage included</li>
            </ul>
            <Link to="/booking" className="btn-neon w-full text-xs">Book Film Package</Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
