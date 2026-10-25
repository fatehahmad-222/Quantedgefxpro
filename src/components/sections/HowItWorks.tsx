import { how, type Step } from "@/content/content";
import { ArrowRight } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";

function StepItem({ step, index }: { step: Step; index: number }) {
  return (
    <article className="group relative pb-11 pl-12 last:pb-0 sm:pl-14">
      <span className="timeline-node absolute left-0 top-0 z-10 grid h-6 w-6 place-items-center rounded-full border border-cyan/35 bg-base font-mono text-[0.52rem] text-cyan transition-colors duration-500 group-hover:border-gold/70 group-hover:text-gold">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative overflow-hidden rounded-lg border border-transparent bg-panel/25 px-5 py-5 transition-all duration-500 group-hover:border-cyan/15 group-hover:bg-panel/55 sm:px-6 sm:py-6">
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-cyan/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="mono mb-2 text-[0.55rem] tracking-[0.18em] text-gold/60 uppercase">
              Stage {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="font-display text-lg font-semibold tracking-[-0.025em] text-frost sm:text-xl">
              {step.title}
            </h3>
            <p className="mt-2.5 max-w-xl text-[0.88rem] leading-6 text-muted">
              {step.body}
            </p>
          </div>

          <span className="mt-1 hidden h-8 w-8 shrink-0 place-items-center rounded-full border border-cyan/15 text-cyan/50 transition-all duration-500 group-hover:border-gold/35 group-hover:text-gold sm:grid">
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </article>
  );
}

export function HowItWorks() {
  return (
    <section
      id="how"
      className="section relative overflow-hidden"
      aria-labelledby="how-title"
    >
      <div className="section-rule" />
      <div className="pointer-events-none absolute right-0 top-1/4 h-96 w-96 rounded-full bg-cyan/[0.025] blur-3xl" />
      <div className="wrap">
        <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="tag">{how.tag}</p>
              <h2
                id="how-title"
                className="display h2 max-w-[12ch] text-frost"
              >
                {how.title}
              </h2>
            </Reveal>

            <Reveal delay={0.12} className="mt-10">
              <div className="relative max-w-xs border border-cyan/10 bg-panel/35 p-4">
                <div className="absolute -left-px -top-px h-4 w-4 border-l border-t border-gold/60" />
                <div className="absolute -bottom-px -right-px h-4 w-4 border-b border-r border-cyan/50" />
                <div className="flex items-center justify-between border-b border-cyan/10 pb-3">
                  <span className="mono text-[0.55rem] tracking-[0.16em] text-dim uppercase">
                    Deployment flow
                  </span>
                  <span className="mono text-[0.5rem] tracking-[0.12em] text-up/70">
                    READY
                  </span>
                </div>
                <div className="mt-4 space-y-3.5">
                  {how.steps.map((step, index) => (
                    <div key={step.title} className="flex items-center gap-3">
                      <span className="mono text-[0.52rem] text-gold/55">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="h-px flex-1 bg-gradient-to-r from-cyan/20 to-transparent" />
                      <span className="mono text-[0.5rem] tracking-[0.1em] text-dim uppercase">
                        {index === how.steps.length - 1 ? "DONE" : "STAGE"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <div className="relative">
            <div className="timeline-track">
              <div className="timeline-fill" />
            </div>
            {how.steps.map((step, index) => (
              <StepItem key={step.title} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
