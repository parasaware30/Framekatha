import { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  ArrowRight,
  RefreshCw,
  Camera,
  Image as ImageIcon,
  Download,
  SlidersHorizontal,
  ExternalLink,
  Upload,
  Check,
  Zap,
  Wand2
} from 'lucide-react';
import { aiChat, uploadFile } from '@/lib/api';
import { Link } from 'react-router-dom';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'gemini';
  text: string;
  matchedProjects?: any[];
  suggestions?: string[];
  originalImage?: string;
  editedImage?: string;
  appliedStyle?: string;
  adjustments?: Record<string, any>;
  timestamp: string;
}

const quickPhotoStyles = [
  { label: "⚡ Cyberpunk Neon", prompt: "Make this cyberpunk with vibrant neon magenta and electric cyan split tones" },
  { label: "🎬 Teal & Orange Film", prompt: "Apply Hollywood teal and orange cinematic film grade with rich contrast" },
  { label: "🖤 Dramatic B&W Noir", prompt: "Transform into high-contrast dramatic black and white silver gelatin portrait" },
  { label: "🌅 Golden Hour Glow", prompt: "Infuse warm golden hour sunset glow with rich amber highlights" },
  { label: "🎞️ 35mm Vintage Film", prompt: "Convert to vintage 35mm analog film with lifted matte blacks and nostalgic tone" },
  { label: "✨ Vivid HDR Enhance", prompt: "Enhance HDR clarity, dynamic range, micro-contrast, and vibrant colors" },
  { label: "🌧️ Moody Dark Cinema", prompt: "Grade with dark atmospheric moody lighting and textured shadows" }
];

const initialPrompts = [
  "✦ Upload a photo and say 'Make it cyberpunk'",
  "✦ Show me night & temple photography",
  "✦ What camera gear and lenses are used?",
  "✦ Show me dramatic monsoon portraits",
  "✦ Show 4K cinematic video reels"
];

/** Google Gemini Sparkle Star Icon */
function GeminiSparkleIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="geminiStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4E82EE" />
          <stop offset="35%" stopColor="#9B72CB" />
          <stop offset="70%" stopColor="#D96570" />
          <stop offset="100%" stopColor="#F4B400" />
        </linearGradient>
      </defs>
      <path
        d="M12 1C12 7.07513 7.07513 12 1 12C7.07513 12 12 16.9249 12 23C12 16.9249 16.9249 12 23 12C16.9249 12 12 7.07513 12 1Z"
        fill="url(#geminiStarGrad)"
      />
    </svg>
  );
}

/** Mini Before / After Interactive Slider inside Chat Message */
function MiniBeforeAfterViewer({ beforeUrl, afterUrl, title }: { beforeUrl: string; afterUrl: string; title?: string }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos(Math.round((x / rect.width) * 100));
  };

  return (
    <div className="space-y-2 mt-3">
      {title && (
        <div className="flex items-center justify-between text-[11px] font-semibold text-purple-300">
          <span className="flex items-center gap-1.5 font-mono uppercase">
            <Wand2 className="size-3.5 text-cyan-400" /> {title}
          </span>
          <span className="text-[10px] text-slate-400">Drag center handle to compare</span>
        </div>
      )}

      <div
        ref={containerRef}
        onMouseMove={(e) => { if (isDragging || e.buttons === 1) handleMove(e.clientX); }}
        onTouchMove={(e) => { if (e.touches.length > 0) handleMove(e.touches[0].clientX); }}
        onMouseDown={(e) => { setIsDragging(true); handleMove(e.clientX); }}
        onMouseUp={() => setIsDragging(false)}
        className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden select-none cursor-ew-resize border border-white/15 bg-black/60 shadow-lg"
      >
        {/* AFTER Image (Full base layer) */}
        <img
          src={afterUrl}
          alt="Gemini AI Edited"
          className="absolute inset-0 size-full object-contain pointer-events-none"
        />

        {/* BEFORE Image (Clipped overlay) */}
        <img
          src={beforeUrl}
          alt="Original Image"
          style={{
            clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`
          }}
          className="absolute inset-0 size-full object-contain pointer-events-none transition-none"
        />

        {/* Divider Line */}
        <div
          style={{ left: `${sliderPos}%` }}
          className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none"
        />

        {/* Center Handle Button */}
        <div
          style={{ left: `${sliderPos}%` }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-7 rounded-full bg-gradient-to-r from-blue-600 to-pink-500 text-white grid place-items-center shadow-md pointer-events-none"
        >
          <SlidersHorizontal className="size-3.5" />
        </div>

        {/* Badges */}
        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[9px] font-bold text-slate-300 pointer-events-none border border-white/10">
          ORIGINAL
        </span>
        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-purple-600/80 backdrop-blur-md text-[9px] font-bold text-white pointer-events-none border border-white/10 flex items-center gap-1">
          <Sparkles className="size-2.5" /> GEMINI AI GRADE
        </span>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[10px] text-slate-500">Gemini Neural Image Engine</span>
        <a
          href={afterUrl}
          download="gemini_edited_photo.jpg"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Download className="size-3.5" /> Download Edited Photo
        </a>
      </div>
    </div>
  );
}

export function AIModal({ isOpen, onClose }: AIModalProps) {
  const [input, setInput] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'gemini',
      text: "✨ **Hello! I am Google Gemini**, your creative assistant for **FrameKatha Studio**.\n\n📷 **Multimodal Image Editing is LIVE:** Attach any photo below and tell me how you want it edited (e.g., *'Make this cyberpunk'*, *'Apply vintage 35mm film grade'*, *'Enhance HDR lighting'*), and I will transform it in real time!\n\nYou can also ask me anything about camera gears, lenses, Lightroom secrets, or discover projects.",
      suggestions: [
        "What camera gear is used?",
        "Show me dramatic monsoon portraits",
        "Explain color grading in Photoshop",
        "Show 4K cinematic video reels"
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  // Handle Local File Upload for Gemini
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      // First create local preview for instant responsiveness
      const reader = new FileReader();
      reader.onload = async () => {
        const localDataUrl = reader.result as string;
        setAttachedImage(localDataUrl);

        // Upload to server
        try {
          const uploadedUrl = await uploadFile(file);
          if (uploadedUrl) {
            setAttachedImage(uploadedUrl);
          }
        } catch {
          // If upload fails, localDataUrl will still work with AI editor!
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Failed to load file:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSend = async (userText?: string, explicitImage?: string | null) => {
    const textToSend = userText !== undefined ? userText : input;
    const imageToSend = explicitImage !== undefined ? explicitImage : attachedImage;

    if (!textToSend.trim() && !imageToSend) return;
    if (loading) return;

    const userMsgText = textToSend.trim() || (imageToSend ? "Please transform and color grade this photo with cinematic AI." : "");

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: userMsgText,
      originalImage: imageToSend || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setAttachedImage(null);
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          content: m.text
        }));

      const res = await aiChat(userMsgText, history, imageToSend || undefined);

      const geminiMsg: ChatMessage = {
        id: `gemini-${Date.now()}`,
        role: 'gemini',
        text: res.reply || "Here is the result from Gemini AI:",
        matchedProjects: res.matchedProjects || [],
        suggestions: res.suggestions || [],
        originalImage: res.originalImage || imageToSend || undefined,
        editedImage: res.editedImage || undefined,
        appliedStyle: res.appliedStyle || undefined,
        adjustments: res.adjustments || undefined,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, geminiMsg]);
    } catch (err) {
      console.error("Gemini chat error:", err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'gemini',
        text: "I encountered a connection glitch while processing. Please try again with another prompt or photo!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'gemini',
        text: "✨ **New Conversation Started!**\n\nUpload any photo to edit it with AI or ask about camera gears, color grading, and creative projects.",
        suggestions: [
          "Show me night photography",
          "What cameras are used?",
          "Show video reels",
          "Explain color grading"
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setInput('');
    setAttachedImage(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      {/* Hidden file input for photo upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-1/3 w-[350px] h-[350px] bg-pink-500/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-3xl glass-strong rounded-3xl border border-white/10 shadow-[0_0_60px_rgba(78,130,238,0.2)] overflow-hidden flex flex-col h-[92vh] max-h-[800px]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-500/20 border border-white/10 grid place-items-center shadow-[0_0_20px_rgba(155,114,203,0.3)]">
              <GeminiSparkleIcon className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-display text-white flex items-center gap-1.5">
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Google Gemini
                  </span>
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500/15 via-purple-500/15 to-pink-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-bold flex items-center gap-1">
                  <Zap className="size-2.5 text-cyan-400" /> Multimodal Image Editor
                </span>
              </div>
              <p className="text-[11px] text-slate-400">FrameKatha Studio AI • Chat &amp; Transform Photos</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Upload photo to edit"
              className="px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 hover:text-white transition-all cursor-pointer text-xs font-semibold flex items-center gap-1.5"
            >
              <Upload className="size-3.5" />
              <span className="hidden sm:inline">Upload Photo</span>
            </button>
            <button
              onClick={handleReset}
              title="Reset conversation"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-xs flex items-center gap-1"
            >
              <RefreshCw className="size-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Chat Message Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* Gemini Avatar */}
              {m.role === 'gemini' && (
                <div className="size-8 rounded-xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 border border-white/10 grid place-items-center shrink-0 mt-1 shadow-[0_0_10px_rgba(155,114,203,0.3)]">
                  <GeminiSparkleIcon className="size-4" />
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[90%] sm:max-w-[80%] space-y-3 ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-3xl rounded-tr-sm p-4 shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                    : 'bg-white/[0.04] border border-white/10 text-slate-200 rounded-3xl rounded-tl-sm p-4 sm:p-5 shadow-[0_0_30px_rgba(0,0,0,0.3)]'
                }`}
              >
                {/* User attached photo preview inside message */}
                {m.role === 'user' && m.originalImage && (
                  <div className="rounded-2xl overflow-hidden border border-white/20 max-w-xs mb-2">
                    <img src={m.originalImage} alt="User Upload" className="w-full max-h-48 object-cover" />
                  </div>
                )}

                {/* Text Content */}
                <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-2">
                  {m.text}
                </div>

                {/* Interactive Before & After Slider (When an image was edited!) */}
                {m.role === 'gemini' && m.originalImage && m.editedImage && (
                  <div className="pt-2">
                    <MiniBeforeAfterViewer
                      beforeUrl={m.originalImage}
                      afterUrl={m.editedImage}
                      title={m.appliedStyle}
                    />

                    {/* Adjustments Pills */}
                    {m.adjustments && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {Object.entries(m.adjustments).map(([key, val]) => (
                          <span
                            key={key}
                            className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-mono text-cyan-300"
                          >
                            <strong>{key}:</strong> {String(val)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Embedded Project Cards */}
                {m.matchedProjects && m.matchedProjects.length > 0 && (
                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 block font-semibold">
                      ✦ Recommended Projects ({m.matchedProjects.length}):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {m.matchedProjects.map((proj: any) => (
                        <Link
                          key={proj.id}
                          to={`/portfolio/${proj.slug || proj.id}`}
                          onClick={onClose}
                          className="group bg-black/40 hover:bg-black/60 border border-white/10 hover:border-purple-500/50 rounded-2xl p-2.5 transition-all flex items-center gap-2.5"
                        >
                          <img
                            src={proj.thumbnail}
                            alt={proj.title}
                            className="size-14 rounded-xl object-cover bg-slate-900 shrink-0 group-hover:scale-105 transition-transform"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[9px] text-cyan-400 font-semibold uppercase block">
                              {proj.category}
                            </span>
                            <h5 className="text-xs font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                              {proj.title}
                            </h5>
                            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                              {proj.camera && (
                                <span className="truncate flex items-center gap-1">
                                  <Camera className="size-2.5" /> {proj.camera}
                                </span>
                              )}
                              <span>📁 {proj.images?.length || 0}</span>
                            </div>
                          </div>
                          <ExternalLink className="size-3.5 text-slate-500 group-hover:text-cyan-400 shrink-0 mr-1 transition-colors" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow-up Suggestions */}
                {m.suggestions && m.suggestions.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {m.suggestions.map((sug) => (
                      <button
                        key={sug}
                        onClick={() => handleSend(sug)}
                        className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] transition-all hover:border-purple-400 cursor-pointer flex items-center gap-1"
                      >
                        <Sparkles className="size-2.5 text-purple-400" /> {sug}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[9px] text-slate-500 block text-right pt-1">
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}

          {/* Gemini Generating Indicator */}
          {loading && (
            <div className="flex gap-3 items-center">
              <div className="size-8 rounded-xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 border border-white/10 grid place-items-center shrink-0 shadow-[0_0_15px_rgba(155,114,203,0.3)] animate-pulse">
                <GeminiSparkleIcon className="size-4 animate-spin" />
              </div>
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-xs text-purple-300 flex items-center gap-2">
                <span className="size-2 rounded-full bg-blue-400 animate-ping" />
                <span>
                  {attachedImage || messages[messages.length - 1]?.originalImage
                    ? "Gemini is color grading and transforming your photo..."
                    : "Gemini is thinking and reviewing FrameKatha knowledgebase..."}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Attached Photo Preview Strip (Above Input Bar) */}
        {attachedImage && (
          <div className="px-4 py-2.5 border-t border-purple-500/30 bg-purple-950/20 flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative size-12 rounded-xl overflow-hidden border border-purple-400 shrink-0">
                <img src={attachedImage} alt="Attached" className="size-full object-cover" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <Sparkles className="size-3 text-cyan-400" /> Photo Attached for AI Editing
                </span>
                <p className="text-[10px] text-slate-400 truncate">
                  Type how to edit or click a quick style below:
                </p>
              </div>
            </div>
            <button
              onClick={() => setAttachedImage(null)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors"
              title="Remove photo"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        {/* Quick Style Chips Bar */}
        <div className="px-4 py-2 border-t border-white/5 bg-white/[0.01] overflow-x-auto flex gap-1.5 no-scrollbar">
          {attachedImage
            ? quickPhotoStyles.map((s) => (
                <button
                  key={s.label}
                  onClick={() => handleSend(s.prompt)}
                  className="px-3 py-1 rounded-xl bg-gradient-to-r from-purple-500/15 to-cyan-500/15 hover:from-purple-500/30 hover:to-cyan-500/30 border border-purple-500/30 text-white text-[11px] whitespace-nowrap transition-all cursor-pointer shrink-0 font-medium"
                >
                  {s.label}
                </button>
              ))
            : initialPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    if (p.includes("Upload a photo")) {
                      fileInputRef.current?.click();
                    } else {
                      handleSend(p.replace(/^✦\s*/, ''));
                    }
                  }}
                  className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] whitespace-nowrap transition-all hover:border-purple-500/40 cursor-pointer shrink-0"
                >
                  {p}
                </button>
              ))}
        </div>

        {/* Gemini Input Box */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-black/40">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative flex items-center gap-2"
          >
            {/* Photo Attachment Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              title="Upload photo from Computer / Phone to edit"
              className={`size-11 rounded-2xl border transition-all grid place-items-center shrink-0 cursor-pointer ${
                attachedImage
                  ? "bg-purple-600/30 border-purple-400 text-purple-300 shadow-[0_0_12px_rgba(139,92,246,0.4)]"
                  : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              {uploadingImage ? (
                <RefreshCw className="size-4 animate-spin text-cyan-400" />
              ) : (
                <ImageIcon className="size-4" />
              )}
            </button>

            {/* Input Field */}
            <div className="relative flex-1 flex items-center">
              <div className="absolute left-3.5 pointer-events-none">
                <GeminiSparkleIcon className="size-4" />
              </div>
              <input
                ref={inputRef}
                type="text"
                placeholder={
                  attachedImage
                    ? "Tell Gemini how to edit: 'Make it cyberpunk', 'Dramatic B&W', 'Vintage 35mm'..."
                    : "Ask Gemini anything or click the 🖼️ photo button to edit an image..."
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="w-full pl-10 pr-12 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:border-purple-400 focus:outline-none text-white text-xs sm:text-sm placeholder:text-slate-500 transition-all focus:ring-1 focus:ring-purple-400/30"
              />
              <button
                type="submit"
                disabled={loading || (!input.trim() && !attachedImage)}
                className="absolute right-2 size-8 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:opacity-90 disabled:opacity-30 grid place-items-center text-white transition-all cursor-pointer shadow-[0_0_15px_rgba(155,114,203,0.4)]"
                title="Send message to Gemini"
              >
                <Send className="size-3.5" />
              </button>
            </div>
          </form>

          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 px-1">
            <span>Powered by Google Gemini 1.5 &amp; Neural Color Engine</span>
            <span>Attach photo ➔ Tell Gemini how to edit ➔ Instant transformed result</span>
          </div>
        </div>
      </div>
    </div>
  );
}
