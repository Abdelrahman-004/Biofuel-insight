const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.tsx'));

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');

  // Fix text colors for backgrounds
  content = content.replace(/bg-red-500 text-white/g, 'bg-red-700 text-white');
  content = content.replace(/bg-blue-500 text-white/g, 'bg-blue-700 text-white');
  content = content.replace(/bg-amber-500 text-white/g, 'bg-amber-700 text-white');
  content = content.replace(/bg-amber-500/g, 'bg-amber-600'); 
  content = content.replace(/bg-blue-500/g, 'bg-blue-600'); 
  content = content.replace(/bg-red-500/g, 'bg-red-600'); 
  content = content.replace(/text-red-600/g, 'text-red-700');
  content = content.replace(/text-blue-600/g, 'text-blue-700');
  content = content.replace(/text-amber-600/g, 'text-amber-700');
  content = content.replace(/text-emerald-600/g, 'text-emerald-700');
  
  // Undo double replacements if any
  content = content.replace(/text-red-7000/g, 'text-red-700');
  content = content.replace(/bg-red-6000/g, 'bg-red-600');

  fs.writeFileSync(f, content);
});
