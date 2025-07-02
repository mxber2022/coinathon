import { useReadContract } from "wagmi";
//import MintForAccess from "./MintForAccess";
//import LiveStream from "./LiveStream";
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
    args: [userAddress],
    chainId: CHAIN_ID,
  });

  if (isLoading) {
    return (
      <div className="card">
        <p>Checking your access...</p>
      </div>
    );
  }

  if (isError || balance === undefined) {
    return (
      <div className="card">
        <p>Could not check for token. Make sure you are on the correct network.</p>
      </div>
    );
  }

  if (balance > 0) {
    return <LiveStream />;
  }

  return <MintForAccess onSuccess={refetch} />;
}

export default TokenGatedContent; 