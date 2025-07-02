import { useEffect, useState } from "react";

interface Creator {
  address: string;
  tokenAddress: string;
}

interface CreatorsListProps {
  onSelect: (address: string) => void;
}

function CreatorsList({ onSelect }: CreatorsListProps) {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/config.json")
      .then(res => res.json())
      .then(config => {
        const list = Object.entries(config).map(([address, entry]) => ({
          address,
          tokenAddress: (entry as { tokenAddress: string }).tokenAddress,
        }));
        setCreators(list);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="card">
        <div className="loading">Loading creators</div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>🎬 Live Creators</h2>
      <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1.5rem' }}>
        Choose a creator to join their exclusive livestream
      </p>
      <div className="creators-list">
        {creators.map(c => (
          <div key={c.address} className="creator-item">
            <div style={{ marginBottom: '0.75rem' }}>
              <strong style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Creator Address:</strong>
            </div>
            <div className="creator-address">{c.address}</div>
            <div style={{ marginBottom: '0.5rem', marginTop: '1rem' }}>
              <strong style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Token Contract:</strong>
            </div>
            <div className="creator-address">{c.tokenAddress}</div>
            <button 
              className="button" 
              style={{ marginTop: '1rem', width: '100%' }} 
              onClick={() => onSelect(c.address)}
            >
              🚀 Join Stream
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CreatorsList;