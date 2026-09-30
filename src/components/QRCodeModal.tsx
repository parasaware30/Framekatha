import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import {
  QrCode,
  X,
  Download,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Globe,
  Folder,
  Send,
  Sparkles,
  Smartphone
} from "lucide-react";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  projectUrl?: string;
  folderName?: string;
  /** Pass true when this QR is specifically for a folder — adds ?open=folder to auto-open it on scan */
  isFolderQR?: boolean;
}

export function QRCodeModal({
  isOpen,
  onClose,
  title = "FrameKatha Cinematic Studio",
  projectUrl,
  folderName,
  isFolderQR = false
}: QRCodeModalProps) {
  // Always use window.location.origin which preserves the real IP on LAN.
  // e.g. if user opened via http://192.168.1.10:5173, origin = "http://192.168.1.10:5173"
  // This makes QR codes scannable by phones on the same WiFi.
  const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:5173";

  // Build the full project URL.
  // If it's a folder QR, append ?open=folder so the page auto-opens the folder panel on scan.
  const buildProjectUrl = () => {
    if (!projectUrl) return "";
    const base = projectUrl.startsWith("http")
      ? projectUrl
      : `${origin}${projectUrl.startsWith("/") ? "" : "/"}${projectUrl}`;
    if (isFolderQR || folderName) {
      return `${base}${base.includes("?") ? "&" : "?"}open=folder`;
    }
    return base;
  };

  const fullProjectUrl = buildProjectUrl();
  const websiteHomeUrl = `${origin}/`;
  const portfolioUrl = `${origin}/portfolio`;

  // Default to project URL if available, else website home
  const [activeTab, setActiveTab] = useState<"project" | "website" | "portfolio">(
    projectUrl ? "project" : "website"
  );
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);

  // Sync tab if projectUrl changes
  useEffect(() => {
    if (projectUrl) {
      setActiveTab("project");
    } else {
      setActiveTab("website");
    }
  }, [projectUrl]);

  const getTargetUrl = () => {
    if (activeTab === "project" && fullProjectUrl) return fullProjectUrl;
    if (activeTab === "portfolio") return portfolioUrl;
    return websiteHomeUrl;
  };

  const getTargetLabel = () => {
    if (activeTab === "project" && fullProjectUrl) {
      return folderName ? `Folder: ${folderName}` : (title || "Project Portfolio");
    }
    if (activeTab === "portfolio") return "FrameKatha Portfolio Showcase";
    return "FrameKatha Official Website";
  };

  // Generate QR Code image data whenever active target URL changes
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const url = getTargetUrl();
    setGenerating(true);

    QRCode.toDataURL(url, {
      width: 380,
      margin: 2,
      color: {
        dark: "#0b0c10",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    })
      .then((dataUrl) => {
        if (isMounted) {
          setQrDataUrl(dataUrl);
          setGenerating(false);
        }
      })
      .catch((err) => {
        console.error("Failed to generate QR code:", err);
        if (isMounted) setGenerating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, activeTab, fullProjectUrl]);

  if (!isOpen) return null;

  const currentUrl = getTargetUrl();
  const currentLabel = getTargetLabel();

  // Copy URL to clipboard
  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  // Build the branded QR PNG as a Blob (reusable for download & share)
  const buildQRPngBlob = (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!qrDataUrl) return reject(new Error("QR not ready"));

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));

      canvas.width = 600;
      canvas.height = 750;

      const bgGrad = ctx.createLinearGradient(0, 0, 0, 750);
      bgGrad.addColorStop(0, "#131322");
      bgGrad.addColorStop(0.5, "#0b0b14");
      bgGrad.addColorStop(1, "#07070c");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 600, 750);

      ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
      ctx.lineWidth = 4;
      ctx.strokeRect(16, 16, 568, 718);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 26px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("FRAME KATHA", 300, 70);

      ctx.fillStyle = "#06b6d4";
      ctx.font = "14px monospace";
      ctx.fillText("CINEMATIC PORTFOLIO & MEDIA STUDIO", 300, 98);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "bold 18px sans-serif";
      const truncatedLabel = currentLabel.length > 34 ? `${currentLabel.slice(0, 32)}...` : currentLabel;
      ctx.fillText(truncatedLabel, 300, 135);

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(85, 165, 430, 430, 24);
      ctx.fill();

      const qrImg = new Image();
      qrImg.onload = () => {
        ctx.drawImage(qrImg, 110, 190, 380, 380);

        ctx.fillStyle = "#e2e8f0";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText("📷 Scan with Phone Camera to View Online", 300, 640);

        ctx.fillStyle = "#94a3b8";
        ctx.font = "13px monospace";
        const displayUrl = currentUrl.length > 45 ? `${currentUrl.slice(0, 42)}...` : currentUrl;
        ctx.fillText(displayUrl, 300, 675);

        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas toBlob failed"));
        }, "image/png");
      };
      qrImg.onerror = reject;
      qrImg.src = qrDataUrl;
    });
  };

  // Download QR Code branded card PNG
  const handleDownloadQR = () => {
    buildQRPngBlob()
      .then((blob) => {
        const link = document.createElement("a");
        const cleanName = currentLabel.replace(/[/\\?%*:|"<> ]/g, "_").toLowerCase();
        link.download = `framekatha_${cleanName}_qrcode.png`;
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      })
      .catch((err) => console.error("Download failed:", err));
  };

  // Send QR code IMAGE to WhatsApp
  // On mobile: uses Web Share API with files → opens native share sheet (WhatsApp, etc.)
  // On desktop: downloads the QR image + opens WhatsApp with a text message
  const handleShareWhatsApp = async () => {
    const text = `Check out *${currentLabel}* on FrameKatha 🎬\n📷 Scan the QR code or visit:\n${currentUrl}`;

    // Try native file share first (works on mobile Chrome/Safari/Firefox)
    if (navigator.canShare) {
      try {
        const blob = await buildQRPngBlob();
        const file = new File([blob], `framekatha_qr.png`, { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `FrameKatha QR Code – ${currentLabel}`,
            text,
          });
          return; // success — native share sheet opened
        }
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          console.warn("File share failed, falling back:", err);
        } else {
          return; // user cancelled
        }
      }
    }

    // Desktop / unsupported fallback:
    // 1. Auto-download the QR image so the user has it
    buildQRPngBlob()
      .then((blob) => {
        const link = document.createElement("a");
        const cleanName = currentLabel.replace(/[/\\?%*:|"<> ]/g, "_").toLowerCase();
        link.download = `framekatha_${cleanName}_qrcode.png`;
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      })
      .catch(() => {});

    // 2. Open WhatsApp web with the text message
    const waUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  // Native Web Share API
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `FrameKatha - ${currentLabel}`,
          text: `Scan or visit ${currentLabel} on FrameKatha:`,
          url: currentUrl,
        });
      } catch (err) {
        // User cancelled or unsupported
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg glass-strong rounded-3xl border border-cyan-500/40 shadow-[0_0_60px_rgba(6,182,212,0.25)] overflow-hidden flex flex-col max-h-[90vh] bg-gradient-to-b from-[#141427]/98 via-[#0e0e1a]/98 to-[#090910]/98"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-cyan-500 to-emerald-400 grid place-items-center text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <QrCode className="size-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <span>Scan &amp; Share</span>
                <span className="gradient-text font-extrabold">QR Code</span>
              </h2>
              <p className="text-xs text-slate-400">
                Point any phone camera to instantly view and share
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-5 sm:px-6 pt-4">
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 text-xs font-semibold">
            {fullProjectUrl && (
              <button
                type="button"
                onClick={() => setActiveTab("project")}
                className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "project"
                    ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Folder className="size-3.5" />
                <span className="truncate">This Folder</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab("website")}
              className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "website"
                  ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md font-bold"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Globe className="size-3.5" />
              <span className="truncate">Main Website</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("portfolio")}
              className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "portfolio"
                  ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md font-bold"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Sparkles className="size-3.5" />
              <span className="truncate">Portfolio</span>
            </button>
          </div>
        </div>

        {/* Modal Body: QR Code Display Card */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 flex flex-col items-center justify-center">
          {/* QR Container Frame */}
          <div className="relative group p-4 sm:p-5 rounded-3xl bg-white shadow-[0_10px_40px_rgba(6,182,212,0.3)] border-4 border-cyan-400/40 flex flex-col items-center">
            {generating || !qrDataUrl ? (
              <div className="size-64 rounded-2xl flex items-center justify-center bg-slate-100">
                <span className="size-8 rounded-full border-3 border-cyan-500 border-t-transparent animate-spin" />
              </div>
            ) : (
              <img
                src={qrDataUrl}
                alt="FrameKatha QR Code"
                className="size-60 sm:size-64 object-contain rounded-xl select-none"
              />
            )}

            {/* QR Center Badge */}
            <div className="mt-3 flex items-center gap-1.5 text-slate-800 text-[11px] font-bold">
              <Smartphone className="size-3.5 text-cyan-600" />
              <span>Scan with Camera to Open</span>
            </div>
          </div>

          {/* Target Preview Link */}
          <div className="w-full text-center space-y-1">
            <h4 className="text-sm font-bold text-white flex items-center justify-center gap-2">
              <span className="truncate max-w-[320px]">{currentLabel}</span>
            </h4>
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-400">
              <a
                href={currentUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:underline truncate max-w-[280px] flex items-center gap-1"
                title="Open in new tab"
              >
                <span>{currentUrl}</span>
                <ExternalLink className="size-3" />
              </a>
            </div>
          </div>

          {/* Action Buttons: Download, WhatsApp, Share, Copy */}
          <div className="w-full grid grid-cols-2 gap-2.5 pt-1">
            {/* Download QR PNG */}
            <button
              type="button"
              onClick={handleDownloadQR}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-cyan-500 to-emerald-500 hover:from-purple-500 hover:to-emerald-400 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              title="Download framed QR code image (PNG) for printing or sending"
            >
              <Download className="size-4" />
              <span>Download QR (PNG)</span>
            </button>

            {/* Send on WhatsApp */}
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              title="Send directly to WhatsApp contacts"
            >
              <Send className="size-4" />
              <span>Send WhatsApp</span>
            </button>

            {/* Native Share / Send */}
            <button
              type="button"
              onClick={handleNativeShare}
              className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              title="Share via device apps"
            >
              <Share2 className="size-3.5 text-cyan-400" />
              <span>Share / Send</span>
            </button>

            {/* Copy Link */}
            <button
              type="button"
              onClick={handleCopy}
              className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              title="Copy URL to clipboard"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5 text-slate-400" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="px-6 py-3 border-t border-white/5 bg-black/40 text-center">
          <p className="text-[11px] text-slate-400">
            ✨ Works with all Android &amp; iOS cameras, Google Lens, and WhatsApp scanner.
          </p>
        </div>
      </div>
    </div>
  );
}
