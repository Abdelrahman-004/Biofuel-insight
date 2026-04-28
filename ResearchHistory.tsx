
import * as React from 'react';
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

interface ResearchHistoryProps {
  language?: string;
  history: ResearchImplementationAnalysis[];
  onSelect: (entry: ResearchImplementationAnalysis) => void;
  onClear: () => void;
}

export const ResearchHistory: React.FC<ResearchHistoryProps> = ({ language = 'English', history, onSelect, onClear }) => {
  if (history.length === 0) {
    return (
      <div className="bg-[var(--card-bg)] shadow-card backdrop-blur-[10px] rounded-3xl p-12 text-center shadow-card border border-[var(--border-glow)]">
        <div className="bg-[var(--bg-main)] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-microscope text-[var(--text-secondary)] text-3xl"></i>
        </div>
        <h3 className="text-xl font-black text-[var(--text-primary)] mb-2">{language === 'Arabic' ? "لا يوجد سجل أبحاث" : "No Research History"}</h3>
        <p className="text-[var(--text-secondary)] max-w-xs mx-auto">{language === 'Arabic' ? "ستظهر تحليلات التنفيذ العلمي الخاصة بك هنا بمجرد اكتمالها." : "Your scientific implementation analyses will appear here once completed."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-[var(--text-primary)]">{language === 'Arabic' ? "سجل الأبحاث" : "Research History"}</h2>
        <button 
          onClick={onClear}
          className="text-xs font-bold text-red-500 hover:text-red-600 transition uppercase tracking-widest"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {history.map((entry) => (
          <div 
            key={entry.id}
            onClick={() => onSelect(entry)}
            className="bg-[var(--card-bg)] shadow-card backdrop-blur-[10px] p-6 rounded-2xl shadow-card border border-[var(--border-glow)] hover:border-blue-300 hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-black text-[var(--text-primary)] group-hover:text-blue-600 transition">{entry.ResearchInputs.BiofuelType}</h4>
                <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">{entry.ResearchInputs.FeedstockType}</p>
              </div>
              <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black">
                Score: {entry.ReadinessScore.OverallScore}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-[var(--bg-main)] p-3 rounded-xl">
                <p className="text-[8px] font-bold text-[var(--text-secondary)] uppercase mb-1">{language === 'Arabic' ? "النطاق" : "Scale"}</p>
                <p className="text-xs font-bold text-[var(--text-secondary)]">{entry.ResearchInputs.DesiredPilotScale}</p>
              </div>
              <div className="bg-[var(--bg-main)] p-3 rounded-xl">
                <p className="text-[8px] font-bold text-[var(--text-secondary)] uppercase mb-1">{language === 'Arabic' ? "مستوى الجاهزية التكنولوجية" : "TRL"}</p>
                <p className="text-xs font-bold text-[var(--text-secondary)]">{entry.ResearchInputs.TechnologyReadinessLevel}</p>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-[var(--text-secondary)]">
              <span className="font-medium italic">{entry.timestamp}</span>
              <span className="text-blue-500 font-bold group-hover:translate-x-1 transition-transform">View Details <i className="fas fa-arrow-right ml-1"></i></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
