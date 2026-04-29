const fs = require('fs');

let c = fs.readFileSync('ProposalGenerator.tsx', 'utf-8');

c = c.replace(/return \(\s*<div className="flex flex-col lg:flex-row gap-8" dir=\{inputs\.language === 'Arabic' \? 'rtl' : 'ltr'\}>/,
`  const dataString = JSON.stringify(result || {});
  const isDataArabic = /[\\u0600-\\u06FF]/.test(dataString);
  const effectiveLanguage = result ? (isDataArabic ? 'Arabic' : 'English') : inputs.language;

  return (
    <div className="flex flex-col lg:flex-row gap-8" dir={effectiveLanguage === 'Arabic' ? 'rtl' : 'ltr'}>`);

c = c.replace(/inputs\.language === 'Arabic'/g, "effectiveLanguage === 'Arabic'");
  
fs.writeFileSync('ProposalGenerator.tsx', c);
