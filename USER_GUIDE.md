# 📖 StakingDapp User Manual

A complete step-by-step guide on how to use the StakingDapp application.

---

## 📋 Table of Contents

1. [Prerequisites](#-prerequisites)
2. [Getting Started](#-getting-started)
3. [Connecting Your Wallet](#-connecting-your-wallet)
4. [Buying Tokens (ICO)](#-buying-tokens-ico)
5. [Staking Tokens](#-staking-tokens)
6. [Claiming Rewards](#-claiming-rewards)
7. [Unstaking Tokens](#-unstaking-tokens)
8. [Admin Functions](#-admin-functions)
9. [Troubleshooting](#-troubleshooting)

---

## 🔧 Prerequisites

Before using StakingDapp, make sure you have:

### 1. MetaMask Wallet
- Install MetaMask browser extension from [metamask.io](https://metamask.io/download/)
- Create a new wallet or import an existing one
- **Save your seed phrase securely!**

### 2. Sepolia Testnet ETH
- The app runs on Sepolia testnet
- Get free test ETH from: [sepoliafaucet.com](https://sepoliafaucet.com/) or [Alchemy Faucet](https://sepoliafaucet.com/)
- You need ETH for gas fees and to buy tokens

### 3. Add Sepolia Network to MetaMask
The app will automatically prompt you to switch networks, but you can add it manually:
- **Network Name:** Sepolia
- **RPC URL:** `https://eth-sepolia.g.alchemy.com/v2/demo`
- **Chain ID:** `11155111`
- **Currency Symbol:** `ETH`
- **Block Explorer:** `https://sepolia.etherscan.io/`

---

## 🚀 Getting Started

### Step 1: Open the Application
Navigate to the StakingDapp in your browser (http://localhost:5173 for local development)

### Step 2: You'll See Two Main Pages
- **ICO** - Buy DragonballCoin (DBC) tokens with ETH
- **Staking** - Stake your tokens to earn rewards

---

## 🔗 Connecting Your Wallet

### Step 1: Click "Connect Wallet"
Look for the **"🦊 Connect Wallet"** button in the top-right corner of the navigation bar.

### Step 2: Approve MetaMask Connection
- A MetaMask popup will appear
- Click **"Connect"** to allow the app to see your wallet address

### Step 3: Switch Network (if prompted)
- If you're not on Sepolia, you'll be asked to switch networks
- Click **"Switch Network"** or **"Approve"** in MetaMask

### Step 4: Verify Connection
Once connected, you'll see:
- Your shortened wallet address (e.g., `0x1234...5678`)
- A green dot indicating active connection
- The network name (Sepolia)

### To Disconnect
Click on your wallet address button to disconnect.

---

## 🪙 Buying Tokens (ICO)

The ICO page allows you to purchase DragonballCoin (DBC) tokens using ETH.

### Step 1: Navigate to ICO Page
Click **"ICO"** in the navigation menu.

### Step 2: View Token Information
You'll see:
- **Token Name:** DragonballCoin
- **Symbol:** DBC
- **Token Price:** Cost in ETH per token
- **Available for Sale:** Remaining tokens in the ICO
- **Tokens Sold:** Total tokens purchased so far
- **Your Balance:** How many DBC tokens you own

### Step 3: Enter Token Amount
1. In the **"Amount of Tokens to Buy"** field, enter how many tokens you want
2. The app will show you:
   - **"You will pay":** The ETH amount required
   - **"You will receive":** Number of tokens

### Step 4: Buy Tokens
1. Click the **"Buy Tokens"** button
2. MetaMask will popup showing the transaction details
3. Check the gas fee and total amount
4. Click **"Confirm"** in MetaMask
5. Wait for the transaction to be confirmed

### Step 5: Verify Purchase
- A success toast notification will appear
- Your token balance will update
- You can view the transaction on Etherscan

---

## 💎 Staking Tokens

Staking allows you to lock your tokens and earn rewards over time.

### Step 1: Navigate to Staking Page
Click **"Staking"** in the navigation menu.

### Step 2: View Available Pools
Each pool shows:
- **Token Pair:** What you stake → What you earn (e.g., DBC → DBC)
- **APY:** Annual Percentage Yield (your yearly return rate)
- **Lock Period:** How long your tokens are locked
- **Total Staked:** All tokens staked in this pool
- **Reward Fund:** Available rewards in the pool

### Step 3: Select a Pool
Click on a pool card to select it for staking.

### Step 4: Approve Token Spending (First Time Only)
Before staking for the first time:
1. Enter the amount you want to stake
2. Click **"Approve"** button
3. Confirm the approval transaction in MetaMask
4. Wait for confirmation

> ⚠️ **Note:** Approval is a one-time step per token. It allows the staking contract to use your tokens.

### Step 5: Stake Your Tokens
1. Enter the amount to stake in the input field
2. Click **"MAX"** to stake your entire balance
3. Click **"Stake"** button
4. Confirm the transaction in MetaMask
5. Wait for confirmation

### Step 6: Verify Staking
After staking, you'll see:
- **Your Staked:** Amount of tokens you've staked
- **Pending Rewards:** Rewards you've earned so far
- **Lock Status:** Shows if tokens are locked and time remaining

---

## 🎁 Claiming Rewards

Rewards accumulate over time based on the pool's APY.

### Step 1: Check Pending Rewards
On the Staking page, look at **"Pending Rewards"** to see what you've earned.

### Step 2: Claim Your Rewards
1. Make sure you have a pool selected
2. Click **"Claim Rewards"** button
3. Confirm the transaction in MetaMask
4. Wait for confirmation

### Step 3: Verify
- Your pending rewards will reset to 0
- The reward tokens will be added to your wallet balance

> 💡 **Tip:** You can claim rewards at any time - you don't need to wait for the lock period to end.

---

## 🔓 Unstaking Tokens

Withdraw your staked tokens after the lock period ends.

### Step 1: Check Lock Status
On the Staking page, look for:
- 🔒 **"Locked"** - Shows time remaining (you cannot unstake yet)
- 🔓 **"Unlocked"** - You can unstake your tokens

### Step 2: Switch to Unstake Tab
Click the **"Unstake"** tab in the action panel.

### Step 3: Enter Unstake Amount
1. Enter the amount you want to withdraw
2. Click **"MAX"** to unstake everything
3. The balance shows your total staked amount

### Step 4: Unstake
1. Click **"Unstake"** button
2. Confirm the transaction in MetaMask
3. Wait for confirmation

### Step 5: Verify
- Your staked amount will decrease
- Tokens will return to your wallet
- Any pending rewards will also be claimed automatically

> ⚠️ **Important:** You cannot unstake while your tokens are locked! Wait for the lock period to end.

---

## ⚙️ Admin Functions

If you're the contract owner (admin), you'll see additional controls.

### ICO Admin Controls

| Function | Description |
|----------|-------------|
| **Update Token Address** | Change the token being sold |
| **Update Price** | Set a new token price (in Wei) |
| **Withdraw All Tokens** | Withdraw unsold tokens from ICO |

### Staking Admin Controls

| Function | Description |
|----------|-------------|
| **Create New Pool** | Add a new staking pool with custom APY and lock period |
| **Fund Rewards** | Add reward tokens to a pool |
| **Update APY** | Change the annual percentage yield of a pool |

### Creating a New Staking Pool
1. Enter **Deposit Token Address** (what users stake)
2. Enter **Reward Token Address** (what users earn)
3. Set **APY %** (e.g., 20 for 20% annual return)
4. Set **Lock Days** (how long tokens are locked)
5. Click **"Create Pool"**

### Funding Rewards
1. Select a pool
2. Enter the amount of reward tokens
3. Click **"Fund Rewards"**
4. Approve the tokens if needed, then confirm

---

## ❓ Troubleshooting

### "Connect Wallet" not working
- Make sure MetaMask is installed
- Refresh the page
- Check if MetaMask is unlocked
- Try disconnecting and reconnecting

### "Transaction Failed"
- Check if you have enough ETH for gas fees
- For staking: Make sure you've approved tokens first
- For unstaking: Check if lock period has ended
- Try increasing gas limit in MetaMask

### "Insufficient Funds"
- You need ETH for gas fees
- Get test ETH from a Sepolia faucet

### "No Pools Available"
- The admin needs to create staking pools first
- Check if you're on the correct network

### Tokens not showing
- Wait for transaction to confirm (check Etherscan)
- Refresh the page
- Add the token to MetaMask manually using the contract address

### Wrong Network
- Make sure you're on Sepolia testnet
- The app will prompt you to switch automatically
- Or manually switch in MetaMask

---

## 📊 Understanding the Numbers

### APY (Annual Percentage Yield)
- **20% APY** means if you stake 100 tokens for 1 year, you earn 20 tokens
- Rewards are calculated daily
- Actual returns depend on how long you stake

### Lock Period
- **30 days lock** means you cannot withdraw for 30 days
- In test mode: 1 day = 60 seconds (for faster testing)
- In production: 1 day = 24 hours

### Gas Fees
- Every transaction requires a small ETH fee
- Fees vary based on network congestion
- Failed transactions still consume some gas

---

## 🔐 Security Tips

1. **Never share your seed phrase** with anyone
2. **Verify contract addresses** before approving transactions
3. **Start with small amounts** to test functionality
4. **Check transaction details** in MetaMask before confirming
5. **Use a hardware wallet** for large amounts
6. **Bookmark the official URL** to avoid phishing sites

---

## 📞 Quick Reference

| Action | Steps |
|--------|-------|
| Connect Wallet | Click "Connect Wallet" → Approve in MetaMask |
| Buy Tokens | ICO → Enter amount → Buy Tokens → Confirm |
| Stake | Staking → Select Pool → Approve → Enter amount → Stake |
| Claim Rewards | Staking → Click "Claim Rewards" |
| Unstake | Staking → Unstake tab → Enter amount → Unstake |

---

## 📱 Contract Addresses (Sepolia)

| Contract | Address |
|----------|---------|
| Staking | `0x5f19c53B77977016427B4B92f54f586660C2B40D` |
| ICO | `0x1Fa077db3263EbFB29d46a9AB06235f939FF70bf` |
| Token (DBC) | `0x039ea8b72cb3e1095d6e1d095703b31325b9f448` |

View on Etherscan: [sepolia.etherscan.io](https://sepolia.etherscan.io/)

---

**Happy Staking! 🚀**
