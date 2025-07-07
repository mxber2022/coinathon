import { useEffect, useState } from "react";
import CreatorsList from "./components/CreatorsList";
import LiveDrop from "./components/LiveDrop";
import ProfileSection from "./components/ProfileSection";
import { useAccount } from "wagmi";
import BottomTabBar from "./components/BottomTabBar";

function App() {
  const { address } = useAccount();
  const [tab, setTab] = useState<'home' | 'search' | 'profile'>('home');
  const [creators, setCreators] = useState<string[]>([]);

  useEffect(() => {
    fetch("/config.json")
      .then(res => res.json())
      .then(config => setCreators(Object.keys(config)));
  }, []);

  let content = null;
  if (tab === 'home') {
    content = <CreatorsList />;
  } else if (tab === 'search') {
    content = (
      <div className="card" style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h2>🔍 Search</h2>
        <p>Search functionality coming soon!</p>
      </div>
    );
  } else if (tab === 'profile') {
    content = address ? (
      <ProfileSection address={address} />
    ) : (
      <div className="card" style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h2>👤 Profile</h2>
        <p>Connect your wallet to view your profile.</p>
      </div>
    );
  }

  return (
    <main className="container">
      <div className="main-content">
        {content}
      </div>
      <BottomTabBar tab={tab} setTab={setTab} />
    </main>
  );
}

export default App;