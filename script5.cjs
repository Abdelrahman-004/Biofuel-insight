const fs = require("fs");
const files = [
  "./GisMap.tsx",
  "./LiveMarketsDashboard.tsx"
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, "utf8");
    
    // Core structural updates
    content = content.replace(/bg-slate-900 border border-slate-800/g, "bg-[#0D141A]/70 backdrop-blur-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/5");
    content = content.replace(/bg-slate-900 border border-slate-700/g, "bg-[#0D141A]/70 backdrop-blur-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/5");
    content = content.replace(/bg-slate-950 border border-slate-800/g, "bg-[#0F172A] border border-white/5");
    content = content.replace(/bg-slate-950 border border-slate-700/g, "bg-[#0F172A] border border-white/10");
    
    // Fallback replacements
    content = content.replace(/bg-slate-900\/50/g, "bg-[#0D141A]/50");
    content = content.replace(/bg-slate-900/g, "bg-[#0D141A]/70");
    content = content.replace(/bg-slate-950\/40/g, "bg-[#0F172A]/40");
    content = content.replace(/bg-slate-950/g, "bg-[#0F172A]");
    content = content.replace(/bg-slate-800/g, "bg-white/5");
    
    content = content.replace(/border-slate-800/g, "border-white/5");
    content = content.replace(/border-slate-700/g, "border-white/10");
    
    fs.writeFileSync(file, content);
  }
}
console.log("Updated GIS and Live markets");
