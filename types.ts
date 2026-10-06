
export interface ProjectAnalyzer {
  ProjectName: string;
  Location: string;
  TechnologyCategory: 'Biofuel' | 'Renewable Energy';
  Feedstock: string; // Used as Energy Type for Renewable
  ExpectedProduction: number | null;
  PreliminaryBudgetUSD: number | null;
  SellingPriceUSD: number | null;
  ElectricityCostUSDkWh?: number | null;
  LaborCostPerYearUSD?: number | null;
  CO2Source?: string;
}

export interface EconomicFeasibility {
  Assessment: string;
  Justification: string;
  PaybackPeriodYears: number;
  PaybackFormatted?: string;
  isOperatingDeficit?: boolean;
  breakEvenPrice?: number;
  RealisticRequiredCAPEX: number;
  FundingGapUSD: number;
  FundingGapPercentage: number;
  InstalledCostPerUnit: number; // Generalized from PerKg
  AnnualRevenue: number;
  AnnualOPEX: number;
  GrossProfit: number;
  CapitalAdequacyRatio: number;
  InvestmentVerdict: 'Not Bankable' | 'Not Bankable / High Commercial Risk' | 'Conditionally Viable' | 'Investment Grade';
  EstimatedInvestmentUSD: {
    Minimum: number;
    Maximum: number;
    MajorCosts: string[];
  };
}

export interface SensitivityDataPoint {
  label: string;
  payback: number | null;
  irr: number;
  ebitdaK?: number;
}

export interface SensitivityStressTest {
  PaybackPeriod: number;
  RiskLevel: string;
  PaybackFormatted?: string;
  EBITDA?: number;
  EBITDADelta?: number;
}

export interface SensitivityAnalysis {
  PriceDrop10: SensitivityStressTest;
  OPEXIncrease15: SensitivityStressTest;
  ProductionDrop10: SensitivityStressTest;
  DataPoints: SensitivityDataPoint[];
  BreakEvenSellingPriceUSD?: number;
  BreakEvenUnit?: string;
  IsOperatingDeficit?: boolean;
}

export interface EnvironmentalImpact {
  CarbonEmissions_kgCO2_per_liter: number;
  WaterUsage_liters_per_liter: number;
  LandUse_ha_per_ton_biofuel: number;
  CarbonCapturePotential_kgCO2_per_year: number;
  WasteManagementRecommendations: string[];
}

export interface KeyRisk {
  Type: 'Technical' | 'Financial' | 'Regulatory' | 'Market';
  Description: string;
  Mitigation: string;
}

export interface ReconciliationAuditCheck {
  id: string;
  name: string;
  category: 'INPUT_FIDELITY' | 'MATHEMATICAL_IDENTITY' | 'OMAN_BENCHMARK' | 'CROSS_MODULE_ALIGNMENT';
  status: 'PASSED' | 'ADVISORY' | 'FLAGGED';
  formula: string;
  evaluatedValues: string;
  message: string;
}

export interface AuditAIReview {
  ConsistencyCheck: string;
  DataWarnings: string[];
  SuggestedCorrections: string[];
  VerificationStatus?: 'PASSED_ZERO_ERRORS' | 'PASSED_WITH_ADVISORY' | 'FLAGGED';
  AuditScore?: number;
  AuditTimestamp?: string;
  AuditorEngine?: string;
  ReconciliationChecks?: ReconciliationAuditCheck[];
  EntriesEchoSummary?: {
    projectName: string;
    location: string;
    category: string;
    feedstock: string;
    production: string;
    capacity?: string;
    budget: string;
    sellingPrice: string;
    electricityCost?: string;
    laborCost?: string;
  };
}

export interface InvestorPerspective {
  ReturnPotential: string;
  CapitalIntensity: string;
  RiskExposure: string;
  ScalabilityRating: string;
  MarketDemandAnalysis: string;
}

export interface Vision2040Alignment {
  SustainabilityImpact: string;
  DiversificationContribution: string;
  IndustrialDevelopment: string;
  InnovationScore: number;
}

export interface AnalysisAssumptions {
  KeyAssumptions: string[];
  BenchmarkSources: string[];
  ModelLimitations: string[];
  DataGaps: string[];
}

export interface AuditorAssessment {
  ValidationSummary: string[];
  MetricClassifications: {
    ProductionScale: 'Conservative' | 'Realistic' | 'Optimistic / High Risk';
    CapitalIntensity: 'Conservative' | 'Realistic' | 'Optimistic / High Risk';
    ROIEstimate: 'Conservative' | 'Realistic' | 'Optimistic / High Risk';
  };
  OptimizedProduction: {
    RecommendedRange: string;
    Justification: string;
  };
  OptimizedInvestment: {
    RecommendedRange: string;
    StagedStrategy: string;
  };
  RealityCheck: string;
  FinalVerdict: string;
}

export interface ResearchInputParameters {
  BiofuelType: 'Bioethanol' | 'Biodiesel' | 'Biogas' | 'Biobutanol';
  FeedstockType: string;
  ConversionPathway: 'Biochemical' | 'Thermochemical' | 'Hybrid';
  LaboratoryYield: string;
  ConversionEfficiency: number;
  TechnologyReadinessLevel: number;
  DesiredPilotScale: string;
}

export interface ResearchImplementationReadinessScore {
  TechnicalScalability: number;
  ExperimentalFeasibility: number;
  SafetyEnvironmental: number;
  ReadinessForSmallScale: number;
  OverallScore: number;
}

export interface CostItem {
  USD: string;
  OMR: string;
}

export interface TRLRoadmapStep {
  trl: number;
  title: string;
  description: string;
  estimatedDuration: string;
  keyMilestones: string[];
}

export interface ImplementationEstimator {
  FeedstockRequirements: string;
  EquipmentSetup: string[];
  EnergyUtilities: string;
  WasteManagement: string;
  EfficiencyAdjustments: string;
}

export interface ProductionOutputEstimation {
  AnnualFuelOutput: string;
  EnergyOutput: string;
  ByProductValueEstimation: string;
  CarbonReductionPotential: string;
}

export interface PilotScaleCostEstimation {
  EquipmentCosts: {
    ReactorSystem: CostItem;
    PreTreatmentSystem: CostItem;
    HeatingCoolingSystems: CostItem;
    DistillationUpgradingUnit: CostItem;
    StorageTanks: CostItem;
    SafetyMonitoringSystems: CostItem;
    TotalEquipmentCost: CostItem;
  };
  InstallationSetupCost: CostItem;
  AnnualOperatingCost: {
    FeedstockCost: CostItem;
    EnergyConsumption: CostItem;
    Maintenance: CostItem;
    LaboratoryStaff: string;
    Consumables: CostItem;
    TotalAnnualOperatingCost: CostItem;
  };
  TotalInitialBudgetRange: {
    USD: string;
    OMR: string;
  };
  CostAssumptions: string[];
}

export interface ResourceRequirements {
  MassBalance: string;
  PreTreatmentRequired: string;
}

export interface AdjustedFinancialApproximation {
  EquipmentCost: CostItem;
  InstallationCost: CostItem;
  FeedstockCost: CostItem;
  OperatingCost: CostItem;
  ContingencyBuffer: CostItem;
  TotalBudgetWithBuffer: CostItem;
  OmanLogisticsMultiplierApplied: boolean;
}

export interface ResearchSensitivityAnalysis {
  Scenario: string;
  ImpactOnLiterPrice: string;
}

export interface TechnicalRiskAssessment {
  ScientificChallenges: string[];
  MitigationStrategies: string[];
}

export interface ResearchImplementationAnalysis {
  id: string;
  timestamp: string;
  ResearchInputs: ResearchInputParameters;
  FeasibilityOverview: string;
  ImplementationEstimator: ImplementationEstimator;
  ResourceRequirements: ResourceRequirements;
  ProductionOutput: ProductionOutputEstimation;
  AdjustedFinancialApproximation: AdjustedFinancialApproximation;
  CostEstimation: PilotScaleCostEstimation;
  SensitivityAnalysis: ResearchSensitivityAnalysis;
  TechnicalRiskAssessment: TechnicalRiskAssessment;
  TRLRoadmap: TRLRoadmapStep[];
  ReadinessScore: ResearchImplementationReadinessScore;
  ScientificSummary: string;
  Assumptions: string[];
  RiskFactors: string[];
}

export interface TechnicalEngineeringAI {
  InstalledCapacity: string;
  EnergyOutput: string;
  BenchmarkCAPEXRange: string;
  TRLEstimate: number;
  CapacityFactor?: string;
  PeakSunHoursPerDay?: string;
}

export interface FinancialModelingAI {
  RealisticCAPEX: number;
  OPEX: number;
  Revenue: number;
  GrossProfit: number;
  PaybackYears: number;
  IRR_Simplified: string;
  LCOE_or_CostPerTon: string;
  EquityIRR?: string;
  ProjectIRR?: string;
  EquityPaybackYears?: number;
  ProjectLifespanYears?: number;
  MaintenanceCostUSD?: number;
  InsuranceCostUSD?: number;
}

export interface InvestmentCommitteeAuditor {
  RecalculatedInstalledCost: number;
  BenchmarkComparison: string;
  UnderfundingDetected: boolean;
  UnrealisticPaybackFlag: boolean;
  StressTestResults: {
    RevenueMinus10: string;
    OPEXPlus15: string;
    ProductionMinus10: string;
  };
  Classification: 'Pass' | 'Needs Revision' | 'Critical Financial Issue';
  FundingGapUSD: number;
  FundingGapPercentage: number;
}

export interface RiskAssessmentAI {
  CapitalAdequacyRatio: number;
  TRL: number;
  FeedstockStability: string;
  MarketVolatility: string;
  RegulatoryRisk: string;
  RiskClassification: 'Moderate' | 'Significant' | 'Critical';
}

export interface ChallengeSolverResult {
  researchChallenge: string;
  researchGap: string;
  hypothesis: string;
  experimentalDesign: {
    title: string;
    objective: string;
    variables: { type: string; name: string; range: string }[];
    steps: string[];
    equipment: string[];
    duration: string;
    budget: string;
  };
  statisticalDesign: {
    replicates: number;
    totalExperimentalUnits: number;
    primaryTest: string;
    postHocTest: string;
    correlationTest: string;
    software: string;
    availableAt: string;
    significanceLevel: string;
    minimumDetectableDifference: string;
    requiredNFor80Power: number;
    dataPresentation: string[];
  };
  expectedOutcomes: { metric: string; baseline: string; target: string; unit: string }[];
  lifeCycleAssessment: {
    systemBoundary: string;
    functionalUnit: string;
    methodology: string;
    phases: { phase: string; energy: number; ghg: number }[];
    comparison: { parameter: string; fossilBaseline: string; conventional: string; thisStudy: string }[];
    resourceEfficiency: { resource: string; convMethod: string; thisStudy: string; saving: string }[];
    netGhgPosition: { fossilBaseline: string; thisStudyTarget: string; reductionAchieved: string; euRedIIIMet: boolean };
    lcaAssumptions: string[];
    dataGaps: string[];
    isoCompliance: { status: string; reason: string };
  };
  literatureLandscape: {
    established: string[];
    contested: string[];
    unknown: string[];
    keyResearchGroupsWorldwide: { group: string; focus: string }[];
    searchTerms: string[];
    targetJournals: { journal: string; impactFactor: string }[];
  };
  researchPathway: {
    lab: { scale: string; duration: string; goal: string };
    pilot: { scale: string; duration: string; goal: string };
    commercial: { scale: string; timeline: string; goal: string };
  };
  researchOutputPlan: {
    publications: { topic: string; journal: string; timeline: string; targetIF: string }[];
    conference: { name: string; location: string; deadline: string };
    intellectualProperty: { patentPotential: string; action: string; contact: string };
    capacityBuilding: { mscTrained: number; phdTrained: number; capabilityBuilt: string; createdAsset: string };
    kpis: { publications: number; citationsTarget: number; studentsTrained: number; patentsFiled: number; industryEngaged: boolean; policyBriefSubmitted: boolean };
    knowledgeTransfer: string[];
  };
  fundingMatch: {
    bestFit: string;
    grantType: string;
    budgetRange: string;
    frameItAs: string;
    applicationCycle: string;
  };
  limitations: { limitation: string; mitigation: string }[];
  dataConfidence: { high: string; medium: string; low: string };
  recommendedCollaboration: { internal: string; external: string; industry: string; why: string };
}

export interface ChallengeHistoryEntry {
  id: string;
  topic: string;
  timestamp: string;
  fullData: ChallengeSolverResult | MultiAgentChallengeResult;
}

export interface OptimizerResult {
  projectOverview: {
    tagline: string;
    description: string;
  };
  revenueStack: {
    sources: { name: string; amount: number; confidence: 'HIGH' | 'MEDIUM' | 'LOW' }[];
    baseCaseTarget: number;
    upsideCaseTarget: number;
  };
  carbonPerformance: {
    intensityBefore: string;
    intensityAfter: string;
    co2SavedPerYear: number;
    reductionPercentage: number;
    euRedIIIFlag: boolean;
    carbonCreditValue: string;
  };
  financialSnapshot: {
    capex: number;
    budget: number;
    fundingGap: number;
    annualProfit: number;
    irr: number;
    paybackYears: number;
    npv: number;
  };
  topOpportunities: { title: string; value: string; action: string }[];
  topRisks: { title: string; probability: 'High' | 'Medium' | 'Low' | 'HIGH' | 'MEDIUM' | 'LOW'; mitigation: string }[];
  smartVerdict: {
    profitScore: number;
    carbonScore: number;
    omanAlignmentScore: number;
    overallScore: number;
    decision: string;
    comparison: string;
  };
  optimizationRoadmap: { year: number | string; action: string; cost: string; impact: string }[];
  nextSteps: { urgentAction: string; cost: string; timeline: string }[];
  dataTransparency: { dataPoint: string; source: string; confidence: 'HIGH' | 'MEDIUM' | 'LOW' }[];
}

export interface OptimizerHistoryEntry {
  id: string;
  projectName: string;
  timestamp: string;
  fullData: OptimizerResult;
}

export type ProjectType = 'FEASIBILITY' | 'CHALLENGE' | 'OPTIMIZER' | 'RESEARCH';

export interface UnifiedProject {
  id: string;
  name: string;
  type: ProjectType;
  inputs: any;
  outputs: any;
  score?: number;
  carbonIntensity?: string;
  createdAt: string;
}

export interface OmanLegalRoadmap {
  location: string;
  authority: string;
  requiredPermits: {
    name: string;
    description: string;
    estimatedTime: string;
  }[];
}

export interface AdvancedSensitivityAnalysis {
  monteCarloSummary: string;
  sellingPriceDropImpact: {
    dropPercentage: number;
    newPaybackPeriod: string;
    viabilityStatus: 'High' | 'Moderate' | 'Low';
  };
}

export interface OmanLocalLogic {
  corporateTaxApplied: string;
  omanizationCostEstimate: {
    USD: string;
    OMR: string;
  };
  utilityTariffDetails: string;
}

export interface DynamicScoring {
  economicScore: number;
  sustainabilityScore: number;
  riskScore: number;
  overallViabilityRating: 'A' | 'B' | 'C';
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
}

export interface BioFuelAnalysis {
  ProjectAnalyzer: ProjectAnalyzer;
  TechnicalAI: TechnicalEngineeringAI;
  FinancialAI: FinancialModelingAI;
  AuditorAI: InvestmentCommitteeAuditor;
  RiskAI: RiskAssessmentAI;
  RecommendedBiofuelType: string;
  EnergyDomain: string;
  EconomicFeasibility: EconomicFeasibility;
  EnvironmentalImpact: EnvironmentalImpact;
  KeyRisks: KeyRisk[];
  AuditAIReview: AuditAIReview;
  InvestorPerspective: InvestorPerspective;
  Vision2040Alignment: Vision2040Alignment;
  ProjectReadiness: 'Concept Stage' | 'Pilot-Ready' | 'Early Commercial' | 'Commercial Scale';
  AnalysisAssumptions: AnalysisAssumptions;
  AuditorAssessment: AuditorAssessment;
  SensitivityAnalysis: SensitivityAnalysis;
  FinalFeasibilityScore: number;
  RiskExposureLevel: 'Moderate' | 'Significant' | 'Critical';
  Rationale: string;
  ExpertCounsel: string[];
  Dashboard: string;
  OmanLogic: OmanLocalLogic;
  DynamicScores: DynamicScoring;
  LegalRoadmap: OmanLegalRoadmap;
  AdvancedSensitivity: AdvancedSensitivityAnalysis;
  ExecutiveSummary: string;
}

export interface OmanIncentive {
  title: string;
  description: string;
  authority: string;
}

export interface SuggestedProject {
  ProjectName: string;
  Feedstock: string;
  Technology: string;
  EstimatedScale: string;
  StrategicJustification: string;
  Incentives: OmanIncentive[];
}

export interface ProjectHistoryEntry {
  id: string;
  projectName: string;
  location: string;
  feedstock: string;
  energyDomain: string;
  production: string;
  budget: string;
  score: number;
  level: string;
  timestamp: string;
  fullData: BioFuelAnalysis;
}

export type AnalysisStatus = 'IDLE' | 'ANALYZING' | 'COMPLETED' | 'ERROR';

export type MainTab = 'INVESTOR_FEASIBILITY' | 'RESEARCH' | 'SOLVER' | 'OPTIMIZER' | 'STANDARDS' | 'PROPOSAL' | 'ZONES' | 'CHALLENGES_HUB' | 'MARKETPLACE' | 'HOME' | 'GIS_MAP' | 'FEASIBILITY';

// Standards Checker Interfaces
export interface StandardsInput {
  biofuelType: string;
  viscosity?: string;
  flashPoint?: string;
  waterContent?: string;
  acidValue?: string;
  density?: string;
  cetaneNumber?: string;
  sulfurContent?: string;
}

export interface ParameterEvaluation {
  parameter: string;
  userValue: string;
  standardLimit: string;
  status: 'Pass' | 'Fail' | 'Warning' | 'Not Provided';
  implication: string;
  fixRecommendation?: string;
}

export interface StandardsResult {
  id: string;
  timestamp: string;
  biofuelType: string;
  overallStatus: 'Compliant' | 'Non-Compliant' | 'Needs Adjustment';
  targetStandard: string; // e.g., ASTM D6751, EN 14214
  evaluations: ParameterEvaluation[];
  expertSummary: string;
  commercialViability: string;
}

export interface StandardsHistoryEntry {
  id: string;
  timestamp: string;
  biofuelType: string;
  overallStatus: string;
  fullData: StandardsResult;
}

// Proposal Generator Interfaces
export interface ProposalInput {
  projectName: string;
  feedstock: string;
  biofuelType: string;
  capacity: string;
  budget: string;
  targetAudience: string;
  language: 'English' | 'Arabic';
}

export interface Installment {
  year: string;
  amount: string;
  description: string;
}

export interface FinancialTables {
  totalCapex: string;
  annualOpex: string;
  expectedRevenue: string;
  roiPercentage: string;
  paybackPeriod: string;
  installmentSchedule: Installment[];
}

export interface ProposalResult {
  id: string;
  timestamp: string;
  title: string;
  
  // The 14 Core Sections
  executiveSummary: string | string[];
  problemStatement: string | string[];
  marketOpportunity: string | string[];
  competitiveAdvantage: string | string[];
  businessModel: string | string[];
  revenueStreams: string | string[];
  technicalOverview: string | string[];
  feedstockStrategy: string | string[];
  financialModel: FinancialTables;
  riskAnalysis: {
    risk: string;
    mitigation: string;
  }[];
  esgImpact: string | string[];
  carbonCreditPotential: {
    estimatedTonsSaved: string;
    monetaryValueRange: string;
    explanation: string;
  };
  investmentProposal: {
    requestedAmount: string;
    fundingUtilization: string | string[];
    investorReturns: string;
    equityStructure: string;
    repaymentStrategy: string;
  };
  whyInvestorsShouldFund: string | string[];

  // Additional Deliverables
  pitchDeckOutline: {
    slideNumber: number;
    title: string;
    content: string;
  }[];
  investorEmailTemplate: string;
  onePageSummary: string;
  fundingRecommendations: string | string[];
  strategicPartners: string | string[];
  phasedScalingStrategy: {
    phase: string;
    duration: string;
    milestones: string | string[];
  }[];
}

export interface ProposalHistoryEntry {
  id: string;
  timestamp: string;
  projectName: string;
  targetAudience: string;
  fullData: ProposalResult;
}

export interface ScientificParameter {
  name: string;
  optimalValue: string;
  tolerance?: string;
  scientificUnit: string;
  impact: string;
}

export interface TroubleshootingStep {
  symptom: string;
  rootCause: string;
  diagnosticAssay: string;
  correctiveAction: string;
  expectedBenchmark: string;
}

export interface AgentSolution {
  agentRole: string;
  agentIcon: string;
  agentName: string;
  specificMandate?: string;
  proposedSolution: string;
  keyEvidences: string[];
  scientificParameters?: ScientificParameter[];
  dataTables: {
    title: string;
    columns: string[];
    rows: (string | number)[][];
    chartType: "bar" | "line" | "pie";
    xAxisLabel: string;
    yAxisLabel: string;
  }[];
  timeline: {
    phase: string;
    duration: string;
    description: string;
  }[];
}

export interface LabProtocolStep {
  stepNumber: number;
  title: string;
  instructions: string;
  criticalNotice?: string;
}

export interface MultiAgentChallengeResult {
  challengeTitle: string;
  challengeSummary: string;
  rootCauseAnalysis?: {
    primaryFailureMechanism: string;
    chemicalThermodynamicCause: string;
    experimentalConfounder: string;
  };
  researcherTroubleshootingMatrix?: TroubleshootingStep[];
  stepByStepLabProtocol?: LabProtocolStep[];
  scientificConfidenceScore?: number;
  trlCurrent?: number;
  trlTarget?: number;
  agents: AgentSolution[];
  consensus: string;
  consultingReportMarkdown?: string;
}

// ========================================================
// OMAN EV MULTI-AGENT MOBILITY PLATFORM INTERFACES
// ========================================================

export interface OmanEvInput {
  vehicleId: string;
  vehicleModel?: string;
  batteryCapacityKwh?: number;
  currentSocPct: number; // 0 - 100
  ambientTempC: number;
  batteryTempC: number;
  elevationChangeMeters: number; // e.g. +850m or -400m
  originalEstimatedRangeKm: number;
  requestedChargingPowerKw?: number;
  stationName?: string;
  stationGridCapacityKw?: number;
  activePortsCount?: number;
  totalStationPorts?: number;
  stationThrottled?: boolean;
  imageDataBase64?: string;
  imageMimeType?: string;
  language?: 'English' | 'Arabic';
}

export interface OmanEvAnalysisResult {
  agent_telemetry_summary: {
    vehicle_id: string;
    normalized_temp_c: number;
    normalized_soc_pct: number;
    normalized_battery_temp_c?: number;
    elevation_change_m?: number;
    elevation_impact_desc?: string;
  };
  thermal_and_range_analysis: {
    original_estimated_range_km: number;
    adjusted_desert_range_km: number;
    range_loss_percentage: number;
    thermal_status: "NORMAL" | "WARNING" | "CRITICAL";
    heat_coefficient_applied?: string;
    cooling_power_penalty_pct?: number;
    critical_warning_reason?: string;
  };
  grid_and_charging_optimization: {
    allocated_power_kw: number;
    applied_charging_tier: "TIER_1" | "TIER_2" | "TIER_3";
    tariff_rate_omr_per_kwh: number;
    tariff_rate_usd_per_kwh?: number;
    cooling_power_draw_kw: number;
    station_grid_load_pct?: number;
    estimated_charge_time_mins?: number;
    dynamic_load_allocation_note?: string;
  };
  vision_hardware_audit: {
    has_image_input: boolean;
    detected_faults: string[];
    maintenance_priority: "NONE" | "LOW" | "MEDIUM" | "CRITICAL";
    diagnostic_details?: string;
    inspected_components?: {
      connector_latch: "GOOD" | "WEAR_DETECTED" | "CRITICAL_DAMAGE";
      screen_lcd: "CLEAR" | "GLARE_DETECTED" | "SUN_BURNED";
      cooling_vents: "CLEAN" | "PARTIAL_SAND" | "HEAVY_BLOCKAGE";
      charging_cable: "HEALTHY" | "SURFACE_WEAR" | "HAZARD_ABRASION";
    };
  };
  driver_actionable_recommendation: string;
  calculated_at?: string;
  execution_mode?: "AI_AGENT_NETWORK" | "PRECISION_DETERMINISTIC_ENGINE";
}

// ========================================================
// VOLTOMAN ENGINE - ENTERPRISE EV ROUTING & TELEMETRY
// ========================================================

export interface VoltOmanInput {
  routeId?: string;
  routeNameEn: string;
  routeNameAr: string;
  highwayCorridor: 'Batinah' | 'Nizwa Road' | 'Adam-Thumrait-Salalah' | 'Sharqiyah' | 'Duqm SEZ' | 'Custom';
  distanceKm: number;
  manufacturerRatingKwhPerKm: number; // e.g. 0.18 kWh/km
  batteryCapacityKwh: number; // e.g. 78 kWh
  initialSocPct: number; // e.g. 90%
  minArrivalSocBufferPct?: number; // e.g. 15%
  ambientTempC: number; // e.g. 44°C
  timeOfDayHour: number; // 0 - 23 (e.g. 13 for 13:00 midday)
  uphillGainMeters: number; // e.g. +1450m
  downhillLossMeters: number; // e.g. -400m
  vehicleMassKg: number; // e.g. 2100 kg
  vehicleModelName?: string;
  maxDcChargingSpeedKw?: number; // e.g. 150 kW or 250 kW
  language?: 'English' | 'Arabic';
}

export interface VoltOmanChargingStop {
  stopIndex: number;
  stationNameEn: string;
  stationNameAr: string;
  highwayCorridor: string;
  distanceFromStartKm: number;
  segmentDistanceKm: number;
  arrivalSocPct: number;
  targetDepartureSocPct: number;
  chargerRatedKw: number;
  effectiveChargingPowerKw: number;
  isMiddayDerated: boolean;
  chargingTimeMins: number;
  energyAddedKwh: number;
  estimatedCostOmr: number;
  coolingAdvice?: string;
}

export interface VoltOmanTelemetryMetrics {
  distanceKm: number;
  manufacturerRatingKwhPerKm: number;
  baseEnergyConsumptionKwh: number; // E_base = Distance * Rating
  ambientTempC: number;
  timeOfDayHour: number;
  isMidday: boolean; // 11:00 - 16:00
  tempPenaltyFactor: number; // F_temp
  tempFormulaExplanation: string;
  tempAdjustedEnergyKwh: number; // E_base * F_temp
  uphillGainMeters: number;
  elevationUphillPenaltyKwh: number; // +2.5 kWh per 1000m gain
  downhillLossMeters: number;
  vehicleMassKg: number;
  regenRecoveredKwh: number; // m * g * h * 0.60 converted to kWh
  totalNetEnergyKwh: number; // (E_base * F_temp) + E_elev_uphill - E_regen
  effectiveEfficiencyKwhPerKm: number; // Total / Distance
  usableBatteryCapacityKwh: number;
  initialSocPct: number;
  arrivalSocPctWithoutCharging: number;
  isDirectFeasible: boolean;
  requiredChargingStopsCount: number;
  isDeratingTriggered: boolean;
  deratingFormulaExplanation: string;
}

export interface VoltOmanResult {
  feasibilityVerdict: 'DIRECT_REACHABLE' | 'FEASIBLE_WITH_CHARGES' | 'CRITICAL_DEFICIT';
  verdictTitleEn: string;
  verdictTitleAr: string;
  verdictSummaryEn: string;
  verdictSummaryAr: string;
  telemetry: VoltOmanTelemetryMetrics;
  chargingItinerary: VoltOmanChargingStop[];
  totalChargingTimeMins: number;
  totalDriveTimeMins: number;
  totalTripTimeMins: number;
  totalTripCostOmr: number;
  batteryThermalMitigationAdviceEn: string[];
  batteryThermalMitigationAdviceAr: string[];
  fullMarkdownReport: string;
  calculatedAt: string;
  executionEngine: 'VOLTOMAN_AI_COPILOT' | 'VOLTOMAN_PRECISION_ENGINE';
}

