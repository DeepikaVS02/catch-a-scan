import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ScanLine, MapPin, CheckCircle2, Camera } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { todaySchedule } from "@/lib/mock-data";

export const Route = createFileRoute("/scanner")({
  head: () => ({ meta: [{ title: "QR Scanner · Sentinel AI" }] }),
  component: Scanner,
});

function Scanner() {
  const [scanned, setScanned] = useState(false);

  return (
    <AppShell title="Attendance Scanner" subtitle="Point your camera at the instructor's QR code">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="aspect-[4/3] bg-accent text-accent-foreground relative overflow-hidden flex items-center justify-center">
            {/* Camera simulated view */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.6)_80%)]" />

            {/* Scan frame */}
            <div className="relative size-64 border-2 border-primary rounded-2xl">
              <div className="absolute -top-1 -left-1 size-8 border-t-4 border-l-4 border-primary rounded-tl-2xl" />
              <div className="absolute -top-1 -right-1 size-8 border-t-4 border-r-4 border-primary rounded-tr-2xl" />
              <div className="absolute -bottom-1 -left-1 size-8 border-b-4 border-l-4 border-primary rounded-bl-2xl" />
              <div className="absolute -bottom-1 -right-1 size-8 border-b-4 border-r-4 border-primary rounded-br-2xl" />
              {!scanned && (
                <div className="absolute inset-x-0 h-0.5 bg-primary shadow-[0_0_20px_var(--primary)] animate-[scan_2s_ease-in-out_infinite]" style={{ top: "50%" }} />
              )}
              {scanned && (
                <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl grid place-items-center">
                  <CheckCircle2 className="size-16 text-emerald-400" />
                </div>
              )}
            </div>

            <div className="absolute top-4 left-4 flex items-center gap-2 text-xs bg-accent-foreground/10 backdrop-blur-md px-3 py-1.5 rounded-full">
              <Camera className="size-3.5" />
              Front camera
            </div>
            <div className="absolute top-4 right-4 flex items-center gap-2 text-xs bg-accent-foreground/10 backdrop-blur-md px-3 py-1.5 rounded-full">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              GPS locked · Hall A-402
            </div>
          </div>

          <div className="p-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-primary/10 text-primary grid place-items-center">
                <ScanLine className="size-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {scanned ? "Attendance marked!" : "Awaiting QR code..."}
                </p>
                <p className="text-xs text-muted-foreground">
                  {scanned ? "Data Science 402 · 09:02 AM" : "Hold steady inside the frame"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setScanned((s) => !s)}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold shadow-md shadow-primary/20 hover:bg-primary-dark transition-colors"
            >
              {scanned ? "Scan again" : "Simulate scan"}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="size-4 text-primary" />
              <h3 className="font-bold text-foreground">Location Verified</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              You are inside the geofence for{" "}
              <span className="font-semibold text-foreground">Hall A-402</span>.
            </p>
            <div className="mt-4 h-32 bg-muted rounded-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,var(--border)_25%,transparent_25%,transparent_75%,var(--border)_75%),linear-gradient(45deg,var(--border)_25%,transparent_25%,transparent_75%,var(--border)_75%)] bg-[length:20px_20px] opacity-30" />
              <div className="absolute inset-0 grid place-items-center">
                <div className="size-4 bg-primary rounded-full shadow-[0_0_0_8px_rgba(37,99,235,0.2)] animate-pulse" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
            <h3 className="font-bold text-foreground mb-4">Today's Schedule</h3>
            <div className="space-y-3">
              {todaySchedule.map((c) => (
                <div key={c.time} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground font-mono uppercase">
                        {c.status === "Present" ? "Done" : "Soon"}
                      </p>
                      <p className="font-bold text-foreground text-sm">{c.time}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{c.subject}</p>
                      <p className="text-xs text-muted-foreground truncate">{c.room}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      c.status === "Present"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { top: 10%; }
          50% { top: 90%; }
        }
      `}</style>
    </AppShell>
  );
}