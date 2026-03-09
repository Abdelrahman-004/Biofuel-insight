
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Microscope, 
  Lightbulb, 
  Leaf, 
  Globe, 
  MapPin, 
  ArrowRight, 
  Zap,
  Shield,
  Cpu
} from 'lucide-react';

interface HomeProps {
  onStart: (tool: 'INVESTOR_FEASIBILITY' | 'RESEARCH' | 'SOLVER' | 'OPTIMIZER' | 'STANDARDS' | 'ZONES') => void;
}

export const Home: React.FC<HomeProps> = ({ onStart }) => {

  const tools = [
    {
      id: 'INVESTOR_FEASIBILITY',
      title: 'Investor Feasibility',
      description: 'Professional assessment of technical and economic viability for energy projects in Oman.',
      icon: TrendingUp,
      color: 'from-green-500/20 to-green-500/5',
      accent: 'text-green-400',
      size: 'large'
    },
    {
      id: 'RESEARCH',
      title: 'Research Analyzer',
      description: 'Bridge the gap between lab research and pilot-scale production with scientific scaling benchmarks.',
      icon: Microscope,
      color: 'from-blue-500/20 to-blue-500/5',
      accent: 'text-blue-400',
      size: 'small'
    },
    {
      id: 'SOLVER',
      title: 'Challenge Solver',
      description: "Identify and solve technical bottlenecks in the biofuel ecosystem using multi-agent AI.",
      icon: Lightbulb,
      color: 'from-amber-500/20 to-amber-500/5',
      accent: 'text-amber-400',
      size: 'small'
    },
    {
      id: 'OPTIMIZER',
      title: 'Profit Optimizer',
      description: 'Maximize revenue streams and minimize carbon emissions through strategic co-product analysis.',
      icon: Leaf,
      color: 'from-green-500/20 to-green-500/5',
      accent: 'text-green-400',
      size: 'small'
    },
    {
      id: 'STANDARDS',
      title: 'Global Standards',
      description: 'Stay updated with international biofuel regulations and sustainability certifications.',
      icon: Globe,
      color: 'from-slate-500/20 to-slate-500/5',
      accent: 'text-slate-400',
      size: 'small'
    },
    {
      id: 'ZONES',
      title: 'Strategic Zones',
      description: "Explore Oman's free zones (Sohar, Duqm, Salalah) for optimal facility location.",
      icon: MapPin,
      color: 'from-indigo-500/20 to-indigo-500/5',
      accent: 'text-indigo-400',
      size: 'large'
    }
  ];

  return (
    <div className="bg-slate-950 text-slate-200 selection:bg-green-500/30 selection:text-green-400 min-h-screen">
      {/* Hero Section - Modern Dark */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-green-500/10 blur-[120px] rounded-full -z-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-600/5 blur-[100px] rounded-full -z-10"></div>
        
        <div className="max-w-6xl mx-auto text-center relative">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/20 px-4 py-1.5 rounded-full mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-green-400">Vision 2040 Intelligence Platform</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter text-white"
          >
            BIOFUEL <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">INSIGHT AI</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
          >
            The next-generation intelligence layer for Oman's energy transition. 
            Bridging the gap between lab research and industrial investment.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <button 
              onClick={() => onStart('INVESTOR_FEASIBILITY')}
              className="bg-green-500 hover:bg-green-400 text-slate-950 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-[0_0_40px_rgba(34,197,94,0.2)] hover:shadow-[0_0_60px_rgba(34,197,94,0.4)] hover:-translate-y-1"
            >
              Launch Analysis
            </button>
            <button 
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-slate-900/50 hover:bg-slate-800 border border-slate-800 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all backdrop-blur-md"
            >
              Explore Tech
            </button>
          </motion.div>
        </div>
      </section>

      {/* Quote Section - Oman Vision 2040 */}
      <section className="max-w-4xl mx-auto px-4 -mt-10 mb-32 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative py-12"
        >
          <span className="text-9xl font-serif text-green-500/10 absolute -top-10 left-0 select-none">“</span>
          <blockquote className="relative z-10">
            <p className="text-2xl md:text-4xl font-light italic text-slate-200 leading-relaxed mb-10 font-serif">
              Oman Vision 2040 is the gateway to overcoming challenges, keeping pace with changes, and generating opportunities for the upcoming stage of Oman's development.
            </p>
            <footer className="flex flex-col items-center">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent mb-6"></div>
              <cite className="not-italic">
                <span className="block text-white font-black uppercase tracking-[0.4em] text-sm mb-1">His Majesty Sultan Haitham bin Tariq</span>
                <span className="block text-green-500/60 text-[10px] uppercase font-black tracking-[0.2em]">Sultan of Oman</span>
              </cite>
            </footer>
          </blockquote>
          <span className="text-9xl font-serif text-green-500/10 absolute -bottom-20 right-0 select-none">”</span>
        </motion.div>
      </section>

      {/* Tools Grid - Modern Bento Design */}
      <section className="py-32 px-4 relative">
        <div className="absolute inset-0 bg-green-500/[0.01] -z-10"></div>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter"
            >
              EXPLORE THE <span className="text-green-500">SUITE</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 uppercase tracking-[0.3em] text-[10px] font-black"
            >
              Comprehensive solutions for the 2040 Vision
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
            {tools.map((tool, index) => (
              <motion.div 
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onStart(tool.id as any)}
                className={`
                  relative group cursor-pointer overflow-hidden rounded-[2rem] border border-white/5 bg-slate-900/40 backdrop-blur-md transition-all duration-500 hover:border-green-500/30 hover:bg-slate-900/60
                  ${tool.size === 'large' ? 'md:col-span-2' : 'md:col-span-1'}
                `}
              >
                {/* Decorative Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative h-full p-8 flex flex-col justify-between z-10">
                  <div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-950/50 border border-white/10 ${tool.accent} mb-6 group-hover:scale-110 transition-transform duration-500`}>
                      <tool.icon size={24} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-widest">{tool.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed max-w-md group-hover:text-slate-200 transition-colors duration-500">{tool.description}</p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className={`flex items-center ${tool.accent} text-[10px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0`}>
                      <span>Initialize Tool</span>
                      <ArrowRight size={12} className="ml-2" />
                    </div>
                    <div className="text-slate-700 group-hover:text-green-500/30 transition-colors">
                      <tool.icon size={48} strokeWidth={1} className="opacity-10 group-hover:opacity-20" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works & Benefits - Modern Split */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 py-32 grid md:grid-cols-2 gap-20 items-center">
        <div className="relative">
          <div className="absolute -left-10 top-0 w-1 h-20 bg-green-500"></div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter">
            INTELLIGENT <br />
            <span className="text-green-500">ECOSYSTEM</span>
          </h2>
          <p className="text-slate-400 leading-relaxed mb-10 text-lg">
            Biofuel Insight AI leverages advanced multi-agent systems to process complex technical and economic data. 
            We integrate regional benchmarks from Oman's strategic free zones with global sustainability standards.
          </p>
          <div className="space-y-8">
            <div className="flex items-start space-x-6 group">
              <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl group-hover:bg-green-500 group-hover:text-black transition-all">
                <Zap size={20} />
              </div>
              <div>
                <h4 className="font-black text-white uppercase tracking-widest text-sm mb-2">For Investors</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Reduces financial risk by providing data-driven CAPEX/OPEX estimates and payback analysis.</p>
              </div>
            </div>
            <div className="flex items-start space-x-6 group">
              <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl group-hover:bg-green-500 group-hover:text-black transition-all">
                <Cpu size={20} />
              </div>
              <div>
                <h4 className="font-black text-white uppercase tracking-widest text-sm mb-2">For Researchers</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Accelerates innovation by translating laboratory results into realistic implementation roadmaps.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-[2.5rem] p-12 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[50px] rounded-full"></div>
          <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-widest">Platform Summary</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-10">
            Our platform bridges the gap between scientific discovery and industrial application. 
            Whether you are calculating the IRR of a new biofuel facility in Oman's strategic free zones 
            or scaling up diverse feedstock research—from waste oils to lignocellulosic biomass—at a 
            university lab, Biofuel Insight AI provides the precision tools needed for success.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-black/40 p-6 rounded-3xl border border-white/5">
              <div className="text-4xl font-black text-green-500 mb-1">98%</div>
              <div className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Data Accuracy</div>
            </div>
            <div className="bg-black/40 p-6 rounded-3xl border border-white/5">
              <div className="text-4xl font-black text-green-500 mb-1">6+</div>
              <div className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Expert Tools</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
