#!/usr/bin/env bash
# Verify-and-top-up: ensure every generated wallet holds ~FUND_AMOUNT.
# Reads each address' on-chain balance; only funds wallets still near zero
# (so it NEVER double-funds and the total principal stays <= WALLET_COUNT CELO).
# Robust against forno's flaky sequential sends: retries each wallet.
set -uo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/config.sh"

[ -n "${FUNDER_PRIVATE_KEY:-}" ] || { echo "set FUNDER_PRIVATE_KEY in .env" >&2; exit 1; }
[ -s "$ADDR_FILE" ] || { echo "run gen-wallets.sh first" >&2; exit 1; }

# Fund any wallet whose balance is below this (0.5 CELO). Funded wallets (~1 CELO) are skipped.
THRESHOLD_WEI="500000000000000000"
RETRIES="${RETRIES:-4}"

funded=0; already=0; failed=0; i=0
while read -r addr; do
  [ -n "$addr" ] || continue
  i=$((i+1))
  bal="$("$CAST" balance "$addr" --rpc-url "$RPC" 2>/dev/null || echo 0)"
  if [ "$(printf '%s\n' "$bal $THRESHOLD_WEI" | awk '{print ($1>=$2)}')" = "1" ]; then
    printf '[%3d] %s  already funded (%s CELO) — skip\n' "$i" "$addr" "$("$CAST" from-wei "$bal")"
    already=$((already+1)); continue
  fi
  sent=0
  for try in $(seq 1 "$RETRIES"); do
    printf '[%3d] %s  fund try %d ... ' "$i" "$addr" "$try"
    if "$CAST" send "$addr" --value "$FUND_AMOUNT" --gas-limit 21000 \
         --private-key "$FUNDER_PRIVATE_KEY" --rpc-url "$RPC" >/dev/null 2>&1; then
      echo ok; sent=1; funded=$((funded+1)); break
    fi
    echo retry; sleep 3
  done
  [ "$sent" = 1 ] || { echo "    -> still FAILED after $RETRIES tries"; failed=$((failed+1)); }
  sleep 1
done < "$ADDR_FILE"

echo
echo "=== reconcile: $funded newly funded, $already already ok, $failed failed (of $i) ==="
[ "$failed" -eq 0 ]
