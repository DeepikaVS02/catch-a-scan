import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bluetooth,
  BluetoothOff,
  Smartphone,
  CheckCircle2,
  Radio,
  ShieldCheck,
  Copy,
  RefreshCcw,
  Trash2,
  Link2,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { currentUser, todaySchedule } from "@/lib/mock-data";

export const Route = createFileRoute("/scanner")({
  head: () => ({ meta: [{ title: "Phone Bluetooth ID · Sentinel AI" }] }),
  component: Scanner,
});

type PhoneDevice = {
  name: string;
  bluetoothId: string; // MAC-like address
  model: string;
  os: string;
  pairedAt: string;
};

const STORAGE_KEY = "sentinel.phoneDevice";

const samplePhones = [
  { model: "iPhone 15 Pro", os: "iOS 18.2", prefix: "A4:83:E7" },
  { model: "Pixel 8", os: "Android 15", prefix: "D8:3A:DD" },
  { model: "Galaxy S24", os: "Android 14", prefix: "5C:F9:38" },
  { model: "OnePlus 12", os: "OxygenOS 14", prefix: "F0:2F:74" },
];

function randomHexPair() {
  return Math.floor(Math.random() * 256).toString(16).padStart(2, "0").toUpperCase();
}

function generateBluetoothId(prefix: string) {
  return `${prefix}:${randomHexPair()}:${randomHexPair()}:${randomHexPair()}`;
}

function Scanner() {
  const [device, setDevice] = useState<PhoneDevice | null>(null);
  const [scanning, setScanning] = useState(false);
  const [marked, setMarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [btOn, setBtOn] = useState(false);
  const [autoCheck, setAutoCheck] = useState(true);
  const [markedAt, setMarkedAt] = useState<string | null>(null);

  // Poll real Bluetooth availability when possible; otherwise rely on the manual toggle.
  useEffect(() => {
    const nav = typeof navigator !== "undefined" ? (navigator as any) : null;
    if (!nav?.bluetooth?.getAvailability) return;
    let active = true;
    const check = async () => {
      try {
        const ok = await nav.bluetooth.getAvailability();
        if (active) setBtOn(Boolean(ok));
      } catch {}
    };
    check();
    const t = setInterval(check, 4000);
    nav.bluetooth.addEventListener?.("availabilitychanged", (e: any) => setBtOn(Boolean(e.value)));
    return () => {
      active = false;
      clearInterval(t);
    };
  }, []);

  // Auto-mark attendance the moment Bluetooth is detected as on for a paired phone.
  useEffect(() => {
    if (!autoCheck || !device || !btOn || marked) return;
    const t = setTimeout(() => {
      setMarked(true);
      setMarkedAt(new Date().toLocaleTimeString());
    }, 900);
    return () => clearTimeout(t);
  }, [autoCheck, device, btOn, marked]);

  // Reset the "marked" state if Bluetooth goes off so the next time it's on it re-marks.
  useEffect(() => {
    if (!btOn) setMarked(false);
  }, [btOn]);

  // Restore previously paired phone
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setDevice(JSON.parse(raw) as PhoneDevice);
    } catch {}
  }, []);

  const persist = (d: PhoneDevice | null) => {
    setDevice(d);
    if (typeof window === "undefined") return;
    if (d) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
    else window.localStorage.removeItem(STORAGE_KEY);
  };

  // Try real Web Bluetooth, fall back to simulated capture
  const pairPhone = async () => {
    setScanning(true);
    setMarked(false);
    try {
      const nav = typeof navigator !== "undefined" ? (navigator as any) : null;
      if (nav?.bluetooth?.requestDevice) {
        const bt = await nav.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ["device_information"],
        });
        const fallback = samplePhones[0];
        persist({
          name: bt?.name || "Student Phone",
          bluetoothId: bt?.id || generateBluetoothId(fallback.prefix),
          model: bt?.name || fallback.model,
          os: "Detected",
          pairedAt: new Date().toISOString(),
        });
      } else {
        // Simulated capture for environments without Web Bluetooth
        await new Promise((r) => setTimeout(r, 1400));
        const pick = samplePhones[Math.floor(Math.random() * samplePhones.length)];
        persist({
          name: `${currentUser.name.split(" ")[0]}'s ${pick.model}`,
          bluetoothId: generateBluetoothId(pick.prefix),
          model: pick.model,
          os: pick.os,
          pairedAt: new Date().toISOString(),
        });
      }
    } catch {
      // user cancelled — no-op
    } finally {
      setScanning(false);
    }
  };

  const copyId = async () => {
    if (!device) return;
    try {
      await navigator.clipboard.writeText(device.bluetoothId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const checkIn = () => {
    if (!device) return;
    setMarked(true);
    setMarkedAt(new Date().toLocaleTimeString());
  };

  return (
    <AppShell
      title="Phone Bluetooth ID"
      subtitle="Register your phone's Bluetooth ID — the unique fingerprint we use to mark attendance"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pairing / phone identity panel */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="aspect-[5/3] bg-accent text-accent-foreground relative overflow-hidden flex items-center justify-center">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="absolute rounded-full border border-primary/40"
                style={{
                  width: `${(i + 1) * 22}%`,
                  height: `${(i + 1) * 22}%`,
                  animation: scanning ? `pulseRing 2.4s ${i * 0.3}s ease-out infinite` : undefined,
                  opacity: scanning ? undefined : device ? 0.4 : 0.2,
                }}
              />
            ))}

            <div className="absolute z-10 size-16 rounded-2xl bg-primary text-primary-foreground grid place-items-center shadow-[0_0_30px_rgba(37,99,235,0.6)]">
              {marked ? (
                <CheckCircle2 className="size-8" />
              ) : device ? (
                <Smartphone className="size-8" />
              ) : (
                <Bluetooth className="size-8" />
              )}
            </div>

            <div className="absolute top-4 left-4 flex items-center gap-2 text-xs bg-accent-foreground/10 backdrop-blur-md px-3 py-1.5 rounded-full">
              <Radio className="size-3.5" />
              {scanning ? "Searching nearby phones…" : device ? "Phone paired" : "No phone paired"}
            </div>
            <div className="absolute top-4 right-4 flex items-center gap-2 text-xs bg-accent-foreground/10 backdrop-blur-md px-3 py-1.5 rounded-full">
              <span
                className={`size-1.5 rounded-full ${
                  device ? "bg-emerald-400" : "bg-amber-400"
                } animate-pulse`}
              />
              {currentUser.studentId}
            </div>
          </div>

          <div className="p-6 space-y-5">
            {device ? (
              <>
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                      Registered device
                    </p>
                    <p className="font-semibold text-foreground text-lg truncate">{device.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {device.model} · {device.os}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1.5">
                    <Link2 className="size-3" /> Linked
                  </span>
                </div>

                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">
                    Bluetooth ID
                  </p>
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <code className="font-mono text-base sm:text-lg text-foreground tracking-wider break-all">
                      {device.bluetoothId}
                    </code>
                    <button
                      onClick={copyId}
                      className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-background flex items-center gap-1.5 text-muted-foreground"
                    >
                      <Copy className="size-3.5" />
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2">
                    Paired {new Date(device.pairedAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={marked ? () => setMarked(false) : checkIn}
                    className="flex-1 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold shadow-md shadow-primary/20 hover:opacity-90 transition-opacity"
                  >
                    {marked ? "Marked ✓ Tap to reset" : "Mark attendance with this phone"}
                  </button>
                  <button
                    onClick={pairPhone}
                    className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted flex items-center justify-center gap-2"
                  >
                    <RefreshCcw className="size-4" /> Re-pair
                  </button>
                  <button
                    onClick={() => persist(null)}
                    className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted text-destructive flex items-center justify-center gap-2"
                  >
                    <Trash2 className="size-4" /> Remove
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div>
                  <p className="font-semibold text-foreground text-lg">Pair your phone</p>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    We capture your phone's unique Bluetooth ID once. From then on, every
                    classroom scanner that detects it will mark you present — no apps to open.
                  </p>
                </div>
                <button
                  onClick={pairPhone}
                  disabled={scanning}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold shadow-md shadow-primary/20 hover:opacity-90 transition-opacity inline-flex items-center gap-2 disabled:opacity-60"
                >
                  <Bluetooth className="size-4" />
                  {scanning ? "Scanning…" : "Connect phone via Bluetooth"}
                </button>
                <p className="text-[11px] text-muted-foreground">
                  Uses Web Bluetooth where available, otherwise a simulated capture for demo.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* How it works */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="size-4 text-primary" />
              <h3 className="font-bold text-foreground">How registration works</h3>
            </div>
            <ol className="space-y-3 text-sm text-muted-foreground">
              {[
                "Tap Connect phone via Bluetooth.",
                "Pick your phone from the system pairing prompt.",
                "We save its Bluetooth ID against your student profile.",
                "Classroom scanners detect that ID = attendance marked.",
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="size-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold grid place-items-center shrink-0">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Identity summary */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
            <h3 className="font-bold text-foreground mb-4">Linked to</h3>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/10 border border-primary/20 grid place-items-center text-primary font-bold">
                {currentUser.avatar}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground truncate">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {currentUser.studentId} · {currentUser.department}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-muted-foreground">Device fingerprint</p>
                <p className="font-semibold text-emerald-600 mt-0.5">
                  {device ? "Stored" : "Missing"}
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-muted-foreground">Single-session lock</p>
                <p className="font-semibold text-emerald-600 mt-0.5">Enabled</p>
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