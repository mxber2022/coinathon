import { useState, useEffect } from "react";
import { youtubeManager } from "../utils/youtube";

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

  // Check if already authenticated on component mount
  useEffect(() => {
    const checkAuth = async () => {
      if (youtubeManager.loadStoredToken()) {
        try {
          // Verify token is still valid by making a test API call
          await youtubeManager.testConnection();
          setIsConnected(true);
        } catch (error) {
          console.error("Stored token invalid:", error);
          youtubeManager.clearTokens();
          setIsConnected(false);
        }
      }
    };
    
    checkAuth();
  }, []);

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (code && !isConnected) {
      handleOAuthCallback(code);
    } else if (error) {
      setError(`YouTube authorization failed: ${error}`);
    }
  }, [isConnected]);

  const handleOAuthCallback = async (code: string) => {
    setIsConnecting(true);
    setError(null);
    
    try {
      await youtubeManager.exchangeCodeForToken(code);
      setIsConnected(true);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err: any) {
      setError(`Failed to connect: ${err.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleYouTubeConnect = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const authUrl = youtubeManager.initiateAuth();
      window.location.href = authUrl;
    } catch (err: any) {
      setError(`Connection failed: ${err.message}`);
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
      // First, verify channel eligibility
      console.log("Checking channel eligibility...");
      const channelInfo = await youtubeManager.getChannelInfo();
      console.log("Channel info:", channelInfo);
      
      // Check if channel has live streaming enabled
      if (!channelInfo.items?.[0]?.status?.isLinked) {
        throw new Error("Channel not verified. Please verify your channel with a phone number.");
      }

      const streamData = await youtubeManager.createLiveStream({
        title: title.trim(),
        description: `Live stream powered by LiveDrop - Token gated content for ${tokenAddress}`,
        privacy,
        category
      });

      // Add additional metadata
      const enhancedStreamData = {
        ...streamData,
        tokenAddress,
        startTime: new Date().toISOString(),
        viewerCount: 0,
        tokenHolders: 24,
        duration: "0m",
      };

      onStreamStart(enhancedStreamData);
      
    } catch (err: any) {
      console.error("Stream creation error:", err);
      console.error("Full error details:", {
        message: err.message,
        stack: err.stack,
        response: err.response
      });
      
      let errorMessage = "Failed to create stream";
      
      if (err.message.includes('quota') || err.message.includes('exceeded')) {
        errorMessage = "YouTube API quota exceeded. Try again later.";
      } else if (err.message.includes('permission') || err.message.includes('forbidden')) {
        errorMessage = "YouTube channel not enabled for live streaming.";
      } else if (err.message.includes('verify') || err.message.includes('phone')) {
        errorMessage = "Please verify your YouTube channel with a phone number first.";
      } else if (err.message.includes('restrictions') || err.message.includes('violation')) {
        errorMessage = "Channel has live streaming restrictions. Check YouTube Studio.";
      } else if (err.message.includes('authentication')) {
        errorMessage = "Authentication expired. Please reconnect.";
        setIsConnected(false);
        youtubeManager.clearTokens();
      } else if (err.message.includes('not found')) {
        errorMessage = "YouTube API endpoint not found. Check API configuration.";
      } else {
        errorMessage = `Stream creation failed: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setIsCreatingStream(false);
    }
  };

  const handleDisconnect = () => {
    youtubeManager.clearTokens();
    setIsConnected(false);
    setError(null);
  };

  return (
    <div className="bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 p-4 space-y-3">
      {/* Header */}
      <div className="text-center">
        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-2">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </div>
        <h1 className="text-lg font-bold text-white mb-1">YouTube Live</h1>
        <p className="text-white/60 text-xs">Real-time streaming</p>
      </div>

      {!isConnected ? (
        // Connection Step
        <div className="space-y-3">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Connect YouTube</h3>
            <p className="text-white/60 text-xs mb-3">
              Authorize live streaming
            </p>
            
            <button
              onClick={handleYouTubeConnect}
              disabled={isConnecting}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-2.5 px-3 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
            >
              {isConnecting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Connecting...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  Connect YouTube
                </span>
              )}
            </button>
          </div>

          {/* Requirements */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2">
            <div className="text-blue-400 text-xs font-medium mb-1">📋 Requirements</div>
            <div className="space-y-0.5 text-xs text-white/70">
              <div>• YouTube channel with live streaming enabled</div>
              <div>• No recent live streaming violations</div>
              <div>• Mobile verification completed</div>
            </div>
          </div>
        </div>
      ) : (
        // Stream Setup
        <div className="space-y-3">
          {/* Connected Status */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                  <span className="text-green-400 text-xs">✓</span>
                </div>
                <div>
                  <div className="text-green-400 text-xs font-medium">YouTube Connected</div>
                  <div className="text-green-300/60 text-xs">Ready to stream</div>
                </div>
              </div>
              <button
                onClick={handleDisconnect}
                className="text-green-400/70 hover:text-green-400 text-xs"
              >
                Disconnect
              </button>
            </div>
          </div>

          {/* Stream Title */}
          <div>
            <label className="block text-white/80 text-xs font-medium mb-1">Stream Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What are you streaming?"
              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-white/50 focus:border-red-400 focus:outline-none transition-colors"
              maxLength={100}
            />
            <div className="text-white/40 text-xs mt-0.5">{title.length}/100</div>
          </div>

          {/* Category & Privacy */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-white/80 text-xs font-medium mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-2 py-2 text-white text-xs focus:border-red-400 focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value} className="bg-black">
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-white/80 text-xs font-medium mb-1">Privacy</label>
              <select
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-2 py-2 text-white text-xs focus:border-red-400 focus:outline-none"
              >
                <option value="public" className="bg-black">🌍 Public</option>
                <option value="unlisted" className="bg-black">🔗 Unlisted</option>
                <option value="private" className="bg-black">🔒 Private</option>
              </select>
            </div>
          </div>

          {/* Token Info */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">💎</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-xs font-medium">Stream Token</div>
                <div className="text-white/50 text-xs font-mono truncate">
                  {tokenAddress ? `${tokenAddress.slice(0, 8)}...${tokenAddress.slice(-6)}` : 'Loading...'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-white text-xs font-bold">24</div>
                <div className="text-white/50 text-xs">holders</div>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2">
              <div className="flex items-center gap-2">
                <span className="text-red-400 text-xs">⚠️</span>
                <span className="text-red-400 text-xs">{error}</span>
              </div>
            </div>
          )}

          {/* Go Live Button */}
          <button
            onClick={handleCreateStream}
            disabled={isCreatingStream || !title.trim()}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isCreatingStream ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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