import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { BarChart3, LayoutDashboard, ListVideo, PlusCircle, Store } from "lucide-react";
import { PanelShell } from "@/components/jakas/PanelShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/business")({
  head: () => ({
    meta: [
      { title: "Business panel — JAKAS" },
      { name: "description", content: "Create and manage your events and see engagement on JAKAS." },
      { property: "og:title", content: "Business panel — JAKAS" },
      { property: "og:description", content: "Create moments, reach more people, grow your business." },
    ],
  }),
  component: BusinessLayout,
});

const nav = [
  { to: "/business", label: "Dashboard", icon: LayoutDashboard },
  { to: "/business/create", label: "Create Moment", icon: PlusCircle },
  { to: "/business/moments", label: "My Moments", icon: ListVideo },
  { to: "/business/analytics", label: "Engagement", icon: BarChart3 },
  { to: "/business/profile", label: "Business Profile", icon: Store },
];

function BusinessLayout() {
  const session = useStore((s) => s.session);
  if (session?.role !== "business")
    return (
      <div className="grid min-h-screen place-items-center p-6 text-center">
        <div><h1 className="mb-2 text-3xl font-bold">Business login required</h1>
          <Link to="/login" className="inline-block rounded-full bg-brand px-6 py-3 font-bold text-primary-foreground">Register / Log in as Business</Link></div>
      </div>
    );
  return <PanelShell nav={nav} label="Host Dashboard"><Outlet /></PanelShell>;
}
