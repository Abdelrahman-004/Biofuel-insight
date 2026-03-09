
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
  RealisticRequiredCAPEX: number;
  FundingGapUSD: number;
  FundingGapPercentage: number;
  InstalledCostPerUnit: number; // Generalized from PerKg
  AnnualRevenue: number;
  AnnualOPEX: number;
  GrossProfit: number;
  CapitalAdequacyRatio: number;
  InvestmentVerdict: 'Not Bankable' | 'Conditionally Viable' | 'Investment Grade';
  EstimatedInvestmentUSD: {
    Minimum: number;
    Maximum: number;
    MajorCosts: string[];
  };
}

export interface SensitivityDataPoint {
  label: string;
  payback: number;
  irr: number;
}

export interface SensitivityAnalysis {
  PriceDrop10: { PaybackPeriod: number; RiskLevel: string };
  OPEXIncrease15: { PaybackPeriod: number; RiskLevel: string };
  ProductionDrop10: { PaybackPeriod: number; RiskLevel: string };
  DataPoints: SensitivityDataPoint[];
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

export interface AuditAIReview {
  ConsistencyCheck: string;
  DataWarnings: string[];
  SuggestedCorrections: string[];
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

export interface TRLRoadmapStep {
  trl: number;
  title: string;
  description: string;
  estimatedDuration: string;
  keyMilestones: string[];
}

export interface ResearchImplementationAnalysis {
  id: string;
  timestamp: string;
  ResearchInputs: ResearchInputParameters;
  ImplementationEstimator: ImplementationEstimator;
  ProductionOutput: ProductionOutputEstimation;
  ReadinessScore: ResearchImplementationReadinessScore;
  CostEstimation: PilotScaleCostEstimation;
  TRLRoadmap: TRLRoadmapStep[];
  ScientificSummary: string;
  Assumptions: string[];
  RiskFactors: string[];
}

export interface TechnicalEngineeringAI {
  InstalledCapacity: string;
  EnergyOutput: string;
  BenchmarkCAPEXRange: string;
  TRLEstimate: number;
}

export interface FinancialModelingAI {
  RealisticCAPEX: number;
  OPEX: number;
  Revenue: number;
  GrossProfit: number;
  PaybackYears: number;
  IRR_Simplified: string;
  LCOE_or_CostPerTon: string;
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
  IdentifiedChallenge: string;
  ScientificHypothesis: string;
  ExperimentalDesign: {
    Title: string;
    Variables: string[];
    ControlConditions: string[];
    ExpectedOutcomes: string[];
    FeasibilityNote: string;
  };
  IndustrialRelevance: string;
  ExpectedImpact: {
    Environmental: string;
    Economic: string;
    Strategic: string;
    Scalability: string;
  };
}

export interface ChallengeHistoryEntry {
  id: string;
  topic: string;
  timestamp: string;
  fullData: ChallengeSolverResult;
}

export interface OptimizerResult {
  ProfitOpportunities: string[];
  CarbonReductionStrategies: string[];
  FossilFuelReplacementPlan: string[];
  LogisticsOptimization: string[];
  NetZeroRoadmap: {
    CarbonIntensityEstimate: string;
    StandardsComparison: string;
    RoadmapSteps: string[];
  };
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

export type MainTab = 'INVESTOR_FEASIBILITY' | 'RESEARCH' | 'SOLVER' | 'OPTIMIZER' | 'STANDARDS' | 'ZONES';
