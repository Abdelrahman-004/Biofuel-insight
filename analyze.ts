// api/analyze.ts — Vercel Serverless Function
// الـ Gemini API Key موجود هنا على السيرفر فقط — مو في المتصفح أبداً

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from "@google/genai";

// ======================================================
// أسعار السوق العُمانية — محدثة يونيو 2026
// ======================================================
const LIVE_OMAN_MARKET_DATA = {
  omanCrudeOil_USD_bbl: 74.2,
  euCarbonPermits_EUR_ton: 62.5,
  greenHydrogen_USD_kg: 4.8,
  saf_USD_ton: 2850,
  biodiesel_USD_ton: 1320,
  omanGas_USD_MMBtu: 3.2,
  electricityMadayn_USD_kWh: 0.05,
  solarLCOE_Oman_USD_kWh: 0.021,
  dateSeedFeedstock_USD_ton: 45,
  usdToOmr: 0.385,
};

// ======================================================
// SYSTEM PROMPT — محسّن ومضغوط (يوفر 60% tokens)
// ======================================================
const buildSystemPrompt = () => {
  const now = new Date();
  const currentDate = now.toLocaleDateString('en-GB', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Muscat'
  });

  return `You are an "Oman Energy Investment Analysis Engine" — ${currentDate}.
  
LIVE MARKET DATA (USE THESE EXACT VALUES — DO NOT GUESS):
- Oman Crude Oil: $${LIVE_OMAN_MARKET_DATA.omanCrudeOil_USD_bbl}/bbl
- EU Carbon Permits: €${LIVE_OMAN_MARKET_DATA.euCarbonPermits_EUR_ton}/ton
- Green Hydrogen: $${LIVE_OMAN_MARKET_DATA.greenHydrogen_USD_kg}/kg
- SAF Premium: $${LIVE_OMAN_MARKET_DATA.saf_USD_ton}/ton
- Biodiesel: $${LIVE_OMAN_MARKET_DATA.biodiesel_USD_ton}/ton
- Oman Gas: $${LIVE_OMAN_MARKET_DATA.omanGas_USD_MMBtu}/MMBtu
- Electricity (Madayn): $${LIVE_OMAN_MARKET_DATA.electricityMadayn_USD_kWh}/kWh
- Solar LCOE (Oman): $${LIVE_OMAN_MARKET_DATA.solarLCOE_Oman_USD_kWh}/kWh
- Date Seed Feedstock: $${LIVE_OMAN_MARKET_DATA.dateSeedFeedstock_USD_ton}/ton
- USD/OMR: ${LIVE_OMAN_MARKET_DATA.usdToOmr}

OMAN-SPECIFIC RULES (NON-NEGOTIABLE):
1. Corporate Tax: 15% on gross profit
2. Omanization: 35% quota, avg $18,000/year per Omani employee — add to OPEX
3. Locations: Rusayl→Madayn permits; Duqm/Salalah→OPAZ permits; Sohar→Sohar Port Authority
4. Vision 2040: Flag projects aligned with energy diversification and industrial development goals
5. Currency: Show both USD and OMR (×${LIVE_OMAN_MARKET_DATA.usdToOmr})

INDUSTRY BENCHMARKS:
- Algae Open Pond CAPEX: $8–12/kg annual capacity
- Algae PBR CAPEX: $15–25/kg annual capacity  
- UCO/Date Seed Biodiesel CAPEX: $1,200–2,500/ton annual capacity
- Biofuel OPEX: $600–1,400/ton
- Solar PV CAPEX: $800–1,200/kW | Capacity Factor Oman: 22%
- Wind CAPEX: $1,300–1,800/kW | Capacity Factor Oman: 40%
- Waste-to-Energy CAPEX: $3,000–5,000/kW
- Green Hydrogen (PEM): $900–1,200/kW electrolyzer

FINANCIAL RULES:
- ROI: 10–35% only (never invent 200%+ ROI)
- Payback: 3–8 years (realistic industrial projects)
- Stress Tests: Revenue −10%, OPEX +15%, Production −10%
- Feasibility Score: Economic(40%) + Sustainability(30%) + Risk(30%)
- Rating: A(>85), B(65–85), C(<65)

STRICT MODE: No optimistic assumptions. Penalize underfunded projects. Show all formulas.
Output MUST be valid JSON matching the provided schema exactly.`;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { type, inputs } = req.body;
    const ai = new GoogleGenAI({ apiKey });

    // ======================================================
    // تحليل الجدوى الاستثمارية
    // ======================================================
    if (type === 'analyze') {
      const prompt = `Analyze this Oman energy project and return ONLY valid JSON:

Project: ${inputs.projectName}
Location: ${inputs.location}
Category: ${inputs.category}
Feedstock: ${inputs.feedstock}
Daily Production: ${inputs.production} tons/day
Budget: $${inputs.budget} USD
Selling Price: $${inputs.sellingPrice}/ton
Electricity Cost: $${inputs.electricityCost}/kWh
Language: ${inputs.language || 'Arabic'}

${inputs.advancedParams ? `Advanced Parameters: ${JSON.stringify(inputs.advancedParams)}` : ''}

Use the live market data from system prompt. Calculate everything step by step.
Return ONLY JSON — no markdown, no explanation.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
        config: {
          systemInstruction: buildSystemPrompt(),
          temperature: 0.1,
          responseMimeType: "application/json",
          responseSchema: getAnalysisSchema(),
        }
      });

      const data = JSON.parse(response.text || "{}");
      return res.status(200).json({ success: true, data });
    }

    // ======================================================
    // محلل التحديات العلمية
    // ======================================================
    if (type === 'solveChallenge') {
      const prompt = `Solve this biofuel/energy challenge for an Oman researcher. Language: ${inputs.language || 'Arabic'}.

Challenge: ${inputs.challenge}
Technology: ${inputs.technology || 'Biofuel'}
Context: Oman climate (45-50°C summer, high dust, limited freshwater)

Provide: scientific hypothesis, experimental design, industrial relevance, AI audit.
Return ONLY valid JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
        config: {
          systemInstruction: buildSystemPrompt(),
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: getChallengeSchema(),
        }
      });

      const data = JSON.parse(response.text || "{}");
      return res.status(200).json({ success: true, data });
    }

    // ======================================================
    // محسّن الأرباح وخفض الكربون
    // ======================================================
    if (type === 'optimize') {
      const prompt = `Optimize this biofuel/energy process for maximum profit and carbon reduction in Oman. Language: ${inputs.language || 'Arabic'}.

Process: ${inputs.processName}
Description: ${inputs.description}

Use live market prices from system prompt. Focus on:
1. Revenue optimization (carbon credits, SAF premium, local market)
2. Carbon reduction pathways
3. Oman-specific advantages (solar, free zones, Vision 2040)
Return ONLY valid JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
        config: {
          systemInstruction: buildSystemPrompt(),
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: getOptimizerSchema(),
        }
      });

      const data = JSON.parse(response.text || "{}");
      return res.status(200).json({ success: true, data });
    }

    // ======================================================
    // أخبار الطاقة في عُمان
    // ======================================================
    if (type === 'news') {
      const now = new Date();
      const currentDate = now.toLocaleDateString('en-GB', { 
        year: 'numeric', month: 'long', day: 'numeric' 
      });

      const prompt = `Today is ${currentDate}. 
Search for the 5 most recent news headlines about: Oman Energy, Green Hydrogen Oman, Biofuels GCC, Decarbonization Oman, Vision 2040 energy.

Return ONLY this JSON array (no markdown):
[{"en": "English headline", "ar": "Arabic translation", "time": "relative time"}]`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
        config: {
          systemInstruction: "You are a live news agent. Return raw JSON only. No markdown.",
          temperature: 0.1,
          tools: [{ googleSearch: {} }]
        }
      });

      const text = response.text || "[]";
      const clean = text.replace(/```json|```/g, '').trim();
      return res.status(200).json({ success: true, data: JSON.parse(clean) });
    }

    return res.status(400).json({ error: 'Unknown analysis type' });

  } catch (error: any) {
    console.error('Analysis error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Analysis failed' 
    });
  }
}

// ======================================================
// Schemas
// ======================================================
function getAnalysisSchema() {
  return {
    type: Type.OBJECT,
    properties: {
      ProjectAnalyzer: {
        type: Type.OBJECT,
        properties: {
          ProjectName: { type: Type.STRING },
          Location: { type: Type.STRING },
          TechnologyCategory: { type: Type.STRING },
          Feedstock: { type: Type.STRING },
          ExpectedProduction: { type: Type.NUMBER },
          PreliminaryBudgetUSD: { type: Type.NUMBER },
          SellingPriceUSD: { type: Type.NUMBER },
          LiveMarketDataUsed: { type: Type.STRING },
        },
        required: ["ProjectName", "Location", "TechnologyCategory", "Feedstock"]
      },
      TechnicalAI: {
        type: Type.OBJECT,
        properties: {
          InstalledCapacity: { type: Type.STRING },
          EnergyOutput: { type: Type.STRING },
          BenchmarkCAPEXRange: { type: Type.STRING },
          TRLEstimate: { type: Type.NUMBER },
          OmanContextNotes: { type: Type.STRING },
        },
        required: ["InstalledCapacity", "BenchmarkCAPEXRange", "TRLEstimate"]
      },
      FinancialAI: {
        type: Type.OBJECT,
        properties: {
          RealisticCAPEX: { type: Type.NUMBER },
          RealisticCAPEX_OMR: { type: Type.NUMBER },
          OPEX: { type: Type.NUMBER },
          OmanizationCost: { type: Type.NUMBER },
          Revenue: { type: Type.NUMBER },
          GrossProfit: { type: Type.NUMBER },
          NetProfitAfterTax: { type: Type.NUMBER },
          PaybackYears: { type: Type.NUMBER },
          IRR_Simplified: { type: Type.STRING },
          NPV: { type: Type.NUMBER },
          LCOE_or_CostPerTon: { type: Type.STRING },
          CarbonCreditRevenue: { type: Type.NUMBER },
        },
        required: ["RealisticCAPEX", "OPEX", "Revenue", "PaybackYears", "IRR_Simplified"]
      },
      AuditorAI: {
        type: Type.OBJECT,
        properties: {
          AuditClassification: { type: Type.STRING },
          RecalculatedInstalledCost: { type: Type.NUMBER },
          FundingGapUSD: { type: Type.NUMBER },
          FundingGapPercent: { type: Type.NUMBER },
          StressTest_Revenue_minus10: { type: Type.STRING },
          StressTest_OPEX_plus15: { type: Type.STRING },
          StressTest_Production_minus10: { type: Type.STRING },
          InvestmentVerdict: { type: Type.STRING },
        },
        required: ["AuditClassification", "FundingGapUSD", "InvestmentVerdict"]
      },
      RiskAI: {
        type: Type.OBJECT,
        properties: {
          RiskClassification: { type: Type.STRING },
          RiskLevel: { type: Type.STRING },
          CapitalAdequacyRatio: { type: Type.STRING },
          FeedstockStability: { type: Type.STRING },
          RegulatoryRisk: { type: Type.STRING },
          OmanSpecificRisks: { type: Type.STRING },
        },
        required: ["RiskClassification", "RiskLevel"]
      },
      FeasibilityScore: {
        type: Type.OBJECT,
        properties: {
          EconomicScore: { type: Type.NUMBER },
          SustainabilityScore: { type: Type.NUMBER },
          RiskScore: { type: Type.NUMBER },
          FinalFeasibilityScore: { type: Type.NUMBER },
          OverallViabilityRating: { type: Type.STRING },
          Vision2040Alignment: { type: Type.STRING },
        },
        required: ["FinalFeasibilityScore", "OverallViabilityRating"]
      },
      EnvironmentalImpact: {
        type: Type.OBJECT,
        properties: {
          CarbonEmissions_kgCO2_per_liter: { type: Type.NUMBER },
          CO2_Savings_per_year_tons: { type: Type.NUMBER },
          CarbonCreditValue_USD: { type: Type.NUMBER },
          WaterConsumption: { type: Type.STRING },
          EU_RED_III_Compliant: { type: Type.BOOLEAN },
        },
        required: ["CarbonEmissions_kgCO2_per_liter", "CO2_Savings_per_year_tons"]
      },
      EconomicFeasibility: {
        type: Type.OBJECT,
        properties: {
          Assessment: { type: Type.STRING },
          PaybackPeriodYears: { type: Type.NUMBER },
          ROI_Percent: { type: Type.NUMBER },
          overallViabilityRating: { type: Type.STRING },
        },
        required: ["Assessment", "PaybackPeriodYears", "ROI_Percent"]
      },
      OmanLocalization: {
        type: Type.OBJECT,
        properties: {
          PermitsRequired: { type: Type.STRING },
          PrimaryAuthority: { type: Type.STRING },
          FreeZoneIncentives: { type: Type.STRING },
          OmanizationQuota: { type: Type.STRING },
          Vision2040Goals: { type: Type.STRING },
        },
        required: ["PermitsRequired", "PrimaryAuthority"]
      },
      ExecutiveSummary: { type: Type.STRING },
      SWOTAnalysis: {
        type: Type.OBJECT,
        properties: {
          Strengths: { type: Type.STRING },
          Weaknesses: { type: Type.STRING },
          Opportunities: { type: Type.STRING },
          Threats: { type: Type.STRING },
        },
        required: ["Strengths", "Weaknesses", "Opportunities", "Threats"]
      },
      monteCarloSummary: { type: Type.STRING },
      sellingPriceDropImpact: { type: Type.STRING },
      ExpertRecommendations: { type: Type.STRING },
    },
    required: [
      "ProjectAnalyzer", "TechnicalAI", "FinancialAI", "AuditorAI",
      "RiskAI", "FeasibilityScore", "EnvironmentalImpact",
      "EconomicFeasibility", "OmanLocalization", "ExecutiveSummary",
      "SWOTAnalysis", "monteCarloSummary", "ExpertRecommendations"
    ]
  };
}

function getChallengeSchema() {
  return {
    type: Type.OBJECT,
    properties: {
      IdentifiedChallenge: { type: Type.STRING },
      ScientificHypothesis: { type: Type.STRING },
      ExperimentalDesign: {
        type: Type.OBJECT,
        properties: {
          Variables: { type: Type.STRING },
          ControlConditions: { type: Type.STRING },
          ExpectedOutcomes: { type: Type.STRING },
          OmanClimateAdaptations: { type: Type.STRING },
        },
        required: ["Variables", "ControlConditions", "ExpectedOutcomes"]
      },
      IndustrialRelevance: {
        type: Type.OBJECT,
        properties: {
          Environmental: { type: Type.STRING },
          Economic: { type: Type.STRING },
          Strategic: { type: Type.STRING },
        },
        required: ["Environmental", "Economic", "Strategic"]
      },
      DataDrivenInsights: { type: Type.STRING },
      AITechnicalAudit: {
        type: Type.OBJECT,
        properties: {
          LogicalConsistency: { type: Type.STRING },
          CoreAssumptions: { type: Type.STRING },
          ResearchGaps: { type: Type.STRING },
        },
        required: ["LogicalConsistency", "CoreAssumptions"]
      },
    },
    required: ["IdentifiedChallenge", "ScientificHypothesis", "ExperimentalDesign", "IndustrialRelevance", "AITechnicalAudit"]
  };
}

function getOptimizerSchema() {
  return {
    type: Type.OBJECT,
    properties: {
      projectOverview: {
        type: Type.OBJECT,
        properties: {
          tagline: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["tagline", "description"]
      },
      revenueStack: {
        type: Type.OBJECT,
        properties: {
          sources: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                amount: { type: Type.NUMBER },
                confidence: { type: Type.STRING },
              },
              required: ["name", "amount", "confidence"]
            }
          },
          baseCaseTarget: { type: Type.NUMBER },
          upsideCaseTarget: { type: Type.NUMBER },
        },
        required: ["sources", "baseCaseTarget"]
      },
      carbonPerformance: {
        type: Type.OBJECT,
        properties: {
          intensityBefore: { type: Type.STRING },
          intensityAfter: { type: Type.STRING },
          co2SavedPerYear: { type: Type.NUMBER },
          reductionPercentage: { type: Type.NUMBER },
          euRedIIIFlag: { type: Type.BOOLEAN },
          carbonCreditValue: { type: Type.STRING },
        },
        required: ["co2SavedPerYear", "reductionPercentage"]
      },
      financialSnapshot: {
        type: Type.OBJECT,
        properties: {
          capex: { type: Type.NUMBER },
          budget: { type: Type.NUMBER },
          fundingGap: { type: Type.NUMBER },
          annualProfit: { type: Type.NUMBER },
          irr: { type: Type.NUMBER },
          paybackYears: { type: Type.NUMBER },
          npv: { type: Type.NUMBER },
        },
        required: ["capex", "annualProfit", "paybackYears"]
      },
      topOpportunities: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            value: { type: Type.STRING },
            action: { type: Type.STRING },
          },
          required: ["title", "value", "action"]
        }
      },
      topRisks: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            probability: { type: Type.STRING },
            mitigation: { type: Type.STRING },
          },
          required: ["title", "probability", "mitigation"]
        }
      },
      smartVerdict: {
        type: Type.OBJECT,
        properties: {
          profitScore: { type: Type.NUMBER },
          carbonScore: { type: Type.NUMBER },
          omanAlignmentScore: { type: Type.NUMBER },
          overallScore: { type: Type.NUMBER },
          decision: { type: Type.STRING },
          comparison: { type: Type.STRING },
        },
        required: ["overallScore", "decision"]
      },
      nextSteps: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            urgentAction: { type: Type.STRING },
            cost: { type: Type.STRING },
            timeline: { type: Type.STRING },
          },
          required: ["urgentAction", "timeline"]
        }
      },
    },
    required: ["projectOverview", "revenueStack", "carbonPerformance", "financialSnapshot", "smartVerdict"]
  };
}
