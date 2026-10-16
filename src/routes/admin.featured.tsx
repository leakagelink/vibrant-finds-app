import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { actions, useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/featured")({ component: Featured });

function Featured() {
  const moments = useStore((s) => s.moments.filter((m) => m.status === "approved"));
  const [t, setT] = useState("");
  const [b, setB] = useState("");
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <h1 className="mb-4 text-3xl font-bold">Featured events</h1>
        <div className="space-y-2">
          {moments.map((m) => (
            <div key={m.id} className="flex items-center gap-3 rounded-2xl border bg-card p-3">
              <img src={m.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
              <p className="flex-1 font-semibold">{m.title}</p>
              <Star className={`h-4 w-4 ${m.featured ? "fill-brand-orange text-brand-orange" : "text-muted-foreground"}`} />
              <Switch checked={!!m.featured} onCheckedChange={(v) => actions.updateMoment(m.id, { featured: v })} />
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="mb-4 text-3xl font-bold">Send notification</h2>
        <form className="space-y-3 rounded-2xl border bg-card p-5" onSubmit={(e) => { e.preventDefault(); if (!t.trim()) return; actions.pushNotice(t.trim().slice(0, 80), b.trim().slice(0, 200)); setT(""); setB(""); toast.success("Notification sent to all users"); }}>
          <input value={t} onChange={(e) => setT(e.target.value)} placeholder="Title" className="w-full rounded-xl border px-4 py-2" />
          <textarea value={b} onChange={(e) => setB(e.target.value)} placeholder="Message" rows={3} className="w-full rounded-xl border px-4 py-2" />
          <button className="w-full rounded-full bg-brand py-3 font-bold text-primary-foreground shadow-glow">Send to everyone</button>
        </form>
      </div>
    </div>
  );
}
