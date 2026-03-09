
import * as React from 'react';
import { ProjectHistoryEntry } from './types';

interface ProjectHistoryProps {
  history: ProjectHistoryEntry[];
  onSelect: (entry: ProjectHistoryEntry) => void;
  onCompare: (selectedIds: string[]) => void;
  onClear: () => void;
}

export const ProjectHistory: React.FC<ProjectHistoryProps> = ({ history, onSelect, onCompare, onClear }) => {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const toggleSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
        <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-history text-slate-400 text-2xl"></i>
        </div>
        <h3 className="text-lg font-bold text-slate-900">No History Records</h3>
        <p className="text-slate-500 text-sm mt-2">Analyzed projects will automatically appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h3 className="text-white font-bold flex items-center">
            <i className="fas fa-clock-rotate-left mr-2 text-emerald-500"></i>
            Analysis History
          </h3>
          {selectedIds.length > 0 && (
            <button 
              onClick={() => onCompare(selectedIds)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg transition animate-pulse"
            >
              Compare ({selectedIds.length}) Selected
            </button>
          )}
        </div>
        <button 
          onClick={onClear}
          className="text-slate-400 hover:text-white text-xs font-bold transition"
        >
          Clear All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-3 w-10"></th>
              <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Project / Date</th>
              <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Domain & Feedstock</th>
              <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Feasibility</th>
              <th className="px-6 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {history.slice().reverse().map((entry) => (
              <tr 
                key={entry.id} 
                className={`hover:bg-emerald-50/30 transition group cursor-pointer ${selectedIds.includes(entry.id) ? 'bg-emerald-50' : ''}`}
                onClick={() => onSelect(entry)}
              >
                <td className="px-6 py-4 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(entry.id)}
                    onChange={() => {}} 
                    onClick={(e) => toggleSelection(entry.id, e)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800 text-sm">{entry.projectName}</div>
                  <div className="text-[10px] text-slate-400">{entry.timestamp}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    entry.energyDomain === 'Hydrogen' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {entry.energyDomain}
                  </span>
                  <div className="text-xs text-slate-500 mt-1">{entry.feedstock}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-black text-slate-800">{entry.score}%</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{entry.level}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <i className="fas fa-chevron-right text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all"></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
