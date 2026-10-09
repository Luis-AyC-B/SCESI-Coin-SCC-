// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {SCESICoin} from "../src/SCESICoin.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();
        SCESICoin coin = new SCESICoin(msg.sender);
        vm.stopBroadcast();
        console.log("SCESICoin:", address(coin));
    }
}
