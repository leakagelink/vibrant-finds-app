import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Moment } from "@/lib/store";
import { MomentCard } from "./MomentCard";

export function DiscoverDeck({ moments }: { moments: Moment[] }) {
  const [viewport, carousel] = useEmblaCarousel({ loop: false, align: "center", duration: 28 });
  const [selected, setSelected] = useState(0);
  const select = useCallback(() => { if (carousel) setSelected(carousel.selectedScrollSnap()); }, [carousel]);
  useEffect(() => {
    if (!carousel) return;
    select();
    carousel.on("select", select).on("reInit", select);
    return () => { carousel.off("select", select).off("reInit", select); };
  }, [carousel, select]);
  const move = (index: number) => carousel?.scrollTo(index, window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  if (!moments.length) return <div className="grid h-full place-items-center text-sm text-muted-foreground">No experiences here yet.</div>;
  return <section className="discover-deck" aria-label="Nearby experiences" aria-roledescription="carousel" tabIndex={0} onKeyDown={(event) => {
    if (event.key === "ArrowRight") { event.preventDefault(); move(Math.min(selected + 1, moments.length - 1)); }
    if (event.key === "ArrowLeft") { event.preventDefault(); move(Math.max(selected - 1, 0)); }
  }}>
    <div ref={viewport} className="discover-viewport">
      <div className="discover-track">
        {moments.map((moment, index) => <div key={moment.id} className="discover-slide" data-active={index === selected} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${moments.length}`} inert={index !== selected}>
          <MomentCard m={moment} />
        </div>)}
      </div>
    </div>
    <div className="discover-pagination">
      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" aria-label="Previous event" disabled={selected === 0} onClick={() => move(selected - 1)}><ChevronLeft className="h-4 w-4" /></Button>
      <span className="flex items-center gap-1.5" aria-live="polite" aria-label={`Event ${selected + 1} of ${moments.length}`}>
        {moments.map((moment, index) => <span key={moment.id} className="discover-dot" data-active={index === selected} />)}
      </span>
      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" aria-label="Next event" disabled={selected === moments.length - 1} onClick={() => move(selected + 1)}><ChevronRight className="h-4 w-4" /></Button>
    </div>
  </section>;
}