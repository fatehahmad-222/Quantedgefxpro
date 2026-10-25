import { readFile } from "node:fs/promises";
import path from "node:path";
import * as cheerio from "cheerio";
import sharp from "sharp";
import {
  discipline,
  faq,
  footer,
  guarantee,
  hero,
  how,
  nav,
  navCta,
  performance,
  pricing,
  site,
  strip,
} from "../src/content/content";
import {
  PHONE_DISPLAY,
  PHONE_TEL,
  SALES_EMAIL,
  SUPPORT_EMAIL,
  WHATSAPP_ACCESS_URL,
  WHATSAPP_FOOTER_URL,
} from "../src/config/contact";

const root = process.cwd();
const failures: string[] = [];
const passes: string[] = [];

function check(condition: boolean, label: string, detail?: string) {
  if (condition) {
    passes.push(label);
  } else {
    failures.push(detail ? `${label}: ${detail}` : label);
  }
}

function normalize(value: string) {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function collectCopy(value: unknown, key = "", output: string[]) {
  const skipKeys = new Set([
    "id",
    "href",
    "secondaryHref",
    "chartAlt",
    "metaDescription",
    "illustrative",
    "priceValue",
    "featured",
    "wide",
  ]);

  if (skipKeys.has(key)) return;

  if (typeof value === "string") {
    if (value.trim().length > 1) output.push(value);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectCopy(item, key, output));
    return;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([childKey, childValue]) => {
      collectCopy(childValue, childKey, output);
    });
  }
}

async function main() {
  const referenceHtml = await readFile(
    path.join(root, "reference", "original.html"),
    "utf8",
  );
  const $ = cheerio.load(referenceHtml);
  const referenceText = normalize(
    `${$("title").text()} ${$("body").text()}`,
  );

  const copy: string[] = [];
  collectCopy(
    {
      site,
      nav,
      navCta,
      hero,
      strip,
      how,
      discipline,
      guarantee,
      performance,
      pricing,
      faq,
      footer,
    },
    "",
    copy,
  );

  const uniqueCopy = [...new Set(copy)];
  const missing = uniqueCopy.filter(
    (value) => !referenceText.includes(normalize(value)),
  );
  check(
    missing.length === 0,
    "Content copy matches the reference source",
    missing.map((value) => JSON.stringify(value)).join("\n  "),
  );

  const accessLinks = $(`a[href="${WHATSAPP_ACCESS_URL}"]`).length;
  const footerLinks = $(`a[href="${WHATSAPP_FOOTER_URL}"]`).length;
  check(
    accessLinks === 4,
    "Primary WhatsApp link appears four times in the reference",
    `found ${accessLinks}`,
  );
  check(
    footerLinks === 1,
    "Footer WhatsApp link appears once in the reference",
    `found ${footerLinks}`,
  );

  check(
    $(`a[href="mailto:${SALES_EMAIL}"]`).length >= 1,
    "Sales email is present in the reference",
  );
  check(
    $(`a[href="mailto:${SUPPORT_EMAIL}"]`).length >= 1,
    "Support email is present in the reference",
  );
  check(
    $(`a[href="tel:${PHONE_TEL}"]`).length >= 1,
    "Phone link is present in the reference",
  );
  check(
    referenceText.includes(normalize(PHONE_DISPLAY)),
    "Phone display value is present in the reference",
  );

  check(nav.length === 6, "Navigation has six links", `found ${nav.length}`);
  check(how.steps.length === 4, "How-it-works has four steps");
  check(discipline.cards.length === 5, "Discipline has five cards");
  check(guarantee.bullets.length === 4, "Guarantee has four bullets");
  check(performance.stats.length === 4, "Performance has four metrics");
  check(
    performance.stats.every((stat) => stat.value === "—"),
    "Performance metrics retain the four em-dash placeholders",
  );
  check(
    performance.note.includes("Sample layout"),
    "Performance sample-layout notice is present",
  );
  check(pricing.plans.length === 2, "Pricing has two plans");
  check(
    pricing.plans.some((plan) => plan.price === "$149"),
    "Starter price is $149",
  );
  check(
    pricing.plans.some((plan) => plan.price === "$349"),
    "Pro price is $349",
  );
  check(faq.items.length === 5, "FAQ has five questions");

  const pageSource = await readFile(
    path.join(root, "src", "app", "page.tsx"),
    "utf8",
  );
  const sectionOrder = [
    "<Hero />",
    "<Strip />",
    "<HowItWorks />",
    "<Discipline />",
    "<Guarantee />",
    "<Performance />",
    "<Pricing />",
    "<FAQ />",
  ];

  let previousIndex = -1;
  const orderOk = sectionOrder.every((marker) => {
    const index = pageSource.indexOf(marker);
    if (index <= previousIndex) return false;
    previousIndex = index;
    return true;
  });
  check(orderOk, "Home page section order matches the reference");

  for (const relativePath of [
    "src/app/privacy/page.tsx",
    "src/app/terms/page.tsx",
  ]) {
    const source = await readFile(path.join(root, relativePath), "utf8");
    check(
      source.includes("robots: { index: false, follow: true }"),
      `${relativePath} is marked noindex`,
    );
    check(
      source.includes("Template notice") &&
        source.includes("must be reviewed"),
      `${relativePath} contains a visible template-review notice`,
    );
  }

  const assetChecks = [
    ["public/logo.png", 349, 398],
    ["public/og.png", 1200, 630],
    ["src/app/icon.png", 512, 512],
    ["src/app/apple-icon.png", 180, 180],
  ] as const;

  for (const [relativePath, width, height] of assetChecks) {
    const metadata = await sharp(path.join(root, relativePath)).metadata();
    check(
      metadata.width === width && metadata.height === height,
      `${relativePath} is ${width}x${height}`,
      `found ${metadata.width}x${metadata.height}`,
    );
  }

  for (const relativePath of [
    "package.json",
    "src/app/page.tsx",
    "src/app/layout.tsx",
    "src/content/content.ts",
  ]) {
    const buffer = await readFile(path.join(root, relativePath));
    check(
      buffer[0] !== 0xef || buffer[1] !== 0xbb || buffer[2] !== 0xbf,
      `${relativePath} has no UTF-8 BOM`,
    );
  }

  const descriptionLength = site.metaDescription.length;
  const titleLength = site.title.length;
  check(
    descriptionLength >= 120 && descriptionLength <= 170,
    "Meta description length is within the target range",
    `${descriptionLength} characters`,
  );
  check(
    titleLength >= 40 && titleLength <= 65,
    "Meta title length is within the target range",
    `${titleLength} characters`,
  );

  for (const label of passes) {
    console.log(`PASS  ${label}`);
  }

  if (failures.length > 0) {
    console.error("\nContent verification failed:\n");
    failures.forEach((failure) => console.error(`FAIL  ${failure}`));
    process.exitCode = 1;
    return;
  }

  console.log(
    `\nContent verification passed: ${passes.length} checks across ${uniqueCopy.length} reference strings.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
