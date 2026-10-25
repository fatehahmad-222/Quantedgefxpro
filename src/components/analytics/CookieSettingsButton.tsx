"use client";

import { clearConsent } from "@/lib/analytics";

export function CookieSettingsButton() {
  function reset() {
    clearConsent();
    window.location.reload();
  }

  return (
    <button
      type="button"
      onClick={reset}
      className="text-left transition-colors hover:text-cyan"
    >
      Cookie settings
    </button>
  );
}
