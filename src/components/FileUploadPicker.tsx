import { useState, useRef } from "react";
import { Upload, FileImage, Film, X, Check, Loader2, HardDrive, Plus, FolderUp } from "lucide-react";
import { uploadFile, uploadMultipleFiles, cleanMediaUrl } from "@/lib/api";

interface FileUploadPickerProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  multiple?: boolean;
  onMultipleChange?: (urls: string[]) => void;
  onFolderNameDetected?: (folderName: string) => void;
  hint?: string;
  isVideo?: boolean;
  folderOnly?: boolean;
  photosOnly?: boolean;
  hideThumbnails?: boolean;
}

export function FileUploadPicker({
  label,
  value = "",
  onChange,
  accept = "image/*",
  multiple = false,
  onMultipleChange,
  onFolderNameDetected,
  hint,
  isVideo = false,
  folderOnly = false,
  photosOnly = false,
  hideThumbnails = false,
}: FileUploadPickerProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ completed: number; total: number } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Parse comma-separated list of image URLs for multiple mode
  const fileList = value
    ? value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const handleFilesSelected = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    // Detect folder name from webkitRelativePath if uploaded as a folder
    if (files.length > 0 && onFolderNameDetected) {
      const relPath = (files[0] as any).webkitRelativePath;
      if (relPath) {
        const topDir = relPath.split("/")[0];
        if (topDir) {
          onFolderNameDetected(topDir.replace(/[_-]+/g, " ").trim());
        }
      }
    }

    setUploading(true);
    setUploadProgress(null);
    try {
      if (multiple) {
        const newUrls = await uploadMultipleFiles(files, (completed, total) => {
          setUploadProgress({ completed, total });
        });
        const combined = Array.from(new Set([...fileList, ...newUrls]));
        if (onMultipleChange) {
          onMultipleChange(combined);
        } else {
          onChange(combined.join(", "));
        }
      } else {
        const url = await uploadFile(files[0]);
        onChange(url);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload file(s). Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (folderInputRef.current) folderInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFilesSelected(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleRemoveItem = (indexToRemove: number) => {
    const updated = fileList.filter((_, idx) => idx !== indexToRemove);
    if (multiple && onMultipleChange) {
      onMultipleChange(updated);
    } else {
      onChange(updated.join(", "));
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          {folderOnly ? (
            <FolderUp className="size-3.5 text-purple-400" />
          ) : isVideo ? (
            <Film className="size-3.5 text-purple-400" />
          ) : (
            <FileImage className="size-3.5 text-cyan-400" />
          )}
          {label}
        </label>
        {multiple && !hideThumbnails && fileList.length > 0 && (
          <span className="text-[11px] font-mono text-cyan-400">
            {fileList.length} {fileList.length === 1 ? "File" : "Files"} Uploaded
          </span>
        )}
      </div>

      <div className="space-y-2">
        {/* Hidden File Input for Individual / Multiple Photos (Rendered unless folderOnly) */}
        {!folderOnly && (
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
            className="hidden"
          />
        )}

        {/* Hidden File Input for ENTIRE FOLDER Selection (Rendered unless photosOnly) */}
        {!photosOnly && (multiple || folderOnly) && (
          <input
            ref={folderInputRef}
            type="file"
            multiple
            {...({ webkitdirectory: "", directory: "" } as any)}
            onChange={handleFileChange}
            className="hidden"
          />
        )}

        {/* Case 1: Multiple Upload Mode with Existing Files (when not hidden) */}
        {multiple && fileList.length > 0 && !hideThumbnails ? (
          <div className="space-y-3 p-4 rounded-2xl bg-white/2 border border-white/10">
            {/* Thumbnails Grid */}
            <div className="flex flex-wrap gap-3 items-center">
              {fileList.map((url, idx) => (
                <div
                  key={idx}
                  className="relative group size-20 rounded-xl overflow-hidden bg-black border border-cyan-500/30 shrink-0 shadow-lg"
                >
                  <img
                    src={cleanMediaUrl(url)}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-red-600/90 text-white opacity-90 hover:opacity-100 hover:scale-110 transition-all cursor-pointer shadow-md"
                    title="Remove this photo"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}

              {/* Add More Files Button Card (Photos mode) */}
              {!folderOnly && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="size-20 rounded-xl border-2 border-dashed border-cyan-500/50 hover:border-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 flex flex-col items-center justify-center gap-1 text-cyan-300 transition-all cursor-pointer shrink-0"
                  title="Select more individual photos"
                >
                  {uploading ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <>
                      <Plus className="size-5 text-cyan-400" />
                      <span className="text-[9px] font-bold uppercase">Add Photos</span>
                    </>
                  )}
                </button>
              )}

              {/* Upload Entire Folder Button Card (Folder mode) */}
              {!photosOnly && (
                <button
                  type="button"
                  onClick={() => folderInputRef.current?.click()}
                  disabled={uploading}
                  className="size-20 rounded-xl border-2 border-dashed border-purple-500/50 hover:border-purple-400 bg-purple-500/10 hover:bg-purple-500/20 flex flex-col items-center justify-center gap-1 text-purple-300 transition-all cursor-pointer shrink-0"
                  title="Upload entire folder from This PC"
                >
                  {uploading ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <>
                      <FolderUp className="size-5 text-purple-400" />
                      <span className="text-[9px] font-bold uppercase text-center leading-tight">Upload Folder</span>
                    </>
                  )}
                </button>
              )}
            </div>
            {hint && <span className="text-[10px] text-slate-400 block">{hint}</span>}
          </div>
        ) : !multiple && !folderOnly && value ? (
          /* Case 2: Single File Mode with Uploaded Value */
          <div className="relative group rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-900/80 p-2 flex items-center gap-3">
            <div className="size-14 rounded-xl overflow-hidden bg-black shrink-0 border border-white/10">
              {isVideo ? (
                <video src={cleanMediaUrl(value)} className="w-full h-full object-cover" />
              ) : (
                <img
                  src={cleanMediaUrl(value)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200";
                  }}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-cyan-400 truncate flex items-center gap-1">
                <Check className="size-3 text-emerald-400" /> File Uploaded Successfully
              </p>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">{value}</p>
            </div>
            <div className="flex items-center gap-2 pr-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 text-[10px] font-semibold hover:bg-cyan-500/30 transition-colors cursor-pointer flex items-center gap-1"
              >
                <HardDrive className="size-3" /> Change
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="p-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors cursor-pointer"
                title="Remove file"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Case 3: Empty Dropzone / Dedicated Mode Uploader */
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center gap-3 ${
              dragActive
                ? folderOnly
                  ? "border-purple-400 bg-purple-500/10 scale-[1.01]"
                  : "border-cyan-400 bg-cyan-500/10 scale-[1.01]"
                : folderOnly
                ? "border-purple-500/30 bg-purple-950/10 hover:border-purple-400 hover:bg-purple-950/20"
                : "border-white/15 bg-white/3 hover:border-cyan-500/50 hover:bg-white/5"
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2 py-4">
                <Loader2 className={`size-8 animate-spin ${folderOnly ? "text-purple-400" : "text-cyan-400"}`} />
                <span className={`text-xs font-semibold ${folderOnly ? "text-purple-300" : "text-cyan-300"}`}>
                  {uploadProgress
                    ? `Uploading photo ${uploadProgress.completed} of ${uploadProgress.total} (${Math.round((uploadProgress.completed / uploadProgress.total) * 100)}%)...`
                    : folderOnly
                    ? "Processing and uploading folder photos..."
                    : "Uploading selected photo files..."}
                </span>
                {uploadProgress && uploadProgress.total > 1 && (
                  <div className="w-56 h-2 rounded-full bg-white/10 overflow-hidden mt-1.5 p-0.5 border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-300"
                      style={{ width: `${Math.round((uploadProgress.completed / uploadProgress.total) * 100)}%` }}
                    />
                  </div>
                )}
              </div>
            ) : folderOnly ? (
              /* Specific UI for FOLDER ONLY Uploader */
              <>
                <div className="size-12 rounded-2xl bg-purple-500/15 border border-purple-500/40 grid place-items-center text-purple-300 shadow-lg">
                  <FolderUp className="size-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    Upload Entire PC Folder
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    Select a local folder on your computer. All photos inside will be uploaded and added to this album.
                  </p>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => folderInputRef.current?.click()}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]"
                  >
                    <FolderUp className="size-4 text-purple-200" />
                    <span>📁 Choose Local PC Folder to Upload</span>
                  </button>
                </div>

                {hint && <span className="text-[10px] text-purple-300/70 mt-1">{hint}</span>}
              </>
            ) : photosOnly ? (
              /* Specific UI for PHOTOS ONLY Uploader */
              <>
                <div className="size-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 grid place-items-center text-cyan-300 shadow-lg">
                  <FileImage className="size-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    Upload Photo Files
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    Select one or multiple photo files from your computer storage or camera roll.
                  </p>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]"
                  >
                    <HardDrive className="size-4" />
                    <span>📷 Choose Photo Files</span>
                  </button>
                </div>

                {hint && <span className="text-[10px] text-cyan-300/70 mt-1">{hint}</span>}
              </>
            ) : (
              /* Default Generic Mode */
              <>
                <div className="size-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 grid place-items-center text-cyan-400 shadow-md">
                  <Upload className="size-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    Upload Media Files
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Drag &amp; drop files here, or click the button below:
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                  >
                    <HardDrive className="size-4" />
                    <span>Choose Photos / Files</span>
                  </button>

                  {multiple && (
                    <button
                      type="button"
                      onClick={() => folderInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                    >
                      <FolderUp className="size-4 text-purple-400" />
                      <span>📁 Upload Entire Folder</span>
                    </button>
                  )}
                </div>

                {hint && <span className="text-[10px] text-slate-500 mt-1">{hint}</span>}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
