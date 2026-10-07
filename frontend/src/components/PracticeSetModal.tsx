import React, { useState } from 'react';
import { X, Zap, Sparkles, ArrowRight, CheckCircle2, Target } from 'lucide-react';

interface PracticeSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProblem: (slug: string) => void;
}

export const PracticeSetModal: React.FC<PracticeSetModalProps> = ({
  isOpen,
  onClose,
  onSelectProblem
}) => {
  const [topic, setTopic] = useState<string>('Graphs');
  const [difficulty, setDifficulty] = useState<string>('Medium');
  const [count, setCount] = useState<number>(5);
  const [goal, setGoal] = useState<string>('FAANG Interview Preparation');
  const [isGenerated, setIsGenerated] = useState<boolean>(false);

  if (!isOpen) return null;

  const generatedSet = [
    { id: 200, title: 'Number of Islands', slug: 'number-of-islands', diff: 'Medium', topic: 'Graphs', focus: 'Matrix BFS/DFS visited array logic' },
    { id: 207, title: 'Course Schedule II', slug: 'course-schedule-ii', diff: 'Medium', topic: 'Graphs', focus: 'Topological sort (Kahn / Indegree)' },
    { id: 994, title: 'Rotting Oranges', slug: 'rotting-oranges', diff: 'Medium', topic: 'Graphs', focus: 'Multi-source simultaneous BFS' },
    { id: 417, title: 'Pacific Atlantic Water Flow', slug: 'pacific-atlantic', diff: 'Medium', topic: 'Graphs', focus: 'Reverse flood-fill from boundaries' },
    { id: 133, title: 'Clone Graph', slug: 'clone-graph', diff: 'Medium', topic: 'Graphs', focus: 'Hash map pointer deep copy' },
  ].slice(0, count);

  const handleGenerate = () => {
    setIsGenerated(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-[#222222] border border-[#333333] rounded-2xl p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto text-[#EFF1F6]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#333333] pb-3.5">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-[#FFA116]" />
            <h3 className="font-bold text-sm text-white">
              TeetCode AI Targeted Practice Set Generator
            </h3>
          </div>
          <button onClick={onClose} className="text-[#858585] hover:text-white rounded p-1 hover:bg-[#333333]">
            <X size={16} />
          </button>
        </div>

        {!isGenerated ? (
          <div className="space-y-4 text-xs">
            <p className="text-[#A1A1AA] leading-relaxed">
              Curate a custom problem set generated automatically from your personal weakness telemetry and historical failure modes.
            </p>

            {/* Topic */}
            <div className="space-y-1.5">
              <label className="text-[#A1A1AA] font-medium block">Target Algorithmic Topic:</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-2.5 bg-[#1A1A1A] border border-[#3C3C3C] rounded-lg text-white focus:outline-none focus:border-[#FFA116]"
              >
                <option value="Graphs">Graphs (Weakest Topic: 31% Mastery)</option>
                <option value="Dynamic Programming">Dynamic Programming (18% Mastery)</option>
                <option value="Trees">Binary Trees (44% Mastery)</option>
                <option value="Arrays">Arrays & Two Pointers (82% Mastery)</option>
                <option value="Linked Lists">Linked Lists (65% Mastery)</option>
              </select>
            </div>

            {/* Difficulty */}
            <div className="space-y-1.5">
              <label className="text-[#A1A1AA] font-medium block">Difficulty Level:</label>
              <div className="grid grid-cols-3 gap-2">
                {['Easy', 'Medium', 'Hard'].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`p-2.5 rounded-lg border text-center font-medium transition-all ${
                      difficulty === diff
                        ? 'bg-[#FFA116] text-black font-bold border-[#FFA116]'
                        : 'bg-[#1A1A1A] border-[#333333] text-[#A1A1AA] hover:text-white'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of problems */}
            <div className="space-y-1.5">
              <label className="text-[#A1A1AA] font-medium block">Problem Count: ({count} questions)</label>
              <input
                type="range"
                min="3"
                max="8"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full accent-[#FFA116]"
              />
            </div>

            {/* Target Goal */}
            <div className="space-y-1.5">
              <label className="text-[#A1A1AA] font-medium block">Target Goal / Focus:</label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. FAANG Interview Preparation"
                className="w-full p-2.5 bg-[#1A1A1A] border border-[#3C3C3C] rounded-lg text-white focus:outline-none focus:border-[#FFA116]"
              />
            </div>

            <button
              onClick={handleGenerate}
              className="w-full py-3 bg-[#FFA116] text-black font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#FFB03A] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Sparkles size={14} />
              <span>Generate TeetCode Practice Set</span>
            </button>
          </div>
        ) : (
          <div className="space-y-5 text-xs">
            {/* Generated Set Header */}
            <div className="p-3.5 bg-[#262626] border border-[#333333] rounded-xl space-y-1">
              <div className="text-[#00B8A3] font-bold flex items-center gap-1.5">
                <CheckCircle2 size={14} />
                <span>Practice Set Generated</span>
              </div>
              <p className="text-[11px] text-[#A1A1AA]">
                Tailored 5-problem set targeting visited-array state handling and graph invariants.
              </p>
            </div>

            {/* Problem List */}
            <div className="space-y-2 font-mono">
              {generatedSet.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#1A1A1A] border border-[#333333] rounded-lg flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[#858585]">{idx + 1}.</span>
                      <span className="text-white font-bold">{item.title}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#FFA116]/10 border border-[#FFA116]/30 text-[#FFA116]">
                        {item.diff}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#858585]">Focus: {item.focus}</div>
                  </div>
                  <button
                    onClick={() => {
                      onSelectProblem(item.slug === 'number-of-islands' ? 'number-of-islands' : 'two-sum');
                      onClose();
                    }}
                    className="px-3 py-1 bg-[#FFA116] text-black font-bold text-xs rounded hover:bg-[#FFB03A] transition-colors shrink-0"
                  >
                    Solve
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setIsGenerated(false)}
                className="px-3 py-1.5 bg-[#1A1A1A] border border-[#333333] rounded-lg text-[#A1A1AA] hover:text-white"
              >
                ← Adjust Parameters
              </button>
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-white text-black font-bold text-xs rounded-lg hover:bg-gray-200"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
