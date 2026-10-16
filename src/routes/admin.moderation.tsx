import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Flag, Trash2, X } from "lucide-react";
import { StatusBadge } from "@/components/jakas/PanelShell";
import { actions, useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/moderation")({ component: Moderation });

function Moderation() {
  const moments = useStore((s) => s.moments);
  const [tab, setTab] = useState<"pending" | "reported" | "all">("pending");
  const list = moments.filter((m) => (tab === "pending" ? m.status === "pending" : tab === "reported" ? m.reports > 0 : true));
  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">Content moderation</h1>
      <div className="mb-4 flex gap-2">
        {(["pending", "reported", "all"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-1.5 text-sm capitalize ${tab === t ? "bg-brand text-primary-foreground" : "bg-muted"}`}>{t}</button>
        ))}
      </div>
      <div className="space-y-3">
        {list.map((m) => (
          <div key={m.id} className="flex flex-wrap items-center gap-4 rounded-2xl border bg-card p-3">
            <img src={m.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{m.title}</p>
              <p className="text-xs text-muted-foreground">by {m.host} · {m.category} · {m.location}</p>
              {m.reports > 0 && <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-destructive"><Flag className="h-3 w-3" />{m.reports} reports</p>}
            </div>
            <StatusBadge status={m.status} />
            <button onClick={() => actions.updateMoment(m.id, { status: "approved", reports: 0 })} className="flex items-center gap-1 rounded-lg bg-success/15 px-3 py-2 text-sm font-semibold text-success"><Check className="h-4 w-4" />Approve</button>
            <button onClick={() => actions.updateMoment(m.id, { status: "rejected" })} className="flex items-center gap-1 rounded-lg bg-warning/20 px-3 py-2 text-sm font-semibold text-accent-foreground"><X className="h-4 w-4" />Reject</button>
            <button onClick={() => actions.deleteMoment(m.id)} className="rounded-lg bg-destructive/15 p-2 text-destructive" aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        {list.length === 0 && <p className="py-10 text-center text-muted-foreground">All clear ✨</p>}
      </div>
    </div>
  );
}
