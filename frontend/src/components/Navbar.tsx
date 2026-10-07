import React from 'react';
import { 
  Menu, 
  Zap, 
  Sparkles, 
  Terminal, 
  Flame, 
  Code2, 
  Compass, 
  GitFork, 
  FileText, 
  BotMessageSquare,
  CheckCircle2,
  ChevronDown,
  User,
  LogOut,
  LogIn
} from 'lucide-react';
import { PageId } from './Sidebar';
import { TeetCodeLogo } from './TeetCodeLogo';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenMobileMenu: () => void;
  onOpenPracticeModal: () => void;
  socraticMode: boolean;
  onToggleSocratic: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenMobileMenu,
  onOpenPracticeModal,
  socraticMode,
  onToggleSocratic
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);

  const topNavLinks: { id: PageId; label: string; badge?: string }[] = [
    { id: 'dashboard', label: 'Explore' },
    { id: 'problems', label: 'Problems' },
    { id: 'roadmap', label: 'Study Plan' },
    { id: 'mock-interview', label: 'Interview', badge: 'Live' },
    { id: 'notes', label: 'Notes' },
    { id: 'progress', label: 'Analytics' },
  ];

  return (
    <header className="h-13 bg-[#1A1A1A] border-b border-[#333333] px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0 text-[#EFF1F6] select-none">
      {/* Left: Mobile Menu Trigger + Brand Logo + LeetCode-style Nav Links */}
      <div className="flex items-center gap-4 lg:gap-8">
        <button
          onClick={onOpenMobileMenu}
          className="p-1.5 text-[#A1A1AA] hover:text-white rounded hover:bg-[#2A2A2A] lg:hidden"
          title="Toggle Navigation"
        >
          <Menu size={18} />
        </button>

        {/* Brand Logo */}
        <button 
          onClick={() => onNavigate('dashboard')} 
          className="flex items-center group cursor-pointer"
        >
          <TeetCodeLogo size="sm" />
        </button>

        {/* LeetCode Top Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-medium">
          {topNavLinks.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 relative ${
                  isActive 
                    ? 'text-white font-semibold bg-[#282828]' 
                    : 'text-[#A1A1AA] hover:text-white hover:bg-[#242424]'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-[#FFA116]/20 text-[#FFA116] font-mono font-bold">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-[-9px] left-3 right-3 h-[2px] bg-[#FFA116] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Cluster: Streak Pill, Socratic AI Badge, Practice Set, IDE Link, User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Socratic AI Mentor Status Pill */}
        <button
          onClick={onToggleSocratic}
          title="Toggle Socratic Mode (Conceptual inquiries vs Direct algorithmic reveal)"
          className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
            socraticMode
              ? 'bg-[#00B8A3]/10 border-[#00B8A3]/40 text-[#00B8A3] hover:bg-[#00B8A3]/20 shadow-[0_0_8px_rgba(0,184,163,0.15)]'
              : 'bg-[#262626] border-[#3C3C3C] text-[#858585] hover:text-[#A1A1AA]'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${socraticMode ? 'bg-[#00B8A3] animate-pulse' : 'bg-[#71717A]'}`}></span>
          <span className="font-mono text-[11px] hidden sm:inline">
            Socratic AI: <strong className="font-semibold">{socraticMode ? 'ON' : 'OFF'}</strong>
          </span>
          <BotMessageSquare size={13} className="sm:hidden" />
        </button>

        {/* Practice Set Button */}
        <button
          onClick={onOpenPracticeModal}
          className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-[#282828] border border-[#3C3C3C] text-[#EFF1F6] hover:border-[#FFA116] hover:bg-[#323232] transition-colors"
          title="Generate Targeted Practice Set based on weak areas"
        >
          <Zap size={13} className="text-[#FFA116]" />
          <span>Practice Set</span>
        </button>

        {/* Daily Streak Pill */}
        <div 
          onClick={() => onNavigate('progress')}
          className="cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#262626] border border-[#3C3C3C] hover:border-[#FFA116]/50 text-xs font-mono transition-colors"
          title="Active Daily Streak"
        >
          <Flame size={14} className="text-[#FFA116] fill-[#FFA116]/20" />
          <span className="font-bold text-[#FFA116]">{user?.streak || 14}</span>
          <span className="text-[10px] text-[#858585] hidden sm:inline">DAYS</span>
        </div>

        {/* Quick Problem Workspace CTA */}
        <button
          onClick={() => onNavigate('workspace')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FFA116] text-black font-semibold text-xs hover:bg-[#FFB03A] active:bg-[#E58F0C] transition-colors shadow-sm"
        >
          <Terminal size={13} />
          <span className="hidden sm:inline">Solve in IDE</span>
          <span className="sm:hidden">IDE</span>
        </button>

        {/* User Avatar & Menu */}
        <div className="relative">
          {isAuthenticated && user ? (
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="w-7 h-7 rounded-full bg-[#2CBB5D] text-black font-bold text-xs flex items-center justify-center border border-[#3C3C3C] hover:ring-2 hover:ring-[#FFA116] transition-all cursor-pointer"
              title={`Logged in as ${user.full_name}`}
            >
              {user.full_name.charAt(0).toUpperCase()}
            </button>
          ) : (
            <button
              onClick={() => onNavigate('settings')}
              className="w-7 h-7 rounded-full bg-[#333333] text-[#EFF1F6] text-xs flex items-center justify-center hover:bg-[#444444]"
            >
              <User size={14} />
            </button>
          )}

          {/* Profile Dropdown */}
          {profileDropdownOpen && isAuthenticated && user && (
            <div 
              className="absolute right-0 mt-2 w-48 bg-[#262626] border border-[#3C3C3C] rounded-lg shadow-2xl py-1 z-50 text-xs font-sans"
              onMouseLeave={() => setProfileDropdownOpen(false)}
            >
              <div className="px-3 py-2 border-b border-[#333333]">
                <div className="font-semibold text-white truncate">{user.full_name}</div>
                <div className="text-[11px] font-mono text-[#858585] truncate">@{user.username}</div>
              </div>
              <button
                onClick={() => { onNavigate('progress'); setProfileDropdownOpen(false); }}
                className="w-full text-left px-3 py-2 hover:bg-[#333333] text-[#EFF1F6] flex items-center gap-2"
              >
                <CheckCircle2 size={13} className="text-[#00B8A3]" />
                <span>My Progress & Solved</span>
              </button>
              <button
                onClick={() => { onNavigate('notes'); setProfileDropdownOpen(false); }}
                className="w-full text-left px-3 py-2 hover:bg-[#333333] text-[#EFF1F6] flex items-center gap-2"
              >
                <FileText size={13} className="text-[#FFA116]" />
                <span>My Notes</span>
              </button>
              <button
                onClick={() => { onNavigate('settings'); setProfileDropdownOpen(false); }}
                className="w-full text-left px-3 py-2 hover:bg-[#333333] text-[#EFF1F6] flex items-center gap-2"
              >
                <span>Preferences</span>
              </button>
              <div className="border-t border-[#333333] my-1"></div>
              <button
                onClick={() => { logout(); setProfileDropdownOpen(false); }}
                className="w-full text-left px-3 py-2 hover:bg-[#333333] text-[#FF375F] flex items-center gap-2"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
