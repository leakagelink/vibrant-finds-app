import { Link, useLocation } from "@tanstack/react-router";
import { UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const tabs = [
  { to: "/", label: "Discover" },
  { to: "/saved", label: "My JAKAS" },
  { to: "/explore", label: "Drops" },
] as const;

export function UserShell({ children, title = "✨ Tonight looks exciting", subtitle = "Experiences near you", hideHeader = false, immersive = false, onLocationClick }: { children: ReactNode; title?: string; subtitle?: string; hideHeader?: boolean; immersive?: boolean; onLocationClick?: () => void }) {
  const { pathname } = useLocation();
  return (
    <div className={cn("jakas-app mx-auto max-w-md bg-background md:border-x", immersive ? "discover-shell" : "pb-28")}>
      {!hideHeader && <header className="jakas-header grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 pb-3 pt-7">
        <div className="min-w-0"><h1 className="text-lg font-extrabold leading-tight">{title}</h1>{onLocationClick ? <Button variant="ghost" className="mt-1 h-auto justify-start p-0 text-xs font-medium text-muted-foreground" aria-label="Use Current Location" onClick={onLocationClick}>{subtitle}</Button> : <p className="mt-1 text-xs font-medium text-muted-foreground">{subtitle}</p>}</div>
        <Link to="/profile" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-brand-orange bg-secondary text-secondary-foreground" aria-label="My profile">
          <UserRound className="h-5 w-5 fill-brand-purple text-brand-purple" />
        </Link>
      </header>}
      <main className={cn("px-4 py-1", immersive && "discover-main")}>{children}</main>
      <nav aria-label="Main navigation" className="jakas-nav fixed inset-x-5 z-40 mx-auto grid max-w-[408px] grid-cols-3 rounded-[28px] border bg-card/95 px-3 py-2 shadow-nav backdrop-blur">
        {tabs.map(({ to, label }) => {
          const active = pathname === to;
          return (
            <Link key={to} to={to} aria-label={label} aria-current={active ? "page" : undefined} className={cn("flex flex-col items-center gap-1 text-[10px] font-bold", active ? "text-brand-orange" : "text-muted-foreground")}>
              <span className={cn("jakas-tab-icon grid h-10 w-10 place-items-center rounded-full", active ? "bg-action text-primary-foreground shadow-action" : "bg-muted text-warning")}><span aria-hidden="true" className="text-lg">{to === "/" ? "🔥" : to === "/saved" ? "⭐" : "🚀"}</span></span>
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
