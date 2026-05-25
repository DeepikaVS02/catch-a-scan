import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

// Visual QR pattern (deterministic from seed) — for prototype use
function generatePattern(seed: number): boolean[] {
  const size = 8 * 8;
  const out: boolean[] = [];
  let x = seed;
  for (let i = 0; i < size; i++) {
    x = (x * 9301 + 49297) % 233280;
    out.push(x / 233280 > 0.5);
  }
  return out;
}

export function QRCard({
  sessionLabel = "Session ID #882-991-AI",
  durationSec = 30,
}: {
  sessionLabel?: string;
  durationSec?: number;
}) {
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1000));
  const [remaining, setRemaining] = useState(durationSec);

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setSeed(Math.floor(Math.random() * 1000));
          return durationSec;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [durationSec]);

  const pattern = generatePattern(seed);
  const pct = (remaining / durationSec) * 100;

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-6 flex flex-col items-center text-center">
      <div className="mb-4 w-full aspect-square bg-muted/40 border-2 border-dashed border-border rounded-xl grid place-items-center relative max-w-xs mx-auto">
        <div className="size-48 bg-card border border-border p-3 rounded-lg grid grid-cols-8 gap-0.5">
          {pattern.map((on, i) => (
            <div
              key={i}
              className={on ? "bg-accent" : "bg-muted/30"}
              style={{ aspectRatio: "1" }}
            />
          ))}
        </div>
        <div className="absolute bottom-3 text-[10px] text-muted-foreground font-mono tracking-widest uppercase">
          {sessionLabel}
        </div>
      </div>
      <h3 className="font-bold text-foreground">Quick Connect</h3>
      <p className="text-sm text-muted-foreground mt-1">
        Expires in{" "}
        <span className={`font-mono font-bold ${remaining <= 10 ? "text-destructive" : "text-primary"}`}>
          {remaining.toString().padStart(2, "0")}s
        </span>
      </p>
      <div className="mt-3 w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            remaining <= 10 ? "bg-destructive" : "bg-primary"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <button
        onClick={() => {
          setSeed(Math.floor(Math.random() * 1000));
          setRemaining(durationSec);
        }}
        className="mt-4 w-full px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-dark transition-colors shadow-md shadow-primary/20 flex items-center justify-center gap-2"
      >
        <RefreshCw className="size-3.5" />
        Refresh QR
      </button>
    </div>
  );
}