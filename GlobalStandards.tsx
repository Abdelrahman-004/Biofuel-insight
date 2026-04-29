
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { suggestProject } from './geminiService';
import { SuggestedProject } from './types';

export const GlobalStandards: React.FC<{ language?: string }> = ({ language = 'English' }) => {
  const [suggestion, setSuggestion] = React.useState<SuggestedProject | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSuggest = async () => {
    setLoading(true);
    try {
      const proj = await suggestProject("Global Standards Compliance (Biofuels & Hydrogen)", language);
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
        className="bg-[var(--card-bg)] shadow-card backdrop-blur-[10px] shadow-card border-[var(--border-glow)] hover:border-[var(--accent-emerald)]/50 rounded-2xl shadow-sm border border-[var(--border-glow)] p-8 text-center md:text-left"
      >
        <h2 className="text-3xl font-black text-[var(--text-primary)] mb-2">International Standards & Compliance</h2>
        <p className="text-[var(--text-secondary)] max-w-2xl">Education and strategy alignment for projects targeting global export markets and rigorous environmental benchmarks.</p>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSuggest}
          disabled={loading}
          className="mt-6 px-6 py-3 bg-[var(--card-bg)] shadow-card hover:bg-emerald-600 text-white font-bold rounded-xl transition shadow-card flex items-center space-x-2 disabled:opacity-50 mx-auto md:mx-0"
        >
          {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}
          <span>{language === 'Arabic' ? "اقتراح مشروع متوافق مع المعايير" : "Suggest Standards-Compliant Project"}</span>
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {suggestion && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[var(--card-bg)] text-[var(--text-primary)] rounded-2xl border border-[var(--border-glow)] p-8 shadow-card border-2 border-emerald-400/20"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold flex items-center">
                <i className="fas fa-lightbulb text-[var(--accent-emerald)] dark:text-emerald-400 mr-3"></i> Strategic Recommendation
              </h3>
              <button onClick={() => setSuggestion(null)} className="text-[var(--accent-emerald)] dark:text-emerald-400 hover:text-[var(--text-primary)] transition">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-[var(--accent-emerald)] dark:text-emerald-400 uppercase tracking-widest">{language === 'Arabic' ? "اسم المشروع" : "Project Name"}</p>
                  <p className="text-lg font-bold">{suggestion.ProjectName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[var(--accent-emerald)] dark:text-emerald-400 uppercase tracking-widest">{language === 'Arabic' ? "استراتيجية المواد الخام" : "Feedstock Strategy"}</p>
                  <p className="text-sm">{suggestion.Feedstock}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[var(--accent-emerald)] dark:text-emerald-400 uppercase tracking-widest">{language === 'Arabic' ? "مبرر الامتثال" : "Compliance Justification"}</p>
                  <p className="text-xs text-emerald-100 leading-relaxed italic">{suggestion.StrategicJustification}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-[var(--card-bg)] shadow-card backdrop-blur-[10px] shadow-card border-[var(--border-glow)] hover:border-[var(--accent-emerald)]/50/5 p-4 rounded-xl border border-[var(--border-glow)]">
                  <p className="text-[10px] font-bold text-[var(--accent-emerald)] dark:text-emerald-400 uppercase tracking-widest mb-1">{language === 'Arabic' ? "التكنولوجيا القياسية" : "Standard Technology"}</p>
                  <p className="text-sm">{suggestion.Technology}</p>
                </div>
                <div className="bg-[var(--card-bg)] shadow-card backdrop-blur-[10px] shadow-card border-[var(--border-glow)] hover:border-[var(--accent-emerald)]/50/5 p-4 rounded-xl border border-[var(--border-glow)]">
                  <p className="text-[10px] font-bold text-[var(--accent-emerald)] dark:text-emerald-400 uppercase tracking-widest mb-1">{language === 'Arabic' ? "النطاق الإرشادي" : "Indicative Scale"}</p>
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
            className="bg-[var(--card-bg)] shadow-card backdrop-blur-[10px] p-6 rounded-2xl shadow-card border border-[var(--border-glow)] hover:border-[var(--accent-emerald)] hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-black text-[var(--text-primary)] group-hover:text-emerald-600 transition-colors">{s.title}</h3>
                <p className="text-[10px] font-bold text-[var(--accent-emerald)] uppercase tracking-widest">{s.subtitle}</p>
              </div>
              <div className="bg-[var(--bg-main)] p-2 rounded-lg text-[var(--text-secondary)] group-hover:text-[var(--accent-emerald)] dark:text-emerald-400 transition-colors">
                <i className="fas fa-shield-check"></i>
              </div>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">{s.desc}</p>
            <div className="space-y-4 pt-4 border-t border-slate-50">
              <div>
                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{language === 'Arabic' ? "الأهمية" : "Criticality"}</p>
                <p className="text-xs text-[var(--text-secondary)] font-medium">{s.why}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{language === 'Arabic' ? "القطاعات القابلة للتطبيق" : "Applicable Sectors"}</p>
                <p className="text-xs text-[var(--text-secondary)] font-medium">{s.applies}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
