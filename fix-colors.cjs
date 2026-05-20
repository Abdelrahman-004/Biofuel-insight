const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.tsx'));
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/(?<!dark:)text-red-400/g, 'text-red-700 dark:text-red-400');
  content = content.replace(/(?<!dark:)text-amber-400/g, 'text-amber-700 dark:text-amber-400');
  content = content.replace(/(?<!dark:)text-emerald-400/g, 'text-emerald-700 dark:text-emerald-400');
  content = content.replace(/(?<!dark:)text-blue-400/g, 'text-blue-700 dark:text-blue-400');
  fs.writeFileSync(f, content);
});
