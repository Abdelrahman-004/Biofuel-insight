
import * as React from 'react';
import { motion } from 'framer-motion';
import { ResearchImplementationAnalysis } from './types';

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

interface ResearchDashboardProps {
  data: ResearchImplementationAnalysis;
  language?: 'English' | 'Arabic';
}

export const ResearchDashboard: React.FC<ResearchDashboardProps> = ({ data, language = 'English' }) => {
    const isArabic = language === 'Arabic';
  const t = (en: string, ar: string) => isArabic ? ar : en;
  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-[var(--accent-emerald)]';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-amber-500';
    return 'text-red-500';
  };

  // Safety check for missing data
  if (!data || !data.ResearchInputs || !data.ReadinessScore) {
    return (
      <div className="p-8 text-center text-[var(--text-secondary)]">
        <i className="fas fa-exclamation-triangle text-4xl mb-4 text-amber-500"></i>
        <p>{language === 'Arabic' ? "بيانات التحليل غير مكتملة. يرجى محاولة التحليل مرة أخرى." : "Incomplete analysis data. Please try analyzing again."}</p>
      </div>
    );
  }

  // Safe access helper for cost items
  const safeCost = (item: any) => ({
    USD: item?.USD || 'N/A',
    OMR: item?.OMR || 'N/A'
  });

  const finance = data.AdjustedFinancialApproximation || {
    EquipmentCost: {}, InstallationCost: {}, FeedstockCost: {}, OperatingCost: {}, ContingencyBuffer: {}, TotalBudgetWithBuffer: {}, OmanLogisticsMultiplierApplied: false
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-20"
    >
      {/* Header & Feasibility Overview */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-[var(--card-bg)] shadow-card text-[var(--text-primary)] p-8 rounded-3xl shadow-card border border-[var(--border-glow)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <i className="fas fa-microscope text-[12rem]"></i>
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-2">{language === 'Arabic' ? "تحليل تنفيذ البحوث" : "Research Implementation Analysis"}</h2>
              <div className="flex items-center space-x-4 text-sm text-[var(--text-secondary)] font-bold uppercase tracking-widest">
                <span>{data.ResearchInputs.BiofuelType}</span>
                <span>•</span>
                <span>{data.ResearchInputs.ConversionPathway} Pathway</span>
                <span>•</span>
                <span>TRL {data.ResearchInputs.TechnologyReadinessLevel}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 bg-blue-500 text-white px-6 py-3 rounded-2xl shadow-card flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-tighter opacity-80">{language === 'Arabic' ? "درجة التنفيذ" : "Implementation Score"}</span>
              <span className="text-3xl font-black">{data.ReadinessScore?.OverallScore || 'N/A'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white/5 p-6 rounded-2xl border border-[var(--border-glow)]">
              <h3 className="text-blue-400 font-black uppercase text-xs tracking-widest mb-4 flex items-center">
                <i className="fas fa-flask mr-2"></i> Feasibility Overview
              </h3>
              <p className="text-lg text-[var(--text-secondary)]  leading-relaxed italic">
                {data.FeasibilityOverview || "No overview available."}
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-xl border border-[var(--border-glow)]">
                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{language === 'Arabic' ? "النطاق التجريبي المستهدف" : "Target Pilot Scale"}</p>
                <p className="text-xl font-black text-[var(--text-primary)]">{data.ResearchInputs.DesiredPilotScale}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-[var(--border-glow)]">
                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{language === 'Arabic' ? "كفاءة المختبر" : "Lab Efficiency"}</p>
                <p className="text-xl font-black text-[var(--accent-emerald)] dark:text-emerald-400">{data.ResearchInputs.ConversionEfficiency}%</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-[var(--border-glow)]">
                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{language === 'Arabic' ? "الإنتاجية المخبرية" : "Lab Yield"}</p>
                <p className="text-sm font-black text-blue-400 uppercase">{data.ResearchInputs.LaboratoryYield}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Implementation Estimator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[var(--card-bg)]/90 shadow-card backdrop-blur-[10px] p-8 rounded-3xl  border border-[var(--border-glow)]"
        >
          <h3 className="text-xl font-black text-[var(--text-primary)] mb-6 flex items-center">
            <i className="fas fa-tools mr-3 text-blue-600"></i>{language === 'Arabic' ? "المعدات والإعداد" : "Equipment & Setup"}</h3>
          <div className="space-y-4">
            {data.ImplementationEstimator?.EquipmentSetup?.map((item, i) => (
              <div key={i} className="flex items-start p-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border-glow)]">
                <i className="fas fa-check-circle text-blue-500 mr-3 mt-1"></i>
                <span className="text-sm text-[var(--text-secondary)] font-medium">{item}</span>
              </div>
            ))}
            <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">{language === 'Arabic' ? "الطاقة والمرافق" : "Energy & Utilities"}</p>
              <p className="text-sm text-blue-900 leading-relaxed">{data.ImplementationEstimator?.EnergyUtilities}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[var(--card-bg)]/90 shadow-card backdrop-blur-[10px] p-8 rounded-3xl  border border-[var(--border-glow)]"
        >
          <h3 className="text-xl font-black text-[var(--text-primary)] mb-6 flex items-center">
            <i className="fas fa-vial-circle-check mr-3 text-emerald-600"></i>{language === 'Arabic' ? "مُقدِّر النطاق التجريبي" : "Pilot-Scale Estimator"}</h3>
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{language === 'Arabic' ? "متطلبات المواد الخام" : "Feedstock Requirements"}</p>
              <p className="text-sm text-[var(--text-secondary)]  font-bold leading-relaxed">{data.ImplementationEstimator?.FeedstockRequirements}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{language === 'Arabic' ? "تعديلات الكفاءة" : "Efficiency Adjustments"}</p>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic border-l-4 border-emerald-100 pl-4">
                {data.ImplementationEstimator?.EfficiencyAdjustments}
              </p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
              <p className="text-[10px] font-bold text-[var(--accent-emerald)] dark:text-emerald-400 uppercase tracking-widest mb-1">{language === 'Arabic' ? "إدارة النفايات" : "Waste Management"}</p>
              <p className="text-sm text-emerald-900 leading-relaxed">{data.ImplementationEstimator?.WasteManagement}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Production Output */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[var(--card-bg)]/90 shadow-card backdrop-blur-[10px] p-8 rounded-3xl  border border-[var(--border-glow)]"
      >
        <h3 className="text-lg font-black text-[var(--text-primary)] mb-6 flex items-center">
          <i className="fas fa-flask-vial mr-3 text-purple-600"></i>{language === 'Arabic' ? "تقدير الإنتاج" : "Production Output Estimation"}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-purple-50 p-4 rounded-2xl">
            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1">{language === 'Arabic' ? "إنتاج الوقود السنوي" : "Annual Fuel Output"}</p>
            <p className="text-lg font-black text-purple-900">{data.ProductionOutput?.AnnualFuelOutput}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl">
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">{language === 'Arabic' ? "المعادل من الطاقة" : "Energy Equivalent"}</p>
            <p className="text-lg font-black text-blue-900">{data.ProductionOutput?.EnergyOutput}</p>
          </div>
          <div className="bg-[var(--bg-main)] p-4 rounded-2xl">
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{language === 'Arabic' ? "إمكانية المنتجات الثانوية" : "By-Product Potential"}</p>
            <p className="text-sm text-[var(--text-secondary)] font-bold">{data.ProductionOutput?.ByProductValueEstimation}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl">
            <p className="text-[10px] font-bold text-[var(--accent-emerald)] dark:text-emerald-400 uppercase tracking-widest mb-1">{language === 'Arabic' ? "الحد من الكربون" : "Carbon Reduction"}</p>
            <p className="text-sm text-emerald-600 font-bold">{data.ProductionOutput?.CarbonReductionPotential}</p>
          </div>
        </div>
      </motion.div>

      {/* Resource Requirements & Sensitivity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[var(--card-bg)]/90 shadow-card backdrop-blur-[10px] p-8 rounded-3xl  border border-[var(--border-glow)]"
        >
          <h3 className="text-xl font-black text-[var(--text-primary)] mb-6 flex items-center">
            <i className="fas fa-leaf mr-3 text-emerald-600"></i>{language === 'Arabic' ? "متطلبات الموارد" : "Resource Requirements"}</h3>
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{language === 'Arabic' ? "توازن الكتلة" : "Mass Balance"}</p>
              <p className="text-sm text-[var(--text-secondary)]  font-bold leading-relaxed">{data.ResourceRequirements?.MassBalance}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">{language === 'Arabic' ? "متطلبات المعالجة المسبقة" : "Pre-Treatment Required"}</p>
              <p className="text-sm text-amber-900 leading-relaxed">{data.ResourceRequirements?.PreTreatmentRequired}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[var(--card-bg)]/90 shadow-card backdrop-blur-[10px] p-8 rounded-3xl  border border-[var(--border-glow)]"
        >
          <h3 className="text-xl font-black text-[var(--text-primary)] mb-6 flex items-center">
            <i className="fas fa-chart-line mr-3 text-blue-600"></i>{language === 'Arabic' ? "تحليل الحساسية" : "Sensitivity Analysis"}</h3>
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{language === 'Arabic' ? "السيناريو" : "Scenario"}</p>
              <p className="text-sm text-[var(--text-secondary)]  font-bold leading-relaxed">{data.SensitivityAnalysis?.Scenario}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">{language === 'Arabic' ? "التأثير على سعر اللتر" : "Impact on Liter Price"}</p>
              <p className="text-xl font-black text-blue-900 leading-relaxed">{data.SensitivityAnalysis?.ImpactOnLiterPrice}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Adjusted Financial Approximation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[var(--bg-main)] p-8 rounded-3xl shadow-sm border border-[var(--border-glow)]"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h3 className="text-xl font-black text-[var(--text-primary)] flex items-center">
            <i className="fas fa-university mr-3 text-amber-600"></i> Adjusted Financial Approximation
          </h3>
          {finance.OmanLogisticsMultiplierApplied && (
            <span className="mt-2 md:mt-0 text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 px-3 py-1 rounded-full border border-amber-200">
              Oman Logistics Multiplier (1.2x) Applied
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[var(--card-bg)]/90 shadow-card backdrop-blur-[10px] p-6 rounded-2xl  border border-[var(--border-glow)]">
            <h4 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-widest mb-4">Capital Expenditure (CAPEX)</h4>
            <div className="space-y-3">
              {[
                { label: 'Equipment Cost', val: safeCost(finance.EquipmentCost) },
                { label: 'Installation Cost', val: safeCost(finance.InstallationCost) },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 text-sm">
                  <span className="text-[var(--text-secondary)] font-medium">{item.label}</span>
                  <div className="text-right">
                    <div className="text-[var(--text-primary)] font-bold">{item.val.USD}</div>
                    <div className="text-[10px] text-[var(--text-secondary)] font-medium">{item.val.OMR}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <h4 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-widest mt-6 mb-4">Operational Expenditure (OPEX)</h4>
            <div className="space-y-3">
              {[
                { label: 'Feedstock Cost', val: safeCost(finance.FeedstockCost) },
                { label: 'Operating Cost', val: safeCost(finance.OperatingCost) },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 text-sm">
                  <span className="text-[var(--text-secondary)] font-medium">{item.label}</span>
                  <div className="text-right">
                    <div className="text-[var(--text-primary)] font-bold">{item.val.USD}</div>
                    <div className="text-[10px] text-[var(--text-secondary)] font-medium">{item.val.OMR}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--card-bg)]/90 shadow-card backdrop-blur-[10px] p-6 rounded-2xl  border border-[var(--border-glow)] flex flex-col justify-center">
            <div className="space-y-6">
              <div className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border-glow)] flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">Contingency Buffer (15%)</p>
                  <p className="text-xs text-[var(--text-secondary)]">{language === 'Arabic' ? "هامش أمان لتكاليف غير متوقعة" : "Safety margin for unforeseen expenses"}</p>
                </div>
                <div className="text-right">
                  <div className="text-[var(--text-secondary)] font-black">{safeCost(finance.ContingencyBuffer).USD}</div>
                  <div className="text-[10px] text-[var(--text-secondary)] font-bold">{safeCost(finance.ContingencyBuffer).OMR}</div>
                </div>
              </div>
              
              <div className="p-6 bg-amber-600 text-white rounded-2xl shadow-card">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">{language === 'Arabic' ? "إجمالي الميزانية (مع الاحتياطي)" : "Total Budget (With Buffer)"}</p>
                <div className="flex flex-col">
                  <span className="text-3xl font-black">{safeCost(finance.TotalBudgetWithBuffer).USD}</span>
                  <span className="text-sm font-bold opacity-90">{safeCost(finance.TotalBudgetWithBuffer).OMR}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Technical Risk Assessment */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-[var(--card-bg)]/90 shadow-card backdrop-blur-[10px] p-8 rounded-3xl  border border-[var(--border-glow)]"
      >
        <h3 className="text-xl font-black text-[var(--text-primary)] mb-6 flex items-center">
          <i className="fas fa-shield-halved mr-3 text-red-600"></i>{language === 'Arabic' ? "تقييم المخاطر الفنية" : "Technical Risk Assessment"}</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-4">{language === 'Arabic' ? "تحديات علمية" : "Scientific Challenges"}</h4>
            <ul className="space-y-3">
              {data.TechnicalRiskAssessment?.ScientificChallenges?.map((challenge, i) => (
                <li key={i} className="flex items-start text-sm text-[var(--text-secondary)] bg-red-50/50 p-3 rounded-xl border border-red-100">
                  <i className="fas fa-circle-exclamation text-red-500 mr-3 mt-1"></i>
                  {challenge}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-[var(--accent-emerald)] uppercase tracking-widest mb-4">{language === 'Arabic' ? "استراتيجيات التخفيف" : "Mitigation Strategies"}</h4>
            <ul className="space-y-3">
              {data.TechnicalRiskAssessment?.MitigationStrategies?.map((strategy, i) => (
                <li key={i} className="flex items-start text-sm text-[var(--text-secondary)] bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                  <i className="fas fa-check-circle text-[var(--accent-emerald)] mr-3 mt-1"></i>
                  {strategy}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* TRL Scaling Roadmap */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-[var(--card-bg)]/90 shadow-card backdrop-blur-[10px] p-8 rounded-3xl  border border-[var(--border-glow)]"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-[var(--text-primary)] flex items-center">
            <i className="fas fa-map-signs mr-3 text-indigo-600"></i>{language === 'Arabic' ? "خارطة طريق متكيفة لمستوى الجاهزية التكنولوجية (TRL)" : "Adaptive TRL Roadmap"}</h3>
          <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100">{language === 'Arabic' ? "مسار التطور الى TRL 9" : "Path to TRL 9"}</span>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-white/5 -translate-x-1/2 hidden md:block"></div>
          
          <div className="space-y-12 relative">
            {(data.TRLRoadmap || [])?.map((step, i) => (
              <div key={i} className={`flex flex-col md:flex-row items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="flex-1 w-full md:w-auto">
                  <div className={`p-6 rounded-2xl border ${data.ResearchInputs.TechnologyReadinessLevel >= step.trl ? 'bg-indigo-50 border-indigo-100' : 'bg-[var(--bg-main)] border-[var(--border-glow)] opacity-60'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${data.ResearchInputs.TechnologyReadinessLevel >= step.trl ? 'bg-indigo-600 text-white' : 'bg-slate-400 text-white'}`}>
                        TRL {step.trl}
                      </span>
                      <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">{step.estimatedDuration}</span>
                    </div>
                    <h4 className="text-sm font-black text-[var(--text-primary)] mb-2">{step.title}</h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">{step.description}</p>
                    <div className="space-y-2">
                      {step.keyMilestones?.map((m, mi) => (
                        <div key={mi} className="flex items-center text-[10px] text-[var(--text-secondary)] font-bold">
                          <i className="fas fa-check-circle mr-2 text-indigo-400"></i>
                          {m}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mx-8 my-4 md:my-0 relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md ${data.ResearchInputs.TechnologyReadinessLevel >= step.trl ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-[var(--text-secondary)]'}`}>
                    {data.ResearchInputs.TechnologyReadinessLevel >= step.trl ? <i className="fas fa-check text-xs"></i> : <span className="text-xs font-black">{step.trl}</span>}
                  </div>
                </div>
                
                <div className="flex-1 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Readiness Scores */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-[var(--card-bg)]/90 shadow-card backdrop-blur-[10px] p-8 rounded-3xl  border border-[var(--border-glow)]"
      >
        <h4 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-6">{language === 'Arabic' ? "مقاييس الجاهزية لتنفيذ البحوث" : "Research Implementation Readiness Metrics"}</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Technical Scalability', score: data.ReadinessScore?.TechnicalScalability || 0 },
            { label: 'Experimental Feasibility', score: data.ReadinessScore?.ExperimentalFeasibility || 0 },
            { label: 'Safety & Environmental', score: data.ReadinessScore?.SafetyEnvironmental || 0 },
            { label: 'Small-Scale Readiness', score: data.ReadinessScore?.ReadinessForSmallScale || 0 },
          ].map((m, i) => (
            <div key={i} className="text-center">
              <div className={`text-3xl font-black mb-1 ${scoreColor(m.score)}`}>{m.score}%</div>
              <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">{m.label}</div>
              <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className={`h-full ${m.score >= 80 ? 'bg-[var(--accent-emerald)]' : m.score >= 60 ? 'bg-blue-500' : m.score >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${m.score}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Pilot-Scale Implementation Cost Estimation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-[var(--bg-main)] p-8 rounded-3xl shadow-sm border border-[var(--border-glow)]"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h3 className="text-xl font-black text-[var(--text-primary)] flex items-center">
            <i className="fas fa-university mr-3 text-amber-600"></i>{language === 'Arabic' ? "تقدير تكلفة النطاق التجريبي الأكاديمي" : "Academic Pilot-Scale Cost Approximation"}</h3>
          <span className="mt-2 md:mt-0 text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 px-3 py-1 rounded-full border border-amber-200">
            University-Based System
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[var(--card-bg)]/90 shadow-card backdrop-blur-[10px] p-6 rounded-2xl  border border-[var(--border-glow)]">
            <h4 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-widest mb-4">{language === 'Arabic' ? "تقدير تكلفة المعدات" : "Equipment Cost Estimate"}</h4>
            <div className="space-y-3">
              {[
                { label: 'Reactor System', val: safeCost(data.CostEstimation?.EquipmentCosts?.ReactorSystem) },
                { label: 'Pre-treatment System', val: safeCost(data.CostEstimation?.EquipmentCosts?.PreTreatmentSystem) },
                { label: 'Heating/Cooling Systems', val: safeCost(data.CostEstimation?.EquipmentCosts?.HeatingCoolingSystems) },
                { label: 'Distillation/Upgrading Unit', val: safeCost(data.CostEstimation?.EquipmentCosts?.DistillationUpgradingUnit) },
                { label: 'Storage Tanks', val: safeCost(data.CostEstimation?.EquipmentCosts?.StorageTanks) },
                { label: 'Safety & Monitoring', val: safeCost(data.CostEstimation?.EquipmentCosts?.SafetyMonitoringSystems) },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 text-sm">
                  <span className="text-[var(--text-secondary)] font-medium">{item.label}</span>
                  <div className="text-right">
                    <div className="text-[var(--text-primary)] font-bold">{item.val.USD}</div>
                    <div className="text-[10px] text-[var(--text-secondary)] font-medium">{item.val.OMR}</div>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 border-t border-[var(--border-glow)]">
                <span className="text-[var(--text-primary)] font-black uppercase tracking-widest text-[10px]">{language === 'Arabic' ? "إجمالي تكلفة المعدات" : "Total Equipment Cost"}</span>
                <div className="text-right">
                  <div className="text-blue-600 font-black">{safeCost(data.CostEstimation?.EquipmentCosts?.TotalEquipmentCost).USD}</div>
                  <div className="text-[10px] text-blue-400 font-bold">{safeCost(data.CostEstimation?.EquipmentCosts?.TotalEquipmentCost).OMR}</div>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-[var(--text-primary)] font-black uppercase tracking-widest text-[10px]">Installation & Setup (20-30%)</span>
                <div className="text-right">
                  <div className="text-blue-600 font-black">{safeCost(data.CostEstimation?.InstallationSetupCost).USD}</div>
                  <div className="text-[10px] text-blue-400 font-bold">{safeCost(data.CostEstimation?.InstallationSetupCost).OMR}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card-bg)]/90 shadow-card backdrop-blur-[10px] p-6 rounded-2xl  border border-[var(--border-glow)]">
            <h4 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-widest mb-4">{language === 'Arabic' ? "تكلفة التشغيل السنوية" : "Annual Operating Cost"}</h4>
            <div className="space-y-3">
              {[
                { label: 'Feedstock Cost', val: safeCost(data.CostEstimation?.AnnualOperatingCost?.FeedstockCost) },
                { label: 'Energy Consumption', val: safeCost(data.CostEstimation?.AnnualOperatingCost?.EnergyConsumption) },
                { label: 'Maintenance', val: safeCost(data.CostEstimation?.AnnualOperatingCost?.Maintenance) },
                { label: 'Consumables', val: safeCost(data.CostEstimation?.AnnualOperatingCost?.Consumables) },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 text-sm">
                  <span className="text-[var(--text-secondary)] font-medium">{item.label}</span>
                  <div className="text-right">
                    <div className="text-[var(--text-primary)] font-bold">{item.val.USD}</div>
                    <div className="text-[10px] text-[var(--text-secondary)] font-medium">{item.val.OMR}</div>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center py-2 border-b border-slate-50 text-sm">
                <span className="text-[var(--text-secondary)] font-medium">{language === 'Arabic' ? "طاقم العمل في المختبر" : "Laboratory Staff"}</span>
                <span className="text-[var(--text-primary)] font-bold">{data.CostEstimation?.AnnualOperatingCost?.LaboratoryStaff || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center pt-4">
                <span className="text-[var(--text-primary)] font-black uppercase tracking-widest text-[10px]">{language === 'Arabic' ? "إجمالي التشغيل السنوي" : "Total Annual Operating"}</span>
                <div className="text-right">
                  <div className="text-emerald-600 font-black">{safeCost(data.CostEstimation?.AnnualOperatingCost?.TotalAnnualOperatingCost).USD}</div>
                  <div className="text-[10px] text-[var(--accent-emerald)] dark:text-emerald-400 font-bold">{safeCost(data.CostEstimation?.AnnualOperatingCost?.TotalAnnualOperatingCost).OMR}</div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-amber-600 text-white rounded-2xl shadow-card">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">{language === 'Arabic' ? "إجمالي الميزانية الأولية المطلوبة" : "Total Initial Budget Required"}</p>
              <div className="flex flex-col">
                <span className="text-2xl font-black">{safeCost(data.CostEstimation?.TotalInitialBudgetRange).USD}</span>
                <span className="text-sm font-bold opacity-90">{safeCost(data.CostEstimation?.TotalInitialBudgetRange).OMR}</span>
              </div>
              <p className="text-[10px] mt-2 italic opacity-70">{language === 'Arabic' ? "الميزانية التقديرية المطلوبة لتنفيذ هذا البحث على نطاق تجريبي" : "Estimated Budget Required to Implement This Research at Pilot Scale"}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--border-glow)]">
          <h4 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3">{language === 'Arabic' ? "افتراضات التكلفة" : "Cost Assumptions"}</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            {(data.CostEstimation?.CostAssumptions || []).map((assumption: string, i: number) => (
              <li key={i} className="text-xs text-[var(--text-secondary)] flex items-start">
                <i className="fas fa-info-circle text-amber-400 mr-2 mt-0.5"></i>
                {assumption}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Risks & Assumptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-[var(--card-bg)]/90 shadow-card backdrop-blur-[10px] p-8 rounded-3xl  border border-[var(--border-glow)]"
        >
          <h3 className="text-lg font-black text-[var(--text-primary)] mb-6 flex items-center">
            <i className="fas fa-triangle-exclamation mr-3 text-red-500"></i>{language === 'Arabic' ? "عوامل عدم اليقين والمخاطر" : "Uncertainties & Risk Factors"}</h3>
          <ul className="space-y-3">
            {data.RiskFactors?.map((risk, i) => (
              <li key={i} className="flex items-start text-sm text-[var(--text-secondary)] bg-red-50/30 p-3 rounded-xl border border-red-100/50">
                <i className="fas fa-circle-exclamation text-red-500 mr-3 mt-1"></i>
                {risk}
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-[var(--card-bg)]/90 shadow-card backdrop-blur-[10px] p-8 rounded-3xl  border border-[var(--border-glow)]"
        >
          <h3 className="text-lg font-black text-[var(--text-primary)] mb-6 flex items-center">
            <i className="fas fa-clipboard-list mr-3 text-[var(--text-secondary)]"></i> Scientific Assumptions
          </h3>
          <ul className="space-y-3">
            {data.Assumptions?.map((assumption, i) => (
              <li key={i} className="flex items-start text-sm text-[var(--text-secondary)] bg-[var(--bg-main)] p-3 rounded-xl border border-[var(--border-glow)]">
                <i className="fas fa-info-circle text-blue-400 mr-3 mt-1"></i>
                {assumption}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

    </motion.div>
  );
};
