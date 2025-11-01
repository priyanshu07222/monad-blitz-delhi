// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {RocketCandle} from "../src/RocketCandle.sol";

contract CounterTest is Test {
    RocketCandle public rocketCandle;

    function setUp() public {
        rocketCandle = new RocketCandle(msg.sender);
    }

    function test_RecordResult() public {
        rocketCandle.recordResult(msg.sender, 100, "100");
        assertEq(rocketCandle.getPlayerResults(msg.sender).length, 1);
    }
}
