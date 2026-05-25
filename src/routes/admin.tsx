import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Users, Activity, AlertCircle, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { QRCard } from "@/components/QRCard";
import {
  adminStats,
  departmentBreakdown,
  liveAttendance,
} from "@/lib/mock-data";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Console · Sentinel AI" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <AppShell title="Admin Console" subtitle="Real-time oversight · Faculty of Engineering">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI icon={Users} label="Total Students" value={adminStats.totalStudents.toLocaleString()} hint="Across 5 departments" tone="primary" />
        <KPI icon={CheckCircle2} label="Present Today" value={adminStats.presentToday.toLocaleString()} hint="88.3% attendance" tone="success" />
        <KPI icon={Activity} label="Active Sessions" value={String(adminStats.activeSessions)} hint="4 ending in < 10m" tone="primary" />
        <KPI icon={AlertCircle} label="Flagged" value={String(adminStats.flagged)} hint="Requires review" tone="destructive" />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-foreground">Department Attendance</h3>
              <p className="text-xs text-muted-foreground">Today's check-ins by department</p>
            </div>
            <select className="text-xs bg-muted border border-border rounded-lg px-3 py-1.5 text-foreground">
              <option>Today</option>
              <option>This week</option>
              <option>This month</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentBreakdown} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="dept" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="present" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* QR */}
        <div>
          <div className="mb-2 px-2 flex items-center justify-between">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Active Session</span>
            <span className="text-xs text-muted-foreground">CS101 · Data Structures</span>
          </div>
          <QRCard sessionLabel="Session CS101-A" durationSec={30} />
        </div>
      </div>

      {/* Live feed */}
      <div className="mt-6 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-foreground">Live Check-in Feed</h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Receiving
            </span>
          </div>
          <input
            placeholder="Search students…"
            className="text-sm bg-muted border border-border rounded-lg px-3 py-1.5 outline-none focus:border-primary w-48 hidden md:block"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground text-xs uppercase tracking-wider bg-muted/20">
                <th className="px-6 py-3 font-semibold">Student</th>
                <th className="px-6 py-3 font-semibold">ID</th>
                <th className="px-6 py-3 font-semibold">Time</th>
                <th className="px-6 py-3 font-semibold">Method</th>
                <th className="px-6 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {liveAttendance.map((r, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-3.5 flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary/10 text-primary grid place-items-center text-xs font-bold">
                      {r.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span className="font-medium text-foreground">{r.name}</span>
                  </td>
                  <td className="px-6 py-3.5 text-muted-foreground font-mono text-xs">{r.id}</td>
                  <td className="px-6 py-3.5 text-muted-foreground font-mono text-xs">{r.time}</td>
                  <td className="px-6 py-3.5">
                    <span className="text-xs px-2 py-0.5 bg-muted rounded font-medium text-foreground">
                      {r.method}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        r.status === "Present"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}

function KPI({
  icon: Icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  hint: string;
  tone: "primary" | "success" | "destructive";
}) {
  const toneMap = {
    primary: "bg-primary/10 text-primary",
    success: "bg-emerald-100 text-emerald-700",
    destructive: "bg-red-100 text-destructive",
  };
  return (
    <div className="bg-card p-5 rounded-2xl border border-border shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            {label}
          </p>
          <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
        </div>
        <div className={`size-9 rounded-lg flex items-center justify-center ${toneMap[tone]}`}>
          <Icon className="size-4" />
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-3">{hint}</p>
    </div>
  );
}