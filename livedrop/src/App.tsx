import { useEffect, useState } from "react";
import CreatorsList from "./components/CreatorsList";
import LiveDrop from "./components/LiveDrop";
import ProfileSection from "./components/ProfileSection";
import GoLiveSection from "./components/GoLiveSection";
import { useAccount } from "wagmi";
import BottomTabBar from "./components/BottomTabBar";

function App() {
  const { address } = useAccount();
  const [tab, setTab] = useState<'home' | 'search' | 'live' | 'profile'>('home');
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
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="glass-card p-8 text-center max-w-sm w-full">
          <div className="text-6xl mb-4 float-animation">🔍</div>
          <h2 className="text-2xl font-bold text-gradient mb-3">Discover</h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Search functionality coming soon! Find your favorite creators and exclusive content.
          </p>
        </div>
      </div>
    );
  } else if (tab === 'live') {
    content = address ? (
      <div className="flex-1 p-4 safe-top">
        <GoLiveSection address={address} />
      </div>
    ) : (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="glass-card p-8 text-center max-w-sm w-full">
          <div className="text-6xl mb-4 float-animation">📹</div>
          <h2 className="text-2xl font-bold text-gradient mb-3">Go Live</h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Connect your wallet to start streaming and create exclusive content for your audience.
          </p>
        </div>
      </div>
    );
  } else if (tab === 'profile') {
    content = address ? (
      <div className="flex-1 p-4 safe-top">
        <ProfileSection address={address} />
      </div>
    ) : (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="glass-card p-8 text-center max-w-sm w-full">
          <div className="text-6xl mb-4 float-animation">👤</div>
          <h2 className="text-2xl font-bold text-gradient mb-3">Profile</h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Connect your wallet to view your profile and access exclusive features.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-1">
        {content}
      </div>
      <BottomTabBar tab={tab} setTab={setTab} />
    </div>
  );
}

export default App;