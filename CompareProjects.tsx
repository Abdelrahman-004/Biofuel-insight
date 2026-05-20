
import * as React from 'react';
import { ProjectHistoryEntry } from './types';

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

interface CompareProjectsProps {
  language?: string;
  entries: ProjectHistoryEntry[];
  onBack: () => void;
}

export const CompareProjects: React.FC<CompareProjectsProps> = ({ language = 'English', entries, onBack }) => {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center text-[var(--text-secondary)] hover:text-emerald-700 dark:text-emerald-400 font-bold text-sm transition"
        >
          <i className="fas fa-arrow-left mr-2"></i> Back to History
        </button>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">{language === 'Arabic' ? "مقارنة المشاريع" : "Project Comparison"}</h2>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--border-glow)] shadow-sm bg-[var(--card-bg)] shadow-card   border-[var(--border-glow)] hover:border-var(--accent-emerald)">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--bg-main)] border-b border-[var(--border-glow)]">
              <th className="p-6 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest border-r border-[var(--border-glow)] min-w-[200px]">{language === 'Arabic' ? "مقياس" : "Metric"}</th>
              {entries.map(entry => (
                <th key={entry.id} className="p-6 text-center border-r border-[var(--border-glow)] min-w-[250px]">
                  <div className="text-emerald-700 dark:text-emerald-400 font-black text-lg">{entry.projectName}</div>
                  <div className="text-[10px] text-[var(--text-secondary)] uppercase font-bold tracking-tighter">{entry.timestamp}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="p-4 bg-[var(--bg-main)] font-bold text-[var(--text-secondary)] text-xs border-r border-[var(--border-glow)]">{language === 'Arabic' ? "درجة الجدوى" : "Feasibility Score"}</td>
              {entries.map(e => (
                <td key={e.id} className="p-4 text-center border-r border-[var(--border-glow)]">
                  <div className="text-2xl font-black text-[var(--text-secondary)] ">{e.score}%</div>
                  <div className={`text-[10px] font-bold uppercase ${e.score > 80 ? 'text-[var(--accent-emerald)] dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                    {e.level}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 bg-[var(--bg-main)] font-bold text-[var(--text-secondary)] text-xs border-r border-[var(--border-glow)]">{language === 'Arabic' ? "نوع المواد الخام" : "Feedstock Type"}</td>
              {entries.map(e => (
                <td key={e.id} className="p-4 text-center border-r border-[var(--border-glow)] text-sm font-medium text-[var(--text-secondary)]">
                  {e.feedstock}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 bg-[var(--bg-main)] font-bold text-[var(--text-secondary)] text-xs border-r border-[var(--border-glow)]">{language === 'Arabic' ? "الموقع" : "Location"}</td>
              {entries.map(e => (
                <td key={e.id} className="p-4 text-center border-r border-[var(--border-glow)] text-sm text-[var(--text-secondary)]">
                  {e.location}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 bg-[var(--bg-main)] font-bold text-[var(--text-secondary)] text-xs border-r border-[var(--border-glow)]">{language === 'Arabic' ? "النظرة الاقتصادية" : "Economic Outlook"}</td>
              {entries.map(e => (
                <td key={e.id} className="p-4 text-center border-r border-[var(--border-glow)] text-xs italic text-[var(--text-secondary)] px-6">
                  "{e.fullData.EconomicFeasibility.Assessment}"
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 bg-[var(--bg-main)] font-bold text-[var(--text-secondary)] text-xs border-r border-[var(--border-glow)]">{language === 'Arabic' ? "فترة الاسترداد" : "Payback Period"}</td>
              {entries.map(e => (
                <td key={e.id} className="p-4 text-center border-r border-[var(--border-glow)] font-bold text-[var(--text-secondary)] ">
                  {e.fullData.EconomicFeasibility.PaybackPeriodYears} Years
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 bg-[var(--bg-main)] font-bold text-[var(--text-secondary)] text-xs border-r border-[var(--border-glow)]">{language === 'Arabic' ? "كثافة الكربون" : "Carbon Intensity"}</td>
              {entries.map(e => (
                <td key={e.id} className="p-4 text-center border-r border-[var(--border-glow)] text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  {e.fullData.EnvironmentalImpact.CarbonEmissions_kgCO2_per_liter} kg CO₂/L
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
