const fs = require('fs');
let code = fs.readFileSync('ProposalGenerator.tsx', 'utf8');
code = code.replace(/prose prose-invert/g, 'prose dark:prose-invert');
fs.writeFileSync('ProposalGenerator.tsx', code);
console.log('Fixed prose-invert in ProposalGenerator.tsx');
