import { shortAddr } from "../lib/site";

export default function TokenCard() {
  return (
    <div className="group [perspective:1400px]">
      <div className="glass relative w-full max-w-sm rounded-[26px] p-6 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] transition-transform duration-700 ease-out will-change-transform [transform:rotateX(6deg)_rotateY(-14deg)] group-hover:[transform:rotateX(2deg)_rotateY(-6deg)] sm:p-7">
        {/* top row */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-muted)]">
              Token name
            </p>
            <p className="font-display text-3xl font-bold tracking-wide gold-text">BAILEO</p>
          </div>
          <span className="flex items-center gap-2 rounded-lg border border-[var(--color-line)] bg-black/30 px-2.5 py-1.5 text-[11px] text-[var(--color-champagne)]">
            {shortAddr}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-3.5 w-3.5">
              <rect x="9" y="9" width="11" height="11" rx="2" />
              <path d="M5 15V5a2 2 0 0 1 2-2h8" />
            </svg>
          </span>
        </div>

        {/* coin */}
        <div className="my-7 flex justify-center">
          <div className="coin flex h-40 w-40 items-center justify-center sm:h-44 sm:w-44">
            <div className="relative z-10 flex flex-col items-center">
              <span
                className="font-display text-5xl font-black leading-none text-[#6d4917]"
                style={{ textShadow: "0 1px 0 rgba(255,246,214,0.6), 0 -1px 1px rgba(74,48,16,0.7)" }}
              >
                B
              </span>
              <span className="mt-1 text-[8px] font-semibold tracking-[0.4em] text-[#7a5420]">
                BAILEO
              </span>
            </div>
          </div>
        </div>

        {/* bottom rows */}
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-line)] text-center">
          <div className="bg-black/40 px-3 py-3">
            <p className="text-[9px] uppercase tracking-[0.25em] text-[var(--color-muted)]">Rate</p>
            <p className="mt-1 text-sm font-semibold text-[var(--color-cream)]">1 CELO = 1000</p>
          </div>
          <div className="bg-black/40 px-3 py-3">
            <p className="text-[9px] uppercase tracking-[0.25em] text-[var(--color-muted)]">Network</p>
            <p className="mt-1 text-sm font-semibold text-[var(--color-cream)]">CELO</p>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-[var(--color-muted)]">
          Fully reserved · Withdraw anytime · No monthly fees
        </p>
      </div>
    </div>
  );
}
