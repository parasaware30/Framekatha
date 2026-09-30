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

export function ShowcaseVideoSection({
  videoUrl,
  videos,
  title = "Cinematic Visual Showreel",
  subtitle = "4K 60FPS Video Production, Visual Effects & Color Grading",
  enabled = true
}: ShowcaseVideoSectionProps) {
  // Normalize video list
  const videoList: ShowcaseVideoItem[] = (videos && videos.length > 0)
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
          url: "https://assets.mixkit.co/videos/preview/mixkit-cinematic-night-aerial-of-city-streets-41865-large.mp4",
          title: "Neon City Nocturne 4K",
          subtitle: "Night aerial cinematography with anamorphic lens flares",
          tag: "Night Aerial"
        },
        {
          id: "vid-2",
          url: "https://assets.mixkit.co/videos/preview/mixkit-cinematic-view-of-mountains-and-a-valley-41584-large.mp4",
          title: "Himalayan Ridge Drone Reel",
          subtitle: "High-altitude landscape exploration & dynamic natural light",
          tag: "Drone Landscape"
        },
        {
          id: "vid-3",
          url: "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-in-neon-light-41585-large.mp4",
          title: "Cyberpunk Portrait Studio",
          subtitle: "Editorial fashion lighting with RGB color contrast",
          tag: "Editorial Fashion"
        }
      ];

  if (!enabled || videoList.length === 0) return null;

  const [activeIndex, setActiveIndex] = useState(0);
  const activeVideo = videoList[activeIndex] || videoList[0];

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isInView, setIsInView] = useState(false);

  // Safe play helper function
  const startPlaying = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay was blocked pending gesture; will play on first user scroll/touch
          setIsPlaying(false);
        });
    }
  }, []);

  // IntersectionObserver: Auto-play when scrolled into view, pause when scrolled away
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
      { threshold: 0.25 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [startPlaying, activeIndex]);

  // Fallback: On first user scroll or touch gesture, immediately trigger play if currently in view
  useEffect(() => {
    const handleFirstGesture = () => {
      if (isInView && videoRef.current && videoRef.current.paused) {
        startPlaying();
      }
    };

    window.addEventListener("scroll", handleFirstGesture, { passive: true });
    window.addEventListener("touchstart", handleFirstGesture, { passive: true });
    window.addEventListener("click", handleFirstGesture, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("click", handleFirstGesture);
    };
  }, [isInView, startPlaying]);

  // Auto-play new video when index changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isInView) {
        startPlaying();
      }
    }
  }, [activeIndex, isInView, startPlaying]);

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
