import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { LogOut, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { actions, useStore } from "@/lib/store";
import { LogoText } from "./Logo";
import { cn } from "@/lib/utils";

export type NavItem = { to: string; label: string; icon: LucideIcon };

export function PanelShell({ nav, label, children }: { nav: NavItem[]; label: string; children: ReactNode }) {
  const { pathname } = useLocation();
  const session = useStore((s) => s.session);
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col bg-brand-dark p-4 text-sidebar-foreground md:flex">
        <LogoText className="px-2" />
        <p className="px-2 text-xs opacity-70">{label}</p>
        <nav className="mt-6 flex-1 space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                pathname === to ? "bg-brand text-primary-foreground shadow-glow" : "hover:bg-sidebar-accent",
              )}
            >
              <Icon className="h-4 w-4" />{label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => { actions.logout(); navigate({ to: "/login" }); }}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-sidebar-accent"
        >
          <LogOut className="h-4 w-4" />Logout
        </button>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-card px-4 py-3 md:px-8">
          <div className="flex gap-2 overflow-x-auto md:hidden">
            {nav.map(({ to, icon: Icon }) => (
              <Link key={to} to={to} className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg", pathname === to ? "bg-brand text-primary-foreground" : "bg-muted")}>
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
          <span className="hidden text-sm font-semibold md:block">{label}</span>
          <div className="flex items-center gap-2 text-sm">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-brand font-bold text-primary-foreground">{(session?.name ?? "A")[0]}</span>
            <span className="hidden sm:block">{session?.name ?? "Guest"}</span>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl font-bold">{value}</p>
      {hint && <p className="mt-1 text-xs font-medium text-success">{hint}</p>}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    approved: "bg-success/15 text-success",
    active: "bg-success/15 text-success",
    pending: "bg-warning/20 text-accent-foreground",
    rejected: "bg-destructive/15 text-destructive",
    banned: "bg-destructive/15 text-destructive",
  };
  return <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", map[status] ?? "bg-muted")}>{status}</span>;
}
