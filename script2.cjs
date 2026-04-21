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
    content = content.replace(/\bbg-white\b/g, "bg-[#0D141A]/70 backdrop-blur-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-white/5 hover:border-emerald-500/50");
    fs.writeFileSync(file, content);
  }
}
console.log("Replaced bg-white in missed files");
