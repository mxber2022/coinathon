import React, { useEffect, useState } from "react";

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

  if (loading) return <div>Loading creators...</div>;

  return (
    <div className="card">
      <h2>Creators</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {creators.map(c => (
          <li key={c.address} style={{ marginBottom: 16, borderBottom: "1px solid #333", paddingBottom: 8 }}>
            <div><strong>Address:</strong> {c.address}</div>
            <div><strong>Token:</strong> {c.tokenAddress}</div>
            <button className="button" style={{ marginTop: 8 }} onClick={() => onSelect(c.address)}>View Stream</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CreatorsList; 