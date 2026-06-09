import Reveal from "./Reveal";
import { ShieldIcon, CoinsIcon, FlagIcon, WalletIcon, SproutIcon } from "./Icons";

const phases = [
  { Icon: ShieldIcon, tag: "Phase 01", title: "Protocol Foundation", desc: "BAILEO ERC-20 token and the savings vault, built around a fixed 1:1000 peg.", status: "Done" },
  { Icon: CoinsIcon, tag: "Phase 02", title: "Deposit & Redeem Flow", desc: "Reentrancy-safe deposit and withdraw, covered by a full automated test suite.", status: "Done" },
  { Icon: FlagIcon, tag: "Phase 03", title: "Celo Mainnet Launch", desc: "Contract deployed and verified on Celo Mainnet, fully reserve-backed.", status: "Live" },
  { Icon: WalletIcon, tag: "Phase 04", title: "App & Community", desc: "A polished web app to connect, deposit and withdraw — plus docs and community.", status: "Next" },
  { Icon: SproutIcon, tag: "Phase 05", title: "Ecosystem Expansion", desc: "External audits, integrations, and growth across the wider Celo ecosystem.", status: "Soon" },
];

const done = (s: string) => s === "Done" || s === "Live";

export default function Roadmap() {
  return (
    <section id="roadmap" className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <Reveal className="text-center">
        <h2 className="font-display text-3xl font-bold uppercase tracking-wide gold-text sm:text-5xl">
          Baileo Roadmap
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted)]">
          The Baileo journey — from a transparent reserve to a thriving on-chain
          savings ecosystem.
        </p>
      </Reveal>

      <div className="relative mt-16">
        <div className="absolute left-[27px] top-0 h-full w-px bg-gradient-to-b from-[var(--color-line)] via-[var(--color-line)] to-transparent lg:left-0 lg:right-0 lg:top-7 lg:h-px lg:w-full lg:bg-gradient-to-r" />

        <div className="grid gap-10 lg:grid-cols-5 lg:gap-5">
          {phases.map(({ Icon, tag, title, desc, status }, i) => (
            <Reveal key={tag} delay={i * 90} className="relative flex gap-5 lg:flex-col lg:gap-0">
              <div className="relative z-10 shrink-0">
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-full border lg:h-14 lg:w-14 ${
                    done(status)
                      ? "border-[var(--color-gold)] bg-[rgba(214,168,79,0.12)] text-[var(--color-gold)] shadow-[0_0_30px_-6px_rgba(214,168,79,0.6)]"
                      : "border-[var(--color-line)] bg-[var(--color-ink-3)] text-[var(--color-muted)]"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  {status === "Live" && (
                    <span className="absolute -right-0.5 -top-0.5 h-3 w-3 animate-glow rounded-full bg-[var(--color-gold-light)]" />
                  )}
                </span>
              </div>

              <div className="lg:mt-6">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">
                    {tag}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                      done(status)
                        ? "bg-[rgba(214,168,79,0.15)] text-[var(--color-gold-light)]"
                        : "bg-white/5 text-[var(--color-muted)]"
                    }`}
                  >
                    {status}
                  </span>
                </div>
                <h3 className="font-display mt-2 text-lg font-semibold text-[var(--color-cream)]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
