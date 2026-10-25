"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, navCta } from "@/content/content";
import { WHATSAPP_ACCESS_URL } from "@/config/contact";
import { cn } from "@/lib/cn";
import { ArrowUpRight, Close, Menu } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppLink } from "@/components/ui/TrackedLink";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main section[id]"),
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    function onResize() {
      if (window.innerWidth >= 1024) setOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  function sectionHref(href: string): string {
    return pathname === "/" ? href : `/${href}`;
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-500",
        scrolled || open
          ? "border-cyan/10 bg-base shadow-[0_18px_60px_-34px_rgba(0,229,255,0.3)]"
          : "border-transparent bg-base/80",
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="wrap flex h-[76px] items-center justify-between gap-5">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="Quant Edge FX Pro home"
          onClick={() => setOpen(false)}
        >
          <Logo size={30} priority className="transition-transform duration-500 group-hover:-translate-y-0.5" />
          <span className="font-display text-[0.98rem] font-semibold tracking-[-0.02em] text-frost sm:text-[1.05rem]">
            Quant Edge FX Pro
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-5 lg:flex xl:gap-7"
        >
          {nav.map((item) => {
            const isActive = active === item.href.slice(1);
            return (
              <Link
                key={item.href}
                href={sectionHref(item.href)}
                className={cn(
                  "relative py-2 text-[0.78rem] font-medium transition-colors duration-300",
                  isActive
                    ? "text-gold"
                    : "text-muted hover:text-frost",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute inset-x-0 -bottom-0.5 h-px origin-center bg-gradient-to-r from-transparent via-gold to-transparent transition-transform duration-300",
                    isActive ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <WhatsAppLink
            baseHref={WHATSAPP_ACCESS_URL}
            eventName="Lead"
            eventParams={{ source: "header" }}
            className="cta cta-primary hidden h-10 min-h-0 px-4 text-[0.78rem] sm:inline-flex"
          >
            {navCta}
            <ArrowUpRight size={15} />
          </WhatsAppLink>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-md border border-cyan/20 bg-base/50 text-frost transition-colors hover:border-gold/50 hover:text-gold lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <Close size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-navigation"
          className="fixed inset-x-0 top-[76px] bottom-0 z-40 overflow-y-auto border-t border-cyan/10 bg-base lg:hidden"
        >
          <div className="grid-drift absolute inset-0 opacity-40" />
          <div
            ref={menuRef}
            className="wrap relative flex min-h-full flex-col justify-between py-8"
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {nav.map((item, index) => (
                <Link
                  key={item.href}
                  href={sectionHref(item.href)}
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between border-b border-cyan/10 py-5"
                >
                  <span className="flex items-baseline gap-3">
                    <span className="mono text-[0.62rem] tracking-[0.2em] text-gold/60">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-2xl font-medium tracking-[-0.03em] text-frost group-hover:text-gold">
                      {item.label}
                    </span>
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="text-cyan/60 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold"
                  />
                </Link>
              ))}
            </nav>

            <div className="mt-10">
              <WhatsAppLink
                baseHref={WHATSAPP_ACCESS_URL}
                eventName="Lead"
                eventParams={{ source: "mobile-menu" }}
                className="cta cta-primary w-full"
                onClick={() => setOpen(false)}
              >
                {navCta}
                <ArrowUpRight size={16} />
              </WhatsAppLink>
              <p className="mono mt-4 text-center text-[0.62rem] tracking-[0.18em] text-dim uppercase">
                XAUUSD / MetaTrader 5 / Automated
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
