"use client";

import { useState } from "react";
import { faq } from "@/content/content";
import { Plus } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { trackEvent } from "@/lib/analytics";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    const next = openIndex === index ? null : index;
    setOpenIndex(next);

    if (next !== null) {
      trackEvent("FAQOpen", { question: faq.items[next].question });
    }
  }

  return (
    <section
      id="faq"
      className="section relative overflow-hidden"
      aria-labelledby="faq-title"
    >
      <div className="section-rule" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-cyan/[0.025] blur-3xl" />
      <div className="wrap">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="tag">{faq.tag}</p>
              <h2 id="faq-title" className="display h2 text-frost">
                {faq.title}
              </h2>
              <div className="mt-7 flex items-center gap-3">
                <span className="h-px w-10 bg-gradient-to-r from-cyan to-transparent" />
                <span className="mono text-[0.56rem] tracking-[0.16em] text-dim uppercase">
                  {String(faq.items.length).padStart(2, "0")} questions
                </span>
              </div>
            </Reveal>
          </div>

          <div>
            {faq.items.map((item, index) => {
              const isOpen = openIndex === index;
              const panelId = `faq-panel-${index}`;
              const buttonId = `faq-button-${index}`;

              return (
                <Reveal key={item.question} delay={index * 0.035}>
                  <div className="faq-item" data-open={isOpen}>
                    <h3>
                      <button
                        type="button"
                        id={buttonId}
                        className="faq-button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => toggle(index)}
                      >
                        <span className="flex items-baseline gap-3.5 sm:gap-5">
                          <span className="mono text-[0.54rem] tracking-[0.1em] text-gold/50">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="font-display text-[0.98rem] font-medium tracking-[-0.01em] sm:text-[1.05rem]">
                            {item.question}
                          </span>
                        </span>
                        <span
                          className={`faq-icon ${isOpen ? "rotate-45 border-gold/50 text-gold" : ""}`}
                        >
                          <Plus size={13} />
                        </span>
                      </button>
                    </h3>

                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      aria-hidden={!isOpen}
                      data-open={isOpen}
                      className="faq-panel"
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-2xl pb-6 pl-8 pr-10 text-[0.87rem] leading-6 text-muted sm:pl-10">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
