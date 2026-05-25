import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Mail, Lock, User, GraduationCap, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in · Sentinel AI" },
      { name: "description", content: "Sign in or register to access your Sentinel AI attendance dashboard." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<"student" | "admin">("student");
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: role === "admin" ? "/admin" : "/dashboard" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left visual */}
      <div className="hidden lg:flex relative bg-accent text-accent-foreground p-12 flex-col justify-between overflow-hidden">
        <div className="absolute -top-20 -right-20 size-96 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-20 size-80 bg-primary/20 rounded-full blur-3xl" />

        <Link to="/" className="flex items-center gap-2.5 relative z-10">
          <div className="size-9 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground">S</div>
          <span className="font-bold tracking-tight">SENTINEL AI</span>
        </Link>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold leading-tight">
            Attendance management,<br />reimagined.
          </h1>
          <p className="mt-4 text-accent-foreground/70">
            Join 1,200+ institutions using Sentinel AI to eliminate proxy attendance and unlock real-time insights.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { icon: ShieldCheck, label: "Proxy-proof QR + GPS verification" },
              { icon: GraduationCap, label: "Per-subject attendance percentages" },
              { icon: User, label: "Auto-alerts when students fall behind" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-primary/15 text-primary grid place-items-center">
                  <f.icon className="size-4" />
                </div>
                <p className="text-sm text-accent-foreground/80">{f.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-accent-foreground/40">© 2026 Sentinel AI</p>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground">S</div>
              <span className="font-bold tracking-tight">SENTINEL AI</span>
            </Link>
          </div>

          <h2 className="text-3xl font-bold">{mode === "login" ? "Welcome back" : "Create your account"}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "login" ? "Sign in to access your dashboard." : "Start tracking attendance in minutes."}
          </p>

          {/* Role toggle */}
          <div className="mt-8 grid grid-cols-2 p-1 bg-muted rounded-lg">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`py-2 text-sm font-semibold rounded-md transition-all ${
                role === "student" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`py-2 text-sm font-semibold rounded-md transition-all ${
                role === "admin" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
              }`}
            >
              Admin / Teacher
            </button>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "register" && (
              <Field icon={User} label="Full name" placeholder="Alex Rivera" />
            )}
            <Field icon={Mail} label="Email" type="email" placeholder="you@university.edu" />
            <Field icon={Lock} label="Password" type="password" placeholder="••••••••" />

            {mode === "login" && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-muted-foreground">
                  <input type="checkbox" className="accent-primary" /> Remember me
                </label>
                <a href="#" className="text-primary font-semibold hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold shadow-md shadow-primary/20 hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
            >
              {mode === "login" ? "Sign in" : "Create account"} <ArrowRight className="size-4" />
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-muted-foreground">
            {mode === "login" ? "New to Sentinel? " : "Already have an account? "}
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-primary font-semibold hover:underline"
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  type = "text",
  placeholder,
}: {
  icon: typeof Mail;
  label: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground mb-1.5 block">{label}</label>
      <div className="flex items-center gap-2 px-3 h-11 rounded-xl bg-card border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        <Icon className="size-4 text-muted-foreground" />
        <input
          type={type}
          placeholder={placeholder}
          required
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}