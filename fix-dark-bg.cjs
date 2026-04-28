const fs = require('fs');

function fixDarkBackgroundText(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Let's find elements that have things like 'bg-indigo-900', 'bg-blue-600', 'bg-red-600', 'bg-emerald-600', 'bg-amber-600', 'bg-emerald-950' etc. and ensure they use text-white instead of var(--text-primary)
  // Actually, replacing `text-[var(--text-primary)]` with `text-white` in certain lines is safer.

  content = content.replace(/bg-([a-z]+)-600([A-Za-z0-9_ \-"']*)text-\[var\(--text-primary\)\]/g, 'bg-$1-600$2text-white');
  content = content.replace(/bg-([a-z]+)-500([A-Za-z0-9_ \-"']*)text-\[var\(--text-primary\)\]/g, 'bg-$1-500$2text-white');
  content = content.replace(/bg-([a-z]+)-950([A-Za-z0-9_ \-"']*)text-\[var\(--text-primary\)\]/g, 'bg-$1-950$2text-white');
  content = content.replace(/bg-([a-z]+)-900([A-Za-z0-9_ \-"']*)text-\[var\(--text-primary\)\]/g, 'bg-$1-900$2text-white');
  content = content.replace(/from-([a-z]+)-900([A-Za-z0-9_ \-"']*)text-\[var\(--text-primary\)\]/g, 'from-$1-900$2text-white');

  // Also in Marketplace:
  content = content.replace(/text-blue-800 dark:text-blue-300/g, 'text-blue-800 dark:text-blue-300'); // wait, the user's issue with Marketplace was "يرجى تسجيل الدخول باستخدام حساب جوجل للوصول إلى المنصة. هذي الكلمه غير واضحه في الوضع النهاري"
  // It was `bg-blue-50 dark:bg-blue-950/30 text-blue-800`. Is `bg-blue-50` confusing? Let's change `text-blue-800 dark:text-blue-300` to `text-[var(--text-primary)]` and `bg-blue-50 dark:bg-blue-950/30` to `bg-[var(--card-bg)]` with border-[var(--border-glow)].
  content = content.replace(/bg-blue-50 dark:bg-blue-950\/30 border border-blue-200 dark:border-blue-900\/50/g, 'bg-[var(--card-bg)] border border-[var(--border-glow)]');
  content = content.replace(/text-blue-800 dark:text-blue-300/g, 'text-[var(--text-primary)]');
  content = content.replace(/text-blue-800/g, 'text-[var(--text-primary)]'); // in Dashboard.tsx line 856: <p className="text-xs text-blue-800 flex items-start">
  
  if (original !== content) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed', filePath);
  }
}

const glob = require('fs').readdirSync('.').filter(f => f.endsWith('.tsx'));
for (const f of glob) {
  fixDarkBackgroundText(f);
}
