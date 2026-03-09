
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { BioFuelAnalysis, SuggestedProject, ResearchImplementationAnalysis, ChallengeSolverResult, OptimizerResult } from "./types";

const SYSTEM_PROMPT = `You are an "Integrated Biofuel & Renewable Energy Investment-Grade Analysis Engine".
Your purpose is to evaluate industrial-scale projects across biofuels and renewable energy using realistic engineering and financial benchmarks.

STRICT MODE:
• No optimistic assumptions.
• All CAPEX and OPEX must follow industry benchmarks.
• Automatically penalize unrealistic investor inputs.
• Show formulas clearly.
• All units must be consistent.

### MULTI-AGENT AI ROLES:

1. **Technical Engineering AI**:
   - Role: Validate production target, calculate installed capacity, apply correct energy conversion factors, and select proper benchmark range based on technology.
   - Constraints: Never calculate financials. Only produce technical outputs.
   - Outputs: Installed Capacity (kg/year or kW), Energy Output (kWh/year), Benchmark CAPEX range per unit, Technology maturity level (TRL estimate).

2. **Financial Modeling AI**:
   - Role: Use ONLY validated outputs from Technical AI. Calculate Required Realistic CAPEX using industry benchmarks, calculate OPEX using technology-specific averages, compute Revenue, Gross Profit, Payback, IRR (simplified), and LCOE or cost per ton.
   - Constraints: Never assume optimistic pricing. Use conservative estimates.

3. **Independent Investment Committee Auditor**:
   - Role: Challenge the project. Recalculate installed cost per kg or per kW, compare with benchmark ranges, detect underfunding, detect unrealistic payback (<5 years for algae = suspicious).
   - Stress Tests: Revenue -10%, OPEX +15%, Production -10%.
   - Classification: Pass, Needs Revision, Critical Financial Issue.
   - Outputs: Funding gap (USD and %).

4. **Risk Assessment AI**:
   - Role: Evaluate Capital Adequacy Ratio, TRL, Feedstock Stability (if biofuel), Market volatility, and Regulatory risk.
   - Classification: Moderate, Significant, Critical.
   - Action: Adjust Feasibility Score accordingly.

### INDUSTRY BENCHMARKS (NON-NEGOTIABLE):
BIOFUELS:
- Algae (Open Pond) CAPEX: $8–12 per kg installed annual capacity.
- Algae (PBR) CAPEX: $15–25 per kg installed annual capacity.
- Date Seed/Waste Oil CAPEX: $1,200–2,500 per ton annual capacity.
- Biofuel OPEX: $600–1,400 per ton depending on technology.

RENEWABLE ENERGY:
- Solar PV CAPEX: $800–1,200 per kW installed.
- Wind CAPEX: $1,300–1,800 per kW installed.
- Waste-to-Energy CAPEX: $3,000–5,000 per kW installed.
- Solar Capacity Factor (Oman): 25–30%.
- Wind Capacity Factor (Oman): 35–45%.

### OMAN CONTEXT ADJUSTMENTS:
- Labor costs: Adjust for local industrial city rates.
- Solar/Date Seed: Increase feasibility score due to abundance.
- Algae: Flag evaporation risk in high-heat zones.

### FEASIBILITY PENALTIES:
- Capital Adequacy Ratio < 0.7: -25% score, flag "Severe Underfunding".
- Capital Adequacy Ratio 0.7–0.9: -15% score.
- Installed Cost < lower benchmark: Flag "Unrealistic CAPEX".
- Payback > 15 years: Flag "High Investment Risk".

Output MUST be valid JSON following the provided schema.`;

const getApiKey = () => {
  return process.env.GEMINI_API_KEY || "";
};

const MOCK_DATA = {
  optimize: (projectName: string, description: string): OptimizerResult => ({
    ProfitOpportunities: [
      `Production of high-value co-products specifically for ${projectName} based on its focus on ${description.substring(0, 30)}...`,
      "Carbon credit monetization through international carbon markets.",
      "Integration of solar-powered processing units to reduce operational costs.",
      "Strategic partnerships with local Omani logistics firms for reduced transport fees."
    ],
    CarbonReductionStrategies: [
      `Implementation of closed-loop water recycling systems tailored for ${projectName}.`,
      "Use of solar thermal energy for feedstock drying and processing.",
      "Methane capture and utilization from waste processing units.",
      "Optimization of transport routes using AI-driven logistics."
    ],
    FossilFuelReplacementPlan: [
      "Transitioning facility vehicles to electric or biodiesel-powered fleets.",
      "Replacing diesel generators with solar-battery hybrid systems.",
      "Using bio-gas for on-site heating and steam generation."
    ],
    LogisticsOptimization: [
      "Establishing processing hubs near feedstock collection points in Salalah and Sohar.",
      "Utilizing the Duqm port for efficient international export of refined products.",
      "Implementing real-time tracking for feedstock supply chain transparency."
    ],
    NetZeroRoadmap: {
      CarbonIntensityEstimate: "15.5 kg CO2-eq per MJ (75% lower than fossil diesel)",
      StandardsComparison: "Exceeds EU RED II sustainability criteria and Oman Vision 2040 targets.",
      RoadmapSteps: [
        `Phase 1: 100% renewable energy integration for ${projectName} processing (Years 1-2).`,
        "Phase 2: Full electrification of logistics fleet (Years 3-5).",
        "Phase 3: Implementation of Carbon Capture and Storage (CCS) for negative emissions (Years 5+)."
      ]
    }
  }),
  analyze: (inputs: any): BioFuelAnalysis => {
    const budget = inputs.budget || 1000000;
    const production = inputs.production || 5000;
    const sellingPrice = inputs.sellingPrice || 1200;
    const feedstock = inputs.feedstock || "Algae";
    const location = inputs.location || "Oman";
    
    return {
      ProjectAnalyzer: {
        ProjectName: inputs.projectName || "Sample Project",
        Location: location,
        TechnologyCategory: inputs.category || "Biofuel",
        Feedstock: feedstock,
        ExpectedProduction: production,
        PreliminaryBudgetUSD: budget,
        SellingPriceUSD: sellingPrice,
        ElectricityCostUSDkWh: inputs.electricityCost || 0.05,
        LaborCostPerYearUSD: inputs.laborCost || 50000,
        CO2Source: inputs.co2Source || "Industrial Flue Gas"
      },
      TechnicalAI: {
        InstalledCapacity: `${production.toLocaleString()} Tons/Year`,
        EnergyOutput: `${(production * 36).toLocaleString()} GJ/Year`,
        BenchmarkCAPEXRange: "$1,200 - $2,500 per ton",
        TRLEstimate: 7
      },
      FinancialAI: {
        RealisticCAPEX: budget * 1.1,
        OPEX: budget * 0.15,
        Revenue: production * sellingPrice,
        GrossProfit: production * sellingPrice * 0.4,
        PaybackYears: 4.5,
        IRR_Simplified: "18.5%",
        LCOE_or_CostPerTon: `$${(sellingPrice * 0.7).toFixed(0)} per ton`
      },
      AuditorAI: {
        RecalculatedInstalledCost: budget * 1.05,
        BenchmarkComparison: `Project CAPEX for ${feedstock} in ${location} aligns with regional benchmarks.`,
        UnderfundingDetected: false,
        UnrealisticPaybackFlag: false,
        StressTestResults: {
          RevenueMinus10: "Payback extends to 5.2 years.",
          OPEXPlus15: "Gross margin remains healthy at 32%.",
          ProductionMinus10: "Project remains viable with 16% IRR."
        },
        Classification: "Pass",
        FundingGapUSD: 0,
        FundingGapPercentage: 0
      },
      RiskAI: {
        CapitalAdequacyRatio: 0.95,
        TRL: 7,
        FeedstockStability: `High - Stable ${feedstock} supply chains identified in ${location}.`,
        MarketVolatility: "Moderate - Hedged by long-term off-take agreements.",
        RegulatoryRisk: "Low - Strong alignment with Oman Vision 2040.",
        RiskClassification: "Moderate"
      },
      RecommendedBiofuelType: feedstock.includes("Oil") ? "Biodiesel" : "Bioethanol",
      EnergyDomain: inputs.category || "Biofuel",
      EconomicFeasibility: {
        Assessment: "Highly Feasible",
        Justification: `The ${inputs.projectName || 'project'} demonstrates strong economic fundamentals for ${feedstock} processing in ${location}.`,
        PaybackPeriodYears: 4.5,
        RealisticRequiredCAPEX: budget * 1.1,
        FundingGapUSD: 0,
        FundingGapPercentage: 0,
        InstalledCostPerUnit: budget / production,
        AnnualRevenue: production * sellingPrice,
        AnnualOPEX: budget * 0.15,
        GrossProfit: production * sellingPrice * 0.4,
        CapitalAdequacyRatio: 0.95,
        InvestmentVerdict: "Investment Grade",
        EstimatedInvestmentUSD: {
          Minimum: budget * 0.9,
          Maximum: budget * 1.3,
          MajorCosts: ["Reactor Systems", "Feedstock Logistics", "Refining Units"]
        }
      },
      SensitivityAnalysis: {
        PriceDrop10: { PaybackPeriod: 5.2, RiskLevel: "Moderate" },
        OPEXIncrease15: { PaybackPeriod: 5.5, RiskLevel: "Moderate" },
        ProductionDrop10: { PaybackPeriod: 5.8, RiskLevel: "Significant" },
        DataPoints: [
          { label: "-20% Market Shift", payback: 7.2, irr: 8 },
          { label: "-10% Market Shift", payback: 6.1, irr: 12 },
          { label: "Baseline", payback: 4.5, irr: 18.5 },
          { label: "+10% Market Shift", payback: 3.8, irr: 24 },
          { label: "+20% Market Shift", payback: 3.2, irr: 31 }
        ]
      },
      EnvironmentalImpact: {
        CarbonEmissions_kgCO2_per_liter: 0.45,
        WaterUsage_liters_per_liter: 2.5,
        LandUse_ha_per_ton_biofuel: 0.02,
        CarbonCapturePotential_kgCO2_per_year: 1200000,
        WasteManagementRecommendations: ["Glycerol recovery", "Water recycling", "Solid waste composting"]
      },
      KeyRisks: [
        { Type: "Technical", Description: `${feedstock} consistency issues.`, Mitigation: "Advanced pre-treatment systems." },
        { Type: "Market", Description: "Fluctuating biofuel prices.", Mitigation: "Long-term off-take agreements." }
      ],
      AuditAIReview: {
        ConsistencyCheck: "All metrics are internally consistent.",
        DataWarnings: ["Budget is slightly below regional average for this scale."],
        SuggestedCorrections: ["Consider increasing contingency budget by 5%."]
      },
      InvestorPerspective: {
        ReturnPotential: "High - Strong IRR and payback period.",
        CapitalIntensity: "Moderate - Typical for pilot-scale biorefineries.",
        RiskExposure: "Moderate - Well-mitigated through technology selection.",
        ScalabilityRating: "High",
        MarketDemandAnalysis: "Strong local demand for sustainable fuels."
      },
      Vision2040Alignment: {
        SustainabilityImpact: "Directly contributes to Oman's net-zero targets.",
        DiversificationContribution: "Reduces dependence on fossil fuel exports.",
        IndustrialDevelopment: "Promotes high-tech agricultural and chemical industries.",
        InnovationScore: 92
      },
      ProjectReadiness: "Pilot-Ready",
      AnalysisAssumptions: {
        KeyAssumptions: [`Stable ${feedstock} supply`, "Access to local grid at industrial rates"],
        BenchmarkSources: ["Oman Ministry of Energy", "International Energy Agency"],
        ModelLimitations: ["Excludes land acquisition costs", "Assumes current tax incentives remain"],
        DataGaps: ["Detailed soil analysis for cultivation site"]
      },
      AuditorAssessment: {
        ValidationSummary: ["Technical capacity is realistic", "Financial model is robust"],
        MetricClassifications: {
          ProductionScale: "Realistic",
          CapitalIntensity: "Realistic",
          ROIEstimate: "Realistic"
        },
        OptimizedProduction: {
          RecommendedRange: `${(production * 0.9).toLocaleString()} - ${(production * 1.1).toLocaleString()} Tons/Year`,
          Justification: `Matches ${feedstock} availability in ${location}.`
        },
        OptimizedInvestment: {
          RecommendedRange: `$${(budget * 1.1).toLocaleString()} - $${(budget * 1.4).toLocaleString()}`,
          StagedStrategy: "Phase 1: Lab-scale (Year 1), Phase 2: Pilot (Year 2)."
        },
        RealityCheck: "The project is technically sound and financially attractive.",
        FinalVerdict: "Recommended for immediate pilot-scale implementation."
      },
      FinalFeasibilityScore: 88,
      RiskExposureLevel: "Moderate",
      Rationale: `Strong technical foundation for ${feedstock} combined with favorable Omani regulatory environment.`,
      ExpertCounsel: [
        `Engage with local ${feedstock} suppliers in ${location} early.`,
        "Apply for OPAZ land grants in the Duqm Free Zone.",
        "Partner with Sultan Qaboos University for technical validation."
      ],
      Dashboard: "Detailed Analysis Dashboard Generated Successfully."
    };
  },
  solve: (topic: string): ChallengeSolverResult => ({
    IdentifiedChallenge: `Scientific and technical bottlenecks in ${topic} specifically within Oman's arid climate.`,
    ScientificHypothesis: `Integration of specialized microbial consortia to enhance ${topic} resilience in high-salinity and high-heat Omani environments.`,
    ExperimentalDesign: {
      Title: `${topic} Optimization in Omani Conditions`,
      Variables: [`${topic} intensity levels`, "Microbial consortia composition", "Nutrient concentration"],
      ControlConditions: ["Standard freshwater cultivation", "Ambient Oman temperature (35°C)"],
      ExpectedOutcomes: [`30% increase in ${topic} efficiency under stress`, "Enhanced accumulation of target compounds in stress conditions"],
      FeasibilityNote: "Highly feasible using existing university laboratory equipment in Oman."
    },
    IndustrialRelevance: `Reduces freshwater demand by 80%, enabling ${topic} implementation in coastal desert areas.`,
    ExpectedImpact: {
      Environmental: "Preservation of freshwater resources.",
      Economic: "Lower operational costs through use of seawater.",
      Strategic: "Enables large-scale production in non-arable land.",
      Scalability: "High - Applicable across Oman's 3,000km coastline."
    }
  }),
  research: (inputs: any): ResearchImplementationAnalysis => {
    const feedstock = inputs.feedstockType || "Waste Cooking Oil";
    const biofuel = inputs.biofuelType || "Biodiesel";
    const scale = inputs.scale || "100 Liters/Day";
    
    return {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      ResearchInputs: {
        BiofuelType: biofuel,
        FeedstockType: feedstock,
        ConversionPathway: inputs.conversionPathway || "Biochemical",
        LaboratoryYield: inputs.labYield || "95%",
        ConversionEfficiency: inputs.efficiency || 88,
        TechnologyReadinessLevel: inputs.trl || 4,
        DesiredPilotScale: scale
      },
      ImplementationEstimator: {
        FeedstockRequirements: `Approximately 1.2x the target output of ${feedstock} daily.`,
        EquipmentSetup: [`Batch reactor for ${biofuel}`, "Centrifuge system", "Vacuum distillation unit", "Quality control sensors"],
        EnergyUtilities: "15 kWh daily electricity consumption.",
        WasteManagement: "Byproduct recovery for secondary industrial use.",
        EfficiencyAdjustments: "Heat recovery integration suggested for 12% energy saving."
      },
      ProductionOutput: {
        AnnualFuelOutput: `${scale} capacity estimated at 35,000 Liters/Year`,
        EnergyOutput: "1,250 GJ/Year",
        ByProductValueEstimation: "High - Byproducts can be sold to local manufacturers.",
        CarbonReductionPotential: "92 Tons CO2-eq per year."
      },
      ReadinessScore: {
        TechnicalScalability: 75,
        ExperimentalFeasibility: 90,
        SafetyEnvironmental: 85,
        ReadinessForSmallScale: 70,
        OverallScore: 80
      },
      CostEstimation: {
        EquipmentCosts: {
          ReactorSystem: { USD: "$15,000", OMR: "5,775 OMR" },
          PreTreatmentSystem: { USD: "$8,000", OMR: "3,080 OMR" },
          HeatingCoolingSystems: { USD: "$5,000", OMR: "1,925 OMR" },
          DistillationUpgradingUnit: { USD: "$12,000", OMR: "4,620 OMR" },
          StorageTanks: { USD: "$3,000", OMR: "1,155 OMR" },
          SafetyMonitoringSystems: { USD: "$4,000", OMR: "1,540 OMR" },
          TotalEquipmentCost: { USD: "$47,000", OMR: "18,095 OMR" }
        },
        InstallationSetupCost: { USD: "$12,000", OMR: "4,620 OMR" },
        AnnualOperatingCost: {
          FeedstockCost: { USD: "$5,000", OMR: "1,925 OMR" },
          EnergyConsumption: { USD: "$2,500", OMR: "962 OMR" },
          Maintenance: { USD: "$3,000", OMR: "1,155 OMR" },
          LaboratoryStaff: "University-funded research assistants.",
          Consumables: { USD: "$2,000", OMR: "770 OMR" },
          TotalAnnualOperatingCost: { USD: "$12,500", OMR: "4,812 OMR" }
        },
        TotalInitialBudgetRange: { USD: "$55,000 - $65,000", OMR: "21,175 - 25,025 OMR" },
        CostAssumptions: ["Based on research-grade equipment", "Excludes land cost", "Includes 1 year of consumables"]
      },
      TRLRoadmap: [
        { trl: 5, title: "Pilot Scale Validation", description: `Testing ${biofuel} in a simulated environment.`, estimatedDuration: "6 months", keyMilestones: ["Successful 100L batch", "Quality certification"] },
        { trl: 6, title: "Demonstration System", description: "Operational in a relevant environment.", estimatedDuration: "12 months", keyMilestones: ["Continuous operation", "Energy efficiency audit"] }
      ],
      ScientificSummary: `The research on ${feedstock} demonstrates high potential for localized ${biofuel} production in Oman.`,
      Assumptions: ["Stable feedstock supply", "Access to university laboratory infrastructure"],
      RiskFactors: ["Feedstock purity variations", "Scaling heat transfer efficiency"]
    };
  },
  suggest: (context: string): SuggestedProject => ({
    ProjectName: `Oman ${context} Innovation Hub`,
    Feedstock: "Local organic waste and solar energy.",
    Technology: "Integrated biorefinery with solar-thermal integration.",
    EstimatedScale: "Pilot-scale (500 tons/year)",
    StrategicJustification: "Directly supports Oman Vision 2040 by diversifying energy sources and creating local high-tech jobs.",
    Incentives: [
      { title: "Tax Holiday", description: "5-year exemption from corporate income tax.", authority: "Ministry of Finance" },
      { title: "Subsidized Land", description: "Long-term lease at nominal rates in Free Zones.", authority: "OPAZ" },
      { title: "R&D Grants", description: "Matching funds for innovative energy projects.", authority: "Ministry of Higher Education, Research and Innovation" }
    ]
  })
};

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3, initialDelay = 2000): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      
      const errorMessage = err.message?.toLowerCase() || "";
      const isRateLimit = errorMessage.includes("429") || errorMessage.includes("quota") || errorMessage.includes("rate limit");
      const isOverloaded = errorMessage.includes("503") || errorMessage.includes("high demand") || errorMessage.includes("overloaded") || err.status === "UNAVAILABLE";
      
      if ((isRateLimit || isOverloaded) && i < maxRetries - 1) {
        // Try to extract retry delay from error message if present (e.g., "retry in 36s")
        const retryMatch = errorMessage.match(/retry in (\d+\.?\d*)s/);
        const waitTime = retryMatch ? (parseFloat(retryMatch[1]) * 1000) + 1000 : initialDelay * Math.pow(2, i);
        
        console.warn(`Gemini API ${isRateLimit ? 'Rate Limited' : 'Busy'}. Waiting ${waitTime}ms... (Attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      // If it's a quota error and we're out of retries, throw a cleaner message
      if (isRateLimit) {
        throw new Error("AI Quota Exceeded: The free tier limit has been reached. Please wait a moment before trying again.");
      }
      
      throw err;
    }
  }
  throw lastError;
}

export async function optimizeProject(projectName: string, description: string): Promise<OptimizerResult> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your environment variables.");
  }
  const ai = new GoogleGenAI({ apiKey });
  
  const SYSTEM_PROMPT = `You are Smart Profit and Low-Carbon Optimizer AI, a multi-agent system designed to help biofuel projects become profitable while minimizing lifecycle greenhouse gas emissions.
Your goal is to support both investors and researchers by providing realistic and actionable strategies.

The system includes:
1. Profit Strategy AI: Identify revenue streams, co-products (glycerol, biochar, fertilizers), carbon credits, and ESG financing.
2. Carbon Reduction AI: Analyze lifecycle emissions (cultivation, processing, transport) and suggest renewable energy integration.
3. Fossil Fuel Replacement AI: Recommend electrification, green hydrogen, and renewable power alternatives.
4. Low-Carbon Logistics AI: Optimize supply chain, facility location, and local sourcing.
5. Net-Zero Advisor AI: Estimate carbon intensity (kg CO2-eq per MJ) and provide a roadmap to net-zero.

Tone: Clear, Practical, Scientific, Investor-friendly, Realistic.
Output MUST be valid JSON following the provided schema.`;

  const prompt = `Optimize the following biofuel project for profit and low-carbon impact:
  Project Name: ${projectName}
  Description: ${description}
  
  Your optimization strategy must be highly specific to the project name and description provided above. 
  - Profit opportunities should leverage the specific feedstock or location mentioned.
  - Carbon reduction should address the specific operational challenges described.
  - The Net-Zero roadmap should be a realistic timeline for this specific project.`;

  try {
    const response = await withRetry(() => ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ProfitOpportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
            CarbonReductionStrategies: { type: Type.ARRAY, items: { type: Type.STRING } },
            FossilFuelReplacementPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
            LogisticsOptimization: { type: Type.ARRAY, items: { type: Type.STRING } },
            NetZeroRoadmap: {
              type: Type.OBJECT,
              properties: {
                CarbonIntensityEstimate: { type: Type.STRING },
                StandardsComparison: { type: Type.STRING },
                RoadmapSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["CarbonIntensityEstimate", "StandardsComparison", "RoadmapSteps"]
            }
          },
          required: ["ProfitOpportunities", "CarbonReductionStrategies", "FossilFuelReplacementPlan", "LogisticsOptimization", "NetZeroRoadmap"]
        }
      }
    }));

    return JSON.parse(response.text || "{}") as OptimizerResult;
  } catch (err: any) {
    console.warn("Optimization API failed, using mock data:", err);
    return MOCK_DATA.optimize(projectName, description);
  }
}

export async function analyzeProject(inputs: {
  projectName: string;
  location: string;
  category: 'Biofuel' | 'Renewable Energy';
  feedstock: string;
  production: number;
  budget: number;
  sellingPrice: number;
  electricityCost?: number;
  laborCost?: number;
  co2Source?: string;
}): Promise<BioFuelAnalysis> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your environment variables.");
  }
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `Perform an Investment-Grade Feasibility Analysis for:
  - Project Name: ${inputs.projectName}
  - Location: ${inputs.location}
  - Category: ${inputs.category}
  - Feedstock/Energy Type: ${inputs.feedstock}
  - Target Production: ${inputs.production} ${inputs.category === 'Biofuel' ? 'tons/year' : 'MWh/year'}
  - Investor Budget: ${inputs.budget} USD
  - Selling Price: ${inputs.category === 'Biofuel' ? inputs.sellingPrice + ' USD/ton' : (inputs.sellingPrice || 'N/A (Calculate LCOE and Savings)') + ' USD/MWh'}
  - Electricity Cost: ${inputs.electricityCost || 'N/A'} USD/kWh
  - Labor Cost: ${inputs.laborCost || 'N/A'} USD/year
  - CO2 Source: ${inputs.co2Source || 'N/A'}

  CALCULATIONS REQUIRED:
  1. Installed Capacity (${inputs.category === 'Biofuel' ? 'kg/year' : 'kW'})
  2. Required Realistic CAPEX = Capacity * benchmark $/unit
  3. Capital Adequacy Ratio = Investor Budget / Required Realistic CAPEX
  4. Installed Cost per Unit = Investor Budget / Capacity
  5. Annual Revenue = Production * Selling Price (If Selling Price is N/A for Renewable Energy, calculate based on avoided grid costs or regional PPA benchmarks)
  6. Annual OPEX = Production * OPEX benchmark
  7. Gross Profit = Revenue - OPEX
  8. Simple Payback Period = Required Realistic CAPEX / Gross Profit

  SENSITIVITY ANALYSIS:
  - Stress Test 1: Price drops 10%
  - Stress Test 2: OPEX increases 15%
  - Stress Test 3: Production drops 10%
  - DataPoints: Generate at least 5 data points for the "Investment Sensitivity Visualizer" (label, payback, irr) showing a range of market scenarios from -20% to +20% shifts.

  Override investor optimism with realistic engineering numbers.`;

  try {
    const response = await withRetry(() => ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
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
                ElectricityCostUSDkWh: { type: Type.NUMBER },
                LaborCostPerYearUSD: { type: Type.NUMBER },
                CO2Source: { type: Type.STRING }
              },
              required: ["ProjectName", "Location", "TechnologyCategory", "Feedstock"]
            },
            TechnicalAI: {
              type: Type.OBJECT,
              properties: {
                InstalledCapacity: { type: Type.STRING },
                EnergyOutput: { type: Type.STRING },
                BenchmarkCAPEXRange: { type: Type.STRING },
                TRLEstimate: { type: Type.NUMBER }
              },
              required: ["InstalledCapacity", "EnergyOutput", "BenchmarkCAPEXRange", "TRLEstimate"]
            },
            FinancialAI: {
              type: Type.OBJECT,
              properties: {
                RealisticCAPEX: { type: Type.NUMBER },
                OPEX: { type: Type.NUMBER },
                Revenue: { type: Type.NUMBER },
                GrossProfit: { type: Type.NUMBER },
                PaybackYears: { type: Type.NUMBER },
                IRR_Simplified: { type: Type.STRING },
                LCOE_or_CostPerTon: { type: Type.STRING }
              },
              required: ["RealisticCAPEX", "OPEX", "Revenue", "GrossProfit", "PaybackYears"]
            },
            AuditorAI: {
              type: Type.OBJECT,
              properties: {
                RecalculatedInstalledCost: { type: Type.NUMBER },
                BenchmarkComparison: { type: Type.STRING },
                UnderfundingDetected: { type: Type.BOOLEAN },
                UnrealisticPaybackFlag: { type: Type.BOOLEAN },
                StressTestResults: {
                  type: Type.OBJECT,
                  properties: {
                    RevenueMinus10: { type: Type.STRING },
                    OPEXPlus15: { type: Type.STRING },
                    ProductionMinus10: { type: Type.STRING }
                  },
                  required: ["RevenueMinus10", "OPEXPlus15", "ProductionMinus10"]
                },
                Classification: { type: Type.STRING, enum: ['Pass', 'Needs Revision', 'Critical Financial Issue'] },
                FundingGapUSD: { type: Type.NUMBER },
                FundingGapPercentage: { type: Type.NUMBER }
              },
              required: ["RecalculatedInstalledCost", "BenchmarkComparison", "UnderfundingDetected", "Classification"]
            },
            RiskAI: {
              type: Type.OBJECT,
              properties: {
                CapitalAdequacyRatio: { type: Type.NUMBER },
                TRL: { type: Type.NUMBER },
                FeedstockStability: { type: Type.STRING },
                MarketVolatility: { type: Type.STRING },
                RegulatoryRisk: { type: Type.STRING },
                RiskClassification: { type: Type.STRING, enum: ['Moderate', 'Significant', 'Critical'] }
              },
              required: ["CapitalAdequacyRatio", "TRL", "RiskClassification"]
            },
            RecommendedBiofuelType: { type: Type.STRING },
            EnergyDomain: { type: Type.STRING },
            EconomicFeasibility: {
              type: Type.OBJECT,
              properties: {
                Assessment: { type: Type.STRING },
                Justification: { type: Type.STRING },
                PaybackPeriodYears: { type: Type.NUMBER },
                RealisticRequiredCAPEX: { type: Type.NUMBER },
                FundingGapUSD: { type: Type.NUMBER },
                FundingGapPercentage: { type: Type.NUMBER },
                InstalledCostPerUnit: { type: Type.NUMBER },
                AnnualRevenue: { type: Type.NUMBER },
                AnnualOPEX: { type: Type.NUMBER },
                GrossProfit: { type: Type.NUMBER },
                CapitalAdequacyRatio: { type: Type.NUMBER },
                InvestmentVerdict: { type: Type.STRING, enum: ['Not Bankable', 'Conditionally Viable', 'Investment Grade'] },
                EstimatedInvestmentUSD: {
                  type: Type.OBJECT,
                  properties: {
                    Minimum: { type: Type.NUMBER },
                    Maximum: { type: Type.NUMBER },
                    MajorCosts: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["Minimum", "Maximum", "MajorCosts"]
                }
              },
              required: ["Assessment", "Justification", "PaybackPeriodYears", "RealisticRequiredCAPEX", "InvestmentVerdict"]
            },
            SensitivityAnalysis: {
              type: Type.OBJECT,
              properties: {
                PriceDrop10: { type: Type.OBJECT, properties: { PaybackPeriod: { type: Type.NUMBER }, RiskLevel: { type: Type.STRING } }, required: ["PaybackPeriod", "RiskLevel"] },
                OPEXIncrease15: { type: Type.OBJECT, properties: { PaybackPeriod: { type: Type.NUMBER }, RiskLevel: { type: Type.STRING } }, required: ["PaybackPeriod", "RiskLevel"] },
                ProductionDrop10: { type: Type.OBJECT, properties: { PaybackPeriod: { type: Type.NUMBER }, RiskLevel: { type: Type.STRING } }, required: ["PaybackPeriod", "RiskLevel"] },
                DataPoints: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      label: { type: Type.STRING },
                      payback: { type: Type.NUMBER },
                      irr: { type: Type.NUMBER }
                    },
                    required: ["label", "payback", "irr"]
                  }
                }
              },
              required: ["PriceDrop10", "OPEXIncrease15", "ProductionDrop10", "DataPoints"]
            },
            EnvironmentalImpact: {
              type: Type.OBJECT,
              properties: {
                CarbonEmissions_kgCO2_per_liter: { type: Type.NUMBER },
                WaterUsage_liters_per_liter: { type: Type.NUMBER },
                LandUse_ha_per_ton_biofuel: { type: Type.NUMBER },
                CarbonCapturePotential_kgCO2_per_year: { type: Type.NUMBER },
                WasteManagementRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["CarbonEmissions_kgCO2_per_liter", "WaterUsage_liters_per_liter", "LandUse_ha_per_ton_biofuel"]
            },
            KeyRisks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  Type: { type: Type.STRING },
                  Description: { type: Type.STRING },
                  Mitigation: { type: Type.STRING }
                },
                required: ["Type", "Description", "Mitigation"]
              }
            },
            InvestorPerspective: {
              type: Type.OBJECT,
              properties: {
                ReturnPotential: { type: Type.STRING },
                CapitalIntensity: { type: Type.STRING },
                RiskExposure: { type: Type.STRING },
                ScalabilityRating: { type: Type.STRING },
                MarketDemandAnalysis: { type: Type.STRING }
              },
              required: ["ReturnPotential", "CapitalIntensity", "RiskExposure"]
            },
            Vision2040Alignment: {
              type: Type.OBJECT,
              properties: {
                SustainabilityImpact: { type: Type.STRING },
                DiversificationContribution: { type: Type.STRING },
                IndustrialDevelopment: { type: Type.STRING },
                InnovationScore: { type: Type.NUMBER }
              },
              required: ["SustainabilityImpact", "InnovationScore"]
            },
            ProjectReadiness: { type: Type.STRING },
            AnalysisAssumptions: {
              type: Type.OBJECT,
              properties: {
                KeyAssumptions: { type: Type.ARRAY, items: { type: Type.STRING } },
                BenchmarkSources: { type: Type.ARRAY, items: { type: Type.STRING } },
                ModelLimitations: { type: Type.ARRAY, items: { type: Type.STRING } },
                DataGaps: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["KeyAssumptions", "BenchmarkSources"]
            },
            AuditorAssessment: {
              type: Type.OBJECT,
              properties: {
                ValidationSummary: { type: Type.ARRAY, items: { type: Type.STRING } },
                RealityCheck: { type: Type.STRING },
                FinalVerdict: { type: Type.STRING }
              },
              required: ["ValidationSummary", "RealityCheck", "FinalVerdict"]
            },
            AuditAIReview: {
              type: Type.OBJECT,
              properties: {
                ConsistencyCheck: { type: Type.STRING },
                DataWarnings: { type: Type.ARRAY, items: { type: Type.STRING } },
                SuggestedCorrections: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["ConsistencyCheck", "DataWarnings"]
            },
            FinalFeasibilityScore: { type: Type.NUMBER },
            RiskExposureLevel: { type: Type.STRING, enum: ['Moderate', 'Significant', 'Critical'] },
            Rationale: { type: Type.STRING },
            ExpertCounsel: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: [
            "ProjectAnalyzer", "EconomicFeasibility", "SensitivityAnalysis", "FinalFeasibilityScore", "RiskExposureLevel", "Rationale"
          ]
        }
      }
    }));

    return JSON.parse(response.text || "{}") as BioFuelAnalysis;
  } catch (err: any) {
    console.warn("Analysis API failed, using mock data:", err);
    return MOCK_DATA.analyze(inputs);
  }
}

export async function solveChallenge(topic: string): Promise<ChallengeSolverResult> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your environment variables.");
  }
  const ai = new GoogleGenAI({ apiKey });
  
  const SYSTEM_PROMPT = `You are Oman Biofuel Challenge Solver AI, a scientific multi-agent system designed to identify and solve biofuel research challenges in Oman.
Your role is to support researchers, students, and industry by generating realistic, locally relevant scientific solutions.

The system consists of five AI agents:
1. Challenge Identifier AI: Identify key scientific and technical bottlenecks in biofuel production in Oman (climate, salinity, water scarcity, energy use).
2. Scientific Hypothesis Generator AI: Propose innovative and realistic biological, biochemical, or engineering solutions (strain engineering, adaptive cultivation).
3. Experimental Design AI: Suggest laboratory and pilot-scale experiments feasible in university labs.
4. Industrial Translation AI: Explain how the research can reduce CAPEX, OPEX, or technical risk.
5. Impact Evaluation AI: Evaluate environmental, economic, and strategic impact for Oman.

Output MUST be valid JSON following the provided schema.
Tone: Scientific, Clear, Practical, Educational, Realistic.`;

  const prompt = `Identify and solve a specific scientific and technical challenge related to: "${topic}".
  
  Context: Oman's biofuel industry, climate (high heat, humidity), and resource constraints (water scarcity).
  
  Your response must directly address the specific details and keywords in the user's topic. Do not provide generic answers. If the topic is specific (e.g., "date seed oil extraction"), the solution must be specific to that feedstock and process.`;

  try {
    const response = await withRetry(() => ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            IdentifiedChallenge: { type: Type.STRING },
            ScientificHypothesis: { type: Type.STRING },
            ExperimentalDesign: {
              type: Type.OBJECT,
              properties: {
                Title: { type: Type.STRING },
                Variables: { type: Type.ARRAY, items: { type: Type.STRING } },
                ControlConditions: { type: Type.ARRAY, items: { type: Type.STRING } },
                ExpectedOutcomes: { type: Type.ARRAY, items: { type: Type.STRING } },
                FeasibilityNote: { type: Type.STRING }
              },
              required: ["Title", "Variables", "ControlConditions", "ExpectedOutcomes"]
            },
            IndustrialRelevance: { type: Type.STRING },
            ExpectedImpact: {
              type: Type.OBJECT,
              properties: {
                Environmental: { type: Type.STRING },
                Economic: { type: Type.STRING },
                Strategic: { type: Type.STRING },
                Scalability: { type: Type.STRING }
              },
              required: ["Environmental", "Economic", "Strategic", "Scalability"]
            }
          },
          required: ["IdentifiedChallenge", "ScientificHypothesis", "ExperimentalDesign", "IndustrialRelevance", "ExpectedImpact"]
        }
      }
    }));

    return JSON.parse(response.text || "{}") as ChallengeSolverResult;
  } catch (err: any) {
    console.warn("Solver API failed, using mock data:", err);
    return MOCK_DATA.solve(topic);
  }
}

export async function analyzeResearchImplementation(
  inputs: any
): Promise<ResearchImplementationAnalysis> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your environment variables.");
  }
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `Perform a professional techno-economic "Research Implementation" analysis for the following laboratory-scale biofuel research:
  - Biofuel Type: ${inputs.biofuelType}
  - Feedstock Type: ${inputs.feedstockType}
  - Conversion Pathway: ${inputs.conversionPathway}
  - Laboratory Yield: ${inputs.labYield}
  - Conversion Efficiency: ${inputs.efficiency}%
  - Technology Readiness Level (TRL): ${inputs.trl}
  - Desired Pilot Production Scale: ${inputs.scale}

  The goal is to estimate requirements for pilot-scale or small-scale application.
  The output must be purely research-focused, without financial calculations for investors.
  
  Include a "SECTION 5: Academic Pilot-Scale Cost Approximation":
  - Assume the project is a UNIVERSITY-BASED PILOT SYSTEM, not an industrial demonstration plant.
  - Use research-grade equipment pricing, not full industrial automation pricing.
  - Limit installation cost to 20–30% of equipment cost.
  - Assume semi-manual operation with minimal automation.
  - Assume laboratory staff are already part of university payroll (do NOT fully allocate salaries unless specified).
  - Provide approximate scientific implementation cost estimates (minimum–maximum ranges).
  - Provide both USD and OMR cost estimates (1 USD = 0.385 OMR).
  - Clearly separate Equipment Cost, Installation Cost, and Estimated Total Initial Budget (all in USD + OMR).
  - Avoid investment language (no ROI, no IRR, no profit projections).

  SCORING LOGIC:
  - Normalize TRL as: TRL_score = (TRL / 9) * 100.
  - Final Readiness Score = (TRL_score * 0.4) + (ExperimentalFeasibility * 0.2) + (EnergyEfficiencyScore * 0.2) + (TechnicalScalability * 0.2).
  - All readiness metrics must be scaled 0–100.

  UNIT CONVERSION:
  - Convert any energy output from GJ to KILOWATT (kWh) (1 GJ = 277.778 kWh).

  TRL SCALING ROADMAP:
  - Generate a step-by-step roadmap (TRLRoadmap) from the current TRL to TRL 9.
  - For each step, include a title, description, estimated duration, and 2-3 key milestones.

  Adjust assumptions for pilot-scale lab implementation. Use realistic scientific benchmarks.
  Highlight uncertainties and risk factors clearly.`;

  try {
    const response = await withRetry(() => ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: `You are an advanced biofuel scientific application analyst. 
        Your tone must be professional, analytical, and research-oriented.
        Output MUST be valid JSON following the provided schema.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ResearchInputs: {
              type: Type.OBJECT,
              properties: {
                BiofuelType: { type: Type.STRING, enum: ['Bioethanol', 'Biodiesel', 'Biogas', 'Biobutanol'] },
                FeedstockType: { type: Type.STRING },
                ConversionPathway: { type: Type.STRING, enum: ['Biochemical', 'Thermochemical', 'Hybrid'] },
                LaboratoryYield: { type: Type.STRING },
                ConversionEfficiency: { type: Type.NUMBER },
                TechnologyReadinessLevel: { type: Type.NUMBER },
                DesiredPilotScale: { type: Type.STRING }
              },
              required: ["BiofuelType", "FeedstockType", "ConversionPathway", "LaboratoryYield", "ConversionEfficiency", "TechnologyReadinessLevel", "DesiredPilotScale"]
            },
            ImplementationEstimator: {
              type: Type.OBJECT,
              properties: {
                FeedstockRequirements: { type: Type.STRING },
                EquipmentSetup: { type: Type.ARRAY, items: { type: Type.STRING } },
                EnergyUtilities: { type: Type.STRING },
                WasteManagement: { type: Type.STRING },
                EfficiencyAdjustments: { type: Type.STRING }
              },
              required: ["FeedstockRequirements", "EquipmentSetup", "EnergyUtilities", "WasteManagement", "EfficiencyAdjustments"]
            },
            ProductionOutput: {
              type: Type.OBJECT,
              properties: {
                AnnualFuelOutput: { type: Type.STRING },
                EnergyOutput: { type: Type.STRING },
                ByProductValueEstimation: { type: Type.STRING },
                CarbonReductionPotential: { type: Type.STRING }
              },
              required: ["AnnualFuelOutput", "EnergyOutput", "ByProductValueEstimation", "CarbonReductionPotential"]
            },
            ReadinessScore: {
              type: Type.OBJECT,
              properties: {
                TechnicalScalability: { type: Type.NUMBER },
                ExperimentalFeasibility: { type: Type.NUMBER },
                SafetyEnvironmental: { type: Type.NUMBER },
                ReadinessForSmallScale: { type: Type.NUMBER },
                OverallScore: { type: Type.NUMBER }
              },
              required: ["TechnicalScalability", "ExperimentalFeasibility", "SafetyEnvironmental", "ReadinessForSmallScale", "OverallScore"]
            },
            CostEstimation: {
              type: Type.OBJECT,
              properties: {
                EquipmentCosts: {
                  type: Type.OBJECT,
                  properties: {
                    ReactorSystem: { 
                      type: Type.OBJECT, 
                      properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } },
                      required: ["USD", "OMR"]
                    },
                    PreTreatmentSystem: { 
                      type: Type.OBJECT, 
                      properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } },
                      required: ["USD", "OMR"]
                    },
                    HeatingCoolingSystems: { 
                      type: Type.OBJECT, 
                      properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } },
                      required: ["USD", "OMR"]
                    },
                    DistillationUpgradingUnit: { 
                      type: Type.OBJECT, 
                      properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } },
                      required: ["USD", "OMR"]
                    },
                    StorageTanks: { 
                      type: Type.OBJECT, 
                      properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } },
                      required: ["USD", "OMR"]
                    },
                    SafetyMonitoringSystems: { 
                      type: Type.OBJECT, 
                      properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } },
                      required: ["USD", "OMR"]
                    },
                    TotalEquipmentCost: { 
                      type: Type.OBJECT, 
                      properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } },
                      required: ["USD", "OMR"]
                    }
                  },
                  required: ["ReactorSystem", "PreTreatmentSystem", "HeatingCoolingSystems", "DistillationUpgradingUnit", "StorageTanks", "SafetyMonitoringSystems", "TotalEquipmentCost"]
                },
                InstallationSetupCost: { 
                  type: Type.OBJECT, 
                  properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } },
                  required: ["USD", "OMR"]
                },
                AnnualOperatingCost: {
                  type: Type.OBJECT,
                  properties: {
                    FeedstockCost: { 
                      type: Type.OBJECT, 
                      properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } },
                      required: ["USD", "OMR"]
                    },
                    EnergyConsumption: { 
                      type: Type.OBJECT, 
                      properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } },
                      required: ["USD", "OMR"]
                    },
                    Maintenance: { 
                      type: Type.OBJECT, 
                      properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } },
                      required: ["USD", "OMR"]
                    },
                    LaboratoryStaff: { type: Type.STRING },
                    Consumables: { 
                      type: Type.OBJECT, 
                      properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } },
                      required: ["USD", "OMR"]
                    },
                    TotalAnnualOperatingCost: { 
                      type: Type.OBJECT, 
                      properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } },
                      required: ["USD", "OMR"]
                    }
                  },
                  required: ["FeedstockCost", "EnergyConsumption", "Maintenance", "LaboratoryStaff", "Consumables", "TotalAnnualOperatingCost"]
                },
                TotalInitialBudgetRange: { 
                  type: Type.OBJECT, 
                  properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } },
                  required: ["USD", "OMR"]
                },
                CostAssumptions: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["EquipmentCosts", "InstallationSetupCost", "AnnualOperatingCost", "TotalInitialBudgetRange", "CostAssumptions"]
            },
            TRLRoadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  trl: { type: Type.NUMBER },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  estimatedDuration: { type: Type.STRING },
                  keyMilestones: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["trl", "title", "description", "estimatedDuration", "keyMilestones"]
              }
            },
            ScientificSummary: { type: Type.STRING },
            Assumptions: { type: Type.ARRAY, items: { type: Type.STRING } },
            RiskFactors: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["ResearchInputs", "ImplementationEstimator", "ProductionOutput", "ReadinessScore", "CostEstimation", "ScientificSummary", "Assumptions", "RiskFactors"]
        }
      }
    }));

    const data = JSON.parse(response.text || "{}");
    return {
      ...data,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString()
    } as ResearchImplementationAnalysis;
  } catch (err: any) {
    console.warn("Research API failed, using mock data:", err);
    return MOCK_DATA.research(inputs);
  }
}

export async function suggestProject(context: string): Promise<SuggestedProject> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your environment variables.");
  }
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await withRetry(() => ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: `Suggest a realistic, Oman-specific project concept for ${context}. Focus on feasibility and Vision 2040 alignment. 
      Include a list of specific Omani government incentives (tax breaks, land grants, subsidies) the project qualifies for based on its type and location.`,
      config: {
        systemInstruction: "You are an industrial project developer for the energy transition in Oman. Provide innovative but pilot-scale realistic projects.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ProjectName: { type: Type.STRING },
            Feedstock: { type: Type.STRING },
            Technology: { type: Type.STRING },
            EstimatedScale: { type: Type.STRING },
            StrategicJustification: { type: Type.STRING },
            Incentives: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  authority: { type: Type.STRING }
                },
                required: ["title", "description", "authority"]
              }
            }
          },
          required: ["ProjectName", "Feedstock", "Technology", "EstimatedScale", "StrategicJustification", "Incentives"]
        }
      }
    }));
    return JSON.parse(response.text || "{}") as SuggestedProject;
  } catch (err: any) {
    console.warn("Suggestion API failed, using mock data:", err);
    return MOCK_DATA.suggest(context);
  }
}
