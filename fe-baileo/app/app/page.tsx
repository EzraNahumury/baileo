"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useBalance,
  useChainId,
  useConnect,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { celo } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { formatEther, parseEther } from "viem";
import Background from "../components/Background";
import { BAILEO_ADDRESS, RATE, baileoAbi } from "../lib/baileo";
import { useIsMiniPay } from "../lib/minipay";
import { links, shortAddr } from "../lib/site";
import { DepositIcon, RedeemIcon, ArrowIcon } from "../components/Icons";

function fmt(v?: bigint, dp = 4) {
  if (v === undefined) return "0";
  const n = Number(formatEther(v));
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString(undefined, { maximumFractionDigits: dp });
}

function parse(a: string): bigint {
  try {
    return a && Number(a) > 0 ? parseEther(a as `${number}`) : 0n;
  } catch {
    return 0n;
  }
}

export default function AppPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const wrongChain = isConnected && chainId !== celo.id;

  // MiniPay: auto-connect the injected wallet and hide the Connect button.
  const isMiniPay = useIsMiniPay();
  const { connect } = useConnect();
  useEffect(() => {
    if (isMiniPay && !isConnected) {
      connect({ connector: injected() });
    }
  }, [isMiniPay, isConnected, connect]);

  const { data: celoBal, refetch: refetchCelo } = useBalance({
    address,
    query: { enabled: !!address },
  });
  const { data: baileoBal, refetch: refetchBaileo } = useReadContract({
    address: BAILEO_ADDRESS,
    abi: baileoAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
  const { data: reserve, refetch: refetchReserve } = useReadContract({
    address: BAILEO_ADDRESS,
    abi: baileoAbi,
    functionName: "totalCollateral",
  });

  const [tab, setTab] = useState<"deposit" | "withdraw">("deposit");
  const [depositAmt, setDepositAmt] = useState("");
  const [withdrawAmt, setWithdrawAmt] = useState("");

  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (!isSuccess) return;
    refetchCelo();
    refetchBaileo();
    refetchReserve();
    // defer form reset so it isn't a synchronous setState inside the effect body
    queueMicrotask(() => {
      setDepositAmt("");
      setWithdrawAmt("");
    });
  }, [isSuccess, refetchCelo, refetchBaileo, refetchReserve]);

  const depAmt = parse(depositAmt);
  const wdAmt = parse(withdrawAmt);
  const depOk = depAmt > 0n && !!celoBal && depAmt <= celoBal.value && !wrongChain;
  const wdOk = wdAmt > 0n && baileoBal !== undefined && wdAmt <= (baileoBal as bigint) && !wrongChain;
  const busy = isPending || confirming;

  const doDeposit = () =>
    writeContract({
      address: BAILEO_ADDRESS,
      abi: baileoAbi,
      functionName: "deposit",
      value: depAmt,
    });

  const doWithdraw = () =>
    writeContract({
      address: BAILEO_ADDRESS,
      abi: baileoAbi,
      functionName: "withdraw",
      args: [wdAmt],
    });

  return (
    <>
      <Background />

      {/* top bar */}
      <header className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-[rgba(5,5,5,0.7)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-20 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-lg font-semibold tracking-[0.35em] text-[var(--color-cream)]">
              BAILEO
            </span>
            <span className="hidden text-[10px] tracking-[0.4em] text-[var(--color-gold)] sm:inline">
              APP
            </span>
          </Link>
          {isMiniPay ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-black/30 px-4 py-2 text-xs text-[var(--color-champagne)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)] animate-glow" />
              MiniPay{address ? ` · ${address.slice(0, 6)}…${address.slice(-4)}` : ""}
            </span>
          ) : (
            <ConnectButton showBalance={false} accountStatus="address" chainStatus="icon" />
          )}
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--color-gold)]">
            Baileo Vault
          </p>
          <h1 className="font-display mt-3 text-3xl font-bold text-[var(--color-cream)] sm:text-4xl">
            Save & redeem on <span className="gold-text">Celo</span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
            Deposit CELO to mint BAILEO at 1&nbsp;:&nbsp;1000, and burn BAILEO to
            withdraw your CELO anytime.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-6 lg:grid-cols-[1fr_1.1fr]">
            {/* balances */}
            <section className="glass rounded-3xl p-6 sm:p-7">
              <h2 className="font-display text-lg font-semibold text-[var(--color-cream)]">
                Your Position
              </h2>
              <div className="mt-5 space-y-3">
                <Stat label="CELO Balance" value={isConnected ? `${fmt(celoBal?.value)} CELO` : "—"} />
                <Stat
                  label="BAILEO Balance"
                  value={isConnected ? `${fmt(baileoBal as bigint | undefined)} BAILEO` : "—"}
                  gold
                />
                <Stat label="Protocol Reserve" value={`${fmt(reserve as bigint | undefined)} CELO`} />
              </div>

              <div className="mt-6 rounded-2xl border border-[var(--color-line)] bg-black/30 p-4 text-center">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-muted)]">
                  Fixed Rate
                </p>
                <p className="font-display mt-1 text-xl font-bold gold-text">
                  1 CELO = {RATE.toString()} BAILEO
                </p>
              </div>

              <a
                href={links.celoscan}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-xs text-[var(--color-champagne)] transition-colors hover:text-[var(--color-gold)]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)] animate-glow" />
                Contract · {shortAddr}
              </a>
            </section>

            {/* action panel */}
            <section className="glass rounded-3xl p-6 sm:p-7">
              {!isConnected ? (
                <div className="flex h-full min-h-64 flex-col items-center justify-center gap-5 text-center">
                  {isMiniPay ? (
                    <>
                      <span className="h-7 w-7 animate-spin rounded-full border-2 border-[var(--color-line)] border-t-[var(--color-gold)]" />
                      <p className="font-display text-xl text-[var(--color-cream)]">
                        Connecting via MiniPay…
                      </p>
                      <p className="max-w-xs text-sm text-[var(--color-muted)]">
                        Your MiniPay wallet is connecting automatically.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-display text-xl text-[var(--color-cream)]">
                        Connect your wallet
                      </p>
                      <p className="max-w-xs text-sm text-[var(--color-muted)]">
                        Connect a Celo-compatible wallet to deposit CELO and start
                        saving with Baileo.
                      </p>
                      <ConnectButton />
                    </>
                  )}
                </div>
              ) : (
                <>
                  {/* tabs */}
                  <div className="mb-6 grid grid-cols-2 gap-1 rounded-full border border-[var(--color-line)] bg-black/30 p-1">
                    <TabButton active={tab === "deposit"} onClick={() => { setTab("deposit"); reset(); }}>
                      <DepositIcon className="h-4 w-4" /> Deposit
                    </TabButton>
                    <TabButton active={tab === "withdraw"} onClick={() => { setTab("withdraw"); reset(); }}>
                      <RedeemIcon className="h-4 w-4" /> Withdraw
                    </TabButton>
                  </div>

                  {wrongChain && (
                    <p className="mb-4 rounded-xl border border-[var(--color-gold)]/40 bg-[rgba(214,168,79,0.08)] px-4 py-3 text-center text-xs text-[var(--color-gold-light)]">
                      Wrong network — switch to Celo Mainnet using the button
                      above.
                    </p>
                  )}

                  {tab === "deposit" ? (
                    <Field
                      label="You deposit"
                      unit="CELO"
                      value={depositAmt}
                      onChange={setDepositAmt}
                      onMax={() => celoBal && setDepositAmt(formatEther(celoBal.value))}
                      hint={`You receive ≈ ${fmt(depAmt * RATE)} BAILEO`}
                    />
                  ) : (
                    <Field
                      label="You burn"
                      unit="BAILEO"
                      value={withdrawAmt}
                      onChange={setWithdrawAmt}
                      onMax={() => baileoBal !== undefined && setWithdrawAmt(formatEther(baileoBal as bigint))}
                      hint={`You receive ≈ ${fmt(wdAmt / RATE)} CELO`}
                    />
                  )}

                  <button
                    onClick={tab === "deposit" ? doDeposit : doWithdraw}
                    disabled={busy || (tab === "deposit" ? !depOk : !wdOk)}
                    className="gold-btn mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {busy
                      ? "Confirming…"
                      : tab === "deposit"
                        ? "Deposit CELO"
                        : "Withdraw CELO"}
                    {!busy && <ArrowIcon className="h-4 w-4" />}
                  </button>

                  {/* tx status */}
                  {hash && (
                    <div className="mt-4 rounded-xl border border-[var(--color-line)] bg-black/30 px-4 py-3 text-xs">
                      <p className={isSuccess ? "text-[var(--color-gold-light)]" : "text-[var(--color-muted)]"}>
                        {isSuccess ? "✓ Transaction confirmed" : confirming ? "Waiting for confirmation…" : "Transaction sent"}
                      </p>
                      <a
                        href={`https://celoscan.io/tx/${hash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block break-all text-[var(--color-champagne)] underline-offset-2 hover:underline"
                      >
                        {hash.slice(0, 14)}…{hash.slice(-8)}
                      </a>
                    </div>
                  )}
                  {error && (
                    <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
                      {(error as { shortMessage?: string }).shortMessage ?? "Transaction failed or rejected."}
                    </p>
                  )}
                </>
              )}
            </section>
          </div>
      </main>
    </>
  );
}

function Stat({ label, value, gold }: { label: string; value: string; gold?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[var(--color-line)] bg-black/30 px-4 py-3.5">
      <span className="text-xs uppercase tracking-wider text-[var(--color-muted)]">{label}</span>
      <span className={`font-display text-base font-semibold ${gold ? "gold-text" : "text-[var(--color-cream)]"}`}>
        {value}
      </span>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium transition-colors ${
        active ? "bg-[var(--color-gold)] text-[#2a1d05]" : "text-[var(--color-muted)] hover:text-[var(--color-champagne)]"
      }`}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  unit,
  value,
  onChange,
  onMax,
  hint,
}: {
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  onMax: () => void;
  hint: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs text-[var(--color-muted)]">
        <span className="uppercase tracking-wider">{label}</span>
        <button onClick={onMax} className="text-[var(--color-gold)] hover:underline">
          Max
        </button>
      </div>
      <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-line)] bg-black/40 px-4 py-3.5 focus-within:border-[var(--color-gold)]">
        <input
          inputMode="decimal"
          placeholder="0.0"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
          className="w-full bg-transparent font-display text-2xl text-[var(--color-cream)] outline-none placeholder:text-[var(--color-muted)]/50"
        />
        <span className="shrink-0 text-sm font-semibold text-[var(--color-champagne)]">{unit}</span>
      </div>
      <p className="mt-2 text-xs text-[var(--color-muted)]">{hint}</p>
    </div>
  );
}
