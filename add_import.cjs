const fs = require('fs');

const files = [
  './Dashboard.tsx',
  './ResearchDashboard.tsx',
  './ProposalGenerator.tsx',
  './OptimizerTool.tsx',
  './ChallengeSolver.tsx',
  './StandardsChecker.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let oldContent = content;
  
  // Replace the specific logo container with the Logo component
  content = content.replace(/<div className="flex items-center space-x-2">\s*<i className="fas fa-leaf[^>]*><\/i>\s*<span className="text-xl font-black tracking-tighter text-\[var\(--text-primary\)\]">\s*\{language === 'Arabic' \? <>.+?<\/span>\s*<\/div>/g, 
  `<Logo className="h-8" isArabic={language === 'Arabic'} />`);
  
  if (content !== oldContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Replaced all in ${file}`);
  }
});


