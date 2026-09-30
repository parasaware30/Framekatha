import { useState, useRef, useEffect, useCallback } from "react";
import {
  Film,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Maximize2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Tv,
  Eye
} from "lucide-react";

export interface ShowcaseVideoItem {
  id?: string;
  url: string;
  title?: string;
  subtitle?: string;
  tag?: string;
}

interface ShowcaseVideoSectionProps {
  videoUrl?: string;
  videos?: ShowcaseVideoItem[];
  title?: string;
  subtitle?: string;
  enabled?: boolean;
}

function sanitizeVideoUrl(url?: string, index: number = 0): string {
  if (!url || url.includes("mixkit.co") || url.includes("localhost")) {
    const fallbackReels = [
      "/videos/reel-1.mp4",
      "/videos/reel-2.mp4",
      "/videos/reel-3.mp4",
      "/videos/flower.mp4"
    ];
    return fallbackReels[index % fallbackReels.length];
  }
  return url;
}

export function ShowcaseVideoSection({
  videoUrl,
  videos,
  title = "Cinematic Visual Showreel",
  subtitle = "4K 60FPS Video Production, Visual Effects & Color Grading",
  enabled = true
}: ShowcaseVideoSectionProps) {
  // Normalize video list with local high-performance video assets
  const rawList: ShowcaseVideoItem[] = (videos && videos.length > 0)
    ? videos.filter(v => v && v.url)
    : videoUrl
    ? [
        {
          id: "vid-default",
          url: videoUrl,
          title: title || "Cinematic Visual Showreel",
          subtitle: subtitle || "4K 60FPS Video Production",
          tag: "4K Showreel"
        }
      ]
    : [
        {
          id: "vid-1",
          url: "/videos/reel-1.mp4",
          title: "Neon City Nocturne 4K",
          subtitle: "Night aerial cinematography with natural depth of field",
          tag: "Night Aerial"
        },
        {
          id: "vid-2",
          url: "/videos/reel-2.mp4",
          title: "Himalayan Ridge Drone Reel",
          subtitle: "High-altitude landscape exploration & dynamic natural light",
          tag: "Drone Landscape"
        },
        {
          id: "vid-3",
          url: "/videos/reel-3.mp4",
          title: "Cyberpunk Portrait Studio",
          subtitle: "Editorial fashion lighting with RGB color contrast",
          tag: "Editorial Fashion"
        },
        {
          id: "vid-4",
          url: "/videos/flower.mp4",
          title: "Macro Color & Nature Motion",
          subtitle: "Ultra-vibrant saturation profile with high framerate slow motion",
          tag: "Macro Nature"
        }
      ];

  const videoList: ShowcaseVideoItem[] = rawList.map((v, idx) => ({
    ...v,
    url: sanitizeVideoUrl(v.url, idx)
  }));

  if (!enabled || videoList.length === 0) return null;

  const [activeIndex, setActiveIndex] = useState(0);
  const activeVideo = videoList[activeIndex] || videoList[0];

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isInView, setIsInView] = useState(false);

  // Safe auto-play function supporting iOS Safari & Chrome autoplay policies
  const startPlaying = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "true");
    
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay deferred until user interacts with viewport
          setIsPlaying(false);
        });
    }
  }, []);

  // IntersectionObserver: Auto-play immediately when scrolled into view
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            startPlaying();
          } else {
            setIsInView(false);
            if (videoRef.current) {
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }
        });
      },
      { threshold: [0, 0.1, 0.25, 0.5], rootMargin: "100px 0px" }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [startPlaying, activeIndex]);

  // Window scroll & touch listener for instantaneous autoplay on all phones / browsers
  useEffect(() => {
    const handleScrollCheck = () => {
      const container = containerRef.current;
      const video = videoRef.current;
      if (!container || !video) return;
      const rect = container.getBoundingClientRect();
      const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (inViewport) {
        setIsInView(true);
        if (video.paused) {
          startPlaying();
        }
      } else {
        setIsInView(false);
        if (!video.paused) {
          video.pause();
          setIsPlaying(false);
        }
      }
    };

    window.addEventListener("scroll", handleScrollCheck, { passive: true });
    window.addEventListener("touchmove", handleScrollCheck, { passive: true });
    window.addEventListener("pointerdown", handleScrollCheck, { passive: true });
    window.addEventListener("click", handleScrollCheck, { passive: true });

    // Initial check on mount
    handleScrollCheck();

    return () => {
      window.removeEventListener("scroll", handleScrollCheck);
      window.removeEventListener("touchmove", handleScrollCheck);
      window.removeEventListener("pointerdown", handleScrollCheck);
      window.removeEventListener("click", handleScrollCheck);
    };
  }, [startPlaying]);

  // Auto-play new video when index changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      startPlaying();
    }
  }, [activeIndex, startPlaying]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      startPlaying();
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      video.requestFullscreen().catch(() => {});
    }
  };

  const handlePrevVideo = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : videoList.length - 1));
  };

  const handleNextVideo = () => {
    setActiveIndex((prev) => (prev < videoList.length - 1 ? prev + 1 : 0));
  };

  return (
    <section ref={containerRef} className="py-14 max-w-4xl mx-auto px-4 border-t border-white/10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2.5">
          <Film className="size-3.5" />
          <span>Cinematic Multi-Reel Showcase</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
          {title || "Cinematic Visual Showreel"}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mt-1.5">
          {subtitle || "4K 60FPS Video Production, Visual Effects & Color Grading"}
        </p>
      </div>

      {/* Video Reel Chips (If multiple videos) */}
      {videoList.length > 1 && (
        <div className="flex items-center justify-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
          {videoList.map((v, idx) => (
            <button
              key={v.id || idx}
              onClick={() => setActiveIndex(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer border ${
                activeIndex === idx
                  ? "bg-gradient-to-r from-purple-600/40 to-cyan-500/40 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-102"
                  : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              <Tv className="size-3 text-cyan-400" />
              <span>
                {idx + 1}. {v.tag || v.title || `Reel ${idx + 1}`}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Main Video Stage (Compact Size) */}
      <div className="glass-strong rounded-3xl p-3 sm:p-4 border border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.15)] relative overflow-hidden group">
        <div className="relative aspect-video max-h-[380px] sm:max-h-[440px] rounded-2xl overflow-hidden bg-black shadow-2xl mx-auto">
          <video
            ref={videoRef}
            src={activeVideo.url}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            onEnded={() => {
              const v = videoRef.current;
              if (v) {
                v.currentTime = 0;
                v.play().catch(() => {});
              }
            }}
            className="w-full h-full object-cover"
          />

          {/* Floating Live Badge */}
          <div className="absolute top-3 left-3 z-20 pointer-events-none flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 shadow-lg">
              <span className="size-1.5 rounded-full bg-red-500 animate-pulse" />
              <span>4K REEL • {activeIndex + 1}/{videoList.length}</span>
            </span>
          </div>

          {/* Top Right Controls */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-black/70 hover:bg-black/90 text-white text-xs font-bold backdrop-blur-md border border-white/15 transition-all cursor-pointer shadow-lg"
              title={isMuted ? "Unmute Audio" : "Mute Audio"}
            >
              {isMuted ? <VolumeX className="size-3.5 text-rose-400" /> : <Volume2 className="size-3.5 text-emerald-400 animate-pulse" />}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-black/70 hover:bg-black/90 text-white backdrop-blur-md transition-all cursor-pointer border border-white/15 shadow-lg"
              title="Fullscreen"
            >
              <Maximize2 className="size-3.5" />
            </button>
          </div>

          {/* Next / Prev Floating Arrow Controls (For Multi-videos) */}
          {videoList.length > 1 && (
            <>
              <button
                onClick={handlePrevVideo}
                className="absolute left-2 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/60 hover:bg-black/90 text-white grid place-items-center backdrop-blur-md border border-white/15 opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-20 shadow-xl"
                title="Previous Reel"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                onClick={handleNextVideo}
                className="absolute right-2 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/60 hover:bg-black/90 text-white grid place-items-center backdrop-blur-md border border-white/15 opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-20 shadow-xl"
                title="Next Reel"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}

          {/* Center Big Play Button (shows on hover or when paused) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <button
              onClick={togglePlay}
              className={`size-14 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 hover:scale-110 active:scale-95 text-white flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all cursor-pointer pointer-events-auto ${
                isPlaying ? "opacity-0 group-hover:opacity-80" : "opacity-100"
              }`}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="size-6" /> : <Play className="size-6 translate-x-0.5" />}
            </button>
          </div>

          {/* Bottom Title & Status Overlay */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2 pointer-events-none">
            <div>
              <h3 className="text-sm font-bold text-white drop-shadow-md">
                {activeVideo.title || "Cinematic Shot"}
              </h3>
              {activeVideo.subtitle && (
                <p className="text-[11px] text-slate-300 drop-shadow-sm line-clamp-1">
                  {activeVideo.subtitle}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-cyan-300 font-semibold shrink-0">
              <Sparkles className="size-3.5 text-cyan-400 animate-pulse" />
              <span>Auto-plays on scroll</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
