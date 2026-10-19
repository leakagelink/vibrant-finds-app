import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Share2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Moment } from "@/lib/store";
import * as Dialog from "@radix-ui/react-dialog";

export const categoryEmoji = (category: string) => ({ Food: "🍕", Music: "🎵", Coffee: "☕", Nightlife: "🍹", Wellness: "🌿", Tech: "💻", Sports: "⚽", Art: "🎨" }[category] ?? "✨");
export const eventDate = (date: string) => new Date(`${date}T12:00:00+05:30`).toLocaleDateString("en-IN", { month: "short", day: "numeric", timeZone: "Asia/Kolkata" });
export const mapsUrl = (location: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
export async function shareEvent(moment: Moment) {
  try {
    const url = `${window.location.origin}/moments/${encodeURIComponent(moment.id)}`;
    if (navigator.share) await navigator.share({ title: moment.title, url });
    else { await navigator.clipboard.writeText(url); toast.success("Event link copied"); }
  } catch { /* sharing cancelled */ }
}

export function EventContent({ moment, drop = false }: { moment: Moment; drop?: boolean }) {
  return <>
    <div className="relative overflow-hidden rounded-[22px]">
      <img src={moment.image} alt={moment.title} className="h-52 w-full object-cover" />
      <div className="absolute inset-0 flex flex-col justify-end bg-photo p-4 text-primary-foreground"><h2 className="text-2xl font-extrabold leading-tight">{moment.title}</h2><p className="mt-1 text-xs font-semibold opacity-80">{moment.host} · {moment.location}</p></div>
    </div>
    <div className="my-4 flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
      <span className="rounded-full bg-muted px-3 py-2">📍 {moment.distanceKm} km away</span>
      <span className="rounded-full bg-muted px-3 py-2">🗓️ {eventDate(moment.date)}</span>
      <span className="rounded-full bg-muted px-3 py-2">🕘 {moment.time} IST</span>
    </div>
    <div className="rounded-[18px] border border-success/20 bg-success/5 p-4"><p className="text-[10px] font-extrabold uppercase text-muted-foreground">{drop ? "Event offer" : "Tonight’s offer"}</p><p className="mt-1 text-base font-extrabold">{moment.price === "Free" ? "Free Entry" : moment.price}</p></div>
    <h3 className="mb-3 mt-5 text-sm font-extrabold">Event Information</h3>
    <p className="text-sm leading-7 text-muted-foreground">{moment.description}</p>
    <p className="mt-3 text-xs text-muted-foreground">{categoryEmoji(moment.category)} {moment.category} · {moment.location}</p>
    <div className="mt-6 space-y-2 border-t pt-4">
      {drop ? <Button variant="ink" disabled className="h-14 w-full">🔔 Notify Me When Live</Button> : <Button variant="action" disabled className="h-14 w-full">🔥 I'm In</Button>}
      <div className="grid grid-cols-2 gap-2"><Button variant="outline" className="h-11 rounded-2xl" onClick={() => shareEvent(moment)}><Share2 />Share</Button><Button asChild variant="outline" className="h-11 rounded-2xl"><a href={mapsUrl(moment.location)} target="_blank" rel="noopener noreferrer"><MapPin />Directions</a></Button></div>
      <p role="status" className="py-2 text-center text-[11px] text-muted-foreground">Phone verification is not connected.</p>
    </div>
  </>;
}

export function EventSheet({ moment, drop = false, onClose }: { moment: Moment; drop?: boolean; onClose: () => void }) {
  return <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}><Dialog.Portal>
    <Dialog.Overlay className="event-backdrop fixed inset-0 z-50 bg-sheet-backdrop" />
    <Dialog.Content aria-describedby={undefined} className="event-sheet fixed bottom-0 left-1/2 z-50 max-h-[88dvh] w-full max-w-md -translate-x-1/2 overflow-y-auto rounded-t-[30px] bg-card px-5 pb-8 pt-8 shadow-nav">
      <Dialog.Title className="sr-only">{moment.title}</Dialog.Title>
      <span className="absolute left-1/2 top-3 h-1 w-9 -translate-x-1/2 rounded-full bg-border" />
      <Button autoFocus variant="ghost" size="icon" aria-label="Close event details" className="absolute right-3 top-1 z-10 h-7 w-7 rounded-full" onClick={onClose}><X /></Button>
      <EventContent moment={moment} drop={drop} />
      <Button asChild variant="ghost" className="mt-1 w-full"><Link to="/moments/$id" params={{ id: moment.id }}>View Details<ArrowRight /></Link></Button>
    </Dialog.Content>
  </Dialog.Portal></Dialog.Root>;
}