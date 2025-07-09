import { useState } from "react";

interface YouTubeStreamSetupProps {
  tokenAddress: string | null;
  onStreamStart: (streamData: any) => void;
}

function YouTubeStreamSetup({ tokenAddress, onStreamStart }: YouTubeStreamSetupProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCreatingStream, setIsCreatingStream] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("gaming");
  const [privacy, setPrivacy] = useState("public");

  const categories = [
    { value: "gaming", label: "🎮 Gaming" },
    { value: "music", label: "🎵 Music" },
    { value: "art", label: "🎨 Art" },
    { value: "tech", label: "💻 Tech" },
  ];

  const handleYouTubeConnect = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsConnected(true);
    } catch (err: any) {
      setError("Failed to connect to YouTube");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCreateStream = async () => {
    if (!title.trim()) {
      setError("Please enter a stream title");
      return;
    }

    setIsCreatingStream(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const streamData = {
        broadcastId: `broadcast_${Date.now()}`,
        streamKey: `stream_key_${Math.random().toString(36).substr(2, 16)}`,
        streamUrl: "rtmp://a.rtmp.youtube.com/live2/",
        watchUrl: `https://youtube.com/watch?v=mock_${Date.now()}`,
        title,
        category,
        privacy,
        startTime: new Date().toISOString(),
        viewerCount: 0,
        tokenHolders: 24,
        duration: "0m",
      };

      onStreamStart(streamData);
      
    } catch (err: any) {
      setError("Failed to create stream");
    } finally {
      setIsCreatingStream(false);
    }
  };

  return (
    <div className="w-full pt-4 bg-black/90 backdrop-blur-xl rounded-3xl border border-white/10 p-4 space-y-4">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </div>
        <h1 className="text-xl font-bold text-white mb-1">YouTube Live</h1>
        <p className="text-white/60 text-sm">Stream to millions of viewers</p>
      </div>

      {!isConnected ? (
        // Connection Step
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Connect YouTube</h3>
            <p className="text-white/60 text-sm mb-4">
              Authorize to create live streams
            </p>
            
            <button
              onClick={handleYouTubeConnect}
              disabled={isConnecting}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isConnecting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Connecting...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  Connect YouTube
                </span>
              )}
            </button>
          </div>

          {/* Quick Benefits */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
            <div className="text-blue-400 text-sm font-medium mb-2">✨ Benefits</div>
            <div className="space-y-1 text-xs text-white/70">
              <div>• Reach millions of viewers</div>
              <div>• Professional streaming tools</div>
              <div>• Token-gated premium features</div>
            </div>
          </div>
        </div>
      ) : (
        // Stream Setup
        <div className="space-y-4">
          {/* Connected Status */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                <span className="text-green-400 text-sm">✓</span>
              </div>
              <div>
                <div className="text-green-400 text-sm font-medium">YouTube Connected</div>
                <div className="text-green-300/60 text-xs">Ready to stream</div>
              </div>
            </div>
          </div>

          {/* Stream Title */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Stream Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What are you streaming?"
              className="w-full bg-white/5 border border-white/20 rounded-xl px-3 py-3 text-white placeholder-white/50 focus:border-red-400 focus:outline-none transition-colors"
              maxLength={60}
            />
            <div className="text-white/40 text-xs mt-1">{title.length}/60</div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                    category === cat.value
                      ? 'border-red-500/50 bg-red-500/10 text-white'
                      : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Privacy</label>
            <div className="flex gap-2">
              {[
                { value: 'public', label: '🌍 Public' },
                { value: 'unlisted', label: '🔗 Unlisted' },
              ].map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPrivacy(p.value)}
                  className={`flex-1 p-3 rounded-xl border text-sm font-medium transition-all ${
                    privacy === p.value
                      ? 'border-red-500/50 bg-red-500/10 text-white'
                      : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Token Info */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">💎</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium">Stream Token</div>
                <div className="text-white/50 text-xs font-mono truncate">
                  {tokenAddress ? `${tokenAddress.slice(0, 8)}...${tokenAddress.slice(-6)}` : 'Loading...'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-white text-sm font-bold">24</div>
                <div className="text-white/50 text-xs">holders</div>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <span className="text-red-400 text-sm">⚠️</span>
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Go Live Button */}
          <button
            onClick={handleCreateStream}
            disabled={isCreatingStream || !title.trim()}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isCreatingStream ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating Stream...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                Go Live on YouTube
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default YouTubeStreamSetup;