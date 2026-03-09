
import * as React from 'react';
import { motion } from 'framer-motion';
import { ResearchImplementationAnalysis } from './types';

interface ResearchDashboardProps {
  data: ResearchImplementationAnalysis;
}

export const ResearchDashboard: React.FC<ResearchDashboardProps> = ({ data }) => {
  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-amber-500';
    return 'text-red-500';
  };

  // Safety check for missing data
  if (!data || !data.ResearchInputs || !data.ReadinessScore) {
    return (
      <div className="p-8 text-center text-slate-500">
        <i className="fas fa-exclamation-triangle text-4xl mb-4 text-amber-500"></i>
        <p>Incomplete analysis data. Please try analyzing again.</p>
      </div>
    );
  }

  // Safe access helper for cost items
  const safeCost = (item: any) => ({
    USD: item?.USD || 'N/A',
    OMR: item?.OMR || 'N/A'
  });

  // Safe access for nested objects
  const costs = data.CostEstimation || {
    EquipmentCosts: {
      ReactorSystem: {}, PreTreatmentSystem: {}, HeatingCoolingSystems: {}, 
      DistillationUpgradingUnit: {}, StorageTanks: {}, SafetyMonitoringSystems: {},
      TotalEquipmentCost: {}
    },
    InstallationSetupCost: {},
    AnnualOperatingCost: {
      FeedstockCost: {}, EnergyConsumption: {}, Maintenance: {}, Consumables: {},
      TotalAnnualOperatingCost: {}, LaboratoryStaff: 'N/A'
    },
    TotalInitialBudgetRange: {},
    CostAssumptions: []
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-20"
    >
      {/* Header & Scientific Summary */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl border border-slate-800 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <i className="fas fa-microscope text-[12rem]"></i>
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-2">Research Implementation Analysis</h2>
              <div className="flex items-center space-x-4 text-sm text-slate-400 font-bold uppercase tracking-widest">
                <span>{data.ResearchInputs.BiofuelType}</span>
                <span>•</span>
                <span>{data.ResearchInputs.ConversionPathway} Pathway</span>
                <span>•</span>
                <span>TRL {data.ResearchInputs.TechnologyReadinessLevel}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 bg-blue-500 text-white px-6 py-3 rounded-2xl shadow-lg flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-tighter opacity-80">Implementation Score</span>
              <span className="text-3xl font-black">{data.ReadinessScore.OverallScore}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white/5 p-6 rounded-2xl border border-white/10">
              <h3 className="text-blue-400 font-black uppercase text-xs tracking-widest mb-4 flex items-center">
                <i className="fas fa-flask mr-2"></i> Scientific Summary
              </h3>
              <p className="text-lg text-slate-200 leading-relaxed italic">
                {data.ScientificSummary}
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target Pilot Scale</p>
                <p className="text-xl font-black text-white">{data.ResearchInputs.DesiredPilotScale}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Lab Efficiency</p>
                <p className="text-xl font-black text-emerald-400">{data.ResearchInputs.ConversionEfficiency}%</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Lab Yield</p>
                <p className="text-sm font-black text-blue-400 uppercase">{data.ResearchInputs.LaboratoryYield}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Implementation Estimator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200"
        >
          <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center">
            <i className="fas fa-tools mr-3 text-blue-600"></i> Equipment & Setup
          </h3>
          <div className="space-y-4">
            {data.ImplementationEstimator.EquipmentSetup.map((item, i) => (
              <div key={i} className="flex items-start p-3 bg-slate-50 rounded-xl border border-slate-100">
                <i className="fas fa-check-circle text-blue-500 mr-3 mt-1"></i>
                <span className="text-sm text-slate-700 font-medium">{item}</span>
              </div>
            ))}
            <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Energy & Utilities</p>
              <p className="text-sm text-blue-900 leading-relaxed">{data.ImplementationEstimator.EnergyUtilities}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200"
        >
          <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center">
            <i className="fas fa-vial-circle-check mr-3 text-emerald-600"></i> Pilot-Scale Estimator
          </h3>
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Feedstock Requirements</p>
              <p className="text-sm text-slate-800 font-bold leading-relaxed">{data.ImplementationEstimator.FeedstockRequirements}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Efficiency Adjustments</p>
              <p className="text-sm text-slate-700 leading-relaxed italic border-l-4 border-emerald-100 pl-4">
                {data.ImplementationEstimator.EfficiencyAdjustments}
              </p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Waste Management</p>
              <p className="text-sm text-emerald-900 leading-relaxed">{data.ImplementationEstimator.WasteManagement}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Production Output */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200"
      >
        <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center">
          <i className="fas fa-flask-vial mr-3 text-purple-600"></i> Production Output Estimation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-purple-50 p-4 rounded-2xl">
            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1">Annual Fuel Output</p>
            <p className="text-lg font-black text-purple-900">{data.ProductionOutput.AnnualFuelOutput}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl">
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Energy Equivalent</p>
            <p className="text-lg font-black text-blue-900">{data.ProductionOutput.EnergyOutput}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">By-Product Potential</p>
            <p className="text-sm text-slate-700 font-bold">{data.ProductionOutput.ByProductValueEstimation}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl">
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Carbon Reduction</p>
            <p className="text-sm text-emerald-600 font-bold">{data.ProductionOutput.CarbonReductionPotential}</p>
          </div>
        </div>
      </motion.div>

      {/* TRL Scaling Roadmap */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-slate-900 flex items-center">
            <i className="fas fa-map-signs mr-3 text-indigo-600"></i> TRL Scaling Roadmap
          </h3>
          <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100">
            Research-to-Commercial Path
          </span>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-100 -translate-x-1/2 hidden md:block"></div>
          
          <div className="space-y-12 relative">
            {(data.TRLRoadmap || []).map((step, i) => (
              <div key={i} className={`flex flex-col md:flex-row items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="flex-1 w-full md:w-auto">
                  <div className={`p-6 rounded-2xl border ${data.ResearchInputs.TechnologyReadinessLevel >= step.trl ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${data.ResearchInputs.TechnologyReadinessLevel >= step.trl ? 'bg-indigo-600 text-white' : 'bg-slate-400 text-white'}`}>
                        TRL {step.trl}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{step.estimatedDuration}</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900 mb-2">{step.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">{step.description}</p>
                    <div className="space-y-2">
                      {step.keyMilestones.map((m, mi) => (
                        <div key={mi} className="flex items-center text-[10px] text-slate-500 font-bold">
                          <i className="fas fa-check-circle mr-2 text-indigo-400"></i>
                          {m}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mx-8 my-4 md:my-0 relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md ${data.ResearchInputs.TechnologyReadinessLevel >= step.trl ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                    {data.ResearchInputs.TechnologyReadinessLevel >= step.trl ? <i className="fas fa-check text-xs"></i> : <span className="text-xs font-black">{step.trl}</span>}
                  </div>
                </div>
                
                <div className="flex-1 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Readiness Scores */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200"
      >
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Research Implementation Readiness Metrics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Technical Scalability', score: data.ReadinessScore.TechnicalScalability },
            { label: 'Experimental Feasibility', score: data.ReadinessScore.ExperimentalFeasibility },
            { label: 'Safety & Environmental', score: data.ReadinessScore.SafetyEnvironmental },
            { label: 'Small-Scale Readiness', score: data.ReadinessScore.ReadinessForSmallScale },
          ].map((m, i) => (
            <div key={i} className="text-center">
              <div className={`text-3xl font-black mb-1 ${scoreColor(m.score)}`}>{m.score}%</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.label}</div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className={`h-full ${m.score >= 80 ? 'bg-emerald-500' : m.score >= 60 ? 'bg-blue-500' : m.score >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${m.score}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Pilot-Scale Implementation Cost Estimation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-slate-50 p-8 rounded-3xl shadow-sm border border-slate-200"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h3 className="text-xl font-black text-slate-900 flex items-center">
            <i className="fas fa-university mr-3 text-amber-600"></i> Academic Pilot-Scale Cost Approximation
          </h3>
          <span className="mt-2 md:mt-0 text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 px-3 py-1 rounded-full border border-amber-200">
            University-Based System
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-100">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Equipment Cost Estimate</h4>
            <div className="space-y-3">
              {[
                { label: 'Reactor System', val: safeCost(costs.EquipmentCosts.ReactorSystem) },
                { label: 'Pre-treatment System', val: safeCost(costs.EquipmentCosts.PreTreatmentSystem) },
                { label: 'Heating/Cooling Systems', val: safeCost(costs.EquipmentCosts.HeatingCoolingSystems) },
                { label: 'Distillation/Upgrading Unit', val: safeCost(costs.EquipmentCosts.DistillationUpgradingUnit) },
                { label: 'Storage Tanks', val: safeCost(costs.EquipmentCosts.StorageTanks) },
                { label: 'Safety & Monitoring', val: safeCost(costs.EquipmentCosts.SafetyMonitoringSystems) },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 text-sm">
                  <span className="text-slate-600 font-medium">{item.label}</span>
                  <div className="text-right">
                    <div className="text-slate-900 font-bold">{item.val.USD}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{item.val.OMR}</div>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <span className="text-slate-900 font-black uppercase tracking-widest text-[10px]">Total Equipment Cost</span>
                <div className="text-right">
                  <div className="text-blue-600 font-black">{safeCost(costs.EquipmentCosts.TotalEquipmentCost).USD}</div>
                  <div className="text-[10px] text-blue-400 font-bold">{safeCost(costs.EquipmentCosts.TotalEquipmentCost).OMR}</div>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-900 font-black uppercase tracking-widest text-[10px]">Installation & Setup (20-30%)</span>
                <div className="text-right">
                  <div className="text-blue-600 font-black">{safeCost(costs.InstallationSetupCost).USD}</div>
                  <div className="text-[10px] text-blue-400 font-bold">{safeCost(costs.InstallationSetupCost).OMR}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Annual Operating Cost</h4>
            <div className="space-y-3">
              {[
                { label: 'Feedstock Cost', val: safeCost(costs.AnnualOperatingCost.FeedstockCost) },
                { label: 'Energy Consumption', val: safeCost(costs.AnnualOperatingCost.EnergyConsumption) },
                { label: 'Maintenance', val: safeCost(costs.AnnualOperatingCost.Maintenance) },
                { label: 'Consumables', val: safeCost(costs.AnnualOperatingCost.Consumables) },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 text-sm">
                  <span className="text-slate-600 font-medium">{item.label}</span>
                  <div className="text-right">
                    <div className="text-slate-900 font-bold">{item.val.USD}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{item.val.OMR}</div>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center py-2 border-b border-slate-50 text-sm">
                <span className="text-slate-600 font-medium">Laboratory Staff</span>
                <span className="text-slate-900 font-bold">{costs.AnnualOperatingCost.LaboratoryStaff || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center pt-4">
                <span className="text-slate-900 font-black uppercase tracking-widest text-[10px]">Total Annual Operating</span>
                <div className="text-right">
                  <div className="text-emerald-600 font-black">{safeCost(costs.AnnualOperatingCost.TotalAnnualOperatingCost).USD}</div>
                  <div className="text-[10px] text-emerald-400 font-bold">{safeCost(costs.AnnualOperatingCost.TotalAnnualOperatingCost).OMR}</div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-amber-600 text-white rounded-2xl shadow-lg">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Total Initial Budget Required</p>
              <div className="flex flex-col">
                <span className="text-2xl font-black">{safeCost(costs.TotalInitialBudgetRange).USD}</span>
                <span className="text-sm font-bold opacity-90">{safeCost(costs.TotalInitialBudgetRange).OMR}</span>
              </div>
              <p className="text-[10px] mt-2 italic opacity-70">Estimated Budget Required to Implement This Research at Pilot Scale</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Cost Assumptions</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            {(costs.CostAssumptions || []).map((assumption: string, i: number) => (
              <li key={i} className="text-xs text-slate-500 flex items-start">
                <i className="fas fa-info-circle text-amber-400 mr-2 mt-0.5"></i>
                {assumption}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Risks & Assumptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200"
        >
          <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center">
            <i className="fas fa-triangle-exclamation mr-3 text-red-500"></i> Uncertainties & Risk Factors
          </h3>
          <ul className="space-y-3">
            {data.RiskFactors.map((risk, i) => (
              <li key={i} className="flex items-start text-sm text-slate-700 bg-red-50/30 p-3 rounded-xl border border-red-100/50">
                <i className="fas fa-circle-exclamation text-red-500 mr-3 mt-1"></i>
                {risk}
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200"
        >
          <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center">
            <i className="fas fa-clipboard-list mr-3 text-slate-400"></i> Scientific Assumptions
          </h3>
          <ul className="space-y-3">
            {data.Assumptions.map((assumption, i) => (
              <li key={i} className="flex items-start text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <i className="fas fa-info-circle text-blue-400 mr-3 mt-1"></i>
                {assumption}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
};
