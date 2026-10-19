import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";
import { actions, useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/categories")({ head: () => ({ meta: [{ title: 'Categories and locations — JAKAS' }, { name: "description", content: 'Categories and locations on JAKAS.' }, { property: "og:title", content: 'Categories and locations — JAKAS' }, { property: "og:description", content: 'Categories and locations on JAKAS.' }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: Cats });

function Editor({ title, items, onAdd, onRemove }: { title: string; items: string[]; onAdd: (v: string) => void; onRemove: (v: string) => void }) {
  const [v, setV] = useState("");
  return (
    <div className="rounded-2xl border bg-card p-5">
      <h2 className="mb-3 text-xl font-bold">{title}</h2>
      <form className="mb-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); const t = v.trim().slice(0, 40); if (t) { onAdd(t); setV(""); } }}>
        <input value={v} onChange={(e) => setV(e.target.value)} placeholder={`Add ${title.toLowerCase()}…`} className="flex-1 rounded-full border px-4 py-2 text-sm" />
        <button className="rounded-full bg-brand px-4 text-sm font-bold text-primary-foreground">Add</button>
      </form>
      <div className="flex flex-wrap gap-2">
        {items.map((c) => <span key={c} className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">{c}<button onClick={() => onRemove(c)} aria-label="Remove"><X className="h-3.5 w-3.5" /></button></span>)}
      </div>
    </div>
  );
}

function Cats() {
  const categories = useStore((s) => s.categories);
  const locations = useStore((s) => s.locations);
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Categories & locations</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        <Editor title="Categories" items={categories} onAdd={actions.addCategory} onRemove={actions.removeCategory} />
        <Editor title="Locations" items={locations} onAdd={actions.addLocation} onRemove={actions.removeLocation} />
      </div>
    </div>
  );
}
