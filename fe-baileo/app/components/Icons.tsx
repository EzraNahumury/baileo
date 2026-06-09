import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function DepositIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3v10" />
      <path d="m8 9 4 4 4-4" />
      <rect x="3" y="15" width="18" height="6" rx="2" />
    </svg>
  );
}

export function MintIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8M9.5 10.2c0-1 .9-1.7 2.5-1.7s2.5.7 2.5 1.7-1 1.4-2.5 1.8-2.5.8-2.5 1.8.9 1.7 2.5 1.7 2.5-.7 2.5-1.7" />
    </svg>
  );
}

export function RedeemIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <rect x="3" y="3" width="18" height="6" rx="2" />
      <path d="M12 21V11" />
      <path d="m8 15 4-4 4 4" />
    </svg>
  );
}

export function ShieldIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function WalletIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <rect x="3" y="6" width="18" height="13" rx="3" />
      <path d="M16 12h.01M3 9h13a2 2 0 0 1 2 2" />
    </svg>
  );
}

export function ChartIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6" />
    </svg>
  );
}

export function CoinsIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <ellipse cx="9" cy="7" rx="6" ry="3" />
      <path d="M3 7v5c0 1.7 2.7 3 6 3s6-1.3 6-3" />
      <path d="M15 11.5c2.8.4 6 1.6 6 3.5 0 1.7-2.7 3-6 3s-6-1.3-6-3" />
    </svg>
  );
}

export function FlagIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M5 21V4M5 4h11l-2 4 2 4H5" />
    </svg>
  );
}

export function SproutIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M12 21v-7" />
      <path d="M12 14c0-3-2-5-6-5 0 3 2 5 6 5Z" />
      <path d="M12 12c0-3 2-5 6-5 0 3-2 5-6 5Z" />
    </svg>
  );
}

export function ArrowIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function XIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817-5.967 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

export function DiscordIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M20.317 4.369A19.79 19.79 0 0 0 15.885 3c-.21.375-.45.88-.617 1.28a18.27 18.27 0 0 0-5.54 0A12.6 12.6 0 0 0 9.11 3 19.74 19.74 0 0 0 4.677 4.37C1.61 8.94.78 13.39 1.19 17.78a19.9 19.9 0 0 0 6.06 3.06c.49-.67.93-1.39 1.3-2.14-.71-.27-1.39-.6-2.03-.99.17-.13.34-.26.5-.4 3.93 1.84 8.18 1.84 12.06 0 .16.14.33.27.5.4-.64.39-1.32.72-2.03.99.37.75.81 1.47 1.3 2.14a19.86 19.86 0 0 0 6.06-3.06c.48-5.1-.82-9.51-3.4-13.41ZM8.02 15.1c-1.18 0-2.15-1.09-2.15-2.42 0-1.34.95-2.42 2.15-2.42 1.21 0 2.18 1.09 2.16 2.42 0 1.33-.95 2.42-2.16 2.42Zm7.96 0c-1.18 0-2.15-1.09-2.15-2.42 0-1.34.95-2.42 2.15-2.42 1.21 0 2.18 1.09 2.16 2.42 0 1.33-.95 2.42-2.16 2.42Z" />
    </svg>
  );
}

export function TelegramIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M21.94 4.36 18.6 20.1c-.25 1.1-.9 1.38-1.83.86l-5.05-3.72-2.44 2.35c-.27.27-.5.5-1.02.5l.36-5.14L17.98 6.4c.41-.36-.09-.56-.63-.2L5.83 13.5l-4.97-1.56c-1.08-.34-1.1-1.08.23-1.6L20.54 2.8c.9-.33 1.69.2 1.4 1.56Z" />
    </svg>
  );
}

export function GithubIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 1.5A10.5 10.5 0 0 0 8.68 22c.52.1.71-.23.71-.5v-1.96c-2.9.63-3.52-1.24-3.52-1.24-.48-1.21-1.16-1.53-1.16-1.53-.95-.65.07-.64.07-.64 1.05.08 1.6 1.08 1.6 1.08.93 1.6 2.44 1.14 3.04.87.09-.68.36-1.14.66-1.4-2.32-.26-4.76-1.16-4.76-5.15 0-1.14.41-2.07 1.07-2.8-.1-.27-.46-1.32.1-2.76 0 0 .88-.28 2.88 1.07a9.9 9.9 0 0 1 5.24 0c2-1.35 2.88-1.07 2.88-1.07.57 1.44.21 2.49.1 2.76.67.73 1.07 1.66 1.07 2.8 0 4-2.45 4.88-4.78 5.14.37.33.71.97.71 1.96v2.9c0 .28.18.61.72.5A10.5 10.5 0 0 0 12 1.5Z" />
    </svg>
  );
}
