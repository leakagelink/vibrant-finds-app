import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { actions, useStore, type Moment } from "@/lib/store";
import { formatCountdown, formatTime, getTiming } from "@/lib/moment-time";
import * as Dialog from "@radix-ui/react-dialog";

export const categoryEmoji = (category: string) => ({ Food: "🍕", Music: "🎵", Coffee: "☕", Nightlife: "🍹", Wellness: "🌿", Tech: "💻", Sports: "⚽", Art: "🎨" }[category] ?? "✨");
export const eventDate = (date: string) => new Date(`${date}T12:00:00+05:30`).toLocaleDateString("en-IN", { month: "short", day: "numeric", timeZone: "Asia/Kolkata" });
export const mapsUrl = (location: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
export const distanceLabel = (km: number) => (km < 1 ? `${Math.round(km * 1000)}m` : `${km} km`);
const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K` : String(n));

export async function shareEvent(moment: Moment) {
  try {
    const url = `${window.location.origin}/moments/${encodeURIComponent(moment.id)}`;
    actions.share(moment.id);
    if (navigator.share) await navigator.share({ title: moment.title, url });
    else { await navigator.clipboard.writeText(url); toast.success("Event link copied"); }
  } catch { /* sharing cancelled */ }
}

export function useNow(ms = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), ms); return () => clearInterval(t); }, [ms]);
  return now;
}

export function TimingBadge({ moment, onPhoto = false }: { moment: Moment; onPhoto?: boolean }) {
  const now = useNow();
  const t = getTiming(moment, now);
  const label = t.state === "live" ? "LIVE" : t.state === "soon" ? "STARTING SOON" : t.state === "ended" ? "ENDED" : "LATER";
  return <div className="flex items-center gap-2">
    <span className={onPhoto ? "flex items-center gap-1.5 rounded-full bg-photo-overlay px-3 py-1.5 text-[11px] font-bold tracking-widest text-primary-foreground backdrop-blur" : "flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1.5 text-[11px] font-bold tracking-widest text-destructive"}>
      {t.state === "live" && <span className="live-dot" />}{label}
    </span>
    {t.state !== "ended" && <span className={onPhoto ? "rounded-full bg-photo-overlay px-3 py-1.5 text-xs font-bold tabular-nums text-primary-foreground backdrop-blur" : "rounded-full bg-muted px-3 py-1.5 text-xs font-bold tabular-nums text-secondary-foreground"}>⏳ {formatCountdown(t.seconds)}</span>}
  </div>;
}

function Stat({ emoji, value, label, hot }: { emoji: string; value: string; label: string; hot?: boolean }) {
  return <div className={hot ? "flex flex-col items-center gap-0.5 rounded-2xl bg-brand-orange/10 py-2 text-brand-orange" : "flex flex-col items-center gap-0.5 py-2"}>
    <span className="text-lg">{emoji}</span><span className="text-base font-extrabold">{value}</span><span className={hot ? "text-[11px] font-medium" : "text-[11px] font-medium text-muted-foreground"}>{label}</span>
  </div>;
}

function Info({ icon, label, value, wide }: { icon: string; label: string; value: string; wide?: boolean }) {
  return <div className={wide ? "col-span-2 rounded-2xl bg-muted p-3.5" : "rounded-2xl bg-muted p-3.5"}>
    <p className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground"><span className="text-sm">{icon}</span>{label.toUpperCase()}</p>
    <p className="text-sm font-bold">{value}</p>
  </div>;
}

export function EventContent({ moment, withImage = false }: { moment: Moment; drop?: boolean; withImage?: boolean }) {
  const saved = useStore((s) => s.saved.includes(moment.id));
  const [terms, setTerms] = useState(false);
  const [viewer, setViewer] = useState<string | null>(null);
  const gallery = moment.gallery?.length ? moment.gallery : [moment.image];
  const timeRange = `${formatTime(moment.time)}${moment.endTime ? ` – ${formatTime(moment.endTime)}` : ""}`;
  const going = (moment.going ?? 0) + (saved ? 1 : 0);
  return <>
    {withImage && <img src={moment.image} alt={moment.title} className="mb-4 h-56 w-full rounded-[24px] object-cover" />}
    <div className="mb-3.5 flex flex-wrap items-center gap-2">
      <TimingBadge moment={moment} />
      <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground"><span className="rounded-full bg-muted px-3 py-1.5 font-semibold text-secondary-foreground">{categoryEmoji(moment.category)} {moment.category}</span>📍 {distanceLabel(moment.distanceKm)}</span>
    </div>
    <h2 className="text-[26px] font-extrabold leading-tight">{moment.title}</h2>
    <p className="mb-3.5 mt-1 text-sm font-medium text-muted-foreground">{moment.host} · {moment.location}</p>
    <div className="flex flex-wrap items-center gap-2">
      <span className="rounded-full bg-action px-3.5 py-1.5 text-[13px] font-bold text-primary-foreground shadow-action">{moment.offer ?? (moment.price === "Free" ? "Free Entry" : moment.price)}</span>
      {moment.verified && <span className="rounded-full bg-success/10 px-3 py-1.5 text-xs font-semibold text-success">✓ Verified Host</span>}
    </div>

    <div className="my-5 grid grid-cols-4 gap-1 rounded-[20px] bg-muted px-2 py-3">
      <Stat emoji="👀" value={compact(moment.views)} label="Views" />
      <Stat emoji="❤️" value={compact(moment.likes)} label="Likes" />
      <Stat emoji="🔥" value={compact(going)} label="Going" hot />
      <Stat emoji="📤" value={compact(moment.shares)} label="Shares" />
    </div>

    <h3 className="mb-2 text-base font-extrabold">About This Event</h3>
    <p className="text-sm leading-relaxed text-muted-foreground">{moment.description}</p>

    <h3 className="mb-3 mt-5 text-base font-extrabold">Event Highlights</h3>
    <div className="-mx-5 flex gap-2.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
      {gallery.map((src, i) => <button key={src} type="button" onClick={() => setViewer(src)} className="h-[110px] w-[110px] shrink-0 overflow-hidden rounded-[18px] bg-muted" aria-label={`Open photo ${i + 1}`}><img src={src} alt="" className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" /></button>)}
    </div>

    <h3 className="mb-3 mt-5 text-base font-extrabold">Event Information</h3>
    <div className="grid grid-cols-2 gap-2.5">
      <Info icon="📅" label="Date" value={eventDate(moment.date)} />
      <Info icon="🕗" label="Time" value={timeRange} />
      <Info icon="🎁" label="Offer" value={moment.offer ?? "—"} />
      <Info icon="🎟" label="Entry Fee" value={moment.price} />
      {moment.endTime && <Info icon="⏰" label="Valid Until" value={`${formatTime(moment.endTime)} only`} wide />}
    </div>

    <h3 className="mb-3 mt-5 text-base font-extrabold">About the Host</h3>
    <div className="flex items-center gap-3.5 rounded-[20px] bg-muted p-4">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-action text-xl">{categoryEmoji(moment.category)}</span>
      <div className="min-w-0"><p className="flex items-center gap-1.5 font-extrabold">{moment.host}{moment.verified && <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">✓ Verified</span>}</p><p className="truncate text-xs text-muted-foreground">{moment.location}</p></div>
    </div>

    {moment.terms && <div className="mt-4 rounded-2xl bg-muted">
      <button type="button" className="flex w-full items-center justify-between px-4 py-3.5 text-sm font-bold" aria-expanded={terms} onClick={() => setTerms(!terms)}>📋 Terms & Conditions<ChevronDown className={terms ? "h-4 w-4 rotate-180 transition-transform" : "h-4 w-4 transition-transform"} /></button>
      {terms && <p className="px-4 pb-4 text-xs leading-relaxed text-muted-foreground">{moment.terms}</p>}
    </div>}

    <div className="sticky bottom-0 -mx-5 mt-5 flex items-center gap-2.5 border-t bg-card px-5 pb-5 pt-3">
      <Button variant="action" className="h-14 flex-1 text-base" onClick={() => { if (!saved) { actions.interested(moment.id); toast.success("You're in! Added to My JAKAS ⭐"); } }}>{saved ? "✓ You're In" : "🔥 I'm In"}</Button>
      <Button variant="outline" className="h-14 flex-col gap-0 rounded-[18px] px-3 text-[10px]" onClick={() => shareEvent(moment)}><span className="text-base">📤</span>Share</Button>
      <Button asChild variant="outline" className="h-14 flex-col gap-0 rounded-[18px] px-3 text-[10px]"><a href={mapsUrl(moment.location)} target="_blank" rel="noopener noreferrer"><span className="text-base">📍</span>Directions</a></Button>
    </div>

    {viewer && <Dialog.Root open onOpenChange={(o) => { if (!o) setViewer(null); }}><Dialog.Portal>
      <Dialog.Overlay className="event-backdrop fixed inset-0 z-[60] bg-foreground/90" />
      <Dialog.Content aria-describedby={undefined} className="fixed inset-0 z-[60] grid place-items-center p-4" onClick={() => setViewer(null)}>
        <Dialog.Title className="sr-only">Event photo</Dialog.Title>
        <img src={viewer.replace("w=400&h=400", "w=900&h=900")} alt="" className="max-h-[82dvh] w-full max-w-md rounded-[20px] object-contain" />
      </Dialog.Content>
    </Dialog.Portal></Dialog.Root>}
  </>;
}

export function EventSheet({ moment, onClose }: { moment: Moment; drop?: boolean; onClose: () => void }) {
  const [dy, setDy] = useState(0);
  const [start, setStart] = useState<number | null>(null);
  return <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}><Dialog.Portal>
    <Dialog.Overlay className="event-backdrop fixed inset-0 z-50 bg-sheet-backdrop" />
    <Dialog.Content aria-describedby={undefined} style={{ transform: `translate(-50%, ${dy}px)`, transition: start === null ? "transform 300ms cubic-bezier(.32,.72,0,1)" : "none" }} className="event-sheet fixed bottom-0 left-1/2 z-50 flex max-h-[90dvh] w-full max-w-md flex-col rounded-t-[28px] bg-card shadow-nav">
      <Dialog.Title className="sr-only">{moment.title}</Dialog.Title>
      <div className="grid h-9 shrink-0 cursor-grab touch-none place-items-center" onPointerDown={(e) => { setStart(e.clientY); e.currentTarget.setPointerCapture(e.pointerId); }} onPointerMove={(e) => { if (start !== null) setDy(Math.max(0, e.clientY - start)); }} onPointerUp={() => { setStart(null); if (dy > 90) onClose(); else setDy(0); }} onPointerCancel={() => { setStart(null); setDy(0); }}>
        <span className="h-1.5 w-10 rounded-full bg-border" />
      </div>
      <Button autoFocus variant="ghost" size="icon" aria-label="Close event details" className="absolute right-3 top-1.5 z-10 h-7 w-7 rounded-full" onClick={onClose}><X /></Button>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 [scrollbar-width:none]">
        <EventContent moment={moment} />
        <Button asChild variant="ghost" className="mb-2 w-full text-muted-foreground"><Link to="/moments/$id" params={{ id: moment.id }}>Open full page<ArrowRight /></Link></Button>
      </div>
    </Dialog.Content>
  </Dialog.Portal></Dialog.Root>;
}
