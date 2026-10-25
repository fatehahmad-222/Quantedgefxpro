import { performance } from "@/content/content";
import { FileText } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const sampleValues = [
  8, 15, 11, 21, 27, 24, 34, 42, 38, 47, 56, 51, 62, 58, 67, 76, 72, 82, 90,
  85, 94, 103, 99, 108,
];

const width = 720;
const height = 330;
const padX = 36;
const padTop = 22;
const padBottom = 52;
const minValue = 0;
const maxValue = 120;

const points = sampleValues.map((value, index) => ({
  x: padX + (index / (sampleValues.length - 1)) * (width - padX * 2),
  y:
    padTop +
    (1 - (value - minValue) / (maxValue - minValue)) *
      (height - padTop - padBottom),
}));

function smoothPath(pts: Array<{ x: number; y: number }>): string {
  let path = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;

  for (let index = 0; index < pts.length - 1; index += 1) {
    const p0 = pts[index - 1] ?? pts[index];
    const p1 = pts[index];
    const p2 = pts[index + 1];
    const p3 = pts[index + 2] ?? p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }

  return path;
}

const linePath = smoothPath(points);
const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(2)} ${(height - padBottom).toFixed(2)} L ${points[0].x.toFixed(2)} ${(height - padBottom).toFixed(2)} Z`;
const lastPoint = points[points.length - 1];

function EquityChart() {
  return (
    <figure
      className="relative mt-5 overflow-hidden rounded-lg border border-cyan/10 bg-base/45"
      aria-label={performance.chartAlt}
    >
      <div className="equity-grid absolute inset-0 opacity-75" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/25 to-transparent" />
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="relative block w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="equity-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.17" />
            <stop offset="70%" stopColor="#00e5ff" stopOpacity="0.035" />
            <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="equity-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="55%" stopColor="#7c5cff" />
            <stop offset="100%" stopColor="#ffd84d" />
          </linearGradient>
          <filter id="equity-glow" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {[0, 1, 2, 3, 4].map((line) => {
          const y = padTop + (line / 4) * (height - padTop - padBottom);
          return (
            <line
              key={line}
              x1={padX}
              x2={width - padX}
              y1={y}
              y2={y}
              stroke="#00e5ff"
              strokeOpacity="0.08"
              strokeDasharray="3 7"
            />
          );
        })}

        <path d={areaPath} fill="url(#equity-area)" />

        <path
          className="equity-line-draw"
          d={linePath}
          fill="none"
          pathLength={1}
          stroke="url(#equity-line)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#equity-glow)"
        />

        <line
          x1={padX}
          x2={width - padX}
          y1={height - padBottom}
          y2={height - padBottom}
          stroke="#93a8b8"
          strokeOpacity="0.12"
        />

        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r="11"
          fill="#ffd84d"
          opacity="0.07"
        />
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r="4"
          fill="#ffd84d"
          filter="url(#equity-glow)"
        />

        <text
          x={padX}
          y={height - 20}
          fill="#93a8b8"
          fillOpacity="0.5"
          fontFamily="monospace"
          fontSize="9"
          letterSpacing="2"
        >
          SAMPLE EQUITY PATH
        </text>
        <text
          x={width - padX}
          y={height - 20}
          fill="#ffd84d"
          fillOpacity="0.55"
          fontFamily="monospace"
          fontSize="9"
          letterSpacing="2"
          textAnchor="end"
        >
          NOT VERIFIED
        </text>
      </svg>
    </figure>
  );
}

export function Performance() {
  return (
    <section
      id="performance"
      className="section relative overflow-hidden"
      aria-labelledby="performance-title"
    >
      <div className="section-rule" />
      <div className="pointer-events-none absolute -right-40 top-1/4 h-[30rem] w-[30rem] rounded-full bg-gold/[0.03] blur-3xl" />
      <div className="wrap">
        <SectionHeading
          tag={performance.tag}
          title={performance.title}
          id="performance-title"
        />

        <Reveal>
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-dashed border-gold/30 bg-gold/[0.035] px-4 py-3.5">
            <FileText size={16} className="mt-0.5 shrink-0 text-gold" />
            <p className="text-[0.76rem] leading-5 text-gold/90">
              {performance.note}
            </p>
          </div>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-[1.45fr_0.55fr]">
          <Reveal distance={24}>
            <div className="glass relative overflow-hidden rounded-xl p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan/10 pb-4">
                <div>
                  <p className="mono text-[0.56rem] tracking-[0.16em] text-dim uppercase">
                    Performance console
                  </p>
                  <p className="mt-1 font-display text-sm font-medium text-frost">
                    Equity curve / sample period
                  </p>
                </div>
                <span className="chip border-gold/20 text-gold/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  Illustrative
                </span>
              </div>
              <EquityChart />
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
            {performance.stats.map((stat, index) => (
              <Reveal
                key={stat.label}
                delay={0.06 + index * 0.05}
                distance={16}
              >
                <div className="spotlight group relative h-full overflow-hidden rounded-xl border border-cyan/10 bg-panel/45 p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="mono text-[0.5rem] tracking-[0.14em] text-dim/60 uppercase">
                      Metric / {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan/35 transition-colors group-hover:bg-gold" />
                  </div>
                  <p className="mt-5 font-display text-3xl font-medium tracking-[-0.05em] text-frost/45">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[0.68rem] leading-4 text-muted">
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
