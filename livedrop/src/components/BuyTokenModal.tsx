import React, { useState, useEffect } from "react";
import { parseEther } from "viem";
import { tradeCoin, TradeParameters } from "@zoralabs/coins-sdk";
import { useAccount, useWalletClient, usePublicClient, useConnect } from "wagmi";
import type { Account } from "viem";

interface BuyTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenAddress: string;
  creatorAddress: string;
}

const BuyTokenModal: React.FC<BuyTokenModalProps> = ({ 
  isOpen, 
  onClose, 
  tokenAddress, 
  creatorAddress 
}) => {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { connect, connectors } = useConnect();
  
  const [ethAmount, setEthAmount] = useState("0.001");
  const [isTrading, setIsTrading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccess(false);
      setTxHash(null);
      setIsTrading(false);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleConnect = async () => {
    try {
      const connector = connectors[0];
      if (connector) {
        connect({ connector });
      }
    } catch (err: any) {
      setError("Failed to connect wallet. Please try again.");
    }
  };

  const handleBuyToken = async () => {
    if (!address || !walletClient || !publicClient || !isConnected) {
      setError("Please ensure your wallet is properly connected");
      return;
    }

    setIsTrading(true);
    setError(null);

    try {
      const tradeParameters: TradeParameters = {
        sell: { type: "eth" },
        buy: {
          type: "erc20",
          address: tokenAddress as `0x${string}`,
        },
        amountIn: parseEther("0.0000001"),
        slippage: 0.05, // Fixed 5% slippage
        sender: address,
      };

      const receipt = await tradeCoin({
        tradeParameters,
        walletClient,
        account: address as unknown as Account,
        publicClient,
      });

      setTxHash(receipt.transactionHash);
      setSuccess(true);
      
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setTxHash(null);
      }, 2500);

    } catch (err: any) {
      console.error("Trade error:", err);
      let errorMessage = "Failed to buy token. Please try again.";
      
      if (err?.message?.includes("insufficient")) {
        errorMessage = "Insufficient ETH balance.";
      } else if (err?.message?.includes("rejected")) {
        errorMessage = "Transaction rejected.";
      }
      
      setError(errorMessage);
    } finally {
      setIsTrading(false);
    }
  };

  if (!isOpen) return null;

  // Wallet Connection Step
  if (!isConnected) {
    return (
      <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 pb-8">
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <div className="relative w-full max-w-sm bg-black/95 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">🔗</span>
            </div>
            <h2 className="text-xl font-bold text-gradient mb-2">Connect Wallet</h2>
            <p className="text-white/70 text-sm mb-6">
              Connect to purchase creator tokens
            </p>

            <button
              onClick={handleConnect}
              className="glass-button w-full mb-4"
            >
              Connect Wallet
            </button>

            <button
              onClick={onClose}
              className="w-full bg-white/5 backdrop-blur-xl border border-white/10 text-white/70 font-medium py-3 px-4 rounded-2xl transition-all duration-300 hover:bg-white/10"
            >
              Cancel
            </button>

            {error && (
              <div className="mt-4 glass-card p-3 border-red-500/30">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 pb-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-sm bg-black/95 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
        {success ? (
          // Success State
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-500/30">
              <span className="text-3xl">🎉</span>
            </div>
            <h3 className="text-xl font-bold text-gradient mb-2">Success!</h3>
            <p className="text-white/70 text-sm mb-4">
              Creator tokens purchased successfully
            </p>
            {txHash && (
              <div className="glass-card p-3">
                <p className="text-green-400 text-xs font-mono break-all">
                  {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </p>
              </div>
            )}
          </div>
        ) : (
          // Purchase Form
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              {/* <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">💎</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gradient">Buy Token</h2>
                  <p className="text-white/60 text-sm">Support this creator</p>
                </div>
              </div> */}

                 {/* Token Info */}
            {/* <div className="glass-card p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white">💎</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium">Creator Token</div>
                  <div className="text-white/60 text-xs font-mono truncate">
                    {tokenAddress.slice(0, 6)}...{tokenAddress.slice(-4)}
                  </div>
                </div>
              </div>
            </div> */}
              {/* <button
                onClick={onClose}
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button> */}
            </div>

         

            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-white/80 text-sm font-medium mb-3">
                Amount to Spend
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={ethAmount}
                  onChange={(e) => setEthAmount(e.target.value)}
                  step="0.001"
                  min="0.001"
                  className="glass-input w-full py-4 pr-16 text-lg"
                  placeholder="0.001"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 font-medium">
                  ETH
                </div>
              </div>
              <p className="text-white/50 text-xs mt-2">
                Minimum: 0.001 ETH • 5% slippage included
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="glass-card p-4 mb-6 border-red-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-400 text-sm">⚠️</span>
                  </div>
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Buy Button */}
            <button
              onClick={handleBuyToken}
              disabled={isTrading || !ethAmount || parseFloat(ethAmount) < 0.001}
              className="w-full bg-gradient-to-r from-black via-neutral-800 to-neutral-900 text-white font-bold py-4 px-4 rounded-2xl shadow-lg mb-3 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span className="flex items-center justify-center gap-3">
                {isTrading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl">💎</span>
                    <span>Buy for {ethAmount} ETH</span>
                  </>
                )}
              </span>
            </button>

            {/* Cancel Button */}
            <button
              onClick={onClose}
              className="w-full bg-white/5 backdrop-blur-xl border border-white/10 text-white/70 font-medium py-3 px-4 rounded-2xl transition-all duration-300 hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyTokenModal;