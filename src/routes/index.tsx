import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ScanLine,
  ShieldCheck,
  BarChart3,
  MapPin,
  Bell,
  Smartphone,
  ArrowRight,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sentinel AI — Smart Attendance for Modern Institutions" },
      {
        name: "description",
        content:
          "Eliminate proxy attendance with AI-verified QR check-ins, geofencing, and real-time analytics. Built for colleges and workplaces.",
      },
      { property: "og:title", content: "Sentinel AI — Smart Attendance" },
      {
        property: "og:description",
        content: "AI-powered, proxy-proof attendance tracking with QR + GPS verification.",
      },
    ],
  }),
  component: LandingPage,
});

const features = [
  {
    icon: ScanLine,
    title: "Dynamic QR Sessions",
    body: "Codes rotate every 30 seconds. Screenshots and shared codes simply don't work.",
  },
  {
    icon: MapPin,
    title: "GPS Geofencing",
    body: "Attendance only registers when the student is physically inside the classroom.",
  },
  {
    icon: BarChart3,
    title: "Live Analytics",
    body: "Track department, subject, and student trends in real time with rich dashboards.",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    body: "Automated notifications to students and guardians when attendance drops below threshold.",
  },
  {
    icon: ShieldCheck,
    title: "Zero Proxy",
    body: "Cryptographic session tokens combined with biometric checks defeat proxy attendance.",
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    body: "Beautiful responsive interface designed for phones, tablets, and lecture-hall projectors.",
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground shadow-md shadow-primary/30">
              S
            </div>
            <span className="font-bold tracking-tight">SENTINEL AI</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground hidden sm:inline">
              Sign in
            </Link>
            <Link
              to="/login"
              className="text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-md shadow-primary/20 hover:bg-primary-dark transition-colors"
            >
              Launch Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-light/40 via-background to-background" />
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 lg:pt-28 lg:pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6">
                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                AI-Powered • Proxy-Proof
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
                Attendance that <span className="text-primary">just works.</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-xl">
                Sentinel AI eliminates manual roll-calls, proxy attendance, and messy spreadsheets with
                dynamic QR codes, GPS verification, and real-time analytics — purpose-built for colleges
                and workplaces.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all"
                >
                  Get started free <ArrowRight className="size-4" />
                </Link>
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 bg-card border border-border text-foreground px-6 py-3 rounded-xl font-semibold hover:bg-muted transition-colors"
                >
                  See live demo
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Check className="size-4 text-emerald-600" /> No credit card</div>
                <div className="flex items-center gap-2"><Check className="size-4 text-emerald-600" /> Setup in 5 minutes</div>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl blur-2xl -z-10" />
              <div className="bg-card border border-border rounded-2xl shadow-2xl shadow-primary/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Active Session
                    </p>
                    <h3 className="font-bold mt-1">CS101 · Data Structures</h3>
                  </div>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">
                    Live
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-muted/40 rounded-xl p-3">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Present</p>
                    <p className="text-2xl font-bold mt-1">42</p>
                  </div>
                  <div className="bg-muted/40 rounded-xl p-3">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Late</p>
                    <p className="text-2xl font-bold mt-1 text-warning">3</p>
                  </div>
                  <div className="bg-muted/40 rounded-xl p-3">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Absent</p>
                    <p className="text-2xl font-bold mt-1 text-destructive">5</p>
                  </div>
                </div>
                <div className="bg-accent text-accent-foreground rounded-xl p-4 flex items-center gap-4">
                  <div className="size-16 bg-card rounded-lg grid grid-cols-5 gap-0.5 p-1.5">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className={(i * 7) % 3 === 0 ? "bg-accent" : "bg-muted/40"}
                      />
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-accent-foreground/60 uppercase tracking-wider font-bold">
                      Dynamic QR
                    </p>
                    <p className="font-mono text-2xl font-bold">00:24<span className="text-sm text-accent-foreground/40">s</span></p>
                    <p className="text-[10px] text-accent-foreground/60 mt-1">Rotates automatically</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <p className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Platform</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Everything you need to run attendance, nothing you don't.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all"
              >
                <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <f.icon className="size-5" />
                </div>
                <h3 className="font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 lg:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12 max-w-2xl">
            From roll-call to results in three steps.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "01", t: "Generate session", d: "Teacher opens the admin console and starts a session for the class — a rotating QR appears on screen." },
              { n: "02", t: "Students scan", d: "Students scan within the geofence. GPS + token verification ensures only people in the room can check in." },
              { n: "03", t: "Get insights", d: "Real-time charts, per-subject percentages, and automatic low-attendance alerts. Export to PDF anytime." },
            ].map((s) => (
              <div key={s.n} className="bg-card border border-border rounded-2xl p-8">
                <p className="text-5xl font-extrabold text-primary/20 mb-4">{s.n}</p>
                <h3 className="font-bold text-lg mb-2">{s.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-accent text-accent-foreground rounded-3xl p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-full bg-primary/20 -rotate-12 translate-x-32" />
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                Ready to retire the attendance register?
              </h2>
              <p className="mt-4 text-accent-foreground/70 text-lg">
                Set up Sentinel AI for your institution in minutes. Free for up to 100 students.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-primary-dark transition-colors"
                >
                  Start free trial
                </Link>
                <Link
                  to="/admin"
                  className="bg-card text-foreground px-6 py-3 rounded-xl font-semibold hover:bg-muted transition-colors"
                >
                  View demo dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="size-6 bg-primary rounded grid place-items-center text-primary-foreground text-xs font-bold">S</div>
            <span className="text-sm font-semibold">SENTINEL AI</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 Sentinel AI · Institutional grade · ISO 27001
          </p>
        </div>
      </footer>
    </div>
  );
}
