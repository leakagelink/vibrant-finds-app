import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, Heart, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MomentForm } from "@/components/jakas/MomentForm";
import { StatusBadge } from "@/components/jakas/PanelShell";
import { actions, useStore, type Moment } from "@/lib/store";

export const Route = createFileRoute("/business/moments")({ component: MyMoments });

function MyMoments() {
  const session = useStore((s) => s.session)!;
  const all = useStore((s) => s.moments);
  const mine = all.filter((m) => m.host === session.name);
  const [tab, setTab] = useState("all");
  const [edit, setEdit] = useState<Moment | null>(null);
  const list = tab === "all" ? mine : mine.filter((m) => m.status === tab);
  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">My Moments</h1>
      <div className="mb-4 flex gap-2">
        {["all", "approved", "pending", "rejected"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-1.5 text-sm capitalize ${tab === t ? "bg-brand text-primary-foreground" : "bg-muted"}`}>{t}</button>
        ))}
      </div>
      <div className="space-y-3">
        {list.map((m) => (
          <div key={m.id} className="flex items-center gap-4 rounded-2xl border bg-card p-3">
            <img src={m.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{m.title}</p>
              <p className="text-xs text-muted-foreground">{m.location} · {m.date} {m.time}</p>
              <p className="mt-1 flex gap-3 text-xs text-muted-foreground"><span className="flex items-center gap-1"><Eye className="h-3 w-3" />{m.views}</span><span className="flex items-center gap-1"><Heart className="h-3 w-3" />{m.likes}</span></p>
            </div>
            <StatusBadge status={m.status} />
            <button onClick={() => setEdit(m)} className="rounded-lg p-2 hover:bg-muted" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
            <button onClick={() => confirm("Delete this moment?") && actions.deleteMoment(m.id)} className="rounded-lg p-2 text-destructive hover:bg-muted" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        {list.length === 0 && <p className="py-10 text-center text-muted-foreground">No moments here.</p>}
      </div>
      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit moment</DialogTitle></DialogHeader>
          {edit && <MomentForm host={session.name} hostType="business" initial={edit} onDone={() => setEdit(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
