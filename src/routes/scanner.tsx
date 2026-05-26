import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bluetooth, MapPin, CheckCircle2, Radio, Signal, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { todaySchedule } from "@/lib/mock-data";

export const Route = createFileRoute("/scanner")({
  head: () => ({ meta: [{ title: "Bluetooth Check-in · Sentinel AI" }] }),
  component: Scanner,
});

type Beacon = {
  id: string;
  label: string;
  room: string;
  rssi: number; // dBm
  verified: boolean;
};

const initialBeacons: Beacon[] = [
  { id: "BCN-A402", label: "Hall A-402 Beacon", room: "Data Science 402", rssi: -54, verified: true },
  { id: "BCN-LIB", label: "Library North Beacon", room: "Library Wing", rssi: -78, verified: false },
  { id: "BCN-A401", label: "Hall A-401 Beacon", room: "AI 301 Lab", rssi: -82, verified: false },
];

function Scanner() {
  const [scanning, setScanning] = useState(true);
  const [marked, setMarked] = useState(false);
  const [beacons, setBeacons] = useState<Beacon[]>(initialBeacons);
  const [selected, setSelected] = useState<string>("BCN-A402");

  // Simulate live RSSI fluctuation while scanning
  useEffect(() => {
    if (!scanning) return;
    const t = setInterval(() => {
      setBeacons((bs) =>
        bs.map((b) => ({
          ...b,
          rssi: Math.max(-95, Math.min(-40, b.rssi + Math.round((Math.random() - 0.5) * 4))),
        })),
      );
    }, 900);
    return () => clearInterval(t);
  }, [scanning]);

  const primary = beacons.find((b) => b.id === selected) ?? beacons[0];
  const strength = Math.max(0, Math.min(100, Math.round(((primary.rssi + 95) / 55) * 100)));
  const inRange = primary.rssi >= -70;

  const checkIn = () => {
    if (!inRange) return;
    setMarked(true);
    setScanning(false);
  };

  return (
    <AppShell title="Bluetooth Check-in" subtitle="Proximity-verified attendance via classroom beacons">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bluetooth radar panel */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="aspect-[4/3] bg-accent text-accent-foreground relative overflow-hidden flex items-center justify-center">
            {/* Radar rings */}
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="absolute rounded-full border border-primary/40"
                style={{
                  width: `${(i + 1) * 22}%`,
                  height: `${(i + 1) * 22}%`,
                  animation: scanning ? `pulseRing 2.4s ${i * 0.3}s ease-out infinite` : undefined,
                  opacity: scanning ? undefined : 0.25,
                }}
              />
            ))}

            {/* Sweep beam */}
            {scanning && (
              <div
                className="absolute size-[88%] rounded-full"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0deg, var(--primary) 30deg, transparent 60deg)",
                  opacity: 0.35,
                  animation: "sweep 3s linear infinite",
                  filter: "blur(2px)",
                }}
              />
            )}

            {/* Beacon dots */}
            {beacons.map((b, i) => {
              const r = Math.max(8, Math.min(48, ((-b.rssi - 40) / 55) * 48));
              const angle = (i / beacons.length) * Math.PI * 2;
              const x = 50 + Math.cos(angle) * r;
              const y = 50 + Math.sin(angle) * r;
              const active = b.id === selected;
              return (
                <button
                  key={b.id}
                  onClick={() => setSelected(b.id)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  aria-label={b.label}
                >
                  <div
                    className={`size-3 rounded-full ${
                      active
                        ? "bg-primary shadow-[0_0_0_6px_rgba(37,99,235,0.35)] animate-pulse"
                        : "bg-accent-foreground/60"
                    }`}
                  />
                  <span className="absolute left-1/2 -translate-x-1/2 mt-1 text-[10px] font-mono text-accent-foreground/70 whitespace-nowrap">
                    {b.id}
                  </span>
                </button>
              );
            })}

            {/* Center device */}
            <div className="absolute z-10 size-14 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-[0_0_30px_rgba(37,99,235,0.6)]">
              {marked ? <CheckCircle2 className="size-7" /> : <Bluetooth className="size-7" />}
            </div>

            <div className="absolute top-4 left-4 flex items-center gap-2 text-xs bg-accent-foreground/10 backdrop-blur-md px-3 py-1.5 rounded-full">
              <Radio className="size-3.5" />
              BLE 5.2 · Scanning
            </div>
            <div className="absolute top-4 right-4 flex items-center gap-2 text-xs bg-accent-foreground/10 backdrop-blur-md px-3 py-1.5 rounded-full">
              <span className={`size-1.5 rounded-full ${inRange ? "bg-emerald-400" : "bg-amber-400"} animate-pulse`} />
              {primary.rssi} dBm · {primary.room}
            </div>
          </div>

          <div className="p-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-10 rounded-lg bg-primary/10 text-primary grid place-items-center">
                <Signal className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground truncate">
                  {marked
                    ? "Attendance marked via Bluetooth"
                    : inRange
                      ? `In range of ${primary.label}`
                      : "Move closer to a classroom beacon"}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-1.5 w-32 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        inRange ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                      style={{ width: `${strength}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{strength}% signal</span>
                </div>
              </div>
            </div>
            <button
              onClick={marked ? () => { setMarked(false); setScanning(true); } : checkIn}
              disabled={!marked && !inRange}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold shadow-md shadow-primary/20 hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {marked ? "Scan again" : "Confirm check-in"}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Nearby beacons */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bluetooth className="size-4 text-primary" />
              <h3 className="font-bold text-foreground">Nearby Beacons</h3>
            </div>
            <div className="space-y-3">
              {beacons
                .slice()
                .sort((a, b) => b.rssi - a.rssi)
                .map((b) => {
                  const s = Math.max(0, Math.min(100, Math.round(((b.rssi + 95) / 55) * 100)));
                  const near = b.rssi >= -70;
                  return (
                    <button
                      key={b.id}
                      onClick={() => setSelected(b.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-colors ${
                        selected === b.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/60"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{b.label}</p>
                          <p className="text-[11px] text-muted-foreground font-mono">{b.id} · {b.rssi} dBm</p>
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            near
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {near ? "In range" : "Far"}
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${near ? "bg-emerald-500" : "bg-amber-500"}`}
                          style={{ width: `${s}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Anti-proxy panel */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="size-4 text-primary" />
              <h3 className="font-bold text-foreground">Anti-Proxy Checks</h3>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <MapPin className="size-3.5" /> Beacon proximity
                </span>
                <span className={`font-semibold ${inRange ? "text-emerald-600" : "text-amber-600"}`}>
                  {inRange ? "Pass" : "Out of range"}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Device fingerprint</span>
                <span className="font-semibold text-emerald-600">Pass</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Single-session lock</span>
                <span className="font-semibold text-emerald-600">Pass</span>
              </li>
            </ul>
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
        @keyframes pulseRing {
          0% { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes sweep {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </AppShell>
  );
}