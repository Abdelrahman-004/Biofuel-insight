import { Logo } from "./Logo";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home } from "./Home";
import { InputForm } from "./InputForm";
import { StandardsChecker } from "./StandardsChecker";
import { ProposalGenerator } from "./ProposalGenerator";
import { OmanEvPlatform } from "./OmanEvPlatform";
import { Marketplace } from "./Marketplace";

import { GisMap } from "./GisMap";
import { ChallengesHub } from "./ChallengesHub";

interface NavbarProps {
  activeTab: string;
  onTabChange: (
    tab:
      | "HOME"
      | "MARKETPLACE"
      | "GIS_MAP"
      | "INVESTOR_FEASIBILITY"
      | "RESEARCH"
      | "SOLVER"
      | "OPTIMIZER"
      | "STANDARDS"
      | "PROPOSAL"
      | "ZONES",
  ) => void;
  language: "English" | "Arabic";
  onLanguageChange: (lang: "English" | "Arabic") => void;
  theme: "dark" | "light";
  onThemeChange: (theme: "dark" | "light") => void;
  onUpgrade: () => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

const TopNavbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  language,
  onLanguageChange,
  theme,
  onThemeChange,
  onUpgrade,
  isSidebarOpen,
  onToggleSidebar,
}) => {
  const isArabic = language === "Arabic";
  return (
    <nav className="bg-[var(--nav-bg)] backdrop-blur-2xl text-[var(--text-primary)] sticky top-0 z-50 transition-all border-b border-[var(--border-glow)] shadow-none">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center space-x-3 md:space-x-8 rtl:space-x-reverse">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 bg-[var(--card-bg)] hover:bg-[var(--border-glow)] text-[var(--text-primary)] rounded-xl border border-[var(--border-glow)] transition flex items-center justify-center shadow-sm"
                aria-label="Toggle Navigation Menu"
              >
                <i className={`fas ${isSidebarOpen ? "fa-times" : "fa-bars"} text-sm md:text-base`}></i>
              </button>
            )}
            <div className="cursor-pointer" onClick={() => onTabChange("HOME")}>
              <Logo className="h-8 md:h-12" isArabic={language === "Arabic"} />
            </div>

            <div className="hidden lg:flex items-center space-x-4 rtl:space-x-reverse">
              {[
                {
                  id: "MARKETPLACE",
                  label: isArabic
                    ? "منصة الاستثمار الذكية"
                    : "Smart Marketplace",
                  icon: "fa-handshake",
                },
                {
                  id: "CHALLENGES_HUB",
                  label: isArabic
                    ? "تحديات وحلول الذكاء الاصطناعي"
                    : "Challenges & Solutions Hub",
                  icon: "fa-brain",
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id as any)}
                  className={`px-5 py-2.5 rounded-full transition-all text-xs font-black uppercase tracking-widest border flex items-center ${
                    activeTab === item.id
                      ? "bg-[var(--accent-emerald)]/10 border-var(--accent-emerald) text-[var(--accent-emerald)] dark:text-emerald-400 shadow-[0_0_15px_var(--border-glow)]"
                      : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5"
                  }`}
                >
                  <i
                    className={`fas ${item.icon} mr-2 flex-shrink-0 rtl:ml-2 rtl:mr-0`}
                  ></i>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-1.5 md:space-x-4 rtl:space-x-reverse">
            <button
              onClick={() => onThemeChange(theme === "dark" ? "light" : "dark")}
              className="px-2 md:px-3 py-1.5 md:py-2.5 bg-[var(--card-bg)] hover:bg-[var(--border-glow)] text-[var(--text-primary)] rounded-full border border-[var(--border-glow)] transition flex items-center text-[10px] md:text-xs font-bold shadow-sm"
              title="Toggle Theme"
            >
              <i
                className={`fas ${theme === "dark" ? "fa-sun text-amber-700 dark:text-amber-400" : "fa-moon text-indigo-700 dark:text-indigo-400"}`}
              ></i>
            </button>
            <button
              onClick={() => onLanguageChange(isArabic ? "English" : "Arabic")}
              className="px-2.5 md:px-4 py-1.5 md:py-2.5 bg-[var(--card-bg)] hover:bg-[var(--border-glow)] text-[var(--text-primary)] rounded-full border border-[var(--border-glow)] transition flex items-center text-[10px] md:text-xs font-bold shadow-sm"
            >
              <i className="fas fa-globe mx-1 md:mx-2 text-[var(--accent-emerald)] dark:text-emerald-400"></i>
              {isArabic ? "EN" : "AR"}
            </button>
            <div className="w-px h-6 bg-[var(--border-glow)] mx-1 md:mx-2 hidden md:block"></div>
            <div className="flex items-center justify-center space-x-1 md:space-x-2 rtl:space-x-reverse ml-1 md:ml-4">
              <button
                onClick={onUpgrade}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-2 md:px-4 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-wider md:tracking-widest shadow-md hover:scale-105 transition-transform"
              >
                <i className="fas fa-crown mr-0.5 md:mr-1"></i>{" "}
                {isArabic ? "ترقية" : "Upgrade"}
              </button>
              <button className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-[var(--card-bg)] border border-[var(--border-glow)] hover:border-[var(--accent-emerald)] shadow-sm transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <i className="fas fa-user-circle text-lg md:text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  language: "English" | "Arabic";
  isOpen: boolean;
  onToggle: () => void;
}

const SIDEBAR_GROUPS = [
  {
    id: "INVESTMENT",
    labelEn: "Companies & Investors",
    labelAr: "الشركات والمستثمرين",
    items: [
      {
        id: "INVESTOR_FEASIBILITY",
        labelEn: "Feasibility Tools",
        labelAr: "الجدوى الاستثمارية",
        icon: "fa-calculator",
        color: "#10B981",
        colorClass: "text-[var(--accent-emerald)] dark:text-emerald-400",
      },
      {
        id: "OPTIMIZER",
        labelEn: "Financial Optimizer",
        labelAr: "التحسين المالي",
        icon: "fa-chart-line",
        color: "#34D399",
        colorClass: "text-[var(--accent-emerald)] dark:text-emerald-400",
      },
      {
        id: "PROPOSAL",
        labelEn: "VoltOman Engine",
        labelAr: "محرك VoltOman للمركبات",
        icon: "fa-bolt-lightning",
        color: "#10B981",
        colorClass: "text-emerald-500 dark:text-emerald-400",
      },

      {
        id: "ZONES",
        labelEn: "Energy & Zones DB",
        labelAr: "بيئة الطاقة والاستثمار",
        icon: "fa-city",
        color: "#D97706",
        colorClass: "text-amber-700 dark:text-amber-400",
      },
      {
        id: "GIS_MAP",
        labelEn: "GIS Supply Map",
        labelAr: "خريطة التوريد الجغرافية",
        icon: "fa-map-marked-alt",
        color: "#EF4444",
        colorClass: "text-red-600 dark:text-red-400",
      },
    ],
  },
  {
    id: "RESEARCH_DEV",
    labelEn: "Researchers",
    labelAr: "الباحثين",
    items: [
      {
        id: "RESEARCH",
        labelEn: "Research Engine",
        labelAr: "تحليل البحوث",
        icon: "fa-microscope",
        color: "#3B82F6",
        colorClass: "text-blue-700 dark:text-blue-400",
      },
      {
        id: "SOLVER",
        labelEn: "Challenge Solver",
        labelAr: "حل العوائق",
        icon: "fa-lightbulb",
        color: "#F59E0B",
        colorClass: "text-amber-700 dark:text-amber-400",
      },
      {
        id: "STANDARDS",
        labelEn: "Standards Checks",
        labelAr: "المعايير والاشتراطات",
        icon: "fa-book",
        color: "#E2E8F0",
        colorClass: "text-[var(--text-secondary)] ",
      },
    ],
  },
];

const MainSidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  language,
  isOpen,
  onToggle,
}) => {
  const isArabic = language === "Arabic";
  const [expandedGroup, setExpandedGroup] = React.useState<string | null>(
    "INVESTMENT",
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden cursor-pointer"
          onClick={onToggle}
        />
      )}

      <aside
        className={`bg-[var(--nav-bg)] backdrop-blur-2xl transition-all duration-300 flex flex-col z-40 py-6 shadow-none border-t-0
          lg:relative lg:translate-x-0 lg:flex lg:flex-shrink-0
          ${isOpen ? "w-72 translate-x-0 flex" : "w-20 -translate-x-full lg:translate-x-0 hidden lg:flex"}
          fixed inset-y-0 ${isArabic ? "right-0 border-l border-[var(--border-glow)]" : "left-0 border-r border-[var(--border-glow)]"} h-full lg:h-auto lg:border-r-0 lg:border-l-0
        `}
      >
        <button
          onClick={onToggle}
          className={`mx-4 mb-6 flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--bg-main)] hover:bg-[var(--border-glow)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition border border-[var(--border-glow)] ${isOpen ? "self-end" : "mx-auto"}`}
        >
          <i
            className={`fas ${isOpen ? "fa-times" : "fa-chevron-" + (isArabic ? "left" : "right")}`}
          ></i>
        </button>

        <div
          className={`flex flex-col space-y-2 px-3 ${!isOpen && "items-center"} animate-in fade-in duration-300`}
        >
        {SIDEBAR_GROUPS.map((group) => (
          <div key={group.id} className="flex flex-col w-full mb-2">
            <button
              onClick={() => {
                if (!isOpen) onToggle();
                setExpandedGroup(expandedGroup === group.id ? null : group.id);
              }}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                expandedGroup === group.id
                  ? "bg-[var(--border-glow)] text-[var(--text-primary)]"
                  : "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--border-glow)] hover:text-[var(--text-primary)]"
              }`}
            >
              {isOpen ? (
                <span className="text-xs font-black uppercase tracking-widest text-left rtl:text-right">
                  {isArabic ? group.labelAr : group.labelEn}
                </span>
              ) : (
                <i
                  className={`fas ${group.id === "INVESTMENT" ? "fa-briefcase" : "fa-microscope"} text-lg mx-auto`}
                ></i>
              )}
              {isOpen && (
                <i
                  className={`fas fa-chevron-${expandedGroup === group.id ? "down" : isArabic ? "left" : "right"} text-xs opacity-70`}
                ></i>
              )}
            </button>

            {isOpen && expandedGroup === group.id && (
              <div className="flex flex-col space-y-1 w-full mt-2 pl-2 rtl:pr-2 rtl:pl-0 border-l border-r-0 rtl:border-l-0 rtl:border-r border-[var(--border-glow)] ml-2 rtl:mr-2 rtl:ml-0">
                {group.items.map((item) => {
                  const isActive =
                    activeTab === item.id ||
                    (activeTab === "FEASIBILITY" &&
                      item.id === "INVESTOR_FEASIBILITY");
                  return (
                    <button
                      key={item.id}
                      onClick={() => onTabChange(item.id)}
                      className={`relative flex items-center p-3 rounded-lg transition-all group mb-1 justify-start overflow-hidden ${
                        isActive
                          ? "bg-transparent text-[var(--text-primary)]"
                          : "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-glow)]"
                      }`}
                      title={isArabic ? item.labelAr : item.labelEn}
                    >
                      {isActive && (
                        <div
                          className={`absolute ${isArabic ? "right-0" : "left-0"} top-0 bottom-0 w-1 rounded-full dark:opacity-100 opacity-80`}
                          style={{
                            backgroundColor: item.color,
                            boxShadow: `0 0 10px ${item.color}`,
                          }}
                        />
                      )}
                      <span
                        className={`text-sm font-bold uppercase tracking-wider whitespace-nowrap text-left rtl:text-right transition-all ${isArabic ? "mr-4" : "ml-4"}`}
                        style={
                          isActive
                            ? { textShadow: `0 0 10px ${item.color}` }
                            : {}
                        }
                      >
                        {isArabic ? item.labelAr : item.labelEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
   </>
  );
};

const Footer: React.FC<{ language: string }> = ({ language }) => {
  return (
    <footer className="bg-[var(--card-bg)] shadow-card text-[var(--text-secondary)] py-20 border-t border-[var(--border-glow)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-16 items-start">
          <div className="text-center md:text-left">
            <div className="flex items-center space-x-2 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all">
              <Logo
                className="h-8"
                isArabic={language === "Arabic"}
                showText={false}
              />
              <span className="text-xs font-black tracking-tighter text-[var(--accent-emerald)]">
                OMAN ECOSYNC
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-xs mx-auto md:mx-0 font-medium">
              The next-generation intelligence layer for Oman's clean energy
              infrastructure, sustainability modeling, and research.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-6">
            <div className="flex space-x-12">
              <a
                href="#"
                className="hover:text-[var(--accent-emerald)] dark:text-emerald-400 transition text-xs font-black uppercase tracking-[0.3em]"
              >
                Terms
              </a>
              <a
                href="#"
                className="hover:text-[var(--accent-emerald)] dark:text-emerald-400 transition text-xs font-black uppercase tracking-[0.3em]"
              >
                Policy
              </a>
              <a
                href="#"
                className="hover:text-[var(--accent-emerald)] dark:text-emerald-400 transition text-xs font-black uppercase tracking-[0.3em]"
              >
                Contact
              </a>
            </div>
            <div className="flex space-x-8">
              <i className="fab fa-linkedin hover:text-[var(--accent-emerald)] dark:text-emerald-400 cursor-pointer transition text-xl"></i>
              <i className="fab fa-twitter hover:text-[var(--accent-emerald)] dark:text-emerald-400 cursor-pointer transition text-xl"></i>
              <i className="fab fa-instagram hover:text-[var(--accent-emerald)] dark:text-emerald-400 cursor-pointer transition text-xl"></i>
              <i className="fas fa-envelope hover:text-[var(--accent-emerald)] dark:text-emerald-400 cursor-pointer transition text-xl"></i>
            </div>
          </div>
          <div className="text-center md:text-right">
            <h4 className="text-[var(--text-primary)] font-black uppercase tracking-widest text-xs mb-4">
              {language === "Arabic"
                ? "شركاء استراتيجيون"
                : "Strategic Partners"}
            </h4>
            <p className="text-xs leading-relaxed opacity-50 font-bold uppercase tracking-widest">
              Sohar Free Zone • SEZAD • Salalah Port • ASYAD
            </p>
          </div>
        </div>
        <div className="mt-20 pt-10 border-t border-[var(--border-glow)] text-center">
          <p className="text-xs uppercase tracking-[0.4em] font-black text-[var(--text-secondary)]">
            © 2026 OMAN ECOSYNC. PROPELLED BY ADVANCED INTELLIGENCE.
          </p>
        </div>
      </div>
    </footer>
  );
};
import { Dashboard } from "./Dashboard";
import { ProjectHistory } from "./ProjectHistory";
import { CompareProjects } from "./CompareProjects";
import { GlobalStandards } from "./GlobalStandards";
import { OmanFreeZones } from "./OmanFreeZones";
import { ResearchInputForm } from "./ResearchInputForm";
import { ResearchDashboard } from "./ResearchDashboard";
import { ResearchHistory } from "./ResearchHistory";
import { ChallengeSolver } from "./ChallengeSolver";
import { OptimizerTool } from "./OptimizerTool";
import { UnifiedHistorySidebar } from "./UnifiedHistorySidebar";
import { analyzeProject, analyzeResearchImplementation } from "./geminiService";
import {
  BioFuelAnalysis,
  AnalysisStatus,
  ProjectHistoryEntry,
  ResearchImplementationAnalysis,
  ChallengeHistoryEntry,
  OptimizerHistoryEntry,
  UnifiedProject,
  ProjectType,
} from "./types";
import { auth } from "./firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import UsageBanner from "./UsageBanner";
import PricingModal from "./PricingModal";
import { checkUsageLimit, incrementUsage, getUserPlan } from "./usageService";

const FreePlanWatermark = ({ onClick }: { onClick: () => void }) => (
  <div
    onClick={onClick}
    className="absolute inset-0 z-40 pointer-events-none flex flex-col items-center justify-center bg-transparent overflow-hidden opacity-30 select-none"
  >
    {Array.from({ length: 10 }).map((_, i) => (
      <div
        key={i}
        className="text-4xl font-black text-slate-500 tracking-widest whitespace-nowrap mb-24"
        style={{ transform: "rotate(-35deg)" }}
      >
        FREE PLAN — UPGRADE FOR FULL REPORTS
      </div>
    ))}
  </div>
);

const STORAGE_KEY = "biofuel_insight_history";
const RESEARCH_STORAGE_KEY = "biofuel_insight_research_history";
const CHALLENGE_STORAGE_KEY = "biofuel_insight_challenge_history";
const OPTIMIZER_STORAGE_KEY = "biofuel_insight_optimizer_history";
const UNIFIED_HISTORY_KEY = "biofuel_insight_unified_history";
const ACTIVE_TAB_KEY = "biofuel_insight_active_tab";
const CURRENT_ANALYSIS_KEY = "biofuel_insight_current_analysis";
const CURRENT_RESEARCH_KEY = "biofuel_insight_current_research";

type MainTab =
  | "HOME"
  | "MARKETPLACE"
  | "CHALLENGES_HUB"
  | "GIS_MAP"
  | "FEASIBILITY"
  | "INVESTOR_FEASIBILITY"
  | "RESEARCH"
  | "SOLVER"
  | "OPTIMIZER"
  | "STANDARDS"
  | "PROPOSAL"
  | "ZONES";
type FeasibilityView = "ANALYZE" | "HISTORY" | "COMPARE";
type ResearchView = "ANALYZE" | "HISTORY";

export default function App() {
  const [activeMainTab, setActiveMainTab] = React.useState<MainTab>("HOME");
  const [feasibilityView, setFeasibilityView] =
    React.useState<FeasibilityView>("ANALYZE");
  const [researchView, setResearchView] =
    React.useState<ResearchView>("ANALYZE");
  const [language, setLanguage] = React.useState<"English" | "Arabic">(
    "Arabic",
  ); // Start with Arabic mostly because user requested Arabic translation first
  const [theme, setTheme] = React.useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("omaneocs_theme");
      if (saved === "dark" || saved === "light") return saved;
    }
    return "light";
  });
  const [status, setStatus] = React.useState<AnalysisStatus>("IDLE");
  const [analysis, setAnalysis] = React.useState<BioFuelAnalysis | null>(null);
  const [researchAnalysis, setResearchAnalysis] =
    React.useState<ResearchImplementationAnalysis | null>(null);
  const [history, setHistory] = React.useState<ProjectHistoryEntry[]>([]);
  const [researchHistory, setResearchHistory] = React.useState<
    ResearchImplementationAnalysis[]
  >([]);
  const [challengeHistory, setChallengeHistory] = React.useState<
    ChallengeHistoryEntry[]
  >([]);
  const [optimizerHistory, setOptimizerHistory] = React.useState<
    OptimizerHistoryEntry[]
  >([]);
  const [unifiedProjects, setUnifiedProjects] = React.useState<
    UnifiedProject[]
  >([]);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isMainSidebarOpen, setIsMainSidebarOpen] = React.useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const [initialFeasibilityInputs, setInitialFeasibilityInputs] =
    React.useState<any>(null);
  const [initialResearchInputs, setInitialResearchInputs] =
    React.useState<any>(null);
  const [initialChallengeInputs, setInitialChallengeInputs] =
    React.useState<any>(null);
  const [initialOptimizerInputs, setInitialOptimizerInputs] =
    React.useState<any>(null);
  const [initialChallengeResult, setInitialChallengeResult] =
    React.useState<any>(null);
  const [initialOptimizerResult, setInitialOptimizerResult] =
    React.useState<any>(null);
  const [comparisonItems, setComparisonItems] = React.useState<
    ProjectHistoryEntry[]
  >([]);
  const [error, setError] = React.useState<string | null>(null);

  const [user, setUser] = React.useState<User | null>(null);
  const [showPricing, setShowPricing] = React.useState(false);
  const [userPlan, setUserPlan] = React.useState<any>(null);
  const [usageRefresh, setUsageRefresh] = React.useState(0);

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
      } else {
        setUser(null);
      }
    });
    return unsub;
  }, []);

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsMainSidebarOpen(false);
    }
  }, []);

  const handleAnalysisRequest = async <T,>(
    analysisFunction: () => Promise<T>,
    toolName?: string,
  ): Promise<T | undefined> => {
    if (!user) {
      console.warn(
        "User is not authenticated (auth failed). Bypassing usage limits to fail open.",
      );
      return await analysisFunction();
    }
    const usage = await checkUsageLimit(user.uid, toolName);
    if (!usage.allowed) {
      setShowPricing(true);
      return undefined;
    }
    await incrementUsage(user.uid, toolName);
    setUsageRefresh((r) => r + 1);
    return await analysisFunction();
  };

  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
    const savedResearch = localStorage.getItem(RESEARCH_STORAGE_KEY);
    if (savedResearch) {
      try {
        const parsed = JSON.parse(savedResearch);
        // Validate that the loaded data matches the current schema (has USD/OMR structure)
        const isValid =
          Array.isArray(parsed) &&
          parsed.every(
            (item: any) =>
              item.CostEstimation?.EquipmentCosts?.ReactorSystem?.USD !==
              undefined,
          );

        if (isValid) {
          setResearchHistory(parsed);
        } else {
          console.warn(
            "Cleared incompatible research history due to schema update.",
          );
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
      try {
        setChallengeHistory(JSON.parse(savedChallenge));
      } catch (e) {
        console.error(e);
      }
    }

    const savedOptimizer = localStorage.getItem(OPTIMIZER_STORAGE_KEY);
    if (savedOptimizer) {
      try {
        setOptimizerHistory(JSON.parse(savedOptimizer));
      } catch (e) {
        console.error(e);
      }
    }

    const savedUnified = localStorage.getItem(UNIFIED_HISTORY_KEY);
    if (savedUnified) {
      try {
        setUnifiedProjects(JSON.parse(savedUnified));
      } catch (e) {
        console.error(e);
      }
    }

    const savedTab = localStorage.getItem(ACTIVE_TAB_KEY);
    if (savedTab) setActiveMainTab(savedTab as MainTab);

    const savedTheme = localStorage.getItem("omaneocs_theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }

    const savedAnalysis = localStorage.getItem(CURRENT_ANALYSIS_KEY);
    if (savedAnalysis) {
      try {
        setAnalysis(JSON.parse(savedAnalysis));
        setStatus("COMPLETED");
      } catch (e) {
        console.error(e);
      }
    }

    const savedResearchAnalysis = localStorage.getItem(CURRENT_RESEARCH_KEY);
    if (savedResearchAnalysis) {
      try {
        setResearchAnalysis(JSON.parse(savedResearchAnalysis));
        setStatus("COMPLETED");
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  React.useEffect(() => {
    localStorage.setItem(RESEARCH_STORAGE_KEY, JSON.stringify(researchHistory));
  }, [researchHistory]);

  React.useEffect(() => {
    localStorage.setItem(
      CHALLENGE_STORAGE_KEY,
      JSON.stringify(challengeHistory),
    );
  }, [challengeHistory]);

  React.useEffect(() => {
    localStorage.setItem(
      OPTIMIZER_STORAGE_KEY,
      JSON.stringify(optimizerHistory),
    );
  }, [optimizerHistory]);

  React.useEffect(() => {
    localStorage.setItem(UNIFIED_HISTORY_KEY, JSON.stringify(unifiedProjects));
  }, [unifiedProjects]);

  React.useEffect(() => {
    localStorage.setItem(ACTIVE_TAB_KEY, activeMainTab);
  }, [activeMainTab]);

  React.useEffect(() => {
    if (analysis)
      localStorage.setItem(CURRENT_ANALYSIS_KEY, JSON.stringify(analysis));
    else localStorage.removeItem(CURRENT_ANALYSIS_KEY);
  }, [analysis]);

  React.useEffect(() => {
    if (researchAnalysis)
      localStorage.setItem(
        CURRENT_RESEARCH_KEY,
        JSON.stringify(researchAnalysis),
      );
    else localStorage.removeItem(CURRENT_RESEARCH_KEY);
  }, [researchAnalysis]);

  React.useEffect(() => {
    localStorage.setItem("omaneocs_theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const saveToUnifiedHistory = (
    project: Omit<UnifiedProject, "id" | "createdAt">,
  ) => {
    const newProject: UnifiedProject = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toLocaleString(),
    };
    setUnifiedProjects((prev) => [newProject, ...prev]);
  };

  const handleAnalyze = React.useCallback(
    async (inputs: {
      projectName: string;
      location: string;
      category: "Biofuel" | "Renewable Energy";
      feedstock: string;
      projectScale: string;
      production: number;
      budget: number;
      sellingPrice: number;
      electricityCost?: number;
      laborCost?: number;
      co2Source?: string;
      advancedParams?: any;
    }) => {
      setStatus("ANALYZING");
      setError(null);
      setAnalysis(null);
      localStorage.removeItem(CURRENT_ANALYSIS_KEY);
      setInitialFeasibilityInputs(null);
      try {
        const result = await handleAnalysisRequest(
          () => analyzeProject({ ...inputs, language }),
          "FEASIBILITY",
        );
        if (!result) {
          setStatus("IDLE");
          return;
        }
        setAnalysis(result);
        setStatus("COMPLETED");

        const newEntry: ProjectHistoryEntry = {
          id: Date.now().toString(),
          projectName: result.ProjectAnalyzer.ProjectName,
          location: result.ProjectAnalyzer.Location,
          feedstock: result.ProjectAnalyzer.Feedstock,
          energyDomain: result.EnergyDomain,
          production:
            (result.ProjectAnalyzer.ExpectedProduction || 0) > 0
              ? `${result.ProjectAnalyzer.ExpectedProduction!.toLocaleString()} ${result.ProjectAnalyzer.TechnologyCategory === "Biofuel" ? "Tons" : "MWh"}`
              : "Not Provided",
          budget:
            (result.ProjectAnalyzer.PreliminaryBudgetUSD || 0) > 0
              ? `$${result.ProjectAnalyzer.PreliminaryBudgetUSD!.toLocaleString()}`
              : "Not Provided",
          score: result.FinalFeasibilityScore,
          level: result.EconomicFeasibility.Assessment,
          timestamp: new Date().toLocaleString(),
          fullData: result,
        };

        setHistory((prev) => [...prev, newEntry]);

        saveToUnifiedHistory({
          name: result.ProjectAnalyzer.ProjectName,
          type: "FEASIBILITY",
          inputs: inputs,
          outputs: result,
          score: result.FinalFeasibilityScore,
        });

        setTimeout(() => {
          document
            .getElementById("dashboard-view")
            ?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } catch (err: any) {
        setError(
          err.message ||
            "An error occurred during analysis. Check your connection or parameters.",
        );
        setStatus("ERROR");
      }
    },
    [language],
  );

  const handleSelectFromHistory = (entry: ProjectHistoryEntry) => {
    setAnalysis(entry.fullData);
    setStatus("COMPLETED");
    setFeasibilityView("ANALYZE");
    setTimeout(() => {
      document
        .getElementById("dashboard-view")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleCompare = (selectedIds: string[]) => {
    const items = history.filter((h) => selectedIds.includes(h.id));
    setComparisonItems(items);
    setFeasibilityView("COMPARE");
  };

  const handleResearchAnalyze = React.useCallback(
    async (inputs: any) => {
      setStatus("ANALYZING");
      setError(null);
      setResearchAnalysis(null);
      localStorage.removeItem(CURRENT_RESEARCH_KEY);
      setInitialResearchInputs(null);
      try {
        const result = await handleAnalysisRequest(
          () => analyzeResearchImplementation(inputs, language),
          "RESEARCH",
        );
        if (!result) {
          setStatus("IDLE");
          return;
        }
        setResearchAnalysis(result);
        setResearchHistory((prev) => [result, ...prev]);

        saveToUnifiedHistory({
          name: inputs.feedstockType || "Unnamed Research",
          type: "RESEARCH",
          inputs: inputs,
          outputs: result,
          score: result.ReadinessScore.OverallScore,
        });

        setStatus("COMPLETED");
        setResearchView("ANALYZE");
        setTimeout(() => {
          document
            .getElementById("research-dashboard")
            ?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } catch (err: any) {
        setError(err.message || "An error occurred during research analysis.");
        setStatus("ERROR");
      }
    },
    [language],
  );

  const handleSelectFromResearchHistory = (
    entry: ResearchImplementationAnalysis,
  ) => {
    setResearchAnalysis(entry);
    setStatus("COMPLETED");
    setResearchView("ANALYZE");
    setTimeout(() => {
      document
        .getElementById("research-dashboard")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSelectProject = (project: UnifiedProject) => {
    setActiveMainTab(
      project.type === "FEASIBILITY"
        ? "INVESTOR_FEASIBILITY"
        : (project.type as MainTab),
    );

    if (project.type === "FEASIBILITY") {
      setAnalysis(project.outputs);
      setFeasibilityView("ANALYZE");
    } else if (project.type === "RESEARCH") {
      setResearchAnalysis(project.outputs);
      setResearchView("ANALYZE");
    } else if (project.type === "CHALLENGE") {
      setInitialChallengeResult(project.outputs);
    } else if (project.type === "OPTIMIZER") {
      setInitialOptimizerResult(project.outputs);
    }

    setStatus("COMPLETED");
    setIsSidebarOpen(false);
    setTimeout(() => {
      const id =
        project.type === "FEASIBILITY"
          ? "dashboard-view"
          : "research-dashboard";
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleEditProject = (project: UnifiedProject) => {
    setActiveMainTab(
      project.type === "FEASIBILITY"
        ? "INVESTOR_FEASIBILITY"
        : (project.type as MainTab),
    );

    if (project.type === "FEASIBILITY") {
      setInitialFeasibilityInputs(project.inputs);
      setFeasibilityView("ANALYZE");
      setAnalysis(null);
      localStorage.removeItem(CURRENT_ANALYSIS_KEY);
    } else if (project.type === "RESEARCH") {
      setInitialResearchInputs(project.inputs);
      setResearchView("ANALYZE");
      setResearchAnalysis(null);
      localStorage.removeItem(CURRENT_RESEARCH_KEY);
    } else if (project.type === "CHALLENGE") {
      setInitialChallengeInputs(project.inputs);
    } else if (project.type === "OPTIMIZER") {
      setInitialOptimizerInputs(project.inputs);
    }

    setIsSidebarOpen(false);
    setStatus("IDLE"); // Reset status to show the form
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setUnifiedProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  React.useEffect(() => {
    if (!user) return;
    getUserPlan(user.uid)
      .then((plan) => {
        setUserPlan(plan);
      })
      .catch(console.error);
  }, [user, usageRefresh]);

  const handleExportReport = (project: UnifiedProject) => {
    if (userPlan === "free") {
      setShowPricing(true);
      return;
    }
    const reportData = JSON.stringify(project, null, 2);
    const blob = new Blob([reportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, "_")}_Report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderFeasibilityTool = () => (
    <>
      <div className="bg-emerald-900 pt-4 px-4 flex justify-center">
        <div className="flex space-x-1 bg-emerald-950/50 p-1 rounded-xl shadow-inner">
          {[
            { id: "ANALYZE", icon: "fa-microchip", label: "Analyze" },
            { id: "HISTORY", icon: "fa-history", label: "History" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFeasibilityView(tab.id as FeasibilityView)}
              className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                feasibilityView === tab.id
                  ? "bg-[var(--accent-emerald)] text-white shadow-card translate-y-[-2px]"
                  : "text-[var(--accent-emerald)] dark:text-emerald-400 hover:text-[var(--text-primary)] dark:hover:text-[var(--text-primary)]"
              }`}
            >
              <i className={`fas ${tab.icon} mr-2`}></i> {tab.label}
              {tab.id === "HISTORY" && history.length > 0 && (
                <span className="ml-2 bg-emerald-400 text-emerald-900 w-4 h-4 rounded-full inline-flex items-center justify-center text-[8px] font-black">
                  {history.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {feasibilityView === "ANALYZE" && (
        <div className="animate-in fade-in duration-500 bg-[var(--bg-main)] min-h-screen">
          <section className="bg-[var(--bg-main)] text-[var(--text-primary)] border-b border-[var(--border-glow)] py-12 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                {language === "Arabic" ? (
                  <>
                    أداة{" "}
                    <span className="text-[var(--accent-emerald)] dark:text-emerald-400 underline decoration-emerald-500/30 glow-text-emerald">
                      تحليل الجدوى الاستثمارية
                    </span>
                  </>
                ) : (
                  <>
                    Investor{" "}
                    <span className="text-[var(--accent-emerald)] dark:text-emerald-400 underline decoration-emerald-500/30 glow-text-emerald">
                      Feasibility
                    </span>{" "}
                    Tool
                  </>
                )}
              </h1>
              <p className="text-md text-[var(--text-secondary)] max-w-2xl mx-auto">
                {language === "Arabic"
                  ? "قم بتقييم الجدوى الاقتصادية والتقنية لمسارات الوقود الحيوي والطاقة ضمن المناطق الاستراتيجية في عُمان."
                  : "Evaluate technical and economic viability for Biofuel, Hydrogen, and Carbon pathways across Oman's strategic zones."}
              </p>
            </div>
          </section>

          <section className="max-w-5xl mx-auto px-4 py-8 relative z-10 bg-[var(--bg-main)]">
            <InputForm
              onAnalyze={handleAnalyze}
              isLoading={status === "ANALYZING"}
              initialInputs={initialFeasibilityInputs}
              language={language}
            />
            {error && (
              <div className="mt-6 p-4 bg-[var(--bg-main)] border border-red-200 text-red-700 rounded-xl text-xs font-bold text-center">
                {error}
              </div>
            )}
          </section>

          {status === "ANALYZING" && (
            <section className="max-w-5xl mx-auto px-4 py-20 text-center animate-pulse">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex space-x-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-3 h-3 bg-emerald-600 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    ></div>
                  ))}
                </div>
                <p className="text-[var(--text-secondary)] font-black uppercase tracking-widest text-xs">
                  AI Assessment Engine Computing Regional Benchmarks...
                </p>
              </div>
            </section>
          )}

          {status === "COMPLETED" && analysis && (
            <section
              id="dashboard-view"
              className="max-w-7xl mx-auto px-4 pb-20 bg-[var(--bg-main)]"
            >
              <Dashboard
                key={`${analysis.ProjectAnalyzer?.ProjectName || "project"}_${analysis.ProjectAnalyzer?.ExpectedProduction || 0}_${analysis.EconomicFeasibility?.RealisticRequiredCAPEX || 0}_${analysis.FinalFeasibilityScore || 0}`}
                data={analysis}
                language={language}
              />
            </section>
          )}
        </div>
      )}

      {feasibilityView === "HISTORY" && (
        <section className="max-w-5xl mx-auto px-4 py-12 animate-in fade-in duration-500 bg-[var(--bg-main)]">
          <ProjectHistory
            history={history}
            onSelect={handleSelectFromHistory}
            onCompare={handleCompare}
            onClear={() => {
              if (window.confirm("Clear all historical records?"))
                setHistory([]);
            }}
          />
        </section>
      )}

      {feasibilityView === "COMPARE" && (
        <section className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in duration-500 bg-[var(--bg-main)]">
          <CompareProjects
            entries={comparisonItems}
            onBack={() => setFeasibilityView("HISTORY")}
          />
        </section>
      )}
    </>
  );
  return (
    <div
      className="h-screen flex flex-col font-sans bg-[var(--bg-main)] text-[var(--text-primary)] selection:bg-[var(--accent-emerald)]/30 selection:text-[var(--accent-emerald)] dark:text-emerald-400 transition-colors duration-500 overflow-hidden relative"
      dir={language === "Arabic" ? "rtl" : "ltr"}
    >
      {/* Global Animated Background Overlay */}
      {activeMainTab !== "HOME" && (
        <>
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--border-glow) 1px, transparent 1px), linear-gradient(to bottom, var(--border-glow) 1px, transparent 1px)",
              backgroundSize: "4rem 4rem",
              opacity: 0.15,
            }}
          ></div>
          <motion.div
            animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
            transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--accent-emerald)]/5 blur-[150px] rounded-full pointer-events-none z-0"
          ></motion.div>
          <motion.div
            animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
            transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 w-[600px] h-[800px] bg-[#8B5CF6]/5 blur-[150px] rounded-full pointer-events-none z-0"
          ></motion.div>
        </>
      )}

      <TopNavbar
        activeTab={activeMainTab}
        onTabChange={(tab) => {
          setActiveMainTab(tab);
          if (tab === "INVESTOR_FEASIBILITY" && feasibilityView === "COMPARE")
            setFeasibilityView("ANALYZE");
          if (window.innerWidth < 1024) {
            setIsMainSidebarOpen(false);
          }
        }}
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onThemeChange={setTheme}
        onUpgrade={() => setShowPricing(true)}
        isSidebarOpen={isMainSidebarOpen}
        onToggleSidebar={() => setIsMainSidebarOpen(!isMainSidebarOpen)}
      />

      <div className="flex flex-1 overflow-hidden relative z-10">
        <MainSidebar
          activeTab={activeMainTab}
          onTabChange={(tab) => {
            setActiveMainTab(tab);
            if (tab === "INVESTOR_FEASIBILITY" && feasibilityView === "COMPARE")
              setFeasibilityView("ANALYZE");
            if (window.innerWidth < 1024) {
              setIsMainSidebarOpen(false);
            }
          }}
          language={language}
          isOpen={isMainSidebarOpen}
          onToggle={() => setIsMainSidebarOpen(!isMainSidebarOpen)}
        />

        <main className="flex-1 overflow-y-auto relative">
          <div className="min-h-full flex flex-col relative">
            {activeMainTab !== "HOME" && userPlan === "free" && (
              <FreePlanWatermark onClick={() => setShowPricing(true)} />
            )}

            {activeMainTab !== "HOME" &&
              activeMainTab !== "MARKETPLACE" &&
              activeMainTab !== "GIS_MAP" && (
                <UsageBanner
                  uid={user?.uid}
                  language={language}
                  onUpgradeClick={() => setShowPricing(true)}
                  planRefreshTrigger={usageRefresh}
                />
              )}

            {activeMainTab === "HOME" && (
              <Home
                onStart={(tab) => setActiveMainTab(tab)}
                language={language}
              />
            )}
            {activeMainTab === "MARKETPLACE" && (
              <section className="max-w-7xl mx-auto px-4 py-8 flex-1">
                <Marketplace language={language} />
              </section>
            )}
            {activeMainTab === "CHALLENGES_HUB" && (
              <section className="flex-1 w-full bg-[var(--bg-main)]">
                <ChallengesHub language={language} theme={theme} />
              </section>
            )}
            {activeMainTab === "GIS_MAP" && (
              <section className="max-w-7xl mx-auto px-4 py-8 flex-1">
                <GisMap 
                  language={language} 
                  theme={theme} 
                  onNavigateToTab={(tab) => setActiveMainTab(tab as any)}
                  defaultEvStationsLayer={true}
                />
              </section>
            )}
            {(activeMainTab === "INVESTOR_FEASIBILITY" ||
              activeMainTab === "FEASIBILITY") &&
              renderFeasibilityTool()}
            {activeMainTab === "RESEARCH" && (
              <div className="animate-in fade-in duration-500">
                <div className="bg-blue-900 pt-4 px-4 flex justify-center">
                  <div className="flex space-x-1 bg-blue-950/50 p-1 rounded-xl shadow-inner">
                    {[
                      {
                        id: "ANALYZE",
                        icon: "fa-microscope",
                        label: "Analyze",
                      },
                      { id: "HISTORY", icon: "fa-history", label: "History" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setResearchView(tab.id as ResearchView)}
                        className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                          researchView === tab.id
                            ? "bg-blue-700 text-white dark:bg-blue-700 dark:bg-blue-600 shadow-card translate-y-[-2px]"
                            : "text-blue-700 dark:text-blue-400 hover:text-[var(--text-primary)] dark:hover:text-[var(--text-primary)]"
                        }`}
                      >
                        <i className={`fas ${tab.icon} mr-2`}></i> {tab.label}
                        {tab.id === "HISTORY" && researchHistory.length > 0 && (
                          <span className="ml-2 bg-blue-400 text-blue-900 w-4 h-4 rounded-full inline-flex items-center justify-center text-[8px] font-black">
                            {researchHistory.length}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {researchView === "ANALYZE" && (
                  <div className="bg-[var(--bg-main)] min-h-screen">
                    <section className="bg-[var(--bg-main)] text-[var(--text-primary)] border-b border-[var(--border-glow)] py-12 px-4">
                      <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                          {language === "Arabic" ? (
                            <>
                              مُحَلِّل{" "}
                              <span className="text-blue-700 dark:text-blue-400 underline decoration-blue-500/30">
                                البحوث المخبرية والتطبيقية
                              </span>
                            </>
                          ) : (
                            <>
                              Research Implementation{" "}
                              <span className="text-blue-700 dark:text-blue-400 underline decoration-blue-500/30">
                                Analyzer
                              </span>
                            </>
                          )}
                        </h1>
                        <p className="text-md text-[var(--text-secondary)] max-w-2xl mx-auto">
                          {language === "Arabic"
                            ? "قم بسد الفجوة بين الأبحاث المخبرية والإنتاج التجريبي. تقييم علمي دقيق مخصص للباحثين."
                            : "Bridge the gap between laboratory yields and pilot-scale production. Purely scientific assessment for researchers."}
                        </p>
                      </div>
                    </section>

                    <section className="max-w-5xl mx-auto px-4 py-8 mb-16 relative z-10 bg-[var(--bg-main)]">
                      <ResearchInputForm
                        onAnalyze={handleResearchAnalyze}
                        isLoading={status === "ANALYZING"}
                        initialInputs={initialResearchInputs}
                        language={language}
                      />
                      {error && (
                        <div className="mt-6 p-4 bg-[var(--bg-main)] border border-red-200 text-red-700 rounded-xl text-xs font-bold text-center">
                          {error}
                        </div>
                      )}
                    </section>

                    {status === "ANALYZING" && (
                      <section className="max-w-5xl mx-auto px-4 py-20 text-center animate-pulse">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="flex space-x-2">
                            {[0, 1, 2].map((i) => (
                              <div
                                key={i}
                                className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                                style={{ animationDelay: `${i * 0.2}s` }}
                              ></div>
                            ))}
                          </div>
                          <p className="text-[var(--text-secondary)] font-black uppercase tracking-widest text-xs">
                            AI Scaling Engine Computing Scientific Benchmarks...
                          </p>
                        </div>
                      </section>
                    )}

                    {status === "COMPLETED" && researchAnalysis && (
                      <section
                        id="research-dashboard"
                        className="max-w-7xl mx-auto px-4 pb-20 bg-[var(--bg-main)]"
                      >
                        <ResearchDashboard
                          key={`${researchAnalysis.id || researchAnalysis.timestamp || Date.now()}`}
                          data={researchAnalysis}
                          language={language}
                        />
                      </section>
                    )}
                  </div>
                )}

                {researchView === "HISTORY" && (
                  <section className="max-w-5xl mx-auto px-4 py-12 animate-in fade-in duration-500 bg-[var(--bg-main)]">
                    <ResearchHistory
                      history={researchHistory}
                      onSelect={handleSelectFromResearchHistory}
                      onClear={() => {
                        if (window.confirm("Clear all research records?"))
                          setResearchHistory([]);
                      }}
                    />
                  </section>
                )}
              </div>
            )}
            {activeMainTab === "SOLVER" && (
              <div className="animate-in fade-in duration-500 bg-[var(--bg-main)] min-h-screen">
                <section className="bg-[var(--bg-main)] text-[var(--text-primary)] border-b border-[var(--border-glow)] py-12 px-4">
                  <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                      {language === "Arabic" ? (
                        <>
                          أداة{" "}
                          <span className="text-amber-700 dark:text-amber-400 underline decoration-amber-500/30">
                            حل العوائق العلمية
                          </span>
                        </>
                      ) : (
                        <>
                          Scientific{" "}
                          <span className="text-amber-700 dark:text-amber-400 underline decoration-amber-500/30">
                            Challenge
                          </span>{" "}
                          Solver
                        </>
                      )}
                    </h1>
                    <p className="text-md text-[var(--text-secondary)] max-w-2xl mx-auto">
                      {language === "Arabic"
                        ? "حل الاختناقات التقنية في قطاع الوقود الحيوي في عُمان باستخدام وكلاء الذكاء الاصطناعي."
                        : "Solving technical bottlenecks in Oman's biofuel ecosystem through multi-agent scientific reasoning."}
                    </p>
                  </div>
                </section>
                <section className="max-w-7xl mx-auto px-4 py-8 relative z-10 bg-[var(--bg-main)]">
                  <ChallengeSolver
                    history={challengeHistory}
                    initialInputs={initialChallengeInputs}
                    initialResult={initialChallengeResult}
                    language={language}
                    onAnalysisRequest={(fn) =>
                      handleAnalysisRequest(fn, "CHALLENGE")
                    }
                    userPlan={userPlan}
                    onUpgrade={() => setShowPricing(true)}
                    onSave={(entry) => {
                      setChallengeHistory((prev) => [entry, ...prev]);
                      saveToUnifiedHistory({
                        name: entry.topic,
                        type: "CHALLENGE",
                        inputs: { topic: entry.topic },
                        outputs: entry.fullData,
                      });
                    }}
                    onClear={() => {
                      if (
                        window.confirm(
                          language === "Arabic"
                            ? "هل أنت متأكد من مسح جميع السجلات؟"
                            : "Clear all challenge history?",
                        )
                      )
                        setChallengeHistory([]);
                    }}
                  />
                </section>
              </div>
            )}
            {activeMainTab === "OPTIMIZER" && (
              <div className="animate-in fade-in duration-500 bg-[var(--bg-main)] min-h-screen">
                <section className="bg-[var(--bg-main)] text-[var(--text-primary)] border-b border-[var(--border-glow)] py-12 px-4">
                  <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                      {language === "Arabic" ? (
                        <>
                          التحسين{" "}
                          <span className="text-[var(--accent-emerald)] dark:text-emerald-400 underline decoration-emerald-500/30">
                            المالي والانبعاثات
                          </span>
                        </>
                      ) : (
                        <>
                          Profit &{" "}
                          <span className="text-[var(--accent-emerald)] dark:text-emerald-400 underline decoration-emerald-500/30">
                            Carbon
                          </span>{" "}
                          Optimizer
                        </>
                      )}
                    </h1>
                    <p className="text-md text-[var(--text-secondary)] max-w-2xl mx-auto">
                      {language === "Arabic"
                        ? "ذكاء اصطناعي لتعظيم الإيرادات وتقليل الانبعاثات الكربونية لمشاريع الوقود الحيوي."
                        : "Strategic multi-agent AI to maximize revenue and minimize emissions for biofuel projects."}
                    </p>
                  </div>
                </section>
                <section className="max-w-7xl mx-auto px-4 py-8 relative z-10 bg-[var(--bg-main)]">
                  <OptimizerTool
                    history={optimizerHistory}
                    initialInputs={initialOptimizerInputs}
                    initialResult={initialOptimizerResult}
                    language={language}
                    onAnalysisRequest={(fn) =>
                      handleAnalysisRequest(fn, "OPTIMIZER")
                    }
                    userPlan={userPlan}
                    onUpgrade={() => setShowPricing(true)}
                    onSave={(entry) => {
                      setOptimizerHistory((prev) => [entry, ...prev]);
                      saveToUnifiedHistory({
                        name: entry.projectName,
                        type: "OPTIMIZER",
                        inputs: { projectName: entry.projectName },
                        outputs: entry.fullData,
                        carbonIntensity:
                          entry.fullData.carbonPerformance.intensityAfter,
                      });
                    }}
                    onClear={() => {
                      if (
                        window.confirm(
                          language === "Arabic"
                            ? "هل أنت متأكد من مسح جميع السجلات؟"
                            : "Clear all optimization history?",
                        )
                      )
                        setOptimizerHistory([]);
                    }}
                  />
                </section>
              </div>
            )}
            {activeMainTab === "STANDARDS" && (
              <div className="animate-in fade-in duration-500 bg-[var(--bg-main)] min-h-screen">
                <section className="bg-[var(--bg-main)] text-[var(--text-primary)] border-b border-[var(--border-glow)] py-12 px-4">
                  <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                      {language === "Arabic" ? (
                        <>
                          أداة{" "}
                          <span className="text-[var(--text-secondary)]  underline decoration-slate-200/30">
                            الامتثال والمعايير
                          </span>
                        </>
                      ) : (
                        <>
                          Standards{" "}
                          <span className="text-[var(--text-secondary)]  underline decoration-slate-200/30">
                            Compliance
                          </span>{" "}
                          Checker
                        </>
                      )}
                    </h1>
                    <p className="text-md text-[var(--text-secondary)] max-w-2xl mx-auto">
                      {language === "Arabic"
                        ? "التحقق من نتائج المعامل المختبرية للوقود الحيوي واعتماديتها حسب المواصفات (ASTM/EN)."
                        : "Verify your biofuel lab results against international standards (ASTM/EN) for commercial viability in Oman."}
                    </p>
                  </div>
                </section>
                <section className="max-w-7xl mx-auto px-4 py-8 relative z-10 pb-20 bg-[var(--bg-main)]">
                  <StandardsChecker
                    language={language}
                    onAnalysisRequest={(fn) =>
                      handleAnalysisRequest(fn, "STANDARDS")
                    }
                    userPlan={userPlan}
                    onUpgrade={() => setShowPricing(true)}
                  />
                </section>
              </div>
            )}
            {activeMainTab === "PROPOSAL" && (
              <div className="animate-in fade-in duration-500 bg-[var(--bg-main)] min-h-screen">
                <section className="max-w-7xl mx-auto px-4 py-8 relative z-10 pb-20 bg-[var(--bg-main)]">
                  <OmanEvPlatform
                    language={language}
                    onAnalysisRequest={(fn) =>
                      handleAnalysisRequest(fn, "PROPOSAL")
                    }
                    userPlan={userPlan}
                    onUpgrade={() => setShowPricing(true)}
                    onNavigateToTab={(tab) => setActiveMainTab(tab as any)}
                  />
                </section>
              </div>
            )}

            {activeMainTab === "ZONES" && (
              <div className="animate-in fade-in duration-500 bg-[var(--bg-main)] min-h-screen">
                <section className="bg-[var(--bg-main)] text-[var(--text-primary)] border-b border-[var(--border-glow)] py-12 px-4">
                  <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                      {language === "Arabic" ? (
                        <>
                          قاعدة بيانات{" "}
                          <span className="text-amber-700 dark:text-amber-400 underline decoration-amber-600/30">
                            بيئة الطاقة ومناطق الاستثمار
                          </span>
                        </>
                      ) : (
                        <>
                          Strategic{" "}
                          <span className="text-amber-700 dark:text-amber-400 underline decoration-amber-600/30">
                            Energy & Zones
                          </span>{" "}
                          Database
                        </>
                      )}
                    </h1>
                    <p className="text-md text-[var(--text-secondary)] max-w-2xl mx-auto">
                      {language === "Arabic"
                        ? "استكشف المناطق الاستراتيجية وتعرف على أبرز شركات الطاقة والسيارات الكهربائية وشبكات الشحن في عُمان (ميسان، كروة، شل ريتشارج، الدقم، صحار، هيدروم، أوكيو)."
                        : "Explore Oman's strategic zones, clean energy ecosystem, and Electric Vehicle (EV) manufacturing & fast-charging leaders (Maysan, Karwa, Shell Recharge, Duqm, Sohar, Hydrom, OQ)."}
                    </p>
                  </div>
                </section>
                <section className="max-w-6xl mx-auto px-4 py-12 bg-[var(--bg-main)]">
                  <OmanFreeZones language={language} />
                </section>
              </div>
            )}
            <Footer language={language} />

            {/* Global Legal Disclaimer Footer */}
            <footer className="bg-[var(--bg-main)] text-[var(--text-secondary)] py-6 text-center text-xs border-t border-[var(--border-glow)] flex-shrink-0 z-50 mt-auto">
              <div className="max-w-5xl mx-auto px-6">
                <p className="mb-2 font-bold text-[var(--text-secondary)] text-sm flex justify-center items-center">
                  <i className="fas fa-shield-alt mr-2 rtl:ml-2 rtl:mr-0 text-[var(--text-secondary)]"></i>
                  {language === "Arabic"
                    ? "إخلاء مسؤولية قانوني (Disclaimer)"
                    : "Legal Disclaimer"}
                </p>
                <p className="max-w-4xl mx-auto leading-relaxed text-xs md:text-xs">
                  {language === "Arabic"
                    ? "النتائج والتوقعات المالية والتقييمات المتولدة عبر هذا النظام المدعوم بالذكاء الاصطناعي هي لأغراض العصف الذهني والتقييم الأولي فقط. النظام مصمم لنمذجة المشاريع الخضراء والطاقة المتجددة ולא يشكل استشارة هندسية أو مالية معتمدة. يجب على المستخدمين التحقق من كافة الأرقام عبر خبراء معتمدين ومكاتب استشارية قبل أخذ أي قرار استثماري، ومطورو النظام لا يتحملون أي تبعات أو مسؤولية قانونية عن صحة ودقة هذه المخرجات."
                    : "The results, financial projections, and assessments generated by this AI system are for brainstorming and preliminary evaluation purposes only. The system is designed to model green tech and renewable energy projects and does not constitute certified engineering or financial advice. Users must verify all figures with accredited experts before making any investment decisions. The developers assume no legal liability for the accuracy or consequences of these outputs."}
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
        language={language}
      />
      <PricingModal
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
        uid={user?.uid || ""}
        language={language}
      />
    </div>
  );
}
