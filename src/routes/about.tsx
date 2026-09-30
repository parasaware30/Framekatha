import { SiteLayout } from "@/components/SiteLayout";
import { Camera, Film, Palette, Code, Award, Sparkles, Github, Linkedin, Instagram, Youtube, Mail } from "lucide-react";

export function AboutPage() {
  const tools = [
    { name: "Adobe Photoshop", category: "Retouching & Compositing", icon: "🎨" },
    { name: "Adobe Lightroom", category: "Color Grading & RAW Processing", icon: "📷" },
    { name: "Premiere Pro", category: "Cinematic 4K Editing", icon: "🎬" },
    { name: "After Effects", category: "Motion Graphics & VFX", icon: "✨" },
    { name: "Figma", category: "UI/UX & Poster Design", icon: "📐" },
    { name: "Three.js & WebGL", category: "Creative Coding & 3D", icon: "🌐" },
    { name: "React.js & Vite", category: "Frontend Web Platform", icon: "⚛️" },
    { name: "FastAPI & Python", category: "REST API & AI Backend", icon: "⚡" },
    { name: "MongoDB Atlas", category: "Database & Cloud Storage", icon: "🍃" },
    { name: "GSAP", category: "Interactive Motion Animations", icon: "🚀" },
  ];

  return (
    <SiteLayout>
      <section className="max-w-5xl mx-auto px-4 py-8 space-y-16">
        {/* Header Hero */}
        <div className="text-center space-y-4">
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">Creator & Visual Director</span>
          <h1 className="text-4xl sm:text-6xl font-extrabold font-display">About <span className="gradient-text">FrameKatha</span></h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Where visual art meets full-stack software development and artificial intelligence.
          </p>
        </div>

        {/* Creator Profile Section */}
        <div className="glass-strong rounded-3xl p-8 border border-white/10 flex flex-col md:flex-row gap-8 items-center">
          <img
            src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=600"
            alt="Creator"
            className="w-full md:w-1/2 h-80 object-cover rounded-2xl border border-white/10 shadow-2xl"
          />
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display text-white">Every Frame Tells a Story</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              FrameKatha was created to bridge the gap between high-end visual storytelling and modern web technology. From shooting architectural temples under starlight to color grading 4K cinematic reels and crafting generative light fields with WebGL, every project in this portfolio reflects artistic dedication and technical precision.
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              This platform uses FastAPI and MongoDB Atlas to dynamically deliver media, track real view analytics, and offer a natural language AI assistant for searching portfolio works.
            </p>

            <div className="flex gap-4 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-400 transition-colors">
                <Instagram className="size-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-purple-400 transition-colors">
                <Github className="size-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-400 transition-colors">
                <Linkedin className="size-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-red-400 transition-colors">
                <Youtube className="size-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Tools & Technology Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold font-display">Tools & <span className="gradient-text">Technologies</span></h2>
            <p className="text-slate-400 text-xs mt-1">Software and creative tools powering FrameKatha</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {tools.map((t) => (
              <div key={t.name} className="glass-strong rounded-2xl p-4 border border-white/10 hover:border-cyan-500/40 transition-all text-center space-y-2 group">
                <div className="text-2xl group-hover:scale-125 transition-transform">{t.icon}</div>
                <h4 className="text-xs font-bold text-white font-display">{t.name}</h4>
                <p className="text-[10px] text-slate-400 leading-tight">{t.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
