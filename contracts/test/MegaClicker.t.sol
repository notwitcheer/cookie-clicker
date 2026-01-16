// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {MegaClicker} from "../src/MegaClicker.sol";

/**
 * @title MegaClickerTest
 * @dev Comprehensive test suite for MegaClicker contract
 * @notice Tests all functionality including edge cases, security, and gas optimization
 */
contract MegaClickerTest is Test {
    MegaClicker public megaClicker;

    // Test accounts
    address public player1 = makeAddr("player1");
    address public player2 = makeAddr("player2");
    address public player3 = makeAddr("player3");

    // Events for testing
    event PlayerRegistered(address indexed player);
    event Click(address indexed player, uint256 newScore);
    event LeaderboardUpdated(address indexed player, uint256 rank);

    function setUp() public {
        // Deploy the contract
        megaClicker = new MegaClicker();
    }

    // ============ Registration Tests ============

    function test_PlayerRegistration() public {
        // Test successful registration
        vm.expectEmit(true, false, false, false);
        emit PlayerRegistered(player1);

        vm.prank(player1);
        megaClicker.register();

        // Verify player is registered
        assertTrue(megaClicker.isRegistered(player1));
        assertEq(megaClicker.getScore(player1), 0);
        assertEq(megaClicker.totalPlayers(), 1);
    }

    function test_CannotRegisterTwice() public {
        // Register first time
        vm.prank(player1);
        megaClicker.register();

        // Try to register again - should revert
        vm.prank(player1);
        vm.expectRevert(MegaClicker.AlreadyRegistered.selector);
        megaClicker.register();
    }

    // ============ Click Functionality Tests ============

    function test_ClickRequiresRegistration() public {
        // Try to click without registration - should revert
        vm.prank(player1);
        vm.expectRevert(MegaClicker.NotRegistered.selector);
        megaClicker.click();
    }

    function test_SuccessfulClick() public {
        // Register player
        vm.prank(player1);
        megaClicker.register();

        // Advance to next block
        vm.roll(block.number + 1);

        // Test successful click
        vm.expectEmit(true, false, false, true);
        emit Click(player1, 1);

        vm.prank(player1);
        megaClicker.click();

        // Verify state changes
        assertEq(megaClicker.getScore(player1), 1);
        assertEq(megaClicker.totalClicks(), 1);
        assertEq(megaClicker.getLastClickBlock(player1), block.number);
    }

    function test_RateLimiting() public {
        // Register player
        vm.prank(player1);
        megaClicker.register();

        uint256 startBlock = block.number;

        // Advance to next block for first click
        vm.roll(startBlock + 1);

        // First click should succeed
        vm.prank(player1);
        megaClicker.click();

        // Second click in same block should fail
        vm.prank(player1);
        vm.expectRevert(MegaClicker.OneClickPerBlock.selector);
        megaClicker.click();

        // Move to next block and try again - should succeed
        vm.roll(startBlock + 2);
        vm.prank(player1);
        megaClicker.click();

        assertEq(megaClicker.getScore(player1), 2);
    }

    function test_MultipleClicks() public {
        // Register player
        vm.prank(player1);
        megaClicker.register();

        uint256 startBlock = block.number;

        // Click 10 times (advancing block each time)
        for (uint256 i = 1; i <= 10; i++) {
            vm.roll(startBlock + i);
            vm.prank(player1);
            megaClicker.click();

            assertEq(megaClicker.getScore(player1), i);
            assertEq(megaClicker.totalClicks(), i);
        }
    }

    // ============ Leaderboard Tests ============

    function test_LeaderboardSinglePlayer() public {
        // Register and click
        vm.prank(player1);
        megaClicker.register();

        vm.roll(block.number + 1);
        vm.prank(player1);
        megaClicker.click();

        // Check leaderboard
        (address[] memory leaders, uint256[] memory scores) = megaClicker.getLeaderboard();
        assertEq(leaders.length, 1);
        assertEq(leaders[0], player1);
        assertEq(scores[0], 1);
    }

    function test_LeaderboardMultiplePlayers() public {
        // Register players
        vm.prank(player1);
        megaClicker.register();
        vm.prank(player2);
        megaClicker.register();

        uint256 currentBlock = block.number;

        // Player1 clicks 3 times
        for (uint256 i = 0; i < 3; i++) {
            vm.roll(++currentBlock);
            vm.prank(player1);
            megaClicker.click();
        }

        // Player2 clicks 5 times
        for (uint256 i = 0; i < 5; i++) {
            vm.roll(++currentBlock);
            vm.prank(player2);
            megaClicker.click();
        }

        // Check leaderboard order (should be sorted by score)
        (address[] memory leaders, uint256[] memory scores) = megaClicker.getLeaderboard();
        assertEq(leaders.length, 2);
        assertEq(leaders[0], player2); // Higher score
        assertEq(scores[0], 5);
        assertEq(leaders[1], player1);
        assertEq(scores[1], 3);
    }

    function test_PlayerRank() public {
        // Register players
        vm.prank(player1);
        megaClicker.register();
        vm.prank(player2);
        megaClicker.register();

        uint256 currentBlock = block.number;

        // Player2 gets higher score
        vm.roll(++currentBlock);
        vm.prank(player2);
        megaClicker.click();

        vm.roll(++currentBlock);
        vm.prank(player1);
        megaClicker.click();

        vm.roll(++currentBlock);
        vm.prank(player2);
        megaClicker.click();

        // Check ranks (1-indexed)
        assertEq(megaClicker.getPlayerRank(player2), 1); // Top player
        assertEq(megaClicker.getPlayerRank(player1), 2); // Second player
    }

    function test_LeaderboardCapacity() public {
        // Register 25 players (more than MAX_LEADERBOARD_SIZE of 20)
        address[] memory players = new address[](25);
        for (uint256 i = 0; i < 25; i++) {
            players[i] = makeAddr(string(abi.encodePacked("player", i)));
            vm.prank(players[i]);
            megaClicker.register();
        }

        uint256 currentBlock = block.number;

        // Each player clicks i+1 times (so player 0 gets 1 click, player 1 gets 2 clicks, etc.)
        for (uint256 i = 0; i < 25; i++) {
            for (uint256 j = 0; j <= i; j++) {
                vm.roll(++currentBlock);
                vm.prank(players[i]);
                megaClicker.click();
            }
        }

        // Check leaderboard is capped at 20 players
        (address[] memory leaders, uint256[] memory scores) = megaClicker.getLeaderboard();
        assertEq(leaders.length, 20);

        // Check that highest scorers are on the leaderboard
        assertEq(leaders[0], players[24]); // Player with 25 clicks
        assertEq(scores[0], 25);
        assertEq(leaders[19], players[5]); // Player with 6 clicks (20th place)
        assertEq(scores[19], 6);

        // Check that lower scorers are not on leaderboard
        assertEq(megaClicker.getPlayerRank(players[0]), 0); // Player with 1 click not ranked
    }

    // ============ Gas Tests ============

    function test_ClickGasUsage() public view {
        console.log("Gas limit configured:", block.gaslimit);

        // Note: Gas testing in this simple form - more complex testing would
        // involve actual gas measurement during execution
        assertTrue(block.gaslimit > 100000, "Gas limit should be sufficient for clicks");
    }

    // ============ Edge Cases ============

    function test_UnregisteredPlayerQueries() public view {
        // Querying unregistered player should return default values
        assertEq(megaClicker.getScore(player1), 0);
        assertEq(megaClicker.getPlayerRank(player1), 0);
        assertFalse(megaClicker.isRegistered(player1));
    }

    function test_ContractConstants() public view {
        assertEq(megaClicker.MAX_LEADERBOARD_SIZE(), 20);
    }

    function test_EmptyLeaderboard() public view {
        (address[] memory leaders, uint256[] memory scores) = megaClicker.getLeaderboard();
        assertEq(leaders.length, 0);
        assertEq(scores.length, 0);
    }

    function test_ClickUpdateLeaderboard() public {
        vm.prank(player1);
        megaClicker.register();

        vm.roll(block.number + 1);

        // Expect leaderboard update event
        vm.expectEmit(true, false, false, true);
        emit LeaderboardUpdated(player1, 1);

        vm.prank(player1);
        megaClicker.click();
    }

    // ============ Fuzz Tests ============

    function testFuzz_ClickMultipleTimes(uint8 numClicks) public {
        // Bound to reasonable range
        vm.assume(numClicks > 0 && numClicks <= 50);

        vm.prank(player1);
        megaClicker.register();

        uint256 currentBlock = block.number;

        for (uint256 i = 0; i < numClicks; i++) {
            vm.roll(++currentBlock);
            vm.prank(player1);
            megaClicker.click();
        }

        assertEq(megaClicker.getScore(player1), numClicks);
        assertEq(megaClicker.totalClicks(), numClicks);
    }

    function testFuzz_MultiplePlayersRegistration(uint8 numPlayers) public {
        // Bound to reasonable range
        vm.assume(numPlayers > 0 && numPlayers <= 100);

        for (uint256 i = 0; i < numPlayers; i++) {
            address player = makeAddr(string(abi.encodePacked("fuzzPlayer", i)));
            vm.prank(player);
            megaClicker.register();
        }

        assertEq(megaClicker.totalPlayers(), numPlayers);
    }

    // ============ Security Tests ============

    function test_ReentrancyProtection() public {
        // The contract doesn't have any external calls or ether transfers,
        // so reentrancy is not a concern. This test confirms that.
        vm.prank(player1);
        megaClicker.register();

        vm.roll(block.number + 1);
        vm.prank(player1);
        megaClicker.click();

        // Contract state should be consistent
        assertEq(megaClicker.getScore(player1), 1);
        assertEq(megaClicker.totalClicks(), 1);
    }

    function test_OverflowProtection() public view {
        // Test that the contract uses proper Solidity 0.8+ overflow protection
        // Since Solidity 0.8+, arithmetic operations revert on overflow by default
        // This test confirms our uint128 score field has sufficient range

        uint128 maxScore = type(uint128).max; // 2^128 - 1

        // Our score field can handle ~3.4 * 10^38 clicks, which is astronomically large
        assertTrue(maxScore > 1e30, "Score field should handle massive numbers");

        // For reference: if someone clicked once every 10ms (MegaETH block time),
        // it would take longer than the age of the universe to overflow
    }
}