import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  ScanLine,
  BarChart3,
  Settings,
  Users,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Moon,
  Sun,
} from "lucide-react";
import { currentUser } from "@/lib/mock-data";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin", label: "Admin Console", icon: Users },
  { to: "/scanner", label: "QR Scanner", icon: ScanLine },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/profile", label: "Settings", icon: Settings },
] as const;

function useDarkMode() {
  const [dark, setDark] = useState(false);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", next);
    }
  };
  return { dark, toggle };
}

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const { dark, toggle } = useDarkMode();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-sidebar text-sidebar-foreground flex-col transform transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 flex`}
      >
        <div className="p-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="size-9 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground shadow-lg shadow-primary/30">
              S
            </div>
            <span className="font-semibold tracking-tight">SENTINEL AI</span>
          </Link>
          <button
            className="lg:hidden text-sidebar-foreground/60"
            onClick={() => setMobileOpen(false)}
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-2">
          {nav.map((item) => {
            const active = path.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-2.5 rounded-lg flex items-center gap-3 text-sm transition-all ${
                  active
                    ? "bg-primary/15 text-primary border-l-4 border-primary font-medium"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/40"
                }`}
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4">
          <div className="p-4 bg-sidebar-accent/40 rounded-xl">
            <p className="text-[10px] text-sidebar-foreground/50 mb-2 uppercase tracking-wider font-bold">
              Attendance Health
            </p>
            <div className="h-2 bg-sidebar-foreground/10 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: "88%" }} />
            </div>
            <p className="text-xs mt-2 text-sidebar-foreground/70">88% overall presence</p>
          </div>
          <button className="mt-4 w-full px-4 py-2.5 rounded-lg text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/40 flex items-center gap-3 transition-colors">
            <LogOut className="size-4" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4 min-w-0">
            <button
              className="lg:hidden text-foreground"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-5" />
            </button>
            <div className="min-w-0">
              <h2 className="text-foreground font-semibold truncate">{title}</h2>
              {subtitle && (
                <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
              )}
            </div>
            <span className="hidden md:inline-flex px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 h-9 rounded-lg bg-muted text-muted-foreground text-sm w-64">
              <Search className="size-4" />
              <input
                placeholder="Search students, sessions..."
                className="bg-transparent outline-none flex-1 placeholder:text-muted-foreground"
              />
            </div>
            <button
              onClick={toggle}
              className="size-9 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground"
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <button className="size-9 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground relative">
              <Bell className="size-4" />
              <span className="absolute top-2 right-2 size-1.5 rounded-full bg-destructive" />
            </button>
            <div className="flex items-center gap-2 pl-2 md:pl-3 border-l border-border">
              <div className="size-8 rounded-full bg-primary/10 border border-primary/20 grid place-items-center text-primary font-bold text-sm">
                {currentUser.avatar}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-foreground leading-none">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {currentUser.role}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}