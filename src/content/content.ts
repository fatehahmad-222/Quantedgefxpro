export type NavItem = {
  label: string;
  href: string;
};

export type Step = {
  title: string;
  body: string;
};

export type DisciplineCard = {
  title: string;
  body: string;
  wide: boolean;
};

export type PerformanceStat = {
  value: string;
  label: string;
};

export type Plan = {
  id: "starter" | "pro";
  name: string;
  price: string;
  priceValue: number;
  period: string;
  features: string[];
  cta: string;
  featured: boolean;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const site = {
  title: "Quant Edge FX Pro — Automated XAUUSD Trading",
  brand: "Quant Edge FX Pro",
  description:
    "Quant Edge FX Pro runs a fully automated Expert Advisor built for one market — XAUUSD. It reads price action, manages risk within limits you set, and executes around the clock, so a missed session never costs you the setup.",
  metaDescription:
    "Quant Edge FX Pro is a fully automated XAUUSD Expert Advisor for MetaTrader 5, with defined risk controls and 24/5 execution.",
} as const;

export const nav: NavItem[] = [
  { label: "How it works", href: "#how" },
  { label: "Discipline", href: "#discipline" },
  { label: "Guarantee", href: "#guarantee" },
  { label: "Performance", href: "#performance" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export const navCta = "Request access";

export const hero = {
  kicker: "An XAUUSD Expert Advisor for MetaTrader 5",
  title: "Gold moves fast. Your trading system should move faster.",
  lead: "Quant Edge FX Pro runs a fully automated Expert Advisor built for one market — XAUUSD. It reads price action, manages risk within limits you set, and executes around the clock, so a missed session never costs you the setup.",
  primaryCta: "Request early access",
  secondaryCta: "See how it works",
  secondaryHref: "#how",
  ticker: {
    pair: "XAUUSD",
    price: "4,400.00",
    status: "Spot, indicative",
  },
  captionLeft: "XAUUSD spot, as of Sep 2026",
  captionRight: "Updated periodically",
  chartAlt: "Sample XAUUSD candlestick chart",
  illustrative: "Illustrative",
  chips: ["MT5", "XAUUSD", "EA"],
} as const;

export const strip: Array<{ label: string; value: string }> = [
  { label: "Market focus", value: "XAUUSD only" },
  { label: "Coverage", value: "24/5 automated" },
  { label: "Position sizing", value: "Fixed & adjustable — no martingale" },
  { label: "Trade frequency", value: "~2–3 trades / day" },
];

export const how = {
  tag: "How it works",
  title: "From install to your first automated trade",
  steps: [
    {
      title: "Connect your MT5 account",
      body: "Install Quant Edge FX Pro on your MetaTrader 5 terminal and link it to a supported broker. No coding or manual configuration files required.",
    },
    {
      title: "Set your risk profile",
      body: "Choose position sizing and a maximum drawdown limit before a single trade goes live. Every setting is visible and adjustable.",
    },
    {
      title: "The engine trades XAUUSD",
      body: "Quant Edge FX Pro reads volatility and session behaviour on gold, then places and manages entries and exits without needing you at the screen.",
    },
    {
      title: "Review and adjust anytime",
      body: "Check the trade log, review performance, and change your risk settings whenever your situation or market conditions change.",
    },
  ] satisfies Step[],
} as const;

export const discipline = {
  tag: "Discipline, built in",
  title: "The rules don't bend when the market gets loud",
  cards: [
    {
      title: "No martingale sizing",
      body: "Losses aren't chased with larger position sizes. Every trade is sized from your risk profile, not from the outcome of the last one — the mechanism most EAs use to look good in a backtest and fail live.",
      wide: true,
    },
    {
      title: "Defined stop-loss",
      body: "Every position opens with a stop-loss attached — never a trade running unprotected.",
      wide: false,
    },
    {
      title: "Session & news filters",
      body: "Trading pauses around high-impact releases and thin-liquidity windows where slippage typically spikes.",
      wide: false,
    },
    {
      title: "No broker restriction",
      body: "Runs on any MT5-enabled broker — there's no approved list and nothing to switch.",
      wide: false,
    },
    {
      title: "Full trade transparency",
      body: "Every entry, exit, and adjustment is logged and exportable, so you can audit exactly what the system did and why — not just the headline result.",
      wide: true,
    },
  ] satisfies DisciplineCard[],
} as const;

export const guarantee = {
  tag: "The guarantee",
  title: "If our own settings blow your account, we refund the licence",
  lead: "Grid and martingale bots blow accounts because they multiply position size after a loss until one losing streak wipes the balance. Quant Edge FX Pro doesn't work that way.",
  bullets: [
    "Takes roughly 2–3 trades a day, not dozens",
    "Never opens a new position while one is already open",
    "No lot-size multiplication after a loss — sizing stays fixed to your risk setting",
    "Runs 24 hours a day, 5 days a week, without a human at the screen",
  ],
  panelTitle: "Licence-fee refund guarantee",
  panelParagraphs: [
    "If your account is blown while running Quant Edge FX Pro on our recommended 5% per-trade risk setting, on a supported MT5 broker, without manual interference or overridden lot sizing, we refund your licence fee.",
    "This covers the cost of the software — it isn't compensation for trading losses. Trading gold on margin still carries risk; see the disclosure below.",
  ],
} as const;

export const performance = {
  tag: "Performance",
  title: "Results, shown plainly",
  note: "Sample layout — replace with verified backtest & live account statistics before launch",
  chartAlt: "Sample equity curve",
  stats: [
    { value: "—", label: "Net return (sample period)" },
    { value: "—", label: "Max drawdown" },
    { value: "—", label: "Win rate" },
    { value: "—", label: "Avg. trades / week" },
  ] satisfies PerformanceStat[],
} as const;

export const pricing = {
  tag: "Pricing",
  title: "One licence, sized to how many accounts you run",
  plans: [
    {
      id: "starter",
      name: "Starter",
      price: "$149",
      priceValue: 149,
      period: "one-time licence · 1 MT5 account",
      features: [
        "Run on a single MT5 account",
        "Standard risk presets",
        "Licence-fee refund guarantee",
        "Email support",
      ],
      cta: "Talk to sales",
      featured: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: "$349",
      priceValue: 349,
      period: "one-time licence · up to 3 MT5 accounts",
      features: [
        "Run on up to 3 MT5 accounts",
        "Custom risk profiles",
        "Licence-fee refund guarantee",
        "Priority support",
        "Trade log export",
      ],
      cta: "Request access",
      featured: true,
    },
  ] satisfies Plan[],
} as const;

export const faq = {
  tag: "FAQ",
  title: "Before you ask",
  items: [
    {
      question: "Is this guaranteed to make money?",
      answer:
        "No. Trading gold on margin carries real risk, and Quant Edge FX Pro does not guarantee profits or specific results. It's a tool for executing a defined strategy with discipline, not a promise of returns.",
    },
    {
      question: "What broker and account do I need?",
      answer:
        "Any MT5 account. There's no restriction on which broker you use — Quant Edge FX Pro runs on any MT5-enabled broker.",
    },
    {
      question: "What does the account guarantee actually cover?",
      answer:
        "If your account is blown while running our recommended 5% per-trade risk setting, on a supported broker, without manual changes to lot sizing, we refund your licence fee. It covers the cost of the software, not trading losses.",
    },
    {
      question: "Can I test it on a demo account first?",
      answer:
        "Yes — we recommend running any EA on a demo account before committing real funds, and Quant Edge FX Pro works the same way on demo and live accounts.",
    },
    {
      question: "What markets does it trade?",
      answer:
        "XAUUSD (gold) only. The engine is built specifically around gold's volatility and session behaviour rather than adapted from a generic multi-pair system.",
    },
  ] satisfies FaqItem[],
} as const;

export const footer = {
  contactLabels: {
    sales: "Sales",
    support: "Support",
    phone: "Phone & WhatsApp",
  },
  riskDisclosure:
    "Risk disclosure: Trading gold, forex, and other leveraged instruments carries a high level of risk and may not be suitable for all investors. Past performance, including any figures shown on this page, is not indicative of future results. Quant Edge FX Pro does not guarantee profits and is not a licensed financial adviser. Only trade with capital you can afford to lose.",
  links: [
    { label: "How it works", href: "#how" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
    { label: "Guarantee", href: "#guarantee" },
  ],
  copyright: "© 2026 Quant Edge FX Pro",
} as const;
