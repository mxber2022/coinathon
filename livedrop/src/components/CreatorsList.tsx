import React, { useEffect, useState } from "react";

interface Creator {
  address: string;
  tokenAddress: string;
}

function CreatorsList() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / windowHeight);
      setCurrentIndex(newIndex);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-white mb-2">Discovering Creators</h3>
          <p className="text-white/60 text-sm">Finding the best live streams for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto scrollbar-hide snap-y snap-mandatory">
      {creators.map((creator, index) => {
        const isActive = index === currentIndex;
        const creatorTypes = ['🎨 Digital Artist', '🎵 Music Producer', '🎮 Game Developer'];
        const creatorBios = [
          'Creating immersive digital art experiences in real-time',
          'Producing beats and collaborating with the community',
          'Building the next generation of Web3 games'
        ];
        const gradients = [
          'from-purple-600 via-blue-600 to-indigo-700',
          'from-pink-500 via-red-500 to-orange-500',
          'from-blue-500 via-cyan-500 to-teal-500'
        ];
        
        return (
          <div key={creator.address} className="h-screen relative snap-start snap-always overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
              <img
                src={`https://images.pexels.com/photos/${774909 + index}/pexels-photo-${774909 + index}.jpeg?auto=compress&cs=tinysrgb&w=400&h=800&fit=crop`}
                alt="Creator background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40"></div>
            </div>

            {/* Status Bar Safe Area */}
            <div className="safe-top"></div>

            {/* Live Badge */}
            <div className="absolute top-4 left-4 z-20 safe-top">
              <div className="flex items-center gap-2 bg-red-500/90 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20">
                <div className="w-2 h-2 bg-white rounded-full live-pulse"></div>
                <span className="text-white text-xs font-bold tracking-wider">LIVE NOW</span>
              </div>
            </div>

            {/* Viewer Count */}
            <div className="absolute top-4 right-4 z-20 safe-top">
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-white text-xs font-semibold">{Math.floor(Math.random() * 500) + 100}</span>
              </div>
            </div>

            {/* Main Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pb-32 z-10">
              {/* Creator Profile */}
              <div className="flex items-start gap-4 mb-6">
                <div className="relative">
                  <img
                    src={`https://images.pexels.com/photos/${774909 + index}/pexels-photo-${774909 + index}.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`}
                    alt="Creator"
                    className="w-16 h-16 rounded-full border-3 border-white/30 shadow-xl"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-black flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-white text-xl font-bold mb-1 leading-tight">
                    {creatorTypes[index % 3]}
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed mb-3">
                    {creatorBios[index % 3]}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-white/70">
                    <span className="flex items-center gap-1">
                      <span>💎</span>
                      {Math.floor(Math.random() * 1000) + 500} holders
                    </span>
                    <span className="flex items-center gap-1">
                      <span>👁️</span>
                      {Math.floor(Math.random() * 100) + 50} watching
                    </span>
                  </div>
                </div>
              </div>

              {/* Token Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 px-3 py-2 rounded-full">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-400 text-xs font-bold tracking-wider">TOKEN REQUIRED</span>
                  </div>
                  <button className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 px-3 py-2 rounded-full hover:scale-105 transition-transform duration-300">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-blue-400 text-xs font-bold tracking-wider">BUY TOKEN</span>
                  </button>
                </div>
                <p className="text-white/50 text-xs font-mono pl-1">
                  {creator.tokenAddress.slice(0, 6)}...{creator.tokenAddress.slice(-4)}
                </p>
              </div>
            </div>

            {/* Side Actions */}
            <div className="absolute right-4 bottom-44 z-20 flex flex-col gap-3">
              {[
                { icon: '❤️', count: `${Math.floor(Math.random() * 100) + 20}k` },
                { icon: '💬', count: `${Math.floor(Math.random() * 50) + 10}k` },
                { icon: '📤', label: 'Share' },
                { icon: '🔖', label: 'Save' }
              ].map((action, i) => (
                <button key={i} className="w-14 h-14 bg-black/60 backdrop-blur-xl rounded-full border border-white/20 flex flex-col items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg">
                  <span className="text-xl mb-1">{action.icon}</span>
                  <span className="text-xs font-semibold leading-none">{'count' in action ? action.count : action.label}</span>
                </button>
              ))}
            </div>

            {/* Scroll Indicator */}
            {index < creators.length - 1 && (
              <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20">
                <div className="text-white/60 animate-bounce">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>
            )}

            {/* Progress Indicator */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-20 flex flex-col gap-2">
              {creators.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-300 ${
                    isActive && i === index 
                      ? 'h-10 bg-gradient-to-b from-blue-400 to-purple-500 shadow-lg' 
                      : 'h-3 bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CreatorsList;