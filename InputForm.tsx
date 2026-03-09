
import * as React from 'react';
import { motion } from 'framer-motion';
import { LOCATIONS, BIOFUEL_FEEDSTOCKS, RENEWABLE_ENERGY_TYPES, TECHNOLOGY_CATEGORIES } from './constants';

interface InputFormProps {
  onAnalyze: (inputs: {
    projectName: string;
    location: string;
    category: 'Biofuel' | 'Renewable Energy';
    feedstock: string;
    production: number;
    budget: number;
    sellingPrice: number;
    electricityCost?: number;
    laborCost?: number;
    co2Source?: string;
  }) => void;
  isLoading: boolean;
  initialInputs?: any;
}

const BIOFUEL_SYSTEM_TYPES = ['Open Pond', 'Photobioreactor (PBR)'];
const CO2_SOURCES = ['Industrial waste CO2', 'Purchased CO2', 'Not specified'];

const STORAGE_KEY = 'biofuel_insight_form_draft';

export const InputForm: React.FC<InputFormProps> = ({ onAnalyze, isLoading, initialInputs }) => {
  const [projectName, setProjectName] = React.useState('Green Oman Energy Project');
  const [location, setLocation] = React.useState(LOCATIONS[0]);
  const [category, setCategory] = React.useState<'Biofuel' | 'Renewable Energy'>('Biofuel');
  const [feedstock, setFeedstock] = React.useState(BIOFUEL_FEEDSTOCKS[0]);
  const [production, setProduction] = React.useState(1500);
  const [budget, setBudget] = React.useState(15000000);
  const [sellingPrice, setSellingPrice] = React.useState(1200);
  const [electricityCost, setElectricityCost] = React.useState(0.05);
  const [laborCost, setLaborCost] = React.useState(500000);
  const [co2Source, setCo2Source] = React.useState(CO2_SOURCES[0]);

  // Load initialInputs if provided
  React.useEffect(() => {
    if (initialInputs) {
      if (initialInputs.projectName) setProjectName(initialInputs.projectName);
      if (initialInputs.location) setLocation(initialInputs.location);
      if (initialInputs.category) setCategory(initialInputs.category);
      if (initialInputs.feedstock) setFeedstock(initialInputs.feedstock);
      if (initialInputs.production) setProduction(initialInputs.production);
      if (initialInputs.budget) setBudget(initialInputs.budget);
      if (initialInputs.sellingPrice) setSellingPrice(initialInputs.sellingPrice);
      if (initialInputs.electricityCost) setElectricityCost(initialInputs.electricityCost);
      if (initialInputs.laborCost) setLaborCost(initialInputs.laborCost);
      if (initialInputs.co2Source) setCo2Source(initialInputs.co2Source);
    }
  }, [initialInputs]);

  // Load draft on mount
  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        if (draft.projectName) setProjectName(draft.projectName);
        if (draft.location) setLocation(draft.location);
        if (draft.category) setCategory(draft.category);
        if (draft.feedstock) setFeedstock(draft.feedstock);
        if (draft.production) setProduction(draft.production);
        if (draft.budget) setBudget(draft.budget);
        if (draft.sellingPrice) setSellingPrice(draft.sellingPrice);
        if (draft.electricityCost) setElectricityCost(draft.electricityCost);
        if (draft.laborCost) setLaborCost(draft.laborCost);
        if (draft.co2Source) setCo2Source(draft.co2Source);
      } catch (e) { console.error("Failed to load form draft", e); }
    }
  }, []);

  // Save draft on change
  React.useEffect(() => {
    const draft = {
      projectName, location, category, feedstock,
      production, budget, sellingPrice, electricityCost, laborCost, co2Source
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [projectName, location, category, feedstock, production, budget, sellingPrice, electricityCost, laborCost, co2Source]);

  // Update feedstock when category changes
  React.useEffect(() => {
    if (category === 'Biofuel') {
      setFeedstock(BIOFUEL_FEEDSTOCKS[0]);
    } else {
      setFeedstock(RENEWABLE_ENERGY_TYPES[0]);
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze({
      projectName,
      location,
      category,
      feedstock,
      production,
      budget,
      sellingPrice: category === 'Biofuel' ? sellingPrice : 0,
      electricityCost: category === 'Biofuel' ? electricityCost : undefined,
      laborCost: category === 'Biofuel' ? laborCost : undefined,
      co2Source: category === 'Biofuel' ? co2Source : undefined
    });
  };

  const inputClasses = "w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition placeholder:text-slate-500";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden"
    >
      <div className="bg-emerald-600/10 px-6 py-4 border-b border-slate-800">
        <h2 className="text-white font-bold flex items-center text-lg">
          <i className="fas fa-sliders mr-3 text-emerald-400"></i>
          Investment-Grade Analysis Parameters
        </h2>
      </div>
      <div className="px-6 pt-4 flex flex-wrap gap-2">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest w-full mb-1">Try an Example:</span>
        {[
          { name: "Duqm Algae Bio-Hub", loc: "Duqm", cat: "Biofuel", fs: "Algae", prod: 5000, bud: 25000000 },
          { name: "Salalah Wind Phase 2", loc: "Salalah", cat: "Renewable Energy", fs: "Wind", prod: 150000, bud: 45000000 },
          { name: "Muscat Solar Rooftop", loc: "Muscat", cat: "Renewable Energy", fs: "Solar", prod: 2500, bud: 1200000 }
        ].map((ex, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setProjectName(ex.name);
              setLocation(ex.loc);
              setCategory(ex.cat as any);
              setFeedstock(ex.fs);
              setProduction(ex.prod);
              setBudget(ex.bud);
            }}
            className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-[10px] font-bold text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-all"
          >
            {ex.name}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2"
          >
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-[0.2em]">Project Name</label>
            <input 
              type="text" 
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className={inputClasses}
              placeholder="e.g., Solar Farm Duqm Phase 1"
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-[0.2em]">Strategic Location</label>
            <select 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={inputClasses}
            >
              {LOCATIONS.map(loc => <option key={loc} value={loc} className="bg-slate-800 text-white">{loc}</option>)}
            </select>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-[0.2em]">Technology Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className={inputClasses}
            >
              {TECHNOLOGY_CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-slate-800 text-white">{cat}</option>)}
            </select>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-[0.2em]">
              {category === 'Biofuel' ? 'Primary Feedstock' : 'Energy Type'}
            </label>
            <select 
              value={feedstock}
              onChange={(e) => setFeedstock(e.target.value)}
              className={inputClasses}
            >
              {(category === 'Biofuel' ? BIOFUEL_FEEDSTOCKS : RENEWABLE_ENERGY_TYPES).map(fs => (
                <option key={fs} value={fs} className="bg-slate-800 text-white">{fs}</option>
              ))}
            </select>
          </motion.div>
        </div>

        {category === 'Biofuel' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="grid grid-cols-1 gap-6"
          >
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-[0.2em]">CO2 Source</label>
              <select 
                value={co2Source}
                onChange={(e) => setCo2Source(e.target.value)}
                className={inputClasses}
              >
                {CO2_SOURCES.map(src => <option key={src} value={src} className="bg-slate-800 text-white">{src}</option>)}
              </select>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-[0.2em]">
              Target Production ({category === 'Biofuel' ? 'Tons/Year' : 'MWh/Year'})
            </label>
            <input 
              type="number" 
              value={production || ''}
              onChange={(e) => setProduction(Number(e.target.value))}
              className={inputClasses}
              placeholder="0 (Automatic Estimate)"
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-[0.2em]">Investor Budget (USD)</label>
            <input 
              type="number" 
              value={budget || ''}
              onChange={(e) => setBudget(Number(e.target.value))}
              className={inputClasses}
              placeholder="0 (Automatic Estimate)"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {category === 'Biofuel' ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-[0.2em]">
                Selling Price (USD/ton)
              </label>
              <input 
                type="number" 
                value={sellingPrice || ''}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className={inputClasses}
              />
            </motion.div>
          ) : (
            <div className="hidden md:block"></div>
          )}
          {category === 'Biofuel' && (
            <>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-[0.2em]">Electricity (USD/kWh)</label>
                <input 
                  type="number" step="0.01"
                  value={electricityCost || ''}
                  onChange={(e) => setElectricityCost(Number(e.target.value))}
                  className={inputClasses}
                />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-[0.2em]">Labor Cost/Yr (USD)</label>
                <input 
                  type="number" 
                  value={laborCost || ''}
                  onChange={(e) => setLaborCost(Number(e.target.value))}
                  className={inputClasses}
                />
              </motion.div>
            </>
          )}
        </div>

        <motion.button 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
          className={`w-full py-5 rounded-2xl font-black text-white flex items-center justify-center space-x-3 transition-all shadow-xl uppercase tracking-widest text-xs ${
            isLoading ? 'bg-slate-700 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20'
          }`}
        >
          {isLoading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              <span>Investment Engine Computing...</span>
            </>
          ) : (
            <>
              <i className="fas fa-bolt"></i>
              <span>Initiate Investment-Grade Analysis</span>
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};
