interface ProfileSectionProps {
  address: string;
}

function ProfileSection({ address }: ProfileSectionProps) {
  const stats = [
    { label: 'Tokens Owned', value: '3', icon: '💎' },
    { label: 'Streams Watched', value: '12', icon: '🎥' },
    { label: 'Creators Followed', value: '8', icon: '👥' },
    { label: 'Rewards Earned', value: '24', icon: '🏆' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 pt-8 pb-32">
      {/* Profile Header */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl shadow-xl">
              👤
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-black flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-1">Your Profile</h1>
            <p className="text-white/60 text-sm mb-3">Premium member since joining</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-3 py-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs font-semibold">Active</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-3 py-1">
                <span className="text-blue-400 text-xs font-semibold">Premium</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="glass-card p-4 text-center hover:scale-105 transition-transform duration-300">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-white/60 text-xs font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Wallet Information */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-xl">🔗</span>
          Wallet Details
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Connected Address</label>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 font-mono text-sm text-white/90 break-all">
              {address}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Network</label>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <div className="text-blue-400 font-semibold text-sm">Base Sepolia</div>
              </div>
            </div>
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Balance</label>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <div className="text-green-400 font-semibold text-sm">0.5 ETH</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSection;