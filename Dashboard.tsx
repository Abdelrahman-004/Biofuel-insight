
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend
} from 'recharts';
import { BioFuelAnalysis } from './types';

interface DashboardProps {
  data: BioFuelAnalysis;
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [showReport, setShowReport] = React.useState(false);

  const costData = [
    { name: 'Min Invest', value: data?.EconomicFeasibility?.EstimatedInvestmentUSD?.Minimum || 0 },
    { name: 'Max Invest', value: data?.EconomicFeasibility?.EstimatedInvestmentUSD?.Maximum || 0 },
  ];

  const isDataMissing = !data?.ProjectAnalyzer || data.ProjectAnalyzer.ExpectedProduction === null || data.ProjectAnalyzer.PreliminaryBudgetUSD === null;

  if (isDataMissing) {
    return (
      <div className="p-8 text-center text-slate-500">
        <i className="fas fa-exclamation-triangle text-4xl mb-4 text-amber-500"></i>
        <p>Incomplete analysis data. Please try analyzing again.</p>
      </div>
    );
  }

  const exportToCSV = () => {
    if (!data || !data.ProjectAnalyzer) return;
    const rows = [
      ["Metric", "Value"],
      ["Project Name", data.ProjectAnalyzer?.ProjectName || "N/A"],
      ["Location", data.ProjectAnalyzer?.Location || "N/A"],
      ["Category", data.ProjectAnalyzer?.TechnologyCategory || "N/A"],
      ["Feedstock/Energy Type", data.ProjectAnalyzer?.Feedstock || "N/A"],
      ["Feasibility Score", data.FinalFeasibilityScore || 0],
      ["Economic Assessment", data.EconomicFeasibility?.Assessment || "N/A"],
      ["Payback Period", `${data.EconomicFeasibility?.PaybackPeriodYears || 0} years`],
      ["Carbon Emissions", `${data.EnvironmentalImpact?.CarbonEmissions_kgCO2_per_liter || 0} kg/L`],
      ["Water Usage", `${data.EnvironmentalImpact?.WaterUsage_liters_per_liter || 0} L/L`]
    ];
    let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${data.ProjectAnalyzer.ProjectName || 'Project'}_Feasibility.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getScoreAssets = (score: number) => {
    if (score >= 80) return { color: 'text-emerald-500', bg: 'bg-emerald-500', border: 'border-emerald-500', label: 'INVESTMENT GRADE', description: 'Strong technical & financial alignment.' };
    if (score >= 60) return { color: 'text-blue-500', bg: 'bg-blue-500', border: 'border-blue-500', label: 'CONDITIONALLY VIABLE', description: 'Moderate risks manageable via mitigation.' };
    if (score >= 40) return { color: 'text-amber-500', bg: 'bg-amber-500', border: 'border-amber-500', label: 'HIGH RISK', description: 'Requires significant strategic adjustment.' };
    return { color: 'text-red-500', bg: 'bg-red-500', border: 'border-red-500', label: 'NOT BANKABLE', description: 'Unfavorable metrics at current scale.' };
  };

  const scoreAssets = getScoreAssets(data?.FinalFeasibilityScore || 0);

  const getRiskColor = (level: string) => {
    if (!level) return 'text-slate-500 bg-slate-50 border-slate-100';
    if (level === 'Moderate') return 'text-emerald-500 bg-emerald-50 border-emerald-100';
    if (level === 'Significant') return 'text-amber-500 bg-amber-50 border-amber-100';
    return 'text-red-500 bg-red-50 border-red-100';
  };

  const formatCurrency = (val: number) => `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-20"
    >
      {/* Official Report Modal */}
      <AnimatePresence>
        {showReport && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md overflow-y-auto p-4 md:p-8"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
            >
            {/* Header */}
            <div className="bg-slate-900 px-8 py-6 flex justify-between items-center border-b border-slate-800">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Official Investment-Grade Report</h2>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">Project: {data?.ProjectAnalyzer?.ProjectName || 'Unnamed'}</p>
              </div>
              <button 
                onClick={() => setShowReport(false)}
                className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="p-8 space-y-10">
              {/* AI Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Technical AI */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 border-b border-slate-100 pb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                      <i className="fas fa-microchip"></i>
                    </div>
                    <h3 className="font-black text-slate-800 uppercase text-sm tracking-wider">Technical Engineering AI</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Installed Capacity</p>
                      <p className="text-sm font-black text-slate-800">{data?.TechnicalAI?.InstalledCapacity || 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Energy Output</p>
                      <p className="text-sm font-black text-slate-800">{data?.TechnicalAI?.EnergyOutput || 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Benchmark CAPEX</p>
                      <p className="text-xs font-bold text-slate-700">{data?.TechnicalAI?.BenchmarkCAPEXRange || 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">TRL Level</p>
                      <p className="text-sm font-black text-blue-600">TRL {data?.TechnicalAI?.TRLEstimate || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Financial AI */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 border-b border-slate-100 pb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                      <i className="fas fa-chart-line"></i>
                    </div>
                    <h3 className="font-black text-slate-800 uppercase text-sm tracking-wider">Financial Modeling AI</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Realistic CAPEX</p>
                      <p className="text-sm font-black text-slate-800">{formatCurrency(data?.FinancialAI?.RealisticCAPEX || 0)}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Annual OPEX</p>
                      <p className="text-sm font-black text-slate-800">{formatCurrency(data?.FinancialAI?.OPEX || 0)}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Payback Period</p>
                      <p className="text-sm font-black text-emerald-600">{data?.FinancialAI?.PaybackYears || 0} Years</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">IRR (Est.)</p>
                      <p className="text-sm font-black text-emerald-600">{data?.FinancialAI?.IRR_Simplified || 'N/A'}</p>
                    </div>
                    <div className="col-span-2 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">LCOE / Unit Cost</p>
                      <p className="text-sm font-black text-emerald-800">{data?.FinancialAI?.LCOE_or_CostPerTon || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Auditor AI */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 border-b border-slate-100 pb-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white">
                      <i className="fas fa-gavel"></i>
                    </div>
                    <h3 className="font-black text-slate-800 uppercase text-sm tracking-wider">Investment Auditor</h3>
                  </div>
                  <div className="p-5 bg-slate-900 rounded-2xl text-white space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Audit Classification</span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        data?.AuditorAI?.Classification === 'Pass' ? 'bg-emerald-500 text-white' : 
                        data?.AuditorAI?.Classification === 'Needs Revision' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {data?.AuditorAI?.Classification || 'N/A'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Recalculated Cost</span>
                        <span className="font-bold">${data?.AuditorAI?.RecalculatedInstalledCost?.toFixed(2) || '0.00'}/unit</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Funding Gap</span>
                        <span className="font-bold text-red-400">{formatCurrency(data?.AuditorAI?.FundingGapUSD || 0)} ({data?.AuditorAI?.FundingGapPercentage?.toFixed(1) || '0.0'}%)</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Stress Test Results</p>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="text-[10px] flex justify-between">
                          <span className="text-slate-400">Revenue -10%</span>
                          <span className="text-white font-medium">{data?.AuditorAI?.StressTestResults?.RevenueMinus10 || 'N/A'}</span>
                        </div>
                        <div className="text-[10px] flex justify-between">
                          <span className="text-slate-400">OPEX +15%</span>
                          <span className="text-white font-medium">{data?.AuditorAI?.StressTestResults?.OPEXPlus15 || 'N/A'}</span>
                        </div>
                        <div className="text-[10px] flex justify-between">
                          <span className="text-slate-400">Production -10%</span>
                          <span className="text-white font-medium">{data?.AuditorAI?.StressTestResults?.ProductionMinus10 || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk AI */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 border-b border-slate-100 pb-2">
                    <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
                      <i className="fas fa-shield-virus"></i>
                    </div>
                    <h3 className="font-black text-slate-800 uppercase text-sm tracking-wider">Risk Assessment AI</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Capital Adequacy</p>
                        <p className={`text-sm font-black ${(data?.RiskAI?.CapitalAdequacyRatio || 0) >= 0.9 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {data?.RiskAI?.CapitalAdequacyRatio?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Risk Level</p>
                        <p className={`text-sm font-black ${
                          data?.RiskAI?.RiskClassification === 'Moderate' ? 'text-emerald-600' : 
                          data?.RiskAI?.RiskClassification === 'Significant' ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {data?.RiskAI?.RiskClassification || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Market Volatility</p>
                        <p className="text-xs text-slate-700 font-medium">{data?.RiskAI?.MarketVolatility || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Regulatory Risk</p>
                        <p className="text-xs text-slate-700 font-medium">{data?.RiskAI?.RegulatoryRisk || 'N/A'}</p>
                      </div>
                      {data?.ProjectAnalyzer?.TechnologyCategory === 'Biofuel' && (
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Feedstock Stability</p>
                          <p className="text-xs text-slate-700 font-medium">{data?.RiskAI?.FeedstockStability || 'N/A'}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="bg-slate-50 -mx-8 -mb-8 p-8 border-t border-slate-200 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <img src="https://picsum.photos/seed/oman/40/40" className="w-10 h-10 rounded-full grayscale opacity-50" referrerPolicy="no-referrer" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Report Generated By</p>
                    <p className="text-xs font-black text-slate-700">BioFuel Insight AI Engine v2.5</p>
                  </div>
                </div>
                <button 
                  onClick={() => window.print()}
                  className="px-6 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition"
                >
                  <i className="fas fa-print mr-2"></i> Print Report
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Alert Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
      >
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{data?.ProjectAnalyzer?.ProjectName || 'Project Analysis'}</h2>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getRiskColor(data?.RiskExposureLevel || 'N/A')}`}>
              {data?.RiskExposureLevel || 'N/A'} Risk Exposure
            </span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-slate-500 font-medium">
            <span className="flex items-center"><i className="fas fa-location-dot mr-1.5 text-emerald-500"></i> {data?.ProjectAnalyzer?.Location || 'Oman'}</span>
            <span>•</span>
            <span className="flex items-center"><i className="fas fa-bolt mr-1.5 text-blue-500"></i> {data?.ProjectAnalyzer?.TechnologyCategory || 'Energy'}</span>
          </div>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowReport(true)}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-500 transition flex items-center shadow-lg"
          >
            <i className="fas fa-file-contract mr-2"></i> Official Report
          </button>
          <button 
            onClick={exportToCSV}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition flex items-center shadow-lg"
          >
            <i className="fas fa-download mr-2"></i> Export CSV
          </button>
        </div>
      </motion.div>

      {/* Primary Investment Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-xl flex flex-col items-center justify-center relative overflow-hidden group hover:border-emerald-100 transition-all"
        >
          <div className={`absolute top-0 right-0 p-2 text-[8px] font-black uppercase text-white ${scoreAssets.bg} px-3 rounded-bl-xl shadow-md`}>
            {scoreAssets.label}
          </div>
          <div className="flex flex-col items-center py-4">
            <span className={`text-5xl font-black ${scoreAssets.color}`}>{data.FinalFeasibilityScore}%</span>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Feasibility Score</p>
          <p className="text-[8px] text-slate-400 text-center mt-1 italic px-2 leading-tight">{scoreAssets.description}</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center"
        >
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Investment Verdict</div>
          <div className={`text-lg font-black leading-tight ${
            data.EconomicFeasibility.InvestmentVerdict === 'Investment Grade' ? 'text-emerald-600' : 
            data.EconomicFeasibility.InvestmentVerdict === 'Conditionally Viable' ? 'text-blue-600' : 'text-red-600'
          }`}>
            {data.EconomicFeasibility.InvestmentVerdict}
          </div>
          <div className="mt-2 text-[10px] font-bold text-slate-300 italic">Financial Status</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center"
        >
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Payback Period</div>
          <div className="text-3xl font-black text-slate-800">{data.EconomicFeasibility.PaybackPeriodYears} <span className="text-sm font-bold text-slate-400">Years</span></div>
          <div className="mt-2 text-[10px] font-bold text-slate-300 italic">Project ROI</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center"
        >
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Capital Adequacy</div>
          <div className={`text-3xl font-black ${data.EconomicFeasibility.CapitalAdequacyRatio >= 0.9 ? 'text-emerald-500' : 'text-amber-500'}`}>
            {data.EconomicFeasibility.CapitalAdequacyRatio.toFixed(2)}
          </div>
          <div className="mt-2 text-[10px] font-bold text-slate-300 italic">Budget vs Required</div>
        </motion.div>
      </div>

      {/* Detailed Financial Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
            <h3 className="text-white font-bold text-sm flex items-center">
              <i className="fas fa-file-invoice-dollar mr-3 text-emerald-400"></i>
              Financial Performance Metrics
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Industrial Benchmarks Applied</span>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-xs text-slate-500">Realistic Required CAPEX</span>
                <span className="text-sm font-black text-slate-800">{formatCurrency(data.EconomicFeasibility.RealisticRequiredCAPEX)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-xs text-slate-500">Investor Budget</span>
                <span className="text-sm font-black text-slate-800">{formatCurrency(data.ProjectAnalyzer.PreliminaryBudgetUSD || 0)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-xs text-slate-500">Funding Gap</span>
                <span className={`text-sm font-black ${data.EconomicFeasibility.FundingGapUSD > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {formatCurrency(data.EconomicFeasibility.FundingGapUSD)} ({data.EconomicFeasibility.FundingGapPercentage.toFixed(1)}%)
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-xs text-slate-500">Installed Cost per {data.ProjectAnalyzer.TechnologyCategory === 'Biofuel' ? 'kg' : 'kW'}</span>
                <span className="text-sm font-black text-slate-800">${data.EconomicFeasibility.InstalledCostPerUnit.toFixed(2)}/{data.ProjectAnalyzer.TechnologyCategory === 'Biofuel' ? 'kg' : 'kW'}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-xs text-slate-500">Annual Revenue</span>
                <span className="text-sm font-black text-emerald-600">{formatCurrency(data.EconomicFeasibility.AnnualRevenue)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-xs text-slate-500">Annual OPEX</span>
                <span className="text-sm font-black text-red-600">{formatCurrency(data.EconomicFeasibility.AnnualOPEX)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-xs text-slate-500">Gross Profit</span>
                <span className={`text-sm font-black ${data.EconomicFeasibility.GrossProfit > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                   {formatCurrency(data.EconomicFeasibility.GrossProfit)}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-xs text-slate-500">Annual Production</span>
                <span className="text-sm font-black text-slate-800">
                  {data.ProjectAnalyzer.ExpectedProduction?.toLocaleString()} {data.ProjectAnalyzer.TechnologyCategory === 'Biofuel' ? 'Tons' : 'MWh'}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 p-4 border-t border-slate-100">
            <p className="text-xs text-slate-600 italic leading-relaxed">
              <i className="fas fa-info-circle mr-2 text-blue-500"></i>
              {data.Rationale}
            </p>
          </div>
        </div>

        {/* Sensitivity Analysis */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-slate-800 px-6 py-4">
            <h3 className="text-white font-bold text-sm flex items-center">
              <i className="fas fa-vial mr-3 text-amber-400"></i>
              Sensitivity Stress Tests
            </h3>
          </div>
          <div className="p-6 flex-grow space-y-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Price Drop (-10%)</p>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700">Payback: {data.SensitivityAnalysis.PriceDrop10.PaybackPeriod.toFixed(1)} yrs</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${getRiskColor(data.SensitivityAnalysis.PriceDrop10.RiskLevel)}`}>
                  {data.SensitivityAnalysis.PriceDrop10.RiskLevel}
                </span>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">OPEX Increase (+15%)</p>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700">Payback: {data.SensitivityAnalysis.OPEXIncrease15.PaybackPeriod.toFixed(1)} yrs</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${getRiskColor(data.SensitivityAnalysis.OPEXIncrease15.RiskLevel)}`}>
                  {data.SensitivityAnalysis.OPEXIncrease15.RiskLevel}
                </span>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Production Drop (-10%)</p>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700">Payback: {data.SensitivityAnalysis.ProductionDrop10.PaybackPeriod.toFixed(1)} yrs</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${getRiskColor(data.SensitivityAnalysis.ProductionDrop10.RiskLevel)}`}>
                  {data.SensitivityAnalysis.ProductionDrop10.RiskLevel}
                </span>
              </div>
            </div>

            {/* Sensitivity Visualizer Chart */}
            <div className="pt-4 border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Investment Sensitivity Visualizer</p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.SensitivityAnalysis.DataPoints}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                    <YAxis yAxisId="left" hide />
                    <YAxis yAxisId="right" hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '9px', paddingTop: '10px' }} />
                    <Line yAxisId="left" type="monotone" dataKey="payback" name="Payback (Yrs)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    <Line yAxisId="right" type="monotone" dataKey="irr" name="IRR (%)" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[9px] text-slate-400 mt-2 text-center italic">Visualizing how market shifts impact your ROI</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Economic Chart */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <i className="fas fa-coins mr-3 text-blue-500"></i> Capital Expenditure Profile
          </h3>
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 'bold' }} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                  formatter={(val: number) => [`$${val.toLocaleString()}`, "Capital (USD)"]} 
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-slate-500 leading-relaxed italic border-l-4 border-slate-100 pl-4">
              "{data.EconomicFeasibility.Justification}"
            </p>
            <div className="grid grid-cols-2 gap-2">
              {data.EconomicFeasibility.EstimatedInvestmentUSD.MajorCosts.map((cost, i) => (
                <div key={i} className="text-[11px] font-bold text-slate-600 bg-slate-50 px-3 py-2 rounded-lg flex items-center">
                  <i className="fas fa-check-circle text-emerald-400 mr-2"></i> {cost}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vision 2040 Alignment */}
        <div className="bg-emerald-950 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <i className="fas fa-mosque text-9xl"></i>
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-6 flex items-center">
              <i className="fas fa-flag mr-3 text-emerald-400"></i> Oman Vision 2040 Alignment
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Energy Diversification</h4>
                <p className="text-sm text-emerald-50/80 leading-relaxed">{data.Vision2040Alignment.DiversificationContribution}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Industrial Development</h4>
                <p className="text-sm text-emerald-50/80 leading-relaxed">{data.Vision2040Alignment.IndustrialDevelopment}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investor Perspective AI */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
          <i className="fas fa-briefcase mr-3 text-blue-600"></i> Investor Perspective AI
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Return Potential</p>
            <p className="text-sm font-bold text-slate-800">{data.InvestorPerspective.ReturnPotential}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Capital Intensity</p>
            <p className="text-sm font-bold text-slate-800">{data.InvestorPerspective.CapitalIntensity}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Scalability Rating</p>
            <p className="text-sm font-bold text-slate-800">{data.InvestorPerspective.ScalabilityRating}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Market Demand</p>
            <p className="text-sm font-bold text-slate-800">{data.InvestorPerspective.MarketDemandAnalysis}</p>
          </div>
        </div>
        <div className="mt-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
          <p className="text-xs text-blue-800 flex items-start">
            <i className="fas fa-info-circle mr-2 mt-0.5"></i>
            <span><span className="font-bold">Risk exposure:</span> {data.InvestorPerspective.RiskExposure}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risks */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <i className="fas fa-shield-halved mr-3 text-amber-500"></i> Critical Risk Matrix
          </h3>
          <div className="space-y-4">
            {data.KeyRisks.map((risk, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/20 transition group">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                  risk.Type === 'Technical' ? 'bg-purple-100 text-purple-700' :
                  risk.Type === 'Financial' ? 'bg-blue-100 text-blue-700' :
                  risk.Type === 'Regulatory' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {risk.Type} Risk
                </span>
                <h4 className="text-sm font-bold text-slate-800 mb-2 mt-1">{risk.Description}</h4>
                <div className="flex items-start text-xs text-slate-500">
                  <i className="fas fa-lightbulb text-emerald-500 mr-2 mt-0.5 shrink-0"></i>
                  <p><span className="font-bold text-emerald-600 mr-1">Mitigation:</span> {risk.Mitigation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit & Assumptions */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-2xl text-white relative overflow-hidden">
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <i className="fas fa-user-check mr-3 text-emerald-400"></i> Local Consistency Review
            </h3>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase mb-6 ${
              data.AuditAIReview.ConsistencyCheck === 'Passed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              Consistency: {data.AuditAIReview.ConsistencyCheck}
            </div>
            <div className="space-y-2">
              {data.AuditAIReview.DataWarnings.map((w, i) => (
                <div key={i} className="text-xs text-slate-300 flex items-start">
                  <i className="fas fa-circle-info text-amber-400 mr-2 mt-0.5 shrink-0"></i>
                  {w}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <i className="fas fa-magnifying-glass mr-3 text-slate-400"></i> Model Assumptions & Transparency
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Key Benchmarks</p>
                <ul className="space-y-1">
                  {data.AnalysisAssumptions.BenchmarkSources.map((s, i) => (
                    <li key={i} className="text-[10px] text-slate-500">• {s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Analysis Limitations</p>
                <ul className="space-y-1">
                  {data.AnalysisAssumptions.ModelLimitations.map((l, i) => (
                    <li key={i} className="text-[10px] text-slate-500">• {l}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
