# 🏛️ Baileo — Smart Contract

Smart contract tabungan on-chain **Baileo** di **Celo Mainnet**. Setor CELO untuk
menerima token **BAILEO** sebagai bukti saldo (peg tetap **1 CELO = 1000 BAILEO**),
lalu tukar kembali kapan saja. **Tanpa biaya admin** — fully-collateralized.

> Lihat README utama project di [`../README.md`](../README.md).

---

## 📍 Deployment (Celo Mainnet)

| Item            | Nilai                                                                |
|-----------------|----------------------------------------------------------------------|
| **Contract**    | `0x042FE63b0EFbfC285b5AFd49b832a15eA8262c3a`                         |
| **Network**     | Celo Mainnet (chain ID `42220`)                                      |
| **Token**       | Baileo (`BAILEO`), 18 desimal                                        |
| **RATE**        | `1000` (1 CELO → 1000 BAILEO)                                         |
| **Deploy Tx**   | `0x5dc0eb95c9715c9bd384381c179a7a5b852996dfb0631e76eb2d98025ebf7a0f` |
| **Block**       | `69115134`                                                           |
| **Explorer**    | https://celoscan.io/address/0x042FE63b0EFbfC285b5AFd49b832a15eA8262c3a |

---

## ⚙️ Cara Kerja

```
Deposit  : kirim N CELO   ->  mint  N * 1000 BAILEO
Withdraw : burn M BAILEO  ->  terima M / 1000 CELO

1 CELO  ⇄  1000 BAILEO
```

- **Deposit** — panggil `deposit()` dengan mengirim CELO (`msg.value`). Contract mint
  `msg.value * 1000` BAILEO ke pengirim. Plain transfer CELO ke contract (`receive()`)
  juga diperlakukan sebagai deposit.
- **Withdraw** — panggil `withdraw(baileoAmount)`. Contract burn BAILEO sejumlah itu lalu
  mengirim balik `baileoAmount / 1000` CELO.
- **Fully-collateralized** — invarian dijaga setiap saat:
  `totalSupply() == address(this).balance * RATE`.

---

## 🧩 Antarmuka Contract

### Functions

| Signature                          | Keterangan                                                        |
|------------------------------------|-------------------------------------------------------------------|
| `deposit() payable`                | Setor CELO, mint `msg.value * RATE` BAILEO ke pemanggil.          |
| `withdraw(uint256 baileoAmount)`   | Burn `baileoAmount` BAILEO, kirim `baileoAmount / RATE` CELO.     |
| `totalCollateral() → uint256`      | Saldo CELO (jaminan) yang tersimpan di contract.                  |
| `RATE() → uint256`                 | Konstanta peg = `1000`.                                           |
| `receive() payable`                | Plain transfer CELO → diperlakukan sebagai `deposit()`.          |

Plus seluruh fungsi standar **ERC-20** (`balanceOf`, `transfer`, `approve`, `totalSupply`, dst).

### Events

```solidity
event Deposited(address indexed user, uint256 celoIn, uint256 baileoMinted);
event Withdrawn(address indexed user, uint256 baileoBurned, uint256 celoOut);
```

### Custom Errors

| Error                                  | Penyebab                                              |
|----------------------------------------|-------------------------------------------------------|
| `ZeroDeposit()`                        | `deposit()` dipanggil tanpa CELO (`msg.value == 0`).  |
| `ZeroWithdraw()`                       | `withdraw(0)`.                                         |
| `AmountNotMultipleOfRate(uint256)`     | `baileoAmount` bukan kelipatan `RATE` (1000).         |
| `InsufficientBaileo(uint256,uint256)`  | Saldo BAILEO pemanggil kurang.                        |
| `CeloTransferFailed()`                 | Pengiriman CELO ke pemanggil gagal.                   |

> **Catatan kelipatan:** `baileoAmount` harus kelipatan `RATE` agar konversi ke CELO eksak
> (tanpa dust). Karena setiap deposit selalu mint kelipatan 1000, seluruh saldo natural
> user selalu bisa ditarik penuh. Satuan terkecil yang valid = `1000` wei BAILEO → `1` wei CELO.

---

## 🔐 Keamanan

- **Reentrancy** — `withdraw()` memakai OpenZeppelin `ReentrancyGuard` (`nonReentrant`) **dan**
  pola checks-effects-interactions (burn dulu, kirim CELO terakhir).
- **Native transfer** — pakai low-level `call` + cek return value (`CeloTransferFailed`).
- **Solvensi** — peg `× 1000` saat mint dan `/ 1000` saat burn menjaga
  `totalSupply == balance * RATE`. CELO yang dipaksa masuk (selfdestruct) hanya menambah
  kelebihan jaminan, tidak pernah membuat contract kekurangan dana.
- **Belum diaudit eksternal.** Lihat [Disclaimer](#-disclaimer).

---

## 🛠️ Tech Stack

- **Solidity** `0.8.28` (optimizer on, 200 runs)
- **Foundry** (forge / cast)
- **OpenZeppelin Contracts** `v5.6.1` — `ERC20`, `ReentrancyGuard`

---

## 🚀 Build & Test

```shell
forge build
forge test -vv
```

Suite test (`test/Baileo.t.sol`) mencakup: deposit/mint 1000×, withdraw/burn, round-trip
tanpa potongan, partial withdraw, isolasi multi-user, transfer-lalu-withdraw, fuzz, dan
serangan reentrancy.

---

## 📦 Deploy

1. Buat `.env` (sudah di-gitignore):

   ```
   PRIVATE_KEY=0x<funded_wallet_key>
   CELOSCAN_API_KEY=<opsional, untuk verifikasi>
   ```

2. Deploy:

   ```shell
   # Celo Mainnet (chain 42220)
   forge script script/Baileo.s.sol:DeployBaileo \
     --rpc-url celo --broadcast --verify -vvvv

   # Celo Alfajores testnet (chain 44787)
   forge script script/Baileo.s.sol:DeployBaileo \
     --rpc-url alfajores --broadcast --verify -vvvv
   ```

   RPC alias `celo` dan `alfajores` didefinisikan di [`foundry.toml`](./foundry.toml).
   Hapus `--verify` jika `CELOSCAN_API_KEY` belum diisi.

---

## 💻 Interaksi (cast)

Ganti `$ADDR` dengan alamat contract, `$PK` dengan private key.

```shell
ADDR=0x042FE63b0EFbfC285b5AFd49b832a15eA8262c3a

# Tabung 1 CELO -> dapat 1000 BAILEO
cast send $ADDR "deposit()" --value 1ether --rpc-url celo --private-key $PK

# Cek saldo BAILEO
cast call $ADDR "balanceOf(address)(uint256)" <your_address> --rpc-url celo

# Tarik: burn 1000 BAILEO -> dapat 1 CELO
cast send $ADDR "withdraw(uint256)" 1000ether --rpc-url celo --private-key $PK

# Cek jaminan CELO di contract
cast call $ADDR "totalCollateral()(uint256)" --rpc-url celo
```

> `1000ether` = `1000 * 1e18` unit BAILEO = 1000 BAILEO (satuan base ERC-20 18 desimal).

---

## 📁 Struktur

```
sc-baileo/
├── src/Baileo.sol          # contract utama
├── script/Baileo.s.sol     # deploy script
├── test/Baileo.t.sol       # unit + fuzz + reentrancy test
├── foundry.toml            # config (solc, optimizer, RPC, etherscan)
└── lib/                    # forge-std, openzeppelin-contracts
```

---

## ⚠️ Disclaimer

Contract sudah live di Celo Mainnet dan dapat menyimpan dana riil, **namun belum diaudit
secara independen**. Gunakan dengan risiko sendiri. Jangan menyimpan dana dalam jumlah besar
sebelum audit menyeluruh.

---

## 📄 Lisensi

MIT (`SPDX-License-Identifier: MIT`).
