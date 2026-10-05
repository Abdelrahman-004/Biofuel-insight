import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, 
  Tooltip, ResponsiveContainer, CartesianGrid, Legend, Cell 
} from 'recharts';
import { 
  FlaskConical, Dna, BookOpen, Factory, CheckCircle2, 
  AlertTriangle, ArrowRight, Download, Copy, Check, 
  ChevronRight, Layers, Sliders, Activity, RefreshCw, 
  Sparkles, Microscope, Search, ShieldCheck, FileText,
  Calendar, CheckSquare, Square
} from 'lucide-react';
import { CustomMarkdown } from './CustomMarkdown';
import { 
  ChallengeSolverResult, ChallengeHistoryEntry, 
  MultiAgentChallengeResult, AgentSolution, LabProtocolStep 
} from './types';
import { solveChallenge } from './geminiService';

interface ChallengeSolverProps {
  history: ChallengeHistoryEntry[];
  onSave: (entry: ChallengeHistoryEntry) => void;
  onClear: () => void;
  initialInputs?: { topic: string };
  initialResult?: ChallengeSolverResult;
  language?: 'English' | 'Arabic';
  onAnalysisRequest?: <T>(fn: () => Promise<T>) => Promise<T>;
  userPlan?: string;
  onUpgrade?: () => void;
}

const TOPIC_STORAGE_KEY = 'biofuel_insight_challenge_topic_draft';

// Real-world research bottlenecks calibrated for Omani researchers, SQU labs, and clean-tech startups
const RESEARCH_PRESETS = [
  {
    id: 'pyrolysis-deactivation',
    domainEn: 'Catalytic Pyrolysis & Bio-oil',
    domainAr: 'الانحلال الحراري والتحفيز',
    titleEn: 'Date Palm Biomass: Zeolite Catalyst Coking & Rapid Deactivation',
    titleAr: 'مخلفات النخيل: تفحم وخمول المحفز الزيوليتي أثناء التكسير الحراري',
    topic: 'Severe catalyst coking and active acid site deactivation during continuous catalytic fast pyrolysis of Omani date palm fronds and seeds',
    feedstock: 'Omani Date Palm Fronds & Seed Kernels (Moisture < 8%, Cellulose: 42%, Hemicellulose: 27%, Lignin: 25%)',
    setup: 'Continuous fluidized-bed pyrolyzer at 500°C, HZSM-5 catalyst (Si/Al = 30), WHSV 2.0 h⁻¹, N2 fluidizing gas',
    obstacle: 'Rapid carbonaceous coke deposition (> 16 wt% on catalyst within 45 min), active Brønsted site blockage, high bio-oil oxygenate content (> 27 wt%)',
    target: 'Extend continuous catalyst on-stream lifetime to > 4 hours, reduce bio-oil oxygen content to < 12 wt%, and achieve BTX aromatics selectivity > 24%'
  },
  {
    id: 'microalgae-salinity',
    domainEn: 'Microalgae Photobioreactors',
    domainAr: 'مفاعلات الطحالب الدقيقة',
    titleEn: 'Marine Microalgae: Hyper-Salinity Stress & Photo-Bleaching in Seawater',
    titleAr: 'الطحالب البحرية: إجهاد الملوحة الفائقة والتبييض الضوئي في مياه الخليج',
    topic: 'Osmotic shock, photo-bleaching, and culture collapse in outdoor high-rate algal raceway ponds using hyper-saline Gulf seawater and intense solar irradiance',
    feedstock: 'Indigenous Omani coastal microalgae strains (Dunaliella salina / Tetraselmis sp. / Chlorella sp.)',
    setup: 'Outdoor open raceway pond with paddle wheel mixing, natural summer solar DNI (> 1100 µmol photons/m²/s), ambient summer temperatures 38-43°C',
    obstacle: 'Photo-inhibition and reactive oxygen species (ROS) accumulation when salinity exceeds 45 ppt; lipid productivity drops drastically below 6 mg/L/day',
    target: 'Sustain stable biomass productivity > 18 g/m²/day and lipid fraction > 35% dry weight under extreme salinity (45-55 ppt) and summer irradiance'
  },
  {
    id: 'biodiesel-saponification',
    domainEn: 'Biodiesel Synthesis',
    domainAr: 'تصنيع الديزل الحيوي',
    titleEn: 'High-FFA Waste Oil: Saponification & Emulsion Phase Separation Failure',
    titleAr: 'زيوت الطهي المستعملة: تصبن الأحماض الدهنية العالية وفشل فصل الجلسرين',
    topic: 'Severe soap formation and intractable emulsification during base-catalyzed transesterification of acidic waste cooking oils and grease',
    feedstock: 'Commercial Waste Cooking Oil (WCO) with Free Fatty Acid (FFA) content > 12.5 wt% and water content 1.8%',
    setup: 'Homogeneous alkaline transesterification (KOH / NaOH with anhydrous methanol 6:1 molar ratio at 60°C, 600 RPM mechanical stirring)',
    obstacle: 'Rapid saponification creating gel-like potassium soaps (> 7 wt%), total loss of phase separation between methyl esters and glycerol, ester yield < 35%',
    target: 'Achieve complete fatty acid methyl ester (FAME) conversion > 97.5% (EN 14214 / ASTM D6751) with final acid value < 0.5 mg KOH/g'
  },
  {
    id: 'produced-water-toxicity',
    domainEn: 'Produced Water Bioremediation',
    domainAr: 'معالجة المياه المصاحبة للنفط',
    titleEn: 'Oilfield Produced Water: Petroleum Hydrocarbon Toxicity in Bioreactors',
    titleAr: 'المياه المصاحبة للنفط: سمية الهيدروكربونات والمعادن الثقيلة في المفاعلات الحيوية',
    topic: 'Petroleum hydrocarbon toxicity, heavy metals (Ni, V), and hyper-salinity inhibition during biological wastewater-to-biofuel valorization in Oman',
    feedstock: 'Oilfield Co-Produced Water from PDO southern operations (TDS: 40,000-65,000 mg/L, Total Petroleum Hydrocarbons TPH: 190 mg/L, trace Nickel and Vanadium)',
    setup: 'Hybrid anaerobic biological filter coupled with halo-tolerant microalgae photobioreactor for simultaneous hydrocarbon degradation and lipid accumulation',
    obstacle: 'Polycyclic aromatic hydrocarbons (PAHs) and heavy metals trigger severe membrane lipid peroxidation; > 80% cellular mortality within 24 hours of inoculation',
    target: 'Achieve > 95% TPH removal, > 90% heavy metal biosorption, and generate harvestable biofuel precursor biomass > 2.0 g/L'
  },
  {
    id: 'htl-tar-fouling',
    domainEn: 'Hydrothermal Liquefaction',
    domainAr: 'الإسالة الحرارية المائية',
    titleEn: 'Wet Sewage Sludge: Heavy Tar Fouling & Nitrogen Contamination in HTL',
    titleAr: 'الحمأة المعالجة: ترسب القطران الثقيل والتلوث النيتروجيني في مفاعلات HTL',
    topic: 'Severe organic tar deposition, continuous reactor tube plugging, and high nitrogen heteroatom content during subcritical hydrothermal liquefaction of municipal sludge',
    feedstock: 'Municipal dewatered sewage sludge from Haya Water / Nama (82% moisture, 34% dry ash, high organic nitrogen 5.6 wt%)',
    setup: 'Subcritical continuous tubular HTL reactor operating at 340°C, 19 MPa pressure, 18-minute residence time with homogeneous alkali catalysts',
    obstacle: 'Rapid wall deposition of refractory nitrogenous polyaromatic tars leading to dangerous pressure differentials and bio-crude nitrogen content > 4.5 wt%',
    target: 'Prevent tubular reactor coking, reduce bio-crude nitrogen to < 2.0 wt%, and achieve bio-crude higher heating value (HHV) > 36 MJ/kg'
  }
];

export const ChallengeSolver: React.FC<ChallengeSolverProps> = ({
  history,
  onSave,
  onClear,
  initialInputs,
  initialResult,
  language = 'English',
  onAnalysisRequest
}) => {
  const [localLanguage, setLocalLanguage] = useState<'English' | 'Arabic'>(language === 'Arabic' ? 'Arabic' : 'English');

  useEffect(() => {
    if (language) setLocalLanguage(language === 'Arabic' ? 'Arabic' : 'English');
  }, [language]);

  const isArabic = localLanguage === 'Arabic';

  // Input states
  const [topic, setTopic] = useState('');
  const [feedstock, setFeedstock] = useState('');
  const [experimentalSetup, setExperimentalSetup] = useState('');
  const [observedObstacle, setObservedObstacle] = useState('');
  const [targetMetric, setTargetMetric] = useState('');
  const [showParametersDrawer, setShowParametersDrawer] = useState(false);

  // Analysis result states
  const [result, setResult] = useState<MultiAgentChallengeResult | any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'SOLVER' | 'HISTORY'>('SOLVER');
  
  // Navigation tabs for results
  const [activeAgentIndex, setActiveAgentIndex] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<'AGENTS' | 'PROTOCOL' | 'DIAGNOSTICS' | 'REPORT'>('AGENTS');
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [copiedProtocol, setCopiedProtocol] = useState(false);

  // Restore draft or initialInputs
  useEffect(() => {
    if (initialInputs?.topic) {
      setTopic(initialInputs.topic);
    } else {
      const saved = localStorage.getItem(TOPIC_STORAGE_KEY);
      if (saved) setTopic(saved);
    }
  }, [initialInputs]);

  useEffect(() => {
    if (initialResult) {
      setResult(initialResult as any);
      setViewMode('SOLVER');
    }
  }, [initialResult]);

  useEffect(() => {
    localStorage.setItem(TOPIC_STORAGE_KEY, topic);
  }, [topic]);

  const handleApplyPreset = (preset: typeof RESEARCH_PRESETS[0]) => {
    setTopic(preset.topic);
    setFeedstock(preset.feedstock);
    setExperimentalSetup(preset.setup);
    setObservedObstacle(preset.obstacle);
    setTargetMetric(preset.target);
    setShowParametersDrawer(true);
  };

  const handleSolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    const researchDetails = (feedstock || experimentalSetup || observedObstacle || targetMetric) ? {
      feedstock: feedstock.trim() || undefined,
      experimentalSetup: experimentalSetup.trim() || undefined,
      observedObstacle: observedObstacle.trim() || undefined,
      targetMetric: targetMetric.trim() || undefined,
    } : undefined;

    try {
      const processCall = async () => await solveChallenge(topic, localLanguage, researchDetails);
      const data = onAnalysisRequest ? await onAnalysisRequest(processCall) : await processCall();
      if (!data) {
        setIsLoading(false);
        return;
      }
      setResult(data);
      setActiveSection('AGENTS');
      setActiveAgentIndex(0);
      setCompletedSteps({});
      
      const newEntry: ChallengeHistoryEntry = {
        id: Date.now().toString(),
        topic: topic,
        timestamp: new Date().toLocaleString(),
        fullData: data
      };
      onSave(newEntry);
    } catch (err: any) {
      setError(err?.message || (isArabic ? 'فشل التحليل العلمي. يرجى التحقق من صياغة المدخلات والمحاولة مجدداً.' : 'Failed to execute scientific analysis. Please refine your inputs and try again.'));
      console.error('Challenge solver error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = async () => {
    const { downloadPDF: dp } = await import('./pdfUtils');
    await dp('challenge-solver-report', `OmanEcoSync_Scientific_Rescue_${Date.now()}.pdf`);
  };

  const handleToggleStep = (stepNumber: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepNumber]: !prev[stepNumber]
    }));
  };

  const handleCopyProtocol = () => {
    if (!result) return;
    let text = `${result.challengeTitle || topic}\n`;
    text += `=====================================================\n\n`;
    
    if (result.rootCauseAnalysis) {
      text += `PRIMARY DIAGNOSTIC ROOT CAUSE:\n`;
      text += `- Primary Failure Mechanism: ${result.rootCauseAnalysis.primaryFailureMechanism}\n`;
      text += `- Chemical/Thermodynamic Cause: ${result.rootCauseAnalysis.chemicalThermodynamicCause}\n`;
      text += `- Experimental Confounder: ${result.rootCauseAnalysis.experimentalConfounder}\n\n`;
    }

    if (result.stepByStepLabProtocol && result.stepByStepLabProtocol.length > 0) {
      text += `LABORATORY STANDARD OPERATING PROCEDURE (SOP):\n`;
      result.stepByStepLabProtocol.forEach(s => {
        text += `\n[Step ${s.stepNumber}] ${s.title}\n`;
        text += `Instruction: ${s.instructions}\n`;
        if (s.criticalNotice) text += `CRITICAL PRECAUTION: ${s.criticalNotice}\n`;
      });
      text += `\n\n`;
    }

    if (result.researcherTroubleshootingMatrix && result.researcherTroubleshootingMatrix.length > 0) {
      text += `RESEARCHER TROUBLESHOOTING MATRIX:\n`;
      result.researcherTroubleshootingMatrix.forEach((m, idx) => {
        text += `\n${idx + 1}. Symptom: ${m.symptom}\n`;
        text += `   Root Cause: ${m.rootCause}\n`;
        text += `   Diagnostic Assay: ${m.diagnosticAssay}\n`;
        text += `   Corrective Action: ${m.correctiveAction}\n`;
        text += `   Target Benchmark: ${m.expectedBenchmark}\n`;
      });
      text += `\n\n`;
    }

    if (result.consensus) {
      text += `SCIENTIFIC CONSENSUS VERDICT:\n${result.consensus}\n`;
    }

    navigator.clipboard.writeText(text);
    setCopiedProtocol(true);
    setTimeout(() => setCopiedProtocol(false), 3000);
  };

  // Helper to extract or fallback chart data for an agent
  const selectedAgent = result?.agents?.[activeAgentIndex];

  return (
    <div 
      className={`max-w-6xl mx-auto space-y-8 pb-28 px-3 sm:px-6 ${isArabic ? 'font-cairo' : 'font-sans'}`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Top Bar: Title & Mode Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{isArabic ? 'مستشار الذكاء الاصطناعي للأبحاث المخبرية' : 'Scientific Research AI Consortium'}</span>
            <span className="text-slate-400">·</span>
            <span>{isArabic ? 'سلطنة عمان' : 'SQU / Oman Clean-Tech Labs'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            {isArabic ? 'منصة حل المعضلات العلمية والبحثية' : 'Scientific Challenge & Research Bottleneck Solver'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            {isArabic 
              ? 'فريق متخصص من 4 وكلاء ذكاء اصطناعي (الحركية الكيميائية، البروتوكول المخبري، تدقيق المراجع المحكمة، والتكيف الصناعي) لتشخيص وحل أعطال الأبحاث المعملية.'
              : 'Synchronized consortium of 4 specialized AI agents providing kinetic mechanisms, laboratory SOPs, peer-reviewed literature benchmarks, and localized Oman scale-up.'}
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          {/* View mode toggle */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode('SOLVER')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'SOLVER'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isArabic ? 'أداة الحل' : 'Workspace'}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('HISTORY')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'HISTORY'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{isArabic ? 'السجل' : 'History'}</span>
              {history.length > 0 && (
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                  {history.length}
                </span>
              )}
            </button>
          </div>

          {/* Language Selector */}
          <select
            value={localLanguage}
            onChange={(e) => setLocalLanguage(e.target.value as 'English' | 'Arabic')}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white outline-none cursor-pointer"
          >
            <option value="English">English</option>
            <option value="Arabic">العربية</option>
          </select>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'SOLVER' ? (
          <motion.div 
            key="solver-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Input Form & Preset Selection */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-6">
              
              {/* Presets Header */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{isArabic ? 'اختر معضلة معملية واقعية (نماذج محملة مسبقاً):' : 'Load Common Research Bottlenecks (Click to auto-populate):'}</span>
                  </span>
                  {showParametersDrawer && (
                    <button
                      type="button"
                      onClick={() => {
                        setFeedstock('');
                        setExperimentalSetup('');
                        setObservedObstacle('');
                        setTargetMetric('');
                      }}
                      className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                    >
                      {isArabic ? 'مسح المعايير' : 'Reset fields'}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {RESEARCH_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="text-start p-3 bg-slate-50 dark:bg-slate-800/40 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-500/40 rounded-xl transition-all group"
                    >
                      <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold mb-0.5">
                        {isArabic ? preset.domainAr : preset.domainEn}
                      </div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 line-clamp-1">
                        {isArabic ? preset.titleAr : preset.titleEn}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {preset.topic}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Problem Description */}
              <form onSubmit={handleSolve} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Microscope className="w-3.5 h-3.5 text-emerald-500" />
                      {isArabic ? 'وصف المعضلة البحثية أو المشكلة التجريبية:' : 'Primary Research Bottleneck / Laboratory Obstacle:'}
                    </span>
                    <span className="text-[11px] font-normal text-slate-400">
                      {isArabic ? 'كن دقيقاً بذكر درجات الحرارة والمحفزات إن وجدت' : 'Include operating temperatures & catalysts for higher accuracy'}
                    </span>
                  </label>
                  
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder={isArabic 
                        ? 'مثال: تفحم المحفز الزيوليتي HZSM-5 وانخفاض استخلاص الزيت الحيوي أثناء التكسير الحراري لمخلفات نوى النخيل...'
                        : 'e.g., Severe catalyst coking and loss of active sites during fast pyrolysis of date palm biomass...'}
                      className="flex-grow px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowParametersDrawer(!showParametersDrawer)}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer ${
                        showParametersDrawer 
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/40 text-emerald-700 dark:text-emerald-300' 
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Sliders className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{isArabic ? 'معايير المختبر الدقيقة' : 'Laboratory Variables'}</span>
                      {(feedstock || experimentalSetup || observedObstacle || targetMetric) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Collapsible Laboratory Details */}
                <AnimatePresence>
                  {showParametersDrawer && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden bg-slate-50 dark:bg-slate-800/30 p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                          <Activity className="w-3.5 h-3.5" />
                          {isArabic ? 'المتغيرات التشغيلية والمخبرية (اختياري لزيادة دقة التشخيص)' : 'Experimental Operating Parameters (Optional for Precision)'}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {isArabic ? 'يساعد فريق الذكاء الاصطناعي في حساب حركية التفاعل' : 'Enables agents to compute exact reaction kinetics'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                            {isArabic ? 'المادة الخام / العينة (Feedstock):' : 'Feedstock / Material Composition:'}
                          </label>
                          <input
                            type="text"
                            value={feedstock}
                            onChange={(e) => setFeedstock(e.target.value)}
                            placeholder={isArabic ? 'مثال: سعف نخيل عماني (رطوبة < 8%، سليلوز 42%)' : 'e.g., Omani Date Palm Fronds (Moisture < 8%, Cellulose 42%)'}
                            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                            {isArabic ? 'التجهيز التجريبي والمفاعل (Setup):' : 'Reactor & Experimental Setup:'}
                          </label>
                          <input
                            type="text"
                            value={experimentalSetup}
                            onChange={(e) => setExperimentalSetup(e.target.value)}
                            placeholder={isArabic ? 'مثال: مفاعل طبقة مائعة عند 500°م، محفز HZSM-5' : 'e.g., Fluidized bed pyrolyzer at 500°C, HZSM-5 (Si/Al=30)'}
                            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                            {isArabic ? 'العَرَض الملاحظ / أين توقف العمل (Symptom):' : 'Specific Roadblock / Failure Symptom:'}
                          </label>
                          <input
                            type="text"
                            value={observedObstacle}
                            onChange={(e) => setObservedObstacle(e.target.value)}
                            placeholder={isArabic ? 'مثال: تفحم المحفز خلال 45 دقيقة، بقاء الأكسجين فوق 25%' : 'e.g., Severe coke formation on acid sites within 45 min, bio-oil O2 > 27%'}
                            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                            {isArabic ? 'المعيار المستهدف للنجاح (Target Yield):' : 'Target Success Metric / Yield Benchmark:'}
                          </label>
                          <input
                            type="text"
                            value={targetMetric}
                            onChange={(e) => setTargetMetric(e.target.value)}
                            placeholder={isArabic ? 'مثال: استقرار المحفز > 4 ساعات وخفض الأكسجين لأقل من 12%' : 'e.g., Catalyst life > 4 hours, bio-oil O2 < 12%, yield > 42%'}
                            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Action Button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isLoading || !topic.trim()}
                    className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-sm ${
                      isLoading || !topic.trim()
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer hover:shadow-md'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{isArabic ? 'جاري التحليل وتنسيق الوكلاء الأربعة...' : 'Synchronizing 4 AI Scientific Agents...'}</span>
                      </>
                    ) : (
                      <>
                        <FlaskConical className="w-4 h-4" />
                        <span>{isArabic ? 'تشغيل التشخيص العلمي وحل المعضلة' : 'Execute Scientific Multi-Agent Diagnosis'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-red-700 dark:text-red-400 text-xs sm:text-sm flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* RESULTS DASHBOARD */}
            {result && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Executive Summary Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {isArabic ? 'حل علمي مدقق بأدلة محكمة' : 'Verified Scientific Consensus'}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      {result.scientificConfidenceScore && (
                        <span className="font-mono text-slate-600 dark:text-slate-400">
                          {isArabic ? `مستوى الثقة: ${result.scientificConfidenceScore}%` : `Confidence: ${result.scientificConfidenceScore}%`}
                        </span>
                      )}
                      {(result.trlCurrent || result.trlTarget) && (
                        <>
                          <span className="text-slate-300 dark:text-slate-700">·</span>
                          <span className="font-mono text-slate-600 dark:text-slate-400">
                            TRL {result.trlCurrent || 3} → TRL {result.trlTarget || 6}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyProtocol}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedProtocol ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedProtocol ? (isArabic ? 'تم النسخ!' : 'Copied!') : (isArabic ? 'نسخ التقرير' : 'Copy Dossier')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={downloadPDF}
                        className="px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{isArabic ? 'تصدير PDF' : 'Export PDF'}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                      {result.challengeTitle || topic}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed max-w-4xl">
                      {result.challengeSummary}
                    </p>
                  </div>

                  {/* Root Cause Triad */}
                  {result.rootCauseAnalysis && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80">
                        <div className="text-[11px] font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1.5">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{isArabic ? 'آلية الفشل الأساسية' : 'Primary Failure Mode'}</span>
                        </div>
                        <p className="text-xs text-slate-800 dark:text-slate-200 mt-1.5 leading-relaxed font-medium">
                          {result.rootCauseAnalysis.primaryFailureMechanism}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80">
                        <div className="text-[11px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1.5">
                          <Activity className="w-3 h-3" />
                          <span>{isArabic ? 'السبب الكيميائي / الثرموديناميكي' : 'Thermodynamic Cause'}</span>
                        </div>
                        <p className="text-xs text-slate-800 dark:text-slate-200 mt-1.5 leading-relaxed font-medium">
                          {result.rootCauseAnalysis.chemicalThermodynamicCause}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80">
                        <div className="text-[11px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1.5">
                          <Sliders className="w-3 h-3" />
                          <span>{isArabic ? 'المتغير الخفي في التجربة' : 'Experimental Confounder'}</span>
                        </div>
                        <p className="text-xs text-slate-800 dark:text-slate-200 mt-1.5 leading-relaxed font-medium">
                          {result.rootCauseAnalysis.experimentalConfounder}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Consensus Box */}
                  {result.consensus && (
                    <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                          {isArabic ? 'إجماع فريق الوكلاء العلميين (Scientific Panel Consensus):' : 'Coordinated Scientific Consensus Statement:'}
                        </span>
                        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 mt-1 leading-relaxed italic">
                          "{result.consensus}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary Section Navigation Tabs */}
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveSection('AGENTS')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                      activeSection === 'AGENTS'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{isArabic ? '1. فريق الوكلاء المتخصصين الأربعة والرسوم البيانية' : '1. 4 Specialized AI Agents & Charts'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSection('PROTOCOL')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                      activeSection === 'PROTOCOL'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-blue-500" />
                    <span>{isArabic ? '2. بروتوكول الإنقاذ المخبري خطوة بخطوة (SOP)' : '2. Benchtop Protocol Checklist (SOP)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSection('DIAGNOSTICS')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                      activeSection === 'DIAGNOSTICS'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5 text-amber-500" />
                    <span>{isArabic ? '3. مصفوفة تشخيص الأعطال المعملية' : '3. Researcher Troubleshooting Matrix'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSection('REPORT')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                      activeSection === 'REPORT'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-purple-500" />
                    <span>{isArabic ? '4. التقرير الاستشاري ومخطط التدفق' : '4. Advisory Report & Flowchart'}</span>
                  </button>
                </div>

                {/* Printable container */}
                <div id="challenge-solver-report" className="space-y-6">

                  {/* SECTION 1: THE 4 SPECIALIZED AI AGENTS CONSOLE */}
                  {activeSection === 'AGENTS' && (
                    <div className="space-y-6">
                      {/* Agent Selector Ribbon */}
                      {Array.isArray(result.agents) && result.agents.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {result.agents.map((agent: AgentSolution, idx: number) => {
                            const isSelected = activeAgentIndex === idx;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setActiveAgentIndex(idx)}
                                className={`text-start p-4 rounded-xl border transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-white dark:bg-slate-900 border-emerald-500 shadow-xs ring-1 ring-emerald-500/20'
                                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                                    {isArabic ? `وكيل متخصص ${idx + 1}` : `Agent 0${idx + 1}`}
                                  </span>
                                  {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                                </div>
                                <div className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-1">
                                  {agent.agentName}
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                  {agent.agentRole}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Selected Agent Detailed Workspace */}
                      {selectedAgent && (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-6">
                          
                          {/* Agent Header Profile */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                  {selectedAgent.agentName}
                                </h3>
                                <span className="text-slate-400">·</span>
                                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                                  {selectedAgent.agentRole}
                                </span>
                              </div>
                              {selectedAgent.specificMandate && (
                                <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5 font-mono">
                                  {isArabic ? 'المهمة التخصصية: ' : 'Specific Mandate: '}{selectedAgent.specificMandate}
                                </p>
                              )}
                            </div>

                            <span className="text-xs font-mono px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {isArabic ? `المجال: ${activeAgentIndex === 0 ? 'الحركية والكيمياء' : activeAgentIndex === 1 ? 'البروتوكول المعملي' : activeAgentIndex === 2 ? 'تدقيق المراجع' : 'التكيف الصناعي'}` : `Domain: ${selectedAgent.agentRole}`}
                            </span>
                          </div>

                          {/* Proposed Solution / Mechanism */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                              <FlaskConical className="w-3.5 h-3.5 text-emerald-500" />
                              <span>{isArabic ? 'الآلية العلمية وخطة العمل المقترحة من الوكيل:' : 'Proposed Scientific Mechanism & Action Plan:'}</span>
                            </h4>
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                              {selectedAgent.proposedSolution}
                            </div>
                          </div>

                          {/* INTERACTIVE SCIENTIFIC CHART */}
                          {selectedAgent.dataTables && selectedAgent.dataTables.length > 0 && selectedAgent.dataTables[0].rows?.length > 0 && (
                            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 border-b border-slate-200 dark:border-slate-700 pb-2.5">
                                <div>
                                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Activity className="w-3.5 h-3.5 text-blue-500" />
                                    <span>{selectedAgent.dataTables[0].title}</span>
                                  </h4>
                                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                    {selectedAgent.dataTables[0].xAxisLabel} vs. {selectedAgent.dataTables[0].yAxisLabel}
                                  </span>
                                </div>
                                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                                  {isArabic ? 'رسم بياني علمي تفاعلي' : 'Interactive Empirical Plot'}
                                </span>
                              </div>

                              <div className="h-[250px] w-full pt-2">
                                <ResponsiveContainer width="100%" height="100%">
                                  {selectedAgent.dataTables[0].chartType === 'line' ? (
                                    <LineChart
                                      data={selectedAgent.dataTables[0].rows.map(r => ({
                                        name: String(r[0]),
                                        value: Number(r[1]) || 0
                                      }))}
                                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                    >
                                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(150, 150, 150, 0.15)" />
                                      <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} tickLine={false} />
                                      <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} />
                                      <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-glow)', borderRadius: '10px', fontSize: '11px' }} />
                                      <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4, fill: '#10B981' }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                  ) : (
                                    <BarChart
                                      data={selectedAgent.dataTables[0].rows.map(r => ({
                                        name: String(r[0]),
                                        value: Number(r[1]) || 0
                                      }))}
                                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                    >
                                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(150, 150, 150, 0.15)" />
                                      <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} tickLine={false} />
                                      <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} />
                                      <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-glow)', borderRadius: '10px', fontSize: '11px' }} />
                                      <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]}>
                                        {selectedAgent.dataTables[0].rows.map((_, index) => (
                                          <Cell 
                                            key={`cell-${index}`} 
                                            fill={['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#06B6D4', '#EC4899'][index % 6]} 
                                          />
                                        ))}
                                      </Bar>
                                    </BarChart>
                                  )}
                                </ResponsiveContainer>
                              </div>
                            </div>
                          )}

                          {/* Precision Scientific Parameters Table */}
                          {selectedAgent.scientificParameters && selectedAgent.scientificParameters.length > 0 && (
                            <div className="space-y-2.5">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Sliders className="w-3.5 h-3.5 text-blue-500" />
                                <span>{isArabic ? 'المتغيرات الكيميائية والتشغيلية المحددة بدقة:' : 'Precision Chemical & Kinetic Parameters:'}</span>
                              </h4>
                              
                              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                                <table className="w-full text-xs text-start">
                                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 uppercase font-mono">
                                    <tr>
                                      <th className="p-3 font-semibold">{isArabic ? 'المتغير' : 'Parameter'}</th>
                                      <th className="p-3 font-semibold">{isArabic ? 'القيمة المثلى' : 'Optimal Value'}</th>
                                      <th className="p-3 font-semibold">{isArabic ? 'الوحدة' : 'Unit'}</th>
                                      <th className="p-3 font-semibold">{isArabic ? 'الأثر العلمي على التفاعل' : 'Scientific Impact'}</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                                    {selectedAgent.scientificParameters.map((p, pIdx) => (
                                      <tr key={pIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="p-3 font-semibold text-slate-900 dark:text-white">{p.name}</td>
                                        <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                          {p.optimalValue} {p.tolerance ? `(±${p.tolerance})` : ''}
                                        </td>
                                        <td className="p-3 font-mono text-slate-500 dark:text-slate-400">{p.scientificUnit}</td>
                                        <td className="p-3 text-slate-600 dark:text-slate-300 leading-relaxed">{p.impact}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Key Empirical Evidences & Citations */}
                          {selectedAgent.keyEvidences && selectedAgent.keyEvidences.length > 0 && (
                            <div className="space-y-2.5">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                                <span>{isArabic ? 'الأدلة العلمية الموثقة من أوراق بحثية محكمة:' : 'Audited Empirical Evidences & Literature Citations:'}</span>
                              </h4>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                {selectedAgent.keyEvidences.map((evidence, eIdx) => (
                                  <div
                                    key={eIdx}
                                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
                                  >
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                    <span>{evidence}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Implementation Timeline */}
                          {selectedAgent.timeline && selectedAgent.timeline.length > 0 && (
                            <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-2.5">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                                <span>{isArabic ? 'مراحل التنفيذ المخبري المقترحة:' : 'Implementation Milestones & Experimental Timeline:'}</span>
                              </h4>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {selectedAgent.timeline.map((phase, pIdx) => (
                                  <div
                                    key={pIdx}
                                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 text-xs space-y-1"
                                  >
                                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                      {phase.phase}
                                    </div>
                                    <div className="font-bold text-slate-900 dark:text-white">
                                      {phase.duration}
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                      {phase.description}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* SECTION 2: STEP-BY-STEP BENCHTOP PROTOCOL CHECKLIST */}
                  {activeSection === 'PROTOCOL' && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <CheckSquare className="w-4 h-4 text-emerald-500" />
                            <span>{isArabic ? 'بروتوكول الإنقاذ المخبري خطوة بخطوة (SOP Interactive Checklist):' : 'Laboratory Rescue Standard Operating Procedure (SOP Checklist):'}</span>
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {isArabic ? 'خطوات معملية محددة بالكميات والحرارة يمكنك التأشير عليها أثناء العمل في المختبر' : 'Reproducible step-by-step bench instructions with exact temperatures and reagents. Check off as you execute.'}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={handleCopyProtocol}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          {copiedProtocol ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedProtocol ? (isArabic ? 'تم النسخ!' : 'Copied!') : (isArabic ? 'نسخ الخطوات للمذكرة' : 'Copy SOP to Notebook')}</span>
                        </button>
                      </div>

                      {Array.isArray(result.stepByStepLabProtocol) && result.stepByStepLabProtocol.length > 0 ? (
                        <div className="space-y-3.5">
                          {result.stepByStepLabProtocol.map((step) => {
                            const isDone = !!completedSteps[step.stepNumber];
                            return (
                              <div
                                key={step.stepNumber}
                                onClick={() => handleToggleStep(step.stepNumber)}
                                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                                  isDone
                                    ? 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-500/40 opacity-80'
                                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <button
                                    type="button"
                                    className="mt-0.5 text-emerald-600 dark:text-emerald-400"
                                  >
                                    {isDone ? (
                                      <CheckSquare className="w-5 h-5 fill-emerald-100 dark:fill-emerald-950 text-emerald-600" />
                                    ) : (
                                      <Square className="w-5 h-5 text-slate-400" />
                                    )}
                                  </button>

                                  <div className="space-y-1 flex-grow">
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                        Step {step.stepNumber}.
                                      </span>
                                      <h4 className={`text-sm font-bold text-slate-900 dark:text-white ${isDone ? 'line-through text-slate-400' : ''}`}>
                                        {step.title}
                                      </h4>
                                    </div>

                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                      {step.instructions}
                                    </p>

                                    {step.criticalNotice && (
                                      <div className="mt-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2">
                                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                                        <span>
                                          <strong>{isArabic ? 'تنبيه معملي حرج: ' : 'Critical Precaution: '}</strong>
                                          {step.criticalNotice}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                          {isArabic ? 'راجع التقرير الاستشاري الكامل لعرض كافة خطوات البروتوكول المعملي.' : 'Please refer to the full Advisory Report for the complete step-by-step bench protocol.'}
                        </div>
                      )}
                    </div>
                  )}

                  {/* SECTION 3: RESEARCHER TROUBLESHOOTING MATRIX */}
                  {activeSection === 'DIAGNOSTICS' && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-5">
                      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Activity className="w-4 h-4 text-emerald-500" />
                          <span>{isArabic ? 'مصفوفة تشخيص الأعطال المعملية واستكشاف الأخطاء:' : 'Researcher Laboratory Troubleshooting & Rescue Matrix:'}</span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {isArabic ? 'تحديد العَرَض المعملي، سببه الجذري، الفحص الآلي المطلوب (GC-MS, XRD..)، والإجراء المعملي التصحيحي المباشر' : 'Direct mapping of observed symptoms to root causes, instrumental assays, and corrective bench steps.'}
                        </p>
                      </div>

                      {Array.isArray(result.researcherTroubleshootingMatrix) && result.researcherTroubleshootingMatrix.length > 0 ? (
                        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                          <table className="w-full text-xs text-start">
                            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 uppercase font-mono">
                              <tr>
                                <th className="p-3 font-semibold">{isArabic ? 'العَرَض الملاحظ' : 'Observed Symptom'}</th>
                                <th className="p-3 font-semibold">{isArabic ? 'المسبب العلمي' : 'Root Cause Mechanism'}</th>
                                <th className="p-3 font-semibold">{isArabic ? 'الفحص المطلوب (GC-MS, XRD..)' : 'Diagnostic Assay'}</th>
                                <th className="p-3 font-semibold">{isArabic ? 'الإجراء التصحيحي المعملي' : 'Laboratory Corrective Action'}</th>
                                <th className="p-3 font-semibold">{isArabic ? 'المعيار المتوقع' : 'Target Benchmark'}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                              {result.researcherTroubleshootingMatrix.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                  <td className="p-3 font-bold text-rose-600 dark:text-rose-400 align-top">
                                    {item.symptom}
                                  </td>
                                  <td className="p-3 text-slate-600 dark:text-slate-300 align-top leading-relaxed">
                                    {item.rootCause}
                                  </td>
                                  <td className="p-3 font-mono text-blue-600 dark:text-blue-400 font-semibold align-top whitespace-nowrap">
                                    {item.diagnosticAssay}
                                  </td>
                                  <td className="p-3 text-emerald-800 dark:text-emerald-300 font-medium bg-emerald-50/40 dark:bg-emerald-950/20 align-top leading-relaxed">
                                    {item.correctiveAction}
                                  </td>
                                  <td className="p-3 font-mono text-slate-900 dark:text-white font-bold align-top whitespace-nowrap">
                                    {item.expectedBenchmark}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                          {isArabic ? 'مصفوفة الأعطال غير متوفرة في هذه النسخة.' : 'Troubleshooting matrix not available.'}
                        </div>
                      )}
                    </div>
                  )}

                  {/* SECTION 4: FULL ADVISORY REPORT & MERMAID FLOWCHART */}
                  {activeSection === 'REPORT' && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
                      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            {isArabic ? 'التقرير الاستشاري النخبوي ومخطط سير العمليات' : 'Comprehensive Scientific Advisory Report & Flowchart'}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {isArabic ? 'تقرير استشاري شامل يتضمن التفاعلات الكيميائية ومخطط التدفق التفاعلي Mermaid' : 'Includes mathematical mass balances, kinetic equations, and interactive Mermaid diagram.'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={downloadPDF}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{isArabic ? 'تصدير PDF' : 'Export PDF'}</span>
                        </button>
                      </div>

                      {result.consultingReportMarkdown ? (
                        <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm">
                          <CustomMarkdown>{result.consultingReportMarkdown}</CustomMarkdown>
                        </div>
                      ) : (
                        <div className="text-center py-10 text-xs text-slate-500">
                          {isArabic ? 'التقرير المفصل غير متوفر.' : 'Detailed markdown report not available.'}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </motion.div>
            )}

          </motion.div>
        ) : (
          /* HISTORY PANEL */
          <motion.div
            key="history-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden"
          >
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/40">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {isArabic ? 'سجل الأبحاث والدراسات السابقة' : 'Research Diagnostic History'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isArabic ? 'انقر على أي دراسة لاسترجاع تشخيصها، مخططاتها البيانية، وبروتوكولها المعملي' : 'Click any study to restore its multi-agent diagnostic breakdown, charts, and bench SOP.'}
                </p>
              </div>

              {history.length > 0 && (
                <button
                  type="button"
                  onClick={onClear}
                  className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors"
                >
                  {isArabic ? 'مسح السجل' : 'Clear All'}
                </button>
              )}
            </div>

            <div className="p-5 sm:p-6">
              {history.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <FlaskConical className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    {isArabic ? 'لا توجد أبحاث محفوظة في السجل.' : 'No research history found.'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {isArabic ? 'قم بتشغيل أول دراسة علمية ليتم أرشفتها هنا تلقائياً.' : 'Execute your first scientific challenge to archive it here.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {history.map((entry) => (
                    <div
                      key={entry.id}
                      onClick={() => {
                        setResult(entry.fullData as any);
                        setTopic(entry.topic);
                        setViewMode('SOLVER');
                        setActiveSection('AGENTS');
                      }}
                      className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-500/50 bg-slate-50 dark:bg-slate-800/30 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/10 transition-all cursor-pointer flex justify-between items-center group"
                    >
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {entry.topic}
                        </h4>
                        <span className="text-[11px] text-slate-400 mt-1 inline-block font-mono">
                          {entry.timestamp}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
