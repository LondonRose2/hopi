import { useState } from 'react';
import { Compass, Sparkles, FolderCheck, ShieldCheck } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'welcome' | 'status'>('welcome');

  return (
    <div className="min-h-screen bg-[#0B131E] text-white flex flex-col justify-between">
      {/* Header */}
      <header className="px-5 pt-8 pb-4 border-b border-[#1E2D40] bg-[#131D2A]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E5A93C]/20 border border-[#E5A93C] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#E5A93C]" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">Hopi</h1>
              <p className="text-xs text-slate-400">Mobile Companion & Utility</p>
            </div>
          </div>
          <span className="text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Day 1 Ready
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-5 py-6 max-w-lg mx-auto w-full pb-safe">
        {activeTab === 'welcome' ? (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#131D2A] border border-[#1E2D40] space-y-3">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#E5A93C]" />
                Ready for Features
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Hopi is scaffolded with modular architecture, token protection, and living context files.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#131D2A] border border-[#1E2D40] space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <FolderCheck className="w-4 h-4 text-emerald-400" />
                Active Context Infrastructure
              </h3>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#E5A93C] font-mono">AGENTS.md:</span> Table of Contents & Fast File Map
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#E5A93C] font-mono">CURRENT_STATUS.md:</span> Living handoff & session continuity
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-[#131D2A] border border-[#1E2D40] space-y-3">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Security & Guardrails
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Pre-commit gate installed, <code className="text-[#E5A93C]">--ignore-scripts</code> enforced, and clean zero-error type safety.
            </p>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-[#131D2A]/90 backdrop-blur-lg border-t border-[#1E2D40] px-6 py-2 bottom-nav-safe">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <button
            onClick={() => setActiveTab('welcome')}
            className={`flex flex-col items-center py-1 px-3 text-xs font-medium transition-colors ${
              activeTab === 'welcome' ? 'text-[#E5A93C]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-5 h-5 mb-1" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`flex flex-col items-center py-1 px-3 text-xs font-medium transition-colors ${
              activeTab === 'status' ? 'text-[#E5A93C]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-5 h-5 mb-1" />
            System
          </button>
        </div>
      </nav>
    </div>
  );
}
