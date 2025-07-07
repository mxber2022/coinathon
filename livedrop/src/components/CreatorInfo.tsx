function CreatorInfo() {
    return (
      <div className="creator-info">
        <img
          src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
          alt="Creator"
          className="avatar"
        />
        <div>
          <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🔴 Live with Jane Doe
          </h3>
          <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
            Building the future of decentralized streaming
          </p>
        </div>
      </div>
    );
  }
  
  export default CreatorInfo;