import { links } from "../lib/site";
import { XIcon, DiscordIcon, TelegramIcon, GithubIcon } from "./Icons";

const cols = [
  {
    title: "Protocol",
    items: [
      { label: "How It Works", href: "#how" },
      { label: "Token Rate", href: "#token" },
      { label: "Roadmap", href: "#roadmap" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Docs", href: links.docs },
      { label: "GitHub", href: links.github },
      { label: "Contract", href: links.celoscan },
    ],
  },
  {
    title: "Network",
    items: [
      { label: "Celo", href: links.celo },
      { label: "Celoscan", href: links.celoscan },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-12 border-t border-[var(--color-line)]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <p className="font-display text-2xl font-semibold tracking-[0.3em] text-[var(--color-cream)]">
              BAILEO
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--color-muted)]">
              On-chain savings on Celo Mainnet. Save CELO, hold BAILEO, and
              redeem anytime — transparent, simple, and free of monthly fees.
            </p>
            <div className="mt-6 flex items-center gap-4 text-[var(--color-muted)]">
              <a href={links.celo} target="_blank" rel="noreferrer" aria-label="Telegram" className="transition-colors hover:text-[var(--color-gold)]">
                <TelegramIcon className="h-5 w-5" />
              </a>
              <a href={links.celo} target="_blank" rel="noreferrer" aria-label="Discord" className="transition-colors hover:text-[var(--color-gold)]">
                <DiscordIcon className="h-5 w-5" />
              </a>
              <a href={links.github} target="_blank" rel="noreferrer" aria-label="X" className="transition-colors hover:text-[var(--color-gold)]">
                <XIcon className="h-4 w-4" />
              </a>
              <a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="transition-colors hover:text-[var(--color-gold)]">
                <GithubIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)]">
                {col.title}
              </p>
              <ul className="mt-4 space-y-3 text-sm">
                {col.items.map((it) => (
                  <li key={it.label}>
                    <a
                      href={it.href}
                      target={it.href.startsWith("#") ? undefined : "_blank"}
                      rel={it.href.startsWith("#") ? undefined : "noreferrer"}
                      className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-champagne)]"
                    >
                      {it.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-line)] pt-8 text-xs text-[var(--color-muted)] sm:flex-row">
          <p>© {new Date().getFullYear()} Baileo. Built on Celo Mainnet.</p>
          <p className="font-display tracking-wider">1 CELO ⇄ 1000 BAILEO</p>
        </div>
      </div>
    </footer>
  );
}
