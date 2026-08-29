"use client";

import { useEffect } from "react";

export function ScrollReveal({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(
        "#main-content > section, #main-content > div > section",
      ),
    );
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

    sections.forEach((section) => {
      section.classList.add("scroll-reveal");
      section.dataset.revealDirection = "up";
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
      sections.forEach((section) => {
        section.classList.remove("scroll-reveal", "scroll-reveal--visible");
        delete section.dataset.revealDirection;
      });
    };
  }, []);

  return children;
}
