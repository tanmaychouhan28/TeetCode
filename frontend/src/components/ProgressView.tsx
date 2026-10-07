import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar,
  Layers,
  Flame,
  ArrowRight,
  Award,
  Target
} from 'lucide-react';
import { AnalyticsData } from '../types';
import { api } from '../services/api';

export const ProgressView: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      const data = await api.getAnalytics();
      setAnalytics(data);
      setLoading(false);
    };
    fetchAnalytics();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="p-12 text-center text-xs font-mono text-[#A1A1AA]">
        Loading TeetCode performance telemetry...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 bg-[#1A1A1A] text-[#EFF1F6]">
      {/* Header */}
      <div className="border-b border-[#333333] pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <BarChart3 size={22} className="text-[#FFA116]" />
          <span>TeetCode Performance Analytics & Diagnostic Telemetry</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
          Quantitative breakdown of solved problems, accuracy velocity, topic mastery, and logical failure patterns.
        </p>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#222222] border border-[#333333] rounded-xl space-y-1">
          <div className="text-xs font-mono text-[#858585] uppercase">Problems Solved</div>
          <div className="text-2xl font-bold text-white font-mono">
            {analytics.summary.problems_solved} <span className="text-xs text-[#858585] font-normal">/ 250</span>
          </div>
          <div className="text-[11px] text-[#00B8A3] font-mono">50.8% of curriculum</div>
        </div>

        <div className="p-4 bg-[#222222] border border-[#333333] rounded-xl space-y-1">
          <div className="text-xs font-mono text-[#858585] uppercase">Active Streak</div>
          <div className="text-2xl font-bold text-[#FFA116] font-mono">
            {analytics.summary.current_streak} days
          </div>
          <div className="text-[11px] text-[#858585] font-mono">{analytics.summary.active_days_this_month} active days this month</div>
        </div>

        <div className="p-4 bg-[#222222] border border-[#333333] rounded-xl space-y-1">
          <div className="text-xs font-mono text-[#858585] uppercase">Submission Accuracy</div>
          <div className="text-2xl font-bold text-white font-mono">
            {analytics.summary.accuracy}%
          </div>
          <div className="text-[11px] text-[#858585] font-mono">Across {analytics.summary.total_attempts} submissions</div>
        </div>

        <div className="p-4 bg-[#222222] border border-[#333333] rounded-xl space-y-1">
          <div className="text-xs font-mono text-[#858585] uppercase">Critical Study Focus</div>
          <div className="text-2xl font-bold text-[#FF375F] font-mono">
            {analytics.summary.weakest_topic}
          </div>
          <div className="text-[11px] text-[#FF375F] font-mono">Highest Socratic hint usage</div>
        </div>
      </div>

      {/* Grid: Difficulty Distribution + Topic Mastery Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Difficulty Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-[#222222] border border-[#333333] rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <PieChart size={15} className="text-[#FFA116]" />
            <span>Difficulty Tier Distribution</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-[#1A1A1A] border border-[#2C2C2C] rounded-lg flex items-center justify-between">
              <span className="text-[#00B8A3] font-bold">Easy</span>
              <span className="text-white">{analytics.difficulty_distribution.easy.solved} / {analytics.difficulty_distribution.easy.total}</span>
              <span className="text-[#858585]">{analytics.difficulty_distribution.easy.percentage}% Solved</span>
            </div>

            <div className="p-3 bg-[#1A1A1A] border border-[#2C2C2C] rounded-lg flex items-center justify-between">
              <span className="text-[#FFA116] font-bold">Medium</span>
              <span className="text-white">{analytics.difficulty_distribution.medium.solved} / {analytics.difficulty_distribution.medium.total}</span>
              <span className="text-[#858585]">{analytics.difficulty_distribution.medium.percentage}% Solved</span>
            </div>

            <div className="p-3 bg-[#1A1A1A] border border-[#2C2C2C] rounded-lg flex items-center justify-between">
              <span className="text-[#FF375F] font-bold">Hard</span>
              <span className="text-white">{analytics.difficulty_distribution.hard.solved} / {analytics.difficulty_distribution.hard.total}</span>
              <span className="text-[#858585]">{analytics.difficulty_distribution.hard.percentage}% Solved</span>
            </div>
          </div>
        </div>

        {/* Topic Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-[#222222] border border-[#333333] rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Target size={15} className="text-[#00B8A3]" />
            <span>Curriculum Topic Mastery</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            {analytics.topic_breakdown.map((item) => (
              <div key={item.topic} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-white font-medium">{item.topic}</span>
                  <span className="text-[#858585]">{item.solved}/{item.total} Solved ({item.accuracy}% accuracy)</span>
                </div>
                <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden border border-[#2C2C2C]">
                  <div
                    className={`h-full rounded-full ${
                      item.accuracy > 70 ? 'bg-[#00B8A3]' : item.accuracy > 40 ? 'bg-[#FFA116]' : 'bg-[#FF375F]'
                    }`}
                    style={{ width: `${item.accuracy}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
