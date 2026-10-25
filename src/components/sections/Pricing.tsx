import { pricing } from "@/content/content";
import { WHATSAPP_ACCESS_URL } from "@/config/contact";
import { ArrowUpRight, Check } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppLink } from "@/components/ui/TrackedLink";

export function Pricing() {
  return (
    <section
      id="pricing"
      className="section relative overflow-hidden"
      aria-labelledby="pricing-title"
    >
      <div className="section-rule" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-gold/[0.035] blur-[110px]" />
      <div className="wrap">
        <SectionHeading
          tag={pricing.tag}
          title={pricing.title}
          id="pricing-title"
        />

        <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
          {pricing.plans.map((plan, index) => (
            <Reveal
              key={plan.id}
              delay={index * 0.09}
              distance={26}
              className={plan.featured ? "md:-translate-y-3" : undefined}
            >
              <article
                className={`relative h-full overflow-hidden rounded-2xl ${
                  plan.featured
                    ? "border border-gold/45 bg-panel shadow-[0_0_0_1px_rgba(255,216,77,0.08),0_32px_80px_-50px_rgba(255,216,77,0.55)]"
                    : "border border-cyan/12 bg-panel/45"
                }`}
                aria-labelledby={`plan-${plan.id}`}
              >
                {plan.featured ? (
                  <>
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
                    <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/[0.08] blur-3xl" />
                    <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-cyan/[0.04] blur-3xl" />
                  </>
                ) : null}

                <div className="relative p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="mono text-[0.54rem] tracking-[0.18em] text-dim uppercase">
                        Licence / {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3
                        id={`plan-${plan.id}`}
                        className="mt-3 font-display text-2xl font-semibold tracking-[-0.03em] text-frost"
                      >
                        {plan.name}
                      </h3>
                    </div>
                    {plan.featured ? (
                      <span className="chip border-gold/30 bg-gold/[0.06] text-gold">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                        Pro
                      </span>
                    ) : (
                      <span className="chip">Entry</span>
                    )}
                  </div>

                  <div className="mt-8 flex items-end gap-2">
                    <span
                      className={`font-display text-[3.4rem] font-semibold leading-none tracking-[-0.06em] ${
                        plan.featured ? "shimmer" : "text-frost"
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span className="mb-1.5 max-w-[8.5rem] text-[0.72rem] leading-4 text-dim">
                      one-time licence
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-[0.66rem] tracking-[0.02em] text-muted">
                    {plan.period}
                  </p>

                  <div className="my-6 h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />

                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-[0.82rem] leading-5 text-frost/85"
                      >
                        <span
                          className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
                            plan.featured
                              ? "border-gold/40 bg-gold/10 text-gold"
                              : "border-cyan/30 bg-cyan/[0.06] text-cyan"
                          }`}
                        >
                          <Check size={9} />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <WhatsAppLink
                    baseHref={WHATSAPP_ACCESS_URL}
                    eventName="InitiateCheckout"
                    eventParams={{
                      value: plan.priceValue,
                      currency: "USD",
                      content_name: plan.name,
                      content_ids: plan.id,
                      content_type: "product",
                    }}
                    className={`cta mt-8 w-full ${
                      plan.featured ? "cta-primary" : "cta-outline"
                    }`}
                  >
                    {plan.cta}
                    <ArrowUpRight size={15} />
                  </WhatsAppLink>

                  <p className="mt-3 text-center mono text-[0.5rem] tracking-[0.12em] text-muted uppercase">
                    Direct licence access
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
