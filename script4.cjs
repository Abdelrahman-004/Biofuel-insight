const fs = require("fs");
const files = [
  "./CompareProjects.tsx",
  "./Dashboard.tsx", 
  "./Home.tsx",
  "./GlobalStandards.tsx",
  "./ProjectHistory.tsx"
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, "utf8");
    content = content.replace(/border-slate-100/g, "border-white/5");
    content = content.replace(/border-slate-200/g, "border-white/10");
    content = content.replace(/bg-slate-50\b/g, "bg-[#0F172A]");
    content = content.replace(/bg-slate-100/g, "bg-[#0F172A]/50");
    fs.writeFileSync(file, content);
  }
}
console.log("Replaced borders and backgrounds");
