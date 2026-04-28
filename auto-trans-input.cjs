const fs = require('fs');

const commonTranslations = {
  // InputForm.tsx & Home.tsx common
  "Analyze New Project": "تحليل مشروع جديد",
  "Investment Risk AI Check": "فحص الذكاء الاصطناعي لمخاطر الاستثمار",
  "Feasibility AI Analytics": "تحليلات الذكاء الاصطناعي للجدوى",
  "Technical Project Name": "الاسم الفني للمشروع",
  "Enter the official project title...": "أدخل العنوان الرسمي للمشروع...",
  "Describe the core technology, feedstock, and intended market...": "صف التكنولوجيا الأساسية، والمواد الخام، والسوق المستهدف...",
  "Project Execution Location (Oman)": "موقع التنفيذ في (عُمان)",
  "Sector / Technology Type": "القطاع / نوع التكنولوجيا",
  "Waste-to-Energy": "تحويل النفايات إلى طاقة",
  "Algae Biofuels": "الوقود الحيوي من الطحالب",
  "Used Cooking Oil Biodiesel": "ديزل حيوي من زيوت الطبخ المستعملة",
  "Green Hydrogen Integration": "دمج الهيدروجين الأخضر",
  "Other": "أخرى",
  "Feedstock Type": "نوع المواد الخام",
  "Municipal Solid Waste (MSW)": "النفايات الصلبة البلدية",
  "Agricultural Residue": "المخلفات الزراعية",
  "Expected Daily Production": "الإنتاج اليومي المتوقع",
  "Tons per day": "طن في اليوم",
  "Estimated Initial CAPEX": "النفقات الرأسمالية الأولية المقدرة",
  "e.g., 5000000": "مثال: 5000000",
  "Generate Official Investment Report": "إنشاء تقرير الجدوى الاستثماري الرسمي",
  "Analyze Scientific Viability (Lab Scale)": "تحليل الجدوى العلمية (على مستوى المختبر)",
  "Research Innovation Simulator": "محاكي ابتكار الأبحاث",
  "Enter the research project or startup name...": "أدخل اسم مشروع البحث أو الشركة الناشئة...",
  "What is the theoretical scientific approach?": "ما هو النهج العلمي النظري؟",
  "Technology Readiness Level": "مستوى الجاهزية التكنولوجية",
  "TRL 1-2 (Basic Research)": "TRL 1-2 (بحث أساسي)",
  "TRL 3-4 (Lab Validation)": "TRL 3-4 (تحقق مخبري)",
  "TRL 5-6 (Pilot Scale)": "TRL 5-6 (المستوى التجريبي)",
  "Target Pilot Scale (Oman)": "المستوى التجريبي المستهدف (عُمان)",
  "University Lab": "مختبر جامعة",
  "Innovation Park (e.g., KOM)": "واحة المعرفة (مثل KOM)",
  "Industrial Zone Pilot": "تجربة في منطقة صناعية",
  "Expected Timeline": "الجدول الزمني المتوقع",
  "6 Months": "6 أشهر",
  "1 Year": "سنة واحدة",
  "2+ Years": "سنتان فأكثر"
};

function translationReplace(filePath) {
  if(!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  Object.keys(commonTranslations).forEach(en => {
    if (en.length < 3) return;
    const ar = commonTranslations[en];
    const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // For >Text< wrappers
    const regex1 = new RegExp(`>\\s*${escapeRegExp(en)}\\s*<`, 'g');
    content = content.replace(regex1, `>{language === 'Arabic' ? "${ar}" : "${en}"}<`);
    
    // For placeholder="Text" wrappers
    const regex2 = new RegExp(`placeholder="${escapeRegExp(en)}"`, 'g');
    content = content.replace(regex2, `placeholder={language === 'Arabic' ? "${ar}" : "${en}"}`);

    // For plain Enums in options
    const regex3 = new RegExp(`<option value="${escapeRegExp(en)}">${escapeRegExp(en)}</option>`, 'g');
    content = content.replace(regex3, `<option value="${en}">{language === 'Arabic' ? "${ar}" : "${en}"}</option>`);

    // Another variant of place holders
    const regex4 = new RegExp(`placeholder='${escapeRegExp(en)}'`, 'g');
    content = content.replace(regex4, `placeholder={language === 'Arabic' ? "${ar}" : "${en}"}`);
  });

  if (original !== content) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Translated', filePath);
  }
}

translationReplace('InputForm.tsx');
translationReplace('ResearchInputForm.tsx');
