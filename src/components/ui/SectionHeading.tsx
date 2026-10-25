import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  tag: string;
  title: string;
  description?: string;
  id?: string;
  className?: string;
};

export function SectionHeading({
  tag,
  title,
  description,
  id,
  className,
}: SectionHeadingProps) {
  return (
    <Reveal className={cn("section-head", className)}>
      <p className="tag">{tag}</p>
      <h2 id={id} className="display h2 text-frost">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 max-w-xl text-[0.98rem] leading-7 text-muted">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
