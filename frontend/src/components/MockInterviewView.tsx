import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Code2, 
  RotateCcw,
  ArrowRight,
  Award,
  BookOpen,
  BotMessageSquare,
  Building2,
  Check
} from 'lucide-react';
import { MockInterviewState, MockInterviewReport } from '../types';
import { api } from '../services/api';

export const MockInterviewView: React.FC = () => {
  const [session, setSession] = useState<MockInterviewState | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Configuration Form
  const [companyType, setCompanyType] = useState<string>('Top Tech / FAANG');
  const [difficulty, setDifficulty] = useState<string>('Medium');
  const [topic, setTopic] = useState<string>('Graphs');
  const [duration, setDuration] = useState<number>(45);

  // Live Interview Interaction State
  const [userInput, setUserInput] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<number>(45 * 60);
  const [isSubmittingStep, setIsSubmittingStep] = useState<boolean>(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Timer countdown
  useEffect(() => {
    if (!session || session.status === 'completed') return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [session]);

  const handleStartInterview = async () => {
    setLoading(true);
    const res = await api.startMockInterview(companyType, difficulty, topic, duration);
    setSession(res);
    setTimeRemaining(duration * 60);
    setCode(res.problem.starter_code['python'] || '# Write your solution here\nclass Solution:\n    pass\n');
    setLoading(false);
  };

  const handleSendStep = async () => {
    if (!session || !userInput.trim()) return;
    setIsSubmittingStep(true);
    const inputToSend = userInput;
    setUserInput('');

    const res = await api.sendMockInterviewStep(
      session.interview_id,
      session.step,
      inputToSend,
      code
    );
    setSession(res);
    setIsSubmittingStep(false);
  };

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [session?.transcript, isSubmittingStep]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const stepDescriptions: Record<number, string> = {
    1: 'Step 1 of 4: Problem Clarification & High-Level Approach',
    2: 'Step 2 of 4: Space-Time Complexity & Invariant Analysis',
    3: 'Step 3 of 4: Live Code Implementation & Syntax',
    4: 'Step 4 of 4: Edge Cases, Dry Run & Optimization',
    5: 'Session Complete: Evaluation Scorecard & Report'
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 bg-[#1A1A1A] text-[#EFF1F6]">
      {/* Header */}
      <div className="border-b border-[#333333] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Sparkles size={22} className="text-[#FFA116]" />
            <span>TeetCode Live Technical Interview Simulator</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
            Simulate rigorous multi-stage FAANG and Quant coding interviews with an interactive Socratic interviewer.
          </p>
        </div>
        {session && session.status !== 'completed' && (
          <div className="flex items-center gap-2 text-xs font-mono px-3.5 py-1.5 bg-[#262626] border border-[#3C3C3C] rounded-lg">
            <Clock size={14} className="text-[#FFA116]" />
            <span>Time Remaining: <strong className="text-white">{formatTime(timeRemaining)}</strong></span>
          </div>
        )}
      </div>

      {/* Screen 1: Pre-Interview Configuration Screen */}
      {!session ? (
        <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-[#222222] border border-[#333333] rounded-2xl space-y-6 shadow-xl">
          <div className="border-b border-[#333333] pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 size={16} className="text-[#FFA116]" />
              <span>Configure Technical Interview</span>
            </h2>
            <p className="text-xs text-[#A1A1AA] mt-1">
              Select company rubric, difficulty, and algorithmic topic domain.
            </p>
          </div>

          <div className="space-y-4 text-xs font-sans">
            {/* Company Type */}
            <div className="space-y-1.5">
              <label className="text-[#A1A1AA] block font-medium">Target Company Profile:</label>
              <select
                value={companyType}
                onChange={(e) => setCompanyType(e.target.value)}
                className="w-full p-2.5 bg-[#1A1A1A] border border-[#3C3C3C] rounded-lg text-white focus:outline-none focus:border-[#FFA116]"
              >
                <option value="Top Tech / FAANG">Google / Meta / Amazon (Deep Algorithms & Invariant Rigor)</option>
                <option value="Quantitative Trading / Fintech">Quantitative Trading (Low Latency, Extreme Constraints)</option>
                <option value="Fast-Growth Startup">Fast-Growth Tech Startup (Speed & Clean Architecture)</option>
              </select>
            </div>

            {/* Difficulty */}
            <div className="space-y-1.5">
              <label className="text-[#A1A1AA] block font-medium">Difficulty Level:</label>
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

            {/* Topic Domain */}
            <div className="space-y-1.5">
              <label className="text-[#A1A1AA] block font-medium">Topic Domain:</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-2.5 bg-[#1A1A1A] border border-[#3C3C3C] rounded-lg text-white focus:outline-none focus:border-[#FFA116]"
              >
                <option value="Graphs">Graphs & Matrix BFS/DFS</option>
                <option value="Dynamic Programming">Dynamic Programming & Memoization</option>
                <option value="Trees">Binary Trees & Tree Traversals</option>
                <option value="Arrays">Arrays, Two Pointers & Sliding Window</option>
                <option value="Linked Lists">Linked Lists & LRU Cache</option>
              </select>
            </div>

            {/* Interview Duration */}
            <div className="space-y-1.5">
              <label className="text-[#A1A1AA] block font-medium">Session Duration: ({duration} minutes)</label>
              <div className="grid grid-cols-3 gap-2">
                {[30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDuration(mins)}
                    className={`p-2.5 rounded-lg border text-center font-medium transition-all ${
                      duration === mins
                        ? 'bg-[#333333] text-white font-bold border-white'
                        : 'bg-[#1A1A1A] border-[#333333] text-[#A1A1AA] hover:text-white'
                    }`}
                  >
                    {mins} mins
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <div className="pt-4">
              <button
                onClick={handleStartInterview}
                disabled={loading}
                className="w-full py-3 rounded-lg bg-[#FFA116] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#FFB03A] transition-all flex items-center justify-center gap-2 shadow-md"
              >
                {loading ? (
                  <span>Initializing Interview Environment...</span>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>Begin Live Interview Session</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Screen 2: Active Mock Interview Environment */
        <div className="space-y-4">
          {/* Phase Stepper Bar */}
          <div className="p-3 bg-[#222222] border border-[#333333] rounded-xl flex items-center justify-between text-xs font-mono">
            <span className="text-white font-bold">
              {stepDescriptions[session.step] || 'Interview in Progress'}
            </span>
            <span className="text-[#00B8A3] font-bold">
              Phase {session.step}/4
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Chat & Interviewer Dialog (6 cols) */}
            <div className="lg:col-span-6 bg-[#222222] border border-[#333333] rounded-2xl flex flex-col h-[600px] overflow-hidden">
              <div className="p-3.5 border-b border-[#333333] bg-[#1E1E1E] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BotMessageSquare size={16} className="text-[#00B8A3]" />
                  <span className="text-xs font-bold text-white">Interviewer: Alex (Senior Staff Engineer)</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00B8A3]/10 text-[#00B8A3] border border-[#00B8A3]/30">
                  Live Socratic
                </span>
              </div>

              {/* Chat Message Transcript */}
              <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {session.transcript.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                      msg.role === 'interviewer'
                        ? 'bg-[#1A1A1A] border border-[#333333] text-[#EFF1F6]'
                        : 'bg-[#2A2A2A] border border-[#3C3C3C] text-white ml-6'
                    }`}
                  >
                    <div className="text-[10px] font-mono font-bold mb-1 flex items-center justify-between">
                      <span className={msg.role === 'interviewer' ? 'text-[#00B8A3]' : 'text-[#FFA116]'}>
                        {msg.role === 'interviewer' ? '👔 Interviewer (Staff Engineer)' : '👤 You'}
                      </span>
                    </div>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                ))}

                {isSubmittingStep && (
                  <div className="p-3 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-[#A1A1AA] flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-[#00B8A3] border-t-transparent rounded-full animate-spin"></div>
                    <span>Interviewer is evaluating your response...</span>
                  </div>
                )}
              </div>

              {/* Input Area */}
              {session.status !== 'completed' ? (
                <div className="p-3 border-t border-[#333333] bg-[#1E1E1E] space-y-2">
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your explanation or response to the interviewer..."
                    className="w-full h-20 p-2.5 bg-[#1A1A1A] border border-[#3C3C3C] rounded-lg text-white font-sans text-xs focus:outline-none focus:border-[#FFA116] resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleSendStep}
                      disabled={isSubmittingStep || !userInput.trim()}
                      className="px-4 py-1.5 rounded-md bg-[#FFA116] text-black font-bold text-xs hover:bg-[#FFB03A] disabled:opacity-40 transition-colors flex items-center gap-1.5"
                    >
                      <span>Submit Response</span>
                      <Send size={12} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 border-t border-[#333333] bg-[#1E1E1E] text-center">
                  <span className="text-xs font-bold text-[#00B8A3]">Interview Session Finished</span>
                </div>
              )}
            </div>

            {/* Right: Code Editor & Scorecard (6 cols) */}
            <div className="lg:col-span-6 bg-[#222222] border border-[#333333] rounded-2xl flex flex-col h-[600px] overflow-hidden">
              <div className="p-3.5 border-b border-[#333333] bg-[#1E1E1E] flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Code2 size={14} className="text-[#FFA116]" />
                  <span>Interactive Scratchpad & Live Code</span>
                </span>
                <span className="text-[11px] font-mono text-[#858585]">Python 3</span>
              </div>

              {session.status !== 'completed' ? (
                <div className="flex-1 p-3 bg-[#1A1A1A]">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-full p-3 bg-[#1A1A1A] text-[#EFF1F6] font-mono text-xs leading-relaxed resize-none focus:outline-none"
                    placeholder="# Write your implementation here..."
                  />
                </div>
              ) : (
                /* Post-Interview Evaluation Report */
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  <div className="flex items-center gap-2 text-white font-bold text-base">
                    <Award size={20} className="text-[#FFA116]" />
                    <span>Evaluation Scorecard</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 bg-[#1A1A1A] border border-[#333333] rounded-lg">
                      <div className="text-[#858585]">Algorithmic Rigor</div>
                      <div className="text-lg font-bold text-[#00B8A3] mt-1">9.2 / 10</div>
                    </div>
                    <div className="p-3 bg-[#1A1A1A] border border-[#333333] rounded-lg">
                      <div className="text-[#858585]">Communication</div>
                      <div className="text-lg font-bold text-white mt-1">8.5 / 10</div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#1A1A1A] border border-[#333333] rounded-lg space-y-1 text-xs">
                    <div className="font-bold text-[#FFA116]">Staff Engineer Feedback:</div>
                    <p className="text-[#A1A1AA] leading-relaxed">
                      Strong grasp of BFS queue invariant. Good early identification of visited state requirements. Space complexity analysis was accurate.
                    </p>
                  </div>

                  <button
                    onClick={() => setSession(null)}
                    className="w-full py-2.5 rounded-lg bg-[#FFA116] text-black font-bold text-xs uppercase hover:bg-[#FFB03A] transition-colors"
                  >
                    Start New Interview
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
