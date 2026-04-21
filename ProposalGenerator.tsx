import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProposalInput, ProposalResult, ProposalHistoryEntry } from './types';
import { generateProposal } from './geminiService';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
    <div className="flex flex-col lg:flex-row gap-8" dir={inputs.language === 'Arabic' ? 'rtl' : 'ltr'}>
      {/* Left Column: Form & History */}
      <div className="w-full lg:w-1/3 space-y-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-800"
        >
          <h2 className="text-xl font-black text-white mb-6 flex items-center">
            <i className="fas fa-file-signature mx-3 text-emerald-400"></i> {inputs.language === 'Arabic' ? 'تفاصيل المقترح' : 'Proposal Details'}
          </h2>
          <form onSubmit={handleGenerate} className="space-y-4">
            
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 mb-4">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">اللغة / Language</label>
              <select 
                name="language" 
                value={inputs.language} 
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-bold text-emerald-400 outline-none"
              >
                <option value="Arabic">العربية (Arabic)</option>
                <option value="English">English</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{inputs.language === 'Arabic' ? 'اسم المشروع' : 'Project Name'}</label>
              <input 
                type="text" 
                name="projectName" 
                required
                value={inputs.projectName} 
                onChange={handleInputChange}
                placeholder={inputs.language === 'Arabic' ? "مثال: مبادرة عمان للوقود الأخضر" : "e.g., Oman Green Fuel Initiative"}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{inputs.language === 'Arabic' ? 'الجهة المانحة / المستثمر' : 'Target Audience'}</label>
              <select 
                name="targetAudience" 
                value={inputs.targetAudience} 
                onChange={handleInputChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                dir={inputs.language === 'Arabic' ? 'rtl' : 'ltr'}
              >
                <option value="MoHERI (Academic/Research)" className="bg-slate-900">{inputs.language === 'Arabic' ? 'البحث العلمي (MoHERI)' : 'MoHERI (Academic/Research Grant)'}</option>
                <option value="PDO/OQ (Industrial/Commercial)" className="bg-slate-900">{inputs.language === 'Arabic' ? 'تنمية نفط عمان / أوكيو (استثمار صناعي)' : 'PDO / OQ (Industrial Investment)'}</option>
                <option value="OTF (Startup/VC)" className="bg-slate-900">{inputs.language === 'Arabic' ? 'الصندوق العماني للتكنولوجيا (شركات ناشئة)' : 'Oman Technology Fund (Startup/VC)'}</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{inputs.language === 'Arabic' ? 'المادة الخام' : 'Feedstock'}</label>
                <input 
                  type="text" 
                  name="feedstock" 
                  required
                  value={inputs.feedstock} 
                  onChange={handleInputChange}
                  placeholder={inputs.language === 'Arabic' ? 'زيت الطبخ المستخدم' : "e.g., Used Cooking Oil"}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none placeholder:text-slate-500"
                  dir={inputs.language === 'Arabic' ? 'rtl' : 'ltr'}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{inputs.language === 'Arabic' ? 'نوع المشروع/الوقود' : 'Project / Energy Type'}</label>
                <select 
                  name="biofuelType" 
                  value={inputs.biofuelType} 
                  onChange={handleInputChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                  dir={inputs.language === 'Arabic' ? 'rtl' : 'ltr'}
                >
                  <option value="Solar Farm" className="bg-slate-900">{inputs.language === 'Arabic' ? 'محطة طاقة شمسية' : 'Solar Farm'}</option>
                  <option value="Green Hydrogen" className="bg-slate-900">{inputs.language === 'Arabic' ? 'هيدروجين أخضر (التحليل الكهربائي)' : 'Green Hydrogen Electrolysis'}</option>
                  <option value="Biodiesel" className="bg-slate-900">{inputs.language === 'Arabic' ? 'الديزل الحيوي' : 'Biodiesel'}</option>
                  <option value="SAF" className="bg-slate-900">{inputs.language === 'Arabic' ? 'وقود الطيران المستدام (SAF)' : 'SAF'}</option>
                  <option value="Waste-to-Energy" className="bg-slate-900">{inputs.language === 'Arabic' ? 'تحويل النفايات إلى طاقة' : 'Waste-to-Energy'}</option>
                  <option value="Biogas" className="bg-slate-900">{inputs.language === 'Arabic' ? 'الغاز الحيوي' : 'Biogas'}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{inputs.language === 'Arabic' ? 'حجم الإنتاج' : 'Target Capacity'}</label>
                <input 
                  type="text" 
                  name="capacity" 
                  required
                  value={inputs.capacity} 
                  onChange={handleInputChange}
                  placeholder={inputs.language === 'Arabic' ? '500 لتر/يوم' : "e.g., 500 L/Day"}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none placeholder:text-slate-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{inputs.language === 'Arabic' ? 'الميزانية' : 'Estimated Budget'}</label>
                <input 
                  type="text" 
                  name="budget" 
                  required
                  value={inputs.budget} 
                  onChange={handleInputChange}
                  placeholder={inputs.language === 'Arabic' ? '50,000 ريال' : "e.g., 50,000 OMR"}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={status === 'GENERATING'}
              className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'GENERATING' ? (
                <><i className="fas fa-circle-notch fa-spin"></i><span>{inputs.language === 'Arabic' ? 'جاري كتابة المقترح...' : 'Drafting Proposal...'}</span></>
              ) : (
                <><i className="fas fa-magic"></i><span>{inputs.language === 'Arabic' ? 'توليد مسودة المقترح' : 'Generate Proposal'}</span></>
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
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-widest">{inputs.language === 'Arabic' ? 'السجل' : 'Recent Proposals'}</h3>
            <div className="space-y-3">
              {history.map((entry) => (
                <div 
                  key={entry.id} 
                  onClick={() => { setResult(entry.fullData); setStatus('COMPLETED'); }}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-700 truncate pr-2">{entry.projectName}</span>
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold truncate mb-1">{entry.targetAudience}</div>
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
              <i className="fas fa-file-contract text-6xl mb-4 text-slate-300"></i>
              <p className="text-lg font-medium">{inputs.language === 'Arabic' ? 'أدخل التفاصيل لإنشاء مقترح رسمي.' : 'Enter project details to generate a formal proposal.'}</p>
            </motion.div>
          )}

          {status === 'GENERATING' && (
            <motion.div 
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-emerald-500 p-12"
            >
              <i className="fas fa-pen-nib fa-bounce text-6xl mb-6"></i>
              <h3 className="text-2xl font-black mb-2">{inputs.language === 'Arabic' ? 'جاري كتابة المقترح...' : 'Drafting Proposal...'}</h3>
              <p className="text-slate-500">{inputs.language === 'Arabic' ? 'يتم التوافق مع رؤية عمان 2040 وبناء الجداول المالية.' : 'Aligning with Oman Vision 2040 and structuring arguments.'}</p>
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
              <h3 className="text-2xl font-black mb-2">Generation Failed</h3>
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
              <div className={`flex ${inputs.language === 'Arabic' ? 'justify-end' : 'justify-end'} mb-4`}>
                <button 
                  onClick={downloadPDF}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-colors shadow-lg"
                >
                  <i className="fas fa-file-pdf mx-2 text-red-400"></i> {inputs.language === 'Arabic' ? 'تحميل التقرير كـ PDF' : 'Download PDF Proposal'}
                </button>
              </div>

              <div id="proposal-report" className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 prose prose-slate max-w-none relative">
                {/* PDF BRANDING HEADER */}
                <div className="absolute top-8 left-8 right-8 flex justify-between items-start opacity-30 select-none pointer-events-none">
                  <div className="flex items-center space-x-2 grayscale">
                    <i className="fas fa-leaf text-2xl"></i>
                    <span className="text-xl font-black tracking-tighter text-slate-800">
                      OMAN <span className="text-emerald-700">ECOSYNC</span>
                    </span>
                  </div>
                  <div className="text-[8px] font-black tracking-[0.2em] uppercase text-right">
                    {inputs.language === 'Arabic' ? 'نموذج مقترح معتمد آلياً' : 'Automated Certified Proposal'} <br/>
                    {result.timestamp}
                  </div>
                </div>

                <div className="text-center mb-10 border-b border-slate-200 pb-8 mt-12">
                  <h1 className="text-3xl font-black text-slate-900 mb-4">{result.title}</h1>
                  <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">
                    {inputs.language === 'Arabic' ? 'أُعد خصيصاً لـ: ' : 'Prepared for: '} <span className="text-slate-800">{inputs.targetAudience}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-2">{inputs.language === 'Arabic' ? 'تاريخ الإصدار: ' : 'Generated on '}{result.timestamp}</p>
                </div>

                <div className="space-y-8">
                  <section>
                    <h2 className={`text-xl font-black text-slate-800 border-emerald-500 mb-4 ${inputs.language === 'Arabic' ? 'border-r-4 pr-3' : 'border-l-4 pl-3'}`}>
                      {inputs.language === 'Arabic' ? 'الملخص التنفيذي' : 'Executive Summary'}
                    </h2>
                    <ul className="list-disc list-inside text-slate-700 leading-relaxed space-y-2">
                      {result.executiveSummary.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                  </section>

                  <section>
                    <h2 className={`text-xl font-black text-slate-800 border-emerald-500 mb-4 ${inputs.language === 'Arabic' ? 'border-r-4 pr-3' : 'border-l-4 pl-3'}`}>
                       {inputs.language === 'Arabic' ? 'بيان المشكلة (لماذا هذا المشروع؟)' : 'Problem Statement'}
                    </h2>
                    <ul className="list-disc list-inside text-slate-700 leading-relaxed space-y-2">
                      {result.problemStatement.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                  </section>

                  <section className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                    <h2 className="text-lg font-black text-emerald-900 mb-3 flex items-center">
                      <i className="fas fa-bullseye mx-2"></i> {inputs.language === 'Arabic' ? 'التواؤم مع رؤية عُمان 2040' : 'Alignment with Oman Vision 2040'}
                    </h2>
                    <ul className="list-disc list-inside text-emerald-800 leading-relaxed space-y-2">
                      {result.omanVision2040Alignment.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                  </section>
                  
                  {/* Financial Section - NEW */}
                  <section className="bg-slate-900 p-6 rounded-2xl text-white shadow-lg">
                    <h2 className="text-xl font-black text-white mb-6 flex items-center border-b border-slate-700 pb-4">
                       <i className="fas fa-chart-line mx-3 text-emerald-400"></i> {inputs.language === 'Arabic' ? 'الجدوى المالية والعوائد' : 'Financial Viability & ROI'}
                    </h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">{inputs.language === 'Arabic' ? 'رأس المال (CAPEX)' : 'Total CAPEX'}</div>
                        <div className="text-lg font-bold text-emerald-400">{result.financials.totalCapex}</div>
                      </div>
                      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">{inputs.language === 'Arabic' ? 'التشغيل (OPEX)' : 'Annual OPEX'}</div>
                        <div className="text-lg font-bold text-amber-400">{result.financials.annualOpex}</div>
                      </div>
                      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">{inputs.language === 'Arabic' ? 'العائد (ROI)' : 'ROI Percentage'}</div>
                        <div className="text-lg font-bold text-white">{result.financials.roiPercentage}</div>
                      </div>
                      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">{inputs.language === 'Arabic' ? 'فترة الاسترداد' : 'Payback Period'}</div>
                        <div className="text-lg font-bold text-white">{result.financials.paybackPeriod}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-sm font-bold text-slate-300 mb-3">{inputs.language === 'Arabic' ? 'خطة وجدول استرداد التمويل للمستثمر:' : 'Investor Return & Installment Schedule:'}</h3>
                      <p className="text-sm text-slate-400 mb-4">{result.financials.fundingReturnStrategy}</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-slate-800 text-slate-300 border-b border-slate-700">
                            <tr>
                              <th className={`p-3 ${inputs.language === 'Arabic' ? 'text-right' : 'text-left'}`}>{inputs.language === 'Arabic' ? 'الفترة' : 'Period'}</th>
                              <th className={`p-3 ${inputs.language === 'Arabic' ? 'text-right' : 'text-left'}`}>{inputs.language === 'Arabic' ? 'الدفعة (الاسترداد)' : 'Payment Amount'}</th>
                              <th className={`p-3 ${inputs.language === 'Arabic' ? 'text-right' : 'text-left'}`}>{inputs.language === 'Arabic' ? 'الحدث / الإنجاز' : 'Milestone'}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-700/50">
                            {result.financials.installmentSchedule.map((inst, i) => (
                              <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                                <td className={`p-3 font-semibold text-emerald-400 ${inputs.language === 'Arabic' ? 'text-right' : 'text-left'}`}>{inst.period}</td>
                                <td className={`p-3 font-bold text-white ${inputs.language === 'Arabic' ? 'text-right' : 'text-left'}`}>{inst.paymentAmount}</td>
                                <td className={`p-3 text-slate-300 ${inputs.language === 'Arabic' ? 'text-right' : 'text-left'}`}>{inst.milestoneDescription}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </section>

                  <section className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                    <h2 className="text-lg font-black text-blue-900 mb-4 flex items-center">
                      <i className="fas fa-leaf mx-2"></i> {inputs.language === 'Arabic' ? 'أرصدة الكربون وبيع الانبعاثات' : 'Carbon Credit Monetization'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white p-4 rounded-xl border border-blue-50 shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{inputs.language === 'Arabic' ? 'توفير الكربون السنوي' : 'Estimated Annual CO2 Savings'}</p>
                        <p className="text-lg font-black text-blue-700">{result.carbonCreditPotential.estimatedTonsSaved}</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-blue-50 shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{inputs.language === 'Arabic' ? 'العائد الإضافي المحتمل' : 'Potential Monetary Value'}</p>
                        <p className="text-lg font-black text-emerald-600">{result.carbonCreditPotential.monetaryValueRange}</p>
                      </div>
                    </div>
                    <p className="text-sm text-blue-800 leading-relaxed">{result.carbonCreditPotential.explanation}</p>
                  </section>

                  <section>
                    <h2 className={`text-xl font-black text-slate-800 border-emerald-500 mb-4 ${inputs.language === 'Arabic' ? 'border-r-4 pr-3' : 'border-l-4 pl-3'}`}>
                      {inputs.language === 'Arabic' ? 'الخاتمة' : 'Conclusion'}
                    </h2>
                    <p className="text-slate-700 leading-relaxed font-medium">{result.conclusion}</p>
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

