import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SiteNav } from './SiteNav';
import { MessageCircle, Calendar, Mail, X, Sparkles } from 'lucide-react';

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const [fabOpen, setFabOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0e] text-slate-100 font-sans relative overflow-x-hidden selection:bg-purple-500 selection:text-white">
      {/* Dynamic Moving Ambient Gradient Orbs (Background visual effects) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {/* Purple Glowing Orb */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl animate-blob will-change-transform" />
        {/* Cyan Glowing Orb */}
        <div className="absolute top-1/3 -right-32 w-[28rem] h-[28rem] bg-cyan-500/10 rounded-full blur-3xl animate-blob-delayed will-change-transform" />
        {/* Magenta Glowing Orb */}
        <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-blob will-change-transform" />
        {/* Subtle Grid Texture Overlay */}
        <div
          className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"
        />
      </div>

      <SiteNav />

      <main className="flex-1 pt-24 pb-12 relative z-10">
        {children}
      </main>

      {/* Floating Quick Connect & WhatsApp / Booking FAB Widget */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {fabOpen && (
          <div className="glass-strong rounded-3xl p-3 border border-purple-500/40 shadow-2xl space-y-2 animate-fade-in flex flex-col items-stretch min-w-[200px]">
            <a
              href="https://wa.me/?text=Hello%20Paras%2C%20I%20saw%20your%20FrameKatha%20portfolio%20and%20would%20love%20to%20discuss%20a%20project!"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all"
            >
              <MessageCircle className="size-4 text-emerald-400" />
              <span>Chat on WhatsApp</span>
            </a>
            <Link
              to="/contact"
              onClick={() => setFabOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all"
            >
              <Mail className="size-4 text-cyan-400" />
              <span>Send Direct Inquiry</span>
            </Link>
          </div>
        )}

        <button
          onClick={() => setFabOpen(!fabOpen)}
          className="size-14 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white shadow-[0_0_25px_rgba(139,92,246,0.6)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer border border-white/25"
          title="Quick Connect & Bookings"
          aria-label="Quick Connect"
        >
          {fabOpen ? (
            <X className="size-6 text-white" />
          ) : (
            <div className="relative">
              <MessageCircle className="size-6 text-white" />
              <span className="absolute -top-1 -right-1 size-3 bg-emerald-400 rounded-full border-2 border-[#0a0a0e] animate-ping" />
              <span className="absolute -top-1 -right-1 size-3 bg-emerald-400 rounded-full border-2 border-[#0a0a0e]" />
            </div>
          )}
        </button>
      </div>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-slate-500 bg-[#07070c]/80 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-slate-400">
            <p>© {new Date().getFullYear()} FrameKatha Cinematic Studio. All rights reserved.</p>
            <span className="hidden sm:inline text-slate-600">•</span>
            <p className="flex items-center gap-1.5 font-medium">
              <span>Created with passion by</span>
              <span className="font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent shadow-sm">
                Paras Aware
              </span>
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 text-slate-400">
            <a href="/portfolio" className="hover:text-cyan-400 transition-colors">Portfolio</a>
            <a href="/about" className="hover:text-purple-400 transition-colors">About</a>
            <a href="/contact" className="hover:text-cyan-400 transition-colors">Contact</a>
            <a href="/admin" className="hover:text-purple-400 transition-colors">Admin CMS</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
