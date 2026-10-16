import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/jakas/PanelShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/business/profile")({ component: BizProfile });

function BizProfile() {
  const session = useStore((s) => s.session)!;
  const host = useStore((s) => s.hosts.find((h) => h.name === session.name));
  const [f, setF] = useState({ about: "", phone: "", hours: "10:00 – 22:00", address: host?.city ?? "" });
  return (
    <div className="mx-auto max-w-xl space-y-5">
      <div className="flex items-center gap-4">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand font-display text-2xl font-bold text-primary-foreground">{session.name[0]}</span>
        <div><h1 className="text-2xl font-bold">{session.name}</h1><p className="text-sm text-muted-foreground">{host?.type} · Verification: <StatusBadge status={host?.status ?? "pending"} /></p></div>
      </div>
      <form className="space-y-4 rounded-2xl border bg-card p-5" onSubmit={(e) => { e.preventDefault(); toast.success("Profile saved"); }}>
        <div className="space-y-1.5"><Label>About</Label><Textarea value={f.about} maxLength={500} onChange={(e) => setF({ ...f, about: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5"><Label>Phone</Label><Input value={f.phone} maxLength={15} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Opening hours</Label><Input value={f.hours} onChange={(e) => setF({ ...f, hours: e.target.value })} /></div>
        </div>
        <div className="space-y-1.5"><Label>Address</Label><Input value={f.address} maxLength={200} onChange={(e) => setF({ ...f, address: e.target.value })} /></div>
        <Button className="w-full rounded-full bg-brand font-bold">Save profile</Button>
      </form>
    </div>
  );
}
