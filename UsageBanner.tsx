import React, { useEffect, useState } from 'react';
import { getUserPlan } from './usageService';

interface UsageBannerProps {
  uid: string | undefined;
  language: 'English' | 'Arabic';
  onUpgradeClick: () => void;
  planRefreshTrigger?: number;
}

const UsageBanner: React.FC<UsageBannerProps> = ({ uid, language, onUpgradeClick, planRefreshTrigger }) => {
  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState<{planType: string; remaining: number; limit: number} | null>(null);

  const t = (en: string, ar: string) => language === 'Arabic' ? ar : en;

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }
    
    let isMounted = true;
    const fetchUsage = async () => {
      try {
        setLoading(true);
        const data = await getUserPlan(uid);
        if (isMounted) setUsage(data);
      } catch (err) {
        console.error("Failed to load usage:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    fetchUsage();
    return () => { isMounted = false; };
  }, [uid, planRefreshTrigger]);

  if (!uid || loading) return null;

  if (!usage) return null;

  const { planType, remaining, limit } = usage;
  
  if (planType === 'enterprise') {
    return (
      <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border-b border-amber-500/30 text-amber-700 dark:text-amber-300 py-2 px-4 shadow-sm flex items-center justify-center text-sm font-bold tracking-widest uppercase">
        <i className="fas fa-crown mr-3 rtl:ml-3 rtl:mr-0"></i> 
        {t("Enterprise — Unlimited Access", "خطة المؤسسات — وصول غير محدود")}
      </div>
    );
  }

  if (planType === 'researcher' || planType === 'investor') {
    return (
      <div className="bg-indigo-500/10 border-b border-indigo-500/20 text-indigo-700 dark:text-indigo-300 py-2 px-4 shadow-sm flex items-center justify-center text-sm font-medium">
        <i className="fas fa-bolt mr-2 rtl:ml-2 rtl:mr-0"></i>
        {planType === 'researcher' ? t("Researcher Plan", "خطة الباحث") : t("Investor Pro Plan", "خطة المستثمر المحترف")} — {remaining} {t("analyses remaining this month", "تحليل متبقي هذا الشهر")}
      </div>
    );
  }

  // Free Tier logic
  const isAtLimit = remaining <= 0;

  if (isAtLimit) {
    return (
      <div className="bg-red-500/10 border-b border-red-500/20 text-red-700 dark:text-red-300 py-3 px-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center text-sm font-bold">
          <i className="fas fa-exclamation-triangle mr-3 rtl:ml-3 rtl:mr-0 text-red-500"></i>
          {t("You've reached your free limit for this month", "لقد وصلت إلى الحد المجاني الخاص بك لهذا الشهر")}
        </div>
        <button 
          onClick={onUpgradeClick}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors shadow-sm"
        >
          {t("Upgrade Now", "قم بالترقية الآن")}
        </button>
      </div>
    );
  }

  const used = limit - remaining;

  return (
    <div className="bg-[var(--bg-main)] border-b border-[var(--border-glow)] text-[var(--text-secondary)] py-2 px-4 shadow-sm flex items-center justify-between">
      <div className="flex items-center text-xs md:text-sm">
        <i className="fas fa-info-circle mr-2 rtl:ml-2 rtl:mr-0"></i>
        {t(`${used} of ${limit} free analyses used this month`, `تم استخدام ${used} من أصل ${limit} تحليلات مجانية هذا الشهر`)}
      </div>
      <button 
        onClick={onUpgradeClick}
        className="text-[var(--accent-emerald)] dark:text-emerald-400 hover:text-emerald-500 font-bold text-xs uppercase tracking-widest transition-colors border border-[var(--accent-emerald)] px-3 py-1 rounded"
      >
        {t("Upgrade", "ترقية")}
      </button>
    </div>
  );
};

export default UsageBanner;
