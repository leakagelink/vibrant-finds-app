import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, CalendarPlus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Moment } from "@/lib/store";
import { formatCountdown, formatTime, getTiming } from "@/lib/moment-time";
import { distanceLabel, eventDate, mapsUrl, useNow } from "./EventSheet";

const confetti = Array.from({ length: 26 }, (_, i) => ({ x: ((i * 41 + 7) % 85) + 5, delay: ((i * 17) % 22) / 10, size: ((i * 7 + 4) % 5) + 5, tone: ["bg-brand-orange", "bg-brand-pink", "bg-brand-purple", "bg-warning", "bg-success"][i % 5], round: i % 3 !== 1, dur: 1.8 + ((i * 11) % 8) / 10 }));

function calendarUrl(m: Moment) {
  const d = m.date.replace(/-/g, ""), t = (x: string) => x.replace(":", "") + "00";
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(m.title)}&dates=${d}T${t(m.time)}/${d}T${t(m.endTime ?? m.time)}&ctz=Asia/Kolkata&location=${encodeURIComponent(m.location)}`;
}

export function YoureIn({ moment, onClose }: { moment: Moment; onClose: () => void }) {
  const now = useNow();
  const t = getTiming(moment, now);
  return <Dialog.Root open onOpenChange={(o) => { if (!o) onClose(); }}><Dialog.Portal>
    <Dialog.Content aria-describedby={undefined} className="youre-in fixed inset-0 z-[70] mx-auto flex max-w-md flex-col overflow-hidden bg-card">
      <Dialog.Title className="sr-only">You're in</Dialog.Title>
      <div className="relative h-[330px] shrink-0 overflow-hidden bg-celebrate">
        {confetti.map((c, i) => <span key={i} className={`confetti absolute -top-3 ${c.tone} ${c.round ? "rounded-full" : "rounded-sm"}`} style={{ left: `${c.x}%`, width: c.size, height: c.round ? c.size : c.size * 1.5, animationDelay: `${c.delay}s`, animationDuration: `${c.dur}s` }} />)}
        <Button variant="ghost" size="icon" className="absolute left-5 top-5 z-10 rounded-full bg-card/60 backdrop-blur" aria-label="Back to Discover" onClick={onClose}><ArrowLeft /></Button>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="fire-glow text-[80px] leading-none">🔥</span>
          <h2 className="fade-up mt-3 text-4xl font-black text-accent-foreground">You're In!</h2>
          <p className="fade-up mt-2 text-[15px] font-medium text-accent-foreground/80 [animation-delay:150ms]">Something exciting awaits 🎉</p>
        </div>
      </div>
      <div className="-mt-7 flex min-h-0 flex-1 flex-col rounded-t-[28px] bg-card shadow-nav">
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-6">
          <p className="fade-up mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-success/30 bg-success/10 px-4 py-2 text-sm font-bold text-success">✓ Added to My JAKAS ⭐</p>
          <div className="fade-up overflow-hidden rounded-[22px] bg-muted [animation-delay:200ms]">
            <div className="flex"><img src={moment.image} alt="" className="w-24 shrink-0 object-cover" /><div className="p-3.5"><p className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-destructive">{t.state === "live" && <span className="live-dot" />}{t.state === "live" ? "LIVE NOW" : "COMING UP"}</p><h3 className="mt-1 font-extrabold leading-tight">{moment.title}</h3><p className="mt-1 text-xs text-muted-foreground">{moment.host} · {moment.location}</p><p className="mt-1.5 text-[11px] text-muted-foreground">📅 {eventDate(moment.date)} · 🕗 {formatTime(moment.time)}</p></div></div>
            {t.state !== "ended" && <div className="flex items-center justify-between border-t border-brand-orange/15 bg-brand-orange/5 px-3.5 py-2.5 text-xs text-muted-foreground"><span>⏳ {t.state === "live" ? "Ends in" : "Starts in"}</span><span className="text-[15px] font-extrabold tabular-nums text-brand-orange">{formatCountdown(t.seconds)}</span></div>}
          </div>
          <div className="fade-up mt-4 grid grid-cols-3 gap-2 text-center [animation-delay:300ms]">
            {[["📍", distanceLabel(moment.distanceKm), "away"], ["🔥", String((moment.going ?? 0) + 1), "going"], ["🎁", moment.offer ?? moment.price, "offer"]].map(([e, v, l]) => <div key={l} className="rounded-2xl bg-muted p-3"><p className="text-lg">{e}</p><p className="text-[13px] font-bold leading-tight">{v}</p><p className="text-[11px] text-muted-foreground">{l}</p></div>)}
          </div>
        </div>
        <div className="space-y-2.5 px-5 pb-6 pt-3">
          <Button asChild variant="action" className="h-14 w-full text-base"><a href={mapsUrl(moment.location)} target="_blank" rel="noopener noreferrer"><MapPin />Get Directions</a></Button>
          <Button asChild variant="outline" className="h-12 w-full rounded-[18px] font-bold"><a href={calendarUrl(moment)} target="_blank" rel="noopener noreferrer"><CalendarPlus />Add to Calendar</a></Button>
          <Button variant="ghost" className="w-full text-muted-foreground" onClick={onClose}>← Back to Discover</Button>
        </div>
      </div>
    </Dialog.Content>
  </Dialog.Portal></Dialog.Root>;
}
