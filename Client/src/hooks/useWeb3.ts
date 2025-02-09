import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';
import { BaseNFT1_ABI, BaseNFT2_ABI, MutantNFT_ABI, CONTRACT_ADDRESSES } from '../contracts/abis';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useWeb3() {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [contracts, setContracts] = useState<{
    baseNFT1: ethers.Contract | null;
    baseNFT2: ethers.Contract | null;
    mutantNFT: ethers.Contract | null;
  }>({
    baseNFT1: null,
    baseNFT2: null,
    mutantNFT: null
  });

  // Check for MetaMask on mount
  useEffect(() => {
    const checkMetaMask = async () => {
      try {
        const isInstalled = typeof window !== 'undefined' && Boolean(window.ethereum);
        setIsMetaMaskInstalled(isInstalled);

        // If MetaMask is installed, check if we're already connected
        if (isInstalled && window.ethereum) {
          const accounts = await window.ethereum.request({ 
            method: 'eth_accounts'
          });

          if (accounts && accounts.length > 0) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const baseNFT1 = new ethers.Contract(CONTRACT_ADDRESSES.BaseNFT1, BaseNFT1_ABI, signer);
            const baseNFT2 = new ethers.Contract(CONTRACT_ADDRESSES.BaseNFT2, BaseNFT2_ABI, signer);
            const mutantNFT = new ethers.Contract(CONTRACT_ADDRESSES.MutantNFT, MutantNFT_ABI, signer);

            setAccount(accounts[0]);
            setProvider(provider);
            setContracts({ baseNFT1, baseNFT2, mutantNFT });
          }
        }
      } catch (error) {
        console.error('Error checking MetaMask status:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    checkMetaMask();
  }, []);

  const connectWallet = useCallback(async () => {
    if (!isMetaMaskInstalled) {
      toast.error('Please install MetaMask to use this app', {
        duration: 5000,
        position: 'top-right',
      });
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    try {
      // Ensure ethereum object is available
      if (!window.ethereum) {
        throw new Error('MetaMask not initialized');
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Initialize contracts with signer
      const baseNFT1 = new ethers.Contract(CONTRACT_ADDRESSES.BaseNFT1, BaseNFT1_ABI, signer);
      const baseNFT2 = new ethers.Contract(CONTRACT_ADDRESSES.BaseNFT2, BaseNFT2_ABI, signer);
      const mutantNFT = new ethers.Contract(CONTRACT_ADDRESSES.MutantNFT, MutantNFT_ABI, signer);

      setAccount(accounts[0]);
      setProvider(provider);
      setContracts({ baseNFT1, baseNFT2, mutantNFT });

      toast.success('Wallet connected successfully!');
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      
      // Handle specific error cases
      if (error.code === 4001) {
        toast.error('Please connect your wallet to continue');
      } else if (error.message.includes('already processing')) {
        toast.error('Please check MetaMask and complete the pending request');
      } else {
        toast.error('Failed to connect wallet. Please try again.');
      }
    }
  }, [isMetaMaskInstalled]);

  // Handle account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          setAccount(null);
          setProvider(null);
          setContracts({
            baseNFT1: null,
            baseNFT2: null,
            mutantNFT: null
          });
          toast.error('Wallet disconnected');
        } else {
          // Account changed
          setAccount(accounts[0]);
          toast.success('Account changed successfully');
        }
      };

      const handleChainChanged = () => {
        // Reload the page when the chain changes
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Cleanup listeners
      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  return {
    account,
    provider,
    contracts,
    connectWallet,
    isMetaMaskInstalled,
    isInitialized
  };
}