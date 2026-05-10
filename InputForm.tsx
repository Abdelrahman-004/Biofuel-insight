
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
    advancedParams?: Record<string, string | number>;
    language: string;
    projectScale: string;
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
  const [projectScale, setProjectScale] = React.useState<'Small' | 'Medium' | 'Large'>('Medium');
  const [production, setProduction] = React.useState<string | number>(1500);
  const [capacity, setCapacity] = React.useState<string | number>(1000);
  const [budget, setBudget] = React.useState<string | number>(15000000);
  const [sellingPrice, setSellingPrice] = React.useState<string | number>(1200);
  const [electricityCost, setElectricityCost] = React.useState<string | number>(0.05);
  const [laborCost, setLaborCost] = React.useState<string | number>(500000);
  const [co2Source, setCo2Source] = React.useState(CO2_SOURCES[0]);
  const [advancedParams, setAdvancedParams] = React.useState<Record<string, string | number>>({});

  // Load initialInputs if provided
  React.useEffect(() => {
    if (initialInputs) {
      if (initialInputs.projectName) setProjectName(initialInputs.projectName);
      if (initialInputs.location) setLocation(initialInputs.location);
      if (initialInputs.category) setCategory(initialInputs.category);
      if (initialInputs.feedstock) setFeedstock(initialInputs.feedstock);
      if (initialInputs.production) setProduction(initialInputs.production);
      if (initialInputs.capacity) setCapacity(initialInputs.capacity);
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
        if (draft.projectScale) setProjectScale(draft.projectScale);
        if (draft.production) setProduction(draft.production);
        if (draft.capacity) setCapacity(draft.capacity);
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
      projectName, location, category, feedstock, projectScale,
      production, capacity, budget, sellingPrice, electricityCost, laborCost, co2Source, advancedParams
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [projectName, location, category, feedstock, projectScale, production, capacity, budget, sellingPrice, electricityCost, laborCost, co2Source, advancedParams]);

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
      projectScale,
      production: Number(production),
      capacity: category === 'Renewable Energy' ? Number(capacity) : undefined,
      budget: Number(budget),
      sellingPrice: Number(sellingPrice),
      electricityCost: Number(electricityCost),
      laborCost: category === 'Biofuel' ? Number(laborCost) : undefined,
      co2Source: category === 'Biofuel' ? co2Source : undefined,
      advancedParams,
      language: localLanguage
    });
  };

  const inputClasses = "w-full px-4 py-2 rounded-lg border border-[var(--border-glow)] bg-[var(--bg-main)] text-[var(--text-primary)] focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition placeholder:text-[var(--text-secondary)]";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--card-bg)] shadow-card  rounded-2xl  border border-[var(--border-glow)] hover:border-#10B981 transition-all duration-300 overflow-hidden"
    >
      <div className="bg-[#10B981]/10 px-6 py-4 border-b border-[var(--border-glow)] flex justify-between items-center">
        <h2 className="text-[#10B981] font-bold flex items-center text-lg drop-shadow-md">
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
            className="px-3 py-1.5 bg-[var(--bg-main)] border border-[var(--border-glow)] rounded-lg text-[10px] font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#10B981] hover:shadow-md transition-all"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-2 tracking-[0.2em]">{isArabic ? 'حجم الاستثمار' : 'Project Scale'}</label>
            <select 
              value={projectScale}
              onChange={(e) => setProjectScale(e.target.value as 'Small' | 'Medium' | 'Large')}
              className={inputClasses}
              dir={isArabic ? "rtl" : "ltr"}
            >
              <option value="Small" className="bg-[var(--card-bg)] text-[var(--text-primary)]">{isArabic ? 'صغير / تجريبي (للمؤسسات الصغيرة)' : 'Small / Pilot (SMEs)'}</option>
              <option value="Medium" className="bg-[var(--card-bg)] text-[var(--text-primary)]">{isArabic ? 'متوسط / تجاري' : 'Medium / Commercial'}</option>
              <option value="Large" className="bg-[var(--card-bg)] text-[var(--text-primary)]">{isArabic ? 'كبير / ضخم (شركات كبرى)' : 'Large / Mega Project'}</option>
            </select>
          </motion.div>
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


        {/* Advanced Parameters */}
        <motion.div className="bg-[#10B981]/5 border border-[var(--border-glow)] rounded-xl p-6">
          <h3 className="text-[#10B981] font-bold text-sm mb-4 flex items-center">
            <i className="fas fa-microchip mr-2"></i>
            {isArabic ? 'معايير فنية متقدمة للتحقق الدقيق (اختياري)' : 'Advanced Techno-Economic Parameters (Optional)'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Global Financial Parameters */}
            <div>
              <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'نسبة الخصم / الفائدةالسنوية (%)' : 'Discount Rate / Cost of Capital (%)'}</label>
              <input type="number" step="0.1" className={inputClasses} placeholder="8" 
                onChange={e => setAdvancedParams({...advancedParams, 'Discount Rate (%)': e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'عمر المشروع (سنوات)' : 'Project Lifespan (Years)'}</label>
              <input type="number" step="1" className={inputClasses} placeholder="20" 
                onChange={e => setAdvancedParams({...advancedParams, 'Project Lifespan (Years)': e.target.value})} />
            </div>

            {/* Solar PV */}
            {(feedstock.includes('Solar') || feedstock.includes('شمسية')) && (
              <>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'كفاءة الألواح (%)' : 'Panel Efficiency (%)'}</label>
                  <input type="number" step="0.1" className={inputClasses} placeholder="21" 
                    onChange={e => setAdvancedParams({...advancedParams, 'Panel Efficiency (%)': e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'معامل الأداء (PR %)' : 'Performance Ratio (PR %)'}</label>
                  <input type="number" step="0.1" className={inputClasses} placeholder="75" 
                    onChange={e => setAdvancedParams({...advancedParams, 'Performance Ratio (%)': e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'معدل التدهور السنوي للألواح (%)' : 'Annual Degradation Rate (%)'}</label>
                  <input type="number" step="0.01" className={inputClasses} placeholder="0.5" 
                    onChange={e => setAdvancedParams({...advancedParams, 'Annual Degradation Rate (%)': e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'الإشعاع الشمسي (kWh/m2/day)' : 'Daily Irradiance (kWh/m2/day)'}</label>
                  <input type="number" step="0.1" className={inputClasses} placeholder="5.5" 
                    onChange={e => setAdvancedParams({...advancedParams, 'Daily Irradiance (kWh/m2/day)': e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'تكلفة الصيانة السنوية (دولار/kW)' : 'O&M Cost (USD/kW/year)'}</label>
                  <input type="number" step="0.1" className={inputClasses} placeholder="15" 
                    onChange={e => setAdvancedParams({...advancedParams, 'O&M Cost (USD/kW/year)': e.target.value})} />
                </div>
              </>
            )}

            {/* Wind */}
            {(feedstock.includes('Wind') || feedstock.includes('رياح')) && (
              <>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'متوسط سرعة الرياح (m/s)' : 'Average Wind Speed (m/s)'}</label>
                  <input type="number" step="0.1" className={inputClasses} placeholder="6.5" 
                    onChange={e => setAdvancedParams({...advancedParams, 'Average Wind Speed (m/s)': e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'معامل سعة التوربين (%)' : 'Capacity Factor (%)'}</label>
                  <input type="number" step="0.1" className={inputClasses} placeholder="35" 
                    onChange={e => setAdvancedParams({...advancedParams, 'Capacity Factor (%)': e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'تكلفة الصيانة والمشتريات (USD/kW/yr)' : 'O&M Cost (USD/kW/yr)'}</label>
                  <input type="number" step="0.1" className={inputClasses} placeholder="42" 
                    onChange={e => setAdvancedParams({...advancedParams, 'O&M Cost (USD/kW/yr)': e.target.value})} />
                </div>
              </>
            )}

            {/* Green Hydrogen */}
            {(feedstock.includes('Hydrogen') || feedstock.includes('هيدروجين')) && (
              <>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'كفاءة المحلل الكهربائي (%)' : 'Electrolyzer Efficiency (%)'}</label>
                  <input type="number" step="0.1" className={inputClasses} placeholder="65" 
                    onChange={e => setAdvancedParams({...advancedParams, 'Electrolyzer Efficiency (%)': e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'ساعات التشغيل الجاهزة (ساعة/سنة)' : 'Operating Hours (hrs/yr)'}</label>
                  <input type="number" step="1" className={inputClasses} placeholder="4000" 
                    onChange={e => setAdvancedParams({...advancedParams, 'Operating Hours (hrs/yr)': e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'استهلاك المياه (لتر/كجم H2)' : 'Water Consumption (L/kg H2)'}</label>
                  <input type="number" step="0.1" className={inputClasses} placeholder="9" 
                    onChange={e => setAdvancedParams({...advancedParams, 'Water Consumption (L/kg H2)': e.target.value})} />
                </div>
              </>
            )}

            {/* Algae */}
            {(feedstock.includes('Algae') || feedstock.includes('طحالب')) && (
              <>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'محتوى الدهون/الزيت (%)' : 'Lipid Content (%)'}</label>
                  <input type="number" step="0.1" className={inputClasses} placeholder="35" 
                    onChange={e => setAdvancedParams({...advancedParams, 'Lipid Content (%)': e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'معدل نمو الكتلة الحيوية (kg/m2/day)' : 'Biomass Growth Rate (kg/m2/day)'}</label>
                  <input type="number" step="0.01" className={inputClasses} placeholder="0.025" 
                    onChange={e => setAdvancedParams({...advancedParams, 'Biomass Growth (kg/m2/day)': e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'تكلفة الحصاد والتجفيف (USD/ton)' : 'Harvest & Drying Cost (USD/ton)'}</label>
                  <input type="number" step="1" className={inputClasses} placeholder="150" 
                    onChange={e => setAdvancedParams({...advancedParams, 'Harvesting Cost (USD/ton)': e.target.value})} />
                </div>
              </>
            )}

            {/* Used Cooking Oil (UCO) */}
            {(feedstock.includes('Used') || feedstock.includes('Cooking') || feedstock.includes('مستعمل') || feedstock.includes('UCO')) && (
              <>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'نسبة الأحماض الدهنية الحرة (FFA %)' : 'Free Fatty Acid (FFA %)'}</label>
                  <input type="number" step="0.1" className={inputClasses} placeholder="5" 
                    onChange={e => setAdvancedParams({...advancedParams, 'FFA (%)': e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'تكلفة جمع الزيت (USD/ton)' : 'UCO Collection Cost (USD/ton)'}</label>
                  <input type="number" step="1" className={inputClasses} placeholder="600" 
                    onChange={e => setAdvancedParams({...advancedParams, 'UCO Collection Cost (USD/ton)': e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'كفاءة التحويل/الأسترة (%)' : 'Esterification Conversion (%)'}</label>
                  <input type="number" step="0.1" className={inputClasses} placeholder="95" 
                    onChange={e => setAdvancedParams({...advancedParams, 'Conversion Efficiency (%)': e.target.value})} />
                </div>
              </>
            )}

            {/* Date Seeds */}
            {(feedstock.includes('Date') || feedstock.includes('نوى') || feedstock.includes('تمر')) && (
              <>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'معدل استخراج الزيت العضوي (%)' : 'Seed Oil Content (%)'}</label>
                  <input type="number" step="0.1" className={inputClasses} placeholder="8" 
                    onChange={e => setAdvancedParams({...advancedParams, 'Seed Oil Content (%)': e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'تكلفة استخلاص الزيت (USD/ton)' : 'Extraction Cost (USD/ton)'}</label>
                  <input type="number" step="1" className={inputClasses} placeholder="85" 
                    onChange={e => setAdvancedParams({...advancedParams, 'Extraction Cost (USD/ton)': e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'قيمة المنتج الجانبي (العلف الحيواني) (USD/ton)' : 'Co-product (Feed) Value (USD/ton)'}</label>
                  <input type="number" step="1" className={inputClasses} placeholder="120" 
                    onChange={e => setAdvancedParams({...advancedParams, 'Co-product Feed Value (USD/ton)': e.target.value})} />
                </div>
              </>
            )}

            {/* Generic Biofuels Base Cost */}
            {category === 'Biofuel' && !feedstock.includes('Algae') && !feedstock.includes('طحالب') && !feedstock.includes('Used') && !feedstock.includes('Cooking') && !feedstock.includes('مستعمل') && !feedstock.includes('Date') && !feedstock.includes('نوى') && !feedstock.includes('تمر') && (
              <>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'كفاءة الاستخراج (%)' : 'Extraction Efficiency (%)'}</label>
                  <input type="number" step="0.1" className={inputClasses} placeholder="20" 
                    onChange={e => setAdvancedParams({...advancedParams, 'Extraction Efficiency (%)': e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'تكلفة استهلاك المياه (دولار/m3)' : 'Water Cost (USD/m3)'}</label>
                  <input type="number" step="0.1" className={inputClasses} placeholder="0.5" 
                    onChange={e => setAdvancedParams({...advancedParams, 'Water Cost (USD/m3)': e.target.value})} />
                </div>
              </>
            )}
           </div>
        </motion.div>

        <div className={`grid grid-cols-1 ${category === 'Renewable Energy' ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
          {category === 'Renewable Energy' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-2 tracking-[0.2em]">
                {isArabic ? 'قدرة المحطة' : 'Installed Capacity'} (kW)
              </label>
              <input 
                type="number" 
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className={inputClasses}
                placeholder={isArabic ? "مثال: 1000" : "e.g., 1000"}
              />
            </motion.div>
          )}
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
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-2 tracking-[0.2em]">
              {isArabic ? 'سعر البيع/التعريفة' : 'Selling Price / Tariff'} (USD/{category === 'Biofuel' ? (isArabic ? 'طن' : 'ton') : 'MWh'})
            </label>
            <input 
              type="number" step="0.01"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              className={inputClasses}
            />
          </motion.div>
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
          {category === 'Biofuel' ? (
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
          ) : (
            <div className="hidden md:block"></div>
          )}
        </div>

        <motion.button 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
          className={`w-full py-5 rounded-lg font-black text-[var(--text-primary)] flex items-center justify-center space-x-3 transition-all  uppercase tracking-widest text-xs ${
            isLoading ? 'bg-[var(--bg-main)] cursor-not-allowed text-[var(--text-secondary)]' : 'bg-gradient-to-r from-[#059669] to-[#10B981] hover:shadow-md'
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
