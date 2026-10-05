const fs = require('fs');
const files = ['Dashboard.tsx', 'ChallengeSolver.tsx', 'OptimizerTool.tsx', 'ProposalGenerator.tsx', 'ResearchDashboard.tsx', 'StandardsChecker.tsx'];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Any </p> that has a </div> before it that we messed up. Let's just blindly replace </p> with </div> if it matches our pattern.
  // Actually, we can just replace:
  content = content.replace(/<\/ReactMarkdown><\/div><\/div>\s*<\/p>/g, '</ReactMarkdown></div></div>');
  content = content.replace(/<\/ReactMarkdown><\/div>\s*<\/p>/g, '</ReactMarkdown></div></div>');

  fs.writeFileSync(file, content);
  console.log('Fixed ', file);
}
