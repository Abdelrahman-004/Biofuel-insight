const fs = require('fs');
let css = fs.readFileSync('index.css', 'utf8');

css = css.replace(
  '.markdown-body {\n    @apply text-[var(--text-secondary)] leading-relaxed;\n  }',
  '.markdown-body {\n    @apply leading-relaxed;\n    color: inherit;\n  }'
);

css = css.replace(
  '.markdown-body li { @apply text-[var(--text-secondary)]; }',
  '.markdown-body li { color: inherit; }'
);

fs.writeFileSync('index.css', css);
console.log('Fixed markdown-body colors');
