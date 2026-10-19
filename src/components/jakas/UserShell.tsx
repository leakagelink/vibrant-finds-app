import { Link, useLocation } from "@tanstack/react-router";
import { UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", emoji: "🔥", label: "Discover" },
  { to: "/saved", emoji: "⭐", label: "My JAKAS" },
  { to: "/explore", emoji: "🚀", label: "Drops" },
] as const;

export function UserShell({ children, title = "✨ Tonight looks exciting", subtitle = "Experiences near you", hideHeader = false }: { children: ReactNode; title?: string; subtitle?: string; hideHeader?: boolean }) {
  const { pathname } = useLocation();
  return (
    <div className="jakas-app mx-auto max-w-md bg-background pb-28 md:border-x">
      {!hideHeader && <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 pb-3 pt-7">
        <div className="min-w-0"><h1 className="text-xl font-extrabold leading-tight">{title}</h1><p className="mt-1 text-xs font-medium text-muted-foreground">{subtitle}</p></div>
        <Link to="/profile" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-brand-orange bg-secondary text-secondary-foreground" aria-label="My profile">
          <UserRound className="h-5 w-5" />
        </Link>
      </header>}
      <main className="px-4 py-1">{children}</main>
      <nav aria-label="Main navigation" className="jakas-nav fixed inset-x-5 z-40 mx-auto grid max-w-[408px] grid-cols-3 rounded-[28px] border bg-card/95 px-3 py-2 shadow-nav backdrop-blur">
        {tabs.map(({ to, emoji, label }) => {
          const active = pathname === to;
          return (
            <Link key={to} to={to} aria-current={active ? "page" : undefined} className={cn("flex flex-col items-center gap-1 text-[10px] font-bold", active ? "text-brand-orange" : "text-muted-foreground")}>
              <span className={cn("grid h-10 w-10 place-items-center rounded-full text-xl", active ? "bg-action shadow-action" : "bg-muted")}>{emoji}</span>
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
