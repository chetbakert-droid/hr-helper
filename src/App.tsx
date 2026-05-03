/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Users, Trophy, Settings2, Sparkles, Box, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import NameInput from './components/NameInput';
import LuckyDraw from './components/LuckyDraw';
import AutoGroup from './components/AutoGroup';
import { Person, AppMode } from './types';

export default function App() {
  const [mode, setMode] = useState<AppMode>('input');
  const [people, setPeople] = useState<Person[]>([]);

  const tabs = [
    { id: 'input', label: '名单来源', icon: Settings2 },
    { id: 'draw', label: '奖品抽奖', icon: Trophy },
    { id: 'group', label: '自动分组', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-brand-bg text-brand-dark font-sans flex flex-col">
      {/* Header Section */}
      <header className="h-20 px-8 flex items-center justify-between bg-white border-b-4 border-brand-yellow shadow-sm fixed top-0 w-full z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
            HR
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#1A1A1A]">
            PEOPLE<span className="text-brand-blue">JOY</span> TOOLKIT
          </h1>
        </div>
        
        <div className="hidden md:flex gap-4">
          <div className="px-4 py-2 bg-[#F0F4FF] rounded-full border-2 border-brand-blue text-brand-blue font-bold text-sm">
            {people.length} 名单已加载
          </div>
          <div className="px-4 py-2 bg-brand-green/10 text-brand-green border-2 border-brand-green rounded-full font-bold text-sm uppercase tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
            就绪
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-20">
        {/* Sidebar Navigation */}
        <aside className="fixed left-0 top-20 bottom-0 w-72 bg-white/50 backdrop-blur-sm p-6 hidden lg:flex flex-col gap-4 border-r border-[#E0E0E0]/30 z-20">
          <div className="flex-1 bg-white rounded-3xl p-4 border-4 border-brand-yellow shadow-sm flex flex-col space-y-2">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2 mb-2">功能导航</h2>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = mode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setMode(tab.id as AppMode)}
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-base font-black transition-all transform hover:translate-x-1 ${
                    isActive
                      ? 'bg-brand-yellow text-brand-dark shadow-md'
                      : 'text-slate-400 hover:text-brand-dark hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : 'opacity-60'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-4 bg-brand-blue/5 rounded-2xl border-2 border-brand-blue/20 text-[10px] font-bold text-brand-blue uppercase tracking-wider text-center">
            V1.4.0 • 极简高效工具
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-72 p-6 md:p-8">
          {/* Mobile Nav */}
          <div className="lg:hidden flex gap-2 p-2 bg-brand-yellow/20 rounded-2xl w-full mb-6 border border-brand-yellow/30 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const isActive = mode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setMode(tab.id as AppMode)}
                  className={`flex-1 px-4 py-3 rounded-xl font-black whitespace-nowrap text-sm transition-all ${
                    isActive ? 'bg-brand-yellow text-brand-dark shadow-md' : 'text-slate-500 bg-white/50'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {mode === 'input' && <NameInput onNamesUpdate={setPeople} currentNames={people} />}
            {mode === 'draw' && <LuckyDraw names={people} />}
            {mode === 'group' && <AutoGroup names={people} />}
          </div>

          {/* Footer */}
          <footer className="mt-12 mb-8 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 border-t-2 border-slate-200/50 pt-8">
            <span>© 2024 PEOPLEJOY TOOLKIT</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-brand-green rounded-full shadow-[0_0_8px_rgba(107,203,119,0.5)]"></span>
              在线运行
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}

