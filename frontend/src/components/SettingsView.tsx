import React, { useState } from 'react';
import { Settings, Save, Check, Shield, Terminal, Sparkles, Key, Sliders } from 'lucide-react';

interface SettingsViewProps {
  socraticMode: boolean;
  onToggleSocratic: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  socraticMode,
  onToggleSocratic
}) => {
  const [tabSize, setTabSize] = useState<number>(4);
  const [fontSize, setFontSize] = useState<number>(13);
  const [keybinding, setKeybinding] = useState<string>('standard');
  const [coachingStyle, setCoachingStyle] = useState<string>('socratic_strict');
  const [dailyTarget, setDailyTarget] = useState<number>(3);
  const [apiKey, setApiKey] = useState<string>('');
  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 bg-[#1A1A1A] text-[#EFF1F6]">
      {/* Header */}
      <div className="border-b border-[#333333] pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Settings size={22} className="text-[#FFA116]" />
          <span>TeetCode Platform & Environment Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
          Customize code editor mechanics, Socratic reasoning strictness, and AI model parameters.
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: AI Coach Mentorship Behavior */}
        <div className="p-6 bg-[#222222] border border-[#333333] rounded-2xl space-y-4">
          <div className="border-b border-[#333333] pb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={16} className="text-[#00B8A3]" />
              <span>Socratic AI Mentorship & Questioning Depth</span>
            </h2>
            <span className="text-[11px] font-mono text-[#00B8A3] bg-[#00B8A3]/10 px-2 py-0.5 rounded border border-[#00B8A3]/30 font-bold">
              Active
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-[#A1A1AA] block mb-2 font-medium">Coaching Style:</label>
              <div className="space-y-2">
                <label className="p-3.5 bg-[#1A1A1A] border border-[#333333] rounded-xl flex items-start gap-3 cursor-pointer hover:border-[#FFA116] transition-colors">
                  <input
                    type="radio"
                    name="coaching"
                    checked={coachingStyle === 'socratic_strict'}
                    onChange={() => setCoachingStyle('socratic_strict')}
                    className="mt-0.5 accent-[#FFA116]"
                  />
                  <div>
                    <div className="text-white font-bold">Strict Socratic Mentor (Recommended for Real Interview Prep)</div>
                    <div className="text-[#858585] text-[11px] mt-0.5">
                      Forces conceptual invariant discovery via probing questions. Never delivers instant solution code without earned progression.
                    </div>
                  </div>
                </label>

                <label className="p-3.5 bg-[#1A1A1A] border border-[#333333] rounded-xl flex items-start gap-3 cursor-pointer hover:border-[#FFA116] transition-colors">
                  <input
                    type="radio"
                    name="coaching"
                    checked={coachingStyle === 'balanced'}
                    onChange={() => setCoachingStyle('balanced')}
                    className="mt-0.5 accent-[#FFA116]"
                  />
                  <div>
                    <div className="text-white font-bold">Balanced Guide (Faster Feedback)</div>
                    <div className="text-[#858585] text-[11px] mt-0.5">
                      Combines Socratic prompts with fast algorithmic snippets and complexity breakdowns.
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Global Socratic Toggle */}
            <div className="pt-3 flex items-center justify-between border-t border-[#333333]">
              <div>
                <div className="text-white font-bold">Global Socratic Mode</div>
                <div className="text-[#858585] text-[11px]">Enables Socratic questioning across all problem views.</div>
              </div>
              <button
                onClick={onToggleSocratic}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                  socraticMode
                    ? 'bg-[#00B8A3] text-black border-[#00B8A3]'
                    : 'bg-[#1A1A1A] border-[#333333] text-[#858585]'
                }`}
              >
                {socraticMode ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Editor Preferences */}
        <div className="p-6 bg-[#222222] border border-[#333333] rounded-2xl space-y-4 text-xs">
          <div className="border-b border-[#333333] pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Terminal size={16} className="text-[#FFA116]" />
              <span>IDE & Editor Preferences</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[#A1A1AA] font-medium">Tab Indentation:</label>
              <select
                value={tabSize}
                onChange={(e) => setTabSize(Number(e.target.value))}
                className="w-full p-2.5 bg-[#1A1A1A] border border-[#3C3C3C] rounded-lg text-white focus:outline-none focus:border-[#FFA116]"
              >
                <option value={2}>2 Spaces</option>
                <option value={4}>4 Spaces (Standard Python/C++)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[#A1A1AA] font-medium">Font Size:</label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full p-2.5 bg-[#1A1A1A] border border-[#3C3C3C] rounded-lg text-white focus:outline-none focus:border-[#FFA116]"
              >
                <option value={12}>12px (Compact)</option>
                <option value={13}>13px (Default Balanced)</option>
                <option value={14}>14px (Comfort)</option>
                <option value={16}>16px (Large)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[#A1A1AA] font-medium">Keybinding Scheme:</label>
              <select
                value={keybinding}
                onChange={(e) => setKeybinding(e.target.value)}
                className="w-full p-2.5 bg-[#1A1A1A] border border-[#3C3C3C] rounded-lg text-white focus:outline-none focus:border-[#FFA116]"
              >
                <option value="standard">Standard VS Code</option>
                <option value="vim">Vim Mode</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: LLM Integration */}
        <div className="p-6 bg-[#222222] border border-[#333333] rounded-2xl space-y-4 text-xs">
          <div className="border-b border-[#333333] pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Key size={16} className="text-[#00B8A3]" />
              <span>LLM Provider & BYOK Abstraction</span>
            </h2>
            <p className="text-[#858585] text-[11px] mt-1">
              TeetCode uses an advanced built-in AST diagnostic & deterministic Socratic heuristic engine by default. You can optionally supply your own custom LLM API key.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[#A1A1AA] font-medium">Custom API Key (Optional):</label>
            <input
              type="password"
              placeholder="sk-... or AIza..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2.5 bg-[#1A1A1A] border border-[#3C3C3C] rounded-lg text-white focus:outline-none focus:border-[#FFA116] font-mono"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#FFA116] text-black font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#FFB03A] transition-all flex items-center gap-2 shadow-md"
          >
            {saved ? <Check size={14} /> : <Save size={14} />}
            <span>{saved ? 'Preferences Saved' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
