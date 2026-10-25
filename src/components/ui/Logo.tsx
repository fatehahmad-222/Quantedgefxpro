import Image from "next/image";
import { cn } from "@/lib/cn";

type LogoProps = {
  size?: number;
  className?: string;
  priority?: boolean;
  decorative?: boolean;
};

export function Logo({
  size = 32,
  className,
  priority = false,
  decorative = false,
}: LogoProps) {
  const height = Math.round((size * 398) / 349);

  return (
    <Image
      src="/logo.png"
      alt={decorative ? "" : "Quant Edge FX Pro logo"}
      width={size}
      height={height}
      priority={priority}
      className={cn("logo-neon h-auto w-auto object-contain", className)}
      style={{ width: size, height }}
      aria-hidden={decorative || undefined}
    />
  );
}
