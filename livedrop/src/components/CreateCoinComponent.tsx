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
        uri: "ipfs://bafybeigoxzqzbnxsn35vq7lls3ljxdcwjafxvbvkivprsodzrptpiguysy",
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
    <div>
      {!ready && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
            <h3>Create Your Stream Token</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Set up your exclusive token for stream access
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-group">
              <label className="form-label">Token Name</label>
              <input
                name="name"
                placeholder="e.g., Jane's Stream Token"
                value={form.name}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Symbol</label>
              <input
                name="symbol"
                placeholder="e.g., JST"
                value={form.symbol}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Metadata URI</label>
              <input
                name="uri"
                placeholder="ipfs://..."
                value={form.uri}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Platform Referrer (Optional)</label>
              <input
                name="platformReferrer"
                placeholder="0x..."
                value={form.platformReferrer}
                onChange={handleChange}
                className="input"
              />
            </div>
            
            <button 
              className="button" 
              type="submit" 
              disabled={!connectedAddress || submitted}
              style={{ width: '100%' }}
            >
              {submitted ? "🔄 Preparing..." : "🎯 Prepare Token Creation"}
            </button>
            
            {error && (
              <div className="feedback error">
                ❌ {error}
              </div>
            )}
          </form>
        </div>
      )}
      
      {ready && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <button
            className="button"
            disabled
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            {status === 'pending' ? '🔄 Creating Token...' : '🎯 Create Token'}
          </button>
          
          {error && (
            <div className="feedback error">
              ❌ {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CreateCoinComponent;