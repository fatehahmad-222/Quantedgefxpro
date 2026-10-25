"use client";

import { useEffect, useRef } from "react";
import {
  hasMarketingConsent,
  onConsentChange,
  trackEvent,
  type EventParams,
  type PixelEventName,
} from "@/lib/analytics";

type SectionViewTrackerProps = {
  eventName: PixelEventName;
  params?: EventParams;
};

export function SectionViewTracker({
  eventName,
  params,
}: SectionViewTrackerProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let fired = false;
    let unsubscribe: () => void = () => undefined;

    function fire() {
      if (!hasMarketingConsent() || fired) return;
      fired = true;
      unsubscribe();
      trackEvent(eventName, params);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        fire();
        if (!fired) unsubscribe = onConsentChange(fire);
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      unsubscribe();
    };
  }, [eventName, params]);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 h-px w-px"
    />
  );
}
