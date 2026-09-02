"use client";

import { useEffect } from "react";

export function ScrollReveal({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle(
            "scroll-reveal--visible",
            entry.isIntersecting,
          );
        });
      },
      { threshold: 0.12 },
    );
    let sections: HTMLElement[] = [];
    // Next.js can stream nested server segments after this client boundary has
    // hydrated. Defer DOM decoration until that initial stream has settled so
    // React never compares its server tree against observer-added attributes.
    const timer = window.setTimeout(() => {
      sections = Array.from(
        document.querySelectorAll<HTMLElement>(
          "#main-content > section, #main-content > div > section",
        ),
      );
      sections.forEach((section) => {
        section.classList.add("scroll-reveal");
        section.dataset.revealDirection = "up";
        observer.observe(section);
      });
    }, 250);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      sections.forEach((section) => {
        section.classList.remove("scroll-reveal", "scroll-reveal--visible");
        delete section.dataset.revealDirection;
      });
    };
  }, []);

  return children;
}
