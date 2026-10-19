import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, ShieldCheck, ArrowRight } from "lucide-react";
import { UserShell } from "@/components/jakas/UserShell";
import { DiscoverDeck } from "@/components/jakas/DiscoverDeck";
import { Logo } from "@/components/jakas/Logo";
import { Button } from "@/components/ui/button";
import { actions, useStore } from "@/lib/store";
import { isPublicHostMoment } from "@/lib/moment-visibility";
import { categoryEmoji } from "@/components/jakas/EventSheet";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JAKAS — Nearby events & moments right now" },
      { name: "description", content: "See what's happening near you: live events, food, music and activities." },
      { property: "og:title", content: "JAKAS — What's happening, right now" },
      { property: "og:description", content: "Discover nearby events, moments and activities." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const moments = useStore((s) => s.moments);
  const location = useStore((s) => s.location);
  const categories = useStore((s) => s.categories);
  const [cat, setCat] = useState("All");
  const [welcome, setWelcome] = useState(false);
  const [denied, setDenied] = useState(false);
  const [locating, setLocating] = useState(false);
  useEffect(() => { setWelcome(!sessionStorage.getItem("jakas-location-welcome") && !location); }, []);
  const dismiss = () => { sessionStorage.setItem("jakas-location-welcome", "seen"); setWelcome(false); setDenied(false); };
  const locate = () => {
    if (!navigator.geolocation) { setDenied(true); setWelcome(false); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition((p) => {
      actions.setLocation({ label: "Near you", lat: p.coords.latitude, lng: p.coords.longitude });
      setLocating(false); dismiss();
    }, () => { setLocating(false); setWelcome(false); setDenied(true); sessionStorage.setItem("jakas-location-welcome", "seen"); }, { timeout: 10000 });
  };
  const live = moments.filter((m) => isPublicHostMoment(m) && (cat === "All" || m.category === cat)).sort((a,b) => a.distanceKm-b.distanceKm);
  if (welcome) return <main className="mx-auto flex min-h-dvh max-w-md flex-col bg-secondary/20 px-7 pb-8 pt-9">
    <Logo className="mx-auto h-14" />
    <div className="location-radar relative mx-auto my-5 grid h-64 w-full place-items-center">
      <div className="absolute h-52 w-52 rounded-full border border-dashed border-brand-purple/20" /><div className="absolute h-36 w-36 rounded-full border border-dashed border-brand-orange/25" />
      <div className="grid h-28 w-28 place-items-center rounded-full bg-brand-orange/10"><MapPin className="h-24 w-24 fill-brand-pink text-brand-orange" strokeWidth={1.5} /></div>
      <span className="absolute left-1 top-10 rounded-full bg-card px-3 py-2 text-[10px] font-bold shadow-nav">☕ Coffee</span><span className="absolute right-1 top-12 rounded-full bg-card px-3 py-2 text-[10px] font-bold shadow-nav">🎵 Live Music</span><span className="absolute bottom-9 left-5 rounded-full bg-card px-3 py-2 text-[10px] font-bold shadow-nav">🍕 Food</span><span className="absolute bottom-8 right-4 rounded-full bg-card px-3 py-2 text-[10px] font-bold shadow-nav">🍹 Drinks</span>
    </div>
    <h1 className="text-center text-[26px] font-extrabold leading-tight">What's happening<br/><span className="text-brand-orange">near you?</span></h1><p className="mt-4 text-center text-sm leading-6 text-muted-foreground">Allow JAKAS to discover live experiences and events around you.</p>
    <div className="mt-auto pt-14"><Button variant="action" className="h-14 w-full text-base" onClick={locate} disabled={locating}><MapPin />{locating ? "Finding your location…" : "Enable Location"}<ArrowRight /></Button><Button variant="ghost" className="mt-3 h-11 w-full font-bold text-muted-foreground" onClick={dismiss}>Not now</Button><p className="mt-5 flex items-center justify-center gap-3 text-center text-[10px] leading-4 text-muted-foreground"><ShieldCheck className="h-4 w-4 shrink-0 text-success" />Your location is used only to personalise nearby discovery.</p></div>
  </main>;
  return <UserShell immersive={!denied} subtitle={location?.label ?? "Experiences near you"} onLocationClick={locate}>
    {denied ? <div className="flex min-h-[65dvh] flex-col items-center justify-center px-4 text-center"><div className="mb-8 grid h-40 w-40 place-items-center rounded-full bg-brand-orange/5"><MapPin className="h-20 w-20 text-brand-orange" /></div><h2 className="text-2xl font-extrabold">We need your location.</h2><p className="my-4 text-sm leading-6 text-muted-foreground">Enable location to discover experiences happening near you.</p><Button variant="action" className="h-14 w-full" onClick={locate} disabled={locating}>Try location again<ArrowRight /></Button><Button variant="ghost" className="mt-2 text-muted-foreground" onClick={dismiss}>Continue Exploring</Button></div> : <>
      <div className="discover-categories flex gap-2 overflow-x-auto">{["All", ...categories].map((c) => <Button key={c} size="sm" variant={cat === c ? "ink" : "secondary"} className="h-7 shrink-0 rounded-full px-3 text-[11px]" aria-pressed={cat === c} onClick={() => setCat(c)}>{c !== "All" && categoryEmoji(c)} {c}</Button>)}</div>
      <DiscoverDeck key={cat} moments={live} />
    </>}
  </UserShell>;
}
