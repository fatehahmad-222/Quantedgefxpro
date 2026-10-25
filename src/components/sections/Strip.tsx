import { strip } from "@/content/content";

export function Strip() {
  return (
    <section
      className="relative border-y border-cyan/10 bg-elevated/50"
      aria-label="At a glance"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
      <div className="wrap grid grid-cols-2 lg:grid-cols-4">
        {strip.map((item, index) => (
          <div
            key={item.label}
            className="group relative flex flex-col gap-1.5 border-cyan/10 px-1 py-5 even:border-l sm:px-4 lg:border-l lg:px-6 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0"
          >
            <span className="mono absolute right-2 top-4 text-[0.5rem] tracking-[0.1em] text-dim/50">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="mono text-[0.58rem] tracking-[0.18em] text-dim uppercase">
              {item.label}
            </span>
            <span className="max-w-[16rem] font-mono text-[0.76rem] leading-5 text-frost/90 transition-colors group-hover:text-gold sm:text-[0.8rem]">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
