const fs = require('fs');
let content = fs.readFileSync('Dashboard.tsx', 'utf8');

// The error is around line 710:
// <p className="text-sm text-[var(--text-secondary)] italic leading-relaxed">
//   <i className="fas fa-info-circle mr-2 text-blue-700 dark:text-blue-400"></i>
//   <div className="markdown-body"><ReactMarkdown ...>...</ReactMarkdown></div></div>

// Let's just fix it by replacing <p with <div and </p> if it exists or stripping the extra div
content = content.replace(/<p className="([^\"]+)">\s*<i className="([^\"]+)"><\/i>\s*<div className="markdown-body"><ReactMarkdown remarkPlugins=\{\[remarkGfm\]\}>\{data\.Rationale\}<\/ReactMarkdown><\/div><\/div>/g, 
  '<div className="$1">\n                <i className="$2"></i>\n                <div className="markdown-body"><ReactMarkdown remarkPlugins={[remarkGfm]}>{data.Rationale}</ReactMarkdown></div>\n              </div>');

content = content.replace(/<p className="text-sm text-\[var\(--text-secondary\)\] italic leading-relaxed">\s*<i className="fas fa-info-circle mr-2 text-[^"]+"><\/i>\s*<div className="markdown-body"><ReactMarkdown remarkPlugins=\{\[remarkGfm\]\}>\{data\.Rationale\}<\/ReactMarkdown><\/div><\/div>/g, 
  '<div className="text-sm text-[var(--text-secondary)] italic leading-relaxed">\n                <i className="fas fa-info-circle mr-2 text-blue-700 dark:text-blue-400"></i>\n                <div className="markdown-body"><ReactMarkdown remarkPlugins={[remarkGfm]}>{data.Rationale}</ReactMarkdown></div>\n              </div>');


// Let's also enforce it with simple string replacement for Dashboard just to be sure:
const part1 = `<p className="text-sm text-[var(--text-secondary)] italic leading-relaxed">`;
const part2 = `                <i className="fas fa-info-circle mr-2 text-blue-700 dark:text-blue-400"></i>`;
const part3 = `                <div className="markdown-body"><ReactMarkdown remarkPlugins={[remarkGfm]}>{data.Rationale}</ReactMarkdown></div></div>`;
if (content.includes(part1) && content.includes(part3)) {
  content = content.replace(part1, '<div className="text-sm text-[var(--text-secondary)] italic leading-relaxed">');
  content = content.replace(part3, `                <div className="markdown-body"><ReactMarkdown remarkPlugins={[remarkGfm]}>{data.Rationale}</ReactMarkdown></div></div>`);
}

fs.writeFileSync('Dashboard.tsx', content);

