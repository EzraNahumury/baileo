import type { ReactElement, SVGProps } from "react";
import Reveal from "./Reveal";
import { DepositIcon, MintIcon, RedeemIcon, ShieldIcon } from "./Icons";

const features: {
  Icon: (p: SVGProps<SVGSVGElement>) => ReactElement;
  title: string;
  desc: string;
}[] = [
  {
    Icon: DepositIcon,
    title: "Deposit CELO",
    desc: "Send CELO into the Baileo vault and turn it into BAILEO at a fixed protocol rate — no paperwork, no middlemen.",
  },
  {
    Icon: MintIcon,
    title: "Mint BAILEO",
    desc: "Every 1 CELO deposited mints 1000 BAILEO as your digital saving receipt, held directly in your wallet.",
  },
  {
    Icon: RedeemIcon,
    title: "Withdraw Anytime",
    desc: "Burn BAILEO and withdraw your CELO back from the reserve whenever you want. Your funds, your control.",
  },
  {
    Icon: ShieldIcon,
    title: "On-chain Transparency",
    desc: "Fully reserve-backed and verifiable on Celo Mainnet. Simple, transparent saving with zero monthly fees.",
  },
];

export default function Features() {
  return (
    <section id="protocol" className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--color-gold)]">
          The Protocol
        </p>
        <h2 className="font-display mt-3 text-3xl font-bold text-[var(--color-cream)] sm:text-4xl">
          Saving, made <span className="gold-text">effortless</span>
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted)]">
          Four simple guarantees that keep your digital value safe, liquid, and
          fully on-chain.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ Icon, title, desc }, i) => (
          <Reveal key={title} delay={i * 90} className="group text-center sm:text-left">
            <div className="relative mx-auto mb-6 inline-flex sm:mx-0">
              <span aria-hidden className="glow-blob absolute -inset-3 opacity-50 transition-opacity duration-500 group-hover:opacity-90" />
              <span
                className="relative flex h-16 w-16 items-center justify-center rounded-2xl text-[#3a2a0e] shadow-[0_14px_34px_-10px_rgba(214,168,79,0.6),inset_0_1px_0_rgba(255,255,255,0.6)] transition-transform duration-500 group-hover:-translate-y-1"
                style={{
                  background:
                    "radial-gradient(circle at 32% 26%, #fff3cf, #ecc471 38%, #c8923c 72%, #94661f 100%)",
                }}
              >
                <Icon className="h-7 w-7" strokeWidth={1.8} />
              </span>
            </div>
            <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-[var(--color-cream)]">
              {title}
            </h3>
            <div className="my-3 h-px w-12 bg-[var(--color-line)] mx-auto sm:mx-0" />
            <p className="text-sm leading-relaxed text-[var(--color-muted)]">{desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
