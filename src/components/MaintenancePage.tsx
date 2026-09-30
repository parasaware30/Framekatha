import { useEffect, useState } from "react";

const API_BASE = "/api";

interface MaintenanceStatus {
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

/** Full-screen maintenance page shown to public users when maintenance mode is ON */
export function MaintenancePage({ message }: { message: string }) {
  const lines = message.split("\n");

  return (
    <div className="min-h-screen bg-[#07070c] flex items-center justify-center p-6 overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative flex flex-col items-center text-center max-w-xl">
        {/* Animated gear / logo */}
        <div className="relative mb-8">
          <div className="size-24 rounded-3xl bg-gradient-to-br from-purple-600 to-cyan-500 shadow-[0_0_60px_rgba(139,92,246,0.5)] flex items-center justify-center">
            <span className="text-5xl animate-spin" style={{ animationDuration: "8s" }}>⚙️</span>
          </div>
          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-3xl border-2 border-purple-500/40 animate-ping" style={{ animationDuration: "2s" }} />
        </div>

        {/* Brand */}
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white mb-1">
          FRAME <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">KATHA</span>
        </h1>
        <p className="text-xs text-purple-400 uppercase tracking-widest font-semibold mb-8">
          Cinematic Portfolio & Media Studio
        </p>

        {/* Maintenance card */}
        <div className="w-full bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-[0_0_60px_rgba(139,92,246,0.15)]">
          <div className="text-4xl mb-4">🛠️</div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
            Under Maintenance
          </h2>
          <div className="space-y-2">
            {lines.map((line, i) => (
              <p key={i} className="text-slate-300 text-sm leading-relaxed">
                {line}
              </p>
            ))}
          </div>

          {/* Progress bar animation */}
          <div className="mt-8 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
              style={{
                width: "60%",
                animation: "progress-pulse 3s ease-in-out infinite alternate",
              }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">Working hard...</p>
        </div>

        <p className="mt-6 text-xs text-slate-600">
          © {new Date().getFullYear()} FrameKatha Cinematic Studio
        </p>
      </div>

      <style>{`
        @keyframes progress-pulse {
          0%  { width: 35%; }
          50% { width: 75%; }
          100%{ width: 50%; }
        }
      `}</style>
    </div>
  );
}

/** Hook: checks maintenance status from backend. Returns null while loading. */
export function useMaintenanceStatus(): MaintenanceStatus | null {
  const [status, setStatus] = useState<MaintenanceStatus | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/settings/maintenance`)
      .then((r) => r.json())
      .then((data) => setStatus(data))
      .catch(() => setStatus({ maintenanceMode: false, maintenanceMessage: "" }));
  }, []);

  return status;
}
