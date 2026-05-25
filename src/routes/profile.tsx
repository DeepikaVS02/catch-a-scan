import { createFileRoute } from "@tanstack/react-router";
import { Bell, Lock, MapPin, Smartphone } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { currentUser } from "@/lib/mock-data";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile Settings · Sentinel AI" }] }),
  component: Profile,
});

function Profile() {
  return (
    <AppShell title="Profile Settings" subtitle="Manage your account and notifications">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 flex flex-col items-center text-center">
          <div className="size-24 rounded-2xl bg-primary/10 border border-primary/20 grid place-items-center text-primary text-3xl font-bold">
            {currentUser.avatar}
          </div>
          <h2 className="mt-4 font-bold text-lg text-foreground">{currentUser.name}</h2>
          <p className="text-sm text-muted-foreground">{currentUser.email}</p>
          <span className="mt-3 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            {currentUser.role} · {currentUser.studentId}
          </span>
          <button className="mt-6 w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors">
            Change avatar
          </button>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-sm p-6">
          <h3 className="font-bold text-foreground mb-1">Personal Information</h3>
          <p className="text-xs text-muted-foreground mb-6">
            Update how your name and contact info appear across Sentinel.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Full name" defaultValue={currentUser.name} />
            <Field label="Email" type="email" defaultValue={currentUser.email} />
            <Field label="Student ID" defaultValue={currentUser.studentId} />
            <Field label="Department" defaultValue={currentUser.department} />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button className="px-5 py-2.5 rounded-lg text-sm font-semibold text-muted-foreground hover:bg-muted">
              Cancel
            </button>
            <button className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-md shadow-primary/20 hover:bg-primary-dark transition-colors">
              Save changes
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <SettingsCard
          icon={Bell}
          title="Notifications"
          rows={[
            { label: "Low attendance alerts", desc: "Email when subject falls below 75%", on: true },
            { label: "Session reminders", desc: "Push notification 10 minutes before class", on: true },
            { label: "Weekly summary", desc: "Email digest every Monday morning", on: false },
          ]}
        />
        <SettingsCard
          icon={Lock}
          title="Security"
          rows={[
            { label: "Two-factor authentication", desc: "Add an extra layer with SMS or TOTP", on: true },
            { label: "Biometric login", desc: "Use FaceID or fingerprint on mobile", on: true },
            { label: "Session logout", desc: "Auto-logout after 30 minutes idle", on: false },
          ]}
        />
        <SettingsCard
          icon={MapPin}
          title="Location"
          rows={[
            { label: "GPS verification", desc: "Required for proxy-proof attendance", on: true },
            { label: "Background tracking", desc: "Only during active class sessions", on: false },
          ]}
        />
        <SettingsCard
          icon={Smartphone}
          title="Connected Devices"
          rows={[
            { label: "iPhone 15 — primary", desc: "Last used today, 09:02 AM", on: true },
            { label: "Chrome on MacBook", desc: "Last used yesterday, 14:30 PM", on: true },
          ]}
        />
      </div>
    </AppShell>
  );
}

function Field({
  label,
  type = "text",
  defaultValue,
}: {
  label: string;
  type?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
        {label}
      </label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full h-11 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
      />
    </div>
  );
}

function SettingsCard({
  icon: Icon,
  title,
  rows,
}: {
  icon: typeof Bell;
  title: string;
  rows: { label: string; desc: string; on: boolean }[];
}) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="size-9 rounded-lg bg-primary/10 text-primary grid place-items-center">
          <Icon className="size-4" />
        </div>
        <h3 className="font-bold text-foreground">{title}</h3>
      </div>
      <div className="space-y-4">
        {rows.map((r) => (
          <div key={r.label} className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{r.label}</p>
              <p className="text-xs text-muted-foreground">{r.desc}</p>
            </div>
            <button
              type="button"
              className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                r.on ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`absolute top-0.5 size-5 rounded-full bg-card shadow transition-all ${
                  r.on ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}