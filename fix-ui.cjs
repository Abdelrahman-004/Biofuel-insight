const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.tsx'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Fix text colors, removing dark:text classes as well
  content = content.replace(/text-slate-[1-9]00(\/[0-9]+)?/g, 'text-[var(--text-secondary)]');
  content = content.replace(/dark:text-slate-[1-9]00(\/[0-9]+)?/g, '');
  content = content.replace(/text-gray-[1-9]00(\/[0-9]+)?/g, 'text-[var(--text-secondary)]');
  content = content.replace(/dark:text-gray-[1-9]00(\/[0-9]+)?/g, '');
  content = content.replace(/dark:text-\[var\(--text-primary\)\]/g, '');
  
  // Actually, some things might be text-slate-800 in light mode and that's hard to read?
  // Let's replace bg-black/5 dark:bg-slate-800/50 with bg-[var(--bg-main)]
  content = content.replace(/bg-black\/5 dark:bg-slate-800\/50/g, 'bg-[var(--bg-main)]');
  content = content.replace(/bg-slate-50\/80 dark:bg-black\/20/g, 'bg-[var(--bg-main)]');
  
  if (original !== content) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed colors in', file);
  }
}
