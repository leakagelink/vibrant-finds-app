import { createFileRoute, Link } from "@tanstack/react-router";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Stat, StatusBadge } from "@/components/jakas/PanelShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/business/")({ component: Dashboard });

const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => ({ d, v: [120, 300, 240, 520, 480, 860, 720][i] }));

function Dashboard() {
  const session = useStore((s) => s.session)!;
  const mine = useStore((s) => s.moments.filter((m) => m.host === session.name));
  const views = mine.reduce((a, m) => a + m.views, 0);
  const likes = mine.reduce((a, m) => a + m.likes, 0);
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold">Welcome back, <span className="text-brand">{session.name}</span>!</h1><p className="text-muted-foreground">Here's what's happening with your moments.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total moments" value={mine.length} />
        <Stat label="Live now" value={mine.filter((m) => m.status === "approved").length} />
        <Stat label="Total views" value={views.toLocaleString()} hint="+12% this week" />
        <Stat label="Total likes" value={likes} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5 lg:col-span-2">
          <p className="mb-3 font-semibold">Performance overview</p>
          <div className="h-56">
            <ResponsiveContainer>
              <AreaChart data={week}>
                <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stopColor="var(--brand-orange)" /><stop offset="0.5" stopColor="var(--brand-pink)" /><stop offset="1" stopColor="var(--brand-purple)" /></linearGradient></defs>
                <XAxis dataKey="d" tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip />
                <Area dataKey="v" stroke="url(#g)" strokeWidth={3} fill="url(#g)" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="space-y-3 rounded-2xl border bg-card p-5">
          <p className="font-semibold">Quick actions</p>
          <Link to="/business/create" className="block rounded-xl bg-brand py-3 text-center font-bold text-primary-foreground shadow-glow">+ Create Moment</Link>
          <Link to="/business/analytics" className="block rounded-xl border py-3 text-center font-semibold">View engagement</Link>
          {mine.slice(0, 3).map((m) => <div key={m.id} className="flex items-center justify-between text-sm"><span className="truncate">{m.title}</span><StatusBadge status={m.status} /></div>)}
        </div>
      </div>
    </div>
  );
}
