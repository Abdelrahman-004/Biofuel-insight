import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
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
              viewMode === 'SOLVE' ? 'bg-blue-700 dark:bg-blue-600 shadow-card' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <i className="fas fa-lightbulb mr-2"></i> {isArabic ? 'حل تحدي' : 'Solve'}
          </button>
          <button 
            onClick={() => setViewMode('HISTORY')}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              viewMode === 'HISTORY' ? 'bg-blue-700 dark:bg-blue-600 shadow-card' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
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
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading || !topic.trim()}
                  className={`px-8 py-4 rounded-2xl font-black text-[var(--text-primary)] flex items-center justify-center gap-3 transition-all border border-transparent ${
                    isLoading ? 'bg-[var(--bg-main)] cursor-not-allowed text-[var(--text-secondary)] border-[var(--border-glow)]' : 'bg-[var(--card-bg)] shadow-[0_0_40px_-10px_rgba(245,158,11,0.4)] hover:shadow-[0_0_60px_-10px_rgba(245,158,11,0.6)] border-[#F59E0B]/50 hover:border-[#F59E0B] text-[#F59E0B]'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin text-xl"></i>
                      <span>{isArabic ? 'جاري الحل...' : 'Solving...'}</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-lightbulb text-xl"></i>
                      <span className="tracking-widest uppercase">{isArabic ? 'إيجاد حل' : 'Generate'}</span>
                    </>
                  )}
                </motion.button>
              </div>
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
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full space-y-8"
                  >
                    {/* 🔬 RESEARCH CHALLENGE & GAP */}
                    <div className="bg-[var(--card-bg)] shadow-card rounded-3xl border border-[var(--border-glow)] overflow-hidden">
                      <div className="bg-blue-600/20 px-8 py-6 border-b border-[var(--border-glow)]">
                        <h3 className="text-blue-700 dark:text-blue-400 font-bold text-lg uppercase tracking-widest flex items-center">
                          <i className="fas fa-microscope mr-3 text-blue-700 dark:text-blue-400"></i>
                          {isArabic ? 'تحدي البحث والفجوة' : 'Research Challenge'}
                        </h3>
                      </div>
                      <div className="p-8 space-y-6">
                        <div>
                          <h4 className="text-xl font-bold text-[var(--text-primary)] mb-2">{result.researchChallenge}</h4>
                          <p className="text-[var(--text-secondary)]"><strong>Gap:</strong> {result.researchGap}</p>
                        </div>
                        <div className="bg-blue-900/20 p-6 rounded-2xl border border-blue-500/30">
                          <h4 className="text-sm tracking-widest text-blue-700 dark:text-blue-400 uppercase font-black mb-2">Hypothesis</h4>
                          <p className="text-lg font-medium text-blue-100 italic">"{result.hypothesis}"</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* 🧪 EXPERIMENTAL DESIGN */}
                      <div className="bg-[var(--card-bg)] shadow-card rounded-3xl border border-[var(--border-glow)] overflow-hidden">
                        <div className="bg-purple-600/20 px-8 py-6 border-b border-[var(--border-glow)]">
                          <h3 className="text-purple-400 font-bold text-lg uppercase tracking-widest flex items-center">
                            <i className="fas fa-flask mr-3 text-purple-400"></i>
                            {isArabic ? 'التصميم التجريبي' : 'Experimental Design'}
                          </h3>
                        </div>
                        <div className="p-8 space-y-6">
                           <div>
                             <h4 className="font-bold text-[var(--text-primary)] text-lg">{result.experimentalDesign.title}</h4>
                             <p className="text-sm text-[var(--text-secondary)] mt-1">{result.experimentalDesign.objective}</p>
                           </div>
                           
                           <div className="grid grid-cols-2 gap-4">
                             <div className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border-glow)]">
                               <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest block mb-1">Duration</span>
                               <span className="font-bold text-[var(--text-primary)] font-mono">{result.experimentalDesign.duration}</span>
                             </div>
                             <div className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border-glow)]">
                               <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest block mb-1">Budget</span>
                               <span className="font-bold text-amber-700 dark:text-amber-400 font-mono">{result.experimentalDesign.budget}</span>
                             </div>
                           </div>

                           <div>
                             <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest block mb-2">Variables</span>
                             <div className="space-y-2">
                               {result.experimentalDesign.variables.map((v, i) => (
                                 <div key={i} className="flex justify-between items-center bg-[var(--bg-main)] px-3 py-2 rounded-lg border border-[var(--border-glow)]">
                                    <span className="text-xs font-bold text-[var(--text-primary)]">{v.name} <span className="text-[10px] text-[var(--text-secondary)] font-normal px-2 py-0.5 rounded bg-gray-500/20 ml-2">{v.type}</span></span>
                                    <span className="font-mono text-xs text-purple-400">{v.range}</span>
                                 </div>
                               ))}
                             </div>
                           </div>

                           <div className="pt-4 border-t border-[var(--border-glow)]">
                             <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-3 flex items-center"><i className="fas fa-chart-line mr-2"></i> Statistical Design</h4>
                             <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                               <div className="bg-[var(--bg-main)] p-3 rounded-lg border border-[var(--border-glow)]">
                                 <span className="text-[10px] text-[var(--text-secondary)] block uppercase">Replicates</span>
                                 <span className="font-mono text-[var(--text-primary)] font-bold">{result.statisticalDesign.replicates}</span>
                               </div>
                               <div className="bg-[var(--bg-main)] p-3 rounded-lg border border-[var(--border-glow)]">
                                 <span className="text-[10px] text-[var(--text-secondary)] block uppercase">Significance (p)</span>
                                 <span className="font-mono text-[var(--text-primary)] font-bold">{result.statisticalDesign.significanceLevel}</span>
                               </div>
                               <div className="bg-[var(--bg-main)] p-3 rounded-lg border border-[var(--border-glow)] col-span-2">
                                 <span className="text-[10px] text-[var(--text-secondary)] block uppercase">Test</span>
                                 <span className="text-[var(--text-primary)] font-bold block">{result.statisticalDesign.primaryTest} (Post-hoc: {result.statisticalDesign.postHocTest})</span>
                               </div>
                             </div>
                           </div>
                        </div>
                      </div>

                      <div className="space-y-8">
                        {/* 📊 EXPECTED OUTCOMES */}
                        <div className="bg-[var(--card-bg)] shadow-card rounded-3xl border border-[var(--border-glow)] overflow-hidden">
                          <div className="bg-emerald-600/20 px-8 py-6 border-b border-[var(--border-glow)]">
                            <h3 className="text-[var(--accent-emerald)] dark:text-emerald-400 font-bold text-lg uppercase tracking-widest flex items-center">
                              <i className="fas fa-chart-bar mr-3 text-[var(--accent-emerald)] dark:text-emerald-400"></i>
                              {isArabic ? 'النتائج المتوقعة' : 'Expected Outcomes'}
                            </h3>
                          </div>
                          <div className="p-8">
                            <div className="space-y-4">
                              {result.expectedOutcomes.map((out, i) => (
                                <div key={i} className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border-glow)]">
                                  <div className="text-xs font-bold text-[var(--text-primary)] mb-3">{out.metric} ({out.unit})</div>
                                  <div className="flex justify-between items-end gap-4">
                                     <div className="flex-1">
                                       <span className="text-[10px] text-[var(--text-secondary)] uppercase block mb-1">Baseline</span>
                                       <span className="font-mono text-[var(--text-secondary)]">{out.baseline}</span>
                                     </div>
                                     <div className="flex-1 text-right">
                                       <span className="text-[10px] text-[var(--accent-emerald)] dark:text-emerald-400 uppercase block mb-1">Target</span>
                                       <span className="font-mono font-bold text-[var(--accent-emerald)] dark:text-emerald-400">{out.target}</span>
                                     </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* 🌱 LIFE CYCLE ASSESSMENT */}
                        <div className="bg-[var(--card-bg)] shadow-card rounded-3xl border border-[var(--border-glow)] overflow-hidden">
                          <div className="bg-emerald-800 px-8 py-6 border-b border-[var(--border-glow)]">
                            <h3 className="text-[var(--accent-emerald)] dark:text-emerald-400 font-bold text-lg uppercase tracking-widest flex items-center">
                              <i className="fas fa-leaf mr-3 text-[var(--accent-emerald)] dark:text-emerald-400"></i>
                              {isArabic ? 'تقييم دورة الحياة (LCA)' : 'Life Cycle Assessment'}
                            </h3>
                          </div>
                          <div className="p-8">
                              <div className="flex justify-between items-center bg-emerald-900/20 p-4 rounded-xl border border-emerald-500/20 mb-6">
                                <div>
                                  <span className="text-[10px] text-[var(--accent-emerald)] dark:text-emerald-400 uppercase tracking-widest block mb-1">System Boundary</span>
                                  <span className="text-xs font-bold text-[var(--text-primary)]">{result.lifeCycleAssessment.systemBoundary}</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-[10px] text-[var(--accent-emerald)] dark:text-emerald-400 uppercase tracking-widest block mb-1">Functional Unit</span>
                                  <span className="text-xs font-bold text-[var(--text-primary)]">{result.lifeCycleAssessment.functionalUnit}</span>
                                </div>
                              </div>
                              
                              <div className="h-[200px] w-full mb-6 relative">
                               <ResponsiveContainer width="100%" height="100%">
                                 <BarChart data={result.lifeCycleAssessment.phases}>
                                   <XAxis dataKey="phase" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
                                   <YAxis yAxisId="left" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} orientation="left"/>
                                   <YAxis yAxisId="right" orientation="right" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
                                   <Tooltip 
                                     contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-glow)', borderRadius: '8px' }}
                                     cursor={{ fill: 'transparent' }}
                                    />
                                   <Bar yAxisId="left" dataKey="energy" name="Energy (MJ)" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} />
                                   <Bar yAxisId="right" dataKey="ghg" name="GHG (kgCO2e)" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
                                 </BarChart>
                               </ResponsiveContainer>
                              </div>
                              
                              <div className="space-y-4 mb-6">
                                <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest block mb-2">Resource Efficiency</span>
                                {result.lifeCycleAssessment.resourceEfficiency.map((res, idx) => (
                                  <div key={idx} className="flex justify-between items-center text-xs">
                                     <span className="text-[var(--text-secondary)] w-1/4">{res.resource}</span>
                                     <span className="text-[var(--text-secondary)] font-mono w-1/4 text-center line-through opacity-70">{res.convMethod}</span>
                                     <span className="text-[var(--accent-emerald)] dark:text-emerald-400 font-mono font-bold w-1/4 text-center">{res.thisStudy}</span>
                                     <span className="bg-emerald-500/20 text-[var(--accent-emerald)] dark:text-emerald-400 px-2 py-0.5 rounded w-1/4 text-center">-{res.saving}</span>
                                  </div>
                                ))}
                              </div>

                              <div className="bg-emerald-900/30 p-4 rounded-xl border border-emerald-500/30 flex justify-between items-center">
                                <div>
                                  <span className="text-[10px] text-[var(--accent-emerald)] dark:text-emerald-400 uppercase tracking-widest block mb-1">Net GHG Reduction</span>
                                  <span className="text-xl font-bold text-[var(--accent-emerald)] dark:text-emerald-400 font-mono">{result.lifeCycleAssessment.netGhgPosition.reductionAchieved}</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest block mb-1">EU RED III</span>
                                  <span className={`text-xs font-bold uppercase ${result.lifeCycleAssessment.netGhgPosition.euRedIIIMet ? 'text-[var(--accent-emerald)] dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                                    {result.lifeCycleAssessment.netGhgPosition.euRedIIIMet ? 'MET' : 'NOT MET'}
                                  </span>
                                </div>
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* 🚀 RESEARCH PATHWAY */}
                        <div className="bg-[var(--card-bg)] shadow-card rounded-3xl border border-[var(--border-glow)] overflow-hidden">
                          <div className="bg-amber-600/10 px-8 py-6 border-b border-[var(--border-glow)]">
                            <h3 className="text-amber-700 dark:text-amber-400 font-bold text-lg uppercase tracking-widest flex items-center">
                              <i className="fas fa-route mr-3 text-amber-700 dark:text-amber-400"></i>
                              {isArabic ? 'مسار البحث' : 'Research Pathway'}
                            </h3>
                          </div>
                          <div className="p-8 relative">
                            <div className="absolute top-8 bottom-8 left-12 w-0.5 bg-[var(--border-glow)]"></div>
                            
                            <div className="relative pl-10 mb-8">
                               <div className="absolute left-[-5px] top-1 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-[var(--bg-main)]"></div>
                               <h4 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-widest mb-1">Phase 1: Lab</h4>
                               <div className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border-glow)] mt-2">
                                 <div className="flex justify-between text-xs mb-2">
                                   <span className="text-[var(--text-primary)] font-bold">{result.researchPathway.lab.scale}</span>
                                   <span className="text-amber-700 dark:text-amber-400 font-mono">{result.researchPathway.lab.duration}</span>
                                 </div>
                                 <p className="text-sm text-[var(--text-secondary)]">{result.researchPathway.lab.goal}</p>
                               </div>
                            </div>
                            
                            <div className="relative pl-10 mb-8">
                               <div className="absolute left-[-5px] top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-[var(--bg-main)]"></div>
                               <h4 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-widest mb-1">Phase 2: Pilot</h4>
                               <div className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border-glow)] mt-2">
                                 <div className="flex justify-between text-xs mb-2">
                                   <span className="text-[var(--text-primary)] font-bold">{result.researchPathway.pilot.scale}</span>
                                   <span className="text-amber-700 dark:text-amber-400 font-mono">{result.researchPathway.pilot.duration}</span>
                                 </div>
                                 <p className="text-sm text-[var(--text-secondary)]">{result.researchPathway.pilot.goal}</p>
                               </div>
                            </div>
                            
                            <div className="relative pl-10">
                               <div className="absolute left-[-5px] top-1 w-3 h-3 rounded-full bg-purple-500 ring-4 ring-[var(--bg-main)]"></div>
                               <h4 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-widest mb-1">Phase 3: Commercial</h4>
                               <div className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border-glow)] mt-2">
                                 <div className="flex justify-between text-xs mb-2">
                                   <span className="text-[var(--text-primary)] font-bold">{result.researchPathway.commercial.scale}</span>
                                   <span className="text-amber-700 dark:text-amber-400 font-mono">{result.researchPathway.commercial.timeline}</span>
                                 </div>
                                 <p className="text-sm text-[var(--text-secondary)]">{result.researchPathway.commercial.goal}</p>
                               </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-8">
                            {/* 💰 FUNDING & COLLAB */}
                            <div className="bg-[var(--card-bg)] shadow-card rounded-3xl border border-[var(--border-glow)] overflow-hidden">
                              <div className="bg-indigo-500/10 px-8 py-6 border-b border-[var(--border-glow)]">
                                <h3 className="text-indigo-400 font-bold text-lg uppercase tracking-widest flex items-center">
                                  <i className="fas fa-handshake mr-3 text-indigo-400"></i>
                                  {isArabic ? 'التمويل والتعاون' : 'Funding & Collab'}
                               </h3>
                              </div>
                              <div className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border-glow)]">
                                    <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest block mb-1">Best Fit Funder</span>
                                    <span className="font-bold text-[var(--text-primary)]">{result.fundingMatch.bestFit}</span>
                                  </div>
                                  <div className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border-glow)]">
                                    <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest block mb-1">Grant Type</span>
                                    <span className="font-bold text-[var(--text-primary)]">{result.fundingMatch.grantType}</span>
                                  </div>
                                </div>
                                <div className="bg-indigo-900/20 p-4 rounded-xl border border-indigo-500/30">
                                  <span className="text-[10px] text-indigo-400 uppercase tracking-widest block mb-2">Funding Frame</span>
                                  <span className="text-sm font-medium text-[var(--text-secondary)] italic">"{result.fundingMatch.frameItAs}"</span>
                                </div>
                                
                                <div className="border-t border-[var(--border-glow)] pt-6">
                                   <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest block mb-3">Recommended Collaboration</span>
                                   <ul className="space-y-3">
                                      <li className="flex items-start text-sm"><i className="fas fa-university text-[var(--text-secondary)] mr-3 mt-1 w-4"></i> <span className="font-medium text-[var(--text-primary)]">{result.recommendedCollaboration.internal}</span></li>
                                      <li className="flex items-start text-sm"><i className="fas fa-globe text-[var(--text-secondary)] mr-3 mt-1 w-4"></i> <span className="font-medium text-[var(--text-primary)]">{result.recommendedCollaboration.external}</span></li>
                                      <li className="flex items-start text-sm"><i className="fas fa-industry text-[var(--text-secondary)] mr-3 mt-1 w-4"></i> <span className="font-medium text-[var(--text-primary)]">{result.recommendedCollaboration.industry}</span></li>
                                   </ul>
                                </div>
                              </div>
                            </div>

                            {/* ⚠️ LIMITATIONS & REVIEWS */}
                            <div className="bg-[var(--card-bg)] shadow-card rounded-3xl border border-[var(--border-glow)] overflow-hidden">
                              <div className="bg-red-600/10 px-8 py-4 border-b border-[var(--border-glow)]">
                                <h3 className="text-red-700 dark:text-red-400 font-bold text-sm uppercase tracking-widest flex items-center">
                                  <i className="fas fa-triangle-exclamation mr-3 text-red-700 dark:text-red-400"></i>
                                  {isArabic ? 'القيود والثقة' : 'Limitations & Confidence'}
                               </h3>
                              </div>
                              <div className="p-8 space-y-6">
                                <div className="space-y-3">
                                  {result.limitations.map((lim, i) => (
                                    <div key={i} className="bg-[var(--bg-main)] p-3 rounded-xl border border-[var(--border-glow)] flex gap-3">
                                      <i className="fas fa-radiation text-red-700 dark:text-red-400 mt-1 shrink-0"></i>
                                      <div>
                                        <div className="text-sm font-bold text-[var(--text-primary)]">{lim.limitation}</div>
                                        <div className="text-xs text-[var(--text-secondary)] mt-1">Mitigation: {lim.mitigation}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="flex gap-2">
                                  <div className="flex-1 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20 text-center">
                                    <div className="text-[10px] text-[var(--accent-emerald)] dark:text-emerald-400 uppercase tracking-widest mb-1">HIGH Confidence</div>
                                    <div className="text-xs text-[var(--text-primary)]">{result.dataConfidence.high}</div>
                                  </div>
                                  <div className="flex-1 bg-amber-600/10 p-3 rounded-lg border border-amber-500/20 text-center">
                                    <div className="text-[10px] text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-1">LOW Confidence</div>
                                    <div className="text-xs text-[var(--text-primary)]">{result.dataConfidence.low}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* 📚 LITERATURE LANDSCAPE */}
                      <div className="bg-[var(--card-bg)] shadow-card rounded-3xl border border-[var(--border-glow)] overflow-hidden">
                        <div className="bg-sky-600/20 px-8 py-6 border-b border-[var(--border-glow)]">
                          <h3 className="text-sky-400 font-bold text-lg uppercase tracking-widest flex items-center">
                            <i className="fas fa-book-reader mr-3 text-sky-400"></i>
                            {isArabic ? 'المشهد الأدبي للبحث' : 'Literature Landscape'}
                          </h3>
                        </div>
                        <div className="p-8 space-y-6">
                           <div className="grid grid-cols-3 gap-2">
                             <div className="bg-[var(--bg-main)] p-3 rounded-lg border border-[var(--border-glow)]">
                               <span className="text-[10px] text-[var(--accent-emerald)] dark:text-emerald-400 block uppercase font-black"><i className="fas fa-check mr-1"></i> Established</span>
                               <ul className="mt-2 space-y-1">
                                 {result.literatureLandscape.established.map((v,i) => <li key={i} className="text-[10px] text-[var(--text-secondary)] leading-tight">{v}</li>)}
                               </ul>
                             </div>
                             <div className="bg-[var(--bg-main)] p-3 rounded-lg border border-[var(--border-glow)]">
                               <span className="text-[10px] text-amber-700 dark:text-amber-400 block uppercase font-black"><i className="fas fa-exclamation-triangle mr-1"></i> Contested</span>
                               <ul className="mt-2 space-y-1">
                                 {result.literatureLandscape.contested.map((v,i) => <li key={i} className="text-[10px] text-[var(--text-secondary)] leading-tight">{v}</li>)}
                               </ul>
                             </div>
                             <div className="bg-[var(--bg-main)] p-3 rounded-lg border border-[var(--border-glow)]">
                               <span className="text-[10px] text-red-700 dark:text-red-400 block uppercase font-black"><i className="fas fa-question-circle mr-1"></i> Unknown (Gap)</span>
                               <ul className="mt-2 space-y-1">
                                 {result.literatureLandscape.unknown.map((v,i) => <li key={i} className="text-[10px] text-[var(--text-secondary)] leading-tight">{v}</li>)}
                               </ul>
                             </div>
                           </div>

                           <div>
                             <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest block mb-2">Key Research Groups Worldwide</span>
                             <div className="space-y-2">
                               {result.literatureLandscape.keyResearchGroupsWorldwide.map((group, i) => (
                                 <div key={i} className="flex flex-col bg-[var(--bg-main)] px-3 py-2 rounded-lg border border-[var(--border-glow)]">
                                    <span className="text-xs font-bold text-[var(--text-primary)]">{group.group}</span>
                                    <span className="text-[10px] text-sky-400">{group.focus}</span>
                                 </div>
                               ))}
                             </div>
                           </div>

                           <div className="flex flex-col md:flex-row gap-4">
                             <div className="flex-1">
                               <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest block mb-2">Target Journals</span>
                               <div className="space-y-2">
                                 {result.literatureLandscape.targetJournals.map((journal, i) => (
                                   <div key={i} className="flex justify-between items-center text-xs">
                                      <span className="text-[var(--text-secondary)]">{journal.journal}</span>
                                      <span className="bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded text-[10px] font-bold">IF {journal.impactFactor}</span>
                                   </div>
                                 ))}
                               </div>
                             </div>
                             <div className="flex-1">
                               <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest block mb-2">Query Terms</span>
                               <div className="flex flex-wrap gap-1">
                                 {result.literatureLandscape.searchTerms.map((term, i) => (
                                   <span key={i} className="px-2 py-0.5 bg-gray-500/10 text-[var(--text-secondary)] border border-gray-500/20 rounded string text-[10px]">
                                     {term}
                                   </span>
                                 ))}
                               </div>
                             </div>
                           </div>
                        </div>
                      </div>

                      {/* 🎯 RESEARCH OUTPUT PLAN */}
                      <div className="bg-[var(--card-bg)] shadow-card rounded-3xl border border-[var(--border-glow)] overflow-hidden">
                        <div className="bg-fuchsia-600/20 px-8 py-6 border-b border-[var(--border-glow)]">
                          <h3 className="text-fuchsia-400 font-bold text-lg uppercase tracking-widest flex items-center">
                            <i className="fas fa-bullseye mr-3 text-fuchsia-400"></i>
                            {isArabic ? 'خطة الإنتاج البحثي' : 'Research Output Plan'}
                          </h3>
                        </div>
                        <div className="p-8 space-y-6">
                           <div>
                             <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest block mb-2">Publications Pipeline</span>
                             <div className="space-y-2">
                               {result.researchOutputPlan.publications.map((pub, i) => (
                                 <div key={i} className="flex flex-col bg-[var(--bg-main)] p-3 rounded-lg border border-fuchsia-500/30 border-l-4">
                                    <span className="text-xs font-bold text-[var(--text-primary)]">{pub.topic}</span>
                                    <div className="flex justify-between mt-1 text-[10px]">
                                      <span className="text-fuchsia-400">{pub.journal} (IF {pub.targetIF})</span>
                                      <span className="text-[var(--text-secondary)] font-mono">{pub.timeline}</span>
                                    </div>
                                 </div>
                               ))}
                             </div>
                           </div>

                           <div className="grid grid-cols-2 gap-4">
                             <div className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border-glow)]">
                               <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest block mb-1">Target Conference</span>
                               <span className="font-bold text-[var(--text-primary)] text-xs block">{result.researchOutputPlan.conference.name}</span>
                               <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono mt-1 block">{result.researchOutputPlan.conference.deadline} | {result.researchOutputPlan.conference.location}</span>
                             </div>
                             <div className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border-glow)]">
                               <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest block mb-1">IP & Patents</span>
                               <span className="font-bold text-[var(--text-primary)] text-xs block">Potential: {result.researchOutputPlan.intellectualProperty.patentPotential}</span>
                               <span className="text-[10px] text-fuchsia-400 mt-1 block">Contact: {result.researchOutputPlan.intellectualProperty.contact}</span>
                             </div>
                           </div>

                           <div className="pt-4 border-t border-[var(--border-glow)]">
                             <div className="grid grid-cols-3 gap-3 text-center">
                               <div className="flex flex-col">
                                 <span className="text-2xl font-black text-fuchsia-400">{result.researchOutputPlan.capacityBuilding.mscTrained + result.researchOutputPlan.capacityBuilding.phdTrained}</span>
                                 <span className="text-[10px] text-[var(--text-secondary)] uppercase block">Students Trained</span>
                               </div>
                               <div className="flex flex-col">
                                 <span className="text-2xl font-black text-fuchsia-400">{result.researchOutputPlan.kpis.citationsTarget}</span>
                                 <span className="text-[10px] text-[var(--text-secondary)] uppercase block">Citation Target</span>
                               </div>
                               <div className="flex flex-col">
                                 <span className="text-2xl font-black text-fuchsia-400">{result.researchOutputPlan.kpis.industryEngaged ? 'YES' : 'NO'}</span>
                                 <span className="text-[10px] text-[var(--text-secondary)] uppercase block">Industry Pilot</span>
                               </div>
                             </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
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
              className="text-xs font-black text-red-700 dark:text-red-400 uppercase tracking-widest hover:text-red-700 dark:text-red-400 transition"
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
                        <h4 className="font-bold text-[var(--text-primary)] group-hover:text-blue-700 dark:text-blue-400 transition">{entry.topic}</h4>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">{entry.timestamp}</p>
                      </div>
                      <i className="fas fa-chevron-right text-[var(--text-secondary)] group-hover:text-blue-700 dark:text-blue-400 transition"></i>
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
