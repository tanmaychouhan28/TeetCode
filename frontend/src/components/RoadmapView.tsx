import React, { useState, useEffect } from 'react';
import { 
  GitFork, 
  CheckCircle2, 
  Clock, 
  Lock, 
  ArrowRight, 
  AlertTriangle, 
  Sparkles, 
  Target,
  BarChart2,
  ChevronRight,
  BookOpen,
  Award,
  Layers
} from 'lucide-react';
import { RoadmapTopic } from '../types';
import { api } from '../services/api';

interface RoadmapViewProps {
  onSelectProblem: (slug: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ onSelectProblem }) => {
  const [topics, setTopics] = useState<RoadmapTopic[]>([]);
  const [currentTopicId, setCurrentTopicId] = useState<string>('graphs');
  const [selectedTopic, setSelectedTopic] = useState<RoadmapTopic | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRoadmap = async () => {
      setLoading(true);
      const res = await api.getRoadmap();
      setTopics(res.topics);
      setCurrentTopicId(res.current_topic.toLowerCase());
      const active = res.topics.find((t) => t.id === 'graphs') || res.topics[0];
      setSelectedTopic(active);
      setLoading(false);
    };
    fetchRoadmap();
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 bg-[#1A1A1A] text-[#EFF1F6]">
      {/* Header */}
      <div className="border-b border-[#333333] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <GitFork size={22} className="text-[#FFA116]" />
            <span>TeetCode Algorithmic Study Plan & Roadmap</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
            Structured algorithmic tree mapped sequentially from foundational arrays to advanced dynamic programming.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-full bg-[#00B8A3]/10 border border-[#00B8A3]/30 text-[#00B8A3] font-semibold">
            Active Study Focus: Graphs (31% Mastery)
          </span>
        </div>
      </div>

      {/* Main Grid: Skill Tree on Left (7 cols), Selected Topic Details on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Skill Tree Nodes (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs font-mono text-[#A1A1AA] uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Sequential Learning Graph (14 Core Topics)</span>
            <span>Progress: 5/14 Mastered</span>
          </div>

          <div className="space-y-2">
            {topics.map((t, idx) => {
              const isSelected = selectedTopic?.id === t.id;
              const isCurrent = t.status === 'current';
              const isCompleted = t.status === 'completed';

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTopic(t)}
                  className={`
                    p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between
                    ${isSelected 
                      ? 'bg-[#2A2A2A] border-[#FFA116] text-white shadow-md' 
                      : isCurrent
                      ? 'bg-[#242424] border-[#FFA116]/60 text-white'
                      : isCompleted
                      ? 'bg-[#222222] border-[#333333] text-[#A1A1AA] hover:border-[#555555]'
                      : 'bg-[#1E1E1E] border-[#2C2C2C] text-[#858585] hover:border-[#3C3C3C]'
                    }
                  `}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Status Icon */}
                    <div className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 bg-[#1A1A1A]">
                      {isCompleted ? (
                        <CheckCircle2 size={16} className="text-[#00B8A3]" />
                      ) : isCurrent ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FFA116] animate-pulse"></span>
                      ) : (
                        <span className="text-[#858585]">{idx + 1}</span>
                      )}
                    </div>

                    <div>
                      <div className="text-xs font-bold flex items-center gap-2">
                        <span className="text-white">{t.name}</span>
                        {isCurrent && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#FFA116] text-black font-bold uppercase font-mono">
                            Active Focus
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#858585] font-mono mt-0.5">
                        {t.problems_solved}/{t.total_problems} Solved • {t.accuracy}% Accuracy
                      </div>
                    </div>
                  </div>

                  {/* Mastery Bar */}
                  <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
                    <div className="w-24 hidden sm:block bg-[#1A1A1A] h-2 rounded-full overflow-hidden border border-[#333333]">
                      <div
                        className={`h-full rounded-full ${
                          t.mastery > 70 ? 'bg-[#00B8A3]' : t.mastery > 40 ? 'bg-[#FFA116]' : 'bg-[#FF375F]'
                        }`}
                        style={{ width: `${t.mastery}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-[#A1A1AA] w-10 text-right">{t.mastery}%</span>
                    <ChevronRight size={15} className={isSelected ? 'text-[#FFA116]' : 'text-[#858585]'} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Topic Deep-Dive Panel (5 cols) */}
        <div className="lg:col-span-5">
          {selectedTopic ? (
            <div className="p-6 bg-[#222222] border border-[#333333] rounded-2xl space-y-6 sticky top-20 shadow-xl">
              {/* Header */}
              <div className="border-b border-[#333333] pb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">{selectedTopic.name}</h2>
                  <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${
                    selectedTopic.confidence === 'High' ? 'text-[#00B8A3] border-[#00B8A3]/30 bg-[#00B8A3]/10' :
                    selectedTopic.confidence === 'Medium' ? 'text-[#FFA116] border-[#FFA116]/30 bg-[#FFA116]/10' :
                    'text-[#FF375F] border-[#FF375F]/30 bg-[#FF375F]/10'
                  }`}>
                    {selectedTopic.confidence} Confidence
                  </span>
                </div>
                <p className="text-xs text-[#A1A1AA] mt-2 leading-relaxed">
                  {selectedTopic.description}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3.5 bg-[#1A1A1A] border border-[#333333] rounded-xl">
                  <div className="text-[10px] text-[#858585] uppercase">Mastery Level</div>
                  <div className="text-2xl font-bold text-white mt-1">{selectedTopic.mastery}%</div>
                </div>
                <div className="p-3.5 bg-[#1A1A1A] border border-[#333333] rounded-xl">
                  <div className="text-[10px] text-[#858585] uppercase">Submission Accuracy</div>
                  <div className="text-2xl font-bold text-[#00B8A3] mt-1">{selectedTopic.accuracy}%</div>
                </div>
              </div>

              {/* Weak Areas List */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle size={13} className="text-[#FF375F]" />
                  <span>Socratic Identified Weak Areas</span>
                </h3>
                <div className="space-y-1.5">
                  {selectedTopic.weak_areas.map((weak, i) => (
                    <div key={i} className="p-2.5 bg-[#FF375F]/10 border border-[#FF375F]/30 rounded-lg text-xs text-[#EFF1F6]">
                      • {weak}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Next Problems */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Target size={13} className="text-[#FFA116]" />
                  <span>Recommended Next Problems</span>
                </h3>
                <div className="space-y-2">
                  {selectedTopic.recommended_next.map((probName, idx) => {
                    const slug = probName.toLowerCase().replace(/\s+/g, '-');
                    return (
                      <div
                        key={idx}
                        className="p-3 bg-[#1A1A1A] border border-[#333333] rounded-lg flex items-center justify-between text-xs hover:border-[#FFA116] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[#858585] font-mono">{idx + 1}.</span>
                          <span className="text-white font-semibold">{probName}</span>
                        </div>
                        <button
                          onClick={() => onSelectProblem(slug === 'number-of-islands' ? 'number-of-islands' : 'two-sum')}
                          className="px-3 py-1 bg-[#FFA116] text-black font-semibold text-[11px] rounded hover:bg-[#FFB03A] transition-colors flex items-center gap-1"
                        >
                          <span>Solve</span>
                          <ArrowRight size={11} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs font-mono text-[#A1A1AA] bg-[#222222] border border-[#333333] rounded-2xl">
              Select a topic node from the roadmap tree to inspect mastery telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
