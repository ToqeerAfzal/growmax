import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
// import { mainnet, sepolia } from 'wagmi/chains'
import { bsc } from 'wagmi/chains'

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = 'c4f79cc821944d9680842e34466bfbd9' // Development project ID

// 2. Create wagmiConfig with better RPC providers
const metadata = {
  name: 'CoinstakeX',
  description: 'CoinstakeX Web3 Application',
  url: 'http://localhost:8081', // Updated to match your dev server port
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// const chains = [mainnet, sepolia, bsc]
const chains = [bsc]


// Custom RPC configuration to reduce errors
const wagmiConfig = defaultWagmiConfig({ 
  chains, 
  projectId, 
  metadata,
  // Use public RPC providers instead of WalletConnect RPC
  // transports: {
  //   [bsc.id]: {
  //     http: 'https://go.getblock.us/5621b3e961df42a79e1ded9bf162aea8/',
  //     // http:"https://binance.llamarpc.com/",
  //   },
  // },
})

// 3. Create modal with analytics disabled
createWeb3Modal({ 
  wagmiConfig, 
  projectId, 
  chains,
  // Disable analytics to reduce console errors
  enableAnalytics: false,
  // Disable wallet connect analytics
  enableOnramp: false,
  // Custom theme to match your app
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent-color': '#fbbf24', // Gold color to match your theme
    '--w3m-background-color': '#1f2937',
    '--w3m-container-border-radius': '12px',
  }
})

export { wagmiConfig as config } 