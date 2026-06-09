// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title  Baileo — tabungan on-chain tanpa potongan bulanan di Celo
/// @author Baileo
/// @notice Setor CELO untuk menerima token BAILEO sebagai bukti saldo tabungan.
///         Peg tetap: 1 CELO = 1000 BAILEO. Tukar (burn) BAILEO kapan saja untuk
///         menarik kembali CELO pada peg yang sama. Tidak ada biaya admin bulanan.
/// @dev    Fully-collateralized. Invarian: totalSupply() == address(this).balance * RATE
///         (kecuali ada CELO yang dipaksa masuk via selfdestruct, yang hanya menambah
///         kelebihan jaminan dan tidak pernah membuat contract kekurangan dana).
contract Baileo is ERC20, ReentrancyGuard {
    /// @notice Peg tetap: 1 CELO (1e18 wei) menghasilkan 1000 BAILEO (1000e18 unit).
    uint256 public constant RATE = 1000;

    /// @notice Emit saat user menyetor CELO dan menerima BAILEO.
    event Deposited(address indexed user, uint256 celoIn, uint256 baileoMinted);

    /// @notice Emit saat user menukar BAILEO dan menerima kembali CELO.
    event Withdrawn(address indexed user, uint256 baileoBurned, uint256 celoOut);

    /// @dev Setoran nol tidak diizinkan.
    error ZeroDeposit();
    /// @dev Penarikan nol tidak diizinkan.
    error ZeroWithdraw();
    /// @dev Jumlah BAILEO harus kelipatan RATE agar konversi ke CELO eksak (tanpa dust).
    error AmountNotMultipleOfRate(uint256 amount);
    /// @dev Saldo BAILEO user tidak cukup.
    error InsufficientBaileo(uint256 have, uint256 want);
    /// @dev Transfer CELO ke user gagal.
    error CeloTransferFailed();

    constructor() ERC20("Baileo", "BAILEO") {}

    /// @notice Setor CELO, terima BAILEO sebesar msg.value * RATE.
    /// @dev Contoh: deposit 1 CELO (1e18 wei) -> mint 1000e18 BAILEO (= 1000 BAILEO).
    function deposit() external payable {
        _deposit();
    }

    /// @notice Tukar (burn) BAILEO untuk menarik kembali CELO sebesar baileoAmount / RATE.
    /// @param  baileoAmount jumlah BAILEO (kelipatan RATE) yang ditukar.
    /// @dev    Contoh: withdraw 1000e18 BAILEO -> burn lalu kirim 1e18 wei CELO (= 1 CELO).
    ///         Checks-effects-interactions + nonReentrant melindungi dari reentrancy.
    function withdraw(uint256 baileoAmount) external nonReentrant {
        if (baileoAmount == 0) revert ZeroWithdraw();
        if (baileoAmount % RATE != 0) revert AmountNotMultipleOfRate(baileoAmount);

        uint256 bal = balanceOf(msg.sender);
        if (bal < baileoAmount) revert InsufficientBaileo(bal, baileoAmount);

        uint256 celoOut = baileoAmount / RATE;

        // Effects: burn dulu sebelum interaksi eksternal.
        _burn(msg.sender, baileoAmount);

        // Interaction: kirim CELO terakhir.
        (bool ok, ) = payable(msg.sender).call{value: celoOut}("");
        if (!ok) revert CeloTransferFailed();

        emit Withdrawn(msg.sender, baileoAmount, celoOut);
    }

    /// @notice Saldo CELO (jaminan) yang tersimpan di contract.
    function totalCollateral() external view returns (uint256) {
        return address(this).balance;
    }

    /// @notice Setoran langsung (plain transfer CELO) diperlakukan sebagai deposit.
    receive() external payable {
        _deposit();
    }

    function _deposit() private {
        if (msg.value == 0) revert ZeroDeposit();
        uint256 minted = msg.value * RATE;
        _mint(msg.sender, minted);
        emit Deposited(msg.sender, msg.value, minted);
    }
}
