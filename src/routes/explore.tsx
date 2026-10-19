import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { UserShell } from "@/components/jakas/UserShell";
import { MomentCard } from "@/components/jakas/MomentCard";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { isPublicHostMoment } from "@/lib/moment-visibility";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore nearby events — JAKAS" },
      { name: "description", content: "Search nearby posts, events and places on JAKAS." },
      { property: "og:title", content: "Explore nearby events — JAKAS" },
      { property: "og:description", content: "Search nearby posts, events and places." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Explore,
});

function Explore() {
  const moments = useStore((s) => s.moments);
  const [filters, setFilters] = useState(false);
  const [q, setQ] = useState("");
  const [radius, setRadius] = useState(10);
  const [price, setPrice] = useState("All");
  const needle = q.toLowerCase();
  const results = moments.filter(
    (m) => isPublicHostMoment(m) && m.distanceKm <= radius &&
      (price === "All" || (price === "Free" ? m.price.toLowerCase() === "free" : m.price.toLowerCase() !== "free")) &&
      [m.title, m.location, m.category, m.host].some((x) => x.toLowerCase().includes(needle)),
  );
  return (
    <UserShell title="🚀 Drops" subtitle="Coming soon near you">
      <div className="mb-5 flex items-center gap-4 rounded-[18px] border border-brand-purple/20 bg-brand-purple/5 px-4 py-4"><span className="text-2xl">⚡</span><div><p className="text-xs font-extrabold text-brand-purple">More experiences to look forward to</p><p className="mt-1 text-xs text-brand-purple">Discover what’s coming near you</p></div></div>
      <Button variant="ghost" className="mb-2 text-xs text-muted-foreground" onClick={() => setFilters(!filters)} aria-expanded={filters}><SlidersHorizontal />Search & filters</Button>
      {filters && <div>
      <div className="relative mb-3">
        <Search className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search events, places, hosts…" className="h-11 w-full rounded-full border bg-card pl-11 pr-4 outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <div className="mb-4 flex items-center gap-3 text-sm">
        <span className="text-muted-foreground">Within</span>
        {[1, 5, 10, 25].map((r) => (
          <Button key={r} size="sm" variant={radius === r ? "default" : "secondary"} aria-pressed={radius === r} onClick={() => setRadius(r)}>{r} km</Button>
        ))}
      </div>
      <div className="mb-4 flex gap-2" aria-label="Price filter">{["All", "Free", "Paid"].map((p) => <Button key={p} size="sm" variant={price === p ? "default" : "outline"} aria-pressed={price === p} onClick={() => setPrice(p)}>{p}</Button>)}</div>
      </div>}
      <div className="space-y-5">
        {results.map((m) => <MomentCard key={m.id} m={m} drop />)}
        {results.length === 0 && <p className="py-10 text-center text-muted-foreground">No matches nearby.</p>}
      </div>
    </UserShell>
  );
}
