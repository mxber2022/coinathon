import { sdk } from "@farcaster/frame-sdk";
import { useEffect, useState } from "react";
import CreatorsList from "./components/CreatorsList";
import LiveDrop from "./components/LiveDrop";
import { useAccount } from "wagmi";

function App() {
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);
  const { address } = useAccount();
  const [creators, setCreators] = useState<string[]>([]);

  useEffect(() => {
    sdk.actions.ready();
  }, []);

  useEffect(() => {
    fetch("/config.json")
      .then(res => res.json())
      .then(config => setCreators(Object.keys(config)));
  }, []);

  const isCreator = address && creators.includes(address);

  return (
    <main className="container">
      {isCreator && !selectedCreator && (
        <button className="button" style={{ marginBottom: 16 }} onClick={() => setSelectedCreator(address!)}>
          View My Profile
        </button>
      )}
      {!selectedCreator ? (
        <CreatorsList onSelect={setSelectedCreator} />
      ) : (
        <LiveDrop creatorAddress={selectedCreator} onBack={() => setSelectedCreator(null)} />
      )}
    </main>
  );
}

export default App;
