import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/business/analytics")({ component: Analytics });

function Analytics() {
  const session = useStore((s) => s.session)!;
  const mine = useStore((s) => s.moments).filter((m) => m.host === session.name);
  const data = mine.map((m) => ({ name: m.title.slice(0, 12), Likes: m.likes, Comments: m.comments.length, Shares: m.shares }));
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User engagement</h1>
      <div className="h-72 rounded-2xl border bg-card p-5">
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="name" fontSize={12} />
            <Tooltip />
            <Bar dataKey="Likes" fill="var(--brand-orange)" radius={6} />
            <Bar dataKey="Comments" fill="var(--brand-pink)" radius={6} />
            <Bar dataKey="Shares" fill="var(--brand-purple)" radius={6} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="overflow-x-auto rounded-2xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left"><tr>{["Moment", "Views", "Likes", "Comments", "Shares"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
          <tbody>{mine.map((m) => <tr key={m.id} className="border-t"><td className="p-3 font-medium">{m.title}</td><td className="p-3">{m.views}</td><td className="p-3">{m.likes}</td><td className="p-3">{m.comments.length}</td><td className="p-3">{m.shares}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
