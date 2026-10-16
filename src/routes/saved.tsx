import { createFileRoute } from "@tanstack/react-router";
import { MapPin, X } from "lucide-react";
import { useState } from "react";
import { UserShell } from "@/components/jakas/UserShell";
import { MomentCard } from "@/components/jakas/MomentCard";
import { actions, useStore } from "@/lib/store";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved places & events — JAKAS" },
      { name: "description", content: "Your favourite places and saved events on JAKAS." },
      { property: "og:title", content: "Saved — JAKAS" },
      { property: "og:description", content: "Your favourite places and events." },
    ],
  }),
  component: Saved,
});

function Saved() {
  const moments = useStore((s) => s.moments);
  const saved = useStore((s) => s.saved);
  const places = useStore((s) => s.savedPlaces);
  const [p, setP] = useState("");
  const list = moments.filter((m) => saved.includes(m.id));
  return (
    <UserShell title="Saved">
      <h3 className="mb-2 text-lg font-bold">Favourite places</h3>
      <form className="mb-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); const v = p.trim().slice(0, 60); if (v) { actions.toggleSavePlace(v); setP(""); } }}>
        <input value={p} onChange={(e) => setP(e.target.value)} placeholder="Add a place…" className="flex-1 rounded-full border bg-card px-4 py-2 text-sm" />
        <button className="rounded-full bg-brand px-4 text-sm font-bold text-primary-foreground">Add</button>
      </form>
      <div className="mb-6 flex flex-wrap gap-2">
        {places.map((x) => (
          <span key={x} className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
            <MapPin className="h-3.5 w-3.5" />{x}<button onClick={() => actions.toggleSavePlace(x)} aria-label="Remove"><X className="h-3.5 w-3.5" /></button>
          </span>
        ))}
        {places.length === 0 && <p className="text-sm text-muted-foreground">No places yet.</p>}
      </div>
      <h3 className="mb-2 text-lg font-bold">Saved events</h3>
      <div className="space-y-4">
        {list.map((m) => <MomentCard key={m.id} m={m} />)}
        {list.length === 0 && <p className="text-sm text-muted-foreground">Tap the bookmark on any event to save it.</p>}
      </div>
    </UserShell>
  );
}
