import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { fetchProjectBySlug, fetchProjects, incrementProjectViews, toggleProjectLike, addProjectComment, deleteProjectComment } from "@/lib/api";
import {
  Camera,
  Calendar,
  MapPin,
  Eye,
  ArrowLeft,
  ArrowRight,
  Layers,
  Wrench,
  Tag,
  Folder,
  FolderOpen,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  Image as ImageIcon,
  Play,
  Pause,
  Sparkles,
  Clock,
  Download,
  FolderDown,
  Heart,
  MessageSquare,
  Send,
  Trash2,
  User,
  Share2,
  Check,
  QrCode
} from "lucide-react";
import { QRCodeModal } from "@/components/QRCodeModal";

function formatCommentTime(isoString?: string): string {
  if (!isoString) return "Just now";
  try {
    const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(isoString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  } catch {
    return "Recently";
  }
}

function isVideoUrl(url?: string): boolean {
  if (!url) return false;
  return /\.(mp4|webm|mov|ogg|m4v)(\?.*)?$/i.test(url);
}

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  // ?open=folder in URL → auto-open the folder panel (used by QR code links)
  const autoOpenFolder = searchParams.get("open") === "folder";
  
  const [project, setProject] = useState<any>(null);
  const [relatedProjects, setRelatedProjects] = useState<any[]>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMedia, setActiveMedia] = useState<string>("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [isAutoMoving, setIsAutoMoving] = useState(false);
  const [autoMoveSpeed, setAutoMoveSpeed] = useState<number>(3000);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentName, setCommentName] = useState<string>(() => localStorage.getItem("fk_user_name") || "");
  const [commentText, setCommentText] = useState<string>("");
  const [submittingComment, setSubmittingComment] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [qrModalOpen, setQrModalOpen] = useState<boolean>(false);
  const viewIncrementedRef = useRef<string | null>(null);

  const handleToggleLike = async () => {
    if (!project?.id) return;
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikesCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    if (nextLiked) {
      localStorage.setItem(`fk_liked_${project.id}`, "true");
    } else {
      localStorage.removeItem(`fk_liked_${project.id}`);
    }

    try {
      await toggleProjectLike(project.id, nextLiked ? "like" : "unlike");
    } catch (e) {
      console.error("Like toggle failed:", e);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !project?.id || submittingComment) return;

    setSubmittingComment(true);
    const author = commentName.trim() || "Creative Guest";
    try {
      const newComment = await addProjectComment(project.id, {
        name: author,
        comment: commentText.trim(),
      });
      localStorage.setItem("fk_user_name", author);
      setComments((prev) => [newComment, ...prev]);
      setCommentText("");
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!project?.id) return;
    try {
      await deleteProjectComment(project.id, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const handleDownloadFolderZip = () => {
    if (!project) return;
    setDownloadingZip(true);
    const downloadUrl = `/api/projects/${project.slug || project.id}/download-zip`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", `${project.folderName || project.title || "media_folder"}.zip`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadingZip(false), 2000);
  };

  const handleDownloadSingleMedia = async (url: string, suggestedFilename?: string) => {
    if (!url) return;
    try {
      setDownloadingFile(url);
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      let ext = "";
      const cleanUrl = url.split("?")[0];
      const match = cleanUrl.match(/\.([a-zA-Z0-9]+)$/);
      if (match) {
        ext = `.${match[1]}`;
      } else {
        ext = blob.type.includes("video") ? ".mp4" : ".jpg";
      }

      const fallbackName = isVideoUrl(url) ? "video" : "photo";
      let filename = suggestedFilename || fallbackName;
      if (!filename.toLowerCase().endsWith(ext.toLowerCase())) {
        filename = `${filename}${ext}`;
      }
      filename = filename.replace(/[/\\?%*:|"<>]/g, "_");

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1500);
    } catch (err) {
      console.warn("Direct blob download failed, falling back to direct link download:", err);
      const a = document.createElement("a");
      a.href = url;
      a.download = suggestedFilename || "download";
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setTimeout(() => setDownloadingFile(null), 1000);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function loadDetail() {
      if (!slug) {
        if (isMounted) setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await fetchProjectBySlug(slug);
        if (!isMounted) return;

        setProject(data);
        setLikesCount(data.likes || 0);
        setComments(data.comments || []);
        setIsLiked(localStorage.getItem(`fk_liked_${data.id}`) === "true");
        const initialMedia = (data.images && data.images.length > 0) ? data.images[0] : (data.afterImage || data.beforeImage || data.thumbnail || "");
        setActiveMedia(initialMedia);
        
        // Auto increment views once per project ID
        if (data?.id && viewIncrementedRef.current !== data.id) {
          viewIncrementedRef.current = data.id;
          incrementProjectViews(data.id);
        }
        
        // Fetch all projects for related & prev/next nav
        const all = await fetchProjects();
        if (!isMounted) return;
        setAllProjects(all);
        
        // Related projects filter by category or tags
        const related = all.filter(
          (p: any) => p.id !== data.id && (p.category === data.category || p.tags?.some((t: string) => data.tags?.includes(t)))
        );
        setRelatedProjects(related.slice(0, 3));

        // If the page was opened via a QR code with ?open=folder, auto-open folder
        if (autoOpenFolder && data.images && data.images.length > 0) {
          setIsFolderOpen(true);
        }
      } catch (e) {
        console.error("Failed to load project details:", e);
        if (isMounted) setProject(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDetail();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Auto-move slideshow effect for folder images in main view
  useEffect(() => {
    if (!isAutoMoving || !project?.images || project.images.length <= 1) return;

    const interval = setInterval(() => {
      setActiveMedia((current) => {
        const list = project.images;
        const currentIdx = list.indexOf(current || list[0]);
        const nextIdx = (currentIdx + 1) % list.length;
        return list[nextIdx];
      });
    }, autoMoveSpeed);

    return () => clearInterval(interval);
  }, [isAutoMoving, autoMoveSpeed, project?.images]);

  // Auto-move slideshow effect for fullscreen lightbox modal
  useEffect(() => {
    if (!isAutoMoving || lightboxIndex === null || !project?.images || project.images.length <= 1) return;

    const interval = setInterval(() => {
      setLightboxIndex((prev) => {
        if (prev === null) return 0;
        const next = (prev + 1) % project.images.length;
        setActiveMedia(project.images[next]);
        return next;
      });
    }, autoMoveSpeed);

    return () => clearInterval(interval);
  }, [isAutoMoving, lightboxIndex, autoMoveSpeed, project?.images]);

  const handleNextPhoto = () => {
    if (!project?.images || project.images.length <= 1) return;
    const list = project.images;
    const currentIdx = list.indexOf(activeMedia || list[0]);
    const nextIdx = (currentIdx + 1) % list.length;
    setActiveMedia(list[nextIdx]);
  };

  const handlePrevPhoto = () => {
    if (!project?.images || project.images.length <= 1) return;
    const list = project.images;
    const currentIdx = list.indexOf(activeMedia || list[0]);
    const prevIdx = (currentIdx - 1 + list.length) % list.length;
    setActiveMedia(list[prevIdx]);
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="max-w-5xl mx-auto px-4 py-16 space-y-8 animate-pulse">
          <div className="glass-strong rounded-3xl h-[60vh]" />
          <div className="h-10 w-1/2 bg-white/5 rounded-xl" />
        </div>
      </SiteLayout>
    );
  }

  if (!project) {
    return (
      <SiteLayout>
        <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
          <h2 className="text-2xl font-bold font-display text-white">Project Not Found</h2>
          <p className="text-xs text-slate-400">The requested portfolio project could not be found.</p>
          <Link to="/portfolio" className="btn-neon text-xs">Back to Portfolio</Link>
        </div>
      </SiteLayout>
    );
  }

  // Prev & Next navigation
  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex >= 0 && currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  return (
    <SiteLayout>
      <article className="max-w-6xl mx-auto px-4 py-8 space-y-12 animate-fade-in">
        {/* Back Link */}
        <Link to="/portfolio" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors">
          <ArrowLeft className="size-4" /> Back to Portfolio
        </Link>

        {/* Hero Section Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              {project.category}
            </span>
            {project.folderName && (
              <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-semibold flex items-center gap-1.5 shadow-md">
                <Folder className="size-3.5 text-purple-400" /> Folder: {project.folderName}
              </span>
            )}
            {project.subcategory && (
              <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                {project.subcategory}
              </span>
            )}
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Eye className="size-4 text-cyan-400" /> {project.views + 1} Views
            </span>

            {/* Like Button */}
            <button
              type="button"
              onClick={handleToggleLike}
              className={`px-3.5 py-1 rounded-full border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                isLiked
                  ? "bg-rose-500/20 border-rose-500/60 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                  : "bg-white/5 border-white/15 text-slate-300 hover:border-rose-500/40 hover:text-rose-300"
              }`}
              title={isLiked ? "Unlike project" : "Like this project"}
            >
              <Heart className={`size-3.5 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
              <span>{likesCount} {likesCount === 1 ? "Like" : "Likes"}</span>
            </button>

            {/* Comments Counter shortcut */}
            <a
              href="#comments-section"
              className="px-3.5 py-1 rounded-full bg-white/5 border border-white/15 text-xs font-bold text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Jump to comments section"
            >
              <MessageSquare className="size-3.5 text-cyan-400" />
              <span>{comments.length} Comments</span>
            </a>

            {/* QR Code Scan & Share Button */}
            <button
              type="button"
              onClick={() => setQrModalOpen(true)}
              className="px-3.5 py-1 rounded-full bg-white/5 hover:bg-cyan-500/20 text-cyan-300 border border-white/15 hover:border-cyan-400 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Generate QR code to scan on phone or send"
            >
              <QrCode className="size-3.5 text-cyan-400" />
              <span>QR Code</span>
            </button>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">{project.title}</h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl">{project.description}</p>
        </div>

        {/* Interactive Before/After Comparison Media (If either or both images are uploaded) */}
        {(project.beforeImage || project.afterImage) && (
          <div className="glass-strong rounded-3xl p-6 border border-purple-500/30 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-1 flex-wrap gap-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                ✨ {project.afterImage && project.beforeImage ? "RAW vs Color Edit Comparison" : (project.afterImage ? "FrameKatha Color Edit Showcase" : "Original RAW Capture Showcase")}
              </span>
              <div className="flex items-center gap-2">
                {project.afterImage && (
                  <button
                    type="button"
                    onClick={() => {
                      const baseName = project.slug || "photo";
                      handleDownloadSingleMedia(project.afterImage, `${baseName}_color_edit.jpg`);
                    }}
                    disabled={downloadingFile === project.afterImage}
                    className="px-3 py-1 rounded-xl bg-purple-500/20 hover:bg-purple-500 text-purple-200 hover:text-white border border-purple-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Download color graded photo"
                  >
                    <Download className={`size-3.5 ${downloadingFile === project.afterImage ? "animate-bounce" : ""}`} />
                    <span>{downloadingFile === project.afterImage ? "Downloading..." : "Download Edit"}</span>
                  </button>
                )}
                {project.beforeImage && (
                  <button
                    type="button"
                    onClick={() => {
                      const baseName = project.slug || "photo";
                      handleDownloadSingleMedia(project.beforeImage, `${baseName}_raw_original.jpg`);
                    }}
                    disabled={downloadingFile === project.beforeImage}
                    className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 border border-white/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Download RAW original photo"
                  >
                    <Download className={`size-3.5 ${downloadingFile === project.beforeImage ? "animate-bounce" : ""}`} />
                    <span>{downloadingFile === project.beforeImage ? "Downloading..." : "Download RAW"}</span>
                  </button>
                )}
              </div>
            </div>

            {project.beforeImage && project.afterImage ? (
              <BeforeAfterSlider
                beforeImage={project.beforeImage}
                afterImage={project.afterImage}
                beforeLabel="Original RAW Capture"
                afterLabel="FrameKatha Color Edit"
              />
            ) : (
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-full max-h-[75vh] flex items-center justify-center rounded-2xl overflow-hidden bg-slate-950/80 p-2 border border-white/10">
                  <img
                    src={project.afterImage || project.beforeImage}
                    alt={project.title}
                    className="max-h-[70vh] max-w-full object-contain rounded-xl"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. Video Showcase (If uploaded) */}
        {project.video && (
          <div className="glass-strong rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950/90 flex flex-col items-center justify-center min-h-[350px] max-h-[80vh] p-4 space-y-3">
            <div className="w-full flex items-center justify-between border-b border-white/10 pb-3 px-2 flex-wrap gap-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                🎥 Video Showcase Player
              </span>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const baseName = project.folderName || project.slug || "showcase";
                    handleDownloadSingleMedia(project.video, `${baseName}_video.mp4`);
                  }}
                  disabled={downloadingFile === project.video}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-cyan-500 to-emerald-500 hover:from-purple-500 hover:to-emerald-400 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Download showcase video (MP4)"
                >
                  <Download className={`size-3.5 ${downloadingFile === project.video ? "animate-bounce" : ""}`} />
                  <span>{downloadingFile === project.video ? "Downloading..." : "Download Video (MP4)"}</span>
                </button>
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">Original Video Stream</span>
              </div>
            </div>
            <div className="w-full max-h-[72vh] flex items-center justify-center">
              <video
                src={project.video}
                controls
                preload="metadata"
                playsInline
                className="max-h-[70vh] max-w-full object-contain rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        )}

        {/* 3. Project Media Folder & Album Showcase (All photos uploaded from folder/files) */}
        {project.images && project.images.length > 0 && (
          <div className="space-y-6">
            {!isFolderOpen ? (
              /* Case 1: FOLDER CLOSED STATE (Shows the folder card that user clicks to open) */
              <div className="glass-strong rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 grid place-items-center">
                      <Folder className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        {project.folderName ? project.folderName : "Creative Media Folder"}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Click on the folder below to open and reveal all {project.images.length} photos inside
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setQrModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 hover:text-black text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                      title="Scan or share QR code for this folder"
                    >
                      <QrCode className="size-4" />
                      <span>Folder QR</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadFolderZip}
                      disabled={downloadingZip}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 hover:text-black text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                      title="Download entire folder contents as a .ZIP file"
                    >
                      <FolderDown className={`size-4 ${downloadingZip ? "animate-bounce" : ""}`} />
                      <span>{downloadingZip ? "Preparing ZIP..." : "Download Entire Folder (ZIP)"}</span>
                    </button>
                    <span className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
                      📁 1 Folder ({project.images.length} Items)
                    </span>
                  </div>
                </div>

                {/* Interactive Folder Card */}
                <div className="flex justify-center sm:justify-start">
                  <div
                    onClick={() => setIsFolderOpen(true)}
                    className="group relative w-full sm:max-w-md cursor-pointer select-none"
                  >
                    {/* Layered Cards Stack Effect Behind Folder */}
                    <div className="absolute -top-2 left-3 right-3 h-full bg-purple-600/20 rounded-3xl transform rotate-1 transition-transform group-hover:rotate-2" />
                    <div className="absolute -top-1 left-1.5 right-1.5 h-full bg-cyan-500/20 rounded-3xl transform -rotate-1 transition-transform group-hover:-rotate-2" />

                    {/* Main Interactive Folder Container */}
                    <div className="relative glass-strong rounded-3xl p-4 sm:p-6 border-2 border-purple-500/40 group-hover:border-cyan-400 transition-all duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_35px_rgba(6,182,212,0.35)] bg-gradient-to-br from-[#16162a]/95 via-[#10101c]/95 to-[#0b0b14]/95 space-y-4 sm:space-y-5 overflow-hidden">
                      {/* Folder Top Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="size-10 sm:size-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 grid place-items-center text-white shadow-lg group-hover:scale-110 transition-transform shrink-0">
                            <Folder className="size-5 sm:size-6" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 block">
                              Media Folder Album
                            </span>
                            <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
                              {project.folderName || project.title}
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadFolderZip();
                            }}
                            disabled={downloadingZip}
                            className="px-2.5 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500 hover:text-black text-emerald-300 border border-emerald-500/40 font-mono text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                            title="Download all media in this folder as ZIP"
                          >
                            <FolderDown className={`size-3 ${downloadingZip ? "animate-bounce" : ""}`} />
                            <span>{downloadingZip ? "ZIP..." : "Download ZIP"}</span>
                          </button>
                          <span className="px-2.5 sm:px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono text-[11px] sm:text-xs font-bold shrink-0">
                            📁 {project.images.length} Photos
                          </span>
                        </div>
                      </div>

                      {/* Folder Cover Image Preview */}
                      <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-950 border border-white/10 group-hover:border-cyan-500/50 transition-colors">
                        <img
                          src={project.folderThumbnail || project.thumbnail || project.images[0]}
                          alt={project.folderName || project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-4">
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                              Click to view contents
                            </span>
                            <span className="px-3 py-1.5 rounded-xl bg-cyan-500 text-black text-xs font-bold flex items-center gap-1 shadow-lg group-hover:bg-cyan-400 transition-colors">
                              Open Folder <ChevronRight className="size-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Folder Footer CTA Button */}
                      <div className="space-y-3 pt-1">
                        <p className="text-xs text-slate-400 line-clamp-2">
                          Contains {project.images.length} photos and media files uploaded into this album.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2.5">
                          <button
                            type="button"
                            onClick={() => setIsFolderOpen(true)}
                            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-cyan-500 to-purple-600 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <FolderOpen className="size-4" />
                            <span>Open Folder &amp; View All {project.images.length} Photos</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadFolderZip();
                            }}
                            disabled={downloadingZip}
                            className="py-3 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 hover:text-black text-emerald-300 border border-emerald-500/50 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                            title="Download entire folder contents as a .ZIP archive"
                          >
                            <FolderDown className={`size-4 ${downloadingZip ? "animate-bounce" : ""}`} />
                            <span>{downloadingZip ? "Downloading ZIP..." : "Download Folder (.ZIP)"}</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setQrModalOpen(true);
                            }}
                            className="py-3 px-3.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 hover:text-black text-cyan-300 border border-cyan-500/50 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                            title="Scan or Send QR Code for this folder"
                          >
                            <QrCode className="size-4" />
                            <span>QR Code</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Case 2: FOLDER OPENED STATE (Shows photos inside this folder) */
              <div className="space-y-6 animate-fade-in">
                {/* Breadcrumb Navigation Bar */}
                <div className="glass-strong rounded-2xl p-4 border border-cyan-500/40 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsFolderOpen(false)}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="size-3.5" />
                      <span>Back to Folder View</span>
                    </button>
                    <div className="h-4 w-px bg-white/20 hidden sm:block" />
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-slate-400">📁 Folders</span>
                      <span className="text-slate-500">/</span>
                      <span className="text-cyan-400 font-bold flex items-center gap-1">
                        <FolderOpen className="size-3.5 text-cyan-400" />
                        {project.folderName || project.title}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Folder QR Code Button */}
                    <button
                      type="button"
                      onClick={() => setQrModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 hover:text-black text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                      title="Scan or share QR code for this folder"
                    >
                      <QrCode className="size-3.5" />
                      <span>Folder QR</span>
                    </button>

                    {/* Download Folder (.ZIP) Button */}
                    <button
                      type="button"
                      onClick={handleDownloadFolderZip}
                      disabled={downloadingZip}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 hover:text-black text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                      title="Download entire folder contents as a .ZIP archive"
                    >
                      <FolderDown className={`size-3.5 ${downloadingZip ? "animate-bounce" : ""}`} />
                      <span>{downloadingZip ? "Preparing..." : "Download Folder (ZIP)"}</span>
                    </button>

                    {/* Auto-Move Slideshow Button in Breadcrumb */}
                    {project.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setIsAutoMoving(!isAutoMoving)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                          isAutoMoving
                            ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse"
                            : "bg-purple-600/90 hover:bg-purple-500 text-white border border-purple-400/40"
                        }`}
                        title="Automatically cycle through all photos inside this folder"
                      >
                        {isAutoMoving ? (
                          <>
                            <Pause className="size-3.5 fill-black" />
                            <span>⏸️ Pause Auto-Move</span>
                          </>
                        ) : (
                          <>
                            <Play className="size-3.5 fill-white" />
                            <span>▶️ Start Auto-Move</span>
                          </>
                        )}
                      </button>
                    )}

                    <div className="h-4 w-px bg-white/20 hidden sm:block" />
                    <span className="text-xs text-slate-300 font-mono hidden md:inline">
                      {project.images.length} Photos
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsFolderOpen(false)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Close Folder"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Photo Title Showcase Bar (When photoTitle is set) */}
                {project.photoTitle && (
                  <div className="px-4 py-2.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between gap-3 shadow-inner">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 grid place-items-center">
                        <Camera className="size-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-300">
                        Photo Title: <strong className="text-cyan-300 font-bold">{project.photoTitle}</strong>
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Photo {project.images.indexOf(activeMedia || project.images[0]) + 1} of {project.images.length}
                    </span>
                  </div>
                )}

                {/* Active Highlight Photo View with Auto-Move Controls & Fullscreen Lightbox trigger */}
                <div className="relative group glass-strong rounded-3xl overflow-hidden border border-cyan-500/30 shadow-2xl bg-slate-950/90 flex items-center justify-center min-h-[380px] max-h-[80vh] p-3">
                  {/* Previous Photo Arrow */}
                  {project.images.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevPhoto();
                      }}
                      className="absolute left-3 sm:left-5 z-20 size-11 rounded-full bg-black/70 hover:bg-cyan-500 hover:text-black text-white border border-white/20 transition-all opacity-80 hover:opacity-100 flex items-center justify-center cursor-pointer shadow-2xl backdrop-blur-md"
                      title="Previous Photo"
                    >
                      <ChevronLeft className="size-5" />
                    </button>
                  )}

                  {/* Active Highlight Photo / Video */}
                  {isVideoUrl(activeMedia || project.images[0]) ? (
                    <video
                      key={activeMedia || project.images[0]}
                      src={activeMedia || project.images[0]}
                      controls
                      autoPlay
                      muted
                      playsInline
                      preload="metadata"
                      className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
                    />
                  ) : (
                    <img
                      key={activeMedia || project.images[0]}
                      src={activeMedia || project.images[0]}
                      alt={project.title}
                      className="max-h-[75vh] max-w-full object-contain rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.01] animate-fade-in"
                      onClick={() => {
                        const idx = project.images.indexOf(activeMedia || project.images[0]);
                        setLightboxIndex(idx >= 0 ? idx : 0);
                      }}
                    />
                  )}

                  {/* Next Photo Arrow */}
                  {project.images.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextPhoto();
                      }}
                      className="absolute right-3 sm:right-5 z-20 size-11 rounded-full bg-black/70 hover:bg-cyan-500 hover:text-black text-white border border-white/20 transition-all opacity-80 hover:opacity-100 flex items-center justify-center cursor-pointer shadow-2xl backdrop-blur-md"
                      title="Next Photo"
                    >
                      <ChevronRight className="size-5" />
                    </button>
                  )}

                  {/* Bottom Action Bar: Auto-Move Controls, Speed, Download and Lightbox */}
                  <div
                    className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2.5 pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Auto-Move Button & Speed Options */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setIsAutoMoving(!isAutoMoving)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xl backdrop-blur-md border ${
                          isAutoMoving
                            ? "bg-emerald-500 hover:bg-emerald-400 text-black border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.6)]"
                            : "bg-black/85 hover:bg-purple-600 text-white border-white/25 hover:border-purple-400"
                        }`}
                      >
                        {isAutoMoving ? (
                          <>
                            <Pause className="size-3.5 fill-black" />
                            <span>⏸️ Auto-Moving ({autoMoveSpeed / 1000}s)</span>
                          </>
                        ) : (
                          <>
                            <Play className="size-3.5 fill-white" />
                            <span>▶️ Auto-Move Photos (Play Slideshow)</span>
                          </>
                        )}
                      </button>

                      {/* Speed Pills */}
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 text-[11px] font-mono text-slate-300">
                        <Clock className="size-3 text-cyan-400 hidden sm:inline" />
                        <span className="text-[10px] text-slate-400 hidden sm:inline mr-1">Speed:</span>
                        {[2000, 3000, 5000].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setAutoMoveSpeed(s)}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              autoMoveSpeed === s
                                ? "bg-cyan-500 text-black shadow-sm"
                                : "hover:bg-white/15 text-slate-300 hover:text-white"
                            }`}
                          >
                            {s / 1000}s
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-auto flex-wrap">
                      {/* Download Active Photo / Media Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const activeUrl = activeMedia || project.images[0];
                          const isVid = isVideoUrl(activeUrl);
                          const idx = project.images.indexOf(activeUrl) + 1;
                          const baseName = project.folderName || project.slug || "media";
                          const name = isVid ? `${baseName}_video_${idx}` : `${baseName}_photo_${idx}`;
                          handleDownloadSingleMedia(activeUrl, name);
                        }}
                        disabled={downloadingFile === (activeMedia || project.images[0])}
                        className="px-3.5 py-2 rounded-xl bg-black/85 hover:bg-emerald-500 hover:text-black text-emerald-300 text-xs font-bold backdrop-blur-md border border-emerald-500/40 transition-all flex items-center gap-1.5 shadow-xl cursor-pointer"
                        title={isVideoUrl(activeMedia || project.images[0]) ? "Download this video (MP4)" : "Download this photo in high quality"}
                      >
                        <Download className={`size-3.5 ${downloadingFile === (activeMedia || project.images[0]) ? "animate-bounce" : ""}`} />
                        <span>
                          {downloadingFile === (activeMedia || project.images[0])
                            ? "Downloading..."
                            : isVideoUrl(activeMedia || project.images[0])
                            ? "Download Video (MP4)"
                            : "Download Photo (HD)"}
                        </span>
                      </button>

                      {/* View Fullscreen Lightbox Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const idx = project.images.indexOf(activeMedia || project.images[0]);
                          setLightboxIndex(idx >= 0 ? idx : 0);
                        }}
                        className="px-4 py-2 rounded-xl bg-black/85 hover:bg-cyan-500 hover:text-black text-cyan-300 text-xs font-bold backdrop-blur-md border border-cyan-500/40 transition-all flex items-center gap-1.5 shadow-xl cursor-pointer"
                      >
                        <Maximize2 className="size-3.5" />
                        <span>View Fullscreen Lightbox</span>
                      </button>
                    </div>
                  </div>

                  {/* Auto-Move Slideshow Glowing Progress Line */}
                  {isAutoMoving && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/60 z-30 overflow-hidden">
                      <div
                        key={activeMedia}
                        className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 shadow-[0_0_10px_#06b6d4]"
                        style={{
                          animation: `progressLinear ${autoMoveSpeed}ms linear forwards`,
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Folder Collection Grid Card */}
                <div className="p-6 rounded-3xl glass-strong border border-white/10 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 grid place-items-center">
                        <FolderOpen className="size-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          Inside: {project.folderName ? `${project.folderName} — Album Media Files` : "Project Folder & Album Collection"}
                        </h3>
                        <p className="text-[11px] text-slate-400">Click any photo in this folder to open in high-res fullscreen</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {/* Download All as ZIP button */}
                      <button
                        type="button"
                        onClick={handleDownloadFolderZip}
                        disabled={downloadingZip}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border bg-emerald-500/20 hover:bg-emerald-500 hover:text-black text-emerald-300 border-emerald-500/40 shadow-sm"
                        title="Download all media in this folder as a ZIP archive"
                      >
                        <FolderDown className={`size-3.5 ${downloadingZip ? "animate-bounce" : ""}`} />
                        <span>{downloadingZip ? "Preparing..." : `Download All (${project.images.length} files ZIP)`}</span>
                      </button>

                      {project.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setIsAutoMoving(!isAutoMoving)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                            isAutoMoving
                              ? "bg-emerald-500 text-black border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                              : "bg-white/5 hover:bg-white/10 text-cyan-300 border-white/15"
                          }`}
                        >
                          {isAutoMoving ? <Pause className="size-3 fill-black" /> : <Play className="size-3 fill-cyan-300" />}
                          <span>{isAutoMoving ? "Pause Auto-Move" : "Auto-Move Slideshow"}</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsFolderOpen(false)}
                        className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <Folder className="size-3.5" /> Close Folder
                      </button>
                    </div>
                  </div>

                  {/* All Folder Media Items Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {project.images.map((img: string, idx: number) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setActiveMedia(img);
                          setLightboxIndex(idx);
                        }}
                        className={`relative group aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer bg-slate-900 ${
                          activeMedia === img
                            ? "border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)] scale-[1.02]"
                            : "border-white/10 hover:border-cyan-500/50 hover:scale-[1.02]"
                        }`}
                      >
                        {isVideoUrl(img) ? (
                          <video
                            src={img}
                            muted
                            preload="metadata"
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={img}
                            alt={`Album Item ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        )}

                        {/* Quick Hover Download Button for this Item */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const isVid = isVideoUrl(img);
                            const baseName = project.folderName || project.slug || "media";
                            const name = isVid ? `${baseName}_video_${idx + 1}` : `${baseName}_photo_${idx + 1}`;
                            handleDownloadSingleMedia(img, name);
                          }}
                          className="absolute top-1.5 right-1.5 size-7 rounded-lg bg-black/80 hover:bg-emerald-500 hover:text-black text-white border border-white/20 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer shadow-lg z-10"
                          title={isVideoUrl(img) ? "Download this video (MP4)" : "Download this photo (HD)"}
                        >
                          <Download className="size-3.5" />
                        </button>

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          {isVideoUrl(img) ? (
                            <Play className="size-6 text-white drop-shadow-md fill-white" />
                          ) : (
                            <Maximize2 className="size-6 text-white drop-shadow-md" />
                          )}
                        </div>
                        <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/75 text-[9px] font-mono text-white pointer-events-none flex items-center gap-1">
                          {isVideoUrl(img) ? "🎥 Video" : `#${idx + 1}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Project Metadata Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-white/10">
          {/* Main Column */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-bold font-display text-white mb-3">Project Overview</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{project.description}</p>
            </div>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Tag className="size-4 text-cyan-400" /> Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((t: string) => (
                    <span key={t} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Metadata Box */}
          <div className="glass-strong rounded-3xl p-6 border border-white/10 space-y-4 text-xs">
            <h3 className="font-bold text-sm font-display text-white border-b border-white/10 pb-3">Technical Specifications</h3>
            
            {project.year && (
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400 flex items-center gap-1.5"><Calendar className="size-3.5 text-cyan-400" /> Year</span>
                <span className="font-semibold text-white">{project.year}</span>
              </div>
            )}

            {project.location && (
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400 flex items-center gap-1.5"><MapPin className="size-3.5 text-purple-400" /> Location</span>
                <span className="font-semibold text-white">{project.location}</span>
              </div>
            )}

            {project.camera && (
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400 flex items-center gap-1.5"><Camera className="size-3.5 text-cyan-400" /> Camera Body</span>
                <span className="font-semibold text-white">{project.camera}</span>
              </div>
            )}

            {project.lens && (
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400 flex items-center gap-1.5"><Layers className="size-3.5 text-pink-400" /> Lens</span>
                <span className="font-semibold text-white">{project.lens}</span>
              </div>
            )}

            {project.editingSoftware && (
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400 flex items-center gap-1.5"><Wrench className="size-3.5 text-yellow-400" /> Software</span>
                <span className="font-semibold text-white">{project.editingSoftware}</span>
              </div>
            )}

            {project.tools && project.tools.length > 0 && (
              <div className="pt-2 border-t border-white/5">
                <span className="text-slate-400 block mb-1">Tools & Hardware</span>
                <div className="flex flex-wrap gap-1">
                  {project.tools.map((tool: string) => (
                    <span key={tool} className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-slate-300 font-mono">{tool}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Community Comments & Feedback Section */}
        <section id="comments-section" className="glass-strong rounded-3xl p-6 sm:p-8 border border-white/10 space-y-8 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 grid place-items-center text-white shadow-lg">
                <MessageSquare className="size-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Comments &amp; Feedback</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">
                    {comments.length}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Share your thoughts, praise the creator, or ask questions</p>
              </div>
            </div>

            {/* Quick Engagement Actions */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleToggleLike}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                  isLiked
                    ? "bg-rose-500 hover:bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                    : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/15 hover:border-rose-500/50 hover:text-rose-300"
                }`}
              >
                <Heart className={`size-4 ${isLiked ? "fill-white text-white" : ""}`} />
                <span>{isLiked ? "Liked" : "Like"} ({likesCount})</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/15 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Copy link to project"
              >
                {copiedShare ? (
                  <>
                    <Check className="size-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="size-3.5" />
                    <span>Share</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setQrModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-cyan-300 border border-white/15 hover:border-cyan-500/40 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Scan or send QR code for this project"
              >
                <QrCode className="size-3.5 text-cyan-400" />
                <span>QR Code</span>
              </button>
            </div>
          </div>

          {/* Comment Submission Form */}
          <form onSubmit={handleAddComment} className="glass-strong rounded-2xl p-4 sm:p-5 border border-cyan-500/30 space-y-4 shadow-inner">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 grid place-items-center shrink-0">
                <User className="size-4" />
              </div>
              <input
                type="text"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                placeholder="Your Name (e.g. Rahul, John, Priya)..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                maxLength={40}
              />
            </div>

            <div className="relative">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment, share your feedback, or appreciate this work..."
                rows={3}
                required
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-1 flex-wrap">
              <span className="text-[11px] text-slate-500">
                💡 Be respectful &amp; constructive in the creative community.
              </span>
              <button
                type="submit"
                disabled={!commentText.trim() || submittingComment}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-cyan-500 to-purple-600 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className={`size-3.5 ${submittingComment ? "animate-pulse" : ""}`} />
                <span>{submittingComment ? "Posting..." : "Post Comment"}</span>
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-3 pt-2">
            {comments.length === 0 ? (
              <div className="text-center py-10 space-y-2 border border-dashed border-white/10 rounded-2xl">
                <MessageSquare className="size-8 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-300">No comments yet</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Be the very first person to leave a comment or appreciation for this project!
                </p>
              </div>
            ) : (
              comments.map((comm: any) => (
                <div
                  key={comm.id}
                  className="group glass-strong rounded-2xl p-4 border border-white/5 hover:border-cyan-500/30 transition-all flex items-start gap-3.5"
                >
                  {/* User Initial Avatar with Gradient */}
                  <div className="size-9 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 text-white font-bold text-xs grid place-items-center shrink-0 shadow-md">
                    {comm.name ? comm.name.charAt(0).toUpperCase() : "U"}
                  </div>

                  {/* Comment Details */}
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-xs">{comm.name || "Creative Guest"}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          • {formatCommentTime(comm.createdAt)}
                        </span>
                      </div>

                      {/* Delete Option */}
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(comm.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition-all cursor-pointer"
                        title="Delete comment"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed break-words whitespace-pre-wrap">
                      {comm.comment}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Previous / Next Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-white/10">
          {prevProject ? (
            <Link
              to={`/portfolio/${prevProject.slug}`}
              className="flex items-center gap-3 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="size-4" />
              <div>
                <span className="text-[10px] text-slate-500 block">Previous Project</span>
                <span className="text-sm font-bold text-white">{prevProject.title}</span>
              </div>
            </Link>
          ) : <div />}

          {nextProject ? (
            <Link
              to={`/portfolio/${nextProject.slug}`}
              className="flex items-center gap-3 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors text-right"
            >
              <div>
                <span className="text-[10px] text-slate-500 block">Next Project</span>
                <span className="text-sm font-bold text-white">{nextProject.title}</span>
              </div>
              <ArrowRight className="size-4" />
            </Link>
          ) : <div />}
        </div>

        {/* Related Projects ("You May Also Like") */}
        {relatedProjects.length > 0 && (
          <div className="pt-12 border-t border-white/10 space-y-6">
            <h3 className="text-2xl font-bold font-display text-white">You May Also <span className="gradient-text">Like</span></h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProjects.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/portfolio/${rel.slug}`}
                  className="group glass-strong rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/50 transition-all flex flex-col"
                >
                  <div className="aspect-4/3 overflow-hidden bg-slate-900">
                    <img src={rel.thumbnail} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] text-cyan-400 font-semibold uppercase">{rel.category}</span>
                    <h4 className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors mt-1">{rel.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Interactive Fullscreen Lightbox Modal */}
      {lightboxIndex !== null && project.images && project.images.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 animate-fade-in select-none"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Bar */}
          <div className="flex justify-between items-center z-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono font-bold text-cyan-400">
                Photo {lightboxIndex + 1} of {project.images.length}
              </span>
              <span className="text-xs text-slate-300 font-semibold hidden sm:inline">{project.title}</span>
              {project.photoTitle && (
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[11px] font-semibold flex items-center gap-1">
                  <Camera className="size-3 text-cyan-400" /> {project.photoTitle}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Download Current Media in Lightbox */}
              <button
                type="button"
                onClick={() => {
                  const currentUrl = project.images[lightboxIndex];
                  const isVid = isVideoUrl(currentUrl);
                  const baseName = project.folderName || project.slug || "media";
                  const name = isVid ? `${baseName}_video_${lightboxIndex + 1}` : `${baseName}_photo_${lightboxIndex + 1}`;
                  handleDownloadSingleMedia(currentUrl, name);
                }}
                disabled={downloadingFile === project.images[lightboxIndex]}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-black text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title={isVideoUrl(project.images[lightboxIndex]) ? "Download this video (MP4)" : "Download this photo (HD)"}
              >
                <Download className={`size-3.5 ${downloadingFile === project.images[lightboxIndex] ? "animate-bounce" : ""}`} />
                <span>
                  {downloadingFile === project.images[lightboxIndex]
                    ? "Downloading..."
                    : isVideoUrl(project.images[lightboxIndex])
                    ? "Download Video"
                    : "Download Photo"}
                </span>
              </button>

              {project.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => setIsAutoMoving(!isAutoMoving)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                    isAutoMoving
                      ? "bg-emerald-500 text-black animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  }`}
                  title="Auto-move slideshow in fullscreen"
                >
                  {isAutoMoving ? (
                    <>
                      <Pause className="size-3.5 fill-black" />
                      <span>⏸️ Pause Auto-Move</span>
                    </>
                  ) : (
                    <>
                      <Play className="size-3.5 fill-white" />
                      <span>▶️ Auto-Move ({autoMoveSpeed / 1000}s)</span>
                    </>
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          {/* Main Photo Center Container with Prev / Next Navigation */}
          <div
            className="relative flex-1 flex items-center justify-center p-2 my-2 min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Previous Button */}
            {project.images.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((prev) =>
                    prev !== null ? (prev === 0 ? project.images.length - 1 : prev - 1) : 0
                  )
                }
                className="absolute left-2 sm:left-6 z-10 size-12 rounded-full bg-black/60 hover:bg-cyan-500 hover:text-black text-white border border-white/20 transition-all grid place-items-center cursor-pointer shadow-2xl"
              >
                <ChevronLeft className="size-6" />
              </button>
            )}

            {/* Displayed Image or Video */}
            {isVideoUrl(project.images[lightboxIndex]) ? (
              <video
                key={project.images[lightboxIndex]}
                src={project.images[lightboxIndex]}
                controls
                autoPlay
                playsInline
                preload="metadata"
                className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
              />
            ) : (
              <img
                src={project.images[lightboxIndex]}
                alt={`Full size ${lightboxIndex + 1}`}
                className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl transition-all duration-300"
              />
            )}

            {/* Next Button */}
            {project.images.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((prev) =>
                    prev !== null ? (prev === project.images.length - 1 ? 0 : prev + 1) : 0
                  )
                }
                className="absolute right-2 sm:right-6 z-10 size-12 rounded-full bg-black/60 hover:bg-cyan-500 hover:text-black text-white border border-white/20 transition-all grid place-items-center cursor-pointer shadow-2xl"
              >
                <ChevronRight className="size-6" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Strip */}
          {project.images.length > 1 && (
            <div
              className="flex justify-center gap-2 overflow-x-auto py-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {project.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  className={`size-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    lightboxIndex === idx
                      ? "border-cyan-400 scale-105 shadow-[0_0_12px_#06b6d4]"
                      : "border-white/20 opacity-50 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {/* Project & Folder QR Code Modal */}
      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        projectUrl={`/portfolio/${project.slug || project.id}`}
        title={project.title}
        folderName={project.folderName}
        isFolderQR={!!(project.folderName || (project.images && project.images.length > 0))}
      />
    </SiteLayout>
  );
}
