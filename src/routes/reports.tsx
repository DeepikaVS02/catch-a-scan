import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Download, Filter, Search } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { monthlyTrend, subjects, liveAttendance } from "@/lib/mock-data";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports · Sentinel AI" }] }),
  component: Reports,
});

const PIE_COLORS = ["var(--primary)", "var(--warning)", "var(--destructive)"];

const pieData = [
  { name: "Present", value: 88 },
  { name: "Late", value: 7 },
  { name: "Absent", value: 5 },
];

function Reports() {
  const [query, setQuery] = useState("");
  const filtered = liveAttendance.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AppShell title="Attendance Reports" subtitle="Drill down by subject, date, or student">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2 px-3 h-10 rounded-lg bg-card border border-border flex-1 min-w-[200px]">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students..."
            className="bg-transparent outline-none flex-1 text-sm placeholder:text-muted-foreground"
          />
        </div>
        <select className="h-10 bg-card border border-border rounded-lg px-3 text-sm">
          <option>All subjects</option>
          {subjects.map((s) => (
            <option key={s.code}>{s.name}</option>
          ))}
        </select>
        <select className="h-10 bg-card border border-border rounded-lg px-3 text-sm">
          <option>This semester</option>
          <option>This month</option>
          <option>This week</option>
        </select>
        <button className="h-10 px-4 rounded-lg bg-muted text-foreground text-sm font-semibold flex items-center gap-2 hover:bg-border transition-colors">
          <Filter className="size-4" /> More filters
        </button>
        <button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2 shadow-md shadow-primary/20 hover:bg-primary-dark transition-colors">
          <Download className="size-4" /> Export PDF
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-sm p-6">
          <h3 className="font-bold text-foreground mb-1">Attendance Over Time</h3>
          <p className="text-xs text-muted-foreground mb-4">Aggregated across all subjects</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend} margin={{ left: -20 }}>
                <defs>
                  <linearGradient id="r1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} domain={[50, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="attendance" stroke="var(--primary)" strokeWidth={2.5} fill="url(#r1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
          <h3 className="font-bold text-foreground mb-1">Status Distribution</h3>
          <p className="text-xs text-muted-foreground mb-4">Last 30 days</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={55}
                  outerRadius={85}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} stroke="var(--card)" strokeWidth={3} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Subject table */}
      <div className="mt-6 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <h3 className="font-bold text-foreground">Per-Subject Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground text-xs uppercase tracking-wider bg-muted/20">
                <th className="px-6 py-3 font-semibold">Subject</th>
                <th className="px-6 py-3 font-semibold">Code</th>
                <th className="px-6 py-3 font-semibold">Attendance</th>
                <th className="px-6 py-3 font-semibold">Progress</th>
                <th className="px-6 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subjects.map((s) => {
                const low = s.attendance < 75;
                return (
                  <tr key={s.code} className="hover:bg-muted/30">
                    <td className="px-6 py-3.5 font-medium text-foreground">{s.name}</td>
                    <td className="px-6 py-3.5 font-mono text-xs text-muted-foreground">{s.code}</td>
                    <td className="px-6 py-3.5 font-bold">{s.attendance}%</td>
                    <td className="px-6 py-3.5 w-64">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${low ? "bg-warning" : "bg-primary"}`}
                          style={{ width: `${s.attendance}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          low ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {low ? "At Risk" : "Healthy"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filtered students */}
      <div className="mt-6 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/30 flex justify-between items-center">
          <h3 className="font-bold text-foreground">Student Records</h3>
          <span className="text-xs text-muted-foreground">{filtered.length} results</span>
        </div>
        <div className="divide-y divide-border">
          {filtered.map((r) => (
            <div key={r.id} className="px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-primary/10 text-primary grid place-items-center font-bold text-xs">
                  {r.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{r.name}</p>
                  <p className="text-[11px] text-muted-foreground font-mono">{r.id}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{r.time}</span>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="p-8 text-center text-sm text-muted-foreground">No students match your search.</p>
          )}
        </div>
      </div>
    </AppShell>
  );
}