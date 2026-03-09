
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { suggestProject } from './geminiService';
import { SuggestedProject } from './types';

export const OmanFreeZones: React.FC = () => {
  const [suggestion, setSuggestion] = React.useState<SuggestedProject | null>(null);
  const [loading, setLoading] = React.useState<string | null>(null);

  const handleSuggest = async (zone: string) => {
    setLoading(zone);
    try {
      const proj = await suggestProject(`${zone} in Oman`);
      setSuggestion(proj);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  const zones = [
    {
      name: 'Sohar Free Zone',
      desc: 'A global logistics hub and industrial gateway, uniquely positioned for heavy industrial integration and port access.',
      advantages: ['Direct Deep-Sea Port Access', 'Heavy Industrial Synergies', 'Industrial CO2 Availability', 'Global Export Infrastructure'],
      bestSuited: ['Algae-based Biofuels', 'Waste-to-Energy', 'Carbon Capture Utilization', 'Hydrogen Pilot Projects'],
      note: 'Ideal for industrial integration and maritime-based energy transition pilot projects.'
    },
    {
      name: 'Duqm (SEZAD)',
      desc: 'One of the world’s largest economic zones, specifically designated as a future green hydrogen and synthetic fuel hub.',
      advantages: ['Mega-Scale Land Availability', 'Hybrid Wind & Solar Resources', 'Deep-Water Liquid Jetty', 'Strategic Geo-Location'],
      bestSuited: ['Green Hydrogen Production', 'Bio-Methanol Exports', 'Synthetic E-Fuels', 'Mega-Scale Bio-Refineries'],
      note: 'Best suited for long-term commercial-scale renewable energy and export mega-projects.'
    },
    {
      name: 'Salalah Free Zone',
      desc: 'Strategically located on the world’s fastest shipping routes, with strong connections to agricultural hinterlands.',
      advantages: ['Proximity to Global Shipping', 'Agricultural Waste Networks', 'High Logistics Efficiency', 'Established Port Infrastructure'],
      bestSuited: ['Waste Cooking Oil Biodiesel', 'Organic Waste Biogas', 'Circular Economy Plants', 'Regional Biofuel Logistics'],
      note: 'Excellent for waste-based feedstock collection and regional distribution strategies.'
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
        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
      >
        <h2 className="text-3xl font-black text-slate-900 mb-2">Oman Free Zones Strategic Intelligence</h2>
        <p className="text-slate-500 max-w-2xl">Leverage the unique strengths of Oman’s economic hubs to optimize your industrial energy projects for Vision 2040.</p>
      </motion.div>

      <AnimatePresence>
        {suggestion && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-900 text-white rounded-2xl p-8 shadow-2xl"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold flex items-center">
                <i className="fas fa-location-arrow text-emerald-400 mr-3"></i> Zone-Specific Concept
              </h3>
              <button onClick={() => setSuggestion(null)} className="text-slate-400 hover:text-white transition">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Project Identity</p>
                  <p className="text-lg font-bold">{suggestion.ProjectName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Strategic Justification</p>
                  <p className="text-sm text-slate-300 italic leading-relaxed">{suggestion.StrategicJustification}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Feedstock</p>
                  <p className="text-xs">{suggestion.Feedstock}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Technology</p>
                  <p className="text-xs">{suggestion.Technology}</p>
                </div>
                <div className="col-span-2 bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Scale Estimate</p>
                  <p className="text-xs">{suggestion.EstimatedScale}</p>
                </div>
              </div>
            </div>

            {/* Incentive Matcher Section */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-black text-emerald-400 flex items-center uppercase tracking-widest">
                  <i className="fas fa-gift mr-3"></i> Oman Vision 2040 Incentive Matcher
                </h4>
                <span className="text-[10px] font-bold text-slate-400 italic">Smart matching based on project profile</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(suggestion.Incentives || []).map((inc, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * idx }}
                    className="bg-white/5 p-4 rounded-xl border border-emerald-500/20 hover:border-emerald-500/50 transition group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="text-xs font-black text-white group-hover:text-emerald-400 transition">{inc.title}</h5>
                      <i className="fas fa-award text-emerald-500 text-[10px]"></i>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed mb-3">{inc.description}</p>
                    <div className="flex items-center text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                      <i className="fas fa-building-columns mr-1.5"></i>
                      {inc.authority}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center">
                <i className="fas fa-info-circle text-emerald-400 mr-3"></i>
                <p className="text-[10px] text-emerald-100 font-medium">
                  These incentives are estimated based on current Omani Free Zone regulations. Final eligibility requires formal application to the respective authorities.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {zones.map((z, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition"
          >
            <div className="flex flex-col md:flex-row">
              <div className="p-8 md:w-2/3">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-black text-slate-900">{z.name}</h3>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSuggest(z.name)}
                    disabled={!!loading}
                    className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-lg hover:bg-emerald-600 transition disabled:opacity-50"
                  >
                    {loading === z.name ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-bolt mr-2 text-emerald-400"></i>}
                    Suggest Project for {z.name.split(' ')[0]}
                  </motion.button>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">{z.desc}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Zone Advantages</h4>
                    <ul className="space-y-2">
                      {z.advantages.map((adv, idx) => (
                        <li key={idx} className="text-xs text-slate-700 flex items-center">
                          <i className="fas fa-check text-emerald-500 mr-2 text-[10px]"></i> {adv}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Best-Suited Projects</h4>
                    <ul className="space-y-2">
                      {z.bestSuited.map((proj, idx) => (
                        <li key={idx} className="text-xs text-slate-700 flex items-center">
                          <i className="fas fa-star text-amber-500 mr-2 text-[10px]"></i> {proj}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-8 md:w-1/3 flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-100">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Strategic Insight</h4>
                <p className="text-sm text-slate-600 italic font-medium">"{z.note}"</p>
                <div className="mt-6 flex items-center space-x-2 text-emerald-600 font-bold text-xs">
                  <i className="fas fa-arrow-right-long"></i>
                  <span>Align with Vision 2040</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
