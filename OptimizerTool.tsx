import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizerResult, OptimizerHistoryEntry } from './types';
import { optimizeProject } from './geminiService';

interface OptimizerToolProps {
  history: OptimizerHistoryEntry[];
  onSave: (entry: OptimizerHistoryEntry) => void;
  onClear: () => void;
  initialInputs?: { projectName: string; description: string };
  initialResult?: OptimizerResult;
}

const DRAFT_KEY = 'biofuel_insight_optimizer_draft';

export const OptimizerTool: React.FC<OptimizerToolProps> = ({ history, onSave, onClear, initialInputs, initialResult }) => {
  const [projectName, setProjectName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [result, setResult] = React.useState<OptimizerResult | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<'OPTIMIZE' | 'HISTORY'>('OPTIMIZE');

  // Load draft
  React.useEffect(() => {
    if (initialInputs) {
      setProjectName(initialInputs.projectName || '');
      setDescription(initialInputs.description || '');
    } else {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        try {
          const draft = JSON.parse(saved);
          setProjectName(draft.projectName || '');
          setDescription(draft.description || '');
        } catch (e) { console.error(e); }
      }
    }
  }, [initialInputs]);

  React.useEffect(() => {
    if (initialResult) {
      setResult(initialResult);
      setViewMode('OPTIMIZE');
    }
  }, [initialResult]);

  // Save draft
  React.useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ projectName, description }));
  }, [projectName, description]);

  const handleOptimize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !description.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await optimizeProject(projectName, description);
      setResult(data);
      
      const newEntry: OptimizerHistoryEntry = {
        id: Date.now().toString(),
        projectName: projectName,
        timestamp: new Date().toLocaleString(),
        fullData: data
      };
      onSave(newEntry);
    } catch (err) {
      setError('Failed to generate optimization strategy. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFromHistory = (entry: OptimizerHistoryEntry) => {
    setResult(entry.fullData);
    setProjectName(entry.projectName);
    setViewMode('OPTIMIZE');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto space-y-8 pb-20"
    >
      <div className="flex justify-center mb-4">
        <div className="bg-slate-900/50 p-1 rounded-xl border border-slate-800 flex space-x-1">
          <button 
            onClick={() => setViewMode('OPTIMIZE')}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              viewMode === 'OPTIMIZE' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <i className="fas fa-chart-line mr-2"></i> Optimize
          </button>
          <button 
            onClick={() => setViewMode('HISTORY')}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              viewMode === 'HISTORY' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <i className="fas fa-history mr-2"></i> History ({history.length})
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'OPTIMIZE' ? (
          <motion.div 
            key="optimize"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
            <div className="bg-emerald-600/10 px-8 py-6 border-b border-slate-800">
              <h2 className="text-2xl font-black text-white flex items-center tracking-tight">
                <i className="fas fa-leaf mr-3 text-emerald-400"></i>
                Smart Profit & Low-Carbon Optimizer
              </h2>
              <p className="text-slate-400 text-sm mt-1">Maximize profitability while reaching net-zero milestones.</p>
            </div>
            
            <form onSubmit={handleOptimize} className="p-8 space-y-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest w-full mb-1">Try an Example:</span>
                {[
                  { name: "Algae Biofuel Hub", desc: "Large-scale algae cultivation in Duqm using industrial CO2 and seawater." },
                  { name: "Date Seed Oil Pilot", desc: "Extracting oil from date seeds for biodiesel production in Nizwa." },
                  { name: "Waste Cooking Oil Network", desc: "Collecting and refining used cooking oil from Muscat restaurants." }
                ].map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { setProjectName(ex.name); setDescription(ex.desc); }}
                    className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-[10px] font-bold text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-all"
                  >
                    {ex.name}
                  </button>
                ))}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Project Name</label>
                  <input 
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g., Algae-to-Biofuel Hub Oman"
                    className="w-full px-6 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Project Description & Goals</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your project, current feedstock, and target production scale..."
                    className="w-full px-6 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition min-h-[120px]"
                  />
                </div>
              </div>
              <button 
                disabled={isLoading || !projectName.trim() || !description.trim()}
                className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center space-x-2 transition-all shadow-lg ${
                  isLoading ? 'bg-slate-700 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 active:scale-95'
                }`}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Optimizing Strategy...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-rocket"></i>
                    <span>Generate Optimization Strategy</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}

            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12"
              >
                <div className="space-y-8">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
                  >
                    <div className="bg-emerald-600 px-8 py-4">
                      <h3 className="text-white font-bold text-sm uppercase tracking-widest flex items-center">
                        <i className="fas fa-money-bill-trend-up mr-3 text-emerald-100"></i>
                        Profit Opportunities
                      </h3>
                    </div>
                    <div className="p-8">
                      <ul className="space-y-4">
                        {result.ProfitOpportunities.map((item, i) => (
                          <li key={i} className="flex items-start text-slate-700">
                            <i className="fas fa-circle-check text-emerald-500 mr-3 mt-1 shrink-0"></i>
                            <span className="font-medium">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
                  >
                    <div className="bg-blue-600 px-8 py-4">
                      <h3 className="text-white font-bold text-sm uppercase tracking-widest flex items-center">
                        <i className="fas fa-cloud-arrow-down mr-3 text-blue-100"></i>
                        Carbon Reduction Strategies
                      </h3>
                    </div>
                    <div className="p-8">
                      <ul className="space-y-4">
                        {result.CarbonReductionStrategies.map((item, i) => (
                          <li key={i} className="flex items-start text-slate-700">
                            <i className="fas fa-leaf text-blue-500 mr-3 mt-1 shrink-0"></i>
                            <span className="font-medium">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-slate-900 rounded-3xl shadow-xl p-8 text-white"
                  >
                    <h3 className="text-lg font-black mb-6 flex items-center">
                      <i className="fas fa-truck-fast mr-3 text-emerald-400"></i>
                      Logistics Optimization
                    </h3>
                    <ul className="space-y-4">
                      {result.LogisticsOptimization.map((item, i) => (
                        <li key={i} className="flex items-start text-slate-300 text-sm">
                          <i className="fas fa-location-dot text-emerald-400 mr-3 mt-1 shrink-0"></i>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>

                <div className="space-y-8">
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
                  >
                    <div className="bg-amber-500 px-8 py-4">
                      <h3 className="text-white font-bold text-sm uppercase tracking-widest flex items-center">
                        <i className="fas fa-bolt mr-3 text-amber-100"></i>
                        Fossil Fuel Replacement Plan
                      </h3>
                    </div>
                    <div className="p-8">
                      <ul className="space-y-4">
                        {result.FossilFuelReplacementPlan.map((item, i) => (
                          <li key={i} className="flex items-start text-slate-700">
                            <i className="fas fa-plug-circle-bolt text-amber-500 mr-3 mt-1 shrink-0"></i>
                            <span className="font-medium">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-emerald-900 rounded-3xl shadow-xl overflow-hidden text-white"
                  >
                    <div className="bg-emerald-800 px-8 py-6 border-b border-emerald-700">
                      <h3 className="text-lg font-black flex items-center">
                        <i className="fas fa-flag-checkered mr-3 text-emerald-400"></i>
                        Net-Zero Roadmap
                      </h3>
                    </div>
                    <div className="p-8 space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-emerald-800/50 rounded-2xl border border-emerald-700">
                          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Carbon Intensity</p>
                          <p className="text-sm font-bold">{result.NetZeroRoadmap.CarbonIntensityEstimate}</p>
                        </div>
                        <div className="p-4 bg-emerald-800/50 rounded-2xl border border-emerald-700">
                          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Global Standards</p>
                          <p className="text-sm font-bold">{result.NetZeroRoadmap.StandardsComparison}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4">Implementation Steps</p>
                        <div className="space-y-4">
                          {result.NetZeroRoadmap.RoadmapSteps.map((step, i) => (
                            <div key={i} className="flex items-start">
                              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-black mr-3 shrink-0">
                                {i + 1}
                              </div>
                              <p className="text-sm text-emerald-100">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
          >
            <div className="bg-slate-900 px-8 py-6 flex justify-between items-center">
            <h3 className="text-white font-bold text-lg">Optimization History</h3>
            <button 
              onClick={onClear}
              className="text-xs font-black text-red-400 uppercase tracking-widest hover:text-red-300 transition"
            >
              Clear All
            </button>
          </div>
          <div className="p-8">
            {history.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-folder-open text-slate-200 text-5xl mb-4"></i>
                <p className="text-slate-400 font-medium">No history found. Start optimizing your project!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((entry) => (
                  <div 
                    key={entry.id}
                    onClick={() => handleSelectFromHistory(entry)}
                    className="p-6 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition cursor-pointer group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-emerald-600 transition">{entry.projectName}</h4>
                        <p className="text-xs text-slate-400 mt-1">{entry.timestamp}</p>
                      </div>
                      <i className="fas fa-chevron-right text-slate-300 group-hover:text-emerald-400 transition"></i>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </motion.div>
  );
};
