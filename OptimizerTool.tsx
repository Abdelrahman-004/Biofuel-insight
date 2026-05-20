import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
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
        <div className="bg-[var(--card-bg)] shadow-card p-1 rounded-xl border border-[var(--border-glow)] flex space-x-1">
          <button 
            onClick={() => setViewMode('OPTIMIZE')}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              viewMode === 'OPTIMIZE' ? 'bg-emerald-700 dark:bg-emerald-600 shadow-card' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <i className="fas fa-chart-line mr-2"></i> {isArabic ? 'التحسين' : 'Optimize'}
          </button>
          <button 
            onClick={() => setViewMode('HISTORY')}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              viewMode === 'HISTORY' ? 'bg-emerald-700 dark:bg-emerald-600 shadow-card' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
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
            <div className="bg-[var(--card-bg)] shadow-card  rounded-3xl  border border-[var(--border-glow)] hover:border-#34D399 transition-all duration-300 overflow-hidden">
            <div className="bg-[#34D399]/10 px-8 py-6 border-b border-[var(--border-glow)] flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div>
                <h2 className="text-2xl font-black text-[#34D399] flex items-center tracking-tight drop-shadow-md">
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
                    className="px-3 py-1.5 bg-[var(--bg-main)] border border-[var(--border-glow)] rounded-lg text-[10px] font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#34D399] hover:shadow-md transition-all"
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
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading || !projectName.trim() || !description.trim()}
                className={`w-full py-4 rounded-2xl font-black text-[var(--text-primary)] flex items-center justify-center gap-3 transition-all border border-transparent ${
                  isLoading ? 'bg-[var(--bg-main)] cursor-not-allowed text-[var(--text-secondary)] border-[var(--border-glow)]' : 'bg-[var(--card-bg)] shadow-[0_0_40px_-10px_rgba(16,185,129,0.4)] hover:shadow-[0_0_60px_-10px_rgba(16,185,129,0.6)] border-[#10B981]/50 hover:border-[#10B981] text-[#10B981]'
                }`}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin text-xl"></i>
                    <span>{isArabic ? 'يتم تحسين الاستراتيجية...' : 'Optimizing Strategy...'}</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-rocket text-xl"></i>
                    <span className="tracking-widest uppercase">{isArabic ? 'توليد خطة التحسين المالي' : 'Generate Optimization Strategy'}</span>
                  </>
                )}
              </motion.button>
            </form>
          </div>

          {error && (
            <div className="p-4 bg-[var(--bg-main)] border border-red-200 rounded-xl text-red-700 dark:text-red-400 text-sm flex items-center">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}

            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full pb-12 space-y-8"
              >
                {/* 🎯 PROJECT OVERVIEW */}
                <div className="bg-[var(--card-bg)] shadow-card rounded-3xl border border-[var(--border-glow)] overflow-hidden">
                  <div className="bg-emerald-600/20 px-8 py-6 border-b border-[var(--border-glow)]">
                    <h3 className="text-[var(--accent-emerald)] dark:text-emerald-400 font-bold text-lg uppercase tracking-widest flex items-center">
                      <i className="fas fa-bullseye mr-3 text-[var(--accent-emerald)] dark:text-emerald-400"></i>
                      {isArabic ? 'نظرة عامة على المشروع' : 'Project Overview'}
                    </h3>
                  </div>
                  <div className="p-8">
                    <h4 className="text-xl font-bold text-[var(--text-primary)] mb-2">{result.projectOverview.tagline}</h4>
                    <p className="text-[var(--text-secondary)]">{result.projectOverview.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* 💰 REVENUE STACK */}
                  <div className="bg-[var(--card-bg)] shadow-card rounded-3xl border border-[var(--border-glow)] overflow-hidden">
                    <div className="bg-blue-600/20 px-8 py-6 border-b border-[var(--border-glow)]">
                      <h3 className="text-blue-700 dark:text-blue-400 font-bold text-lg uppercase tracking-widest flex items-center">
                        <i className="fas fa-wallet mr-3 text-blue-700 dark:text-blue-400"></i>
                        {isArabic ? 'مكدس الإيرادات' : 'Revenue Stack'}
                      </h3>
                    </div>
                    <div className="p-8 pb-4">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="w-full lg:w-1/2 h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={result.revenueStack.sources}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                dataKey="amount"
                                stroke="none"
                              >
                                {result.revenueStack.sources.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'][index % 5]} />
                                ))}
                              </Pie>
                              <Tooltip 
                                formatter={(value: number) => `$${value.toLocaleString()}`}
                                contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-glow)', borderRadius: '8px' }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="w-full lg:w-1/2 space-y-4">
                          {result.revenueStack.sources.map((src, i) => (
                            <div key={i} className="flex flex-col">
                              <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center">
                                  <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'][i % 5] }}></span>
                                  <span className="text-[var(--text-primary)] font-semibold text-sm">{src.name}</span>
                                </div>
                                <span className="text-[var(--text-primary)] font-mono text-sm">${src.amount.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-start ml-5 mt-1">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${src.confidence === 'HIGH' ? 'bg-emerald-500/20 text-[var(--accent-emerald)] dark:text-emerald-400' : src.confidence === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' : 'bg-red-600/20 text-red-700 dark:text-red-400'}`}>
                                  {src.confidence} CONFIDENCE
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="pt-6 mt-6 border-t border-[var(--border-glow)] flex justify-between gap-4">
                        <div className="flex-1 bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border-glow)]">
                          <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest mb-1 flex items-center">Base Case</div>
                          <div className="text-xl font-bold text-[var(--text-primary)] font-mono">${result.revenueStack.baseCaseTarget.toLocaleString()}/yr</div>
                        </div>
                        <div className="flex-1 bg-emerald-900/20 p-4 rounded-xl border border-emerald-500/30">
                          <div className="text-[10px] text-[var(--accent-emerald)] dark:text-emerald-400 uppercase tracking-widest mb-1 flex items-center"><i className="fas fa-arrow-trend-up mr-2"></i> Upside Target</div>
                          <div className="text-xl font-bold text-[var(--accent-emerald)] dark:text-emerald-400 font-mono">${result.revenueStack.upsideCaseTarget.toLocaleString()}/yr</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 📊 FINANCIAL SNAPSHOT */}
                  <div className="bg-[var(--card-bg)] shadow-card rounded-3xl border border-[var(--border-glow)] overflow-hidden">
                    <div className="bg-purple-600/20 px-8 py-6 border-b border-[var(--border-glow)]">
                      <h3 className="text-purple-400 font-bold text-lg uppercase tracking-widest flex items-center">
                        <i className="fas fa-chart-pie mr-3 text-purple-400"></i>
                        {isArabic ? 'لمحة مالية' : 'Financial Snapshot'}
                      </h3>
                    </div>
                    <div className="p-8 grid grid-cols-2 gap-4">
                      <div className="p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border-glow)]">
                        <div className="text-xs text-[var(--text-secondary)] uppercase tracking-widest mb-1">CAPEX</div>
                        <div className="text-lg font-bold text-[var(--text-primary)] font-mono">${result.financialSnapshot.capex.toLocaleString()}</div>
                      </div>
                      <div className="p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border-glow)]">
                        <div className="text-xs text-[var(--text-secondary)] uppercase tracking-widest mb-1">Budget</div>
                        <div className="text-lg font-bold text-[var(--text-primary)] font-mono">${result.financialSnapshot.budget.toLocaleString()}</div>
                      </div>
                      <div className="p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border-glow)]">
                        <div className="text-xs text-[var(--text-secondary)] uppercase tracking-widest mb-1">Annual Profit</div>
                        <div className="text-lg font-bold text-[var(--accent-emerald)] dark:text-emerald-400 font-mono">${result.financialSnapshot.annualProfit.toLocaleString()}</div>
                      </div>
                      <div className="p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border-glow)]">
                        <div className="text-xs text-[var(--text-secondary)] uppercase tracking-widest mb-1">IRR</div>
                        <div className="text-lg font-bold text-[var(--text-primary)] font-mono">{result.financialSnapshot.irr}%</div>
                      </div>
                      <div className="p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border-glow)]">
                        <div className="text-xs text-[var(--text-secondary)] uppercase tracking-widest mb-1">Payback</div>
                        <div className="text-lg font-bold text-[var(--text-primary)] font-mono">{result.financialSnapshot.paybackYears} yrs</div>
                      </div>
                      <div className="p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border-glow)]">
                        <div className="text-xs text-[var(--text-secondary)] uppercase tracking-widest mb-1">NPV</div>
                        <div className="text-lg font-bold text-[var(--text-primary)] font-mono">${result.financialSnapshot.npv.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* 🌱 CARBON PERFORMANCE */}
                  <div className="bg-[var(--card-bg)] shadow-card rounded-3xl border border-[var(--border-glow)] overflow-hidden">
                    <div className="bg-emerald-600/20 px-8 py-6 border-b border-[var(--border-glow)] flex justify-between items-center">
                      <h3 className="text-[var(--accent-emerald)] dark:text-emerald-400 font-bold text-lg uppercase tracking-widest flex items-center">
                        <i className="fas fa-leaf mr-3 text-[var(--accent-emerald)] dark:text-emerald-400"></i>
                        {isArabic ? 'الأداء الكربوني' : 'Carbon Performance'}
                      </h3>
                      {result.carbonPerformance.euRedIIIFlag && (
                        <span className="bg-emerald-500/20 text-[var(--accent-emerald)] dark:text-emerald-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">EU RED III ✅</span>
                      )}
                    </div>
                    <div className="p-8">
                       <div className="h-[180px] w-full mb-6 relative">
                         <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={[
                              { name: 'Baseline', value: parseFloat(result.carbonPerformance.intensityBefore), fill: '#64748B' },
                              { name: 'Optimized', value: parseFloat(result.carbonPerformance.intensityAfter), fill: '#10B981' }
                            ]}>
                             <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                             <Tooltip 
                               formatter={(val) => [`${val} gCO2/MJ`, 'Intensity']} 
                               contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-glow)', borderRadius: '8px' }}
                               cursor={{ fill: 'transparent' }}
                              />
                             <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                               { [0,1].map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={index === 0 ? '#64748B' : '#10B981'} />
                               )) }
                             </Bar>
                           </BarChart>
                         </ResponsiveContainer>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                         <div className="bg-emerald-500/10 p-4 rounded-xl border border-[var(--border-glow)]">
                           <div className="text-[10px] text-[var(--accent-emerald)] dark:text-emerald-400 uppercase tracking-widest mb-1">Reduction</div>
                           <div className="text-2xl font-bold text-[var(--text-primary)] font-mono">-{result.carbonPerformance.reductionPercentage}%</div>
                         </div>
                         <div className="bg-blue-600/10 p-4 rounded-xl border border-[var(--border-glow)]">
                           <div className="text-[10px] text-blue-700 dark:text-blue-400 uppercase tracking-widest mb-1">CO2 Saved/yr</div>
                           <div className="text-2xl font-bold text-[var(--text-primary)] font-mono">{result.carbonPerformance.co2SavedPerYear.toLocaleString()}<span className="text-sm text-[var(--text-secondary)] ml-1">t</span></div>
                         </div>
                       </div>
                    </div>
                  </div>

                  {/* 🏁 SMART VERDICT */}
                  <div className="bg-[var(--card-bg)] shadow-card rounded-3xl border border-[var(--border-glow)] overflow-hidden">
                    <div className="bg-amber-600/20 px-8 py-6 border-b border-[var(--border-glow)]">
                      <h3 className="text-amber-700 dark:text-amber-400 font-bold text-lg uppercase tracking-widest flex items-center">
                        <i className="fas fa-gavel mr-3 text-amber-700 dark:text-amber-400"></i>
                        {isArabic ? 'الحكم الذكي' : 'Smart Verdict'}
                      </h3>
                    </div>
                    <div className="p-8 space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[var(--text-secondary)]">Profit Potential</span>
                          <div className="flex space-x-1 text-amber-700 dark:text-amber-400 text-sm">
                            {[...Array(5)].map((_, i) => <i key={i} className={`fa${i < result.smartVerdict.profitScore ? 's' : 'r'} fa-star`}></i>)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[var(--text-secondary)]">Carbon Impact</span>
                          <div className="flex space-x-1 text-[var(--accent-emerald)] dark:text-emerald-400 text-sm">
                            {[...Array(5)].map((_, i) => <i key={i} className={`fa${i < result.smartVerdict.carbonScore ? 's' : 'r'} fa-star`}></i>)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[var(--text-secondary)]">Oman Alignment</span>
                          <div className="flex space-x-1 text-blue-700 dark:text-blue-400 text-sm">
                            {[...Array(5)].map((_, i) => <i key={i} className={`fa${i < result.smartVerdict.omanAlignmentScore ? 's' : 'r'} fa-star`}></i>)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-[var(--border-glow)]">
                        <h4 className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] mb-2">Decision</h4>
                        <p className={`text-lg font-bold ${result.smartVerdict.decision.toLowerCase().includes('strong') ? 'text-[var(--accent-emerald)] dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                          {result.smartVerdict.decision}
                        </p>
                        <p className="text-sm text-[var(--text-secondary)] mt-2">{result.smartVerdict.comparison}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* ⚡ TOP OPPORTUNITIES */}
                  <div className="bg-[var(--card-bg)] shadow-card rounded-3xl border border-[var(--border-glow)] overflow-hidden">
                    <div className="bg-emerald-500/10 px-8 py-4 border-b border-[var(--border-glow)]">
                      <h3 className="text-[var(--accent-emerald)] dark:text-emerald-400 font-bold text-sm uppercase tracking-widest flex items-center">
                        <i className="fas fa-arrow-trend-up mr-3 text-[var(--accent-emerald)] dark:text-emerald-400"></i> Top Opportunities
                      </h3>
                    </div>
                    <div className="p-8 space-y-4">
                      {result.topOpportunities.map((opp, i) => (
                        <div key={i} className="flex items-start bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border-glow)]">
                          <div className="text-[var(--accent-emerald)] dark:text-emerald-400 mt-1 mr-4"><i className="fas fa-check-circle text-xl"></i></div>
                          <div>
                            <h4 className="font-bold text-[var(--text-primary)]">{opp.title} <span className="text-[var(--accent-emerald)] dark:text-emerald-400 text-sm ml-2">({opp.value})</span></h4>
                            <p className="text-sm text-[var(--text-secondary)] mt-1">{opp.action}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ⚠️ TOP RISKS */}
                  <div className="bg-[var(--card-bg)] shadow-card rounded-3xl border border-[var(--border-glow)] overflow-hidden">
                    <div className="bg-red-600/10 px-8 py-4 border-b border-[var(--border-glow)]">
                      <h3 className="text-red-700 dark:text-red-400 font-bold text-sm uppercase tracking-widest flex items-center">
                        <i className="fas fa-triangle-exclamation mr-3 text-red-700 dark:text-red-400"></i> Top Risks
                      </h3>
                    </div>
                    <div className="p-8 space-y-4">
                      {result.topRisks.map((risk, i) => (
                        <div key={i} className="flex items-start bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border-glow)]">
                          <div className="text-red-700 dark:text-red-400 mt-1 mr-4"><i className="fas fa-radiation text-xl"></i></div>
                          <div>
                            <h4 className="font-bold text-[var(--text-primary)]">{risk.title} <span className="text-red-700 dark:text-red-400 text-xs px-2 py-0.5 bg-red-400/10 rounded ml-2 uppercase">{risk.probability}</span></h4>
                            <p className="text-sm text-[var(--text-secondary)] mt-1">Fix: {risk.mitigation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 🗺️ ROADMAP */}
                <div className="bg-[var(--card-bg)] shadow-card rounded-3xl border border-[var(--border-glow)] overflow-hidden pb-4">
                    <div className="bg-indigo-500/10 px-8 py-6 border-b border-[var(--border-glow)] mb-4">
                      <h3 className="text-indigo-400 font-bold text-lg uppercase tracking-widest flex items-center">
                        <i className="fas fa-map mr-3 text-indigo-400"></i>
                        {isArabic ? 'خارطة طريق التحسين' : 'Optimization Roadmap'}
                      </h3>
                    </div>
                    <div className="px-8 overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-[var(--border-glow)] text-[var(--text-secondary)] text-xs uppercase tracking-wider">
                            <th className="py-4 px-4">Year</th>
                            <th className="py-4 px-4">Action</th>
                            <th className="py-4 px-4">Cost</th>
                            <th className="py-4 px-4">Expected Impact</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.optimizationRoadmap.map((step, i) => (
                            <tr key={i} className="border-b border-[var(--border-glow)]/50 hover:bg-[var(--bg-main)] transition">
                              <td className="py-4 px-4 font-mono text-indigo-400 font-bold">Year {step.year}</td>
                              <td className="py-4 px-4 text-[var(--text-primary)]">{step.action}</td>
                              <td className="py-4 px-4 text-amber-700 dark:text-amber-400 font-mono">{step.cost}</td>
                              <td className="py-4 px-4 text-[var(--accent-emerald)] dark:text-emerald-400 text-sm">{step.impact}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                </div>

                {/* 📅 NEXT STEPS & TRANSPARENCY */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-[var(--card-bg)] shadow-card rounded-3xl border border-[var(--border-glow)] overflow-hidden">
                    <div className="bg-[var(--bg-main)] px-8 py-4 border-b border-[var(--border-glow)]">
                      <h3 className="text-[var(--text-primary)] font-bold text-sm uppercase tracking-widest">Next 3 Steps</h3>
                    </div>
                    <div className="p-8 space-y-4">
                      {result.nextSteps.map((step, i) => (
                        <div key={i} className="flex flex-col border-l-2 border-[#34D399] pl-4 py-1">
                          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">{step.timeline} • {step.cost}</span>
                          <span className="text-[var(--text-primary)]">{step.urgentAction}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[var(--card-bg)] shadow-card rounded-3xl border border-[var(--border-glow)] overflow-hidden">
                    <div className="bg-[var(--bg-main)] px-8 py-4 border-b border-[var(--border-glow)]">
                      <h3 className="text-[var(--text-primary)] font-bold text-sm uppercase tracking-widest">Data Transparency</h3>
                    </div>
                    <div className="p-6">
                      <ul className="space-y-3">
                        {result.dataTransparency.map((data, i) => (
                          <li key={i} className="flex justify-between items-center text-sm border-b border-[var(--border-glow)]/50 pb-2">
                            <div>
                              <span className="text-[var(--text-primary)] block">{data.dataPoint}</span>
                              <span className="text-[var(--text-secondary)] text-[10px]">{data.source}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${data.confidence === 'HIGH' ? 'bg-emerald-500/20 text-[var(--accent-emerald)] dark:text-emerald-400' : data.confidence === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' : 'bg-red-600/20 text-red-700 dark:text-red-400'}`}>{data.confidence}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-[10px] text-center text-[var(--text-secondary)] mt-6 italic">Professional validation required for investments {'>'} $100K.</p>
                    </div>
                  </div>
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
            className="bg-[var(--card-bg)] shadow-card  rounded-3xl  border border-[var(--border-glow)] overflow-hidden"
          >
            <div className="bg-[var(--bg-main)] border-b border-[var(--border-glow)] px-8 py-6 flex justify-between items-center">
            <h3 className="text-[var(--text-primary)] font-bold text-lg">{language === 'Arabic' ? "سجل التحسينات" : "Optimization History"}</h3>
            <button 
              onClick={onClear}
              className="text-xs font-black text-red-700 dark:text-red-400 uppercase tracking-widest hover:text-red-700 dark:text-red-400 transition"
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
                    className="p-6 rounded-2xl border border-[var(--border-glow)] bg-[var(--bg-main)] hover:bg-[var(--bg-main)] hover:border-#34D399 transition cursor-pointer group"
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
