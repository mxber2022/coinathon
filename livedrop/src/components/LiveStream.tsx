import CreatorInfo from "./CreatorInfo";

function LiveStream() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 safe-top">
        <div className="flex items-center gap-4 p-4">
          <img
            src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
            alt="Creator"
            className="w-12 h-12 rounded-full border-2 border-white/30"
          />
          <div className="flex-1">
            <h3 className="text-white font-semibold text-base">@jane_creates</h3>
            <p className="text-white/60 text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              Live • Digital Art Session
            </p>
          </div>
          <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white/70" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="1"/>
              <circle cx="19" cy="12" r="1"/>
              <circle cx="5" cy="12" r="1"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Video Content */}
      <div className="relative h-96 bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center">
        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-2 bg-red-500/90 backdrop-blur-xl px-3 py-2 rounded-full">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-white text-xs font-bold">LIVE NOW</span>
          </div>
        </div>
        
        <button className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 hover:scale-110 transition-transform duration-300">
          <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
        
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white text-lg font-semibold text-center drop-shadow-lg">
            🎨 Creating Digital Masterpiece
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-6">
          {[
            { icon: '❤️', count: '2.8k' },
            { icon: '💬', count: '156' },
            { icon: '📤', count: 'Share' }
          ].map((action, index) => (
            <button key={index} className="flex flex-col items-center gap-1 hover:scale-110 transition-transform duration-300">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-lg">{action.icon}</span>
              </div>
              <span className="text-white/70 text-xs font-medium">{action.count}</span>
            </button>
          ))}
        </div>
        <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      {/* Engagement Info */}
      <div className="p-4 space-y-4">
        <div>
          <p className="text-white font-semibold text-base mb-2">2,847 likes</p>
          <div className="space-y-2">
            <p className="text-white/90 text-sm">
              <span className="font-semibold">@jane_creates</span> Creating a new digital art piece live! 🎨✨ Token holders get exclusive access to the creative process and final artwork as NFT
            </p>
            <button className="text-white/60 text-sm hover:text-white/80 transition-colors">
              View all 156 comments
            </button>
            <p className="text-white/50 text-xs">Started 47 minutes ago</p>
          </div>
        </div>
      </div>

      {/* Premium Benefits */}
      <div className="p-4 bg-white/5 border-t border-white/10">
        <h4 className="text-gradient text-lg font-bold mb-4 flex items-center gap-2">
          ✨ Premium Member Benefits
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '🎬', label: 'Full session replay' },
            { icon: '🖼️', label: 'Exclusive NFT drop' },
            { icon: '💬', label: 'Direct chat access' },
            { icon: '🎯', label: 'Creative input' }
          ].map((perk, index) => (
            <div key={index} className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
              <span className="text-xl">{perk.icon}</span>
              <span className="text-white/80 text-sm font-medium">{perk.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LiveStream;