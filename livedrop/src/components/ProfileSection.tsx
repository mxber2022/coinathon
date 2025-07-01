interface ProfileSectionProps {
  address: string;
}

function ProfileSection({ address }: ProfileSectionProps) {
  return (
    <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
      <h2>Your Profile</h2>
      <div style={{ margin: "16px 0" }}>
        <strong>Wallet Address:</strong>
        <div style={{ wordBreak: "break-all", marginTop: 4 }}>{address}</div>
      </div>
    </div>
  );
}

export default ProfileSection; 