import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StandardsInput, StandardsResult, StandardsHistoryEntry } from './types';
import { checkStandardsCompliance } from './geminiService';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface StandardsCheckerProps {
  language?: 'English' | 'Arabic';
}

export const StandardsChecker: React.FC<StandardsCheckerProps> = ({ language = 'English' }) => {
  const [localLanguage, setLocalLanguage] = React.useState(language || 'Arabic');

  React.useEffect(() => {
    setLocalLanguage(language || 'Arabic');
  }, [language]);

    const isArabic = language === 'Arabic';
  const [inputs, setInputs] = useState<StandardsInput>({
    biofuelType: 'Biodiesel',
    viscosity: '',
    flashPoint: '',
    waterContent: '',
    acidValue: '',
    density: '',
    cetaneNumber: '',
    sulfurContent: ''
  });

  const [status, setStatus] = useState<'IDLE' | 'ANALYZING' | 'COMPLETED' | 'ERROR'>('IDLE');
  const [result, setResult] = useState<StandardsResult | null>(null);
  const [history, setHistory] = useState<StandardsHistoryEntry[]>([]);

  const STANDARDS_HISTORY_KEY = 'biofuel_insight_standards_history';

  React.useEffect(() => {
    const saved = localStorage.getItem(STANDARDS_HISTORY_KEY);
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch(e) {}
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem(STANDARDS_HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('ANALYZING');
    try {
      const res = await checkStandardsCompliance(inputs, localLanguage);
      setResult(res);
      setStatus('COMPLETED');
      setHistory(prev => [{
        id: res.id,
        timestamp: res.timestamp,
        biofuelType: res.biofuelType,
        overallStatus: res.overallStatus,
        fullData: res
      }, ...prev]);
    } catch (err) {
      console.error(err);
      setStatus('ERROR');
    }
  };

  const downloadPDF = async () => {
    const element = document.getElementById('standards-report');
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Standards_Report_${result?.biofuelType}_${new Date().getTime()}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Column: Form & History */}
      <div className="w-full lg:w-1/3 space-y-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[var(--card-bg)] shadow-card  p-6 rounded-3xl  border border-[var(--border-glow)] hover:border-#CBD5E1 transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-[#CBD5E1] flex items-center drop-shadow-md">
              <i className="fas fa-microscope mr-3"></i> {isArabic ? 'قيم معمل الوقود ومقاييسه' : 'Lab Results Input'}
            </h2>
            
            <select 
              value={localLanguage}
              onChange={(e) => setLocalLanguage(e.target.value as 'English' | 'Arabic')}
              className="bg-[var(--card-bg)] shadow-card text-sm border border-[var(--border-glow)] rounded-lg px-3 py-1.5 text-[#CBD5E1] outline-none font-bold"
            >
              <option value="Arabic" className="bg-[var(--card-bg)] text-[var(--text-primary)]">العربية (Arabic)</option>
              <option value="English" className="bg-[var(--card-bg)] text-[var(--text-primary)]">English</option>
            </select>
          </div>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{isArabic ? 'نوع الوقود الحيوي' : 'Biofuel Type'}</label>
              <select 
                name="biofuelType" 
                value={inputs.biofuelType} 
                onChange={handleInputChange}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-glow)] rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-primary)] focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all outline-none"
                dir={isArabic ? 'rtl' : 'ltr'}
              >
                <option value="Biodiesel" className="bg-[var(--card-bg)] shadow-card">{isArabic ? 'الديزل الحيوي (FAME)' : 'Biodiesel (FAME)'}</option>
                <option value="Bioethanol" className="bg-[var(--card-bg)] shadow-card">{isArabic ? 'الإيثانول الحيوي' : 'Bioethanol'}</option>
                <option value="Sustainable Aviation Fuel (SAF)" className="bg-[var(--card-bg)] shadow-card">{isArabic ? 'وقود الطيران المستدام (SAF)' : 'Sustainable Aviation Fuel (SAF)'}</option>
                <option value="Biogas" className="bg-[var(--card-bg)] shadow-card">{isArabic ? 'الغاز الحيوي' : 'Biogas'}</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'viscosity', label: isArabic ? 'اللزوجة (مم²/ث)' : 'Viscosity (mm²/s)' },
                { name: 'flashPoint', label: isArabic ? 'نقطة الوميض (°C)' : 'Flash Point (°C)' },
                { name: 'waterContent', label: isArabic ? 'المحتوى المائي (%)' : 'Water Content (%)' },
                { name: 'acidValue', label: isArabic ? 'قيمة الحمض (mg KOH/g)' : 'Acid Value (mg KOH/g)' },
                { name: 'density', label: isArabic ? 'الكثافة (kg/m³)' : 'Density (kg/m³)' },
                { name: 'cetaneNumber', label: isArabic ? 'رقم السيتان' : 'Cetane Number' },
                { name: 'sulfurContent', label: isArabic ? 'محتوى الكبريت (ppm)' : 'Sulfur Content (ppm)' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{field.label}</label>
                  <input 
                    type="text" 
                    name={field.name} 
                    value={(inputs as any)[field.name]} 
                    onChange={handleInputChange}
                    placeholder={isArabic ? 'اختياري' : "Optional"}
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-glow)] rounded-xl px-4 py-2 text-sm font-medium text-[var(--text-primary)] focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all outline-none placeholder:text-[var(--text-secondary)]"
                    dir={isArabic ? 'rtl' : 'ltr'}
                  />
                </div>
              ))}
            </div>

            <button 
              type="submit" 
              disabled={status === 'ANALYZING'}
              className={`w-full mt-6 text-[var(--text-primary)] font-bold py-4 px-6 rounded-xl transition-all  flex items-center justify-center space-x-2 ${
                status === 'ANALYZING' ? 'bg-[var(--bg-main)] cursor-not-allowed text-[var(--text-secondary)]' : 'bg-gradient-to-r from-[#059669] to-[#10B981] hover:shadow-md active:scale-95'
              }`}            >
              {status === 'ANALYZING' ? (
                <><i className="fas fa-circle-notch fa-spin"></i><span>{isArabic ? 'جاري التحليل...' : 'Analyzing...'}</span></>
              ) : (
                <><i className="fas fa-check-double"></i><span>{isArabic ? 'فحص المطابقة للمعايير' : 'Check Compliance'}</span></>
              )}
            </button>
          </form>
        </motion.div>

        {/* History Section */}
        {history.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[var(--card-bg)] shadow-card  p-6 rounded-3xl  border border-[var(--border-glow)]"
          >
            <h3 className="text-sm font-black text-[var(--text-primary)] mb-4 uppercase tracking-widest">{isArabic ? 'السجل' : 'Recent Checks'}</h3>
            <div className="space-y-3">
              {history.map((entry) => (
                <div 
                  key={entry.id} 
                  onClick={() => { setResult(entry.fullData); setStatus('COMPLETED'); }}
                  className="p-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border-glow)] cursor-pointer hover:bg-[var(--bg-main)] hover:border-[var(--accent-emerald)] transition-colors"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-[var(--text-secondary)]">{entry.biofuelType}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                      entry.overallStatus === 'Compliant' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 
                      entry.overallStatus === 'Non-Compliant' ? 'bg-red-500 dark:bg-red-600/20 text-red-400' : 'bg-amber-500 dark:bg-amber-600/20 text-amber-400'
                    }`}>
                      {entry.overallStatus}
                    </span>
                  </div>
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
              <i className="fas fa-clipboard-check text-6xl mb-4 text-[var(--text-secondary)]"></i>
              <p className="text-lg font-medium">{language === 'Arabic' ? "أدخل نتائج المختبر للتحقق من الامتثال للمعايير." : "Enter lab results to check standards compliance."}</p>
            </motion.div>
          )}

          {status === 'ANALYZING' && (
            <motion.div 
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-blue-600 dark:text-blue-400 p-12"
            >
              <i className="fas fa-cog fa-spin text-6xl mb-6"></i>
              <h3 className="text-2xl font-black mb-2">{language === 'Arabic' ? "يتم تقييم المعايير..." : "Evaluating Parameters..."}</h3>
              <p className="text-[var(--text-secondary)]">{language === 'Arabic' ? "يتم المقارنة بالمعايير الدولية." : "Comparing against international standards."}</p>
            </motion.div>
          )}

          {status === 'ERROR' && (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-red-600 dark:text-red-400 p-12"
            >
              <i className="fas fa-exclamation-triangle text-6xl mb-4"></i>
              <h3 className="text-2xl font-black mb-2">{language === 'Arabic' ? "فشل التحليل" : "Analysis Failed"}</h3>
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
              <div className="flex justify-end mb-4">
                <button 
                  onClick={downloadPDF}
                  className="bg-[var(--card-bg)] shadow-card hover:bg-[var(--bg-main)] text-[var(--text-primary)] px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-colors shadow-card"
                >
                  <i className="fas fa-file-pdf mr-2 text-red-400"></i>{language === 'Arabic' ? "تحميل التقرير كـ PDF" : "Download PDF Report"}</button>
              </div>

              <div id="standards-report" className="bg-[var(--card-bg)] shadow-card  p-8 rounded-3xl  border border-[var(--border-glow)]">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-[var(--border-glow)]">
                  <div>
                    <h2 className="text-2xl font-black text-[var(--text-primary)] mb-1">{language === 'Arabic' ? "تقرير الالتزام بالمعايير" : "Standards Compliance Report"}</h2>
                    <div className="text-sm text-[var(--text-secondary)] font-medium">{language === 'Arabic' ? "المعيار المستهدف:" : "Target Standard:"} <span className="text-[var(--text-primary)] font-bold">{result.targetStandard}</span></div>
                  </div>
                  <div className={`mt-4 md:mt-0 px-4 py-2 rounded-xl border flex items-center ${
                    result.overallStatus === 'Compliant' ? 'bg-[var(--accent-emerald)]/10 border-var(--accent-emerald) text-[var(--accent-emerald)] dark:text-emerald-400' : 
                    result.overallStatus === 'Non-Compliant' ? 'bg-red-500 dark:bg-red-600/10 border-red-500 dark:border-red-600/30/20 text-red-400' : 'bg-amber-500 dark:bg-amber-600/10 border-amber-500/20 text-amber-400'
                  }`}>
                    <i className={`fas ${
                      result.overallStatus === 'Compliant' ? 'fa-check-circle' : 
                      result.overallStatus === 'Non-Compliant' ? 'fa-times-circle' : 'fa-exclamation-triangle'
                    } mr-2 text-lg`}></i>
                    <span className="font-black uppercase tracking-widest text-sm">{result.overallStatus}</span>
                  </div>
                </div>

                {/* Parameters Table */}
                <div className="mb-8">
                  <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest mb-4">{language === 'Arabic' ? "تقييم المعايير" : "Parameter Evaluation"}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[var(--bg-main)] text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">
                          <th className="p-3 rounded-tl-xl border-b border-[var(--border-glow)]">{language === 'Arabic' ? "المعيار" : "Parameter"}</th>
                          <th className="p-3 border-b border-[var(--border-glow)]">{language === 'Arabic' ? "قيمتك" : "Your Value"}</th>
                          <th className="p-3 border-b border-[var(--border-glow)]">{language === 'Arabic' ? "الحد القياسي" : "Standard Limit"}</th>
                          <th className="p-3 border-b border-[var(--border-glow)]">{language === 'Arabic' ? "الحالة" : "Status"}</th>
                          <th className="p-3 rounded-tr-xl border-b border-[var(--border-glow)]">{language === 'Arabic' ? "الآثار" : "Implication"}</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {result.evaluations.map((evalItem, i) => (
                          <tr key={i} className="border-b border-[var(--border-glow)] last:border-0 hover:bg-white/5">
                            <td className="p-3 font-bold text-[var(--text-secondary)]">{evalItem.parameter}</td>
                            <td className="p-3 font-medium text-[var(--text-secondary)]">{evalItem.userValue}</td>
                            <td className="p-3 font-medium text-[var(--text-primary)]">{evalItem.standardLimit}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                                evalItem.status === 'Pass' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' :
                                evalItem.status === 'Fail' ? 'bg-red-500 dark:bg-red-600/20 text-red-400' :
                                evalItem.status === 'Warning' ? 'bg-amber-500 dark:bg-amber-600/20 text-amber-400' : 'bg-[var(--bg-main)] text-[var(--text-secondary)]'
                              }`}>
                                {evalItem.status}
                              </span>
                            </td>
                            <td className="p-3 text-xs text-[var(--text-secondary)]">{evalItem.implication}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Fix Recommendations */}
                {result.evaluations.some(e => e.status === 'Fail' || e.status === 'Warning') && (
                  <div className="mb-8 bg-amber-50 dark:bg-amber-900/20 p-6 rounded-2xl border border-amber-200 dark:border-amber-700/50">
                    <h3 className="text-sm font-black text-amber-800 dark:text-amber-400 uppercase tracking-widest mb-4 flex items-center">
                      <i className="fas fa-wrench mr-2"></i> {language === 'Arabic' ? "التعديلات المطلوبة" : "Required Adjustments"}
                    </h3>
                    <ul className="space-y-3">
                      {result.evaluations.filter(e => e.status === 'Fail' || e.status === 'Warning').map((evalItem, i) => (
                        <li key={i} className="text-sm text-amber-900 dark:text-amber-100 flex items-start">
                          <i className="fas fa-arrow-right mt-1 mr-2 text-amber-600 dark:text-amber-400"></i>
                          <div>
                            <span className="font-bold text-amber-800 dark:text-amber-300">{evalItem.parameter}: </span>
                            {evalItem.fixRecommendation || 'Requires chemical adjustment.'}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Expert Summary & Commercial Viability */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[var(--bg-main)] p-6 rounded-2xl border border-[var(--border-glow)]">
                    <h3 className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-2">{language === 'Arabic' ? "ملخص الخبراء" : "Expert Summary"}</h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{result.expertSummary}</p>
                  </div>
                  <div className="bg-[var(--bg-main)] p-6 rounded-2xl border border-[var(--border-glow)]">
                    <h3 className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest mb-2">{language === 'Arabic' ? "الجدوى التجارية (عُمان)" : "Commercial Viability (Oman)"}</h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">{result.commercialViability}</p>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
