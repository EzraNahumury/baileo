import Reveal from "./Reveal";
import { links, shortAddr } from "../lib/site";
import { ArrowIcon } from "./Icons";

const stats = [
  { value: "1 : 1000", label: "Peg Rate", sub: "CELO to BAILEO" },
  { value: "100%", label: "Reserve", sub: "On-chain backed" },
  { value: "0", label: "Monthly Fees", sub: "Forever" },
  { value: "42220", label: "Network", sub: "Celo Mainnet" },
];

export default function Stats() {
  return (
    <section id="token" className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <Reveal className="glass relative overflow-hidden rounded-[28px] p-8 sm:p-12">
        <span aria-hidden className="glow-blob absolute -right-20 -top-24 h-72 w-72 opacity-60" />

        <div className="relative grid items-center gap-12 lg:grid-cols-2">
          {/* conversion display */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--color-gold)]">
              Token Rate
            </p>
            <h2 className="font-display mt-3 text-3xl font-bold text-[var(--color-cream)] sm:text-4xl">
              A fixed, fair exchange
            </h2>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4 rounded-2xl border border-[var(--color-line)] bg-black/30 px-5 py-4">
                <span className="font-display text-2xl font-bold text-[var(--color-cream)] sm:text-3xl">
                  1 <span className="text-sm font-normal text-[var(--color-muted)]">CELO</span>
                </span>
                <ArrowIcon className="h-5 w-5 text-[var(--color-gold)]" />
                <span className="font-display text-2xl font-bold gold-text sm:text-3xl">
                  1000 <span className="text-sm font-normal text-[var(--color-muted)]">BAILEO</span>
                </span>
              </div>
              <div className="flex items-center gap-4 rounded-2xl border border-[var(--color-line)] bg-black/30 px-5 py-4">
                <span className="font-display text-2xl font-bold gold-text sm:text-3xl">
                  1000 <span className="text-sm font-normal text-[var(--color-muted)]">BAILEO</span>
                </span>
                <ArrowIcon className="h-5 w-5 text-[var(--color-gold)]" />
                <span className="font-display text-2xl font-bold text-[var(--color-cream)] sm:text-3xl">
                  1 <span className="text-sm font-normal text-[var(--color-muted)]">CELO</span>
                </span>
              </div>
            </div>

            <a
              href={links.celoscan}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-black/30 px-4 py-2 text-xs text-[var(--color-champagne)] transition-colors hover:border-[var(--color-gold)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)] animate-glow" />
              Live contract&nbsp;·&nbsp;{shortAddr}
            </a>
          </div>

          {/* stat cards */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-[var(--color-line)] bg-black/30 p-5 transition-transform duration-300 hover:-translate-y-1"
              >
                <p className="font-display text-2xl font-bold gold-text sm:text-3xl">{s.value}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-cream)]">
                  {s.label}
                </p>
                <p className="text-[11px] text-[var(--color-muted)]">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
