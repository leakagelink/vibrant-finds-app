import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bookmark, Calendar, Flag, Heart, MapPin, MessageCircle, Send, Share2 } from "lucide-react";
import { toast } from "sonner";
import { actions, useStore, type Moment } from "@/lib/store";
import { cn } from "@/lib/utils";

export function MomentCard({ m }: { m: Moment }) {
  const liked = useStore((s) => s.liked.includes(m.id));
  const saved = useStore((s) => s.saved.includes(m.id));
  const session = useStore((s) => s.session);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const share = async () => {
    actions.share(m.id);
    const url = window.location.origin + "/moments/" + encodeURIComponent(m.id);
    try {
      if (navigator.share) await navigator.share({ title: m.title, text: m.description, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }
    } catch {
      /* cancelled */
    }
  };

  return (
    <article className="overflow-hidden rounded-3xl border bg-card shadow-sm">
      <div className="relative">
        <img src={m.image} alt={m.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-brand px-3 py-1 text-xs font-bold text-primary-foreground shadow-glow">
          {m.featured ? "★ Featured" : m.category}
        </span>
        <button
          aria-label="Save"
          onClick={() => actions.toggleSave(m.id)}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-card/90 backdrop-blur"
        >
          <Bookmark className={cn("h-4 w-4", saved && "fill-primary text-primary")} />
        </button>
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-bold leading-tight"><Link to="/moments/$id" params={{ id: m.id }}>{m.title}</Link></h3>
          <span className="shrink-0 rounded-full bg-accent px-2.5 py-0.5 text-sm font-semibold text-accent-foreground">{m.price}</span>
        </div>
        <p className="text-sm text-muted-foreground">{m.description}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-primary" />{m.location} · {m.distanceKm} km</span>
          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-brand-purple" />{new Date(m.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {m.time}</span>
        </div>
        <p className="text-xs">by <span className="font-semibold">{m.host}</span></p>
        <div className="flex items-center gap-1 border-t pt-2">
          <button onClick={() => actions.toggleLike(m.id)} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm hover:bg-muted">
            <Heart className={cn("h-4 w-4", liked && "fill-primary text-primary")} />{m.likes}
          </button>
          <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm hover:bg-muted">
            <MessageCircle className="h-4 w-4" />{m.comments.length}
          </button>
          <button onClick={share} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm hover:bg-muted">
            <Share2 className="h-4 w-4" />{m.shares}
          </button>
          <button
            onClick={() => { actions.report(m.id); toast("Reported. Our team will review it."); }}
            className="ml-auto rounded-full p-2 text-muted-foreground hover:bg-muted" aria-label="Report"
          >
            <Flag className="h-4 w-4" />
          </button>
        </div>
        {open && (
          <div className="space-y-2 pt-1">
            {m.comments.map((c) => (
              <p key={c.id} className="text-sm"><span className="font-semibold">{c.user}</span> {c.text}</p>
            ))}
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const t = text.trim().slice(0, 300);
                if (!t) return;
                actions.comment(m.id, session?.name ?? "Guest", t);
                setText("");
              }}
            >
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a comment…" className="flex-1 rounded-full border bg-muted px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <button className="grid h-9 w-9 place-items-center rounded-full bg-brand text-primary-foreground" aria-label="Send"><Send className="h-4 w-4" /></button>
            </form>
          </div>
        )}
      </div>
    </article>
  );
}
