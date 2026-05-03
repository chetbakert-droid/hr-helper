import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCcw, UserPlus, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { Person } from '../types';

interface LuckyDrawProps {
  names: Person[];
}

export default function LuckyDraw({ names }: LuckyDrawProps) {
  const [candidates, setCandidates] = useState<Person[]>(names);
  const [winners, setWinners] = useState<Person[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [currentPick, setCurrentPick] = useState<string>('?? ??? ??');
  const [allowRepeat, setAllowRepeat] = useState(false);
  const rollIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    setCandidates(names);
  }, [names]);

  const startDraw = () => {
    if (isRolling) return;
    if (candidates.length === 0 && !allowRepeat) {
      alert('所有人都已经中奖啦！');
      return;
    }
    if (names.length === 0) {
      alert('请先导入名单');
      return;
    }

    setIsRolling(true);
    const pool = allowRepeat ? names : candidates;
    
    let counter = 0;
    const maxRolls = 20;

    rollIntervalRef.current = window.setInterval(() => {
      const randomIndex = Math.floor(Math.random() * pool.length);
      setCurrentPick(pool[randomIndex].name);
      counter++;

      if (counter >= maxRolls) {
        if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
        
        const finalIndex = Math.floor(Math.random() * pool.length);
        const winner = pool[finalIndex];
        
        setCurrentPick(winner.name);
        setWinners(prev => [winner, ...prev]);
        
        if (!allowRepeat) {
          setCandidates(prev => prev.filter(c => c.id !== winner.id));
        }
        
        setIsRolling(false);
      }
    }, 80);
  };

  const resetAll = () => {
    setWinners([]);
    setCandidates(names);
    setCurrentPick('?? ??? ??');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Active Area: Lucky Draw */}
      <div className="bg-white rounded-[40px] p-8 md:p-12 border-4 border-brand-blue shadow-xl flex flex-col items-center justify-center relative overflow-hidden min-h-[500px]">
        {/* Decorative shapes */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-red/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-green/10 rounded-full blur-xl animate-pulse"></div>

        {/* Settings Bar */}
        <div className="absolute top-6 left-8 right-8 flex flex-wrap items-center justify-between gap-4 bg-slate-50 px-6 py-3 rounded-2xl border-2 border-slate-100">
           <div className="flex items-center gap-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <button 
                  onClick={() => !isRolling && setAllowRepeat(!allowRepeat)}
                  className={`w-12 h-7 rounded-full relative transition-colors ${allowRepeat ? 'bg-brand-green' : 'bg-slate-300'}`}
                >
                  <motion.div 
                    animate={{ x: allowRepeat ? 20 : 4 }}
                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm" 
                  />
                </button>
                <span className="text-sm font-black text-slate-600">允许重复</span>
              </label>
              <div className="w-[2px] h-4 bg-slate-200 hidden sm:block"></div>
              <div className="text-sm font-black text-slate-600 hidden sm:block">包含人数: <span className="text-brand-red font-mono">{allowRepeat ? names.length : candidates.length}</span></div>
           </div>

           <button 
             onClick={resetAll} 
             disabled={isRolling}
             className="text-xs font-black text-brand-red hover:underline disabled:opacity-30 flex items-center gap-1"
           >
             <RefreshCcw className="w-3 h-3" /> 重置抽奖
           </button>
        </div>

        {/* Main Stage */}
        <div className="flex flex-col items-center w-full max-w-lg mt-12 mb-12">
          <div className="w-full h-32 bg-[#F0F4FF] rounded-3xl border-8 border-brand-blue flex items-center justify-center relative mb-12 shadow-inner group transition-all">
             <motion.div 
               key={currentPick}
               initial={{ scale: 0.9, opacity: 0.5 }}
               animate={{ scale: 1, opacity: 1 }}
               className="text-4xl md:text-6xl font-black text-brand-blue tracking-widest text-center"
             >
               {currentPick}
             </motion.div>
             
             {isRolling && (
               <div className="absolute -top-6 bg-brand-red text-white px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest animate-bounce shadow-md">
                 Rolling Now
               </div>
             )}
          </div>
          
          <button 
            onClick={startDraw}
            disabled={isRolling || names.length === 0}
            className="group relative active:translate-y-2 transition-transform disabled:opacity-50 disabled:active:translate-y-0"
          >
            <div className="absolute -inset-4 bg-brand-red rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative w-40 h-40 bg-brand-red rounded-full border-b-[12px] border-[#D64545] flex flex-col items-center justify-center text-white shadow-2xl group-hover:bg-brand-red/90">
              <span className="text-5xl mb-1">🍀</span>
              <span className="text-2xl font-black italic tracking-tighter">START</span>
            </div>
          </button>
        </div>

        {/* Past Winners Ticker */}
        <div className="absolute bottom-6 left-8 right-8">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center md:text-left">最近获奖名单</p>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            <AnimatePresence>
              {winners.slice(0, 5).map((winner, idx) => (
                <motion.div 
                  key={`${winner.id}-${idx}`}
                  initial={{ x: -20, opacity: 0, scale: 0.8 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  className="bg-[#F9FAFB] px-4 py-2 rounded-2xl border-2 border-slate-100 flex items-center gap-2 whitespace-nowrap shadow-sm"
                >
                  <span className="text-lg">🥇</span> 
                  <span className="font-bold text-sm text-brand-dark">{winner.name}</span>
                </motion.div>
              ))}
              {winners.length === 0 && (
                <p className="text-xs font-bold text-slate-300 italic py-2">虚位以待，快点击上方开始吧！</p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
