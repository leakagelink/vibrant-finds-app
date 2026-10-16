import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { actions, useStore, type Moment } from "@/lib/store";

const schema = z.object({
  title: z.string().trim().min(3, "Title too short").max(80),
  description: z.string().trim().min(5, "Add a short description").max(500),
  location: z.string().trim().min(2, "Add a location").max(120),
  date: z.string().min(1, "Pick a date"),
  time: z.string().min(1, "Pick a time"),
  price: z.string().trim().max(20),
  category: z.string().min(1),
});

const fallback = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=70";

export function MomentForm({ host, hostType, initial, onDone }: { host: string; hostType: "user" | "business"; initial?: Moment; onDone?: () => void }) {
  const categories = useStore((s) => s.categories);
  const [f, setF] = useState({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    location: initial?.location ?? "",
    date: initial?.date ?? "",
    time: initial?.time ?? "",
    price: initial?.price ?? "Free",
    category: initial?.category ?? categories[0] ?? "Music",
  });
  const [image, setImage] = useState(initial?.image ?? "");
  const [err, setErr] = useState<Partial<Record<"title" | "description" | "location" | "date" | "time" | "price" | "category", string>>>({});
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  const onFile = (file?: File) => {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) { toast.error("Max 8MB"); return; }
    const r = new FileReader();
    r.onload = () => setImage(String(r.result));
    r.readAsDataURL(file);
  };

  const useMyLocation = () => {
    navigator.geolocation?.getCurrentPosition(
      (p) => setF((x) => ({ ...x, location: `${p.coords.latitude.toFixed(4)}, ${p.coords.longitude.toFixed(4)}` })),
      () => toast.error("Location permission denied"),
    );
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(f);
    if (!r.success) {
      setErr(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message])));
      return;
    }
    setErr({});
    if (initial) {
      actions.updateMoment(initial.id, { ...r.data, image: image || initial.image, status: "pending" });
      toast.success("Updated — sent for re-approval");
    } else {
      actions.addMoment({ ...r.data, image: image || fallback, host, hostType, distanceKm: 0.3 });
      toast.success("Posted! It will go live after approval.");
    }
    onDone?.();
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="flex aspect-video cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed bg-muted text-sm text-muted-foreground">
        {image ? (
          image.startsWith("data:video") ? <video src={image} className="h-full w-full object-cover" controls /> : <img src={image} alt="" className="h-full w-full object-cover" />
        ) : (
          <><ImagePlus className="mb-2 h-8 w-8 text-primary" />Add photo or video</>
        )}
        <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      </label>
      {(
        [
          ["title", "Title", "Live Music Night"],
          ["location", "Location", "Venue, area"],
          ["price", "Price", "Free / ₹500"],
        ] as const
      ).map(([k, l, p]) => (
        <div key={k} className="space-y-1.5">
          <Label htmlFor={k}>{l}</Label>
          <Input id={k} value={f[k]} onChange={set(k)} placeholder={p} />
          {k === "location" && <button type="button" onClick={useMyLocation} className="text-xs font-semibold text-primary">📍 Use my current location</button>}
          {err[k] && <p className="text-xs text-destructive">{err[k]}</p>}
        </div>
      ))}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5"><Label htmlFor="date">Date</Label><Input id="date" type="date" value={f.date} onChange={set("date")} />{err.date && <p className="text-xs text-destructive">{err.date}</p>}</div>
        <div className="space-y-1.5"><Label htmlFor="time">Time</Label><Input id="time" type="time" value={f.time} onChange={set("time")} />{err.time && <p className="text-xs text-destructive">{err.time}</p>}</div>
      </div>
      <div className="space-y-1.5">
        <Label>Category</Label>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button type="button" key={c} onClick={() => setF({ ...f, category: c })} className={`rounded-full px-3 py-1 text-sm ${f.category === c ? "bg-brand text-primary-foreground" : "bg-muted"}`}>{c}</button>
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={f.description} onChange={set("description")} rows={3} />
        {err.description && <p className="text-xs text-destructive">{err.description}</p>}
      </div>
      <Button type="submit" className="h-12 w-full rounded-full bg-brand text-base font-bold shadow-glow">{initial ? "Save changes" : "Publish moment"}</Button>
    </form>
  );
}
