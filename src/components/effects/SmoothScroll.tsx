"use client";

import type Lenis from "lenis";
import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let disposed = false;
    let lenis: Lenis | null = null;
    let frame = 0;
    let onClick: ((event: MouseEvent) => void) | undefined;

    void import("lenis").then(({ default: Lenis }) => {
      if (disposed) return;

      lenis = new Lenis({
        lerp: 0.09,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.1,
        smoothWheel: true,
      });

      function raf(time: number) {
        lenis?.raf(time);
        frame = window.requestAnimationFrame(raf);
      }
      frame = window.requestAnimationFrame(raf);

      onClick = (event: MouseEvent) => {
        if (event.defaultPrevented || event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }

        const element = event.target;
        if (!(element instanceof Element)) return;
        const anchor = element.closest<HTMLAnchorElement>('a[href^="#"]');
        if (!anchor) return;

        const hash = anchor.getAttribute("href");
        if (!hash || hash === "#") return;

        const target = document.querySelector<HTMLElement>(hash);
        if (!target) return;

        event.preventDefault();
        lenis?.scrollTo(target, { offset: -88, duration: 1.15 });
        window.history.pushState(null, "", hash);
      };

      document.addEventListener("click", onClick);
    });

    return () => {
      disposed = true;
      if (onClick) document.removeEventListener("click", onClick);
      window.cancelAnimationFrame(frame);
      lenis?.destroy();
    };
  }, []);

  return null;
}
