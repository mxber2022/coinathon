import React from "react";

interface ProfileModalProps {
  address: string;
  onClose: () => void;
}

const modalStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const cardStyle: React.CSSProperties = {
  background: "#222",
  color: "#fff",
  borderRadius: 12,
  padding: 32,
  minWidth: 320,
  boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
  position: "relative",
};

const closeStyle: React.CSSProperties = {
  position: "absolute",
  top: 12,
  right: 12,
  background: "none",
  border: "none",
  color: "#fff",
  fontSize: 20,
  cursor: "pointer",
};

function ProfileModal({ address, onClose }: ProfileModalProps) {
  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={cardStyle} onClick={e => e.stopPropagation()}>
        <button style={closeStyle} onClick={onClose} aria-label="Close">×</button>
        <h2>Your Profile</h2>
        <div style={{ margin: "16px 0" }}>
          <strong>Wallet Address:</strong>
          <div style={{ wordBreak: "break-all", marginTop: 4 }}>{address}</div>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal; 