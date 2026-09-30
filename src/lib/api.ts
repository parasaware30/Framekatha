const API_BASE_URL = '/api';

export function cleanMediaUrl(url: any): string {
  if (typeof url !== 'string' || !url) return '';
  // Convert hardcoded localhost or 127.0.0.1 URLs into proper relative URLs
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

export async function fetchProjects(params?: {
  category?: string;
  tag?: string;
  year?: number;
  featured?: boolean;
  search?: string;
  sort_by?: string;
}) {
  const query = new URLSearchParams();
  if (params?.category && params.category !== 'All') query.append('category', params.category);
  if (params?.tag) query.append('tag', params.tag);
  if (params?.year) query.append('year', params.year.toString());
  if (params?.featured !== undefined) query.append('featured', params.featured.toString());
  if (params?.search) query.append('search', params.search);
  if (params?.sort_by) query.append('sort_by', params.sort_by);

  const res = await fetch(`${API_BASE_URL}/projects?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  const data = await res.json();
  return Array.isArray(data) ? data.map(cleanProjectData) : data;
}

export async function fetchAllProjectsCMS() {
  const res = await fetch(`${API_BASE_URL}/projects/all-cms`);
  if (!res.ok) throw new Error('Failed to fetch CMS projects');
  const data = await res.json();
  return Array.isArray(data) ? data.map(cleanProjectData) : data;
}

export async function fetchProjectBySlug(slug: string) {
  const res = await fetch(`${API_BASE_URL}/projects/${slug}`);
  if (!res.ok) throw new Error('Project not found');
  const data = await res.json();
  return cleanProjectData(data);
}

export async function incrementProjectViews(projectId: string) {
  // ── Client-side deduplication ──────────────────────────────────────────
  // Only call the API once per project per calendar day per browser.
  // This prevents view inflation from page refreshes on the same device.
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const storageKey = `fk_viewed_${projectId}_${today}`;
  if (localStorage.getItem(storageKey)) {
    return; // Already counted today from this browser — skip
  }
  localStorage.setItem(storageKey, "1");

  // Cleanup old keys (> 3 days) to avoid localStorage bloat
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("fk_viewed_"))
      .forEach((k) => {
        const parts = k.split("_");
        const keyDate = parts[parts.length - 1]; // last segment is the date
        if (keyDate < new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10)) {
          localStorage.removeItem(k);
        }
      });
  } catch {
    // ignore storage errors
  }

  try {
    const res = await fetch(`${API_BASE_URL}/projects/${projectId}/views`, { method: 'POST' });
    return res.json();
  } catch (e) {
    console.error('Failed to increment view count:', e);
    // Roll back localStorage flag so it retries next load if network was down
    localStorage.removeItem(storageKey);
  }
}


export async function toggleProjectLike(projectId: string, action: 'like' | 'unlike' = 'like') {
  try {
    const res = await fetch(`${API_BASE_URL}/projects/${projectId}/like?action=${action}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to update like');
    return res.json();
  } catch (e) {
    console.error('Failed to toggle like:', e);
    throw e;
  }
}

export async function fetchProjectComments(projectId: string) {
  const res = await fetch(`${API_BASE_URL}/projects/${projectId}/comments`);
  if (!res.ok) throw new Error('Failed to fetch comments');
  return res.json();
}

export async function addProjectComment(projectId: string, data: { name?: string; comment: string }) {
  const res = await fetch(`${API_BASE_URL}/projects/${projectId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || 'Failed to post comment');
  }
  return res.json();
}

export async function deleteProjectComment(projectId: string, commentId: string) {
  const res = await fetch(`${API_BASE_URL}/projects/${projectId}/comments/${commentId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete comment');
  return res.json();
}

export async function createProject(data: any) {
  const res = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    const detailMsg = errBody?.detail ? (typeof errBody.detail === 'object' ? JSON.stringify(errBody.detail) : errBody.detail) : 'Failed to create project';
    throw new Error(detailMsg);
  }
  return res.json();
}

export async function updateProject(id: string, data: any) {
  const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    const detailMsg = errBody?.detail ? (typeof errBody.detail === 'object' ? JSON.stringify(errBody.detail) : errBody.detail) : 'Failed to update project';
    throw new Error(detailMsg);
  }
  return res.json();
}

export async function deleteProject(id: string) {
  const res = await fetch(`${API_BASE_URL}/projects/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete project');
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE_URL}/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function createCategory(data: any) {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create category');
  return res.json();
}

export async function deleteCategory(id: string) {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete category');
  return res.json();
}

export async function fetchTestimonials() {
  const res = await fetch(`${API_BASE_URL}/testimonials`);
  if (!res.ok) throw new Error('Failed to fetch testimonials');
  return res.json();
}

export async function createTestimonial(data: any) {
  const res = await fetch(`${API_BASE_URL}/testimonials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create testimonial');
  return res.json();
}

export async function deleteTestimonial(id: string) {
  const res = await fetch(`${API_BASE_URL}/testimonials/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete testimonial');
  return res.json();
}

export async function fetchMessages() {
  const res = await fetch(`${API_BASE_URL}/messages`);
  if (!res.ok) throw new Error('Failed to fetch messages');
  return res.json();
}

export async function sendMessage(data: any) {
  const res = await fetch(`${API_BASE_URL}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to send message');
  return res.json();
}

export async function deleteMessage(id: string) {
  const res = await fetch(`${API_BASE_URL}/messages/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete message');
  return res.json();
}

export async function fetchAnalytics() {
  const res = await fetch(`${API_BASE_URL}/analytics`);
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

export async function fetchSiteSettings() {
  const res = await fetch(`${API_BASE_URL}/settings`);
  if (!res.ok) throw new Error('Failed to fetch site settings');
  return res.json();
}

export async function updateSiteSettings(data: any) {
  const res = await fetch(`${API_BASE_URL}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update site settings');
  return res.json();
}

export async function aiSearch(query: string) {
  const res = await fetch(`${API_BASE_URL}/ai/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error('AI search failed');
  return res.json();
}

export async function aiChat(
  message: string,
  history: { role: string; content: string }[] = [],
  imageUrl?: string
) {
  const res = await fetch(`${API_BASE_URL}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, imageUrl }),
  });
  if (!res.ok) throw new Error('Gemini AI Chat failed');
  return res.json();
}

export async function aiEditImage(image: string, prompt: string) {
  const res = await fetch(`${API_BASE_URL}/ai/edit-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image, prompt }),
  });
  if (!res.ok) throw new Error('AI image edit failed');
  return res.json();
}



export async function aiSuggestMetadata(data: { prompt?: string; title?: string; description?: string; imageUrl?: string }) {
  const res = await fetch(`${API_BASE_URL}/ai/suggest-metadata`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('AI metadata suggestion failed');
  return res.json();
}

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    throw new Error(`Upload failed for ${file.name}`);
  }
  const data = await res.json();
  return cleanMediaUrl(data.url);
}

export async function uploadMultipleFiles(
  files: FileList | File[],
  onProgress?: (completed: number, total: number) => void
): Promise<string[]> {
  const rawArray = Array.from(files);
  // Filter out system and hidden files
  const fileArray = rawArray.filter((f) => {
    const name = f.name || '';
    return !name.startsWith('.') && name !== 'Thumbs.db' && name !== 'desktop.ini';
  });

  if (fileArray.length === 0) return [];

  const results: string[] = [];
  const chunkSize = 3; // Upload 3 files concurrently to ensure fast and stable uploads
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

// ── Client Proofing & Secret Galleries API ─────────────────────────────────

export async function fetchClientGalleries(): Promise<any[]> {
  const res = await fetch(`${API_BASE_URL}/client-galleries`);
  if (!res.ok) throw new Error('Failed to fetch client galleries');
  const data = await res.json();
  return Array.isArray(data)
    ? data.map((g: any) => ({
        ...g,
        coverImage: cleanMediaUrl(g.coverImage),
        images: Array.isArray(g.images) ? g.images.map(cleanMediaUrl) : [],
        selectedImages: Array.isArray(g.selectedImages) ? g.selectedImages.map(cleanMediaUrl) : []
      }))
    : [];
}

export async function createClientGallery(data: any): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/client-galleries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create client gallery');
  return res.json();
}

export async function updateClientGallery(id: string, data: any): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/client-galleries/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update client gallery');
  return res.json();
}

export async function deleteClientGallery(id: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/client-galleries/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete client gallery');
  return res.json();
}

export async function fetchGalleryPublicMeta(slug: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/client-galleries/info/${slug}`);
  if (!res.ok) throw new Error('Client gallery not found');
  const data = await res.json();
  return {
    ...data,
    coverImage: cleanMediaUrl(data.coverImage)
  };
}

export async function verifyClientPasscode(slug: string, passcode: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/client-galleries/access/${slug}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Passcode verification failed' }));
    throw new Error(err.detail || 'Galat passcode! Dobara koshish karein.');
  }
  const data = await res.json();
  return {
    ...data,
    coverImage: cleanMediaUrl(data.coverImage),
    images: Array.isArray(data.images) ? data.images.map(cleanMediaUrl) : [],
    selectedImages: Array.isArray(data.selectedImages) ? data.selectedImages.map(cleanMediaUrl) : []
  };
}

export async function toggleClientImageSelect(slug: string, imageUrl: string, selected: boolean): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/client-galleries/${slug}/toggle-select`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageUrl, selected }),
  });
  if (!res.ok) throw new Error('Failed to update selection');
  return res.json();
}

export async function submitClientFeedback(slug: string, clientNotes: string, selectedImages: string[]): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/client-galleries/${slug}/submit-feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientNotes, selectedImages }),
  });
  if (!res.ok) throw new Error('Failed to submit feedback');
  return res.json();
}


