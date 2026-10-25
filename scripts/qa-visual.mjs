import { spawn, spawnSync } from "node:child_process";
import { access, mkdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";
import sharp from "sharp";

const root = process.cwd();
const port = Number(process.env.QA_PORT ?? 3210);
const baseUrl = process.env.QA_BASE_URL ?? `http://127.0.0.1:${port}`;
const screenshotDir = path.join(root, "qa-screenshots");
const chromePath =
  process.env.CHROME_PATH ??
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const failures = [];
const passes = [];
let server = null;
let browser = null;
let stoppingServer = false;

function check(condition, label, detail) {
  if (condition) {
    passes.push(label);
    return;
  }
  failures.push(detail ? `${label}: ${detail}` : label);
}

function sameSet(actual, expected) {
  return (
    actual.length === expected.length &&
    expected.every((value) => actual.includes(value))
  );
}

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

async function waitForServer(url, timeoutMs = 30000) {
  const startedAt = Date.now();
  let lastError = "";

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url, { redirect: "manual" });
      if (response.status < 500) return;
      lastError = `HTTP ${response.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  throw new Error(`Server did not become ready at ${url}: ${lastError}`);
}

function stopServer() {
  if (!server) return;
  stoppingServer = true;

  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(server.pid), "/t", "/f"], {
      stdio: "ignore",
    });
  } else {
    server.kill("SIGTERM");
  }
  server = null;
}

async function startServer() {
  if (process.env.QA_BASE_URL) return;

  const buildId = path.join(root, ".next", "BUILD_ID");
  if (!(await exists(buildId))) {
    throw new Error(
      "No production build found. Run `npm run build` before `npm run qa:visual`.",
    );
  }

  const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
  let output = "";

  server = spawn(
    process.execPath,
    [nextBin, "start", "-H", "127.0.0.1", "-p", String(port)],
    {
      cwd: root,
      env: { ...process.env },
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    },
  );

  server.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  server.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });
  server.on("exit", (code) => {
    if (!stoppingServer && code && code !== 0) {
      console.error(`QA server exited with code ${code}\n${output}`);
    }
  });

  try {
    await waitForServer(baseUrl);
  } catch (error) {
    stopServer();
    throw new Error(`${error.message}\n${output}`);
  }
}

async function settlePage(page) {
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const step = Math.max(220, Math.floor(window.innerHeight * 0.55));

    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await delay(28);
    }

    window.scrollTo(0, 0);
    await delay(180);
  });
  await page.waitForTimeout(250);
}

function attachDiagnostics(page, diagnostics) {
  page.on("pageerror", (error) => {
    diagnostics.pageErrors.push(error.message);
  });
  page.on("console", (message) => {
    if (message.type() === "error") {
      diagnostics.consoleErrors.push(message.text());
    }
  });
  page.on("requestfailed", (request) => {
    const failure = request.failure();
    diagnostics.failedRequests.push(
      `${request.url()} (${failure?.errorText ?? "unknown"})`,
    );
  });
}

async function checkAxe(page, label) {
  const axeSource = await readFile(
    path.join(root, "node_modules", "axe-core", "axe.min.js"),
    "utf8",
  );
  await page.addScriptTag({ content: axeSource });

  const violations = await page.evaluate(async () => {
    const results = await window.axe.run(document, {
      runOnly: {
        type: "tag",
        values: [
          "wcag2a",
          "wcag2aa",
          "wcag21a",
          "wcag21aa",
          "best-practice",
        ],
      },
    });
    return results.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      nodes: violation.nodes.slice(0, 4).map((node) => node.target.join(" ")),
    }));
  });

  check(
    violations.length === 0,
    `${label} passes axe accessibility rules`,
    violations
      .map(
        (violation) =>
          `${violation.id} (${violation.impact}): ${violation.help} [${violation.nodes.join(", ")}]`,
      )
      .join("\n  "),
  );
}

async function checkHomeAtWidth(context, width, height, screenshot) {
  const page = await context.newPage();
  const diagnostics = {
    pageErrors: [],
    consoleErrors: [],
    failedRequests: [],
  };
  attachDiagnostics(page, diagnostics);

  const response = await page.goto(baseUrl, { waitUntil: "networkidle" });
  check(response?.status() === 200, `${width}px home returns 200`);
  await page.evaluate(() => document.fonts.ready);
  await settlePage(page);

  const title = await page.title();
  check(
    title.includes("Quant Edge FX Pro"),
    `${width}px page title is present`,
    title,
  );

  const headingCount = await page.locator("h1").count();
  check(headingCount === 1, `${width}px has exactly one h1`, String(headingCount));

  const sectionIds = await page.evaluate(() =>
    Array.from(document.querySelectorAll("main section[id]")).map(
      (section) => section.id,
    ),
  );
  check(
    sameSet(sectionIds, [
      "how",
      "discipline",
      "guarantee",
      "performance",
      "pricing",
      "faq",
    ]),
    `${width}px all landing sections are present`,
    JSON.stringify(sectionIds),
  );

  const overflow = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  check(
    overflow.document <= overflow.viewport + 1,
    `${width}px has no horizontal page overflow`,
    `${overflow.document}px document vs ${overflow.viewport}px viewport`,
  );

  const sectionOverflow = await page.evaluate(() =>
    Array.from(document.querySelectorAll("main section")).flatMap((section) => {
      const rect = section.getBoundingClientRect();
      return rect.right > window.innerWidth + 2 || rect.left < -2
        ? [`${section.id || section.className}: ${rect.left}-${rect.right}`]
        : [];
    }),
  );
  check(
    sectionOverflow.length === 0,
    `${width}px sections stay inside the viewport`,
    sectionOverflow.join(", "),
  );

  const duplicateIds = await page.evaluate(() => {
    const counts = new Map();
    document.querySelectorAll("[id]").forEach((element) => {
      counts.set(element.id, (counts.get(element.id) ?? 0) + 1);
    });
    return [...counts.entries()]
      .filter(([, count]) => count > 1)
      .map(([id]) => id);
  });
  check(
    duplicateIds.length === 0,
    `${width}px has no duplicate DOM ids`,
    duplicateIds.join(", "),
  );

  const unnamedControls = await page.evaluate(() =>
    Array.from(document.querySelectorAll("a, button")).flatMap((element) => {
      const style = window.getComputedStyle(element);
      if (style.display === "none" || style.visibility === "hidden") return [];
      const label =
        element.getAttribute("aria-label") ||
        element.getAttribute("title") ||
        element.textContent ||
        "";
      return label.trim().length === 0
        ? [`${element.tagName.toLowerCase()} ${element.outerHTML.slice(0, 80)}`]
        : [];
    }),
  );
  check(
    unnamedControls.length === 0,
    `${width}px all visible links and buttons have names`,
    unnamedControls.join("\n  "),
  );

  const missingAlt = await page.evaluate(() =>
    Array.from(document.querySelectorAll("img")).flatMap((image) =>
      image.getAttribute("alt") === null
        ? [image.getAttribute("src") ?? "unknown image"]
        : [],
    ),
  );
  check(
    missingAlt.length === 0,
    `${width}px all images have alt attributes`,
    missingAlt.join(", "),
  );

  const brokenHashLinks = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href^="#"]')).flatMap((anchor) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return [];
      return document.querySelector(href) ? [] : [href];
    }),
  );
  check(
    brokenHashLinks.length === 0,
    `${width}px all local hash links resolve`,
    brokenHashLinks.join(", "),
  );

  const whatsappLinks = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href*="wa.me/"]')).map(
      (anchor) => anchor.getAttribute("href") ?? "",
    ),
  );
  check(
    whatsappLinks.filter((href) => href.includes("14409909101")).length === 4,
    `${width}px has four primary WhatsApp links`,
    `found ${whatsappLinks.filter((href) => href.includes("14409909101")).length}`,
  );
  check(
    whatsappLinks.filter((href) => href.includes("120589896542")).length === 1,
    `${width}px has one footer WhatsApp link`,
    `found ${whatsappLinks.filter((href) => href.includes("120589896542")).length}`,
  );

  const contactLinks = await page.evaluate(() =>
    Array.from(document.querySelectorAll("footer a")).map(
      (anchor) => anchor.getAttribute("href") ?? "",
    ),
  );
  check(
    contactLinks.some((href) => href.includes("mailto:sales@quantedgefxpro.com")),
    `${width}px footer includes the sales email`,
  );
  check(
    contactLinks.some((href) =>
      href.includes("mailto:support@quantedgefxpro.com"),
    ),
    `${width}px footer includes the support email`,
  );
  check(
    contactLinks.some((href) => href === "tel:+120589896542"),
    `${width}px footer includes the phone link`,
  );

  if (width === 390 || width === 1440) {
    await checkAxe(page, `${width}px home`);
  }

  if (screenshot) {
    const image = path.join(screenshotDir, `home-${width}.png`);
    await page.screenshot({
      path: image,
      fullPage: true,
      animations: "disabled",
    });
    const metadata = await sharp(image).metadata();
    const file = await stat(image);
    const stats = await sharp(image).stats();
    check(
      metadata.width === width && (metadata.height ?? 0) > 1500,
      `${width}px screenshot captured`,
      `${metadata.width}x${metadata.height}`,
    );
    check(
      file.size > 100_000 && stats.channels[0].stdev > 4,
      `${width}px screenshot contains rendered content`,
      `${file.size} bytes, stddev ${stats.channels[0].stdev.toFixed(2)}`,
    );
  }

  if (width === 1440) {
    await page.locator('nav[aria-label="Primary"] a[href="#pricing"]').click();
    await page.waitForTimeout(300);
    const hash = await page.evaluate(() => window.location.hash);
    const pricingVisible = await page
      .locator("#pricing")
      .evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
      });
    check(hash === "#pricing", "Desktop pricing nav updates the hash", hash);
    check(pricingVisible, "Desktop pricing nav scrolls to pricing");

    await page.locator("#faq-button-0").click();
    await page.waitForTimeout(500);
    const expanded = await page
      .locator("#faq-button-0")
      .getAttribute("aria-expanded");
    const answerVisible = await page.locator("#faq-panel-0").isVisible();
    check(
      expanded === "true" && answerVisible,
      "FAQ accordion opens with accessible state",
      `aria-expanded=${expanded}, visible=${answerVisible}`,
    );
    await page.locator("#faq-button-0").click();
  }

  if (width === 390) {
    const menuButton = page.locator(
      'button[aria-controls="mobile-navigation"]',
    );
    await menuButton.click();
    await page.waitForTimeout(250);
    const menuVisible = await page.locator("#mobile-navigation").isVisible();
    check(menuVisible, "Mobile menu opens");
    if (menuVisible) {
      await page.keyboard.press("Escape");
      await page.waitForTimeout(250);
      const menuClosed =
        (await page.locator("#mobile-navigation").count()) === 0;
      check(menuClosed, "Mobile menu closes with Escape");
    }
  }

  check(
    diagnostics.pageErrors.length === 0,
    `${width}px has no page errors`,
    diagnostics.pageErrors.join("\n  "),
  );
  check(
    diagnostics.consoleErrors.length === 0,
    `${width}px has no console errors`,
    diagnostics.consoleErrors.join("\n  "),
  );
  check(
    diagnostics.failedRequests.length === 0,
    `${width}px has no failed requests`,
    diagnostics.failedRequests.join("\n  "),
  );

  await page.close();
}

async function checkConsentFlow(context) {
  const page = await context.newPage();
  const diagnostics = {
    pageErrors: [],
    consoleErrors: [],
    failedRequests: [],
  };
  attachDiagnostics(page, diagnostics);

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  const bar = page.locator('[aria-label="Cookie preferences"]');
  await bar.waitFor({ state: "visible", timeout: 4000 });
  check(true, "Consent bar appears before a choice");

  const fbqBefore = await page.evaluate(() => typeof window.fbq);
  check(
    fbqBefore === "undefined",
    "Meta Pixel is absent before consent",
    fbqBefore,
  );

  await bar.getByRole("button", { name: "Decline" }).click();
  await page.waitForTimeout(800);
  const stored = await page.evaluate(() =>
    localStorage.getItem("qefp-consent-v1"),
  );
  const barCount = await bar.count();
  check(stored === "denied", "Decline stores the consent choice", stored);
  check(barCount === 0, "Consent bar dismisses after a choice");
  check(
    diagnostics.pageErrors.length === 0,
    "Consent flow has no page errors",
    diagnostics.pageErrors.join("\n  "),
  );

  await page.close();
}

async function checkLegalPage(context, route) {
  const page = await context.newPage();
  const diagnostics = {
    pageErrors: [],
    consoleErrors: [],
    failedRequests: [],
  };
  attachDiagnostics(page, diagnostics);

  const response = await page.goto(`${baseUrl}${route}`, {
    waitUntil: "networkidle",
  });
  check(response?.status() === 200, `${route} returns 200`);

  const robots = await page
    .locator('meta[name="robots"]')
    .getAttribute("content");
  check(
    robots?.includes("noindex") === true,
    `${route} is noindex`,
    robots ?? "missing",
  );
  check(
    (await page.locator("h1").count()) === 1,
    `${route} has exactly one h1`,
  );
  check(
    await page.getByText("Template notice").first().isVisible(),
    `${route} shows the template-review notice`,
  );

  const overflow = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  check(
    overflow.document <= overflow.viewport + 1,
    `${route} has no horizontal page overflow`,
    `${overflow.document}px document vs ${overflow.viewport}px viewport`,
  );

  check(
    diagnostics.pageErrors.length === 0,
    `${route} has no page errors`,
    diagnostics.pageErrors.join("\n  "),
  );

  await page.close();
}

async function checkSeoRoutes() {
  const robotsResponse = await fetch(`${baseUrl}/robots.txt`);
  const robots = await robotsResponse.text();
  check(robotsResponse.status === 200, "robots.txt returns 200");
  check(robots.includes("Disallow: /api/"), "robots.txt excludes API routes");

  const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
  const sitemap = await sitemapResponse.text();
  check(sitemapResponse.status === 200, "sitemap.xml returns 200");
  check(sitemap.includes("<urlset"), "sitemap.xml contains a urlset");

  const capiResponse = await fetch(`${baseUrl}/api/meta-capi`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ consent: false }),
  });
  check(
    capiResponse.status === 204,
    "CAPI endpoint returns 204 without credentials",
    String(capiResponse.status),
  );
}

async function main() {
  await mkdir(screenshotDir, { recursive: true });
  await startServer();

  const executablePath = await exists(chromePath)
    ? chromePath
    : chromium.executablePath();
  check(await exists(executablePath), "Browser executable is available");

  browser = await chromium.launch({
    executablePath,
    headless: true,
  });

  const viewports = [
    [360, 780, false],
    [390, 844, true],
    [768, 1024, false],
    [1024, 768, false],
    [1440, 1000, true],
  ];

  for (const [width, height, screenshot] of viewports) {
    const context = await browser.newContext({
      viewport: { width, height },
      reducedMotion: "reduce",
      colorScheme: "dark",
      deviceScaleFactor: 1,
    });
    await context.addInitScript(() => {
      localStorage.setItem("qefp-consent-v1", "denied");
    });
    await checkHomeAtWidth(context, width, height, screenshot);
    await context.close();
  }

  const consentContext = await browser.newContext({
    viewport: { width: 1024, height: 768 },
    reducedMotion: "reduce",
  });
  await checkConsentFlow(consentContext);
  await consentContext.close();

  const legalContext = await browser.newContext({
    viewport: { width: 1024, height: 768 },
    reducedMotion: "reduce",
  });
  await checkLegalPage(legalContext, "/privacy");
  await checkLegalPage(legalContext, "/terms");
  await legalContext.close();

  await checkSeoRoutes();

  for (const label of passes) {
    console.log(`PASS  ${label}`);
  }

  if (failures.length > 0) {
    console.error("\nVisual QA failed:\n");
    failures.forEach((failure) => console.error(`FAIL  ${failure}`));
    process.exitCode = 1;
    return;
  }

  console.log(
    `\nVisual QA passed: ${passes.length} checks across 5 viewports and 2 legal pages.`,
  );
}

try {
  await main();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  stopServer();
}
