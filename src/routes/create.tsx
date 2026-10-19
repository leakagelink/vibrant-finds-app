import { createFileRoute, Link } from "@tanstack/react-router";
import { UserShell } from "@/components/jakas/UserShell";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Host events — JAKAS" },
      { name: "description", content: "Events on JAKAS are posted by hosts and reviewed before publication." },
      { property: "og:title", content: "Host events — JAKAS" },
      { property: "og:description", content: "Discover host-posted events reviewed before publication." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Create,
});

function Create() {
  return (
    <UserShell title="Host events">
      <div className="py-16 text-center">
        <h2 className="mb-3 text-2xl font-bold">Events are posted by hosts</h2>
        <Link to="/" className="font-semibold text-primary">Discover nearby events</Link>
      </div>
    </UserShell>
  );
}
