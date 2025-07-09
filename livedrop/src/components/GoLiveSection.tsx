import { useState, useEffect } from "react";
import CreateCoinComponent from "./CreateCoinComponent";
import YouTubeStreamSetup from "./YouTubeStreamSetup";

interface GoLiveSectionProps {
  address: string;
}

function GoLiveSection({ address }: GoLiveSectionProps) {
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [tokenAddress, setTokenAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [streamData, setStreamData] = useState<any>(null);

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

  const handleStreamStart = (data: any) => {
    setStreamData(data);
    setIsLive(true);
  };

  const handleEndStream = async () => {
    try {
      if (streamData?.broadcastId) {
        console.log("Ending YouTube broadcast:", streamData.broadcastId);
      }
      setIsLive(false);
      setStreamData(null);
    } catch (error) {
      console.error("Error ending stream:", error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96 px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60 text-sm">Checking token...</p>
        </div>
      </div>
    );
  }

  // No token deployed
  if (!hasToken) {
    return (
      <div className="px-4 pb-32 pt-4">
        <CreateCoinComponent />
      </div>
    );
  }

  // Live streaming view
  if (isLive && streamData) {
    return (
      <div className="px-4 pb-32 space-y-4">
        {/* Live Header */}
        <div className="bg-black/90 backdrop-blur-xl rounded-3xl border border-white/10 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-red-500 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-white text-xs font-bold">LIVE</span>
              </div>
              <span className="text-white/60 text-sm">YouTube</span>
            </div>
            <button 
              onClick={handleEndStream}
              className="bg-red-500/20 border border-red-500/30 text-red-400 px-3 py-1 rounded-lg text-sm font-medium"
            >
              End
            </button>
          </div>
          
          <h2 className="text-lg font-bold text-white mb-2">{streamData.title}</h2>
          
          <div className="flex items-center gap-4 text-sm text-white/70">
            <span>👁️ {streamData.viewerCount || 0}</span>
            <span>💎 {streamData.tokenHolders || 1}</span>
          </div>
        </div>

        {/* Stream Preview */}
        <div className="bg-black/90 backdrop-blur-xl rounded-3xl border border-white/10 p-4 ">
          <div className="aspect-video bg-gradient-to-br from-red-900/30 to-pink-900/30 rounded-2xl flex items-center justify-center border border-red-500/20 mb-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <p className="text-red-400 text-sm font-medium mb-1">YouTube Live Active</p>
              <p className="text-white/50 text-xs">Use OBS with stream key</p>
            </div>
          </div>
          
          {streamData.watchUrl && (
            <a 
              href={streamData.watchUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-red-500/20 border border-red-500/30 text-red-400 py-3 px-4 rounded-xl text-sm font-medium text-center block hover:bg-red-500/30 transition-colors"
            >
              Watch on YouTube
            </a>
          )}
        </div>

        {/* Stream Key */}
        <div className="bg-black/90 backdrop-blur-xl rounded-3xl border border-white/10 p-4">
          <h3 className="text-white font-medium mb-3">Stream Setup</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Server:</span>
              <span className="text-white/90 font-mono text-xs">rtmp://a.rtmp.youtube.com/live2/</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Key:</span>
              <span className="text-white/90 font-mono text-xs">
                {streamData.streamKey?.slice(0, 12)}...
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Views', value: streamData.viewerCount || '0', icon: '👁️' },
            { label: 'Holders', value: '24', icon: '💎' },
            { label: 'Duration', value: streamData.duration || '0m', icon: '⏱️' },
            { label: 'Revenue', value: '$48', icon: '💰' },
          ].map((stat, index) => (
            <div key={index} className="bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 p-3 text-center">
              <div className="text-lg mb-1">{stat.icon}</div>
              <div className="text-lg font-bold text-white">{stat.value}</div>
              <div className="text-white/50 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Stream setup view
  return (
    <div className="pb-32 pt-4 px-4">
      <YouTubeStreamSetup 
        tokenAddress={tokenAddress}
        onStreamStart={handleStreamStart}
      />
    </div>
  );
}

export default GoLiveSection;