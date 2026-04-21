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
    content = content.replace(/text-slate-900/g, "text-white");
    content = content.replace(/text-slate-800/g, "text-slate-200");
    content = content.replace(/text-[sS]late-700/g, "text-slate-300");
    content = content.replace(/text-[sS]late-600/g, "text-slate-400");
    fs.writeFileSync(file, content);
  }
}
console.log("Replaced text colors");
