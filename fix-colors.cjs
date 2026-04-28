const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.tsx'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  content = content.replace(/text-slate-[4567]00 dark:text-slate-[34]00/g, 'text-[var(--text-secondary)]');
  content = content.replace(/text-slate-600/g, 'text-[var(--text-secondary)]');
  content = content.replace(/text-slate-500/g, 'text-[var(--text-secondary)]');
  content = content.replace(/text-slate-400/g, 'text-[var(--text-secondary)]');
  content = content.replace(/text-slate-300/g, 'text-[var(--text-secondary)]');
  content = content.replace(/text-slate-200/g, 'text-[var(--text-primary)]');
  
  if (original !== content) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
}

