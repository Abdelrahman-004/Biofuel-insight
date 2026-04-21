
import * as React from 'react';
import { ResearchImplementationAnalysis } from './types';

interface ResearchHistoryProps {
  history: ResearchImplementationAnalysis[];
  onSelect: (entry: ResearchImplementationAnalysis) => void;
  onClear: () => void;
}

export const ResearchHistory: React.FC<ResearchHistoryProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) {
    return (
      <div className="bg-[#0D141A]/70 backdrop-blur-[10px] rounded-3xl p-12 text-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/5">
        <div className="bg-[#0F172A] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-microscope text-slate-300 text-3xl"></i>
        </div>
        <h3 className="text-xl font-black text-white mb-2">No Research History</h3>
        <p className="text-slate-500 max-w-xs mx-auto">Your scientific implementation analyses will appear here once completed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-white">Research History</h2>
        <button 
          onClick={onClear}
          className="text-xs font-bold text-red-500 hover:text-red-600 transition uppercase tracking-widest"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {history.map((entry) => (
          <div 
            key={entry.id}
            onClick={() => onSelect(entry)}
            className="bg-[#0D141A]/70 backdrop-blur-[10px] p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/5 hover:border-blue-300 hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-black text-white group-hover:text-blue-600 transition">{entry.ResearchInputs.BiofuelType}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{entry.ResearchInputs.FeedstockType}</p>
              </div>
              <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black">
                Score: {entry.ReadinessScore.OverallScore}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-[#0F172A] p-3 rounded-xl">
                <p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Scale</p>
                <p className="text-xs font-bold text-slate-300">{entry.ResearchInputs.DesiredPilotScale}</p>
              </div>
              <div className="bg-[#0F172A] p-3 rounded-xl">
                <p className="text-[8px] font-bold text-slate-400 uppercase mb-1">TRL</p>
                <p className="text-xs font-bold text-slate-300">{entry.ResearchInputs.TechnologyReadinessLevel}</p>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span className="font-medium italic">{entry.timestamp}</span>
              <span className="text-blue-500 font-bold group-hover:translate-x-1 transition-transform">View Details <i className="fas fa-arrow-right ml-1"></i></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
