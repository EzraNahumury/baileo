# Baileo deposit cron

Runs `deposit()` on the Baileo contract 4×/day via GitHub Actions, from a
**fresh set of 100 wallets every run** so the unique-depositor count (DAU)
keeps growing.

Each run (`deposit-fresh.sh`):
1. The 100 original wallets (`WALLET_KEYS` secret) act as a treasury.
2. Each generates one brand-new throwaway wallet and sends it just enough CELO
   (deposit value + a gas budget computed from the live gas price).
3. Each fresh wallet calls `deposit(0.001 CELO)` once, then is discarded.

→ 100 new unique depositors per run, 400/day. 200 tx/run (100 transfers + 100
deposits). The treasury wallets drain ~0.025 CELO each per run.

- **Contract:** `0x042fe63b0efbfc285b5afd49b832a15ea8262c3a` (Celo mainnet, chain 42220)
- **Deposit:** `0.001 CELO` per fresh wallet per run
- **Schedule:** GitHub cron `17 2,8,14,20 * * *` (UTC, off-peak)
- **Tuning:** `DEPOSIT_GAS_LIMIT`, `GAS_PRICE_BUFFER_PCT` in `config.sh` control how
  much is sent per fresh wallet (lower them to waste less, at higher revert risk).

## Files

| File | Role | Secret? |
|------|------|---------|
| `config.sh` | shared config (contract, RPC, amounts, paths) | no |
| `gen-wallets.sh` | generate 100 wallets | — |
| `distribute.sh` | fund the 100 wallets from the funder (run **locally**) | reads `.env` |
| `deposit-run.sh` | one run = 100 deposits (used by GitHub Actions) | — |
| `wallet-keys.txt` | 100 private keys | **YES — gitignored** |
| `addresses.txt` | 100 addresses | gitignored |
| `.env` | funder private key | **YES — gitignored** |

The cron itself lives in `../.github/workflows/baileo-deposit-cron.yml`.

## Setup (one time)

1. **Wallets** — already generated (`gen-wallets.sh`). To redo: delete
   `wallet-keys.txt` then `bash gen-wallets.sh`.

2. **Upload wallet keys as a GitHub secret** (the cron reads this — funder key
   is NOT uploaded):
   ```bash
   gh secret set WALLET_KEYS < cron-baileo/wallet-keys.txt
   ```

3. **Commit + push** the workflow and scripts to `main` (scheduled workflows run
   only from the default branch):
   ```bash
   git add .github/workflows cron-baileo
   git commit -m "feat: baileo deposit cron"
   git push origin main
   ```

4. **Fund the wallets** (run locally in WSL, where `cast` lives — keeps the
   funder key on your machine):
   ```bash
   cp cron-baileo/.env.example cron-baileo/.env   # then put the funder key in it
   bash cron-baileo/distribute.sh                 # 1 CELO -> each of 100 wallets
   ```
   > Funder must hold a little over 100 CELO (100 for the wallets + gas).

## Run / verify

- Manual trigger: Actions tab → **Baileo deposit cron** → *Run workflow*
  (or `gh workflow run "Baileo deposit cron"`).
- After that it runs automatically 4×/day.

## Economics per wallet

1 CELO funds a wallet for months: each run spends `0.001 CELO` + gas
(~`0.0005 CELO`). At 4 runs/day ≈ `0.006 CELO/day` → lasts ~150+ days.
Deposited CELO is not lost — it mints BAILEO and is withdrawable via `withdraw()`.
