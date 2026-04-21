
import * as React from 'react';
import { ProjectHistoryEntry } from './types';

interface CompareProjectsProps {
  entries: ProjectHistoryEntry[];
  onBack: () => void;
}

export const CompareProjects: React.FC<CompareProjectsProps> = ({ entries, onBack }) => {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-emerald-600 font-bold text-sm transition"
        >
          <i className="fas fa-arrow-left mr-2"></i> Back to History
        </button>
        <h2 className="text-2xl font-bold text-white">Project Comparison</h2>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 shadow-sm bg-[#0D141A]/70 backdrop-blur-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-white/5 hover:border-emerald-500/50">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0F172A] border-b border-white/10">
              <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-r border-white/5 min-w-[200px]">Metric</th>
              {entries.map(entry => (
                <th key={entry.id} className="p-6 text-center border-r border-white/5 min-w-[250px]">
                  <div className="text-emerald-600 font-black text-lg">{entry.projectName}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">{entry.timestamp}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="p-4 bg-[#0F172A]/50 font-bold text-slate-400 text-xs border-r border-white/5">Feasibility Score</td>
              {entries.map(e => (
                <td key={e.id} className="p-4 text-center border-r border-white/5">
                  <div className="text-2xl font-black text-slate-200">{e.score}%</div>
                  <div className={`text-[10px] font-bold uppercase ${e.score > 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {e.level}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 bg-[#0F172A]/50 font-bold text-slate-400 text-xs border-r border-white/5">Feedstock Type</td>
              {entries.map(e => (
                <td key={e.id} className="p-4 text-center border-r border-white/5 text-sm font-medium text-slate-300">
                  {e.feedstock}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 bg-[#0F172A]/50 font-bold text-slate-400 text-xs border-r border-white/5">Location</td>
              {entries.map(e => (
                <td key={e.id} className="p-4 text-center border-r border-white/5 text-sm text-slate-400">
                  {e.location}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 bg-[#0F172A]/50 font-bold text-slate-400 text-xs border-r border-white/5">Economic Outlook</td>
              {entries.map(e => (
                <td key={e.id} className="p-4 text-center border-r border-white/5 text-xs italic text-slate-500 px-6">
                  "{e.fullData.EconomicFeasibility.Assessment}"
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 bg-[#0F172A]/50 font-bold text-slate-400 text-xs border-r border-white/5">Payback Period</td>
              {entries.map(e => (
                <td key={e.id} className="p-4 text-center border-r border-white/5 font-bold text-slate-200">
                  {e.fullData.EconomicFeasibility.PaybackPeriodYears} Years
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 bg-[#0F172A]/50 font-bold text-slate-400 text-xs border-r border-white/5">Carbon Intensity</td>
              {entries.map(e => (
                <td key={e.id} className="p-4 text-center border-r border-white/5 text-sm font-bold text-emerald-600">
                  {e.fullData.EnvironmentalImpact.CarbonEmissions_kgCO2_per_liter} kg CO₂/L
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
