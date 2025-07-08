import { useState, useEffect } from "react";
import CreateCoinComponent from "./CreateCoinComponent";

interface GoLiveSectionProps {
  address: string;
}

function GoLiveSection({ address }: GoLiveSectionProps) {
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [tokenAddress, setTokenAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [streamTitle, setStreamTitle] = useState("");
  const [streamDescription, setStreamDescription] = useState("");
  const [category, setCategory] = useState("art");
  const [showCreateToken, setShowCreateToken] = useState(false);

  // Check if user has deployed a stream token
  useEffect(() => {
    const checkTokenStatus = async () => {
      try {
        const response = await fetch("/config.json");
        const config = await response.json();
        
        if (config[address]) {
          setHasToken(true);
          setTokenAddress(config[address].tokenAddress);
        } else {
          setHasToken(false);
          setTokenAddress(null);
        }
      } catch (error) {
        console.error("Error checking token status:", error);
        setHasToken(false);
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      checkTokenStatus();
    }
  }, [address]);

  const categories = [
    { value: "art", label: "🎨 Digital Art", color: "from-purple-500 to-pink-500" },
    { value: "music", label: "🎵 Music Production", color: "from-blue-500 to-cyan-500" },
    { value: "gaming", label: "🎮 Game Development", color: "from-green-500 to-teal-500" },
    { value: "education", label: "📚 Education", color: "from-orange-500 to-red-500" },
    { value: "tech", label: "💻 Technology", color: "from-indigo-500 to-purple-500" },
    { value: "lifestyle", label: "✨ Lifestyle", color: "from-pink-500 to-rose-500" },
  ];

  const handleGoLive = () => {
    if (streamTitle.trim()) {
      setIsLive(true);
    }
  };

  const handleEndStream = () => {
    setIsLive(false);
    setStreamTitle("");
    setStreamDescription("");
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto pt-8 pb-32">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-white mb-2">Checking Token Status</h3>
            <p className="text-white/60 text-sm">Verifying your stream token...</p>
          </div>
        </div>
      </div>
    );
  }

  // No token deployed - show create token prompt
  if (!hasToken) {
    return (
      <div className="min-h-screen overflow-y-auto pt-4 pb-32 bg-black">
        <div className="max-w-md w-full mx-auto px-0">
          <CreateCoinComponent />
        </div>
      </div>
    );
  }


  if (isLive) {
    return (
      <div className="min-h-screen overflow-y-auto pt-4 pb-32 bg-black">
        <div className="mx-3 mb-3">
          <div className="bg-black/60 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-6 space-y-6">
        {/* Live Stream Header */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-red-500/90 backdrop-blur-xl px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full live-pulse"></div>
                <span className="text-white text-sm font-bold tracking-wider">LIVE NOW</span>
              </div>
              <div className="text-white/70 text-sm">
                Started 2 minutes ago
              </div>
            </div>
            <button 
              onClick={handleEndStream}
              className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-xl font-semibold hover:bg-red-500/30 transition-colors"
            >
              End Stream
            </button>
          </div>
          
          <h2 className="text-xl font-bold text-white mb-2">{streamTitle}</h2>
          <p className="text-white/70 text-sm mb-4">{streamDescription}</p>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-white/70">23 viewers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/70">💎 12 token holders</span>
            </div>
          </div>
        </div>

        {/* Stream Preview */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Stream Preview</h3>
          <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-2xl flex items-center justify-center border border-white/10">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <p className="text-white/70 text-sm">Your live stream is active</p>
            </div>
          </div>
        </div>

        {/* Stream Stats */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Total Views', value: '156', icon: '👁️' },
            { label: 'New Followers', value: '+8', icon: '👥' },
            { label: 'Tokens Minted', value: '12', icon: '💎' },
            { label: 'Revenue', value: '$24', icon: '💰' },
          ].map((stat, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-white/60 text-xs font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Live Chat Preview */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Live Chat</h3>
          <div className="space-y-3 max-h-40 overflow-y-auto">
            {[
              { user: "alice_crypto", message: "Amazing work! 🎨", time: "2m" },
              { user: "bob_nft", message: "Just minted your token!", time: "1m" },
              { user: "creator_jane", message: "Thanks for joining everyone! ✨", time: "30s" },
            ].map((chat, index) => (
              <div key={index} className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                  {chat.user[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white/90 font-medium">{chat.user}</span>
                    <span className="text-white/50 text-xs">{chat.time}</span>
                  </div>
                  <p className="text-white/70">{chat.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-y-auto pt-4 pb-32 bg-black">
      <div className="mx-3 mb-3">
        <div className="bg-black/60 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4 float-animation">📹</div>
        <h1 className="text-3xl font-bold text-gradient mb-3">Go Live</h1>
        <p className="text-white/70 text-sm leading-relaxed">
          Start streaming and create exclusive content for your token holders
        </p>
      </div>

      {/* Stream Setup Form */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Stream Setup</h2>
        
        <div className="space-y-6">
          {/* Stream Title */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Stream Title</label>
            <input
              type="text"
              value={streamTitle}
              onChange={(e) => setStreamTitle(e.target.value)}
              placeholder="What are you streaming today?"
              className="glass-input w-full"
            />
          </div>

          {/* Stream Description */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Description</label>
            <textarea
              value={streamDescription}
              onChange={(e) => setStreamDescription(e.target.value)}
              placeholder="Tell your audience what to expect..."
              rows={3}
              className="glass-input w-full resize-none"
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-3">Category</label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`p-4 rounded-2xl border transition-all duration-300 ${
                    category === cat.value
                      ? 'border-blue-500/50 bg-blue-500/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="text-sm font-medium text-white">{cat.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stream Settings */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Stream Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Token Gated</div>
              <div className="text-white/60 text-sm">Require token to access stream</div>
            </div>
            <div className="w-12 h-6 bg-blue-500 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Chat Enabled</div>
              <div className="text-white/60 text-sm">Allow viewers to chat</div>
            </div>
            <div className="w-12 h-6 bg-blue-500 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Recording</div>
              <div className="text-white/60 text-sm">Save stream for replay</div>
            </div>
            <div className="w-12 h-6 bg-gray-600 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Token Management */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Stream Token</h3>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">💎</span>
            </div>
            <div>
              <div className="text-white font-medium">Your Stream Token</div>
              <div className="text-white/60 text-sm font-mono">
                {tokenAddress ? `${tokenAddress.slice(0, 6)}...${tokenAddress.slice(-4)}` : 'Loading...'}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-white">24</div>
              <div className="text-white/60 text-xs">Holders</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">0.01</div>
              <div className="text-white/60 text-xs">Price (ETH)</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">$48</div>
              <div className="text-white/60 text-xs">Revenue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Go Live Button */}
      <button
        onClick={handleGoLive}
        disabled={!streamTitle.trim()}
        className="glass-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="flex items-center justify-center gap-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-lg font-bold">Start Live Stream</span>
        </span>
      </button>
      </div>
      </div>
    </div>
  );
}

export default GoLiveSection;