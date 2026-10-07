import React from 'react';
import { 
  Terminal, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert, 
  Cpu, 
  Sparkles, 
  BookOpen, 
  GitBranch, 
  BarChart3, 
  HelpCircle,
  Play,
  Flame,
  Code2,
  Zap,
  Target,
  Layers,
  Award
} from 'lucide-react';
import { PageId } from './Sidebar';
import { TeetCodeLogo } from './TeetCodeLogo';

interface LandingPageProps {
  onNavigate: (page: PageId) => void;
  onSelectProblem?: (slug: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onSelectProblem }) => {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-[#EFF1F6] selection:bg-[#3E3E3E] selection:text-white">
      {/* Top Banner / Navigation */}
      <header className="border-b border-[#333333] bg-[#1F1F1F]/90 backdrop-blur px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <TeetCodeLogo size="sm" />
        </div>
        <div className="flex items-center gap-3 sm:gap-6 text-xs">
          <button 
            onClick={() => onNavigate('problems')} 
            className="text-[#A1A1AA] hover:text-white transition-colors"
          >
            Problems
          </button>
          <button 
            onClick={() => onNavigate('roadmap')} 
            className="text-[#A1A1AA] hover:text-white transition-colors"
          >
            Study Plans
          </button>
          <button 
            onClick={() => onNavigate('mock-interview')} 
            className="text-[#A1A1AA] hover:text-white transition-colors hidden sm:inline"
          >
            Interview
          </button>
          <button 
            onClick={() => onNavigate('dashboard')} 
            className="px-4 py-1.5 rounded-md bg-[#FFA116] text-black font-semibold hover:bg-[#FFB03A] transition-colors shadow-sm"
          >
            Launch TeetCode
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-[#FFA116]/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 rounded-full bg-[#262626] border border-[#3C3C3C] text-xs font-mono text-[#EFF1F6] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#00B8A3] animate-pulse"></span>
          <span className="text-[#00B8A3] font-semibold">SOCRATIC AI ENGINE</span>
          <span className="text-[#858585]">|</span>
          <span className="text-[#A1A1AA]">A NEW WAY TO MASTER ALGORITHMS</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
          Stop memorizing solutions.<br />
          <span className="bg-gradient-to-r from-[#FFA116] via-[#FFC062] to-[#00B8A3] bg-clip-text text-transparent">
            Start mastering code with TeetCode.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed">
          The premier developer platform engineered for serious software engineers. Solve LeetCode-standard problems with an AI mentor that asks the right questions instead of giving away answers.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-6 py-3 rounded-lg bg-[#FFA116] text-black font-bold text-sm hover:bg-[#FFB03A] active:bg-[#E58F0C] flex items-center gap-2 transition-all shadow-md"
          >
            <span>Start Practicing Now</span>
            <ArrowRight size={16} />
          </button>
          <button
            onClick={() => onNavigate('problems')}
            className="px-6 py-3 rounded-lg bg-[#282828] text-white font-semibold text-sm border border-[#3C3C3C] hover:bg-[#323232] hover:border-[#FFA116]/60 transition-all"
          >
            Explore Problem Catalog
          </button>
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-xs font-mono text-[#A1A1AA]">
          <div className="p-3 bg-[#242424] border border-[#333333] rounded-lg">
            <div className="text-white font-bold text-lg">250+</div>
            <div>Curated Problems</div>
          </div>
          <div className="p-3 bg-[#242424] border border-[#333333] rounded-lg">
            <div className="text-[#00B8A3] font-bold text-lg">5-Tier</div>
            <div>Progressive Hints</div>
          </div>
          <div className="p-3 bg-[#242424] border border-[#333333] rounded-lg">
            <div className="text-[#FFA116] font-bold text-lg">100%</div>
            <div>Safe Code Sandbox</div>
          </div>
          <div className="p-3 bg-[#242424] border border-[#333333] rounded-lg">
            <div className="text-white font-bold text-lg">14</div>
            <div>Structured Roadmaps</div>
          </div>
        </div>
      </section>

      {/* Realistic TeetCode IDE Workspace Mockup */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="border border-[#3C3C3C] bg-[#242424] rounded-xl overflow-hidden shadow-2xl">
          {/* Mock Window Title Bar */}
          <div className="h-10 px-4 bg-[#1E1E1E] border-b border-[#333333] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]/80"></div>
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]/80"></div>
              <div className="w-3 h-3 rounded-full bg-[#27C93F]/80"></div>
              <span className="ml-2 text-xs font-mono text-[#A1A1AA]">
                TeetCode Workspace — 200. Number of Islands (Medium)
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00B8A3]">
              <span className="w-2 h-2 rounded-full bg-[#00B8A3] inline-block animate-pulse"></span>
              <span>Socratic Engine Active</span>
            </div>
          </div>

          {/* Split Panes */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#333333]">
            {/* Left Pane: Problem & Socratic Chat (5 cols) */}
            <div className="lg:col-span-5 p-5 bg-[#202020] space-y-4">
              <div className="border-b border-[#333333] pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <span className="text-[#A1A1AA]">200.</span>
                    <span>Number of Islands</span>
                  </h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#FFA116]/10 border border-[#FFA116]/30 text-[#FFA116]">
                    Medium
                  </span>
                </div>
                <div className="flex gap-1.5 mt-2.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2A2A2A] border border-[#3C3C3C] text-[#A1A1AA]">
                    Graphs
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2A2A2A] border border-[#3C3C3C] text-[#A1A1AA]">
                    Breadth-First Search
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2A2A2A] border border-[#3C3C3C] text-[#A1A1AA]">
                    Matrix
                  </span>
                </div>
              </div>

              {/* Socratic Chat Simulation */}
              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-[#282828] border border-[#3C3C3C] rounded-lg text-[#EFF1F6]">
                  <div className="text-[10px] text-[#00B8A3] font-mono font-bold uppercase mb-1 flex items-center gap-1.5">
                    <Sparkles size={11} />
                    <span>TeetCode AI Coach</span>
                  </div>
                  "Before writing nested loops, what invariant determines whether a cell belongs to a new island or an already visited cluster?"
                </div>

                <div className="p-3.5 bg-[#323232] border border-[#444444] rounded-lg text-white text-right">
                  <div className="text-[10px] text-[#A1A1AA] font-mono font-bold uppercase mb-1">You</div>
                  "If cell == '1' and hasn't been visited yet, it's a new island root. We trigger BFS/DFS to sink the whole island."
                </div>

                <div className="p-3.5 bg-[#282828] border border-[#3C3C3C] rounded-lg text-[#EFF1F6]">
                  <div className="text-[10px] text-[#00B8A3] font-mono font-bold uppercase mb-1 flex items-center gap-1.5">
                    <Sparkles size={11} />
                    <span>TeetCode AI Coach</span>
                  </div>
                  "Exactly. Would you mark cells visited using an O(M*N) Set or modify the matrix in-place for O(1) extra space?"
                </div>
              </div>

              {/* Quick Suggestion Chips */}
              <div className="pt-2 flex flex-wrap gap-1.5 font-mono text-[10px]">
                <span className="px-2 py-1 rounded bg-[#262626] border border-[#3C3C3C] text-[#A1A1AA]">
                  💡 Check In-Place Mutation
                </span>
                <span className="px-2 py-1 rounded bg-[#262626] border border-[#3C3C3C] text-[#A1A1AA]">
                  🔍 Verify Time Complexity O(M*N)
                </span>
              </div>
            </div>

            {/* Right Pane: Code Editor & Execution (7 cols) */}
            <div className="lg:col-span-7 bg-[#1A1A1A] flex flex-col justify-between">
              <div className="p-3.5 border-b border-[#333333] bg-[#202020] flex items-center justify-between text-xs font-mono">
                <span className="text-[#EFF1F6] font-semibold flex items-center gap-2">
                  <Code2 size={14} className="text-[#FFA116]" />
                  <span>Solution.cpp</span>
                </span>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#282828] border border-[#3C3C3C] text-[#A1A1AA]">
                    C++ 17
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#00B8A3]/20 border border-[#00B8A3]/40 text-[#00B8A3] font-bold">
                    ✓ Accepted (4/4 Passed)
                  </span>
                </div>
              </div>

              <div className="p-4 font-mono text-xs text-[#A1A1AA] space-y-1 bg-[#1A1A1A] overflow-x-auto leading-relaxed">
                <div><span className="text-[#555555]">1</span>  <span className="text-[#FF7B72]">class</span> <span className="text-[#FFA657]">Solution</span> &#123;</div>
                <div><span className="text-[#555555]">2</span>  <span className="text-[#FF7B72]">public</span>:</div>
                <div><span className="text-[#555555]">3</span>      <span className="text-[#79C0FF]">int</span> <span className="text-[#D2A8FF]">numIslands</span>(<span className="text-[#79C0FF]">vector</span>&lt;<span className="text-[#79C0FF]">vector</span>&lt;<span className="text-[#79C0FF]">char</span>&gt;&gt;&amp; grid) &#123;</div>
                <div><span className="text-[#555555]">4</span>          <span className="text-[#FF7B72]">if</span> (grid.<span className="text-[#D2A8FF]">empty</span>()) <span className="text-[#FF7B72]">return</span> <span className="text-[#79C0FF]">0</span>;</div>
                <div><span className="text-[#555555]">5</span>          <span className="text-[#79C0FF]">int</span> m = grid.<span className="text-[#D2A8FF]">size</span>(), n = grid[<span className="text-[#79C0FF]">0</span>].<span className="text-[#D2A8FF]">size</span>(), islands = <span className="text-[#79C0FF]">0</span>;</div>
                <div><span className="text-[#555555]">6</span>          </div>
                <div><span className="text-[#555555]">7</span>          <span className="text-[#8B949E]">// BFS queue traversal sinks island on enqueue</span></div>
                <div><span className="text-[#555555]">8</span>          <span className="text-[#FF7B72]">for</span> (<span className="text-[#79C0FF]">int</span> r = <span className="text-[#79C0FF]">0</span>; r &lt; m; ++r) &#123;</div>
                <div><span className="text-[#555555]">9</span>              <span className="text-[#FF7B72]">for</span> (<span className="text-[#79C0FF]">int</span> c = <span className="text-[#79C0FF]">0</span>; c &lt; n; ++c) &#123;</div>
                <div><span className="text-[#555555]">10</span>                 <span className="text-[#FF7B72]">if</span> (grid[r][c] == <span className="text-[#A5D6FF]">'1'</span>) &#123;</div>
                <div><span className="text-[#555555]">11</span>                     ++islands;</div>
                <div><span className="text-[#555555]">12</span>                     <span className="text-[#D2A8FF]">bfsSink</span>(grid, r, c, m, n);</div>
                <div><span className="text-[#555555]">13</span>                 &#125;</div>
                <div><span className="text-[#555555]">14</span>             &#125;</div>
                <div><span className="text-[#555555]">15</span>         &#125;</div>
                <div><span className="text-[#555555]">16</span>         <span className="text-[#FF7B72]">return</span> islands;</div>
                <div><span className="text-[#555555]">17</span>     &#125;</div>
                <div><span className="text-[#555555]">18</span> &#125;;</div>
              </div>

              <div className="p-3.5 border-t border-[#333333] bg-[#202020] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3 sm:gap-5 text-[#A1A1AA]">
                  <span>Runtime: <strong className="text-white">16 ms (Beats 92.4%)</strong></span>
                  <span>Memory: <strong className="text-white">12.3 MB (Beats 98.1%)</strong></span>
                </div>
                <button 
                  onClick={() => onNavigate('workspace')}
                  className="px-3.5 py-1.5 rounded-md bg-[#FFA116] text-black font-bold text-xs hover:bg-[#FFB03A] transition-colors"
                >
                  Open in Workspace
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid: Solid, human-crafted technical pillars */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-[#333333]">
        <div className="text-xs font-mono text-[#FFA116] uppercase tracking-widest mb-2">Core Platform Pillars</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-10">Everything you need to conquer technical interviews</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#222222] border border-[#333333] rounded-xl space-y-3 hover:border-[#FFA116]/50 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-[#FFA116]/10 border border-[#FFA116]/30 flex items-center justify-center text-[#FFA116]">
              <Cpu size={18} />
            </div>
            <h3 className="text-base font-bold text-white">Socratic Reasoning AI</h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Instead of immediately revealing code, TeetCode AI guides you through targeted questions to identify optimal data structures and loop invariants.
            </p>
          </div>

          <div className="p-6 bg-[#222222] border border-[#333333] rounded-xl space-y-3 hover:border-[#FFA116]/50 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-[#00B8A3]/10 border border-[#00B8A3]/30 flex items-center justify-center text-[#00B8A3]">
              <GitBranch size={18} />
            </div>
            <h3 className="text-base font-bold text-white">5-Tier Progressive Hints</h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Unlock hints progressively from high-level orientation to invariant selection, pseudo-code logic, edge-case traps, and full reference solutions.
            </p>
          </div>

          <div className="p-6 bg-[#222222] border border-[#333333] rounded-xl space-y-3 hover:border-[#FFA116]/50 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6]">
              <BarChart3 size={18} />
            </div>
            <h3 className="text-base font-bold text-white">Diagnostic Weakness Analytics</h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Pinpoint precise algorithmic blindspots — missing base cases in DP, visited set leaks in graphs, or off-by-one pointer arithmetic in arrays.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#333333] bg-[#1A1A1A] py-10 px-6 text-xs text-[#858585]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <TeetCodeLogo size="sm" />
            <span className="font-mono text-[11px]">© 2026 TeetCode — High Performance Coding Platform</span>
          </div>
          <div className="flex gap-6 text-[#A1A1AA]">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-white">Explore</button>
            <button onClick={() => onNavigate('problems')} className="hover:text-white">Problems</button>
            <button onClick={() => onNavigate('roadmap')} className="hover:text-white">Study Plans</button>
            <button onClick={() => onNavigate('mock-interview')} className="hover:text-white">Mock Interview</button>
            <button onClick={() => onNavigate('notes')} className="hover:text-white">Notes</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
