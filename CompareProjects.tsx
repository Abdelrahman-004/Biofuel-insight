
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
        <h2 className="text-2xl font-bold text-slate-900">Project Comparison</h2>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-100 min-w-[200px]">Metric</th>
              {entries.map(entry => (
                <th key={entry.id} className="p-6 text-center border-r border-slate-100 min-w-[250px]">
                  <div className="text-emerald-600 font-black text-lg">{entry.projectName}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">{entry.timestamp}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="p-4 bg-slate-50/50 font-bold text-slate-600 text-xs border-r border-slate-100">Feasibility Score</td>
              {entries.map(e => (
                <td key={e.id} className="p-4 text-center border-r border-slate-100">
                  <div className="text-2xl font-black text-slate-800">{e.score}%</div>
                  <div className={`text-[10px] font-bold uppercase ${e.score > 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {e.level}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 bg-slate-50/50 font-bold text-slate-600 text-xs border-r border-slate-100">Feedstock Type</td>
              {entries.map(e => (
                <td key={e.id} className="p-4 text-center border-r border-slate-100 text-sm font-medium text-slate-700">
                  {e.feedstock}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 bg-slate-50/50 font-bold text-slate-600 text-xs border-r border-slate-100">Location</td>
              {entries.map(e => (
                <td key={e.id} className="p-4 text-center border-r border-slate-100 text-sm text-slate-600">
                  {e.location}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 bg-slate-50/50 font-bold text-slate-600 text-xs border-r border-slate-100">Economic Outlook</td>
              {entries.map(e => (
                <td key={e.id} className="p-4 text-center border-r border-slate-100 text-xs italic text-slate-500 px-6">
                  "{e.fullData.EconomicFeasibility.Assessment}"
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 bg-slate-50/50 font-bold text-slate-600 text-xs border-r border-slate-100">Payback Period</td>
              {entries.map(e => (
                <td key={e.id} className="p-4 text-center border-r border-slate-100 font-bold text-slate-800">
                  {e.fullData.EconomicFeasibility.PaybackPeriodYears} Years
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 bg-slate-50/50 font-bold text-slate-600 text-xs border-r border-slate-100">Carbon Intensity</td>
              {entries.map(e => (
                <td key={e.id} className="p-4 text-center border-r border-slate-100 text-sm font-bold text-emerald-600">
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
