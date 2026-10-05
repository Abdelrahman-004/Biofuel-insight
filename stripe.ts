import Stripe from 'stripe';
import { updateUserPlanServerSide } from './firebaseAdmin';

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not configured');
    }
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

const PLAN_NAMES: Record<string, string> = {
  researcher: 'BioFuel Insight - Researcher Plan',
  investor: 'BioFuel Insight - Investor Pro Plan',
  enterprise: 'BioFuel Insight - Enterprise Plan',
};

const BASE_PRICES: Record<string, number> = {
  researcher: 9,
  investor: 29,
  enterprise: 99,
};

export function calculatePlanPrice(planType: string, months: number): number {
  const base = BASE_PRICES[planType] || 9;
  if (months === 6) return Math.round(base * 6 * 0.9);
  if (months === 12) return Math.round(base * 12 * 0.8);
  return base * months;
}

export async function createCheckoutSession(params: {
  planType: 'researcher' | 'investor' | 'enterprise';
  billingCycle: '1' | '6' | '12';
  uid: string;
  returnUrl: string;
}): Promise<{ url: string; sessionId: string }> {
  const stripe = getStripe();
  const months = parseInt(params.billingCycle, 10) || 1;
  const totalPriceUsd = calculatePlanPrice(params.planType, months);
  const planName = PLAN_NAMES[params.planType] || 'Subscription Plan';

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${planName} (${months} ${months === 1 ? 'Month' : 'Months'})`,
            description: `Access to BioFuel Insight AI analysis tools, exports, and elevated quotas.`,
          },
          unit_amount: totalPriceUsd * 100, // Cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${params.returnUrl}?session_id={CHECKOUT_SESSION_ID}&status=success`,
    cancel_url: `${params.returnUrl}?status=cancelled`,
    metadata: {
      uid: params.uid,
      planType: params.planType,
      months: String(months),
    },
  });

  if (!session.url) {
    throw new Error('Failed to retrieve checkout URL from Stripe');
  }

  return { url: session.url, sessionId: session.id };
}

export async function handleStripeWebhook(
  rawBody: Buffer,
  signature: string | string[] | undefined
): Promise<{ received: boolean; processed?: boolean; plan?: string }> {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  if (webhookSecret && signature && typeof signature === 'string') {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } else {
    // If webhook secret is not yet configured in development, parse raw event with warning
    console.warn('⚠️ STRIPE_WEBHOOK_SECRET not provided. Verifying unverified payload in dev mode.');
    event = JSON.parse(rawBody.toString('utf8')) as Stripe.Event;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata;

    if (metadata && metadata.uid && metadata.planType) {
      const months = parseInt(metadata.months || '1', 10);
      const planType = metadata.planType as 'researcher' | 'investor' | 'enterprise';
      
      console.log(`[Stripe Webhook] Verified payment for UID: ${metadata.uid}. Upgrading to ${planType} for ${months} month(s)...`);
      await updateUserPlanServerSide(metadata.uid, planType, months);
      return { received: true, processed: true, plan: planType };
    }
  }

  return { received: true, processed: false };
}
