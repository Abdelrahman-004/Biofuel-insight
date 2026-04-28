#!/bin/bash
find . -name "*.tsx" -type f -exec sed -i -e's/text-slate-[2-7]00 dark:text-slate-[34]00/text-\[var(--text-secondary)\]/g' {} +
find . -name "*.tsx" -type f -exec sed -i -e's/text-slate-[2-7]00/text-\[var(--text-secondary)\]/g' {} +
find . -name "*.tsx" -type f -exec sed -i -e's/text-white/text-white/g' {} +
find . -name "*.tsx" -type f -exec sed -i -e's/dark:text-\[var(--text-secondary)\]//g' {} +
