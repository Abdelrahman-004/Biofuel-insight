import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { ChallengeSolverResult, ChallengeHistoryEntry } from './types';
import { solveChallenge } from './geminiService';

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

interface ChallengeSolverProps {
  history: ChallengeHistoryEntry[];
  onSave: (entry: ChallengeHistoryEntry) => void;
  onClear: () => void;
  initialInputs?: { topic: string };
  initialResult?: ChallengeSolverResult;
  language?: 'English' | 'Arabic';
}

const TOPIC_STORAGE_KEY = 'biofuel_insight_challenge_topic_draft';

export const ChallengeSolver: React.FC<ChallengeSolverProps> = ({ history, onSave, onClear, initialInputs, initialResult, language = 'English' }) => {
  const [localLanguage, setLocalLanguage] = React.useState(language || 'Arabic');

  React.useEffect(() => {
    setLocalLanguage(language || 'Arabic');
  }, [language]);

    const isArabic = language === 'Arabic';
  const [topic, setTopic] = React.useState('');
  const [result, setResult] = React.useState<ChallengeSolverResult | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<'SOLVE' | 'HISTORY'>('SOLVE');

  // Load draft on mount
  React.useEffect(() => {
    if (initialInputs) {
      setTopic(initialInputs.topic);
    } else {
      const saved = localStorage.getItem(TOPIC_STORAGE_KEY);
      if (saved) setTopic(saved);
    }
  }, [initialInputs]);

  React.useEffect(() => {
    if (initialResult) {
      setResult(initialResult);
      setViewMode('SOLVE');
    }
  }, [initialResult]);

  // Save draft on change
  React.useEffect(() => {
    localStorage.setItem(TOPIC_STORAGE_KEY, topic);
  }, [topic]);

  const handleSolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await solveChallenge(topic, localLanguage);
      setResult(data);
      
      const newEntry: ChallengeHistoryEntry = {
        id: Date.now().toString(),
        topic: topic,
        timestamp: new Date().toLocaleString(),
        fullData: data
      };
      onSave(newEntry);
    } catch (err) {
      setError('Failed to generate solution. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFromHistory = (entry: ChallengeHistoryEntry) => {
    setResult(entry.fullData);
    setTopic(entry.topic);
    setViewMode('SOLVE');
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
            onClick={() => setViewMode('SOLVE')}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              viewMode === 'SOLVE' ? 'bg-blue-600 text-white shadow-card' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <i className="fas fa-lightbulb mr-2"></i> {isArabic ? 'حل تحدي' : 'Solve'}
          </button>
          <button 
            onClick={() => setViewMode('HISTORY')}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              viewMode === 'HISTORY' ? 'bg-blue-600 text-white shadow-card' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <i className="fas fa-history mr-2"></i> {isArabic ? 'السجل' : 'History'} ({history.length})
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'SOLVE' ? (
          <motion.div 
            key="solve"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
          <div className="bg-[var(--card-bg)] shadow-card  rounded-3xl  border border-[var(--border-glow)] hover:border-#F59E0B transition-all duration-300 overflow-hidden">
            <div className="bg-[#F59E0B]/10 px-8 py-6 border-b border-[var(--border-glow)] flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div>
                <h2 className="text-2xl font-black text-[#F59E0B] flex items-center tracking-tight drop-shadow-md">
                  <i className="fas fa-lightbulb mr-3"></i>
                  {isArabic ? 'الذكاء الاصطناعي لحل تحديات الوقود الحيوي' : 'Oman Biofuel Challenge Solver AI'}
                </h2>
                <p className="text-[var(--text-secondary)] text-sm mt-1">{isArabic ? 'تحديد وحل العقبات العلمية في أبحاث الوقود الحيوي' : 'Identify and solve scientific bottlenecks in Oman\'s biofuel research.'}</p>
              </div>
              
              <select 
                value={localLanguage}
                onChange={(e) => setLocalLanguage(e.target.value as 'English' | 'Arabic')}
                className="bg-[var(--card-bg)] shadow-card text-sm border border-[var(--border-glow)] rounded-lg px-3 py-1.5 text-[#F59E0B] outline-none shadow-sm"
              >
                <option value="Arabic" className="bg-[var(--card-bg)] text-[var(--text-primary)]">العربية (Arabic)</option>
                <option value="English" className="bg-[var(--card-bg)] text-[var(--text-primary)]">English</option>
              </select>
            </div>
            
            <form onSubmit={handleSolve} className="p-8">
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest w-full mb-1">{isArabic ? 'جرب مثال:' : 'Try an Example:'}</span>
                {[
                  "Algae salinity tolerance",
                  "Date seed oil extraction",
                  "Bio-hydrogen storage",
                  "Solar-thermal pyrolysis"
                ].map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setTopic(ex)}
                    className="px-3 py-1.5 bg-[var(--bg-main)] border border-[var(--border-glow)] rounded-lg text-[10px] font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#F59E0B] hover:shadow-md transition-all"
                  >
                    {ex}
                  </button>
                ))}
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <input 
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={isArabic ? 'مثال: تحمل الطحالب للملوحة العالية، كفاءة استخلاص الزيت...' : "e.g., Algae cultivation in high salinity, Date seed oil extraction efficiency..."}
                  className="flex-grow px-6 py-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-glow)] text-[var(--text-primary)] focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition placeholder:text-[var(--text-secondary)]"
                  dir={isArabic ? 'rtl' : 'ltr'}
                />
                <button 
                  disabled={isLoading || !topic.trim()}
                  className={`px-8 py-4 rounded-xl font-bold text-[var(--text-primary)] flex items-center justify-center space-x-2 transition-all  ${
                    isLoading ? 'bg-[var(--bg-main)] cursor-not-allowed text-[var(--text-secondary)]' : 'bg-gradient-to-r from-[#059669] to-[#10B981] hover:shadow-md active:scale-95'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>{isArabic ? 'جاري الحل...' : 'Solving...'}</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-lightbulb"></i>
                      <span>{isArabic ? 'إيجاد حل' : 'Generate Solution'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {error && (
            <div className="p-4 bg-[var(--bg-main)] border border-red-200 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}

            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12"
              >
                {/* Result display code remains the same */}
                <div className="lg:col-span-2 space-y-8">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-[var(--card-bg)] shadow-card  rounded-3xl  border border-[var(--border-glow)] overflow-hidden"
                  >
                    <div className="bg-[var(--bg-main)] px-8 py-4 border-b border-[var(--border-glow)]">
                      <h3 className="text-[var(--text-primary)] font-bold text-sm uppercase tracking-widest flex items-center">
                        <i className="fas fa-triangle-exclamation mr-3 text-amber-400"></i>
                        {isArabic ? 'التحدي المحدد' : 'Identified Challenge'}
                      </h3>
                    </div>
                    <div className="p-8">
                      <p className="text-[var(--text-secondary)] leading-relaxed font-medium">{result.IdentifiedChallenge}</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-[var(--card-bg)] shadow-card  rounded-3xl  border border-[var(--border-glow)] overflow-hidden"
                  >
                    <div className="bg-blue-600/20 px-8 py-4 border-b border-[var(--border-glow)]">
                      <h3 className="text-blue-400 font-bold text-sm uppercase tracking-widest flex items-center">
                        <i className="fas fa-flask mr-3 text-blue-400"></i>
                        Scientific Hypothesis
                      </h3>
                    </div>
                    <div className="p-8">
                      <p className="text-[var(--text-secondary)] leading-relaxed font-medium italic">"{result.ScientificHypothesis}"</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-[var(--card-bg)] shadow-card  rounded-3xl  border border-[var(--border-glow)] overflow-hidden"
                  >
                    <div className="bg-emerald-600/20 px-8 py-4 border-b border-[var(--border-glow)]">
                      <h3 className="text-[var(--accent-emerald)] dark:text-emerald-400 font-bold text-sm uppercase tracking-widest flex items-center">
                        <i className="fas fa-vial mr-3 text-[var(--accent-emerald)] dark:text-emerald-400"></i>
                        Experimental Design
                      </h3>
                    </div>
                    <div className="p-8 space-y-6">
                      <div>
                        <h4 className="text-lg font-black text-[var(--text-primary)] mb-2">{result.ExperimentalDesign.Title}</h4>
                        <p className="text-xs text-[var(--text-secondary)] italic mb-4">{result.ExperimentalDesign.FeasibilityNote}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h5 className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{language === 'Arabic' ? "المتغيرات الرئيسية" : "Key Variables"}</h5>
                          <ul className="space-y-2">
                            {result.ExperimentalDesign.Variables.map((v, i) => (
                              <li key={i} className="text-sm text-[var(--text-secondary)] flex items-start">
                                <i className="fas fa-check text-[var(--accent-emerald)] dark:text-emerald-400 mr-2 mt-1 shrink-0"></i>
                                {v}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-3">
                          <h5 className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{language === 'Arabic' ? "ظروف المقارنة" : "Control Conditions"}</h5>
                          <ul className="space-y-2">
                            {result.ExperimentalDesign.ControlConditions.map((c, i) => (
                              <li key={i} className="text-sm text-[var(--text-secondary)] flex items-start">
                                <i className="fas fa-sliders text-blue-600 dark:text-blue-400 mr-2 mt-1 shrink-0"></i>
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-[var(--border-glow)]">
                        <h5 className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-3">{language === 'Arabic' ? "النتائج المتوقعة" : "Expected Outcomes"}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {result.ExperimentalDesign.ExpectedOutcomes.map((o, i) => (
                            <div key={i} className="p-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border-glow)] text-xs text-[var(--text-secondary)] font-medium">
                              {o}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="space-y-8">
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-[var(--bg-main)] rounded-3xl shadow-card border border-[var(--border-glow)] p-8 text-[var(--text-primary)] relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <i className="fas fa-industry text-8xl"></i>
                    </div>
                    <h3 className="text-lg font-black mb-4 flex items-center relative z-10">
                      <i className="fas fa-link mr-3 text-blue-400"></i>
                      Industrial Relevance
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed relative z-10">{result.IndustrialRelevance}</p>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-[var(--card-bg)] shadow-card  rounded-3xl  border border-[var(--border-glow)] overflow-hidden"
                  >
                    <div className="bg-[var(--bg-main)] px-8 py-4 border-b border-[var(--border-glow)]">
                      <h3 className="text-[var(--text-primary)] font-bold text-sm uppercase tracking-widest flex items-center">
                        <i className="fas fa-chart-pie mr-3 text-blue-400"></i>
                        Impact Evaluation
                      </h3>
                    </div>
                    <div className="p-8 space-y-6">
                      <div>
                        <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-1">{language === 'Arabic' ? "بيئياً" : "Environmental"}</p>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{result.ExpectedImpact.Environmental}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-1">{language === 'Arabic' ? "اقتصادياً" : "Economic"}</p>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{result.ExpectedImpact.Economic}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-1">Strategic (Oman Vision 2040)</p>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{result.ExpectedImpact.Strategic}</p>
                      </div>
                      <div className="pt-4 border-t border-[var(--border-glow)]">
                        <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">{language === 'Arabic' ? "إمكانيات قابلية التوسع" : "Scalability Potential"}</p>
                        <p className="text-sm font-black text-[var(--text-primary)]">{result.ExpectedImpact.Scalability}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {(result.DataDrivenInsights || result.AIAudit || result.AlternativeMethods) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="lg:col-span-3 space-y-8"
                  >
                    {result.DataDrivenInsights && (
                      <div className="bg-[var(--card-bg)] shadow-card  rounded-3xl  border border-[var(--border-glow)] overflow-hidden">
                        <div className="bg-[#10B981]/20 px-8 py-4 border-b border-[var(--border-glow)]">
                          <h3 className="text-[#10B981] font-bold text-sm uppercase tracking-widest flex items-center">
                            <i className="fas fa-chart-line mr-3 text-[#10B981]"></i>
                            {localLanguage === 'Arabic' ? 'رؤى مبنية على البيانات وجداول هيكلية' : 'Data-Driven Insights & Structured Tables'}
                          </h3>
                        </div>
                        <div className="p-8 grid grid-cols-1 gap-8">
                          {Object.entries(result.DataDrivenInsights).map(([key, value]) => {
                            const insightLabels: Record<string, string> = {
                              LifeCycleAssessment: localLanguage === 'Arabic' ? 'تقييم دورة الحياة' : 'Life Cycle Assessment',
                              ResourceEfficiency: localLanguage === 'Arabic' ? 'كفاءة الموارد' : 'Resource Efficiency',
                              EnvironmentalImpact: localLanguage === 'Arabic' ? 'التأثير البيئي' : 'Environmental Impact',
                              ConventionalComparison: localLanguage === 'Arabic' ? 'المقارنة مع الطرق التقليدية' : 'Conventional Comparison'
                            };
                            return (
                              <div key={key} className="bg-[var(--bg-main)] p-6 rounded-2xl border border-[var(--border-glow)]">
                                 <h4 className="text-sm font-black text-[var(--text-primary)] mb-4 uppercase tracking-widest border-b border-[var(--border-glow)] pb-2">
                                   {insightLabels[key] || key.replace(/([A-Z])/g, ' $1').trim()}
                                 </h4>
                                 <div className="markdown-body text-[var(--text-secondary)] text-sm overflow-x-auto">
                                   <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]}>{value || "No data provided."}</ReactMarkdown>
                                 </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {result.AIAudit && (
                      <div className="bg-[var(--card-bg)] shadow-card  rounded-3xl  border border-[var(--border-glow)] overflow-hidden">
                        <div className="bg-[#F59E0B]/20 px-8 py-4 border-b border-[var(--border-glow)]">
                          <h3 className="text-[#F59E0B] font-bold text-sm uppercase tracking-widest flex items-center">
                            <i className="fas fa-user-shield mr-3 text-[#F59E0B]"></i>
                            {localLanguage === 'Arabic' ? 'تدقيق الذكاء الاصطناعي والاتساق المنطقي' : 'AI Audit & Logical Consistency Check'}
                          </h3>
                        </div>
                        <div className="p-8 space-y-6">
                           <div>
                              <h4 className="text-xs font-black text-[var(--text-secondary)] mb-2 uppercase tracking-widest">{localLanguage === 'Arabic' ? 'التحقق من الاتساق المنطقي' : 'Logical Consistency Check'}</h4>
                              <p className="text-[var(--text-secondary)]  leading-relaxed text-sm bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border-glow)]">
                                {result.AIAudit.LogicalConsistency}
                              </p>
                           </div>
                           
                           {result.AIAudit.Assumptions && result.AIAudit.Assumptions.length > 0 && (
                             <div>
                                <h4 className="text-xs font-black text-[var(--text-secondary)] mb-2 uppercase tracking-widest">{localLanguage === 'Arabic' ? 'الافتراضات الموضحة' : 'Highlighted Assumptions'}</h4>
                                <ul className="space-y-2">
                                  {result.AIAudit.Assumptions.map((assum, i) => (
                                    <li key={i} className="text-amber-400/90 text-sm flex items-start">
                                      <i className="fas fa-exclamation-triangle mt-1 mr-2 text-amber-600 dark:text-amber-400/50"></i> {assum}
                                    </li>
                                  ))}
                                </ul>
                             </div>
                           )}
                        </div>
                      </div>
                    )}

                    {result.AlternativeMethods && result.AlternativeMethods.length > 0 && (
                      <div className="bg-[var(--card-bg)] shadow-card  rounded-3xl  border border-[var(--border-glow)] overflow-hidden">
                        <div className="bg-blue-600/20 px-8 py-4 border-b border-[var(--border-glow)]">
                          <h3 className="text-blue-400 font-bold text-sm uppercase tracking-widest flex items-center">
                            <i className="fas fa-flask mr-3 text-blue-400"></i>
                            {localLanguage === 'Arabic' ? 'طرق بديلة دقيقة تدعمها البيانات' : 'Accurate Alternative Methods for Oman'}
                          </h3>
                        </div>
                        <div className="p-8 grid grid-cols-1 gap-4">
                           {result.AlternativeMethods.map((m, i) => (
                              <div key={i} className="bg-[var(--bg-main)] border border-[var(--border-glow)] rounded-2xl p-6 hover:border-blue-500 dark:border-blue-400/30 transition-colors">
                                <h4 className="font-bold text-[var(--text-primary)] mb-2">{m.MethodName}</h4>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{m.Description}</p>
                              </div>
                           ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
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
            <h3 className="text-[var(--text-primary)] font-bold text-lg">{language === 'Arabic' ? "سجل التحديات" : "Challenge History"}</h3>
            <button 
              onClick={onClear}
              className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-widest hover:text-red-400 transition"
            >
              Clear All
            </button>
          </div>
          <div className="p-8">
            {history.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-folder-open text-[var(--text-secondary)] text-5xl mb-4"></i>
                <p className="text-[var(--text-secondary)] font-medium">No history found. Generate your first solution!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((entry) => (
                  <div 
                    key={entry.id}
                    onClick={() => handleSelectFromHistory(entry)}
                    className="p-6 rounded-2xl border border-[var(--border-glow)] hover:border-blue-500 dark:border-blue-400/50 hover:bg-[var(--bg-main)] transition cursor-pointer group bg-[var(--bg-main)]"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-[var(--text-primary)] group-hover:text-blue-400 transition">{entry.topic}</h4>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">{entry.timestamp}</p>
                      </div>
                      <i className="fas fa-chevron-right text-[var(--text-secondary)] group-hover:text-blue-400 transition"></i>
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
