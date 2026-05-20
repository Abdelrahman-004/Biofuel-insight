const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.tsx'));
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/(?<!dark:)text-emerald-400/g, 'text-[var(--accent-emerald)] dark:text-emerald-400');
  fs.writeFileSync(f, content);
});
