import Reveal from "./Reveal";
import { WalletIcon, DepositIcon, MintIcon, RedeemIcon } from "./Icons";

const steps = [
  { Icon: WalletIcon, title: "Connect Wallet", desc: "Link a Celo-compatible wallet to access the Baileo protocol." },
  { Icon: DepositIcon, title: "Deposit CELO", desc: "Send any amount of CELO into the on-chain Baileo reserve." },
  { Icon: MintIcon, title: "Receive BAILEO", desc: "Instantly mint 1000 BAILEO for every 1 CELO you deposit." },
  { Icon: RedeemIcon, title: "Redeem Anytime", desc: "Burn BAILEO to withdraw your CELO back — no lock-ups, no fees." },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--color-gold)]">
          How It Works
        </p>
        <h2 className="font-display mt-3 text-3xl font-bold text-[var(--color-cream)] sm:text-4xl">
          Four steps to <span className="gold-text">on-chain saving</span>
        </h2>
      </Reveal>

      <div className="relative mt-16">
        {/* connecting line (desktop) */}
        <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-[var(--color-line)] to-transparent lg:block" />

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map(({ Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 110} className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="relative z-10 mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--color-line)] bg-[var(--color-ink-3)]">
                <Icon className="h-6 w-6 text-[var(--color-gold)]" />
                <span className="font-display absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-gold)] text-xs font-bold text-[#2a1d05]">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-[var(--color-cream)]">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
