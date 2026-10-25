const VIEW_WIDTH = 1440;
const VIEW_HEIGHT = 760;
const POINT_COUNT = 96;

function priceY(x: number): number {
  const t = x / VIEW_WIDTH;
  const trend = 692 - t * 408;
  const wave =
    Math.sin(t * Math.PI * 4.6 + 0.4) * 42 +
    Math.sin(t * Math.PI * 9.1 + 1.7) * 17 +
    Math.cos(t * Math.PI * 1.8 - 0.6) * 26;
  const pullback = Math.exp(-(((t - 0.74) / 0.055) ** 2)) * 46;
  return trend + wave + pullback;
}

const linePoints = Array.from({ length: POINT_COUNT + 1 }, (_, index) => {
  const x = (index / POINT_COUNT) * VIEW_WIDTH;
  return { x, y: priceY(x) };
});

const linePath = linePoints
  .map(
    (point, index) =>
      `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`,
  )
  .join(" ");

const areaPath = `${linePath} L ${VIEW_WIDTH} ${VIEW_HEIGHT} L 0 ${VIEW_HEIGHT} Z`;

type BackdropCandle = {
  x: number;
  openY: number;
  closeY: number;
  highY: number;
  lowY: number;
  up: boolean;
};

const candles: BackdropCandle[] = Array.from({ length: 56 }, (_, index) => {
  const x = 8 + index * 26.1;
  const anchor = priceY(x);
  const openY =
    anchor + Math.sin(index * 1.17) * 34 + Math.cos(index * 0.43) * 18;
  const closeY =
    openY - Math.sin(index * 0.9 + 0.3) * 25 - Math.cos(index * 0.31) * 12;
  const highY =
    Math.min(openY, closeY) - 9 - Math.abs(Math.sin(index * 1.4)) * 17;
  const lowY =
    Math.max(openY, closeY) + 8 + Math.abs(Math.cos(index * 0.8)) * 15;

  return { x, openY, closeY, highY, lowY, up: closeY < openY };
});

const markerX = 690;
const markerY = priceY(markerX);

const pulsePoints = [
  { x: 286, y: priceY(286) },
  { x: 728, y: priceY(728) },
  { x: 1116, y: priceY(1116) },
];

export function HeroBackdrop() {
  return (
    <div className="hero-market-bg" aria-hidden="true">
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        className="hero-market-chart"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        <defs>
          <linearGradient id="hero-bg-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.05" />
            <stop offset="46%" stopColor="#00e5ff" stopOpacity="0.72" />
            <stop offset="82%" stopColor="#ffd84d" stopOpacity="0.62" />
            <stop offset="100%" stopColor="#ffd84d" stopOpacity="0.18" />
          </linearGradient>
          <linearGradient id="hero-bg-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.14" />
            <stop offset="58%" stopColor="#00e5ff" stopOpacity="0.035" />
            <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g className="hero-market-grid">
          {[0.16, 0.33, 0.5, 0.67, 0.84].map((ratio) => (
            <line
              key={`h-${ratio}`}
              x1="0"
              x2={VIEW_WIDTH}
              y1={VIEW_HEIGHT * ratio}
              y2={VIEW_HEIGHT * ratio}
              stroke="#00e5ff"
              strokeOpacity="0.09"
              strokeDasharray="2 12"
            />
          ))}
          {[0.12, 0.29, 0.46, 0.63, 0.8, 0.94].map((ratio) => (
            <line
              key={`v-${ratio}`}
              x1={VIEW_WIDTH * ratio}
              x2={VIEW_WIDTH * ratio}
              y1="0"
              y2={VIEW_HEIGHT}
              stroke="#00e5ff"
              strokeOpacity="0.055"
            />
          ))}
        </g>

        <path d={areaPath} fill="url(#hero-bg-area)" />

        <g className="hero-market-candles">
          {candles.map((candle, index) => {
            const bodyTop = Math.min(candle.openY, candle.closeY);
            const bodyHeight = Math.max(2, Math.abs(candle.closeY - candle.openY));
            const color = candle.up ? "#3dffa2" : "#ff3d7f";

            return (
              <g key={index}>
                <line
                  x1={candle.x}
                  x2={candle.x}
                  y1={candle.highY}
                  y2={candle.lowY}
                  stroke={color}
                  strokeWidth="0.9"
                  strokeOpacity="0.7"
                />
                <rect
                  x={candle.x - 2.8}
                  y={bodyTop}
                  width="5.6"
                  height={bodyHeight}
                  rx="0.8"
                  fill={candle.up ? "#0b2b24" : "#301020"}
                  stroke={color}
                  strokeWidth="0.9"
                />
              </g>
            );
          })}
        </g>

        <path
          d={linePath}
          fill="none"
          stroke="#00e5ff"
          strokeOpacity="0.12"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={linePath}
          fill="none"
          stroke="url(#hero-bg-line)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1={markerX - 330}
          x2={VIEW_WIDTH}
          y1={markerY}
          y2={markerY}
          stroke="#ffd84d"
          strokeOpacity="0.2"
          strokeDasharray="4 9"
        />

        <g className="hero-market-marker">
          <line
            x1={markerX}
            x2={markerX}
            y1={markerY - 28}
            y2={markerY + 28}
            stroke="#ffd84d"
            strokeOpacity="0.3"
          />
          <circle
            cx={markerX}
            cy={markerY}
            r="9"
            fill="none"
            stroke="#ffd84d"
            strokeOpacity="0.32"
          />
          <circle
            cx={markerX}
            cy={markerY}
            r="3.6"
            fill="#ffd84d"
            className="hero-market-dot"
          />
        </g>

        {pulsePoints.map((point, index) => (
          <circle
            key={`${point.x}-${index}`}
            cx={point.x}
            cy={point.y}
            r="7"
            fill="none"
            stroke={index === 1 ? "#ffd84d" : "#00e5ff"}
            strokeWidth="1.2"
            className="hero-market-pulse"
            style={{ animationDelay: `${-1.3 - index * 1.1}s` }}
          />
        ))}
      </svg>

      <div className="hero-market-scan" />
      <div className="hero-market-fade" />
    </div>
  );
}
