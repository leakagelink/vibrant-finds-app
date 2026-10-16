import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { BadgeCheck, LayoutDashboard, Megaphone, ShieldAlert, Tags, Users } from "lucide-react";
import { PanelShell } from "@/components/jakas/PanelShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin portal — JAKAS" },
      { name: "description", content: "Moderate content, verify hosts and manage the JAKAS platform." },
      { property: "og:title", content: "Admin portal — JAKAS" },
      { property: "og:description", content: "Monitor, moderate and keep JAKAS safe." },
    ],
  }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/moderation", label: "Content Moderation", icon: ShieldAlert },
  { to: "/admin/hosts", label: "Host Verification", icon: BadgeCheck },
  { to: "/admin/users", label: "Users / Hosts", icon: Users },
  { to: "/admin/categories", label: "Categories & Locations", icon: Tags },
  { to: "/admin/featured", label: "Featured & Notify", icon: Megaphone },
];

function AdminLayout() {
  const session = useStore((s) => s.session);
  if (session?.role !== "admin")
    return (
      <div className="grid min-h-screen place-items-center p-6 text-center">
        <div><h1 className="mb-2 text-3xl font-bold">Admin access only</h1>
          <Link to="/login" className="inline-block rounded-full bg-brand px-6 py-3 font-bold text-primary-foreground">Log in as Admin</Link></div>
      </div>
    );
  return <PanelShell nav={nav} label="Admin Portal"><Outlet /></PanelShell>;
}
