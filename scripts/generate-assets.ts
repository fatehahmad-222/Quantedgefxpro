import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const root = process.cwd();
const referencePath = join(root, "reference", "original.html");
const publicDir = join(root, "public");
const appDir = join(root, "src", "app");

mkdirSync(publicDir, { recursive: true });

const reference = readFileSync(referencePath, "utf8");
const match = reference.match(/data:image\/png;base64,([A-Za-z0-9+/=]+)/);

if (!match) {
  throw new Error("Logo base64 was not found in reference/original.html");
}

const logoBuffer = Buffer.from(match[1], "base64");
const logoHash = createHash("sha256").update(logoBuffer).digest("hex");

writeFileSync(join(publicDir, "logo.png"), logoBuffer);

const logoDataUri = `data:image/png;base64,${logoBuffer.toString("base64")}`;

const iconSvg = (size: number) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="bg" cx="50%" cy="42%" r="72%">
      <stop offset="0%" stop-color="#12202b"/>
      <stop offset="62%" stop-color="#080d13"/>
      <stop offset="100%" stop-color="#05070a"/>
    </radialGradient>
    <radialGradient id="cyanGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00e5ff" stop-opacity=".38"/>
      <stop offset="100%" stop-color="#00e5ff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffd84d" stop-opacity=".45"/>
      <stop offset="100%" stop-color="#ffd84d" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="18"/></filter>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <g opacity=".18" stroke="#00e5ff" stroke-width="1">
    <path d="M64 160h384M64 256h384M64 352h384M160 64v384M256 64v384M352 64v384"/>
  </g>
  <ellipse cx="256" cy="252" rx="190" ry="190" fill="url(#cyanGlow)" filter="url(#blur)"/>
  <ellipse cx="256" cy="252" rx="130" ry="160" fill="url(#goldGlow)" filter="url(#blur)"/>
  <image href="${logoDataUri}" x="150" y="118" width="212" height="242" preserveAspectRatio="xMidYMid meet"/>
  <rect x="28" y="28" width="456" height="456" rx="92" fill="none" stroke="#ffd84d" stroke-opacity=".32"/>
</svg>`;

const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="bg" cx="62%" cy="18%" r="78%">
      <stop offset="0%" stop-color="#12202b"/>
      <stop offset="46%" stop-color="#080d13"/>
      <stop offset="100%" stop-color="#05070a"/>
    </radialGradient>
    <radialGradient id="cyan" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00e5ff" stop-opacity=".34"/>
      <stop offset="100%" stop-color="#00e5ff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="gold" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffd84d" stop-opacity=".3"/>
      <stop offset="100%" stop-color="#ffd84d" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="title" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="52%" stop-color="#eaf7ff"/>
      <stop offset="100%" stop-color="#ffd84d"/>
    </linearGradient>
    <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffd84d"/>
      <stop offset="100%" stop-color="#00e5ff"/>
    </linearGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="34"/></filter>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <g opacity=".16" stroke="#00e5ff" stroke-width="1">
    <path d="M0 90h1200M0 180h1200M0 270h1200M0 360h1200M0 450h1200M0 540h1200"/>
    <path d="M90 0v630M180 0v630M270 0v630M360 0v630M450 0v630M540 0v630M630 0v630M720 0v630M810 0v630M900 0v630M990 0v630M1080 0v630"/>
  </g>
  <ellipse cx="910" cy="160" rx="330" ry="250" fill="url(#cyan)" filter="url(#blur)"/>
  <ellipse cx="240" cy="520" rx="280" ry="240" fill="url(#gold)" filter="url(#blur)"/>
  <g opacity=".6" stroke="#ffd84d" fill="none">
    <path d="M72 72h46M72 72v46" stroke-width="2"/>
    <path d="M1128 558h-46M1128 558v-46" stroke-width="2"/>
  </g>
  <image href="${logoDataUri}" x="72" y="174" width="250" height="285" preserveAspectRatio="xMidYMid meet"/>
  <text x="72" y="118" fill="#ffd84d" font-family="Consolas, monospace" font-size="18" letter-spacing="7">QUANT EDGE FX PRO</text>
  <text x="380" y="234" fill="url(#title)" font-family="Segoe UI, Arial, sans-serif" font-size="64" font-weight="700" letter-spacing="-2">Gold moves fast.</text>
  <text x="380" y="310" fill="url(#title)" font-family="Segoe UI, Arial, sans-serif" font-size="64" font-weight="700" letter-spacing="-2">Your trading system</text>
  <text x="380" y="386" fill="url(#title)" font-family="Segoe UI, Arial, sans-serif" font-size="64" font-weight="700" letter-spacing="-2">should move faster.</text>
  <rect x="380" y="430" width="270" height="2" fill="url(#line)"/>
  <text x="380" y="482" fill="#93a8b8" font-family="Consolas, monospace" font-size="19" letter-spacing="1">An XAUUSD Expert Advisor for MetaTrader 5</text>
  <rect x="380" y="520" width="124" height="34" rx="17" fill="none" stroke="#00e5ff" stroke-opacity=".5"/>
  <text x="442" y="542" fill="#00e5ff" text-anchor="middle" font-family="Consolas, monospace" font-size="12" letter-spacing="3">XAUUSD</text>
  <text x="1128" y="592" fill="#6f8798" text-anchor="end" font-family="Consolas, monospace" font-size="14" letter-spacing="3">AUTOMATED · MT5 · XAUUSD</text>
</svg>`;

async function main() {
  await sharp(Buffer.from(iconSvg(512))).png().toFile(join(appDir, "icon.png"));
  await sharp(Buffer.from(iconSvg(180))).png().toFile(join(appDir, "apple-icon.png"));
  await sharp(Buffer.from(ogSvg)).png().toFile(join(publicDir, "og.png"));

  console.log(`logo.png written (${logoBuffer.length} bytes, sha256 ${logoHash})`);
  console.log("icon.png, apple-icon.png and og.png generated");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
