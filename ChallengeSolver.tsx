import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChallengeSolverResult, ChallengeHistoryEntry } from './types';
import { solveChallenge } from './geminiService';

interface ChallengeSolverProps {
  history: ChallengeHistoryEntry[];
  onSave: (entry: ChallengeHistoryEntry) => void;
  onClear: () => void;
  initialInputs?: { topic: string };
  initialResult?: ChallengeSolverResult;
}

const TOPIC_STORAGE_KEY = 'biofuel_insight_challenge_topic_draft';

export const ChallengeSolver: React.FC<ChallengeSolverProps> = ({ history, onSave, onClear, initialInputs, initialResult }) => {
  const [topic, setTopic] = React.useState('');
  const [result, setResult] = React.useState<ChallengeSolverResult | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<'SOLVE' | 'HISTORY'>('SOLVE');

  // Load draft on mount
  React.useEffect(() => {
    if (initialInputs) {
      setTopic(initialInputs.topic);
    } else {
      const saved = localStorage.getItem(TOPIC_STORAGE_KEY);
      if (saved) setTopic(saved);
    }
  }, [initialInputs]);

  React.useEffect(() => {
    if (initialResult) {
      setResult(initialResult);
      setViewMode('SOLVE');
    }
  }, [initialResult]);

  // Save draft on change
  React.useEffect(() => {
    localStorage.setItem(TOPIC_STORAGE_KEY, topic);
  }, [topic]);

  const handleSolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await solveChallenge(topic);
      setResult(data);
      
      const newEntry: ChallengeHistoryEntry = {
        id: Date.now().toString(),
        topic: topic,
        timestamp: new Date().toLocaleString(),
        fullData: data
      };
      onSave(newEntry);
    } catch (err) {
      setError('Failed to generate solution. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFromHistory = (entry: ChallengeHistoryEntry) => {
    setResult(entry.fullData);
    setTopic(entry.topic);
    setViewMode('SOLVE');
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
            onClick={() => setViewMode('SOLVE')}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              viewMode === 'SOLVE' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <i className="fas fa-lightbulb mr-2"></i> Solve
          </button>
          <button 
            onClick={() => setViewMode('HISTORY')}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              viewMode === 'HISTORY' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <i className="fas fa-history mr-2"></i> History ({history.length})
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'SOLVE' ? (
          <motion.div 
            key="solve"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
            <div className="bg-blue-600/10 px-8 py-6 border-b border-slate-800">
              <h2 className="text-2xl font-black text-white flex items-center tracking-tight">
                <i className="fas fa-microscope mr-3 text-blue-400"></i>
                Oman Biofuel Challenge Solver AI
              </h2>
              <p className="text-slate-400 text-sm mt-1">Identify and solve scientific bottlenecks in Oman's biofuel research.</p>
            </div>
            
            <form onSubmit={handleSolve} className="p-8">
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest w-full mb-1">Try an Example:</span>
                {[
                  "Algae salinity tolerance",
                  "Date seed oil extraction",
                  "Bio-hydrogen storage",
                  "Solar-thermal pyrolysis"
                ].map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setTopic(ex)}
                    className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-[10px] font-bold text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-all"
                  >
                    {ex}
                  </button>
                ))}
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <input 
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Algae cultivation in high salinity, Date seed oil extraction efficiency..."
                  className="flex-grow px-6 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-blue-500 outline-none transition placeholder:text-slate-500"
                />
                <button 
                  disabled={isLoading || !topic.trim()}
                  className={`px-8 py-4 rounded-xl font-bold text-white flex items-center justify-center space-x-2 transition-all shadow-lg ${
                    isLoading ? 'bg-slate-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 active:scale-95'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>Solving...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-lightbulb"></i>
                      <span>Generate Solution</span>
                    </>
                  )}
                </button>
              </div>
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
                className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12"
              >
                {/* Result display code remains the same */}
                <div className="lg:col-span-2 space-y-8">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
                  >
                    <div className="bg-slate-900 px-8 py-4">
                      <h3 className="text-white font-bold text-sm uppercase tracking-widest flex items-center">
                        <i className="fas fa-triangle-exclamation mr-3 text-amber-400"></i>
                        Identified Challenge
                      </h3>
                    </div>
                    <div className="p-8">
                      <p className="text-slate-700 leading-relaxed font-medium">{result.IdentifiedChallenge}</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
                  >
                    <div className="bg-blue-600 px-8 py-4">
                      <h3 className="text-white font-bold text-sm uppercase tracking-widest flex items-center">
                        <i className="fas fa-flask mr-3 text-blue-100"></i>
                        Scientific Hypothesis
                      </h3>
                    </div>
                    <div className="p-8">
                      <p className="text-slate-700 leading-relaxed font-medium italic">"{result.ScientificHypothesis}"</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
                  >
                    <div className="bg-emerald-600 px-8 py-4">
                      <h3 className="text-white font-bold text-sm uppercase tracking-widest flex items-center">
                        <i className="fas fa-vial mr-3 text-emerald-100"></i>
                        Experimental Design
                      </h3>
                    </div>
                    <div className="p-8 space-y-6">
                      <div>
                        <h4 className="text-lg font-black text-slate-900 mb-2">{result.ExperimentalDesign.Title}</h4>
                        <p className="text-xs text-slate-500 italic mb-4">{result.ExperimentalDesign.FeasibilityNote}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Key Variables</h5>
                          <ul className="space-y-2">
                            {result.ExperimentalDesign.Variables.map((v, i) => (
                              <li key={i} className="text-sm text-slate-700 flex items-start">
                                <i className="fas fa-check text-emerald-500 mr-2 mt-1 shrink-0"></i>
                                {v}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-3">
                          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Control Conditions</h5>
                          <ul className="space-y-2">
                            {result.ExperimentalDesign.ControlConditions.map((c, i) => (
                              <li key={i} className="text-sm text-slate-700 flex items-start">
                                <i className="fas fa-sliders text-blue-500 mr-2 mt-1 shrink-0"></i>
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-slate-100">
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Expected Outcomes</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {result.ExperimentalDesign.ExpectedOutcomes.map((o, i) => (
                            <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 font-medium">
                              {o}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="space-y-8">
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-slate-900 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <i className="fas fa-industry text-8xl"></i>
                    </div>
                    <h3 className="text-lg font-black mb-4 flex items-center relative z-10">
                      <i className="fas fa-link mr-3 text-blue-400"></i>
                      Industrial Relevance
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed relative z-10">{result.IndustrialRelevance}</p>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
                  >
                    <div className="bg-slate-100 px-8 py-4 border-b border-slate-200">
                      <h3 className="text-slate-900 font-bold text-sm uppercase tracking-widest flex items-center">
                        <i className="fas fa-chart-pie mr-3 text-blue-600"></i>
                        Impact Evaluation
                      </h3>
                    </div>
                    <div className="p-8 space-y-6">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Environmental</p>
                        <p className="text-xs text-slate-600 leading-relaxed">{result.ExpectedImpact.Environmental}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Economic</p>
                        <p className="text-xs text-slate-600 leading-relaxed">{result.ExpectedImpact.Economic}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Strategic (Oman Vision 2040)</p>
                        <p className="text-xs text-slate-600 leading-relaxed">{result.ExpectedImpact.Strategic}</p>
                      </div>
                      <div className="pt-4 border-t border-slate-100">
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Scalability Potential</p>
                        <p className="text-sm font-black text-slate-800">{result.ExpectedImpact.Scalability}</p>
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
            <h3 className="text-white font-bold text-lg">Challenge History</h3>
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
                <p className="text-slate-400 font-medium">No history found. Generate your first solution!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((entry) => (
                  <div 
                    key={entry.id}
                    onClick={() => handleSelectFromHistory(entry)}
                    className="p-6 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition cursor-pointer group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition">{entry.topic}</h4>
                        <p className="text-xs text-slate-400 mt-1">{entry.timestamp}</p>
                      </div>
                      <i className="fas fa-chevron-right text-slate-300 group-hover:text-blue-400 transition"></i>
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
