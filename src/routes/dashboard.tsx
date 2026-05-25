import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { ScanLine, AlertTriangle, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { QRCard } from "@/components/QRCard";
import {
  subjects,
  recentActivity,
  monthlyTrend,
  currentUser,
} from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Student Dashboard · Sentinel AI" }] }),
  component: StudentDashboard,
});

function StudentDashboard() {
  return (
    <AppShell
      title="Student Dashboard"
      subtitle={`Welcome back, ${currentUser.name}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Welcome banner */}
          <div className="bg-primary text-primary-foreground rounded-2xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-full bg-primary-foreground/5 -rotate-12 translate-x-20" />
            <div className="relative z-10">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Good morning, Alex.</h1>
              <p className="text-primary-foreground/80 max-w-md">
                Your Data Science lecture starts in{" "}
                <span className="font-bold text-primary-foreground">12 minutes</span>. Scan the QR code within the geofence zone.
              </p>
              <Link
                to="/scanner"
                className="mt-6 inline-flex items-center gap-2 bg-card text-primary px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-primary-light transition-colors shadow-lg"
              >
                <ScanLine className="size-4" /> Open Scanner
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard label="Monthly Presence" value="94.2%" delta="+2.4% vs last month" deltaPositive />
            <StatCard label="Total Classes" value="148" delta="Current semester" />
            <StatCard label="Late Entries" value="03" delta="Warning at 05" warning />
          </div>

          {/* Trend */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-foreground">Attendance Trend</h3>
                <p className="text-xs text-muted-foreground">Last 6 months</p>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold">
                <TrendingUp className="size-4" /> +16%
              </div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend} margin={{ left: -20, right: 5 }}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} domain={[60, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="attendance"
                    stroke="var(--primary)"
                    strokeWidth={2.5}
                    fill="url(#g1)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sidebar column */}
        <div className="space-y-6">
          <QRCard durationSec={30} />

          <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
            <h3 className="font-bold text-foreground mb-4">Subject Breakdown</h3>
            <div className="space-y-5">
              {subjects.map((s) => {
                const low = s.attendance < 75;
                return (
                  <div key={s.code}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-foreground">{s.name}</span>
                      <span className={`font-bold ${low ? "text-warning" : "text-primary"}`}>
                        {s.attendance}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${low ? "bg-warning" : "bg-primary"}`}
                        style={{ width: `${s.attendance}%` }}
                      />
                    </div>
                    {low && (
                      <p className="flex items-center gap-1 text-[10px] text-warning mt-1.5 font-medium">
                        <AlertTriangle className="size-3" /> Below 75% threshold
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="mt-6 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
          <h3 className="font-bold text-foreground">Recent Activity</h3>
          <Link to="/reports" className="text-primary text-sm font-semibold hover:underline">
            View full report
          </Link>
        </div>
        <div className="divide-y divide-border">
          {recentActivity.map((r, i) => (
            <div
              key={i}
              className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`size-10 rounded-lg flex items-center justify-center font-bold ${r.color}`}>
                  {r.code}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{r.subject}</p>
                  <p className="text-xs text-muted-foreground">{r.time} · {r.status}</p>
                </div>
              </div>
              <div
                className={`text-right text-xs font-medium hidden sm:block ${
                  r.status === "Absent" ? "text-destructive" : "text-muted-foreground"
                }`}
              >
                {r.method}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({
  label,
  value,
  delta,
  deltaPositive,
  warning,
}: {
  label: string;
  value: string;
  delta: string;
  deltaPositive?: boolean;
  warning?: boolean;
}) {
  const tone = warning
    ? "text-warning"
    : deltaPositive
    ? "text-emerald-600"
    : "text-muted-foreground";
  return (
    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
      <p className="text-sm text-muted-foreground font-medium">{label}</p>
      <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
      <div className={`text-xs mt-2 font-medium ${tone}`}>{delta}</div>
    </div>
  );
}