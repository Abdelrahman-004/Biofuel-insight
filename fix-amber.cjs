const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.tsx'));
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/(?<!dark:)text-amber-400/g, 'text-amber-600 dark:text-amber-400');
  fs.writeFileSync(f, content);
});
