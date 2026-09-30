import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { fetchProjects, toggleProjectLike } from "@/lib/api";
import { Search, SlidersHorizontal, Eye, Sparkles, Image as ImageIcon, Folder, Camera, FolderDown, Heart, MessageSquare, QrCode } from "lucide-react";
import { QRCodeModal } from "@/components/QRCodeModal";

const categories = [
  "All",
  "Photography",
  "Digital Art",
  "Photo Editing",
  "Poster Design",
  "Thumbnail Design",
  "Video Editing",
  "Experiments"
];

export function PortfolioPage() {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get("category") || "All";

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQrProject, setSelectedQrProject] = useState<any | null>(null);
  const [isGlobalQrOpen, setIsGlobalQrOpen] = useState(false);
  
  // Filters & Sorting state
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("latest");
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [projectLikes, setProjectLikes] = useState<{ [id: string]: number }>({});

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setActiveCategory(cat);
    } else {
      setActiveCategory("All");
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadPortfolio() {
      setLoading(true);
      try {
        const data = await fetchProjects({
          category: activeCategory,
          search: searchQuery,
          year: selectedYear !== "All" ? parseInt(selectedYear) : undefined,
          featured: featuredOnly ? true : undefined,
          sort_by: sortBy
        });
        const publicProjects = Array.isArray(data) ? data.filter((p: any) => p.published !== false) : [];
        setProjects(publicProjects);

        // Check local storage for liked status
        const liked = new Set<string>();
        const likesMap: { [id: string]: number } = {};
        data.forEach((p: any) => {
          likesMap[p.id] = p.likes || 0;
          if (localStorage.getItem(`fk_liked_${p.id}`) === "true") {
            liked.add(p.id);
          }
        });
        setLikedIds(liked);
        setProjectLikes(likesMap);
      } catch (e) {
        console.error("Failed to load portfolio:", e);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(loadPortfolio, 200);
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery, selectedYear, featuredOnly, sortBy]);

  const handleLikeProject = async (projectId: string) => {
    const isCurrentlyLiked = likedIds.has(projectId);
    const newLiked = new Set(likedIds);
    const currentCount = projectLikes[projectId] ?? (projects.find((p) => p.id === projectId)?.likes || 0);

    if (isCurrentlyLiked) {
      newLiked.delete(projectId);
      localStorage.removeItem(`fk_liked_${projectId}`);
      setProjectLikes((prev) => ({ ...prev, [projectId]: Math.max(0, currentCount - 1) }));
    } else {
      newLiked.add(projectId);
      localStorage.setItem(`fk_liked_${projectId}`, "true");
      setProjectLikes((prev) => ({ ...prev, [projectId]: currentCount + 1 }));
    }
    setLikedIds(newLiked);

    try {
      await toggleProjectLike(projectId, isCurrentlyLiked ? "unlike" : "like");
    } catch (e) {
      console.error("Failed to toggle like:", e);
    }
  };

  return (
    <SiteLayout>
      <section className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">Media Showcase</span>
          <h1 className="text-4xl font-bold font-display mt-1">Creative <span className="gradient-text">Portfolio</span></h1>
          <p className="text-slate-400 mt-2 text-sm max-w-lg mx-auto">
            Browse through our collection of photography, digital concept art, color grading, and video edits.
          </p>
          {/* Share Portfolio via QR Code */}
          <button
            onClick={() => setIsGlobalQrOpen(true)}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-600/30 to-cyan-500/30 border border-cyan-500/40 text-cyan-300 hover:from-purple-600/50 hover:to-cyan-500/50 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            title="Share this Portfolio via QR Code"
          >
            <QrCode className="size-4" />
            Share Portfolio via QR Code
          </button>
        </div>

        {/* Filter & Search Bar Controls */}
        <div className="glass-strong rounded-3xl p-6 mb-10 border border-white/10 space-y-6">
          {/* Category Filter Pills */}
          <div className="flex flex-nowrap sm:flex-wrap items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search, Filter Drops & Sorting Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/5">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search title, tag, tool, camera..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Year Filter */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#12121a] border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
            >
              <option value="All">All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#12121a] border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
            >
              <option value="latest">Sort: Latest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="most_viewed">Sort: Most Viewed</option>
              <option value="featured">Sort: Featured First</option>
            </select>

            {/* Featured Only Toggle */}
            <button
              onClick={() => setFeaturedOnly(!featuredOnly)}
              className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                featuredOnly
                  ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                  : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="size-4 text-cyan-400" />
              {featuredOnly ? "Showing Featured Only" : "Show Featured Only"}
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-strong rounded-3xl h-80 animate-pulse" />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <Link
                key={p.id}
                to={`/portfolio/${p.slug}`}
                className="group glass-strong card-hover-effect rounded-3xl overflow-hidden border border-white/10 flex flex-col"
              >
                <div className="aspect-4/3 overflow-hidden bg-slate-900 relative">
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    loading="lazy"
                    decoding="async"
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
                      {p.photoTitle && (
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/85 backdrop-blur-md text-[10px] font-semibold text-cyan-200 border border-cyan-500/40 flex items-center gap-1">
                          <Camera className="size-2.5 text-cyan-400" />
                          <span className="truncate max-w-[120px]">{p.photoTitle}</span>
                        </span>
                      )}
                      {p.beforeImage && (
                        <span className="px-2 py-0.5 rounded-full bg-purple-600/80 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1">
                          <SlidersHorizontal className="size-2.5" /> Edit
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {p.images && p.images.length > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const link = document.createElement("a");
                            link.href = `/api/projects/${p.slug || p.id}/download-zip`;
                            link.setAttribute("download", `${p.folderName || p.title || "folder"}.zip`);
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="px-2 py-0.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500 hover:text-black text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold transition-all flex items-center gap-1 cursor-pointer"
                          title="Download entire folder as a ZIP file"
                        >
                          <FolderDown className="size-2.5" />
                          <span>ZIP</span>
                        </button>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
                        📁 {p.images?.length || 1}
                      </span>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                    <span className="text-xs text-slate-300 font-semibold">{p.year} • {p.location || 'Studio'}</span>
                    <h3 className="text-lg font-bold text-white mt-1">{p.title}</h3>
                    {p.photoTitle && p.photoTitle !== p.title && (
                      <span className="text-xs text-cyan-300 font-medium flex items-center gap-1 mt-0.5">
                        <Camera className="size-3 text-cyan-400 shrink-0" /> Photo: {p.photoTitle}
                      </span>
                    )}
                    <div className="flex items-center gap-4 text-xs text-slate-300 mt-2">
                      <span className="flex items-center gap-1 text-cyan-400 font-semibold"><Eye className="size-3.5" /> {p.views} Views</span>
                      {p.camera && <span className="text-[11px]">📷 {p.camera}</span>}
                    </div>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors">{p.title}</h3>
                    {p.photoTitle && p.photoTitle !== p.title && (
                      <p className="text-xs text-cyan-400/90 font-medium flex items-center gap-1 mt-1">
                        <Camera className="size-3 text-cyan-400 shrink-0" />
                        <span className="truncate">Photo: {p.photoTitle}</span>
                      </p>
                    )}
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">{p.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {p.tags.slice(0, 4).map((t: string) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300">
                          #{t}
                        </span>
                      ))}
                    </div>
                    {p.tools && p.tools.length > 0 && (
                      <div className="text-[11px] text-slate-500 font-mono truncate">
                        Tools: {p.tools.join(", ")}
                      </div>
                    )}
                  </div>

                  {/* Card Engagement Bar: Likes, Comments, QR, Views */}
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleLikeProject(p.id);
                        }}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                          likedIds.has(p.id)
                            ? "bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm"
                            : "bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 hover:text-rose-300 hover:border-rose-500/30"
                        }`}
                        title={likedIds.has(p.id) ? "Unlike" : "Like"}
                      >
                        <Heart className={`size-3.5 ${likedIds.has(p.id) ? "fill-rose-500 text-rose-500" : ""}`} />
                        <span>{projectLikes[p.id] ?? (p.likes || 0)}</span>
                      </button>

                      <span
                        className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300 flex items-center gap-1"
                        title={`${p.comments?.length || 0} comments`}
                      >
                        <MessageSquare className="size-3 text-cyan-400" />
                        <span>{p.comments?.length || 0}</span>
                      </span>

                      {/* QR Code Button per card */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedQrProject(p);
                        }}
                        className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="Get QR Code for this project"
                      >
                        <QrCode className="size-3.5" />
                        <span className="hidden sm:inline">QR</span>
                      </button>
                    </div>

                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Eye className="size-3 text-cyan-400" /> {p.views}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center glass-strong rounded-3xl border border-white/10 space-y-3">
            <ImageIcon className="size-10 mx-auto text-slate-500" />
            <h3 className="text-lg font-bold text-white">No projects found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search criteria, category filter, or resetting the filters.
            </p>
            <button
              onClick={() => { setActiveCategory("All"); setSearchQuery(""); setSelectedYear("All"); setFeaturedOnly(false); setSortBy("latest"); }}
              className="btn-ghost-neon text-xs mt-2"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* ── Global Portfolio QR Modal ── */}
      <QRCodeModal
        isOpen={isGlobalQrOpen}
        onClose={() => setIsGlobalQrOpen(false)}
        title="FrameKatha Portfolio"
      />

      {/* ── Per-Project QR Modal ── */}
      {selectedQrProject && (
        <QRCodeModal
          isOpen={!!selectedQrProject}
          onClose={() => setSelectedQrProject(null)}
          projectUrl={`/portfolio/${selectedQrProject.slug}`}
          title={selectedQrProject.title}
          folderName={selectedQrProject.folderName}
          isFolderQR={!!(selectedQrProject.folderName || selectedQrProject.images?.length > 0)}
        />
      )}
    </SiteLayout>
  );
}
