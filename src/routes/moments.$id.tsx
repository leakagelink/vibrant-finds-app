import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserShell } from "@/components/jakas/UserShell";
import { EventContent } from "@/components/jakas/EventSheet";
import { useStore } from "@/lib/store";
import { isPublicHostMoment } from "@/lib/moment-visibility";

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
  const moment = useStore((s) => s.moments.find((m) => m.id === id && isPublicHostMoment(m)));
  return <UserShell title="Event details" subtitle="An experience worth heading out for">
    <Button asChild variant="ghost" className="mb-3 text-xs"><Link to="/"><ArrowLeft />Back to Discover</Link></Button>
    {!moment ? <div className="py-12 text-center"><h2 className="text-2xl font-bold">Event unavailable</h2><p className="mt-2 text-muted-foreground">This event is not available for viewing.</p></div> : <EventContent moment={moment} withImage />}
  </UserShell>;
}
