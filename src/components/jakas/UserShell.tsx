import { Link, useLocation } from "@tanstack/react-router";
import { Bell, Bookmark, Compass, Home, PlusCircle, User } from "lucide-react";
import type { ReactNode } from "react";
import { useStore } from "@/lib/store";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/explore", icon: Compass, label: "Explore" },
  { to: "/create", icon: PlusCircle, label: "Post" },
  { to: "/saved", icon: Bookmark, label: "Saved" },
  { to: "/profile", icon: User, label: "Me" },
] as const;

export function UserShell({ children, title }: { children: ReactNode; title?: string }) {
  const { pathname } = useLocation();
  const unread = useStore((s) => s.notices.filter((n) => !n.read).length);
  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-24 md:border-x">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-background/90 px-4 py-2 backdrop-blur">
        {title ? <h1 className="text-2xl font-bold">{title}</h1> : <Logo className="h-11" />}
        <Link to="/notifications" className="relative grid h-10 w-10 place-items-center rounded-full bg-muted" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unread > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-brand text-[10px] font-bold text-primary-foreground">{unread}</span>}
        </Link>
      </header>
      <main className="px-4 py-4">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-md justify-around border-t bg-card/95 py-2 backdrop-blur">
        {tabs.map(({ to, icon: Icon, label }) => {
          const active = pathname === to;
          return (
            <Link key={to} to={to} className={cn("flex flex-col items-center gap-0.5 px-3 text-[11px] font-medium", active ? "text-primary" : "text-muted-foreground")}>
              {to === "/create" ? (
                <span className="-mt-6 grid h-12 w-12 place-items-center rounded-full bg-brand text-primary-foreground shadow-glow"><Icon className="h-6 w-6" /></span>
              ) : (
                <Icon className="h-5 w-5" />
              )}
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
