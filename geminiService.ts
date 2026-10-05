import { 
  BioFuelAnalysis, 
  SuggestedProject, 
  ResearchImplementationAnalysis, 
  OptimizerResult,
  StandardsInput,
  StandardsResult,
  ProposalInput,
  ProposalResult,
  OmanEvInput,
  OmanEvAnalysisResult,
  VoltOmanInput,
  VoltOmanResult
} from "./types";


/**
 * BioFuel Insight AI - Secure Client API Service
 * All Gemini operations are proxied through server-side endpoints to protect API secrets.
 */

async function postJson<T>(url: string, body?: any): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const resJson = await response.json().catch(() => ({ success: false, error: 'Invalid server response' }));
  if (!response.ok || resJson.success === false) {
    throw new Error(resJson.error || `Server request failed with status ${response.status}`);
  }

  return resJson.data as T;
}

export async function optimizeProject(
  projectName: string, 
  description: string, 
  language: string = 'English'
): Promise<OptimizerResult> {
  return postJson<OptimizerResult>('/api/gemini/optimize-project', {
    projectName,
    description,
    language,
  });
}

export async function analyzeProject(inputs: {
  projectName?: string;
  category?: string;
  feedstock?: string;
  production?: number;
  budget?: number;
  sellingPrice?: number;
  electricityCost?: number;
  laborCost?: number;
  location?: string;
  language?: string;
  projectDescription?: string;
  annualOpCost?: number;
}): Promise<BioFuelAnalysis> {
  return postJson<BioFuelAnalysis>('/api/gemini/analyze-project', { inputs });
}

export async function solveChallenge(
  topic: string, 
  language: string = 'English',
  researchDetails?: {
    feedstock?: string;
    experimentalSetup?: string;
    observedObstacle?: string;
    targetMetric?: string;
  }
): Promise<any> {
  return postJson<any>('/api/gemini/solve-challenge', { topic, language, researchDetails });
}

export async function analyzeResearchImplementation(
  inputs: any,
  language: string = 'English'
): Promise<ResearchImplementationAnalysis> {
  return postJson<ResearchImplementationAnalysis>('/api/gemini/research-implementation', { inputs, language });
}

export async function suggestProject(
  context: string, 
  language: string = 'English'
): Promise<SuggestedProject> {
  return postJson<SuggestedProject>('/api/gemini/suggest-project', { context, language });
}

export async function checkStandardsCompliance(
  inputs: StandardsInput, 
  language: string = 'English'
): Promise<StandardsResult> {
  return postJson<StandardsResult>('/api/gemini/check-standards', { inputs, language });
}

export async function generateProposal(
  inputs: ProposalInput
): Promise<ProposalResult> {
  return postJson<ProposalResult>('/api/gemini/generate-proposal', { inputs });
}

export async function analyzeOmanEvPlatform(
  inputs: OmanEvInput
): Promise<OmanEvAnalysisResult> {
  return postJson<OmanEvAnalysisResult>('/api/gemini/oman-ev-optimizer', { inputs });
}

export async function analyzeVoltOmanRoute(
  inputs: VoltOmanInput
): Promise<VoltOmanResult> {
  return postJson<VoltOmanResult>('/api/gemini/voltoman-route-planner', { inputs });
}


export async function fetchLiveNews(): Promise<{en: string; ar: string; time: string}[]> {
  const response = await fetch('/api/gemini/news');
  const resJson = await response.json().catch(() => ({ success: false, error: 'Invalid server response' }));
  if (!response.ok || resJson.success === false) {
    throw new Error(resJson.error || 'Failed to fetch live news');
  }
  return resJson.data;
}
