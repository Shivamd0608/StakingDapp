import { ethers } from "ethers";
import TokenICOABI from "../abi/TokenICO";
import ERC20ABI from "../abi/ERC20";
import { CONTRACT_ADDRESSES } from '../config/contracts';

const ICO_CONTRACT_ADDRESS = CONTRACT_ADDRESSES.ICO;
const TOKEN_ADDRESS = CONTRACT_ADDRESSES.TOKEN;

// -------------------------
// ⚙️ CONFIG
// -------------------------

async function getWeb3Signer() {
  if (!window.ethereum) throw new Error("🦊 MetaMask not found");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return { provider, signer };
}

class ICOManager {
  constructor() {
    this.icoContract = null;
    this.tokenContract = null;
    this.provider = null;
    this.signer = null;
  }

  async init() {
    const { provider, signer } = await getWeb3Signer();
    this.provider = provider;
    this.signer = signer;
    this.icoContract = new ethers.Contract(ICO_CONTRACT_ADDRESS, TokenICOABI, this.signer);
    this.tokenContract = new ethers.Contract(TOKEN_ADDRESS, ERC20ABI, this.provider);
  }

  // User Functions
  async buyTokensETH(ethAmount) {
    try {
      if (!this.icoContract) await this.init();
      console.log("⏳ Sending buyTokens transaction...");
      const tx = await this.icoContract.buyTokens({
        value: ethers.utils.parseEther(ethAmount.toString()),
      });
      const receipt = await tx.wait();
      console.log("✅ Purchase confirmed:", receipt);
      return receipt;
    } catch (error) {
      console.error("❌ Error in buyTokensETH:", error);
      throw error;
    }
  }

  async getUserTokenBalance() {
    try {
      if (!this.tokenContract) await this.init();
      const address = await this.signer.getAddress();
      const balance = await this.tokenContract.balanceOf(address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error("❌ Error getUserTokenBalance:", error);
      throw error;
    }
  }

  async getICOInfo() {
    try {
      if (!this.icoContract) await this.init();
      const tokenPrice = await this.icoContract.tokenPrice();
      const totalSold = await this.icoContract.tokensSold();
      const start = await this.icoContract.startTime();
      const end = await this.icoContract.endTime();
      
      return { tokenPrice, totalSold, start, end };
    } catch (error) {
      console.error("❌ Error in getICOInfo:", error);
      throw error;
    }
  }
}

const icoManagerInstance = new ICOManager();

export const icoManager = icoManagerInstance;
export const buyTokensETH = icoManagerInstance.buyTokensETH.bind(icoManagerInstance);
export const getUserTokenBalance = icoManagerInstance.getUserTokenBalance.bind(icoManagerInstance);
export const getICOInfo = icoManagerInstance.getICOInfo.bind(icoManagerInstance);
