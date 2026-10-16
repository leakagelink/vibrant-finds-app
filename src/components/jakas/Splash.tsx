import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

export function Splash() {
  const [phase, setPhase] = useState<"hidden" | "show" | "out">("hidden");

  useEffect(() => {
    if (sessionStorage.getItem("jakas-splash")) return;
    sessionStorage.setItem("jakas-splash", "1");
    setPhase("show");
    const a = setTimeout(() => setPhase("out"), 2600);
    const b = setTimeout(() => setPhase("hidden"), 3200);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      onClick={() => setPhase("hidden")}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-brand-dark transition-opacity duration-500 ${phase === "out" ? "opacity-0" : "opacity-100"}`}
    >
      <div className="splash-blob absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand-orange opacity-50 blur-3xl" />
      <div className="splash-blob absolute -bottom-24 -right-16 h-96 w-96 rounded-full bg-brand-purple opacity-60 blur-3xl [animation-delay:-3s]" />
      <div className="splash-blob absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-pink opacity-40 blur-3xl [animation-delay:-1.5s]" />

      <div className="relative flex flex-col items-center">
        <div className="relative mb-6">
          <span className="splash-ring absolute inset-0 rounded-full bg-brand" />
          <span className="splash-ring absolute inset-0 rounded-full bg-brand [animation-delay:0.6s]" />
          <span className="relative grid h-20 w-20 place-items-center rounded-full bg-brand shadow-glow">
            <MapPin className="h-10 w-10 text-primary-foreground" strokeWidth={2.5} />
          </span>
        </div>
        <h1 className="splash-word font-display text-7xl font-extrabold tracking-tight text-primary-foreground md:text-8xl">
          {"JAKAS".split("").map((c, i) => (
            <span key={i} className="inline-block" style={{ animationDelay: `${0.2 + i * 0.08}s` }}>{c}</span>
          ))}
        </h1>
        <p className="splash-tag mt-2 text-lg font-medium text-primary-foreground/80">
          What's happening, <span className="font-bold text-brand-pink">right now.</span>
        </p>
        <div className="mt-10 h-1 w-40 overflow-hidden rounded-full bg-primary-foreground/15">
          <div className="splash-bar h-full rounded-full bg-brand" />
        </div>
        <p className="mt-4 text-xs tracking-[0.3em] text-primary-foreground/50">ENERGY · EXPERIENCE · DISCOVERY</p>
      </div>
    </div>
  );
}
