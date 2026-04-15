import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProposalInput, ProposalResult, ProposalHistoryEntry } from './types';
import { generateProposal } from './geminiService';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const ProposalGenerator: React.FC = () => {
  const [inputs, setInputs] = useState<ProposalInput>({
    projectName: '',
    feedstock: '',
    biofuelType: 'Biodiesel',
    capacity: '',
    budget: '',
    targetAudience: 'MoHERI (Academic/Research)'
  });

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
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Column: Form & History */}
      <div className="w-full lg:w-1/3 space-y-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200"
        >
          <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center">
            <i className="fas fa-file-signature mr-3 text-emerald-600"></i> Proposal Details
          </h2>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Project Name</label>
              <input 
                type="text" 
                name="projectName" 
                required
                value={inputs.projectName} 
                onChange={handleInputChange}
                placeholder="e.g., Oman Green Fuel Initiative"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target Audience / Funder</label>
              <select 
                name="targetAudience" 
                value={inputs.targetAudience} 
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
              >
                <option value="MoHERI (Academic/Research)">MoHERI (Academic/Research Grant)</option>
                <option value="PDO/OQ (Industrial/Commercial)">PDO / OQ (Industrial Investment)</option>
                <option value="OTF (Startup/VC)">Oman Technology Fund (Startup/VC)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Feedstock</label>
                <input 
                  type="text" 
                  name="feedstock" 
                  required
                  value={inputs.feedstock} 
                  onChange={handleInputChange}
                  placeholder="e.g., Used Cooking Oil"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Biofuel Type</label>
                <select 
                  name="biofuelType" 
                  value={inputs.biofuelType} 
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                >
                  <option value="Biodiesel">Biodiesel</option>
                  <option value="Bioethanol">Bioethanol</option>
                  <option value="SAF">SAF</option>
                  <option value="Biogas">Biogas</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target Capacity</label>
                <input 
                  type="text" 
                  name="capacity" 
                  required
                  value={inputs.capacity} 
                  onChange={handleInputChange}
                  placeholder="e.g., 500 L/Day"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Estimated Budget</label>
                <input 
                  type="text" 
                  name="budget" 
                  required
                  value={inputs.budget} 
                  onChange={handleInputChange}
                  placeholder="e.g., 50,000 OMR"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={status === 'GENERATING'}
              className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'GENERATING' ? (
                <><i className="fas fa-circle-notch fa-spin"></i><span>Drafting Proposal...</span></>
              ) : (
                <><i className="fas fa-magic"></i><span>Generate Proposal</span></>
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
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-widest">Recent Proposals</h3>
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
              <p className="text-lg font-medium">Enter project details to generate a formal proposal.</p>
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
              <h3 className="text-2xl font-black mb-2">Drafting Proposal...</h3>
              <p className="text-slate-500">Aligning with Oman Vision 2040 and structuring arguments.</p>
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
              <div className="flex justify-end mb-4">
                <button 
                  onClick={downloadPDF}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-colors shadow-lg"
                >
                  <i className="fas fa-file-pdf mr-2 text-red-400"></i> Download PDF Proposal
                </button>
              </div>

              <div id="proposal-report" className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 prose prose-slate max-w-none">
                <div className="text-center mb-10 border-b border-slate-200 pb-8">
                  <h1 className="text-3xl font-black text-slate-900 mb-4">{result.title}</h1>
                  <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Prepared for: {inputs.targetAudience}</p>
                  <p className="text-xs text-slate-400 mt-2">Generated on {result.timestamp}</p>
                </div>

                <div className="space-y-8">
                  <section>
                    <h2 className="text-xl font-black text-slate-800 border-l-4 border-emerald-500 pl-3 mb-4">Executive Summary</h2>
                    <p className="text-slate-700 leading-relaxed">{result.executiveSummary}</p>
                  </section>

                  <section>
                    <h2 className="text-xl font-black text-slate-800 border-l-4 border-emerald-500 pl-3 mb-4">Problem Statement</h2>
                    <p className="text-slate-700 leading-relaxed">{result.problemStatement}</p>
                  </section>

                  <section className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                    <h2 className="text-lg font-black text-emerald-900 mb-3 flex items-center">
                      <i className="fas fa-bullseye mr-2"></i> Alignment with Oman Vision 2040
                    </h2>
                    <p className="text-emerald-800 leading-relaxed">{result.omanVision2040Alignment}</p>
                  </section>

                  <section>
                    <h2 className="text-xl font-black text-slate-800 border-l-4 border-emerald-500 pl-3 mb-4">Methodology & Implementation</h2>
                    <p className="text-slate-700 leading-relaxed">{result.methodology}</p>
                  </section>

                  <section>
                    <h2 className="text-xl font-black text-slate-800 border-l-4 border-emerald-500 pl-3 mb-4">Financial Viability</h2>
                    <p className="text-slate-700 leading-relaxed">{result.financialViability}</p>
                  </section>

                  <section className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                    <h2 className="text-lg font-black text-blue-900 mb-4 flex items-center">
                      <i className="fas fa-leaf mr-2"></i> Carbon Credit Monetization Potential
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white p-4 rounded-xl border border-blue-50">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Estimated Annual CO2 Savings</p>
                        <p className="text-lg font-black text-blue-700">{result.carbonCreditPotential.estimatedTonsSaved}</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-blue-50">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Potential Monetary Value</p>
                        <p className="text-lg font-black text-emerald-600">{result.carbonCreditPotential.monetaryValueRange}</p>
                      </div>
                    </div>
                    <p className="text-sm text-blue-800 leading-relaxed">{result.carbonCreditPotential.explanation}</p>
                  </section>

                  <section>
                    <h2 className="text-xl font-black text-slate-800 border-l-4 border-emerald-500 pl-3 mb-4">Conclusion</h2>
                    <p className="text-slate-700 leading-relaxed">{result.conclusion}</p>
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
