import { Logo } from "./Logo";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Cpu,
  BarChart4,
  Handshake,
  CheckCircle2,
} from "lucide-react";

interface HomeProps {
  onStart: (
    tool:
      | "MARKETPLACE"
      | "INVESTOR_FEASIBILITY"
      | "RESEARCH"
      | "SOLVER"
      | "OPTIMIZER"
      | "STANDARDS"
      | "PROPOSAL"
      | "ZONES",
  ) => void;
  language?: "English" | "Arabic";
}

export const Home: React.FC<HomeProps> = ({
  onStart,
  language = "English",
}) => {
  const isArabic = language === "Arabic";

  return (
    <div className="min-h-screen relative" dir={isArabic ? "rtl" : "ltr"}>
      {/* Background Gradient overlay just for extra polish, main orbs are in body CSS */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-transparent via-[var(--bg-main)]/50 to-[var(--bg-main)]"></div>

      {/* Hero Section - Extremely premium, minimalist 2026 SaaS style */}
      <section className="relative pt-32 pb-24 px-6 md:px-12 overflow-hidden z-10 flex flex-col items-center justify-center min-h-[90vh]">
        <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center space-x-3 bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-6 py-2.5 rounded-full mb-10 shadow-sm backdrop-blur-xl group cursor-default rtl:space-x-reverse"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] md:text-sm font-semibold tracking-widest text-slate-800 dark:text-slate-200 font-sans uppercase">
              {isArabic
                ? "رؤية عُمان 2040 الذكية"
                : "Oman Vision 2040 Intelligence"}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 w-full flex justify-center"
          >
            <Logo
              className="h-28 md:h-40 object-contain w-auto max-w-[90vw]"
              isArabic={isArabic}
              textClassName="text-4xl md:text-6xl lg:text-7xl"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-16 font-medium leading-relaxed"
          >
            {isArabic
              ? "نمذجة استثمارية ومالية متقدمة لمشاريع الطاقة الشمسية، الهيدروجين الأخضر، والوقود الحيوي في عُمان. صُنع للمستثمرين والباحثين لبناء اقتصاد بديل."
              : "Advanced financial and technical modeling for Solar, Green Hydrogen, and Biofuel projects in Oman. Built for absolute precision."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row justify-center items-center gap-5 w-full sm:w-auto"
          >
            <button
              onClick={() => onStart("INVESTOR_FEASIBILITY")}
              className="w-full sm:w-auto bg-emerald-600 dark:bg-emerald-400 text-white dark:text-slate-900 px-10 py-4 rounded-2xl font-bold text-base transition-all shadow-[0_8px_30px_rgba(16,185,129,0.3)] dark:shadow-[0_8px_30px_rgba(52,211,153,0.2)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.4)] hover:-translate-y-1"
            >
              {isArabic ? "بدء التحليل" : "Launch Analysis"}
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="w-full sm:w-auto bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 px-10 py-4 rounded-2xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-3 hover:-translate-y-1 hover:bg-white/60 dark:hover:bg-white/10 backdrop-blur-md"
            >
              <Cpu
                size={18}
                className="text-emerald-600 dark:text-emerald-400"
              />
              {isArabic ? "اكتشف التقنية" : "Explore Platform"}
            </button>
          </motion.div>
        </div>

        {/* Connected Grid / Floating Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="mt-24 pt-12 max-w-5xl mx-auto flex flex-col items-center w-full border-t border-slate-200 dark:border-slate-800/50"
        >
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-500 mb-8">
            {isArabic
              ? "تمكين النظام البيئي للطاقة المتجددة"
              : "Empowering the Clean Energy Ecosystem"}
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-50 dark:opacity-40 grayscale hover:grayscale-0 transition-all duration-500 dark:hover:opacity-100">
            <span className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
              OQAE
            </span>
            <span className="font-sans text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
              HYDROM
            </span>
            <span className="font-serif text-2xl italic text-slate-900 dark:text-white">
              PDO
            </span>
            <span className="font-mono text-2xl font-bold text-slate-900 dark:text-white">
              SOHAR PORT
            </span>
            <span className="font-sans text-3xl font-black text-slate-900 dark:text-white">
              NAMA
            </span>
          </div>
        </motion.div>
      </section>

      {/* Quote Section - Oman Vision 2040 */}
      <section className="w-full max-w-6xl mx-auto px-6 mt-16 mb-40 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative py-20 px-10 md:px-24 rounded-[3rem] bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 backdrop-blur-2xl shadow-xl dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Decorative background elements within the card */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent z-0"></div>

          <span
            className={`text-[120px] font-serif text-emerald-500/10 dark:text-emerald-500/20 absolute -top-4 ${isArabic ? "right-8" : "left-8"} leading-none select-none z-0`}
          >
            “
          </span>

          <blockquote className="relative z-10 text-center">
            <p className="text-2xl md:text-4xl font-medium italic text-slate-800 dark:text-slate-200 leading-relaxed md:leading-loose mb-14 font-serif">
              {isArabic
                ? "رؤية عُمان 2040 هي بوابة عبور التحديات، ومواكبة المتغيرات، واستثمار المتاح من الفرص، من أجل بناء دولة حديثة قادرة على الانتقال للمستقبل بثقة."
                : "Oman Vision 2040 is the gateway to overcoming challenges, keeping pace with changes, and generating opportunities for the upcoming stage of Oman's development."}
            </p>
            <footer className="flex flex-col items-center">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-slate-400 dark:to-slate-600"></div>
                <div className="w-2 h-2 rotate-45 bg-emerald-500"></div>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-slate-400 dark:to-slate-600"></div>
              </div>
              <cite className="not-italic">
                <span className="block text-slate-900 dark:text-white font-black uppercase tracking-[0.3em] text-sm md:text-base mb-2">
                  {isArabic
                    ? "صاحب الجلالة السلطان هيثم بن طارق"
                    : "His Majesty Sultan Haitham bin Tariq"}
                </span>
                <span className="block text-emerald-600 dark:text-emerald-400 text-xs md:text-xs uppercase font-bold tracking-[0.2em]">
                  {isArabic ? "سلطان عُمان" : "Sultan of Oman"}
                </span>
              </cite>
            </footer>
          </blockquote>

          <span
            className={`text-[120px] font-serif text-teal-500/10 dark:text-teal-500/20 absolute -bottom-16 ${isArabic ? "left-8" : "right-8"} leading-none select-none z-0`}
          >
            ”
          </span>
        </motion.div>
      </section>

      {/* Features Grid - Modern Bento Design */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight"
            >
              {isArabic ? (
                <>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    مميزات
                  </span>{" "}
                  المنصة
                </>
              ) : (
                <>
                  PLATFORM{" "}
                  <span className="text-emerald-600 dark:text-emerald-400">
                    FEATURES
                  </span>
                </>
              )}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] text-sm font-bold max-w-2xl mx-auto"
            >
              {isArabic
                ? "كيف تحل المنصة عقبات تمويل المشاريع البحثية ونقلها للسوق"
                : "How the platform solves research commercialization and due diligence"}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                id: "commercialization",
                title: isArabic
                  ? "تسويق الابتكار"
                  : "Commercializing Innovation",
                description: isArabic
                  ? "ربط مباشر للباحثين مع المستثمرين الصناعيين لردم الفجوة بين البحث المخبري والتطبيق التجاري."
                  : "Directly connecting researchers to industrial investors, bridging the gap between lab research and marketization.",
                number: isArabic ? "+50 شريك استراتيجي" : "50+ Partners",
                icon: Handshake,
                size: "large",
                accentLight: "text-blue-600 bg-blue-50",
                accentDark: "dark:text-blue-400 dark:bg-blue-500/10",
                glow: "shadow-[0_10px_40px_-10px_rgba(59,130,246,0.15)] dark:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]",
              },
              {
                id: "due_diligence",
                title: isArabic
                  ? "تسريع العناية الواجبة"
                  : "Accelerating Due Diligence",
                description: isArabic
                  ? "أتمتة عمليات التدقيق الفني والمالي للمستثمر باستخدام نماذج الذكاء الاصطناعي المتطورة."
                  : "Automating technical and financial validation for investors using leading AI models.",
                number: isArabic ? "-75% وقت التقييم" : "75% Time Saved",
                icon: Zap,
                size: "small",
                accentLight: "text-emerald-600 bg-emerald-50",
                accentDark: "dark:text-emerald-400 dark:bg-emerald-500/10",
                glow: "shadow-[0_10px_40px_-10px_rgba(16,185,129,0.15)] dark:shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]",
              },
              {
                id: "financial",
                title: isArabic
                  ? "النمذجة المالية الاستثمارية"
                  : "Financial Modeling",
                description: isArabic
                  ? "نماذج استثمار عالية الدقة (CAPEX/OPEX) مبنية على بيانات الأسواق العُمانية الحية وتسعيرات الخدمات."
                  : "High-precision CAPEX/OPEX predictive models based on live Omani market data and utility pricing.",
                number: isArabic ? "+99% دقة استثمارية" : "99%+ Accuracy",
                icon: BarChart4,
                size: "small",
                accentLight: "text-violet-600 bg-violet-50",
                accentDark: "dark:text-violet-400 dark:bg-violet-500/10",
                glow: "shadow-[0_10px_40px_-10px_rgba(139,92,246,0.15)] dark:shadow-[0_0_40px_-10px_rgba(139,92,246,0.3)]",
              },
              {
                id: "zones",
                title: isArabic
                  ? "تكامل المناطق الاستراتيجية"
                  : "Strategic Zones Mapping",
                description: isArabic
                  ? "تحليل المواقع واختيار الأمثل عبر المناطق الحرة (الدقم، صحار، صلالة) للاستفادة من الإعفاءات اللوجستية."
                  : "Site analysis and optimal selection across free zones (Duqm, Sohar, Salalah) maximizing tax benefits.",
                number: isArabic ? "3 مناطق استراتيجية" : "3 Strategic Zones",
                icon: MapPin,
                size: "large",
                accentLight: "text-amber-600 bg-amber-50",
                accentDark: "dark:text-amber-400 dark:bg-amber-500/10",
                glow: "shadow-[0_10px_40px_-10px_rgba(245,158,11,0.15)] dark:shadow-[0_0_40px_-10px_rgba(245,158,11,0.3)]",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`
                  relative group overflow-hidden rounded-[2.5rem] 
                  bg-white dark:bg-white/5 
                  border border-slate-100 dark:border-white/10
                  shadow-sm hover:shadow-xl dark:shadow-none
                  transition-all duration-500 hover:-translate-y-2 hover:${feature.glow}
                  ${feature.size === "large" ? "md:col-span-2" : "md:col-span-1"}
                `}
                >
                  <div className="relative h-full p-8 md:p-10 min-h-[300px] flex flex-col justify-between z-10">
                    <div>
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-colors ${feature.accentLight} ${feature.accentDark}`}
                      >
                        <Icon size={28} strokeWidth={2} />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
                        {feature.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                      <div
                        className={`font-sans text-sm md:text-base font-bold tracking-wide ${feature.accentLight.split(" ")[0]} ${feature.accentDark.split(" ")[0]}`}
                      >
                        {feature.number}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works & Benefits - Modern Split */}
      <section
        id="how-it-works"
        className="max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-24 items-center"
      >
        <div className="relative">
          <div
            className={`absolute ${isArabic ? "-right-8" : "-left-8"} top-2 w-1.5 h-16 bg-emerald-500 rounded-full`}
          ></div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">
            {isArabic ? (
              <>
                الميزة <br />
                <span className="text-emerald-600 dark:text-emerald-400">
                  التنافسية
                </span>
              </>
            ) : (
              <>
                OUR UNIQUE <br />
                <span className="text-emerald-600 dark:text-emerald-400">
                  ADVANTAGE
                </span>
              </>
            )}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-10 text-lg font-medium">
            {isArabic
              ? "الأداة ليست مجرد محادثة عامة (Chat). نحن نقدم منصة عمليات متخصصة (Vertical AI) لنمذجة المشاريع الخضراء والطاقة."
              : "We are not a general-purpose chatbot. Insight AI is a Vertical AI platform running structured, multi-agent workflows specifically designed for clean energy modeling."}
          </p>
          <div className="space-y-8">
            <div className="flex items-start space-x-6 rtl:space-x-reverse group">
              <div className="bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-2xl text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2">
                  {isArabic
                    ? "هندسة مالية محددة وليس نصوص عامة"
                    : "Deterministic Financial Modeling"}
                </h4>
                <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isArabic
                    ? "بعكس LLMs العامة، المنصة تفرض قوالب حسابية للمصروفات (CAPEX/OPEX) وتخرج أرقاماً متسقة للإيرادات بناءً على المعايير العالمية."
                    : "Unlike generic LLMs, our platform enforces structured mathematical templates for CAPEX/OPEX calculations, producing consistent, enterprise-grade numbers."}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-6 rtl:space-x-reverse group">
              <div className="bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-2xl text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2">
                  {isArabic
                    ? "تكامل مع بيئة الطاقة والمناطق الحرة"
                    : "Localized Oman Energy Ecosystem Data"}
                </h4>
                <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isArabic
                    ? "يتم دمج إعفاءات المناطق الحرة واستراتيجيات شراكات قطاع الطاقة الحكومي والخاص مباشرة في تحليلات الجدوى والمقترحات."
                    : "Logistical parameters, tax exemptions, and partnerships with local energy companies are naturally injected into your investment proposals."}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-6 rtl:space-x-reverse group">
              <div className="bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-2xl text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <Globe size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2">
                  {isArabic
                    ? "دعم المعايير الصناعية (ASTM/EN)"
                    : "Industrial Standards Compliance"}
                </h4>
                <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isArabic
                    ? "يتم مطابقة نتائج الأبحاث والمشاريع آلياً مع المواصفات العالمية قبل تقديمها للمستثمرين."
                    : "Research and facility outputs are programmatically validated against ASTM and EN standard rulesets before finalizing the pitch to investors."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/40 shadow-xl dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl rounded-[3rem] p-12 border border-slate-100 dark:border-white/10 relative overflow-hidden">
          <div
            className={`absolute top-0 ${isArabic ? "left-0" : "right-0"} w-48 h-48 bg-emerald-500/10 blur-[60px] rounded-full`}
          ></div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
            {isArabic ? "دعم كافة قطاعات الطاقة" : "All Clean Energy Sectors"}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-12">
            {isArabic
              ? "صممت المنصة للتوسع وخدمة شريحة المستثمرين، سواء كنت تحسب العائد لمشروع طاقة شمسية واسع النطاق، أو منشأة هيدروجين أخضر، أو إعادة تدوير النفايات."
              : "Built to adapt to any sustainable transition fund. Whether calculating the operational return of a massive Solar farm, evaluating Green Hydrogen electrolysis scaling, or researching e-fuels, Insight AI provides the localized precision needed for success."}
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-3xl border border-slate-100 dark:border-white/5 transition-transform hover:-translate-y-1">
              <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400 mb-3">
                AI
              </div>
              <div className="text-sm font-bold text-slate-500 dark:text-slate-400">
                {isArabic ? "وكلاء متخصصين" : "Specialized Agents"}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-3xl border border-slate-100 dark:border-white/5 transition-transform hover:-translate-y-1">
              <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400 mb-3">
                API
              </div>
              <div className="text-sm font-bold text-slate-500 dark:text-slate-400">
                {isArabic ? "تقارير مهيكلة" : "Structured Data"}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
