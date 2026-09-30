import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, QrCode } from "lucide-react";
import { QRCodeModal } from "./QRCodeModal";

const links = [
  { to: "/", label: "Home" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-4">
          <nav className="glass-strong rounded-2xl px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 group py-1">
              <img
                src="/logo.png"
                alt="FrameKatha Logo"
                className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105 filter drop-shadow-[0_0_15px_rgba(139,92,246,0.4)]"
              />
            </Link>

            {/* Desktop Nav Links */}
            <ul className="hidden md:flex items-center gap-2">
              {links.map((l) => {
                const isActive = location.pathname === l.to || (l.to !== "/" && location.pathname.startsWith(l.to));
                return (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className={`px-4 py-2 text-sm font-medium transition-colors rounded-xl ${
                        isActive
                          ? "font-semibold text-white bg-white/10"
                          : "text-slate-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setQrOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 border border-white/15 transition-all cursor-pointer shadow-sm hover:border-cyan-400"
                title="Scan or Send QR Code for Website"
              >
                <QrCode className="size-4 text-cyan-400" />
                <span className="hidden sm:inline">QR Code</span>
              </button>

              <button
                className="md:hidden p-2 rounded-lg hover:bg-white/5 text-slate-300"
                onClick={() => setOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </nav>

          {/* Mobile Nav Drawer */}
          {open && (
            <div className="md:hidden glass-strong mt-2 rounded-2xl p-4 animate-fade-in border border-white/10 space-y-2">
              <ul className="flex flex-col gap-1">
                {links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2.5 rounded-xl hover:bg-white/5 text-sm text-slate-200"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => { setOpen(false); setQrOpen(true); }}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 border border-white/15"
              >
                <QrCode className="size-4 text-cyan-400" /> Scan &amp; Share QR Code
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Global Website QR Code Modal */}
      <QRCodeModal isOpen={qrOpen} onClose={() => setQrOpen(false)} />
    </>
  );
}
