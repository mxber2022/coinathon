import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import TokenGatedContent from "./TokenGatedContent";
import ProfileSection from "./ProfileSection";
import CreateCoinComponent from "./CreateCoinComponent";
import { Address } from "viem";

interface LiveDropProps {
  creatorAddress?: string;
  onBack?: () => void;
}

function useCreatorTokenAddress(creatorAddress?: string) {
  const { address: connectedAddress } = useAccount();
  const address = creatorAddress || connectedAddress;
  const [tokenAddress, setTokenAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    fetch("/config.json")
      .then(res => res.json())
      .then(config => {
        const entry = config[address];
        setTokenAddress(entry?.tokenAddress ?? null);
        setLoading(false);
      })
      .catch(() => {
        setTokenAddress(null);
        setLoading(false);
      });
  }, [address]);

  return { tokenAddress, loading, address };
}

function LiveDrop({ creatorAddress, onBack }: LiveDropProps) {
  const { isConnected, address: connectedAddress } = useAccount();
  const [activeTab, setActiveTab] = useState<'stream' | 'likes' | 'profile'>('stream');
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const { tokenAddress, loading, address } = useCreatorTokenAddress(creatorAddress);

  if (!isConnected) {
    return (
      <div className="card">
        <h1>Welcome to LiveDrop</h1>
        <p>Connect your wallet to join the livestream.</p>
        <button
          type="button"
          className="button"
          onClick={() => window.location.reload()}
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  if (!connectedAddress) {
    return (
      <div className="card">
        <p>Connecting...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card">
        <p>Checking for stream token...</p>
      </div>
    );
  }

  if (!tokenAddress) {
    return (
      <div className="card" style={{ textAlign: "center" }}>
        {onBack && (
          <button className="button" style={{ marginBottom: 16 }} onClick={onBack}>&larr; Back</button>
        )}
        <h2>No Stream Token Found</h2>
        <p>The creator has not created a token for this stream yet.</p>
        <CreateCoinComponent />
      </div>
    );
  }

  return (
    <>
      {onBack && (
        <button className="button" style={{ marginBottom: 16 }} onClick={onBack}>&larr; Back</button>
      )}
      {/* Tab Navigation */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          className={`button${activeTab === 'stream' ? '' : ' outline'}`}
          onClick={() => setActiveTab('stream')}
        >
          Stream
        </button>
        <button
          className={`button${activeTab === 'likes' ? '' : ' outline'}`}
          onClick={() => setActiveTab('likes')}
        >
          Likes
        </button>
        <button
          className={`button${activeTab === 'profile' ? '' : ' outline'}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'stream' && <TokenGatedContent userAddress={address as Address} />}
      {activeTab === 'likes' && (
        <div className="card" style={{ textAlign: "center" }}>
          <h2>Like this Stream?</h2>
          <button
            className="button"
            style={{ marginBottom: 12 }}
            onClick={() => {
              if (!liked) {
                setLikeCount(likeCount + 1);
                setLiked(true);
              }
            }}
            disabled={liked}
          >
            {liked ? "Liked!" : "Like"}
          </button>
          <div>Likes: {likeCount}</div>
        </div>
      )}
      {activeTab === 'profile' && (
        <ProfileSection address={address as Address} />
      )}
    </>
  );
}

export default LiveDrop; 