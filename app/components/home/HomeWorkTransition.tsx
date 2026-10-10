"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function HomeWorkTransition({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !rootRef.current) return;

      const heading = rootRef.current.querySelector(".section-topline");
      const cards = gsap.utils.toArray<HTMLElement>("[data-home-work-card]", rootRef.current);
      const line = rootRef.current.querySelector(".future-work-energy-line");

      gsap.set(heading, { y: 42, opacity: 0 });
      gsap.set(cards, { y: 58, opacity: 0, scale: 0.985 });
      gsap.set(line, { scaleX: 0, transformOrigin: "left center" });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 82%",
          end: "top 28%",
          scrub: 0.65,
          once: false,
        },
      });

      timeline
        .to(line, { scaleX: 1, duration: 0.2, ease: "none" }, 0)
        .to(heading, { y: 0, opacity: 1, duration: 0.28, ease: "none" }, 0.08)
        .to(cards, { y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 0.34, ease: "none" }, 0.16);

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  );

  return (
    <div ref={rootRef} className="future-work-transition">
      <div className="future-work-energy-line" aria-hidden="true" />
      <div className="future-work-grid-overlay" aria-hidden="true" />
      {children}
    </div>
  );
}
