import { useState, useRef, useCallback, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Original RAW Capture",
  afterLabel = "FrameKatha Color Edit",
  className = ""
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect and update aspect ratio dynamically whenever afterImage or beforeImage changes
  useEffect(() => {
    if (!afterImage && !beforeImage) return;
    const img = new Image();
    img.src = afterImage || beforeImage;
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setAspectRatio(img.naturalWidth / img.naturalHeight);
      }
    };
  }, [afterImage, beforeImage]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth && naturalHeight) {
      setAspectRatio(naturalWidth / naturalHeight);
    }
  };

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div className={`space-y-3 w-full max-w-4xl mx-auto ${className}`}>
      {/* Top bar: label + percentage */}
      <div className="flex justify-between items-center text-xs font-semibold text-slate-300 px-1">
        <span className="flex items-center gap-1.5 text-cyan-400">
          <SlidersHorizontal className="size-3.5" /> Drag to Compare Before & After
        </span>
        <span className="text-slate-400 text-[11px] font-mono bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
          {Math.round(sliderPosition)}% Edited
        </span>
      </div>

      {/* ── Auto-Sizing Slider Container (Adapts perfectly to any Image Dimensions) ── */}
      <div className="flex justify-center w-full">
        <div
          ref={containerRef}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden select-none border border-white/15 shadow-[0_0_50px_rgba(0,0,0,0.8)] cursor-ew-resize bg-black transition-[width,aspect-ratio] duration-300"
          style={{
            aspectRatio: aspectRatio ? `${aspectRatio}` : "16/9",
            maxHeight: "min(520px, 75vh)",
            width: aspectRatio
              ? `min(100%, calc(min(520px, 75vh) * ${aspectRatio}))`
              : "100%"
          }}
          onMouseDown={(e) => {
            setIsDragging(true);
            handleMove(e.clientX);
          }}
          onTouchStart={(e) => {
            setIsDragging(true);
            handleMove(e.touches[0].clientX);
          }}
        >
          {/*
           * AFTER image — base layer, matches exact container aspect ratio.
           */}
          <img
            src={afterImage}
            alt={afterLabel}
            onLoad={handleImageLoad}
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/*
           * BEFORE image — clip-path polygon masks everything to the RIGHT of sliderPosition.
           */}
          <img
            src={beforeImage}
            alt={beforeLabel}
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{
              clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
            }}
          />

          {/* ── Corner Labels ── */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[9px] sm:text-[10px] font-bold text-slate-200 uppercase tracking-wider border border-white/10 pointer-events-none shadow-lg z-10">
            {beforeLabel}
          </div>
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[9px] sm:text-[10px] font-bold text-cyan-300 uppercase tracking-wider border border-cyan-500/30 pointer-events-none shadow-lg z-10">
            {afterLabel}
          </div>

          {/* ── Vertical divider line ── */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-cyan-400 to-purple-500 shadow-[0_0_12px_#06b6d4] pointer-events-none z-20"
            style={{ left: `${sliderPosition}%` }}
          />

          {/* ── Drag handle knob ── */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-9 sm:size-10 rounded-full bg-[#0a0a0e] border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.8)] grid place-items-center text-cyan-400 text-xs sm:text-sm font-bold z-30 pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            ⇄
          </div>
        </div>
      </div>
    </div>
  );
}
