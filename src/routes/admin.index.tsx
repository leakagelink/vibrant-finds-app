import { createFileRoute } from "@tanstack/react-router";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Stat } from "@/components/jakas/PanelShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/")({ head: () => ({ meta: [{ title: 'Admin overview — JAKAS' }, { name: "description", content: 'Admin overview on JAKAS.' }, { property: "og:title", content: 'Admin overview — JAKAS' }, { property: "og:description", content: 'Admin overview on JAKAS.' }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: AdminHome });

const data = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => ({ d, Events: [40, 60, 55, 90, 120, 160, 140][i], Users: [80, 120, 140, 180, 220, 300, 280][i] }));

function AdminHome() {
  const s = useStore((x) => x);
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold">Welcome back, <span className="text-brand">Admin</span></h1><p className="text-muted-foreground">Here's what's happening on JAKAS today.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total hosts" value={s.hosts.length} />
        <Stat label="Total users" value={s.users.length} />
        <Stat label="Pending approvals" value={s.moments.filter((m) => m.status === "pending").length + s.hosts.filter((h) => h.status === "pending").length} />
        <Stat label="Reported content" value={s.moments.filter((m) => m.reports > 0).length} />
      </div>
      <div className="h-72 rounded-2xl border bg-card p-5">
        <p className="mb-2 font-semibold">Platform activity</p>
        <ResponsiveContainer height="90%">
          <LineChart data={data}>
            <XAxis dataKey="d" fontSize={12} axisLine={false} tickLine={false} />
            <Tooltip />
            <Line dataKey="Events" stroke="var(--brand-pink)" strokeWidth={3} dot={false} />
            <Line dataKey="Users" stroke="var(--brand-purple)" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
