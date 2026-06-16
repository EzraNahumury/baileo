#!/usr/bin/env bash
# Fresh-wallet run: every run uses BRAND NEW wallets so DAU keeps growing.
#
# For each of the WALLET_COUNT source wallets (KEYS_FILE = the original funded
# wallets, kept in the WALLET_KEYS secret):
#   1. generate a fresh throwaway wallet
#   2. source wallet sends it just enough CELO (deposit value + gas budget)
#   3. the fresh wallet calls deposit(DEPOSIT_VALUE_WEI) on Baileo, then is discarded
#
# Result: WALLET_COUNT new unique depositors per run. The source wallets are the
# treasury that funds them. Throwaway keys are never stored.
set -uo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/config.sh"

[ -s "$KEYS_FILE" ] || { echo "no source keys: $KEYS_FILE" >&2; exit 1; }

# Gas price (with buffer) drives how much we must send to each fresh wallet.
# A legacy tx with an explicit gas price reserves exactly gasLimit*gasPrice, so
# funding = deposit value + gasLimit*gasPrice covers it with no guesswork.
GP="$("$CAST" gas-price --rpc-url "$RPC")"
PB=$(( GP * GAS_PRICE_BUFFER_PCT / 100 ))
GAS_BUDGET=$(( DEPOSIT_GAS_LIMIT * PB ))
FUND_WEI=$(( DEPOSIT_VALUE_WEI + GAS_BUDGET ))

echo "Contract : $CONTRACT"
echo "gas price: $GP wei (buffered $PB)"
echo "fund/new : $("$CAST" from-wei "$FUND_WEI") CELO  (deposit $("$CAST" from-wei "$DEPOSIT_VALUE_WEI") + gas)"
echo

# cast send with retry (forno drops sequential sends often).
send() {
  local label="$1"; shift
  local t
  for t in $(seq 1 "$SEND_RETRIES"); do
    if "$CAST" send "$@" >/dev/null 2>&1; then return 0; fi
    sleep 3
  done
  echo "    ($label failed after $SEND_RETRIES tries)"
  return 1
}

ok=0; fail=0; i=0
while read -r src_pk; do
  [ -n "$src_pk" ] || continue
  i=$((i+1))

  # 1. fresh throwaway wallet
  out="$("$CAST" wallet new)"
  naddr="$(printf '%s\n' "$out" | awk '/Address/{print $2}')"
  npk="$(printf '%s\n' "$out" | awk '/Private key/{print $3}')"

  printf '[%3d] new %s ... ' "$i" "$naddr"

  # 2. source funds the fresh wallet (legacy, explicit gas)
  if ! send "fund" "$naddr" --value "$FUND_WEI" --legacy --gas-price "$PB" --gas-limit 21000 \
        --private-key "$src_pk" --rpc-url "$RPC"; then
    echo "FUND-FAIL"; fail=$((fail+1)); continue
  fi

  # 3. fresh wallet deposits (legacy, explicit gas so reserve == funded budget)
  if send "deposit" "$CONTRACT" "deposit()" --value "$DEPOSIT_VALUE_WEI" --legacy \
        --gas-price "$PB" --gas-limit "$DEPOSIT_GAS_LIMIT" \
        --private-key "$npk" --rpc-url "$RPC"; then
    echo "deposit ok"; ok=$((ok+1))
  else
    echo "DEPOSIT-FAIL"; fail=$((fail+1))
  fi

  sleep 1
done < "$KEYS_FILE"

echo
echo "=== fresh deposits: $ok ok, $fail fail (of $i sources) ==="
[ "$ok" -gt 0 ]
