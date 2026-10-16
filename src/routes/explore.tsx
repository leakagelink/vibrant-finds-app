import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { UserShell } from "@/components/jakas/UserShell";
import { MomentCard } from "@/components/jakas/MomentCard";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore nearby events — JAKAS" },
      { name: "description", content: "Search nearby posts, events and places on JAKAS." },
      { property: "og:title", content: "Explore nearby events — JAKAS" },
      { property: "og:description", content: "Search nearby posts, events and places." },
    ],
  }),
  component: Explore,
});

function Explore() {
  const moments = useStore((s) => s.moments);
  const [q, setQ] = useState("");
  const [radius, setRadius] = useState(10);
  const needle = q.toLowerCase();
  const results = moments.filter(
    (m) => m.status === "approved" && m.distanceKm <= radius &&
      [m.title, m.location, m.category, m.host].some((x) => x.toLowerCase().includes(needle)),
  );
  return (
    <UserShell title="Explore">
      <div className="relative mb-3">
        <Search className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search events, places, hosts…" className="h-11 w-full rounded-full border bg-card pl-11 pr-4 outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <div className="mb-4 flex items-center gap-3 text-sm">
        <span className="text-muted-foreground">Within</span>
        {[1, 5, 10, 25].map((r) => (
          <button key={r} onClick={() => setRadius(r)} className={`rounded-full px-3 py-1 ${radius === r ? "bg-brand text-primary-foreground" : "bg-muted"}`}>{r} km</button>
        ))}
      </div>
      <div className="space-y-4">
        {results.map((m) => <MomentCard key={m.id} m={m} />)}
        {results.length === 0 && <p className="py-10 text-center text-muted-foreground">No matches nearby.</p>}
      </div>
    </UserShell>
  );
}
