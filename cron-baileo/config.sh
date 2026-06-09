#!/usr/bin/env bash
# Shared config for Baileo deposit tooling.
# Sourced by gen-wallets.sh, distribute.sh, deposit-run.sh.
# Every value is overridable via env (so GitHub Actions / .env can override).

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load local secrets (FUNDER_PRIVATE_KEY) if present. Never committed.
if [ -f "$HERE/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  . "$HERE/.env"
  set +a
fi

# cast binary: prefer PATH (GitHub Actions / foundryup), else WSL install path.
CAST="${CAST:-$(command -v cast 2>/dev/null || echo "$HOME/.foundry/bin/cast")}"

RPC="${RPC:-https://forno.celo.org}"                                   # Celo mainnet (chain 42220)
CONTRACT="${CONTRACT:-0x042fe63b0efbfc285b5afd49b832a15ea8262c3a}"     # deployed Baileo
DEPOSIT_AMOUNT="${DEPOSIT_AMOUNT:-0.001ether}"                         # per deposit tx
FUND_AMOUNT="${FUND_AMOUNT:-1ether}"                                  # per wallet on distribution
WALLET_COUNT="${WALLET_COUNT:-100}"

KEYS_FILE="${KEYS_FILE:-$HERE/wallet-keys.txt}"   # one private key per line (SECRET)
ADDR_FILE="${ADDR_FILE:-$HERE/addresses.txt}"     # one address per line (public)
