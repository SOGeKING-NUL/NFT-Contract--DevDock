import React, { useState } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

interface NFTMinterProps {
  type: 'NFT1' | 'NFT2';
  contract: ethers.Contract | null;
  onSuccess?: () => void;
}

export function NFTMinter({ type, contract, onSuccess }: NFTMinterProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    strength: '',
    agility: '',
    species: '',
    magic: '',
    intelligence: '',
    element: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      let tx;

      if (type === 'NFT1') {
        tx = await contract.mint(
          parseInt(formData.strength),
          parseInt(formData.agility),
          formData.species
        );
      } else {
        tx = await contract.mint(
          parseInt(formData.magic),
          parseInt(formData.intelligence),
          formData.element
        );
      }

      await tx.wait();
      toast.success(`${type} minted successfully!`);
      onSuccess?.();
      
      // Reset form
      setFormData({
        strength: '',
        agility: '',
        species: '',
        magic: '',
        intelligence: '',
        element: ''
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to mint NFT');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleMint} className="space-y-4">
      {type === 'NFT1' ? (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Strength (0-255)</label>
            <input
              type="number"
              name="strength"
              min="0"
              max="255"
              value={formData.strength}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Agility (0-255)</label>
            <input
              type="number"
              name="agility"
              min="0"
              max="255"
              value={formData.agility}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Species</label>
            <input
              type="text"
              name="species"
              value={formData.species}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Magic (0-255)</label>
            <input
              type="number"
              name="magic"
              min="0"
              max="255"
              value={formData.magic}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Intelligence (0-255)</label>
            <input
              type="number"
              name="intelligence"
              min="0"
              max="255"
              value={formData.intelligence}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Element</label>
            <input
              type="text"
              name="element"
              value={formData.element}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          `Mint ${type}`
        )}
      </button>
    </form>
  );
}