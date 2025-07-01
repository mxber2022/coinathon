import { sdk } from "@farcaster/frame-sdk";
import { useEffect } from "react";
import LiveDrop from "./components/LiveDrop";

function App() {
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return (
    <main className="container">
      <LiveDrop />
    </main>
  );
}

export default App;
