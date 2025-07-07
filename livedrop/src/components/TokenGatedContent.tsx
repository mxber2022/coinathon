import { useReadContract } from "wagmi";
import { COINV4_CONTRACT_ADDRESS, COINV4_ABI, CHAIN_ID } from "../hooks/useCoinV4Config";
import type { Address } from "viem";
import LiveStream from "./LiveStream";
import MintForAccess from "./MintForAccess";

function TokenGatedContent({ userAddress }: { userAddress: Address }) {
  const {
    data: balance,
    isLoading,
    isError,
    refetch,
  } = useReadContract({
    address: COINV4_CONTRACT_ADDRESS,
    abi: COINV4_ABI,
    functionName: "balanceOf",
    args: [userAddress]
  });

  if (isLoading) {
    return (
      <div className="card">
        <div className="loading">Checking your access</div>
      </div>
    );
  }

  if (isError || balance === undefined) {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <h2>Network Error</h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Could not check for token. Make sure you are on the correct network.
        </p>
      </div>
    );
  }

  if (balance > 0) {
    return <LiveStream />;
  }

  return <MintForAccess onSuccess={refetch} />;
}

export default TokenGatedContent;