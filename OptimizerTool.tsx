import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizerResult, OptimizerHistoryEntry } from './types';
import { optimizeProject } from './geminiService';

const autoDict: Record<string, string> = {
  "N/A": "غير متوفر",
  "Years": "سنوات",
  "Tons": "طن",
  "Applied": "مُطبقة",
  "In USD": "بالدولار الأمريكي",
  "Pass": "اجتياز",
  "Needs Revision": "بحاجة لمراجعة",
  "Critical Financial Issue": "مشكلة مالية حرجة",
  "Moderate": "متوسط",
  "Significant": "كبير",
  "Critical": "حرج",
  "Investment Grade": "درجة استثمارية",
  "Conditionally Viable": "مجدي بشروط",
  "Not Bankable": "غير قابل للتمويل",
  "High": "عالي",
  "Low": "منخفض",
  "Scientific & Technical AI Analysis": "تحليل الذكاء الاصطناعي العلمي والتقني",
  "Scientific & Technical Audit": "تحليل وتدقيق علمي وتقني",
  "Identified Challenge:": "التحدي المحدد:",
  "Scientific Hypothesis:": "الفرضية العلمية:",
  "Experimental Design Protocol": "بروتوكول التصميم التجريبي",
  "Variables:": "المتغيرات:",
  "Control Conditions:": "ظروف التحكم:",
  "Expected Outcomes:": "النتائج المتوقعة:",
  "Industrial Relevance & Impact": "الأهمية والأثر الصناعي",
  "Environmental:": "بيئياً:",
  "Economic:": "اقتصادياً:",
  "Strategic:": "استراتيجياً:",
  "Data-Driven Insights": "رؤى مبنية على البيانات",
  "Life Cycle Assessment": "تقييم دورة الحياة",
  "Resource Efficiency": "كفاءة الموارد",
  "Alternative Methods": "طرق بديلة",
  "AI Technical Audit": "التدقيق التقني للذكاء الاصطناعي",
  "Logical Consistency:": "الاتساق المنطقي:",
  "Core Assumptions:": "الافتراضات الأساسية:",
  "Smart Profit & Low-Carbon AI Optimizer": "محسن الذكاء الاصطناعي للربح الذكي وتقليل الكربون",
  "Analyze your biofuel process": "تحليل عملية الوقود الحيوي الخاصة بك",
  "Enter process name...": "أدخل اسم العملية...",
  "Describe the process, feedstock, or challenge...": "صف العملية، أو المواد الخام، أو التحدي...",
  "Generate Optimization Strategy": "توليد استراتيجية التحسين",
  "Profit Optimization Strategies": "استراتيجيات تحسين الربح",
  "Carbon Reduction Pathways": "مسارات تقليل الكربون",
  "Net-Zero Roadmap": "خارطة طريق نحو صافي الانبعاثات الصفري",
  "Carbon Intensity:": "كثافة الكربون:",
  "Standards:": "المعايير:",
  "Fossil Fuel Replacement Plan": "خطة استبدال الوقود الأحفوري",
  "Logistics & Supply Chain Optimization": "تحسين الخدمات اللوجستية وسلسلة التوريد",
  "Research Feasibility Report": "تقرير جدوى البحث",
  "Scientific Summary:": "الملخص العلمي:",
  "Cost Estimation (Oman Calibrated)": "تقدير التكلفة (مُعاير حسب عُمان)",
  "Total Budget Component": "مكون الميزانية الإجمالية",
  "Total Initial Budget:": "الميزانية الأولية الإجمالية:",
  "Cost Assumptions:": "افتراضات التكلفة:",
  "Implementation & Equipment": "التنفيذ والمعدات",
  "Resource Requirements:": "متطلبات الموارد:",
  "Production Output Estimate": "تقدير الإنتاج",
  "Annual Fuel Output:": "إنتاج الوقود السنوي:",
  "Energy Output:": "إنتاج الطاقة:",
  "Technical Risk Assessment": "تقييم المخاطر الفنية",
  "Scientific Challenges:": "التحديات العلمية:",
  "Mitigation Strategies:": "استراتيجيات التخفيف:"
};
const tt = (key: string | undefined, lang: string) => { if(!key) return key; return lang === 'Arabic' ? (autoDict[key] || key) : key; };

interface OptimizerToolProps {
  history: OptimizerHistoryEntry[];
  onSave: (entry: OptimizerHistoryEntry) => void;
  onClear: () => void;
  initialInputs?: { projectName: string; description: string };
  initialResult?: OptimizerResult;
  language?: 'English' | 'Arabic';
}

const DRAFT_KEY = 'biofuel_insight_optimizer_draft';

export const OptimizerTool: React.FC<OptimizerToolProps> = ({ history, onSave, onClear, initialInputs, initialResult, language = 'English' }) => {
  const [localLanguage, setLocalLanguage] = React.useState(language || 'Arabic');

  React.useEffect(() => {
    setLocalLanguage(language || 'Arabic');
  }, [language]);

    const isArabic = language === 'Arabic';
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
      const data = await optimizeProject(projectName, description, localLanguage);
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
        <div className="bg-[var(--card-bg)]/50 shadow-card p-1 rounded-xl border border-[var(--border-glow)] flex space-x-1">
          <button 
            onClick={() => setViewMode('OPTIMIZE')}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              viewMode === 'OPTIMIZE' ? 'bg-emerald-600 text-white shadow-card' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <i className="fas fa-chart-line mr-2"></i> {isArabic ? 'التحسين' : 'Optimize'}
          </button>
          <button 
            onClick={() => setViewMode('HISTORY')}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              viewMode === 'HISTORY' ? 'bg-emerald-600 text-white shadow-card' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <i className="fas fa-history mr-2"></i> {isArabic ? 'السجل' : 'History'} ({history.length})
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
            <div className="bg-[var(--card-bg)]/90 shadow-card backdrop-blur-[10px] rounded-3xl  border border-[var(--border-glow)] hover:border-[#34D399]/50 transition-all duration-300 overflow-hidden">
            <div className="bg-[#34D399]/10 px-8 py-6 border-b border-[var(--border-glow)] flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div>
                <h2 className="text-2xl font-black text-[#34D399] flex items-center tracking-tight drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
                  <i className="fas fa-leaf mr-3"></i>
                  {isArabic ? 'مُحسّن الأرباح وتقليل الكربون' : 'Smart Profit & Low-Carbon Optimizer'}
                </h2>
                <p className="text-[var(--text-secondary)] text-sm mt-1">{isArabic ? 'تقصيد الأرباح وتخفيف الانبعاثات لمشاريعك' : 'Maximize profitability while reaching net-zero milestones.'}</p>
              </div>

              <select 
                value={localLanguage}
                onChange={(e) => setLocalLanguage(e.target.value as 'English' | 'Arabic')}
                className="bg-[var(--card-bg)] shadow-card text-sm border border-[var(--border-glow)] rounded-lg px-3 py-1.5 text-[#34D399] outline-none shadow-sm"
              >
                <option value="Arabic" className="bg-[var(--card-bg)] text-[var(--text-primary)]">العربية (Arabic)</option>
                <option value="English" className="bg-[var(--card-bg)] text-[var(--text-primary)]">English</option>
              </select>
            </div>
            
            <form onSubmit={handleOptimize} className="p-8 space-y-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest w-full mb-1">{isArabic ? 'جرب مثال:' : 'Try an Example:'}</span>
                {[
                  { name: "Algae Biofuel Hub", desc: "Large-scale algae cultivation in Duqm using industrial CO2 and seawater." },
                  { name: "Date Seed Oil Pilot", desc: "Extracting oil from date seeds for biodiesel production in Nizwa." },
                  { name: "Waste Cooking Oil Network", desc: "Collecting and refining used cooking oil from Muscat restaurants." }
                ].map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setProjectName(ex.name);
                      setDescription(ex.desc);
                    }}
                    className="px-3 py-1.5 bg-[var(--bg-main)] border border-[var(--border-glow)] rounded-lg text-[10px] font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#34D399] hover:shadow-[0_0_10px_rgba(52,211,153,0.3)] transition-all"
                  >
                    {ex.name}
                  </button>
                ))}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-[var(--text-secondary)] uppercase tracking-widest mb-2">{isArabic ? 'اسم المشروع' : 'Project Name'}</label>
                  <input 
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder={isArabic ? 'مثال: مزرعة الطحالب العمانية' : "e.g., Algae-to-Biofuel Hub Oman"}
                    className="w-full px-6 py-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-glow)] text-[var(--text-primary)] focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition placeholder:text-[var(--text-secondary)]"
                    dir={isArabic ? 'rtl' : 'ltr'}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-[var(--text-secondary)] uppercase tracking-widest mb-2">{isArabic ? 'وصف المشروع والتفاصيل' : 'Project Description & Goals'}</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={isArabic ? 'صف مشروعك والمواد الخام والأهداف...' : "Describe your project, current feedstock, and target production scale..."}
                    className="w-full px-6 py-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-glow)] text-[var(--text-primary)] focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition min-h-[120px] placeholder:text-[var(--text-secondary)]"
                    dir={isArabic ? 'rtl' : 'ltr'}
                  />
                </div>
              </div>
              <button 
                disabled={isLoading || !projectName.trim() || !description.trim()}
                className={`w-full py-4 rounded-xl font-bold text-[var(--text-primary)] flex items-center justify-center space-x-2 transition-all  ${
                  isLoading ? 'bg-[var(--bg-main)] cursor-not-allowed text-[var(--text-secondary)]' : 'bg-gradient-to-r from-[#059669] to-[#10B981] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-95'
                }`}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>{isArabic ? 'يتم تحسين الاستراتيجية...' : 'Optimizing Strategy...'}</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-rocket"></i>
                    <span>{isArabic ? 'توليد خطة التحسين المالي' : 'Generate Optimization Strategy'}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center">
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
                    className="bg-[var(--card-bg)]/90 shadow-card backdrop-blur-[10px] rounded-3xl  border border-[var(--border-glow)] overflow-hidden"
                  >
                    <div className="bg-emerald-600/20 px-8 py-4 border-b border-[var(--border-glow)]">
                      <h3 className="text-[var(--accent-emerald)] dark:text-emerald-400 font-bold text-sm uppercase tracking-widest flex items-center">
                        <i className="fas fa-money-bill-trend-up mr-3 text-[var(--accent-emerald)] dark:text-emerald-400"></i>
                        Profit Opportunities
                      </h3>
                    </div>
                    <div className="p-8">
                      <ul className="space-y-4">
                        {result.ProfitOpportunities.map((item, i) => (
                          <li key={i} className="flex items-start text-[var(--text-secondary)]">
                            <i className="fas fa-circle-check text-[var(--accent-emerald)] mr-3 mt-1 shrink-0"></i>
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
                    className="bg-[var(--card-bg)]/90 shadow-card backdrop-blur-[10px] rounded-3xl  border border-[var(--border-glow)] overflow-hidden"
                  >
                    <div className="bg-blue-600/20 px-8 py-4 border-b border-[var(--border-glow)]">
                      <h3 className="text-blue-400 font-bold text-sm uppercase tracking-widest flex items-center">
                        <i className="fas fa-cloud-arrow-down mr-3 text-blue-400"></i>
                        Carbon Reduction Strategies
                      </h3>
                    </div>
                    <div className="p-8">
                      <ul className="space-y-4">
                        {result.CarbonReductionStrategies.map((item, i) => (
                          <li key={i} className="flex items-start text-[var(--text-secondary)]">
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
                    className="bg-[var(--card-bg)] text-[var(--text-primary)]"
                  >
                    <h3 className="text-lg font-black mb-6 flex items-center">
                      <i className="fas fa-truck-fast mr-3 text-[var(--accent-emerald)] dark:text-emerald-400"></i>
                      Logistics Optimization
                    </h3>
                    <ul className="space-y-4">
                      {result.LogisticsOptimization.map((item, i) => (
                        <li key={i} className="flex items-start text-[var(--text-secondary)] text-sm">
                          <i className="fas fa-location-dot text-[var(--accent-emerald)] dark:text-emerald-400 mr-3 mt-1 shrink-0"></i>
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
                    className="bg-[var(--card-bg)]/90 shadow-card backdrop-blur-[10px] rounded-3xl  border border-[var(--border-glow)] overflow-hidden"
                  >
                    <div className="bg-amber-500/20 px-8 py-4 border-b border-[var(--border-glow)]">
                      <h3 className="text-amber-400 font-bold text-sm uppercase tracking-widest flex items-center">
                        <i className="fas fa-bolt mr-3 text-amber-400"></i>{language === 'Arabic' ? "خطة استبدال الوقود الأحفوري" : "Fossil Fuel Replacement Plan"}</h3>
                    </div>
                    <div className="p-8">
                      <ul className="space-y-4">
                        {result.FossilFuelReplacementPlan.map((item, i) => (
                          <li key={i} className="flex items-start text-[var(--text-secondary)]">
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
                    className="bg-[var(--card-bg)] text-[var(--text-primary)]"
                  >
                    <div className="bg-emerald-800 px-8 py-6 border-b border-emerald-700">
                      <h3 className="text-lg font-black flex items-center">
                        <i className="fas fa-flag-checkered mr-3 text-[var(--accent-emerald)] dark:text-emerald-400"></i>{language === 'Arabic' ? "خارطة طريق نحو صافي الانبعاثات الصفري" : "Net-Zero Roadmap"}</h3>
                    </div>
                    <div className="p-8 space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-emerald-800/50 rounded-2xl border border-emerald-700">
                          <p className="text-[10px] font-black text-[var(--accent-emerald)] dark:text-emerald-400 uppercase tracking-widest mb-1">{language === 'Arabic' ? "كثافة الكربون" : "Carbon Intensity"}</p>
                          <p className="text-sm font-bold">{result.NetZeroRoadmap.CarbonIntensityEstimate}</p>
                        </div>
                        <div className="p-4 bg-emerald-800/50 rounded-2xl border border-emerald-700">
                          <p className="text-[10px] font-black text-[var(--accent-emerald)] dark:text-emerald-400 uppercase tracking-widest mb-1">{language === 'Arabic' ? "المعايير العالمية" : "Global Standards"}</p>
                          <p className="text-sm font-bold">{result.NetZeroRoadmap.StandardsComparison}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-[var(--accent-emerald)] dark:text-emerald-400 uppercase tracking-widest mb-4">{language === 'Arabic' ? "خطوات التنفيذ" : "Implementation Steps"}</p>
                        <div className="space-y-4">
                          {result.NetZeroRoadmap.RoadmapSteps.map((step, i) => (
                            <div key={i} className="flex items-start">
                              <div className="w-6 h-6 rounded-full bg-[var(--accent-emerald)] flex items-center justify-center text-[10px] font-black mr-3 shrink-0">
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
            className="bg-[var(--card-bg)]/90 shadow-card backdrop-blur-[10px] rounded-3xl  border border-[var(--border-glow)] overflow-hidden"
          >
            <div className="bg-[var(--bg-main)] border-b border-[var(--border-glow)] px-8 py-6 flex justify-between items-center">
            <h3 className="text-[var(--text-primary)] font-bold text-lg">{language === 'Arabic' ? "سجل التحسينات" : "Optimization History"}</h3>
            <button 
              onClick={onClear}
              className="text-xs font-black text-red-500 uppercase tracking-widest hover:text-red-400 transition"
            >
              Clear All
            </button>
          </div>
          <div className="p-8">
            {history.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-folder-open text-[var(--text-secondary)] text-5xl mb-4"></i>
                <p className="text-[var(--text-secondary)] font-medium">No history found. Start optimizing your project!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((entry) => (
                  <div 
                    key={entry.id}
                    onClick={() => handleSelectFromHistory(entry)}
                    className="p-6 rounded-2xl border border-[var(--border-glow)] bg-[var(--bg-main)]/50 hover:bg-[var(--bg-main)] hover:border-[#34D399]/50 transition cursor-pointer group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-[var(--text-primary)] group-hover:text-[#34D399] transition">{entry.projectName}</h4>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">{entry.timestamp}</p>
                      </div>
                      <i className="fas fa-chevron-right text-[var(--text-secondary)] group-hover:text-[#34D399] transition"></i>
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
