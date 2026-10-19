import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Clock, Flame, Star } from "lucide-react";
import { UserShell } from "@/components/jakas/UserShell";
import { MomentCard } from "@/components/jakas/MomentCard";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { isPublicHostMoment } from "@/lib/moment-visibility";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "My JAKAS — Your saved experiences" },
      { name: "description", content: "Your favourite places and saved events on JAKAS." },
      { property: "og:title", content: "My JAKAS — Your saved experiences" },
      { property: "og:description", content: "Your favourite places and events." },
    ],
  }),
  component: Saved,
});

function Saved() {
  const moments = useStore((s) => s.moments);
  const saved = useStore((s) => s.saved);
  const list = moments.filter((m) => saved.includes(m.id) && isPublicHostMoment(m));
  return <UserShell title="My JAKAS" subtitle={`${list.length} saved experiences`}>
    <div className="mb-6 mt-2 grid grid-cols-3 gap-2">
      {[{icon: Flame, value: "—", label: "I'm In", tone: "bg-brand-orange/5 text-brand-orange"}, {icon: Heart, value: list.length, label: "Liked", tone: "bg-brand-purple/5 text-brand-purple"}, {icon: Clock, value: "—", label: "Past", tone: "bg-muted text-muted-foreground"}].map(({icon: Icon,value,label,tone}) => <div key={label} className={`flex h-24 flex-col items-center justify-center gap-1 rounded-[18px] ${tone}`}><Icon className="h-4 w-4"/><span className="text-lg font-extrabold">{value}</span><span className="text-[10px] font-semibold">{label}</span></div>)}
    </div>
    <h2 className="mb-4 flex items-center gap-2 text-sm font-extrabold"><span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-purple/5">💗</span>Liked<span className="ml-auto rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">{list.length}</span></h2>
    <div className="space-y-4">{list.map((m) => <MomentCard key={m.id} m={m} compact />)}</div>
    {list.length === 0 && <div className="py-12 text-center"><Star className="mx-auto mb-4 h-10 w-10 text-brand-purple/40"/><h3 className="text-lg font-extrabold">Your next great memory</h3><p className="mx-auto mt-2 max-w-64 text-sm leading-6 text-muted-foreground">Your saved experiences will appear here.</p><Button asChild variant="action" className="mt-6 h-12"><Link to="/">Discover experiences →</Link></Button></div>}
    <p className="mt-6 text-center text-[11px] text-muted-foreground">Phone verification is needed to save and join experiences.</p>
  </UserShell>;
}
