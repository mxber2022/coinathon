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
        name: form.name! ,
        symbol: form.symbol!,
        uri:  "ipfs://bafybeigoxzqzbnxsn35vq7lls3ljxdcwjafxvbvkivprsodzrptpiguysy", // cast for ValidMetadataURI
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

  // Automate writeContract after ready
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
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            name="name"
            placeholder="Coin Name"
            value={form.name}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            name="symbol"
            placeholder="Symbol"
            value={form.symbol}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            name="uri"
            placeholder="Metadata URI (ipfs://...)"
            value={form.uri}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            name="platformReferrer"
            placeholder="Platform Referrer (optional)"
            value={form.platformReferrer}
            onChange={handleChange}
            className="input"
          />
          <button className="button" type="submit" disabled={!connectedAddress || submitted}>
            {submitted ? "Preparing..." : "Prepare Coin Creation"}
          </button>
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        </form>
      )}
      {ready && (
        <>
          <button
            className="button"
            disabled
            style={{ marginTop: 16 }}
          >
            {status === 'pending' ? 'Creating...' : 'Create Coin'}
          </button>
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        </>
      )}
    </div>
  );
}

export default CreateCoinComponent; 