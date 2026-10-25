import Link from "next/link";
import { footer, hero, site } from "@/content/content";
import {
  SALES_EMAIL,
  SALES_MAILTO,
  SUPPORT_EMAIL,
  SUPPORT_MAILTO,
  WHATSAPP_FOOTER_URL,
  PHONE_DISPLAY,
  PHONE_HREF,
} from "@/config/contact";
import { CookieSettingsButton } from "@/components/analytics/CookieSettingsButton";
import { Mail, Phone, WhatsApp } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { TrackedLink, WhatsAppLink } from "@/components/ui/TrackedLink";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-cyan/10 bg-elevated/40">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/45 to-transparent" />
      <div className="grid-drift absolute inset-0 opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
      <div className="absolute -right-32 top-0 h-80 w-80 rounded-full bg-cyan/[0.04] blur-3xl" />

      <div className="wrap relative py-14 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3"
              aria-label="Quant Edge FX Pro home"
            >
              <Logo size={38} />
              <span className="font-display text-lg font-semibold tracking-[-0.03em] text-frost">
                {site.brand}
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-6 text-muted">
              {hero.kicker}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {hero.chips.map((chip) => (
                <span key={chip} className="chip">
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-7 sm:grid-cols-3">
            <div>
              <p className="mono mb-2 text-[0.6rem] tracking-[0.18em] text-dim uppercase">
                {footer.contactLabels.sales}
              </p>
              <TrackedLink
                href={SALES_MAILTO}
                eventName="Contact"
                eventParams={{ method: "email", team: "sales" }}
                className="inline-flex items-start gap-2 break-all text-sm text-frost transition-colors hover:text-cyan"
              >
                <Mail size={15} className="mt-1 shrink-0 text-gold/70" />
                {SALES_EMAIL}
              </TrackedLink>
            </div>

            <div>
              <p className="mono mb-2 text-[0.6rem] tracking-[0.18em] text-dim uppercase">
                {footer.contactLabels.support}
              </p>
              <TrackedLink
                href={SUPPORT_MAILTO}
                eventName="Contact"
                eventParams={{ method: "email", team: "support" }}
                className="inline-flex items-start gap-2 break-all text-sm text-frost transition-colors hover:text-cyan"
              >
                <Mail size={15} className="mt-1 shrink-0 text-cyan/70" />
                {SUPPORT_EMAIL}
              </TrackedLink>
            </div>

            <div>
              <p className="mono mb-2 text-[0.6rem] tracking-[0.18em] text-dim uppercase">
                {footer.contactLabels.phone}
              </p>
              <div className="flex flex-col gap-2">
                <TrackedLink
                  href={PHONE_HREF}
                  eventName="Contact"
                  eventParams={{ method: "phone" }}
                  className="inline-flex items-center gap-2 text-sm text-frost transition-colors hover:text-cyan"
                >
                  <Phone size={15} className="shrink-0 text-gold/70" />
                  {PHONE_DISPLAY}
                </TrackedLink>
                <WhatsAppLink
                  baseHref={WHATSAPP_FOOTER_URL}
                  eventName="Contact"
                  eventParams={{ method: "whatsapp", source: "footer" }}
                  className="inline-flex w-fit items-center gap-2 text-[0.78rem] text-up/80 transition-colors hover:text-up"
                >
                  <WhatsApp size={14} />
                  WhatsApp
                </WhatsAppLink>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-cyan/10 pt-8">
          <p className="max-w-5xl text-[0.72rem] leading-6 text-dim">
            {footer.riskDisclosure}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-6 border-t border-cyan/10 pt-7 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.75rem] text-muted">
            {footer.links.map((link) => (
              <Link
                key={link.href}
                href={`/${link.href}`}
                className="transition-colors hover:text-cyan"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/privacy"
              className="transition-colors hover:text-cyan"
            >
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-cyan">
              Terms
            </Link>
            <CookieSettingsButton />
          </div>
          <p className="mono text-[0.68rem] tracking-[0.06em] text-dim">
            {footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
