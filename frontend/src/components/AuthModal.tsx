import React, { useState } from 'react';
import { X, LogIn, UserPlus, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TeetCodeLogo } from './TeetCodeLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, setDemoUser } = useAuth();
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('tanmay');
  const [password, setPassword] = useState<string>('password123');
  const [email, setEmail] = useState<string>('tanmay@example.com');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(username, password);
    setLoading(false);
    onClose();
  };

  const handleQuickDemo = () => {
    setDemoUser();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="w-full max-w-md bg-[#222222] border border-[#333333] rounded-2xl p-6 space-y-6 shadow-2xl text-[#EFF1F6]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#333333] pb-3.5">
          <div className="flex items-center gap-2">
            <TeetCodeLogo size="sm" />
          </div>
          <button onClick={onClose} className="text-[#858585] hover:text-white rounded p-1 hover:bg-[#333333]">
            <X size={16} />
          </button>
        </div>

        {/* Quick Demo Access Button */}
        <div className="p-4 bg-gradient-to-br from-[#2A2A2A] to-[#202020] border border-[#3C3C3C] rounded-xl space-y-2.5">
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#FFA116]" />
            <span>Instant Demo Profile</span>
          </div>
          <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
            Instantly log in to Tanmay's developer profile with 127 solved problems, 14-day streak, and telemetry history.
          </p>
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-2.5 rounded-lg bg-[#FFA116] text-black font-bold text-xs hover:bg-[#FFB03A] transition-colors shadow-sm"
          >
            Continue as Tanmay (Demo)
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#858585]">
          <div className="flex-1 h-px bg-[#333333]"></div>
          <span>or sign in with credentials</span>
          <div className="flex-1 h-px bg-[#333333]"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <div className="space-y-1">
              <label className="text-[#A1A1AA] font-medium block">Email Address:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2.5 bg-[#1A1A1A] border border-[#3C3C3C] rounded-lg text-white focus:outline-none focus:border-[#FFA116]"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[#A1A1AA] font-medium block">Username or Email:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-2.5 bg-[#1A1A1A] border border-[#3C3C3C] rounded-lg text-white focus:outline-none focus:border-[#FFA116]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#A1A1AA] font-medium block">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2.5 bg-[#1A1A1A] border border-[#3C3C3C] rounded-lg text-white focus:outline-none focus:border-[#FFA116]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#333333] border border-[#444444] rounded-lg text-white hover:bg-[#444444] hover:border-white font-bold transition-colors shadow-sm"
          >
            {loading ? 'Authenticating...' : isRegister ? 'Create TeetCode Account' : 'Sign In'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-[11px] text-[#A1A1AA] hover:text-[#FFA116] underline"
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register on TeetCode"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
