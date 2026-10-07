import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ArrowRight,
  Code2,
  Flame,
  Shuffle,
  Sparkles,
  BookOpen,
  Tag,
  Layers,
  ChevronRight,
  Check
} from 'lucide-react';
import { ProblemListItem, Difficulty } from '../types';
import { api } from '../services/api';

interface ProblemsViewProps {
  onSelectProblem: (slug: string) => void;
  onOpenPracticeModal: () => void;
}

export const ProblemsView: React.FC<ProblemsViewProps> = ({
  onSelectProblem,
  onOpenPracticeModal
}) => {
  const [problems, setProblems] = useState<ProblemListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [search, setSearch] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedSort, setSelectedSort] = useState<string>('recommended');

  const topicsList = [
    { name: 'All Topics', id: 'All', count: '250+' },
    { name: 'Arrays & Hashing', id: 'Arrays', count: '45' },
    { name: 'Graphs & BFS/DFS', id: 'Graphs', count: '32' },
    { name: 'Dynamic Programming', id: 'Dynamic Programming', count: '38' },
    { name: 'Trees & BST', id: 'Trees', count: '28' },
    { name: 'Linked Lists', id: 'Linked Lists', count: '20' },
    { name: 'Stack & Queue', id: 'Stack', count: '18' },
    { name: 'Two Pointers & Sliding Window', id: 'Strings', count: '24' },
    { name: 'Design & LRU', id: 'Design', count: '12' },
  ];

  const studyPlans = [
    { title: 'TeetCode Top 150', subtitle: 'Must-do interview questions for FAANG', progress: 48, count: '150 Qs', color: 'from-[#FFA116]/20 to-[#FFA116]/5 border-[#FFA116]/40' },
    { title: 'Blind 75 Essential', subtitle: 'Core algorithmic patterns distilled', progress: 62, count: '75 Qs', color: 'from-[#00B8A3]/20 to-[#00B8A3]/5 border-[#00B8A3]/40' },
    { title: 'Graph Invariants Masterclass', subtitle: 'BFS, DFS, Topological sort & Union-Find', progress: 31, count: '30 Qs', color: 'from-[#3B82F6]/20 to-[#3B82F6]/5 border-[#3B82F6]/40' },
  ];

  const difficulties: ('All' | Difficulty)[] = ['All', 'Easy', 'Medium', 'Hard'];
  const statuses = ['All', 'Solved', 'Unsolved', 'Attempted'];

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      const data = await api.getProblems({
        search: search || undefined,
        difficulty: selectedDifficulty !== 'All' ? selectedDifficulty : undefined,
        topic: selectedTopic !== 'All' ? selectedTopic : undefined,
        status: selectedStatus !== 'All' ? selectedStatus.toLowerCase() : undefined,
        sort: selectedSort
      });
      setProblems(data);
      setLoading(false);
    };
    fetchProblems();
  }, [search, selectedDifficulty, selectedTopic, selectedStatus, selectedSort]);

  const handlePickRandom = () => {
    if (problems.length > 0) {
      const randomIndex = Math.floor(Math.random() * problems.length);
      onSelectProblem(problems[randomIndex].slug);
    }
  };

  const solvedCount = problems.filter(p => p.is_solved).length;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 bg-[#1A1A1A] text-[#EFF1F6]">
      {/* Featured Study Plans Carousel / Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {studyPlans.map((plan, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl bg-gradient-to-br ${plan.color} border flex flex-col justify-between hover:scale-[1.01] transition-all cursor-pointer shadow-sm`}
            onClick={() => onSelectProblem('two-sum')}
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#A1A1AA]">
                <span className="px-1.5 py-0.5 rounded bg-black/40 text-white font-semibold">{plan.count}</span>
                <span className="text-[#FFA116] font-bold">{plan.progress}% Complete</span>
              </div>
              <h3 className="font-bold text-white text-base mt-2">{plan.title}</h3>
              <p className="text-xs text-[#A1A1AA] mt-0.5">{plan.subtitle}</p>
            </div>
            <div className="mt-4 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <div className="w-32 bg-black/40 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#FFA116] h-full rounded-full" style={{ width: `${plan.progress}%` }}></div>
              </div>
              <span className="text-[#EFF1F6] font-semibold hover:underline flex items-center gap-1">
                Continue →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Container: Filter Toolbar + Problem List & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 9 Cols: Search, Category Chips & Problem Table */}
        <div className="lg:col-span-9 space-y-4">
          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {topicsList.map((t) => {
              const isSelected = selectedTopic === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTopic(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#FFA116] text-black font-semibold shadow-sm'
                      : 'bg-[#262626] text-[#A1A1AA] hover:text-white hover:bg-[#323232] border border-[#333333]'
                  }`}
                >
                  <span>{t.name}</span>
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-black/70' : 'text-[#71717A]'}`}>
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Filter & Search Toolbar */}
          <div className="p-3.5 bg-[#242424] border border-[#333333] rounded-xl flex flex-wrap items-center justify-between gap-3">
            {/* Search input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#858585]" />
              <input
                type="text"
                placeholder="Search questions, topics, or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 bg-[#1A1A1A] border border-[#3C3C3C] rounded-lg text-xs text-white placeholder:text-[#858585] focus:outline-none focus:border-[#FFA116] font-sans"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1 rounded bg-[#2A2A2A] text-[#858585] border border-[#3C3C3C]">
                /
              </span>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              {/* Difficulty filter buttons */}
              <div className="flex rounded-lg bg-[#1A1A1A] p-0.5 border border-[#3C3C3C]">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                      selectedDifficulty === diff
                        ? 'bg-[#333333] text-white shadow-sm font-semibold'
                        : 'text-[#A1A1AA] hover:text-white'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>

              {/* Status filter buttons */}
              <div className="flex rounded-lg bg-[#1A1A1A] p-0.5 border border-[#3C3C3C] hidden sm:flex">
                {statuses.map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStatus(st)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                      selectedStatus === st
                        ? 'bg-[#333333] text-white shadow-sm font-semibold'
                        : 'text-[#A1A1AA] hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Pick Random Problem Button */}
              <button
                onClick={handlePickRandom}
                className="px-3 py-1.5 rounded-lg bg-[#282828] border border-[#3C3C3C] hover:border-[#FFA116] hover:bg-[#323232] text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Pick a random problem"
              >
                <Shuffle size={13} className="text-[#00B8A3]" />
                <span className="hidden sm:inline">Pick One</span>
              </button>
            </div>
          </div>

          {/* LeetCode-styled Problem Table */}
          <div className="border border-[#333333] bg-[#222222] rounded-xl overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-12 px-5 py-3 border-b border-[#333333] bg-[#1E1E1E] text-xs font-medium text-[#A1A1AA]">
              <div className="col-span-1 text-center">Status</div>
              <div className="col-span-6 sm:col-span-5">Title</div>
              <div className="col-span-2 hidden sm:block">Topics</div>
              <div className="col-span-2 text-center">Difficulty</div>
              <div className="col-span-3 sm:col-span-2 text-right">Acceptance</div>
            </div>

            {/* Table Rows */}
            {loading ? (
              <div className="p-12 text-center text-xs font-mono text-[#A1A1AA]">
                Loading TeetCode problem catalog...
              </div>
            ) : problems.length === 0 ? (
              <div className="p-12 text-center text-xs font-mono text-[#A1A1AA]">
                No problems match your selected filters.
              </div>
            ) : (
              <div className="divide-y divide-[#2C2C2C]">
                {problems.map((prob, idx) => {
                  const diffColor = 
                    prob.difficulty === 'Easy' ? 'text-[#00B8A3] bg-[#00B8A3]/10 border-[#00B8A3]/30' :
                    prob.difficulty === 'Medium' ? 'text-[#FFA116] bg-[#FFA116]/10 border-[#FFA116]/30' :
                    'text-[#FF375F] bg-[#FF375F]/10 border-[#FF375F]/30';

                  const problemNumber = prob.id === 1 ? '200' : prob.id === 2 ? '1' : prob.id === 3 ? '146' : prob.id === 4 ? '322' : prob.id === 5 ? '20' : '124';
                  const acceptanceRate = prob.id === 1 ? '57.4%' : prob.id === 2 ? '51.8%' : prob.id === 3 ? '43.2%' : prob.id === 4 ? '44.9%' : prob.id === 5 ? '40.6%' : '39.1%';

                  return (
                    <div
                      key={prob.id}
                      onClick={() => onSelectProblem(prob.slug)}
                      className="grid grid-cols-12 px-5 py-3.5 items-center hover:bg-[#282828] transition-colors cursor-pointer group"
                    >
                      {/* Status Icon */}
                      <div className="col-span-1 flex justify-center">
                        {prob.is_solved ? (
                          <div className="w-4 h-4 rounded-full bg-[#00B8A3]/20 text-[#00B8A3] flex items-center justify-center">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        ) : prob.is_attempted ? (
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-[#FFA116] flex items-center justify-center text-[9px] font-bold text-[#FFA116]">
                            •
                          </span>
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-[#444444] group-hover:border-[#71717A]"></span>
                        )}
                      </div>

                      {/* Problem Title & ID */}
                      <div className="col-span-6 sm:col-span-5 flex items-center gap-2 pr-2">
                        <span className="text-xs font-semibold text-white group-hover:text-[#FFA116] transition-colors truncate">
                          {problemNumber}. {prob.title}
                        </span>
                      </div>

                      {/* Topic Tags */}
                      <div className="col-span-2 hidden sm:flex items-center gap-1.5 truncate">
                        {prob.topics.slice(0, 2).map((t) => (
                          <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-[#1A1A1A] border border-[#333333] text-[#A1A1AA] truncate">
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Difficulty */}
                      <div className="col-span-2 flex justify-center">
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${diffColor}`}>
                          {prob.difficulty}
                        </span>
                      </div>

                      {/* Acceptance Rate & Quick Action */}
                      <div className="col-span-3 sm:col-span-2 flex items-center justify-end gap-3 text-xs font-mono text-[#A1A1AA]">
                        <span>{acceptanceRate}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); onSelectProblem(prob.slug); }}
                          className="p-1 rounded bg-[#333333] text-[#EFF1F6] group-hover:bg-[#FFA116] group-hover:text-black transition-colors"
                          title="Solve in IDE"
                        >
                          <ChevronRight size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right 3 Cols: Daily Challenge Card, Session Progress & Socratic Generator */}
        <div className="lg:col-span-3 space-y-4">
          {/* Daily Challenge Card */}
          <div className="p-4 bg-gradient-to-br from-[#262626] to-[#1E1E1E] border border-[#3C3C3C] rounded-xl space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#FFA116]">
                <Flame size={15} className="fill-[#FFA116]" />
                <span>DAILY CHALLENGE</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#00B8A3]/10 text-[#00B8A3] border border-[#00B8A3]/30 font-bold">
                +10 PTS
              </span>
            </div>

            <div>
              <h4 className="font-bold text-white text-sm">200. Number of Islands</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] font-mono text-[#FFA116]">Medium</span>
                <span className="text-xs text-[#858585]">•</span>
                <span className="text-xs text-[#A1A1AA]">Graphs / BFS</span>
              </div>
            </div>

            <button
              onClick={() => onSelectProblem('number-of-islands')}
              className="w-full py-2 rounded-lg bg-[#FFA116] text-black font-bold text-xs hover:bg-[#FFB03A] transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Solve Today's Challenge</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Quick Target Practice Card */}
          <div className="p-4 bg-[#242424] border border-[#333333] rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Zap size={14} className="text-[#FFA116]" />
              <span>Targeted AI Practice Set</span>
            </div>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Generate custom 5-problem sets automatically mapped to your weakest algorithmic topics.
            </p>
            <button
              onClick={onOpenPracticeModal}
              className="w-full py-2 rounded-lg bg-[#2A2A2A] border border-[#3C3C3C] hover:border-white text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles size={13} className="text-[#00B8A3]" />
              <span>Generate Practice Set</span>
            </button>
          </div>

          {/* Solved Problems Ratio Gauge */}
          <div className="p-4 bg-[#242424] border border-[#333333] rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>Session Overview</span>
              <span className="text-[#00B8A3] font-mono">{solvedCount} / {problems.length} Solved</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-[11px] text-[#A1A1AA] mb-1">
                  <span>Easy</span>
                  <span className="text-[#00B8A3] font-mono font-bold">2/2</span>
                </div>
                <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                  <div className="bg-[#00B8A3] h-full rounded-full w-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-[#A1A1AA] mb-1">
                  <span>Medium</span>
                  <span className="text-[#FFA116] font-mono font-bold">1/3</span>
                </div>
                <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                  <div className="bg-[#FFA116] h-full rounded-full w-[33%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-[#A1A1AA] mb-1">
                  <span>Hard</span>
                  <span className="text-[#FF375F] font-mono font-bold">0/1</span>
                </div>
                <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                  <div className="bg-[#FF375F] h-full rounded-full w-0"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
