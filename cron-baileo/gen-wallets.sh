#!/usr/bin/env bash
# Generate WALLET_COUNT fresh wallets.
#   -> wallet-keys.txt  (private keys, SECRET, gitignored)
#   -> addresses.txt    (addresses, public)
# Run once. Re-running OVERWRITES existing wallets.
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/config.sh"

if [ -s "$KEYS_FILE" ]; then
  echo "REFUSING: $KEYS_FILE already has wallets. Delete it first to regenerate." >&2
  exit 1
fi

: > "$KEYS_FILE"
chmod 600 "$KEYS_FILE"
: > "$ADDR_FILE"

for i in $(seq 1 "$WALLET_COUNT"); do
  out="$("$CAST" wallet new)"
  addr="$(printf '%s\n' "$out" | awk '/Address/{print $2}')"
  pk="$(printf '%s\n' "$out" | awk '/Private key/{print $3}')"
  if [ -z "$addr" ] || [ -z "$pk" ]; then
    echo "FAILED to parse cast output at wallet $i" >&2
    exit 1
  fi
  printf '%s\n' "$pk"   >> "$KEYS_FILE"
  printf '%s\n' "$addr" >> "$ADDR_FILE"
  printf '[%3d/%d] %s\n' "$i" "$WALLET_COUNT" "$addr"
done

echo "DONE: $WALLET_COUNT wallets -> $KEYS_FILE (keys) + $ADDR_FILE (addresses)"
