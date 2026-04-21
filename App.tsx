
import * as React from 'react';
import { Home } from './Home';
import { InputForm } from './InputForm';
import { StandardsChecker } from './StandardsChecker';
import { ProposalGenerator } from './ProposalGenerator';
import { LiveMarketsDashboard } from './LiveMarketsDashboard';
import { GisMap } from './GisMap';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: 'HOME' | 'LIVE_MARKETS' | 'GIS_MAP' | 'INVESTOR_FEASIBILITY' | 'RESEARCH' | 'SOLVER' | 'OPTIMIZER' | 'STANDARDS' | 'PROPOSAL' | 'ZONES') => void;
  language: 'English' | 'Arabic';
  onLanguageChange: (lang: 'English' | 'Arabic') => void;
}

const BiofuelOmanLogo = () => (
  <svg viewBox="0 0 48 48" className="w-10 h-10 flex-shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#155944" />
        <stop offset="100%" stopColor="#0B2F23" />
      </linearGradient>
      <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#7ADB4A" />
        <stop offset="100%" stopColor="#2E8A5E" />
      </linearGradient>
    </defs>
    
    {/* Outer Khanjar / Coastline curve - Forest Green */}
    <path 
      d="M24 2C36 2 44 10 44 22C44 38 28 46 16 46C28 42 34 32 34 22C34 12 28 6 24 2Z" 
      fill="url(#primaryGrad)"
    />
    <path 
      d="M22 6C12 6 4 14 4 26C4 32 8 38 14 42C12 36 12 30 16 24C18 20 22 16 22 6Z" 
      fill="url(#primaryGrad)" opacity="0.8"
    />

    {/* AI Tech Network Nodes */}
    <path d="M12 26 L22 26 L28 20" stroke="#ECECEC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 16 L20 20 L22 26" stroke="#ECECEC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 36 L22 32 L22 26" stroke="#7ADB4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    
    <circle cx="12" cy="26" r="2" fill="#ECECEC" />
    <circle cx="16" cy="16" r="2" fill="#ECECEC" />
    <circle cx="18" cy="36" r="2" fill="#7ADB4A" />
    <circle cx="28" cy="20" r="2" fill="#7ADB4A" className="animate-pulse" />

    {/* Biodiesel Drop / Leaf at the core */}
    <path 
      d="M28 20 C28 20 36 20 36 28 C36 32 32 36 28 36 C24 36 20 32 20 28 C20 24 28 20 28 20Z" 
      fill="url(#neonGrad)" 
    />
    <path 
      d="M25 28 C25 30 26 32 28 32" 
      stroke="#155944" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
    />
  </svg>
);

const TopNavbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, language, onLanguageChange }) => {
  const isArabic = language === 'Arabic';
  return (
    <nav className="bg-slate-950/90 backdrop-blur-2xl text-white border-b border-white/5 sticky top-0 z-50 transition-all shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          <div className="flex items-center space-x-8 rtl:space-x-reverse">
            <div 
              className="flex items-center cursor-pointer group" 
              onClick={() => onTabChange('HOME')}
            >
              <BiofuelOmanLogo />
              <span className="text-xl font-black tracking-tighter text-white group-hover:text-emerald-400 transition-colors mx-3">
                OMAN <span className="text-emerald-500">ECOSYNC</span>
              </span>
            </div>
            
            <div className="hidden lg:flex items-center space-x-4 rtl:space-x-reverse">
              {[
                { id: 'LIVE_MARKETS', label: isArabic ? 'مؤشرات السوق' : 'Live Markets', icon: 'fa-chart-pie' },
                { id: 'GIS_MAP', label: isArabic ? 'خريطة GIS' : 'GIS Map', icon: 'fa-map-marked-alt' },
              ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => onTabChange(item.id as any)}
                  className={`px-5 py-2.5 rounded-full transition-all text-xs font-black uppercase tracking-widest border flex items-center ${
                    activeTab === item.id 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                      : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <i className={`fas ${item.icon} mr-2 flex-shrink-0 rtl:ml-2 rtl:mr-0`}></i>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button
              onClick={() => onLanguageChange(isArabic ? 'English' : 'Arabic')}
              className="px-4 py-2.5 bg-slate-800/50 hover:bg-slate-700 text-white rounded-full border border-slate-700 transition flex items-center text-xs font-bold"
            >
              <i className="fas fa-globe mx-2 text-emerald-400"></i>
              {isArabic ? 'EN' : 'AR'}
            </button>
            <div className="w-px h-6 bg-slate-700 mx-2 hidden md:block"></div>
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 border border-slate-700 hover:border-emerald-500 transition-colors text-slate-300 hover:text-white">
               <i className="fas fa-user-circle text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  language: 'English' | 'Arabic';
  isOpen: boolean;
  onToggle: () => void;
}

const SIDEBAR_ITEMS = [
  { id: 'INVESTOR_FEASIBILITY', labelEn: 'Feasibility Tools', labelAr: 'الجدوى الاستثمارية', icon: 'fa-calculator' },
  { id: 'RESEARCH', labelEn: 'Research Engine', labelAr: 'تحليل البحوث', icon: 'fa-microscope' },
  { id: 'SOLVER', labelEn: 'Challenge Solver', labelAr: 'حل العوائق', icon: 'fa-lightbulb' },
  { id: 'OPTIMIZER', labelEn: 'Financial Optimizer', labelAr: 'التحسين المالي', icon: 'fa-chart-line' },
  { id: 'STANDARDS', labelEn: 'Standards Checks', labelAr: 'المعايير والاشتراطات', icon: 'fa-book' },
  { id: 'PROPOSAL', labelEn: 'AI Proposals', labelAr: 'المقترحات الاستثمارية', icon: 'fa-file-signature' },
  { id: 'ZONES', labelEn: 'Free Zones DB', labelAr: 'المناطق الحرة', icon: 'fa-map' }
];

const MainSidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, language, isOpen, onToggle }) => {
  const isArabic = language === 'Arabic';
  return (
    <aside className={`bg-slate-950/90 backdrop-blur-2xl border-white/5 transition-all duration-300 flex flex-col z-40 relative py-6 flex-shrink-0
      ${isArabic ? 'border-l shadow-[-4px_0_24px_rgba(0,0,0,0.5)]' : 'border-r shadow-[4px_0_24px_rgba(0,0,0,0.5)]'}
      ${isOpen ? 'w-72' : 'w-20'}
    `}>
      <button 
        onClick={onToggle}
        className={`mx-4 mb-8 flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition ${isOpen ? 'self-end' : 'mx-auto'}`}
      >
         <i className={`fas fa-chevron-${isOpen ? (isArabic ? 'right' : 'left') : (isArabic ? 'left' : 'right')}`}></i>
      </button>

      {isOpen && (
        <div className="flex flex-col space-y-3 px-3 animate-in fade-in duration-300">
           {SIDEBAR_ITEMS.map(item => {
             const isActive = activeTab === item.id || (activeTab === 'FEASIBILITY' && item.id === 'INVESTOR_FEASIBILITY');
             return (
               <button
                 key={item.id}
                 onClick={() => onTabChange(item.id)}
                 className={`flex items-center p-4 rounded-xl transition-all group mb-2 justify-start ${
                   isActive 
                     ? 'bg-white text-emerald-600 shadow-md border border-slate-200' 
                     : 'bg-white text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50 hover:text-emerald-600'
                 }`}
                 title={isArabic ? item.labelAr : item.labelEn}
               >
                 <i className={`fas ${item.icon} text-lg ${isArabic ? 'ml-4' : 'mr-4'}`}></i>
                 <span className="text-xs font-black uppercase tracking-wider whitespace-nowrap overflow-hidden text-left rtl:text-right">
                   {isArabic ? item.labelAr : item.labelEn}
                 </span>
               </button>
             )
           })}
        </div>
      )}
    </aside>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-slate-500 py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-16 items-start">
          <div className="text-center md:text-left">
            <div className="flex items-center space-x-2 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all">
              <BiofuelOmanLogo />
              <span className="text-xs font-black tracking-tighter text-white">
                OMAN ECOSYNC
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-xs mx-auto md:mx-0 font-medium">
              The next-generation intelligence layer for Oman's clean energy infrastructure, sustainability modeling, and research.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-6">
            <div className="flex space-x-12">
              <a href="#" className="hover:text-green-500 transition text-[10px] font-black uppercase tracking-[0.3em]">Terms</a>
              <a href="#" className="hover:text-green-500 transition text-[10px] font-black uppercase tracking-[0.3em]">Policy</a>
              <a href="#" className="hover:text-green-500 transition text-[10px] font-black uppercase tracking-[0.3em]">Contact</a>
            </div>
            <div className="flex space-x-8">
              <i className="fab fa-linkedin hover:text-green-500 cursor-pointer transition text-xl"></i>
              <i className="fab fa-twitter hover:text-green-500 cursor-pointer transition text-xl"></i>
              <i className="fab fa-instagram hover:text-green-500 cursor-pointer transition text-xl"></i>
              <i className="fas fa-envelope hover:text-green-500 cursor-pointer transition text-xl"></i>
            </div>
          </div>
          <div className="text-center md:text-right">
            <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-4">Strategic Partners</h4>
            <p className="text-[10px] leading-relaxed opacity-50 font-bold uppercase tracking-widest">
              Sohar Free Zone • SEZAD • Salalah Port • ASYAD
            </p>
          </div>
        </div>
        <div className="mt-20 pt-10 border-t border-white/5 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-600">
            © 2026 OMAN ECOSYNC. PROPELLED BY ADVANCED INTELLIGENCE.
          </p>
        </div>
      </div>
    </footer>
  );
};
import { Dashboard } from './Dashboard';
import { ProjectHistory } from './ProjectHistory';
import { CompareProjects } from './CompareProjects';
import { GlobalStandards } from './GlobalStandards';
import { OmanFreeZones } from './OmanFreeZones';
import { ResearchInputForm } from './ResearchInputForm';
import { ResearchDashboard } from './ResearchDashboard';
import { ResearchHistory } from './ResearchHistory';
import { ChallengeSolver } from './ChallengeSolver';
import { OptimizerTool } from './OptimizerTool';
import { UnifiedHistorySidebar } from './UnifiedHistorySidebar';
import { analyzeProject, analyzeResearchImplementation } from './geminiService';
import { BioFuelAnalysis, AnalysisStatus, ProjectHistoryEntry, ResearchImplementationAnalysis, ChallengeHistoryEntry, OptimizerHistoryEntry, UnifiedProject, ProjectType } from './types';

const STORAGE_KEY = 'biofuel_insight_history';
const RESEARCH_STORAGE_KEY = 'biofuel_insight_research_history';
const CHALLENGE_STORAGE_KEY = 'biofuel_insight_challenge_history';
const OPTIMIZER_STORAGE_KEY = 'biofuel_insight_optimizer_history';
const UNIFIED_HISTORY_KEY = 'biofuel_insight_unified_history';
const ACTIVE_TAB_KEY = 'biofuel_insight_active_tab';
const CURRENT_ANALYSIS_KEY = 'biofuel_insight_current_analysis';
const CURRENT_RESEARCH_KEY = 'biofuel_insight_current_research';

type MainTab = 'HOME' | 'LIVE_MARKETS' | 'GIS_MAP' | 'FEASIBILITY' | 'INVESTOR_FEASIBILITY' | 'RESEARCH' | 'SOLVER' | 'OPTIMIZER' | 'STANDARDS' | 'PROPOSAL' | 'ZONES';
type FeasibilityView = 'ANALYZE' | 'HISTORY' | 'COMPARE';
type ResearchView = 'ANALYZE' | 'HISTORY';

export default function App() {
  const [activeMainTab, setActiveMainTab] = React.useState<MainTab>('HOME');
  const [feasibilityView, setFeasibilityView] = React.useState<FeasibilityView>('ANALYZE');
  const [researchView, setResearchView] = React.useState<ResearchView>('ANALYZE');
  const [language, setLanguage] = React.useState<'English' | 'Arabic'>('Arabic'); // Start with Arabic mostly because user requested Arabic translation first
  const [status, setStatus] = React.useState<AnalysisStatus>('IDLE');
  const [analysis, setAnalysis] = React.useState<BioFuelAnalysis | null>(null);
  const [researchAnalysis, setResearchAnalysis] = React.useState<ResearchImplementationAnalysis | null>(null);
  const [history, setHistory] = React.useState<ProjectHistoryEntry[]>([]);
  const [researchHistory, setResearchHistory] = React.useState<ResearchImplementationAnalysis[]>([]);
  const [challengeHistory, setChallengeHistory] = React.useState<ChallengeHistoryEntry[]>([]);
  const [optimizerHistory, setOptimizerHistory] = React.useState<OptimizerHistoryEntry[]>([]);
  const [unifiedProjects, setUnifiedProjects] = React.useState<UnifiedProject[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isMainSidebarOpen, setIsMainSidebarOpen] = React.useState(true);
  const [initialFeasibilityInputs, setInitialFeasibilityInputs] = React.useState<any>(null);
  const [initialResearchInputs, setInitialResearchInputs] = React.useState<any>(null);
  const [initialChallengeInputs, setInitialChallengeInputs] = React.useState<any>(null);
  const [initialOptimizerInputs, setInitialOptimizerInputs] = React.useState<any>(null);
  const [initialChallengeResult, setInitialChallengeResult] = React.useState<any>(null);
  const [initialOptimizerResult, setInitialOptimizerResult] = React.useState<any>(null);
  const [comparisonItems, setComparisonItems] = React.useState<ProjectHistoryEntry[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
    const savedResearch = localStorage.getItem(RESEARCH_STORAGE_KEY);
    if (savedResearch) {
      try { 
        const parsed = JSON.parse(savedResearch);
        // Validate that the loaded data matches the current schema (has USD/OMR structure)
        const isValid = Array.isArray(parsed) && parsed.every((item: any) => 
          item.CostEstimation?.EquipmentCosts?.ReactorSystem?.USD !== undefined
        );
        
        if (isValid) {
          setResearchHistory(parsed); 
        } else {
          console.warn("Cleared incompatible research history due to schema update.");
          localStorage.removeItem(RESEARCH_STORAGE_KEY);
          setResearchHistory([]);
        }
      } catch (e) { 
        console.error(e); 
        setResearchHistory([]);
      }
    }
    const savedChallenge = localStorage.getItem(CHALLENGE_STORAGE_KEY);
    if (savedChallenge) {
      try { setChallengeHistory(JSON.parse(savedChallenge)); } catch (e) { console.error(e); }
    }

    const savedOptimizer = localStorage.getItem(OPTIMIZER_STORAGE_KEY);
    if (savedOptimizer) {
      try { setOptimizerHistory(JSON.parse(savedOptimizer)); } catch (e) { console.error(e); }
    }

    const savedUnified = localStorage.getItem(UNIFIED_HISTORY_KEY);
    if (savedUnified) {
      try { setUnifiedProjects(JSON.parse(savedUnified)); } catch (e) { console.error(e); }
    }
    
    const savedTab = localStorage.getItem(ACTIVE_TAB_KEY);
    if (savedTab) setActiveMainTab(savedTab as MainTab);

    const savedAnalysis = localStorage.getItem(CURRENT_ANALYSIS_KEY);
    if (savedAnalysis) {
      try { 
        setAnalysis(JSON.parse(savedAnalysis));
        setStatus('COMPLETED');
      } catch (e) { console.error(e); }
    }

    const savedResearchAnalysis = localStorage.getItem(CURRENT_RESEARCH_KEY);
    if (savedResearchAnalysis) {
      try { 
        setResearchAnalysis(JSON.parse(savedResearchAnalysis));
        setStatus('COMPLETED');
      } catch (e) { console.error(e); }
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  React.useEffect(() => {
    localStorage.setItem(RESEARCH_STORAGE_KEY, JSON.stringify(researchHistory));
  }, [researchHistory]);

  React.useEffect(() => {
    localStorage.setItem(CHALLENGE_STORAGE_KEY, JSON.stringify(challengeHistory));
  }, [challengeHistory]);

  React.useEffect(() => {
    localStorage.setItem(OPTIMIZER_STORAGE_KEY, JSON.stringify(optimizerHistory));
  }, [optimizerHistory]);

  React.useEffect(() => {
    localStorage.setItem(UNIFIED_HISTORY_KEY, JSON.stringify(unifiedProjects));
  }, [unifiedProjects]);

  React.useEffect(() => {
    localStorage.setItem(ACTIVE_TAB_KEY, activeMainTab);
  }, [activeMainTab]);

  React.useEffect(() => {
    if (analysis) localStorage.setItem(CURRENT_ANALYSIS_KEY, JSON.stringify(analysis));
    else localStorage.removeItem(CURRENT_ANALYSIS_KEY);
  }, [analysis]);

  React.useEffect(() => {
    if (researchAnalysis) localStorage.setItem(CURRENT_RESEARCH_KEY, JSON.stringify(researchAnalysis));
    else localStorage.removeItem(CURRENT_RESEARCH_KEY);
  }, [researchAnalysis]);

  const saveToUnifiedHistory = (project: Omit<UnifiedProject, 'id' | 'createdAt'>) => {
    const newProject: UnifiedProject = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toLocaleString()
    };
    setUnifiedProjects(prev => [newProject, ...prev]);
  };

  const handleAnalyze = React.useCallback(async (inputs: {
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
  }) => {
    setStatus('ANALYZING');
    setError(null);
    try {
      const result = await analyzeProject({...inputs, language});
      setAnalysis(result);
      setStatus('COMPLETED');
      
      const newEntry: ProjectHistoryEntry = {
        id: Date.now().toString(),
        projectName: result.ProjectAnalyzer.ProjectName,
        location: result.ProjectAnalyzer.Location,
        feedstock: result.ProjectAnalyzer.Feedstock,
        energyDomain: result.EnergyDomain,
        production: (result.ProjectAnalyzer.ExpectedProduction || 0) > 0 
          ? `${result.ProjectAnalyzer.ExpectedProduction!.toLocaleString()} ${result.ProjectAnalyzer.TechnologyCategory === 'Biofuel' ? 'Tons' : 'MWh'}` 
          : "Not Provided",
        budget: (result.ProjectAnalyzer.PreliminaryBudgetUSD || 0) > 0 ? `$${result.ProjectAnalyzer.PreliminaryBudgetUSD!.toLocaleString()}` : "Not Provided",
        score: result.FinalFeasibilityScore,
        level: result.EconomicFeasibility.Assessment,
        timestamp: new Date().toLocaleString(),
        fullData: result
      };
      
      setHistory(prev => [...prev, newEntry]);
      
      saveToUnifiedHistory({
        name: result.ProjectAnalyzer.ProjectName,
        type: 'FEASIBILITY',
        inputs: inputs,
        outputs: result,
        score: result.FinalFeasibilityScore
      });

      setTimeout(() => {
        document.getElementById('dashboard-view')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis. Check your connection or parameters.");
      setStatus('ERROR');
    }
  }, []);

  const handleSelectFromHistory = (entry: ProjectHistoryEntry) => {
    setAnalysis(entry.fullData);
    setStatus('COMPLETED');
    setFeasibilityView('ANALYZE');
    setTimeout(() => { document.getElementById('dashboard-view')?.scrollIntoView({ behavior: 'smooth' }); }, 100);
  };

  const handleCompare = (selectedIds: string[]) => {
    const items = history.filter(h => selectedIds.includes(h.id));
    setComparisonItems(items);
    setFeasibilityView('COMPARE');
  };

  const handleResearchAnalyze = React.useCallback(async (inputs: any) => {
    setStatus('ANALYZING');
    setError(null);
    try {
      const result = await analyzeResearchImplementation(inputs, language);
      setResearchAnalysis(result);
      setResearchHistory(prev => [result, ...prev]);
      
      saveToUnifiedHistory({
        name: inputs.feedstockType || 'Unnamed Research',
        type: 'RESEARCH',
        inputs: inputs,
        outputs: result,
        score: result.ReadinessScore.OverallScore
      });

      setStatus('COMPLETED');
      setResearchView('ANALYZE');
      setTimeout(() => {
        document.getElementById('research-dashboard')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || "An error occurred during research analysis.");
      setStatus('ERROR');
    }
  }, []);

  const handleSelectFromResearchHistory = (entry: ResearchImplementationAnalysis) => {
    setResearchAnalysis(entry);
    setStatus('COMPLETED');
    setResearchView('ANALYZE');
    setTimeout(() => { document.getElementById('research-dashboard')?.scrollIntoView({ behavior: 'smooth' }); }, 100);
  };

  const handleSelectProject = (project: UnifiedProject) => {
    setActiveMainTab(project.type === 'FEASIBILITY' ? 'INVESTOR_FEASIBILITY' : project.type as MainTab);
    
    if (project.type === 'FEASIBILITY') {
      setAnalysis(project.outputs);
      setFeasibilityView('ANALYZE');
    } else if (project.type === 'RESEARCH') {
      setResearchAnalysis(project.outputs);
      setResearchView('ANALYZE');
    } else if (project.type === 'CHALLENGE') {
      setInitialChallengeResult(project.outputs);
    } else if (project.type === 'OPTIMIZER') {
      setInitialOptimizerResult(project.outputs);
    }
    
    setStatus('COMPLETED');
    setIsSidebarOpen(false);
    setTimeout(() => {
      const id = project.type === 'FEASIBILITY' ? 'dashboard-view' : 'research-dashboard';
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleEditProject = (project: UnifiedProject) => {
    setActiveMainTab(project.type === 'FEASIBILITY' ? 'INVESTOR_FEASIBILITY' : project.type as MainTab);
    
    if (project.type === 'FEASIBILITY') {
      setInitialFeasibilityInputs(project.inputs);
      setFeasibilityView('ANALYZE');
    } else if (project.type === 'RESEARCH') {
      setInitialResearchInputs(project.inputs);
      setResearchView('ANALYZE');
    } else if (project.type === 'CHALLENGE') {
      setInitialChallengeInputs(project.inputs);
    } else if (project.type === 'OPTIMIZER') {
      setInitialOptimizerInputs(project.inputs);
    }
    
    setIsSidebarOpen(false);
    setStatus('IDLE'); // Reset status to show the form
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setUnifiedProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleExportReport = (project: UnifiedProject) => {
    const reportData = JSON.stringify(project, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, '_')}_Report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderFeasibilityTool = () => (
    <>
      <div className="bg-emerald-900 pt-4 px-4 flex justify-center">
        <div className="flex space-x-1 bg-emerald-950/50 p-1 rounded-xl shadow-inner">
          {[
            { id: 'ANALYZE', icon: 'fa-microchip', label: 'Analyze' },
            { id: 'HISTORY', icon: 'fa-history', label: 'History' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setFeasibilityView(tab.id as FeasibilityView)}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                feasibilityView === tab.id ? 'bg-emerald-500 text-white shadow-lg translate-y-[-2px]' : 'text-emerald-400 hover:text-white'
              }`}
            >
              <i className={`fas ${tab.icon} mr-2`}></i> {tab.label}
              {tab.id === 'HISTORY' && history.length > 0 && (
                <span className="ml-2 bg-emerald-400 text-emerald-900 w-4 h-4 rounded-full inline-flex items-center justify-center text-[8px] font-black">
                  {history.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {feasibilityView === 'ANALYZE' && (
        <div className="animate-in fade-in duration-500 bg-white min-h-screen">
          <section className="bg-white text-slate-900 border-b border-slate-200 py-12 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                {language === 'Arabic' ? (
                  <>أداة <span className="text-emerald-600 underline decoration-emerald-500/30">تحليل الجدوى الاستثمارية</span></>
                ) : (
                  <>Investor <span className="text-emerald-600 underline decoration-emerald-500/30">Feasibility</span> Tool</>
                )}
              </h1>
              <p className="text-md text-slate-600 max-w-2xl mx-auto">
                {language === 'Arabic' ? 'قم بتقييم الجدوى الاقتصادية والتقنية لمسارات الوقود الحيوي والطاقة ضمن المناطق الاستراتيجية في عُمان.' : "Evaluate technical and economic viability for Biofuel, Hydrogen, and Carbon pathways across Oman's strategic zones."}
              </p>
            </div>
          </section>

          <section className="max-w-5xl mx-auto px-4 py-8 relative z-10 bg-white">
            <InputForm 
              onAnalyze={handleAnalyze} 
              isLoading={status === 'ANALYZING'} 
              initialInputs={initialFeasibilityInputs}
              language={language}
            />
            {error && <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold text-center">{error}</div>}
          </section>

          {status === 'ANALYZING' && (
            <section className="max-w-5xl mx-auto px-4 py-20 text-center animate-pulse">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex space-x-2">
                  {[0, 1, 2].map(i => <div key={i} className="w-3 h-3 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: `${i*0.2}s` }}></div>)}
                </div>
                <p className="text-slate-500 font-black uppercase tracking-widest text-xs">AI Assessment Engine Computing Regional Benchmarks...</p>
              </div>
            </section>
          )}

          {status === 'COMPLETED' && analysis && (
            <section id="dashboard-view" className="max-w-7xl mx-auto px-4 pb-20">
              <Dashboard data={analysis} language={language} />
            </section>
          )}
        </div>
      )}

      {feasibilityView === 'HISTORY' && (
        <section className="max-w-5xl mx-auto px-4 py-12 animate-in fade-in duration-500">
          <ProjectHistory 
            history={history} 
            onSelect={handleSelectFromHistory} 
            onCompare={handleCompare}
            onClear={() => { if(window.confirm("Clear all historical records?")) setHistory([]); }}
          />
        </section>
      )}

      {feasibilityView === 'COMPARE' && (
        <section className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in duration-500">
          <CompareProjects entries={comparisonItems} onBack={() => setFeasibilityView('HISTORY')} />
        </section>
      )}
    </>
  );
  return (
    <div className="h-screen flex flex-col bg-slate-950 font-sans selection:bg-emerald-100/30 selection:text-emerald-400 transition-colors duration-500 overflow-hidden text-slate-200" dir={language === 'Arabic' ? 'rtl' : 'ltr'}>
      <TopNavbar 
        activeTab={activeMainTab} 
        onTabChange={(tab) => {
          setActiveMainTab(tab);
          if (tab === 'INVESTOR_FEASIBILITY' && feasibilityView === 'COMPARE') setFeasibilityView('ANALYZE');
        }} 
        language={language}
        onLanguageChange={setLanguage}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <MainSidebar 
          activeTab={activeMainTab}
          onTabChange={(tab) => {
            setActiveMainTab(tab);
            if (tab === 'INVESTOR_FEASIBILITY' && feasibilityView === 'COMPARE') setFeasibilityView('ANALYZE');
          }}
          language={language}
          isOpen={isMainSidebarOpen}
          onToggle={() => setIsMainSidebarOpen(!isMainSidebarOpen)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full flex flex-col">
            {activeMainTab === 'HOME' && <Home onStart={(tab) => setActiveMainTab(tab)} language={language} />}
            {activeMainTab === 'LIVE_MARKETS' && (
              <section className="max-w-7xl mx-auto px-4 py-8 flex-1">
                <LiveMarketsDashboard language={language} />
              </section>
            )}
            {activeMainTab === 'GIS_MAP' && (
              <section className="max-w-7xl mx-auto px-4 py-8 flex-1">
                <GisMap language={language} />
              </section>
            )}
        {(activeMainTab === 'INVESTOR_FEASIBILITY' || activeMainTab === 'FEASIBILITY') && renderFeasibilityTool()}
        {activeMainTab === 'RESEARCH' && (
          <div className="animate-in fade-in duration-500">
            <div className="bg-blue-900 pt-4 px-4 flex justify-center">
              <div className="flex space-x-1 bg-blue-950/50 p-1 rounded-xl shadow-inner">
                {[
                  { id: 'ANALYZE', icon: 'fa-microscope', label: 'Analyze' },
                  { id: 'HISTORY', icon: 'fa-history', label: 'History' }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setResearchView(tab.id as ResearchView)}
                    className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                      researchView === tab.id ? 'bg-blue-500 text-white shadow-lg translate-y-[-2px]' : 'text-blue-400 hover:text-white'
                    }`}
                  >
                    <i className={`fas ${tab.icon} mr-2`}></i> {tab.label}
                    {tab.id === 'HISTORY' && researchHistory.length > 0 && (
                      <span className="ml-2 bg-blue-400 text-blue-900 w-4 h-4 rounded-full inline-flex items-center justify-center text-[8px] font-black">
                        {researchHistory.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {researchView === 'ANALYZE' && (
              <div className="bg-white min-h-screen">
                <section className="bg-white text-slate-900 border-b border-slate-200 py-12 px-4">
                  <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                      {language === 'Arabic' ? (
                        <>مُحَلِّل <span className="text-blue-600 underline decoration-blue-500/30">البحوث المخبرية والتطبيقية</span></>
                      ) : (
                        <>Research Implementation <span className="text-blue-600 underline decoration-blue-500/30">Analyzer</span></>
                      )}
                    </h1>
                    <p className="text-md text-slate-600 max-w-2xl mx-auto">
                      {language === 'Arabic' ? 'قم بسد الفجوة بين الأبحاث المخبرية والإنتاج التجريبي. تقييم علمي دقيق مخصص للباحثين.' : 'Bridge the gap between laboratory yields and pilot-scale production. Purely scientific assessment for researchers.'}
                    </p>
                  </div>
                </section>

                <section className="max-w-5xl mx-auto px-4 py-8 mb-16 relative z-10 bg-white">
                  <ResearchInputForm 
                    onAnalyze={handleResearchAnalyze} 
                    isLoading={status === 'ANALYZING'} 
                    initialInputs={initialResearchInputs}
                    language={language}
                  />
                  {error && <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold text-center">{error}</div>}
                </section>

                {status === 'ANALYZING' && (
                  <section className="max-w-5xl mx-auto px-4 py-20 text-center animate-pulse">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="flex space-x-2">
                        {[0, 1, 2].map(i => <div key={i} className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: `${i*0.2}s` }}></div>)}
                      </div>
                      <p className="text-slate-500 font-black uppercase tracking-widest text-xs">AI Scaling Engine Computing Scientific Benchmarks...</p>
                    </div>
                  </section>
                )}

                {status === 'COMPLETED' && researchAnalysis && (
                  <section id="research-dashboard" className="max-w-7xl mx-auto px-4 pb-20 bg-white">
                    <ResearchDashboard data={researchAnalysis} language={language} />
                  </section>
                )}
              </div>
            )}

            {researchView === 'HISTORY' && (
              <section className="max-w-5xl mx-auto px-4 py-12 animate-in fade-in duration-500">
                <ResearchHistory 
                  history={researchHistory} 
                  onSelect={handleSelectFromResearchHistory}
                  onClear={() => { if(window.confirm("Clear all research records?")) setResearchHistory([]); }}
                />
              </section>
            )}
          </div>
        )}
        {activeMainTab === 'SOLVER' && (
          <div className="animate-in fade-in duration-500">
            <section className="bg-white text-slate-900 border-b border-slate-200 py-12 px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                  {language === 'Arabic' ? (
                    <>أداة <span className="text-blue-600 underline decoration-blue-500/30">حل العوائق العلمية</span></>
                  ) : (
                    <>Scientific <span className="text-blue-600 underline decoration-blue-500/30">Challenge</span> Solver</>
                  )}
                </h1>
                <p className="text-md text-slate-600 max-w-2xl mx-auto">
                  {language === 'Arabic' ? 'حل الاختناقات التقنية في قطاع الوقود الحيوي في عُمان باستخدام وكلاء الذكاء الاصطناعي.' : "Solving technical bottlenecks in Oman's biofuel ecosystem through multi-agent scientific reasoning."}
                </p>
              </div>
            </section>
            <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10 bg-white">
              <ChallengeSolver 
                history={challengeHistory} 
                initialInputs={initialChallengeInputs}
                initialResult={initialChallengeResult}
                language={language}
                onSave={(entry) => {
                  setChallengeHistory(prev => [entry, ...prev]);
                  saveToUnifiedHistory({
                    name: entry.topic,
                    type: 'CHALLENGE',
                    inputs: { topic: entry.topic },
                    outputs: entry.fullData
                  });
                }}
                onClear={() => { if(window.confirm(language === 'Arabic' ? "هل أنت متأكد من مسح جميع السجلات؟" : "Clear all challenge history?")) setChallengeHistory([]); }}
              />
            </section>
          </div>
        )}
        {activeMainTab === 'OPTIMIZER' && (
          <div className="animate-in fade-in duration-500 bg-white min-h-screen">
            <section className="bg-white text-slate-900 border-b border-slate-200 py-12 px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                  {language === 'Arabic' ? (
                    <>التحسين <span className="text-emerald-600 underline decoration-emerald-500/30">المالي والانبعاثات</span></>
                  ) : (
                    <>Profit & <span className="text-emerald-600 underline decoration-emerald-500/30">Carbon</span> Optimizer</>
                  )}
                </h1>
                <p className="text-md text-slate-600 max-w-2xl mx-auto">
                  {language === 'Arabic' ? 'ذكاء اصطناعي لتعظيم الإيرادات وتقليل الانبعاثات الكربونية لمشاريع الوقود الحيوي.' : 'Strategic multi-agent AI to maximize revenue and minimize emissions for biofuel projects.'}
                </p>
              </div>
            </section>
            <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10 bg-white">
              <OptimizerTool 
                history={optimizerHistory}
                initialInputs={initialOptimizerInputs}
                initialResult={initialOptimizerResult}
                language={language}
                onSave={(entry) => {
                  setOptimizerHistory(prev => [entry, ...prev]);
                  saveToUnifiedHistory({
                    name: entry.projectName,
                    type: 'OPTIMIZER',
                    inputs: { projectName: entry.projectName },
                    outputs: entry.fullData,
                    carbonIntensity: entry.fullData.NetZeroRoadmap.CarbonIntensityEstimate
                  });
                }}
                onClear={() => { if(window.confirm(language === 'Arabic' ? "هل أنت متأكد من مسح جميع السجلات؟" : "Clear all optimization history?")) setOptimizerHistory([]); }}
              />
            </section>
          </div>
        )}
        {activeMainTab === 'STANDARDS' && (
          <div className="animate-in fade-in duration-500 bg-white min-h-screen">
            <section className="bg-white text-slate-900 border-b border-slate-200 py-12 px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                  {language === 'Arabic' ? (
                    <>أداة <span className="text-blue-600 underline decoration-blue-500/30">الامتثال والمعايير</span></>
                  ) : (
                    <>Standards <span className="text-blue-600 underline decoration-blue-500/30">Compliance</span> Checker</>
                  )}
                </h1>
                <p className="text-md text-slate-600 max-w-2xl mx-auto">
                  {language === 'Arabic' ? 'التحقق من نتائج المعامل المختبرية للوقود الحيوي واعتماديتها حسب المواصفات (ASTM/EN).' : 'Verify your biofuel lab results against international standards (ASTM/EN) for commercial viability in Oman.'}
                </p>
              </div>
            </section>
            <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10 pb-20 bg-white">
              <StandardsChecker language={language} />
            </section>
          </div>
        )}
        {activeMainTab === 'PROPOSAL' && (
          <div className="animate-in fade-in duration-500 bg-white min-h-screen">
            <section className="bg-white text-slate-900 border-b border-slate-200 py-12 px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                  {language === 'Arabic' ? (
                    <>توليد <span className="text-emerald-600 underline decoration-emerald-500/30">المقترحات الاستثمارية</span></>
                  ) : (
                    <>Automated <span className="text-emerald-600 underline decoration-emerald-500/30">Proposal</span> Generator</>
                  )}
                </h1>
                <p className="text-md text-slate-600 max-w-2xl mx-auto">
                  {language === 'Arabic' ? 'إصدار مقترحات احترافية تستند إلى البيانات الموثوقة والمخصصة لمنظومة التمويل في عُمان.' : "Generate professional, data-driven grant and investment proposals tailored for Oman's funding ecosystem."}
                </p>
              </div>
            </section>
            <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10 pb-20 bg-white">
              <ProposalGenerator language={language} />
            </section>
          </div>
        )}
        {activeMainTab === 'ZONES' && (
          <div className="animate-in fade-in duration-500 bg-white min-h-screen">
            <section className="bg-white text-slate-900 border-b border-slate-200 py-12 px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                  {language === 'Arabic' ? (
                    <>قاعدة بيانات <span className="text-blue-600 underline decoration-blue-500/30">المناطق الحرة</span></>
                  ) : (
                    <>Strategic <span className="text-blue-600 underline decoration-blue-500/30">Free Zones</span> Database</>
                  )}
                </h1>
                <p className="text-md text-slate-600 max-w-2xl mx-auto">
                  {language === 'Arabic' ? 'استكشف المناطق الاستراتيجية (الدقم، صحار، صلالة) لتحديد الموقع المثالي والدعم الحكومي المتوفر.' : "Explore Oman's free zones (Sohar, Duqm, Salalah) for optimal facility location."}
                </p>
              </div>
            </section>
            <section className="max-w-6xl mx-auto px-4 py-12 bg-white">
              <OmanFreeZones language={language} />
            </section>
          </div>
        )}
          <Footer />
          
          {/* Global Legal Disclaimer Footer */}
          <footer className="bg-slate-950 text-slate-400 py-6 text-center text-xs border-t border-slate-800 flex-shrink-0 z-50 mt-auto">
            <div className="max-w-5xl mx-auto px-6">
              <p className="mb-2 font-bold text-slate-300 text-sm flex justify-center items-center">
                <i className="fas fa-shield-alt mr-2 rtl:ml-2 rtl:mr-0 text-slate-500"></i>
                {language === 'Arabic' ? 'إخلاء مسؤولية قانوني (Disclaimer)' : 'Legal Disclaimer'}
              </p>
              <p className="max-w-4xl mx-auto leading-relaxed text-[10px] md:text-xs">
                {language === 'Arabic'
                  ? 'النتائج والتوقعات المالية والتقييمات المتولدة عبر هذا النظام المدعوم بالذكاء الاصطناعي هي لأغراض العصف الذهني والتقييم الأولي فقط. النظام مصمم لنمذجة المشاريع الخضراء والطاقة المتجددة ולא يشكل استشارة هندسية أو مالية معتمدة. يجب على المستخدمين التحقق من كافة الأرقام عبر خبراء معتمدين ومكاتب استشارية قبل أخذ أي قرار استثماري، ومطورو النظام لا يتحملون أي تبعات أو مسؤولية قانونية عن صحة ودقة هذه المخرجات.'
                  : 'The results, financial projections, and assessments generated by this AI system are for brainstorming and preliminary evaluation purposes only. The system is designed to model green tech and renewable energy projects and does not constitute certified engineering or financial advice. Users must verify all figures with accredited experts before making any investment decisions. The developers assume no legal liability for the accuracy or consequences of these outputs.'}
              </p>
            </div>
          </footer>
          </div>
        </main>
      </div>

      <UnifiedHistorySidebar 
        projects={unifiedProjects}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onSelect={handleSelectProject}
        onEdit={handleEditProject}
        onDelete={handleDeleteProject}
        onExport={handleExportReport}
      />
    </div>
  );
}
