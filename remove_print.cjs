const fs = require('fs');
const content = fs.readFileSync('index.css', 'utf-8');
const lines = content.split('\n');
const filtered = [];
let inPrint = false;
for (const line of lines) {
  if (line.trim() === '@media print {') {
    inPrint = true;
  }
  if (!inPrint) {
    filtered.push(line);
  } else if (inPrint && line === '}') {
    // Check if it's the closing brace for @media print (we can count braces but since it's at root level, should just match })
    // Actually the @media print ends with '}' on its own line:
    inPrint = false;
    continue; // skip the closing brace too
  }
}
fs.writeFileSync('index.css', filtered.join('\n'));
