import { defineChain } from 'viem'

export const megaethTestnet = defineChain({
  id: 6342,
  name: 'MegaETH Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://timothy.megaeth.com/rpc'],
    },
  },
  blockExplorers: {
    default: {
      name: 'MegaExplorer',
      url: 'https://megaexplorer.xyz',
    },
  },
  testnet: true,
  // MegaETH specific optimizations
  fees: {
    maxFeePerGas: 1000000000n, // 1 gwei
    maxPriorityFeePerGas: 1000000000n, // 1 gwei
  },
})