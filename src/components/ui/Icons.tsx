import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

function baseProps({ size = 20, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export function ArrowUpRight(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowLeft(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M20 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}

export function Check(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="m5 12.5 4.2 4.2L19 6.8" />
    </svg>
  );
}

export function Plus(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function Menu(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M4 7h16M4 12h16M4 17h10" />
    </svg>
  );
}

export function Close(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function Shield(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M12 3 5 6v5.4c0 4.2 2.8 7.7 7 9.6 4.2-1.9 7-5.4 7-9.6V6l-7-3Z" />
      <path d="m9.2 12.1 1.9 1.9 3.9-4" />
    </svg>
  );
}

export function StopGrid(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M8 3h8l5 5v8l-5 5H8l-5-5V8l5-5Z" />
      <path d="M9 12h6" />
    </svg>
  );
}

export function Clock(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function Globe(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.8 9h16.4M3.8 15h16.4M12 3.5c2.2 2.3 3.3 5.1 3.3 8.5s-1.1 6.2-3.3 8.5c-2.2-2.3-3.3-5.1-3.3-8.5S9.8 5.8 12 3.5Z" />
    </svg>
  );
}

export function Transparency(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M4 5h16M4 5v14h16V5" />
      <path d="M8 9h8M8 13h5M8 17h7" />
      <path d="m16 14 1.2 1.2L20 12.5" />
    </svg>
  );
}

export function Sparkle(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M12 3.5c.6 4.8 2.2 6.4 7 7-4.8.6-6.4 2.2-7 7-.6-4.8-2.2-6.4-7-7 4.8-.6 6.4-2.2 7-7Z" />
      <path d="M19 16.5c.2 1.9.9 2.6 2.8 2.8-1.9.2-2.6.9-2.8 2.8-.2-1.9-.9-2.6-2.8-2.8 1.9-.2 2.6-.9 2.8-2.8Z" />
    </svg>
  );
}

export function Lock(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8.5 10V7.8a3.5 3.5 0 0 1 7 0V10M12 14v2.5" />
    </svg>
  );
}

export function Mail(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function Phone(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M8.2 4.2 5.5 5.7c-1.1.6-1.4 2-.8 3.1 2.5 5 6.5 9 11.5 11.5 1.1.6 2.5.3 3.1-.8l1.5-2.7-3.8-2-1.5 1.9a13.4 13.4 0 0 1-4.9-4.9l1.9-1.5-2-3.8Z" />
    </svg>
  );
}

export function WhatsApp(props: IconProps) {
  const { size = 20, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path d="M12.04 2.5a9.43 9.43 0 0 0-8.1 14.23L2.7 21.2l4.58-1.2a9.4 9.4 0 0 0 4.75 1.28h.01a9.49 9.49 0 0 0 0-18.78Zm0 17.3h-.01a7.8 7.8 0 0 1-3.98-1.09l-.28-.17-2.72.71.73-2.65-.18-.28a7.82 7.82 0 1 1 6.44 3.48Zm4.3-5.84c-.24-.12-1.4-.69-1.61-.77-.22-.08-.37-.12-.53.12-.16.24-.62.77-.76.93-.14.16-.28.18-.52.06a6.39 6.39 0 0 1-1.88-1.16 7.04 7.04 0 0 1-1.3-1.62c-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.53-1.28-.73-1.75-.19-.46-.39-.4-.53-.4h-.45c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.57.19 1.1.16 1.51.1.46-.07 1.4-.57 1.6-1.12.2-.55.2-1.02.14-1.12-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

export function FileText(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M6 3h8l4 4v14H6V3Z" />
      <path d="M14 3v4h4M9 12h6M9 16h6" />
    </svg>
  );
}

export function Cookie(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M20.5 13.2A8.5 8.5 0 1 1 10.8 3.5a3.4 3.4 0 0 0 4.1 4.1 3.4 3.4 0 0 0 4.1 4.1c.6 0 1.1-.1 1.5-.3Z" />
      <path d="M8.5 9.5h.01M8 15h.01M14.5 15.5h.01M15.5 9.5h.01" />
    </svg>
  );
}

export function ChevronUp(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="m6 14 6-6 6 6" />
    </svg>
  );
}
