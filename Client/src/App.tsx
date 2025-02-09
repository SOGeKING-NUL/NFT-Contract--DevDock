import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Wallet } from 'lucide-react';
import { useWeb3 } from './hooks/useWeb3';
import { NFTMinter } from './components/NFTMinter';
import { NFTMerger } from './components/NFTMerger';

function App() {
  const { account, contracts, connectWallet, isMetaMaskInstalled, isInitialized } = useWeb3();
  const [currentTokenIds, setCurrentTokenIds] = useState({
    nft1: '0',
    nft2: '0',
    mutant: '0'
  });

  useEffect(() => {
    const fetchTokenIds = async () => {
      if (contracts.baseNFT1 && contracts.baseNFT2 && contracts.mutantNFT) {
        try {
          const [nft1Id, nft2Id, mutantId] = await Promise.all([
            contracts.baseNFT1.getCurrentTokenId(),
            contracts.baseNFT2.getCurrentTokenId(),
            contracts.mutantNFT.getCurrentTokenId()
          ]);

          setCurrentTokenIds({
            nft1: nft1Id.toString(),
            nft2: nft2Id.toString(),
            mutant: mutantId.toString()
          });
        } catch (error) {
          console.error('Error fetching token IDs:', error);
        }
      }
    };

    if (isInitialized && account) {
      fetchTokenIds();
    }
  }, [contracts, account, isInitialized]);

  const getConnectButtonText = () => {
    if (!isInitialized) return 'Loading...';
    if (!isMetaMaskInstalled) return 'Install MetaMask';
    if (!account) return 'Connect Wallet';
    return `${account.slice(0, 6)}...${account.slice(-4)}`;
  };

  const handleConnectClick = () => {
    if (!isInitialized) return;
    if (!isMetaMaskInstalled) {
      window.open('https://metamask.io/download/', '_blank');
    } else {
      connectWallet();
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-900">NFT Fusion Lab</h1>
            <button
              onClick={handleConnectClick}
              disabled={!isInitialized}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Wallet className="w-5 h-5 mr-2" />
              {getConnectButtonText()}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {!account ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Welcome to NFT Fusion Lab
            </h2>
            <p className="text-gray-600 mb-8">
              Please connect your wallet to start minting and merging NFTs
            </p>
            <button
              onClick={handleConnectClick}
              disabled={!isInitialized}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Wallet className="w-6 h-6 mr-2" />
              {getConnectButtonText()}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* BaseNFT1 Section */}
            <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Physical NFT Minting</h2>
                <p className="mt-1 text-sm text-gray-500">Current Token ID: {currentTokenIds.nft1}</p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <NFTMinter
                  type="NFT1"
                  contract={contracts.baseNFT1}
                  onSuccess={() => setCurrentTokenIds(prev => ({
                    ...prev,
                    nft1: (parseInt(prev.nft1) + 1).toString()
                  }))}
                />
              </div>
            </div>

            {/* BaseNFT2 Section */}
            <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Magical NFT Minting</h2>
                <p className="mt-1 text-sm text-gray-500">Current Token ID: {currentTokenIds.nft2}</p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <NFTMinter
                  type="NFT2"
                  contract={contracts.baseNFT2}
                  onSuccess={() => setCurrentTokenIds(prev => ({
                    ...prev,
                    nft2: (parseInt(prev.nft2) + 1).toString()
                  }))}
                />
              </div>
            </div>

            {/* MutantNFT Section */}
            <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">NFT Fusion Chamber</h2>
                <p className="mt-1 text-sm text-gray-500">Current Token ID: {currentTokenIds.mutant}</p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <NFTMerger
                  contract={contracts.mutantNFT}
                  onSuccess={() => setCurrentTokenIds(prev => ({
                    ...prev,
                    mutant: (parseInt(prev.mutant) + 1).toString()
                  }))}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;