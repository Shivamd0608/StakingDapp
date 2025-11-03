import React, { createContext, useContext, useState } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        if (network.chainId !== 11155111) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0xaa36a7' }],
            });
          } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: '0xaa36a7',
                      chainName: 'Sepolia Test Network',
                      rpcUrls: ['https://sepolia.infura.io/v3/'],
                      nativeCurrency: {
                        name: 'Sepolia Ether',
                        symbol: 'SEP',
                        decimals: 18,
                      },
                      blockExplorerUrls: ['https://sepolia.etherscan.io'],
                    },
                  ],
                });
              } catch (addError) {
                console.error("Error adding Sepolia network:", addError);
              }
            }
            console.error("Error switching to Sepolia network:", switchError);
          }
        }
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setProvider(provider);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      console.error("MetaMask not detected");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
  };

  return (
    <WalletContext.Provider value={{ account, provider, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
