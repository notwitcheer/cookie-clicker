import { createConfig, http } from 'wagmi'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'
import { megaethTestnet } from './chains'

// Get WalletConnect project ID from environment
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id'

export const config = createConfig({
  chains: [megaethTestnet],
  connectors: [
    injected({
      target: 'metaMask',
    }),
    walletConnect({
      projectId,
      showQrModal: true,
    }),
    coinbaseWallet({
      appName: 'MegaETH Cookie Clicker',
      appLogoUrl: undefined, // Will add logo later
    }),
  ],
  transports: {
    [megaethTestnet.id]: http('https://timothy.megaeth.com/rpc', {
      // Optimize for MegaETH's fast block times
      retryCount: 3,
      retryDelay: 100, // Fast retry for failed requests
    }),
  },
  // Enable batch multicall for efficiency
  batch: {
    multicall: true,
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}