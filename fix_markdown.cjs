const fs = require('fs');
const glob = require('glob');

const files = ['ChallengeSolver.tsx', 'Dashboard.tsx', 'OptimizerTool.tsx', 'ProposalGenerator.tsx', 'ResearchDashboard.tsx', 'StandardsChecker.tsx'];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove imports
    content = content.replace(/import remarkMath from 'remark-math';\n?/g, '');
    content = content.replace(/import rehypeKatex from 'rehype-katex';\n?/g, '');
    content = content.replace(/import 'katex\/dist\/katex\.min\.css';\n?/g, '');
    
    // Remove usage
    content = content.replace(/,\s*remarkMath/g, '');
    content = content.replace(/\s*rehypePlugins=\{\[rehypeKatex\]\}/g, '');
    content = content.replace(/remarkPlugins=\{\[remarkMath\]\}/g, '');
    content = content.replace(/remarkMath,\s*/g, '');
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
