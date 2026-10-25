import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Quant Edge FX Pro handles personal information, cookies, analytics, and privacy requests.",
  alternates: canonicalUrl("/privacy")
    ? { canonical: canonicalUrl("/privacy") }
    : undefined,
  robots: { index: false, follow: true },
};

const sections = [
  {
    title: "1. Who we are",
    body: [
      "Quant Edge FX Pro is the trading software brand described on this website. The legal entity responsible for your personal information is [company legal name], with its registered address at [registered address], [jurisdiction].",
      "For privacy questions or requests, contact [privacy contact email]. Replace every bracketed placeholder on this page before publication.",
    ],
  },
  {
    title: "2. Information we collect",
    body: [
      "We collect information you choose to provide, such as your name, email address, phone number, MT5 account details, broker information, and the content of messages you send us by email or WhatsApp.",
      "When you visit the site, we may also collect technical information such as your IP address, browser type, device information, approximate location derived from IP, referring pages, and interaction data. If you request access or contact us, we keep a record of that request and its outcome.",
    ],
  },
  {
    title: "3. How we use information",
    body: [
      "We use personal information to respond to enquiries, assess access requests, provide and support the software, manage licences and refund requests, prevent fraud and misuse, maintain business records, and improve the website.",
      "Where marketing consent is required, we use your information to measure advertising and understand which campaigns lead to enquiries. We do not sell personal information.",
    ],
  },
  {
    title: "4. Cookies, pixels, and analytics",
    body: [
      "The site uses essential storage for security, preferences, and consent choices. With your marketing consent, it may also load the Meta Pixel and send server-side conversion events to Meta. These tools can set cookies and receive event data such as page views, contact actions, checkout intent, and limited attribution parameters.",
      "You can accept, reject, or later change marketing consent using the cookie settings control in the footer. Rejecting marketing cookies does not prevent you from using the site or contacting us.",
    ],
  },
  {
    title: "5. Sharing and processors",
    body: [
      "We may share information with service providers that help us operate the website, hosting, email, messaging, advertising measurement, analytics, security, and customer support. These providers process information on our instructions and under their own contractual and legal obligations.",
      "We may also disclose information where required by law, to protect legal rights, to investigate fraud or abuse, or as part of a business transfer. WhatsApp and Meta process information under their own terms and privacy policies when you use those services.",
    ],
  },
  {
    title: "6. International transfers",
    body: [
      "Our providers may process information in countries other than yours. Where required, we use appropriate safeguards for international transfers, such as standard contractual clauses. The specific transfer mechanism should be confirmed with counsel for your operating jurisdiction.",
    ],
  },
  {
    title: "7. Retention",
    body: [
      "We retain information only for as long as reasonably necessary for the purposes described above, including to provide services, resolve disputes, enforce agreements, meet tax and accounting obligations, and maintain security records. Retention periods vary by the type of information and the legal context.",
    ],
  },
  {
    title: "8. Your rights",
    body: [
      "Depending on your location, you may have the right to access, correct, delete, restrict, or object to the processing of your personal information, to withdraw consent, and to request a portable copy of certain data. You may also have the right to complain to a local data protection authority.",
      "Send requests to [privacy contact email]. We may need to verify your identity before acting on a request. These rights are not absolute and may be limited by applicable law.",
    ],
  },
  {
    title: "9. Security",
    body: [
      "We use reasonable technical and organisational measures intended to protect personal information. No method of transmission or storage is completely secure, so we cannot guarantee absolute security. Avoid sending passwords, broker credentials, or other highly sensitive information through email or WhatsApp.",
    ],
  },
  {
    title: "10. Children",
    body: [
      "The website and software are intended for adults who can enter into a binding contract. They are not directed to children, and we do not knowingly collect personal information from children. Contact us if you believe a child has provided personal information.",
    ],
  },
  {
    title: "11. Changes to this policy",
    body: [
      "We may update this policy to reflect changes in our practices, technology, or legal requirements. The revised version will be posted on this page with a new effective date. Material changes may also be communicated through the website or by email where appropriate.",
    ],
  },
  {
    title: "12. Contact",
    body: [
      "Privacy questions and requests: [privacy contact email]. General sales enquiries: sales@quantedgefxpro.com. Support: support@quantedgefxpro.com.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="relative pb-24 pt-32 sm:pt-40">
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan/[0.04] blur-3xl" />
      <div className="wrap">
        <article className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="mono text-[0.58rem] tracking-[0.16em] text-dim uppercase transition-colors hover:text-cyan"
          >
            ← Back to home
          </Link>

          <div className="mt-8 border-l-2 border-gold/70 bg-gold/[0.045] px-4 py-3.5">
            <p className="mono text-[0.54rem] leading-5 tracking-[0.08em] text-gold/90 uppercase">
              Template notice — not legal advice. This policy must be reviewed
              and completed by a qualified privacy professional before
              publication.
            </p>
          </div>

          <h1 className="display mt-8 text-[2.4rem] leading-[1.05] text-frost sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mono mt-4 text-[0.58rem] tracking-[0.14em] text-dim uppercase">
            Draft / October 2026
          </p>
          <p className="mt-6 text-[0.95rem] leading-7 text-muted">
            This policy explains how Quant Edge FX Pro collects, uses, shares,
            and protects personal information when you visit this website,
            contact us, or request access to the software.
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
