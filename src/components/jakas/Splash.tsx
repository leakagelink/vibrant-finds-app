import { useEffect, useState } from "react";
import logoAsset from "@/assets/jakas-mark.png.asset.json";

export function Splash() {
  // Starts visible so the logo is painted on the very first frame, then hides
  // itself once the intro has played (or immediately on repeat visits).
  const [phase, setPhase] = useState<"hidden" | "show" | "out">("show");

  useEffect(() => {
    if ((window as unknown as { __jakasSeen?: boolean }).__jakasSeen) {
      setPhase("hidden");
      return;
    }
    const start = (window as unknown as { __jakasStart?: number }).__jakasStart ?? Date.now();
    const elapsed = Date.now() - start;
    const a = setTimeout(() => setPhase("out"), Math.max(0, 2600 - elapsed));
    const b = setTimeout(() => setPhase("hidden"), Math.max(0, 3200 - elapsed));
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      onClick={() => setPhase("hidden")}
      className={`jakas-splash fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-brand-dark transition-opacity duration-500 ${phase === "out" ? "opacity-0" : "opacity-100"}`}
    >
      <div className="splash-blob absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand-orange opacity-50 blur-3xl" />
      <div className="splash-blob absolute -bottom-24 -right-16 h-96 w-96 rounded-full bg-brand-purple opacity-60 blur-3xl [animation-delay:-3s]" />
      <div className="splash-blob absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-pink opacity-40 blur-3xl [animation-delay:-1.5s]" />

      <div className="relative flex w-full flex-col items-center px-8">
        <div className="relative flex w-full items-center justify-center">
          <span className="splash-glow absolute h-28 w-64 rounded-full bg-brand blur-3xl" />
          <div className="splash-logo relative w-[76%] max-w-[300px]">
            <img
              src={logoAsset.url}
              alt="JAKAS"
              width={1335}
              height={517}
              className="h-auto w-full select-none"
              draggable={false}
            />
          </div>
        </div>
        <p className="splash-tag mt-4 text-lg font-medium text-primary-foreground/80">
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
