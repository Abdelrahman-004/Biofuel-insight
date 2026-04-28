const fs = require('fs');
const { GoogleGenAI } = require('@google/genai');

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("No API key");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  console.log('Processing', filePath);
  
  const prompt = `You are an expert React TypeScript developer and Arabic translator.
I have a React component file. I need to translate all static english UI text elements into Arabic, using the existing \`t('English', 'Arabic')\` function if defined, or defining it if not.
If the component doesn't have \`t\`, inject it:
\`\`\`tsx
  const isArabic = language === 'Arabic' || (typeof document !== 'undefined' && document.documentElement.dir === 'rtl');
  const t = (en: string, ar: string) => isArabic ? ar : en;
\`\`\`
(Ensure \`language\` prop is present or use a fallback).
Please wrap EVERY english text node and attribute (like placeholders, tooltips, aria-labels) in \`t('English', 'Arabic')\`.

IMPORTANT: 
- DO NOT translate variable names, object keys, class names, or code.
- ONLY translate human-readable display text.
- RETURN ONLY THE COMPLETE, VALID TYPESCRIPT REACT CODE. No markdown formatting, no explanations, just the code. DO NOT wrap with \`\`\`tsx.
- Translate literally and professionally into Arabic.

File content:
${content}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        temperature: 0.1
      }
    });

    let newContent = response.text.replace(/^```(tsx|typescript)?\n/, '').replace(/\n```$/, '');
    
    if (newContent && newContent.length > 500) { // basic sanity check
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log('Successfully translated', filePath);
    } else {
      console.log('Failed sanity check for', filePath);
    }
  } catch (err) {
    console.error('Error on', filePath, err);
  }
}

async function main() {
  const files = [
    'Dashboard.tsx',
    'ChallengeSolver.tsx',
    'OptimizerTool.tsx',
    'ProposalGenerator.tsx',
    'ResearchDashboard.tsx'
  ];
  for (const f of files) {
    await processFile(f);
  }
}

main();
