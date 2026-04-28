
import * as React from 'react';
import { motion } from 'framer-motion';
import { LOCATIONS, BIOFUEL_FEEDSTOCKS, RENEWABLE_ENERGY_TYPES, TECHNOLOGY_CATEGORIES, translateTerm } from './constants';

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
    language: string;
  }) => void;
  isLoading: boolean;
  initialInputs?: any;
  language?: 'English' | 'Arabic';
}

const BIOFUEL_SYSTEM_TYPES = ['Open Pond', 'Photobioreactor (PBR)'];
const CO2_SOURCES = ['Industrial waste CO2', 'Purchased CO2', 'Not specified'];

const STORAGE_KEY = 'biofuel_insight_form_draft';

export const InputForm: React.FC<InputFormProps> = ({ onAnalyze, isLoading, initialInputs, language = 'English' }) => {
  const [localLanguage, setLocalLanguage] = React.useState(language || 'Arabic');

  React.useEffect(() => {
    setLocalLanguage(language || 'Arabic');
  }, [language]);

  const isArabic = localLanguage === 'Arabic';
  const [projectName, setProjectName] = React.useState('Green Oman Energy Project');
  const [location, setLocation] = React.useState(LOCATIONS[0]);
  const [category, setCategory] = React.useState<'Biofuel' | 'Renewable Energy'>('Biofuel');
  const [feedstock, setFeedstock] = React.useState(BIOFUEL_FEEDSTOCKS[0]);
  const [production, setProduction] = React.useState<string | number>(1500);
  const [budget, setBudget] = React.useState<string | number>(15000000);
  const [sellingPrice, setSellingPrice] = React.useState<string | number>(1200);
  const [electricityCost, setElectricityCost] = React.useState<string | number>(0.05);
  const [laborCost, setLaborCost] = React.useState<string | number>(500000);
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
      production: Number(production),
      budget: Number(budget),
      sellingPrice: category === 'Biofuel' ? Number(sellingPrice) : 0,
      electricityCost: category === 'Biofuel' ? Number(electricityCost) : undefined,
      laborCost: category === 'Biofuel' ? Number(laborCost) : undefined,
      co2Source: category === 'Biofuel' ? co2Source : undefined,
      language: localLanguage
    });
  };

  const inputClasses = "w-full px-4 py-2 rounded-lg border border-[var(--border-glow)] bg-[var(--bg-main)] text-[var(--text-primary)] focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition placeholder:text-[var(--text-secondary)]";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--card-bg)]/90 shadow-card backdrop-blur-[10px] rounded-2xl  border border-[var(--border-glow)] hover:border-[#10B981]/50 transition-all duration-300 overflow-hidden"
    >
      <div className="bg-[#10B981]/10 px-6 py-4 border-b border-[var(--border-glow)] flex justify-between items-center">
        <h2 className="text-[#10B981] font-bold flex items-center text-lg drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
          <i className="fas fa-sliders mr-3"></i>
          {isArabic ? 'معايير تحليل الجدوى' : 'Investment-Grade Analysis Parameters'}
        </h2>
      </div>
      <div className="px-6 pt-4 flex flex-wrap gap-2">
        <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest w-full mb-1">{isArabic ? 'جرب مثال:' : 'Try an Example:'}</span>
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
            className="px-3 py-1.5 bg-[var(--bg-main)] border border-[var(--border-glow)] rounded-lg text-[10px] font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#10B981] hover:shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all"
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
            <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-2 tracking-[0.2em]">{isArabic ? 'اسم المشروع' : 'Project Name'}</label>
            <input 
              type="text" 
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className={inputClasses}
              placeholder={isArabic ? "مثال: مزرعة دوقم للطاقة الشمسية" : "e.g., Solar Farm Duqm Phase 1"}
              dir={isArabic ? "rtl" : "ltr"}
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-2 tracking-[0.2em]">{isArabic ? 'الموقع الاستراتيجي' : 'Strategic Location'}</label>
            <select 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={inputClasses}
              dir={isArabic ? "rtl" : "ltr"}
            >
              {LOCATIONS.map(loc => <option key={loc} value={loc} className="bg-[var(--card-bg)] text-[var(--text-primary)]">{isArabic ? translateTerm(loc) : loc}</option>)}
            </select>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-2 tracking-[0.2em]">{isArabic ? 'نوع التكنولوجيا' : 'Technology Category'}</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className={inputClasses}
              dir={isArabic ? "rtl" : "ltr"}
            >
              {TECHNOLOGY_CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-[var(--card-bg)] text-[var(--text-primary)]">{isArabic ? translateTerm(cat) : cat}</option>)}
            </select>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-2 tracking-[0.2em]">
              {category === 'Biofuel' ? (isArabic ? 'المادة الخام الأساسية' : 'Primary Feedstock') : (isArabic ? 'نوع الطاقة' : 'Energy Type')}
            </label>
            <select 
              value={feedstock}
              onChange={(e) => setFeedstock(e.target.value)}
              className={inputClasses}
              dir={isArabic ? "rtl" : "ltr"}
            >
              {(category === 'Biofuel' ? BIOFUEL_FEEDSTOCKS : RENEWABLE_ENERGY_TYPES).map(fs => (
                <option key={fs} value={fs} className="bg-[var(--card-bg)] text-[var(--text-primary)]">{isArabic ? translateTerm(fs) : fs}</option>
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
              <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-2 tracking-[0.2em]">{isArabic ? 'مصدر ثاني أكسيد الكربون' : 'CO2 Source'}</label>
              <select 
                value={co2Source}
                onChange={(e) => setCo2Source(e.target.value)}
                className={inputClasses}
              >
                {CO2_SOURCES.map(src => {
                  let text = src;
                  if (isArabic) {
                    if (src === 'Industrial waste CO2') text = 'غاز ثاني أكسيد الكربون من العوادم الصناعية';
                    if (src === 'Purchased CO2') text = 'شراء غاز ثاني أكسيد الكربون';
                    if (src === 'Not specified') text = 'غير محدد';
                  }
                  return <option key={src} value={src} className="bg-[var(--card-bg)] text-[var(--text-primary)]">{text}</option>;
                })}
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
            <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-2 tracking-[0.2em]">
              {isArabic ? 'الإنتاج المستهدف' : 'Target Production'} ({category === 'Biofuel' ? (isArabic ? 'طن/سنة' : 'Tons/Year') : (isArabic ? 'ميجاوات/سنة' : 'MWh/Year')})
            </label>
            <input 
              type="number" 
              value={production}
              onChange={(e) => setProduction(e.target.value)}
              className={inputClasses}
              placeholder={isArabic ? "0 (تقدير تلقائي)" : "0 (Automatic Estimate)"}
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-2 tracking-[0.2em]">{isArabic ? 'ميزانية المستثمر' : 'Investor Budget'} (USD)</label>
            <input 
              type="number" 
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className={inputClasses}
              placeholder={isArabic ? "0 (تقدير تلقائي)" : "0 (Automatic Estimate)"}
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
              <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-2 tracking-[0.2em]">
                {isArabic ? 'سعر البيع' : 'Selling Price'} (USD/{isArabic ? 'طن' : 'ton'})
              </label>
              <input 
                type="number" 
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
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
                <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-2 tracking-[0.2em]">{isArabic ? 'الكهرباء' : 'Electricity'} (USD/kWh)</label>
                <input 
                  type="number" step="0.01"
                  value={electricityCost}
                  onChange={(e) => setElectricityCost(e.target.value)}
                  className={inputClasses}
                />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-2 tracking-[0.2em]">{isArabic ? 'تكلفة العمالة/سنة' : 'Labor Cost/Yr'} (USD)</label>
                <input 
                  type="number" 
                  value={laborCost}
                  onChange={(e) => setLaborCost(e.target.value)}
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
          className={`w-full py-5 rounded-lg font-black text-[var(--text-primary)] flex items-center justify-center space-x-3 transition-all  uppercase tracking-widest text-xs ${
            isLoading ? 'bg-[var(--bg-main)] cursor-not-allowed text-[var(--text-secondary)]' : 'bg-gradient-to-r from-[#059669] to-[#10B981] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]'
          }`}
        >
          {isLoading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              <span>{isArabic ? 'محرك الاستثمار يعمل...' : 'Investment Engine Computing...'}</span>
            </>
          ) : (
            <>
              <i className="fas fa-bolt"></i>
              <span>{isArabic ? 'بدء تحليل الجدوى' : 'Initiate Investment-Grade Analysis'}</span>
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};
