"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Solution = {
  title: string;
  href: string;
  image: string;
  imageClassName: string;
};

export function SolutionCarousel({
  solutions,
}: {
  solutions: readonly Solution[];
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    setAtStart(viewport.scrollLeft <= 22);
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
    const gap = Number.parseFloat(getComputedStyle(viewport).columnGap) || 10;
    viewport.scrollBy({
      left: direction * (firstCard.offsetWidth + gap),
      behavior: "smooth",
    });
  };

  return (
    <nav
      aria-label="Explore products by solution"
      className="mt-10 border-t border-[#d7cebf] pt-6 sm:mt-12 sm:pt-8"
    >
      <div className="flex min-h-11 items-center justify-between gap-4">
        <p className="text-[10px] font-bold tracking-[.16em] text-[color:var(--gold)] uppercase sm:text-[11px]">
          Explore by solution
        </p>
        <div className="flex items-center gap-1 md:hidden">
          <button
            type="button"
            aria-label="Previous solutions"
            disabled={atStart}
            onClick={() => move(-1)}
            className="grid size-11 place-items-center border border-[#cfc5b4] text-[color:var(--foreground-dark)] transition-colors hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] disabled:cursor-default disabled:opacity-30"
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Next solutions"
            disabled={atEnd}
            onClick={() => move(1)}
            className="grid size-11 place-items-center border border-[#cfc5b4] text-[color:var(--foreground-dark)] transition-colors hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] disabled:cursor-default disabled:opacity-30"
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <div
        ref={viewportRef}
        className="category-chips-scroll -mx-5 mt-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-5 pb-1 md:mx-0 md:grid md:grid-cols-8 md:gap-3 md:px-0"
      >
        {solutions.map((area) => (
          <Link
            key={area.href}
            href={area.href}
            className="group block w-[140px] shrink-0 snap-start min-[400px]:w-[148px] md:w-auto"
          >
            <span className="relative block aspect-square overflow-hidden border border-[#d7cebf] bg-white transition-colors group-hover:border-[color:var(--gold)]">
              <Image
                src={area.image}
                alt={`${area.title} solutions by Woodbay`}
                fill
                sizes="(max-width: 399px) 140px, (max-width: 767px) 148px, 12vw"
                className={`${area.imageClassName} transition duration-500 group-hover:scale-[1.025]`}
              />
            </span>
            <span className="mt-2 block min-h-8 text-sm leading-5 font-semibold text-[color:var(--foreground-dark)]">
              {area.title}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
