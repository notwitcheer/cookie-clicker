# MegaClicker Smart Contracts

This directory contains the smart contracts for the MegaETH Cookie Clicker game, built with Foundry.

## Overview

The smart contracts implement a fully on-chain cookie clicker game where:
- Each click is a blockchain transaction
- Player scores are stored permanently on-chain
- Global leaderboard tracks top 20 players
- Rate limiting prevents bot abuse (1 click per block)

## Security Features

- **Custom Errors**: Gas-efficient error handling
- **Rate Limiting**: 1 click per block using `block.number`
- **Storage Optimization**: Gas-optimized struct packing
- **No Admin Functions**: Fully decentralized contract
- **Comprehensive Testing**: 20+ test cases including fuzz testing
- **Input Validation**: Registration required, proper bounds checking

## Contract Architecture

### MegaClicker.sol
Main game contract with the following features:
- Player registration system with custom errors
- Click tracking with precise rate limiting
- Leaderboard management (top 20 players) with efficient sorting
- Gas-optimized storage packing (Player struct fits in 1 storage slot)
- Comprehensive events for frontend integration

## Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation) installed
- Access to MegaETH testnet
- Private key with testnet ETH (minimum 0.001 ETH for deployment)

## Environment Setup

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Configure your .env file:**
   ```bash
   # Add your private key (NEVER commit this!)
   PRIVATE_KEY=your_private_key_here

   # MegaETH testnet RPC
   MEGAETH_RPC_URL=https://timothy.megaeth.com/rpc

   # Optional: Explorer API key for verification
   MEGAEXPLORER_API_KEY=your_api_key_here
   ```

## Development Commands

### Build
```bash
forge build
```

### Test
```bash
# Run all tests
forge test

# Run tests with verbose output
forge test -vvv

# Run specific test
forge test --match-test test_ClickRequiresRegistration

# Run tests with gas reporting
forge test --gas-report
```

### Deploy

#### Deploy to MegaETH Testnet
```bash
# Using the deployment script (recommended)
forge script script/Deploy.s.sol:DeployScript --rpc-url $MEGAETH_RPC_URL --private-key $PRIVATE_KEY --broadcast

# Direct deployment
forge create src/MegaClicker.sol:MegaClicker \
  --rpc-url https://timothy.megaeth.com/rpc \
  --private-key $PRIVATE_KEY
```

#### Deploy and Verify
```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $MEGAETH_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  --etherscan-api-key $MEGAEXPLORER_API_KEY
```

## Security Audit Results

✅ **No Admin Functions**: Contract is fully decentralized
✅ **Rate Limiting**: Prevents bot spam with block-level precision
✅ **Input Validation**: All functions properly validate inputs
✅ **Custom Errors**: Gas-efficient error handling
✅ **Storage Optimization**: Minimal gas usage with packed structs
✅ **No External Calls**: No reentrancy risks
✅ **Overflow Protection**: Solidity 0.8+ built-in overflow checks

## Gas Optimization

- **Storage Packing**: Player struct fits in single 32-byte slot
- **Leaderboard Algorithm**: O(n) insertion with minimal storage operations
- **Custom Errors**: More gas-efficient than string reverts
- **View Functions**: No state changes, minimal gas for queries

## Testing

Comprehensive test suite with 20+ test cases covering:
- Registration and validation ✅
- Click functionality and rate limiting ✅
- Leaderboard updates and ranking ✅
- Edge cases and error conditions ✅
- Gas usage optimization ✅
- Security (reentrancy, overflow) ✅
- Fuzz testing for robustness ✅

### Run Tests
```bash
# All tests
forge test

# With coverage
forge coverage

# Gas snapshots
forge snapshot
```

## Contract Interaction Examples

### Using Cast (Foundry CLI)

```bash
# Get player score
cast call CONTRACT_ADDRESS "getScore(address)" PLAYER_ADDRESS --rpc-url $MEGAETH_RPC_URL

# Check if registered
cast call CONTRACT_ADDRESS "isRegistered(address)" PLAYER_ADDRESS --rpc-url $MEGAETH_RPC_URL

# Register player
cast send CONTRACT_ADDRESS "register()" \
  --rpc-url $MEGAETH_RPC_URL \
  --private-key $PRIVATE_KEY

# Click (must wait for next block)
cast send CONTRACT_ADDRESS "click()" \
  --rpc-url $MEGAETH_RPC_URL \
  --private-key $PRIVATE_KEY
```

## Troubleshooting

### Common Issues

1. **"OneClickPerBlock" error**
   - Wait for next block (10ms on MegaETH)
   - Each address can only click once per block

2. **"NotRegistered" error**
   - Call `register()` function first

3. **"AlreadyRegistered" error**
   - Player already registered, can start clicking

4. **Deployment validation failed**
   - Check you're on MegaETH testnet (Chain ID: 6342)
   - Ensure sufficient ETH balance (>0.001 ETH)

## License

MIT License - see LICENSE file for details
