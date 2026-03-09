
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { suggestProject } from './geminiService';
import { SuggestedProject } from './types';

export const GlobalStandards: React.FC = () => {
  const [suggestion, setSuggestion] = React.useState<SuggestedProject | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSuggest = async () => {
    setLoading(true);
    try {
      const proj = await suggestProject("Global Standards Compliance (Biofuels & Hydrogen)");
      setSuggestion(proj);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const standards = [
    {
      title: 'ISO 14040 / 14044',
      subtitle: 'Life Cycle Assessment (LCA)',
      desc: 'The definitive framework for assessing environmental impacts across a product’s entire life cycle—from feedstock collection through to final combustion.',
      why: 'Required to validate decarbonization claims and secure carbon intensity (CI) scores for premium markets.',
      applies: 'Industrial-scale biofuel, hydrogen, and carbon capture pathways.'
    },
    {
      title: 'ISO 14067',
      subtitle: 'Carbon Footprint of Products',
      desc: 'Specifies principles and guidelines for the quantification and reporting of the carbon footprint of a product (CFP).',
      why: 'Essential for international climate reporting, carbon taxing compliance, and trade in carbon-offset markets.',
      applies: 'Export-oriented fuels and products with verified low-carbon intensity.'
    },
    {
      title: 'EU RED II / RED III',
      subtitle: 'Renewable Energy Directive',
      desc: 'European Union legislation setting sustainability and GHG emissions saving criteria for biofuels, bioliquids, and biomass fuels.',
      why: 'Crucial for any Oman-based producer targeting European marine or aviation sectors.',
      applies: 'Sustainable Aviation Fuel (SAF), Bio-Methanol, and Green Hydrogen derivatives.'
    },
    {
      title: 'ASTM International',
      subtitle: 'Fuel Performance & Quality',
      desc: 'Standard specifications (e.g., ASTM D6751 for Biodiesel) ensuring chemical consistency, engine safety, and hardware compatibility.',
      why: 'Ensures that alternative fuels can be safely blended or used as "drop-in" replacements in existing engines.',
      applies: 'Biodiesel, Renewable Diesel, and Synthetic Fuels.'
    },
    {
      title: 'ICAO CORSIA',
      subtitle: 'Sustainable Aviation Fuel (SAF)',
      desc: 'The Carbon Offsetting and Reduction Scheme for International Aviation, defining acceptable SAF pathways and sustainability proofs.',
      why: 'Positions Oman’s airports as sustainable international hubs for next-gen refueling.',
      applies: 'Advanced Algal Jet Fuel and HEFA pathways.'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-20"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center md:text-left"
      >
        <h2 className="text-3xl font-black text-slate-900 mb-2">International Standards & Compliance</h2>
        <p className="text-slate-500 max-w-2xl">Education and strategy alignment for projects targeting global export markets and rigorous environmental benchmarks.</p>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSuggest}
          disabled={loading}
          className="mt-6 px-6 py-3 bg-slate-900 hover:bg-emerald-600 text-white font-bold rounded-xl transition shadow-lg flex items-center space-x-2 disabled:opacity-50 mx-auto md:mx-0"
        >
          {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}
          <span>Suggest Standards-Compliant Project</span>
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {suggestion && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-emerald-900 text-white rounded-2xl p-8 shadow-xl border-2 border-emerald-400/20"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold flex items-center">
                <i className="fas fa-lightbulb text-emerald-400 mr-3"></i> Strategic Recommendation
              </h3>
              <button onClick={() => setSuggestion(null)} className="text-emerald-400 hover:text-white transition">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Project Name</p>
                  <p className="text-lg font-bold">{suggestion.ProjectName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Feedstock Strategy</p>
                  <p className="text-sm">{suggestion.Feedstock}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Compliance Justification</p>
                  <p className="text-xs text-emerald-100 leading-relaxed italic">{suggestion.StrategicJustification}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Standard Technology</p>
                  <p className="text-sm">{suggestion.Technology}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Indicative Scale</p>
                  <p className="text-sm">{suggestion.EstimatedScale}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {standards.map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-800 group-hover:text-emerald-600 transition-colors">{s.title}</h3>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{s.subtitle}</p>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg text-slate-300 group-hover:text-emerald-400 transition-colors">
                <i className="fas fa-shield-check"></i>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">{s.desc}</p>
            <div className="space-y-4 pt-4 border-t border-slate-50">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Criticality</p>
                <p className="text-xs text-slate-700 font-medium">{s.why}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Applicable Sectors</p>
                <p className="text-xs text-slate-700 font-medium">{s.applies}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
