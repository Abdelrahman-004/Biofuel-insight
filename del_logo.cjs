const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');
const lines = content.split('\n');
const newLines = lines.filter((_, idx) => idx < 21 || idx > 66);
fs.writeFileSync('App.tsx', newLines.join('\n'), 'utf8');
console.log('Deleted lines');
