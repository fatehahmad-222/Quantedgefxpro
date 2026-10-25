"use client";

import { useEffect, useRef } from "react";

export function BackgroundFX() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = glowRef.current;
    if (!node) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let frame = 0;
    let targetX = 50;
    let targetY = 10;

    function apply() {
      frame = 0;
      node?.style.setProperty("--glow-x", `${targetX}%`);
      node?.style.setProperty("--glow-y", `${targetY}%`);
    }

    function onPointerMove(event: PointerEvent) {
      targetX = (event.clientX / window.innerWidth) * 100;
      targetY = (event.clientY / window.innerHeight) * 100;
      if (!frame) frame = window.requestAnimationFrame(apply);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-base" />
      <div className="grid-drift absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_78%)]" />
      <div ref={glowRef} className="aurora absolute inset-0" />
      <div className="absolute -left-40 top-1/4 h-[34rem] w-[34rem] bg-[radial-gradient(circle,rgba(0,229,255,0.06),transparent_68%)]" />
      <div className="absolute -right-52 top-[22%] h-[32rem] w-[32rem] bg-[radial-gradient(circle,rgba(124,92,255,0.07),transparent_68%)]" />
      <div className="noise absolute inset-0" />
      <div className="scanlines absolute inset-0 opacity-60" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-base to-transparent" />
    </div>
  );
}
