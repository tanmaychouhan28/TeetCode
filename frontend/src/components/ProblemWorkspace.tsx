import React, { useState, useEffect, useRef } from 'react';
import { CodeEditor } from './CodeEditor';
import { 
  Play, 
  Send, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  Cpu, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  Terminal,
  FileCode,
  Layers,
  HelpCircle,
  ShieldCheck,
  Check,
  Flame,
  Code2,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Share2,
  Maximize2,
  Copy,
  BotMessageSquare,
  Shuffle,
  Tag
} from 'lucide-react';
import { ProblemDetail, CodeRunResponse, AIReviewResponse, AICoachMessage } from '../types';
import { api } from '../services/api';

interface ProblemWorkspaceProps {
  slug: string;
  socraticMode: boolean;
  onNavigateToRoadmap?: () => void;
  onSelectProblem?: (slug: string) => void;
}

const ALL_PROBLEMS_LIST = [
  { slug: 'number-of-islands', id: 200, title: 'Number of Islands', diff: 'Medium', topic: 'Graphs' },
  { slug: 'two-sum', id: 1, title: 'Two Sum', diff: 'Easy', topic: 'Arrays' },
  { slug: 'lru-cache', id: 146, title: 'LRU Cache', diff: 'Medium', topic: 'Linked Lists' },
  { slug: 'coin-change', id: 322, title: 'Coin Change', diff: 'Medium', topic: 'DP' },
  { slug: 'valid-parentheses', id: 20, title: 'Valid Parentheses', diff: 'Easy', topic: 'Stack' },
  { slug: 'binary-tree-maximum-path-sum', id: 124, title: 'Binary Tree Max Path Sum', diff: 'Hard', topic: 'Trees' },
];

export const ProblemWorkspace: React.FC<ProblemWorkspaceProps> = ({
  slug,
  socraticMode,
  onNavigateToRoadmap,
  onSelectProblem
}) => {
  const [currentSlug, setCurrentSlug] = useState<string>(slug || 'number-of-islands');
  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Editor State
  const [language, setLanguage] = useState<string>('cpp');
  const [code, setCode] = useState<string>('');
  const [leftTab, setLeftTab] = useState<'description' | 'editorial' | 'ai-coach' | 'submissions'>('description');
  const [rightBottomTab, setRightBottomTab] = useState<'testcase' | 'result' | 'review'>('testcase');
  const [fontSize, setFontSize] = useState<number>(13);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Timer State for Mock Practice
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Execution & Submissions
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [runResult, setRunResult] = useState<CodeRunResponse | null>(null);
  const [aiReview, setAiReview] = useState<AIReviewResponse | null>(null);
  const [activeTestCaseIndex, setActiveTestCaseIndex] = useState<number>(0);
  const [customTestCase, setCustomTestCase] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  // Social / Bookmark state
  const [likes, setLikes] = useState<number>(2450);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  // AI Coach Chat State
  const [chatMessages, setChatMessages] = useState<AICoachMessage[]>([]);
  const [userInputMessage, setUserInputMessage] = useState<string>('');
  const [unlockedHintLevel, setUnlockedHintLevel] = useState<number>(0);
  const [isCoachTyping, setIsCoachTyping] = useState<boolean>(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Synchronize when slug prop changes
  useEffect(() => {
    if (slug) {
      setCurrentSlug(slug);
    }
  }, [slug]);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Fetch Problem Data
  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      const data = await api.getProblem(currentSlug);
      setProblem(data);
      const defaultCode = data.starter_code[language] || data.starter_code['cpp'] || data.starter_code['python'] || '';
      setCode(defaultCode);
      setRunResult(null);
      setAiReview(null);
      setUnlockedHintLevel(0);
      setRightBottomTab('testcase');

      setChatMessages([
        {
          role: 'assistant',
          content: `Hi! I'm your Socratic AI Coach on TeetCode for **${data.title}**.\n\n*Question to get started:* What is the time complexity bottleneck in a naive brute-force solution, and which invariant or data structure can optimize it?`
        }
      ]);
      setLoading(false);
    };
    fetchDetail();
  }, [currentSlug]);

  // Switch problem
  const handleProblemChange = (newSlug: string) => {
    setCurrentSlug(newSlug);
    if (onSelectProblem) {
      onSelectProblem(newSlug);
    }
  };

  // Next / Previous Problem navigation
  const currentIndex = ALL_PROBLEMS_LIST.findIndex(p => p.slug === currentSlug);
  const prevProblem = currentIndex > 0 ? ALL_PROBLEMS_LIST[currentIndex - 1] : null;
  const nextProblem = currentIndex < ALL_PROBLEMS_LIST.length - 1 ? ALL_PROBLEMS_LIST[currentIndex + 1] : null;

  // Handle Language Change
  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    if (problem && problem.starter_code[newLang]) {
      setCode(problem.starter_code[newLang]);
    }
  };

  // Reset Code
  const handleResetCode = () => {
    if (problem && problem.starter_code[language]) {
      setCode(problem.starter_code[language]);
    }
  };

  // Copy code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Run Code
  const handleRunCode = async () => {
    if (!problem) return;
    setIsRunning(true);
    setRightBottomTab('result');
    const res = await api.runCode(problem.id, language, code, isCustomMode ? customTestCase : undefined);
    setRunResult(res);
    setIsRunning(false);
  };

  // Submit Code
  const handleSubmitCode = async () => {
    if (!problem) return;
    setIsSubmitting(true);
    setRightBottomTab('result');
    const res = await api.submitCode(problem.id, language, code);
    setRunResult(res.execution);
    setAiReview(res.ai_review);
    setIsSubmitting(false);
  };

  // AI Coach Quick Actions
  const handleCoachAction = async (actionType: string, level?: number) => {
    if (!problem) return;
    setIsCoachTyping(true);
    setLeftTab('ai-coach');

    const nextHintLevel = level || (actionType === 'hint' ? unlockedHintLevel + 1 : unlockedHintLevel);
    if (actionType === 'hint' || level) {
      setUnlockedHintLevel(nextHintLevel);
    }

    const res = await api.chatWithCoach(
      problem.id,
      chatMessages,
      code,
      actionType,
      nextHintLevel,
      socraticMode
    );

    setChatMessages((prev) => [
      ...prev,
      { role: 'assistant', content: res.reply }
    ]);
    setIsCoachTyping(false);
  };

  // Send User Message to AI Coach
  const handleSendChatMessage = async () => {
    if (!userInputMessage.trim() || !problem) return;
    const userMsg = userInputMessage.trim();
    setUserInputMessage('');

    const newMessages: AICoachMessage[] = [
      ...chatMessages,
      { role: 'user', content: userMsg }
    ];
    setChatMessages(newMessages);
    setIsCoachTyping(true);

    const res = await api.chatWithCoach(
      problem.id,
      newMessages,
      code,
      'chat',
      unlockedHintLevel,
      socraticMode
    );

    setChatMessages((prev) => [
      ...prev,
      { role: 'assistant', content: res.reply }
    ]);
    setIsCoachTyping(false);
  };

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isCoachTyping]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  if (loading || !problem) {
    return (
      <div className="h-[calc(100vh-3.25rem)] flex items-center justify-center bg-[#1A1A1A] font-mono text-xs text-[#A1A1AA]">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#FFA116] border-t-transparent rounded-full animate-spin"></div>
          <span>Loading TeetCode Workspace...</span>
        </div>
      </div>
    );
  }

  const diffBadgeColor = 
    problem.difficulty === 'Easy' ? 'text-[#00B8A3] bg-[#00B8A3]/10 border-[#00B8A3]/30' :
    problem.difficulty === 'Medium' ? 'text-[#FFA116] bg-[#FFA116]/10 border-[#FFA116]/30' :
    'text-[#FF375F] bg-[#FF375F]/10 border-[#FF375F]/30';

  const monacoLanguage = {
    cpp: 'cpp',
    python: 'python',
    javascript: 'javascript',
    java: 'java',
  }[language] || 'cpp';

  const currentProbMeta = ALL_PROBLEMS_LIST.find(p => p.slug === currentSlug) || { id: problem.id, title: problem.title };

  return (
    <div className="h-[calc(100vh-3.25rem)] flex flex-col bg-[#1A1A1A] text-[#EFF1F6] overflow-hidden select-none">
      {/* TOP LEETCODE TOOLBAR */}
      <div className="h-11 bg-[#262626] border-b border-[#3C3C3C] px-4 flex items-center justify-between shrink-0">
        {/* Left: Problem Selector & Stepper */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => prevProblem && handleProblemChange(prevProblem.slug)}
            disabled={!prevProblem}
            className="p-1 rounded text-[#A1A1AA] hover:text-white hover:bg-[#333333] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title={prevProblem ? `Previous: ${prevProblem.title}` : 'First problem'}
          >
            <ChevronLeft size={16} />
          </button>

          <select
            value={currentSlug}
            onChange={(e) => handleProblemChange(e.target.value)}
            className="py-1 px-2.5 bg-[#333333] border border-[#3C3C3C] rounded-md text-xs font-semibold text-white focus:outline-none focus:border-[#FFA116] cursor-pointer"
          >
            {ALL_PROBLEMS_LIST.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.id}. {p.title} ({p.diff})
              </option>
            ))}
          </select>

          <button
            onClick={() => nextProblem && handleProblemChange(nextProblem.slug)}
            disabled={!nextProblem}
            className="p-1 rounded text-[#A1A1AA] hover:text-white hover:bg-[#333333] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title={nextProblem ? `Next: ${nextProblem.title}` : 'Last problem'}
          >
            <ChevronRight size={16} />
          </button>

          {/* Practice Timer */}
          <div className="hidden sm:flex items-center gap-1.5 ml-2 px-2 py-0.5 rounded bg-[#1E1E1E] border border-[#3C3C3C] text-xs font-mono text-[#A1A1AA]">
            <Clock size={12} className="text-[#FFA116]" />
            <span>{formatTimer(timerSeconds)}</span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="text-[10px] text-[#00B8A3] hover:underline ml-1 font-bold"
            >
              {isTimerRunning ? 'Pause' : 'Start'}
            </button>
            {timerSeconds > 0 && (
              <button
                onClick={() => { setTimerSeconds(0); setIsTimerRunning(false); }}
                className="text-[10px] text-[#858585] hover:text-white"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Right Action Bar: Run Code & Submit */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Socratic Coach Tab Switcher */}
          <button
            onClick={() => setLeftTab(leftTab === 'ai-coach' ? 'description' : 'ai-coach')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
              leftTab === 'ai-coach'
                ? 'bg-[#00B8A3]/20 border-[#00B8A3] text-[#00B8A3]'
                : 'bg-[#333333] border-[#3C3C3C] text-[#EFF1F6] hover:border-[#00B8A3]'
            }`}
          >
            <Sparkles size={13} className="text-[#00B8A3]" />
            <span className="hidden sm:inline">TeetCode AI Coach</span>
            <span className="sm:hidden">AI</span>
          </button>

          {/* Run Code Button */}
          <button
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 px-3.5 py-1 rounded-md bg-[#333333] hover:bg-[#444444] border border-[#444444] text-xs font-semibold text-white transition-colors disabled:opacity-50 cursor-pointer"
            title="Run code against sample test cases (Ctrl + ')"
          >
            <Play size={13} className="text-[#00B8A3] fill-[#00B8A3]" />
            <span>{isRunning ? 'Running...' : 'Run'}</span>
          </button>

          {/* Submit Code Button (LeetCode Green) */}
          <button
            onClick={handleSubmitCode}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 px-4 py-1 rounded-md bg-[#2CBB5D] hover:bg-[#26A653] active:bg-[#1E8A42] text-xs font-bold text-white transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
            title="Submit solution for full evaluation"
          >
            <Send size={13} />
            <span>{isSubmitting ? 'Evaluating...' : 'Submit'}</span>
          </button>
        </div>
      </div>

      {/* WORKSPACE CONTENT: Split Screen (Left: Problem / AI / Editorial, Right: Editor / Console) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* LEFT PANE (5 Cols): Tabs (Description, Editorial / Hints, Solutions, AI Coach) */}
        <div className="lg:col-span-5 bg-[#1F1F1F] border-r border-[#333333] flex flex-col overflow-hidden">
          {/* Left Panel Tab Headers */}
          <div className="h-9 bg-[#262626] border-b border-[#333333] px-2 flex items-center gap-1 overflow-x-auto shrink-0 scrollbar-none">
            <button
              onClick={() => setLeftTab('description')}
              className={`px-3 py-1.5 rounded-t text-xs font-medium transition-colors flex items-center gap-1.5 ${
                leftTab === 'description'
                  ? 'bg-[#1F1F1F] text-white border-t-2 border-[#FFA116] font-semibold'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#2A2A2A]'
              }`}
            >
              <FileCode size={13} className="text-[#FFA116]" />
              <span>Description</span>
            </button>

            <button
              onClick={() => setLeftTab('editorial')}
              className={`px-3 py-1.5 rounded-t text-xs font-medium transition-colors flex items-center gap-1.5 ${
                leftTab === 'editorial'
                  ? 'bg-[#1F1F1F] text-white border-t-2 border-[#FFA116] font-semibold'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#2A2A2A]'
              }`}
            >
              <HelpCircle size={13} className="text-[#00B8A3]" />
              <span>Editorial & Hints</span>
              {problem.hints.length > 0 && (
                <span className="text-[10px] px-1 rounded bg-[#333333] text-[#A1A1AA] font-mono">
                  {problem.hints.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setLeftTab('ai-coach')}
              className={`px-3 py-1.5 rounded-t text-xs font-medium transition-colors flex items-center gap-1.5 ${
                leftTab === 'ai-coach'
                  ? 'bg-[#1F1F1F] text-white border-t-2 border-[#00B8A3] font-semibold'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#2A2A2A]'
              }`}
            >
              <Sparkles size={13} className="text-[#00B8A3]" />
              <span>Socratic AI Coach</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00B8A3] animate-pulse"></span>
            </button>

            <button
              onClick={() => setLeftTab('submissions')}
              className={`px-3 py-1.5 rounded-t text-xs font-medium transition-colors flex items-center gap-1.5 ${
                leftTab === 'submissions'
                  ? 'bg-[#1F1F1F] text-white border-t-2 border-[#FFA116] font-semibold'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#2A2A2A]'
              }`}
            >
              <Layers size={13} />
              <span>Submissions</span>
            </button>
          </div>

          {/* Left Panel Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 text-[#EFF1F6]">
            {/* TAB 1: DESCRIPTION */}
            {leftTab === 'description' && (
              <div className="space-y-5">
                {/* Problem Header */}
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <span>{currentProbMeta.id}.</span>
                    <span>{problem.title}</span>
                  </h1>

                  <div className="flex flex-wrap items-center gap-2.5 mt-3">
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${diffBadgeColor}`}>
                      {problem.difficulty}
                    </span>

                    {/* Topics */}
                    {problem.topics.map((t) => (
                      <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-[#2A2A2A] border border-[#3C3C3C] text-[#A1A1AA]">
                        {t}
                      </span>
                    ))}

                    {/* Likes & Bookmarks */}
                    <div className="flex items-center gap-3 ml-auto text-xs text-[#858585]">
                      <button
                        onClick={() => { setIsLiked(!isLiked); setLikes(prev => isLiked ? prev - 1 : prev + 1); }}
                        className={`flex items-center gap-1 hover:text-white transition-colors ${isLiked ? 'text-[#00B8A3]' : ''}`}
                      >
                        <ThumbsUp size={13} />
                        <span>{likes}</span>
                      </button>
                      <button
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        className={`hover:text-[#FFA116] transition-colors ${isBookmarked ? 'text-[#FFA116]' : ''}`}
                      >
                        <Bookmark size={14} className={isBookmarked ? 'fill-[#FFA116]' : ''} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Problem Description Content */}
                <div className="text-xs leading-relaxed text-[#D1D5DB] space-y-3 font-sans">
                  {problem.description.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                {/* Examples */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Examples
                  </h3>
                  {problem.examples.map((ex, idx) => (
                    <div key={idx} className="p-3.5 bg-[#262626] border border-[#3C3C3C] rounded-lg space-y-2 text-xs font-mono">
                      <div className="font-bold text-white">Example {idx + 1}:</div>
                      <div className="space-y-1">
                        <div>
                          <strong className="text-[#A1A1AA]">Input: </strong>
                          <span className="text-[#EFF1F6]">{ex.input}</span>
                        </div>
                        <div>
                          <strong className="text-[#A1A1AA]">Output: </strong>
                          <span className="text-[#00B8A3] font-bold">{ex.output}</span>
                        </div>
                        {ex.explanation && (
                          <div>
                            <strong className="text-[#A1A1AA]">Explanation: </strong>
                            <span className="text-[#D1D5DB]">{ex.explanation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div className="space-y-2 pt-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Constraints:
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-xs font-mono text-[#D1D5DB]">
                    {problem.constraints.map((c, idx) => (
                      <li key={idx} className="pl-1">
                        <code>{c}</code>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Companies Tag Box */}
                <div className="pt-4 border-t border-[#333333] flex items-center justify-between text-xs text-[#858585]">
                  <div className="flex items-center gap-1.5">
                    <Tag size={12} className="text-[#FFA116]" />
                    <span>Companies:</span>
                    <span className="text-[#A1A1AA]">Google, Meta, Amazon, Apple, Microsoft</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: EDITORIAL & PROGRESSIVE 5-TIER HINTS */}
            {leftTab === 'editorial' && (
              <div className="space-y-4">
                <div className="border-b border-[#333333] pb-3">
                  <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                    <HelpCircle size={15} className="text-[#00B8A3]" />
                    <span>Progressive 5-Tier Hints</span>
                  </h2>
                  <p className="text-xs text-[#A1A1AA] mt-1">
                    TeetCode unlocks hints gradually to help you build interview problem-solving intuition without spoiling the invariant.
                  </p>
                </div>

                <div className="space-y-3">
                  {problem.hints.map((h) => {
                    const isUnlocked = unlockedHintLevel >= h.level;
                    const tierNames = [
                      'Tier 1: High-Level Orientation',
                      'Tier 2: Invariant & Algorithm Choice',
                      'Tier 3: Structured Pseudo-Code',
                      'Tier 4: Detailed Step-by-Step Logic',
                      'Tier 5: Full Reference Solution'
                    ];

                    return (
                      <div
                        key={h.level}
                        className={`p-3.5 border rounded-lg transition-all ${
                          isUnlocked
                            ? 'bg-[#262626] border-[#00B8A3]/40 shadow-sm'
                            : 'bg-[#202020] border-[#333333] opacity-80'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                              isUnlocked ? 'bg-[#00B8A3]/20 text-[#00B8A3]' : 'bg-[#333333] text-[#858585]'
                            }`}>
                              Level {h.level}
                            </span>
                            <span className="text-xs font-semibold text-white">
                              {tierNames[h.level - 1] || `Hint ${h.level}`}
                            </span>
                          </div>

                          {!isUnlocked && (
                            <button
                              onClick={() => handleCoachAction('hint', h.level)}
                              className="px-2.5 py-1 rounded bg-[#FFA116] text-black text-[11px] font-bold hover:bg-[#FFB03A] transition-colors"
                            >
                              Unlock Hint
                            </button>
                          )}
                        </div>

                        {isUnlocked ? (
                          <div className="mt-3 pt-2 border-t border-[#333333] text-xs text-[#EFF1F6] leading-relaxed font-sans">
                            {h.level === 5 ? (
                              <pre className="p-3 bg-[#1A1A1A] border border-[#3C3C3C] rounded overflow-x-auto font-mono text-[11px] text-[#A5D6FF]">
                                {h.content}
                              </pre>
                            ) : (
                              <p>{h.content}</p>
                            )}
                          </div>
                        ) : (
                          <p className="mt-2 text-[11px] text-[#858585] italic">
                            Hint locked. Click "Unlock Hint" to reveal without seeing code spoilers.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: SOCRATIC AI COACH INTERACTION */}
            {leftTab === 'ai-coach' && (
              <div className="flex flex-col h-full space-y-4">
                <div className="border-b border-[#333333] pb-3 shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles size={15} className="text-[#00B8A3]" />
                      <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                        TeetCode Socratic Coach
                      </h2>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00B8A3]/10 text-[#00B8A3] border border-[#00B8A3]/30 font-bold">
                      Interactive
                    </span>
                  </div>
                  <p className="text-xs text-[#A1A1AA] mt-1">
                    Ask questions, verify your approach invariants, or ask for subtle nudges.
                  </p>
                </div>

                {/* Quick Action Prompt Chips */}
                <div className="flex flex-wrap gap-1.5 shrink-0">
                  <button
                    onClick={() => handleCoachAction('hint')}
                    className="px-2.5 py-1 rounded-md bg-[#282828] hover:bg-[#333333] border border-[#3C3C3C] text-[11px] text-[#EFF1F6] transition-colors"
                  >
                    💡 Give subtle hint
                  </button>
                  <button
                    onClick={() => handleCoachAction('approach')}
                    className="px-2.5 py-1 rounded-md bg-[#282828] hover:bg-[#333333] border border-[#3C3C3C] text-[11px] text-[#EFF1F6] transition-colors"
                  >
                    🔍 Check my invariant
                  </button>
                  <button
                    onClick={() => handleCoachAction('mistake')}
                    className="px-2.5 py-1 rounded-md bg-[#282828] hover:bg-[#333333] border border-[#3C3C3C] text-[11px] text-[#EFF1F6] transition-colors"
                  >
                    🐛 Spot my edge-case bug
                  </button>
                  <button
                    onClick={() => handleCoachAction('complexity')}
                    className="px-2.5 py-1 rounded-md bg-[#282828] hover:bg-[#333333] border border-[#3C3C3C] text-[11px] text-[#EFF1F6] transition-colors"
                  >
                    ⚡ Analyze Big-O
                  </button>
                </div>

                {/* Message Transcript */}
                <div ref={chatScrollRef} className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg text-xs leading-relaxed ${
                        msg.role === 'assistant'
                          ? 'bg-[#242424] border border-[#3C3C3C] text-[#EFF1F6]'
                          : 'bg-[#333333] border border-[#444444] text-white ml-6'
                      }`}
                    >
                      <div className="text-[10px] font-mono font-bold mb-1 flex items-center justify-between">
                        <span className={msg.role === 'assistant' ? 'text-[#00B8A3]' : 'text-[#FFA116]'}>
                          {msg.role === 'assistant' ? '🤖 TeetCode AI Coach' : '👤 You'}
                        </span>
                      </div>
                      <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
                    </div>
                  ))}

                  {isCoachTyping && (
                    <div className="p-3 bg-[#242424] border border-[#3C3C3C] rounded-lg text-xs text-[#A1A1AA] flex items-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-[#00B8A3] border-t-transparent rounded-full animate-spin"></div>
                      <span>TeetCode AI is formulating a Socratic question...</span>
                    </div>
                  )}
                </div>

                {/* User Input Input Box */}
                <div className="pt-2 border-t border-[#333333] flex items-center gap-2 shrink-0">
                  <input
                    type="text"
                    placeholder="Ask a question or explain your reasoning..."
                    value={userInputMessage}
                    onChange={(e) => setUserInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                    className="flex-1 px-3 py-2 bg-[#1A1A1A] border border-[#3C3C3C] rounded-md text-xs text-white placeholder:text-[#858585] focus:outline-none focus:border-[#FFA116] font-sans"
                  />
                  <button
                    onClick={handleSendChatMessage}
                    disabled={isCoachTyping || !userInputMessage.trim()}
                    className="p-2 rounded-md bg-[#FFA116] text-black hover:bg-[#FFB03A] disabled:opacity-40 transition-colors"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: SUBMISSIONS */}
            {leftTab === 'submissions' && (
              <div className="space-y-4">
                <div className="border-b border-[#333333] pb-3">
                  <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    Recent Submissions
                  </h2>
                  <p className="text-xs text-[#A1A1AA] mt-1">
                    Your real execution telemetry and benchmark records for {problem.title}.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="p-3 bg-[#262626] border border-[#3C3C3C] rounded-lg flex items-center justify-between text-xs font-mono">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[#00B8A3] font-bold flex items-center gap-1">
                          <CheckCircle2 size={13} />
                          <span>Accepted</span>
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#333333] text-[#A1A1AA]">
                          C++
                        </span>
                      </div>
                      <div className="text-[11px] text-[#858585]">Runtime: 16 ms • Memory: 12.3 MB</div>
                    </div>
                    <span className="text-[#858585] text-[11px]">Just now</span>
                  </div>

                  <div className="p-3 bg-[#262626] border border-[#3C3C3C] rounded-lg flex items-center justify-between text-xs font-mono">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[#FF375F] font-bold flex items-center gap-1">
                          <AlertTriangle size={13} />
                          <span>Wrong Answer</span>
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#333333] text-[#A1A1AA]">
                          Python 3
                        </span>
                      </div>
                      <div className="text-[11px] text-[#858585]">Passed 2/4 test cases</div>
                    </div>
                    <span className="text-[#858585] text-[11px]">2 hours ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE (7 Cols): Code Editor (Top) & Test Case Runner (Bottom) */}
        <div className="lg:col-span-7 bg-[#1A1A1A] flex flex-col overflow-hidden">
          {/* Editor Header Bar */}
          <div className="h-10 bg-[#262626] border-b border-[#333333] px-3 flex items-center justify-between shrink-0">
            {/* Language Switcher */}
            <div className="flex items-center gap-2">
              <Code2 size={14} className="text-[#FFA116]" />
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="py-1 px-2.5 bg-[#333333] border border-[#3C3C3C] rounded text-xs font-semibold text-white focus:outline-none focus:border-[#FFA116] cursor-pointer"
              >
                <option value="cpp">C++ (g++ 17)</option>
                <option value="python">Python 3</option>
                <option value="java">Java 17</option>
                <option value="javascript">JavaScript (Node.js)</option>
              </select>
            </div>

            {/* Editor Action Controls */}
            <div className="flex items-center gap-1.5 text-[#A1A1AA]">
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded hover:bg-[#333333] hover:text-white transition-colors"
                title="Copy code"
              >
                {isCopied ? <Check size={14} className="text-[#00B8A3]" /> : <Copy size={14} />}
              </button>
              <button
                onClick={handleResetCode}
                className="p-1.5 rounded hover:bg-[#333333] hover:text-white transition-colors"
                title="Reset to starter code"
              >
                <RotateCcw size={14} />
              </button>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="py-0.5 px-1.5 bg-[#333333] border border-[#3C3C3C] rounded text-[11px] text-white focus:outline-none"
                title="Font size"
              >
                <option value={12}>12px</option>
                <option value={13}>13px</option>
                <option value={14}>14px</option>
                <option value={16}>16px</option>
              </select>
            </div>
          </div>

          {/* Monaco Code Editor */}
          <div className="flex-1 bg-[#1E1E1E] overflow-hidden">
            <CodeEditor
              value={code}
              language={monacoLanguage}
              onChange={(val) => setCode(val)}
              fontSize={fontSize}
            />
          </div>

          {/* BOTTOM DRAWER: Test Cases, Test Results, and AI Review */}
          <div className="h-56 bg-[#202020] border-t border-[#333333] flex flex-col shrink-0">
            {/* Drawer Tab Headers */}
            <div className="h-8 bg-[#262626] border-b border-[#333333] px-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRightBottomTab('testcase')}
                  className={`px-3 py-1 text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    rightBottomTab === 'testcase'
                      ? 'text-white border-b-2 border-[#FFA116]'
                      : 'text-[#858585] hover:text-[#A1A1AA]'
                  }`}
                >
                  <Terminal size={12} />
                  <span>Testcase</span>
                </button>

                <button
                  onClick={() => setRightBottomTab('result')}
                  className={`px-3 py-1 text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    rightBottomTab === 'result'
                      ? 'text-white border-b-2 border-[#FFA116]'
                      : 'text-[#858585] hover:text-[#A1A1AA]'
                  }`}
                >
                  <Play size={12} className="text-[#00B8A3]" />
                  <span>Test Result</span>
                  {runResult && (
                    <span className={`w-2 h-2 rounded-full ${runResult.status === 'Accepted' ? 'bg-[#00B8A3]' : 'bg-[#FF375F]'}`}></span>
                  )}
                </button>

                <button
                  onClick={() => setRightBottomTab('review')}
                  className={`px-3 py-1 text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    rightBottomTab === 'review'
                      ? 'text-white border-b-2 border-[#00B8A3]'
                      : 'text-[#858585] hover:text-[#A1A1AA]'
                  }`}
                >
                  <Cpu size={12} className="text-[#00B8A3]" />
                  <span>AI Review</span>
                  {aiReview && (
                    <span className="text-[10px] px-1 rounded bg-[#00B8A3]/20 text-[#00B8A3] font-bold">New</span>
                  )}
                </button>
              </div>

              {/* Console Status summary */}
              <div className="text-[11px] font-mono text-[#858585] hidden sm:block">
                TeetCode Execution Engine Active
              </div>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-3 text-xs font-mono">
              {/* TAB 1: TESTCASE TABS */}
              {rightBottomTab === 'testcase' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5">
                    {problem.test_cases.filter(tc => !tc.is_hidden).map((tc, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setIsCustomMode(false); setActiveTestCaseIndex(idx); }}
                        className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                          !isCustomMode && activeTestCaseIndex === idx
                            ? 'bg-[#333333] text-white font-bold border border-[#444444]'
                            : 'bg-[#1A1A1A] text-[#858585] hover:text-white border border-[#2C2C2C]'
                        }`}
                      >
                        Case {idx + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setIsCustomMode(true)}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                        isCustomMode
                          ? 'bg-[#333333] text-white font-bold border border-[#444444]'
                          : 'bg-[#1A1A1A] text-[#858585] hover:text-white border border-[#2C2C2C]'
                      }`}
                    >
                      + Custom Input
                    </button>
                  </div>

                  {!isCustomMode ? (
                    <div className="space-y-2">
                      <div className="p-2.5 bg-[#1A1A1A] border border-[#2C2C2C] rounded space-y-1">
                        <div className="text-[10px] text-[#858585] uppercase">Input:</div>
                        <div className="text-[#EFF1F6] overflow-x-auto">
                          {problem.test_cases[activeTestCaseIndex]?.input}
                        </div>
                      </div>
                      <div className="p-2.5 bg-[#1A1A1A] border border-[#2C2C2C] rounded space-y-1">
                        <div className="text-[10px] text-[#858585] uppercase">Expected Output:</div>
                        <div className="text-[#00B8A3] font-bold">
                          {problem.test_cases[activeTestCaseIndex]?.expected_output}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-[10px] text-[#858585] uppercase">Custom Input (JSON args array):</div>
                      <textarea
                        value={customTestCase}
                        onChange={(e) => setCustomTestCase(e.target.value)}
                        placeholder='e.g. [[["1","0"],["0","1"]]] or [2, 7, 11, 15], 9'
                        className="w-full h-16 p-2 bg-[#1A1A1A] border border-[#3C3C3C] rounded text-white font-mono text-xs focus:outline-none focus:border-[#FFA116]"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: TEST RESULT / SUBMISSION RESULT */}
              {rightBottomTab === 'result' && (
                <div className="space-y-3">
                  {!runResult ? (
                    <div className="h-full flex items-center justify-center text-[#858585] py-8">
                      Click "Run" or "Submit" to test your code against TeetCode test cases.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Status Banner */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-base font-bold ${
                            runResult.status === 'Accepted' ? 'text-[#00B8A3]' : 'text-[#FF375F]'
                          }`}>
                            {runResult.status}
                          </span>
                          <span className="text-[#858585] text-xs">
                            ({runResult.passed_count}/{runResult.total_count} test cases passed)
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-[#A1A1AA]">
                          <span>Runtime: <strong className="text-white">{runResult.execution_time_ms} ms</strong></span>
                          <span>Memory: <strong className="text-white">{runResult.memory_kb} KB</strong></span>
                        </div>
                      </div>

                      {/* Details Box */}
                      {runResult.results && runResult.results.length > 0 && (
                        <div className="space-y-2">
                          {runResult.results.map((tr, idx) => (
                            <div
                              key={idx}
                              className={`p-2.5 rounded border ${
                                tr.passed
                                  ? 'bg-[#1A1A1A] border-[#2C2C2C]'
                                  : 'bg-[#FF375F]/10 border-[#FF375F]/30'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[11px] mb-1">
                                <span className="font-bold text-white">Case {idx + 1}</span>
                                <span className={tr.passed ? 'text-[#00B8A3]' : 'text-[#FF375F]'}>
                                  {tr.passed ? '✓ Passed' : '✗ Failed'}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-[11px]">
                                <div>
                                  <span className="text-[#858585]">Your Output: </span>
                                  <span className={tr.passed ? 'text-[#EFF1F6]' : 'text-[#FF375F] font-bold'}>
                                    {tr.actual_output || tr.error || 'None'}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[#858585]">Expected: </span>
                                  <span className="text-[#00B8A3]">{tr.expected_output}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {runResult.stdout && (
                        <div className="p-2 bg-[#1A1A1A] border border-[#2C2C2C] rounded">
                          <div className="text-[10px] text-[#858585] uppercase">Stdout:</div>
                          <pre className="text-[#D1D5DB] text-xs">{runResult.stdout}</pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: AI REVIEW / CODE DIAGNOSTIC */}
              {rightBottomTab === 'review' && (
                <div className="space-y-3">
                  {!aiReview ? (
                    <div className="h-full flex items-center justify-center text-[#858585] py-8">
                      Submit your solution to generate a deep AST diagnostic and complexity review.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="p-3 bg-[#242424] border border-[#3C3C3C] rounded-lg">
                        <div className="text-[11px] font-bold text-[#00B8A3] flex items-center gap-1.5 mb-1">
                          <Sparkles size={13} />
                          <span>Complexity Breakdown:</span>
                        </div>
                        <div className="text-xs text-[#EFF1F6] leading-relaxed">
                          Time: {aiReview.time_complexity} (Optimal: {aiReview.time_complexity_optimal}) • Space: {aiReview.space_complexity} (Optimal: {aiReview.space_complexity_optimal})
                        </div>
                      </div>

                      {aiReview.recommendations && aiReview.recommendations.length > 0 && (
                        <div className="p-3 bg-[#242424] border border-[#3C3C3C] rounded-lg space-y-1.5">
                          <div className="text-[11px] font-bold text-[#FFA116]">Optimization Invariants:</div>
                          {aiReview.recommendations.map((s, idx) => (
                            <div key={idx} className="text-xs text-[#D1D5DB] flex items-start gap-1.5">
                              <span>•</span>
                              <span>{s}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
