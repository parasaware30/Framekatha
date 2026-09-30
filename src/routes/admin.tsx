import { useState, useEffect, useRef } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { FileUploadPicker } from "@/components/FileUploadPicker";
import { AIMetadataModal } from "@/components/AIMetadataModal";
import { AIModal } from "@/components/AIModal";
import { ClientGalleryQRModal } from "@/components/ClientGalleryQRModal";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import {
  fetchAllProjectsCMS,
  createProject,
  updateProject,
  deleteProject,
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchTestimonials,
  createTestimonial,
  deleteTestimonial,
  fetchMessages,
  deleteMessage,
  fetchAnalytics,
  fetchSiteSettings,
  updateSiteSettings,
  aiSuggestMetadata,
  fetchClientGalleries,
  createClientGallery,
  updateClientGallery,
  deleteClientGallery,
  cleanMediaUrl,
  DEFAULT_PROJECTS,
  DEFAULT_CATEGORIES,
  DEFAULT_TESTIMONIALS,
  DEFAULT_SETTINGS,
  DEFAULT_CLIENT_GALLERIES
} from "@/lib/api";
import {
  BarChart3,
  FolderPlus,
  Folder,
  FolderOpen,
  FolderUp,
  FileImage,
  Camera,
  Layers,
  MessageSquare,
  Sparkles,
  Settings,
  Trash2,
  Edit,
  Plus,
  Eye,
  Check,
  X,
  Bot,
  RefreshCw,
  Star,
  CheckCircle2,
  Lock,
  LogOut,
  Shield,
  LayoutGrid,
  List,
  Globe,
  EyeOff,
  Save,
  AlertTriangle,
  Wrench,
  ShieldCheck,
  Heart,
  Download,
  FolderDown,
  Copy,
  ExternalLink,
  Users,
  Key,
  HelpCircle,
  Send,
  Calendar,
  MapPin,
  QrCode,
  Video,
  Film,
  Play,
  ArrowUp,
  ArrowDown,
  Tv
} from "lucide-react";

// ── Admin password ───────────────────────────────────────────────────────────
const ADMIN_PASSWORD = "Paras200519";
const SESSION_KEY = "fk_admin_auth";
// ────────────────────────────────────────────────────────────────────────────

/** Full-page password lock screen shown before the admin dashboard */
function AdminLockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onUnlock();
    } else {
      setError("Galat password! Dobara try karo.");
      setShake(true);
      setPwd("");
      setTimeout(() => setShake(false), 600);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#07070c] flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[100px]" />
      </div>

      <div
        className={`relative w-full max-w-sm glass-strong rounded-3xl border border-white/10 p-8 shadow-[0_0_60px_rgba(139,92,246,0.2)] ${shake ? "animate-[shake_0.4s_ease]" : ""}`}
        style={shake ? { animation: "shake 0.4s ease" } : {}}
      >
        {/* 3D Logo */}
        <div className="flex flex-col items-center mb-8 text-center">
          <img
            src="/logo.png"
            alt="FrameKatha Logo"
            className="h-14 w-auto object-contain mb-3 filter drop-shadow-[0_0_20px_rgba(139,92,246,0.5)]"
          />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[11px] font-semibold text-purple-300">
            <Shield className="size-3 text-cyan-400" />
            <span>Admin CMS Access Only</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              ref={inputRef}
              type={showPwd ? "text" : "password"}
              value={pwd}
              onChange={(e) => { setPwd(e.target.value); setError(""); }}
              placeholder="Enter admin password"
              autoComplete="current-password"
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/30 placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              {showPwd ? "Hide" : "Show"}
            </button>
          </div>

          {error && (
            <p className="text-xs text-rose-400 font-semibold flex items-center gap-1.5">
              <X className="size-3.5" /> {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] cursor-pointer"
          >
            Unlock Admin Panel
          </button>
        </form>

        <p className="text-center text-[11px] text-slate-600 mt-6">
          🔒 Session closes automatically when you close the browser tab.
        </p>
      </div>

      {/* Shake keyframe */}
      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)}
          60%{transform:translateX(-6px)}
          80%{transform:translateX(6px)}
        }
      `}</style>
    </div>
  );
}

export function AdminPage() {
  // ── Auth gate ────────────────────────────────────────────────────────────
  const [isUnlocked, setIsUnlocked] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "1"
  );

  if (!isUnlocked) {
    return <AdminLockScreen onUnlock={() => setIsUnlocked(true)} />;
  }
  // ────────────────────────────────────────────────────────────────────────

  const handleAdminLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsUnlocked(false);
  };

  return <AdminDashboard onLogout={handleAdminLogout} />;
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<"projects" | "analytics" | "client-galleries" | "categories" | "testimonials" | "messages" | "settings">("projects");
  const [projectViewMode, setProjectViewMode] = useState<"grid" | "table">("grid");

  // Data states
  const [analytics, setAnalytics] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>(DEFAULT_PROJECTS);
  const [clientGalleries, setClientGalleries] = useState<any[]>(DEFAULT_CLIENT_GALLERIES);
  const [categories, setCategories] = useState<any[]>(DEFAULT_CATEGORIES);
  const [testimonials, setTestimonials] = useState<any[]>(DEFAULT_TESTIMONIALS);
  const [messages, setMessages] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Client Galleries Form State
  const [showAddGallery, setShowAddGallery] = useState(false);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [selectedFeedbackGallery, setSelectedFeedbackGallery] = useState<any | null>(null);
  const [selectedQrGallery, setSelectedQrGallery] = useState<any | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const [galleryForm, setGalleryForm] = useState({
    clientName: "",
    eventTitle: "",
    slug: "",
    passcode: "",
    eventDate: "",
    location: "",
    coverImage: "",
    images: [] as string[],
    instructions: "Please review the photos and tap the heart icon on your favorite shots for album selection.",
    allowDownload: true,
    watermarkEnabled: false,
    deadline: ""
  });

  const resetGalleryForm = () => {
    setGalleryForm({
      clientName: "",
      eventTitle: "",
      slug: "",
      passcode: "",
      eventDate: "",
      location: "",
      coverImage: "",
      images: [],
      instructions: "Please review the photos and tap the heart icon on your favorite shots for album selection.",
      allowDownload: true,
      watermarkEnabled: false,
      deadline: ""
    });
    setEditingGalleryId(null);
  };

  const handleGenerateRandomPin = () => {
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    setGalleryForm((prev) => ({ ...prev, passcode: pin }));
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.clientName || !galleryForm.eventTitle || !galleryForm.passcode) {
      alert("Please enter Client Name, Event Title, and Secret Passcode/PIN.");
      return;
    }

    try {
      const sanitizedPayload = {
        ...galleryForm,
        coverImage: cleanMediaUrl(galleryForm.coverImage) || (galleryForm.images.length > 0 ? cleanMediaUrl(galleryForm.images[0]) : ""),
        images: Array.isArray(galleryForm.images) ? galleryForm.images.map(cleanMediaUrl).filter(Boolean) : []
      };
      if (editingGalleryId) {
        await updateClientGallery(editingGalleryId, sanitizedPayload);
      } else {
        await createClientGallery(sanitizedPayload);
      }
      resetGalleryForm();
      setShowAddGallery(false);
      await loadCMSData();
    } catch (err) {
      alert("Failed to save client gallery. Please check inputs.");
    }
  };

  const handleEditGallery = (g: any) => {
    setGalleryForm({
      clientName: g.clientName || "",
      eventTitle: g.eventTitle || "",
      slug: g.slug || "",
      passcode: g.passcode || "",
      eventDate: g.eventDate || "",
      location: g.location || "",
      coverImage: g.coverImage || "",
      images: g.images || [],
      instructions: g.instructions || "Please review the photos and tap the heart icon on your favorite shots for album selection.",
      allowDownload: g.allowDownload !== false,
      watermarkEnabled: g.watermarkEnabled === true,
      deadline: g.deadline || ""
    });
    setEditingGalleryId(g.id);
    setShowAddGallery(true);
  };

  const handleDeleteGallery = async (id: string) => {
    if (confirm("Are you sure you want to delete this secret client gallery?")) {
      try {
        await deleteClientGallery(id);
        await loadCMSData();
      } catch (e) {
        alert("Failed to delete gallery.");
      }
    }
  };

  const handleCopyGalleryLink = (g: any) => {
    const fullUrl = `${window.location.origin}/client-portal/${g.slug}`;
    const textToCopy = `Hello ${g.clientName}! Here is your private photoshoot proofing gallery:\nLink: ${fullUrl}\nSecret Passcode: ${g.passcode}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedSlug(g.slug);
    setTimeout(() => setCopiedSlug(null), 3000);
  };

  // Form states
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showAdminGemini, setShowAdminGemini] = useState(false);

  // New Project Form Data
  const [formData, setFormData] = useState({
    title: "",
    folderName: "",
    folderThumbnail: "",
    photoTitle: "",
    slug: "",
    description: "",
    category: "Photography",
    subcategory: "",
    thumbnail: "",
    images: "",
    video: "",
    beforeImage: "",
    afterImage: "",
    showThumbnailInDetail: false,
    tags: "",
    tools: "",
    camera: "",
    lens: "",
    editingSoftware: "",
    year: 2026,
    location: "",
    featured: false,
    published: true,
  });

  // Category Form & Edit States
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState("");
  const [editCatDesc, setEditCatDesc] = useState("");

  // New Testimonial Form
  const [newTestName, setNewTestName] = useState("");
  const [newTestRole, setNewTestRole] = useState("");
  const [newTestMsg, setNewTestMsg] = useState("");

  // Settings Form Data
  const [settingsForm, setSettingsForm] = useState({
    title: "FrameKatha",
    tagline: "Every Frame Tells a Story.",
    aboutText: "FrameKatha is an AI-powered creative portfolio platform showcasing photography, digital art, color grading, and visual storytelling.",
    socialLinks: {
      instagram: "https://instagram.com/framekatha",
      github: "https://github.com/framekatha",
      linkedin: "https://linkedin.com/in/framekatha",
      youtube: "https://youtube.com/@framekatha",
      email: "hello@framekatha.com"
    },
    maintenanceMode: false,
    maintenanceMessage: "We're sprinkling some magic on FrameKatha ✨\nOur team is working hard to bring you an even better experience.\nWe'll be back shortly — thank you for your patience! 🚀",
    showcaseVideo: "/videos/reel-1.mp4",
    showcaseVideoTitle: "Cinematic Visual Showreel",
    showcaseVideoSubtitle: "4K 60FPS Video Production, Visual Effects & Color Grading",
    showcaseVideoEnabled: true,
    showcaseVideos: [
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
    ] as any[]
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState(false);

  // Video Reel addition and editing state in settings
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoSubtitle, setNewVideoSubtitle] = useState("");
  const [newVideoTag, setNewVideoTag] = useState("");

  const [editingVideoIndex, setEditingVideoIndex] = useState<number | null>(null);
  const [editingVideoForm, setEditingVideoForm] = useState<{
    id: string;
    url: string;
    title: string;
    subtitle: string;
    tag: string;
  } | null>(null);

  const handleStartEditVideo = (index: number) => {
    const v = (settingsForm.showcaseVideos || [])[index];
    if (!v) return;
    setEditingVideoIndex(index);
    setEditingVideoForm({
      id: v.id || "vid-" + index,
      url: v.url || "",
      title: v.title || "",
      subtitle: v.subtitle || "",
      tag: v.tag || ""
    });
  };

  const handleSaveEditedVideo = () => {
    if (editingVideoIndex === null || !editingVideoForm) return;
    if (!editingVideoForm.url.trim()) {
      alert("Please enter a Video URL or upload a video file.");
      return;
    }
    const updatedList = [...(settingsForm.showcaseVideos || [])];
    updatedList[editingVideoIndex] = {
      ...updatedList[editingVideoIndex],
      url: editingVideoForm.url.trim(),
      title: editingVideoForm.title.trim() || "Cinematic Video",
      subtitle: editingVideoForm.subtitle.trim() || "4K Production",
      tag: editingVideoForm.tag.trim() || "Showreel"
    };
    setSettingsForm((prev) => ({
      ...prev,
      showcaseVideos: updatedList
    }));
    setEditingVideoIndex(null);
    setEditingVideoForm(null);
  };

  const handleCancelEditVideo = () => {
    setEditingVideoIndex(null);
    setEditingVideoForm(null);
  };

  const handleAddVideoToReel = () => {
    if (!newVideoUrl.trim()) {
      alert("Please enter a Video URL or upload a video file.");
      return;
    }
    const newVideo = {
      id: "vid-" + Date.now(),
      url: newVideoUrl.trim(),
      title: newVideoTitle.trim() || "Cinematic Shot",
      subtitle: newVideoSubtitle.trim() || "4K Production",
      tag: newVideoTag.trim() || "Cinematic"
    };
    setSettingsForm((prev) => ({
      ...prev,
      showcaseVideos: [...(prev.showcaseVideos || []), newVideo],
      showcaseVideoEnabled: true
    }));
    setNewVideoUrl("");
    setNewVideoTitle("");
    setNewVideoSubtitle("");
    setNewVideoTag("");
  };

  const handleRemoveVideoFromReel = (index: number) => {
    setSettingsForm((prev) => ({
      ...prev,
      showcaseVideos: (prev.showcaseVideos || []).filter((_, i) => i !== index)
    }));
    if (editingVideoIndex === index) {
      setEditingVideoIndex(null);
      setEditingVideoForm(null);
    }
  };

  const handleMoveVideoReel = (index: number, direction: -1 | 1) => {
    const list = [...(settingsForm.showcaseVideos || [])];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    setSettingsForm((prev) => ({ ...prev, showcaseVideos: list }));
    if (editingVideoIndex !== null) {
      setEditingVideoIndex(null);
      setEditingVideoForm(null);
    }
  };

  const handleAddPresetVideoToReel = (preset: { url: string; title: string; subtitle: string; tag: string }) => {
    const newVideo = {
      id: "vid-" + Date.now(),
      ...preset
    };
    setSettingsForm((prev) => ({
      ...prev,
      showcaseVideos: [...(prev.showcaseVideos || []), newVideo],
      showcaseVideoEnabled: true
    }));
  };

  useEffect(() => {
    loadCMSData();
  }, []);

  // Real-time Live Analytics Polling (Updates every 5 seconds when on Analytics tab)
  useEffect(() => {
    if (activeTab === "analytics") {
      const interval = setInterval(async () => {
        try {
          const freshAnalytics = await fetchAnalytics();
          setAnalytics(freshAnalytics);
        } catch (e) {
          console.error("Live analytics poll error:", e);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  async function loadCMSData() {
    setLoading(true);
    try {
      const [anData, projData, catData, testData, msgData, settData, clientData] = await Promise.all([
        fetchAnalytics(),
        fetchAllProjectsCMS(),
        fetchCategories(),
        fetchTestimonials(),
        fetchMessages(),
        fetchSiteSettings(),
        fetchClientGalleries()
      ]);
      setAnalytics(anData);
      setProjects(projData && projData.length > 0 ? projData : DEFAULT_PROJECTS);
      setCategories(catData && catData.length > 0 ? catData : DEFAULT_CATEGORIES);
      setTestimonials(testData && testData.length > 0 ? testData : DEFAULT_TESTIMONIALS);
      setMessages(msgData || []);
      setClientGalleries(clientData && clientData.length > 0 ? clientData : DEFAULT_CLIENT_GALLERIES);
      if (settData) {
        setSiteSettings(settData);
        setSettingsForm({
          title: settData.title || "FrameKatha",
          tagline: settData.tagline || "Every Frame Tells a Story.",
          aboutText: settData.aboutText || "",
          socialLinks: settData.socialLinks || {
            instagram: "",
            github: "",
            linkedin: "",
            youtube: "",
            email: ""
          },
          maintenanceMode: settData.maintenanceMode ?? false,
          maintenanceMessage: settData.maintenanceMessage || "We're sprinkling some magic on FrameKatha ✨\nOur team is working hard to bring you an even better experience.\nWe'll be back shortly — thank you for your patience! 🚀",
          showcaseVideo: settData.showcaseVideo ?? "/videos/reel-1.mp4",
          showcaseVideoTitle: settData.showcaseVideoTitle || "Cinematic Visual Showreel",
          showcaseVideoSubtitle: settData.showcaseVideoSubtitle || "4K 60FPS Video Production, Visual Effects & Color Grading",
          showcaseVideoEnabled: settData.showcaseVideoEnabled !== false,
          showcaseVideos: settData.showcaseVideos && settData.showcaseVideos.length > 0 ? settData.showcaseVideos : [
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
          ]
        });
      }
    } catch (e) {
      console.error("Failed to load CMS data:", e);
    } finally {
      setLoading(false);
    }
  }

  // Toggle Project Visibility (Public <-> Private)
  const handleTogglePublish = async (p: any) => {
    const nextPublished = !(p.published !== false);
    try {
      await updateProject(p.id, { published: nextPublished });
      setProjects((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, published: nextPublished } : item))
      );
    } catch (err) {
      console.error("Failed to toggle project visibility:", err);
    }
  };

  // Quick Toggle Maintenance Mode from Header
  const handleQuickToggleMaintenance = async () => {
    const nextMode = !settingsForm.maintenanceMode;
    const updated = { ...settingsForm, maintenanceMode: nextMode };
    setSettingsForm(updated);
    try {
      await updateSiteSettings(updated);
      setSiteSettings(updated);
    } catch (err) {
      console.error("Failed to update maintenance mode:", err);
    }
  };

  // Save Settings from Settings Tab
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const updated = await updateSiteSettings(settingsForm);
      setSiteSettings(updated);
      setSettingsSavedSuccess(true);
      setTimeout(() => setSettingsSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save settings:", err);
      alert("Failed to save settings. Please try again.");
    } finally {
      setSavingSettings(false);
    }
  };

  // Handle AI Metadata Suggestion
  const handleAISuggestion = async () => {
    if (!formData.title) {
      alert("Please enter a project title first!");
      return;
    }
    setAiSuggesting(true);
    try {
      const suggested = await aiSuggestMetadata({
        title: formData.title,
        description: formData.description
      });

      setFormData((prev) => ({
        ...prev,
        category: suggested.category || prev.category,
        subcategory: suggested.subcategory || prev.subcategory,
        tags: suggested.tags ? suggested.tags.join(", ") : prev.tags,
        tools: suggested.tools ? suggested.tools.join(", ") : prev.tools,
        camera: suggested.camera || prev.camera,
        lens: suggested.lens || prev.lens,
        editingSoftware: suggested.editingSoftware || prev.editingSoftware,
        description: suggested.description || prev.description
      }));
    } catch (e) {
      console.error("AI metadata error:", e);
    } finally {
      setAiSuggesting(false);
    }
  };

  // Submit Add / Edit Project
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const firstGalleryImage = formData.images
      ? formData.images.split(",").map((s) => s.trim()).filter(Boolean)[0]
      : "";
    const computedThumbnail =
      formData.thumbnail ||
      formData.afterImage ||
      formData.beforeImage ||
      firstGalleryImage ||
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800";

    const computedImages = formData.images
      ? formData.images.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const finalFolderName = formData.folderName.trim() || formData.title.trim();
    const finalFolderThumbnail = formData.folderThumbnail.trim() || computedThumbnail;
    const finalPhotoTitle = formData.photoTitle.trim();
    const payload = {
      ...formData,
      folderName: finalFolderName,
      folderThumbnail: finalFolderThumbnail,
      photoTitle: finalPhotoTitle,
      year: parseInt(String(formData.year)) || 2026,
      thumbnail: computedThumbnail,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      images: computedImages,
      tags: formData.tags ? formData.tags.split(",").map((s) => s.trim()).filter(Boolean) : [],
      tools: formData.tools ? formData.tools.split(",").map((s) => s.trim()).filter(Boolean) : [],
    };

    try {
      if (editingProjectId) {
        await updateProject(editingProjectId, payload);
      } else {
        await createProject(payload);
      }
      setShowAddProject(false);
      setEditingProjectId(null);
      resetForm();
      loadCMSData();
    } catch (err: any) {
      console.error("Save project failed:", err);
      alert(`Failed to save project: ${err.message || "Unknown error"}`);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      folderName: "",
      folderThumbnail: "",
      photoTitle: "",
      slug: "",
      description: "",
      category: "Photography",
      subcategory: "",
      thumbnail: "",
      images: "",
      video: "",
      beforeImage: "",
      afterImage: "",
      showThumbnailInDetail: false,
      tags: "",
      tools: "",
      camera: "",
      lens: "",
      editingSoftware: "",
      year: 2026,
      location: "",
      featured: false,
      published: true,
    });
  };

  const handleEditClick = (p: any) => {
    setEditingProjectId(p.id);
    setFormData({
      title: p.title || "",
      folderName: p.folderName || "",
      folderThumbnail: p.folderThumbnail || "",
      photoTitle: p.photoTitle || "",
      slug: p.slug || "",
      description: p.description || "",
      category: p.category || "Photography",
      subcategory: p.subcategory || "",
      thumbnail: p.thumbnail || "",
      images: p.images ? p.images.join(", ") : "",
      video: p.video || "",
      beforeImage: p.beforeImage || "",
      afterImage: p.afterImage || "",
      showThumbnailInDetail: p.showThumbnailInDetail || false,
      tags: p.tags ? p.tags.join(", ") : "",
      tools: p.tools ? p.tools.join(", ") : "",
      camera: p.camera || "",
      lens: p.lens || "",
      editingSoftware: p.editingSoftware || "",
      year: p.year || 2026,
      location: p.location || "",
      featured: p.featured || false,
      published: p.published !== undefined ? p.published : true,
    });
    setShowAddProject(true);
  };

  const handleDeleteProject = async (id: string) => {
    // 1. Instant optimistic deletion from UI
    setProjects((prev) => prev.filter((p) => p.id !== id));
    try {
      await deleteProject(id);
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      const newCat = await createCategory({
        name: newCatName.trim(),
        slug: newCatName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: newCatDesc.trim()
      });
      setCategories((prev) => [...prev, newCat]);
      setNewCatName("");
      setNewCatDesc("");
    } catch (err) {
      console.error("Failed to add category:", err);
    }
  };

  const handleStartEditCategory = (cat: any) => {
    setEditingCatId(cat.id);
    setEditCatName(cat.name || "");
    setEditCatDesc(cat.description || "");
  };

  const handleSaveCategoryEdit = async (id: string) => {
    if (!editCatName.trim()) return;
    const updated = {
      name: editCatName.trim(),
      slug: editCatName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: editCatDesc.trim()
    };
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    setEditingCatId(null);
    try {
      await updateCategory(id, updated);
    } catch (err) {
      console.error("Failed to update category:", err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    try {
      await deleteCategory(id);
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestName || !newTestMsg) return;
    await createTestimonial({
      name: newTestName,
      role: newTestRole || "Client",
      message: newTestMsg,
      rating: 5,
      active: true
    });
    setNewTestName("");
    setNewTestRole("");
    setNewTestMsg("");
    loadCMSData();
  };

  return (
    <SiteLayout>
      <section className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header Bar */}
        <div className="glass-strong rounded-3xl p-6 border border-purple-500/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">Content Management System</span>
            <h1 className="text-3xl font-bold font-display mt-1">FrameKatha <span className="gradient-text">CMS Dashboard</span></h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Maintenance Mode Status & Toggle */}
            <button
              onClick={handleQuickToggleMaintenance}
              title={
                settingsForm.maintenanceMode
                  ? "Maintenance Mode is ACTIVE. Visitors see maintenance page. Click to make Live."
                  : "Website is LIVE to all visitors. Click to activate Maintenance Mode."
              }
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                settingsForm.maintenanceMode
                  ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
              }`}
            >
              <Wrench className="size-3.5" />
              {settingsForm.maintenanceMode ? "🔴 Maintenance ON" : "🟢 Site Live"}
            </button>

            <button
              onClick={() => setShowAdminGemini(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:opacity-90 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)] border border-white/20"
              title="Open Gemini AI Assistant"
            >
              <Sparkles className="size-3.5 text-yellow-300 animate-pulse" /> Gemini AI
            </button>

            <button onClick={loadCMSData} className="btn-ghost-neon text-xs px-3.5 py-2 flex items-center gap-2">
              <RefreshCw className="size-3.5" /> Refresh
            </button>
            <button
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/30 text-rose-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
              title="Lock admin panel"
            >
              <LogOut className="size-3.5" /> Lock
            </button>
          </div>
        </div>


        {/* Tab Selection Navigation */}
        <div className="flex flex-nowrap sm:flex-wrap items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto no-scrollbar">
          {[
            { id: "projects", label: `📁 Projects & Albums (${projects.length})`, icon: FolderPlus },
            { id: "analytics", label: "📊 Analytics & Views", icon: BarChart3 },
            { id: "client-galleries", label: `🔒 Client Albums (${clientGalleries.length})`, icon: ShieldCheck },
            { id: "categories", label: `🏷️ Categories (${categories.length})`, icon: Layers },
            { id: "testimonials", label: `⭐ Reviews (${testimonials.length})`, icon: Star },
            { id: "messages", label: `💬 Inquiries (${messages.length})`, icon: MessageSquare },
            { id: "settings", label: "⚙️ Site Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
                }`}
              >
                <Icon className="size-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: ANALYTICS */}
        {activeTab === "analytics" && (() => {
          const overview = analytics?.overview || {
            totalProjects: projects.length || 7,
            totalViews: 885,
            featuredProjects: 4,
            mostViewedProject: { title: "Ganpati bappa morya", views: 312 }
          };
          const catViewsList = analytics?.categoryViews || [
            { category: "Photography", views: 340 },
            { category: "Photo Editing", views: 210 },
            { category: "Digital Art", views: 180 },
            { category: "Poster Design", views: 95 },
            { category: "Thumbnail Design", views: 60 }
          ];
          const timelineList = analytics?.timeline || [
            { month: "May", views: 95 },
            { month: "Jun", views: 140 },
            { month: "Jul", views: 210 },
            { month: "Aug", views: 280 },
            { month: "Sep", views: 340 },
            { month: "Oct", views: 420 }
          ];

          const maxCatViews = Math.max(1, ...catViewsList.map((cv: any) => cv.views || 0));
          const maxTimelineViews = Math.max(1, ...timelineList.map((t: any) => t.views || 0));

          return (
            <div className="space-y-8 animate-fade-in">
              {/* Real-time Indicator Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold font-display text-white">Audience & Performance Analytics</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Real-time visitor telemetry, category breakdown, and portfolio view tracking</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-sm">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Real-Time Live (Every 5s)</span>
                </div>
              </div>

              {/* Overview Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="glass-strong rounded-3xl p-6 border border-white/10 hover:border-purple-500/30 transition-colors">
                  <span className="text-xs text-slate-400 font-medium">Total Portfolio Projects</span>
                  <div className="text-3xl font-bold font-display mt-2 text-white">{overview.totalProjects}</div>
                </div>
                <div className="glass-strong rounded-3xl p-6 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                  <span className="text-xs text-slate-400 font-medium">Total Portfolio Views</span>
                  <div className="text-3xl font-bold font-display mt-2 text-cyan-400">{overview.totalViews}</div>
                </div>
                <div className="glass-strong rounded-3xl p-6 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                  <span className="text-xs text-slate-400 font-medium">Featured Showcase</span>
                  <div className="text-3xl font-bold font-display mt-2 text-purple-400">{overview.featuredProjects}</div>
                </div>
                <div className="glass-strong rounded-3xl p-6 border border-amber-500/30">
                  <span className="text-xs text-slate-400 font-medium">Most Viewed Work</span>
                  <div className="text-sm font-bold font-display mt-2 text-amber-300 truncate" title={overview.mostViewedProject?.title}>
                    {overview.mostViewedProject?.title} ({overview.mostViewedProject?.views || 0})
                  </div>
                </div>
              </div>

              {/* Visual Analytics Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Category Breakdown Bar Chart */}
                <div className="glass-strong rounded-3xl p-6 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold font-display text-white">Views by Category</h3>
                    <span className="text-[11px] text-slate-400 font-mono">Dynamic Scaling</span>
                  </div>
                  <div className="space-y-3.5">
                    {catViewsList.map((cv: any) => {
                      const widthPercent = cv.views > 0
                        ? Math.max(8, Math.round((cv.views / maxCatViews) * 100))
                        : 0;

                      return (
                        <div key={cv.category} className="space-y-1.5">
                          <div className="flex justify-between text-xs text-slate-300">
                            <span className="font-medium">{cv.category}</span>
                            <span className="font-mono text-cyan-400 font-semibold">{cv.views} Views</span>
                          </div>
                          <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                            <div
                              className="h-full bg-gradient-to-r from-purple-600 via-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                              style={{ width: `${widthPercent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Timeline Growth */}
                <div className="glass-strong rounded-3xl p-6 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold font-display text-white">Views Growth Timeline</h3>
                    <span className="text-[11px] text-slate-400 font-mono">Past 6 Months</span>
                  </div>
                  <div className="flex items-end justify-between gap-3 h-52 pt-6">
                    {timelineList.map((item: any) => {
                      const barHeight = item.views > 0
                        ? Math.max(14, Math.round((item.views / maxTimelineViews) * 100))
                        : 4;

                      return (
                        <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                          <span className="text-[10px] text-cyan-400 font-mono font-bold transition-transform group-hover:scale-110">
                            {item.views}
                          </span>
                          <div
                            className="w-full bg-gradient-to-t from-purple-600 via-purple-500 to-cyan-400 rounded-t-xl transition-all duration-500 group-hover:opacity-90 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                            style={{ height: `${barHeight}%` }}
                          />
                          <span className="text-xs text-slate-400 font-semibold mt-1">{item.month}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* TAB 2: PROJECTS MANAGEMENT */}
        {activeTab === "projects" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
                  <FolderPlus className="size-6 text-cyan-400" />
                  Media Folders &amp; Projects ({projects.length})
                </h2>
                <p className="text-xs text-slate-300">Create media albums, upload local PC folders &amp; manage multiple photo collections</p>
              </div>
              <div className="flex items-center gap-3">
                {/* View Mode Toggle: Grid Cards vs Table */}
                <div className="flex items-center rounded-xl bg-white/5 p-1 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setProjectViewMode("grid")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      projectViewMode === "grid"
                        ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <LayoutGrid className="size-3.5" /> Visual Cards
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjectViewMode("table")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      projectViewMode === "table"
                        ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <List className="size-3.5" /> Table List
                  </button>
                </div>

                <button
                  onClick={() => { resetForm(); setEditingProjectId(null); setShowAddProject(!showAddProject); }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="size-4" /> {showAddProject ? "Close Form" : "+ Create New Project / Album"}
                </button>
              </div>
            </div>

            {/* Add / Edit Form Modal */}
            {showAddProject && (
              <form onSubmit={handleProjectSubmit} className="glass-strong rounded-3xl p-4 sm:p-6 md:p-8 border border-cyan-500/40 space-y-8 shadow-2xl animate-fade-in relative">
                {/* Form Top Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/10 pb-5 gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-[10px] font-bold border border-cyan-500/30">
                        {editingProjectId ? "EDIT MODE" : "NEW PROJECT"}
                      </span>
                      <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
                        <FolderPlus className="size-6 text-cyan-400" />
                        {editingProjectId ? "Edit Media Folder / Project" : "Create New Media Folder / Album"}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Niche diye gaye <strong>6 aasan steps</strong> ko follow karein. Har field ke niche likha hai ki wo chiz website par kahan dikhegi.
                    </p>
                  </div>
                  
                  {/* AI Assistant Quick Generator */}
                  <button
                    type="button"
                    onClick={() => setShowAIModal(true)}
                    className="btn-ghost-neon text-xs px-4 py-2.5 flex items-center justify-center gap-2 border-purple-500/60 text-purple-200 hover:text-cyan-300 hover:border-cyan-400 transition-all cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.3)] bg-purple-950/40"
                  >
                    <Bot className="size-4 text-cyan-400 animate-pulse" />
                    <span className="font-semibold">✨ Suggest with AI (GPT/Gemini)</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40">1-Click Auto Fill</span>
                  </button>
                </div>

                {/* AI Creative Studio Modal (ChatGPT & Gemini Engine) */}
                <AIMetadataModal
                  isOpen={showAIModal}
                  onClose={() => setShowAIModal(false)}
                  initialTitle={formData.title}
                  initialDescription={formData.description}
                  onApply={(data) => setFormData((prev) => ({ ...prev, ...data }))}
                />

                {/* ========================================================================= */}
                {/* STEP 1: PROJECT KA NAAM & TITLE (BASIC IDENTITY) */}
                {/* ========================================================================= */}
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900/70 to-cyan-950/40 border border-purple-500/40 space-y-5 shadow-inner">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                    <div className="size-8 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 grid place-items-center font-bold text-xs font-mono shadow-md">
                      01
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <span>Step 1: Project Ka Naam &amp; Title</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-normal">Main Identity</span>
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Website par dikhne wale titles aur album tags set karein.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* 1A. Main Project Headline */}
                    <div className="space-y-1.5 p-3.5 rounded-xl bg-black/40 border border-cyan-500/30">
                      <label className="block text-xs text-cyan-300 font-bold flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <FolderOpen className="size-3.5 text-cyan-400" /> 1A. Main Project Headline *
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">Compulsory</span>
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Royal Palace Destination Wedding 2026"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-white text-xs focus:border-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-300/30"
                      />
                      <div className="p-2 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-200/90 leading-tight space-y-1">
                        <p>📌 <strong>Kahan dikhega:</strong> Portfolio page aur Home cards par sabse bada main title.</p>
                      </div>
                    </div>

                    {/* 1B. Album / Folder Tag Name */}
                    <div className="space-y-1.5 p-3.5 rounded-xl bg-black/40 border border-purple-500/30">
                      <label className="block text-xs text-purple-300 font-bold flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Folder className="size-3.5 text-purple-400" /> 1B. Album / Folder Tag Name
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">Optional</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Wedding Album, Rajasthan Tour 2026"
                        value={formData.folderName}
                        onChange={(e) => setFormData({ ...formData, folderName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-purple-500/40 text-white text-xs focus:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-300/30 placeholder:text-slate-500"
                      />
                      <div className="p-2 rounded-lg bg-purple-950/30 border border-purple-500/20 text-[11px] text-purple-200/90 leading-tight space-y-1">
                        <p>🏷️ <strong>Kahan dikhega:</strong> Card ke upar chhota folder badge bankar aayega.</p>
                      </div>
                    </div>

                    {/* 1C. Photo Sub-Title */}
                    <div className="space-y-1.5 p-3.5 rounded-xl bg-black/40 border border-emerald-500/30">
                      <label className="block text-xs text-emerald-300 font-bold flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Camera className="size-3.5 text-emerald-400" /> 1C. Photo Subtitle / Headline
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">Optional</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sunset Golden Hour Drone Shot"
                        value={formData.photoTitle}
                        onChange={(e) => setFormData({ ...formData, photoTitle: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-emerald-500/40 text-white text-xs focus:border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-300/30 placeholder:text-slate-500"
                      />
                      <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-emerald-200/90 leading-tight space-y-1">
                        <p>📷 <strong>Kahan dikhega:</strong> Agar kisi specific photo ka alag subtitle dikhana ho.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* STEP 2: CATEGORY & STORY (KAHANI AUR GENRE) */}
                {/* ========================================================================= */}
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900/80 via-slate-900/90 to-purple-950/30 border border-white/10 space-y-5 shadow-inner">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                    <div className="size-8 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 grid place-items-center font-bold text-xs font-mono shadow-md">
                      02
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <span>Step 2: Category &amp; Album Story (Kahani)</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-normal">Filters &amp; Details</span>
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Category chunein taaki visitors filter kar sakein, aur album ki kahani likhein.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* 2A. Category Selector */}
                    <div className="space-y-1.5">
                      <label className="block text-xs text-slate-200 font-bold flex items-center justify-between">
                        <span>2A. Main Category *</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">Compulsory</span>
                      </label>
                      <select
                        value={formData.category || "Photography"}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-white text-xs focus:border-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-300/30 font-medium cursor-pointer"
                      >
                        {(categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES).map((c) => (
                          <option key={c.id || c.name} value={c.name} className="bg-slate-900 text-white py-1">
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <span className="text-[11px] text-slate-400 block">
                        📁 <strong>Website par:</strong> Visitors is category filter button par click karke aapke projects dekhenge.
                      </span>
                    </div>

                    {/* 2B. Subcategory / Genre */}
                    <div className="space-y-1.5">
                      <label className="block text-xs text-slate-200 font-bold flex items-center justify-between">
                        <span>2B. Subcategory / Genre (Optional)</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">Optional</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Architecture, Candid, Night Shoot, 3D Art"
                        value={formData.subcategory}
                        onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-cyan-300 focus:outline-none"
                      />
                      <span className="text-[11px] text-slate-400 block">
                        💡 <strong>Example:</strong> Candid Wedding, Drone View, Pre-Wedding, Street.
                      </span>
                    </div>
                  </div>

                  {/* 2C. Description / Story */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs text-slate-200 font-bold">
                        2C. Folder Story &amp; Description (Album Ki Poori Kahani)
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowAIModal(true)}
                        className="text-[11px] text-purple-300 hover:text-cyan-300 flex items-center gap-1 font-semibold cursor-pointer underline"
                      >
                        <Bot className="size-3 text-cyan-400" /> AI se description likhwayein
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      placeholder="Describe the story, mood, lighting, or moments captured in this project..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-cyan-300 focus:outline-none leading-relaxed"
                    />
                    <span className="text-[11px] text-slate-400 block">
                      📖 <strong>Website par:</strong> Jab visitor is project ko open karega, tab yeh kahani/story dikhegi.
                    </span>
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* STEP 3: DEDICATED THUMBNAILS & VIDEO (BAHAR KA AUR ANDAR KA COVER) */}
                {/* ========================================================================= */}
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-purple-950/40 border border-white/10 space-y-5 shadow-inner">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                    <div className="size-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 grid place-items-center font-bold text-xs font-mono shadow-md">
                      03
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <span>Step 3: Cover Photos &amp; Video File (Thumbnails)</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-normal">Visual Covers</span>
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Bahar ka Main Thumbnail aur Album ke andar ka Cover dono alag-alag set karein.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* 3A. Bahar ka Main Thumbnail */}
                    <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 space-y-3 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-xs">
                          <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
                          <span>3A. Bahar Ka Main Cover *</span>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">Compulsory</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-black/40 border border-cyan-500/20 text-[11px] text-slate-300 leading-tight">
                        🌟 <strong>Yeh kahan dikhega:</strong> Website ke main <strong>/portfolio</strong> page aur <strong>Home Page</strong> cards par bahar dikhega.
                      </div>
                      <FileUploadPicker
                        label="Upload Bahar Ka Main Thumbnail"
                        value={formData.thumbnail}
                        onChange={(url) => setFormData({ ...formData, thumbnail: url })}
                        hint="Front cover image for public card display"
                      />
                    </div>

                    {/* 3B. Folder / Album Ke Andar Ka Thumbnail */}
                    <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40 space-y-3 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-purple-300 font-bold text-xs">
                          <span className="size-2 rounded-full bg-purple-400" />
                          <span>3B. Album Ke Andar Ka Cover</span>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">Optional</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-black/40 border border-purple-500/20 text-[11px] text-slate-300 leading-tight">
                        📁 <strong>Yeh kahan dikhega:</strong> Jab koi project open karega, tab <strong>Album Folder Header</strong> me jo alag photo dikhana ho. (Khali chhodenge toh Bahar ka thumbnail hi chalega).
                      </div>
                      <FileUploadPicker
                        label="Upload Folder Ka Cover Thumbnail"
                        value={formData.folderThumbnail}
                        onChange={(url) => setFormData({ ...formData, folderThumbnail: url })}
                        hint="Inside album banner / folder card photo"
                      />
                    </div>

                    {/* 3C. Video Clip Showcase */}
                    <div className="p-4 rounded-xl bg-slate-950/50 border border-white/15 space-y-3 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-slate-200 font-bold text-xs">
                          <span className="size-2 rounded-full bg-emerald-400" />
                          <span>3C. Video Clip / Reel</span>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">Optional</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-[11px] text-slate-300 leading-tight">
                        🎥 <strong>Yeh kahan dikhega:</strong> Cinematic 4K Reel ya video clip (MP4 / WebM).
                      </div>
                      <FileUploadPicker
                        isVideo
                        accept="video/*"
                        label="Upload Video File (MP4/WebM)"
                        value={formData.video}
                        onChange={(url) => setFormData({ ...formData, video: url })}
                        hint="Direct video upload from computer or phone"
                      />
                    </div>
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* STEP 4: UPLOAD ALBUM PHOTOS (PHOTOS DALNE KE 2 AASAN TARIKE) */}
                {/* ========================================================================= */}
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-950/30 via-slate-900/80 to-cyan-950/30 border border-cyan-500/30 space-y-5 shadow-inner">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                    <div className="size-8 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 grid place-items-center font-bold text-xs font-mono shadow-md">
                      04
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <span>Step 4: Upload Album Photos (Gallery Photos Dalein)</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-normal">2 Easy Upload Options</span>
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Is album ke andar jitni bhi photos dikhani hain, unhe <strong>Option 4A</strong> (Phone &amp; PC) ya <strong>Option 4B</strong> (PC Folder) se add karein:
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* 4A. Dedicated PHOTOS Uploader (Phone & PC) */}
                    <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 space-y-3 shadow-lg">
                      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="size-7 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 grid place-items-center">
                            <FileImage className="size-4" />
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-white">
                              Option 4A: Phone Gallery / PC Photo Files
                            </h5>
                            <span className="text-[10px] text-cyan-300 font-medium">
                              📱 Phone &amp; 💻 Computer Dono Par Kaam Karta Hai
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                          Recommended
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-tight">
                        Apne phone ki gallery ya computer storage se 1 ya multiple photo files choose karein.
                      </p>

                      <FileUploadPicker
                        label="Select Photo Files (Phone / PC)"
                        photosOnly
                        multiple
                        hideThumbnails
                        value=""
                        onChange={(url) => {
                          setFormData((prev) => {
                            const existing = prev.images ? prev.images.split(",").map((s) => s.trim()).filter(Boolean) : [];
                            const combined = Array.from(new Set([...existing, url]));
                            return { ...prev, images: combined.join(", ") };
                          });
                        }}
                        onMultipleChange={(urls) => {
                          setFormData((prev) => {
                            const existing = prev.images ? prev.images.split(",").map((s) => s.trim()).filter(Boolean) : [];
                            const combined = Array.from(new Set([...existing, ...urls]));
                            return { ...prev, images: combined.join(", ") };
                          });
                        }}
                        hint="Tap to choose multiple photos from phone gallery or PC disk."
                      />
                    </div>

                    {/* 4B. Dedicated FOLDER Uploader (PC Folder) */}
                    <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/40 space-y-3 shadow-lg">
                      <div className="flex items-center justify-between border-b border-purple-500/20 pb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="size-7 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 grid place-items-center">
                            <FolderUp className="size-4" />
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-white">
                              Option 4B: Upload Entire Folder from PC
                            </h5>
                            <span className="text-[10px] text-purple-300 font-medium">
                              💻 Computer / Laptop Only Mode
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                          PC Folder
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-tight">
                        Computer se direct pura folder choose karein. Us folder ki saari photos ek sath upload ho jayengi.
                      </p>

                      <FileUploadPicker
                        label="Select Local PC Folder"
                        folderOnly
                        multiple
                        hideThumbnails
                        value=""
                        onChange={(url) => {
                          setFormData((prev) => {
                            const existing = prev.images ? prev.images.split(",").map((s) => s.trim()).filter(Boolean) : [];
                            const combined = Array.from(new Set([...existing, url]));
                            return { ...prev, images: combined.join(", ") };
                          });
                        }}
                        onMultipleChange={(urls) => {
                          setFormData((prev) => {
                            const existing = prev.images ? prev.images.split(",").map((s) => s.trim()).filter(Boolean) : [];
                            const combined = Array.from(new Set([...existing, ...urls]));
                            return { ...prev, images: combined.join(", ") };
                          });
                        }}
                        onFolderNameDetected={(detectedName) => {
                          setFormData((prev) => ({
                            ...prev,
                            folderName: prev.folderName || detectedName,
                            title: prev.title || detectedName,
                          }));
                        }}
                        hint="PC folder selection picker. Auto-detects album title."
                      />
                    </div>
                  </div>

                  {/* 4C. Uploaded Album Photos Showcase Grid */}
                  {formData.images && formData.images.split(",").map((s) => s.trim()).filter(Boolean).length > 0 && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-emerald-500/30 space-y-3 shadow-xl">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="size-4 text-emerald-400 animate-pulse" />
                          <span className="text-xs font-bold text-white">
                            ✅ Uploaded Album Photos (
                            <span className="text-cyan-400 font-mono font-bold">
                              {formData.images.split(",").map((s) => s.trim()).filter(Boolean).length} Photos
                            </span>{" "}
                            Ready in this Album)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, images: "" })}
                          className="text-[11px] text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                        >
                          <Trash2 className="size-3" /> Clear All Photos
                        </button>
                      </div>

                      {/* Thumbnails grid */}
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 max-h-72 overflow-y-auto p-1">
                        {formData.images
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                          .map((url, idx) => (
                            <div
                              key={idx}
                              className="relative group aspect-square rounded-xl overflow-hidden bg-slate-900 border border-cyan-500/40 shadow-md"
                            >
                              <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                              <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[8px] font-mono text-cyan-300 pointer-events-none">
                                #{idx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const currentList = formData.images.split(",").map((s) => s.trim()).filter(Boolean);
                                  const updated = currentList.filter((_, i) => i !== idx);
                                  setFormData({ ...formData, images: updated.join(", ") });
                                }}
                                className="absolute top-1 right-1 p-1 rounded-full bg-red-600/90 text-white opacity-90 hover:opacity-100 hover:scale-110 transition-all cursor-pointer shadow-md"
                                title="Remove photo"
                              >
                                <X className="size-3" />
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ========================================================================= */}
                {/* STEP 5: INTERACTIVE BEFORE / AFTER COLOR GRADING (OPTIONAL) */}
                {/* ========================================================================= */}
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 via-purple-950/20 to-slate-900/90 border border-purple-500/30 space-y-4 shadow-inner">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                    <div className="size-8 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 grid place-items-center font-bold text-xs font-mono shadow-md">
                      05
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <span>Step 5: Interactive Before / After Comparison (Optional)</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-normal">Color Grading</span>
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Camera ki unedited RAW photo aur final edited photo ka sliding comparison slider dikhane ke liye:
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5 p-3 rounded-xl bg-black/40 border border-white/10">
                      <div className="text-[11px] text-slate-300 font-semibold mb-1">
                        📷 <strong>5A. Before Image:</strong> Camera se aayi original unedited RAW photo.
                      </div>
                      <FileUploadPicker
                        label="Upload Before Image (Original RAW)"
                        value={formData.beforeImage}
                        onChange={(url) => setFormData({ ...formData, beforeImage: url })}
                        hint="Unedited original photo from camera / PC"
                      />
                    </div>

                    <div className="space-y-1.5 p-3 rounded-xl bg-black/40 border border-white/10">
                      <div className="text-[11px] text-purple-300 font-semibold mb-1">
                        ✨ <strong>5B. After Image:</strong> Lightroom/Photoshop se final edited photo.
                      </div>
                      <FileUploadPicker
                        label="Upload After Image (FrameKatha Color Edit)"
                        value={formData.afterImage}
                        onChange={(url) => setFormData({ ...formData, afterImage: url })}
                        hint="Final color graded masterpiece"
                      />
                    </div>
                  </div>

                  {/* Live Auto-Adapting Before & After Preview in Admin */}
                  {formData.beforeImage && formData.afterImage && (
                    <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/30 space-y-2 animate-fade-in">
                      <span className="text-[10px] text-cyan-300 font-mono uppercase tracking-wider block">
                        Live Auto-Adapting Before &amp; After Preview (Exact Image Ratio):
                      </span>
                      <BeforeAfterSlider
                        beforeImage={formData.beforeImage}
                        afterImage={formData.afterImage}
                        beforeLabel="Original RAW"
                        afterLabel="Color Graded"
                      />
                    </div>
                  )}
                </div>

                {/* ========================================================================= */}
                {/* STEP 6: EXTRA DETAILS & PUBLISH SETTINGS */}
                {/* ========================================================================= */}
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900/80 via-slate-900/90 to-cyan-950/20 border border-white/10 space-y-5 shadow-inner">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                    <div className="size-8 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 grid place-items-center font-bold text-xs font-mono shadow-md">
                      06
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <span>Step 6: Extra Details &amp; Visibility Settings</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-normal">Publishing</span>
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Tags, Camera equipment aur website par project live rakhna hai ya draft me.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs text-slate-300 font-semibold">6A. Search Tags (Comma separated)</label>
                      <input
                        type="text"
                        placeholder="Wedding, Night, Candid, Royal"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-cyan-300 focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-400">Search bar ke keywords</span>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs text-slate-300 font-semibold">6B. Camera &amp; Editing Software</label>
                      <input
                        type="text"
                        placeholder="Sony A7IV, Lightroom, Photoshop"
                        value={formData.tools}
                        onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-cyan-300 focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-400">Gear &amp; tools used</span>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs text-slate-300 font-semibold">6C. Year &amp; Location</label>
                      <input
                        type="text"
                        placeholder="2026, Udaipur Palace, Rajasthan"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-cyan-300 focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-400">Shoot year &amp; city</span>
                    </div>
                  </div>

                  {/* Visibility & Featured options */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-white/10">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs text-slate-200 font-bold">Visibility (Website Par Dikhana Hai?):</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, published: true })}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                          formData.published !== false
                            ? "bg-emerald-500/25 text-emerald-300 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                            : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                        }`}
                      >
                        <Globe className="size-3.5" /> 🌐 Public (Sabhi Visitors Ko Dikhega)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, published: false })}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                          formData.published === false
                            ? "bg-amber-500/25 text-amber-300 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                            : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                        }`}
                      >
                        <EyeOff className="size-3.5" /> 🔒 Private (Draft - Sirf Admin Ko Dikhega)
                      </button>
                    </div>

                    <label className="flex items-center gap-2.5 text-xs text-slate-200 font-semibold cursor-pointer p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="size-4 accent-purple-500 cursor-pointer"
                      />
                      <span>⭐ Mark as Featured Work (Top Highlights)</span>
                    </label>
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* BOTTOM ACTION BUTTONS (DESKTOP & MOBILE STICKY) */}
                {/* ========================================================================= */}
                <div className="sticky bottom-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0d0d16]/95 border border-cyan-500/40 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
                  <div className="text-xs text-slate-300 hidden sm:block">
                    💾 Sabhi details bhar lene ke baad niche <strong>Save Project</strong> button dabayein.
                  </div>
                  <div className="flex w-full sm:w-auto items-center gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => { setShowAddProject(false); setEditingProjectId(null); }}
                      className="flex-1 sm:flex-none px-5 py-3 rounded-xl border border-white/20 hover:border-white/40 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer text-center"
                    >
                      ❌ Cancel (Wapas Jayein)
                    </button>
                    <button
                      type="submit"
                      className="flex-1 sm:flex-none px-7 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-cyan-500 to-emerald-400 hover:from-purple-500 hover:to-emerald-300 text-white font-bold text-xs shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Save className="size-4" />
                      <span>{editingProjectId ? "Update & Save Changes" : "💾 Save Project (Project Save Karein)"}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Projects Content: Grid Mode vs Table Mode */}
            {projectViewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className="glass-strong rounded-3xl overflow-hidden border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-xl bg-slate-900/60"
                  >
                    {/* Top Thumbnail Section */}
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                      <img
                        src={p.thumbnail || "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800"}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/60" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex justify-between items-center gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 backdrop-blur-md text-[10px] font-bold text-cyan-300 border border-cyan-500/40">
                            {p.category}
                          </span>
                          {p.folderName && (
                            <span className="px-2.5 py-0.5 rounded-full bg-purple-950/85 backdrop-blur-md text-[10px] font-semibold text-purple-200 border border-purple-500/40 flex items-center gap-1">
                              <Folder className="size-2.5 text-purple-400" />
                              <span className="truncate max-w-[100px]">{p.folderName}</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
                            📁 {p.images?.length || 1} {p.video ? "+ 🎥" : ""}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Image Stats */}
                      <div className="absolute bottom-2 left-3 right-3 flex justify-between items-center text-[10px] text-slate-300">
                        <span className="flex items-center gap-1 text-cyan-300 font-mono">
                          <Eye className="size-3" /> {p.views || 0} Views
                        </span>
                        <span className="font-mono text-slate-400">
                          {p.year || 2026} • {p.location || "Studio"}
                        </span>
                      </div>
                    </div>

                    {/* Card Body Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors line-clamp-1">
                              {p.title}
                            </h3>
                            {p.photoTitle && p.photoTitle !== p.title && (
                              <p className="text-xs text-cyan-400/90 font-medium flex items-center gap-1 mt-0.5">
                                <Camera className="size-3 text-cyan-400 shrink-0" />
                                <span className="truncate">{p.photoTitle}</span>
                              </p>
                            )}
                          </div>

                          {/* Public / Private Badge */}
                          <button
                            type="button"
                            onClick={() => handleTogglePublish(p)}
                            title={
                              p.published !== false
                                ? "Click to make Private"
                                : "Click to make Public"
                            }
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer border shrink-0 ${
                              p.published !== false
                                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 shadow-sm"
                                : "bg-amber-500/15 border-amber-500/30 text-amber-400 hover:bg-amber-500/25"
                            }`}
                          >
                            {p.published !== false ? (
                              <>
                                <Globe className="size-3" /> Public
                              </>
                            ) : (
                              <>
                                <EyeOff className="size-3" /> Private
                              </>
                            )}
                          </button>
                        </div>

                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {p.description || "No description provided."}
                        </p>

                        {/* Tags */}
                        {p.tags && p.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {p.tags.slice(0, 3).map((t: string) => (
                              <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300">
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Bottom Action Bar: Edit, Delete, View Live */}
                      <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                        <a
                          href={`/portfolio/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all border border-white/10"
                          title="Open live portfolio page in new tab"
                        >
                          <Eye className="size-3.5 text-cyan-400" />
                          <span>Live View</span>
                        </a>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditClick(p)}
                            className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-105"
                          >
                            <Edit className="size-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProject(p.id)}
                            className="p-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-all cursor-pointer hover:scale-105"
                            title="Delete this project"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Projects List Table */
              <div className="glass-strong rounded-3xl p-6 border border-white/10 overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="border-b border-white/10 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="pb-3">Folder Cover</th>
                      <th className="pb-3">Folder &amp; Title</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Media Inside</th>
                      <th className="pb-3">Uploaded Date</th>
                      <th className="pb-3">Views</th>
                      <th className="pb-3">Visibility</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {projects.map((p) => (
                      <tr key={p.id} className="hover:bg-white/2 transition-colors">
                        <td className="py-3">
                          <div className="relative size-12 rounded-xl overflow-hidden bg-slate-900 border border-white/10 shrink-0">
                            <img src={p.thumbnail} alt={p.title} className="size-full object-cover" />
                            {p.folderThumbnail && p.folderThumbnail !== p.thumbnail && (
                              <span className="absolute bottom-0 right-0 p-0.5 bg-purple-600/90 rounded-tl text-[8px] text-white" title="Custom Folder Cover Active">
                                📁
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="font-semibold text-white">{p.title}</div>
                          <div className="flex flex-wrap items-center gap-2 mt-0.5">
                            {p.folderName && (
                              <span className="text-[10px] text-purple-400 flex items-center gap-1 font-mono">
                                <Folder className="size-2.5" /> {p.folderName}
                              </span>
                            )}
                            {p.photoTitle && (
                              <span className="text-[10px] text-cyan-400 flex items-center gap-1 font-mono">
                                <Camera className="size-2.5" /> {p.photoTitle}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 text-cyan-400">{p.category}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono text-[11px]">
                            📁 {p.images?.length || 0} Photos {p.video ? "+ 🎥" : ""}
                          </span>
                        </td>
                        <td className="py-3 text-slate-400 font-mono text-[11px]">
                          {p.createdAt
                            ? new Date(p.createdAt).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric"
                              })
                            : "2026"}
                        </td>
                        <td className="py-3 font-mono">{p.views}</td>
                        <td className="py-3">
                          <div className="flex flex-col gap-1 items-start">
                            <button
                              type="button"
                              onClick={() => handleTogglePublish(p)}
                              title={
                                p.published !== false
                                  ? "Click to make Private"
                                  : "Click to make Public"
                              }
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer border ${
                                p.published !== false
                                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 shadow-sm"
                                  : "bg-amber-500/15 border-amber-500/30 text-amber-400 hover:bg-amber-500/25"
                              }`}
                            >
                              {p.published !== false ? (
                                <>
                                  <Globe className="size-3" /> Public
                                </>
                              ) : (
                                <>
                                  <EyeOff className="size-3" /> Private (Draft)
                                </>
                              )}
                            </button>
                            {p.featured && (
                              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[9px] font-bold border border-purple-500/30">
                                Featured
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 text-right space-x-2">
                          <button onClick={() => handleEditClick(p)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-400" title="Edit project">
                            <Edit className="size-4" />
                          </button>
                          <button onClick={() => handleDeleteProject(p.id)} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400" title="Delete project">
                            <Trash2 className="size-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB: CLIENT PROOFING & SECRET GALLERIES */}
        {activeTab === "client-galleries" && (
          <div className="space-y-8 animate-fade-in">
            {/* 1. Top Header with Create Button */}
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-mono text-[10px] font-bold border border-pink-500/30">
                    VIP CLIENT SYSTEM
                  </span>
                  <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
                    <ShieldCheck className="size-6 text-pink-400" />
                    Private Client Proofing &amp; Secret Albums ({clientGalleries.length})
                  </h2>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Wedding, brand &amp; model photoshoots ke liye password-protected private galleries banayein.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    resetGalleryForm();
                    setShowAddGallery(!showAddGallery);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 hover:opacity-90 text-white font-bold text-xs shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="size-4" />
                  <span>{showAddGallery ? "Close Form" : "Create Secret Client Album"}</span>
                </button>
              </div>
            </div>

            {/* 2. USER GUIDE & INSTRUCTION CARD (Hinglish/English) */}
            <div className="glass-strong rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-[0_0_30px_rgba(139,92,246,0.15)] space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="size-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 grid place-items-center text-white shadow-md">
                  <HelpCircle className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Client Proofing System — Complete Guide &amp; How To Use
                  </h3>
                  <p className="text-xs text-slate-400">
                    Niche diye gaye 3 points ko dhyaan se padhein taaki aap aasani se secret albums create aur manage kar sakein.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
                {/* Point 1: Ye Feature Kya Karta Hai? */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                    <span>💡 1. Ye Feature Kya Karta Hai?</span>
                  </div>
                  <p className="leading-relaxed text-slate-300">
                    Agar aapne kisi client (e.g. Wedding, Birthday, Model ya Brand) ka photoshoot kiya hai, toh aap unhe <strong>Private Password-Protected Gallery Link</strong> bhej sakte hain.
                  </p>
                  <p className="leading-relaxed text-slate-400">
                    Client apna PIN dalkar photos dekhega, pasandida photos par <strong>❤️ Heart</strong> click karke album ke liye select karega, aur direct <strong>High-Res ZIP</strong> download karega.
                  </p>
                </div>

                {/* Point 2: Kaise Use Karna Hai? */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                    <span>⚙️ 2. Kaise Use Karein? (4 Steps)</span>
                  </div>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                    <li><strong>Step 1:</strong> "Create Secret Client Album" button dabayein.</li>
                    <li><strong>Step 2:</strong> Client Name, Event Title aur Secret PIN (e.g. 1234) dalein.</li>
                    <li><strong>Step 3:</strong> PC se unki raw/edited photos upload karein.</li>
                    <li><strong>Step 4:</strong> Save karke <strong>"Copy Link"</strong> dabayein aur client ko WhatsApp par bhej dein!</li>
                  </ul>
                </div>

                {/* Point 3: Kya Fill Karna Hai Aur Kya Nahi? */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-pink-400 font-bold text-sm">
                    <span>📝 3. Kya Fill Karna Hai Aur Kya Nahi?</span>
                  </div>
                  <div className="space-y-1.5">
                    <p>
                      <strong className="text-emerald-400">✅ Zaroori (Required):</strong> Client Name, Event Title, Secret Passcode/PIN, Photos.
                    </p>
                    <p>
                      <strong className="text-amber-400">💡 Optional (Marzi Hai):</strong> Location, Event Date, Deadline, Custom Instructions (default text pehle se likha hai).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. ADD / EDIT CLIENT GALLERY FORM */}
            {showAddGallery && (
              <form onSubmit={handleGallerySubmit} className="glass-strong rounded-3xl p-6 sm:p-8 border border-pink-500/40 shadow-2xl space-y-6 animate-fade-in relative">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-white/10 gap-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-mono text-[10px] font-bold border border-pink-500/30">
                      {editingGalleryId ? "EDIT MODE" : "NEW SECRET ALBUM"}
                    </span>
                    <h3 className="text-lg font-bold font-display text-white mt-1">
                      {editingGalleryId ? "Edit Secret Client Gallery" : "Create Secret Client Gallery"}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => { resetGalleryForm(); setShowAddGallery(false); }}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-semibold"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Client Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      1. Client Name (Kiske liye shoot hai?) <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rohit &amp; Priya Sharma"
                      value={galleryForm.clientName}
                      onChange={(e) => setGalleryForm({ ...galleryForm, clientName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  {/* Event / Shoot Title */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      2. Event / Shoot Title <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Palace Wedding Shoot"
                      value={galleryForm.eventTitle}
                      onChange={(e) => setGalleryForm({ ...galleryForm, eventTitle: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  {/* Secret Passcode / PIN with Generator */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-semibold text-slate-200">
                        3. Secret Passcode / PIN <span className="text-pink-400">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleGenerateRandomPin}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                      >
                        🎲 Generate Random 4-Digit PIN
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1234 ya PRIYA2026"
                      value={galleryForm.passcode}
                      onChange={(e) => setGalleryForm({ ...galleryForm, passcode: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none font-mono tracking-wider font-bold"
                    />
                  </div>

                  {/* Custom Slug / Link */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      4. Custom Link Code (Slug - Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. rohit-priya-wedding (Khaali chhodne par auto-ban jayega)"
                      value={galleryForm.slug}
                      onChange={(e) => setGalleryForm({ ...galleryForm, slug: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      5. Shoot Date (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 28 Sept 2026"
                      value={galleryForm.eventDate}
                      onChange={(e) => setGalleryForm({ ...galleryForm, eventDate: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      6. Shoot Location (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Udaipur Palace, Rajasthan"
                      value={galleryForm.location}
                      onChange={(e) => setGalleryForm({ ...galleryForm, location: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Upload Client Photos */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-semibold text-slate-200">
                    7. Upload Shoot Photos (Select entire folder or multiple images) <span className="text-pink-400">*</span>
                  </label>
                  <FileUploadPicker
                    label="Upload Client Photos"
                    value={Array.isArray(galleryForm.images) ? galleryForm.images.join(",") : (galleryForm.images || "")}
                    multiple={true}
                    onChange={(val) => {
                      const arr = typeof val === "string" ? val.split(",").map((s) => s.trim()).filter(Boolean) : [];
                      setGalleryForm((prev) => ({
                        ...prev,
                        images: arr,
                        coverImage: prev.coverImage || arr[0] || ""
                      }));
                    }}
                    onMultipleChange={(urls) => {
                      setGalleryForm((prev) => ({
                        ...prev,
                        images: urls,
                        coverImage: prev.coverImage || urls[0] || ""
                      }));
                    }}
                  />
                </div>

                {/* Permissions & Watermark */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                  <label className="flex items-center gap-3 text-xs text-slate-200 font-semibold cursor-pointer p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <input
                      type="checkbox"
                      checked={galleryForm.allowDownload}
                      onChange={(e) => setGalleryForm({ ...galleryForm, allowDownload: e.target.checked })}
                      className="size-4 accent-cyan-400 cursor-pointer"
                    />
                    <div>
                      <div>📥 Allow ZIP Photo Downloads</div>
                      <div className="text-[10px] text-slate-400 font-normal">Client full resolution me photos download kar sakega</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 text-xs text-slate-200 font-semibold cursor-pointer p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <input
                      type="checkbox"
                      checked={galleryForm.watermarkEnabled}
                      onChange={(e) => setGalleryForm({ ...galleryForm, watermarkEnabled: e.target.checked })}
                      className="size-4 accent-pink-400 cursor-pointer"
                    />
                    <div>
                      <div>🛡️ Show "FrameKatha Proof" Watermark</div>
                      <div className="text-[10px] text-slate-400 font-normal">Photos par diagonal proofing watermark dikhega</div>
                    </div>
                  </label>
                </div>

                {/* Instructions */}
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    8. Custom Instructions for Client:
                  </label>
                  <textarea
                    rows={2}
                    value={galleryForm.instructions}
                    onChange={(e) => setGalleryForm({ ...galleryForm, instructions: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => { resetGalleryForm(); setShowAddGallery(false); }}
                    className="px-5 py-2.5 rounded-xl border border-white/20 text-slate-300 text-xs font-bold hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 hover:opacity-90 text-white font-bold text-xs shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Save className="size-4" />
                    <span>{editingGalleryId ? "Update Client Gallery" : "💾 Save & Generate Secret Link"}</span>
                  </button>
                </div>
              </form>
            )}

            {/* 4. CLIENT GALLERIES LIST TABLE */}
            <div className="glass-strong rounded-3xl p-6 border border-white/10 overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-white/10 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="pb-3">Cover</th>
                    <th className="pb-3">Client &amp; Event</th>
                    <th className="pb-3">Secret PIN</th>
                    <th className="pb-3">Photos</th>
                    <th className="pb-3">Client Selection Status</th>
                    <th className="pb-3">Views</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {clientGalleries.length > 0 ? (
                    clientGalleries.map((g) => (
                      <tr key={g.id} className="hover:bg-white/2 transition-colors">
                        <td className="py-3">
                          <div className="size-12 rounded-xl overflow-hidden bg-slate-900 border border-white/10 shrink-0">
                            <img
                              src={cleanMediaUrl(g.coverImage) || (g.images && cleanMediaUrl(g.images[0])) || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                              alt=""
                              className="size-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = (g.images && cleanMediaUrl(g.images[0])) || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100";
                              }}
                            />
                          </div>
                        </td>

                        <td className="py-3">
                          <div className="font-bold text-white text-sm">{g.eventTitle}</div>
                          <div className="text-cyan-400 font-semibold text-[11px] mt-0.5">
                            Client: {g.clientName}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {g.eventDate} {g.location ? `• ${g.location}` : ""}
                          </div>
                        </td>

                        <td className="py-3">
                          <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-mono font-bold text-xs border border-purple-500/30">
                            🔑 {g.passcode}
                          </span>
                        </td>

                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 font-mono">
                            📷 {g.images?.length || 0}
                          </span>
                        </td>

                        <td className="py-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <Heart className={`size-3.5 ${g.selectedImages?.length > 0 ? "text-pink-400 fill-pink-400" : "text-slate-500"}`} />
                              <span className="font-bold text-white text-xs">
                                {g.selectedImages?.length || 0} Selected
                              </span>
                            </div>
                            {g.isFinalized ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/30 inline-block">
                                ✅ Selections Received
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500">
                                Proofing in progress
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 font-mono">{g.views || 0}</td>

                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* QR Code Pass Modal Button */}
                            <button
                              type="button"
                              onClick={() => setSelectedQrGallery(g)}
                              className="p-2 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 transition-all cursor-pointer flex items-center gap-1 text-[11px] font-semibold border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.15)]"
                              title="Generate & View Client QR Pass"
                            >
                              <QrCode className="size-3.5 text-purple-400" />
                              <span>QR Code</span>
                            </button>

                            {/* Copy Link */}
                            <button
                              type="button"
                              onClick={() => handleCopyGalleryLink(g)}
                              className="p-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 transition-all cursor-pointer flex items-center gap-1 text-[11px] font-semibold border border-cyan-500/30"
                              title="Copy WhatsApp Message & Link for Client"
                            >
                              <Copy className="size-3.5" />
                              <span>{copiedSlug === g.slug ? "Copied!" : "Share Link"}</span>
                            </button>

                            {/* View Feedback Modal */}
                            {g.selectedImages?.length > 0 && (
                              <button
                                type="button"
                                onClick={() => setSelectedFeedbackGallery(g)}
                                className="p-2 rounded-lg bg-pink-500/15 hover:bg-pink-500/25 text-pink-300 transition-all cursor-pointer border border-pink-500/30"
                                title="View Client's Chosen Photos & Notes"
                              >
                                <Heart className="size-3.5 fill-pink-400" />
                              </button>
                            )}

                            {/* Open Direct */}
                            <a
                              href={`/client-portal/${g.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-all"
                              title="Open Portal as Client"
                            >
                              <ExternalLink className="size-3.5" />
                            </a>

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => handleEditGallery(g)}
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-400 transition-all"
                              title="Edit Album"
                            >
                              <Edit className="size-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleDeleteGallery(g.id)}
                              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                              title="Delete Album"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                        Abhi koi secret client gallery nahi bani hai. Upar diye gaye button par click karke pehli gallery banayein!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 5. MODAL: VIEW CLIENT'S SELECTED PHOTOS & NOTES */}
            {selectedFeedbackGallery && (
              <div
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
                onClick={() => setSelectedFeedbackGallery(null)}
              >
                <div
                  className="w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-strong rounded-3xl p-6 sm:p-8 border border-pink-500/40 shadow-2xl space-y-6 relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setSelectedFeedbackGallery(null)}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="size-5" />
                  </button>

                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-semibold mb-2">
                      <Heart className="size-3.5 fill-pink-400" />
                      <span>Client Selections Received</span>
                    </div>
                    <h3 className="text-xl font-bold font-display text-white">
                      {selectedFeedbackGallery.eventTitle} — {selectedFeedbackGallery.clientName}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Client ne kul <strong>{selectedFeedbackGallery.selectedImages?.length || 0} photos</strong> choose ki hain album retouching ke liye.
                    </p>
                  </div>

                  {/* Client Notes / Instructions */}
                  {selectedFeedbackGallery.clientNotes && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                        Client's Retouching Instructions:
                      </span>
                      <p className="text-xs text-slate-200 italic whitespace-pre-line">
                        "{selectedFeedbackGallery.clientNotes}"
                      </p>
                    </div>
                  )}

                  {/* Selected Photos Grid */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs text-slate-300">
                      <span className="font-bold text-white">Selected Photos ({selectedFeedbackGallery.selectedImages?.length || 0}):</span>
                      <a
                        href={`/api/client-galleries/${selectedFeedbackGallery.slug}/download-zip?mode=selected`}
                        className="px-3.5 py-1.5 rounded-xl bg-pink-600/30 hover:bg-pink-600 text-pink-200 text-xs font-bold flex items-center gap-1.5 border border-pink-500/40 transition-all"
                      >
                        <FolderDown className="size-3.5" />
                        <span>Download Selected ZIP</span>
                      </a>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {(selectedFeedbackGallery.selectedImages || []).map((imgUrl: string, idx: number) => (
                        <div key={imgUrl} className="aspect-4/3 rounded-xl overflow-hidden bg-slate-900 border border-pink-500/40 relative group">
                          <img
                            src={cleanMediaUrl(imgUrl)}
                            alt={`Selected ${idx + 1}`}
                            className="size-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300";
                            }}
                          />
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                            #{selectedFeedbackGallery.images.indexOf(imgUrl) + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CATEGORIES */}
        {activeTab === "categories" && (
          <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
                  <Layers className="size-6 text-purple-400" />
                  Portfolio Categories ({categories.length})
                </h2>
                <p className="text-xs text-slate-300">Add, rename, edit descriptions, or remove portfolio categories</p>
              </div>
            </div>

            {/* Add New Category Form */}
            <form onSubmit={handleAddCategory} className="glass-strong rounded-3xl p-4 sm:p-6 border border-purple-500/30 shadow-lg space-y-3">
              <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <Plus className="size-4" /> Create New Category
              </span>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <input
                  required
                  type="text"
                  placeholder="New Category Name (e.g. Street Photography)"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="flex-1 w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-purple-500/40 text-white text-xs focus:border-cyan-400 focus:outline-none placeholder:text-slate-500"
                />
                <input
                  type="text"
                  placeholder="Description / Tagline (Optional)"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="flex-1 w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none placeholder:text-slate-500"
                />
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0 flex items-center justify-center gap-2">
                  <Plus className="size-4" /> Add Category
                </button>
              </div>
            </form>

            {/* Categories List Cards with Edit / Delete */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((c) => (
                <div key={c.id || c.name} className="glass-strong rounded-2xl p-4 border border-white/10 hover:border-purple-500/30 transition-all space-y-3">
                  {editingCatId === c.id ? (
                    /* Inline Edit Mode */
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                          Editing Category
                        </span>
                        <button
                          type="button"
                          onClick={() => setEditingCatId(null)}
                          className="text-slate-400 hover:text-white text-xs"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={editCatName}
                        onChange={(e) => setEditCatName(e.target.value)}
                        placeholder="Category Name"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-cyan-400 text-white text-xs focus:outline-none font-bold"
                      />
                      <input
                        type="text"
                        value={editCatDesc}
                        onChange={(e) => setEditCatDesc(e.target.value)}
                        placeholder="Category Description"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/20 text-slate-200 text-xs focus:outline-none"
                      />
                      <div className="flex items-center gap-2 justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingCatId(null)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveCategoryEdit(c.id)}
                          className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="size-3.5" /> Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Normal Display Mode */
                    <div className="flex justify-between items-center gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="size-2 rounded-full bg-purple-400" />
                          <h4 className="font-bold text-white text-sm">{c.name}</h4>
                        </div>
                        <p className="text-xs text-slate-400 pl-4">{c.description || "Portfolio category"}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEditCategory(c)}
                          className="p-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 transition-all cursor-pointer shadow-sm"
                          title="Edit Category Name & Description"
                        >
                          <Edit className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(c.id)}
                          className="p-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 transition-all cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TESTIMONIALS */}
        {activeTab === "testimonials" && (
          <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <form onSubmit={handleAddTestimonial} className="glass-strong rounded-3xl p-4 sm:p-6 border border-white/10 space-y-4">
              <h3 className="font-bold text-white text-sm">Add Client Feedback</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <input
                  required
                  placeholder="Client Name"
                  value={newTestName}
                  onChange={(e) => setNewTestName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
                <input
                  placeholder="Role / Company"
                  value={newTestRole}
                  onChange={(e) => setNewTestRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <textarea
                required
                rows={2}
                placeholder="Feedback message..."
                value={newTestMsg}
                onChange={(e) => setNewTestMsg(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
              />
              <button type="submit" className="btn-neon text-xs px-5 py-2.5 w-full sm:w-auto">
                Save Testimonial
              </button>
            </form>

            <div className="space-y-4">
              {testimonials.map((t) => (
                <div key={t.id} className="glass-strong rounded-2xl p-4 border border-white/10 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white text-sm">{t.name} <span className="text-slate-400 font-normal">({t.role})</span></h4>
                    <p className="text-xs text-slate-300 italic mt-1">"{t.message}"</p>
                  </div>
                  <button onClick={() => deleteTestimonial(t.id).then(loadCMSData)} className="p-1.5 text-red-400 hover:text-red-300">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: MESSAGES */}
        {activeTab === "messages" && (
          <div className="space-y-4 animate-fade-in max-w-4xl mx-auto">
            <h2 className="text-xl font-bold font-display text-white">Contact Messages ({messages.length})</h2>
            {messages.length > 0 ? (
              messages.map((m) => (
                <div key={m.id} className="glass-strong rounded-2xl p-5 border border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-cyan-400">{m.name} ({m.email})</span>
                    <button onClick={() => deleteMessage(m.id).then(loadCMSData)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <h4 className="font-bold text-white text-sm">{m.subject}</h4>
                  <p className="text-xs text-slate-300">{m.message}</p>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">No contact messages received yet.</div>
            )}
          </div>
        )}

        {/* TAB 6: SITE SETTINGS & MAINTENANCE MODE */}
        {activeTab === "settings" && (
          <form onSubmit={handleSaveSettings} className="space-y-8 animate-fade-in max-w-4xl mx-auto">
            {/* 1. Maintenance Mode Master Control Card */}
            <div className={`glass-strong rounded-3xl p-6 sm:p-8 border transition-all ${
              settingsForm.maintenanceMode
                ? "border-amber-500/50 shadow-[0_0_40px_rgba(245,158,11,0.2)] bg-amber-950/10"
                : "border-purple-500/30 shadow-[0_0_40px_rgba(139,92,246,0.1)]"
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`size-12 rounded-2xl grid place-items-center ${
                    settingsForm.maintenanceMode
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                      : "bg-purple-500/20 text-purple-400 border border-purple-500/40"
                  }`}>
                    <Wrench className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      Website Maintenance Mode
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        settingsForm.maintenanceMode
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      }`}>
                        {settingsForm.maintenanceMode ? "🔴 ON (Active)" : "🟢 OFF (Live)"}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {settingsForm.maintenanceMode
                        ? "Visitors see the maintenance screen. Admin panel (/admin) remains accessible to you."
                        : "Website is public and fully visible to all visitors."}
                    </p>
                  </div>
                </div>

                {/* Big Toggle Switch Button */}
                <button
                  type="button"
                  onClick={() =>
                    setSettingsForm({ ...settingsForm, maintenanceMode: !settingsForm.maintenanceMode })
                  }
                  className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                    settingsForm.maintenanceMode
                      ? "bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                      : "bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                  }`}
                >
                  <Wrench className="size-4" />
                  {settingsForm.maintenanceMode ? "Turn OFF Maintenance" : "Turn ON Maintenance"}
                </button>
              </div>

              {/* Maintenance Message Editor */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300">
                    Maintenance Notice Message (Shown to Visitors)
                  </label>
                  {/* Preset quick message chips */}
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setSettingsForm({
                          ...settingsForm,
                          maintenanceMessage:
                            "We're adding exciting new photos and videos to FrameKatha! ✨\nWe'll be back online in a few minutes. Stay tuned! 🚀"
                        })
                      }
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-400 border border-white/10"
                    >
                      + New Uploads
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSettingsForm({
                          ...settingsForm,
                          maintenanceMessage:
                            "Website Under Upgradation 🛠️\nWe're enhancing performance and visual effects.\nFrameKatha will be back shortly!"
                        })
                      }
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-purple-400 border border-white/10"
                    >
                      + System Upgrade
                    </button>
                  </div>
                </div>

                <textarea
                  rows={4}
                  value={settingsForm.maintenanceMessage}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, maintenanceMessage: e.target.value })
                  }
                  placeholder="Enter the message you want visitors to see..."
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-xs leading-relaxed focus:border-cyan-400 focus:outline-none"
                />

                {/* Message preview snippet */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block mb-1">
                    Live Visitor Preview:
                  </span>
                  <p className="text-xs text-slate-300 italic whitespace-pre-line">
                    {settingsForm.maintenanceMessage || "We'll be back shortly! 🚀"}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Site Identity */}
            <div className="glass-strong rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="size-4 text-cyan-400" /> Site Identity &amp; Branding
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-semibold">Studio / Site Title</label>
                  <input
                    type="text"
                    value={settingsForm.title}
                    onChange={(e) => setSettingsForm({ ...settingsForm, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-semibold">Tagline</label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-semibold">About / Studio Description</label>
                <textarea
                  rows={3}
                  value={settingsForm.aboutText}
                  onChange={(e) => setSettingsForm({ ...settingsForm, aboutText: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* 3. Social & Contact Links */}
            <div className="glass-strong rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="size-4 text-purple-400" /> Social Links &amp; Contact
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-semibold">Instagram URL</label>
                  <input
                    type="text"
                    placeholder="https://instagram.com/framekatha"
                    value={settingsForm.socialLinks.instagram || ""}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        socialLinks: { ...settingsForm.socialLinks, instagram: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-semibold">YouTube URL</label>
                  <input
                    type="text"
                    placeholder="https://youtube.com/@framekatha"
                    value={settingsForm.socialLinks.youtube || ""}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        socialLinks: { ...settingsForm.socialLinks, youtube: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-semibold">LinkedIn URL</label>
                  <input
                    type="text"
                    placeholder="https://linkedin.com/in/framekatha"
                    value={settingsForm.socialLinks.linkedin || ""}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        socialLinks: { ...settingsForm.socialLinks, linkedin: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-semibold">Contact Email</label>
                  <input
                    type="email"
                    placeholder="hello@framekatha.com"
                    value={settingsForm.socialLinks.email || ""}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        socialLinks: { ...settingsForm.socialLinks, email: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 4. Homepage Multi-Video Showcase Reels Manager (Autoplay on Scroll) */}
            <div className="glass-strong rounded-3xl p-6 sm:p-8 border border-purple-500/30 space-y-6 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-2xl bg-gradient-to-tr from-purple-600/30 to-pink-600/30 border border-purple-500/40 grid place-items-center text-purple-300">
                    <Video className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      Homepage Multi-Video Showcase Reels
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        settingsForm.showcaseVideoEnabled
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "bg-slate-500/20 text-slate-400 border border-white/10"
                      }`}>
                        {settingsForm.showcaseVideoEnabled ? "🟢 Active on Home" : "⚪ Disabled"}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Manage multiple 4K showreel videos that auto-play smoothly on scroll. Users can switch between reels.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setSettingsForm({
                        ...settingsForm,
                        showcaseVideoEnabled: !settingsForm.showcaseVideoEnabled
                      })
                    }
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      settingsForm.showcaseVideoEnabled
                        ? "bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40"
                        : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                    }`}
                  >
                    <Film className="size-3.5" />
                    {settingsForm.showcaseVideoEnabled ? "Disable on Home" : "Enable on Home"}
                  </button>
                </div>
              </div>

              {/* Global Section Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-semibold">Section Heading</label>
                  <input
                    type="text"
                    value={settingsForm.showcaseVideoTitle}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, showcaseVideoTitle: e.target.value })
                    }
                    placeholder="e.g. Cinematic Visual Showreel"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-semibold">Section Subtitle</label>
                  <input
                    type="text"
                    value={settingsForm.showcaseVideoSubtitle}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, showcaseVideoSubtitle: e.target.value })
                    }
                    placeholder="e.g. 4K 60FPS Video Production, Visual Effects & Color Grading"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Current Videos List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Tv className="size-3.5 text-cyan-400" />
                    <span>Active Video Reels ({(settingsForm.showcaseVideos || []).length}):</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Arranged in order of appearance
                  </span>
                </div>

                <div className="space-y-3">
                  {(settingsForm.showcaseVideos || []).map((v: any, idx: number) => {
                    const isEditing = editingVideoIndex === idx;
                    return (
                      <div
                        key={v.id || idx}
                        className={`p-4 rounded-2xl border transition-all ${
                          isEditing
                            ? "bg-purple-950/30 border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.2)]"
                            : "bg-white/5 border-white/10 hover:border-purple-500/40"
                        }`}
                      >
                        {isEditing && editingVideoForm ? (
                          /* Inline Edit Form */
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                                <Edit className="size-3.5" />
                                <span>Editing Video Reel #{idx + 1}</span>
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={handleSaveEditedVideo}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-md"
                                >
                                  <Save className="size-3.5" />
                                  <span>Update Reel</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={handleCancelEditVideo}
                                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
                                >
                                  <X className="size-3.5" />
                                  <span>Cancel</span>
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="sm:col-span-2 flex flex-col sm:flex-row gap-2">
                                <input
                                  type="text"
                                  placeholder="Video URL (.mp4/.webm)..."
                                  value={editingVideoForm.url}
                                  onChange={(e) =>
                                    setEditingVideoForm({
                                      ...editingVideoForm,
                                      url: e.target.value
                                    })
                                  }
                                  className="flex-1 px-3.5 py-2 rounded-xl bg-black/50 border border-purple-500/50 text-white text-xs focus:border-cyan-400 focus:outline-none font-mono"
                                />
                                <FileUploadPicker
                                  label="Change Video"
                                  value={editingVideoForm.url}
                                  onChange={(url) =>
                                    setEditingVideoForm({
                                      ...editingVideoForm,
                                      url: url
                                    })
                                  }
                                  accept="video/*"
                                  isVideo={true}
                                />
                              </div>
                              <div>
                                <input
                                  type="text"
                                  placeholder="Tag / Category (e.g. Drone Landscape)"
                                  value={editingVideoForm.tag}
                                  onChange={(e) =>
                                    setEditingVideoForm({
                                      ...editingVideoForm,
                                      tag: e.target.value
                                    })
                                  }
                                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-purple-500/50 text-white text-xs focus:border-cyan-400 focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <input
                                type="text"
                                placeholder="Video Title"
                                value={editingVideoForm.title}
                                onChange={(e) =>
                                    setEditingVideoForm({
                                      ...editingVideoForm,
                                      title: e.target.value
                                    })
                                }
                                className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-purple-500/50 text-white text-xs focus:border-cyan-400 focus:outline-none"
                              />
                              <input
                                type="text"
                                placeholder="Video Subtitle / Story Description"
                                value={editingVideoForm.subtitle}
                                onChange={(e) =>
                                    setEditingVideoForm({
                                      ...editingVideoForm,
                                      subtitle: e.target.value
                                    })
                                }
                                className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-purple-500/50 text-white text-xs focus:border-cyan-400 focus:outline-none"
                              />
                            </div>
                          </div>
                        ) : (
                          /* View Video Row */
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                              <div className="relative size-14 rounded-xl overflow-hidden bg-black shrink-0 border border-white/10">
                                <video
                                  src={v.url}
                                  muted
                                  playsInline
                                  className="size-full object-cover"
                                />
                                <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded bg-black/80 text-[8px] font-mono text-cyan-300">
                                  #{idx + 1}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                                    {v.tag || "Cinematic"}
                                  </span>
                                  <span className="text-xs font-bold text-white truncate">
                                    {v.title || "Untitled Video"}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                  {v.subtitle || v.url}
                                </p>
                              </div>
                            </div>

                            {/* Controls: Edit, Reorder, Delete */}
                            <div className="flex items-center gap-1.5 self-end sm:self-center">
                              <button
                                type="button"
                                onClick={() => handleStartEditVideo(idx)}
                                className="px-2.5 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                                title="Edit this Video Reel"
                              >
                                <Edit className="size-3.5 text-purple-300" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveVideoReel(idx, -1)}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                title="Move Up"
                              >
                                <ArrowUp className="size-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === (settingsForm.showcaseVideos || []).length - 1}
                                onClick={() => handleMoveVideoReel(idx, 1)}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                title="Move Down"
                              >
                                <ArrowDown className="size-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveVideoFromReel(idx)}
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all cursor-pointer"
                                title="Delete Video"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {(settingsForm.showcaseVideos || []).length === 0 && (
                    <div className="py-6 text-center text-slate-400 text-xs bg-white/5 rounded-2xl border border-dashed border-white/10">
                      No video reels added. Add your first video below or pick a preset!
                    </div>
                  )}
                </div>
              </div>

              {/* ➕ Add New Video to Reel Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-purple-500/30 space-y-3.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Plus className="size-3.5" />
                    <span>Add New Video Reel:</span>
                  </h4>

                  {/* 1-Click 4K Presets */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-slate-500 font-medium">Quick 4K Presets:</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleAddPresetVideoToReel({
                          url: "/videos/reel-1.mp4",
                          title: "Neon City Nocturne 4K",
                          subtitle: "Night aerial cinematography with natural depth of field",
                          tag: "Night Aerial"
                        })
                      }
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-white/5 hover:bg-purple-500/20 text-purple-300 border border-white/10 cursor-pointer"
                    >
                      🌃 City Night
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleAddPresetVideoToReel({
                          url: "/videos/reel-2.mp4",
                          title: "Himalayan Ridge Drone Reel",
                          subtitle: "High-altitude landscape exploration & dynamic light",
                          tag: "Drone Landscape"
                        })
                      }
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-cyan-300 border border-white/10 cursor-pointer"
                    >
                      🏔️ Mountain Drone
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleAddPresetVideoToReel({
                          url: "/videos/reel-3.mp4",
                          title: "Cyberpunk Portrait Studio",
                          subtitle: "Editorial fashion lighting with RGB color contrast",
                          tag: "Editorial Fashion"
                        })
                      }
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-white/5 hover:bg-pink-500/20 text-pink-300 border border-white/10 cursor-pointer"
                    >
                      💃 Neon Fashion
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleAddPresetVideoToReel({
                          url: "/videos/flower.mp4",
                          title: "Macro Color & Nature Motion",
                          subtitle: "Ultra-vibrant saturation profile with high framerate slow motion",
                          tag: "Macro Nature"
                        })
                      }
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-white/5 hover:bg-amber-500/20 text-amber-300 border border-white/10 cursor-pointer"
                    >
                      🌸 Macro Nature
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Video URL (.mp4/.webm) or upload local video..."
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none font-mono"
                    />
                    <FileUploadPicker
                      label="Upload MP4"
                      value={newVideoUrl}
                      onChange={(url) => setNewVideoUrl(url)}
                      accept="video/*"
                      isVideo={true}
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Tag (e.g. Drone Landscape)"
                      value={newVideoTag}
                      onChange={(e) => setNewVideoTag(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Video Title (e.g. Royal Palace Drone Shoot)"
                    value={newVideoTitle}
                    onChange={(e) => setNewVideoTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Video Subtitle / Story..."
                    value={newVideoSubtitle}
                    onChange={(e) => setNewVideoSubtitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddVideoToReel}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-lg"
                >
                  <Plus className="size-4" />
                  <span>Add Video to Showcase</span>
                </button>
              </div>
            </div>

            {/* Save Buttons & Feedback */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={savingSettings}
                className="btn-neon text-xs px-8 py-3 flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              >
                <Save className="size-4" />
                {savingSettings ? "Saving..." : "Save All Settings"}
              </button>
              {settingsSavedSuccess && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 animate-fade-in">
                  <CheckCircle2 className="size-4" /> Settings updated successfully!
                </span>
              )}
            </div>
          </form>
        )}
      </section>

      {/* Secret Client Gallery QR Code Modal */}
      <ClientGalleryQRModal
        isOpen={!!selectedQrGallery}
        onClose={() => setSelectedQrGallery(null)}
        gallery={selectedQrGallery}
      />

      {/* Gemini AI Assistant Modal in Admin Panel */}
      <AIModal isOpen={showAdminGemini} onClose={() => setShowAdminGemini(false)} />
    </SiteLayout>
  );
}
