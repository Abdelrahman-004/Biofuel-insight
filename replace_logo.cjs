const fs = require('fs');

function replaceInFile(filePath, targetContent, replacementContent) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(targetContent)) {
      content = content.replace(targetContent, replacementContent);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Replaced in ${filePath}`);
    } else {
      console.log(`Target not found in ${filePath}`);
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
  }
}

function replaceAllInFile(filePath, targetContent, replacementContent) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let oldContent = content;
    content = content.split(targetContent).join(replacementContent);
    if (content !== oldContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Replaced all in ${filePath}`);
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
  }
}

// App.tsx header logo
replaceInFile(
  './App.tsx',
  `<div \n              className="flex items-center cursor-pointer group" \n              onClick={() => onTabChange('HOME')}\n            >\n              <BiofuelOmanLogo />\n              <span className="text-xl font-black tracking-tighter text-[var(--accent-emerald)] transition-colors mx-3">\n                {language === "Arabic" ? <>عُمَان إيكوسينك</> : <>OMAN ECOSYNC</>}\n              </span>\n            </div>`,
  `<div className="cursor-pointer" onClick={() => onTabChange('HOME')}><Logo className="h-10 md:h-12" isArabic={language === 'Arabic'} /></div>`
);

// We need to import Logo in App.tsx
let appContent = fs.readFileSync('./App.tsx', 'utf8');
if (!appContent.includes('import { Logo } from "./Logo";')) {
  appContent = appContent.replace('import { Home } from "./Home";', 'import { Home } from "./Home";\nimport { Logo } from "./Logo";');
  fs.writeFileSync('./App.tsx', appContent, 'utf8');
  console.log('Imported Logo in App.tsx');
}

// Home.tsx giant hero
replaceInFile(
  './Home.tsx',
  `<motion.h1 \n            initial={{ opacity: 0, y: 30 }}\n            animate={{ opacity: 1, y: 0 }}\n            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}\n            className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-teal-800 dark:from-white dark:to-teal-200"\n          >\n            {isArabic ? 'عُمان' : 'OMAN'} <br className="hidden md:block" />\n            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-cyan-400">\n              {isArabic ? 'إيكو سينك' : 'ECOSYNC'}\n            </span>\n          </motion.h1>`,
  `<motion.div \n            initial={{ opacity: 0, y: 30 }}\n            animate={{ opacity: 1, y: 0 }}\n            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}\n            className="mb-10 w-full flex justify-center"\n          >\n            <Logo className="h-28 md:h-40 object-contain w-auto max-w-[90vw]" isArabic={isArabic} textClassName="text-4xl md:text-6xl lg:text-7xl" />\n          </motion.div>`
);

let homeContent = fs.readFileSync('./Home.tsx', 'utf8');
if (!homeContent.includes('import { Logo } from "./Logo";')) {
  homeContent = homeContent.replace(`import {\n  TrendingUp,`, `import { Logo } from "./Logo";\nimport {\n  TrendingUp,`);
  fs.writeFileSync('./Home.tsx', homeContent, 'utf8');
  console.log('Imported Logo in Home.tsx');
}

// We will also use it in PDF generation inside pdfUtils.ts
let pdfContent = fs.readFileSync('./pdfUtils.ts', 'utf8');
replaceAllInFile('./pdfUtils.ts', `OMAN ECOSYNC`, `OMAN ECOSYNC BIOFUELS & RENEWABLE ENERGY`);

