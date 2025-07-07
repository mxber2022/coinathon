interface ProfileSectionProps {
    address: string;
  }
  
  function ProfileSection({ address }: ProfileSectionProps) {
    return (
      <div className="card profile-card">
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👤</div>
        <h2>Your Profile</h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1.5rem' }}>
          Your connected wallet information
        </p>
        <div>
          <strong style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Wallet Address:</strong>
          <div className="profile-address">{address}</div>
        </div>
      </div>
    );
  }
  
  export default ProfileSection;