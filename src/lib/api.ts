const API_BASE_URL = '/api';

export function cleanMediaUrl(url: any): string {
  if (typeof url !== 'string' || !url) return '';
  return url
    .replace(/^https?:\/\/localhost:\d+/i, '')
    .replace(/^https?:\/\/127\.0\.0\.1:\d+/i, '')
    .replace(/^https?:\/\/0\.0\.0\.0:\d+/i, '');
}

export function cleanProjectData(project: any): any {
  if (!project) return project;
  return {
    ...project,
    thumbnail: cleanMediaUrl(project.thumbnail),
    folderThumbnail: cleanMediaUrl(project.folderThumbnail),
    beforeImage: cleanMediaUrl(project.beforeImage),
    afterImage: cleanMediaUrl(project.afterImage),
    video: cleanMediaUrl(project.video),
    images: Array.isArray(project.images)
      ? project.images.map(cleanMediaUrl).filter(Boolean)
      : typeof project.images === 'string'
      ? project.images.split(',').map((s: string) => cleanMediaUrl(s.trim())).filter(Boolean)
      : project.images
  };
}

// ── EMBEDDED SEED DATABASE (Fallback when backend is offline) ───────────────

const DEFAULT_PROJECTS: any[] = [
  {
    id: "proj-3f35dc59",
    title: "Ganpati bappa morya",
    slug: "ganpati-bappa-morya",
    description: "Traditional festival celebration and portrait photography capturing divine devotion, street processions, and atmospheric cultural festivities.",
    category: "Photography",
    subcategory: "Devotional & Festival",
    folderName: "Ganpati bappa morya",
    folderThumbnail: "https://images.unsplash.com/photo-1567591414240-e2ff40994f27?w=800",
    photoTitle: "Ganpati Bappa Morya",
    images: [
      "https://images.unsplash.com/photo-1567591414240-e2ff40994f27?w=1200",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200"
    ],
    video: "",
    thumbnail: "https://images.unsplash.com/photo-1567591414240-e2ff40994f27?w=800",
    tags: ["Ganpati", "Festival", "India", "Devotion", "Culture", "Photography"],
    tools: ["Sony A7IV", "85mm f/1.4", "Adobe Lightroom"],
    camera: "Sony A7IV",
    lens: "85mm f/1.4 GM",
    editingSoftware: "Adobe Lightroom Classic",
    year: 2026,
    location: "Maharashtra, India",
    featured: true,
    published: true,
    views: 4,
    beforeImage: "https://images.unsplash.com/photo-1567591414240-e2ff40994f27?w=800&sat=-50",
    afterImage: "https://images.unsplash.com/photo-1567591414240-e2ff40994f27?w=800",
    createdAt: "2026-09-28T19:27:34.711782Z",
    updatedAt: "2026-09-28T19:30:33.119889Z"
  },
  {
    id: "proj-1",
    title: "Night at Rameshwaram",
    slug: "night-at-rameshwaram",
    description: "Long exposure architectural photography capturing the majestic corridors and ancient illuminated pillars of Rameshwaram Temple under starry midnight skies.",
    category: "Photography",
    subcategory: "Architecture",
    images: [
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200"
    ],
    video: "",
    thumbnail: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800",
    tags: ["Temple", "Architecture", "Night", "India", "Low Light", "Long Exposure"],
    tools: ["Sony A7IV", "Sony 16-35mm GM", "Adobe Lightroom"],
    camera: "Sony A7IV",
    lens: "FE 16-35mm F2.8 GM",
    editingSoftware: "Adobe Lightroom Classic",
    year: 2026,
    location: "Rameshwaram, Tamil Nadu",
    featured: true,
    published: true,
    views: 128,
    beforeImage: "",
    afterImage: "",
    createdAt: "2026-02-10T10:00:00Z",
    updatedAt: "2026-02-10T10:00:00Z"
  },
  {
    id: "proj-2",
    title: "Monsoon Portrait Series",
    slug: "monsoon-portrait",
    description: "Cinematic outdoor portraiture in heavy rain with high-contrast moody color grading and natural atmospheric reflections.",
    category: "Photography",
    subcategory: "Portraits",
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200"
    ],
    video: "",
    thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800",
    tags: ["Portrait", "Monsoon", "Moody", "Rain", "Street", "Atmospheric"],
    tools: ["Canon R5", "85mm f/1.2", "Photoshop", "Lightroom"],
    camera: "Canon EOS R5",
    lens: "RF 85mm F1.2L USM",
    editingSoftware: "Adobe Photoshop & Lightroom",
    year: 2026,
    location: "Mumbai, Maharashtra",
    featured: true,
    published: true,
    views: 245,
    beforeImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&sat=-50",
    afterImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800",
    createdAt: "2026-03-01T12:00:00Z",
    updatedAt: "2026-09-28T16:23:15.287413Z"
  },
  {
    id: "proj-3",
    title: "Neon Cyberpunk Visual Retouch",
    slug: "neon-cyberpunk-visual-retouch",
    description: "Advanced before/after photo editing and color grading turning daytime urban streets into a glowing futuristic cyberpunk metropolis.",
    category: "Photo Editing",
    subcategory: "Color Grading",
    images: [
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200"
    ],
    video: "",
    thumbnail: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800",
    tags: ["Cyberpunk", "Color Grading", "Neon", "Retouch", "Photoshop", "Urban"],
    tools: ["Adobe Photoshop", "Camera Raw", "Lightroom"],
    camera: "Sony A7S III",
    lens: "24-70mm F2.8 GM",
    editingSoftware: "Adobe Photoshop 2026",
    year: 2026,
    location: "Tokyo, Japan",
    featured: true,
    published: true,
    views: 312,
    beforeImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800",
    afterImage: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800",
    createdAt: "2026-03-12T14:30:00Z",
    updatedAt: "2026-09-28T16:23:41.916608Z"
  },
  {
    id: "proj-4",
    title: "Digital Dreams — Surreal Concept Art",
    slug: "digital-dreams-surreal-concept-art",
    description: "Fantasy digital illustration exploring floating cosmic islands, ethereal light leaks, and surreal dimensional shifts.",
    category: "Digital Art",
    subcategory: "Illustration",
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200"
    ],
    video: "",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800",
    tags: ["Surreal", "Digital Painting", "Fantasy", "Cosmic", "Illustration"],
    tools: ["Procreate", "Photoshop", "Wacom Intuos"],
    camera: "",
    lens: "",
    editingSoftware: "Procreate & Photoshop",
    year: 2025,
    location: "Studio Production",
    featured: true,
    published: true,
    views: 189,
    beforeImage: "",
    afterImage: "",
    createdAt: "2025-11-20T09:15:00Z",
    updatedAt: "2025-11-20T09:15:00Z"
  },
  {
    id: "proj-5",
    title: "Minimalist Film Poster Series",
    slug: "minimalist-film-poster-series",
    description: "A collection of alternative minimalist movie posters combining bold typography, negative space, and dual-tone vector geometry.",
    category: "Poster Design",
    subcategory: "Graphic Design",
    images: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200"
    ],
    video: "",
    thumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800",
    tags: ["Poster", "Minimalism", "Typography", "Branding", "Vector", "Design"],
    tools: ["Adobe Illustrator", "Figma", "Photoshop"],
    camera: "",
    lens: "",
    editingSoftware: "Adobe Illustrator & Figma",
    year: 2026,
    location: "Digital Work",
    featured: false,
    published: true,
    views: 142,
    beforeImage: "",
    afterImage: "",
    createdAt: "2026-01-15T11:00:00Z",
    updatedAt: "2026-01-15T11:00:00Z"
  },
  {
    id: "proj-6",
    title: "Cinematic YouTube Thumbnail Collection",
    slug: "cinematic-youtube-thumbnail-collection",
    description: "High CTR thumbnail designs created for tech and filmmaking creators with dynamic glow overlays and sharp subject cutouts.",
    category: "Thumbnail Design",
    subcategory: "Social Media",
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200"
    ],
    video: "",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
    tags: ["YouTube", "Thumbnail", "Graphic Design", "CTR", "Creator Economy"],
    tools: ["Photoshop", "Lightroom"],
    camera: "",
    lens: "",
    editingSoftware: "Adobe Photoshop 2026",
    year: 2026,
    location: "Digital Work",
    featured: false,
    published: true,
    views: 95,
    beforeImage: "",
    afterImage: "",
    createdAt: "2026-02-01T16:00:00Z",
    updatedAt: "2026-02-01T16:00:00Z"
  }
];

const DEFAULT_CATEGORIES: any[] = [
  { id: "cat-1", name: "Photography", slug: "photography", count: 2 },
  { id: "cat-2", name: "Photo Editing", slug: "photo-editing", count: 1 },
  { id: "cat-3", name: "Digital Art", slug: "digital-art", count: 1 },
  { id: "cat-4", name: "Poster Design", slug: "poster-design", count: 1 },
  { id: "cat-5", name: "Thumbnail Design", slug: "thumbnail-design", count: 1 }
];

const DEFAULT_TESTIMONIALS: any[] = [
  {
    id: "test-1",
    clientName: "Aarav Mehta",
    clientRole: "Creative Director",
    company: "Urban Canvas Agency",
    comment: "Paras has an incredible visual eye! The color grading on our studio fashion shoot transformed ordinary frames into high-fashion editorial gold.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    rating: 5,
    projectTitle: "Monsoon Portrait Series"
  },
  {
    id: "test-2",
    clientName: "Pooja Deshmukh",
    clientRole: "Brand Producer",
    company: "Deshmukh Films",
    comment: "The client proofing secret gallery system was effortless! Our couple selected their wedding album shots in 10 minutes right from their phone. Highly recommended!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    rating: 5,
    projectTitle: "Royal Palace Wedding Shoot"
  }
];

const DEFAULT_SETTINGS: any = {
  title: "FrameKatha",
  tagline: "Every Frame Tells a Story.",
  aboutText: "FrameKatha is a professional creative portfolio platform showcasing photography, digital art, color grading, poster design, and visual filmmaking created by Paras Aware.",
  socialLinks: {
    instagram: "https://instagram.com/framekatha",
    github: "https://github.com/parasaware30/Framekatha",
    linkedin: "https://linkedin.com/in/framekatha",
    youtube: "https://youtube.com/@framekatha",
    email: "parasaware05@gmail.com"
  },
  maintenanceMode: false,
  maintenanceMessage: "We're sprinkling some magic on FrameKatha ✨\nWe'll be back shortly — thank you for your patience! 🚀",
  showcaseVideo: "/videos/reel-1.mp4",
  showcaseVideoTitle: "Cinematic Visual Showreel",
  showcaseVideoSubtitle: "4K 60FPS Video Production, Visual Effects & Color Grading",
  showcaseVideoEnabled: true,
  showcaseVideos: [
    {
      id: "vid-1",
      url: "/videos/reel-1.mp4",
      title: "Cinematic Motion & Urban Flow",
      subtitle: "4K Street cinematography with natural depth of field and motion tracking",
      tag: "Motion Cinema"
    },
    {
      id: "vid-2",
      url: "/videos/reel-2.mp4",
      title: "Documentary Portrait & Atmosphere",
      subtitle: "High-contrast dynamic range capture with natural light transitions",
      tag: "Documentary"
    },
    {
      id: "vid-3",
      url: "/videos/reel-3.mp4",
      title: "Studio Headshot & Facial Optics",
      subtitle: "Commercial portrait cinematography with clean studio lighting",
      tag: "Studio Optics"
    },
    {
      id: "vid-4",
      url: "/videos/flower.mp4",
      title: "Macro Color & Nature Motion",
      subtitle: "Ultra-vibrant saturation profile with high framerate slow motion",
      tag: "Macro Nature"
    }
  ]
};

const DEFAULT_CLIENT_GALLERIES: any[] = [
  {
    id: "cg-88519c94",
    clientName: "Rohit & Priya Sharma",
    eventTitle: "Royal Palace Wedding Photoshoot",
    slug: "rohit-priya-wedding",
    passcode: "1234",
    eventDate: "28 Sep 2026",
    location: "Udaipur City Palace",
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200"
    ],
    instructions: "Please review your wedding shoot photos and tap the heart icon on your favorite shots for album selection.",
    allowDownload: true,
    watermarkEnabled: false,
    deadline: "",
    selectedImages: [],
    clientNotes: "",
    isFinalized: false,
    views: 4
  },
  {
    id: "cg-70e3a22c",
    clientName: "VIP Client Shoot",
    eventTitle: "Editorial & Portrait Shoot",
    slug: "dvss",
    passcode: "12345",
    eventDate: "30 Sep 2026",
    location: "Studio Production",
    coverImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200",
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200",
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200"
    ],
    instructions: "Please review the photos and tap the heart icon on your favorite shots for album selection.",
    allowDownload: true,
    watermarkEnabled: true,
    deadline: "",
    selectedImages: [],
    clientNotes: "",
    isFinalized: false,
    views: 6
  }
];

// ── LOCALSTORAGE HELPERS ───────────────────────────────────────────────────

function getLocalStore<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(`fk_store_${key}`);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setLocalStore<T>(key: string, val: T): void {
  try {
    localStorage.setItem(`fk_store_${key}`, JSON.stringify(val));
  } catch {
    // ignore
  }
}

// ── PROJECTS API ───────────────────────────────────────────────────────────

export async function fetchProjects(params?: {
  category?: string;
  tag?: string;
  year?: number;
  featured?: boolean;
  search?: string;
  sort_by?: string;
}) {
  try {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'All') query.append('category', params.category);
    if (params?.tag) query.append('tag', params.tag);
    if (params?.year) query.append('year', params.year.toString());
    if (params?.featured !== undefined) query.append('featured', params.featured.toString());
    if (params?.search) query.append('search', params.search);
    if (params?.sort_by) query.append('sort_by', params.sort_by);

    const res = await fetch(`${API_BASE_URL}/projects?${query.toString()}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map(cleanProjectData);
      }
    }
  } catch {
    // Backend offline / static host fallback
  }

  // Fallback
  let list = getLocalStore('projects', DEFAULT_PROJECTS);
  if (params?.category && params.category !== 'All') {
    list = list.filter((p: any) => p.category?.toLowerCase() === params.category?.toLowerCase());
  }
  if (params?.featured) {
    list = list.filter((p: any) => p.featured === true);
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    list = list.filter((p: any) =>
      p.title?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.tags?.some((t: string) => t.toLowerCase().includes(q))
    );
  }
  return list.map(cleanProjectData);
}

export async function fetchAllProjectsCMS() {
  try {
    const res = await fetch(`${API_BASE_URL}/projects/all-cms`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data.map(cleanProjectData);
    }
  } catch {
    // fallback
  }
  return getLocalStore('projects', DEFAULT_PROJECTS).map(cleanProjectData);
}

export async function fetchProjectBySlug(slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/projects/${slug}`);
    if (res.ok) {
      const data = await res.json();
      return cleanProjectData(data);
    }
  } catch {
    // fallback
  }
  const all = getLocalStore('projects', DEFAULT_PROJECTS);
  const found = all.find((p: any) => p.slug === slug || p.id === slug);
  if (!found) {
    return cleanProjectData(all[0] || DEFAULT_PROJECTS[0]);
  }
  return cleanProjectData(found);
}

export async function incrementProjectViews(projectId: string) {
  const today = new Date().toISOString().slice(0, 10);
  const storageKey = `fk_viewed_${projectId}_${today}`;
  if (localStorage.getItem(storageKey)) return;
  localStorage.setItem(storageKey, "1");

  try {
    await fetch(`${API_BASE_URL}/projects/${projectId}/views`, { method: 'POST' });
  } catch {
    // increment locally
    const all = getLocalStore('projects', DEFAULT_PROJECTS);
    const proj = all.find((p: any) => p.id === projectId);
    if (proj) {
      proj.views = (proj.views || 0) + 1;
      setLocalStore('projects', all);
    }
  }
}

export async function toggleProjectLike(projectId: string, action: 'like' | 'unlike' = 'like') {
  try {
    const res = await fetch(`${API_BASE_URL}/projects/${projectId}/like?action=${action}`, { method: 'POST' });
    if (res.ok) return res.json();
  } catch {
    // local fallback
  }
  const all = getLocalStore('projects', DEFAULT_PROJECTS);
  const proj = all.find((p: any) => p.id === projectId);
  if (proj) {
    proj.likes = Math.max(0, (proj.likes || 0) + (action === 'like' ? 1 : -1));
    setLocalStore('projects', all);
    return { success: true, likes: proj.likes };
  }
  return { success: true, likes: 1 };
}

export async function fetchProjectComments(projectId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/projects/${projectId}/comments`);
    if (res.ok) return res.json();
  } catch {
    // fallback
  }
  return getLocalStore(`comments_${projectId}`, []);
}

export async function addProjectComment(projectId: string, data: { name?: string; comment: string }) {
  try {
    const res = await fetch(`${API_BASE_URL}/projects/${projectId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) return res.json();
  } catch {
    // fallback
  }
  const existing = getLocalStore(`comments_${projectId}`, []);
  const newComment = {
    id: `com-${Date.now()}`,
    name: data.name || "Anonymous Visitor",
    comment: data.comment,
    createdAt: new Date().toISOString()
  };
  existing.unshift(newComment);
  setLocalStore(`comments_${projectId}`, existing);
  return newComment;
}

export async function deleteProjectComment(projectId: string, commentId: string) {
  try {
    await fetch(`${API_BASE_URL}/projects/${projectId}/comments/${commentId}`, { method: 'DELETE' });
  } catch {
    // fallback
  }
  const existing = getLocalStore(`comments_${projectId}`, []);
  setLocalStore(`comments_${projectId}`, existing.filter((c: any) => c.id !== commentId));
  return { success: true };
}

export async function createProject(data: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) return res.json();
  } catch {
    // fallback
  }
  const all = getLocalStore('projects', DEFAULT_PROJECTS);
  const newProj = {
    ...data,
    id: `proj-${Date.now().toString(36)}`,
    views: 0,
    likes: 0,
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  all.unshift(newProj);
  setLocalStore('projects', all);
  return newProj;
}

export async function updateProject(id: string, data: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) return res.json();
  } catch {
    // fallback
  }
  const all = getLocalStore('projects', DEFAULT_PROJECTS);
  const idx = all.findIndex((p: any) => p.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...data, updatedAt: new Date().toISOString() };
    setLocalStore('projects', all);
    return all[idx];
  }
  return data;
}

export async function deleteProject(id: string) {
  try {
    await fetch(`${API_BASE_URL}/projects/${id}`, { method: 'DELETE' });
  } catch {
    // fallback
  }
  const all = getLocalStore('projects', DEFAULT_PROJECTS);
  setLocalStore('projects', all.filter((p: any) => p.id !== id));
  return { success: true };
}

// ── CATEGORIES ─────────────────────────────────────────────────────────────

export async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`);
    if (res.ok) return res.json();
  } catch {
    // fallback
  }
  return getLocalStore('categories', DEFAULT_CATEGORIES);
}

export async function createCategory(data: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) return res.json();
  } catch {
    // fallback
  }
  const all = getLocalStore('categories', DEFAULT_CATEGORIES);
  const newCat = { ...data, id: `cat-${Date.now().toString(36)}`, count: 0 };
  all.push(newCat);
  setLocalStore('categories', all);
  return newCat;
}

export async function deleteCategory(id: string) {
  try {
    await fetch(`${API_BASE_URL}/categories/${id}`, { method: 'DELETE' });
  } catch {
    // fallback
  }
  const all = getLocalStore('categories', DEFAULT_CATEGORIES);
  setLocalStore('categories', all.filter((c: any) => c.id !== id));
  return { success: true };
}

// ── TESTIMONIALS ───────────────────────────────────────────────────────────

export async function fetchTestimonials() {
  try {
    const res = await fetch(`${API_BASE_URL}/testimonials`);
    if (res.ok) return res.json();
  } catch {
    // fallback
  }
  return getLocalStore('testimonials', DEFAULT_TESTIMONIALS);
}

export async function createTestimonial(data: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) return res.json();
  } catch {
    // fallback
  }
  const all = getLocalStore('testimonials', DEFAULT_TESTIMONIALS);
  const newTest = { ...data, id: `test-${Date.now().toString(36)}` };
  all.push(newTest);
  setLocalStore('testimonials', all);
  return newTest;
}

export async function deleteTestimonial(id: string) {
  try {
    await fetch(`${API_BASE_URL}/testimonials/${id}`, { method: 'DELETE' });
  } catch {
    // fallback
  }
  const all = getLocalStore('testimonials', DEFAULT_TESTIMONIALS);
  setLocalStore('testimonials', all.filter((t: any) => t.id !== id));
  return { success: true };
}

// ── MESSAGES (CONTACT FORM) ────────────────────────────────────────────────

export async function fetchMessages() {
  try {
    const res = await fetch(`${API_BASE_URL}/messages`);
    if (res.ok) return res.json();
  } catch {
    // fallback
  }
  return getLocalStore('messages', []);
}

export async function sendMessage(data: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) return res.json();
  } catch {
    // fallback
  }
  const all = getLocalStore('messages', []);
  const newMsg = {
    ...data,
    id: `msg-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  all.unshift(newMsg);
  setLocalStore('messages', all);
  return { success: true, message: "Aapka message Paras Aware ko successfully bhej diya gaya hai! 🚀" };
}

export async function deleteMessage(id: string) {
  try {
    await fetch(`${API_BASE_URL}/messages/${id}`, { method: 'DELETE' });
  } catch {
    // fallback
  }
  const all = getLocalStore('messages', []);
  setLocalStore('messages', all.filter((m: any) => m.id !== id));
  return { success: true };
}

// ── ANALYTICS ──────────────────────────────────────────────────────────────

export async function fetchAnalytics() {
  try {
    const res = await fetch(`${API_BASE_URL}/analytics`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.overview) return data;
    }
  } catch {
    // fallback
  }
  const projects = getLocalStore('projects', DEFAULT_PROJECTS);
  const categories = getLocalStore('categories', DEFAULT_CATEGORIES);
  const totalViews = projects.reduce((sum: number, p: any) => sum + (p.views || 0), 0);
  const featuredCount = projects.filter((p: any) => p.featured === true).length;
  const sorted = [...projects].sort((a: any, b: any) => (b.views || 0) - (a.views || 0));
  const mostViewed = sorted[0] || { title: "Ganpati bappa morya", views: 128 };

  const categoryViews = categories.map((c: any) => {
    const views = projects
      .filter((p: any) => p.category?.toLowerCase() === c.name?.toLowerCase())
      .reduce((sum: number, p: any) => sum + (p.views || 0), 0);
    return { category: c.name, views: views || 50 };
  });

  return {
    overview: {
      totalProjects: projects.length,
      totalViews: totalViews || 885,
      featuredProjects: featuredCount || 4,
      categoriesCount: categories.length,
      mostViewedProject: {
        title: mostViewed.title || "Ganpati bappa morya",
        views: mostViewed.views || 312
      }
    },
    categoryViews: categoryViews,
    timeline: [
      { month: "May", views: 95 },
      { month: "Jun", views: 140 },
      { month: "Jul", views: 210 },
      { month: "Aug", views: 280 },
      { month: "Sep", views: 340 },
      { month: "Oct", views: totalViews || 420 }
    ],
    devices: [
      { name: "Desktop / Laptop", percentage: 55 },
      { name: "Mobile Devices", percentage: 40 },
      { name: "Tablet", percentage: 5 }
    ],
    recentEvents: []
  };
}

// ── SITE SETTINGS ──────────────────────────────────────────────────────────

export async function fetchSiteSettings() {
  try {
    const res = await fetch(`${API_BASE_URL}/settings`);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch {
    // fallback
  }
  return getLocalStore('settings', DEFAULT_SETTINGS);
}

export async function updateSiteSettings(data: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) return res.json();
  } catch {
    // fallback
  }
  setLocalStore('settings', data);
  return data;
}

// ── AI ASSISTANT ───────────────────────────────────────────────────────────

export async function aiSearch(query: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    if (res.ok) return res.json();
  } catch {
    // fallback
  }
  return {
    summary: `Search results for "${query}" across FrameKatha Photography & Design projects.`,
    projects: getLocalStore('projects', DEFAULT_PROJECTS).slice(0, 3)
  };
}

export async function aiChat(
  message: string,
  history: { role: string; content: string }[] = [],
  imageUrl?: string
) {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, imageUrl }),
    });
    if (res.ok) return res.json();
  } catch {
    // fallback
  }
  return {
    reply: `Hello! I am FrameKatha AI Assistant. Paras Aware specializes in cinematic photography, before/after color grading, and creative poster designs. How can I help you today?`
  };
}

export async function aiEditImage(image: string, prompt: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/edit-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image, prompt }),
    });
    if (res.ok) return res.json();
  } catch {
    // fallback
  }
  return { editedImage: image, message: "AI image adjustment preview generated." };
}

export async function aiSuggestMetadata(data: { prompt?: string; title?: string; description?: string; imageUrl?: string }) {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/suggest-metadata`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) return res.json();
  } catch {
    // fallback
  }
  return {
    title: data.title || "Cinematic Visual Story",
    description: data.description || "Capturing timeless atmospheric emotions with dynamic color grading and cinematic composition.",
    tags: ["Cinematic", "Portrait", "Color Grading", "Photography", "Visual Art"]
  };
}

// ── FILE UPLOADS ───────────────────────────────────────────────────────────

export async function uploadFile(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      return cleanMediaUrl(data.url);
    }
  } catch {
    // local fallback using URL.createObjectURL or data URL
  }
  return URL.createObjectURL(file);
}

export async function uploadMultipleFiles(
  files: FileList | File[],
  onProgress?: (completed: number, total: number) => void
): Promise<string[]> {
  const rawArray = Array.from(files);
  const fileArray = rawArray.filter((f) => {
    const name = f.name || '';
    return !name.startsWith('.') && name !== 'Thumbs.db' && name !== 'desktop.ini';
  });

  if (fileArray.length === 0) return [];

  const results: string[] = [];
  const chunkSize = 3;
  let completed = 0;

  for (let i = 0; i < fileArray.length; i += chunkSize) {
    const chunk = fileArray.slice(i, i + chunkSize);
    const chunkPromises = chunk.map(async (file) => {
      try {
        const url = await uploadFile(file);
        completed++;
        if (onProgress) onProgress(completed, fileArray.length);
        return url;
      } catch (err) {
        console.warn(`File upload failed for ${file.name}:`, err);
        return null;
      }
    });

    const chunkResults = await Promise.all(chunkPromises);
    chunkResults.forEach((url) => {
      if (url) results.push(url);
    });
  }

  return results;
}

// ── CLIENT PROOFING & SECRET GALLERIES ─────────────────────────────────────

export async function fetchClientGalleries(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/client-galleries`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data.map((g: any) => ({
          ...g,
          coverImage: cleanMediaUrl(g.coverImage),
          images: Array.isArray(g.images) ? g.images.map(cleanMediaUrl) : [],
          selectedImages: Array.isArray(g.selectedImages) ? g.selectedImages.map(cleanMediaUrl) : []
        }));
      }
    }
  } catch {
    // fallback
  }

  const list = getLocalStore('client_galleries', DEFAULT_CLIENT_GALLERIES);
  return list.map((g: any) => ({
    ...g,
    coverImage: cleanMediaUrl(g.coverImage),
    images: Array.isArray(g.images) ? g.images.map(cleanMediaUrl) : [],
    selectedImages: Array.isArray(g.selectedImages) ? g.selectedImages.map(cleanMediaUrl) : []
  }));
}

export async function createClientGallery(data: any): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/client-galleries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) return res.json();
  } catch {
    // fallback
  }
  const all = getLocalStore('client_galleries', DEFAULT_CLIENT_GALLERIES);
  const newGal = {
    ...data,
    id: `cg-${Date.now().toString(36)}`,
    views: 0,
    selectedImages: [],
    clientNotes: "",
    isFinalized: false,
    createdAt: new Date().toISOString()
  };
  all.unshift(newGal);
  setLocalStore('client_galleries', all);
  return newGal;
}

export async function updateClientGallery(id: string, data: any): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/client-galleries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) return res.json();
  } catch {
    // fallback
  }
  const all = getLocalStore('client_galleries', DEFAULT_CLIENT_GALLERIES);
  const idx = all.findIndex((g: any) => g.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...data, updatedAt: new Date().toISOString() };
    setLocalStore('client_galleries', all);
    return all[idx];
  }
  return data;
}

export async function deleteClientGallery(id: string): Promise<any> {
  try {
    await fetch(`${API_BASE_URL}/client-galleries/${id}`, { method: 'DELETE' });
  } catch {
    // fallback
  }
  const all = getLocalStore('client_galleries', DEFAULT_CLIENT_GALLERIES);
  setLocalStore('client_galleries', all.filter((g: any) => g.id !== id));
  return { success: true };
}

export async function fetchGalleryPublicMeta(slug: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/client-galleries/info/${slug}`);
    if (res.ok) {
      const data = await res.json();
      return { ...data, coverImage: cleanMediaUrl(data.coverImage) };
    }
  } catch {
    // fallback
  }
  const all = getLocalStore('client_galleries', DEFAULT_CLIENT_GALLERIES);
  const found = all.find((g: any) => g.slug === slug || g.id === slug) || all[0];
  return {
    clientName: found.clientName,
    eventTitle: found.eventTitle,
    slug: found.slug,
    eventDate: found.eventDate,
    location: found.location,
    coverImage: cleanMediaUrl(found.coverImage),
    photoCount: found.images?.length || 0,
    hasPasscode: true
  };
}

export async function verifyClientPasscode(slug: string, passcode: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/client-galleries/access/${slug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode }),
    });
    if (res.ok) {
      const data = await res.json();
      return {
        ...data,
        coverImage: cleanMediaUrl(data.coverImage),
        images: Array.isArray(data.images) ? data.images.map(cleanMediaUrl) : [],
        selectedImages: Array.isArray(data.selectedImages) ? data.selectedImages.map(cleanMediaUrl) : []
      };
    }
  } catch {
    // fallback
  }

  const all = getLocalStore('client_galleries', DEFAULT_CLIENT_GALLERIES);
  const found = all.find((g: any) => g.slug === slug || g.id === slug);
  if (!found) {
    throw new Error('Secret gallery not found.');
  }
  if (found.passcode !== passcode.trim()) {
    throw new Error('Galat passcode! Dobara koshish karein.');
  }

  return {
    ...found,
    coverImage: cleanMediaUrl(found.coverImage),
    images: Array.isArray(found.images) ? found.images.map(cleanMediaUrl) : [],
    selectedImages: Array.isArray(found.selectedImages) ? found.selectedImages.map(cleanMediaUrl) : []
  };
}

export async function toggleClientImageSelect(slug: string, imageUrl: string, selected: boolean): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/client-galleries/${slug}/toggle-select`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl, selected }),
    });
    if (res.ok) return res.json();
  } catch {
    // fallback
  }

  const all = getLocalStore('client_galleries', DEFAULT_CLIENT_GALLERIES);
  const found = all.find((g: any) => g.slug === slug || g.id === slug);
  if (found) {
    found.selectedImages = found.selectedImages || [];
    if (selected && !found.selectedImages.includes(imageUrl)) {
      found.selectedImages.push(imageUrl);
    } else if (!selected) {
      found.selectedImages = found.selectedImages.filter((u: string) => u !== imageUrl);
    }
    setLocalStore('client_galleries', all);
    return { success: true, selectedImages: found.selectedImages };
  }
  return { success: true };
}

export async function submitClientFeedback(slug: string, clientNotes: string, selectedImages: string[]): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/client-galleries/${slug}/submit-feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientNotes, selectedImages }),
    });
    if (res.ok) return res.json();
  } catch {
    // fallback
  }

  const all = getLocalStore('client_galleries', DEFAULT_CLIENT_GALLERIES);
  const found = all.find((g: any) => g.slug === slug || g.id === slug);
  if (found) {
    found.clientNotes = clientNotes;
    found.selectedImages = selectedImages;
    found.isFinalized = true;
    setLocalStore('client_galleries', all);
  }
  return { success: true, message: "Feedback submitted successfully." };
}
