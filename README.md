# 🐉 StakingDapp — Full Web3 DeFi Application

A complete decentralized finance (DeFi) application built on Ethereum featuring Token ICO and Multi-Pool Staking with reward distribution through smart contracts.

---

## 📘 Overview

The **StakingDapp** is a decentralized application that provides a complete DeFi workflow:

- 🪙 **Token ICO** — Purchase DragonballCoin (DBC) tokens with ETH
- 💎 **Multi-Pool Staking** — Stake tokens in multiple pools with different APYs
- 📊 **Real-time Dashboard** — View staking info, pending rewards, and pool metrics
- 🔐 **Admin Panel** — Create pools, fund rewards, and manage the protocol

Built with **React + Vite**, **Ethers.js v6**, and **Solidity** smart contracts.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ 
- MetaMask browser extension
- Some Sepolia testnet ETH (get from [Sepolia Faucet](https://sepoliafaucet.com/))

### Installation

```bash
# Clone the repository
cd StakingDapp

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your contract addresses (see Deployment section)

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 📁 Project Structure

```
StakingDapp/
├── src/
│   ├── abi/                    # Contract ABIs
│   │   ├── ERC20.js           # ERC20 token ABI
│   │   ├── StakingDapp.js     # Staking contract ABI
│   │   └── TokenICO.js        # ICO contract ABI
│   ├── components/
│   │   └── common/
│   │       └── WalletButton.jsx
│   ├── context/
│   │   └── EthersContext.jsx   # Web3 provider context
│   ├── hooks/
│   │   └── useEthers.js        # Ethers.js hook
│   ├── pages/
│   │   ├── ICOPage.jsx         # Token ICO page
│   │   ├── StakingPage.jsx     # Staking pools page
│   │   └── NotFound.jsx
│   ├── services/
│   │   ├── ico.js              # ICO contract interactions
│   │   └── staking.js          # Staking contract interactions
│   ├── utils/
│   │   └── constants.js        # Contract addresses & config
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── contract/
│   ├── ERC20.sol               # DragonballCoin token
│   ├── TokenICO.sol            # ICO contract
│   └── StakingDapp.sol         # Staking contract
├── .env.example                # Environment template
├── package.json
└── vite.config.js
```

---

## 🔧 Environment Configuration

Create a `.env` file in the root directory:

```env
# Contract Addresses (after deployment)
VITE_STAKING_DAPP=0xYourStakingDappContractAddress
VITE_TOKEN_ICO=0xYourTokenICOContractAddress  
VITE_DEPOSIT_TOKEN=0xYourERC20TokenAddress

# Network Configuration
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
```

---

## 📜 Smart Contracts

### 1. DragonballCoin (ERC20.sol)
A standard ERC20 token with minting and burning capabilities.

```solidity
// Key functions
function mint(address to, uint256 amount) external onlyOwner
function burn(uint256 amount) external
function transfer(address to, uint256 value) returns (bool)
function approve(address spender, uint256 value) returns (bool)
```

### 2. TokenICO (TokenICO.sol)
Handles token sales where users can buy tokens with ETH.

```solidity
// Key functions
function buyToken(uint256 _tokenAmount) public payable  // Buy tokens
function updateToken(address _tokenAddress) public      // Set token (owner)
function updateTokenSalePrice(uint256 _price) public    // Set price (owner)
function withdrawAlltokens() public                     // Withdraw unsold (owner)
function gettokenDetails() public view returns (...)    // Get ICO info
```

### 3. StakingDapp (StakingDapp.sol)
Multi-pool staking with configurable APY and lock periods.

```solidity
// Pool Structure
struct PoolInfo {
    IERC20 depositToken;      // Token to stake
    IERC20 rewardToken;       // Reward token
    uint256 depositedAmount;  // Total staked
    uint256 apy;              // Annual percentage yield
    uint256 lockDays;         // Lock period in days
    uint256 rewardFund;       // Available rewards
}

// User Structure
struct UserInfo {
    uint256 amount;           // Staked amount
    uint256 lastRewardAt;     // Last reward timestamp
    uint256 lockUntil;        // Unlock timestamp
}

// Key functions
function addPool(IERC20 _depositToken, IERC20 _rewardToken, uint256 _apy, uint256 _lockDays)
function deposit(uint256 _pid, uint256 _amount)
function withdraw(uint256 _pid, uint256 _amount)
function claimReward(uint256 _pid)
function pendingReward(uint256 _pid, address _user) view returns (uint256)
function fundRewards(uint256 _pid, uint256 _amount)  // Owner only
function modifyPool(uint256 _pid, uint256 _apy)      // Owner only
```

---

## 🚢 Deployment Guide

### Step 1: Deploy Contracts

Using Remix IDE or Hardhat:

1. **Deploy ERC20 Token (DragonballCoin)**
   ```solidity
   constructor(1000000) // 1 million initial supply
   ```

2. **Deploy TokenICO**
   ```solidity
   // After deployment:
   updateToken(TOKEN_ADDRESS)
   updateTokenSalePrice(1000000000000000) // 0.001 ETH per token
   
   // Transfer tokens to ICO contract for sale
   token.transfer(ICO_ADDRESS, 100000 * 10**18)
   ```

3. **Deploy StakingDapp**
   ```solidity
   // After deployment, create a pool:
   addPool(
     TOKEN_ADDRESS,  // deposit token
     TOKEN_ADDRESS,  // reward token (can be same)
     20,             // 20% APY
     30              // 30 day lock
   )
   
   // Fund the reward pool:
   token.approve(STAKING_ADDRESS, 10000 * 10**18)
   fundRewards(0, 10000 * 10**18)
   ```

### Step 2: Update Environment

After deploying, update your `.env` file with the contract addresses.

### Step 3: Run the Frontend

```bash
npm run dev
```

---

## 📱 Using the DApp

### Connecting Wallet
1. Click **"Connect Wallet"** in the top right
2. Approve the MetaMask connection
3. Make sure you're on the correct network (Sepolia)

### ICO Page
1. Navigate to the **ICO** tab
2. View token details (name, symbol, price, available)
3. Enter the number of tokens to buy
4. Click **"Buy Tokens"** and confirm in MetaMask
5. Your purchased tokens will appear in your balance

### Staking Page
1. Navigate to the **Staking** tab
2. View available staking pools
3. Click on a pool to select it
4. Enter the amount you want to stake
5. Click **"Approve"** first (one-time per token)
6. Click **"Stake"** to deposit your tokens
7. Wait for the lock period to end
8. Click **"Claim Rewards"** to get your earned rewards
9. Click **"Unstake"** to withdraw your staked tokens

### Admin Functions (Contract Owner)

**ICO Admin:**
- Update token address
- Update token sale price
- Withdraw unsold tokens

**Staking Admin:**
- Create new staking pools
- Fund reward pools with tokens
- Modify pool APY

---

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `ethers` | ^6.8.0 | Ethereum interactions |
| `react` | ^18.2.0 | UI framework |
| `react-router-dom` | ^7.9.5 | Routing |
| `react-toastify` | ^9.1.3 | Notifications |
| `vite` | ^4.4.9 | Build tool |

---

## ⚠️ Important Notes

### Testing Mode
The StakingDapp contract uses **60 seconds = 1 day** for testing purposes. For production:
```solidity
// Change in StakingDapp.sol:
// Testing: 60 sec = 1 day
uint256 daysPassed = (block.timestamp - user.lastRewardAt) / 60;

// Production: 86400 sec = 1 day  
uint256 daysPassed = (block.timestamp - user.lastRewardAt) / 86400;
```

### Security Considerations
- Always test on testnet first
- Use hardware wallets for admin operations
- Audit contracts before mainnet deployment
- Keep private keys secure

---

## 🔗 Networks Supported

| Network | Chain ID | Status |
|---------|----------|--------|
| Sepolia Testnet | 11155111 | ✅ Recommended for testing |
| Ethereum Mainnet | 1 | ⚠️ Requires audit |
| Polygon | 137 | ✅ Compatible |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - feel free to use this project for learning and development.

---

## 🆘 Troubleshooting

### "Transaction Failed"
- Check if you have enough ETH for gas
- Check if you've approved the token spending
- Make sure the lock period has ended (for unstaking)

### "No Pools Available"  
- The contract owner needs to create staking pools first
- Check if you're connected to the correct network

### "Connect Wallet Not Working"
- Make sure MetaMask is installed
- Try refreshing the page
- Check if MetaMask is unlocked

---

## 📞 Support

For issues and questions:
- Open a GitHub issue
- Check the smart contract on Etherscan for transaction history

---

**Happy Staking! 🚀**


- **React.js** — Component-based UI framework
- **Vite** — Fast build tool and dev server
- **Ethers.js v6** — Ethereum wallet & contract interaction
- **MetaMask & WalletConnect** — Web3 wallet providers
- **React Context API** — Global state management
- **Formspree** — Contact form integration

---

## 📁 Project Structure

```
staking-dapp/
├── src/
│   ├── context/
│   │   ├── icoIntegration.js          # ICO contract interactions
│   │   └── stakingIntegration.js      # Staking & liquidity functions
│   │
│   ├── ABI/
│   │   ├── ERC20TokenAbi.json         # ERC20 contract ABI
│   │   ├── TokenICOAbi.json           # ICO contract ABI
│   │   └── StakingDappAbi.json        # Staking contract ABI
│   │
│   ├── components/
│   │   ├── StakeForm.jsx              # Staking interface
│   │   ├── BuyTokenForm.jsx           # Token purchase form
│   │   ├── PoolInfoCard.jsx           # Liquidity pool stats
│   │   └── WalletConnect.jsx          # Wallet connection
│   │
│   ├── pages/
│   │   ├── index.jsx                  # Homepage
│   │   ├── staking.jsx                # Staking dashboard
│   │   └── ico.jsx                    # Token sale page
│   │
│   └── App.jsx                        # React root component
│
├── contracts/                          # Solidity smart contracts
├── .env                                # Environment variables (not in repo)
├── vite.config.js                      # Vite configuration
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v16+ and npm/yarn
- MetaMask browser extension
- An Ethereum testnet account with test ETH (get from faucets)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/staking-dapp.git
   cd staking-dapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # STAKING DAPP ADDRESS
   VITE_STAKING_DAPP=0x5f19c53B77977016427B4B92f54f586660C2B40D
   VITE_TOKEN_ICO=0x1Fa077db3263EbFB29d46a9AB06235f939FF70bf

   # TOKEN ADDRESS
   VITE_DEPOSIT_TOKEN=0x039ea8b72cb3e1095d6e1d095703b31325b9f448
   VITE_REWARD_TOKEN=0x039ea8b72cb3e1095d6e1d095703b31325b9f448
   VITE_TOKEN_LOGO=https://your-token-logo-url.png

   # ADMIN
   VITE_ADMIN_ADDRESS=0xFF7aF7B3F5a153409bE7f05F63ab11DAE1Fa141A

   # CURRENCY & NETWORK
   VITE_CURRENCY=ETH
   VITE_CHAIN_ID=11155111
   VITE_NETWORK_NAME=Sepolia
   VITE_NETWORK_DECIMALS=18
   VITE_NETWORK=Sepolia

   # RPC URLS
   VITE_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
   VITE_ADDRESS_EXPLORER=https://sepolia.etherscan.io/address/
   VITE_TOKEN_EXPLORER=https://sepolia.etherscan.io/token/
   VITE_EXPLORER=https://sepolia.etherscan.io/

   # FORMSPREE
   VITE_FORMSPREE_API=your_formspree_id

   # WALLETCONNECT
   VITE_WALLETCONNECT_ID=your_walletconnect_project_id
   ```

   ⚠️ **Security Warning:** Never commit `.env` to version control! Add it to `.gitignore`.

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` (default Vite port)

---

## 🔑 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| **Smart Contracts** | | |
| `VITE_STAKING_DAPP` | Deployed staking contract address | `0x5f19c53...` |
| `VITE_TOKEN_ICO` | Deployed ICO contract address | `0x1Fa077...` |
| `VITE_DEPOSIT_TOKEN` | ERC20 token used for staking | `0x039ea8...` |
| `VITE_REWARD_TOKEN` | ERC20 token given as rewards | `0x039ea8...` |
| `VITE_TOKEN_LOGO` | URL for token logo image | `https://...` |
| **Admin** | | |
| `VITE_ADMIN_ADDRESS` | Admin wallet address | `0xFF7aF7...` |
| **Network Configuration** | | |
| `VITE_CURRENCY` | Native currency symbol | `ETH` |
| `VITE_CHAIN_ID` | Network chain ID | `11155111` (Sepolia) |
| `VITE_NETWORK_NAME` | Network display name | `Sepolia` |
| `VITE_NETWORK_DECIMALS` | Network decimals | `18` |
| **RPC & Explorer** | | |
| `VITE_SEPOLIA_RPC_URL` | Ethereum node endpoint | `https://eth-sepolia.g.alchemy.com/v2/...` |
| `VITE_ADDRESS_EXPLORER` | Base URL for address lookup | `https://sepolia.etherscan.io/address/` |
| `VITE_TOKEN_EXPLORER` | Base URL for token lookup | `https://sepolia.etherscan.io/token/` |
| `VITE_EXPLORER` | Base explorer URL | `https://sepolia.etherscan.io/` |
| **Integrations** | | |
| `VITE_FORMSPREE_API` | Formspree form ID for contact | `mpwjpgdb` |
| `VITE_WALLETCONNECT_ID` | WalletConnect project ID | Get from [cloud.walletconnect.com](https://cloud.walletconnect.com/) |

---

## 💡 How It Works

### ICO Flow
1. User connects MetaMask or WalletConnect wallet
2. User sends ETH to the ICO contract
3. Contract calculates tokens based on current price
4. Tokens are transferred to user's wallet

### Staking Flow
1. User approves ERC20 token spending
2. User stakes tokens in the staking contract
3. Contract records stake amount and timestamp
4. Rewards accrue based on: `reward = stakedAmount × rewardRate × stakingDuration`
5. User can unstake and claim rewards anytime

### Ethers.js Integration Pattern

The project uses different signers for different operations:

| Action Type | Signer | Source |
|-------------|--------|--------|
| User Transactions | MetaMask/WalletConnect | `window.ethereum` |
| Admin Operations | Private key signer | Environment variables |
| Read-Only Queries | Provider only | Public RPC |

**Example: Staking Tokens**
```javascript
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = await provider.getSigner();
const stakingContract = new ethers.Contract(
  import.meta.env.VITE_STAKING_DAPP,
  stakingAbi,
  signer
);

// Stake 10 tokens
await stakingContract.stakeTokens(ethers.utils.parseEther("10"));
```

---

## 📊 Smart Contract Functions

### StakingDapp.sol

```solidity
function stakeTokens(uint256 amount) external;
function unstakeTokens() external;
function claimRewards() external;
function getStakingInfo(address user) external view returns (...);
function updateRewardRate(uint256 newRate) external onlyOwner;
```

### TokenICO.sol

```solidity
function buyTokens() external payable;
function endICO() external onlyOwner;
function withdrawFunds() external onlyOwner;
function getTokenPrice() external view returns (uint256);
```

---

## 🧪 Testing

Run contract tests (if using Hardhat):
```bash
npx hardhat test
```

Run frontend in development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

---

## 🛠️ Deployment

### Deploy Smart Contracts

Using Remix IDE or Hardhat:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Deploy Frontend

**Vercel:**
```bash
npm run build
vercel --prod
```

**Netlify:**
```bash
npm run build
netlify deploy --prod --dir=dist
```

**Traditional Hosting:**
```bash
npm run build
# Upload the 'dist' folder to your hosting provider
```

---

## 🌐 Supported Networks

Currently configured for:
- **Sepolia Testnet** (Chain ID: 11155111)

Easily configurable for other networks by updating `.env`:
- Ethereum Mainnet
- Polygon
- BSC (Binance Smart Chain)
- Arbitrum
- Optimism

---

## 🔮 Roadmap

- [ ] Multi-token staking pools
- [ ] Chart.js integration for analytics
- [ ] Enhanced admin dashboard
- [ ] On-chain governance using ERC20 tokens
- [ ] Mobile-responsive design improvements
- [ ] Integration with major DEXs (Uniswap, PancakeSwap)
- [ ] Multi-chain support

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- OpenZeppelin for secure smart contract libraries
- Ethereum Foundation for blockchain infrastructure
- MetaMask and WalletConnect for wallet connectivity
- Vite for lightning-fast development experience
- React and Ethers.js communities

---

## 📞 Support

For questions or support:
- Open an issue on GitHub
- Email: your.email@example.com
- Twitter: [@yourhandle](https://twitter.com/yourhandle)

---

## ⚠️ Disclaimer

This project is for educational purposes. Always conduct thorough audits before deploying smart contracts to mainnet. Never invest more than you can afford to lose.

---

