import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProposalInput, ProposalResult, ProposalHistoryEntry } from './types';
import { generateProposal } from './geminiService';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const renderSectionContent = (content: string | string[] | undefined) => {
  if (!content) return null;
  if (Array.isArray(content)) {
    return (
      <ul className="list-outside ml-6 list-disc text-[var(--text-secondary)] leading-relaxed space-y-3">
        {content.map((item, idx) => (
          <li key={idx} className="pl-1">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{p: 'span'}}
            >
              {item}
            </ReactMarkdown>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="text-[var(--text-secondary)] leading-relaxed space-y-4 markdown-body text-sm font-sans">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

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

export const ProposalGenerator: React.FC<{ language?: 'English' | 'Arabic' }> = ({ language = 'Arabic' }) => {
  const [inputs, setInputs] = useState<ProposalInput>({
    projectName: '',
    feedstock: '',
    biofuelType: 'Biodiesel',
    capacity: '',
    budget: '',
    targetAudience: 'MoHERI (Academic/Research)',
    language: language
  });

  React.useEffect(() => {
    setInputs(prev => ({ ...prev, language }));
  }, [language]);

  const [status, setStatus] = useState<'IDLE' | 'GENERATING' | 'COMPLETED' | 'ERROR'>('IDLE');
  const [result, setResult] = useState<ProposalResult | null>(null);
  const [history, setHistory] = useState<ProposalHistoryEntry[]>([]);

  const PROPOSAL_HISTORY_KEY = 'biofuel_insight_proposal_history';

  React.useEffect(() => {
    const saved = localStorage.getItem(PROPOSAL_HISTORY_KEY);
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch(e) {}
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem(PROPOSAL_HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('GENERATING');
    try {
      const res = await generateProposal(inputs);
      setResult(res);
      setStatus('COMPLETED');
      setHistory(prev => [{
        id: res.id,
        timestamp: res.timestamp,
        projectName: inputs.projectName || 'Untitled Project',
        targetAudience: inputs.targetAudience,
        fullData: res
      }, ...prev]);
    } catch (err) {
      console.error(err);
      setStatus('ERROR');
    }
  };

  const downloadPDF = async () => {
    const element = document.getElementById('proposal-report');
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Proposal_${inputs.projectName || 'Project'}_${new Date().getTime()}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };

    
  return (
    <div className="flex flex-col lg:flex-row gap-8" dir={location ? 'rtl' : 'ltr'}>
      {/* Left Column: Form & History */}
      <div className="w-full lg:w-1/3 space-y-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[var(--card-bg)] shadow-card  p-6 rounded-3xl  border border-[var(--border-glow)] hover:border-#8B5CF6 transition-all duration-300"
        >
          <h2 className="text-xl font-black text-[#8B5CF6] mb-6 flex items-center drop-shadow-md">
            <i className="fas fa-file-signature mx-3"></i> {language === 'Arabic' ? 'تفاصيل المقترح' : 'Proposal Details'}
          </h2>
          <form onSubmit={handleGenerate} className="space-y-4">
            
            <div className="bg-[var(--bg-main)] p-3 rounded-xl border border-[var(--border-glow)] mb-4">
              <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">اللغة / Language</label>
              <select 
                name="language" 
                value={inputs.language} 
                onChange={handleInputChange}
                className="w-full bg-[var(--card-bg)] shadow-card border border-[var(--border-glow)] rounded-lg px-3 py-2 text-sm font-bold text-[#8B5CF6] outline-none shadow-sm"
              >
                <option value="Arabic">العربية (Arabic)</option>
                <option value="English">English</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{language === 'Arabic' ? 'اسم المشروع' : 'Project Name'}</label>
              <input 
                type="text" 
                name="projectName" 
                required
                value={inputs.projectName} 
                onChange={handleInputChange}
                placeholder={language === 'Arabic' ? "مثال: مبادرة عمان للوقود الأخضر" : "e.g., Oman Green Fuel Initiative"}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-glow)] rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-primary)] focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all outline-none placeholder:text-[var(--text-secondary)]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{language === 'Arabic' ? 'الجهة المانحة / المستثمر' : 'Target Audience'}</label>
              <select 
                name="targetAudience" 
                value={inputs.targetAudience} 
                onChange={handleInputChange}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-glow)] rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-primary)] focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all outline-none"
                dir={location ? 'rtl' : 'ltr'}
              >
                <option value="MoHERI (Academic/Research)" className="bg-[var(--bg-main)]">{language === 'Arabic' ? 'البحث العلمي (MoHERI)' : 'MoHERI (Academic/Research Grant)'}</option>
                <option value="PDO/OQ (Industrial/Commercial)" className="bg-[var(--bg-main)]">{language === 'Arabic' ? 'تنمية نفط عمان / أوكيو (استثمار صناعي)' : 'PDO / OQ (Industrial Investment)'}</option>
                <option value="OTF (Startup/VC)" className="bg-[var(--bg-main)]">{language === 'Arabic' ? 'الصندوق العماني للتكنولوجيا (شركات ناشئة)' : 'Oman Technology Fund (Startup/VC)'}</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{language === 'Arabic' ? 'المادة الخام' : 'Feedstock'}</label>
                <input 
                  type="text" 
                  name="feedstock" 
                  required
                  value={inputs.feedstock} 
                  onChange={handleInputChange}
                  placeholder={language === 'Arabic' ? 'زيت الطبخ المستخدم' : "e.g., Used Cooking Oil"}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-glow)] rounded-xl px-4 py-2 text-sm font-medium text-[var(--text-primary)] focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all outline-none placeholder:text-[var(--text-secondary)]"
                  dir={location ? 'rtl' : 'ltr'}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{language === 'Arabic' ? 'نوع المشروع/الوقود' : 'Project / Energy Type'}</label>
                <select 
                  name="biofuelType" 
                  value={inputs.biofuelType} 
                  onChange={handleInputChange}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-glow)] rounded-xl px-4 py-2 text-sm font-medium text-[var(--text-primary)] focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all outline-none"
                  dir={location ? 'rtl' : 'ltr'}
                >
                  <option value="Solar Farm" className="bg-[var(--bg-main)]">{language === 'Arabic' ? 'محطة طاقة شمسية' : 'Solar Farm'}</option>
                  <option value="Green Hydrogen" className="bg-[var(--bg-main)]">{language === 'Arabic' ? 'هيدروجين أخضر (التحليل الكهربائي)' : 'Green Hydrogen Electrolysis'}</option>
                  <option value="Biodiesel" className="bg-[var(--bg-main)]">{language === 'Arabic' ? 'الديزل الحيوي' : 'Biodiesel'}</option>
                  <option value="SAF" className="bg-[var(--bg-main)]">{language === 'Arabic' ? 'وقود الطيران المستدام (SAF)' : 'SAF'}</option>
                  <option value="Waste-to-Energy" className="bg-[var(--bg-main)]">{language === 'Arabic' ? 'تحويل النفايات إلى طاقة' : 'Waste-to-Energy'}</option>
                  <option value="Biogas" className="bg-[var(--bg-main)]">{language === 'Arabic' ? 'الغاز الحيوي' : 'Biogas'}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{language === 'Arabic' ? 'حجم الإنتاج / القدرة' : 'Target Capacity'}</label>
                <input 
                  type="text" 
                  name="capacity" 
                  required
                  value={inputs.capacity} 
                  onChange={handleInputChange}
                  placeholder={language === 'Arabic' ? 'مثال: 500 لتر/يوم، أو 1000 kW (للطاقة الشمسية)' : "e.g., 500 L/Day, or 1000 kW (for Solar)"}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-glow)] rounded-xl px-4 py-2 text-sm font-medium text-[var(--text-primary)] focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all outline-none placeholder:text-[var(--text-secondary)]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{language === 'Arabic' ? 'الميزانية' : 'Estimated Budget'}</label>
                <input 
                  type="text" 
                  name="budget" 
                  required
                  value={inputs.budget} 
                  onChange={handleInputChange}
                  placeholder={language === 'Arabic' ? '50,000 ريال' : "e.g., 50,000 OMR"}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-glow)] rounded-xl px-4 py-2 text-sm font-medium text-[var(--text-primary)] focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all outline-none placeholder:text-[var(--text-secondary)]"
                />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={status === 'GENERATING'}
              className={`w-full mt-6 text-[var(--text-primary)] font-black py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-3 border border-transparent ${
                status === 'GENERATING' ? 'bg-[var(--bg-main)] cursor-not-allowed text-[var(--text-secondary)] border-[var(--border-glow)]' : 'bg-[var(--card-bg)] shadow-[0_0_40px_-10px_rgba(139,92,246,0.5)] hover:shadow-[0_0_60px_-10px_rgba(139,92,246,0.6)] border-[#8B5CF6]/50 hover:border-[#8B5CF6] text-[#8B5CF6]'
              }`}
            >
              {status === 'GENERATING' ? (
                <><i className="fas fa-circle-notch fa-spin text-xl"></i><span>{language === 'Arabic' ? 'جاري كتابة المقترح...' : 'Drafting Proposal...'}</span></>
              ) : (
                <><i className="fas fa-bolt text-xl"></i><span className="tracking-widest uppercase">{language === 'Arabic' ? 'توليد مسودة المقترح' : 'Generate Proposal'}</span></>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* History Section */}
        {history.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[var(--card-bg)] shadow-card  p-6 rounded-3xl  border border-[var(--border-glow)]"
          >
            <h3 className="text-sm font-black text-[var(--text-primary)] mb-4 uppercase tracking-widest">{language === 'Arabic' ? 'السجل' : 'Recent Proposals'}</h3>
            <div className="space-y-3">
              {history.map((entry) => (
                <div 
                  key={entry.id} 
                  onClick={() => { setResult(entry.fullData); setStatus('COMPLETED'); }}
                  className="p-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border-glow)] cursor-pointer hover:bg-[var(--bg-main)] hover:border-#8B5CF6 transition-colors"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-[var(--text-secondary)] truncate pr-2">{entry.projectName}</span>
                  </div>
                  <div className="text-[10px] text-[#8B5CF6] font-bold truncate mb-1">{entry.targetAudience}</div>
                  <div className="text-[10px] text-[var(--text-secondary)]">{entry.timestamp}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Right Column: Results Dashboard */}
      <div className="w-full lg:w-2/3">
        <AnimatePresence mode="wait">
          {status === 'IDLE' && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-[var(--text-secondary)] p-12 border-2 border-dashed border-slate-200 rounded-3xl"
            >
              <i className="fas fa-file-contract text-6xl mb-4 text-[var(--text-secondary)]"></i>
              <p className="text-lg font-medium">{language === 'Arabic' ? 'أدخل التفاصيل لإنشاء مقترح رسمي.' : 'Enter project details to generate a formal proposal.'}</p>
            </motion.div>
          )}

          {status === 'GENERATING' && (
            <motion.div 
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-[var(--accent-emerald)] dark:text-emerald-400 p-12"
            >
              <i className="fas fa-pen-nib fa-bounce text-6xl mb-6"></i>
              <h3 className="text-2xl font-black mb-2">{language === 'Arabic' ? 'جاري كتابة المقترح...' : 'Drafting Proposal...'}</h3>
              <p className="text-[var(--text-secondary)]">{language === 'Arabic' ? 'يتم التوافق مع رؤية عمان 2040 وبناء الجداول المالية.' : 'Aligning with Oman Vision 2040 and structuring arguments.'}</p>
            </motion.div>
          )}

          {status === 'ERROR' && (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-red-700 dark:text-red-400 p-12"
            >
              <i className="fas fa-exclamation-triangle text-6xl mb-4"></i>
              <h3 className="text-2xl font-black mb-2">{language === 'Arabic' ? "فشل الإنشاء" : "Generation Failed"}</h3>
              <p className="text-[var(--text-secondary)]">{language === 'Arabic' ? "يرجى التحقق من مفتاح API والمحاولة مرة أخرى." : "Please check your API key and try again."}</p>
            </motion.div>
          )}

          {status === 'COMPLETED' && result && (
            <motion.div 
              key="completed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className={`flex ${language === 'Arabic' ? 'justify-end' : 'justify-end'} mb-4`}>
                <button 
                  onClick={downloadPDF}
                  className="bg-[var(--card-bg)] shadow-card hover:bg-[var(--bg-main)] text-[var(--text-primary)] px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-colors shadow-card"
                >
                  <i className="fas fa-file-pdf mx-2 text-red-700 dark:text-red-400"></i> {language === 'Arabic' ? 'تحميل التقرير كـ PDF' : 'Download PDF Proposal'}
                </button>
              </div>

              
              <div id="proposal-report" className="bg-[var(--card-bg)] shadow-card p-10 rounded-3xl border border-[var(--border-glow)] prose prose-invert max-w-none relative">
                {/* PDF BRANDING HEADER */}
                <div className="absolute top-8 left-8 right-8 flex justify-between items-start opacity-30 select-none pointer-events-none">
                  <div className="flex items-center space-x-2 grayscale">
                    <i className="fas fa-leaf text-2xl"></i>
                    <span className="text-xl font-black tracking-tighter text-[var(--text-primary)]">
                      {language === 'Arabic' ? <>عُمَان <span className="text-[#8B5CF6]">إيكوسينك</span></> : <>OMAN <span className="text-[#8B5CF6]">ECOSYNC</span></>}
                    </span>
                  </div>
                  <div className="text-[8px] font-black tracking-[0.2em] uppercase text-right text-[var(--text-secondary)]">
                    {language === 'Arabic' ? 'نموذج مقترح معتمد آلياً' : 'Automated Certified Proposal'} <br/>
                    {result.timestamp}
                  </div>
                </div>

                <div className="text-center mb-10 border-b border-[var(--border-glow)] pb-8 mt-12">
                  <h1 className="text-3xl font-black text-[var(--text-primary)] mb-4">{result.title}</h1>
                  <p className="text-sm font-bold text-[#8B5CF6] uppercase tracking-widest">
                    {language === 'Arabic' ? 'أُعد خصيصاً لـ: ' : 'Prepared for: '} <span className="text-[var(--text-secondary)]">{inputs.targetAudience}</span>
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] mt-2">{language === 'Arabic' ? 'تاريخ الإصدار: ' : 'Generated on '}{result.timestamp}</p>
                </div>

                <div className="space-y-8">
                  {/* 1. Executive Summary */}
                  <section className="bg-[var(--card-bg)] shadow-card p-6 md:p-8 rounded-3xl border border-[var(--border-glow)] overflow-hidden">
                    <h2 className={`text-xl font-black text-[var(--text-primary)] mb-6 flex items-center gap-4`}>
                      <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] border border-[#8B5CF6]/20 shrink-0">
                        <i className="fas fa-chart-pie text-xl"></i>
                      </div>
                      <span className="leading-tight">1. {language === 'Arabic' ? 'الملخص التنفيذي' : 'Executive Summary'}</span>
                    </h2>
                    {renderSectionContent(result.executiveSummary)}
                  </section>

                  {/* 2. Problem Statement */}
                  <section className="bg-[var(--card-bg)] shadow-card p-6 md:p-8 rounded-3xl border border-[var(--border-glow)] overflow-hidden">
                    <h2 className={`text-xl font-black text-[var(--text-primary)] mb-6 flex items-center gap-4`}>
                      <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] border border-[#8B5CF6]/20 shrink-0">
                        <i className="fas fa-exclamation-triangle text-xl"></i>
                      </div>
                      <span className="leading-tight">2. {language === 'Arabic' ? 'بيان المشكلة المقترحة' : 'Problem Statement'}</span>
                    </h2>
                    {renderSectionContent(result.problemStatement)}
                  </section>

                  {/* 3. Market Opportunity */}
                  <section className="bg-[var(--card-bg)] shadow-card p-6 md:p-8 rounded-3xl border border-[var(--border-glow)] overflow-hidden">
                    <h2 className={`text-xl font-black text-[var(--text-primary)] mb-6 flex items-center gap-4`}>
                      <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] border border-[#8B5CF6]/20 shrink-0">
                        <i className="fas fa-globe-americas text-xl"></i>
                      </div>
                      <span className="leading-tight">3. {language === 'Arabic' ? 'الفرصة السوقية' : 'Market Opportunity'}</span>
                    </h2>
                    {renderSectionContent(result.marketOpportunity)}
                  </section>

                  {/* 4. Competitive Advantage */}
                  <section className="bg-[var(--card-bg)] shadow-card p-6 md:p-8 rounded-3xl border border-[var(--border-glow)] overflow-hidden">
                    <h2 className={`text-xl font-black text-[var(--text-primary)] mb-6 flex items-center gap-4`}>
                      <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] border border-[#8B5CF6]/20 shrink-0">
                        <i className="fas fa-trophy text-xl"></i>
                      </div>
                      <span className="leading-tight">4. {language === 'Arabic' ? 'الميزة التنافسية' : 'Competitive Advantage'}</span>
                    </h2>
                    {renderSectionContent(result.competitiveAdvantage)}
                  </section>

                   {/* 5. Business Model */}
                   <section className="bg-[var(--card-bg)] shadow-card p-6 md:p-8 rounded-3xl border border-[var(--border-glow)] overflow-hidden">
                    <h2 className={`text-xl font-black text-[var(--text-primary)] mb-6 flex items-center gap-4`}>
                      <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] border border-[#8B5CF6]/20 shrink-0">
                        <i className="fas fa-project-diagram text-xl"></i>
                      </div>
                      <span className="leading-tight">5. {language === 'Arabic' ? 'نموذج العمل' : 'Business Model'}</span>
                    </h2>
                    {renderSectionContent(result.businessModel)}
                  </section>

                   {/* 6. Revenue Streams */}
                   <section className="bg-[var(--card-bg)] shadow-card p-6 md:p-8 rounded-3xl border border-[var(--border-glow)] overflow-hidden">
                    <h2 className={`text-xl font-black text-[var(--text-primary)] mb-6 flex items-center gap-4`}>
                      <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] border border-[#8B5CF6]/20 shrink-0">
                        <i className="fas fa-money-bill-wave text-xl"></i>
                      </div>
                      <span className="leading-tight">6. {language === 'Arabic' ? 'مصادر الإيرادات' : 'Revenue Streams'}</span>
                    </h2>
                    {renderSectionContent(result.revenueStreams)}
                  </section>

                   {/* 7. Technical Overview */}
                   <section className="bg-[var(--card-bg)] shadow-card p-6 md:p-8 rounded-3xl border border-[var(--border-glow)] overflow-hidden">
                    <h2 className={`text-xl font-black text-[var(--text-primary)] mb-6 flex items-center gap-4`}>
                      <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] border border-[#8B5CF6]/20 shrink-0">
                        <i className="fas fa-cogs text-xl"></i>
                      </div>
                      <span className="leading-tight">7. {language === 'Arabic' ? 'نظرة عامة تقنية وتشغيلية' : 'Technical & Operational Overview'}</span>
                    </h2>
                    {renderSectionContent(result.technicalOverview)}
                  </section>

                  {/* 8. Raw Material / Feedstock Strategy */}
                  <section className="bg-[var(--card-bg)] shadow-card p-6 md:p-8 rounded-3xl border border-[var(--border-glow)] overflow-hidden">
                    <h2 className={`text-xl font-black text-[var(--text-primary)] mb-6 flex items-center gap-4`}>
                      <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] border border-[#8B5CF6]/20 shrink-0">
                        <i className="fas fa-boxes text-xl"></i>
                      </div>
                      <span className="leading-tight">8. {language === 'Arabic' ? 'استراتيجية المواد الخام' : 'Raw Material / Feedstock Strategy'}</span>
                    </h2>
                    {renderSectionContent(result.feedstockStrategy)}
                  </section>

                  {/* 9. Financial Model */}
                  <section className="bg-[var(--bg-main)] p-6 rounded-2xl border border-[var(--border-glow)]">
                    <h2 className={`text-xl font-black text-[var(--text-primary)] mb-6 flex items-center gap-4`}>
                      <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] border border-[#8B5CF6]/20 shrink-0">
                        <i className="fas fa-calculator text-xl"></i>
                      </div>
                      <span className="leading-tight">9. {language === 'Arabic' ? 'النموذج المالي ومقترح التمويل' : 'Financial Model & Funding Proposal'}</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-[var(--card-bg)] shadow-card p-4 rounded-xl border border-[var(--border-glow)]">
                        <div className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">{language === 'Arabic' ? 'رأس المال المطلوب' : 'CAPEX'}</div>
                        <div className="text-lg font-black text-emerald-500">{result.financialModel?.totalCapex}</div>
                      </div>
                      <div className="bg-[var(--card-bg)] shadow-card p-4 rounded-xl border border-[var(--border-glow)]">
                        <div className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">{language === 'Arabic' ? 'التشغيل السنوي' : 'OPEX'}</div>
                        <div className="text-lg font-black text-[var(--text-primary)]">{result.financialModel?.annualOpex}</div>
                      </div>
                      <div className="bg-[var(--card-bg)] shadow-card p-4 rounded-xl border border-[var(--border-glow)]">
                        <div className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">{language === 'Arabic' ? 'معدل العائد' : 'ROI'}</div>
                        <div className="text-lg font-black text-emerald-500">{result.financialModel?.roiPercentage}</div>
                      </div>
                      <div className="bg-[var(--card-bg)] shadow-card p-4 rounded-xl border border-[var(--border-glow)]">
                        <div className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">{language === 'Arabic' ? 'فترة الاسترداد' : 'Payback'}</div>
                        <div className="text-lg font-black text-[#8B5CF6]">{result.financialModel?.paybackPeriod}</div>
                      </div>
                    </div>

                    <h3 className="font-bold text-[var(--text-primary)] mb-2 mt-4">{language === 'Arabic' ? 'جدول العوائد للاستثمار' : 'Installment & Return Schedule'}</h3>
                    <div className="overflow-x-auto text-[10px] sm:text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-[var(--border-glow)] text-[var(--text-secondary)] uppercase tracking-wider">
                            <th className={`py-2 px-3 ${language === 'Arabic' ? 'text-right' : 'text-left'}`}>{language === 'Arabic' ? 'السنة' : 'Year'}</th>
                            <th className={`py-2 px-3 ${language === 'Arabic' ? 'text-right' : 'text-left'}`}>{language === 'Arabic' ? 'المبلغ' : 'Amount'}</th>
                            <th className={`py-2 px-3 ${language === 'Arabic' ? 'text-right' : 'text-left'}`}>{language === 'Arabic' ? 'الوصف' : 'Description'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-glow)] text-[var(--text-primary)]">
                          {result.financialModel?.installmentSchedule?.map((inst, i) => (
                            <tr key={i} className="hover:bg-[#10B981]/5">
                              <td className="py-2 px-3 font-medium whitespace-nowrap">{inst.year}</td>
                              <td className="py-2 px-3 font-mono text-[#10B981] whitespace-nowrap">{inst.amount}</td>
                              <td className="py-2 px-3 text-[var(--text-secondary)] min-w-[150px]">{inst.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>

                   {/* 10. Risk Analysis & Mitigation */}
                   <section className="bg-[var(--card-bg)] shadow-card p-6 md:p-8 rounded-3xl border border-[var(--border-glow)] overflow-hidden">
                    <h2 className={`text-xl font-black text-[var(--text-primary)] mb-6 flex items-center gap-4`}>
                      <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] border border-[#8B5CF6]/20 shrink-0">
                        <i className="fas fa-shield-alt text-xl"></i>
                      </div>
                      <span className="leading-tight">10. {language === 'Arabic' ? 'تحليل المخاطر والتخفيف' : 'Risk Analysis & Mitigation'}</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.riskAnalysis?.map((item, idx) => (
                         <div key={idx} className="bg-[var(--card-bg)] shrink shadow-card p-4 rounded-xl border border-[var(--border-glow)]">
                             <div className="font-bold text-red-700 dark:text-red-400 mb-2">{renderSectionContent(item.risk)}</div>
                             <div className="text-sm text-[var(--text-secondary)]">{renderSectionContent(item.mitigation)}</div>
                         </div>
                      ))}
                    </div>
                  </section>

                  {/* 11. ESG & Sustainability Impact (with Oman Vision 2040 included) */}
                  <section className="bg-[#8B5CF6]/10 p-6 rounded-2xl border border-#8B5CF6">
                    <h2 className={`text-xl font-black text-[var(--text-primary)] mb-6 flex items-center gap-4`}>
                      <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] border border-[#8B5CF6]/20 shrink-0">
                        <i className="fas fa-leaf text-xl"></i>
                      </div>
                      <span className="leading-tight">11. {language === 'Arabic' ? 'الأثر البيئي والاجتماعي ورؤية 2040' : 'ESG, Sustainability & Vision 2040'}</span>
                    </h2>
                    {renderSectionContent(result.esgImpact)}
                  </section>

                  {/* 12. Carbon Credit Potential */}
                  <section className="bg-[var(--card-bg)] shadow-card p-6 md:p-8 rounded-3xl border border-[var(--border-glow)] overflow-hidden">
                    <h2 className={`text-xl font-black text-[var(--text-primary)] mb-6 flex items-center gap-4`}>
                      <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] border border-[#8B5CF6]/20 shrink-0">
                        <i className="fas fa-smog text-xl"></i>
                      </div>
                      <span className="leading-tight">12. {language === 'Arabic' ? 'قيمة شهادات الكربون المتوقعة' : 'Carbon Credit Potential'}</span>
                    </h2>
                    <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <div className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">{language === 'Arabic' ? 'أطنان CO2 المستثناة' : 'Tons Saved'}</div>
                          <div className="text-xl font-black text-[var(--accent-emerald)] dark:text-emerald-400">{result.carbonCreditPotential?.estimatedTonsSaved}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">{language === 'Arabic' ? 'القيمة النقدية التقديرية' : 'Est. Monetary Value Range'}</div>
                          <div className="text-xl font-black text-[#8B5CF6]">{result.carbonCreditPotential?.monetaryValueRange}</div>
                        </div>
                      </div>
                      <div className="text-sm text-[var(--text-secondary)]">{renderSectionContent(result.carbonCreditPotential?.explanation)}</div>
                    </div>
                  </section>

                   {/* 13. Investment Proposal */}
                   <section className="bg-amber-600/5 border border-amber-500/20 p-6 rounded-2xl">
                    <h2 className={`text-xl font-black text-[var(--text-primary)] mb-6 flex items-center gap-4`}>
                      <div className="w-12 h-12 rounded-xl bg-amber-600/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shrink-0">
                        <i className="fas fa-hand-holding-usd text-xl"></i>
                      </div>
                      <span className="leading-tight">13. {language === 'Arabic' ? 'صيغة الاستثمار المعروضة' : 'Investment Proposal Offer'}</span>
                    </h2>
                    <div className="space-y-4 text-sm md:text-base">
                      <div className="flex flex-col md:flex-row md:justify-between"><span className="font-bold text-[var(--text-secondary)]">{language === 'Arabic' ? 'المبلغ المطلوب:' : 'Requested Amount:'}</span> <span className="font-black text-amber-500">{result.investmentProposal?.requestedAmount}</span></div>
                      <div className="flex flex-col md:flex-row md:justify-between"><span className="font-bold text-[var(--text-secondary)]">{language === 'Arabic' ? 'طريقة السداد:' : 'Repayment Strategy:'}</span> <span className="text-[var(--text-primary)]">{result.investmentProposal?.repaymentStrategy}</span></div>
                      <div className="flex flex-col md:flex-row md:justify-between"><span className="font-bold text-[var(--text-secondary)]">{language === 'Arabic' ? 'الهيكل وحقوق الملكية:' : 'Equity Structure:'}</span> <span className="text-[var(--text-primary)]">{result.investmentProposal?.equityStructure}</span></div>
                      <div className="flex flex-col md:flex-row md:justify-between"><span className="font-bold text-[var(--text-secondary)]">{language === 'Arabic' ? 'العوائد للمستثمر:' : 'Investor Returns:'}</span> <span className="text-[#10B981]">{result.investmentProposal?.investorReturns}</span></div>
                      <div className="pt-2 border-t border-[var(--border-glow)] mt-2">
                        <span className="font-bold text-[var(--text-secondary)] text-sm">{language === 'Arabic' ? 'استخدام التمويل:' : 'Funding Utilization Details:'}</span>
                        {renderSectionContent(result.investmentProposal?.fundingUtilization)}
                      </div>
                    </div>
                   </section>

                   {/* 14. Why Investors Should Fund */}
                   <section className="bg-[var(--card-bg)] shadow-card p-6 md:p-8 rounded-3xl border border-[var(--border-glow)] overflow-hidden">
                    <h2 className={`text-xl font-black text-[var(--text-primary)] mb-6 flex items-center gap-4`}>
                      <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] border border-[#8B5CF6]/20 shrink-0">
                        <i className="fas fa-star text-xl"></i>
                      </div>
                      <span className="leading-tight">14. {language === 'Arabic' ? 'لماذا يشكل هذا المشروع استثماراً ممتازاً؟' : 'Why Investors Should Fund This Project'}</span>
                    </h2>
                    {renderSectionContent(result.whyInvestorsShouldFund)}
                  </section>

                  {/* Additional Deliverables Separator */}
                  <div className="my-10 border-t border-[#8B5CF6]/50"></div>

                  <h1 className="text-2xl font-black text-center text-[#8B5CF6] tracking-widest">{language === 'Arabic' ? 'الملحقات والإضافات' : 'ADDITIONAL DELIVERABLES'}</h1>

                  {/* Pitch Deck Outline */}
                  <section>
                    <h2 className="text-xl font-black text-[var(--text-primary)] mb-4">{language === 'Arabic' ? 'مخطط العرض التقديمي (10 شرائح)' : '10-Slide Pitch Deck Outline'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.pitchDeckOutline?.map((slide) => (
                        <div key={slide.slideNumber} className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border-glow)]">
                            <h4 className="text-sm font-bold text-[#8B5CF6] mb-1">Slide {slide.slideNumber}: {slide.title}</h4>
                            {renderSectionContent(slide.content)}
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Investor Email & Summary */}
                  <div className="grid grid-cols-1 gap-6">
                    <section className="bg-[var(--bg-main)] p-6 rounded-2xl border border-[var(--border-glow)]">
                      <h2 className="text-sm font-black text-[var(--text-primary)] mb-4">{language === 'Arabic' ? 'قالب بريد المستثمر' : 'Investor Email Template'}</h2>
                      <div className="text-sm text-[var(--text-secondary)] font-mono bg-[var(--card-bg)] shadow-card p-4 rounded-xl leading-relaxed">{renderSectionContent(result.investorEmailTemplate)}</div>
                    </section>

                    <section className="bg-[var(--bg-main)] p-6 rounded-2xl border border-[var(--border-glow)]">
                       <h2 className="text-sm font-black text-[var(--text-primary)] mb-4">{language === 'Arabic' ? 'ملخص تنفيذي لصفحة واحدة' : 'One-Page Executive Summary'}</h2>
                       <div className="text-sm text-[var(--text-secondary)] leading-relaxed">{renderSectionContent(result.onePageSummary)}</div>
                    </section>
                  </div>

                  {/* Recommendations & Partners */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section>
                      <h2 className="text-sm font-black text-amber-500 mb-4 flex items-center"><i className="fas fa-lightbulb mr-2"></i>{language === 'Arabic' ? 'توصيات لزيادة فرصة القبول' : 'Recommendations for Approval'}</h2>
                        {renderSectionContent(result.fundingRecommendations)}
                    </section>
                    <section>
                      <h2 className="text-sm font-black text-emerald-500 mb-4 flex items-center"><i className="fas fa-handshake mr-2"></i>{language === 'Arabic' ? 'الشركاء والجهات المقترحة' : 'Suggested Partners in Oman/GCC'}</h2>
                        {renderSectionContent(result.strategicPartners)}
                    </section>
                  </div>

                  {/* Phased Scaling */}
                  <section>
                     <h2 className="text-xl font-black text-[var(--text-primary)] mb-4">{language === 'Arabic' ? 'خطة التوسع التدريجي' : 'Phased Scaling Strategy'}</h2>
                     <div className="flex flex-col space-y-4">
                       {result.phasedScalingStrategy?.map((phase, idx) => (
                          <div key={idx} className="bg-[var(--bg-main)] shadow-card p-4 rounded-xl border border-[var(--border-glow)] flex flex-col md:flex-row md:items-center">
                            <div className="flex-shrink-0 mr-4 mb-2 md:mb-0 w-40 md:border-r border-[var(--border-glow)]">
                               <div className="font-black text-[#8B5CF6] text-sm">{phase.phase}</div>
                               <div className="text-xs text-[var(--text-secondary)]">{phase.duration}</div>
                            </div>
                            <div className="flex-1 pl-0 md:pl-4">
                                {renderSectionContent(phase.milestones)}
                            </div>
                          </div>
                       ))}
                     </div>
                  </section>
</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};