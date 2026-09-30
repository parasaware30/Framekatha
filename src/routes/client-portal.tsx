import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import {
  fetchGalleryPublicMeta,
  verifyClientPasscode,
  toggleClientImageSelect,
  submitClientFeedback,
  cleanMediaUrl
} from "@/lib/api";
import {
  Lock,
  Unlock,
  Heart,
  Download,
  FolderDown,
  CheckCircle2,
  Calendar,
  MapPin,
  Camera,
  MessageSquare,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  ShieldCheck,
  Send,
  AlertCircle
} from "lucide-react";

export function ClientPortalPage() {
  const { slug } = useParams<{ slug: string }>();

  const [gallerySlug, setGallerySlug] = useState(slug || "");
  const [passcode, setPasscode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [publicMeta, setPublicMeta] = useState<any>(null);
  const [gallery, setGallery] = useState<any>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [filterMode, setFilterMode] = useState<"all" | "selected">("all");

  // Feedback Submission Modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [clientNotes, setClientNotes] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Full-screen Lightbox
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Check if session has stored unlocked key
  useEffect(() => {
    if (slug) {
      loadPublicMeta(slug);
      const savedPass = sessionStorage.getItem(`fk_client_auth_${slug}`);
      if (savedPass) {
        setPasscode(savedPass);
        handleUnlock(slug, savedPass);
      }
    }
  }, [slug]);

  async function loadPublicMeta(targetSlug: string) {
    try {
      const meta = await fetchGalleryPublicMeta(targetSlug);
      setPublicMeta(meta);
    } catch (e) {
      console.warn("Public meta load error:", e);
    }
  }

  async function handleUnlock(targetSlug?: string, passToVerify?: string) {
    const s = targetSlug || gallerySlug;
    const p = passToVerify || passcode;
    if (!s || !p) {
      setError("Kripya gallery code aur passcode dono dalein.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await verifyClientPasscode(s, p);
      setGallery(data);
      setSelectedImages(data.selectedImages || []);
      setClientNotes(data.clientNotes || "");
      setIsUnlocked(true);
      sessionStorage.setItem(`fk_client_auth_${s}`, p);
    } catch (err: any) {
      setError(err.message || "Galat passcode! Kripya sahi passcode dalein.");
      setIsUnlocked(false);
    } finally {
      setLoading(false);
    }
  }

  const handleToggleSelect = async (imgUrl: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const isCurrentlySelected = selectedImages.includes(imgUrl);
    const newSelected = isCurrentlySelected
      ? selectedImages.filter((url) => url !== imgUrl)
      : [...selectedImages, imgUrl];

    setSelectedImages(newSelected);

    try {
      await toggleClientImageSelect(gallery.slug, imgUrl, !isCurrentlySelected);
    } catch (err) {
      console.error("Selection update error:", err);
    }
  };

  const handleSubmitFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingFeedback(true);
    try {
      await submitClientFeedback(gallery.slug, clientNotes, selectedImages);
      setFeedbackSuccess(true);
      setShowSubmitModal(false);
    } catch (err) {
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const displayedImages = filterMode === "all"
    ? (gallery?.images || [])
    : (gallery?.images || []).filter((img: string) => selectedImages.includes(img));

  // ── LOCK SCREEN ────────────────────────────────────────────────────────────
  if (!isUnlocked) {
    return (
      <SiteLayout>
        <section className="min-h-[75vh] flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md glass-strong rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-[0_0_50px_rgba(139,92,246,0.25)] relative overflow-hidden">
            {/* Ambient corner glow */}
            <div className="absolute -top-16 -right-16 size-32 bg-purple-600/30 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 size-32 bg-cyan-500/30 rounded-full blur-2xl pointer-events-none" />

            <div className="text-center space-y-4 mb-6">
              <div className="size-16 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 grid place-items-center shadow-[0_0_30px_rgba(139,92,246,0.5)] mx-auto">
                <Lock className="size-8 text-white" />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                  <ShieldCheck className="size-3.5 text-cyan-400" />
                  <span>Private Client Proofing Portal</span>
                </div>
                <h1 className="text-2xl font-bold font-display text-white mt-2">
                  {publicMeta?.eventTitle || "Secret Client Album"}
                </h1>
                {publicMeta?.clientName && (
                  <p className="text-sm text-cyan-400 font-semibold mt-0.5">
                    Prepared for: {publicMeta.clientName}
                  </p>
                )}
                {publicMeta?.location && (
                  <p className="text-xs text-slate-400 flex items-center justify-center gap-1 mt-1">
                    <MapPin className="size-3" /> {publicMeta.location} {publicMeta?.eventDate ? `• ${publicMeta.eventDate}` : ""}
                  </p>
                )}
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUnlock();
              }}
              className="space-y-4"
            >
              {!slug && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Album Link / Code (Slug):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. rohit-priya-wedding"
                    value={gallerySlug}
                    onChange={(e) => setGallerySlug(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none placeholder:text-slate-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Secret Access Passcode / PIN:
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    autoFocus
                    placeholder="Enter 4-digit or secret PIN"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none placeholder:text-slate-500 font-mono tracking-widest text-center"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Verifying PIN...</span>
                ) : (
                  <>
                    <Unlock className="size-4" />
                    <span>Unlock &amp; View Shoot Gallery</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-white/10 text-center text-[11px] text-slate-400">
              Passcode Paras Aware ke dwara provide kiya gaya hoga. Agar aapke paas PIN nahi hai, toh Paras se contact karein.
            </div>
          </div>
        </section>
      </SiteLayout>
    );
  }

  // ── UNLOCKED CLIENT SHOWCASE ───────────────────────────────────────────────
  return (
    <SiteLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 animate-fade-in">
        {/* Gallery Top Banner */}
        <div className="glass-strong rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
                <Unlock className="size-3.5" /> Private Client Gallery Active
              </span>
              {gallery.deadline && (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
                  Deadline: {gallery.deadline}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
              {gallery.eventTitle}
            </h1>
            <p className="text-sm text-cyan-300 font-semibold">
              Client: {gallery.clientName}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              {gallery.eventDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-purple-400" /> {gallery.eventDate}
                </span>
              )}
              {gallery.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-pink-400" /> {gallery.location}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Camera className="size-3.5 text-cyan-400" /> {gallery.images?.length || 0} High-Res Photos
              </span>
            </div>
          </div>

          {/* Top Actions: Download & Submit */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {gallery.allowDownload && (
              <a
                href={`/api/client-galleries/${gallery.slug}/download-zip?mode=all`}
                className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all flex items-center justify-center gap-2"
                title="Download all original photos as a ZIP file"
              >
                <FolderDown className="size-4 text-cyan-400" />
                <span>Download All ({gallery.images?.length || 0})</span>
              </a>
            )}

            <button
              onClick={() => setShowSubmitModal(true)}
              className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 hover:opacity-90 text-white text-xs font-bold shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="size-4" />
              <span>Submit Selections ({selectedImages.length})</span>
            </button>
          </div>
        </div>

        {/* Instructions banner */}
        {gallery.instructions && (
          <div className="glass-strong rounded-2xl p-4 border border-purple-500/25 flex items-start gap-3 text-xs text-slate-300">
            <Sparkles className="size-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Instructions from Paras:</span> {gallery.instructions}
            </div>
          </div>
        )}

        {/* Feedback Success Notification */}
        {feedbackSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-3 animate-fade-in shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <CheckCircle2 className="size-5 shrink-0 text-emerald-400" />
            <div>
              <strong>Selections Submitted Successfully!</strong> Paras Aware ko aapki {selectedImages.length} selected photos aur notes mil gaye hain. Album editing shuru ho chuki hai.
            </div>
          </div>
        )}

        {/* Filter Navigation: All vs Selected */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterMode("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterMode === "all"
                  ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
              }`}
            >
              All Photos ({gallery.images?.length || 0})
            </button>
            <button
              onClick={() => setFilterMode("selected")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterMode === "selected"
                  ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]"
                  : "bg-white/5 border border-white/10 text-pink-300 hover:bg-white/10"
              }`}
            >
              <Heart className={`size-3.5 ${selectedImages.length > 0 ? "fill-pink-400 text-pink-400" : ""}`} />
              <span>Selected for Album ({selectedImages.length})</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Click photo to zoom • Tap <Heart className="size-3 inline text-pink-400 fill-pink-400" /> to select for editing
          </div>
        </div>

        {/* Gallery Grid */}
        {displayedImages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedImages.map((imgUrl: string, idx: number) => {
              const isSelected = selectedImages.includes(imgUrl);
              return (
                <div
                  key={imgUrl}
                  onClick={() => setLightboxIndex(gallery.images.indexOf(imgUrl))}
                  className={`group glass-strong rounded-2xl overflow-hidden border cursor-pointer relative transition-all duration-300 hover:scale-[1.02] ${
                    isSelected
                      ? "border-pink-500 ring-2 ring-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                      : "border-white/10 hover:border-cyan-400/50"
                  }`}
                >
                  <div className="aspect-4/3 bg-slate-900 overflow-hidden relative">
                    <img
                      src={cleanMediaUrl(imgUrl)}
                      alt={`Photo ${idx + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500";
                      }}
                    />

                    {/* Watermark overlay if enabled */}
                    {gallery.watermarkEnabled && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-25 rotate-[-25deg]">
                        <span className="text-2xl font-bold font-display text-white tracking-widest uppercase">
                          FRAMEKATHA PROOF
                        </span>
                      </div>
                    )}

                    {/* Photo Index Badge */}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-mono text-white">
                      #{idx + 1}
                    </span>

                    {/* Heart / Select Action Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleSelect(imgUrl, e)}
                      className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                        isSelected
                          ? "bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.6)] scale-110"
                          : "bg-black/60 text-slate-300 hover:text-white hover:bg-black/90"
                      }`}
                      title={isSelected ? "Remove from selection" : "Select this photo"}
                    >
                      <Heart className={`size-4 ${isSelected ? "fill-white" : ""}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center glass-strong rounded-3xl border border-white/10 space-y-3">
            <Heart className="size-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Selected Photos Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Photos par diye gaye <strong>Heart icon</strong> par click karein taaki wo aapki album selection list me add ho jayein.
            </p>
            <button
              onClick={() => setFilterMode("all")}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold"
            >
              View All Photos
            </button>
          </div>
        )}

        {/* Bottom Floating Bar */}
        <div className="sticky bottom-6 z-30 flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#0d0d16]/95 border border-purple-500/40 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-2 text-xs text-slate-200">
            <Heart className="size-4 text-pink-400 fill-pink-400" />
            <span><strong>{selectedImages.length}</strong> photos selected for final album</span>
          </div>

          <div className="flex items-center gap-2">
            {gallery.allowDownload && selectedImages.length > 0 && (
              <a
                href={`/api/client-galleries/${gallery.slug}/download-zip?mode=selected`}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all flex items-center gap-1.5"
                title="Download selected photos as ZIP"
              >
                <Download className="size-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Download Selected ZIP</span>
              </a>
            )}

            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white text-xs font-bold shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="size-3.5" />
              <span>Finalize &amp; Submit</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── MODAL: SUBMIT SELECTIONS & FEEDBACK ─────────────────────────────── */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg glass-strong rounded-3xl p-6 sm:p-8 border border-pink-500/40 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="size-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-semibold mb-2">
                <CheckCircle2 className="size-3.5" />
                <span>Final Client Proofing Submission</span>
              </div>
              <h3 className="text-xl font-bold font-display text-white">
                Submit Photo Selections to Paras
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Aapne kul <strong>{selectedImages.length} photos</strong> select ki hain. Niche agar koi specific editing ya retouching instructions hon, toh likh kar submit karein.
              </p>
            </div>

            <form onSubmit={handleSubmitFinal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Retouching / Album Instructions (Optional):
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. Please retouch photo #5 for portrait skin tone, and use photo #12 as the main cover photo for our wedding album..."
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none placeholder:text-slate-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/15 text-slate-300 text-xs font-semibold hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 text-white text-xs font-bold shadow-lg transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="size-4" />
                  <span>{submittingFeedback ? "Submitting..." : "Confirm & Send to Paras"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── FULLSCREEN LIGHTBOX ──────────────────────────────────────────────── */}
      {lightboxIndex !== null && gallery?.images && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in select-none"
          onClick={() => setLightboxIndex(null)}
        >
          <div className="absolute top-4 right-4 flex items-center gap-3 z-50">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleSelect(gallery.images[lightboxIndex]);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                selectedImages.includes(gallery.images[lightboxIndex])
                  ? "bg-pink-500 border-pink-400 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)]"
                  : "bg-white/10 border-white/20 text-white hover:bg-white/20"
              }`}
            >
              <Heart className={`size-4 ${selectedImages.includes(gallery.images[lightboxIndex]) ? "fill-white" : ""}`} />
              <span>{selectedImages.includes(gallery.images[lightboxIndex]) ? "Selected" : "Select Photo"}</span>
            </button>

            <button
              onClick={() => setLightboxIndex(null)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="size-6" />
            </button>
          </div>

          {/* Left Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : gallery.images.length - 1));
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-50 cursor-pointer"
          >
            <ChevronLeft className="size-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev! < gallery.images.length - 1 ? prev! + 1 : 0));
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-50 cursor-pointer"
          >
            <ChevronRight className="size-6" />
          </button>

          {/* Image display */}
          <div className="max-w-6xl max-h-[85vh] p-4 flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={cleanMediaUrl(gallery.images[lightboxIndex])}
              alt={`Photo ${lightboxIndex + 1}`}
              className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200";
              }}
            />
            <div className="text-xs text-slate-400 font-mono mt-3">
              Photo {lightboxIndex + 1} of {gallery.images.length}
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
