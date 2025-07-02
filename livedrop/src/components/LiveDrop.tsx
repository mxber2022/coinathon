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
      <div className="card" style={{ textAlign: 'center' }}>
        <h1>🎭 Welcome to LiveDrop</h1>
        <p style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '2rem' }}>
          Connect your wallet to access exclusive livestreams and token-gated content
        </p>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔗</div>
        <button
          type="button"
          className="button"
          onClick={() => window.location.reload()}
          style={{ width: '100%' }}
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  if (!connectedAddress) {
    return (
      <div className="card">
        <div className="loading">Connecting wallet</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card">
        <div className="loading">Checking stream token</div>
      </div>
    );
  }

  if (!tokenAddress) {
    return (
      <div className="card" style={{ textAlign: "center" }}>
        {onBack && (
          <button className="back-button" onClick={onBack}>
            ← Back to Creators
          </button>
        )}
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🪙</div>
        <h2>No Stream Token Found</h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '2rem' }}>
          This creator hasn't created a token for their stream yet. Create one to get started!
        </p>
        <CreateCoinComponent />
      </div>
    );
  }

  return (
    <>
      {onBack && (
        <button className="back-button" onClick={onBack}>
          ← Back to Creators
        </button>
      )}
      
      {/* Tab Navigation */}
      <div className="tab-nav">
        <button
          className={`button${activeTab === 'stream' ? '' : ' outline'}`}
          onClick={() => setActiveTab('stream')}
        >
          🎥 Stream
        </button>
        <button
          className={`button${activeTab === 'likes' ? '' : ' outline'}`}
          onClick={() => setActiveTab('likes')}
        >
          ❤️ Likes
        </button>
        <button
          className={`button${activeTab === 'profile' ? '' : ' outline'}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 Profile
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'stream' && <TokenGatedContent userAddress={address as Address} />}
      {activeTab === 'likes' && (
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❤️</div>
          <h2>Show Some Love!</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '2rem' }}>
            Support this creator by liking their stream
          </p>
          <button
            className="button"
            style={{ marginBottom: '1.5rem', width: '100%' }}
            onClick={() => {
              if (!liked) {
                setLikeCount(likeCount + 1);
                setLiked(true);
              }
            }}
            disabled={liked}
          >
            {liked ? "✅ Liked!" : "❤️ Like Stream"}
          </button>
          <div style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '1rem',
            borderRadius: '12px'
          }}>
            💖 {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
          </div>
        </div>
      )}
      {activeTab === 'profile' && (
        <ProfileSection address={address as Address} />
      )}
    </>
  );
}

export default LiveDrop;