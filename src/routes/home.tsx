import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { ThreeCanvas } from "@/components/ThreeCanvas";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { ShowcaseVideoSection } from "@/components/ShowcaseVideoSection";
import { fetchProjects, fetchTestimonials, fetchSiteSettings } from "@/lib/api";
import {
  Camera,
  Film,
  Sparkles,
  ArrowRight,
  Eye,
  SlidersHorizontal,
  Palette,
  Image as ImageIcon,
  Tv,
  FlaskConical,
  Star,
  Quote,
  Folder,
  Wand2,
  Calendar,
  Layers
} from "lucide-react";

export function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [projData, testData, settData] = await Promise.all([
          fetchProjects({ featured: true }),
          fetchTestimonials(),
          fetchSiteSettings()
        ]);
        const publicFeatured = Array.isArray(projData) ? projData.filter((p: any) => p.published !== false) : [];
        setFeaturedProjects(publicFeatured);
        setTestimonials(testData);
        setSiteSettings(settData);
      } catch (e) {
        console.error("Failed to load homepage data:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categoriesList = [
    { name: "Photography", icon: Camera, desc: "Portraits, landscapes, architecture, and street photography.", color: "text-purple-400" },
    { name: "Digital Art", icon: Palette, desc: "Digital illustrations, concept compositions and creative artwork.", color: "text-cyan-400" },
    { name: "Photo Editing", icon: SlidersHorizontal, desc: "Before/after editing, color grading, and portrait retouching.", color: "text-pink-400" },
    { name: "Poster Design", icon: ImageIcon, desc: "Minimalist poster, movie concepts, and graphic design work.", color: "text-yellow-400" },
    { name: "Thumbnail Design", icon: Tv, desc: "High-CTR YouTube and social media thumbnail compositions.", color: "text-emerald-400" },
    { name: "Video Editing", icon: Film, desc: "Cinematic 4K edits, reels, teasers, and short-form videos.", color: "text-blue-400" },
    { name: "Experiments", icon: FlaskConical, desc: "Experimental creative tech, WebGL, shaders, and AI projects.", color: "text-indigo-400" },
  ];

  const marqueeItems = [
    { text: "CINEMATIC PHOTOGRAPHY", icon: "📸", category: "Photography" },
    { text: "DIGITAL ART & CONCEPTS", icon: "🎨", category: "Digital Art" },
    { text: "4K VIDEO EDITING", icon: "🎬", category: "Video Editing" },
    { text: "DAVINCI COLOR GRADING", icon: "🪄", category: "Photo Editing" },
    { text: "EXPERIMENTS & WEBGL", icon: "✨", category: "Experiments" },
    { text: "BEFORE & AFTER RETOUCHING", icon: "🔮", category: "Photo Editing" },
    { text: "POSTER DESIGN", icon: "🖼️", category: "Poster Design" },
    { text: "HIGH-CTR THUMBNAILS", icon: "⚡", category: "Thumbnail Design" },
  ];

  return (
    <SiteLayout>
      {/* Hero Section with Interactive Particles & Interactive Floating Category Badges */}
      <section className="relative min-h-[85vh] sm:min-h-[88vh] flex items-center justify-center px-4 py-12 sm:py-0 overflow-hidden">
        <ThreeCanvas />

        {/* Interactive Floating Category Badges (Clicking opens filtered portfolio!) */}
        <Link
          to="/portfolio?category=Photography"
          className="hidden md:flex absolute top-16 left-6 sm:left-12 items-center gap-2 px-4 py-2 rounded-2xl glass-strong border border-purple-500/40 text-xs font-semibold text-purple-300 animate-float shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-110 hover:border-purple-400 hover:text-white hover:bg-purple-600/20 transition-all cursor-pointer z-20 group"
          title="Click to view Photography projects"
        >
          <Camera className="size-3.5 text-purple-400 group-hover:animate-bounce" />
          <span>Raw 4K Visuals</span>
          <span className="text-[10px] text-purple-400 group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>

        <Link
          to="/portfolio?category=Photo%20Editing"
          className="hidden md:flex absolute top-20 right-6 sm:right-12 items-center gap-2 px-4 py-2 rounded-2xl glass-strong border border-cyan-500/40 text-xs font-semibold text-cyan-300 animate-float-reverse shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-110 hover:border-cyan-400 hover:text-white hover:bg-cyan-600/20 transition-all cursor-pointer z-20 group"
          title="Click to view Photo Editing & Color Grading"
        >
          <SlidersHorizontal className="size-3.5 text-cyan-400 group-hover:animate-bounce" />
          <span>Color Grading &amp; LUTs</span>
          <span className="text-[10px] text-cyan-400 group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>

        <Link
          to="/portfolio?category=Video%20Editing"
          className="hidden md:flex absolute bottom-16 left-8 sm:left-16 items-center gap-2 px-4 py-2 rounded-2xl glass-strong border border-pink-500/40 text-xs font-semibold text-pink-300 animate-float-reverse shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:scale-110 hover:border-pink-400 hover:text-white hover:bg-pink-600/20 transition-all cursor-pointer z-20 group"
          title="Click to view Video Editing projects"
        >
          <Film className="size-3.5 text-pink-400 group-hover:animate-bounce" />
          <span>60 FPS Cinematic Cuts</span>
          <span className="text-[10px] text-pink-400 group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>

        <Link
          to="/portfolio?category=Experiments"
          className="hidden md:flex absolute bottom-20 right-8 sm:right-16 items-center gap-2 px-4 py-2 rounded-2xl glass-strong border border-emerald-500/40 text-xs font-semibold text-emerald-300 animate-float shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-110 hover:border-emerald-400 hover:text-white hover:bg-emerald-600/20 transition-all cursor-pointer z-20 group"
          title="Click to view Experiments & Tech"
        >
          <Sparkles className="size-3.5 text-emerald-400 group-hover:animate-spin" />
          <span>AI Assisted Creativity</span>
          <span className="text-[10px] text-emerald-400 group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>

        {/* Main Hero Content */}
        <div className="max-w-5xl mx-auto text-center space-y-6 sm:space-y-8 animate-fade-in relative z-10 w-full">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full glass-strong border border-purple-500/30 text-[11px] sm:text-xs font-semibold text-purple-300 shadow-[0_0_20px_rgba(139,92,246,0.25)] max-w-full animate-pulse-glow">
            <Sparkles className="size-3.5 sm:size-4 text-cyan-400 animate-pulse shrink-0" />
            <span className="truncate">AI-Powered Creative Portfolio &amp; Media Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-display tracking-tight leading-[1.15] sm:leading-[1.1] px-1">
            FRAMEKATHA <br />
            <span className="gradient-text text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-normal block mt-2">Every Frame Tells a Story.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed px-2">
            A visual collection of photography, digital art, photo editing, poster design, and cinematic video editing powered by real database analytics and natural language AI search.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 pt-2 sm:pt-4 w-full max-w-xs sm:max-w-none mx-auto">
            <Link to="/portfolio" className="btn-neon text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5 w-full sm:w-auto shadow-lg">
              Explore Portfolio <ArrowRight className="size-4 sm:size-5" />
            </Link>
            <Link to="/contact" className="btn-ghost-neon text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5 w-full sm:w-auto">
              Contact Creator
            </Link>
          </div>

          {/* Quick Clickable Category Tags for Mobile & Tablet */}
          <div className="flex md:hidden flex-wrap items-center justify-center gap-2 pt-4 px-2">
            <Link to="/portfolio?category=Photography" className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[11px] font-semibold">
              📸 Photography
            </Link>
            <Link to="/portfolio?category=Photo%20Editing" className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold">
              🪄 Color Grading
            </Link>
            <Link to="/portfolio?category=Video%20Editing" className="px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-[11px] font-semibold">
              🎬 4K Edits
            </Link>
            <Link to="/portfolio?category=Digital%20Art" className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold">
              🎨 Digital Art
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Infinite Moving Marquee Ticker Ribbon */}
      <section className="relative py-4 sm:py-6 overflow-hidden border-y border-white/10 bg-black/40 backdrop-blur-md">
        <div className="animate-marquee flex items-center gap-6 select-none whitespace-nowrap">
          {/* Double map for continuous seamless infinite loop */}
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
            <Link
              key={idx}
              to={`/portfolio?category=${encodeURIComponent(item.category)}`}
              className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wider text-slate-300 hover:text-white hover:border-cyan-400 hover:bg-cyan-500/15 transition-all cursor-pointer hover:scale-105 shadow-sm group"
              title={`Click to filter portfolio by ${item.category}`}
            >
              <span className="group-hover:scale-125 transition-transform">{item.icon}</span>
              <span className="bg-gradient-to-r from-slate-200 via-white to-slate-400 bg-clip-text text-transparent group-hover:text-cyan-300">
                {item.text}
              </span>
              <span className="text-purple-500/60 font-bold ml-1">•</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Work Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">Handpicked Showcase</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display mt-1">Featured <span className="gradient-text">Work</span></h2>
          </div>
          <Link to="/portfolio" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group">
            <span>View All Projects</span>
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-strong rounded-3xl h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((p) => (
              <Link
                key={p.id}
                to={`/portfolio/${p.slug}`}
                className="group glass-strong card-hover-effect rounded-3xl overflow-hidden border border-white/10 flex flex-col"
              >
                <div className="aspect-4/3 overflow-hidden bg-slate-900 relative">
                  <img
                    src={p.thumbnail || "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800"}
                    alt={p.title}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800";
                    }}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-center gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-bold text-cyan-400 border border-cyan-500/30">
                        {p.category}
                      </span>
                      {p.folderName && (
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-950/85 backdrop-blur-md text-[10px] font-semibold text-purple-200 border border-purple-500/40 flex items-center gap-1">
                          <Folder className="size-2.5 text-purple-400" />
                          <span className="truncate max-w-[120px]">{p.folderName}</span>
                        </span>
                      )}
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-cyan-500/30 shrink-0">
                      📁 {p.images?.length || 1}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end">
                    <span className="text-xs text-slate-300 font-semibold">{p.year} • {p.location || 'Studio'}</span>
                    <h3 className="text-lg font-bold text-white mt-1">{p.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-cyan-400 mt-2">
                      <Eye className="size-4" /> <span>{p.views} Views</span>
                    </div>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <h3 className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors">{p.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-white/5">
                    {p.tags.slice(0, 3).map((t: string) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Interactive Before & After Color Grading Showcase (Compact Size) */}
      <section className="py-12 max-w-4xl mx-auto px-4 border-t border-white/10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold mb-2.5">
            <Wand2 className="size-3.5" />
            <span>Interactive Color Grading Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display">
            RAW vs <span className="gradient-text">Graded Master</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-1.5">
            Drag the interactive slider below to see how FrameKatha transforms flat RAW camera footage into high-contrast cinematic art.
          </p>
        </div>

        <div className="glass-strong rounded-3xl p-3 sm:p-6 border border-white/10 shadow-2xl">
          <BeforeAfterSlider
            beforeImage="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&auto=format&fit=crop&q=80&sat=-100"
            afterImage="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&auto=format&fit=crop&q=80"
            beforeLabel="Flat RAW Profile"
            afterLabel="Cinematic Teal & Orange Grade"
          />
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2.5 text-slate-300 text-[11px]">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Color graded using DaVinci Resolve & custom 3D LUTs</span>
            </div>
            <Link
              to="/portfolio?category=Photo%20Editing"
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-white/15 text-xs"
            >
              <span>View Color Grading Works</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Creative Disciplines */}
      <section className="py-14 max-w-7xl mx-auto px-4 border-t border-white/10">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">Explore Disciplines</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display mt-1">Creative <span className="gradient-text">Categories</span></h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoriesList.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/portfolio?category=${cat.name}`}
                className="glass-strong card-hover-effect rounded-3xl p-6 border border-white/10 group"
              >
                <div className={`size-12 rounded-2xl bg-white/5 grid place-items-center mb-4 group-hover:scale-115 transition-transform duration-300 ${cat.color} shadow-inner`}>
                  <Icon className="size-6" />
                </div>
                <h3 className="text-lg font-bold font-display mb-2 text-white group-hover:text-cyan-400 transition-colors">{cat.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{cat.desc}</p>
                <span className="text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 flex items-center gap-1 group-hover:translate-x-1 transition-all">
                  View Works <ArrowRight className="size-3.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Cinematic Showcase Multi-Reel / Sample Video (Auto-plays on scroll) */}
      <ShowcaseVideoSection
        videos={siteSettings?.showcaseVideos}
        videoUrl={siteSettings?.showcaseVideo}
        title={siteSettings?.showcaseVideoTitle}
        subtitle={siteSettings?.showcaseVideoSubtitle}
        enabled={siteSettings?.showcaseVideoEnabled !== false}
      />

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-20 max-w-5xl mx-auto px-4 border-t border-white/10">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">Client Feedback</span>
            <h2 className="text-3xl font-bold font-display mt-1">What Creators <span className="gradient-text">Say</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t) => (
              <div key={t.id} className="glass-strong card-hover-effect rounded-3xl p-8 border border-white/10 relative">
                <Quote className="size-8 text-purple-500/20 absolute top-6 right-6" />
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed italic mb-6">"{t.message}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} alt={t.name} className="size-10 rounded-full object-cover border border-white/20" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.name}</h4>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
