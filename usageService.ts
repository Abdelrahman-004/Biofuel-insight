import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export type PlanType = 'free' | 'researcher' | 'investor' | 'enterprise';

export interface UsageData {
  analysisCount: number;
  planType: PlanType;
  planExpiry: string | null;
  lastReset: string; // ISO string
}

const PLAN_LIMITS: Record<PlanType, number> = {
  free: 50,
  researcher: 150,
  investor: 500,
  enterprise: 999999,
};

function getStartOfMonth(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

function getCleanUid(uid?: string): string {
  if (uid && typeof uid === 'string' && uid.trim().length > 0) {
    return uid.trim();
  }
  let guestId = typeof window !== 'undefined' ? localStorage.getItem('omand_guest_uid') : null;
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 11);
    if (typeof window !== 'undefined') {
      localStorage.setItem('omand_guest_uid', guestId);
    }
  }
  return guestId;
}

export async function checkUsageLimit(uid: string, toolName?: string): Promise<{
  allowed: boolean;
  remaining: number;
  planType: PlanType;
  limit: number;
}> {
  try {
    const cleanUid = getCleanUid(uid);
    const usageRef = doc(db, `users/${cleanUid}/usage/current`);
    const usageSnap = await getDoc(usageRef);

    const startOfMonth = getStartOfMonth();

    if (!usageSnap.exists()) {
      // Initialize free plan compliant with firestore security rules
      const initialData: UsageData = {
        analysisCount: 0,
        planType: 'free',
        planExpiry: null,
        lastReset: startOfMonth,
      };
      await setDoc(usageRef, initialData);
      return {
        allowed: true,
        remaining: PLAN_LIMITS['free'],
        planType: 'free',
        limit: PLAN_LIMITS['free'],
      };
    }

    const data = usageSnap.data() as UsageData;
    let { analysisCount, planType, lastReset } = data;

    // Reset if it's a new month (only updates analysisCount and lastReset)
    if (lastReset !== startOfMonth) {
      analysisCount = 0;
      lastReset = startOfMonth;
      await updateDoc(usageRef, { analysisCount, lastReset });
    }

    // Determine current plan based on expiry
    let activePlan = planType;
    if (data.planExpiry && activePlan !== 'free') {
      if (new Date() > new Date(data.planExpiry)) {
        activePlan = 'free'; // Expired plan locally reverts to free
      }
    }

    const limit = PLAN_LIMITS[activePlan];
    const remaining = Math.max(0, limit - analysisCount);
    
    // Researcher plan: Research tool is unlimited
    if (activePlan === 'researcher' && toolName === 'RESEARCH') {
      return { allowed: true, remaining, planType: activePlan, limit };
    }

    return {
      allowed: remaining > 0,
      remaining,
      planType: activePlan,
      limit,
    };
  } catch (error) {
    console.error("Failed to check usage limit:", error);
    // Fail open - don't block the user if Firebase is temporarily unavailable
    return {
      allowed: true,
      remaining: 999,
      planType: 'free',
      limit: 3
    };
  }
}

export async function incrementUsage(uid: string, toolName?: string): Promise<void> {
  try {
    const cleanUid = getCleanUid(uid);
    const usageRef = doc(db, `users/${cleanUid}/usage/current`);
    const usageSnap = await getDoc(usageRef);
    if (!usageSnap.exists()) return;

    const data = usageSnap.data() as UsageData;
    
    // Do not increment if researcher uses research tool
    if (data.planType === 'researcher' && toolName === 'RESEARCH') {
      return;
    }
    
    // Conforms strictly to firestore.rules: increment by exactly 1
    await updateDoc(usageRef, {
      analysisCount: (data.analysisCount || 0) + 1,
    });
  } catch (error) {
    console.error("Failed to increment usage:", error);
  }
}

export async function getUserPlan(uid: string): Promise<{
  planType: PlanType;
  analysisCount: number;
  limit: number;
  remaining: number;
  planExpiry: Date | null;
}> {
   try {
     const status = await checkUsageLimit(uid);
     const cleanUid = getCleanUid(uid);
     const usageRef = doc(db, `users/${cleanUid}/usage/current`);
     const usageSnap = await getDoc(usageRef);
     
     const data = usageSnap.exists() ? (usageSnap.data() as UsageData) : null;
     
     return {
       planType: status.planType,
       analysisCount: data?.analysisCount || 0,
       limit: status.limit,
       remaining: status.remaining,
       planExpiry: data?.planExpiry ? new Date(data.planExpiry) : null
     };
   } catch(e) {
     return {
       planType: 'free',
       analysisCount: 0,
       limit: 3,
       remaining: 3,
       planExpiry: null
     };
   }
}

/**
 * Initiates verified server-side Stripe Checkout session.
 * Replaces direct client writes to prevent unauthorized plan escalation.
 */
export async function createStripeCheckout(
  uid: string,
  plan: 'researcher' | 'investor' | 'enterprise',
  billingCycle: number
): Promise<{ url: string; sessionId: string }> {
  const cleanUid = getCleanUid(uid);
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      planType: plan,
      billingCycle: String(billingCycle),
      uid: cleanUid,
      returnUrl: window.location.origin,
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.url) {
    throw new Error(data.error || 'Failed to initiate secure Stripe checkout session');
  }

  return data;
}
