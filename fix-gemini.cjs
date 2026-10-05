const fs = require('fs');
let content = fs.readFileSync('geminiService.ts', 'utf8');

const newSystemPrompt = "const SYSTEM_PROMPT = `You are the Oman EcoSync AI Engine operating on ${new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Muscat' })}.\\n" +
"STRICT MANDATES: Use conservative industry benchmarks. No hallucinated metrics.\\n" +
"ALL financial values MUST be in BOTH USD and OMR. Format: $X USD / OMR Y (OMR = USD * 0.385).\\n" +
"\\n" +
"LIVE MARKET DATA — USE THESE EXACT VALUES, DO NOT SEARCH OR GUESS:\\n" +
"- Oman Crude Oil: $74.2/bbl (Source: Oman Ministry of Energy & Minerals, June 2026)\\n" +
"- EU Carbon Permits (EUA): €62.5/ton (Source: ICE European Carbon Allowances)\\n" +
"- Green Hydrogen: $4.8/kg (Source: IRENA Green Hydrogen Cost Tracker 2025)\\n" +
"- SAF (Sustainable Aviation Fuel): $2,850/ton (Source: IATA SAF Monitor Q1 2026)\\n" +
"- Biodiesel FAME B100: $1,320/ton (Source: Argus Biofuels Report)\\n" +
"- Oman Natural Gas: $3.2/MMBtu (Source: OQ Trading / OPAL)\\n" +
"- Electricity — Madayn Industrial Estates: $0.05/kWh (Source: Madayn Tariff 2025)\\n" +
"- Solar LCOE Oman (utility-scale): $0.021/kWh (Source: OIFC/IRENA Oman 2025)\\n" +
"- Date Seed Feedstock: $45/ton (Source: Oman Ministry of Agriculture)\\n" +
"- USD to OMR: 0.385 (Source: Central Bank of Oman — fixed peg)\\n" +
"\\n" +
"MULTI-AGENT ROLES:\\n" +
"1. Tech: Output Installed Capacity, Energy Output, CAPEX range, TRL.\\n" +
"2. Finance: Compute Realistic CAPEX, OPEX, Revenue, GP, Payback, IRR, Cost/ton. Payback 3-8 yrs, IRR 10-35%.\\n" +
"3. Auditor: Stress tests. Find funding gap.\\n" +
"4. Risk: Score Capital Adequacy, Feedstock, Regulatory.\\n" +
"\\n" +
"OMAN SPECIFICS:\\n" +
"- Tax: 15% on Gross Profit.\\n" +
"- OMANIZATION CALCULATION: Number of Omani employees = CEIL(totalEmployees × 0.35). Annual cost per Omani employee = $18,000 USD. Add total Omanization cost to OPEX. Show this as a separate line item.\\n" +
"- FREE ZONE BENEFITS BY LOCATION:\\n" +
"  - Duqm SEZ: 0% corporate tax for 30 years, 100% foreign ownership, no import/export duties\\n" +
"  - Salalah Free Zone: 0% income tax for 30 years, subsidized utilities, port access\\n" +
"  - Sohar Free Zone: 0% tax for 25 years, direct port access, industrial land lease from $1/m²/year\\n" +
"  - Rusayl/Madayn: 5% land lease subsidy, government co-investment programs, R&D grants\\n" +
"  Always list applicable benefits for the project's location.\\n" +
"\\n" +
"VISION 2040 ALIGNMENT: Score each project 1-10 on: (1) Energy Diversification, (2) Industrial Development, (3) Job Creation for Omanis, (4) Export Potential, (5) Environmental Sustainability. Include this in the JSON output as Vision2040Score object.\\n" +
"\\n" +
"STRESS TESTS — Show exact numbers: Revenue -10%: new payback = X years, new IRR = Y%. OPEX +15%: new gross margin = Z%. Production -10%: new annual profit = $W. Mark each as: VIABLE / MARGINAL / NOT VIABLE.\\n" +
"\\n" +
"All outputs must include this disclaimer:\\n" +
"\\\"Disclaimer\\\": \\\"This analysis is AI-generated for informational purposes only and does not constitute financial or investment advice. All figures are estimates based on industry benchmarks. Consult a qualified financial advisor before making investment decisions.\\\"\\n" +
"\\n" +
"Output MUST be valid JSON following the provided schema.`;";

content = content.replace(/const SYSTEM_PROMPT = `You are an "Integrated Biofuel[\s\S]*?Output MUST be valid JSON following the provided schema.`;/, newSystemPrompt);

const checkStandardsFunction = `
export async function checkStandardsCompliance(
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
}
`;

if (!content.includes('checkStandardsCompliance')) {
  content += checkStandardsFunction;
}

fs.writeFileSync('geminiService.ts', content);
console.log('Update Complete');
