"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { buttonClassName } from "@/components/ui/button";
import { homepageHeroSlides as slides } from "@/config/homepage";

const AUTOPLAY_DELAY = 6500;
const SWIPE_THRESHOLD = 44;

export function HomeTwoHero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interaction, setInteraction] = useState(0);
  const pointerStart = useRef<number | null>(null);
  const slide = slides[activeSlide];

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (paused || reducedMotion.matches) return;
    const timer = window.setInterval(
      () => setActiveSlide((slide) => (slide + 1) % slides.length),
      AUTOPLAY_DELAY,
    );
    return () => window.clearInterval(timer);
  }, [interaction, paused]);

  const selectSlide = (index: number) => {
    setActiveSlide(index);
    setInteraction((value) => value + 1);
  };
  const previous = () => {
    setActiveSlide((slide) => (slide - 1 + slides.length) % slides.length);
    setInteraction((value) => value + 1);
  };
  const next = () => {
    setActiveSlide((slide) => (slide + 1) % slides.length);
    setInteraction((value) => value + 1);
  };
  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse") return;
    pointerStart.current = event.clientX;
  };
  const onPointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    if (pointerStart.current === null) return;
    const distance = event.clientX - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(distance) < SWIPE_THRESHOLD) return;
    if (distance > 0) previous();
    else next();
  };
  const imagePosition = {
    "--hero-mobile-position": slide.mobilePosition,
    "--hero-desktop-position": slide.desktopPosition,
  } as CSSProperties;

  return (
    <section
      className="relative min-h-[clamp(38rem,calc(100svh-7rem),42.5rem)] touch-pan-y overflow-hidden bg-[color:var(--background-dark)] text-[color:var(--foreground-light)] md:min-h-[calc(88svh-5rem)]"
      aria-roledescription="carousel"
      aria-label="Woodbay product ranges"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        pointerStart.current = null;
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") previous();
        if (event.key === "ArrowRight") next();
      }}
    >
      <div key={slide.image} className="hero-slide-image absolute inset-0">
        <Image
          src={slide.image}
          alt={slide.alt}
          fill
          preload={activeSlide === 0}
          loading={activeSlide === 0 ? undefined : "eager"}
          sizes="100vw"
          style={imagePosition}
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,12,10,.12)_0%,rgba(11,12,10,.32)_32%,rgba(11,12,10,.91)_70%,rgba(11,12,10,.98)_100%)] sm:bg-[linear-gradient(90deg,rgba(12,13,10,.94)_0%,rgba(12,13,10,.78)_42%,rgba(12,13,10,.24)_74%,rgba(12,13,10,.12)_100%)]" />
      <div
        className="absolute inset-y-0 left-0 w-1 bg-[color:var(--gold)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex min-h-[clamp(38rem,calc(100svh-7rem),42.5rem)] max-w-[1440px] flex-col justify-end px-5 pt-24 pb-[6.5rem] sm:justify-center sm:pt-20 sm:pb-32 md:min-h-[calc(88svh-5rem)] md:px-8 xl:px-14">
        <div
          key={slide.title}
          id={`hero-panel-${activeSlide}`}
          role="tabpanel"
          className="hero-slide-copy max-w-2xl"
        >
          <p className="text-[11px] leading-none font-bold tracking-[.16em] text-[color:var(--gold)] uppercase sm:text-xs">
            {slide.eyebrow}
          </p>
          <h1 className="font-display mt-3 max-w-[11ch] text-[clamp(2rem,9.4vw,2.45rem)] leading-[.96] tracking-[-.02em] whitespace-pre-line sm:mt-4 sm:text-6xl lg:text-[5.25rem]">
            {slide.title}
          </h1>
          <p className="mt-4 max-w-[34rem] text-[14px] leading-6 text-[#e2ddd4] sm:mt-6 sm:text-base sm:leading-7">
            {slide.description}
          </p>
          <Link
            href={slide.href}
            className={`${buttonClassName("gold", "min-h-11 !px-4 sm:!px-5")} mt-6 sm:mt-8`}
          >
            {slide.cta} <ArrowRight size={15} />
          </Link>
        </div>
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          Slide {activeSlide + 1} of {slides.length}: {slide.eyebrow}
        </p>
        <div className="absolute inset-x-5 bottom-4 flex min-h-14 items-center justify-between border-t border-white/25 pt-2 md:inset-x-8 lg:bottom-7 xl:inset-x-14">
          <span className="min-w-14 text-[11px] font-bold tracking-[.12em] text-white tabular-nums">
            {String(activeSlide + 1).padStart(2, "0")} /{" "}
            {String(slides.length).padStart(2, "0")}
          </span>
          <div
            className="flex items-center"
            role="tablist"
            aria-label="Choose a product range"
          >
            {slides.map((item, index) => (
              <button
                key={item.title}
                type="button"
                role="tab"
                aria-selected={index === activeSlide}
                aria-controls={`hero-panel-${activeSlide}`}
                aria-label={`Show slide ${index + 1}: ${item.eyebrow}`}
                onClick={() => selectSlide(index)}
                className="group grid size-7 place-items-center sm:size-9"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all ${index === activeSlide ? "w-5 bg-[color:var(--gold)]" : "w-1.5 bg-white/45 group-hover:bg-white"}`}
                />
              </button>
            ))}
          </div>
          <div className="mr-0 hidden min-w-24 justify-end gap-2 min-[1800px]:mr-0 sm:flex lg:mr-40">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={previous}
              className="grid size-11 place-items-center border border-white/35 bg-black/25 text-white transition-colors hover:border-[color:var(--gold)] hover:bg-[color:var(--gold)] hover:text-[color:var(--background-dark)]"
            >
              <ArrowLeft size={17} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={next}
              className="grid size-11 place-items-center border border-white/35 bg-black/25 text-white transition-colors hover:border-[color:var(--gold)] hover:bg-[color:var(--gold)] hover:text-[color:var(--background-dark)]"
            >
              <ArrowRight size={17} strokeWidth={1.5} />
            </button>
          </div>
          <span className="min-w-14 sm:hidden" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
