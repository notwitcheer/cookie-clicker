# MegaETH Cookie Clicker

A fully on-chain cookie clicker game built on MegaETH, where every click is a blockchain transaction.

## Overview

This project demonstrates the power of MegaETH's ultra-fast blockchain (10ms block times) by creating an addictive clicker game where:

- Every click sends a transaction to the blockchain
- Your score is stored permanently on-chain
- Global leaderboard shows top 20 players
- Real-time gameplay with instant feedback

## Why MegaETH?

MegaETH's unique architecture enables real-time gaming:
- **10ms block times** (target: 1ms)
- **100,000+ TPS** throughput
- **<$0.01** average transaction cost
- **Sub-second finality**

## Project Structure

```
├── contracts/          # Foundry smart contracts
├── frontend/           # React + TypeScript frontend
├── .gitignore         # Comprehensive gitignore
└── README.md          # This file
```

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Foundry toolkit
- MetaMask with MegaETH testnet configured

### MegaETH Testnet Configuration

```
Chain ID: 6342
RPC URL: https://timothy.megaeth.com/rpc
Currency: ETH
Explorer: https://megaexplorer.xyz
```

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cookieclicker
   ```

2. **Environment Setup**
   ```bash
   # Copy environment templates
   cp contracts/.env.example contracts/.env
   cp frontend/.env.example frontend/.env

   # Edit the .env files with your actual values
   # - Add your private key to contracts/.env
   # - Add WalletConnect project ID to frontend/.env
   ```

3. **Smart Contracts Development**
   ```bash
   cd contracts

   # Install Foundry (if not already installed)
   curl -L https://foundry.paradigm.xyz | bash
   foundryup

   # Initialize Foundry project (will be done in next steps)
   forge init .

   # Build and test
   forge build
   forge test

   # Deploy to MegaETH testnet
   forge create src/MegaClicker.sol:MegaClicker \
     --rpc-url $MEGAETH_RPC_URL \
     --private-key $PRIVATE_KEY
   ```

4. **Frontend Development**
   ```bash
   cd frontend

   # Install dependencies
   pnpm install

   # Start development server
   pnpm dev

   # Build for production
   pnpm build
   ```

5. **Get Testnet ETH**
   - Visit [MegaETH Faucet](https://testnet.megaeth.com/#2)
   - Request 0.005 ETH (limit per 24 hours)
   - Add MegaETH testnet to MetaMask

### First Time Setup Checklist

- [ ] Install Node.js 18+
- [ ] Install pnpm: `npm install -g pnpm`
- [ ] Install Foundry toolkit
- [ ] Configure MetaMask with MegaETH testnet
- [ ] Get testnet ETH from faucet
- [ ] Copy and configure .env files
- [ ] Create WalletConnect project at [cloud.walletconnect.com](https://cloud.walletconnect.com/)

## Game Mechanics

- **Registration**: Connect wallet and register to play
- **Clicking**: Each click increments your score by 1
- **Rate Limiting**: Maximum 1 click per block (10ms)
- **Leaderboard**: Top 20 players displayed in real-time
- **Anti-Bot**: Block-level rate limiting prevents automation

## Technology Stack

### Smart Contracts
- **Solidity** ^0.8.20
- **Foundry** for development and testing
- **Gas Optimized** storage packing

### Frontend
- **React 18+** with TypeScript
- **Viem + Wagmi v2** for Web3 integration
- **RainbowKit** for wallet connections
- **Tailwind CSS** for styling
- **Vite** for fast development

## Deployment

- **Testnet**: Deployed on MegaETH testnet
- **Frontend**: Hosted on Vercel/Netlify
- **Contract Verification**: Verified on MegaExplorer

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Resources

- [MegaETH Documentation](https://docs.megaeth.com/)
- [Testnet Faucet](https://testnet.megaeth.com/#2)
- [Block Explorer](https://megaexplorer.xyz)
- [Community Discord](https://discord.gg/megaeth)

## License

MIT License - see LICENSE file for details

---

Built with ❤️ for the MegaETH ecosystem