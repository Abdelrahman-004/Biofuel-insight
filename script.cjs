const fs = require("fs");
const files = ["./ResearchDashboard.tsx", "./Dashboard.tsx", "./CompareProjects.tsx", "./ResearchHistory.tsx", "./ProjectHistory.tsx", "./GlobalStandards.tsx"];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, "utf8");
    // Replace standard white card
    content = content.replace(/bg-white p-8 rounded-3xl shadow-sm border border-slate-200/g, "bg-[#0D141A]/70 backdrop-blur-[10px] p-8 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/5");
    // p-6 rounded-2xl
    content = content.replace(/bg-white p-6 rounded-2xl border border-slate-100/g, "bg-[#0D141A]/70 backdrop-blur-[10px] p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/5");
    // another variation
    content = content.replace(/bg-white p-8 rounded-2xl border border-slate-200 shadow-sm/g, "bg-[#0D141A]/70 backdrop-blur-[10px] p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/5");
    content = content.replace(/bg-white p-6 rounded-2xl border border-slate-200 shadow-sm/g, "bg-[#0D141A]/70 backdrop-blur-[10px] p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/5");
    
    // extra bg-white variations
    content = content.replace(/bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm/g, "bg-[#0D141A]/70 backdrop-blur-[10px] rounded-3xl p-12 text-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/5");
    content = content.replace(/bg-white p-8 rounded-3xl border border-slate-200 shadow-sm/g, "bg-[#0D141A]/70 backdrop-blur-[10px] p-8 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/5");
    
    // Replace standalone bg-white
    content = content.replace(/className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"/g, "className=\"max-w-5xl mx-auto bg-[#0D141A]/70 backdrop-blur-[10px] rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden border border-white/5\"");

    // text colors
    content = content.replace(/text-slate-900/g, "text-white");
    content = content.replace(/text-slate-800/g, "text-slate-200");
    content = content.replace(/text-slate-700/g, "text-slate-300");
    content = content.replace(/text-slate-600/g, "text-slate-400");
    
    // borders
    content = content.replace(/border-slate-100/g, "border-white/5");
    content = content.replace(/border-slate-200/g, "border-white/10");
    
    // sub-elements
    content = content.replace(/bg-slate-50/g, "bg-[#0F172A]");
    content = content.replace(/bg-slate-100/g, "bg-white/5");

    fs.writeFileSync(file, content);
  }
}
console.log("Replaced backgrounds");
