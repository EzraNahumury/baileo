#!/usr/bin/env bash
# One-time: fund every generated wallet with FUND_AMOUNT (default 1 CELO) from
# the funder wallet. Funder key comes from FUNDER_PRIVATE_KEY (set in .env).
# Run LOCALLY (WSL) so the funder key never leaves your machine.
set -uo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/config.sh"

[ -n "${FUNDER_PRIVATE_KEY:-}" ] || { echo "set FUNDER_PRIVATE_KEY in cron-baileo/.env (copy .env.example)" >&2; exit 1; }
[ -s "$ADDR_FILE" ] || { echo "no addresses; run gen-wallets.sh first" >&2; exit 1; }

funder="$("$CAST" wallet address "$FUNDER_PRIVATE_KEY")"
bal_wei="$("$CAST" balance "$funder" --rpc-url "$RPC")"
echo "Funder : $funder"
echo "Balance: $("$CAST" from-wei "$bal_wei") CELO"
echo "Sending $FUND_AMOUNT to each of $WALLET_COUNT wallets (+ gas)."
echo

ok=0; fail=0; i=0
while read -r addr; do
  [ -n "$addr" ] || continue
  i=$((i+1))
  printf '[%3d] %s ... ' "$i" "$addr"
  if "$CAST" send "$addr" --value "$FUND_AMOUNT" \
       --private-key "$FUNDER_PRIVATE_KEY" --rpc-url "$RPC" >/dev/null 2>&1; then
    echo ok;   ok=$((ok+1))
  else
    echo FAIL; fail=$((fail+1))
  fi
done < "$ADDR_FILE"

echo
echo "=== distribution: $ok ok, $fail fail (of $i) ==="
[ "$fail" -eq 0 ]
