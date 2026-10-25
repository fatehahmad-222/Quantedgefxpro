import { hero } from "@/content/content";
import { WHATSAPP_ACCESS_URL } from "@/config/contact";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import { WhatsAppLink } from "@/components/ui/TrackedLink";
import { HeroBackdrop } from "./HeroBackdrop";
import { HeroChart } from "./HeroChart";

const titleLines = [
  "Gold moves fast.",
  "Your trading system",
  "should move faster.",
];

export function Hero() {
  return (
    <section
      className="relative isolate overflow-hidden pb-16 pt-12 sm:pt-16 lg:pb-24 lg:pt-20"
      aria-labelledby="hero-title"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <HeroBackdrop />
        <div className="absolute left-1/2 top-0 h-[38rem] w-[38rem] -translate-x-1/2 bg-[radial-gradient(circle,rgba(0,229,255,0.09),transparent_68%)]" />
        <div className="absolute -right-24 top-1/3 h-[26rem] w-[26rem] bg-[radial-gradient(circle,rgba(255,216,77,0.07),transparent_68%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan/15 to-transparent" />
        <div className="absolute left-0 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-cyan/10 to-transparent lg:block" />
        <div className="absolute right-0 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-gold/10 to-transparent lg:block" />
        <span className="pointer-events-none absolute -bottom-8 left-1/2 hidden -translate-x-1/2 select-none font-display text-[13vw] font-bold tracking-[-0.08em] text-frost/[0.018] lg:block">
          QEFX
        </span>
      </div>

      <div className="wrap">
        <div className="grid items-center gap-14 lg:min-h-[calc(100svh-11rem)] lg:grid-cols-[1.04fr_0.96fr] lg:gap-12 xl:gap-16">
          <div className="relative z-10">
            <div>
              <p className="mb-5 flex items-center gap-3 font-mono text-[0.66rem] font-medium tracking-[0.16em] text-gold uppercase sm:text-[0.7rem]">
                <span className="h-px w-8 bg-gradient-to-r from-cyan to-gold shadow-[0_0_10px_rgba(0,229,255,0.65)]" />
                {hero.kicker}
              </p>
            </div>

            <h1 id="hero-title" className="display hero-title text-frost">
              {titleLines.map((line, index) => (
                <span
                  key={line}
                  className="hero-word block overflow-hidden pb-[0.1em]"
                >
                  <span
                    className={`inline-block ${
                      index === 2 ? "neon-text" : ""
                    }`}
                  >
                    {line}
                    {index < titleLines.length - 1 ? " " : ""}
                  </span>
                </span>
              ))}
            </h1>

            <p className="mt-6 max-w-[35rem] text-[0.98rem] leading-7 text-muted sm:text-[1.04rem] sm:leading-8">
              {hero.lead}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <WhatsAppLink
                baseHref={WHATSAPP_ACCESS_URL}
                eventName="Lead"
                eventParams={{ source: "hero" }}
                className="cta cta-primary w-full sm:w-auto"
              >
                {hero.primaryCta}
                <ArrowUpRight size={16} />
              </WhatsAppLink>
              <a
                href={hero.secondaryHref}
                className="cta cta-outline w-full sm:w-auto"
              >
                {hero.secondaryCta}
                <ArrowRight size={16} />
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
              {hero.chips.map((chip, index) => (
                <span key={chip} className="flex items-center gap-4">
                  <span className="mono text-[0.62rem] tracking-[0.18em] text-dim uppercase">
                    {chip}
                  </span>
                  {index < hero.chips.length - 1 ? (
                    <span className="h-1 w-1 rounded-full bg-cyan/40" />
                  ) : null}
                </span>
              ))}
            </div>
          </div>

          <div className="hero-panel relative mx-auto w-full max-w-[560px] lg:max-w-none">
            <div className="absolute -inset-5 -z-10 rounded-[1.4rem] bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.07),transparent_72%)]" />
            <div className="hero-panel-inner relative">
              <div className="glass hud-corners relative overflow-hidden rounded-xl p-3 sm:p-4">
                <div className="flex items-start justify-between gap-5 border-b border-cyan/10 px-1.5 pb-4 pt-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="mono text-[0.74rem] font-medium tracking-[0.16em] text-frost">
                      {hero.ticker.pair}
                    </span>
                    <span className="chip border-gold/20 text-[0.5rem] text-gold/90">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_10px_rgba(255,216,77,0.8)]" />
                      {hero.illustrative}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-[1.75rem] font-semibold leading-none tracking-[-0.04em] text-frost tabular-nums sm:text-[2.1rem]">
                      {hero.ticker.price}
                    </p>
                    <p className="mono mt-2 text-[0.56rem] tracking-[0.08em] text-dim uppercase">
                      {hero.ticker.status}
                    </p>
                  </div>
                </div>

                <HeroChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
