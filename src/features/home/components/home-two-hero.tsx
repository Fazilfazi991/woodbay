"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    eyebrow: "Premium decor & interiors",
    title: "Elevate Every Detail of Your Home.",
    description:
      "Thoughtful accessories, refined finishes and interiors made for contemporary spaces.",
    image: "/images/home-2/hero-interiors.png",
    alt: "Contemporary Woodbay kitchen interior",
    primary: { label: "Explore Products", href: "/products" },
    secondary: {
      label: "Book Factory Visit",
      href: "/furniture/factory-visit",
    },
  },
  {
    eyebrow: "Precision, made tangible",
    title: "Crafted With Care. Built to Last.",
    description:
      "Woodbay combines careful production, quality control and dependable distribution in every detail.",
    image: "/images/home-2/hero-manufacturing.png",
    alt: "Woodbay precision manufacturing facility",
    primary: { label: "Discover Woodbay", href: "/about" },
    secondary: { label: "Our Projects", href: "/projects" },
  },
  {
    eyebrow: "Smart modern living",
    title: "Designed Around the Way You Live.",
    description:
      "Furniture, decor and intelligent systems that bring clarity, comfort and character to your home.",
    image: "/images/home-2/hero-smart-living.png",
    alt: "Woodbay furniture and decor interior",
    primary: { label: "Explore Furniture", href: "/furniture" },
    secondary: {
      label: "View Smart Products",
      href: "/products/smart-products",
    },
  },
] as const;

export function HomeTwoHero() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () => setActiveSlide((slide) => (slide + 1) % slides.length),
      6500,
    );
    return () => window.clearInterval(timer);
  }, []);

  const selectSlide = (slide: number) => setActiveSlide(slide);
  const previous = () =>
    setActiveSlide((slide) => (slide - 1 + slides.length) % slides.length);
  const next = () => setActiveSlide((slide) => (slide + 1) % slides.length);

  return (
    <section
      className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-[#f8f8f4] text-[#171717] lg:min-h-[calc(92vh-5rem)]"
      aria-roledescription="carousel"
      aria-label="Woodbay highlights"
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
            priority={index === 0}
            sizes="100vw"
            className="object-cover object-[63%_center]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(248,248,244,.98)_0%,rgba(248,248,244,.9)_42%,rgba(248,248,244,.2)_68%,rgba(248,248,244,.03)_100%)]" />
        </div>
      ))}
      <div
        className="absolute inset-y-0 left-0 w-1 bg-[#ffc60b]"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex min-h-[calc(100svh-5rem)] max-w-[1440px] flex-col justify-center px-5 py-24 md:px-8 lg:min-h-[calc(92vh-5rem)] xl:px-14">
        {slides.map((slide, index) => (
          <div
            key={slide.title}
            className={`max-w-2xl transition-all duration-700 ${index === activeSlide ? "translate-y-0 opacity-100" : "pointer-events-none absolute translate-y-3 opacity-0"}`}
          >
            <p className="text-[10px] font-bold tracking-[.2em] text-[#a87e00] uppercase">
              {slide.eyebrow}
            </p>
            <h1 className="font-display mt-5 text-5xl leading-[.92] sm:text-6xl lg:text-8xl">
              {slide.title}
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-[#626262]">
              {slide.description}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href={slide.primary.href}
                tabIndex={index === activeSlide ? 0 : -1}
              >
                <Button>
                  {slide.primary.label} <ArrowRight size={15} />
                </Button>
              </Link>
              <Link
                href={slide.secondary.href}
                tabIndex={index === activeSlide ? 0 : -1}
              >
                <Button variant="light">{slide.secondary.label}</Button>
              </Link>
            </div>
          </div>
        ))}
        <div className="absolute inset-x-5 bottom-7 flex items-center justify-between border-t border-[#171717]/15 pt-5 md:inset-x-8 lg:bottom-10 xl:inset-x-14">
          <div className="flex gap-2" role="tablist" aria-label="Hero slides">
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                role="tab"
                aria-selected={index === activeSlide}
                aria-label={`Show slide ${index + 1}: ${slide.eyebrow}`}
                onClick={() => selectSlide(index)}
                className={`h-1.5 transition-all ${index === activeSlide ? "w-10 bg-[#ffc60b]" : "w-5 bg-[#171717]/25 hover:bg-[#171717]/50"}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={previous}
              className="grid size-10 place-items-center border border-[#171717]/20 bg-white/70 transition-colors hover:border-[#ffc60b] hover:bg-[#ffc60b]"
            >
              <ArrowLeft size={17} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={next}
              className="grid size-10 place-items-center border border-[#171717]/20 bg-white/70 transition-colors hover:border-[#ffc60b] hover:bg-[#ffc60b]"
            >
              <ArrowRight size={17} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
