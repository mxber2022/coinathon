import CreatorInfo from "./CreatorInfo";

function LiveStream() {
  return (
    <div className="card">
      <CreatorInfo />
      <h2>Welcome to the Stream!</h2>
      <div className="video-placeholder">
        <p>Livestream video would be here.</p>
      </div>
      <h3>Perks for Token Holders:</h3>
      <ul>
        <li>Access to live replay</li>
        <li>Exclusive content</li>
        <li>Shoutouts from the creator</li>
      </ul>
    </div>
  );
}

export default LiveStream; 