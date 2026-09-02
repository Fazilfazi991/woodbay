"use client";

import {
  Children,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ProductCarousel({ children }: { children: ReactNode }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    setAtStart(viewport.scrollLeft <= 2);
    setAtEnd(
      viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 2,
    );
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    updateEdges();
    const resizeObserver = new ResizeObserver(updateEdges);
    resizeObserver.observe(viewport);
    viewport.addEventListener("scroll", updateEdges, { passive: true });
    return () => {
      resizeObserver.disconnect();
      viewport.removeEventListener("scroll", updateEdges);
    };
  }, [updateEdges]);

  const move = (direction: -1 | 1) => {
    const viewport = viewportRef.current;
    const firstCard = viewport?.firstElementChild as HTMLElement | null;
    if (!viewport || !firstCard) return;
    const gap = Number.parseFloat(getComputedStyle(viewport).columnGap) || 16;
    viewport.scrollBy({
      left: direction * (firstCard.offsetWidth + gap),
      behavior: "smooth",
    });
  };

  return (
    <div className="mt-8 sm:mt-12">
      <div className="mb-4 flex min-h-11 items-center justify-between gap-5">
        <p className="max-w-md text-sm leading-6 text-[color:var(--muted-dark)]">
          Swipe or use the arrows to explore more of the current collection.
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label="Previous featured products"
            disabled={atStart}
            onClick={() => move(-1)}
            className="grid size-11 place-items-center border border-[color:var(--border-light)] text-[color:var(--foreground-dark)] transition-[border-color,color,background-color] hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)] active:bg-white disabled:cursor-default disabled:opacity-30"
          >
            <ChevronLeft size={19} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next featured products"
            disabled={atEnd}
            onClick={() => move(1)}
            className="grid size-11 place-items-center border border-[color:var(--border-light)] text-[color:var(--foreground-dark)] transition-[border-color,color,background-color] hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)] active:bg-white disabled:cursor-default disabled:opacity-30"
          >
            <ChevronRight size={19} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
        ref={viewportRef}
        role="region"
        aria-label="Featured products"
        tabIndex={0}
        className="category-chips-scroll -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)] sm:mx-0 sm:px-0"
      >
        {Children.map(children, (child) => (
          <div className="w-[78vw] max-w-[21rem] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] sm:max-w-none lg:w-[calc((100%-2rem)/3)]">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
