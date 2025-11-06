# WalletConnect Setup

## Overview
This application now includes a wallet connect button in the navbar that allows users to connect their Ethereum wallets using WalletConnect.

## Current Setup
- The wallet connect button appears on the rightmost side of the navbar
- It shows only a wallet icon (no text) for a clean look
- When connected, it shows a green color and displays the wallet address in a tooltip
- When disconnected, it shows in gray and prompts to connect

## Development vs Production

### Development (Current)
- Uses a development project ID: `c4f79cc821944d9680842e34466bfbd9`
- Configured for `http://localhost:8081`
- **Analytics disabled** to reduce console noise
- **Custom RPC providers** to avoid WalletConnect RPC limits

### Production Setup
To use in production, you need to:

1. **Get a Project ID**:
   - Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Sign up/Login
   - Create a new project
   - Copy the Project ID

2. **Update Configuration**:
   - Edit `src/config/web3modal.ts`
   - Replace the `projectId` with your production project ID
   - Update the `url` in metadata to match your production domain

3. **Example Production Config**:
   ```typescript
   const projectId = 'your-production-project-id'
   
   const metadata = {
     name: 'GrowmaxGlobal',
     description: 'GrowmaxGlobal Web3 Application',
     url: 'https://yourdomain.com', // Your production domain
     icons: ['https://yourdomain.com/icon.png']
   }
   ```

## Console Errors (Development)

### Common Errors You May See:
1. **403 Forbidden (WalletConnect Analytics)**:
   ```
   POST https://pulse.walletconnect.org/e 403 (Forbidden)
   ```
   - **Status**: ✅ **Fixed** - Analytics disabled in config
   - **Impact**: None - wallet connection works fine

2. **401 Unauthorized (WalletConnect RPC)**:
   ```
   GET https://rpc.walletconnect.org/v1/identity/... 401 (Unauthorized)
   ```
   - **Status**: ✅ **Fixed** - Using public RPC providers
   - **Impact**: None - wallet connection works fine

3. **LaunchDarkly Errors**:
   ```
   POST https://events.launchdarkly.com/events/bulk/... net::ERR_BLOCKED_BY_CLIENT
   ```
   - **Status**: ⚠️ **External** - From ad blockers/privacy extensions
   - **Impact**: None - not related to wallet functionality

4. **Vite Development Server**:
   ```
   GET http://localhost:8080/node_modules/.vite/deps/... 504 (Outdated Optimize Dep)
   ```
   - **Status**: ✅ **Fixed** - Restart dev server to resolve
   - **Impact**: Temporary - resolves on server restart

### Error Handling:
- **Error Boundary**: Implemented to gracefully handle wallet errors
- **Graceful Degradation**: If wallet fails, shows "Wallet temporarily unavailable"
- **Non-blocking**: Errors don't prevent app functionality

## Features
- **WalletConnect v2**: Uses the latest WalletConnect protocol
- **Multiple Chains**: Supports Ethereum Mainnet and Sepolia testnet
- **Responsive**: Works on both desktop and mobile
- **Tooltip**: Shows connection status and wallet address
- **Clean UI**: Minimal design with just an icon
- **Error Handling**: Graceful error handling with fallbacks
- **Analytics Disabled**: Clean console in development

## Supported Wallets
WalletConnect supports hundreds of wallets including:
- MetaMask
- Rainbow
- Trust Wallet
- Coinbase Wallet
- And many more...

## Troubleshooting
- If the wallet doesn't connect, check your project ID and domain configuration
- Ensure your domain matches the one configured in WalletConnect Cloud
- For development, make sure you're using `localhost` or the correct local domain
- **Console errors are mostly harmless** - wallet functionality should work regardless
- If you see persistent errors, restart the development server 