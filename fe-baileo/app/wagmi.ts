import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { celo } from "wagmi/chains";
import { http } from "wagmi";

// WalletConnect Cloud project id — needed for mobile / WalletConnect wallets.
// Injected wallets (MetaMask, Rabby, Coinbase, OKX, Phantom…) work without it.
// Set NEXT_PUBLIC_WC_PROJECT_ID in .env.local (get one at https://cloud.walletconnect.com).
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || "baileo_demo_project_id";

export const config = getDefaultConfig({
  appName: "Baileo",
  projectId,
  chains: [celo],
  transports: {
    [celo.id]: http("https://forno.celo.org"),
  },
  ssr: true,
});
