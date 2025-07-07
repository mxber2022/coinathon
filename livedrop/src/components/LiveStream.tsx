import CreatorInfo from "./CreatorInfo";

function LiveStream() {
  return (
    <div className="feed-card">
      {/* Header */}
      <div className="feed-header">
        <img
          src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
          alt="Creator"
          className="feed-avatar"
        />
        <div className="feed-user-info">
          <h3 className="feed-username">jane_doe</h3>
          <p className="feed-location">🔴 Live Stream</p>
        </div>
        <button className="feed-options">⋯</button>
      </div>

      {/* Content */}
      <div className="feed-content">
        <div className="feed-video">
          <div className="live-indicator">🔴 LIVE</div>
          <div className="play-button">▶</div>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center', margin: 0 }}>
            🎬 Exclusive livestream content
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="feed-actions">
        <div className="feed-action-buttons">
          <button className="action-btn like-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="action-btn comment-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="action-btn share-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="16,6 12,2 8,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="2" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <button className="action-btn bookmark-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Engagement Info */}
      <div className="feed-engagement">
        <p className="likes-count">1,234 likes</p>
        <div className="feed-caption">
          <span className="username">jane_doe</span>
          <span className="caption-text">Building the future of decentralized streaming 🚀 Join my exclusive token-gated content!</span>
        </div>
        <p className="comments-link">View all 89 comments</p>
        <p className="post-time">2 hours ago</p>
      </div>

      {/* Token Holder Perks */}
      <div className="feed-perks">
        <h4>✨ Token Holder Perks</h4>
        <div className="perks-grid">
          <div className="perk-item">
            <span className="perk-icon">🎥</span>
            <span>Live replay access</span>
          </div>
          <div className="perk-item">
            <span className="perk-icon">🎬</span>
            <span>Behind-the-scenes</span>
          </div>
          <div className="perk-item">
            <span className="perk-icon">📢</span>
            <span>Direct shoutouts</span>
          </div>
          <div className="perk-item">
            <span className="perk-icon">⭐</span>
            <span>Priority access</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveStream;