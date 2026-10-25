import type { Metadata } from "next";
import Link from "next/link";
import { guarantee } from "@/content/content";
import { canonicalUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern access to and use of the Quant Edge FX Pro website and software.",
  alternates: canonicalUrl("/terms")
    ? { canonical: canonicalUrl("/terms") }
    : undefined,
  robots: { index: false, follow: true },
};

const sections = [
  {
    title: "1. Agreement",
    body: [
      "These terms govern your access to the Quant Edge FX Pro website and your use of the Quant Edge FX Pro software and related services. By using the site, requesting access, purchasing a licence, or installing the software, you agree to these terms.",
      "The contracting party is [company legal name], registered at [registered address], [jurisdiction]. Replace every bracketed placeholder on this page before publication.",
    ],
  },
  {
    title: "2. Licence",
    body: [
      "Subject to payment of the applicable fee and compliance with these terms, we grant you a limited, non-exclusive, non-transferable, revocable licence to install and use the software on the number of MT5 accounts covered by your plan for your own trading.",
      "The Starter licence covers one MT5 account. The Pro licence covers up to three MT5 accounts. You may not share, sublicense, resell, rent, or provide access to the software to another person or entity.",
    ],
  },
  {
    title: "3. No financial advice",
    body: [
      "Quant Edge FX Pro is software, not a broker, dealer, investment adviser, portfolio manager, or fiduciary. Nothing on this website or in the software is personalised financial, investment, tax, or legal advice, or a recommendation to buy or sell any instrument.",
      "You are responsible for deciding whether the software is appropriate for your circumstances and for seeking independent professional advice where needed.",
    ],
  },
  {
    title: "4. Trading risk",
    body: [
      "Trading gold, forex, and other leveraged instruments carries a high level of risk and may not be suitable for all investors. You can lose more than your initial deposit with some brokers. Past performance, backtests, sample figures, and any performance layouts on this site are not indicative of future results.",
      "The software does not guarantee profits or specific outcomes. You are responsible for your account, broker relationship, risk settings, capital, and any manual intervention you choose to make.",
    ],
  },
  {
    title: "5. Refund guarantee",
    body: [
      ...guarantee.panelParagraphs,
      "Refund requests must be submitted with the information reasonably required to verify the account, settings, and circumstances. The guarantee does not apply where these conditions are not met, and it does not cover trading losses, broker losses, chargebacks, or third-party costs.",
    ],
  },
  {
    title: "6. Permitted use",
    body: [
      "You must use the software only in compliance with applicable law, your broker's terms, and the rules of any market or platform you access. You must not reverse engineer, decompile, modify, circumvent licensing controls, distribute malware, interfere with the site, or use the software to commit fraud or manipulate any market.",
      "You must keep your licence credentials, devices, and MT5 accounts secure and notify us promptly of unauthorised access or use.",
    ],
  },
  {
    title: "7. Broker and execution",
    body: [
      "The software operates through MetaTrader 5 and depends on your broker, terminal, internet connection, liquidity, spreads, slippage, execution rules, and platform availability. We do not control those systems and are not responsible for orders that are delayed, rejected, requoted, partially filled, or affected by market gaps.",
      "Any broker compatibility statement describes technical compatibility, not an endorsement, partnership, or guarantee of trading outcomes.",
    ],
  },
  {
    title: "8. Intellectual property",
    body: [
      "The software, website, brand, design, text, graphics, and related materials are owned by us or our licensors and are protected by intellectual property laws. These terms do not transfer ownership. You receive only the limited licence described above.",
    ],
  },
  {
    title: "9. Disclaimers",
    body: [
      "To the maximum extent permitted by law, the website and software are provided \"as is\" and \"as available\" without warranties of any kind, whether express, implied, or statutory, including warranties of merchantability, fitness for a particular purpose, title, non-infringement, accuracy, or uninterrupted availability.",
      "We do not warrant that the software will be error-free, secure, compatible with every broker configuration, or available without interruption. Some jurisdictions do not allow certain warranty exclusions, so parts of this section may not apply to you.",
    ],
  },
  {
    title: "10. Limitation of liability",
    body: [
      "To the maximum extent permitted by law, we will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for lost profits, lost trading capital, loss of data, business interruption, or loss of opportunity, however arising and whether or not we were advised of the possibility.",
      "Our total aggregate liability arising out of or relating to the software or these terms will not exceed the licence fee you paid to us for the software in the twelve months before the event giving rise to the claim. Nothing in these terms excludes liability that cannot lawfully be excluded.",
    ],
  },
  {
    title: "11. Indemnity",
    body: [
      "To the extent permitted by law, you agree to indemnify and hold us harmless from claims, losses, liabilities, damages, and reasonable costs arising from your breach of these terms, your misuse of the software, your trading activity, or your violation of any law or third-party right.",
    ],
  },
  {
    title: "12. Termination",
    body: [
      "We may suspend or terminate your licence if you breach these terms, fail to pay applicable fees, misuse the software, or create risk for us or others. On termination, you must stop using the software and remove it from your systems. Sections that by their nature should survive termination will continue to apply.",
    ],
  },
  {
    title: "13. Governing law",
    body: [
      "These terms are governed by the laws of [governing law jurisdiction], without regard to conflict-of-law rules. Disputes will be subject to the exclusive jurisdiction of the courts of [venue], except where mandatory consumer law provides otherwise.",
    ],
  },
  {
    title: "14. Changes",
    body: [
      "We may update these terms from time to time. The revised version will be posted on this page with a new effective date. Continued use of the software after the effective date means you accept the revised terms to the extent permitted by law.",
    ],
  },
  {
    title: "15. Contact",
    body: [
      "Questions about these terms: sales@quantedgefxpro.com. Support: support@quantedgefxpro.com.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="relative pb-24 pt-32 sm:pt-40">
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-gold/[0.035] blur-3xl" />
      <div className="wrap">
        <article className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="mono text-[0.58rem] tracking-[0.16em] text-dim uppercase transition-colors hover:text-gold"
          >
            ← Back to home
          </Link>

          <div className="mt-8 border-l-2 border-gold/70 bg-gold/[0.045] px-4 py-3.5">
            <p className="mono text-[0.54rem] leading-5 tracking-[0.08em] text-gold/90 uppercase">
              Template notice — not legal advice. These terms must be reviewed,
              completed, and approved by a qualified lawyer before publication.
            </p>
          </div>

          <h1 className="display mt-8 text-[2.4rem] leading-[1.05] text-frost sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mono mt-4 text-[0.58rem] tracking-[0.14em] text-dim uppercase">
            Draft / October 2026
          </p>
          <p className="mt-6 text-[0.95rem] leading-7 text-muted">
            These terms set out the conditions for using the Quant Edge FX Pro
            website, requesting a licence, and operating the software on your
            MT5 account.
          </p>

          <div className="mt-12 space-y-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-frost">
                  {section.title}
                </h2>
                <div className="mt-3 space-y-3">
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-[0.88rem] leading-7 text-muted"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-14 border-t border-cyan/10 pt-6">
            <p className="text-[0.76rem] leading-6 text-dim">
              This page is intentionally marked{" "}
              <span className="mono text-gold/80">noindex</span> until the
              template is reviewed, completed, and approved for publication.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
