import { guarantee } from "@/content/content";
import { SectionViewTracker } from "@/components/analytics/SectionViewTracker";
import { Shield } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

function GuaranteeCheck() {
  return (
    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/[0.07] text-gold">
      <svg
        width="13"
        height="13"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3.2 8.3 6.5 11.5 12.9 4.7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function Guarantee() {
  return (
    <section
      id="guarantee"
      className="section relative overflow-hidden"
      aria-labelledby="guarantee-title"
    >
      <SectionViewTracker
        eventName="GuaranteeViewed"
        params={{ section: "guarantee" }}
      />
      <div className="section-rule" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.035] blur-[100px]" />
      <div className="wrap">
        <SectionHeading
          tag={guarantee.tag}
          title={guarantee.title}
          id="guarantee-title"
        />

        <div className="grid items-start gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
          <div>
            <Reveal>
              <p className="max-w-xl text-[0.98rem] leading-7 text-muted">
                {guarantee.lead}
              </p>
            </Reveal>

            <ul className="mt-8 space-y-4">
              {guarantee.bullets.map((bullet, index) => (
                <Reveal
                  as="li"
                  key={bullet}
                  delay={0.05 + index * 0.06}
                  distance={14}
                  className="group flex items-start gap-3 border-b border-cyan/10 pb-4 text-[0.9rem] leading-6 text-frost/90 last:border-0 last:pb-0"
                >
                  <GuaranteeCheck />
                  <span>{bullet}</span>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.18} className="mt-9">
              <div className="flex items-center gap-3 border-l-2 border-gold/60 bg-gradient-to-r from-gold/[0.055] to-transparent px-4 py-3">
                <Shield size={17} className="shrink-0 text-gold" />
                <p className="text-[0.78rem] leading-5 text-muted">
                  Refund covers the licence fee only — not trading losses.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} distance={26}>
            <div className="rotate-border rounded-2xl">
              <div className="relative overflow-hidden rounded-2xl bg-panel p-6 sm:p-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,216,77,0.1),transparent_48%)]" />
                <div className="noise absolute inset-0" />

                <div className="relative mx-auto grid h-32 w-32 place-items-center sm:h-36 sm:w-36">
                  <div className="absolute inset-0 animate-[spin_22s_linear_infinite] rounded-full border border-dashed border-gold/30" />
                  <div className="absolute inset-3 rounded-full border border-cyan/20" />
                  <div className="absolute inset-6 rounded-full bg-gold/[0.06] shadow-[0_0_40px_rgba(255,216,77,0.12)_inset]" />
                  <div className="relative text-center">
                    <p className="font-display text-3xl font-semibold tracking-[-0.04em] text-gold">
                      5%
                    </p>
                    <p className="mono mt-1 text-[0.46rem] tracking-[0.15em] text-muted uppercase">
                      Per-trade
                    </p>
                    <p className="mono text-[0.46rem] tracking-[0.15em] text-dim uppercase">
                      Risk setting
                    </p>
                  </div>
                  <span className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-cyan shadow-[0_0_12px_rgba(0,229,255,0.8)]" />
                  <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_12px_rgba(255,216,77,0.8)]" />
                </div>

                <div className="relative mt-7 text-center">
                  <p className="mono text-[0.56rem] tracking-[0.18em] text-cyan/70 uppercase">
                    Protection protocol
                  </p>
                  <h3 className="font-display mt-2 text-xl font-semibold tracking-[-0.03em] text-frost sm:text-2xl">
                    {guarantee.panelTitle}
                  </h3>
                </div>

                <div className="relative mt-6 space-y-4 border-t border-gold/15 pt-6">
                  {guarantee.panelParagraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-[0.82rem] leading-6 text-muted"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="relative mt-6 flex items-center justify-between gap-3 border-t border-cyan/10 pt-4">
                  <span className="mono text-[0.5rem] tracking-[0.14em] text-dim uppercase">
                    Licence fee / refundable
                  </span>
                  <span className="flex items-center gap-1.5 mono text-[0.5rem] tracking-[0.14em] text-up uppercase">
                    <span className="h-1.5 w-1.5 rounded-full bg-up" />
                    Active policy
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
