import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { LocateFixed, MapPin } from "lucide-react";
import { toast } from "sonner";
import { UserShell } from "@/components/jakas/UserShell";
import { MomentCard } from "@/components/jakas/MomentCard";
import { actions, useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JAKAS — Nearby events & moments right now" },
      { name: "description", content: "See what's happening near you: live events, food, music and activities." },
      { property: "og:title", content: "JAKAS — What's happening, right now" },
      { property: "og:description", content: "Discover nearby events, moments and activities." },
    ],
  }),
  component: Home,
});

function Home() {
  const moments = useStore((s) => s.moments);
  const location = useStore((s) => s.location);
  const session = useStore((s) => s.session);
  const categories = useStore((s) => s.categories);
  const [cat, setCat] = useState("All");

  const locate = () => {
    if (!navigator.geolocation) { toast.error("Location not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => { actions.setLocation({ label: "Near you", lat: p.coords.latitude, lng: p.coords.longitude }); toast.success("Showing moments near you"); },
      () => { actions.setLocation({ label: "Surampalem, AP" }); toast("Permission denied — using Surampalem"); },
    );
  };

  const live = moments
    .filter((m) => m.status === "approved" && (cat === "All" || m.category === cat))
    .sort((a, b) => a.distanceKm - b.distanceKm);
  const featured = live.filter((m) => m.featured);

  return (
    <UserShell>
      <div className="mb-4 rounded-3xl bg-brand p-5 text-primary-foreground shadow-glow">
        <p className="text-sm opacity-90">{session ? `Hey ${session.name.split(" ")[0]} 👋` : "Welcome to JAKAS"}</p>
        <h2 className="text-3xl font-extrabold leading-tight">What's happening, right now.</h2>
        <button onClick={locate} className="mt-3 flex items-center gap-2 rounded-full bg-card/20 px-4 py-2 text-sm font-semibold backdrop-blur">
          {location ? <MapPin className="h-4 w-4" /> : <LocateFixed className="h-4 w-4" />}
          {location ? location.label : "Use my current location"}
        </button>
        {!session && <Link to="/login" className="ml-2 mt-3 inline-block rounded-full bg-card px-4 py-2 text-sm font-bold text-primary">Sign up</Link>}
      </div>

      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {["All", ...categories].map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium ${cat === c ? "bg-foreground text-background" : "bg-muted"}`}>{c}</button>
        ))}
      </div>

      {featured.length > 0 && cat === "All" && (
        <section className="mb-5">
          <h3 className="mb-2 text-lg font-bold">🔥 Featured near you</h3>
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
            {featured.map((m) => (
              <div key={m.id} className="relative h-40 w-64 shrink-0 overflow-hidden rounded-2xl">
                <img src={m.image} alt={m.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-foreground/80 to-transparent p-3 text-background">
                  <p className="font-display text-lg font-bold leading-tight">{m.title}</p>
                  <p className="text-xs">{m.distanceKm} km · {m.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <h3 className="mb-2 text-lg font-bold">Nearby moments</h3>
      <div className="space-y-4">
        {live.map((m) => <MomentCard key={m.id} m={m} />)}
        {live.length === 0 && <p className="py-10 text-center text-muted-foreground">Nothing here yet.</p>}
      </div>
    </UserShell>
  );
}
