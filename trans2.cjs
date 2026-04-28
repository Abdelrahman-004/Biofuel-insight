const fs = require('fs');

function translateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  const dict = {
    "Official Investment Proposal": "مقترح استثماري رسمي",
    "Financial Schedule": "الجدول المالي",
    "Export Proposal (PDF)": "تصدير المقترح (PDF)",
    "Proposed By:": "مقدم من قبل:",
    "BioFuel Insight Advisory AI": "المستشار الذكي BioFuel Insight",
    "Market Context & Demand": "سياق السوق والطلب",
    "Proposed Technology & Scale": "التكنولوجيا المقترحة وحجم الإنتاج",
    "Strategic Justification": "المبرر الاستراتيجي",
    "Target Funding & Budget": "التمويل المستهدف والميزانية",
    "Expected Returns & ROI": "العوائد المتوقعة وعائد الاستثمار",
    "Risk Mitigation Strategy": "استراتيجية التخفيف من المخاطر",
    "Environmental & Carbon Impact": "التأثير البيئي والكربوني",
    "Executive Conclusion": "الخاتمة التنفيذية"
  };

  for (const [en, ar] of Object.entries(dict)) {
    const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`>\\s*${escapeRegExp(en)}\\s*<`, 'g');
    content = content.replace(regex, `>{t("${en}", "${ar}")}<`);

    const regex2 = new RegExp(`>\\s*${escapeRegExp(en)}:\\s*<`, 'g');
    content = content.replace(regex2, `>{t("${en}:", "${ar}:")}<`);
  }

  if (original !== content) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Translated UI in', filePath);
  }
}

['ProposalGenerator.tsx', 'ResearchDashboard.tsx'].forEach(f => {
  if(fs.existsSync(f)) {
    translateFile(f);
  }
});
