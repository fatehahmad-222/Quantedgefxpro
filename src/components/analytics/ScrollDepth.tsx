"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  hasMarketingConsent,
  onConsentChange,
  trackEvent,
} from "@/lib/analytics";

const THRESHOLDS = [25, 50, 75, 90] as const;

export function ScrollDepth() {
  const pathname = usePathname();
  const fired = useRef<Set<number>>(new Set());

  useEffect(() => {
    fired.current = new Set();

    let frame = 0;

    function check() {
      frame = 0;
      if (!hasMarketingConsent()) return;

      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const percent = Math.min(
        100,
        Math.round((window.scrollY / scrollable) * 100),
      );

      for (const threshold of THRESHOLDS) {
        if (percent >= threshold && !fired.current.has(threshold)) {
          fired.current.add(threshold);
          trackEvent(
            "ScrollDepth",
            { percent: threshold, page_path: pathname },
            { sendToServer: false },
          );
        }
      }
    }

    function handleScroll() {
      if (frame) return;
      frame = window.requestAnimationFrame(check);
    }

    check();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    const unsubscribe = onConsentChange(() => {
      window.setTimeout(check, 0);
    });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      unsubscribe();
    };
  }, [pathname]);

  return null;
}
