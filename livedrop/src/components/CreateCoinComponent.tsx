import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { CreateCoinArgs, createCoinCall, DeployCurrency } from "@zoralabs/coins-sdk";
import { Address } from "viem";
import { useWriteContract, useSimulateContract, useAccount } from "wagmi";

function CreateCoinComponent() {
  const { address: connectedAddress } = useAccount();
  const [form, setForm] = useState({
    name: "",
    symbol: "",
    uri: "",
    platformReferrer: "",
  });
  const [callParams, setCallParams] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!connectedAddress) return;
    setSubmitted(true);
    try {
      const coinParams: CreateCoinArgs = {
        name: form.name!,
        symbol: form.symbol!,
        uri: form.uri || "ipfs://bafybeigoxzqzbnxsn35vq7lls3ljxdcwjafxvbvkivprsodzrptpiguysy",
        payoutRecipient: connectedAddress as Address,
        platformReferrer: "0x0000000000000000000000000000000000000000" as Address,
      };
      const params = await createCoinCall(coinParams);
      setCallParams(params);
      setReady(true);
    } catch (err: any) {
      setError(err?.message || "Failed to prepare coin creation.");
      setSubmitted(false);
    }
  };

  const { data: writeConfig } = useSimulateContract(callParams ?? {});
  const { writeContract, status } = useWriteContract(writeConfig as any);

  const hasWritten = useRef(false);
  useEffect(() => {
    if (ready && writeContract && !hasWritten.current) {
      hasWritten.current = true;
      writeContract({
        address: callParams?.address,
        abi: callParams?.abi,
        functionName: callParams?.functionName,
        args: callParams?.args,
      });
    }
  }, [ready, writeContract, callParams]);

  return (
    <div className="bg-black/60 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-8 w-full mx-auto">
      {!ready && (
        <>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6 group">
              {/* Main icon container with enhanced styling */}
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-3 relative overflow-hidden">
                {/* Animated background overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="text-3xl">🪙</span>
              </div>
              
              {/* Enhanced badge with pulse animation */}
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center border-3 border-black shadow-xl animate-pulse">
                <span className="text-base animate-bounce">✨</span>
              </div>
              
              {/* Floating particles */}
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-400 rounded-full opacity-60 animate-ping"></div>
              <div className="absolute -bottom-2 -right-1 w-2 h-2 bg-purple-400 rounded-full opacity-40 animate-ping" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-1/2 -left-3 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-50 animate-ping" style={{ animationDelay: '1s' }}></div>
              
              {/* Orbital rings */}
              <div className="absolute inset-0 w-32 h-32 border border-blue-400/20 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
              <div className="absolute inset-0 w-36 h-36 border border-purple-400/10 rounded-full animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}></div>
              </div>
            </div>
            
            {/* Enhanced typography */}
            <div className="space-y-3">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2 tracking-tight">
                Create Stream Token
              </h2>
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
                <span className="text-blue-400 text-xs font-semibold tracking-widest uppercase">Deploy</span>
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
              </div>
              <p className="text-white/70 text-sm leading-relaxed max-w-xs mx-auto">
                Deploy exclusive access tokens for your premium streams and build your creator economy
              </p>
            </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <input
                  name="name"
                  placeholder="Token Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="glass-input w-full pl-12"
                />
              </div>
              
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <input
                  name="symbol"
                  placeholder="Symbol (e.g., JST)"
                  value={form.symbol}
                  onChange={handleChange}
                  required
                  className="glass-input w-full pl-12"
                />
              </div>
              
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <input
                  name="uri"
                  placeholder="Metadata URI (optional)"
                  value={form.uri}
                  onChange={handleChange}
                  className="glass-input w-full pl-12"
                />
              </div>
            </div>
            
            {/* Deploy Button */}
            <button 
              className="w-full bg-white/10 backdrop-blur-xl border border-white/20 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 hover:bg-white/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" 
              type="submit" 
              disabled={!connectedAddress || submitted}
            >
              <span className="flex items-center justify-center gap-3">
                {submitted ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Preparing Token...</span>
                  </>
                ) : (
                  <>
                    <span>Deploy Token</span>
                  </>
                )}
              </span>
            </button>
            
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-400 text-sm">⚠️</span>
                  </div>
                  <p className="text-red-400 text-sm">
                    {error}
                  </p>
                </div>
              </div>
            )}
          </form>
        </>
      )}
      
      {ready && (
        <div className="text-center">
          {/* Success Icon */}
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <span className="text-3xl">⏳</span>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center border-2 border-black shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gradient mb-2">Deploying Token</h2>
          <p className="text-white/70 text-sm mb-8">Please confirm the transaction in your wallet</p>
          
          {/* Status Button */}
          <button
            className="w-full bg-white/10 backdrop-blur-xl border border-white/20 text-white font-semibold py-4 px-6 rounded-2xl opacity-75 cursor-not-allowed"
            disabled
          >
            <span className="flex items-center justify-center gap-3">
              {status === 'pending' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing Transaction...</span>
                </>
              ) : (
                <>
                  <span className="text-xl">⏳</span>
                  <span>Deploying Token...</span>
                </>
              )}
            </span>
          </button>
          
          {/* Progress Indicator */}
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
          
          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-400 text-sm">⚠️</span>
                </div>
                <p className="text-red-400 text-sm">
                  {error}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CreateCoinComponent;