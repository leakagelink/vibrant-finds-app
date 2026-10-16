import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Bell } from "lucide-react";
import { UserShell } from "@/components/jakas/UserShell";
import { actions, useStore } from "@/lib/store";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — JAKAS" },
      { name: "description", content: "Latest alerts about events and moments near you." },
      { property: "og:title", content: "Notifications — JAKAS" },
      { property: "og:description", content: "Latest alerts about events near you." },
    ],
  }),
  component: Notifications,
});

function Notifications() {
  const notices = useStore((s) => s.notices);
  useEffect(() => { const t = setTimeout(actions.readAll, 1500); return () => clearTimeout(t); }, []);
  return (
    <UserShell title="Notifications">
      <div className="space-y-2">
        {notices.map((n) => (
          <div key={n.id} className={`flex gap-3 rounded-2xl border p-4 ${n.read ? "bg-card" : "bg-secondary"}`}>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand text-primary-foreground"><Bell className="h-5 w-5" /></span>
            <div className="flex-1"><p className="font-semibold">{n.title}</p><p className="text-sm text-muted-foreground">{n.body}</p></div>
            <span className="text-xs text-muted-foreground">{n.at}</span>
          </div>
        ))}
      </div>
    </UserShell>
  );
}
