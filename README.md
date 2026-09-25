# Rubel Ai Chatbot

A modern, fast, and intelligent AI chatbot built with Next.js 16, Vercel AI SDK 5.0, and Google's Gemini 3.5 Flash model.

## Features
- 🚀 **Blazing Fast Responses:** Powered by `gemini-3.5-flash`.
- 💾 **Local Chat History:** Conversations are auto-saved in your browser.
- 🎨 **Modern Design:** Beautiful UI with Tailwind CSS.
- 📋 **Markdown & Code Highlighting:** Properly formatted responses with one-click copy.
- 🛑 **Stop Generation:** Stop long responses instantly.

---

## 🚀 How to Deploy to Vercel

Vercel automatically detects this Next.js project and uses the `build` and `start` scripts in `package.json`. The AI dependencies require Node.js 22 or newer, which is declared in `engines`.

### Method 1: Using Vercel Dashboard

1. Push this project to a GitHub repository.
2. Go to Vercel and select **Add New → Project**.
3. Import the GitHub repository.
4. Before deploying, add this environment variable to the Production environment:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Your Google Gemini API key
5. Click **Deploy**.

### Method 2: Using Vercel CLI

Run the following commands from the project root:

```bash
npx vercel env add GEMINI_API_KEY production
npx vercel --prod
```

Follow the prompts to link or create the Vercel project. The API key remains server-side and is never bundled into the browser.

## Local Development

Create a local environment file if needed:

```bash
copy .env.example .env.local
```

Then add your Gemini API key to `.env.local` and run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.
