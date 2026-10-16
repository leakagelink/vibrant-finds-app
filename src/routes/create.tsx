import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { UserShell } from "@/components/jakas/UserShell";
import { MomentForm } from "@/components/jakas/MomentForm";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Post a moment — JAKAS" },
      { name: "description", content: "Share photos, videos and updates about what's happening near you." },
      { property: "og:title", content: "Post a moment — JAKAS" },
      { property: "og:description", content: "Share what's happening near you." },
    ],
  }),
  component: Create,
});

function Create() {
  const session = useStore((s) => s.session);
  const navigate = useNavigate();
  return (
    <UserShell title="New moment">
      {session ? (
        <MomentForm host={session.name} hostType="user" onDone={() => navigate({ to: "/profile" })} />
      ) : (
        <div className="py-16 text-center">
          <p className="mb-4 text-muted-foreground">Sign in to share a moment.</p>
          <Link to="/login" className="rounded-full bg-brand px-6 py-3 font-bold text-primary-foreground">Sign in</Link>
        </div>
      )}
    </UserShell>
  );
}
