// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Baileo
 * @notice A fully-collateralized savings vault on Celo Mainnet.
 *         Users deposit native CELO and receive the BAILEO ERC-20 token at a
 *         fixed peg of 1 CELO => 1000 BAILEO. Burning BAILEO redeems native
 *         CELO at the same peg (1000 BAILEO => 1 CELO).
 *
 * @dev    Both CELO and BAILEO use 18 decimals.
 *
 *         Peg, expressed in base units (wei):
 *           - deposit:  mintAmount  = msg.value * PEG               (no division -> no rounding)
 *           - withdraw: celoOut     = baileoAmount / PEG            (require divisibility -> no dust)
 *
 *         Collateralization invariant (always holds, enforced by construction):
 *           address(this).balance == totalSupply() / PEG
 *         because every wei of CELO held corresponds to exactly PEG base units
 *         of BAILEO outstanding, with no fees and no admin minting.
 *
 *         There is intentionally NO owner, NO admin, NO fee, and NO mechanism
 *         to extract collateral other than burning BAILEO. The contract cannot
 *         become under-collateralized.
 */
contract Baileo is ERC20, ERC20Burnable, ReentrancyGuard {
    /// @notice Pegged exchange ratio: 1 CELO (1e18 wei) == 1000 BAILEO (1000e18 units).
    uint256 public constant PEG = 1000;

    /// @notice Emitted when a user deposits CELO and mints BAILEO.
    /// @param user        The depositor / recipient of BAILEO.
    /// @param celoIn      Amount of native CELO deposited, in wei.
    /// @param baileoOut   Amount of BAILEO minted, in base units (= celoIn * PEG).
    event Deposited(address indexed user, uint256 celoIn, uint256 baileoOut);

    /// @notice Emitted when a user burns BAILEO and withdraws CELO.
    /// @param user        The redeemer / recipient of CELO.
    /// @param baileoIn    Amount of BAILEO burned, in base units.
    /// @param celoOut     Amount of native CELO returned, in wei (= baileoIn / PEG).
    event Withdrawn(address indexed user, uint256 baileoIn, uint256 celoOut);

    error ZeroDeposit();
    error ZeroWithdrawal();
    error AmountNotDivisibleByPeg(uint256 amount);
    error CeloTransferFailed();

    constructor() ERC20("Baileo", "BAILEO") {}

    /**
     * @notice Deposit native CELO and mint BAILEO to the caller at the peg.
     *         Sending CELO with this call mints `msg.value * PEG` BAILEO.
     * @dev    No division occurs, so the deposit side is always exact and never
     *         loses value. `msg.value * PEG` cannot overflow uint256 for any
     *         realistic CELO amount (total CELO supply << 2**256 / PEG).
     *
     *         Checks-Effects-Interactions: the only external interaction is the
     *         implicit receipt of `msg.value`; minting (the effect) happens after
     *         the value is already credited to this contract. nonReentrant is
     *         applied for defense-in-depth even though _mint makes no external call.
     */
    function deposit() external payable nonReentrant {
        if (msg.value == 0) revert ZeroDeposit();

        uint256 baileoOut = msg.value * PEG;

        // Effect: mint pegged BAILEO to the depositor.
        _mint(msg.sender, baileoOut);

        emit Deposited(msg.sender, msg.value, baileoOut);
    }

    /**
     * @notice Burn `baileoAmount` BAILEO from the caller and return the pegged
     *         amount of native CELO.
     * @param  baileoAmount Amount of BAILEO to burn, in base units. MUST be an
     *         exact multiple of PEG so that no value is lost to integer division.
     * @dev    Follows Checks-Effects-Interactions:
     *           1. Checks: validate amount and divisibility.
     *           2. Effects: burn BAILEO from caller (reduces totalSupply).
     *           3. Interactions: send CELO via low-level call, last.
     *         Combined with nonReentrant, this prevents re-entrancy draining:
     *         by the time CELO is sent, the caller's BAILEO is already burned.
     */
    function withdraw(uint256 baileoAmount) external nonReentrant {
        // --- Checks ---
        if (baileoAmount == 0) revert ZeroWithdrawal();
        // Enforce exact divisibility so no sub-peg dust is burned for zero CELO.
        if (baileoAmount % PEG != 0) revert AmountNotDivisibleByPeg(baileoAmount);

        uint256 celoOut = baileoAmount / PEG;

        // --- Effects ---
        // burn() reverts if the caller's balance is insufficient (OZ ERC20).
        burn(baileoAmount);

        // --- Interactions ---
        // Use low-level call (forwards all gas) rather than transfer/send, which
        // are limited to 2300 gas and can break with smart-contract recipients.
        // Reentrancy is mitigated by nonReentrant + state already updated above.
        (bool ok, ) = payable(msg.sender).call{value: celoOut}("");
        if (!ok) revert CeloTransferFailed();

        emit Withdrawn(msg.sender, baileoAmount, celoOut);
    }

    /**
     * @notice Preview the BAILEO minted for a given CELO deposit (in wei).
     * @param  celoAmount CELO amount in wei.
     * @return baileoOut  BAILEO base units that would be minted.
     */
    function previewDeposit(uint256 celoAmount) external pure returns (uint256 baileoOut) {
        return celoAmount * PEG;
    }

    /**
     * @notice Preview the CELO returned for burning a given BAILEO amount.
     * @param  baileoAmount BAILEO base units to burn (must be divisible by PEG).
     * @return celoOut      CELO wei that would be returned.
     */
    function previewWithdraw(uint256 baileoAmount) external pure returns (uint256 celoOut) {
        return baileoAmount / PEG;
    }

    /**
     * @notice The CELO collateral currently held by the vault, in wei.
     * @return The contract's native CELO balance.
     */
    function totalCollateral() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice True iff the vault holds exactly enough CELO to redeem all BAILEO
     *         at the peg. Should always be true given the contract's logic.
     * @return Whether `balance == totalSupply / PEG`.
     */
    function isFullyCollateralized() external view returns (bool) {
        return address(this).balance == totalSupply() / PEG;
    }

    /**
     * @dev Reject raw CELO transfers (plain sends / selfdestruct aside). Deposits
     *      MUST go through deposit() so BAILEO is minted; otherwise CELO sent
     *      here would be unredeemable and break the collateralization accounting.
     */
    receive() external payable {
        revert("Baileo: use deposit()");
    }
}
