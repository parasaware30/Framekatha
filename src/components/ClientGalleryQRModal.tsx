import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import {
  QrCode,
  X,
  Download,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Key,
  ShieldCheck,
  Sparkles,
  Smartphone
} from "lucide-react";

interface ClientGalleryQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  gallery: any;
}

export function ClientGalleryQRModal({
  isOpen,
  onClose,
  gallery
}: ClientGalleryQRModalProps) {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://framekatha.com";
  const portalUrl = gallery ? `${origin}/client-portal/${gallery.slug || gallery.id}` : "";

  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [qrImageCopied, setQrImageCopied] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !gallery) return;

    let isMounted = true;
    setGenerating(true);

    QRCode.toDataURL(portalUrl, {
      width: 500,
      margin: 2,
      color: {
        dark: "#ffffff",
        light: "#0b0b14"
      },
      errorCorrectionLevel: "H"
    })
      .then((url) => {
        if (isMounted) {
          setQrDataUrl(url);
          setGenerating(false);
        }
      })
      .catch((err) => {
        console.error("QR Code generation error:", err);
        if (isMounted) setGenerating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, gallery, portalUrl]);

  if (!isOpen || !gallery) return null;

  const handleCopyLinkAndPin = () => {
    const text = `📸 *Private Photoshoot Gallery for ${gallery.clientName}*\n\n🌟 Event: *${gallery.eventTitle}*\n🔗 Secret Link: ${portalUrl}\n🔑 Access Passcode / PIN: *${gallery.passcode}*\n\n_Scan the QR Code or open the link above to view your photos and select your favorites for the album!_`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleCopyQRImageToClipboard = async () => {
    try {
      const res = await fetch(qrDataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      setQrImageCopied(true);
      setTimeout(() => setQrImageCopied(false), 3000);
    } catch (err) {
      console.warn("Clipboard image write not supported, downloading instead:", err);
      handleDownloadQRPrivateCard();
    }
  };

  const handleShareWhatsAppImage = async () => {
    // 1. Try native Web Share API (Works on Mobile / Chrome to send actual image file into WhatsApp)
    try {
      const res = await fetch(qrDataUrl);
      const blob = await res.blob();
      const file = new File([blob], `${gallery.clientName.replace(/\s+/g, "_")}_QR_Pass.png`, { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `VIP Photoshoot Pass: ${gallery.eventTitle}`,
          text: `📸 Hello ${gallery.clientName}! Here is your private photoshoot proofing QR Code Pass:\n\n🌟 Event: ${gallery.eventTitle}\n🔑 PIN: ${gallery.passcode}\n🔗 Link: ${portalUrl}`,
          files: [file]
        });
        return;
      }
    } catch (e) {
      console.warn("Native file share fallback:", e);
    }

    // 2. Desktop Fallback: Copy QR image to clipboard & download card & open WhatsApp Web
    await handleCopyQRImageToClipboard();
    handleDownloadQRPrivateCard();
    const text = encodeURIComponent(
      `📸 Hello ${gallery.clientName}! Here is your private photoshoot proofing gallery from FrameKatha:\n\n🌟 Event: ${gallery.eventTitle}\n🔗 Link: ${portalUrl}\n🔑 Access Passcode / PIN: ${gallery.passcode}\n\n(QR Code image has been copied to your clipboard & downloaded! Simply press Ctrl+V / Paste in this chat to send the QR photo)`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleDownloadQRPrivateCard = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 800, 1000);
    bgGrad.addColorStop(0, "#0a0a10");
    bgGrad.addColorStop(0.5, "#131024");
    bgGrad.addColorStop(1, "#07070d");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 800, 1000);

    // Border
    ctx.strokeStyle = "rgba(139, 92, 246, 0.4)";
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 760, 960);

    // Header Title
    ctx.fillStyle = "#a855f7";
    ctx.font = "bold 24px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("FRAMEKATHA CINEMATIC STUDIO", 400, 80);

    // Subtitle
    ctx.fillStyle = "#06b6d4";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("Private Client Proofing Gallery", 400, 130);

    // Client & Event
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText(gallery.eventTitle || "Photoshoot Album", 400, 180);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "20px sans-serif";
    ctx.fillText(`Prepared exclusively for: ${gallery.clientName}`, 400, 215);

    // Load and draw QR code
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, 200, 260, 400, 400);

      // Passcode Badge Box
      ctx.fillStyle = "rgba(139, 92, 246, 0.25)";
      ctx.fillRect(180, 690, 440, 90);
      ctx.strokeStyle = "#8b5cf6";
      ctx.lineWidth = 2;
      ctx.strokeRect(180, 690, 440, 90);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "16px sans-serif";
      ctx.fillText("SECRET ACCESS PASSCODE / PIN", 400, 725);

      ctx.fillStyle = "#22d3ee";
      ctx.font = "bold 32px monospace";
      ctx.fillText(`🔑  ${gallery.passcode}`, 400, 765);

      // Instructions footer
      ctx.fillStyle = "#94a3b8";
      ctx.font = "16px sans-serif";
      ctx.fillText("Scan QR code using any phone camera to unlock gallery", 400, 840);
      ctx.fillText("Select your favorite photos with ❤️ for final album retouching", 400, 870);

      ctx.fillStyle = "#64748b";
      ctx.font = "14px sans-serif";
      ctx.fillText(`Created with passion by Paras Aware • ${origin}`, 400, 930);

      // Trigger download
      const downloadLink = document.createElement("a");
      downloadLink.download = `${gallery.clientName.replace(/\s+/g, "_")}_VIP_QR_Pass.png`;
      downloadLink.href = canvas.toDataURL("image/png");
      downloadLink.click();
    };
    qrImg.src = qrDataUrl;
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md my-auto glass-strong rounded-3xl p-5 sm:p-8 border border-purple-500/40 shadow-[0_0_60px_rgba(168,85,247,0.3)] relative overflow-hidden space-y-4 max-h-[92vh] flex flex-col bg-gradient-to-b from-[#141427]/98 via-[#0e0e1a]/98 to-[#090910]/98"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Corner Lights */}
        <div className="absolute -top-16 -right-16 size-32 bg-purple-600/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 size-32 bg-pink-500/30 rounded-full blur-2xl pointer-events-none" />

        {/* Prominent Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer border border-white/10 hover:border-pink-500/50 hover:scale-105 shadow-md"
        >
          <X className="size-5" />
        </button>

        <div className="overflow-y-auto pr-1 space-y-4 custom-scrollbar">
          {/* Modal Top Header */}
          <div className="text-center space-y-1.5 pt-2 pr-8 sm:pr-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-semibold">
              <ShieldCheck className="size-3.5 text-cyan-400" />
              <span>Unique Client QR Code Pass</span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold font-display text-white">
              {gallery.eventTitle}
            </h3>
            <p className="text-xs text-cyan-300 font-semibold">
              Client: {gallery.clientName}
            </p>
          </div>

          {/* High-Res QR Code Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#090910] border border-purple-500/30 flex flex-col items-center justify-center shadow-inner relative group">
            {generating ? (
              <div className="size-48 sm:size-52 grid place-items-center text-xs text-slate-400">
                Generating High-Res QR...
              </div>
            ) : qrDataUrl ? (
              <div className="relative">
                <img
                  src={qrDataUrl}
                  alt="Client Portal QR Code"
                  className="size-48 sm:size-52 rounded-xl shadow-lg border border-white/10 p-2 bg-[#0b0b14]"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-purple-500/10 to-cyan-500/10 pointer-events-none" />
              </div>
            ) : (
              <div className="size-48 sm:size-52 grid place-items-center text-xs text-rose-400">
                QR Code could not be generated.
              </div>
            )}

            {/* Secret PIN Box */}
            <div className="mt-3.5 w-full px-4 py-2 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                <Key className="size-3.5 text-purple-400" /> Secret Passcode PIN:
              </span>
              <span className="text-base font-bold font-mono text-cyan-300 tracking-wider">
                {gallery.passcode}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {/* Main WhatsApp QR Photo Share */}
            <button
              onClick={handleShareWhatsAppImage}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              title="Send QR Code Image Photo on WhatsApp"
            >
              <MessageCircle className="size-4" />
              <span>📱 Send QR Code Image to WhatsApp</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              {/* Copy QR Photo to Clipboard */}
              <button
                onClick={handleCopyQRImageToClipboard}
                className="px-3 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-bold border border-purple-500/40 shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                title="Copy QR Photo to Clipboard (Press Ctrl+V in WhatsApp to send image)"
              >
                {qrImageCopied ? (
                  <>
                    <Check className="size-3.5 text-emerald-400" />
                    <span className="text-emerald-300">QR Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5 text-purple-400" />
                    <span>Copy QR Image</span>
                  </>
                )}
              </button>

              {/* Download VIP Poster Card PNG */}
              <button
                onClick={handleDownloadQRPrivateCard}
                className="px-3 py-2.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 text-xs font-bold border border-cyan-500/40 shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                title="Download Full VIP Poster Card Image PNG"
              >
                <Download className="size-3.5 text-cyan-400" />
                <span>Download Card</span>
              </button>
            </div>

            {/* Copy Text Message with Link & PIN */}
            <button
              onClick={handleCopyLinkAndPin}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-[11px] font-semibold border border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Text Message &amp; PIN Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5 text-slate-400" />
                  <span>Copy Text Message &amp; PIN</span>
                </>
              )}
            </button>
          </div>

          <div className="text-center text-[10px] text-slate-400 leading-tight">
            💡 <strong>Tip:</strong> WhatsApp pe QR Image bhejne ke liye <em>"Send QR Code Image"</em> dabayein ya <em>"Copy QR Image"</em> karke WhatsApp chat me <strong>Ctrl+V</strong> paste karein!
          </div>

          {/* Dedicated Close / Cancel Button at Bottom */}
          <div className="pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-rose-500/20 text-slate-200 hover:text-rose-200 text-xs font-bold border border-white/15 hover:border-rose-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <X className="size-4" />
              <span>Close / Cancel QR Window</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
