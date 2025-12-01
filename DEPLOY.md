# Clo Visual - Deploying to Vercel

## Setup Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your Gemini API key from https://aistudio.google.com/app/apikey
   - **Environments**: Production, Preview, Development

## Local Development

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your API key:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

3. `.env.local` is gitignored and will NOT be committed to GitHub

## Security Notes

- The `/api/gemini.js` serverless function acts as a proxy
- API keys are stored as Vercel environment variables (not in code)
- Client-side code never exposes the API key in production
- For local development, use `.env.local` (gitignored)
