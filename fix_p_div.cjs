const fs = require('fs');
const files = ['Dashboard.tsx', 'ChallengeSolver.tsx', 'OptimizerTool.tsx', 'ProposalGenerator.tsx', 'ResearchDashboard.tsx', 'StandardsChecker.tsx'];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Fix invalid HTML wrapper: <p> <div className="markdown-body">
  content = content.replace(/<p[^>]*>\s*<div className="markdown-body"/g, '<div className="text-[var(--text-secondary)] mt-2"><div className="markdown-body"');
  content = content.replace(/<\/div><\/p>/g, '</div></div>');
  
  // Actually some were <p className="...">...<ReactMarkdown>...</ReactMarkdown></p>
  // A div inside p is illegal, so if we swapped <p> with <div className="text-[var(--text-secondary)] mt-2">
  // We need to just ensure `<p className="..."><div className="markdown-body">` gets mapped properly. Let's do a smarter approach:
  const pRegex = /<p([^>]*)>\s*<div className="markdown-body"/g;
  content = content.replace(pRegex, '<div$1>\n             <div className="markdown-body"');

  content = fs.writeFileSync(file, content);
  console.log('Fixed paragraph wrappers in', file);
}
