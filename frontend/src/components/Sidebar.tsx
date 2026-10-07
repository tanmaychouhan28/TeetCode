import React from 'react';
import { 
  LayoutDashboard, 
  Code2, 
  GitFork, 
  BotMessageSquare, 
  TerminalSquare, 
  Flame, 
  BarChart3, 
  FileText, 
  Settings, 
  LogOut, 
  LogIn, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TeetCodeLogo } from './TeetCodeLogo';

export type PageId = 
  | 'landing' 
  | 'dashboard' 
  | 'problems' 
  | 'workspace' 
  | 'roadmap' 
  | 'ai-coach' 
  | 'practice' 
  | 'mock-interview' 
  | 'progress' 
  | 'notes' 
  | 'settings';

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenAuthModal: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  onOpenAuthModal,
  isOpenMobile,
  onCloseMobile
}) => {
  const { user, isAuthenticated, logout } = useAuth();

  const navItems: { id: PageId; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Explore & Home', icon: <LayoutDashboard size={17} /> },
    { id: 'problems', label: 'Problem Catalog', icon: <Code2 size={17} />, badge: '6 active' },
    { id: 'roadmap', label: 'Study Plan Roadmap', icon: <GitFork size={17} />, badge: 'Graphs' },
    { id: 'ai-coach', label: 'Socratic AI Mentor', icon: <BotMessageSquare size={17} />, badge: 'AI' },
    { id: 'practice', label: 'Targeted Practice', icon: <TerminalSquare size={17} /> },
    { id: 'mock-interview', label: 'Mock Interview', icon: <Sparkles size={17} />, badge: 'Live' },
    { id: 'progress', label: 'Progress Analytics', icon: <BarChart3 size={17} /> },
    { id: 'notes', label: 'Invariant Notes', icon: <FileText size={17} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={17} /> },
  ];

  const handleItemClick = (id: PageId) => {
    onNavigate(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        fixed lg:static top-0 left-0 bottom-0 z-50
        w-64 bg-[#1F1F1F] border-r border-[#333333]
        flex flex-col justify-between
        transition-transform duration-150 ease-out select-none
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Header & Logo */}
        <div>
          <div className="h-14 px-5 flex items-center justify-between border-b border-[#333333] bg-[#1A1A1A]">
            <button 
              onClick={() => handleItemClick('dashboard')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <TeetCodeLogo size="sm" />
            </button>
            <div className="text-[10px] px-1.5 py-0.5 rounded bg-[#262626] border border-[#3C3C3C] text-[#A1A1AA] font-mono">
              v2.0
            </div>
          </div>

          {/* Socratic Philosophy Notice */}
          <div className="p-3 mx-3 my-3 bg-[#262626] border border-[#333333] rounded-lg">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#EFF1F6]">
              <span className="w-2 h-2 rounded-full bg-[#00B8A3] inline-block animate-pulse"></span>
              <span className="font-semibold text-[#00B8A3]">TeetCode Socratic Engine</span>
            </div>
            <p className="text-[11px] text-[#A1A1AA] mt-1 leading-snug">
              Master algorithmic invariants through guided questions — no instant code giveaways.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="px-2 space-y-0.5">
            {navItems.map((item) => {
              const isActive = currentPage === item.id || (item.id === 'ai-coach' && currentPage === 'workspace');
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md
                    transition-all text-left
                    ${isActive 
                      ? 'bg-[#2A2A2A] text-white font-semibold border-l-2 border-[#FFA116] shadow-sm' 
                      : 'text-[#A1A1AA] hover:text-white hover:bg-[#252525]'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-[#FFA116]' : 'text-[#858585]'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isActive ? 'bg-[#FFA116]/20 text-[#FFA116] font-bold' : 'bg-[#262626] text-[#858585] border border-[#333333]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: User Profile & Streak */}
        <div className="p-3 border-t border-[#333333] bg-[#1A1A1A]">
          {isAuthenticated && user ? (
            <div className="space-y-2.5">
              {/* Streak Widget */}
              <div 
                onClick={() => handleItemClick('progress')}
                className="p-2.5 bg-[#262626] border border-[#333333] rounded-md flex items-center justify-between cursor-pointer hover:border-[#FFA116]/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#FFA116]/10 border border-[#FFA116]/30 text-[#FFA116] flex items-center justify-center">
                    <Flame size={14} className="text-[#FFA116]" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-white font-bold leading-none">
                      {user.streak || 14} DAYS
                    </div>
                    <div className="text-[10px] text-[#858585] font-mono">Current Streak</div>
                  </div>
                </div>
                <div className="text-[10px] px-1.5 py-0.5 rounded bg-[#00B8A3]/10 border border-[#00B8A3]/30 text-[#00B8A3] font-mono font-bold">
                  +1 TODAY
                </div>
              </div>

              {/* User Bar */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-[#2CBB5D] text-black flex items-center justify-center font-bold text-xs">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold text-white truncate">{user.full_name}</div>
                    <div className="text-[10px] font-mono text-[#858585] truncate">@{user.username}</div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-1.5 text-[#858585] hover:text-[#FF375F] rounded hover:bg-[#262626] transition-colors"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-[#FFA116] text-black font-semibold text-xs hover:bg-[#FFB03A] transition-colors"
            >
              <LogIn size={14} />
              <span>Sign In / Demo</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
