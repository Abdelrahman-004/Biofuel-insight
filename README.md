# Oman Biofuel & Energy Transition AI (BioFuel Insight AI)

An advanced full-stack multi-agent AI platform designed to evaluate, optimize, and research biofuel and renewable energy projects in Oman.

## Key Features
- **Feasibility Analyzer**: Evaluates technical and economic viability of biofuel, hydrogen, and carbon pathways across Oman's strategic zones.
- **Research Implementation Analyzer**: Bridges the gap between laboratory yields and pilot-scale commercialization.
- **Profit & Carbon Optimizer**: Multi-agent optimizer combining primary product, byproduct, and carbon credit revenue streams.
- **Challenge Solver**: Solves scientific bottlenecks in biofuel production tailored to Oman's climate and feedstock.
- **Secure Stripe Integration**: Automated subscription checkout and webhook handling for researcher and investor quotas.
- **Server-Side AI Engine**: Gemini API keys and sensitive credentials are encrypted and processed entirely on the backend.

## Environment Configuration

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Provide the following environment variables:
```env
# Gemini API Key (Server-side only)
GEMINI_API_KEY=your_gemini_api_key

# Stripe Payment Keys (Server-side only)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the full-stack dev server:
   ```bash
   npm run dev
   ```
   The application runs on `http://localhost:3000`.

## Architecture & Security
- **Backend**: Express + Firebase Admin SDK + Stripe SDK proxying Gemini operations and securely managing subscriptions.
- **Frontend**: Vite + React 19 + Tailwind CSS + Framer Motion.
- **Database & Rules**: Firestore with strict access control denying client writes to plan tiers and usage quotas.
