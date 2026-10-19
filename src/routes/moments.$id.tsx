import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bookmark, Calendar, CheckCircle, Flag, MapPin, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { UserShell } from "@/components/jakas/UserShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/moments/$id")({
  head: ({ params }) => ({ meta: [
    { title: `Event ${params.id} — JAKAS` },
    { name: "description", content: "View event photos, timing, host and location on JAKAS." },
    { property: "og:title", content: `Event ${params.id} — JAKAS` },
    { property: "og:description", content: "Discover event details and directions on JAKAS." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: MomentDetails,
});

function MomentDetails() {
  const { id } = Route.useParams();
  const moment = useStore((s) => s.moments.find((m) => m.id === id && m.status === "approved" && m.hostType === "business"));
  const share = async () => {
    if (!moment) return;
    try {
      const url = `${window.location.origin}/moments/${encodeURIComponent(id)}`;
      if (navigator.share) await navigator.share({ title: moment.title, url });
      else { await navigator.clipboard.writeText(url); toast.success("Event link copied"); }
    } catch { /* user cancelled */ }
  };
  return <UserShell title="Event details">
    <Button asChild variant="ghost" className="mb-3"><Link to="/"><ArrowLeft />Back to events</Link></Button>
    {!moment ? <div className="py-12 text-center"><h2 className="text-2xl font-bold">Event unavailable</h2><p className="mt-2 text-muted-foreground">This event is not available for viewing.</p></div> : <>
      {moment.image.startsWith("data:video") ? <video src={moment.image} controls className="aspect-[4/3] w-full rounded-lg object-cover" /> : <img src={moment.image} alt={moment.title} className="aspect-[4/3] w-full rounded-lg object-cover" />}
      <div className="flex items-start justify-between gap-3 pt-5"><h1 className="text-3xl font-bold leading-tight">{moment.title}</h1><span className="shrink-0 rounded-md bg-accent px-3 py-1 font-semibold text-accent-foreground">{moment.price}</span></div>
      <p className="mt-2 text-sm text-muted-foreground">{moment.category} · Hosted by {moment.host}</p>
      <div className="my-5 space-y-3 border-y py-4">
        <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />{moment.date} · {moment.time} IST</p>
        <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{moment.location}</p>
        <Button asChild variant="outline"><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(moment.location)}`} target="_blank" rel="noopener noreferrer"><MapPin />Directions</a></Button>
      </div>
      <h2 className="text-xl font-bold">About this event</h2><p className="mt-2 leading-relaxed text-muted-foreground">{moment.description}</p>
      <div className="mt-6 grid grid-cols-2 gap-2">
        <Button disabled variant="outline"><Bookmark />Interested</Button>
        <Button disabled><CheckCircle />Going</Button>
        <Button variant="outline" onClick={share}><Share2 />Share</Button>
        <Button disabled variant="ghost"><Flag />Report</Button>
      </div>
      <p role="status" className="mt-3 text-sm text-muted-foreground">Interested, Going and reporting are unavailable until phone verification is connected.</p>
    </>}
  </UserShell>;
}