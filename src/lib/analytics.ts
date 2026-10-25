"use client";

export type ConsentState = "granted" | "denied";

export type Attribution = {
  source?: string;
  campaign?: string;
  medium?: string;
  content?: string;
  term?: string;
  landingPath?: string;
  capturedAt?: number;
};

export type PixelEventName =
  | "PageView"
  | "ViewContent"
  | "Lead"
  | "Contact"
  | "InitiateCheckout"
  | "ScrollDepth"
  | "FAQOpen"
  | "GuaranteeViewed";

export type EventParams = Record<string, string | number | boolean | undefined>;

const CONSENT_KEY = "qefp-consent-v1";
const CONSENT_EVENT = "qefp:consent";
const ATTRIBUTION_KEY = "qefp-attribution-v1";
const ANONYMOUS_ID_KEY = "qefp-anonymous-id-v1";

const STANDARD_EVENTS = new Set<PixelEventName>([
  "PageView",
  "ViewContent",
  "Lead",
  "Contact",
  "InitiateCheckout",
]);

const CAPI_EVENTS = new Set<PixelEventName>([
  "PageView",
  "ViewContent",
  "Lead",
  "Contact",
  "InitiateCheckout",
]);

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readStorage(
  storage: Storage,
  key: string,
): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(storage: Storage, key: string, value: string): void {
  try {
    storage.setItem(key, value);
  } catch {
    return;
  }
}

export function getConsent(): ConsentState | null {
  if (!isBrowser()) return null;
  const value = readStorage(window.localStorage, CONSENT_KEY);
  return value === "granted" || value === "denied" ? value : null;
}

export function setConsent(value: ConsentState): void {
  if (!isBrowser()) return;
  writeStorage(window.localStorage, CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

export function clearConsent(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    return;
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
}

export function hasMarketingConsent(): boolean {
  return getConsent() === "granted";
}

export function onConsentChange(
  callback: (value: ConsentState | null) => void,
): () => void {
  if (!isBrowser()) return () => undefined;
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<ConsentState | null>;
    callback(customEvent.detail ?? null);
  };
  window.addEventListener(CONSENT_EVENT, handler);
  return () => window.removeEventListener(CONSENT_EVENT, handler);
}

export function captureAttribution(): Attribution | null {
  if (!isBrowser()) return null;

  const existing = readStorage(window.sessionStorage, ATTRIBUTION_KEY);
  if (existing) {
    try {
      return JSON.parse(existing) as Attribution;
    } catch {
      return null;
    }
  }

  const params = new URLSearchParams(window.location.search);
  const attribution: Attribution = {
    source: params.get("utm_source") ?? undefined,
    campaign: params.get("utm_campaign") ?? undefined,
    medium: params.get("utm_medium") ?? undefined,
    content: params.get("utm_content") ?? undefined,
    term: params.get("utm_term") ?? undefined,
    landingPath: `${window.location.pathname}${window.location.search}`,
    capturedAt: Date.now(),
  };

  writeStorage(
    window.sessionStorage,
    ATTRIBUTION_KEY,
    JSON.stringify(attribution),
  );

  return attribution;
}

export function getAttribution(): Attribution | null {
  if (!isBrowser()) return null;
  const raw = readStorage(window.sessionStorage, ATTRIBUTION_KEY);
  if (!raw) return captureAttribution();
  try {
    return JSON.parse(raw) as Attribution;
  } catch {
    return null;
  }
}

export function getAttributionLabel(): string | null {
  const attribution = getAttribution();
  if (!attribution) return null;
  const parts = [attribution.source, attribution.campaign].filter(
    (part): part is string => Boolean(part),
  );
  return parts.length > 0 ? parts.join("/") : null;
}

export function buildWhatsAppUrl(baseUrl: string): string {
  if (!isBrowser()) return baseUrl;
  const label = getAttributionLabel();
  if (!label) return baseUrl;

  try {
    const url = new URL(baseUrl);
    const baseText = url.searchParams.get("text");
    if (!baseText) return baseUrl;
    url.searchParams.set("text", `${baseText} [ref: ${label}]`);
    return url.toString();
  } catch {
    return baseUrl;
  }
}

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

export function getAnonymousId(): string {
  if (!isBrowser()) return "";
  const existing = readStorage(window.localStorage, ANONYMOUS_ID_KEY);
  if (existing) return existing;
  const id = createId();
  writeStorage(window.localStorage, ANONYMOUS_ID_KEY, id);
  return id;
}

function getCookie(name: string): string | undefined {
  if (!isBrowser()) return undefined;
  const prefix = `${name}=`;
  const entry = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));
  return entry ? decodeURIComponent(entry.slice(prefix.length)) : undefined;
}

type TrackOptions = {
  eventId?: string;
  sendToServer?: boolean;
};

async function sendCapiEvent(
  eventName: PixelEventName,
  eventId: string,
  params: EventParams,
): Promise<void> {
  if (!isBrowser()) return;
  const attribution = getAttribution();

  try {
    await fetch("/api/meta-capi", {
      method: "POST",
      headers: { "content-type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        eventName,
        eventId,
        eventTime: Math.floor(Date.now() / 1000),
        eventSourceUrl: window.location.href,
        actionSource: "website",
        params,
        consent: true,
        anonymousId: getAnonymousId(),
        fbp: getCookie("_fbp"),
        fbc: getCookie("_fbc"),
        attribution,
      }),
    });
  } catch {
    return;
  }
}

export function trackEvent(
  eventName: PixelEventName,
  params: EventParams = {},
  options: TrackOptions = {},
): string | null {
  if (!isBrowser() || !hasMarketingConsent()) return null;

  const eventId = options.eventId ?? createId();

  if (typeof window.fbq === "function") {
    if (STANDARD_EVENTS.has(eventName)) {
      window.fbq("track", eventName, params, { eventID: eventId });
    } else {
      window.fbq("trackCustom", eventName, params, { eventID: eventId });
    }
  }

  if (options.sendToServer !== false && CAPI_EVENTS.has(eventName)) {
    void sendCapiEvent(eventName, eventId, params);
  }

  return eventId;
}

export function trackPageView(path: string): void {
  if (!isBrowser() || !hasMarketingConsent()) return;

  const eventId = createId();
  const params: EventParams = {
    page_path: path,
    page_title: document.title,
  };

  if (typeof window.fbq === "function") {
    window.fbq("track", "PageView", params, { eventID: eventId });
  }
  void sendCapiEvent("PageView", eventId, params);

  if (path === "/") {
    const viewId = createId();
    const viewParams: EventParams = {
      content_name: "Quant Edge FX Pro",
      content_category: "XAUUSD Expert Advisor",
      content_type: "product",
    };
    if (typeof window.fbq === "function") {
      window.fbq("track", "ViewContent", viewParams, { eventID: viewId });
    }
    void sendCapiEvent("ViewContent", viewId, viewParams);
  }
}
