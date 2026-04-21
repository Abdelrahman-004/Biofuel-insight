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

  const isArabic = localLanguage === 'Arabic';
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
          className="bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-800"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-white flex items-center">
              <i className="fas fa-microscope mr-3 text-blue-400"></i> {isArabic ? 'قيم معمل الوقود ومقاييسه' : 'Lab Results Input'}
            </h2>
            
            <select 
              value={localLanguage}
              onChange={(e) => setLocalLanguage(e.target.value)}
              className="bg-slate-800 text-sm border border-slate-700 rounded-lg px-3 py-1.5 text-blue-400 outline-none font-bold"
            >
              <option value="Arabic">العربية (Arabic)</option>
              <option value="English">English</option>
            </select>
          </div>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{isArabic ? 'نوع الوقود الحيوي' : 'Biofuel Type'}</label>
              <select 
                name="biofuelType" 
                value={inputs.biofuelType} 
                onChange={handleInputChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                dir={isArabic ? 'rtl' : 'ltr'}
              >
                <option value="Biodiesel" className="bg-slate-900">{isArabic ? 'الديزل الحيوي (FAME)' : 'Biodiesel (FAME)'}</option>
                <option value="Bioethanol" className="bg-slate-900">{isArabic ? 'الإيثانول الحيوي' : 'Bioethanol'}</option>
                <option value="Sustainable Aviation Fuel (SAF)" className="bg-slate-900">{isArabic ? 'وقود الطيران المستدام (SAF)' : 'Sustainable Aviation Fuel (SAF)'}</option>
                <option value="Biogas" className="bg-slate-900">{isArabic ? 'الغاز الحيوي' : 'Biogas'}</option>
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
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{field.label}</label>
                  <input 
                    type="text" 
                    name={field.name} 
                    value={(inputs as any)[field.name]} 
                    onChange={handleInputChange}
                    placeholder={isArabic ? 'اختياري' : "Optional"}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none placeholder:text-slate-500"
                    dir={isArabic ? 'rtl' : 'ltr'}
                  />
                </div>
              ))}
            </div>

            <button 
              type="submit" 
              disabled={status === 'ANALYZING'}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
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
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200"
          >
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-widest">{isArabic ? 'السجل' : 'Recent Checks'}</h3>
            <div className="space-y-3">
              {history.map((entry) => (
                <div 
                  key={entry.id} 
                  onClick={() => { setResult(entry.fullData); setStatus('COMPLETED'); }}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-700">{entry.biofuelType}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                      entry.overallStatus === 'Compliant' ? 'bg-emerald-100 text-emerald-700' : 
                      entry.overallStatus === 'Non-Compliant' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {entry.overallStatus}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">{entry.timestamp}</div>
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
              className="h-full flex flex-col items-center justify-center text-slate-400 p-12 border-2 border-dashed border-slate-200 rounded-3xl"
            >
              <i className="fas fa-clipboard-check text-6xl mb-4 text-slate-300"></i>
              <p className="text-lg font-medium">Enter lab results to check standards compliance.</p>
            </motion.div>
          )}

          {status === 'ANALYZING' && (
            <motion.div 
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-blue-500 p-12"
            >
              <i className="fas fa-cog fa-spin text-6xl mb-6"></i>
              <h3 className="text-2xl font-black mb-2">Evaluating Parameters...</h3>
              <p className="text-slate-500">Comparing against international standards.</p>
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
              <h3 className="text-2xl font-black mb-2">Analysis Failed</h3>
              <p className="text-slate-500">Please check your API key and try again.</p>
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
                  className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-colors shadow-lg"
                >
                  <i className="fas fa-file-pdf mr-2 text-red-400"></i> Download PDF Report
                </button>
              </div>

              <div id="standards-report" className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-slate-100">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 mb-1">Standards Compliance Report</h2>
                    <div className="text-sm text-slate-500 font-medium">Target Standard: <span className="text-blue-600 font-bold">{result.targetStandard}</span></div>
                  </div>
                  <div className={`mt-4 md:mt-0 px-4 py-2 rounded-xl border-2 flex items-center ${
                    result.overallStatus === 'Compliant' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 
                    result.overallStatus === 'Non-Compliant' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-amber-50 border-amber-200 text-amber-700'
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
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Parameter Evaluation</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-500">
                          <th className="p-3 rounded-tl-xl">Parameter</th>
                          <th className="p-3">Your Value</th>
                          <th className="p-3">Standard Limit</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 rounded-tr-xl">Implication</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {result.evaluations.map((evalItem, i) => (
                          <tr key={i} className="border-b border-slate-50 last:border-0">
                            <td className="p-3 font-bold text-slate-700">{evalItem.parameter}</td>
                            <td className="p-3 font-medium text-slate-600">{evalItem.userValue}</td>
                            <td className="p-3 font-medium text-slate-500">{evalItem.standardLimit}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                                evalItem.status === 'Pass' ? 'bg-emerald-100 text-emerald-700' :
                                evalItem.status === 'Fail' ? 'bg-red-100 text-red-700' :
                                evalItem.status === 'Warning' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {evalItem.status}
                              </span>
                            </td>
                            <td className="p-3 text-xs text-slate-600">{evalItem.implication}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Fix Recommendations */}
                {result.evaluations.some(e => e.status === 'Fail' || e.status === 'Warning') && (
                  <div className="mb-8 bg-amber-50 p-6 rounded-2xl border border-amber-100">
                    <h3 className="text-sm font-black text-amber-800 uppercase tracking-widest mb-4 flex items-center">
                      <i className="fas fa-wrench mr-2"></i> Required Adjustments
                    </h3>
                    <ul className="space-y-3">
                      {result.evaluations.filter(e => e.status === 'Fail' || e.status === 'Warning').map((evalItem, i) => (
                        <li key={i} className="text-sm text-amber-900 flex items-start">
                          <i className="fas fa-arrow-right mt-1 mr-2 text-amber-500"></i>
                          <div>
                            <span className="font-bold">{evalItem.parameter}: </span>
                            {evalItem.fixRecommendation || 'Requires chemical adjustment.'}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Expert Summary & Commercial Viability */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Expert Summary</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">{result.expertSummary}</p>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                    <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Commercial Viability (Oman)</h3>
                    <p className="text-sm text-blue-900 leading-relaxed font-medium">{result.commercialViability}</p>
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
