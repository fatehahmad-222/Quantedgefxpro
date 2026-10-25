"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getConsent, setConsent } from "@/lib/analytics";
import { Cookie } from "@/components/ui/Icons";

export function ConsentBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getConsent() === null) {
      const timer = window.setTimeout(() => setVisible(true), 700);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, []);

  function choose(value: "granted" | "denied") {
    setConsent(value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="consent-in fixed inset-x-3 bottom-3 z-[90] sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[390px]"
      role="region"
      aria-label="Cookie preferences"
    >
      <div className="glass relative overflow-hidden rounded-xl p-5 shadow-2xl">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/80 to-transparent" />
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/10 text-gold">
            <Cookie size={18} />
          </span>
          <div>
            <p className="font-display text-sm font-semibold text-frost">
              Your privacy choices
            </p>
            <p className="mt-1.5 text-[0.78rem] leading-5 text-muted">
              We use marketing cookies to measure interest in Quant Edge FX Pro.
              Nothing loads until you accept.{" "}
              <Link
                href="/privacy"
                className="text-cyan underline underline-offset-2 hover:text-gold"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => choose("granted")}
            className="cta cta-primary h-10 min-h-0 flex-1 px-4 text-xs"
          >
            Accept all
          </button>
          <button
            type="button"
            onClick={() => choose("denied")}
            className="cta cta-outline h-10 min-h-0 flex-1 px-4 text-xs"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
