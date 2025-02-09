import React, { useState } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

interface NFTMergerProps {
  contract: ethers.Contract | null;
  onSuccess?: () => void;
}

export function NFTMerger({ contract, onSuccess }: NFTMergerProps) {
  const [loading, setLoading] = useState(false);
  const [token1Id, setToken1Id] = useState('');
  const [token2Id, setToken2Id] = useState('');

  const handleMerge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.merge(token1Id, token2Id);
      await tx.wait();
      toast.success('NFTs merged successfully!');
      onSuccess?.();
      
      // Reset form
      setToken1Id('');
      setToken2Id('');
    } catch (error) {
      console.error(error);
      toast.error('Failed to merge NFTs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleMerge} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Token 1 ID</label>
        <input
          type="number"
          value={token1Id}
          onChange={(e) => setToken1Id(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Token 2 ID</label>
        <input
          type="number"
          value={token2Id}
          onChange={(e) => setToken2Id(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          'Merge NFTs'
        )}
      </button>
    </form>
  );
}