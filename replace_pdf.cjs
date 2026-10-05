const fs = require('fs');

const replaces = [
  {
    file: 'Dashboard.tsx',
    id: 'dashboard-report',
    filename: '`${"OMAN_ECOSYNC_Feasibility_Analysis_"}${new Date().getTime()}.pdf`'
  },
  {
    file: 'ChallengeSolver.tsx',
    id: 'challenge-solver-report',
    filename: '`${"OMAN_ECOSYNC_Challenge_Solution_"}${new Date().getTime()}.pdf`'
  },
  {
    file: 'OptimizerTool.tsx',
    id: 'optimizer-solver-report',
    filename: '`${"OMAN_ECOSYNC_Financial_Optimizer_"}${new Date().getTime()}.pdf`'
  },
  {
    file: 'ProposalGenerator.tsx',
    id: 'proposal-report',
    filename: '`${"OMAN_ECOSYNC_Proposal_"}${inputs.projectName || "Project"}_${new Date().getTime()}.pdf`'
  },
  {
    file: 'ResearchDashboard.tsx',
    id: 'research-dashboard-report',
    filename: '`${"OMAN_ECOSYNC_Research_Analysis_"}${new Date().getTime()}.pdf`'
  },
  {
    file: 'StandardsChecker.tsx',
    id: 'standards-report',
    filename: '`${"OMAN_ECOSYNC_Standards_Report_"}${result?.biofuelType || "Biofuel"}_${new Date().getTime()}.pdf`'
  }
];

replaces.forEach(({file, id, filename}) => {
  let code = fs.readFileSync(file, 'utf8');
  
  // Regex to match the exact pattern:
  // const downloadPDF = () => {
  //   if (userPlan === 'free') {
  //     onUpgrade?.();
  //     return;
  //   }
  //   window.print();
  // };
  const pattern = /const downloadPDF \= \(\) => \{\s*if \(userPlan === 'free'\) \{\s*onUpgrade\?\.\(\);\s*return;\s*\}\s*window\.print\(\);\s*\};/msg;
  
  const replacement = `const downloadPDF = async () => {\n    if (userPlan === 'free') {\n      onUpgrade?.();\n      return;\n    }\n    const { downloadPDF: dp } = await import('./pdfUtils');\n    await dp('${id}', ${filename});\n  };`;

  code = code.replace(pattern, replacement);
  fs.writeFileSync(file, code);
  console.log(`Updated ${file}`);
});
