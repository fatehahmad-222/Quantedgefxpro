"use client";

import type { ComponentPropsWithoutRef, MouseEvent } from "react";
import {
  buildWhatsAppUrl,
  trackEvent,
  type EventParams,
  type PixelEventName,
} from "@/lib/analytics";

type TrackedLinkProps = ComponentPropsWithoutRef<"a"> & {
  eventName?: PixelEventName;
  eventParams?: EventParams;
};

export function TrackedLink({
  eventName,
  eventParams,
  onClick,
  children,
  ...props
}: TrackedLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (!event.defaultPrevented && eventName) {
      trackEvent(eventName, eventParams);
    }
  }

  return (
    <a {...props} onClick={handleClick}>
      {children}
    </a>
  );
}

type WhatsAppLinkProps = Omit<TrackedLinkProps, "href"> & {
  baseHref: string;
};

export function WhatsAppLink({
  baseHref,
  target = "_blank",
  rel = "noopener",
  onClick,
  ...props
}: WhatsAppLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.currentTarget.href = buildWhatsAppUrl(baseHref);
    onClick?.(event);
  }

  return (
    <TrackedLink
      {...props}
      href={baseHref}
      target={target}
      rel={rel}
      onClick={handleClick}
    />
  );
}
