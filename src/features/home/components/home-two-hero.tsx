"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    title: "Smart Kitchen &\nWardrobe Solutions.",
    description:
      "Considered pantry, pullout, sink and wardrobe systems for modern interiors.",
    image: "/images/home-2/hero-interiors.png",
    alt: "Contemporary kitchen fitted with Woodbay interior solutions",
  },
  {
    title: "Hardware Fittings &\nAluminium Profiles.",
    description:
      "Hinges, lift-up systems, furniture hardware, handles and profiles made for dependable performance.",
    image: "/images/categories/hardware-fittings.png",
    alt: "Woodbay hardware fittings and aluminium profile collection",
  },
  {
    title: "Smart Furniture &\nHome Decor.",
    description:
      "Connected furniture and material-led decor for spaces that feel composed and personal.",
    image: "/images/home-2/hero-smart-living.png",
    alt: "Woodbay smart furniture and home decor interior",
  },
] as const;

export function HomeTwoHero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(
      () => setActiveSlide((slide) => (slide + 1) % slides.length),
      6500,
    );
    return () => window.clearInterval(timer);
  }, [paused]);

  const selectSlide = (slide: number) => setActiveSlide(slide);
  const previous = () =>
    setActiveSlide((slide) => (slide - 1 + slides.length) % slides.length);
  const next = () => setActiveSlide((slide) => (slide + 1) % slides.length);

  return (
    <section
      className="relative min-h-[clamp(560px,76svh,690px)] overflow-hidden bg-[color:var(--background-dark)] text-[color:var(--foreground-light)] md:min-h-[calc(88svh-5rem)]"
      aria-roledescription="carousel"
      aria-label="Woodbay highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.title}
          aria-hidden={index !== activeSlide}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${index === activeSlide ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          <Image
            src={slide.image}
            alt={index === activeSlide ? slide.alt : ""}
            fill
            preload={index === 0}
            loading={index === 0 ? undefined : "lazy"}
            sizes="100vw"
            className={`object-cover ${index === 1 ? "object-center" : "object-[62%_center]"}`}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,13,10,.58)_0%,rgba(12,13,10,.74)_100%)] sm:bg-[linear-gradient(90deg,rgba(12,13,10,.94)_0%,rgba(12,13,10,.78)_42%,rgba(12,13,10,.24)_74%,rgba(12,13,10,.12)_100%)]" />
        </div>
      ))}
      <div
        className="absolute inset-y-0 left-0 w-1 bg-[color:var(--gold)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex min-h-[clamp(560px,76svh,690px)] max-w-[1440px] flex-col justify-center px-5 pt-14 pb-28 sm:pt-20 sm:pb-32 md:min-h-[calc(88svh-5rem)] md:px-8 xl:px-14">
        {slides.map((slide, index) => (
          <div
            key={slide.title}
            className={`max-w-2xl transition-all duration-700 ${index === activeSlide ? "translate-y-0 opacity-100" : "pointer-events-none absolute translate-y-3 opacity-0"}`}
          >
            {index === 0 ? (
              <h1 className="font-display max-w-[11ch] text-[2.75rem] leading-[.94] tracking-[-.02em] whitespace-pre-line sm:text-6xl lg:text-[5.25rem]">{slide.title}</h1>
            ) : (
              <h2 className="font-display max-w-[11ch] text-[2.75rem] leading-[.94] tracking-[-.02em] whitespace-pre-line sm:text-6xl lg:text-[5.25rem]">{slide.title}</h2>
            )}
            <p className="mt-6 max-w-lg text-[15px] leading-7 text-[#d7d1c6] sm:text-base">
              {slide.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" tabIndex={index === activeSlide ? 0 : -1}>
                <Button variant="gold">
                  Explore Products <ArrowRight size={15} />
                </Button>
              </Link>
              <Link
                href="/dealers/become-a-dealer"
                tabIndex={index === activeSlide ? 0 : -1}
              >
                <Button variant="secondary">Become a Dealer</Button>
              </Link>
            </div>
          </div>
        ))}
        <div className="absolute inset-x-5 bottom-6 flex items-center justify-between border-t border-white/20 pt-4 md:inset-x-8 lg:bottom-8 xl:inset-x-14">
          <div
            className="flex items-center gap-3"
            role="tablist"
            aria-label="Hero slides"
          >
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                role="tab"
                aria-selected={index === activeSlide}
                aria-label={`Show slide ${index + 1}: ${slide.title.replace("\n", " ")}`}
                onClick={() => selectSlide(index)}
                className={`flex min-h-11 items-center gap-2 text-[10px] font-bold tracking-[.14em] transition-colors ${index === activeSlide ? "text-[color:var(--gold)]" : "text-white/55 hover:text-white"}`}
              >
                <span>0{index + 1}</span>
                <span
                  className={`h-px transition-all ${index === activeSlide ? "w-9 bg-[color:var(--gold)]" : "w-5 bg-white/30"}`}
                />
              </button>
            ))}
          </div>
          <div className="flex gap-2">
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
        </div>
      </div>
    </section>
  );
}
