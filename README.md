# Oman Biofuel & Energy Transition AI

An advanced multi-agent AI platform designed to evaluate, optimize, and research biofuel and renewable energy projects in Oman.

## Features
- **Feasibility Analyzer**: Evaluates the technical and economic viability of biofuel, hydrogen, and carbon pathways across Oman's strategic zones.
- **Research Implementation Analyzer**: Bridges the gap between laboratory yields and pilot-scale production.
- **Profit & Carbon Optimizer**: Maximizes revenue streams while minimizing lifecycle greenhouse gas emissions.
- **Challenge Solver**: Identifies and solves scientific and technical bottlenecks in biofuel research specific to Oman's climate.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A Google Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/oman-biofuel-ai.git
   cd oman-biofuel-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy the `.env.example` file to a new file named `.env`:
     ```bash
     cp .env.example .env
     ```
   - Open the `.env` file and add your Gemini API key:
     ```env
     VITE_GEMINI_API_KEY=your_actual_api_key_here
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment
This project is configured for seamless deployment on Vercel. Simply import the GitHub repository into Vercel and add your `VITE_GEMINI_API_KEY` to the Environment Variables in the Vercel project settings.
