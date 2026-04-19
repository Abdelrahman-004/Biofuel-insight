
import * as React from 'react';

interface ResearchInputFormProps {
  onAnalyze: (inputs: any) => void;
  isLoading: boolean;
  initialInputs?: any;
  language?: 'English' | 'Arabic';
}

const BIOFUEL_TYPES = ['Bioethanol', 'Biodiesel', 'Biogas', 'Biobutanol', 'Decarbonization'];
const PATHWAYS = ['Biochemical', 'Thermochemical', 'Hybrid'];

const STORAGE_KEY = 'biofuel_insight_research_form_draft';

export const ResearchInputForm: React.FC<ResearchInputFormProps> = ({ onAnalyze, isLoading, initialInputs, language = 'English' }) => {
  const [localLanguage, setLocalLanguage] = React.useState(language || 'Arabic');

  React.useEffect(() => {
    setLocalLanguage(language || 'Arabic');
  }, [language]);

  const isArabic = localLanguage === 'Arabic';
  const [inputs, setInputs] = React.useState({
    biofuelType: BIOFUEL_TYPES[0],
    feedstockType: 'Agricultural Waste (Date Palm)',
    conversionPathway: PATHWAYS[0],
    labYield: '0.45 Liters/kg',
    efficiency: '85',
    trl: '3',
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
    onAnalyze({
      ...inputs,
      efficiency: Number(inputs.efficiency),
      trl: Number(inputs.trl),
      language: localLanguage
    });
  };

  const inputClasses = "w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition placeholder:text-slate-500";

  return (
    <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">
      <div className="bg-blue-600/10 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
        <h2 className="text-white font-bold flex items-center">
          <i className="fas fa-microscope mr-2 text-blue-400"></i>
          {isArabic ? 'معايير البحث (من المختبر إلى النطاق التجريبي)' : 'Research Parameters (Lab to Pilot-Scale)'}
        </h2>
        
        <select 
          value={localLanguage}
          onChange={(e) => setLocalLanguage(e.target.value)}
          className="bg-slate-800 text-sm border border-slate-700 rounded-lg px-3 py-1.5 text-blue-400 outline-none"
        >
          <option value="Arabic">العربية (Arabic)</option>
          <option value="English">English</option>
        </select>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 tracking-wider">{isArabic ? 'نوع الوقود الحيوي' : 'Biofuel Type'}</label>
            <select 
              value={inputs.biofuelType}
              onChange={(e) => setInputs({...inputs, biofuelType: e.target.value})}
              className={inputClasses}
              dir={isArabic ? "rtl" : "ltr"}
            >
              {BIOFUEL_TYPES.map(t => {
                let text = t;
                if (isArabic) {
                  const dict: Record<string, string> = {
                    'Bioethanol': 'الإيثانول الحيوي', 
                    'Biodiesel': 'الديزل الحيوي', 
                    'Biogas': 'الغاز الحيوي', 
                    'Biobutanol': 'البيوتانول الحيوي', 
                    'Decarbonization': 'إزالة الكربون'
                  };
                  text = dict[t] || t;
                }
                return <option key={t} value={t} className="bg-slate-800 text-white">{text}</option>;
              })}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 tracking-wider">{isArabic ? 'نوع المادة الخام' : 'Feedstock Type'}</label>
            <input 
              type="text" 
              value={inputs.feedstockType}
              onChange={(e) => setInputs({...inputs, feedstockType: e.target.value})}
              className={inputClasses}
              placeholder={isArabic ? 'مثال: طحالب، روث، نفايات طعام' : "e.g., Algae, Manure, Food Waste"}
              dir={isArabic ? "rtl" : "ltr"}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 tracking-wider">{isArabic ? 'مسار التحويل' : 'Conversion Pathway'}</label>
            <select 
              value={inputs.conversionPathway}
              onChange={(e) => setInputs({...inputs, conversionPathway: e.target.value})}
              className={inputClasses}
              dir={isArabic ? "rtl" : "ltr"}
            >
              {PATHWAYS.map(p => {
                let text = p;
                if (isArabic) {
                  const dict: Record<string, string> = {
                    'Biochemical': 'كيميائي حيوي', 
                    'Thermochemical': 'كيميائي حراري', 
                    'Hybrid': 'هجين (مختلط)'
                  };
                  text = dict[p] || p;
                }
                return <option key={p} value={p} className="bg-slate-800 text-white">{text}</option>;
              })}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 tracking-wider">{isArabic ? 'عائد المختبر' : 'Lab Yield'} (L/kg or m3/ton)</label>
            <input 
              type="text" 
              value={inputs.labYield}
              onChange={(e) => setInputs({...inputs, labYield: e.target.value})}
              className={inputClasses}
              placeholder={isArabic ? 'مثال: 0.5 لتر/كجم' : "e.g., 0.5 L/kg"}
              dir={isArabic ? "rtl" : "ltr"}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 tracking-wider">{isArabic ? 'الكفاءة' : 'Efficiency'} (%)</label>
            <input 
              type="number" 
              value={inputs.efficiency}
              onChange={(e) => setInputs({...inputs, efficiency: e.target.value})}
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 tracking-wider">{isArabic ? 'مستوى النضج التكنولوجي' : 'TRL'} (1-9)</label>
            <input 
              type="number" 
              min="1" max="9"
              value={inputs.trl}
              onChange={(e) => setInputs({...inputs, trl: e.target.value})}
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 tracking-wider">{isArabic ? 'النطاق التجريبي المستهدف' : 'Target Pilot Scale'}</label>
            <input 
              type="text" 
              value={inputs.scale}
              onChange={(e) => setInputs({...inputs, scale: e.target.value})}
              className={inputClasses}
              placeholder={isArabic ? 'مثال: 500 لتر/يوم' : "e.g., 500 Liters/Day"}
              dir={isArabic ? "rtl" : "ltr"}
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
              <span>{isArabic ? 'المحرك العلمي يعمل...' : 'Scientific Engine Computing...'}</span>
            </>
          ) : (
            <>
              <i className="fas fa-microscope"></i>
              <span>{isArabic ? 'تحليل انتقال البحث العلمي' : 'Analyze Research Implementation'}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
