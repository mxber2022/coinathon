import { useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { COINV4_CONTRACT_ADDRESS, COINV4_ABI } from "../hooks/useCoinV4Config";
import CreatorInfo from "./CreatorInfo";

function MintForAccess({ onSuccess }: { onSuccess: () => void }) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { address } = useAccount();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirmed) {
      onSuccess();
    }
  }, [isConfirmed, onSuccess]);

  const handleMint = () => {
    if (address) {
      writeContract({
        address: COINV4_CONTRACT_ADDRESS,
        abi: COINV4_ABI,
        functionName: "mint",
        args: [address],
      });
    }
  };

  return (
    <div className="card">
      <CreatorInfo />
      <h2>Join the Livestream</h2>
      <p>Mint a token to get exclusive access to the stream and other perks.</p>
      <button
        type="button"
        className="button"
        onClick={handleMint}
        disabled={isPending || isConfirming}
      >
        {isPending && "Check Wallet..."}
        {isConfirming && "Minting..."}
        {!isPending && !isConfirming && "Mint Token to Watch"}
      </button>

      {hash && <div className="feedback">Transaction sent: {hash.substring(0,10)}...</div>}
      {isConfirmed && <div className="feedback success">Minted successfully!</div>}
      {error && <div className="feedback error">Error: {error.message}</div>}
    </div>
  );
}

export default MintForAccess; 