import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProposalInput, ProposalResult, ProposalHistoryEntry } from './types';
import { generateProposal } from './geminiService';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
          className="bg-[var(--card-bg)]/90 shadow-card backdrop-blur-[10px] p-6 rounded-3xl  border border-[var(--border-glow)] hover:border-[#8B5CF6]/50 transition-all duration-300"
        >
          <h2 className="text-xl font-black text-[#8B5CF6] mb-6 flex items-center drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]">
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
                <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{language === 'Arabic' ? 'حجم الإنتاج' : 'Target Capacity'}</label>
                <input 
                  type="text" 
                  name="capacity" 
                  required
                  value={inputs.capacity} 
                  onChange={handleInputChange}
                  placeholder={language === 'Arabic' ? '500 لتر/يوم' : "e.g., 500 L/Day"}
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

            <button 
              type="submit" 
              disabled={status === 'GENERATING'}
              className={`w-full mt-6 text-[var(--text-primary)] font-bold py-4 px-6 rounded-xl transition-all  flex items-center justify-center space-x-2 ${
                status === 'GENERATING' ? 'bg-[var(--bg-main)] cursor-not-allowed text-[var(--text-secondary)]' : 'bg-gradient-to-r from-[#059669] to-[#10B981] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-95'
              }`}
            >
              {status === 'GENERATING' ? (
                <><i className="fas fa-circle-notch fa-spin"></i><span>{language === 'Arabic' ? 'جاري كتابة المقترح...' : 'Drafting Proposal...'}</span></>
              ) : (
                <><i className="fas fa-magic"></i><span>{language === 'Arabic' ? 'توليد مسودة المقترح' : 'Generate Proposal'}</span></>
              )}
            </button>
          </form>
        </motion.div>

        {/* History Section */}
        {history.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[var(--card-bg)]/90 shadow-card backdrop-blur-[10px] p-6 rounded-3xl  border border-[var(--border-glow)]"
          >
            <h3 className="text-sm font-black text-[var(--text-primary)] mb-4 uppercase tracking-widest">{language === 'Arabic' ? 'السجل' : 'Recent Proposals'}</h3>
            <div className="space-y-3">
              {history.map((entry) => (
                <div 
                  key={entry.id} 
                  onClick={() => { setResult(entry.fullData); setStatus('COMPLETED'); }}
                  className="p-3 bg-[var(--bg-main)]/50 rounded-xl border border-[var(--border-glow)] cursor-pointer hover:bg-[var(--bg-main)] hover:border-[#8B5CF6]/50 transition-colors"
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
              className="h-full flex flex-col items-center justify-center text-[var(--accent-emerald)] p-12"
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
              className="h-full flex flex-col items-center justify-center text-red-500 p-12"
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
                  <i className="fas fa-file-pdf mx-2 text-red-400"></i> {language === 'Arabic' ? 'تحميل التقرير كـ PDF' : 'Download PDF Proposal'}
                </button>
              </div>

              <div id="proposal-report" className="bg-[var(--card-bg)]/90 shadow-card backdrop-blur-[10px] p-10 rounded-3xl  border border-[var(--border-glow)] prose prose-invert max-w-none relative">
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
                  <section>
                    <h2 className={`text-xl font-black text-[var(--text-primary)] border-[#8B5CF6] mb-4 ${language === 'Arabic' ? 'border-r-4 pr-3' : 'border-l-4 pl-3'}`}>
                      {language === 'Arabic' ? 'الملخص التنفيذي' : 'Executive Summary'}
                    </h2>
                    <ul className="list-disc list-inside text-[var(--text-secondary)] leading-relaxed space-y-2">
                      {result.executiveSummary.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                  </section>

                  <section>
                    <h2 className={`text-xl font-black text-[var(--text-primary)] border-[#8B5CF6] mb-4 ${language === 'Arabic' ? 'border-r-4 pr-3' : 'border-l-4 pl-3'}`}>
                       {language === 'Arabic' ? 'بيان المشكلة (لماذا هذا المشروع؟)' : 'Problem Statement'}
                    </h2>
                    <ul className="list-disc list-inside text-[var(--text-secondary)] leading-relaxed space-y-2">
                      {result.problemStatement.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                  </section>

                  <section className="bg-[#8B5CF6]/10 p-6 rounded-2xl border border-[#8B5CF6]/20">
                    <h2 className="text-lg font-black text-[#8B5CF6] mb-3 flex items-center">
                      <i className="fas fa-bullseye mx-2"></i> {language === 'Arabic' ? 'التواؤم مع رؤية عُمان 2040' : 'Alignment with Oman Vision 2040'}
                    </h2>
                    <ul className="list-disc list-inside text-[var(--text-secondary)] leading-relaxed space-y-2">
                      {result.omanVision2040Alignment.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                  </section>
                  
                  {/* Financial Section - NEW */}
                  <section className="bg-[var(--bg-main)] p-6 rounded-2xl border border-[var(--border-glow)] ">
                    <h2 className="text-xl font-black text-[var(--text-primary)] mb-6 flex items-center border-b border-[var(--border-glow)] pb-4">
                       <i className="fas fa-chart-line mx-3 text-[#8B5CF6]"></i> {language === 'Arabic' ? 'الجدوى المالية والعوائد' : 'Financial Viability & ROI'}
                    </h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="bg-[var(--card-bg)] shadow-card p-4 rounded-xl border border-[var(--border-glow)]">
                        <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest mb-1">{language === 'Arabic' ? 'رأس المال (CAPEX)' : 'Total CAPEX'}</div>
                        <div className="text-lg font-bold text-[#8B5CF6]">{result.financials.totalCapex}</div>
                      </div>
                      <div className="bg-[var(--card-bg)] shadow-card p-4 rounded-xl border border-[var(--border-glow)]">
                        <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest mb-1">{language === 'Arabic' ? 'التشغيل (OPEX)' : 'Annual OPEX'}</div>
                        <div className="text-lg font-bold text-amber-400">{result.financials.annualOpex}</div>
                      </div>
                      <div className="bg-[var(--card-bg)] shadow-card p-4 rounded-xl border border-[var(--border-glow)]">
                        <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest mb-1">{language === 'Arabic' ? 'العائد (ROI)' : 'ROI Percentage'}</div>
                        <div className="text-lg font-bold text-[var(--text-primary)]">{result.financials.roiPercentage}</div>
                      </div>
                      <div className="bg-[var(--card-bg)] shadow-card p-4 rounded-xl border border-[var(--border-glow)]">
                        <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest mb-1">{language === 'Arabic' ? 'فترة الاسترداد' : 'Payback Period'}</div>
                        <div className="text-lg font-bold text-[var(--text-primary)]">{result.financials.paybackPeriod}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-sm font-bold text-[var(--text-secondary)] mb-3">{language === 'Arabic' ? 'خطة وجدول استرداد التمويل للمستثمر:' : 'Investor Return & Installment Schedule:'}</h3>
                      <p className="text-sm text-[var(--text-secondary)] mb-4">{result.financials.fundingReturnStrategy}</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-[var(--bg-main)] text-[var(--text-secondary)] border-b border-slate-700">
                            <tr>
                              <th className={`p-3 ${language === 'Arabic' ? 'text-right' : 'text-left'}`}>{language === 'Arabic' ? 'الفترة' : 'Period'}</th>
                              <th className={`p-3 ${language === 'Arabic' ? 'text-right' : 'text-left'}`}>{language === 'Arabic' ? 'الدفعة (الاسترداد)' : 'Payment Amount'}</th>
                              <th className={`p-3 ${language === 'Arabic' ? 'text-right' : 'text-left'}`}>{language === 'Arabic' ? 'الحدث / الإنجاز' : 'Milestone'}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-700/50">
                            {result.financials.installmentSchedule.map((inst, i) => (
                              <tr key={i} className="hover:bg-[var(--bg-main)]/50 transition-colors">
                                <td className={`p-3 font-semibold text-[var(--accent-emerald)] dark:text-emerald-400 ${language === 'Arabic' ? 'text-right' : 'text-left'}`}>{inst.period}</td>
                                <td className={`p-3 font-bold text-[var(--text-primary)] ${language === 'Arabic' ? 'text-right' : 'text-left'}`}>{inst.paymentAmount}</td>
                                <td className={`p-3 text-[var(--text-secondary)] ${language === 'Arabic' ? 'text-right' : 'text-left'}`}>{inst.milestoneDescription}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </section>

                  <section className="bg-blue-900/20 p-6 rounded-2xl border border-blue-500/20">
                    <h2 className="text-lg font-black text-blue-400 mb-4 flex items-center">
                      <i className="fas fa-leaf mx-2"></i> {language === 'Arabic' ? 'أرصدة الكربون وبيع الانبعاثات' : 'Carbon Credit Monetization'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border-glow)] shadow-sm">
                        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{language === 'Arabic' ? 'توفير الكربون السنوي' : 'Estimated Annual CO2 Savings'}</p>
                        <p className="text-lg font-black text-blue-400">{result.carbonCreditPotential.estimatedTonsSaved}</p>
                      </div>
                      <div className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border-glow)] shadow-sm">
                        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{language === 'Arabic' ? 'العائد الإضافي المحتمل' : 'Potential Monetary Value'}</p>
                        <p className="text-lg font-black text-[#8B5CF6]">{result.carbonCreditPotential.monetaryValueRange}</p>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{result.carbonCreditPotential.explanation}</p>
                  </section>

                  <section>
                    <h2 className={`text-xl font-black text-[var(--text-primary)] border-[#8B5CF6] mb-4 ${language === 'Arabic' ? 'border-r-4 pr-3' : 'border-l-4 pl-3'}`}>
                      {language === 'Arabic' ? 'الخاتمة' : 'Conclusion'}
                    </h2>
                    <p className="text-[var(--text-secondary)] leading-relaxed font-medium">{result.conclusion}</p>
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

