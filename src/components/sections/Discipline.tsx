import { discipline } from "@/content/content";
import {
  Clock,
  Globe,
  Shield,
  StopGrid,
  Transparency,
} from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const icons = [Shield, StopGrid, Clock, Globe, Transparency];

const accents = [
  {
    icon: "text-gold",
    ring: "border-gold/25 bg-gold/[0.06]",
    line: "via-gold/35",
  },
  {
    icon: "text-cyan",
    ring: "border-cyan/25 bg-cyan/[0.06]",
    line: "via-cyan/35",
  },
  {
    icon: "text-violet",
    ring: "border-violet/25 bg-violet/[0.06]",
    line: "via-violet/35",
  },
  {
    icon: "text-lime",
    ring: "border-lime/25 bg-lime/[0.06]",
    line: "via-lime/30",
  },
  {
    icon: "text-cyan",
    ring: "border-cyan/25 bg-cyan/[0.06]",
    line: "via-cyan/35",
  },
];

const spans = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-4",
];

export function Discipline() {
  return (
    <section
      id="discipline"
      className="section relative overflow-hidden"
      aria-labelledby="discipline-title"
    >
      <div className="section-rule" />
      <div className="pointer-events-none absolute -left-32 top-24 h-80 w-80 rounded-full bg-violet/[0.035] blur-3xl" />
      <div className="wrap">
        <SectionHeading
          tag={discipline.tag}
          title={discipline.title}
          id="discipline-title"
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
          {discipline.cards.map((card, index) => {
            const Icon = icons[index] ?? Shield;
            const accent = accents[index] ?? accents[0];
            const isFeature = index === 0;

            return (
              <Reveal
                key={card.title}
                delay={Math.min(index * 0.06, 0.24)}
                className={spans[index]}
              >
                <article
                  className="spotlight glass group relative h-full overflow-hidden rounded-xl p-6 transition-transform duration-500 hover:-translate-y-1 sm:p-7"
                  aria-labelledby={`discipline-${index}`}
                >
                  <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="pointer-events-none absolute -right-8 -top-8 font-display text-[7rem] font-bold leading-none tracking-[-0.08em] text-frost/[0.018]">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="relative z-10 flex h-full flex-col">
                    <div className="flex items-center justify-between gap-4">
                      <span
                        className={`grid h-10 w-10 place-items-center rounded-lg border ${accent.ring} ${accent.icon}`}
                      >
                        <Icon size={19} />
                      </span>
                      <span className="mono text-[0.52rem] tracking-[0.16em] text-dim/60 uppercase">
                        Rule / {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3
                      id={`discipline-${index}`}
                      className={`font-display mt-6 font-semibold tracking-[-0.03em] text-frost ${
                        isFeature ? "text-2xl sm:text-[1.75rem]" : "text-xl"
                      }`}
                    >
                      {card.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-[0.88rem] leading-6 text-muted">
                      {card.body}
                    </p>

                    <div
                      className={`mt-auto pt-8`}
                    >
                      <div
                        className={`h-px bg-gradient-to-r from-transparent ${accent.line} to-transparent opacity-40 transition-opacity duration-500 group-hover:opacity-100`}
                      />
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
