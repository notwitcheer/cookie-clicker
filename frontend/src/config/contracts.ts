import type { Address } from 'viem'

// Contract ABI for MegaClicker
export const megaClickerAbi = [
  {
    type: 'function',
    name: 'MAX_LEADERBOARD_SIZE',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'click',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getLastClickBlock',
    inputs: [{ name: 'player', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getLeaderboard',
    inputs: [],
    outputs: [
      { name: 'leaders', type: 'address[]', internalType: 'address[]' },
      { name: 'scores', type: 'uint256[]', internalType: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getPlayerRank',
    inputs: [{ name: 'player', type: 'address', internalType: 'address' }],
    outputs: [{ name: 'rank', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getScore',
    inputs: [{ name: 'player', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isRegistered',
    inputs: [{ name: 'player', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'leaderboard',
    inputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'players',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [
      { name: 'score', type: 'uint128', internalType: 'uint128' },
      { name: 'lastClickBlock', type: 'uint64', internalType: 'uint64' },
      { name: 'isRegistered', type: 'bool', internalType: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'register',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'totalClicks',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalPlayers',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'Click',
    inputs: [
      { name: 'player', type: 'address', indexed: true, internalType: 'address' },
      { name: 'newScore', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'LeaderboardUpdated',
    inputs: [
      { name: 'player', type: 'address', indexed: true, internalType: 'address' },
      { name: 'rank', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'PlayerRegistered',
    inputs: [
      { name: 'player', type: 'address', indexed: true, internalType: 'address' },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'AlreadyRegistered',
    inputs: [],
  },
  {
    type: 'error',
    name: 'NotRegistered',
    inputs: [],
  },
  {
    type: 'error',
    name: 'OneClickPerBlock',
    inputs: [],
  },
] as const

// Contract address (will be updated after deployment)
export const megaClickerAddress: Address = '0x0000000000000000000000000000000000000000' // Placeholder

// Environment-based contract configuration
export function getContractAddress(): Address {
  const envAddress = import.meta.env.VITE_CONTRACT_ADDRESS
  if (envAddress) {
    return envAddress as Address
  }

  // During development, use placeholder
  if (import.meta.env.DEV) {
    console.warn('Using placeholder contract address. Deploy contract and set VITE_CONTRACT_ADDRESS environment variable.')
    return megaClickerAddress
  }

  throw new Error('Contract address not configured. Set VITE_CONTRACT_ADDRESS environment variable.')
}