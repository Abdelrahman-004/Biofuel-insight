const fs = require('fs');
let content = fs.readFileSync('geminiService.ts', 'utf8');

const userStandardsFunction = `export async function checkStandardsCompliance(
  input: StandardsInput,
  language: string
): Promise<StandardsResult> {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const currentDate = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Muscat' });
  
  const prompt = \`Today is \${currentDate}. You are an Oman energy standards compliance expert.
Analyze this project for international standards compliance. Language: \${language}.
Project: \${JSON.stringify(input)}

Check compliance with: ISO 14040/14044 (LCA), ISO 14067 (Carbon Footprint), EU RED II/III, ASTM International, ICAO CORSIA.
For each standard: state if Compliant, Partially Compliant, or Non-Compliant, and explain why.
Focus on Oman-specific context and Vision 2040 alignment.
Return ONLY valid JSON matching the StandardsResult type.\`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.1,
      responseMimeType: "application/json",
    }
  });

  return JSON.parse(response.text || "{}") as StandardsResult;
}`;

// Replace the old checkStandardsCompliance function
const regex = /export async function checkStandardsCompliance\([\s\S]*?as StandardsResult;\r?\n  \} catch \(err: any\) \{\r?\n    console\.error\("Standards API failed:", err\);\r?\n    throw err;\r?\n  \}\r?\n\}/;

let newContent = content.replace(regex, userStandardsFunction);

// Fix hardcoded dates globally
newContent = newContent.replace(/operating in April 2026/g, "operating in ${new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Muscat' })}");
newContent = newContent.replace(/today, April 20, 2026,/g, "today, ${new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Muscat' })},");

fs.writeFileSync('geminiService.ts', newContent);
console.log('Update 2 Complete', newContent === content ? 'NO CHANGE' : 'CHANGED');
