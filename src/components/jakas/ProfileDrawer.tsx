import * as Dialog from "@radix-ui/react-dialog";
import { Link } from "@tanstack/react-router";
import { ChevronRight, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { actions, useStore } from "@/lib/store";

export function ProfileDrawer({ onClose }: { onClose: () => void }) {
  const phone = useStore((s) => s.demoPhone);
  const location = useStore((s) => s.location);
  const saved = useStore((s) => s.saved.length);
  const notified = useStore((s) => s.notified.length);
  const toggleLocation = (on: boolean) => {
    if (!on) { actions.setLocation(null); return; }
    navigator.geolocation?.getCurrentPosition((p) => actions.setLocation({ label: "Near you", lat: p.coords.latitude, lng: p.coords.longitude }), () => toast.error("Location permission was denied"));
  };
  const rows = [
    { to: "/saved", icon: "⭐", label: "My JAKAS", sub: `${saved} saved experiences` },
    { to: "/explore", icon: "🔔", label: "Drop alerts", sub: `${notified} reminders on` },
    { to: "/notifications", icon: "📬", label: "Notifications", sub: "Updates from events" },
    { to: "/profile", icon: "⚙️", label: "Account & settings", sub: "Preferences, help, privacy" },
  ] as const;
  return <Dialog.Root open onOpenChange={(o) => { if (!o) onClose(); }}><Dialog.Portal>
    <Dialog.Overlay className="event-backdrop fixed inset-0 z-50 bg-sheet-backdrop backdrop-blur-sm" />
    <Dialog.Content aria-describedby={undefined} className="drawer-in fixed right-3 top-3 z-50 w-[calc(100%-24px)] max-w-[360px] rounded-[28px] bg-card p-5 shadow-nav">
      <Dialog.Title className="sr-only">Profile</Dialog.Title>
      <Button variant="ghost" size="icon" className="absolute right-3 top-3 h-8 w-8 rounded-full" aria-label="Close profile" onClick={onClose}><X /></Button>
      <div className="flex items-center gap-3.5">
        <span className="avatar-ring grid h-14 w-14 place-items-center rounded-full border-2 border-brand-orange bg-secondary text-2xl">{phone ? "😎" : "👤"}</span>
        <div><p className="text-lg font-extrabold">{phone ? "JAKAS Explorer" : "Guest"}</p><p className="text-xs text-muted-foreground">{phone ? `+91 ${phone} · demo` : "Sign in to save & join"}</p></div>
      </div>
      {!phone && <Button asChild variant="action" className="mt-4 h-12 w-full"><Link to="/login" onClick={onClose}>📱 Sign in with phone</Link></Button>}
      <div className="mt-4 flex items-center justify-between rounded-2xl bg-muted px-4 py-3">
        <div><p className="text-sm font-bold">📍 Location</p><p className="text-[11px] text-muted-foreground">{location ? location.label : "Off — showing all events"}</p></div>
        <Switch checked={!!location} onCheckedChange={toggleLocation} aria-label="Use current location" />
      </div>
      <nav className="mt-3 divide-y rounded-2xl border">
        {rows.map((r) => <Link key={r.to} to={r.to} onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/60"><span className="grid h-9 w-9 place-items-center rounded-xl bg-muted">{r.icon}</span><span className="flex-1"><span className="block text-sm font-bold">{r.label}</span><span className="text-[11px] text-muted-foreground">{r.sub}</span></span><ChevronRight className="h-4 w-4 text-muted-foreground" /></Link>)}
      </nav>
      {phone && <Button variant="ghost" className="mt-2 w-full text-destructive" onClick={() => { actions.demoSignOut(); onClose(); }}>Log out</Button>}
    </Dialog.Content>
  </Dialog.Portal></Dialog.Root>;
}
