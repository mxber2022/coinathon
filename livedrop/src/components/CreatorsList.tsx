import React, { useEffect, useState } from "react";

interface Creator {
  address: string;
  tokenAddress: string;
}

function CreatorsList() {
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
      <div className="fullscreen-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Loading creators...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fullscreen-feed">
      {creators.map((creator, index) => (
        <div key={creator.address} className="creator-fullscreen">
          {/* Background Video/Image */}
          <div className="creator-background">
            <img
              src={`https://images.pexels.com/photos/${774909 + index}/pexels-photo-${774909 + index}.jpeg?auto=compress&cs=tinysrgb&w=400&h=800&fit=crop`}
              alt="Creator background"
              className="background-image"
            />
            <div className="background-overlay"></div>
          </div>

          {/* Live Indicator */}
          <div className="live-badge">
            <div className="live-dot"></div>
            <span>LIVE</span>
          </div>

          {/* Viewer Count */}
          <div className="viewer-count">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>{Math.floor(Math.random() * 500) + 100}</span>
          </div>

          {/* Creator Info */}
          <div className="creator-overlay-info">
            <div className="creator-profile">
              <img
                src={`https://images.pexels.com/photos/${774909 + index}/pexels-photo-${774909 + index}.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`}
                alt="Creator"
                className="creator-avatar"
              />
              <div className="creator-details">
                <h3 className="creator-name">Creator {index + 1}</h3>
                <p className="creator-bio">Building the future of Web3 streaming</p>
                <div className="creator-stats">
                  <span>🖤 {Math.floor(Math.random() * 1000) + 500}</span>
                  <span>👥 {Math.floor(Math.random() * 100) + 50} watching</span>
                </div>
              </div>
            </div>

            {/* Token Info */}
            <div className="token-info">
              <div className="token-badge">
                <span className="token-icon">🪙</span>
                <span>Token Required</span>
              </div>
              <p className="token-address">{creator.tokenAddress.slice(0, 8)}...{creator.tokenAddress.slice(-6)}</p>
            </div>

            {/* Join Button */}
            <button 
              className="join-stream-btn" 
            >
              <span className="btn-icon">🚀</span>
              <span>Join Stream</span>
            </button>
          </div>

          {/* Side Actions */}
          <div className="side-actions">
            <button className="side-action-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span>{Math.floor(Math.random() * 100) + 20}</span>
            </button>
            
            <button className="side-action-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>{Math.floor(Math.random() * 50) + 10}</span>
            </button>
            
            <button className="side-action-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" stroke="currentColor" strokeWidth="2"/>
                <polyline points="16,6 12,2 8,6" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="2" x2="12" y2="15" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
            
            <button className="side-action-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          </div>

          {/* Scroll Indicator */}
          {index < creators.length - 1 && (
            <div className="scroll-indicator">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7 13l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(90 12 12)"/>
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default CreatorsList;