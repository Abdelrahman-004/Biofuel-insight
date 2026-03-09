
import * as React from 'react';

interface ResearchInputFormProps {
  onAnalyze: (inputs: any) => void;
  isLoading: boolean;
  initialInputs?: any;
}

const BIOFUEL_TYPES = ['Bioethanol', 'Biodiesel', 'Biogas', 'Biobutanol'];
const PATHWAYS = ['Biochemical', 'Thermochemical', 'Hybrid'];

const STORAGE_KEY = 'biofuel_insight_research_form_draft';

export const ResearchInputForm: React.FC<ResearchInputFormProps> = ({ onAnalyze, isLoading, initialInputs }) => {
  const [inputs, setInputs] = React.useState({
    biofuelType: BIOFUEL_TYPES[0],
    feedstockType: 'Agricultural Waste (Date Palm)',
    conversionPathway: PATHWAYS[0],
    labYield: '0.45 Liters/kg',
    efficiency: 85,
    trl: 3,
    scale: '10,000 Tons/Year'
  });

  // Load initialInputs if provided
  React.useEffect(() => {
    if (initialInputs) {
      setInputs(prev => ({ ...prev, ...initialInputs }));
    }
  }, [initialInputs]);

  // Load draft on mount
  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        setInputs(prev => ({ ...prev, ...draft }));
      } catch (e) { console.error("Failed to load research form draft", e); }
    }
  }, []);

  // Save draft on change
  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
  }, [inputs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(inputs);
  };

  const inputClasses = "w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition placeholder:text-slate-500";

  return (
    <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">
      <div className="bg-blue-600/10 px-6 py-4 border-b border-slate-800">
        <h2 className="text-white font-bold flex items-center">
          <i className="fas fa-microscope mr-2 text-blue-400"></i>
          Research Parameters (Lab to Pilot-Scale)
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 tracking-wider">Biofuel Type</label>
            <select 
              value={inputs.biofuelType}
              onChange={(e) => setInputs({...inputs, biofuelType: e.target.value})}
              className={inputClasses}
            >
              {BIOFUEL_TYPES.map(t => <option key={t} value={t} className="bg-slate-800 text-white">{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 tracking-wider">Feedstock Type</label>
            <input 
              type="text" 
              value={inputs.feedstockType}
              onChange={(e) => setInputs({...inputs, feedstockType: e.target.value})}
              className={inputClasses}
              placeholder="e.g., Algae, Manure, Food Waste"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 tracking-wider">Conversion Pathway</label>
            <select 
              value={inputs.conversionPathway}
              onChange={(e) => setInputs({...inputs, conversionPathway: e.target.value})}
              className={inputClasses}
            >
              {PATHWAYS.map(p => <option key={p} value={p} className="bg-slate-800 text-white">{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 tracking-wider">Lab Yield (L/kg or m3/ton)</label>
            <input 
              type="text" 
              value={inputs.labYield}
              onChange={(e) => setInputs({...inputs, labYield: e.target.value})}
              className={inputClasses}
              placeholder="e.g., 0.5 L/kg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 tracking-wider">Efficiency (%)</label>
            <input 
              type="number" 
              value={inputs.efficiency}
              onChange={(e) => setInputs({...inputs, efficiency: Number(e.target.value)})}
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 tracking-wider">TRL (1-9)</label>
            <input 
              type="number" 
              min="1" max="9"
              value={inputs.trl}
              onChange={(e) => setInputs({...inputs, trl: Number(e.target.value)})}
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 tracking-wider">Target Pilot Scale</label>
            <input 
              type="text" 
              value={inputs.scale}
              onChange={(e) => setInputs({...inputs, scale: e.target.value})}
              className={inputClasses}
              placeholder="e.g., 500 Liters/Day"
            />
          </div>
        </div>

        <button 
          disabled={isLoading}
          className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center space-x-2 transition-all shadow-lg ${
            isLoading ? 'bg-slate-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 active:scale-95'
          }`}
        >
          {isLoading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              <span>Scientific Engine Computing...</span>
            </>
          ) : (
            <>
              <i className="fas fa-microscope"></i>
              <span>Analyze Research Implementation</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
