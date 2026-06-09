// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {Baileo} from "../src/Baileo.sol";

/// @notice Deploy script untuk contract Baileo.
/// @dev    Butuh env PRIVATE_KEY (hex, diawali 0x) dari wallet yang sudah terisi CELO.
///         Jalankan via:
///           forge script script/Baileo.s.sol:DeployBaileo \
///             --rpc-url celo --broadcast --verify -vvvv
contract DeployBaileo is Script {
    function run() external returns (Baileo baileo) {
        uint256 pk = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(pk);
        baileo = new Baileo();
        vm.stopBroadcast();

        console.log("Baileo deployed at:", address(baileo));
        console.log("Name:             ", baileo.name());
        console.log("Symbol:           ", baileo.symbol());
        console.log("RATE (CELO->BAILEO):", baileo.RATE());
    }
}
