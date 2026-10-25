"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  hasMarketingConsent,
  onConsentChange,
  trackPageView,
} from "@/lib/analytics";

declare global {
  interface Window {
    __qefpPixelId?: string;
  }
}

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

function loadPixel(pixelId: string): void {
  if (typeof window === "undefined") return;

  if (!window.fbq) {
    const fbq = function (...args: unknown[]) {
      const queue = (fbq as unknown as { queue?: unknown[][] }).queue ?? [];
      queue.push(args);
      (fbq as unknown as { queue?: unknown[][] }).queue = queue;
    };
    (fbq as unknown as { queue: unknown[][] }).queue = [];
    (fbq as unknown as { loaded: boolean }).loaded = true;
    (fbq as unknown as { version: string }).version = "2.0";
    window.fbq = fbq;
    window._fbq = fbq;
  }

  if (window.__qefpPixelId !== pixelId) {
    window.fbq?.("init", pixelId);
    window.__qefpPixelId = pixelId;
  }

  if (!document.getElementById("meta-pixel-script")) {
    const script = document.createElement("script");
    script.id = "meta-pixel-script";
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }
}

function subscribeConsent(onStoreChange: () => void) {
  return onConsentChange(onStoreChange);
}

export function MetaPixel() {
  const pathname = usePathname();
  const enabled = useSyncExternalStore(
    subscribeConsent,
    hasMarketingConsent,
    () => false,
  );
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || !PIXEL_ID) return;
    loadPixel(PIXEL_ID);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      lastTrackedPath.current = null;
      return;
    }
    if (lastTrackedPath.current === pathname) return;
    trackPageView(pathname);
    lastTrackedPath.current = pathname;
  }, [pathname, enabled]);

  return null;
}
