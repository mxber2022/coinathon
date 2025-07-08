import React from "react";

interface BottomTabBarProps {
  tab: 'home' | 'search' | 'live' | 'profile';
  setTab: (tab: 'home' | 'search' | 'live' | 'profile') => void;
}

const tabs = [
  { 
    key: 'home', 
    label: 'Home', 
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 transition-all duration-300 ${active ? 'scale-110' : ''}`} fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  { 
    key: 'search', 
    label: 'Search', 
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 transition-all duration-300 ${active ? 'scale-110' : ''}`} fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    )
  },
  { 
    key: 'live', 
    label: 'Go Live', 
    icon: (active: boolean) => (
      <div className="relative">
        <svg className={`w-6 h-6 transition-all duration-300 ${active ? 'scale-110' : ''}`} fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        {active && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border border-black"></div>
        )}
      </div>
    )
  },
  { 
    key: 'profile', 
    label: 'Profile', 
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 transition-all duration-300 ${active ? 'scale-110' : ''}`} fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
];

const BottomTabBar: React.FC<BottomTabBarProps> = ({ tab, setTab }) => (
  <div className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
    {/* Background blur overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent backdrop-blur-xl"></div>
    
    {/* Tab container */}
    <div className="relative mx-3 mb-3">
      <div className="bg-black/60 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Floating active indicator */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute top-2 bottom-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl border border-white/20 transition-all duration-300 ease-out mx-1"
            style={{
              width: 'calc(25% - 4px)',
              transform: `translateX(${tabs.findIndex(t => t.key === tab) * 100 + 2}%)`,
            }}
          />
        </div>
        
        {/* Tab navigation */}
        <nav className="relative flex items-center h-20 px-2">
          {tabs.map(t => {
            const isActive = tab === t.key;
            return (
              <button
                key={t.key}
                className={`flex-1 flex flex-col items-center justify-center h-16 mx-1 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                  isActive 
                    ? 'text-white' 
                    : 'text-white/50 hover:text-white/80'
                }`}
                onClick={() => setTab(t.key as any)}
                aria-label={t.label}
              >
                {/* Ripple effect on tap */}
                <div className="absolute inset-0 bg-white/10 rounded-2xl scale-0 group-active:scale-100 transition-transform duration-200"></div>
                
                {/* Icon container */}
                <div className={`relative mb-1 transition-all duration-300 ${
                  isActive 
                    ? 'text-blue-400 drop-shadow-lg' 
                    : 'group-hover:scale-105'
                }`}>
                  {t.icon(isActive)}
                </div>
                
                {/* Label */}
                <span className={`text-xs font-medium transition-all duration-300 ${
                  isActive 
                    ? 'text-white font-semibold scale-105' 
                    : 'text-white/60 group-hover:text-white/80'
                }`}>
                  {t.label}
                </span>
                
                {/* Active dot indicator */}
                {isActive && (
                  <div className="absolute -bottom-1 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
    
    {/* Home indicator for iOS */}
    <div className="flex justify-center pb-2">
      <div className="w-32 h-1 bg-white/20 rounded-full"></div>
    </div>
  </div>
);

export default BottomTabBar;