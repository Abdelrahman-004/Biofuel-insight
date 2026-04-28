const fs = require('fs');

const commonTranslations = {
  // Common
  "N/A": "غير متوفر",
  "Years": "سنوات",
  "Tons": "طن",
  "Applied": "مُطبقة",
  "In USD": "بالدولار الأمريكي",
  
  // Dashboard statuses
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
  
  // Challenge Solver titles
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
  
  // Optimizer Tool titles
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
  
  // Research Dashboard
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

function autoTranslate(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Add the translation dictionary safely at the top if not exists
  if (!content.includes('const autoDict = {')) {
    const dictStr = `\nconst autoDict: Record<string, string> = ${JSON.stringify(commonTranslations, null, 2)};\nconst tt = (key: string | undefined, lang: string) => { if(!key) return key; return lang === 'Arabic' ? (autoDict[key] || key) : key; };\n`;
    
    // Inject right after the imports
    content = content.replace(/(import .*;\n)+/, (match) => match + dictStr);
  }

  // Replace static >text<
  Object.keys(commonTranslations).forEach(en => {
    // Avoid short common words replacing code if any
    if (en.length < 3) return;
    const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Static HTML text replacement >Text< -> >{t("Text", "نص")}<
    const regex1 = new RegExp(`>\\s*${escapeRegExp(en)}\\s*<`, 'g');
    content = content.replace(regex1, `>{language === 'Arabic' ? "${commonTranslations[en]}" : "${en}"}<`);

    // We can also wrap variables that are rendered safely if they are in the dict
    // Just a basic text replace for static elements. We did a lot of them.
  });

  // Specifically for enums in dashboard and other tools
  // Let's replace `{data?.RiskAI?.RiskClassification}` or similar dynamically with `tt(..., language)`
  const dynamicFields = [
    'RiskClassification', 'Classification', 'overallViabilityRating', 'InvestmentVerdict',
    'RiskLevel', 'ReturnPotential', 'CapitalIntensity', 'ScalabilityRating'
  ];

  dynamicFields.forEach(field => {
    const rx = new RegExp(`{data\\?\.([A-Za-z0-9_]+)\\?\.${field}( \\|\\| 'N/A')?}`, 'g');
    content = content.replace(rx, (m, p1, p2) => `{tt(data?.${p1}?.${field}${p2 || ''}, language || 'Arabic')}`);

    const rx2 = new RegExp(`{data\\.([A-Za-z0-9_]+)\\.${field}( \\|\\| 'N/A')?}`, 'g');
    content = content.replace(rx2, (m, p1, p2) => `{tt(data?.${p1}?.${field}${p2 || ''}, language || 'Arabic')}`);
  });

  if (original !== content) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Processed', filePath);
  }
}

const files = [
  'Dashboard.tsx',
  'ChallengeSolver.tsx',
  'OptimizerTool.tsx',
  'ProposalGenerator.tsx',
  'ResearchDashboard.tsx',
  'ResearchHistory.tsx',
  'CompareProjects.tsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    autoTranslate(f);
  }
});
