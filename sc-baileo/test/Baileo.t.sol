// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {Baileo} from "../src/Baileo.sol";

contract BaileoTest is Test {
    Baileo internal baileo;

    address internal alice = makeAddr("alice");
    address internal bob = makeAddr("bob");

    event Deposited(address indexed user, uint256 celoIn, uint256 baileoMinted);
    event Withdrawn(address indexed user, uint256 baileoBurned, uint256 celoOut);

    function setUp() public {
        baileo = new Baileo();
        vm.deal(alice, 100 ether);
        vm.deal(bob, 100 ether);
    }

    /// @dev Invarian inti: BAILEO beredar selalu = jaminan CELO * RATE.
    function _assertSolvent() internal view {
        assertEq(
            baileo.totalSupply(),
            address(baileo).balance * baileo.RATE(),
            "solvency invariant broken"
        );
    }

    function test_Metadata() public view {
        assertEq(baileo.name(), "Baileo");
        assertEq(baileo.symbol(), "BAILEO");
        assertEq(baileo.decimals(), 18);
        assertEq(baileo.RATE(), 1000);
    }

    function test_DepositMints1000x() public {
        vm.expectEmit(true, false, false, true);
        emit Deposited(alice, 1 ether, 1000 ether);

        vm.prank(alice);
        baileo.deposit{value: 1 ether}();

        assertEq(baileo.balanceOf(alice), 1000 ether);
        assertEq(address(baileo).balance, 1 ether);
        assertEq(baileo.totalCollateral(), 1 ether);
        _assertSolvent();
    }

    function test_DepositExample5Celo() public {
        vm.prank(alice);
        baileo.deposit{value: 5 ether}();
        // 5 CELO -> 5000 BAILEO (sesuai README).
        assertEq(baileo.balanceOf(alice), 5000 ether);
        _assertSolvent();
    }

    function test_ReceiveActsAsDeposit() public {
        vm.prank(alice);
        (bool ok, ) = address(baileo).call{value: 2 ether}("");
        assertTrue(ok);
        assertEq(baileo.balanceOf(alice), 2000 ether);
        _assertSolvent();
    }

    function test_WithdrawBurnsAndReturnsCelo() public {
        vm.prank(alice);
        baileo.deposit{value: 1 ether}();

        uint256 balBefore = alice.balance;

        vm.expectEmit(true, false, false, true);
        emit Withdrawn(alice, 1000 ether, 1 ether);

        vm.prank(alice);
        baileo.withdraw(1000 ether);

        assertEq(baileo.balanceOf(alice), 0);
        assertEq(alice.balance, balBefore + 1 ether);
        assertEq(address(baileo).balance, 0);
        _assertSolvent();
    }

    function test_WithdrawExample1000Baileo() public {
        vm.prank(alice);
        baileo.deposit{value: 5 ether}();

        uint256 balBefore = alice.balance;
        vm.prank(alice);
        baileo.withdraw(1000 ether); // 1000 BAILEO -> 1 CELO

        assertEq(baileo.balanceOf(alice), 4000 ether);
        assertEq(alice.balance, balBefore + 1 ether);
        _assertSolvent();
    }

    function test_RoundTripPreservesValue() public {
        uint256 balBefore = alice.balance;

        vm.startPrank(alice);
        baileo.deposit{value: 3 ether}();
        baileo.withdraw(baileo.balanceOf(alice));
        vm.stopPrank();

        assertEq(baileo.balanceOf(alice), 0);
        assertEq(alice.balance, balBefore); // tanpa potongan
        _assertSolvent();
    }

    function test_PartialWithdraw() public {
        vm.startPrank(alice);
        baileo.deposit{value: 2 ether}();
        baileo.withdraw(1500 ether); // 1500 BAILEO -> 1.5 CELO
        vm.stopPrank();

        assertEq(baileo.balanceOf(alice), 500 ether);
        assertEq(address(baileo).balance, 0.5 ether);
        _assertSolvent();
    }

    function test_RevertWhen_DepositZero() public {
        vm.prank(alice);
        vm.expectRevert(Baileo.ZeroDeposit.selector);
        baileo.deposit{value: 0}();
    }

    function test_RevertWhen_WithdrawZero() public {
        vm.prank(alice);
        vm.expectRevert(Baileo.ZeroWithdraw.selector);
        baileo.withdraw(0);
    }

    function test_RevertWhen_WithdrawNotMultipleOfRate() public {
        vm.startPrank(alice);
        baileo.deposit{value: 1 ether}();
        vm.expectRevert(abi.encodeWithSelector(Baileo.AmountNotMultipleOfRate.selector, 1500));
        baileo.withdraw(1500); // bukan kelipatan 1000
        vm.stopPrank();
    }

    function test_RevertWhen_WithdrawInsufficient() public {
        vm.startPrank(alice);
        baileo.deposit{value: 1 ether}();
        vm.expectRevert(
            abi.encodeWithSelector(Baileo.InsufficientBaileo.selector, 1000 ether, 2000 ether)
        );
        baileo.withdraw(2000 ether);
        vm.stopPrank();
    }

    function test_MultiUserIsolation() public {
        vm.prank(alice);
        baileo.deposit{value: 1 ether}();
        vm.prank(bob);
        baileo.deposit{value: 4 ether}();

        assertEq(baileo.balanceOf(alice), 1000 ether);
        assertEq(baileo.balanceOf(bob), 4000 ether);
        assertEq(address(baileo).balance, 5 ether);
        _assertSolvent();

        vm.prank(bob);
        baileo.withdraw(4000 ether);
        assertEq(baileo.balanceOf(bob), 0);
        assertEq(baileo.balanceOf(alice), 1000 ether); // tidak terpengaruh
        _assertSolvent();
    }

    /// @dev BAILEO adalah ERC20 penuh: bisa ditransfer, lalu penerima bisa withdraw.
    function test_TransferThenWithdraw() public {
        vm.prank(alice);
        baileo.deposit{value: 1 ether}();

        vm.prank(alice);
        baileo.transfer(bob, 1000 ether);

        uint256 bobBefore = bob.balance;
        vm.prank(bob);
        baileo.withdraw(1000 ether);
        assertEq(bob.balance, bobBefore + 1 ether);
        _assertSolvent();
    }

    function testFuzz_DepositWithdrawRoundTrip(uint96 amount) public {
        amount = uint96(bound(amount, 1, 1_000_000 ether));
        vm.deal(alice, amount);
        uint256 before = alice.balance;

        vm.startPrank(alice);
        baileo.deposit{value: amount}();
        assertEq(baileo.balanceOf(alice), uint256(amount) * 1000);
        baileo.withdraw(baileo.balanceOf(alice));
        vm.stopPrank();

        assertEq(alice.balance, before);
        assertEq(baileo.balanceOf(alice), 0);
        _assertSolvent();
    }

    /// @dev Serangan reentrancy harus gagal: nonReentrant + CEI mencegah double-spend.
    ///      Vault diberi jaminan ekstra (deposit bob) yang berusaha dicuri attacker.
    function test_ReentrancyAttackFails() public {
        // Bob menabung -> vault punya 10 CELO jaminan milik orang lain.
        vm.prank(bob);
        baileo.deposit{value: 10 ether}();

        ReentrantAttacker attacker = new ReentrantAttacker(baileo);
        vm.deal(address(attacker), 1 ether);

        // Attacker deposit 1 CELO lalu coba re-enter withdraw saat menerima CELO.
        attacker.attack();

        // Guard + CEI menahan serangan: attacker hanya dapat haknya kembali (1 CELO),
        // jaminan bob (10 CELO) tetap utuh, dan contract tetap solven.
        assertEq(address(attacker).balance, 1 ether, "attacker gained funds");
        assertEq(baileo.balanceOf(address(attacker)), 0);
        assertEq(address(baileo).balance, 10 ether, "bob collateral drained");
        _assertSolvent();
    }
}

/// @dev Contract jahat yang mencoba re-enter withdraw() lewat receive().
contract ReentrantAttacker {
    Baileo internal immutable BAILEO;
    bool internal reentered;

    constructor(Baileo _baileo) {
        BAILEO = _baileo;
    }

    function attack() external {
        BAILEO.deposit{value: 1 ether}();
        BAILEO.withdraw(1000 ether);
    }

    receive() external payable {
        if (!reentered) {
            reentered = true;
            // Percobaan re-enter: harus revert (ReentrancyGuard / saldo sudah 0).
            try BAILEO.withdraw(1000 ether) {} catch {}
        }
    }
}
