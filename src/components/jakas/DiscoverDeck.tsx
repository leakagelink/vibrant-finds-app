import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { actions, useStore, type Moment } from "@/lib/store";
import { EventSheet, TimingBadge, categoryEmoji, distanceLabel } from "./EventSheet";

const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K` : String(n));

export function DiscoverDeck({ moments }: { moments: Moment[] }) {
  const skipped = useStore((s) => s.skipped);
  const saved = useStore((s) => s.saved);
  const deck = moments.filter((m) => !skipped.includes(m.id) && !saved.includes(m.id));
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [fly, setFly] = useState<"left" | "right" | null>(null);
  const [open, setOpen] = useState<Moment | null>(null);
  const origin = useRef({ x: 0, y: 0 });
  const cur = deck[0], next = deck[1];

  const decide = (dir: "left" | "right") => {
    if (!cur || fly) return;
    setFly(dir);
    setTimeout(() => {
      if (dir === "right") { actions.interested(cur.id); toast.success(`Interested in ${cur.title} ⭐`); } else actions.skip(cur.id);
      setFly(null); setDrag({ x: 0, y: 0 });
    }, 340);
  };
  const up = () => {
    if (!dragging) return;
    setDragging(false);
    if (drag.x < -90) decide("left");
    else if (drag.x > 90) decide("right");
    else if (drag.y < -90) { setOpen(cur); setDrag({ x: 0, y: 0 }); }
    else setDrag({ x: 0, y: 0 });
  };

  if (!cur) return <div className="grid flex-1 place-items-center text-center"><div><p className="text-5xl">🎉</p><h2 className="mt-3 text-xl font-extrabold">You're all caught up</h2><p className="mt-1 text-sm text-muted-foreground">No more experiences here right now.</p>{skipped.length > 0 && <Button variant="action" className="mt-5 h-12" onClick={actions.resetSkipped}>Show skipped again</Button>}</div></div>;

  const x = fly === "left" ? -600 : fly === "right" ? 600 : drag.x;
  const rot = fly ? (fly === "left" ? -18 : 18) : drag.x * 0.055;
  const likeO = Math.min(1, Math.max(0, (drag.x - 40) / 60)), nopeO = Math.min(1, Math.max(0, (-drag.x - 40) / 60)), upO = Math.min(1, Math.max(0, (-drag.y - 40) / 60));

  return <section className="discover-deck" aria-label="Nearby experiences" tabIndex={0} onKeyDown={(e) => {
    if (e.key === "ArrowRight") decide("right");
    if (e.key === "ArrowLeft") decide("left");
    if (e.key === "ArrowUp" || e.key === "Enter") { e.preventDefault(); setOpen(cur); }
  }}>
    <div className="relative min-h-0 flex-1">
      {next && <div className="swipe-card swipe-card-back"><img src={next.image} alt="" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-photo-overlay opacity-50" /></div>}
      <article key={cur.id} className="swipe-card swipe-card-front" style={{ transform: `translate(${x}px, ${fly ? drag.y : drag.y}px) rotate(${rot}deg)`, transition: dragging ? "none" : fly ? "transform 340ms cubic-bezier(.4,0,1,1), opacity 340ms" : "transform 450ms cubic-bezier(.175,.885,.32,1.275)", opacity: fly ? 0 : 1 }}
        onPointerDown={(e) => { if (fly) return; origin.current = { x: e.clientX, y: e.clientY }; setDragging(true); e.currentTarget.setPointerCapture(e.pointerId); }}
        onPointerMove={(e) => { if (dragging) setDrag({ x: e.clientX - origin.current.x, y: e.clientY - origin.current.y }); }}
        onPointerUp={up} onPointerCancel={up}
        onClick={() => { if (Math.abs(drag.x) < 5 && Math.abs(drag.y) < 5 && !dragging) setOpen(cur); }}>
        <img src={cur.image} alt={cur.title} draggable={false} className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-photo" />
        <span className="swipe-stamp left-5 -rotate-6 border-success text-success" style={{ opacity: likeO }}>INTERESTED</span>
        <span className="swipe-stamp right-5 rotate-6 border-primary-foreground text-primary-foreground" style={{ opacity: nopeO }}>NOT FOR ME</span>
        <span className="swipe-stamp left-1/2 top-1/3 -translate-x-1/2 border-brand-orange text-brand-orange" style={{ opacity: upO }}>DETAILS</span>
        <div className="absolute left-4 right-4 top-4"><TimingBadge moment={cur} onPhoto /></div>
        <div className="discovery-caption absolute inset-x-0 bottom-0 p-[18px] text-primary-foreground">
          <div className="mb-2 flex items-center gap-2 text-xs"><span className="rounded-full border border-primary-foreground/15 bg-primary-foreground/20 px-2.5 py-1 font-bold backdrop-blur">{categoryEmoji(cur.category)} {cur.category}</span><span className="opacity-75">📍 {distanceLabel(cur.distanceKm)} away</span></div>
          <h2 className="text-2xl font-extrabold leading-tight">{cur.title}</h2>
          <p className="mb-3 mt-0.5 text-[13px] font-medium opacity-65">{cur.host} · {cur.location}</p>
          <div className="mb-3 flex flex-wrap items-center gap-2"><span className="rounded-full bg-action px-3 py-1.5 text-xs font-bold shadow-action">{cur.offer ?? cur.price}</span>{cur.verified && <span className="rounded-full border border-primary-foreground/15 bg-primary-foreground/10 px-2.5 py-1.5 text-xs font-semibold backdrop-blur"><span className="text-success">✓</span> Verified Host</span>}</div>
          <div className="flex items-center gap-3"><span className="rounded-full bg-action px-3.5 py-1.5 text-[13px] font-bold shadow-action">🔥 {cur.going ?? 0} Going</span><span className="text-xs opacity-55">👀 {compact(cur.views)} Views</span></div>
          <p className="swipe-hint mt-3 text-center text-[11px] font-medium opacity-40">▲ Swipe up for details</p>
        </div>
      </article>
    </div>
    <div className="flex flex-none items-center justify-center gap-5 pt-3">
      <Button variant="outline" size="icon" className="h-12 w-12 rounded-full text-lg shadow-nav" aria-label="Not interested" onClick={() => decide("left")}>✕</Button>
      <Button variant="outline" size="icon" className="h-10 w-10 rounded-full shadow-nav" aria-label="View details" onClick={() => setOpen(cur)}>▲</Button>
      <Button variant="action" size="icon" className="h-12 w-12 rounded-full text-lg" aria-label="Interested" onClick={() => decide("right")}>♥</Button>
    </div>
    {open && <EventSheet moment={open} onClose={() => setOpen(null)} />}
  </section>;
}
