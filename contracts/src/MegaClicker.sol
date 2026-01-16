// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MegaClicker
 * @dev A fully on-chain cookie clicker game built for MegaETH's high-performance blockchain
 * @notice This contract implements a simple clicker game where each click is a blockchain transaction
 * @dev Security measures: Rate limiting (1 click per block), registration required, no admin functions
 */
contract MegaClicker {
    // ============ State Variables ============

    /**
     * @dev Player data structure optimized for gas efficiency
     * @notice Storage packing: fits in single 32-byte storage slot
     */
    struct Player {
        uint128 score;           // 16 bytes - sufficient for ~3.4 * 10^38 clicks
        uint64 lastClickBlock;   // 8 bytes - sufficient for billions of blocks
        bool isRegistered;       // 1 byte
        // Total: 25 bytes, fits in one 32-byte storage slot for gas efficiency
    }

    /// @dev Mapping of player addresses to their game data
    mapping(address => Player) public players;

    /// @dev Array storing addresses of top players (max 20)
    address[] public leaderboard;

    /// @dev Maximum number of players shown on leaderboard
    uint256 public constant MAX_LEADERBOARD_SIZE = 20;

    /// @dev Global statistics
    uint256 public totalClicks;
    uint256 public totalPlayers;

    // ============ Events ============

    /**
     * @dev Emitted when a new player registers
     * @param player Address of the registered player
     */
    event PlayerRegistered(address indexed player);

    /**
     * @dev Emitted when a player clicks (scores a point)
     * @param player Address of the player who clicked
     * @param newScore The player's new total score
     */
    event Click(address indexed player, uint256 newScore);

    /**
     * @dev Emitted when leaderboard is updated
     * @param player Address of the player whose rank changed
     * @param rank New rank of the player (1-indexed)
     */
    event LeaderboardUpdated(address indexed player, uint256 rank);

    // ============ Errors ============

    error AlreadyRegistered();
    error NotRegistered();
    error OneClickPerBlock();

    // ============ Core Functions ============

    /**
     * @notice Register to start playing the game
     * @dev Required before clicking. Increments totalPlayers counter.
     */
    function register() external {
        if (players[msg.sender].isRegistered) {
            revert AlreadyRegistered();
        }

        players[msg.sender].isRegistered = true;
        totalPlayers++;

        emit PlayerRegistered(msg.sender);
    }

    /**
     * @notice Click to increment your score
     * @dev Rate limited to 1 click per block to prevent bot spam
     * @dev Uses block.number for precise 10ms rate limiting on MegaETH
     */
    function click() external {
        Player storage player = players[msg.sender];

        if (!player.isRegistered) {
            revert NotRegistered();
        }

        if (block.number <= player.lastClickBlock) {
            revert OneClickPerBlock();
        }

        // Update player state
        player.score++;
        player.lastClickBlock = uint64(block.number);
        totalClicks++;

        // Update leaderboard if score qualifies
        _updateLeaderboard(msg.sender);

        emit Click(msg.sender, player.score);
    }

    // ============ View Functions ============

    /**
     * @notice Get a player's current score
     * @param player Address of the player
     * @return The player's score (0 if unregistered)
     */
    function getScore(address player) external view returns (uint256) {
        return players[player].score;
    }

    /**
     * @notice Get the current leaderboard
     * @return leaders Array of player addresses in ranking order
     * @return scores Array of corresponding scores
     */
    function getLeaderboard() external view returns (address[] memory leaders, uint256[] memory scores) {
        uint256 length = leaderboard.length;
        leaders = new address[](length);
        scores = new uint256[](length);

        for (uint256 i = 0; i < length; i++) {
            leaders[i] = leaderboard[i];
            scores[i] = players[leaderboard[i]].score;
        }

        return (leaders, scores);
    }

    /**
     * @notice Get a player's rank on the leaderboard
     * @param player Address of the player
     * @return rank The player's rank (1-indexed, 0 if not on leaderboard)
     */
    function getPlayerRank(address player) external view returns (uint256 rank) {
        for (uint256 i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i] == player) {
                return i + 1; // 1-indexed rank
            }
        }
        return 0; // Not on leaderboard
    }

    /**
     * @notice Check if a player is registered
     * @param player Address to check
     * @return True if player is registered, false otherwise
     */
    function isRegistered(address player) external view returns (bool) {
        return players[player].isRegistered;
    }

    /**
     * @notice Get the block number of a player's last click
     * @param player Address of the player
     * @return Block number of last click (0 if never clicked)
     */
    function getLastClickBlock(address player) external view returns (uint256) {
        return players[player].lastClickBlock;
    }

    // ============ Internal Functions ============

    /**
     * @dev Updates the leaderboard when a player's score changes
     * @param player Address of the player whose score changed
     * @notice Uses an efficient insertion algorithm for the sorted leaderboard
     */
    function _updateLeaderboard(address player) internal {
        uint256 score = players[player].score;

        // Find if player is already on leaderboard
        uint256 currentIndex = type(uint256).max;
        for (uint256 i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i] == player) {
                currentIndex = i;
                break;
            }
        }

        // Find correct insertion position (sorted by score, descending)
        uint256 insertIndex = leaderboard.length;
        for (uint256 i = 0; i < leaderboard.length; i++) {
            if (score > players[leaderboard[i]].score) {
                insertIndex = i;
                break;
            }
        }

        // If player is already on leaderboard, remove from current position
        if (currentIndex != type(uint256).max) {
            // Shift elements left to remove current position
            for (uint256 i = currentIndex; i < leaderboard.length - 1; i++) {
                leaderboard[i] = leaderboard[i + 1];
            }
            leaderboard.pop();

            // Adjust insert index if needed
            if (insertIndex > currentIndex) {
                insertIndex--;
            }
        }

        // Insert at correct position if within top MAX_LEADERBOARD_SIZE
        if (insertIndex < MAX_LEADERBOARD_SIZE) {
            // Remove last player if leaderboard is full
            if (leaderboard.length >= MAX_LEADERBOARD_SIZE) {
                leaderboard.pop();
            }

            // Add space for new entry
            leaderboard.push(address(0));

            // Shift elements right to make space
            for (uint256 i = leaderboard.length - 1; i > insertIndex; i--) {
                leaderboard[i] = leaderboard[i - 1];
            }

            // Insert player at correct position
            leaderboard[insertIndex] = player;

            emit LeaderboardUpdated(player, insertIndex + 1);
        }
    }
}