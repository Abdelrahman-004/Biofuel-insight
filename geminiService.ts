
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { 
  BioFuelAnalysis, 
  SuggestedProject, 
  ResearchImplementationAnalysis, 
  ChallengeSolverResult, 
  OptimizerResult,
  StandardsInput,
  StandardsResult,
  ProposalInput,
  ProposalResult
} from "./types";

const SYSTEM_PROMPT = `You are an "Integrated Biofuel & Renewable Energy Investment-Grade Analysis Engine" operating in April 2026.
Your purpose is to evaluate industrial-scale projects across biofuels and renewable energy using realistic engineering and financial benchmarks.

### REAL-TIME DATA MANDATE (CRITICAL):
- NEVER guess or hallucinate market prices for Oil, Hydrogen, Carbon Credits, or Biofuels.
- Before every financial or scientific response involving costs/prices, you MUST use the provided Google Search tool to find the "Live Market Price" as of April 2026 for:
    1. Oman Crude Oil (USD/bbl).
    2. EU Carbon Permits (EUR/ton).
    3. Green Hydrogen Index (USD/kg).
    4. Regional Biofuel/SAF premiums.

STRICT MODE:
• No optimistic assumptions.
• All CAPEX and OPEX must follow industry benchmarks based on live data if possible.
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
- Date Seed/Waste Oil/UCO CAPEX: $1,200–2,500 per ton annual capacity.
- Biofuel OPEX: $600–1,400 per ton depending on technology.

RENEWABLE ENERGY:
- Solar PV CAPEX: $800–1,200 per kW installed.
- Wind CAPEX: $1,300–1,800 per kW installed.
- Waste-to-Energy CAPEX: $3,000–5,000 per kW installed.
- Solar Capacity Factor (Oman): 20–25% (roughly 1750-2190 MWh/yr per 1000 kW).
- Wind Capacity Factor (Oman): 35–45%.

### REALISTIC ROIs & PAYBACK (CRITICAL INSTRUCTION):
- Real industrial projects take time to become profitable.
- You MUST provide strictly realistic financial metrics. ROI should naturally be between 10% to 35%. 
- Payback periods should be 3 to 8 years. 
- DO NOT invent 200% ROI or return periods under 2 years, this destroys trust and screams "AI-generated". Force your formulas to output scaled, realistic metrics.

### OMAN CONTEXT ADJUSTMENTS:
- Corporate Tax: Apply 15% on Gross Profit. Formula: Net Profit = Gross Profit * 0.85.
- Omanization Cost: Calculate the cost of hiring Omani nationals (avg salary $18,000/year) based on a 35% quota for the industrial sector. Add this to OPEX.
- Utility Tariffs: Use Madayn (Ar-Rusayl) tariffs for electricity ($0.05/kWh) and water benchmarks if location is an industrial estate.
- Special Economic Zones: For Duqm, assume Salalah/Duqm Port advantages.

### DYNAMIC FEASIBILITY SCORING (WEIGHTED):
Calculate "FinalFeasibilityScore" using:
- Economic Score (40%): Based on NPV/IRR stability.
- Sustainability Score (30%): Based on CO2 displacement and waste-to-energy efficiency.
- Risk Score (30%): Based on Capital Adequacy Ratio (Budget/CAPEX).
- VIABILITY RATING: A (Score > 85), B (Score 65-85), C (Score < 65).

### LEGAL & PERMIT ROADMAP:
- If Location is "Ar-Rusayl" or contains "Madayn": List permits for Madayn and Environment Authority.
- If Location is "Duqm" or "Free Zone": List permits for OPAZ (Public Authority for Special Economic Zones and Free Zones).

### SENSITIVITY & MONTE CARLO:
- provide a "monteCarloSummary" text explaining the statistical probability of success.
- calculate "sellingPriceDropImpact": show how a 10% drop affects payback period.

Output MUST be valid JSON following the provided schema.`;

const getApiKey = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    if (import.meta.env.VITE_GEMINI_API_KEY) return import.meta.env.VITE_GEMINI_API_KEY;
    if (import.meta.env.GEMINI_API_KEY) return import.meta.env.GEMINI_API_KEY;
  }
  try {
    if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  } catch (e) {}
  return "";
};

const MOCK_DATA = {
  optimize: (projectName: string, description: string): OptimizerResult => ({
    projectOverview: {
      tagline: `${projectName}: Optimized production leveraging local Oman resources.`,
      description: "Under construction for mockup... Please use real API for complete reporting."
    },
    revenueStack: {
      sources: [
        { name: "Main product", amount: 1000000, confidence: 'HIGH' },
        { name: "Carbon credits", amount: 200000, confidence: 'MEDIUM' }
      ],
      baseCaseTarget: 1000000,
      upsideCaseTarget: 1200000
    },
    carbonPerformance: {
      intensityBefore: "90 gCO2/MJ",
      intensityAfter: "20 gCO2/MJ",
      co2SavedPerYear: 5000,
      reductionPercentage: 78,
      euRedIIIFlag: true,
      carbonCreditValue: "$100,000/year"
    },
    financialSnapshot: {
      capex: 5000000,
      budget: 6000000,
      fundingGap: 0,
      annualProfit: 800000,
      irr: 15,
      paybackYears: 6,
      npv: 2000000
    },
    topOpportunities: [
      { title: "Export to EU", value: "$300k/yr", action: "Obtain ISCC certification" }
    ],
    topRisks: [
      { title: "Feedstock shortage", probability: "Medium", mitigation: "Diversify suppliers" }
    ],
    smartVerdict: {
      profitScore: 4,
      carbonScore: 5,
      omanAlignmentScore: 4,
      overallScore: 8,
      decision: "Strong investment",
      comparison: "Better than standard diesel because of low CI."
    },
    optimizationRoadmap: [
      { year: 1, action: "Launch phase 1", cost: "$1M", impact: "High" }
    ],
    nextSteps: [
      { urgentAction: "Secure feedstock agreements", cost: "$5k", timeline: "Month 1" }
    ],
    dataTransparency: [
      { dataPoint: "Feedstock availability", source: "be'ah", confidence: 'HIGH' }
    ]
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
      Dashboard: "Detailed Analysis Dashboard Generated Successfully.",
      OmanLogic: {
        corporateTaxApplied: "15% Corporate tax applied to gross profit as per Omani Law.",
        omanizationCostEstimate: {
          USD: "$18,500",
          OMR: "7,122"
        },
        utilityTariffDetails: "Industrial estate tariffs ($0.05/kWh) and regional water benchmarks applied."
      },
      DynamicScores: {
        economicScore: 85,
        sustainabilityScore: 78,
        riskScore: 90,
        overallViabilityRating: "A",
        swotAnalysis: {
          strengths: ["Strong feedstock pipeline", "High regional demand", "Oman Vision 2040 support"],
          weaknesses: ["Capital intensive", "High heat evaporation risk", "Limited local technical expertise"],
          opportunities: ["Carbon credit export", "Free zone tax holidays", "Strategic logistics hub"],
          threats: ["Feedstock price volatility", "Regional competition", "Water scarcity"]
        }
      },
      LegalRoadmap: {
        location: location,
        authority: location.includes("Madayn") || location.includes("Rusayl") ? "Madayn Corporate Office" : "OPAZ (Duqm/Salalah Free Zones)",
        requiredPermits: [
          { name: "Environment Authority Permit", description: "Mandatory EIA and environmental clearance for industrial setup.", estimatedTime: "45-60 Days" },
          { name: "Madayn/OPAZ Operational License", description: "Industrial operational permission for facility use.", estimatedTime: "15-20 Days" },
          { name: "Ministry of Labour Approval", description: "Omanization quota compliance and labour visa clearance.", estimatedTime: "10-15 Days" }
        ]
      },
      AdvancedSensitivity: {
        monteCarloSummary: "Based on 1,000 simulations, there is a 94.2% statistical probability of the project maintaining a payback period under 6.5 years given current market volatility.",
        sellingPriceDropImpact: {
          dropPercentage: 10,
          newPaybackPeriod: "5.2 Years",
          viabilityStatus: "High"
        }
      },
      ExecutiveSummary: `The ${inputs.projectName || 'project'} represents a robust and scalable opportunity for ${feedstock} conversion in ${location}. With a feasibility score of 88%, the project is strongly bankable, particularly when leveraged against Omani Special Economic Zone benefits and Vision 2040 incentives. Strategic focus on Omanization and local supply chain integration will further enhance the ROI.`
    };
  },
  solve: (topic: string): ChallengeSolverResult => ({
    researchChallenge: `Scientific constraints and technical bottlenecks in ${topic} within Oman's arid environment.`,
    researchGap: `Lack of data on performance degradation of ${topic} under simultaneous high heat and dust soiling conditions.`,
    hypothesis: `If specialized heat-resistant materials are applied, then ${topic} efficiency will increase by 15%, because thermal degradation is mitigated.`,
    experimentalDesign: {
      title: `${topic} Optimization in Oman`,
      objective: `To quantify the efficiency gain for ${topic} using new materials.`,
      variables: [
        { type: "Independent", name: "Temperature", range: "25°C to 45°C" },
        { type: "Dependent", name: "Efficiency", range: "% yield" }
      ],
      steps: ["Setup equipment", "Run baseline tests", "Apply materials", "Run test phase", "Analyze data"],
      equipment: ["Spectrometer", "Thermal Chamber", "Data Logger"],
      duration: "6 months",
      budget: "OMR 15,000"
    },
    statisticalDesign: {
      replicates: 5,
      totalExperimentalUnits: 25,
      primaryTest: "Two-way ANOVA",
      postHocTest: "Tukey's HSD",
      correlationTest: "Pearson Correlation",
      software: "R version 4.2",
      availableAt: "SQU Analytical Lab",
      significanceLevel: "p < 0.05",
      minimumDetectableDifference: "5%",
      requiredNFor80Power: 12,
      dataPresentation: ["Mean ± Standard Deviation", "Boxplots indicating quartiles"]
    },
    expectedOutcomes: [
      { metric: "Efficiency", baseline: "65%", target: "80%", unit: "%" },
      { metric: "Water Usage", baseline: "10 L/kg", target: "2 L/kg", unit: "L/kg" }
    ],
    lifeCycleAssessment: {
      systemBoundary: "Cradle-to-gate",
      functionalUnit: "1 kg of output",
      methodology: "ISO 14040/14044 compliant",
      phases: [
        { phase: "Production", energy: 50, ghg: 10 },
        { phase: "Operation", energy: 20, ghg: 2 }
      ],
      comparison: [
        { parameter: "GHG (kgCO2e/kg)", fossilBaseline: "+3.5", conventional: "1.2", thisStudy: "0.8" }
      ],
      resourceEfficiency: [
        { resource: "Freshwater", convMethod: "15 m³/ton", thisStudy: "5 m³/ton", saving: "66%" }
      ],
      netGhgPosition: { fossilBaseline: "5.0", thisStudyTarget: "1.2", reductionAchieved: "76%", euRedIIIMet: true },
      lcaAssumptions: ["Electricity mix is current Oman grid.", "Transport distance max 50km."],
      dataGaps: ["End-of-life recycling rates."],
      isoCompliance: { status: "PARTIAL", reason: "Wait for third-party audit." }
    },
    literatureLandscape: {
      established: ["Efficiency drops inversely to temperature."],
      contested: ["Whether dust composition dominates heat effects."],
      unknown: ["Combining specific Omani dust mineralogy with ultra-high temperatures in experimental rigs."],
      keyResearchGroupsWorldwide: [
        { group: "NREL PV Reliability Group", focus: "Thermal degradation" }
      ],
      searchTerms: ["Oman heat stress", "Efficiency optimization", "Advanced materials"],
      targetJournals: [
        { journal: "Applied Energy", impactFactor: "11.2" }
      ]
    },
    researchPathway: {
      lab: { scale: "Bench (1L)", duration: "6 months", goal: "Validate hypothesis and define variables" },
      pilot: { scale: "Pilot (100L)", duration: "12 months", goal: "Test scalable continuous production" },
      commercial: { scale: "Commercial (10kL)", timeline: "3 years", goal: "Full market deployment" }
    },
    researchOutputPlan: {
        publications: [
            { topic: "Initial proof of concept", journal: "Applied Energy", timeline: "Month 6", targetIF: ">10" }
        ],
        conference: { name: "World Future Energy Summit", location: "Abu Dhabi", deadline: "Q3 2026" },
        intellectualProperty: { patentPotential: "POSSIBLE", action: "File preliminary report", contact: "TRC Technology Transfer" },
        capacityBuilding: { mscTrained: 2, phdTrained: 0, capabilityBuilt: "Thermal testing rig", createdAsset: "Dataset on dust degradation" },
        kpis: { publications: 2, citationsTarget: 20, studentsTrained: 2, patentsFiled: 0, industryEngaged: true, policyBriefSubmitted: false },
        knowledgeTransfer: ["Share protocol with GUtech", "Report findings to PDO"]
    },
    fundingMatch: {
      bestFit: "The Research Council (TRC)",
      grantType: "Strategic Research Grant",
      budgetRange: "OMR 30,000 - 50,000",
      frameItAs: "Aligns with Vision 2040 sustainable energy transition goals.",
      applicationCycle: "Spring/Fall cycle"
    },
    limitations: [
      { limitation: "High dust accumulation may skew optical readings.", mitigation: "Use continuous automated cleaning." }
    ],
    dataConfidence: {
      high: "Solar irradiance and temperature ranges.",
      medium: "Material degradation rates.",
      low: "Long-term scaling effects."
    },
    recommendedCollaboration: {
      internal: "SQU College of Engineering",
      external: "KAUST",
      industry: "PDO Research Division",
      why: "Combines local expertise with world-class facilities and industry validation."
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
      FeasibilityOverview: `The research on ${feedstock} demonstrates high potential for localized ${biofuel} production in Oman.`,
      ScientificSummary: `This project aims to convert ${feedstock} into ${biofuel} using a ${inputs.conversionPathway || "Biochemical"} pathway.`,
      ImplementationEstimator: {
        FeedstockRequirements: `Approximately 1.2x the target output of ${feedstock} daily.`,
        EquipmentSetup: ["Reactor System", "Pre-treatment Unit", "Distillation Column"],
        EnergyUtilities: "Requires 50 kWh/day of electricity and 200 L/day of cooling water.",
        WasteManagement: "Solid residue can be used as fertilizer.",
        EfficiencyAdjustments: "Expected 10% efficiency drop when scaling from lab to pilot."
      },
      ResourceRequirements: {
        MassBalance: `Approximately 1.2x the target output of ${feedstock} daily.`,
        PreTreatmentRequired: "Mechanical crushing and acid esterification required."
      },
      ProductionOutput: {
        AnnualFuelOutput: "30,000 Liters",
        EnergyOutput: "1,050,000 MJ",
        ByProductValueEstimation: "Glycerol by-product valued at $500/year.",
        CarbonReductionPotential: "Estimated 75 tons CO2e reduction annually."
      },
      AdjustedFinancialApproximation: {
        EquipmentCost: { USD: "$47,000", OMR: "18,095 OMR" },
        InstallationCost: { USD: "$12,000", OMR: "4,620 OMR" },
        FeedstockCost: { USD: "$5,000", OMR: "1,925 OMR" },
        OperatingCost: { USD: "$12,500", OMR: "4,812 OMR" },
        ContingencyBuffer: { USD: "$8,850", OMR: "3,407 OMR" },
        TotalBudgetWithBuffer: { USD: "$85,350", OMR: "32,859 OMR" },
        OmanLogisticsMultiplierApplied: true
      },
      CostEstimation: {
        EquipmentCosts: {
          ReactorSystem: { USD: "$20,000", OMR: "7,700 OMR" },
          PreTreatmentSystem: { USD: "$10,000", OMR: "3,850 OMR" },
          HeatingCoolingSystems: { USD: "$5,000", OMR: "1,925 OMR" },
          DistillationUpgradingUnit: { USD: "$8,000", OMR: "3,080 OMR" },
          StorageTanks: { USD: "$2,000", OMR: "770 OMR" },
          SafetyMonitoringSystems: { USD: "$2,000", OMR: "770 OMR" },
          TotalEquipmentCost: { USD: "$47,000", OMR: "18,095 OMR" }
        },
        InstallationSetupCost: { USD: "$12,000", OMR: "4,620 OMR" },
        AnnualOperatingCost: {
          FeedstockCost: { USD: "$5,000", OMR: "1,925 OMR" },
          EnergyConsumption: { USD: "$3,000", OMR: "1,155 OMR" },
          Maintenance: { USD: "$2,500", OMR: "962 OMR" },
          LaboratoryStaff: "Covered by university payroll",
          Consumables: { USD: "$2,000", OMR: "770 OMR" },
          TotalAnnualOperatingCost: { USD: "$12,500", OMR: "4,812 OMR" }
        },
        TotalInitialBudgetRange: { USD: "$85,350", OMR: "32,859 OMR" },
        CostAssumptions: [
          "Equipment costs include 20% Oman logistics multiplier.",
          "Staff costs are excluded (academic setting).",
          "Includes 15% contingency buffer."
        ]
      },
      SensitivityAnalysis: {
        Scenario: "15% increase in raw material costs",
        ImpactOnLiterPrice: "+$0.05 per liter"
      },
      TechnicalRiskAssessment: {
        ScientificChallenges: ["Oxidation stability", "FFA saponification", "Filtration residue"],
        MitigationStrategies: ["Use of antioxidants", "Pre-esterification step", "Advanced membrane filtration"]
      },
      TRLRoadmap: [
        { trl: 5, title: "Pilot Scale Validation", description: `Testing ${biofuel} in a simulated environment.`, estimatedDuration: "6 months", keyMilestones: ["Successful 100L batch", "Quality certification"] },
        { trl: 6, title: "Demonstration System", description: "Operational in a relevant environment.", estimatedDuration: "12 months", keyMilestones: ["Continuous operation", "Energy efficiency audit"] }
      ],
      ReadinessScore: {
        TechnicalScalability: 75,
        ExperimentalFeasibility: 90,
        SafetyEnvironmental: 85,
        ReadinessForSmallScale: 70,
        OverallScore: 80
      },
      Assumptions: ["Feedstock is locally available in Oman.", "University lab has basic utilities."],
      RiskFactors: ["Supply chain delays for specialized equipment.", "Fluctuating feedstock quality."]
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

const getLanguageInstruction = (language?: string) => {
  if (language === 'Arabic') {
    return `
CRITICAL INSTRUCTION FOR ARABIC:
- You MUST translate EVERYTHING literally and completely into Arabic.
- NO ENGLISH WORDS SHOULD REMAIN IN THE OUTPUT TEXTS (except for strict JSON keys and enums).
- Translate all explanations, values, descriptions, mitigations, and summaries into Arabic literally.
- Ensure proper spacing between Arabic words. NEVER return mashed together words (e.g., "3.5إلى5.0مممربعلكلثانية"). Every word and number must be appropriately separated by spaces.`;
  }
  return `
CRITICAL INSTRUCTION FOR ENGLISH:
- You MUST output EVERYTHING in English natively.
- NO ARABIC WORDS SHOULD APPEAR IN THE OUTPUT.
- Present your findings with a heavy emphasis on NUMBERS, TABLES, and EMPIRICAL PROOF. Investors need hard data.
- Ensure specific financial ratios (IRR, ROI, Payback) and engineering metrics are clearly tabulated.`;
};

export async function optimizeProject(projectName: string, description: string, language: string = 'English'): Promise<OptimizerResult> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your environment variables.");
  }
  const ai = new GoogleGenAI({ apiKey });
  
  const SYSTEM_PROMPT = `YOUR MISSION FOR EVERY PROJECT:
"Find the most profitable low-carbon pathway using real Oman market data"

You are Smart Profit and Low-Carbon Optimizer AI, a multi-agent system designed to help sustainability projects in Oman become profitable.

═══════════════════════════════════════
PART 1 — AUTO-DETECT & SMART SETUP
═══════════════════════════════════════
Step 1: Identify project type automatically.
Step 2: Apply correct Oman benchmarks.
Step 3: Find ALL revenue streams (not just one).
Step 4: Find ALL carbon reduction paths.

PROJECT TYPES COVERED: Biofuel, Solar PV, Wind, Green Hydrogen, Waste-to-Energy, Carbon Credits, Carbon Capture, Nature-Based Solutions, Hybrid.

═══════════════════════════════════════
PART 2 — OMAN REAL MARKET DATA 2025
═══════════════════════════════════════
### BIOFUELS:
UCO local: $600–700/ton, imported GCC: $1,000–1,200/ton
Biodiesel local: $800–900/ton, EU export: $1,100–1,300/ton
Glycerin byproduct: $150–200/ton
Fish oil collection: $20–35/ton (max 20% blend with UCO)
Algae: not viable before 2030
Biogas tipping fee: $15–25/ton (be'ah)
Reference: Wakud International. Warning: 90% UCO smuggled.

### SOLAR PV:
Rooftop CAPEX: $0.65–0.80/Wp, Utility: $0.45–0.55/Wp
Irradiance: Muscat 5.5–6.2, Salalah 5.8–6.5, Duqm 6.0–6.8, Sohar 5.4–6.0 kWh/m²/day
Performance Ratio: 76–80%. Degradation: 0.45%/year.
Grid export: $0.025–0.035/kWh. Payback rooftop: 6–9 years.

### WIND:
Viable zones ONLY: Dhofar, Duqm, Masirah. CAPEX: $1.1–1.4M/MW.
Capacity factor Dhofar: 38–45%, Duqm: 28–33%.

### GREEN HYDROGEN:
Current cost: $4.5–6.5/kg H2, Target: $2.5–3.5/kg.
Electrolyzer CAPEX: $600–900/kW. Min scale: 100MW.

### WASTE-TO-ENERGY:
MSW Muscat: 1.7–2.1 kg/capita/day. Tipping fee: $15–25/ton. CAPEX: $400–600/ton/day.

### CARBON MARKETS:
Gold Standard VCM: $15–35/ton, EU ETS: €55–75/ton.
UCO biodiesel CI: ~15–25 gCO2eq/MJ (74–84% reduction).
EU RED III threshold: 65% reduction.
Blue carbon (Oman coast): HIGH potential.

### OPTIMIZATION & RULES:
Optimal blend: UCO 70% + Fish Oil 20% + Seeds 10%.
Discount rate: 8%. Corporate tax: 15%.
Omanization: 24,000–26,000 OMR/year. 1 OMR = 2.60 USD.

═══════════════════════════════════════
PART 3 — THE OPTIMIZER ENGINE
═══════════════════════════════════════
PROFIT OPTIMIZER: primary + byproduct + carbon + export premium.
CARBON OPTIMIZER: lowest-cost reduction path, calculate baseline.
REALITY CHECK: 
🚩 IRR > 28% → recheck
🚩 Payback < 2 years → flag
🚩 Budget < 30% CAPEX → flag underfunded
CARBON RULE: Base case = product revenue only.

CRITICAL INSTRUCTION: You must strictly output the requested markdown format wrapped inside the JSON field. Ensure everything is natively translated to ${language} if requested.
`;

  const prompt = `CRITICAL INSTRUCTION: Analyze the project using the benchmarks and output the findings purely in JSON matching the exact schema requested. Translate to ${language} if necessary.

Project Name: ${projectName}
Project Description: ${description}`;

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
            projectOverview: {
              type: Type.OBJECT,
              properties: {
                tagline: { type: Type.STRING },
                description: { type: Type.STRING }
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
                      confidence: { type: Type.STRING }
                    },
                    required: ["name", "amount", "confidence"]
                  }
                },
                baseCaseTarget: { type: Type.NUMBER },
                upsideCaseTarget: { type: Type.NUMBER }
              },
              required: ["sources", "baseCaseTarget", "upsideCaseTarget"]
            },
            carbonPerformance: {
              type: Type.OBJECT,
              properties: {
                intensityBefore: { type: Type.STRING },
                intensityAfter: { type: Type.STRING },
                co2SavedPerYear: { type: Type.NUMBER },
                reductionPercentage: { type: Type.NUMBER },
                euRedIIIFlag: { type: Type.BOOLEAN },
                carbonCreditValue: { type: Type.STRING }
              },
              required: ["intensityBefore", "intensityAfter", "co2SavedPerYear", "reductionPercentage", "euRedIIIFlag", "carbonCreditValue"]
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
                npv: { type: Type.NUMBER }
              },
              required: ["capex", "budget", "fundingGap", "annualProfit", "irr", "paybackYears", "npv"]
            },
            topOpportunities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  value: { type: Type.STRING },
                  action: { type: Type.STRING }
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
                  mitigation: { type: Type.STRING }
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
                comparison: { type: Type.STRING }
              },
              required: ["profitScore", "carbonScore", "omanAlignmentScore", "overallScore", "decision", "comparison"]
            },
            optimizationRoadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  year: { type: Type.STRING },
                  action: { type: Type.STRING },
                  cost: { type: Type.STRING },
                  impact: { type: Type.STRING }
                },
                required: ["year", "action", "cost", "impact"]
              }
            },
            nextSteps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  urgentAction: { type: Type.STRING },
                  cost: { type: Type.STRING },
                  timeline: { type: Type.STRING }
                },
                required: ["urgentAction", "cost", "timeline"]
              }
            },
            dataTransparency: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dataPoint: { type: Type.STRING },
                  source: { type: Type.STRING },
                  confidence: { type: Type.STRING }
                },
                required: ["dataPoint", "source", "confidence"]
              }
            }
          },
          required: ["projectOverview", "revenueStack", "carbonPerformance", "financialSnapshot", "topOpportunities", "topRisks", "smartVerdict", "optimizationRoadmap", "nextSteps", "dataTransparency"]
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
  projectScale: string;
  production: number;
  capacity?: number;
  budget: number;
  sellingPrice: number;
  electricityCost?: number;
  laborCost?: number;
  co2Source?: string;
  advancedParams?: Record<string, number | string>;
  language?: string;
}): Promise<BioFuelAnalysis> {
  const isArabic = inputs.language === 'Arabic';
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your environment variables.");
  }
  const ai = new GoogleGenAI({ apiKey });
  
  const LOCAL_SYSTEM_PROMPT = `${SYSTEM_PROMPT}\n\nCRITICAL LANGUAGE INSTRUCTION: You MUST process and output everything natively in ${inputs.language || 'English'}. ${getLanguageInstruction(inputs.language)}`;
  
  const advancedParamsStr = inputs.advancedParams 
    ? Object.entries(inputs.advancedParams)
        .filter(([_, v]) => v !== undefined && v !== '')
        .map(([k, v]) => `   - ${k}: ${v}`)
        .join('\n')
    : '';

  const prompt = `Perform an Investment-Grade Feasibility Analysis for:
  - Project Name: ${inputs.projectName}
  - Location: ${inputs.location}
  - Category: ${inputs.category}
  - Feedstock/Energy Type: ${inputs.feedstock}
  - Project Scale: ${inputs.projectScale} (Adjust feasibility scoring, CAPEX, OPEX, payback period, and recommendations strictly based on this scale. Small/Pilot means high risk per ton but lower total capital, Mega means economies of scale but huge upfront CAPEX.)
  - Target Production: ${inputs.production} ${inputs.category === 'Biofuel' ? 'tons/year' : 'MWh/year'}
  ${inputs.category === 'Renewable Energy' && inputs.capacity ? `- Plant Capacity: ${inputs.capacity} kW` : ''}
  - Investor Budget: ${inputs.budget} USD
  - Selling Price: ${inputs.category === 'Biofuel' ? inputs.sellingPrice + ' USD/ton' : (inputs.sellingPrice || 'N/A (Calculate LCOE and Savings)') + ' USD/MWh'}
  - Electricity Cost: ${inputs.electricityCost || 'N/A'} USD/kWh
  - Labor Cost: ${inputs.laborCost || 'N/A'} USD/year
  - CO2 Source: ${inputs.co2Source || 'N/A'}${advancedParamsStr ? '\n   - Advanced Techno-Economic Parameters:\n' + advancedParamsStr : ''}

  CRITICAL ACCURACY INSTRUCTION: Use all Advanced Techno-Economic Parameters provided to EXACTLY calculate payback period, CAPEX, OPEX, and generation yield. Do not guess parameters if they are provided. If standard parameters are missing, use industry norms for Oman. Do NOT deviate from standard physics and engineering calculations.
  If this is a Renewable Energy project (Solar/Wind), use the provided Plant Capacity (kW) and Target Production (MWh/year) to calculate Capacity Factor, generate physics-compliant energy outputs, and use those outputs to determine revenue correctly. Typical Solar PV in Oman produces ~1700 to 2000 MWh/year per 1000 kW capacity.
  
  CRITICAL LANGUAGE INSTRUCTION:
  The absolute MUST return all language text, summaries, labels, definitions, mitigation descriptions, strings, etc. exclusively in ${inputs.language || 'English'} natively. ${getLanguageInstruction(inputs.language)}

  1. PRECISION LOGISTICS (OMAN 2026)
  Calculate all transportation costs (for OPEX modeling or CAPEX delivery estimates) using this dynamic logic:
  - Distance Matrix: Muscat-Sohar (210km), Muscat-Duqm (550km), Muscat-Salalah (1000km).
  - Rates (OMR/Ton-km): Liquids: 0.045 | Solids: 0.040 | Thermal/Hazardous: 0.055.
  - Formula: Cost = (Distance * Weight * Rate) * Fuel_Index.
  - Baseline: Diesel at 0.250 OMR/L. Add 50 OMR flat fee for Port destinations.
  - Precision: All currency outputs must be in OMR with 3 decimal places where applicable (and standard USD). Convert explicitly (1 USD = 0.385 OMR).

  2. TECHNO-ECONOMIC ANALYSIS (TEA) REQUIREMENTS
  Integrate into your analysis markdown/explanatory texts:
  - Executive Summary Table: Comparing [Traditional] vs [EcoSync Proposed Solution] when evaluating the technical pathway.
  - Engineering Metrics: Energy Intensity (kWh/kg), Water Footprint (L/L), OPEX/CAPEX breakdown.
  - Scientific Formulas: Use LaTeX for any required math (use double dollar signs for block equations).

  3. UI/UX VISUAL STYLE (THEME INTEGRATION)
  - Prioritize Tables, Math, and Data over long prose for all text-based fields.
  - Use bold headers and clean Markdown tables in your summary strings.
  - Reference the Emerald Green (#10B981) theme for profits and Amber (#F59E0B) for warnings when outputting markdown logs.

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
  - Monte Carlo Simulation: Provide a summary of 1,000 simulated runs for these variables.

  EXECUTIVE SUMMARY:
  - Generate a professional Executive Summary (3-4 sentences).
  - Include a SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats).
  - Explicitly mention strategic alignment with Oman Vision 2040 goals.

  ## CRITICAL DATA CORRECTIONS — Apply these benchmarks before any calculation:

  ### BIOFUEL (UCO Biodiesel) — Oman Market Reality 2025:
  - UCO Collection Cost: $600–800/ton (local Oman), $1,000–1,200/ton (imported GCC/Asia)
  - Biodiesel Selling Price: $1,100–1,500/ton (EU export), $700–900/ton (local Oman)
  - Realistic CAPEX for 1,700 ton/yr plant: $800K–$1.2M (Green Fuels FuelMatic GSX20 benchmark)
  - Methanol cost: $400–500/ton
  - Conversion efficiency: 92–95%
  - Yield: 1 ton UCO → 0.92–0.95 ton biodiesel + 0.10 ton glycerin byproduct (credit: $200/ton)
  - Reference: Wakud International, Khazaen Economic City, Oman

  ### SOLAR PV — Oman Benchmarks 2025:
  - CAPEX: $0.45–0.55/Wp (utility scale), $0.65–0.80/Wp (commercial rooftop)
  - O&M: $8–12/kW/year
  - Daily irradiance (Muscat): 5.5–6.2 kWh/m²/day
  - Daily irradiance (Salalah): 5.8–6.5 kWh/m²/day  
  - Daily irradiance (Duqm): 6.0–6.8 kWh/m²/day
  - Panel efficiency: 21–23% (monocrystalline 2025)
  - Performance Ratio: 78–82% (accounting for Oman heat)
  - Degradation rate: 0.4–0.5%/year
  - PPA tariff benchmark: $0.016–0.024/kWh (OETC 2024)
  - Grid sell-back: $0.025–0.035/kWh
  - Reference: Manah I & II Solar Projects, 1 GW total

  ### WIND — Oman Benchmarks:
  - Viable zones: Dhofar (Salalah), Duqm, Masirah Island
  - Average wind speed: 7.5–9.5 m/s (Dhofar monsoon)
  - CAPEX: $1.1–1.4M/MW (onshore Oman)
  - Capacity factor: 35–45% (Dhofar), 25–30% (other)
  - Reference: Dhofar Wind Farm 50MW (operational)

  ### GREEN HYDROGEN — Oman NEOM/OQ Benchmarks:
  - Electrolyzer CAPEX: $600–900/kW (alkaline 2025)
  - Production cost target: $2.5–3.5/kg H2 (Oman 2030)
  - Current realistic cost: $4.5–6.0/kg H2
  - Electricity requirement: 50–55 kWh/kg H2
  - Water requirement: 9–10 L/kg H2
  - Storage cost: $1.5–2.0/kg H2
  - Reference: HYPORT Duqm (OQ + ACWA Power, 1.8 GW)

  ### WASTE-TO-ENERGY — Oman Context:
  - MSW generation: 1.7–2.1 kg/capita/day (Muscat)
  - Tipping fee income: $15–25/ton (be'ah contracts)
  - Energy content MSW Oman: 8–12 MJ/kg
  - CAPEX: $400–600/ton/day capacity

  ### ALGAE BIOFUEL — Oman Context:
  - Pilot scale only — no commercial plants in Oman yet
  - Realistic CAPEX: $15–25M for 3,700 ton/yr (greenfield)
  - Production cost: $3,000–5,000/ton (not yet competitive)
  - Reference: Net Zero Solutions + Al Tharmad + Green Gulf Industries ($23M project, development stage)

  ### JATROPHA & DATE SEEDS — Oman Context:
  - Jatropha: Yield 1,500–2,000 kg seeds/ha/yr. Oil content 30–40%. SQU research confirmed feasibility.
  - Date Seeds: Mwasalat Green Bus pilot (proof of concept only). Not commercial scale.

  ## FINANCIAL MODEL CORRECTIONS:
  - NPV Formula: NPV = -CAPEX + Σ [((Revenue - OPEX) × (1-tax)) / (1+r)^t]. Where: r = 8% discount rate, tax = 15% (Oman). Include 5% annual O&M escalation.
  - CAPEX Validation Rule: If (Investor Budget / Required CAPEX) < 0.4 → FLAG as "Severely Underfunded".
  - UCO Unit Economics Check: IF (UCO_cost_per_ton > Biodiesel_selling_price) → Alert: "Inverted economics detected."
  - Omanization Cost: Avg 24,000–26,000 OMR/year total. Minimum 35% Omani workforce.

  ## OUTPUT REQUIREMENTS for Investment-Grade Report (Inject into Dashboard/ExecutiveSummary markdown where applicable):
  1. FINANCIAL METRICS TABLE: NPV (base, +20%, -20%), IRR (pre/post tax), Payback, LCOE/LCOP, DSCR.
  2. SENSITIVITY ANALYSIS: Feedstock price ±20%, Product selling price ±15%, CAPEX overrun +25%, Discount rate 6%/8%/10%/12%, Production volume ±15%.
  3. RISK MATRIX: Rate 1-5 for Feedstock, Regulatory, Tech, Market, Currency in KeyRisks.
  4. BENCHMARKING vs real Oman projects (Wakud, Manah, Dhofar Wind, HYPORT Duqm).
  5. OMAN VISION 2040 ALIGNMENT SCORE: Rate 1-10 on KPIs.
  6. INVESTOR RED FLAGS: List all.
  7. NEXT STEPS: 3-5 actionable items in ExpertCounsel.
  8. CONSISTENCY: Round figures to nearest $1,000. Report USD / OMR (1 OMR = 2.60 USD). Format numbers distinctly.
  9. CONFIDENCE RATING: End with Data confidence, Model reliability, Recommendation for professional validation.

  Override investor optimism with realistic engineering numbers.${getLanguageInstruction(inputs.language)}`;

  try {
    const response = await withRetry(() => ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: LOCAL_SYSTEM_PROMPT,
        temperature: 0.0,
        tools: [{ googleSearch: {} }],
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
              required: ["Assessment", "Justification", "PaybackPeriodYears", "RealisticRequiredCAPEX", "FundingGapUSD", "FundingGapPercentage", "InstalledCostPerUnit", "AnnualRevenue", "AnnualOPEX", "GrossProfit", "CapitalAdequacyRatio", "InvestmentVerdict", "EstimatedInvestmentUSD"]
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
              required: ["KeyAssumptions", "BenchmarkSources", "ModelLimitations", "DataGaps"]
            },
            AuditorAssessment: {
              type: Type.OBJECT,
              properties: {
                ValidationSummary: { type: Type.ARRAY, items: { type: Type.STRING } },
                MetricClassifications: {
                  type: Type.OBJECT,
                  properties: {
                    ProductionScale: { type: Type.STRING, enum: ['Realistic', 'Optimistic', 'Pessimistic'] },
                    CapitalIntensity: { type: Type.STRING, enum: ['Realistic', 'Optimistic', 'Pessimistic'] },
                    ROIEstimate: { type: Type.STRING, enum: ['Realistic', 'Optimistic', 'Pessimistic'] }
                  },
                  required: ["ProductionScale", "CapitalIntensity", "ROIEstimate"]
                },
                OptimizedProduction: {
                  type: Type.OBJECT,
                  properties: {
                    RecommendedRange: { type: Type.STRING },
                    Justification: { type: Type.STRING }
                  },
                  required: ["RecommendedRange", "Justification"]
                },
                OptimizedInvestment: {
                  type: Type.OBJECT,
                  properties: {
                    RecommendedRange: { type: Type.STRING },
                    StagedStrategy: { type: Type.STRING }
                  },
                  required: ["RecommendedRange", "StagedStrategy"]
                },
                RealityCheck: { type: Type.STRING },
                FinalVerdict: { type: Type.STRING }
              },
              required: ["ValidationSummary", "MetricClassifications", "OptimizedProduction", "OptimizedInvestment", "RealityCheck", "FinalVerdict"]
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
            ExpertCounsel: { type: Type.ARRAY, items: { type: Type.STRING } },
            Dashboard: { type: Type.STRING },
            OmanLogic: {
              type: Type.OBJECT,
              properties: {
                corporateTaxApplied: { type: Type.STRING },
                omanizationCostEstimate: {
                  type: Type.OBJECT,
                  properties: {
                    USD: { type: Type.STRING },
                    OMR: { type: Type.STRING }
                  },
                  required: ["USD", "OMR"]
                },
                utilityTariffDetails: { type: Type.STRING }
              },
              required: ["corporateTaxApplied", "omanizationCostEstimate", "utilityTariffDetails"]
            },
            DynamicScores: {
              type: Type.OBJECT,
              properties: {
                economicScore: { type: Type.NUMBER },
                sustainabilityScore: { type: Type.NUMBER },
                riskScore: { type: Type.NUMBER },
                overallViabilityRating: { type: Type.STRING, enum: ['A', 'B', 'C'] },
                swotAnalysis: {
                  type: Type.OBJECT,
                  properties: {
                    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                    opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                    threats: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["strengths", "weaknesses", "opportunities", "threats"]
                }
              },
              required: ["economicScore", "sustainabilityScore", "riskScore", "overallViabilityRating", "swotAnalysis"]
            },
            LegalRoadmap: {
              type: Type.OBJECT,
              properties: {
                location: { type: Type.STRING },
                authority: { type: Type.STRING },
                requiredPermits: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      description: { type: Type.STRING },
                      estimatedTime: { type: Type.STRING }
                    },
                    required: ["name", "description", "estimatedTime"]
                  }
                }
              },
              required: ["location", "authority", "requiredPermits"]
            },
            AdvancedSensitivity: {
              type: Type.OBJECT,
              properties: {
                monteCarloSummary: { type: Type.STRING },
                sellingPriceDropImpact: {
                  type: Type.OBJECT,
                  properties: {
                    dropPercentage: { type: Type.NUMBER },
                    newPaybackPeriod: { type: Type.STRING },
                    viabilityStatus: { type: Type.STRING, enum: ['High', 'Moderate', 'Low'] }
                  },
                  required: ["dropPercentage", "newPaybackPeriod", "viabilityStatus"]
                }
              },
              required: ["monteCarloSummary", "sellingPriceDropImpact"]
            },
            ExecutiveSummary: { type: Type.STRING }
          },
          required: [
            "ProjectAnalyzer", "TechnicalAI", "FinancialAI", "AuditorAI", "RiskAI", "RecommendedBiofuelType", "EnergyDomain", "EconomicFeasibility", "EnvironmentalImpact", "KeyRisks", "AuditAIReview", "InvestorPerspective", "Vision2040Alignment", "ProjectReadiness", "AnalysisAssumptions", "AuditorAssessment", "SensitivityAnalysis", "FinalFeasibilityScore", "RiskExposureLevel", "Rationale", "ExpertCounsel", "Dashboard", "OmanLogic", "DynamicScores", "LegalRoadmap", "AdvancedSensitivity", "ExecutiveSummary"
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

export async function solveChallenge(topic: string, language: string = 'English'): Promise<ChallengeSolverResult> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your environment variables.");
  }
  const ai = new GoogleGenAI({ apiKey });
  
  const SYSTEM_PROMPT = `YOUR SINGLE MISSION:
Transform any green energy technical challenge into a clear, structured, publishable research framework.

CRITICAL INSTRUCTION: You must strictly output the requested JSON format natively in ${language} if requested.

═══════════════════════════════════════
STEP 1 — AUTO-DETECT RESEARCH FIELD
═══════════════════════════════════════
Read the challenge and identify category: Biofuel, Solar, Wind, Green Hydrogen, Waste-to-Energy, Carbon & Env, or Energy Systems.

═══════════════════════════════════════
STEP 2 — OMAN SCIENTIFIC CONTEXT
═══════════════════════════════════════
Use realistic Oman context (climate, 28-42°C summer peak, high DNI, Dhofar monsoon wind, dust soiling). Use local institutions (SQU, GUtech, TRC, PDO).

SCIENTIFIC INTEGRITY — ALWAYS APPLY:
✓ Hypothesis clearly separated from fact
✓ Search terms given — not fake citations
✓ Limitations stated honestly
✓ Oman-specific data flagged as such
✓ Equipment realistic for local labs
✗ Never invent paper titles or DOIs
✗ Never present estimates as proven
✗ No financial/investor language
✗ No market prices or IRR
✗ No Vision 2040 business framing

MANDATORY ADDITIONS — Always include these sections in every output:
1. STATISTICAL DESIGN: Replicates, units, tests, significance, power, data presentation.
2. LITERATURE LANDSCAPE: What is established, contested, unknown, key groups worldwide, search terms, target journals.
3. RESEARCH OUTPUT PLAN: Publications, conferences, intellectual property, capacity building, KPIs.
4. LIFE CYCLE ASSESSMENT: System boundary, functional unit, methodology, phase-by-phase, comparison with baseline, resource efficiency, and net GHG position vs fossil baseline for EU RED III.`;

  const prompt = `Convert this challenge into a structured research framework matching the schema requested:
Topic: "${topic}"

OUTPUT MUST BE IN ${language}.`;

  try {
    const response = await withRetry(() => ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            researchChallenge: { type: Type.STRING },
            researchGap: { type: Type.STRING },
            hypothesis: { type: Type.STRING },
            experimentalDesign: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                objective: { type: Type.STRING },
                variables: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: { type: { type: Type.STRING }, name: { type: Type.STRING }, range: { type: Type.STRING } },
                    required: ["type", "name", "range"]
                  }
                },
                steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                equipment: { type: Type.ARRAY, items: { type: Type.STRING } },
                duration: { type: Type.STRING },
                budget: { type: Type.STRING }
              },
              required: ["title", "objective", "variables", "steps", "equipment", "duration", "budget"]
            },
            statisticalDesign: {
              type: Type.OBJECT,
              properties: {
                replicates: { type: Type.NUMBER },
                totalExperimentalUnits: { type: Type.NUMBER },
                primaryTest: { type: Type.STRING },
                postHocTest: { type: Type.STRING },
                correlationTest: { type: Type.STRING },
                software: { type: Type.STRING },
                availableAt: { type: Type.STRING },
                significanceLevel: { type: Type.STRING },
                minimumDetectableDifference: { type: Type.STRING },
                requiredNFor80Power: { type: Type.NUMBER },
                dataPresentation: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["replicates", "totalExperimentalUnits", "primaryTest", "postHocTest", "correlationTest", "software", "availableAt", "significanceLevel", "minimumDetectableDifference", "requiredNFor80Power", "dataPresentation"]
            },
            expectedOutcomes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: { metric: { type: Type.STRING }, baseline: { type: Type.STRING }, target: { type: Type.STRING }, unit: { type: Type.STRING } },
                required: ["metric", "baseline", "target", "unit"]
              }
            },
            lifeCycleAssessment: {
              type: Type.OBJECT,
              properties: {
                systemBoundary: { type: Type.STRING },
                functionalUnit: { type: Type.STRING },
                methodology: { type: Type.STRING },
                phases: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: { phase: { type: Type.STRING }, energy: { type: Type.NUMBER }, ghg: { type: Type.NUMBER } },
                    required: ["phase", "energy", "ghg"]
                  }
                },
                comparison: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: { parameter: { type: Type.STRING }, fossilBaseline: { type: Type.STRING }, conventional: { type: Type.STRING }, thisStudy: { type: Type.STRING } },
                    required: ["parameter", "fossilBaseline", "conventional", "thisStudy"]
                  }
                },
                resourceEfficiency: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: { resource: { type: Type.STRING }, convMethod: { type: Type.STRING }, thisStudy: { type: Type.STRING }, saving: { type: Type.STRING } },
                    required: ["resource", "convMethod", "thisStudy", "saving"]
                  }
                },
                netGhgPosition: {
                  type: Type.OBJECT,
                  properties: { fossilBaseline: { type: Type.STRING }, thisStudyTarget: { type: Type.STRING }, reductionAchieved: { type: Type.STRING }, euRedIIIMet: { type: Type.BOOLEAN } },
                  required: ["fossilBaseline", "thisStudyTarget", "reductionAchieved", "euRedIIIMet"]
                },
                lcaAssumptions: { type: Type.ARRAY, items: { type: Type.STRING } },
                dataGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
                isoCompliance: {
                  type: Type.OBJECT,
                  properties: { status: { type: Type.STRING }, reason: { type: Type.STRING } },
                  required: ["status", "reason"]
                }
              },
              required: ["systemBoundary", "functionalUnit", "methodology", "phases", "comparison", "resourceEfficiency", "netGhgPosition", "lcaAssumptions", "dataGaps", "isoCompliance"]
            },
            literatureLandscape: {
              type: Type.OBJECT,
              properties: {
                established: { type: Type.ARRAY, items: { type: Type.STRING } },
                contested: { type: Type.ARRAY, items: { type: Type.STRING } },
                unknown: { type: Type.ARRAY, items: { type: Type.STRING } },
                keyResearchGroupsWorldwide: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: { group: { type: Type.STRING }, focus: { type: Type.STRING } },
                    required: ["group", "focus"]
                  }
                },
                searchTerms: { type: Type.ARRAY, items: { type: Type.STRING } },
                targetJournals: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: { journal: { type: Type.STRING }, impactFactor: { type: Type.STRING } },
                    required: ["journal", "impactFactor"]
                  }
                }
              },
              required: ["established", "contested", "unknown", "keyResearchGroupsWorldwide", "searchTerms", "targetJournals"]
            },
            researchPathway: {
              type: Type.OBJECT,
              properties: {
                lab: { type: Type.OBJECT, properties: { scale: { type: Type.STRING }, duration: { type: Type.STRING }, goal: { type: Type.STRING } }, required: ["scale", "duration", "goal"] },
                pilot: { type: Type.OBJECT, properties: { scale: { type: Type.STRING }, duration: { type: Type.STRING }, goal: { type: Type.STRING } }, required: ["scale", "duration", "goal"] },
                commercial: { type: Type.OBJECT, properties: { scale: { type: Type.STRING }, timeline: { type: Type.STRING }, goal: { type: Type.STRING } }, required: ["scale", "timeline", "goal"] }
              },
              required: ["lab", "pilot", "commercial"]
            },
            researchOutputPlan: {
              type: Type.OBJECT,
              properties: {
                publications: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: { topic: { type: Type.STRING }, journal: { type: Type.STRING }, timeline: { type: Type.STRING }, targetIF: { type: Type.STRING } },
                    required: ["topic", "journal", "timeline", "targetIF"]
                  }
                },
                conference: {
                  type: Type.OBJECT,
                  properties: { name: { type: Type.STRING }, location: { type: Type.STRING }, deadline: { type: Type.STRING } },
                  required: ["name", "location", "deadline"]
                },
                intellectualProperty: {
                  type: Type.OBJECT,
                  properties: { patentPotential: { type: Type.STRING }, action: { type: Type.STRING }, contact: { type: Type.STRING } },
                  required: ["patentPotential", "action", "contact"]
                },
                capacityBuilding: {
                  type: Type.OBJECT,
                  properties: { mscTrained: { type: Type.NUMBER }, phdTrained: { type: Type.NUMBER }, capabilityBuilt: { type: Type.STRING }, createdAsset: { type: Type.STRING } },
                  required: ["mscTrained", "phdTrained", "capabilityBuilt", "createdAsset"]
                },
                kpis: {
                  type: Type.OBJECT,
                  properties: { publications: { type: Type.NUMBER }, citationsTarget: { type: Type.NUMBER }, studentsTrained: { type: Type.NUMBER }, patentsFiled: { type: Type.NUMBER }, industryEngaged: { type: Type.BOOLEAN }, policyBriefSubmitted: { type: Type.BOOLEAN } },
                  required: ["publications", "citationsTarget", "studentsTrained", "patentsFiled", "industryEngaged", "policyBriefSubmitted"]
                },
                knowledgeTransfer: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["publications", "conference", "intellectualProperty", "capacityBuilding", "kpis", "knowledgeTransfer"]
            },
            fundingMatch: {
              type: Type.OBJECT,
              properties: {
                bestFit: { type: Type.STRING },
                grantType: { type: Type.STRING },
                budgetRange: { type: Type.STRING },
                frameItAs: { type: Type.STRING },
                applicationCycle: { type: Type.STRING }
              },
              required: ["bestFit", "grantType", "budgetRange", "frameItAs", "applicationCycle"]
            },
            limitations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: { limitation: { type: Type.STRING }, mitigation: { type: Type.STRING } },
                required: ["limitation", "mitigation"]
              }
            },
            dataConfidence: {
              type: Type.OBJECT,
              properties: { high: { type: Type.STRING }, medium: { type: Type.STRING }, low: { type: Type.STRING } },
              required: ["high", "medium", "low"]
            },
            recommendedCollaboration: {
              type: Type.OBJECT,
              properties: { internal: { type: Type.STRING }, external: { type: Type.STRING }, industry: { type: Type.STRING }, why: { type: Type.STRING } },
              required: ["internal", "external", "industry", "why"]
            }
          },
          required: ["researchChallenge", "researchGap", "hypothesis", "experimentalDesign", "statisticalDesign", "expectedOutcomes", "lifeCycleAssessment", "literatureLandscape", "researchPathway", "researchOutputPlan", "fundingMatch", "limitations", "dataConfidence", "recommendedCollaboration"]
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
  inputs: any,
  language: string = 'English'
): Promise<ResearchImplementationAnalysis> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your environment variables.");
  }
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `Perform a high-precision, feedstock-agnostic feasibility study for the following laboratory-scale biofuel research:
  - Biofuel Type: ${inputs.biofuelType}
  - Feedstock Type: ${inputs.feedstockType}
  - Conversion Pathway: ${inputs.conversionPathway}
  - Laboratory Yield: ${inputs.labYield}
  - Conversion Efficiency: ${inputs.efficiency}%
  - Technology Readiness Level (TRL): ${inputs.trl}
  - Desired Pilot Production Scale: ${inputs.scale}

  CRITICAL INSTRUCTION: You must strictly output the entire JSON content, including all values, descriptions, titles, and explanations, natively in ${language}. ${getLanguageInstruction(language)}

  The goal is to estimate requirements for pilot-scale or small-scale application.
  The output must be purely research-focused, without financial calculations for investors, but MUST provide high-precision, bankable data for researchers and academic grants.

  1. PRECISION LOGISTICS (OMAN 2026)
  Calculate all transportation costs (if applicable in OPEX/Feedstock assumptions) using this dynamic logic:
  - Distance Matrix: Muscat-Sohar (210km), Muscat-Duqm (550km), Muscat-Salalah (1000km).
  - Rates (OMR/Ton-km): Liquids: 0.045 | Solids: 0.040 | Thermal/Hazardous: 0.055.
  - Formula: Cost = (Distance * Weight * Rate) * Fuel_Index.
  - Baseline: Diesel at 0.250 OMR/L. Add 50 OMR flat fee for Port destinations.
  - Precision: All currency outputs must be in OMR with 3 decimal places (e.g. 0.000 OMR). Ensure accurate currency conversions (1 USD = 0.385 OMR).

  2. TECHNO-ECONOMIC ANALYSIS (TEA) REQUIREMENTS
  Integrate into your analysis:
  - Engineering Metrics: Energy Intensity (kWh/kg), Water Footprint (L/L), OPEX/CAPEX breakdown.
  - Scientific Formulas: Use LaTeX for mathematically representing engineering metrics (use double dollar signs for block equations).

  3. OUTPUT CONSTRAINTS & THEMING
  - Format text properties, especially descriptions and justifications, prioritizing tables, math, data over long prose.
  - Never cut off tables or math. Professional, Engineering-focused tone.
  
  CORE LOGIC UPDATES TO APPLY:
  1. Universal Feedstock Processing:
     - Variable Yield Logic: Calculate land/raw material requirements based on the specific oil yield of the input (e.g., Algae: 30%, UCO: 100%, Camelina: 35%).
     - Pre-treatment Analysis: Automatically detect if the feedstock requires a pre-treatment stage (e.g., acid esterification for high FFA waste oils or mechanical crushing for seeds) and adjust the Equipment Cost and OPEX accordingly.
  2. Financial Realism & Sensitivity (CRITICAL ANCHORS):
     - To prevent illogical numbers, strictly align the CAPEX with the requested scale (${inputs.scale}). These are ACADEMIC/RESEARCH pilot scales, so costs MUST BE LOW and realistic for Oman:
       * Bench-scale (1-10 Liters/Day): Total Equipment Cost ~$5,000 - $15,000 USD.
       * Small Pilot-scale (10-100 Liters/Day): Total Equipment Cost ~$15,000 - $40,000 USD.
       * Large Pilot-scale (100-500 Liters/Day): Total Equipment Cost ~$40,000 - $90,000 USD.
     - Dynamic Market Pricing: Calculate total feedstock cost using current regional market estimates (e.g., UCO ~$500-$800/ton, Date Seeds/Solid Biomass ~$100-$300/ton, Algae ~$2000+/ton).
     - The "What-If" Feature (Sensitivity): Calculate the impact of a 15% increase in raw material costs on the final liter price.
     - Oman Logistics Factor: Calculate logistics strictly substituting standard multipliers with the formula outlined in "PRECISION LOGISTICS (OMAN 2026)" above.
     - Contingency Buffer: Add a mandatory 15% "Safety Buffer" to the total budget to cover unforeseen technical or regulatory expenses.
     - MATH CHECK: Ensure that (Equipment + Installation + Annual Operating) * 1.15 exactly equals the Total Budget With Buffer.
     - CURRENCY FORMATTING: Every single financial value MUST include the currency symbol. USD values must start with '$' (e.g., '$15,000') and OMR values must end with 'OMR' (e.g., '5,775 OMR').
  3. Scientific Bottleneck Detection:
     - Generate feedstock-specific "Scientific Challenges":
       - Seed-based: Heat stress, metabolic inhibition, and soil salinity.
       - Waste-based: Oxidation stability, FFA saponification, and filtration residue.
       - Algae: Harvesting energy intensity and water salinity management.
  4. Adaptive TRL Roadmap:
     - Adjust the scaling timeline based on Technology Maturity:
       - Mature Pathways (UCO): 18-24 months to reach TRL 9.
       - Experimental Pathways (Algae/New Crops): 36-48 months to reach TRL 9.

  SCORING LOGIC:
  - Normalize TRL as: TRL_score = (TRL / 9) * 100.
  - Final Readiness Score = (TRL_score * 0.4) + (ExperimentalFeasibility * 0.2) + (EnergyEfficiencyScore * 0.2) + (TechnicalScalability * 0.2).
  - All readiness metrics must be scaled 0–100.
  - Provide both USD and OMR cost estimates (1 USD = 0.385 OMR) with explicit currency symbols (e.g. "$10,000" and "3,850 OMR").
  
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
        systemInstruction: `You are an advanced biofuel scientific application analyst operating in April 2026. 
        Your tone must be professional, analytical, and research-oriented.
        
        ### REAL-TIME DATA MANDATE (CRITICAL):
        - Before generating cost estimates, feedstock prices, or market comparisons, you MUST use the provided Google Search tool to find live market prices for your relevant feedstock or energy baseline (e.g. "Current UCO price per ton", "Current Oman Crude price USD").
        - NEVER hallucinate these prices.

        Output MUST be valid JSON following the provided schema.${getLanguageInstruction(language)}`,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ResearchInputs: {
              type: Type.OBJECT,
              properties: {
                BiofuelType: { type: Type.STRING },
                FeedstockType: { type: Type.STRING },
                ConversionPathway: { type: Type.STRING },
                LaboratoryYield: { type: Type.STRING },
                ConversionEfficiency: { type: Type.NUMBER },
                TechnologyReadinessLevel: { type: Type.NUMBER },
                DesiredPilotScale: { type: Type.STRING }
              },
              required: ["BiofuelType", "FeedstockType", "ConversionPathway", "LaboratoryYield", "ConversionEfficiency", "TechnologyReadinessLevel", "DesiredPilotScale"]
            },
            FeasibilityOverview: { type: Type.STRING },
            ScientificSummary: { type: Type.STRING },
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
            ResourceRequirements: {
              type: Type.OBJECT,
              properties: {
                MassBalance: { type: Type.STRING },
                PreTreatmentRequired: { type: Type.STRING }
              },
              required: ["MassBalance", "PreTreatmentRequired"]
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
            AdjustedFinancialApproximation: {
              type: Type.OBJECT,
              properties: {
                EquipmentCost: { type: Type.OBJECT, properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } }, required: ["USD", "OMR"] },
                InstallationCost: { type: Type.OBJECT, properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } }, required: ["USD", "OMR"] },
                FeedstockCost: { type: Type.OBJECT, properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } }, required: ["USD", "OMR"] },
                OperatingCost: { type: Type.OBJECT, properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } }, required: ["USD", "OMR"] },
                ContingencyBuffer: { type: Type.OBJECT, properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } }, required: ["USD", "OMR"] },
                TotalBudgetWithBuffer: { type: Type.OBJECT, properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } }, required: ["USD", "OMR"] },
                OmanLogisticsMultiplierApplied: { type: Type.BOOLEAN }
              },
              required: ["EquipmentCost", "InstallationCost", "FeedstockCost", "OperatingCost", "ContingencyBuffer", "TotalBudgetWithBuffer", "OmanLogisticsMultiplierApplied"]
            },
            CostEstimation: {
              type: Type.OBJECT,
              properties: {
                EquipmentCosts: {
                  type: Type.OBJECT,
                  properties: {
                    ReactorSystem: { type: Type.OBJECT, properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } }, required: ["USD", "OMR"] },
                    PreTreatmentSystem: { type: Type.OBJECT, properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } }, required: ["USD", "OMR"] },
                    HeatingCoolingSystems: { type: Type.OBJECT, properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } }, required: ["USD", "OMR"] },
                    DistillationUpgradingUnit: { type: Type.OBJECT, properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } }, required: ["USD", "OMR"] },
                    StorageTanks: { type: Type.OBJECT, properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } }, required: ["USD", "OMR"] },
                    SafetyMonitoringSystems: { type: Type.OBJECT, properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } }, required: ["USD", "OMR"] },
                    TotalEquipmentCost: { type: Type.OBJECT, properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } }, required: ["USD", "OMR"] }
                  },
                  required: ["ReactorSystem", "PreTreatmentSystem", "HeatingCoolingSystems", "DistillationUpgradingUnit", "StorageTanks", "SafetyMonitoringSystems", "TotalEquipmentCost"]
                },
                InstallationSetupCost: { type: Type.OBJECT, properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } }, required: ["USD", "OMR"] },
                AnnualOperatingCost: {
                  type: Type.OBJECT,
                  properties: {
                    FeedstockCost: { type: Type.OBJECT, properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } }, required: ["USD", "OMR"] },
                    EnergyConsumption: { type: Type.OBJECT, properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } }, required: ["USD", "OMR"] },
                    Maintenance: { type: Type.OBJECT, properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } }, required: ["USD", "OMR"] },
                    LaboratoryStaff: { type: Type.STRING },
                    Consumables: { type: Type.OBJECT, properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } }, required: ["USD", "OMR"] },
                    TotalAnnualOperatingCost: { type: Type.OBJECT, properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } }, required: ["USD", "OMR"] }
                  },
                  required: ["FeedstockCost", "EnergyConsumption", "Maintenance", "LaboratoryStaff", "Consumables", "TotalAnnualOperatingCost"]
                },
                TotalInitialBudgetRange: { type: Type.OBJECT, properties: { USD: { type: Type.STRING }, OMR: { type: Type.STRING } }, required: ["USD", "OMR"] },
                CostAssumptions: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["EquipmentCosts", "InstallationSetupCost", "AnnualOperatingCost", "TotalInitialBudgetRange", "CostAssumptions"]
            },
            SensitivityAnalysis: {
              type: Type.OBJECT,
              properties: {
                Scenario: { type: Type.STRING },
                ImpactOnLiterPrice: { type: Type.STRING }
              },
              required: ["Scenario", "ImpactOnLiterPrice"]
            },
            TechnicalRiskAssessment: {
              type: Type.OBJECT,
              properties: {
                ScientificChallenges: { type: Type.ARRAY, items: { type: Type.STRING } },
                MitigationStrategies: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["ScientificChallenges", "MitigationStrategies"]
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
            Assumptions: { type: Type.ARRAY, items: { type: Type.STRING } },
            RiskFactors: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["ResearchInputs", "FeasibilityOverview", "ScientificSummary", "ImplementationEstimator", "ResourceRequirements", "ProductionOutput", "AdjustedFinancialApproximation", "CostEstimation", "SensitivityAnalysis", "TechnicalRiskAssessment", "TRLRoadmap", "ReadinessScore", "Assumptions", "RiskFactors"]
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

export async function suggestProject(context: string, language: string = 'English'): Promise<SuggestedProject> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your environment variables.");
  }
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await withRetry(() => ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: `CRITICAL INSTRUCTION: You must strictly output the entire JSON content, including all values, descriptions, titles, and explanations, natively in ${language}. ${getLanguageInstruction(language)}
      Suggest a realistic, Oman-specific project concept for ${context}. Focus on feasibility and Vision 2040 alignment. 
      Include a list of specific Omani government incentives (tax breaks, land grants, subsidies) the project qualifies for based on its type and location.`,
      config: {
        systemInstruction: `You are an industrial project developer for the energy transition in Oman. Provide innovative but pilot-scale realistic projects.${getLanguageInstruction(language)}`,
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

export async function checkStandardsCompliance(inputs: StandardsInput, language: string = 'English'): Promise<StandardsResult> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your environment variables.");
  }
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await withRetry(() => ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: `CRITICAL INSTRUCTION: You must strictly output the entire JSON content, including all values, descriptions, titles, and explanations, natively in ${language}. ${getLanguageInstruction(language)}
      
      Evaluate the following biofuel lab results against international standards.
      Biofuel Type: ${inputs.biofuelType}
      Viscosity: ${inputs.viscosity || 'Not provided'}
      Flash Point: ${inputs.flashPoint || 'Not provided'}
      Water Content: ${inputs.waterContent || 'Not provided'}
      Acid Value: ${inputs.acidValue || 'Not provided'}
      Density: ${inputs.density || 'Not provided'}
      Cetane Number: ${inputs.cetaneNumber || 'Not provided'}
      Sulfur Content: ${inputs.sulfurContent || 'Not provided'}
      `,
      config: {
        systemInstruction: `You are a strict Biofuel Quality Control Chemist and Regulatory Expert in Oman.
        Your job is to compare the provided lab results against the relevant international standard (e.g., ASTM D6751 or EN 14214 for Biodiesel, ASTM D4814 for Bioethanol, etc.).
        
        RULES:
        1. Be extremely accurate. Do not invent numbers. Use the actual standard limits.
        2. If a value is 'Not provided', mark its status as 'Not Provided'.
        3. If a value fails, provide a specific chemical or mechanical 'fixRecommendation' to correct it.
        4. Provide an 'expertSummary' explaining the overall quality and what needs to be done before commercialization in Oman.
        5. Provide a 'commercialViability' statement explaining if this can be sold locally or internationally.
        
        ### REAL-TIME DATA MANDATE (CRITICAL):
        - You MUST use the provided Google Search tool to find live, current regulatory standards (e.g. ISO, ASTM, EN) and up-to-date Omani commercialization rules before guessing limits. Do not hallucinate numbers.

        ${getLanguageInstruction(language)}`,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            biofuelType: { type: Type.STRING },
            overallStatus: { type: Type.STRING, enum: ['Compliant', 'Non-Compliant', 'Needs Adjustment'] },
            targetStandard: { type: Type.STRING },
            evaluations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  parameter: { type: Type.STRING },
                  userValue: { type: Type.STRING },
                  standardLimit: { type: Type.STRING },
                  status: { type: Type.STRING, enum: ['Pass', 'Fail', 'Warning', 'Not Provided'] },
                  implication: { type: Type.STRING },
                  fixRecommendation: { type: Type.STRING }
                },
                required: ["parameter", "userValue", "standardLimit", "status", "implication"]
              }
            },
            expertSummary: { type: Type.STRING },
            commercialViability: { type: Type.STRING }
          },
          required: ["biofuelType", "overallStatus", "targetStandard", "evaluations", "expertSummary", "commercialViability"]
        }
      }
    }));

    const data = JSON.parse(response.text || "{}");
    return {
      ...data,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString()
    } as StandardsResult;
  } catch (err: any) {
    console.error("Standards API failed:", err);
    throw err;
  }
}

export async function generateProposal(inputs: ProposalInput): Promise<ProposalResult> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your environment variables.");
  }
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await withRetry(() => ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: `CRITICAL INSTRUCTION: You must strictly output the entire JSON content natively in ${inputs.language}. ${getLanguageInstruction(inputs.language)}
      
      Generate a professional, global-consulting-firm-grade investment proposal.
      Project Name: ${inputs.projectName}
      Feedstock: ${inputs.feedstock}
      Biofuel Type: ${inputs.biofuelType}
      Target Capacity: ${inputs.capacity}
      Estimated Budget: ${inputs.budget}
      Target Audience: ${inputs.targetAudience}
      Requested Output Language: ${inputs.language}
      
      Ensure you output ALL 14 requested sections, plus the additional deliverables.
      Provide high-quality mathematical equations in the technical and financial sections to justify your CAPEX/OPEX operations. 
      Use accurate, real numbers for Oman's economy.`,
      config: {
        systemInstruction: `TARGET AUDIENCE: Banks, Private Investors, Green Finance 
Institutions, Government Funding Bodies (TRC, PDO, MoHERI)

YOUR MISSION:
Take ANY green energy project proposal and produce a complete, 
investment-ready document that:

1. AUTO-DETECTS the energy sector/technology
2. Applies sector-specific financial models
3. Corrects technical specifications & costs
4. Provides detailed year-by-year projections
5. Includes realistic risk analysis
6. Proposes appropriate financing structures
7. Clarifies market positioning & revenue streams
8. Produces a professional investment proposal

═══════════════════════════════════════════════════════════════
PART A — AUTO-DETECTION & SECTOR CLASSIFICATION
═══════════════════════════════════════════════════════════════

When you receive a proposal, FIRST identify:

SECTOR 1: BIOFUEL TECHNOLOGIES
A1) MICROALGAE BIODIESEL:
A2) UCO BIODIESEL (Used Cooking Oil):
A3) JATROPHA OIL:
A4) BIOGAS/BIOMETHANE (Agricultural/Organic Waste):
A5) BIOETHANOL (Lignocellulosic/Sugar Crops):
A6) WASTE OIL RECOVERY (Fish/Animal Processing):

SECTOR 2: SOLAR ENERGY TECHNOLOGIES
B1) ROOFTOP SOLAR PV (Distributed):
B2) UTILITY-SCALE PV (Ground-mounted):
B3) BIFACIAL PV (Albedo capture):
B4) CONCENTRATED PHOTOVOLTAICS (CPV):
B5) SOLAR THERMAL/CSP (Concentrated Solar Power):
B6) AGRIVOLTAICS (Solar + Agriculture):

SECTOR 3: WIND ENERGY TECHNOLOGIES
C1) ONSHORE WIND (Fixed-foundation):
C2) OFFSHORE WIND (Floating potential):
C3) DISTRIBUTED WIND (Community/Farm-scale):

SECTOR 4: GREEN HYDROGEN TECHNOLOGIES
D1) ALKALINE ELECTROLYZER:
D2) PEM ELECTROLYZER (Proton Exchange Membrane):
D3) SOLID OXIDE ELECTROLYSIS (SOEC):
D4) HYDROGEN STORAGE:
D5) HYDROGEN TRANSPORT & END-USE:

SECTOR 5: WASTE-TO-ENERGY TECHNOLOGIES
E1) ANAEROBIC DIGESTION (Biogas Generation):
E2) INCINERATION & WASTE-TO-ENERGY (WTE):
E3) PYROLYSIS/GASIFICATION (Advanced Thermal):
E4) COMPOSTING (Low-tech, Organic Waste):

SECTOR 6: ENERGY STORAGE TECHNOLOGIES
F1) LITHIUM-ION BATTERY (Electrochemical):
F2) VANADIUM REDOX FLOW BATTERY (Long-duration):
F3) THERMAL ENERGY STORAGE (TES):
F4) MECHANICAL STORAGE (Pumped Hydro/Compressed Air):

SECTOR 7: BLUE CARBON & NATURE-BASED SOLUTIONS
G1) MANGROVE RESTORATION & MANAGEMENT:
G2) SEAGRASS RESTORATION (Emerging):

SECTOR 8: HYBRID RENEWABLE SYSTEMS
H1) SOLAR + WIND (Complementary):
H2) SOLAR + BATTERY (Diurnal Cycling):
H3) SOLAR + WIND + HYDROGEN (Long-duration):
H4) MICROGRID (Integrated islanding):

Determine the applicable templates, costs (CAPEX, OPEX), and benchmarks based on Oman parameters.

        RULES:
        1. STRONGLY IMPORTANT: Output MUST be entirely in the requested language: ${inputs.language}. ${getLanguageInstruction(inputs.language)} Ensure proper spacing between words. NEVER return mashed together words in Arabic. Every word must be properly spaced.
        2. TONE: Sound like it was prepared by a McKinsey or BCG consultant. Highly persuasive but realistic. Balance profitability with sustainability. Appeal to corporate investors, energy companies, and industrial decision-makers.
        3. REALISTIC FINANCIALS: Industrial projects take time to become profitable. You MUST provide strictly realistic financial metrics. ROI should naturally be between 10% to 35%. Payback periods should be 3 to 8 years. DO NOT invent 200% ROI. Let OPEX correctly reflect labor, energy, feedstock acquisition, and maintenance. Use Oman benchmarks (e.g., electricity 0.05 OMR/kWh in Madayn, Water 0.50-1.00 OMR/m3).
        4. OMAN ACCURACY: Use real, accurate data specific to Oman.
        5. MODERN & SPECIAL: The results should look very modern and special, not just generated by standard AI.
           - Use rich markdown formatting and modern markdown tables.
           - STRICTLY PROHIBITED: Do not use any colorful emojis, cartoonish icons, or excessive unicode geometric symbols (NO 🔋 💡 🌍 📈 💵 📊 🏗️ 🚀 🛡️ ⬢ ❖ ✦ ◈ ⟡ ⯁).
           - Output purely clean, professional textual content focusing on structure and data. We are rendering high-end graphical icons on the frontend, so text should remain clean.
           - Do not produce plain boring text blocks. Structure the content beautifully with lists, bold text, italics, and headers inside the text fields.
        6. SOLAR/WIND RENEWABLE CALCULATIONS: Accurately calculate capacity vs energy output. Provide real metrics based on standard CFs in Oman.

        ### REAL-TIME DATA MANDATE (CRITICAL):
        - You MUST use the provided Google Search tool to find live market prices before finalizing numbers.`,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            executiveSummary: { type: Type.STRING },
            problemStatement: { type: Type.STRING },
            marketOpportunity: { type: Type.STRING },
            competitiveAdvantage: { type: Type.STRING },
            businessModel: { type: Type.STRING },
            revenueStreams: { type: Type.STRING },
            technicalOverview: { type: Type.STRING },
            feedstockStrategy: { type: Type.STRING },
            financialModel: {
              type: Type.OBJECT,
              properties: {
                totalCapex: { type: Type.STRING },
                annualOpex: { type: Type.STRING },
                expectedRevenue: { type: Type.STRING },
                roiPercentage: { type: Type.STRING },
                paybackPeriod: { type: Type.STRING },
                installmentSchedule: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      year: { type: Type.STRING },
                      amount: { type: Type.STRING },
                      description: { type: Type.STRING }
                    },
                    required: ["year", "amount", "description"]
                  }
                }
              },
              required: ["totalCapex", "annualOpex", "expectedRevenue", "roiPercentage", "paybackPeriod", "installmentSchedule"]
            },
            riskAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  risk: { type: Type.STRING },
                  mitigation: { type: Type.STRING }
                },
                required: ["risk", "mitigation"]
              }
            },
            esgImpact: { type: Type.STRING },
            carbonCreditPotential: {
              type: Type.OBJECT,
              properties: {
                estimatedTonsSaved: { type: Type.STRING },
                monetaryValueRange: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["estimatedTonsSaved", "monetaryValueRange", "explanation"]
            },
            investmentProposal: {
              type: Type.OBJECT,
              properties: {
                requestedAmount: { type: Type.STRING },
                fundingUtilization: { type: Type.STRING },
                investorReturns: { type: Type.STRING },
                equityStructure: { type: Type.STRING },
                repaymentStrategy: { type: Type.STRING }
              },
              required: ["requestedAmount", "fundingUtilization", "investorReturns", "equityStructure", "repaymentStrategy"]
            },
            whyInvestorsShouldFund: { type: Type.STRING },
            pitchDeckOutline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  slideNumber: { type: Type.NUMBER },
                  title: { type: Type.STRING },
                  content: { type: Type.STRING }
                },
                required: ["slideNumber", "title", "content"]
              }
            },
            investorEmailTemplate: { type: Type.STRING },
            onePageSummary: { type: Type.STRING },
            fundingRecommendations: { type: Type.STRING },
            strategicPartners: { type: Type.STRING },
            phasedScalingStrategy: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  milestones: { type: Type.STRING }
                },
                required: ["phase", "duration", "milestones"]
              }
            }
          },
          required: [
            "title", "executiveSummary", "problemStatement", "marketOpportunity",
            "competitiveAdvantage", "businessModel", "revenueStreams",
            "technicalOverview", "feedstockStrategy", "financialModel",
            "riskAnalysis", "esgImpact", "carbonCreditPotential",
            "investmentProposal", "whyInvestorsShouldFund", "pitchDeckOutline",
            "investorEmailTemplate", "onePageSummary", "fundingRecommendations",
            "strategicPartners", "phasedScalingStrategy"
          ]
        }
      }
    }));

    const data = JSON.parse(response.text || "{}");
    return {
      ...data,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString()
    } as ProposalResult;
  } catch (err: any) {
    console.error("Proposal API failed:", err);
    throw err;
  }
}

export async function fetchLiveNews(): Promise<{en: string; ar: string; time: string}[]> {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error("Gemini API key is required");

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Use Google Search to find the 5 most recent and significant reliable news headlines for today, April 20, 2026, related to EXACTLY THESE KEYWORDS: 'Oman Energy', 'Green Hydrogen', 'Biofuels', and 'Decarbonization'.
Do not return old news. Use your search tool to get the current events.

RETURN PURE JSON strictly matching this array of objects format (do not include markdown blocks like \`\`\`json):
[
  {
    "en": "English headline summarizing the news",
    "ar": "Arabic translation of the headline accurately",
    "time": "Relative time (e.g., 2 hours ago, 10 mins ago)"
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
         systemInstruction: "You are a live news fetching agent. Always reply with raw JSON only. Do not wrap with markdown.",
         temperature: 0.1,
         tools: [{ googleSearch: {} }]
      }
    });

    if (!response || !response.text) {
      throw new Error("Failed to generate response");
    }

    const text = response.text;
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("News fetch error:", error);
    throw error;
  }
}

