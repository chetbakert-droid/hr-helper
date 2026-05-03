import React, { useState, useMemo } from 'react';
import Papa from 'papaparse';
import { Upload, Clipboard, Trash2, UserCheck, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Person } from '../types';

interface NameInputProps {
  onNamesUpdate: (names: Person[]) => void;
  currentNames: Person[];
}

const MOCK_NAMES = [
  "张小明", "李华", "王红", "赵强", "刘云", "陈林", "周杰", "徐静", 
  "孙悟空", "哪吒", "林黛玉", "贾宝玉", "薛宝钗", "史湘云", "王熙凤", "刘姥姥"
];

export default function NameInput({ onNamesUpdate, currentNames }: NameInputProps) {
  const [textInput, setTextInput] = useState(currentNames.map(p => p.name).join('\n'));
  const [isDragging, setIsDragging] = useState(false);

  // Find duplicates
  const duplicateNames = useMemo(() => {
    const counts = new Map<string, number>();
    currentNames.forEach(p => {
      counts.set(p.name, (counts.get(p.name) || 0) + 1);
    });
    return new Set(Array.from(counts.entries()).filter(([_, count]) => count > 1).map(([name]) => name));
  }, [currentNames]);

  const updateNames = (names: Person[]) => {
    onNamesUpdate(names);
    setTextInput(names.map(n => n.name).join('\n'));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextInput(value);
    const names = value.split('\n')
      .map(n => n.trim())
      .filter(n => n !== '')
      .map((name, index) => ({ id: `${Date.now()}-${index}`, name }));
    onNamesUpdate(names);
  };

  const processFile = (file: File) => {
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      Papa.parse(file, {
        complete: (results) => {
          const names = results.data
            .flat()
            .map((n: any) => String(n).trim())
            .filter(n => n !== '')
            .map((name, index) => ({ id: `csv-${Date.now()}-${index}`, name }));
          updateNames(names);
        },
        header: false
      });
    } else {
      alert('仅支持上传 CSV 文件');
    }
  };

  const loadMockData = () => {
    const names = MOCK_NAMES.map((name, index) => ({
      id: `mock-${Date.now()}-${index}`,
      name
    }));
    updateNames(names);
  };

  const removeDuplicates = () => {
    const seen = new Set();
    const unique = currentNames.filter(p => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });
    updateNames(unique);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <h2 className="text-xl font-black text-brand-dark flex items-center gap-2">
          <span className="p-2 bg-brand-red text-white rounded-xl shadow-sm"><Clipboard className="w-5 h-5" /></span>
          名单来源设置
        </h2>
        <button
          onClick={loadMockData}
          className="flex items-center gap-2 px-4 py-2 bg-brand-yellow text-brand-dark rounded-xl text-sm font-black shadow-[0_4px_0_#DAB833] hover:translate-y-0.5 active:shadow-none transition-all"
        >
          <Sparkles className="w-4 h-4" />
          生成模拟名单
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[32px] p-6 border-4 border-brand-yellow shadow-sm flex flex-col h-[400px]">
          <label className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
             手动粘贴姓名
          </label>
          <textarea
            value={textInput}
            onChange={handleTextChange}
            placeholder="张三&#10;李四&#10;王五..."
            className="flex-1 w-full p-6 text-base border-2 border-slate-100 rounded-3xl focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue outline-none transition-all font-sans bg-slate-50 shadow-inner resize-none"
          />
        </div>

        <div className="bg-white rounded-[32px] p-6 border-4 border-brand-blue shadow-sm flex flex-col h-[400px]">
          <label className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
             上传 CSV 文件
          </label>
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if(f) processFile(f); }}
            className={`flex-1 flex flex-col items-center justify-center border-4 border-dashed rounded-3xl transition-all relative group overflow-hidden ${
              isDragging ? 'border-brand-blue bg-brand-blue/5' : 'border-slate-100 bg-slate-50'
            }`}
          >
            <div className="z-10 flex flex-col items-center">
              <div className="p-5 bg-white rounded-2xl shadow-md mb-4 group-hover:scale-110 transition-transform">
                <Upload className={`w-10 h-10 ${isDragging ? 'text-brand-blue' : 'text-slate-300'}`} />
              </div>
              <p className="text-base font-black text-brand-dark">拖拽或点击上传</p>
              <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest">Supports CSV files</p>
            </div>
            
            <input
              type="file"
              accept=".csv"
              onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] p-8 border-4 border-brand-green shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            实时名单预览
            <span className="bg-brand-green text-white text-[10px] px-2 py-0.5 rounded-full">{currentNames.length}</span>
          </h3>
          
          <AnimatePresence>
            {duplicateNames.size > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={removeDuplicates}
                className="flex items-center gap-2 px-4 py-2 bg-brand-red text-white rounded-xl text-xs font-black shadow-[0_4px_0_#D64545] hover:translate-y-0.5 active:shadow-none"
              >
                <Trash2 className="w-3 h-3" />
                移除重名 ({duplicateNames.size} 项)
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-wrap gap-3 max-h-[300px] overflow-y-auto no-scrollbar pb-4">
          <AnimatePresence>
            {currentNames.map((person) => (
              <motion.span
                key={person.id}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={`px-4 py-2 rounded-2xl text-sm font-bold border-2 transition-all flex items-center gap-2 ${
                  duplicateNames.has(person.name)
                    ? 'bg-brand-red/10 border-brand-red text-brand-red shadow-[0_4px_0_rgba(255,107,107,0.2)]'
                    : 'bg-slate-50 text-brand-dark border-slate-100'
                }`}
              >
                {duplicateNames.has(person.name) && <AlertCircle className="w-3 h-3" />}
                {person.name}
              </motion.span>
            ))}
            {currentNames.length === 0 && (
              <div className="w-full text-center py-12">
                <div className="flex flex-col items-center gap-2 text-slate-300">
                  <UserCheck className="w-12 h-12" />
                  <p className="text-sm font-bold italic">暂无名单，请在上方输入、上传或点击“模拟名单”</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
