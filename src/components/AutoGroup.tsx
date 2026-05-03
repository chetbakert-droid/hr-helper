import { useState } from 'react';
import { motion } from 'motion/react';
import { Users, LayoutGrid, Shuffle, Info, Download } from 'lucide-react';
import Papa from 'papaparse';
import { Person, Group } from '../types';

interface AutoGroupProps {
  names: Person[];
}

export default function AutoGroup({ names }: AutoGroupProps) {
  const [perGroup, setPerGroup] = useState(3);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGrouping, setIsGrouping] = useState(false);

  const startGrouping = () => {
    if (names.length === 0) {
      alert('请先导入名单');
      return;
    }
    
    setIsGrouping(true);
    // Shuffle names
    const shuffled = [...names].sort(() => Math.random() - 0.5);
    
    const result: Group[] = [];
    const groupCount = Math.ceil(shuffled.length / perGroup);
    
    for (let i = 0; i < groupCount; i++) {
      result.push({
        id: `group-${i}`,
        name: `TEAM ${i + 1}`,
        members: shuffled.slice(i * perGroup, (i + 1) * perGroup)
      });
    }
    
    // Simulate some "thinking" time for UI feedback
    setTimeout(() => {
      setGroups(result);
      setIsGrouping(false);
    }, 600);
  };

  const exportCSV = () => {
    if (groups.length === 0) return;

    const data: string[][] = [];
    // Header
    data.push(['小组名称', '成员姓名']);
    
    groups.forEach(group => {
      group.members.forEach(member => {
        data.push([group.name, member.name]);
      });
    });

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `HR_Group_Results_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
        <div>
          <h2 className="text-2xl font-black text-brand-dark flex items-center gap-3">
            <span className="p-2 bg-brand-blue text-white rounded-2xl shadow-md"><Users className="w-6 h-6" /></span>
            自动分组
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
            智能化团队分配工具
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-white p-3 rounded-3xl border-4 border-brand-yellow shadow-sm">
          <div className="flex items-center gap-3 px-4 border-r border-[#E0E0E0]/50 py-1">
            <span className="text-sm font-black text-slate-500 uppercase tracking-widest">每组人数</span>
            <input
              type="number"
              min="1"
              max={Math.max(names.length, 1)}
              value={perGroup}
              onChange={(e) => setPerGroup(parseInt(e.target.value) || 1)}
              className="w-16 p-2 bg-slate-50 border-2 border-slate-100 rounded-xl text-center font-black text-brand-blue focus:outline-none focus:border-brand-blue shadow-inner"
            />
          </div>
          <button
            onClick={startGrouping}
            disabled={isGrouping || names.length === 0}
            className="flex items-center gap-2 px-8 py-3 bg-brand-blue text-white rounded-2xl text-sm font-black hover:translate-y-0.5 active:translate-y-1 transition-all disabled:opacity-50 shadow-[0_4px_0_#3B7ED9] hover:shadow-[0_2px_0_#3B7ED9] disabled:shadow-none"
          >
            {isGrouping ? (
              <Shuffle className="w-4 h-4 animate-spin" />
            ) : (
              <Users className="w-4 h-4" />
            )}
            一键分组
          </button>
          
          {groups.length > 0 && (
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-6 py-3 bg-brand-green text-white rounded-2xl text-sm font-black hover:translate-y-0.5 active:translate-y-1 transition-all shadow-[0_4px_0_#4E9F57]"
            >
              <Download className="w-4 h-4" />
              导出 CSV
            </button>
          )}
        </div>
      </div>

      {groups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {groups.map((group, gIdx) => (
            <motion.div
              key={group.id}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: gIdx * 0.05, type: 'spring', stiffness: 200 }}
              className="bg-white rounded-[32px] border-4 border-brand-yellow shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all group"
            >
              <div className="bg-brand-yellow/10 px-6 py-4 border-b-2 border-brand-yellow/20 flex items-center justify-between">
                <h4 className="font-black text-brand-dark flex items-center gap-2 text-sm uppercase tracking-widest">
                  <LayoutGrid className="w-4 h-4 text-brand-yellow" />
                  {group.name}
                </h4>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-brand-yellow/20 text-[10px] font-black">
                  {group.members.length}
                </div>
              </div>
              <div className="p-6 space-y-3">
                {group.members.map((member, mIdx) => (
                  <motion.div 
                    key={member.id} 
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: (gIdx * 0.05) + (mIdx * 0.1) }}
                    className="flex items-center gap-3 py-2 px-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100"
                   >
                    <div className="w-6 h-6 rounded-lg bg-brand-blue/10 text-brand-blue flex items-center justify-center text-[10px] font-black">
                      {mIdx + 1}
                    </div>
                    <span className="text-sm font-bold text-slate-700">{member.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 px-12 text-center bg-white rounded-[40px] border-4 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border-2 border-slate-100">
            <Users className="w-10 h-10 text-slate-200" />
          </div>
          <h3 className="text-xl font-black text-slate-300 uppercase tracking-widest">尚未分组</h3>
          <p className="max-w-xs text-sm text-slate-400 mt-4 font-bold">
            请确认已导入名单并设置每组的人数，然后点击“一键分组”。
          </p>
        </div>
      )}
    </div>
  );
}
