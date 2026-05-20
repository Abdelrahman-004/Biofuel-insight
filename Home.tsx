
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

  return (
    <div className="text-[var(--text-secondary)]  selection:bg-[var(--accent-emerald)]/30 selection:text-[var(--accent-emerald)] dark:text-emerald-400 min-h-screen" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Dynamic Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, var(--border-glow) 1px, transparent 1px), linear-gradient(to bottom, var(--border-glow) 1px, transparent 1px)', backgroundSize: '4rem 4rem', opacity: 0.2 }}></div>
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-transparent via-[var(--bg-main)]/80 to-[var(--bg-main)]"></div>



      {/* Hero Section - Modern Dark */}
      <section className="relative pt-24 pb-20 px-4 overflow-hidden z-10">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[var(--accent-emerald)]/10 blur-[120px] rounded-full -z-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-600/5 blur-[100px] rounded-full -z-10"></div>
        
        {/* Floating KPI Badges */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="hidden lg:flex absolute top-40 left-10 xl:left-32 bg-[var(--card-bg)]/80 backdrop-blur-md border border-[var(--border-glow)] px-4 py-3 rounded-2xl shadow-xl flex-col gap-1 z-20"
        >
          <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{isArabic ? 'دقة الذكاء الاصطناعي' : 'AI Accuracy'}</span>
          <span className="text-xl font-black text-[var(--accent-emerald)]">99.4%</span>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
          className="hidden lg:flex absolute bottom-40 right-10 xl:right-20 bg-[var(--card-bg)]/80 backdrop-blur-md border border-[var(--border-glow)] px-4 py-3 rounded-2xl shadow-xl flex-col gap-1 z-20"
        >
          <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{isArabic ? 'نماذج استثمارية' : 'Financial Scenarios'}</span>
          <span className="text-xl font-black text-[#8B5CF6]">10,000+</span>
        </motion.div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
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
              className="bg-[var(--card-bg)] shadow-card hover:bg-[var(--bg-main)] hover:-translate-y-1 border border-[var(--border-glow)] text-[var(--text-primary)] px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3"
            >
              <Cpu size={18} />
              {isArabic ? 'اكتشف التقنية' : 'Explore Tech'}
            </button>
          </motion.div>



          {/* Connected Grid / Floating Elements */}
          <div className="mt-16 pt-10 border-t border-[var(--border-glow)] max-w-4xl mx-auto flex flex-col items-center">
             <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[var(--text-secondary)] mb-6">
                {isArabic ? 'تمكين النظام البيئي للطاقة المتجددة' : 'Empowering the Clean Energy Ecosystem'}
             </p>
             <div className="flex flex-wrap justify-center gap-6 md:gap-12 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
               <span className="font-serif text-2xl font-bold">OQAE</span>
               <span className="font-sans text-xl font-black tracking-tighter">HYDROM</span>
               <span className="font-serif text-xl italic">PDO</span>
               <span className="font-mono text-xl font-bold">SOHAR PORT</span>
               <span className="font-sans text-2xl font-black">NAMA</span>
             </div>
          </div>
        </div>
      </section>

      {/* Quote Section - Oman Vision 2040 */}
      <section className="w-full max-w-5xl mx-auto px-4 mt-20 mb-32 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative py-16 px-10 md:px-20 rounded-[3rem] bg-[var(--card-bg)]/50 border border-[var(--border-glow)] backdrop-blur-xl shadow-2xl overflow-hidden"
        >
          {/* Decorative background elements within the card */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-emerald)]/5 to-transparent z-0"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-emerald)]/10 blur-[80px] rounded-full z-0 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8B5CF6]/10 blur-[80px] rounded-full z-0 pointer-events-none"></div>

          <span className={`text-[150px] font-serif text-[var(--accent-emerald)]/20 absolute -top-10 ${isArabic ? 'right-4' : 'left-4'} leading-none select-none z-0`}>“</span>
          
          <blockquote className="relative z-10 text-center">
            <p className="text-2xl md:text-4xl font-light italic text-[var(--text-primary)] leading-relaxed md:leading-loose mb-12 font-serif">
              {isArabic 
                ? 'رؤية عُمان 2040 هي بوابة عبور التحديات، ومواكبة المتغيرات، واستثمار المتاح من الفرص، من أجل بناء دولة حديثة قادرة على الانتقال للمستقبل بثقة.' 
                : "Oman Vision 2040 is the gateway to overcoming challenges, keeping pace with changes, and generating opportunities for the upcoming stage of Oman's development."}
            </p>
            <footer className="flex flex-col items-center">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--text-secondary)]"></div>
                <div className="w-2 h-2 rotate-45 border border-[var(--accent-emerald)]"></div>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--text-secondary)]"></div>
              </div>
              <cite className="not-italic">
                <span className="block text-[var(--text-primary)] font-black uppercase tracking-[0.4em] text-sm md:text-base mb-2">
                  {isArabic ? 'صاحب الجلالة السلطان هيثم بن طارق' : 'His Majesty Sultan Haitham bin Tariq'}
                </span>
                <span className="block text-[var(--accent-emerald)] text-[10px] md:text-xs uppercase font-black tracking-[0.3em]">
                  {isArabic ? 'سلطان عُمان' : 'Sultan of Oman'}
                </span>
              </cite>
            </footer>
          </blockquote>
          
          <span className={`text-[150px] font-serif text-[#8B5CF6]/20 absolute -bottom-20 ${isArabic ? 'left-4' : 'right-4'} leading-none select-none z-0`}>”</span>
        </motion.div>
      </section>

      {/* Features Grid - Modern Bento Design */}
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
              {isArabic ? <><span className="text-[var(--accent-emerald)] dark:text-emerald-400">مميزات</span> المنصة</> : <>PLATFORM <span className="text-[var(--accent-emerald)] dark:text-emerald-400">FEATURES</span></>}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[var(--text-secondary)] uppercase tracking-[0.3em] text-[10px] md:text-xs font-black max-w-2xl mx-auto"
            >
              {isArabic ? 'كيف تحل المنصة عقبات تمويل المشاريع البحثية ونقلها للسوق' : 'How the platform solves research commercialization and due diligence'}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
            {[
              {
                id: 'commercialization',
                title: isArabic ? 'تسويق الابتكار' : 'Commercializing Innovation',
                description: isArabic ? 'ربط مباشر للباحثين مع المستثمرين الصناعيين لردم الفجوة بين البحث المخبري والتطبيق التجاري.' : 'Directly connecting researchers to industrial investors, bridging the gap between lab research and marketization.',
                number: isArabic ? '+50 شريك استراتيجي' : '50+ Partners',
                icon: 'fa-handshake',
                size: 'large',
                color: 'from-blue-500/20 to-blue-500/5',
                accent: 'text-blue-500',
                glow: 'shadow-[0_0_60px_-15px_rgba(59,130,246,0.5)]'
              },
              {
                id: 'due_diligence',
                title: isArabic ? 'تسريع العناية الواجبة' : 'Accelerating Due Diligence',
                description: isArabic ? 'أتمتة عمليات التدقيق الفني والمالي للمستثمر باستخدام نماذج الذكاء الاصطناعي المتطورة.' : 'Automating technical and financial validation for investors using leading AI models.',
                number: isArabic ? '-75% وقت التقييم' : '75% Time Saved',
                icon: 'fa-bolt',
                size: 'small',
                color: 'from-emerald-500/20 to-emerald-500/5',
                accent: 'text-emerald-500',
                glow: 'shadow-[0_0_60px_-15px_rgba(16,185,129,0.5)]'
              },
              {
                id: 'financial',
                title: isArabic ? 'النمذجة المالية الاستثمارية' : 'Financial Modeling',
                description: isArabic ? 'نماذج استثمار عالية الدقة (CAPEX/OPEX) مبنية على بيانات الأسواق العُمانية الحية وتسعيرات الخدمات.' : 'High-precision CAPEX/OPEX predictive models based on live Omani market data and utility pricing.',
                number: isArabic ? '+99% دقة استثمارية' : '99%+ Accuracy',
                icon: 'fa-chart-pie',
                size: 'small',
                color: 'from-violet-500/20 to-violet-500/5',
                accent: 'text-violet-500',
                glow: 'shadow-[0_0_60px_-15px_rgba(139,92,246,0.5)]'
              },
              {
                id: 'zones',
                title: isArabic ? 'تكامل المناطق الاستراتيجية' : 'Strategic Zones Mapping',
                description: isArabic ? 'تحليل المواقع واختيار الأمثل عبر المناطق الحرة (الدقم، صحار، صلالة) للاستفادة من الإعفاءات اللوجستية.' : 'Site analysis and optimal selection across free zones (Duqm, Sohar, Salalah) maximizing tax benefits.',
                number: isArabic ? '3 مناطق استراتيجية' : '3 Strategic Zones',
                icon: 'fa-map-marked-alt',
                size: 'large',
                color: 'from-amber-500/20 to-amber-500/5',
                accent: 'text-amber-500',
                glow: 'shadow-[0_0_60px_-15px_rgba(245,158,11,0.5)]'
              }
            ].map((feature, index) => (
              <motion.div 
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`
                  relative group overflow-hidden rounded-[2rem] border border-[var(--border-glow)] bg-[var(--card-bg)] shadow-card transition-all duration-500 hover:-translate-y-2 hover:border-${feature.accent.split('-')[1] || 'emerald'}-500/50 hover:shadow-2xl hover:${feature.glow}
                  ${feature.size === 'large' ? 'md:col-span-2' : 'md:col-span-1'}
                `}
              >
                {/* Connecting Grid Lines for Tech Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '1.5rem 1.5rem' }}></div>
                
                {/* Decorative Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl scale-110 pointer-events-none`}></div>
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-20 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none`}></div>
                
                <div className="relative h-full p-8 flex flex-col justify-between z-10">
                  <div>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-[var(--bg-main)] border border-[var(--border-glow)] ${feature.accent} mb-6 shadow-xl`}>
                      <i className={`fas ${feature.icon} text-2xl`}></i>
                    </div>
                    <h3 className="text-2xl font-black text-[var(--text-primary)] mb-3 tracking-tight group-hover:text-[var(--text-primary)] transition-colors">{feature.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-md group-hover:text-[var(--text-primary)] transition-colors duration-500">{feature.description}</p>
                  </div>

                  <div className="flex items-center justify-between mt-4 border-t border-[var(--border-glow)] pt-4">
                    <div className={`font-mono text-sm md:text-base font-black tracking-widest ${feature.accent}`}>
                      {feature.number}
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
                <h4 className="font-black text-[var(--text-primary)] uppercase tracking-widest text-sm mb-2">{isArabic ? 'تكامل مع بيئة الطاقة والمناطق الحرة' : 'Localized Oman Energy Ecosystem Data'}</h4>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{isArabic ? 'يتم دمج إعفاءات المناطق الحرة واستراتيجيات شراكات قطاع الطاقة الحكومي والخاص مباشرة في تحليلات الجدوى والمقترحات.' : 'Logistical parameters, tax exemptions, and partnerships with local energy companies are naturally injected into your investment proposals.'}</p>
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
