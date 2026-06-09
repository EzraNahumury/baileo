import Link from "next/link";
import TokenCard from "./TokenCard";
import { ShieldIcon, ChartIcon, CoinsIcon, ArrowIcon } from "./Icons";

export default function Hero() {
  return (
    <section className="relative mx-auto max-w-7xl px-5 pt-28 pb-20 sm:px-8 sm:pt-36 lg:pb-28">
      {/* floating gold nuggets */}
      <div
        aria-hidden
        className="nugget animate-float-slow pointer-events-none absolute -right-6 top-24 hidden h-44 w-52 rotate-6 sm:block lg:right-2 lg:h-56 lg:w-64"
      />
      <div
        aria-hidden
        className="nugget animate-float pointer-events-none absolute -left-10 top-[34%] hidden h-40 w-48 -rotate-12 md:block lg:h-52 lg:w-60"
      />

      {/* headline */}
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <p className="animate-rise mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-black/30 px-4 py-1.5 text-[11px] tracking-[0.28em] text-[var(--color-champagne)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)] animate-glow" />
          WEB3 SAVINGS PROTOCOL · CELO MAINNET
        </p>

        <h1 className="font-display uppercase leading-[0.98] tracking-tight">
          <span
            className="animate-rise block text-3xl italic gold-text sm:text-5xl"
            style={{ animationDelay: "80ms" }}
          >
            Baileo —
          </span>
          <span
            className="animate-rise mt-2 block text-4xl font-bold text-[var(--color-cream)] sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "180ms" }}
          >
            Digital Savings on
          </span>
          <span
            className="animate-rise mt-1 block text-4xl font-bold text-[var(--color-cream)] sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "280ms" }}
          >
            the <span className="gold-text">Celo</span> Blockchain
          </span>
        </h1>

        <p
          className="animate-rise mx-auto mt-7 max-w-xl text-sm leading-relaxed text-[var(--color-muted)] sm:text-base"
          style={{ animationDelay: "380ms" }}
        >
          Save CELO, receive BAILEO, and redeem anytime through a transparent
          on-chain reserve. A simple place to store digital value — with no
          monthly fees eating your balance.
        </p>

        <div
          className="animate-rise mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={{ animationDelay: "480ms" }}
        >
          <Link
            href="/app"
            className="gold-btn inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold sm:w-auto"
          >
            Start Saving
            <ArrowIcon className="h-4 w-4" />
          </Link>
          <Link
            href="#protocol"
            className="ghost-btn inline-flex w-full items-center justify-center rounded-full px-7 py-3.5 text-sm font-medium sm:w-auto"
          >
            Learn Protocol
          </Link>
        </div>
      </div>

      {/* connector nodes */}
      <div className="relative z-10 mx-auto mt-14 hidden max-w-md items-center justify-between lg:flex">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--color-line)]" />
        {[CoinsIcon, ChartIcon, ShieldIcon].map((Icon, i) => (
          <span key={i} className="mx-1 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-line)] bg-black/40 text-[var(--color-gold)]">
            <Icon className="h-5 w-5" />
          </span>
        ))}
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--color-line)]" />
      </div>

      {/* intro composition: text · card · text */}
      <div className="relative z-10 mt-12 grid items-center gap-10 lg:mt-8 lg:grid-cols-12 lg:gap-6">
        <div className="order-2 lg:order-1 lg:col-span-4">
          <div className="glass rounded-2xl p-5">
            <p className="text-sm leading-relaxed text-[var(--color-champagne)]">
              Baileo blends the discipline of saving with the openness of the
              blockchain — every deposit is reserve-backed and visible on-chain.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              {[
                { Icon: ShieldIcon, label: "Reserve" },
                { Icon: ChartIcon, label: "Transparent" },
                { Icon: CoinsIcon, label: "Instant" },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5">
                  <Icon className="h-5 w-5 text-[var(--color-gold)]" />
                  <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="order-1 flex justify-center lg:order-2 lg:col-span-4">
          <TokenCard />
        </div>

        <div className="order-3 lg:col-span-4">
          <p className="font-display text-lg leading-snug text-[var(--color-cream)] sm:text-xl">
            A digital asset that{" "}
            <span className="gold-text">protects your savings</span> — secure
            like a vault, transparent like the blockchain.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
            1 CELO mints 1000 BAILEO as your saving receipt. Burn it to redeem
            your CELO back, anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
