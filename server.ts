import dns from 'node:dns';
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  // Ignore in environments where not supported
}

import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';

import {
  optimizeProject,
  analyzeProject,
  solveChallenge,
  analyzeResearchImplementation,
  suggestProject,
  checkStandardsCompliance,
  generateProposal,
  processOmanEvPlatform,
  processVoltOmanEngine,
  fetchLiveNews,
} from './server/gemini';

import { generateScientificFallbackSolution } from './server/scientificFallback';

import {
  createCheckoutSession,
  handleStripeWebhook,
} from './server/stripe';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());

  // 1. Stripe Webhook endpoint - MUST receive raw buffer for signature verification
  app.post(
    '/api/webhook/stripe',
    express.raw({ type: 'application/json' }),
    async (req, res) => {
      try {
        const sig = req.headers['stripe-signature'];
        const result = await handleStripeWebhook(req.body as Buffer, sig);
        res.json(result);
      } catch (err: any) {
        console.error('[Stripe Webhook Error]:', err.message);
        res.status(400).json({ error: `Webhook Error: ${err.message}` });
      }
    }
  );

  // 2. Standard JSON body parser for other API routes
  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
  });

  // --- GEMINI SERVER-SIDE API ROUTES (Issue 1 fix) ---
  app.post('/api/gemini/optimize-project', async (req, res) => {
    try {
      const { projectName, description, language } = req.body;
      const result = await optimizeProject(projectName, description, language);
      res.json({ success: true, data: result });
    } catch (error: any) {
      console.error('Error in /api/gemini/optimize-project:', error);
      res.status(500).json({ success: false, error: error.message || 'Optimization failed' });
    }
  });

  app.post('/api/gemini/analyze-project', async (req, res) => {
    try {
      const { inputs } = req.body;
      const result = await analyzeProject(inputs);
      res.json({ success: true, data: result });
    } catch (error: any) {
      console.error('Error in /api/gemini/analyze-project:', error);
      res.status(500).json({ success: false, error: error.message || 'Analysis failed' });
    }
  });

  app.post('/api/gemini/solve-challenge', async (req, res) => {
    try {
      const { topic, language, researchDetails } = req.body;
      const result = await solveChallenge(topic, language, researchDetails);
      res.json({ success: true, data: result });
    } catch (error: any) {
      console.warn('Recovered from error in /api/gemini/solve-challenge via deterministic scientific fallback:', error?.message || error);
      const { topic, language, researchDetails } = req.body;
      const fallbackResult = generateScientificFallbackSolution(topic, language, researchDetails);
      res.json({ success: true, data: fallbackResult });
    }
  });

  app.post('/api/gemini/research-implementation', async (req, res) => {
    try {
      const { inputs, language } = req.body;
      const result = await analyzeResearchImplementation(inputs, language);
      res.json({ success: true, data: result });
    } catch (error: any) {
      console.error('Error in /api/gemini/research-implementation:', error);
      res.status(500).json({ success: false, error: error.message || 'Research analysis failed' });
    }
  });

  app.post('/api/gemini/suggest-project', async (req, res) => {
    try {
      const { context, language } = req.body;
      const result = await suggestProject(context, language);
      res.json({ success: true, data: result });
    } catch (error: any) {
      console.error('Error in /api/gemini/suggest-project:', error);
      res.status(500).json({ success: false, error: error.message || 'Project suggestion failed' });
    }
  });

  app.post('/api/gemini/check-standards', async (req, res) => {
    try {
      const { inputs, language } = req.body;
      const result = await checkStandardsCompliance(inputs, language);
      res.json({ success: true, data: result });
    } catch (error: any) {
      console.error('Error in /api/gemini/check-standards:', error);
      res.status(500).json({ success: false, error: error.message || 'Standards check failed' });
    }
  });

  app.post('/api/gemini/generate-proposal', async (req, res) => {
    try {
      const { inputs } = req.body;
      const result = await generateProposal(inputs);
      res.json({ success: true, data: result });
    } catch (error: any) {
      console.error('Error in /api/gemini/generate-proposal:', error);
      res.status(500).json({ success: false, error: error.message || 'Proposal generation failed' });
    }
  });

  app.post('/api/gemini/oman-ev-optimizer', async (req, res) => {
    try {
      const { inputs } = req.body;
      const result = await processOmanEvPlatform(inputs);
      res.json({ success: true, data: result });
    } catch (error: any) {
      console.error('Error in /api/gemini/oman-ev-optimizer:', error);
      res.status(500).json({ success: false, error: error.message || 'Oman EV processing failed' });
    }
  });

  app.post('/api/gemini/voltoman-route-planner', async (req, res) => {
    try {
      const { inputs } = req.body;
      const result = await processVoltOmanEngine(inputs);
      res.json({ success: true, data: result });
    } catch (error: any) {
      console.error('Error in /api/gemini/voltoman-route-planner:', error);
      res.status(500).json({ success: false, error: error.message || 'VoltOman Engine processing failed' });
    }
  });


  app.get('/api/gemini/news', async (req, res) => {
    try {
      const result = await fetchLiveNews();
      res.json({ success: true, data: result });
    } catch (error: any) {
      console.error('Error in /api/gemini/news:', error);
      res.status(500).json({ success: false, error: error.message || 'News fetch failed' });
    }
  });

  // --- STRIPE CHECKOUT API ROUTE (Issue 2 fix) ---
  app.post('/api/create-checkout-session', async (req, res) => {
    try {
      const { planType, billingCycle, uid, returnUrl } = req.body;
      if (!planType || !uid) {
        return res.status(400).json({ error: 'planType and uid are required' });
      }

      const host = req.get('origin') || req.get('referer') || 'http://localhost:3000';
      const cleanReturnUrl = returnUrl || host;

      const session = await createCheckoutSession({
        planType,
        billingCycle: billingCycle || '1',
        uid,
        returnUrl: cleanReturnUrl,
      });

      res.json(session);
    } catch (error: any) {
      console.error('Error creating Stripe Checkout session:', error);
      res.status(500).json({ error: error.message || 'Failed to create checkout session' });
    }
  });

  // 3. Vite middleware for frontend serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 BioFuel Insight AI Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
