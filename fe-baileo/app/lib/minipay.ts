import { useSyncExternalStore } from "react";

/** Read the injected provider without relying on a global type declaration. */
function getEthereum(): { isMiniPay?: boolean } | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { ethereum?: { isMiniPay?: boolean } }).ethereum;
}

// MiniPay injects a static provider, so a no-op subscribe is enough.
const subscribe = () => () => {};

/**
 * True when the dApp is opened inside Opera MiniPay.
 * MiniPay sets `window.ethereum.isMiniPay = true` and auto-connects the wallet,
 * so apps should detect it and hide their own "Connect Wallet" button.
 */
export function useIsMiniPay(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => Boolean(getEthereum()?.isMiniPay),
    () => false,
  );
}
