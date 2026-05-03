
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
  onStart: (tool: 'MARKETPLACE' | 'INVESTOR_FEASIBILITY' | 'RESEARCH' | 'SOLVER' | 'OPTIMIZER' | 'STANDARDS' | 'PROPOSAL' | 'ZONES') => void;
  language?: 'English' | 'Arabic';
}

export const Home: React.FC<HomeProps> = ({ onStart, language = 'English' }) => {
  const isArabic = language === 'Arabic';

  const tools = [
    {
      id: 'MARKETPLACE',
      title: isArabic ? 'منصة الاستثمار الذكية' : 'Smart Marketplace',
      description: isArabic ? 'بوابة عرض المشاريع وفرص الوقود الحيوي للمستثمرين والباحثين مع المطابقة الاستثمارية.' : 'A hub for showcasing biofuel projects to investors and researchers with smart matching criteria.',
      icon: TrendingUp,
      color: 'from-emerald-500/20 to-emerald-500/5',
      accent: 'text-[var(--accent-emerald)] dark:text-emerald-400',
      size: 'large'
    },
    {
      id: 'INVESTOR_FEASIBILITY',
      title: isArabic ? 'دراسة الجدوى الاستثمارية' : 'Investor Feasibility',
      description: isArabic ? 'تقييم احترافي للجدوى الفنية والاقتصادية لمشاريع الطاقة والوقود الحيوي في عُمان، مدعوم بأرقام وحقائق استثمارية.' : 'Professional assessment of technical and economic viability for energy projects in Oman.',
      icon: TrendingUp,
      color: 'from-green-500/20 to-green-500/5',
      accent: 'text-[var(--accent-emerald)] dark:text-emerald-400',
      size: 'small'
    },
    {
      id: 'RESEARCH',
      title: isArabic ? 'تحليل البحوث المخبرية' : 'Research Analyzer',
      description: isArabic ? 'سد الفجوة بين الأبحاث المختبرية والإنتاج التجريبي بمعايير تقنية دقيقة لحساب الكفاءة.' : 'Bridge the gap between lab research and pilot-scale production with scientific scaling benchmarks.',
      icon: Microscope,
      color: 'from-blue-500/20 to-blue-500/5',
      accent: 'text-blue-400',
      size: 'small'
    },
    {
      id: 'SOLVER',
      title: isArabic ? 'حل العوائق التقنية' : 'Challenge Solver',
      description: isArabic ? 'تحديد وحل الاختناقات التقنية في قطاع الوقود الحيوي باستخدام الذكاء الاصطناعي المتقدم لإنتاج حلول مبتكرة.' : "Identify and solve technical bottlenecks in the biofuel ecosystem using multi-agent AI.",
      icon: Lightbulb,
      color: 'from-amber-500/20 to-amber-500/5',
      accent: 'text-amber-400',
      size: 'small'
    },
    {
      id: 'OPTIMIZER',
      title: isArabic ? 'التحسين المالي وتقليل الانبعاثات' : 'Profit Optimizer',
      description: isArabic ? 'تعظيم الإيرادات وتقليل الانبعاثات الكربونية من خلال تحليل المنتجات المشتركة وسلاسل الإمداد.' : 'Maximize revenue streams and minimize carbon emissions through strategic co-product analysis.',
      icon: Leaf,
      color: 'from-green-500/20 to-green-500/5',
      accent: 'text-[var(--accent-emerald)] dark:text-emerald-400',
      size: 'small'
    },
    {
      id: 'STANDARDS',
      title: isArabic ? 'مطابقة المعايير الدولية' : 'Standards Checker',
      description: isArabic ? 'تأكد من نتائجك المختبرية مقابل المعايير الدولية (ASTM/EN) لضمان الجاهزية التجارية والامتثال.' : 'Verify your biofuel lab results against international standards (ASTM/EN) for commercial viability.',
      icon: Globe,
      color: 'from-slate-500/20 to-slate-500/5',
      accent: 'text-[var(--text-secondary)]',
      size: 'small'
    },
    {
      id: 'PROPOSAL',
      title: isArabic ? 'إنشاء المقترحات الاستثمارية' : 'Proposal Generator',
      description: isArabic ? 'إصدار مقترحات مالية مبنية على البيانات والأرقام الموثوقة لجذب المستثمرين والمنح في عُمان.' : 'Generate professional, data-driven grant and investment proposals tailored for Oman.',
      icon: Lightbulb,
      color: 'from-emerald-500/20 to-emerald-500/5',
      accent: 'text-[var(--accent-emerald)] dark:text-emerald-400',
      size: 'small'
    },
    {
      id: 'ZONES',
      title: isArabic ? 'المناطق الاستراتيجية والحرة' : 'Strategic Zones',
      description: isArabic ? 'استكشف المناطق الاستراتيجية (الدقم، صحار، صلالة) لتحديد الموقع المثالي والدعم الحكومي المتوفر.' : "Explore Oman's free zones (Sohar, Duqm, Salalah) for optimal facility location.",
      icon: MapPin,
      color: 'from-indigo-500/20 to-indigo-500/5',
      accent: 'text-indigo-400',
      size: 'large'
    }
  ];

  return (
    <div className="text-[var(--text-secondary)]  selection:bg-[var(--accent-emerald)]/30 selection:text-[var(--accent-emerald)] dark:text-emerald-400 min-h-screen" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Hero Section - Modern Dark */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[var(--accent-emerald)]/10 blur-[120px] rounded-full -z-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-600/5 blur-[100px] rounded-full -z-10"></div>
        
        <div className="max-w-6xl mx-auto text-center relative">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center space-x-2 bg-[var(--accent-emerald)]/10 border border-green-500/20 px-4 py-1.5 rounded-full mb-8 rtl:space-x-reverse"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-emerald)]"></span>
            </span>
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-[var(--accent-emerald)] dark:text-emerald-400">
              {isArabic ? 'منصة ذكاء رؤية 2040' : 'Vision 2040 Intelligence Platform'}
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter text-[var(--text-primary)]"
          >
            {isArabic ? 'عُمان' : 'OMAN'} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
              {isArabic ? 'إيكو سينك' : 'ECOSYNC'}
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
          >
            {isArabic 
              ? 'نمذجة استثمارية ومالية متقدمة لمشاريع الطاقة الشمسية، الهيدروجين الأخضر، والوقود الحيوي في عُمان. صُنع للمستثمرين والباحثين.' 
              : "Advanced financial and technical modeling for Solar, Green Hydrogen, and Biofuel projects in Oman. Built for investors and researchers."}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <button 
              onClick={() => onStart('INVESTOR_FEASIBILITY')}
              className="bg-[var(--accent-emerald)] hover:bg-green-400 text-slate-950 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-md hover:shadow-md hover:-translate-y-1"
            >
              {isArabic ? 'بدء التحليل' : 'Launch Analysis'}
            </button>
            <button 
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[var(--card-bg)] shadow-card hover:bg-[var(--bg-main)] border border-[var(--border-glow)] text-[var(--text-primary)] px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all "
            >
              {isArabic ? 'اكتشف التقنية' : 'Explore Tech'}
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
          <span className={`text-9xl font-serif text-[var(--accent-emerald)] dark:text-emerald-400/10 absolute -top-10 ${isArabic ? 'right-0' : 'left-0'} select-none`}>“</span>
          <blockquote className="relative z-10">
            <p className="text-2xl md:text-3xl font-light italic text-[var(--text-secondary)]  leading-relaxed mb-10 font-serif">
              {isArabic 
                ? 'رؤية عُمان 2040 هي بوابة عبور التحديات، ومواكبة المتغيرات، واستثمار المتاح من الفرص، من أجل بناء دولة حديثة قادرة على الانتقال للمستقبل بثقة.' 
                : "Oman Vision 2040 is the gateway to overcoming challenges, keeping pace with changes, and generating opportunities for the upcoming stage of Oman's development."}
            </p>
            <footer className="flex flex-col items-center">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent mb-6"></div>
              <cite className="not-italic">
                <span className="block text-[var(--text-primary)] font-black uppercase tracking-[0.4em] text-sm mb-1">
                  {isArabic ? 'صاحب الجلالة السلطان هيثم بن طارق' : 'His Majesty Sultan Haitham bin Tariq'}
                </span>
                <span className="block text-[var(--accent-emerald)] dark:text-emerald-400/60 text-[10px] uppercase font-black tracking-[0.2em]">
                  {isArabic ? 'سلطان عُمان' : 'Sultan of Oman'}
                </span>
              </cite>
            </footer>
          </blockquote>
          <span className={`text-9xl font-serif text-[var(--accent-emerald)] dark:text-emerald-400/10 absolute -bottom-20 ${isArabic ? 'left-0' : 'right-0'} select-none`}>”</span>
        </motion.div>
      </section>

      {/* Tools Grid - Modern Bento Design */}
      <section className="py-32 px-4 relative">
        <div className="absolute inset-0 bg-[var(--accent-emerald)]/[0.01] -z-10"></div>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black text-[var(--text-primary)] mb-6 tracking-tighter"
            >
              {isArabic ? <><span className="text-[var(--accent-emerald)] dark:text-emerald-400">استكشف</span> المنصة</> : <>EXPLORE THE <span className="text-[var(--accent-emerald)] dark:text-emerald-400">SUITE</span></>}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[var(--text-secondary)] uppercase tracking-[0.3em] text-[10px] font-black"
            >
              {isArabic ? 'حلول شاملة متوافقة مع رؤية 2040' : 'Comprehensive solutions for the 2040 Vision'}
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
                  relative group cursor-pointer overflow-hidden rounded-[2rem] border border-[var(--border-glow)] bg-[var(--card-bg)] shadow-card   border-[var(--border-glow)] hover:border-var(--accent-emerald) transition-all duration-500 hover:border-[var(--accent-emerald)] hover:shadow-card shadow-sm
                  ${tool.size === 'large' ? 'md:col-span-2' : 'md:col-span-1'}
                `}
              >
                {/* Decorative Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative h-full p-8 flex flex-col justify-between z-10">
                  <div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--bg-main)] border border-[var(--border-glow)] ${tool.accent} mb-6 group-hover:scale-110 transition-transform duration-500`}>
                      <tool.icon size={24} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-2xl font-black text-[var(--text-primary)] mb-3 uppercase tracking-widest">{tool.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-md transition-colors duration-500">{tool.description}</p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className={`flex items-center ${tool.accent} text-[10px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-500 ${isArabic ? 'translate-x-[10px]' : 'translate-x-[-10px]'} group-hover:translate-x-0`}>
                      <span>{isArabic ? 'تشغيل الأداة' : 'Initialize Tool'}</span>
                      <ArrowRight size={12} className={isArabic ? 'mr-2 rotate-180' : 'ml-2'} />
                    </div>
                    <div className="text-[var(--text-secondary)]  group-hover:text-[var(--accent-emerald)] dark:text-emerald-400/20 transition-colors">
                      <tool.icon size={48} strokeWidth={1} className="opacity-50 group-hover:opacity-100" />
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
          <div className={`absolute ${isArabic ? '-right-10' : '-left-10'} top-0 w-1 h-20 bg-[var(--accent-emerald)]`}></div>
          <h2 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] mb-8 tracking-tighter">
            {isArabic ? <>الميزة <br /><span className="text-[var(--accent-emerald)] dark:text-emerald-400">التنافسية</span></> : <>OUR UNIQUE <br /><span className="text-[var(--accent-emerald)] dark:text-emerald-400">ADVANTAGE</span></>}
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-6 text-lg">
            {isArabic 
              ? 'الأداة ليست مجرد محادثة عامة (Chat). نحن نقدم منصة عمليات متخصصة (Vertical AI) لنمذجة المشاريع الخضراء والطاقة.' 
              : "We are not a general-purpose chatbot. Insight AI is a Vertical AI platform running structured, multi-agent workflows specifically designed for clean energy modeling."}
          </p>
          <div className="space-y-6">
            <div className="flex items-start space-x-6 group rtl:space-x-reverse">
              <div className="bg-[var(--accent-emerald)]/10 border border-green-500/20 p-4 rounded-2xl group-hover:bg-[var(--accent-emerald)] group-hover:text-black transition-all">
                <Shield size={20} />
              </div>
              <div>
                <h4 className="font-black text-[var(--text-primary)] uppercase tracking-widest text-sm mb-2">{isArabic ? 'هندسة مالية محددة وليس نصوص عامة' : 'Deterministic Financial Modeling'}</h4>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{isArabic ? 'بعكس LLMs العامة، المنصة تفرض قوالب حسابية للمصروفات (CAPEX/OPEX) وتخرج أرقاماً متسقة للإيرادات بناءً على المعايير العالمية.' : 'Unlike generic LLMs, our platform enforces structured mathematical templates for CAPEX/OPEX calculations, producing consistent, enterprise-grade numbers.'}</p>
              </div>
            </div>
            <div className="flex items-start space-x-6 group rtl:space-x-reverse">
              <div className="bg-[var(--accent-emerald)]/10 border border-green-500/20 p-4 rounded-2xl group-hover:bg-[var(--accent-emerald)] group-hover:text-black transition-all">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="font-black text-[var(--text-primary)] uppercase tracking-widest text-sm mb-2">{isArabic ? 'بيانات السوق العماني (المناطق الحرة)' : 'Localized Oman Free Zone Data'}</h4>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{isArabic ? 'يتم دمج إعفاءات الضرائب المحددة والرسوم الجمركية للمناطق الحرة (صحار، الدقم، صلالة) مباشرة في التقرير الاستثماري.' : 'Tax exemptions and logistical parameters specific to Sohar, Duqm, and Salalah Free Zones are naturally injected into your investment proposals.'}</p>
              </div>
            </div>
            <div className="flex items-start space-x-6 group rtl:space-x-reverse">
              <div className="bg-[var(--accent-emerald)]/10 border border-green-500/20 p-4 rounded-2xl group-hover:bg-[var(--accent-emerald)] group-hover:text-black transition-all">
                <Globe size={20} />
              </div>
              <div>
                <h4 className="font-black text-[var(--text-primary)] uppercase tracking-widest text-sm mb-2">{isArabic ? 'دعم المعايير الصناعية (ASTM/EN)' : 'Industrial Standards Compliance'}</h4>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{isArabic ? 'يتم مطابقة نتائج الأبحاث والمشاريع آلياً مع المواصفات العالمية قبل تقديمها للمستثمرين.' : 'Research and facility outputs are programmatically validated against ASTM and EN standard rulesets before finalizing the pitch to investors.'}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-[var(--card-bg)] shadow-card backdrop-blur-sm rounded-[2.5rem] p-12 border border-[var(--border-glow)] relative overflow-hidden">
          <div className={`absolute top-0 ${isArabic ? 'left-0' : 'right-0'} w-32 h-32 bg-[var(--accent-emerald)]/10 blur-[50px] rounded-full`}></div>
          <h3 className="text-2xl font-black text-[var(--text-primary)] mb-6 uppercase tracking-widest">{isArabic ? 'دعم كافة قطاعات الطاقة' : 'All Clean Energy Sectors'}</h3>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-10">
            {isArabic 
              ? 'صممت المنصة للتوسع وخدمة شريحة المستثمرين، سواء كنت تحسب العائد لمشروع طاقة شمسية واسع النطاق، أو منشأة هيدروجين أخضر، أو إعادة تدوير النفايات.'
              : "Built to adapt to any sustainable transition fund. Whether calculating the operational return of a massive Solar farm, evaluating Green Hydrogen electrolysis scaling, or researching e-fuels, Insight AI provides the localized precision needed for success."}
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-black/5 dark:bg-black/40 text-[var(--text-primary)] p-6 rounded-3xl border border-[var(--border-glow)]">
              <div className="text-3xl font-black text-[var(--accent-emerald)] dark:text-emerald-400 mb-1">AI</div>
              <div className="text-[10px] uppercase font-black text-[var(--text-secondary)] tracking-widest">{isArabic ? 'وكلاء متخصصين' : 'Specialized Agents'}</div>
            </div>
            <div className="bg-black/5 dark:bg-black/40 text-[var(--text-primary)] p-6 rounded-3xl border border-[var(--border-glow)]">
              <div className="text-3xl font-black text-[var(--accent-emerald)] dark:text-emerald-400 mb-1">API</div>
              <div className="text-[10px] uppercase font-black text-[var(--text-secondary)] tracking-widest">{isArabic ? 'تقارير مهيكلة' : 'Structured Data'}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
