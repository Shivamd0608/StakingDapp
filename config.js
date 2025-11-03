import { http, createConfig } from 'wagmi'
import {sepolia } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'


const projectId = '<WALLETCONNECT_PROJECT_ID>'

export const config = createConfig({
  chains: [ sepolia],
  connectors: [
     injected(),
    walletConnect({ projectId }),
    metaMask(),
    safe(),
  ],
  transports: {
    // [mainnet.id]: http('https://eth-mainnet.g.alchemy.com/v2/aMTAuPfr82U_f-1gtXNc7'),
    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/aMTAuPfr82U_f-1gtXNc7'),
  },
});