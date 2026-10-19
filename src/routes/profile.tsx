import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Briefcase, Mail, MapPin, Shield } from "lucide-react";
import { UserShell } from "@/components/jakas/UserShell";
import { actions, useStore } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My profile — JAKAS" },
      { name: "description", content: "Your activity and account on JAKAS." },
      { property: "og:title", content: "My profile — JAKAS" },
      { property: "og:description", content: "Your activity and account on JAKAS." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Profile,
});

function Profile() {
  const session = useStore((s) => s.session);
  const navigate = useNavigate();
  if (!session)
    return (
      <UserShell title="Me">
        <div className="py-16 text-center">
          <Link to="/login" className="rounded-full bg-brand px-6 py-3 font-bold text-primary-foreground">Sign in / Sign up</Link>
        </div>
      </UserShell>
    );
  return (
    <UserShell title="Me">
      <div className="mb-5 flex items-center gap-4">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-brand font-display text-2xl font-bold text-primary-foreground">{session.name[0]}</span>
        <div><p className="text-xl font-bold">{session.name}</p><p className="text-sm text-muted-foreground">{session.email}</p></div>
      </div>
      <div className="mb-6 grid grid-cols-2 gap-2">
        <Link to="/business" className="flex items-center gap-2 rounded-2xl border bg-card p-3 text-sm font-semibold"><Briefcase className="h-4 w-4 text-brand-orange" />Business panel</Link>
        <Link to="/admin" className="flex items-center gap-2 rounded-2xl border bg-card p-3 text-sm font-semibold"><Shield className="h-4 w-4 text-brand-purple" />Admin panel</Link>
      </div>
      <div className="mt-8 space-y-1 rounded-2xl bg-muted p-4 text-xs text-muted-foreground">
        <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" />appigspl@gmail.com</p>
        <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />Surampalem, Chanubanda 521214, Andhra Pradesh</p>
      </div>
      <button onClick={() => { actions.logout(); navigate({ to: "/login" }); }} className="mt-4 w-full rounded-full border py-3 font-semibold">Log out</button>
    </UserShell>
  );
}
