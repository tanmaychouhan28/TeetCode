import React, { useState, useEffect } from 'react';
import { 
  Play, 
  CheckCircle2, 
  Flame, 
  Target, 
  Sparkles, 
  ArrowRight, 
  Code2, 
  Clock, 
  BookOpen, 
  BotMessageSquare,
  Zap,
  TrendingUp,
  Calendar,
  Award,
  ChevronRight,
  Check
} from 'lucide-react';
import { PageId } from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ProblemListItem } from '../types';

interface DashboardViewProps {
  onNavigate: (page: PageId) => void;
  onSelectProblem: (slug: string) => void;
  onOpenPracticeModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onSelectProblem,
  onOpenPracticeModal
}) => {
  const { user } = useAuth();
  const userName = user?.full_name || 'Tanmay';
  const [problems, setProblems] = useState<ProblemListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadProblems = async () => {
      setLoading(true);
      const list = await api.getProblems();
      setProblems(list);
      setLoading(false);
    };
    loadProblems();
  }, []);

  const solvedCount = problems.filter(p => p.is_solved).length;

  // Fake realistic 12-month LeetCode activity heatmap
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const activityDays = Array.from({ length: 48 }, (_, i) => {
    const level = (i * 7 + 3) % 5;
    return level;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 bg-[#1A1A1A] text-[#EFF1F6]">
      {/* Top Welcome & Daily Challenge Hero */}
      <div className="p-6 bg-gradient-to-r from-[#242424] via-[#202020] to-[#1C1C1C] border border-[#333333] rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#FFA116]/10 text-[#FFA116] border border-[#FFA116]/30 font-bold">
              🔥 14 DAYS STREAK
            </span>
            <span className="text-xs text-[#858585] font-mono">Rank: #1,420 Global</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Welcome back, {userName}!
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-xl">
            You're mastering Data Structures & Algorithms with Socratic guidance. Today's recommended target is <strong>Graphs & BFS</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onSelectProblem('number-of-islands')}
            className="px-5 py-2.5 rounded-lg bg-[#FFA116] text-black font-bold text-xs hover:bg-[#FFB03A] transition-all flex items-center gap-2 shadow-sm"
          >
            <Play size={13} className="fill-black" />
            <span>Solve Daily Problem</span>
          </button>
          <button
            onClick={onOpenPracticeModal}
            className="px-4 py-2.5 rounded-lg bg-[#282828] border border-[#3C3C3C] hover:border-white text-white text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Zap size={13} className="text-[#00B8A3]" />
            <span>Generate Set</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Profile Solved Gauge + Daily Heatmap & Solved Problems */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: LeetCode Solved Gauge & Difficulty breakdown (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Solved Problems LeetCode Card */}
          <div className="p-5 bg-[#222222] border border-[#333333] rounded-xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#333333] pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Target size={15} className="text-[#FFA116]" />
                <span>Solved Problems</span>
              </h3>
              <span className="text-xs text-[#858585] font-mono">127 / 250 Total</span>
            </div>

            {/* Circular summary + Bars */}
            <div className="flex items-center gap-6">
              {/* Radial Circle Mock */}
              <div className="relative w-24 h-24 rounded-full bg-[#1A1A1A] border-4 border-[#333333] flex flex-col items-center justify-center shrink-0">
                <span className="text-xl font-bold text-white font-mono">127</span>
                <span className="text-[10px] text-[#858585] uppercase">Solved</span>
              </div>

              {/* Breakdown by difficulty */}
              <div className="flex-1 space-y-2 text-xs">
                {/* Easy */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#00B8A3] font-medium">Easy</span>
                    <span className="font-mono text-white">58 <span className="text-[#858585]">/ 80</span></span>
                  </div>
                  <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                    <div className="bg-[#00B8A3] h-full rounded-full w-[72%]"></div>
                  </div>
                </div>

                {/* Medium */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#FFA116] font-medium">Medium</span>
                    <span className="font-mono text-white">54 <span className="text-[#858585]">/ 120</span></span>
                  </div>
                  <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                    <div className="bg-[#FFA116] h-full rounded-full w-[45%]"></div>
                  </div>
                </div>

                {/* Hard */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#FF375F] font-medium">Hard</span>
                    <span className="font-mono text-white">15 <span className="text-[#858585]">/ 50</span></span>
                  </div>
                  <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                    <div className="bg-[#FF375F] h-full rounded-full w-[30%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges and milestones */}
            <div className="pt-3 border-t border-[#333333] grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-[#1A1A1A] border border-[#2C2C2C]">
                <div className="text-[10px] text-[#858585]">Streak</div>
                <div className="font-bold text-[#FFA116] mt-0.5">14 Days</div>
              </div>
              <div className="p-2 rounded bg-[#1A1A1A] border border-[#2C2C2C]">
                <div className="text-[10px] text-[#858585]">Accuracy</div>
                <div className="font-bold text-[#00B8A3] mt-0.5">74.2%</div>
              </div>
              <div className="p-2 rounded bg-[#1A1A1A] border border-[#2C2C2C]">
                <div className="text-[10px] text-[#858585]">Socratic</div>
                <div className="font-bold text-white mt-0.5">Level 4</div>
              </div>
            </div>
          </div>

          {/* Activity Heatmap Card */}
          <div className="p-5 bg-[#222222] border border-[#333333] rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Calendar size={13} className="text-[#00B8A3]" />
                <span>342 submissions in the past year</span>
              </span>
              <span className="text-[11px] text-[#858585]">Active</span>
            </div>

            {/* Heatmap Grid */}
            <div className="grid grid-cols-12 gap-1 pt-1">
              {activityDays.map((lvl, idx) => (
                <div
                  key={idx}
                  className={`h-3 rounded-xs ${
                    lvl === 0 ? 'bg-[#1E1E1E]' :
                    lvl === 1 ? 'bg-[#00B8A3]/30' :
                    lvl === 2 ? 'bg-[#00B8A3]/60' :
                    lvl === 3 ? 'bg-[#00B8A3]/85' :
                    'bg-[#00B8A3]'
                  }`}
                  title={`Submissions: ${lvl * 2}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Recommended Problem List & Study Roadmap (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Code2 size={16} className="text-[#FFA116]" />
                <span>Recommended Problems to Practice</span>
              </h2>
              <p className="text-xs text-[#A1A1AA] mt-0.5">
                Targeted algorithmic invariants based on your recent performance.
              </p>
            </div>
            <button
              onClick={() => onNavigate('problems')}
              className="text-xs text-[#FFA116] hover:underline flex items-center gap-1"
            >
              <span>View Full Catalog</span>
              <ChevronRight size={13} />
            </button>
          </div>

          {/* Problem List */}
          <div className="border border-[#333333] bg-[#222222] rounded-xl divide-y divide-[#2C2C2C] overflow-hidden shadow-sm">
            {problems.map((prob) => {
              const diffColor = 
                prob.difficulty === 'Easy' ? 'text-[#00B8A3] bg-[#00B8A3]/10 border-[#00B8A3]/30' :
                prob.difficulty === 'Medium' ? 'text-[#FFA116] bg-[#FFA116]/10 border-[#FFA116]/30' :
                'text-[#FF375F] bg-[#FF375F]/10 border-[#FF375F]/30';

              const probNum = prob.id === 1 ? '200' : prob.id === 2 ? '1' : prob.id === 3 ? '146' : prob.id === 4 ? '322' : prob.id === 5 ? '20' : '124';

              return (
                <div
                  key={prob.slug}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#282828] transition-colors group cursor-pointer"
                  onClick={() => onSelectProblem(prob.slug)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      {prob.is_solved ? (
                        <div className="w-4 h-4 rounded-full bg-[#00B8A3]/20 text-[#00B8A3] flex items-center justify-center shrink-0">
                          <Check size={11} strokeWidth={3} />
                        </div>
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-[#444444] shrink-0"></span>
                      )}
                      <span className="font-semibold text-white group-hover:text-[#FFA116] transition-colors text-sm">
                        {probNum}. {prob.title}
                      </span>
                      <span className={`text-[10px] font-medium px-2 py-0.2 rounded-full border ${diffColor}`}>
                        {prob.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#858585]">
                      <span>Topics: {prob.topics.join(', ')}</span>
                      <span>•</span>
                      <span>Est: {prob.estimated_time}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); onSelectProblem(prob.slug); }}
                    className="px-3.5 py-1.5 rounded-lg bg-[#333333] group-hover:bg-[#FFA116] group-hover:text-black text-white font-semibold text-xs transition-colors self-start sm:self-auto flex items-center gap-1.5"
                  >
                    <span>Solve in IDE</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Socratic Philosophy Banner */}
          <div className="p-4 bg-[#242424] border border-[#333333] rounded-xl text-xs text-[#A1A1AA] space-y-1">
            <div className="text-white font-bold flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#00B8A3]" />
              <span>How TeetCode Socratic Learning Works:</span>
            </div>
            <p className="leading-relaxed text-[#D1D5DB]">
              1. Choose a question and open the workspace. <br />
              2. Click <strong>Run Code</strong> or <strong>Submit</strong> to evaluate against test cases in the safe sandbox. <br />
              3. When stuck, use the <strong>Socratic AI Coach</strong> to discover invariants through guided questions instead of reading answers!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
