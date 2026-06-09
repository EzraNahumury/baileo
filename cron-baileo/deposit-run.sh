#!/usr/bin/env bash
# One cron run: every wallet deposits DEPOSIT_AMOUNT (default 0.001 CELO) into
# the Baileo contract. WALLET_COUNT wallets -> WALLET_COUNT tx per run.
# Keys are read from KEYS_FILE (default wallet-keys.txt locally; /tmp file in CI).
# Per-wallet failures are logged but do NOT abort the run.
set -uo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/config.sh"

[ -s "$KEYS_FILE" ] || { echo "no keys file: $KEYS_FILE" >&2; exit 1; }

echo "Contract: $CONTRACT"
echo "RPC     : $RPC"
echo "Amount  : $DEPOSIT_AMOUNT per deposit"
echo

ok=0; fail=0; i=0
while read -r pk; do
  [ -n "$pk" ] || continue
  i=$((i+1))
  printf '[%3d] deposit %s ... ' "$i" "$DEPOSIT_AMOUNT"
  if "$CAST" send "$CONTRACT" "deposit()" --value "$DEPOSIT_AMOUNT" \
       --private-key "$pk" --rpc-url "$RPC" >/dev/null 2>&1; then
    echo ok;   ok=$((ok+1))
  else
    echo FAIL; fail=$((fail+1))
  fi
  sleep 1   # be gentle on the public RPC
done < "$KEYS_FILE"

echo
echo "=== deposits: $ok ok, $fail fail (of $i) ==="
# Only fail the CI job if EVERY deposit failed (transient single failures are fine).
[ "$ok" -gt 0 ]
