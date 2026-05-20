
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend
} from 'recharts';
import { BioFuelAnalysis } from './types';

interface DashboardProps {
  data: BioFuelAnalysis;
  language?: 'English' | 'Arabic';
}

export const Dashboard: React.FC<DashboardProps> = ({ data, language = 'English' }) => {
  const [showReport, setShowReport] = React.useState(false);
  
  
  const isArabic = language === 'Arabic';
  const t = (en: string, ar: string) => isArabic ? ar : en;

  const costData = [
    { name: t('Min Invest', 'الحد الأدنى للاستثمار'), value: data?.EconomicFeasibility?.EstimatedInvestmentUSD?.Minimum || 0 },
    { name: t('Max Invest', 'الحد الأقصى للاستثمار'), value: data?.EconomicFeasibility?.EstimatedInvestmentUSD?.Maximum || 0 },
  ];

  const isDataMissing = !data?.ProjectAnalyzer || data.ProjectAnalyzer.ExpectedProduction === null || data.ProjectAnalyzer.PreliminaryBudgetUSD === null;

  if (isDataMissing) {
    return (
      <div className="p-8 text-center text-[var(--text-secondary)]">
        <i className="fas fa-exclamation-triangle text-4xl mb-4 text-amber-700 dark:text-amber-400"></i>
        <p>{language === 'Arabic' ? "بيانات التحليل غير مكتملة. يرجى محاولة التحليل مرة أخرى." : "Incomplete analysis data. Please try analyzing again."}</p>
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
    if (score >= 80) return { color: 'text-[var(--accent-emerald)] dark:text-emerald-400', bg: 'bg-[var(--accent-emerald)]', border: 'border-[var(--accent-emerald)]', label: language === 'Arabic' ? 'درجة استثمارية' : 'INVESTMENT GRADE', description: language === 'Arabic' ? 'توافق تقني ومالي قوي.' : 'Strong technical & financial alignment.' };
    if (score >= 60) return { color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-600 dark:bg-blue-600', border: 'border-blue-500 dark:border-blue-400', label: language === 'Arabic' ? 'مجدي بشروط' : 'CONDITIONALLY VIABLE', description: language === 'Arabic' ? 'مخاطر معتدلة يمكن إدارتها عبر التخفيف.' : 'Moderate risks manageable via mitigation.' };
    if (score >= 40) return { color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-600 dark:bg-amber-600', border: 'border-amber-500', label: language === 'Arabic' ? 'مخاطر عالية' : 'HIGH RISK', description: language === 'Arabic' ? 'يتطلب تعديل استراتيجي كبير.' : 'Requires significant strategic adjustment.' };
    return { color: 'text-red-700 dark:text-red-400', bg: 'bg-red-600 dark:bg-red-600', border: 'border-red-500 dark:border-red-600/30', label: language === 'Arabic' ? 'غير قابل للتمويل' : 'NOT BANKABLE', description: language === 'Arabic' ? 'مقاييس غير مواتية على المستوى الحالي.' : 'Unfavorable metrics at current scale.' };
  };

  const scoreAssets = getScoreAssets(data?.FinalFeasibilityScore || 0);

  const getRiskColor = (level: string) => {
    if (!level) return 'text-[var(--text-secondary)] bg-[var(--bg-main)] border-[var(--border-glow)] dark:bg-white/5 dark:border-white/10';
    if (level === 'Moderate') return 'text-[var(--accent-emerald)] dark:text-emerald-400 bg-[var(--bg-main)] border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-500/30 dark:text-[var(--accent-emerald)] font-medium';
    if (level === 'Significant') return 'text-amber-700 dark:text-amber-400 bg-[var(--bg-main)] border-amber-100 dark:bg-amber-900/30 dark:border-amber-500/30 dark:text-amber-200 font-medium';
    return 'text-red-700 dark:text-red-400 bg-[var(--bg-main)] border-red-100 dark:bg-red-900/30 dark:border-red-500 dark:border-red-600/30/30 dark:text-red-300 font-medium';
  };

  const formatCurrency = (val: number) => `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  const formatOMR = (val: string | number) => `${val} OMR`;

  const budgetAdequacyRatio = data.EconomicFeasibility?.CapitalAdequacyRatio || 1.0;
  const isBudgetInsufficient = budgetAdequacyRatio < 1.0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-20"
    >
      {/* Budget Adequacy Warning */}
      <AnimatePresence>
        {isBudgetInsufficient && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[var(--bg-main)] border-l-4 border-red-500 dark:border-red-600/30 p-4 rounded-xl flex items-center mb-4 shadow-sm dark:bg-red-900/30 dark:border-red-500 dark:border-red-600/30"
          >
            <i className="fas fa-exclamation-triangle text-red-700 dark:text-red-400 mr-4 text-xl rtl:ml-4 rtl:mr-0"></i>
            <div>
              <p className="text-red-800 dark:text-red-300 font-black text-sm uppercase">{language === 'Arabic' ? 'تم اكتشاف نقص شديد في التمويل' : 'Severe Underfunding Detected'}</p>
              <p className="text-red-700 dark:text-red-200/80 text-xs font-medium">
                {language === 'Arabic' 
                 ? `ميزانية المستثمر تغطي ${(budgetAdequacyRatio * 100).toFixed(1)}% فقط من النفقات الرأسمالية المطلوبة، يرجى الاستثمار أو البحث عن حلول أخرى.`
                 : `The investor budget is only ${(budgetAdequacyRatio * 100).toFixed(1)}% of the required realistic CAPEX. Consider scaling down production or securing additional funding.`}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Official Report Modal */}
      <AnimatePresence>
        {showReport && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[var(--bg-main)]  overflow-y-auto p-4 md:p-8"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-5xl mx-auto bg-[var(--card-bg)] shadow-card  rounded-3xl  overflow-hidden border border-[var(--border-glow)]"
            >
            {/* Header */}
            <div className="bg-[var(--card-bg)] shadow-card px-8 py-6 flex justify-between items-center border-b border-[var(--border-glow)]">
              <div>
                <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">{t("Official Investment-Grade Report", "التقرير الرسمي للجدوى الاستثمارية")}</h2>
                <p className="text-[var(--text-secondary)] text-xs font-medium uppercase tracking-widest mt-1">Project: {data?.ProjectAnalyzer?.ProjectName || 'Unnamed'}</p>
              </div>
              <button 
                onClick={() => setShowReport(false)}
                className="w-10 h-10 rounded-full bg-[var(--card-bg)] shadow-card   border-[var(--border-glow)] hover:border-var(--accent-emerald)/10 text-[var(--text-primary)] flex items-center justify-center hover:bg-[var(--card-bg)] shadow-card   border-[var(--border-glow)] hover:border-var(--accent-emerald)/20 transition"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="p-8 space-y-10">
              {/* AI Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Technical AI */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 border-b border-[var(--border-glow)] pb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-700 dark:bg-blue-600">
                      <i className="fas fa-microchip"></i>
                    </div>
                    <h3 className="font-black text-[var(--text-secondary)]  uppercase text-sm tracking-wider">{t("Technical Engineering AI", "الذكاء الاصطناعي للهندسة التقنية")}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border-glow)]">
                      <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">{t("Installed Capacity", "القدرة المثبتة")}</p>
                      <p className="text-sm font-black text-[var(--text-secondary)] ">{data?.TechnicalAI?.InstalledCapacity || 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border-glow)]">
                      <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">{t("Energy Output", "إنتاج الطاقة")}</p>
                      <p className="text-sm font-black text-[var(--text-secondary)] ">{data?.TechnicalAI?.EnergyOutput || 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border-glow)]">
                      <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">{t("Benchmark CAPEX", "النفقات الرأسمالية المعيارية")}</p>
                      <p className="text-xs font-bold text-[var(--text-secondary)]">{data?.TechnicalAI?.BenchmarkCAPEXRange || 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border-glow)]">
                      <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">{t("TRL Level", "مستوى الجاهزية التكنولوجية")}</p>
                      <p className="text-sm font-black text-blue-700 dark:text-blue-400">TRL {data?.TechnicalAI?.TRLEstimate || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Financial AI */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 border-b border-[var(--border-glow)] pb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-700 dark:bg-emerald-600">
                      <i className="fas fa-chart-line"></i>
                    </div>
                    <h3 className="font-black text-[var(--text-secondary)]  uppercase text-sm tracking-wider">{t("Financial Modeling AI", "الذكاء الاصطناعي للنمذجة المالية")}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border-glow)]">
                      <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">{t("Realistic CAPEX", "النفقات الرأسمالية الواقعية")}</p>
                      <p className="text-sm font-black text-[var(--text-secondary)] ">{formatCurrency(data?.FinancialAI?.RealisticCAPEX || 0)}</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border-glow)]">
                      <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">{t("Annual OPEX", "النفقات التشغيلية السنوية")}</p>
                      <p className="text-sm font-black text-[var(--text-secondary)] ">{formatCurrency(data?.FinancialAI?.OPEX || 0)}</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border-glow)]">
                      <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">{t("Payback Period", "فترة الاسترداد")}</p>
                      <p className="text-sm font-black text-emerald-700 dark:text-emerald-400">{data?.FinancialAI?.PaybackYears || 0} Years</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border-glow)]">
                      <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">{t("IRR (Est.)", "معدل العائد الداخلي (تقديري)")}</p>
                      <p className="text-sm font-black text-emerald-700 dark:text-emerald-400">{data?.FinancialAI?.IRR_Simplified || 'N/A'}</p>
                    </div>
                    <div className="col-span-2 p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border-glow)]">
                      <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase mb-1">{t("LCOE / Unit Cost", "التكلفة المستوية للطاقة / تكلفة الوحدة")}</p>
                      <p className="text-sm font-black text-emerald-800 dark:text-emerald-300">{data?.FinancialAI?.LCOE_or_CostPerTon || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Auditor AI */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 border-b border-[var(--border-glow)] pb-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white">
                      <i className="fas fa-gavel"></i>
                    </div>
                    <h3 className="font-black text-[var(--text-secondary)]  uppercase text-sm tracking-wider">{t("Investment Auditor", "مدقق الاستثمار")}</h3>
                  </div>
                  <div className="p-5 bg-[var(--card-bg)] shadow-card rounded-2xl text-[var(--text-primary)] space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[var(--text-secondary)]">{t("Audit Classification", "تصنيف التدقيق")}</span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        data?.AuditorAI?.Classification === 'Pass' ? 'bg-[var(--accent-emerald)] text-white' : 
                        data?.AuditorAI?.Classification === 'Needs Revision' ? 'bg-amber-600 text-black dark:text-amber-950 font-bold' : 'bg-red-700 text-white dark:bg-red-700 dark:bg-red-600'
                      }`}>
                        {tt(data?.AuditorAI?.Classification || 'N/A', language || 'Arabic')}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-[var(--text-secondary)]">{t("Recalculated Cost", "التكلفة المعاد حسابها")}</span>
                        <span className="font-bold">${data?.AuditorAI?.RecalculatedInstalledCost?.toFixed(2) || '0.00'}/unit</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-[var(--text-secondary)]">{t("Funding Gap", "فجوة التمويل")}</span>
                        <span className="font-bold text-red-700 dark:text-red-400">{formatCurrency(data?.AuditorAI?.FundingGapUSD || 0)} ({data?.AuditorAI?.FundingGapPercentage?.toFixed(1) || '0.0'}%)</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-[var(--border-glow)]">
                      <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-2">{t("Stress Test Results", "نتائج اختبار تحمل الضغط")}</p>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="text-[10px] flex justify-between">
                          <span className="text-[var(--text-secondary)]">{t("Revenue -10%", "الإيرادات -10%")}</span>
                          <span className="text-[var(--text-primary)] font-medium">{data?.AuditorAI?.StressTestResults?.RevenueMinus10 || 'N/A'}</span>
                        </div>
                        <div className="text-[10px] flex justify-between">
                          <span className="text-[var(--text-secondary)]">{t("OPEX +15%", "نفقات التشغيل +15%")}</span>
                          <span className="text-[var(--text-primary)] font-medium">{data?.AuditorAI?.StressTestResults?.OPEXPlus15 || 'N/A'}</span>
                        </div>
                        <div className="text-[10px] flex justify-between">
                          <span className="text-[var(--text-secondary)]">{t("Production -10%", "الإنتاج -10%")}</span>
                          <span className="text-[var(--text-primary)] font-medium">{data?.AuditorAI?.StressTestResults?.ProductionMinus10 || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk AI */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 border-b border-[var(--border-glow)] pb-2">
                    <div className="w-8 h-8 rounded-lg bg-red-700 dark:bg-red-600">
                      <i className="fas fa-shield-virus"></i>
                    </div>
                    <h3 className="font-black text-[var(--text-secondary)]  uppercase text-sm tracking-wider">{t("Risk Assessment AI", "الذكاء الاصطناعي لتقييم المخاطر")}</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border-glow)]">
                        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">{t("Capital Adequacy", "كفاية رأس المال")}</p>
                        <p className={`text-sm font-black ${(data?.RiskAI?.CapitalAdequacyRatio || 0) >= 0.9 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                          {data?.RiskAI?.CapitalAdequacyRatio?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      <div className="p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border-glow)]">
                        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">{t("Risk Level", "مستوى الخطر")}</p>
                        <p className={`text-sm font-black ${
                          data?.RiskAI?.RiskClassification === 'Moderate' ? 'text-emerald-700 dark:text-emerald-400' : 
                          data?.RiskAI?.RiskClassification === 'Significant' ? 'text-amber-700 dark:text-amber-400' : 'text-red-700 dark:text-red-400'
                        }`}>
                          {tt(data?.RiskAI?.RiskClassification || 'N/A', language || 'Arabic')}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border-glow)] space-y-3">
                      <div>
                        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">{t("Market Volatility", "تقلبات السوق")}</p>
                        <p className="text-xs text-[var(--text-secondary)] font-medium">{data?.RiskAI?.MarketVolatility || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">{t("Regulatory Risk", "المخاطر التنظيمية")}</p>
                        <p className="text-xs text-[var(--text-secondary)] font-medium">{data?.RiskAI?.RegulatoryRisk || 'N/A'}</p>
                      </div>
                      {data?.ProjectAnalyzer?.TechnologyCategory === 'Biofuel' && (
                        <div>
                          <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">{t("Feedstock Stability", "استقرار المواد الخام")}</p>
                          <p className="text-xs text-[var(--text-secondary)] font-medium">{data?.RiskAI?.FeedstockStability || 'N/A'}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="bg-[var(--bg-main)] -mx-8 -mb-8 p-8 border-t border-[var(--border-glow)] flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <img src="https://picsum.photos/seed/oman/40/40" className="w-10 h-10 rounded-full grayscale opacity-50" referrerPolicy="no-referrer" />
                  <div>
                    <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">{t("Report Generated By", "أُنشئ التقرير بواسطة")}</p>
                    <p className="text-xs font-black text-[var(--text-secondary)]">{t("BioFuel Insight AI Engine v2.5", "محرك الذكاء الاصطناعي BioFuel Insight v2.5")}</p>
                  </div>
                </div>
                <button 
                  onClick={() => window.print()}
                  className="px-6 py-2 bg-[var(--card-bg)] shadow-card text-[var(--text-primary)] text-xs font-bold rounded-lg hover:bg-[var(--bg-main)] transition"
                >
                  <i className="fas fa-print mr-2"></i>{t("Print Report", "طباعة التقرير")}</button>
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
            <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">{data?.ProjectAnalyzer?.ProjectName || tt('Project Analysis', language)}</h2>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getRiskColor(data?.RiskExposureLevel || 'N/A')}`}>
              {language === 'Arabic' ? `التعرض للمخاطر: ${tt(data?.RiskExposureLevel, language)}` : `${data?.RiskExposureLevel || 'N/A'} Risk Exposure`}
            </span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-[var(--text-secondary)] font-medium">
            <span className="flex items-center"><i className="fas fa-location-dot mr-1.5 text-[var(--accent-emerald)] dark:text-emerald-400 rtl:ml-1.5 rtl:mr-0"></i> {data?.ProjectAnalyzer?.Location || 'Oman'}</span>
            <span>•</span>
            <span className="flex items-center"><i className="fas fa-bolt mr-1.5 text-blue-700 dark:text-blue-400 rtl:ml-1.5 rtl:mr-0"></i> {data?.ProjectAnalyzer?.TechnologyCategory || 'Energy'}</span>
          </div>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowReport(true)}
            className="px-4 py-2 bg-emerald-700 dark:bg-emerald-600 text-xs font-bold rounded-lg hover:bg-[var(--accent-emerald)] transition flex items-center shadow-card"
          >
            <i className="fas fa-file-contract mr-2 rtl:ml-2 rtl:mr-0"></i>{t("Official Report", "التقرير الرسمي")}</button>
          <button 
            onClick={exportToCSV}
            className="px-4 py-2 bg-[var(--card-bg)] shadow-card text-[var(--text-primary)] text-xs font-bold rounded-lg hover:bg-[var(--bg-main)] transition flex items-center shadow-card"
          >
            <i className="fas fa-download mr-2 rtl:ml-2 rtl:mr-0"></i>{t("Export CSV", "تصدير CSV")}</button>
        </div>
      </motion.div>

      {/* Primary Investment Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[var(--card-bg)] shadow-card   border-[var(--border-glow)] hover:border-var(--accent-emerald) p-6 rounded-2xl border-2 border-[var(--border-glow)] shadow-card flex flex-col items-center justify-center relative overflow-hidden group hover:border-[var(--border-glow)] transition-all"
        >
          <div className={`absolute top-0 right-0 p-2 text-[8px] font-black uppercase text-white ${scoreAssets.bg} px-3 rounded-bl-xl shadow-md`}>
            {scoreAssets.label}
          </div>
          <div className="flex flex-col items-center py-4">
            <span className={`text-5xl font-black ${scoreAssets.color}`}>{data.FinalFeasibilityScore}%</span>
          </div>
          <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mt-2">{t("Feasibility Score", "درجة الجدوى")}</p>
          <p className="text-[8px] text-[var(--text-secondary)] text-center mt-1 italic px-2 leading-tight">{scoreAssets.description}</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-[var(--card-bg)] shadow-card  p-6 rounded-2xl  border border-[var(--border-glow)] flex flex-col justify-center"
        >
          <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{t("Investment Verdict", "قرار الاستثمار")}</div>
          <div className={`text-lg font-black leading-tight ${
            data.DynamicScores?.overallViabilityRating === 'A' ? 'text-emerald-700 dark:text-emerald-400' : 
            data.DynamicScores?.overallViabilityRating === 'B' ? 'text-blue-700 dark:text-blue-400' : 'text-red-700 dark:text-red-400'
          }`}>
            {t("Rating:", "التقييم:")} {data.DynamicScores?.overallViabilityRating || 'N/A'}
          </div>
          <div className="mt-2 text-[10px] font-bold text-[var(--text-secondary)] italic">{tt(data?.EconomicFeasibility?.InvestmentVerdict, language || 'Arabic')}</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-[var(--card-bg)] shadow-card  p-6 rounded-2xl  border border-[var(--border-glow)] flex flex-col justify-center"
        >
          <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{t("Payback Period", "فترة الاسترداد")}</div>
          <div className="text-3xl font-black text-[var(--text-secondary)] ">{data.EconomicFeasibility.PaybackPeriodYears} <span className="text-sm font-bold text-[var(--text-secondary)]">{language === 'Arabic' ? "سنوات" : "Years"}</span></div>
          <div className="mt-2 text-[10px] font-bold text-[var(--text-secondary)] italic">{language === 'Arabic' ? "عائد الاستثمار للمشروع" : "Project ROI"}</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-[var(--card-bg)] shadow-card  p-6 rounded-2xl  border border-[var(--border-glow)] flex flex-col justify-center"
        >
          <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{t("Corporate Tax (Oman)", "ضريبة الشركات (عُمان)")}</div>
          <div className="text-2xl font-black text-[var(--text-secondary)] ">15% <span className="text-[10px] text-[var(--text-secondary)]">{t("Applied", "مُطبقة")}</span></div>
          <div className="mt-2 text-[8px] text-[var(--text-secondary)] italic">{t("Net Profit After Tax included in IRR", "يشمل معدل العائد الداخلي صافي الربح بعد الضريبة")}</div>
        </motion.div>
      </div>

      {/* Dynamic Weighted Scoring & SWOT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-[var(--card-bg)] shadow-card  p-8 rounded-3xl  border border-[var(--border-glow)]">
           <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest mb-6 flex items-center">
            <i className="fas fa-chart-pie mr-2 text-indigo-500"></i>{t("Dynamic AI Scoring", "التسجيل الديناميكي للذكاء الاصطناعي")}</h3>
           <div className="space-y-6">
             {[
               { label: 'Economic stability', score: data.DynamicScores?.economicScore || 0, weight: '40%', color: 'from-blue-500 to-indigo-600' },
               { label: 'Sustainability Impact', score: data.DynamicScores?.sustainabilityScore || 0, weight: '30%', color: 'from-emerald-500 to-teal-600' },
               { label: 'Risk Resilience', score: data.DynamicScores?.riskScore || 0, weight: '30%', color: 'from-amber-500 to-orange-600' },
             ].map((m, i) => (
               <div key={i} className="space-y-2">
                 <div className="flex justify-between text-xs">
                   <span className="font-bold text-[var(--text-secondary)]">{m.label} ({m.weight})</span>
                   <span className="font-black text-[var(--text-primary)]">{m.score}%</span>
                 </div>
                 <div className="w-full bg-[var(--card-bg)] shadow-card   border-[var(--border-glow)] hover:border-var(--accent-emerald)/5 h-2 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${m.score}%` }}
                     className={`h-full bg-gradient-to-r ${m.color}`}
                   />
                 </div>
               </div>
             ))}
           </div>
        </div>

        <div className="lg:col-span-2 bg-[var(--bg-main)] p-8 rounded-3xl shadow-card text-[var(--text-primary)]">
          <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest mb-6 flex items-center">
            <i className="fas fa-search-plus mr-2 text-[var(--accent-emerald)] dark:text-emerald-400"></i>{t("SWOT Intelligence Analyze", "تحليل ذكاء SWOT")}</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase mb-2">{t("Strengths", "نقاط القوة")}</h4>
              <ul className="space-y-1">
                {data.DynamicScores?.swotAnalysis.strengths.map((s, i) => <li key={i} className="text-[11px] text-[var(--text-primary)] font-medium flex items-start"><i className="fas fa-plus-circle mr-2 mt-1 text-emerald-700 dark:text-emerald-400/50"></i> {s}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase mb-2">{t("Opportunities", "الفرص")}</h4>
              <ul className="space-y-1">
                {data.DynamicScores?.swotAnalysis.opportunities.map((o, i) => <li key={i} className="text-[11px] text-[var(--text-primary)] font-medium flex items-start"><i className="fas fa-arrow-up mr-2 mt-1 text-blue-700 dark:text-blue-400/50"></i> {o}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase mb-2">{t("Weaknesses", "نقاط الضعف")}</h4>
              <ul className="space-y-1">
                {data.DynamicScores?.swotAnalysis.weaknesses.map((w, i) => <li key={i} className="text-[11px] text-[var(--text-primary)] font-medium flex items-start"><i className="fas fa-minus-circle mr-2 mt-1 text-amber-700 dark:text-amber-400/50"></i> {w}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-red-700 dark:text-red-400 uppercase mb-2">{t("Threats", "التهديدات")}</h4>
              <ul className="space-y-1">
                {data.DynamicScores?.swotAnalysis.threats.map((t, i) => <li key={i} className="text-[11px] text-[var(--text-primary)] font-medium flex items-start"><i className="fas fa-exclamation-circle mr-2 mt-1 text-red-700 dark:text-red-400/50"></i> {t}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Localization & Taxes */}
        <div className="bg-[var(--card-bg)] shadow-card  p-8 rounded-3xl  border border-[var(--border-glow)]">
          <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest mb-6 flex items-center">
            <i className="fas fa-landmark mr-2 text-blue-700 dark:text-blue-400"></i>{t("Omani Localization Logic", "منطق التوطين العماني")}</h3>
          <div className="space-y-4">
            <div className="p-4 bg-[var(--bg-main)] rounded-2xl">
              <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-2">{t("Industry Tax (Oman)", "ضريبة الصناعة (عُمان)")}</p>
              <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">{data.OmanLogic?.corporateTaxApplied}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase mb-1">{t("Omanization Cost Allocation", "تخصيص تكلفة التعمين")}</p>
                <p className="text-lg font-black text-blue-900">{data.OmanLogic?.omanizationCostEstimate.OMR} OMR / Year</p>
                <p className="text-[10px] text-blue-700 dark:text-blue-400 italic">{t("35% Minimum Quota Applied", "الحد الأدنى مطبق بنسبة 35%")}</p>
              </div>
              <div className="bg-[var(--card-bg)] shadow-card   border-[var(--border-glow)] hover:border-var(--accent-emerald) p-3 rounded-xl shadow-sm text-center">
                 <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">{t("In USD", "بالدولار الأمريكي")}</p>
                 <p className="text-xs font-black text-[var(--text-primary)]">{data.OmanLogic?.omanizationCostEstimate.USD}</p>
              </div>
            </div>
            <div className="p-4 bg-[var(--bg-main)] rounded-2xl">
              <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-2">{t("Industrial Utility Tariffs", "تعرفة المرافق الصناعية")}</p>
              <p className="text-xs text-[var(--text-secondary)] italic leading-relaxed">{data.OmanLogic?.utilityTariffDetails}</p>
            </div>
          </div>
        </div>

        {/* Legal Permit Roadmap */}
        <div className="bg-[var(--card-bg)] shadow-card  p-8 rounded-3xl  border border-[var(--border-glow)] overflow-hidden">
          <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest mb-6 flex items-center">
            <i className="fas fa-file-signature mr-2 text-emerald-700 dark:text-emerald-400"></i>{t("Legal & Permit Roadmap", "خارطة الطريق القانونية والتصاريح")}</h3>
          <div className="space-y-3 relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-[var(--card-bg)] shadow-card   border-[var(--border-glow)] hover:border-var(--accent-emerald)/5"></div>
            {data.LegalRoadmap?.requiredPermits.map((permit, i) => (
              <div key={i} className="relative flex items-start space-x-4 pl-10 pb-4">
                <div className="absolute left-3 w-2.5 h-2.5 rounded-full bg-[var(--accent-emerald)] border-2 border-white"></div>
                <div>
                  <h4 className="text-xs font-black text-[var(--text-secondary)] ">{permit.name}</h4>
                  <p className="text-[10px] text-[var(--text-secondary)] font-medium">{permit.description}</p>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold italic mt-1 flex items-center">
                    <i className="fas fa-clock mr-1"></i> {permit.estimatedTime}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-glow)] text-center">
            <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase italic">Primary Authority: {data.LegalRoadmap?.authority}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Executive Summary */}
        <div className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-slate-50 dark:from-indigo-900/40 dark:to-slate-900/40 p-8 rounded-3xl shadow-card text-[var(--text-primary)] border border-[var(--border-glow)]">
           <h3 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-4 flex items-center">
            <i className="fas fa-scroll mr-2"></i>{t("Executive Summary (AI Generated)", "الملخص التنفيذي (من إنشاء الذكاء الاصطناعي)")}</h3>
           <p className="text-lg font-light leading-relaxed mb-6 italic text-indigo-900 dark:text-indigo-100">
             "{data.ExecutiveSummary}"
           </p>
           <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-[var(--accent-emerald)] dark:text-emerald-400 bg-[var(--card-bg)] shadow-card   border-[var(--border-glow)] hover:border-var(--accent-emerald)/5 p-3 rounded-xl border border-[var(--border-glow)] w-fit">
              <i className="fas fa-flag text-sm"></i>
              <span>{t("Aligned with Oman Vision 2040 Economic Diversification", "متوافق مع التنويع الاقتصادي لرؤية عُمان 2040")}</span>
           </div>
        </div>

        {/* Enhanced Sensitivity */}
        <div className="bg-[var(--card-bg)] shadow-card   border-[var(--border-glow)] hover:border-var(--accent-emerald) p-6 rounded-3xl border border-[var(--border-glow)] shadow-sm">
           <h3 className="text-xs font-black text-[var(--text-primary)] uppercase tracking-widest mb-4 flex items-center">
            <i className="fas fa-robot mr-2 text-amber-700 dark:text-amber-400"></i>{t("Monte Carlo Summary", "ملخص مونت كارلو")}</h3>
           <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
             {data.AdvancedSensitivity?.monteCarloSummary}
           </p>
           <div className="p-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-glow)]">
             <p className="text-[9px] font-black text-amber-700 uppercase mb-2 tracking-widest">{t("Stress Test: 10% Market Price Drop", "اختبار الضغط: انخفاض سعر السوق بنسبة 10%")}</p>
             <div className="flex justify-between items-center">
               <div>
                 <p className="text-xs font-bold text-[var(--text-secondary)]">{t("New Payback", "استرداد جديد")}</p>
                 <p className="text-lg font-black text-amber-700 dark:text-amber-400">{data.AdvancedSensitivity?.sellingPriceDropImpact.newPaybackPeriod}</p>
               </div>
               <div className="text-right">
                 <p className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">{t("Viability", "الجدوى")}</p>
                 <p className="text-xs font-black text-[var(--text-secondary)]  uppercase tracking-widest">{data.AdvancedSensitivity?.sellingPriceDropImpact.viabilityStatus}</p>
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* Detailed Financial Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[var(--card-bg)] shadow-card   border-[var(--border-glow)] hover:border-var(--accent-emerald) rounded-2xl border border-[var(--border-glow)] shadow-sm overflow-hidden">
          <div className="bg-[var(--card-bg)] shadow-card px-6 py-4 flex justify-between items-center">
            <h3 className="text-[var(--text-primary)] font-bold text-sm flex items-center">
              <i className="fas fa-file-invoice-dollar mr-3 text-[var(--accent-emerald)] dark:text-emerald-400"></i>{t("Financial Performance Metrics", "مقاييس الأداء المالي")}</h3>
            <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">{t("Industrial Benchmarks Applied", "تم تطبيق المعايير الصناعية")}</span>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-xs text-[var(--text-secondary)]">{t("Realistic Required CAPEX", "النفقات الرأسمالية المطلوبة الواقعية")}</span>
                <span className="text-sm font-black text-[var(--text-secondary)] ">{formatCurrency(data.EconomicFeasibility.RealisticRequiredCAPEX)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-xs text-[var(--text-secondary)]">{t("Investor Budget", "ميزانية المستثمر")}</span>
                <span className="text-sm font-black text-[var(--text-secondary)] ">{formatCurrency(data.ProjectAnalyzer.PreliminaryBudgetUSD || 0)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-xs text-[var(--text-secondary)]">{t("Funding Gap", "فجوة التمويل")}</span>
                <span className={`text-sm font-black ${data.EconomicFeasibility.FundingGapUSD > 0 ? 'text-red-700 dark:text-red-400' : 'text-[var(--accent-emerald)] dark:text-emerald-400'}`}>
                  {formatCurrency(data.EconomicFeasibility.FundingGapUSD)} ({data.EconomicFeasibility.FundingGapPercentage.toFixed(1)}%)
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-xs text-[var(--text-secondary)]">Installed Cost per {data.ProjectAnalyzer.TechnologyCategory === 'Biofuel' ? 'kg' : 'kW'}</span>
                <span className="text-sm font-black text-[var(--text-secondary)] ">${data.EconomicFeasibility.InstalledCostPerUnit.toFixed(2)}/{data.ProjectAnalyzer.TechnologyCategory === 'Biofuel' ? 'kg' : 'kW'}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-xs text-[var(--text-secondary)]">{t("Annual Revenue", "الإيرادات السنوية")}</span>
                <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">{formatCurrency(data.EconomicFeasibility.AnnualRevenue)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-xs text-[var(--text-secondary)]">{t("Annual OPEX", "النفقات التشغيلية السنوية")}</span>
                <span className="text-sm font-black text-red-700 dark:text-red-400">{formatCurrency(data.EconomicFeasibility.AnnualOPEX)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-xs text-[var(--text-secondary)]">{t("Gross Profit", "إجمالي الربح")}</span>
                <span className={`text-sm font-black ${data.EconomicFeasibility.GrossProfit > 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                   {formatCurrency(data.EconomicFeasibility.GrossProfit)}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-xs text-[var(--text-secondary)]">{t("Annual Production", "الإنتاج السنوي")}</span>
                <span className="text-sm font-black text-[var(--text-secondary)] ">
                  {data.ProjectAnalyzer.ExpectedProduction?.toLocaleString()} {data.ProjectAnalyzer.TechnologyCategory === 'Biofuel' ? 'Tons' : 'MWh'}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-[var(--bg-main)] p-4 border-t border-[var(--border-glow)]">
            <p className="text-xs text-[var(--text-secondary)] italic leading-relaxed">
              <i className="fas fa-info-circle mr-2 text-blue-700 dark:text-blue-400"></i>
              {data.Rationale}
            </p>
          </div>
        </div>

        {/* Sensitivity Analysis */}
        <div className="bg-[var(--card-bg)] shadow-card   border-[var(--border-glow)] hover:border-var(--accent-emerald) rounded-2xl border border-[var(--border-glow)] shadow-sm overflow-hidden flex flex-col">
          <div className="bg-[var(--bg-main)] px-6 py-4">
            <h3 className="text-[var(--text-primary)] font-bold text-sm flex items-center">
              <i className="fas fa-vial mr-3 text-amber-700 dark:text-amber-400"></i>{t("Sensitivity Stress Tests", "اختبارات تحمل الحساسية")}</h3>
          </div>
          <div className="p-6 flex-grow space-y-6">
            <div className="p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border-glow)]">
              <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2">{t("Price Drop (-10%)", "انخفاض السعر (-10%)")}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[var(--text-secondary)]">Payback: {data.SensitivityAnalysis.PriceDrop10.PaybackPeriod.toFixed(1)} yrs</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${getRiskColor(data.SensitivityAnalysis.PriceDrop10.RiskLevel)}`}>
                  {data.SensitivityAnalysis.PriceDrop10.RiskLevel}
                </span>
              </div>
            </div>
            <div className="p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border-glow)]">
              <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2">{t("OPEX Increase (+15%)", "زيادة نفقات التشغيل (+15%)")}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[var(--text-secondary)]">Payback: {data.SensitivityAnalysis.OPEXIncrease15.PaybackPeriod.toFixed(1)} yrs</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${getRiskColor(data.SensitivityAnalysis.OPEXIncrease15.RiskLevel)}`}>
                  {data.SensitivityAnalysis.OPEXIncrease15.RiskLevel}
                </span>
              </div>
            </div>
            <div className="p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border-glow)]">
              <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2">{t("Production Drop (-10%)", "انخفاض الإنتاج (-10%)")}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[var(--text-secondary)]">Payback: {data.SensitivityAnalysis.ProductionDrop10.PaybackPeriod.toFixed(1)} yrs</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${getRiskColor(data.SensitivityAnalysis.ProductionDrop10.RiskLevel)}`}>
                  {data.SensitivityAnalysis.ProductionDrop10.RiskLevel}
                </span>
              </div>
            </div>

            {/* Sensitivity Visualizer Chart */}
            <div className="pt-4 border-t border-[var(--border-glow)]">
              <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4">{t("Investment Sensitivity Visualizer", "متخيل حساسية الاستثمار")}</p>
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
                    <Line yAxisId="left" type="monotone" dataKey="payback" name={t("Payback (Yrs)", "فترة الاسترداد (سنوات)")} stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    <Line yAxisId="right" type="monotone" dataKey="irr" name={t("IRR (%)", "معدل العائد الداخلي (%)")} stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[9px] text-[var(--text-secondary)] mt-2 text-center italic">{t("Visualizing how market shifts impact your ROI", "تصور كيف تؤثر تحولات السوق على عائد الاستثمار الخاص بك")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Expert Counsel & Recommendations */}
      {data.ExpertCounsel && data.ExpertCounsel.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-indigo-50 to-slate-50 dark:from-indigo-900/40 dark:to-slate-900/40 rounded-2xl border border-indigo-800 shadow-card overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-[var(--border-glow)] flex items-center justify-between">
            <h3 className="text-[var(--text-primary)] font-bold text-lg flex items-center">
              <i className="fas fa-lightbulb text-amber-700 dark:text-amber-400 mr-3 text-xl"></i>{t("Expert Counsel & Actionable Recommendations", "مشورة الخبراء وتوصيات قابلة للتنفيذ")}</h3>
            <span className="text-[10px] font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-widest bg-indigo-100 dark:bg-indigo-900/50 px-3 py-1 rounded-full border border-indigo-300 dark:border-indigo-500/30">{t("Strategic Advisory", "استشارات استراتيجية")}</span>
          </div>
          <div className="p-6 md:p-8">
            <p className="text-indigo-800 dark:text-indigo-200 text-sm mb-6 leading-relaxed">
              Based on the current feasibility score of <strong className="text-[var(--accent-emerald)] dark:text-emerald-400">{data.FinalFeasibilityScore}%</strong>, our AI investment committee recommends the following strategic actions to improve project viability, reduce risk, and increase your potential ROI:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.ExpertCounsel.map((counsel, index) => (
                <div key={index} className="bg-[var(--card-bg)] shadow-card   border-[var(--border-glow)] hover:border-var(--accent-emerald)/5 border border-[var(--border-glow)] rounded-xl p-4 flex items-start group hover:bg-[var(--card-bg)] shadow-card   border-[var(--border-glow)] hover:border-var(--accent-emerald)/10 transition-colors">
                  <div className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 mr-4 group-hover:bg-indigo-500 group-hover:text-[var(--text-primary)] transition-colors">
                    {index + 1}
                  </div>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed pt-1">
                    {counsel}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Economic Chart */}
        <div className="bg-[var(--card-bg)] shadow-card  p-8 rounded-2xl  border border-[var(--border-glow)]">
          <h3 className="text-lg font-bold text-[var(--text-secondary)]  mb-6 flex items-center">
            <i className="fas fa-coins mr-3 text-blue-700 dark:text-blue-400"></i>{t("Capital Expenditure Profile", "ملف النفقات الرأسمالية")}</h3>
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 'bold' }} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                  formatter={(val: number) => [`$${val.toLocaleString()}`, t("Capital (USD)", "رأس المال (دولار)")]} 
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic border-l-4 border-[var(--border-glow)] pl-4">
              "{data.EconomicFeasibility.Justification}"
            </p>
            <div className="grid grid-cols-2 gap-2">
              {data.EconomicFeasibility.EstimatedInvestmentUSD.MajorCosts?.map((cost, i) => (
                <div key={i} className="text-[11px] font-bold text-[var(--text-secondary)] bg-[var(--bg-main)] px-3 py-2 rounded-lg flex items-center">
                  <i className="fas fa-check-circle text-[var(--accent-emerald)] dark:text-emerald-400 mr-2"></i> {cost}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vision 2040 Alignment */}
        <div className="bg-[var(--card-bg)] p-8 rounded-2xl shadow-card text-[var(--text-primary)] border border-[var(--border-glow)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <i className="fas fa-mosque text-9xl"></i>
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-6 flex items-center">
              <i className="fas fa-flag mr-3 text-[var(--accent-emerald)] dark:text-emerald-400"></i>{t("Oman Vision 2040 Alignment", "التوافق مع رؤية عُمان 2040")}</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-[10px] font-bold text-[var(--accent-emerald)] dark:text-emerald-400 uppercase tracking-widest mb-1">{t("Energy Diversification", "تنوع الطاقة")}</h4>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{data.Vision2040Alignment.DiversificationContribution}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-[var(--accent-emerald)] dark:text-emerald-400 uppercase tracking-widest mb-1">{t("Industrial Development", "التنمية الصناعية")}</h4>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{data.Vision2040Alignment.IndustrialDevelopment}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investor Perspective AI */}
      <div className="bg-[var(--card-bg)] shadow-card  p-8 rounded-2xl  border border-[var(--border-glow)]">
        <h3 className="text-lg font-bold text-[var(--text-secondary)]  mb-6 flex items-center">
          <i className="fas fa-briefcase mr-3 text-blue-700 dark:text-blue-400"></i>{t("Investor Perspective AI", "الذكاء الاصطناعي من منظور المستثمر")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border-glow)]">
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{t("Return Potential", "إمكانات العائد")}</p>
            <p className="text-sm font-bold text-[var(--text-secondary)] ">{tt(data?.InvestorPerspective?.ReturnPotential, language || 'Arabic')}</p>
          </div>
          <div className="p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border-glow)]">
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{t("Capital Intensity", "كثافة رأس المال")}</p>
            <p className="text-sm font-bold text-[var(--text-secondary)] ">{tt(data?.InvestorPerspective?.CapitalIntensity, language || 'Arabic')}</p>
          </div>
          <div className="p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border-glow)]">
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{t("Scalability Rating", "تقييم قابلية التوسع")}</p>
            <p className="text-sm font-bold text-[var(--text-secondary)] ">{tt(data?.InvestorPerspective?.ScalabilityRating, language || 'Arabic')}</p>
          </div>
          <div className="p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border-glow)]">
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{t("Market Demand", "طلب السوق")}</p>
            <p className="text-sm font-bold text-[var(--text-secondary)] ">{data.InvestorPerspective.MarketDemandAnalysis}</p>
          </div>
        </div>
        <div className="mt-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
          <p className="text-xs text-[var(--text-primary)] flex items-start">
            <i className="fas fa-info-circle mr-2 mt-0.5"></i>
            <span><span className="font-bold">Risk exposure:</span> {data.InvestorPerspective.RiskExposure}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risks */}
        <div className="bg-[var(--card-bg)] shadow-card  p-8 rounded-2xl  border border-[var(--border-glow)]">
          <h3 className="text-lg font-bold text-[var(--text-secondary)]  mb-6 flex items-center">
            <i className="fas fa-shield-halved mr-3 text-amber-700 dark:text-amber-400"></i>{t("Critical Risk Matrix", "مصفوفة المخاطر الحرجة")}</h3>
          <div className="space-y-4">
            {data.KeyRisks?.map((risk, i) => (
              <div key={i} className="p-4 rounded-xl border border-[var(--border-glow)] hover:border-amber-200 hover:bg-[var(--bg-main)]/20 transition group">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                  risk.Type === 'Technical' ? 'bg-purple-100 text-purple-700' :
                  risk.Type === 'Financial' ? 'bg-blue-100 text-blue-700' :
                  risk.Type === 'Regulatory' ? 'bg-amber-100 text-amber-700' :
                  'bg-[var(--card-bg)] shadow-card   border-[var(--border-glow)] hover:border-var(--accent-emerald)/5 text-[var(--text-secondary)]'
                }`}>
                  {risk.Type} Risk
                </span>
                <h4 className="text-sm font-bold text-[var(--text-secondary)]  mb-2 mt-1">{risk.Description}</h4>
                <div className="flex items-start text-xs text-[var(--text-secondary)]">
                  <i className="fas fa-lightbulb text-[var(--accent-emerald)] dark:text-emerald-400 mr-2 mt-0.5 shrink-0"></i>
                  <p><span className="font-bold text-emerald-700 dark:text-emerald-400 mr-1">{language === 'Arabic' ? "التخفيف:" : "Mitigation:"}</span> {risk.Mitigation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit & Assumptions */}
        <div className="space-y-6">
          <div className="bg-[var(--card-bg)] shadow-card p-8 rounded-2xl text-[var(--text-primary)] relative overflow-hidden">
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <i className="fas fa-user-check mr-3 text-[var(--accent-emerald)] dark:text-emerald-400"></i>{t("Local Consistency Review", "مراجعة الاتساق المحلي")}</h3>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase mb-6 ${
              data.AuditAIReview.ConsistencyCheck === 'Passed' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-amber-600 dark:bg-amber-600/20 text-amber-700 dark:text-amber-400'
            }`}>
              Consistency: {data.AuditAIReview.ConsistencyCheck}
            </div>
            <div className="space-y-2">
              {data.AuditAIReview.DataWarnings?.map((w, i) => (
                <div key={i} className="text-xs text-[var(--text-secondary)] flex items-start">
                  <i className="fas fa-circle-info text-amber-700 dark:text-amber-400 mr-2 mt-0.5 shrink-0"></i>
                  {w}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--card-bg)] shadow-card  p-8 rounded-2xl  border border-[var(--border-glow)]">
            <h3 className="text-lg font-bold text-[var(--text-secondary)]  mb-4 flex items-center">
              <i className="fas fa-magnifying-glass mr-3 text-[var(--text-secondary)]"></i>{t("Model Assumptions & Transparency", "افتراضات النموذج والشفافية")}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2">{t("Key Benchmarks", "المعايير الرئيسية")}</p>
                <ul className="space-y-1">
                  {data.AnalysisAssumptions.BenchmarkSources?.map((s, i) => (
                    <li key={i} className="text-[10px] text-[var(--text-secondary)]">• {s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2">{t("Analysis Limitations", "قيود التحليل")}</p>
                <ul className="space-y-1">
                  {data.AnalysisAssumptions.ModelLimitations?.map((l, i) => (
                    <li key={i} className="text-[10px] text-[var(--text-secondary)]">• {l}</li>
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
