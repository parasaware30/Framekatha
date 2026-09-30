import { useState } from "react";
import { Sparkles, Bot, X, Wand2, RefreshCw, Check, Camera, Layers, Tag, Film, Compass, Folder } from "lucide-react";
import { aiSuggestMetadata } from "@/lib/api";

interface AIMetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTitle?: string;
  initialDescription?: string;
  onApply: (metadata: {
    folderName?: string;
    title: string;
    description: string;
    category: string;
    subcategory: string;
    tags: string;
    tools: string;
    camera: string;
    lens: string;
    editingSoftware: string;
    location: string;
  }) => void;
}

export function AIMetadataModal({
  isOpen,
  onClose,
  initialTitle = "",
  initialDescription = "",
  onApply,
}: AIMetadataModalProps) {
  const [prompt, setPrompt] = useState(initialTitle || initialDescription || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!isOpen) return null;

  const quickPresets = [
    { label: "📸 Moody Monsoon Portrait", prompt: "Cinematic portrait in heavy monsoon rain with high contrast lighting and moody atmosphere" },
    { label: "🌌 Cyberpunk Neon City", prompt: "Futuristic cyberpunk night city street with neon reflections and cyan orange color grading" },
    { label: "🏛️ Heritage Temple Night", prompt: "Long exposure nocturnal architectural visual of ancient temple illuminated under starry midnight" },
    { label: "💍 Royal Palace Wedding", prompt: "Emotional candid heritage palace wedding with golden hour sunlight and traditional ceremonies" },
    { label: "🎬 Varanasi 4K Cinema Reel", prompt: "Cinematic 4K motion video reel capturing Varanasi ghats, dawn light, and authentic sound design" },
    { label: "🎨 Surreal Sci-Fi Art", prompt: "Surreal concept art exploring distant extraterrestrial planetary landscape with volumetric lighting" },
  ];

  const handleGenerate = async (customPrompt?: string) => {
    const textToUse = customPrompt || prompt || "Cinematic Visual Story";
    setLoading(true);
    try {
      const data = await aiSuggestMetadata({
        prompt: textToUse,
        title: initialTitle,
        description: initialDescription,
      });
      setResult(data);
    } catch (err) {
      console.error("AI Generation error:", err);
      alert("AI suggestion failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!result) return;
    onApply({
      folderName: result.folderName || (result.title ? `${result.title} Album` : "Creative Folder"),
      title: result.title || initialTitle || prompt,
      description: result.description || "",
      category: result.category || "Photography",
      subcategory: result.subcategory || "",
      tags: result.tags ? result.tags.join(", ") : "",
      tools: result.tools ? result.tools.join(", ") : "",
      camera: result.camera || "",
      lens: result.lens || "",
      editingSoftware: result.editingSoftware || "",
      location: result.location || "",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl glass-strong border border-cyan-500/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)] space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 grid place-items-center text-white shadow-lg">
              <Bot className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-display text-white">FrameKatha AI Creative Studio</h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 flex items-center gap-1">
                  <Sparkles className="size-2.5" /> Gemini & ChatGPT Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Type any creative idea in Hindi or English, and AI will generate title, story, tags, and camera specs.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Prompt Input Box */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Wand2 className="size-3.5 text-cyan-400" />
            Your Project Concept / Scene Description
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. 'Moody portrait of a dancer in heavy rain', 'Cyberpunk car render in neon lights', 'Udaipur palace wedding shoot'..."
              className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
          </div>
        </div>

        {/* Quick Inspiration Chips */}
        <div className="space-y-2">
          <span className="text-[11px] font-medium text-slate-400">💡 Or pick a quick 1-click inspiration:</span>
          <div className="flex flex-wrap gap-2">
            {quickPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPrompt(preset.prompt);
                  handleGenerate(preset.prompt);
                }}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 text-[11px] border border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Action Button */}
        <button
          type="button"
          onClick={() => handleGenerate()}
          disabled={loading}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-cyan-500 to-purple-600 text-white font-bold text-xs shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.7)] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <RefreshCw className="size-4 animate-spin" />
              <span>AI is crafting visual story, tags & camera gear...</span>
            </>
          ) : (
            <>
              <Sparkles className="size-4 text-amber-300" />
              <span>Generate Project Metadata with AI</span>
            </>
          )}
        </button>

        {/* AI Generated Result Preview */}
        {result && (
          <div className="space-y-4 p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-inner animate-fade-in">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Check className="size-3.5" /> Generated by AI
              </span>
              <button
                type="button"
                onClick={() => handleGenerate()}
                disabled={loading}
                className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="size-3" /> Regenerate Variation
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-between">
                <span className="text-purple-300 font-semibold flex items-center gap-1.5 text-xs">
                  <Folder className="size-3.5" /> Suggested Folder Name
                </span>
                <span className="font-bold text-white font-mono text-xs">{result.folderName || `${result.title} Album`}</span>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">Generated Title</span>
                <p className="text-sm font-bold text-white mt-0.5">{result.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">Category & Subcategory</span>
                  <p className="text-cyan-400 font-semibold mt-0.5">{result.category} → {result.subcategory || "Showcase"}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">Location</span>
                  <p className="text-slate-200 mt-0.5">{result.location || "Studio"}</p>
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">Story Narrative Description</span>
                <p className="text-slate-300 leading-relaxed mt-0.5">{result.description}</p>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">Tags</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {result.tags?.map((t: string) => (
                    <span key={t} className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-cyan-300 text-[10px]">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
                <div>
                  <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">Camera & Lens</span>
                  <p className="text-slate-300 mt-0.5">{result.camera} {result.lens ? `| ${result.lens}` : ""}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">Software & Tools</span>
                  <p className="text-slate-300 mt-0.5">{result.editingSoftware || result.tools?.join(", ")}</p>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleApply}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="size-4" />
                Apply Everything to Project Form
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
