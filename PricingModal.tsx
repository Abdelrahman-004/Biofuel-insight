import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createStripeCheckout, PlanType } from './usageService';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  uid: string;
  language: 'English' | 'Arabic';
}

type BillingCycle = '1' | '6' | '12';

const BASE_PRICES = {
  researcher: 9,
  investor: 29,
  enterprise: 99
};

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, uid, language }) => {
  const isArabic = language === 'Arabic';
  const t = (en: string, ar: string) => isArabic ? ar : en;

  const [billingCycle, setBillingCycle] = useState<BillingCycle>('1');
  const [step, setStep] = useState<'pricing' | 'checkout' | 'success'>('pricing');
  const [selectedPlanType, setSelectedPlanType] = useState<PlanType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check URL params for success return
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('status') === 'success') {
        setStep('success');
      }
    }
  }, []);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setErrorMessage(null);
      setIsProcessing(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const getMonthlyEquivalent = (base: number) => {
    if (billingCycle === '1') return base;
    if (billingCycle === '6') return (base * 0.9).toFixed(1);
    if (billingCycle === '12') return (base * 0.8).toFixed(1);
  };

  const getTotalAmount = (base: number) => {
    if (billingCycle === '1') return base;
    if (billingCycle === '6') return Math.round(base * 6 * 0.9);
    if (billingCycle === '12') return Math.round(base * 12 * 0.8);
  };

  const handleSelectPlan = (plan: PlanType) => {
    setSelectedPlanType(plan);
    setStep('checkout');
    setErrorMessage(null);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanType || selectedPlanType === 'free') return;
    setIsProcessing(true);
    setErrorMessage(null);
    
    try {
      // Initiate verified Stripe-hosted Checkout session
      const { url } = await createStripeCheckout(uid, selectedPlanType, parseInt(billingCycle, 10));
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned from payment server.');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || t("Payment service initialization failed. Please verify Stripe configuration.", "فشلت تهيئة خدمة الدفع. يرجى التحقق من إعدادات Stripe."));
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 ${isArabic ? 'rtl' : 'ltr'}`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !isProcessing && onClose()}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`relative w-full max-h-[90vh] overflow-y-auto bg-[var(--bg-main)] border border-[var(--border-glow)] rounded-3xl shadow-2xl p-6 sm:p-10 ${step === 'pricing' ? 'max-w-6xl' : 'max-w-2xl'}`}
        >
          {!isProcessing && step !== 'success' && (
            <button
              onClick={onClose}
              className={`absolute top-6 ${isArabic ? 'left-6' : 'right-6'} w-10 h-10 rounded-full flex items-center justify-center bg-[var(--card-bg)] border border-[var(--border-glow)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-red-500 transition-colors z-10`}
            >
              <i className="fas fa-times"></i>
            </button>
          )}

          {step === 'pricing' && (
            <>
              <div className="text-center max-w-3xl mx-auto mb-8">
                <span className="inline-block py-1 px-3 rounded-full bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)] text-sm font-semibold mb-3 border border-[var(--accent-emerald)]/20">
                  {t("Upgrade Your Research & Investment Capacity", "قم بترقية قدراتك البحثية والاستثمارية")}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-4">
                  {t("Transparent Plans for Oman's Green Future", "خطط شفافة لمستقبل عمان الأخضر")}
                </h2>
                <p className="text-[var(--text-secondary)] text-base sm:text-lg">
                  {t("Choose the plan that fits your scale. Gain access to advanced multi-agent simulations, financial stress testing, and instant export tools.", "اختر الخطة المناسبة لحجم أعمالك. احصل على تحليلات متعددة الوكلاء واختبارات الضغط المالي.")}
                </p>

                {/* Billing Toggle */}
                <div className="mt-8 inline-flex items-center bg-[var(--card-bg)] border border-[var(--border-glow)] p-1.5 rounded-2xl shadow-inner">
                  <button
                    onClick={() => setBillingCycle('1')}
                    className={`py-2 px-5 rounded-xl font-medium text-sm transition-all ${billingCycle === '1' ? 'bg-[var(--accent-emerald)] text-black font-bold shadow-md' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                  >
                    {t("Monthly", "شهرياً")}
                  </button>
                  <button
                    onClick={() => setBillingCycle('6')}
                    className={`py-2 px-5 rounded-xl font-medium text-sm transition-all flex items-center gap-1.5 ${billingCycle === '6' ? 'bg-[var(--accent-emerald)] text-black font-bold shadow-md' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                  >
                    <span>{t("6 Months", "6 أشهر")}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/30">10% OFF</span>
                  </button>
                  <button
                    onClick={() => setBillingCycle('12')}
                    className={`py-2 px-5 rounded-xl font-medium text-sm transition-all flex items-center gap-1.5 ${billingCycle === '12' ? 'bg-[var(--accent-emerald)] text-black font-bold shadow-md' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                  >
                    <span>{t("Annual", "سنوياً")}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/30">20% OFF</span>
                  </button>
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Researcher Plan */}
                <div className="bg-[var(--card-bg)] border border-[var(--border-glow)] hover:border-[var(--accent-emerald)]/50 transition-all rounded-3xl p-6 sm:p-8 flex flex-col relative overflow-hidden group">
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{t("Researcher", "باحث")}</h3>
                  <p className="text-xs text-[var(--text-secondary)] mb-6">{t("Ideal for academic scholars, students, and lab analysts.", "مثالي للأكاديميين والطلاب والباحثين.")}</p>
                  
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-black text-[var(--text-primary)]">${getMonthlyEquivalent(BASE_PRICES.researcher)}</span>
                    <span className="text-xs text-[var(--text-secondary)] ml-2 rtl:mr-2">/ {t("month", "شهر")}</span>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1 text-sm text-[var(--text-secondary)]">
                    <li className="flex items-center gap-2"><i className="fas fa-check text-[var(--accent-emerald)]"></i> <strong>30</strong> {t("Analyses / month", "تحليل / شهر")}</li>
                    <li className="flex items-center gap-2"><i className="fas fa-check text-[var(--accent-emerald)]"></i> <strong>{t("Unlimited", "غير محدود")}</strong> {t("Research Conversion Engine", "أداة تحويل الأبحاث")}</li>
                    <li className="flex items-center gap-2"><i className="fas fa-check text-[var(--accent-emerald)]"></i> {t("Standard PDF & Word Exports", "تصدير بصيغة PDF و Word")}</li>
                    <li className="flex items-center gap-2"><i className="fas fa-check text-[var(--accent-emerald)]"></i> {t("Standard Email Support", "دعم فني عبر البريد")}</li>
                  </ul>

                  <button
                    onClick={() => handleSelectPlan('researcher')}
                    className="w-full py-3.5 px-4 rounded-xl font-bold border border-[var(--border-glow)] text-[var(--text-primary)] hover:bg-[var(--accent-emerald)] hover:text-black hover:border-transparent transition-all"
                  >
                    {t("Select Researcher Plan", "اختر خطة الباحث")}
                  </button>
                </div>

                {/* Investor Pro Plan */}
                <div className="bg-[var(--card-bg)] border-2 border-[var(--accent-emerald)] shadow-[0_0_30px_rgba(16,185,129,0.15)] rounded-3xl p-6 sm:p-8 flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 left-0 bg-[var(--accent-emerald)] text-black text-[11px] font-black uppercase tracking-wider text-center py-1">
                    {t("Most Popular", "الأكثر شعبية")}
                  </div>

                  <h3 className="text-xl font-bold text-[var(--text-primary)] mt-2 mb-2">{t("Investor Pro", "مستثمر محترف")}</h3>
                  <p className="text-xs text-[var(--text-secondary)] mb-6">{t("For VC funds, banks, angel syndicates, and project developers.", "للصناديق الاستثمارية والمطورين والمستثمرين.")}</p>
                  
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-black text-[var(--text-primary)]">${getMonthlyEquivalent(BASE_PRICES.investor)}</span>
                    <span className="text-xs text-[var(--text-secondary)] ml-2 rtl:mr-2">/ {t("month", "شهر")}</span>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1 text-sm text-[var(--text-secondary)]">
                    <li className="flex items-center gap-2"><i className="fas fa-check text-[var(--accent-emerald)]"></i> <strong>100</strong> {t("Analyses / month", "تحليل / شهر")}</li>
                    <li className="flex items-center gap-2"><i className="fas fa-check text-[var(--accent-emerald)]"></i> {t("All Multi-Agent Simulations", "جميع عمليات المحاكاة متعددة الوكلاء")}</li>
                    <li className="flex items-center gap-2"><i className="fas fa-check text-[var(--accent-emerald)]"></i> {t("Financial Sensitivity & Stress Testing", "اختبارات الحساسية والضغط المالي")}</li>
                    <li className="flex items-center gap-2"><i className="fas fa-check text-[var(--accent-emerald)]"></i> {t("Official Oman Vision 2040 Scoring", "تقييم التوافق مع رؤية عمان 2040")}</li>
                    <li className="flex items-center gap-2"><i className="fas fa-check text-[var(--accent-emerald)]"></i> {t("Priority Support & Formats", "دعم ذو أولوية وتنسيقات متقدمة")}</li>
                  </ul>

                  <button
                    onClick={() => handleSelectPlan('investor')}
                    className="w-full py-3.5 px-4 rounded-xl font-bold bg-[var(--accent-emerald)] text-black hover:bg-emerald-400 shadow-lg shadow-emerald-900/40 transition-all"
                  >
                    {t("Upgrade to Investor Pro", "الترقية إلى مستثمر محترف")}
                  </button>
                </div>

                {/* Enterprise Plan */}
                <div className="bg-[var(--card-bg)] border border-[var(--border-glow)] hover:border-[var(--accent-emerald)]/50 transition-all rounded-3xl p-6 sm:p-8 flex flex-col relative overflow-hidden group">
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{t("Enterprise", "مؤسسة")}</h3>
                  <p className="text-xs text-[var(--text-secondary)] mb-6">{t("For government ministries, large utilities, and refineries.", "للوزارات والمؤسسات الحكومية والشركات الكبرى.")}</p>
                  
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-black text-[var(--text-primary)]">${getMonthlyEquivalent(BASE_PRICES.enterprise)}</span>
                    <span className="text-xs text-[var(--text-secondary)] ml-2 rtl:mr-2">/ {t("month", "شهر")}</span>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1 text-sm text-[var(--text-secondary)]">
                    <li className="flex items-center gap-2"><i className="fas fa-check text-[var(--accent-emerald)]"></i> <strong>{t("Unlimited", "غير محدود")}</strong> {t("Analyses & Simulations", "تحليلات وعمليات محاكاة")}</li>
                    <li className="flex items-center gap-2"><i className="fas fa-check text-[var(--accent-emerald)]"></i> {t("Custom Oman Free Zone Feedstock APIs", "تكاملات مخصصة لبيانات المناطق الحرة")}</li>
                    <li className="flex items-center gap-2"><i className="fas fa-check text-[var(--accent-emerald)]"></i> {t("Dedicated Account Manager & SLA", "مدير حساب مخصص واتفاقية مستوى خدمة")}</li>
                    <li className="flex items-center gap-2"><i className="fas fa-check text-[var(--accent-emerald)]"></i> {t("Customized Regulatory Compliance Engine", "محرك الامتثال التنظيمي المخصص")}</li>
                  </ul>

                  <button
                    onClick={() => handleSelectPlan('enterprise')}
                    className="w-full py-3.5 px-4 rounded-xl font-bold border border-[var(--border-glow)] text-[var(--text-primary)] hover:bg-[var(--accent-emerald)] hover:text-black hover:border-transparent transition-all"
                  >
                    {t("Select Enterprise Plan", "اختر خطة المؤسسة")}
                  </button>
                </div>
              </div>
            </>
          )}

          {step === 'checkout' && selectedPlanType && (
            <div>
              <button 
                onClick={() => setStep('pricing')}
                className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6 transition-colors"
              >
                <i className={`fas fa-arrow-${isArabic ? 'right' : 'left'}`}></i> {t("Back to Plans", "العودة للخطط")}
              </button>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] mb-6">
                {t("Secure Stripe Checkout", "الدفع الآمن عبر Stripe")}
              </h2>

              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-3">
                  <i className="fas fa-exclamation-triangle mt-0.5"></i>
                  <div className="flex-1">{errorMessage}</div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-8">
                {/* Order Summary */}
                <div className="bg-[var(--card-bg)] border border-[var(--border-glow)] rounded-2xl p-6 h-fit order-2 md:order-1">
                  <h3 className="font-bold text-[var(--text-primary)] mb-4">{t("Order Summary", "ملخص الطلب")}</h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[var(--text-secondary)] capitalize">{t(selectedPlanType, selectedPlanType === 'researcher' ? "باحث" : selectedPlanType === 'investor' ? "مستثمر محترف" : "مؤسسة")} Plan</span>
                    <span className="text-[var(--text-primary)] font-medium">${BASE_PRICES[selectedPlanType]} / {t("mo", "شهر")}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-[var(--border-glow)]">
                    <span className="text-[var(--text-secondary)]">{t("Billing Cycle", "دورة الفوترة")}</span>
                    <span className="text-[var(--text-primary)] font-medium">
                      {billingCycle === '1' ? t("Monthly", "شهرياً") : billingCycle === '6' ? t("6 Months", "6 أشهر") : t("1 Year", "سنة واحدة")}
                    </span>
                  </div>
                  
                  {billingCycle !== '1' && (
                    <div className="flex justify-between items-center mb-2 text-[var(--accent-emerald)]">
                      <span>{t("Discount", "الخصم")} ({billingCycle === '6' ? '10%' : '20%'})</span>
                      <span>-${(BASE_PRICES[selectedPlanType] * parseInt(billingCycle, 10)) - (getTotalAmount(BASE_PRICES[selectedPlanType]) || 0)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-[var(--border-glow)]">
                    <span className="text-lg font-bold text-[var(--text-primary)]">{t("Total Due Today", "الإجمالي المستحق اليوم")}</span>
                    <span className="text-2xl font-black text-[var(--text-primary)]">${getTotalAmount(BASE_PRICES[selectedPlanType])}</span>
                  </div>
                </div>

                {/* Stripe Checkout Action */}
                <div className="order-1 md:order-2">
                  <div className="bg-[var(--card-bg)] border border-[var(--border-glow)] rounded-2xl p-6 text-center space-y-4">
                    <div className="w-16 h-16 bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)] rounded-2xl flex items-center justify-center mx-auto text-2xl">
                      <i className="fas fa-shield-alt"></i>
                    </div>

                    <h4 className="text-lg font-bold text-[var(--text-primary)]">
                      {t("Stripe-Hosted Payment", "بوابة دفع مشفرة عبر Stripe")}
                    </h4>
                    
                    <p className="text-sm text-[var(--text-secondary)]">
                      {t(
                        "You will be securely redirected to Stripe Checkout to complete your transaction with card, Apple Pay, or Google Pay. Sensitive payment details never touch our application.",
                        "سيتم توجيهك بأمان إلى صفحة Stripe المعتمدة لإتمام العملية ببطاقتك الائتمانية أو Apple Pay. بيانات البطاقة لا يتم تخزينها أبداً على خوادمنا."
                      )}
                    </p>

                    <div className="pt-2 flex justify-center gap-3 text-2xl text-[var(--text-secondary)]">
                      <i className="fab fa-cc-visa text-blue-400"></i>
                      <i className="fab fa-cc-mastercard text-orange-400"></i>
                      <i className="fab fa-cc-amex text-blue-500"></i>
                      <i className="fab fa-apple-pay text-white"></i>
                      <i className="fab fa-google-pay text-gray-300"></i>
                    </div>

                    <form onSubmit={handleCheckout} className="pt-4">
                      <button 
                        type="submit" 
                        disabled={isProcessing}
                        className={`w-full py-4 px-4 rounded-xl font-bold transition-all flex justify-center items-center gap-2 shadow-lg ${isProcessing ? 'bg-gray-500 cursor-not-allowed text-white' : 'bg-[var(--accent-emerald)] hover:bg-emerald-400 text-black cursor-pointer'}`}
                      >
                        {isProcessing ? (
                          <><i className="fas fa-spinner fa-spin"></i> {t("Connecting to Stripe...", "جاري الاتصال بـ Stripe...")}</>
                        ) : (
                          <><i className="fas fa-external-link-alt"></i> {t(`Proceed to Checkout ($${getTotalAmount(BASE_PRICES[selectedPlanType])})`, `المتابعة إلى الدفع ($${getTotalAmount(BASE_PRICES[selectedPlanType])})`)}</>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-12 animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-[var(--accent-emerald)]/20 text-[var(--accent-emerald)] rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-check text-4xl"></i>
              </div>
              <h2 className="text-3xl font-black text-[var(--text-primary)] mb-4">
                {t("Payment Successful & Verified!", "تم التحقق وتأكيد الدفع بنجاح!")}
              </h2>
              <p className="text-[var(--text-secondary)] text-lg mb-8 max-w-md mx-auto">
                {t("Your account has been upgraded via our secure backend webhook. You now have access to your full premium features.", "تمت ترقية حسابك عبر Webhook الآمن. يمكنك الآن الوصول إلى كامل ميزاتك الاستثنائية.")}
              </p>
              <button 
                onClick={() => {
                  // Clean query params
                  if (typeof window !== 'undefined' && window.history) {
                    window.history.replaceState({}, document.title, window.location.pathname);
                  }
                  onClose();
                  window.location.reload();
                }} 
                className="bg-[var(--accent-emerald)] text-black px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
              >
                {t("Start Exploring", "ابدأ الاستكشاف")}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PricingModal;
