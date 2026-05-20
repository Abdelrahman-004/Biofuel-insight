
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { suggestProject } from './geminiService';
import { SuggestedProject } from './types';

interface OmanFreeZonesProps {
  language?: 'English' | 'Arabic';
}

export const OmanFreeZones: React.FC<OmanFreeZonesProps> = ({ language = 'English' }) => {
  const [localLanguage, setLocalLanguage] = React.useState(language || 'Arabic');

  React.useEffect(() => {
    setLocalLanguage(language || 'Arabic');
  }, [language]);

  const isArabic = localLanguage === 'Arabic';
  const [suggestion, setSuggestion] = React.useState<SuggestedProject | null>(null);
  const [loading, setLoading] = React.useState<string | null>(null);

  const handleSuggest = async (zone: string) => {
    setLoading(zone);
    try {
      const proj = await suggestProject(`${zone} in Oman`, localLanguage);
      setSuggestion(proj);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  const zones = [
    {
      name: isArabic ? 'منطقة صحار الحرة' : 'Sohar Free Zone',
      desc: isArabic ? 'مركز لوجستي عالمي وبوابة صناعية، يتميز بتكامل صناعي ثقيل وصلاحية الوصول للميناء.' : 'A global logistics hub and industrial gateway, uniquely positioned for heavy industrial integration and port access.',
      advantages: isArabic ? ['وصول مباشر لميناء بحري عميق', 'تكامل صناعي ثقيل', 'توافر ثاني أكسيد الكربون الصناعي', 'بنية تحتية عالمية للتصدير'] : ['Direct Deep-Sea Port Access', 'Heavy Industrial Synergies', 'Industrial CO2 Availability', 'Global Export Infrastructure'],
      bestSuited: isArabic ? ['وقود الطحالب الحيوي', 'تحويل النفايات إلى طاقة', 'احتجاز وتخزين الكربون', 'مشاريع الهيدروجين التجريبية'] : ['Algae-based Biofuels', 'Waste-to-Energy', 'Carbon Capture Utilization', 'Hydrogen Pilot Projects'],
      note: isArabic ? 'مثالي للتكامل الصناعي ومشاريع تحول الطاقة البحرية.' : 'Ideal for industrial integration and maritime-based energy transition pilot projects.'
    },
    {
      name: isArabic ? 'الدقم (ميزة)' : 'Duqm (SEZAD)',
      desc: isArabic ? 'واحدة من أكبر المناطق الاقتصادية في العالم، مخصصة كمركز للهيدروجين الأخضر والوقود الاصطناعي في المستقبل.' : 'One of the world’s largest economic zones, specifically designated as a future green hydrogen and synthetic fuel hub.',
      advantages: isArabic ? ['مساحات شاسعة', 'موارد طاقة شمسية ورياح هجينة', 'رصيف سائل بمياه عميقة', 'موقع استراتيجي'] : ['Mega-Scale Land Availability', 'Hybrid Wind & Solar Resources', 'Deep-Water Liquid Jetty', 'Strategic Geo-Location'],
      bestSuited: isArabic ? ['إنتاج الهيدروجين الأخضر', 'تصدير الميثانول الحيوي', 'الوقود الاصطناعي (E-Fuels)', 'مصافي حيوية ضخمة'] : ['Green Hydrogen Production', 'Bio-Methanol Exports', 'Synthetic E-Fuels', 'Mega-Scale Bio-Refineries'],
      note: isArabic ? 'الأفضل للمشاريع المتجددة الضخمة على المدى الطويل.' : 'Best suited for long-term commercial-scale renewable energy and export mega-projects.'
    },
    {
      name: isArabic ? 'منطقة صلالة الحرة' : 'Salalah Free Zone',
      desc: isArabic ? 'موقع استراتيجي على أسرع طرق الشحن في العالم، مع روابط قوية بالمناطق الزراعية.' : 'Strategically located on the world’s fastest shipping routes, with strong connections to agricultural hinterlands.',
      advantages: isArabic ? ['قرب من الملاحة العالمية', 'شبكات نفايات زراعية', 'كفاءة لوجستية عالية', 'بنية تحتية راسخة للميناء'] : ['Proximity to Global Shipping', 'Agricultural Waste Networks', 'High Logistics Efficiency', 'Established Port Infrastructure'],
      bestSuited: isArabic ? ['وقود الديزل الحيوي من زيت الطهي المستعمل', 'غاز حيوي من النفايات العضوية', 'مصانع الاقتصاد الدائري', 'لوجستيات الوقود الحيوي الإقليمية'] : ['Waste Cooking Oil Biodiesel', 'Organic Waste Biogas', 'Circular Economy Plants', 'Regional Biofuel Logistics'],
      note: isArabic ? 'ممتاز لجمع المواد الخام القائمة على النفايات واستراتيجيات التوزيع الإقليمية.' : 'Excellent for waste-based feedstock collection and regional distribution strategies.'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-20"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[var(--card-bg)] shadow-card  rounded-3xl shadow-card border border-[var(--border-glow)] hover:border-#D97706 p-8 transition-all duration-300"
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-3xl font-black text-[#D97706] drop-shadow-md">{isArabic ? 'المقترحات المكانية لإنشاء المشاريع' : 'Oman Free Zones Strategic Intelligence'}</h2>
          <select 
            value={localLanguage}
            onChange={(e) => setLocalLanguage(e.target.value as 'English' | 'Arabic')}
            className="bg-[var(--card-bg)] shadow-card text-sm border border-[var(--border-glow)] rounded-lg px-3 py-1.5 text-[#D97706] outline-none font-bold shadow-sm"
          >
            <option value="Arabic" className="bg-[var(--card-bg)] shadow-card text-[var(--text-primary)]">العربية (Arabic)</option>
            <option value="English" className="bg-[var(--card-bg)] shadow-card text-[var(--text-primary)]">English</option>
          </select>
        </div>
        <p className="text-[var(--text-secondary)] max-w-2xl">{isArabic ? 'تقترح هذه الأداة المشاريع الأمثل بناءً على البنية التحتية والموارد اللوجستية للمناطق الحرة في عمان، وتستعرض أبرز الفاعلين في قطاع الطاقة الحكومي والخاص.' : 'Leverage the unique strengths of Oman’s economic hubs and key energy players to optimize your industrial energy projects for Vision 2040.'}</p>
      </motion.div>

      {/* Companies Section */}
      <div className="mb-12">
        <h3 className="text-2xl font-black text-[var(--text-primary)] mb-6 flex items-center">
          <i className="fas fa-industry text-[var(--accent-emerald)] mx-3"></i>
          {isArabic ? 'أبرز شركات قطاع الطاقة في عُمان' : 'Top Energy Companies in Oman'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              name: isArabic ? 'أوكيو (OQ)' : 'OQ',
              type: isArabic ? 'قطاع حكومي (مجموعة طاقة متكاملة)' : 'Government Sector (Integrated Energy Group)',
              goals: isArabic ? 'التحول نحو الطاقة المتجددة، قيادة مشاريع الهيدروجين الأخضر عبر OQAE (أوكيو للطاقة البديلة)، وتعظيم القيمة المضافة من البتروكيماويات.' : 'Transitioning towards renewable energy, leading green hydrogen projects via OQAE (OQ Alternative Energy), and maximizing petrochemical value.',
              investorBenefit: isArabic ? 'شراكات استراتيجية في مشاريع الهيدروجين وتوفير المواد الأولية البيولوجية وتطوير التقنيات النظيفة.' : 'Strategic partnerships in green hydrogen, bio-feedstock supply, and clean tech co-development.',
              icon: 'fa-leaf'
            },
            {
              name: isArabic ? 'هيدروم (Hydrom)' : 'Hydrom',
              type: isArabic ? 'قطاع حكومي (إدارة الهيدروجين)' : 'Government Sector (Hydrogen Orchestrator)',
              goals: isArabic ? 'تسريع وتطوير منظومة الهيدروجين الأخضر في عُمان، طرح الأراضي الاستراتيجية، وإدارة البنية التحتية المشتركة.' : 'Accelerating green hydrogen ecosystem, auctioning strategic land blocks, and managing shared infrastructure.',
              investorBenefit: isArabic ? 'الحصول على أراضي لمشاريع الهيدروجين/الأمونيا الضخمة والوصول المباشر لشبكات التصدير العالمية.' : 'Acquiring mega-scale land for hydrogen/ammonia plants and accessing unified export networks.',
              icon: 'fa-water'
            },
            {
              name: isArabic ? 'تنمية نفط عُمان (PDO)' : 'Petroleum Development Oman (PDO)',
              type: isArabic ? 'شراكة حكومية/خاصة' : 'Government / Private Joint Venture',
              goals: isArabic ? 'التحول إلى شركة طاقة شاملة، تحقيق الحياد الكربوني بحلول 2050، والريادة في احتجاز وتخزين الكربون (CCUS).' : 'Evolving into a fully-fledged energy company, targeting Net Zero by 2050, and leading CCUS implementation.',
              investorBenefit: isArabic ? 'فرص استثمارية في مشاريع كفاءة الطاقة، والنفايات العضوية، وتقنيات تخزين الكربون واستخلاص النفط المعزز.' : 'Investment ops in energy efficiency, organic waste upcycling, and carbon capture / EOR tech.',
              icon: 'fa-oil-well'
            },
            {
              name: isArabic ? 'الشركة العمانية للغاز الطبيعي المسال (Oman LNG)' : 'Oman LNG',
              type: isArabic ? 'شراكة حكومية/خاصة' : 'Government / Private Joint Venture',
              goals: isArabic ? 'تصنيع وتصدير الغاز الطبيعي المسال بكفاءة بيئية عالية، وخفض الانبعاثات والتحول التدريجي للطاقة النظيفة.' : 'Processing and exporting LNG with high environmental efficiency, reducing emissions, and steady transition to clean energy.',
              investorBenefit: isArabic ? 'التعاون في سلاسل التوريد المستدامة ومشاريع إزالة الكربون الصناعي وإنتاج الميثان الصناعي.' : 'Collabs in sustainable supply chains, industrial decarbonization, and synthetic methane pilot projects.',
              icon: 'fa-fire-flame-simple'
            },
            {
              name: isArabic ? 'مجموعة نماء (Nama Group)' : 'Nama Group',
              type: isArabic ? 'قطاع حكومي' : 'Government Sector',
              goals: isArabic ? 'إدارة وتطوير شبكات الكهرباء والمياه، وزيادة مساهمة الطاقة المتجددة في الشبكة الوطنية لتصل إلى 30% بحلول 2030.' : 'Managing water & electricity grids, aiming for 30% renewable energy capacity in the national grid by 2030.',
              investorBenefit: isArabic ? 'توقيع اتفاقيات شراء الطاقة (PPAs) لمشاريع الطاقة الشمسية وطاقة الرياح، وربط المشاريع الصناعية بالشبكة.' : 'Signing PPAs for utility-scale solar/wind projects and grid-connecting industrial sites.',
              icon: 'fa-bolt'
            }
          ].map((company, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[var(--card-bg)] shadow-card p-6 rounded-2xl border border-[var(--border-glow)] hover:border-[var(--accent-emerald)] transition-all"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-emerald)]/10 flex items-center justify-center text-[var(--accent-emerald)] border border-[var(--accent-emerald)]/20 shrink-0 mx-3 rtl:mr-0 rtl:ml-3">
                  <i className={`fas ${company.icon}`}></i>
                </div>
                <div>
                  <h4 className="text-lg font-black text-[var(--text-primary)]">{company.name}</h4>
                  <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">{company.type}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-[var(--text-primary)] mb-1">{isArabic ? 'الأهداف الاستراتيجية:' : 'Strategic Goals:'}</p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{company.goals}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#D97706] mb-1">{isArabic ? 'فرص المستثمر:' : 'Investor Benefit:'}</p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{company.investorBenefit}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {suggestion && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[var(--card-bg)] shadow-card  text-[var(--text-primary)] rounded-3xl shadow-card border border-#D97706 p-8 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold flex items-center text-[var(--text-primary)]">
                <i className="fas fa-location-arrow text-[#D97706] mx-3 drop-shadow-md"></i> {isArabic ? 'تصور المشروع في المنطقة' : 'Zone-Specific Concept'}
              </h3>
              <button onClick={() => setSuggestion(null)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[var(--text-primary)]">
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-[var(--accent-emerald)] dark:text-emerald-400 uppercase tracking-widest">{isArabic ? 'هوية المشروع' : 'Project Identity'}</p>
                  <p className="text-lg font-bold">{suggestion.ProjectName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[var(--accent-emerald)] dark:text-emerald-400 uppercase tracking-widest">{isArabic ? 'المبرر الاستراتيجي' : 'Strategic Justification'}</p>
                  <p className="text-sm text-[var(--text-secondary)] italic leading-relaxed">{suggestion.StrategicJustification}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-[var(--border-glow)]">
                  <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{isArabic ? 'المادة الخام' : 'Feedstock'}</p>
                  <p className="text-xs">{suggestion.Feedstock}</p>
                </div>
                <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-[var(--border-glow)]">
                  <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{isArabic ? 'التقنية' : 'Technology'}</p>
                  <p className="text-xs">{suggestion.Technology}</p>
                </div>
                <div className="col-span-2 bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-[var(--border-glow)]">
                  <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{isArabic ? 'تقدير الحجم' : 'Scale Estimate'}</p>
                  <p className="text-xs">{suggestion.EstimatedScale}</p>
                </div>
              </div>
            </div>

            {/* Incentive Matcher Section */}
            <div className="mt-8 pt-8 border-t border-[var(--border-glow)]">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-black text-[var(--accent-emerald)] dark:text-emerald-400 flex items-center uppercase tracking-widest">
                  <i className="fas fa-gift mx-3"></i> {isArabic ? 'محفزات رؤية عمان 2040' : 'Oman Vision 2040 Incentive Matcher'}
                </h4>
                <span className="text-[10px] font-bold text-[var(--text-secondary)] italic">{isArabic ? 'مطابقة ذكية مبنية على ملف المشروع' : 'Smart matching based on project profile'}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(suggestion.Incentives || []).map((inc, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * idx }}
                    className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-var(--accent-emerald) hover:border-var(--accent-emerald) transition group"
                  >
                    <div className="flex items-start justify-between mb-2">
                       <h5 className="text-xs font-black text-[var(--text-primary)] group-hover:text-[var(--accent-emerald)] dark:text-emerald-400 transition">{inc.title}</h5>
                      <i className="fas fa-award text-[var(--accent-emerald)] dark:text-emerald-400 text-[10px]"></i>
                    </div>
                    <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed mb-3">{inc.description}</p>
                    <div className="flex items-center text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-tighter">
                      <i className="fas fa-building-columns mx-1.5"></i>
                      {inc.authority}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-[var(--accent-emerald)]/10 rounded-xl border border-var(--accent-emerald) flex items-center">
                <i className="fas fa-info-circle text-[var(--accent-emerald)] dark:text-emerald-400 mx-3"></i>
                <p className="text-[10px] text-emerald-800 dark:text-emerald-100 font-medium">
                  {isArabic ? 'تعتبر هذه الحوافز تقديرية وتستند إلى القوانين الحالية للمناطق الحرة، يجب التقدم رسمياً للحصول عليها.' : 'These incentives are estimated based on current Omani Free Zone regulations. Final eligibility requires formal application to the respective authorities.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {zones.map((z, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[var(--card-bg)] shadow-card  rounded-3xl border border-[var(--border-glow)] overflow-hidden shadow-card hover:border-#D97706 transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row text-[var(--text-primary)]">
              <div className="p-8 md:w-2/3">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-black text-[var(--text-primary)]">{z.name}</h3>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSuggest(z.name)}
                    disabled={!!loading}
                    className="px-4 py-2 bg-gradient-to-r from-[#059669] to-[#10B981] hover:shadow-md text-[var(--card-bg)] text-[10px] font-black uppercase rounded-lg transition disabled:opacity-50"
                  >
                    {loading === z.name ? <i className="fas fa-spinner fa-spin mx-2"></i> : <i className="fas fa-bolt mx-2 text-[var(--card-bg)]"></i>}
                    {isArabic ? `اقتراح مشروع لـ ${z.name.split(' ')[isArabic ? 1 : 0] || z.name}` : `Suggest Project for ${z.name.split(' ')[0]}`}
                  </motion.button>
                </div>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">{z.desc}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3">{isArabic ? 'مزايا المنطقة' : 'Zone Advantages'}</h4>
                    <ul className="space-y-2">
                      {z.advantages.map((adv, idx) => (
                        <li key={idx} className="text-xs text-[var(--text-secondary)] flex items-center">
                          <i className="fas fa-check text-[#D97706] mx-2 text-[10px]"></i> {adv}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3">{isArabic ? 'المشاريع الأنسب' : 'Best-Suited Projects'}</h4>
                    <ul className="space-y-2">
                      {z.bestSuited.map((proj, idx) => (
                        <li key={idx} className="text-xs text-[var(--text-secondary)] flex items-center">
                          <i className="fas fa-star text-[#D97706] mx-2 text-[10px]"></i> {proj}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="bg-[var(--bg-main)] p-8 md:w-1/3 flex flex-col justify-center border-t md:border-t-0 md:border-l border-[var(--border-glow)] rtl:border-l-0 rtl:border-r">
                <h4 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2">{isArabic ? 'رؤية استراتيجية' : 'Strategic Insight'}</h4>
                <p className="text-sm text-[var(--text-secondary)] italic font-medium">"{z.note}"</p>
                <div className="mt-6 flex items-center space-x-2 rtl:space-x-reverse text-[#D97706] font-bold text-xs drop-shadow-md">
                  <i className={`fas fa-arrow-${isArabic ? 'left' : 'right'}-long`}></i>
                  <span>{isArabic ? 'متوافق مع رؤية عمان 2040' : 'Align with Vision 2040'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
