// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {MegaClicker} from "../src/MegaClicker.sol";

/**
 * @title DeployScript
 * @dev Secure deployment script for MegaClicker contract
 * @notice Includes safety checks and comprehensive logging
 */
contract DeployScript is Script {
    /// @dev Error thrown when deployment validation fails
    error DeploymentValidationFailed(string reason);

    function setUp() public {}

    function run() public {
        // Load and validate environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        // Safety checks before deployment
        console.log("=== Pre-deployment Safety Checks ===");
        console.log("Deployer address:", deployer);
        console.log("Current block number:", block.number);
        console.log("Current timestamp:", block.timestamp);
        console.log("Chain ID:", block.chainid);

        // Validate we're on the correct network (MegaETH testnet)
        if (block.chainid != 6342) {
            revert DeploymentValidationFailed("Not on MegaETH testnet (Chain ID should be 6342)");
        }

        // Check deployer has sufficient balance
        uint256 deployerBalance = deployer.balance;
        console.log("Deployer balance:", deployerBalance, "wei");

        if (deployerBalance < 0.001 ether) {
            revert DeploymentValidationFailed("Deployer needs at least 0.001 ETH for deployment");
        }

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        console.log("\n=== Deploying MegaClicker Contract ===");

        // Deploy the MegaClicker contract
        MegaClicker megaClicker = new MegaClicker();

        // Validate deployment
        _validateDeployment(megaClicker);

        // Stop broadcasting
        vm.stopBroadcast();

        // Log deployment information
        _logDeploymentInfo(megaClicker, deployer);

        // Save deployment info to file
        _saveDeploymentInfo(megaClicker, deployer);

        console.log("\n=== Deployment Completed Successfully ===");
    }

    /**
     * @dev Validates the deployed contract
     * @param megaClicker The deployed MegaClicker contract
     */
    function _validateDeployment(MegaClicker megaClicker) internal view {
        console.log("Validating deployment...");

        // Check contract was deployed
        if (address(megaClicker) == address(0)) {
            revert DeploymentValidationFailed("Contract deployment failed");
        }

        // Check contract has correct constants
        if (megaClicker.MAX_LEADERBOARD_SIZE() != 20) {
            revert DeploymentValidationFailed("Invalid MAX_LEADERBOARD_SIZE");
        }

        // Check initial state
        if (megaClicker.totalClicks() != 0) {
            revert DeploymentValidationFailed("Initial totalClicks should be 0");
        }

        if (megaClicker.totalPlayers() != 0) {
            revert DeploymentValidationFailed("Initial totalPlayers should be 0");
        }

        // Validate leaderboard is empty
        (address[] memory leaders, uint256[] memory scores) = megaClicker.getLeaderboard();
        if (leaders.length != 0 || scores.length != 0) {
            revert DeploymentValidationFailed("Initial leaderboard should be empty");
        }

        console.log("All deployment validations passed");
    }

    /**
     * @dev Logs comprehensive deployment information
     * @param megaClicker The deployed MegaClicker contract
     * @param deployer Address of the deployer
     */
    function _logDeploymentInfo(MegaClicker megaClicker, address deployer) internal view {
        console.log("\n=== MegaClicker Deployment Info ===");
        console.log("Contract address:", address(megaClicker));
        console.log("Deployer address:", deployer);
        console.log("Network: MegaETH Testnet");
        console.log("Chain ID:", block.chainid);
        console.log("Block number:", block.number);
        console.log("Block timestamp:", block.timestamp);

        console.log("\n=== Contract Configuration ===");
        console.log("Max leaderboard size:", megaClicker.MAX_LEADERBOARD_SIZE());
        console.log("Initial total players:", megaClicker.totalPlayers());
        console.log("Initial total clicks:", megaClicker.totalClicks());

        console.log("\n=== Gas Information ===");
        console.log("Block gas limit:", block.gaslimit);

        console.log("\n=== Next Steps ===");
        console.log("1. Verify contract on MegaExplorer:");
        console.log("   forge verify-contract", address(megaClicker), "src/MegaClicker.sol:MegaClicker --chain 6342");
        console.log("2. Update frontend configuration with contract address");
        console.log("3. Test registration and clicking on testnet");
    }

    /**
     * @dev Saves deployment information to JSON file
     * @param megaClicker The deployed MegaClicker contract
     * @param deployer Address of the deployer
     */
    function _saveDeploymentInfo(MegaClicker megaClicker, address deployer) internal {
        string memory deploymentInfo = string(
            abi.encodePacked(
                "{\n",
                '  "contractAddress": "', vm.toString(address(megaClicker)), '",\n',
                '  "contractName": "MegaClicker",\n',
                '  "deployerAddress": "', vm.toString(deployer), '",\n',
                '  "network": "MegaETH Testnet",\n',
                '  "chainId": ', vm.toString(block.chainid), ',\n',
                '  "blockNumber": ', vm.toString(block.number), ',\n',
                '  "blockTimestamp": ', vm.toString(block.timestamp), ',\n',
                '  "maxLeaderboardSize": ', vm.toString(megaClicker.MAX_LEADERBOARD_SIZE()), ',\n',
                '  "deploymentDate": "', _getCurrentDate(), '",\n',
                '  "version": "1.0.0"\n',
                "}"
            )
        );

        vm.writeFile("deployment.json", deploymentInfo);
        console.log("\nDeployment info saved to deployment.json");
    }

    /**
     * @dev Gets current date string for logging
     * @return Date string in ISO format
     */
    function _getCurrentDate() internal view returns (string memory) {
        // Simple timestamp to string conversion for logging
        return vm.toString(block.timestamp);
    }

    /**
     * @dev Emergency deployment function with custom parameters (if needed for testing)
     * @notice This function is for testing purposes only
     */
    function deployForTesting() public returns (address) {
        vm.startBroadcast();
        MegaClicker megaClicker = new MegaClicker();
        vm.stopBroadcast();

        return address(megaClicker);
    }
}