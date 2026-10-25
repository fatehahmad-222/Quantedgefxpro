import { hero } from "@/content/content";

type Candle = {
  open: number;
  close: number;
  high: number;
  low: number;
};

const rawCandles: Candle[] = (() => {
  const candles: Candle[] = [];
  let previous = 4388.6;

  for (let index = 0; index < 34; index += 1) {
    const wave =
      Math.sin(index * 0.7) * 3.4 +
      Math.cos(index * 0.29) * 1.7 +
      Math.sin(index * 1.9) * 0.7;
    const close = 4388.6 + index * 0.42 + wave;
    const open = previous;
    const high =
      Math.max(open, close) + 1.1 + Math.abs(Math.sin(index * 1.3)) * 1.25;
    const low =
      Math.min(open, close) - 1.0 - Math.abs(Math.cos(index * 0.8)) * 1.2;
    candles.push({ open, close, high, low });
    previous = close;
  }

  candles[candles.length - 1].close = 4400;
  return candles;
})();

const allValues = rawCandles.flatMap((candle) => [candle.high, candle.low]);
const minPrice = Math.min(...allValues) - 0.8;
const maxPrice = Math.max(...allValues) + 0.8;
const chartLeft = 28;
const chartRight = 618;
const chartTop = 18;
const chartBottom = 286;
const step = (chartRight - chartLeft) / rawCandles.length;
const candleWidth = Math.min(8, step * 0.54);

function priceToY(price: number): number {
  const ratio = (price - minPrice) / (maxPrice - minPrice);
  return chartBottom - ratio * (chartBottom - chartTop);
}

function xFor(index: number): number {
  return chartLeft + index * step + step / 2;
}

const movingAverage = rawCandles.map((_, index) => {
  const window = rawCandles.slice(Math.max(0, index - 4), index + 1);
  return window.reduce((sum, candle) => sum + candle.close, 0) / window.length;
});

const averagePoints = movingAverage
  .map((value, index) => `${xFor(index)},${priceToY(value)}`)
  .join(" ");

const areaPath = `M ${xFor(0)} ${chartBottom} L ${movingAverage
  .map((value, index) => `${xFor(index)} ${priceToY(value)}`)
  .join(" L ")} L ${xFor(movingAverage.length - 1)} ${chartBottom} Z`;

const lastX = xFor(rawCandles.length - 1);
const lastY = priceToY(4400);

export function HeroChart() {
  return (
    <figure
      className="chart-shell relative mt-4 overflow-hidden rounded-lg border border-cyan/10 bg-base/55"
      aria-label={hero.chartAlt}
    >
      <div className="chart-grid absolute inset-0 opacity-80" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />


      <svg
        viewBox="0 0 640 320"
        className="relative h-full w-full"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="hero-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hero-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.25" />
            <stop offset="70%" stopColor="#00e5ff" />
            <stop offset="100%" stopColor="#ffd84d" />
          </linearGradient>

        </defs>

        {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
          const y = chartTop + (chartBottom - chartTop) * ratio;
          return (
            <line
              key={ratio}
              x1={chartLeft}
              x2={chartRight}
              y1={y}
              y2={y}
              stroke="#00e5ff"
              strokeOpacity="0.08"
              strokeDasharray="3 7"
            />
          );
        })}

        <path d={areaPath} fill="url(#hero-area)" />

        {rawCandles.map((candle, index) => {
          const x = xFor(index);
          const openY = priceToY(candle.open);
          const closeY = priceToY(candle.close);
          const highY = priceToY(candle.high);
          const lowY = priceToY(candle.low);
          const up = candle.close >= candle.open;
          const color = up ? "#3dffa2" : "#ff3d7f";
          const bodyTop = Math.min(openY, closeY);
          const bodyHeight = Math.max(1.5, Math.abs(closeY - openY));
          const isLast = index === rawCandles.length - 1;

          return (
            <g
              key={index}
              opacity={isLast ? 1 : 0.82}
            >
              <line
                x1={x}
                x2={x}
                y1={highY}
                y2={lowY}
                stroke={color}
                strokeWidth="1"
                strokeOpacity="0.8"
              />
              <rect
                x={x - candleWidth / 2}
                y={bodyTop}
                width={candleWidth}
                height={bodyHeight}
                rx="1"
                fill={up ? "#0b2b24" : "#301020"}
                stroke={color}
                strokeWidth="1.1"
              />
            </g>
          );
        })}

        <polyline
          points={averagePoints}
          fill="none"
          stroke="url(#hero-line)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <line
          x1={chartLeft}
          x2={chartRight}
          y1={lastY}
          y2={lastY}
          stroke="#ffd84d"
          strokeOpacity="0.36"
          strokeDasharray="4 6"
        />

        <circle cx={lastX} cy={lastY} r="8" fill="#ffd84d" opacity="0.08" />
        <circle cx={lastX} cy={lastY} r="3.5" fill="#ffd84d" />

        <text
          x={chartLeft + 4}
          y={310}
          fill="#93a8b8"
          fillOpacity="0.55"
          fontFamily="monospace"
          fontSize="9"
          letterSpacing="2"
        >
          SAMPLE SERIES
        </text>
        <text
          x={chartRight}
          y={310}
          fill="#ffd84d"
          fillOpacity="0.55"
          fontFamily="monospace"
          fontSize="9"
          letterSpacing="2"
          textAnchor="end"
        >
          ILLUSTRATIVE
        </text>
      </svg>

      <figcaption className="relative flex flex-wrap items-center justify-between gap-2 border-t border-cyan/10 px-4 py-3 text-[0.64rem] text-dim sm:px-5">
        <span>{hero.captionLeft}</span>
        <span className="mono text-[0.58rem] tracking-[0.08em] uppercase">
          {hero.captionRight}
        </span>
      </figcaption>
    </figure>
  );
}
