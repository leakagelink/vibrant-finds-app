import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { UserShell } from "@/components/jakas/UserShell";
import { MomentCard } from "@/components/jakas/MomentCard";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { isPublicHostMoment } from "@/lib/moment-visibility";
import { getTiming } from "@/lib/moment-time";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "My JAKAS — Your saved experiences" },
      { name: "description", content: "Events you're in, liked and attended on JAKAS." },
      { property: "og:title", content: "My JAKAS — Your saved experiences" },
      { property: "og:description", content: "Events you're in, liked and attended." },
    ],
  }),
  component: Saved,
});

const tabs = [
  { key: "in", emoji: "🔥", label: "I'm In", tone: "text-brand-orange bg-brand-orange/10" },
  { key: "liked", emoji: "💗", label: "Liked", tone: "text-brand-purple bg-brand-purple/10" },
  { key: "past", emoji: "🕓", label: "Past", tone: "text-secondary-foreground bg-muted" },
] as const;

function Saved() {
  const moments = useStore((s) => s.moments).filter(isPublicHostMoment);
  const saved = useStore((s) => s.saved);
  const liked = useStore((s) => s.liked);
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("in");
  const ended = (m: (typeof moments)[number]) => getTiming(m).state === "ended";
  const lists = {
    in: moments.filter((m) => saved.includes(m.id) && !ended(m)),
    liked: moments.filter((m) => liked.includes(m.id) && !ended(m)),
    past: moments.filter((m) => (saved.includes(m.id) || liked.includes(m.id)) && ended(m)),
  };
  const list = lists[tab];
  return <UserShell title="⭐ My JAKAS" subtitle={`${lists.in.length} upcoming experiences`}>
    <div role="tablist" aria-label="My JAKAS sections" className="mb-5 mt-2 grid grid-cols-3 gap-2">
      {tabs.map((t) => <button key={t.key} role="tab" aria-selected={tab === t.key} onClick={() => setTab(t.key)} className={`flex h-24 flex-col items-center justify-center gap-1 rounded-[20px] border-2 transition-all ${tab === t.key ? `${t.tone} border-current scale-[1.03] shadow-nav` : "border-transparent bg-muted text-muted-foreground"}`}>
        <span className="text-xl">{t.emoji}</span><span className="text-lg font-extrabold">{lists[t.key].length}</span><span className="text-[11px] font-bold">{t.label}</span>
      </button>)}
    </div>
    <div key={tab} className="tab-fade space-y-4">
      {list.map((m) => <div key={m.id} className={tab === "past" ? "opacity-70 grayscale-[40%]" : undefined}><MomentCard m={m} compact /></div>)}
    </div>
    {list.length === 0 && <div className="py-12 text-center"><p className="text-5xl">{tab === "in" ? "🔥" : tab === "liked" ? "💗" : "🕓"}</p><h3 className="mt-3 text-lg font-extrabold">{tab === "past" ? "No past events yet" : "Your next great memory"}</h3><p className="mx-auto mt-2 max-w-64 text-sm leading-6 text-muted-foreground">{tab === "in" ? "Swipe right or tap I'm In on an event." : tab === "liked" ? "Tap the heart on events you love." : "Events you joined will appear here after they end."}</p>{tab !== "past" && <Button asChild variant="action" className="mt-6 h-12"><Link to="/">Discover experiences →</Link></Button>}</div>}
  </UserShell>;
}
