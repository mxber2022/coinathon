import React from "react";

interface BottomTabBarProps {
  tab: 'home' | 'search' | 'profile';
  setTab: (tab: 'home' | 'search' | 'profile') => void;
}

const tabs = [
  { key: 'home', label: 'Home', icon: (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M3 12L12 3l9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 21V9h6v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ) },
  { key: 'search', label: 'Search', icon: (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
  ) },
  { key: 'profile', label: 'Profile', icon: (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ) },
];

const BottomTabBar: React.FC<BottomTabBarProps> = ({ tab, setTab }) => (
  <nav className="bottom-tab-bar">
    {tabs.map(t => (
      <button
        key={t.key}
        className={`tab-btn${tab === t.key ? ' active' : ''}`}
        onClick={() => setTab(t.key as any)}
        aria-label={t.label}
      >
        {t.icon}
        <span>{t.label}</span>
      </button>
    ))}
  </nav>
);

export default BottomTabBar; 