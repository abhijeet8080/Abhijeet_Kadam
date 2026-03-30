# Portfolio — Implementation documentation (`portfolio3`)

This document describes **how the portfolio is built and what each part contains**, aligned with the current source tree. It is meant as a **single reference** for routes, content, skills, tech stack, AI chat, navigation, and assets.

**Owner (site):** Abhijeet Kadam — VS Code–themed personal portfolio (Next.js App Router).

---

## 1. Product summary

| Aspect | Implementation |
|--------|----------------|
| **UX metaphor** | Visual Studio Code: **activity bar**, **explorer sidebar**, **editor tabs**, **status bar**, **home terminal**, **command palette** (Ctrl+Shift+P / Cmd+Shift+P). |
| **Framework** | Next.js **15.2.4**, React **19**, TypeScript **5**, **Turbopack** in dev (`npm run dev`). |
| **Styling** | Tailwind CSS **v4** (`app/globals.css`), **tw-animate-css**, **shadcn/ui** (New York, `components.json`), **Radix UI** primitives. |
| **Icons** | **Lucide React** (primary); **react-icons** is listed in `package.json`. |
| **Motion** | **Framer Motion** on page transitions and tab animations. |
| **Theme** | **next-themes** — `defaultTheme="dark"`, `enableSystem`, `attribute="class"` (`components/theme-provider.tsx`). |
| **Fonts** | **Geist** + **Geist Mono** via `next/font/google` (`app/layout.tsx`). |
| **Analytics** | **@vercel/analytics** in root layout. |
| **Metadata** | Title: *“Abhijeet Kadam — Engineer, Builder, Creator”*; description: *“Explore the tabs of my dev journey, one project at a time”*; favicon `/favicon.ico`. |
| **Viewport** | `maximumScale: 1`, `userScalable: false` (limits pinch-zoom on mobile). |

---

## 2. Dependencies (npm) — full list

From `package.json` (production `dependencies`):

| Package | Role in this project |
|---------|----------------------|
| **@google/generative-ai** | Server-side **Gemini** chat in `controller/chatController.ts`. |
| **@hookform/resolvers** | Form validation with **zod** (e.g. contact patterns). |
| **@radix-ui/react-*** | Primitives for shadcn/ui (avatar, dialog, dropdown, label, scroll-area, separator, tabs, tooltip, …). |
| **@tailwindcss/typography** | Prose styling for markdown-like content. |
| **@vercel/analytics** | Page analytics. |
| **ai** | Vercel AI SDK (listed; chat is implemented via `@google/generative-ai` directly). |
| **axios** | HTTP client: `lib/chatBot.ts` (chat), `app/contact/page.tsx` (contact form). |
| **class-variance-authority** | Component variants (shadcn pattern). |
| **clsx** + **tailwind-merge** | `cn()` in `lib/utils.ts`. |
| **cmdk** | Command palette search UI (`components/ui/command.tsx`). |
| **framer-motion** | Layout and page animations. |
| **lucide-react** | Icons across VS Code UI and pages. |
| **next** | App Router, Image, fonts, metadata. |
| **next-mdx-remote** | Available for MDX-heavy pages if extended. |
| **next-themes** | Dark/light/system theme. |
| **nodemailer** | SMTP email (`lib/email.config.ts`, `lib/sendMail.ts`). |
| **openai** / **openai-edge** | Present in `package.json`; **chat does not use them** (Gemini is used instead). |
| **react** / **react-dom** | UI. |
| **react-hook-form** | Contact form. |
| **react-icons** | Optional icon set. |
| **react-markdown** + **remark-gfm** | TypingAnimation / markdown rendering paths. |
| **react-syntax-highlighter** | Syntax highlighting where used. |
| **tailwind-merge** | Merged with clsx in `cn()`. |
| **tailwindcss-typography** | Typography plugin (legacy name; project also uses `@tailwindcss/typography`). |
| **tw-animate-css** | Animation utilities in `globals.css`. |
| **twilio** | Dependency; telephony is described in **Voice Agent** skills and project copy. |
| **zod** | Schema validation. |

**DevDependencies:** ESLint, Tailwind v4 + PostCSS, TypeScript, `@types/*` for Node/React.

**Scripts**

- `npm run dev` — `next dev --turbopack`
- `npm run build` — production build
- `npm run start` — production server
- `npm run lint` — Next.js ESLint

---

## 3. Repository layout

```
portfolio3/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # POST/GET/OPTIONS + CORS helpers
│   │   └── contact/route.ts       # POST contact form → SMTP
│   ├── about/
│   │   ├── page.tsx               # About Me (prose)
│   │   ├── skills/page.tsx        # skills.json visual (JSON in <pre>)
│   │   └── experience/page.tsx    # AEOS experience + AEOS logo + bullets
│   ├── chat/page.tsx              # Crypto chat UI
│   ├── contact/page.tsx           # Contact form + social links
│   ├── projects/
│   │   ├── bablue|convocloud|chatwave|blockmind|jarvis|bugbot|voice-agent/page.tsx
│   ├── globals.css
│   ├── layout.tsx                 # Root: fonts, ThemeProvider, Analytics, suppressHydrationWarning
│   └── page.tsx                   # Home: welcome + Terminal
├── components/
│   ├── theme-provider.tsx
│   ├── ui/                        # shadcn primitives (button, card, dialog, command, input, …)
│   └── vscode/                    # VS Code shell (layout, sidebar, tabs, terminal, …)
├── controller/
│   └── chatController.ts          # Gemini: GoogleGenerativeAI + system prompt + history
├── lib/
│   ├── chatBot.ts                 # axios → POST /api/chat
│   ├── email.config.ts            # nodemailer SMTP transporter
│   ├── sendMail.ts              # sendMailRequest wrapper
│   └── utils.ts                   # cn()
├── public/
│   └── icons/                     # Project + hero images (PNG, etc.)
├── next.config.ts                 # redirects: /experience → /about/experience
├── components.json                # shadcn config
├── package.json
├── tsconfig.json
└── portfolio.md                   # this file
```

**Note:** Root `README.md` may mention a `blog/` folder — **no blog routes** exist in this tree.

---

## 4. Global app behavior

### 4.1 `app/layout.tsx`

- Loads **Geist** / **Geist Mono** CSS variables on `<body>`.
- Wraps children in **`ThemeProvider`** (dark default).
- **`suppressHydrationWarning`** on **`<html>`** and **`<body>`** to reduce hydration noise (e.g. theme + browser extensions).
- **`@vercel/analytics`** after children.

### 4.2 `next.config.ts`

- **Permanent redirect:** `/experience` → `/about/experience` (old path → nested under About).

### 4.3 `app/globals.css`

- Tailwind v4 `@import "tailwindcss"` + `tw-animate-css`.
- Design tokens: CSS variables for colors, radius, sidebar, charts (`@theme inline`).
- Dark variant: `@custom-variant dark (&:is(.dark *));`
- **`@layer components`** — **`.tech-badge`**: pill style for project tech tags (blue tones, responsive text).

**Base layer:** `border-border`, `body` bg/foreground.

---

## 5. Routes and pages (every route)

All “main” pages use **`VSCodeLayout`** and **`CommandPalette`** with **Ctrl+Shift+P** (same `useEffect` pattern).

| Path | Source file | What it shows |
|------|-------------|----------------|
| **`/`** | `app/page.tsx` | Title “Welcome to My Portfolio”, short intro, **`Terminal`** component (`components/vscode/terminal.tsx`). |
| **`/about`** | `app/about/page.tsx` | **About Me** (prose): role at AEOS Labs, quote, **Background** (BTech E&TC, VIIT, **8.93 CGPA**, **May 2025**), **What I focus on** (4 bullets), **Beyond the keyboard**, CTA to contact + AI chat. |
| **`/about/skills`** | `app/about/skills/page.tsx` | Fake **`skills.json`**: monospace JSON with `name`, `title`, and all skill arrays (see §7). |
| **`/about/experience`** | `app/about/experience/page.tsx` | **Experience** heading: **AEOS** hero image (`/icons/aeos.png`), **AEOS Labs — Full Stack AI Engineer**, Sept 2025 – Present, `// role` / `// domain` meta lines, full bullet list (see §8). Layout width **`max-w-6xl`**; logo container uses **`w-96`** in current code. |
| **`/contact`** | `app/contact/page.tsx` | Two-column layout: form (name, email, message) + **Connect** card (email, GitHub, LinkedIn). Submits via **`axios.post(\`${NEXT_PUBLIC_SITE_URL}/api/contact\`, formState)`**. |
| **`/chat`** | `app/chat/page.tsx` | **Crypto: AI Assistant** header, message list (`motion` + `AnimatePresence`), **TypingAnimation** for assistant text, **`/api/chat`** via `sendMessageToAI`. **Hydration:** welcome message `timestamp` starts **`null`**; **`timeReady`** + `useEffect` set timestamp after mount; times render only when `timeReady && message.timestamp` to avoid SSR/client `Date` mismatch. |
| **`/projects/bablue`** | `app/projects/bablue/page.tsx` | Bablue — AI agent; card with **Image** `/icons/bablue.png`; tech badges; GitHub + live demo links; prev/next to other projects. |
| **`/projects/convocloud`** | `app/projects/convocloud/page.tsx` | ConvoCloud — video conferencing; `/icons/convocloud.png`; Clerk + Stream; links. |
| **`/projects/chatwave`** | `app/projects/chatwave/page.tsx` | ChatWave — MERN + Socket.io; `/icons/chatwave.png`; links. Tab label in UI: **`chatapp.jsx`**. |
| **`/projects/blockmind`** | `app/projects/blockmind/page.tsx` | BlockMind — Web3 + AI; `/icons/blockmind.png`; Wagmi, RainbowKit, etc. |
| **`/projects/jarvis`** | `app/projects/jarvis/page.tsx` | Jarvis (FounderBot) — WIP; placeholder hero; GitHub link. **Not listed in sidebar/tabs** (commented out). |
| **`/projects/bugbot`** | `app/projects/bugbot/page.tsx` | BugBot — AI PR review; hero **`/icons/bugbot.png`**; category + bullet list + `// tech` badges; footer nav. |
| **`/projects/voice-agent`** | `app/projects/voice-agent/page.tsx` | Voice Agent — hero **`/icons/voice-agent.png`**; category + bullets + tech; footer nav. |

---

## 6. VS Code shell (`components/vscode/`)

| File | Responsibility |
|------|------------------|
| **`layout.tsx`** | **ActivityBar** + animated **Sidebar** + **Tabs** + scrollable main + **StatusBar**. **Mobile:** `<768px` sidebar can overlay; explorer toggles width. |
| **`activity-bar.tsx`** | Left icon column: Explorer (toggles sidebar), Search, SCM, Debug, Extensions, Profile (mostly **no-op**); Settings at bottom. **Tooltips** via Radix. |
| **`sidebar.tsx`** | **Explorer** tree: **About** folder (`about.md`, `skills.json`, `experience.ts`), **Projects** folder (see §10), **`contact.tsx`**, **`chat.tsx`**. Folders **`defaultOpen: true`** for About and Projects. **Jarvis** entry is **commented out**. |
| **`tabs.tsx`** | **`routeToTab`** maps pathname → tab label + icon. **Jarvis** route commented out. **`/projects/chatwave`** tab shows **`chatapp.jsx`**. Tabs accumulate; close removes tab; closing last tab navigates to **`/`**. |
| **`status-bar.tsx`** | Decorative: branch `main`, “0 problems”, Wi‑Fi, notifications, TS version, UTF-8, LF. |
| **`terminal.tsx`** | Fake terminal: timed welcome lines; commands **`help`**, **`about`**, **`skills`**, **`experience`**, **`projects`**, **`contact`**, **`clear`**; **Arrow Up/Down** history. **projects** helper lists: Voice Agent, BugBot, ConvoCloud, BlockMind, Bablue, ChatApp. |
| **`command-palette.tsx`** | **cmdk** dialog: **Pages** (Home, About, Experience `/about/experience`, **Go to Projects → `/projects/voice-agent`**, BugBot, Voice Agent, Contact, Chat), **Theme** (dark/light via `document.documentElement.classList`), **Social** (GitHub, LinkedIn). |

---

## 7. Skills page — exact `skills` object (`app/about/skills/page.tsx`)

Rendered as a **syntax-highlighted JSON** block. Top-level JSON fields:

- **`"name"`:** `"Abhijeet Kadam"`
- **`"title"`:** `"Full Stack AI Engineer"`
- **`"skills"`:** object with keys in fixed order **`SKILL_ORDER`**:

### 7.1 `frontend`

HTML5, CSS3, JavaScript (ES6+), TypeScript, React, Next.js, Tailwind CSS, Framer Motion, Redux, CSS-in-JS  
### 7.2 `backend`

Node.js, Express, RESTful APIs, MongoDB, WebSockets, Hono, BullMQ, Redis, Prisma, PostgreSQL  

### 7.3 `web3`

Solidity, Ethereum, Smart Contracts, Ethers.js, Hardhat, Wagmi, Viem  

### 7.4 `cloud`

Azure Container Apps, Azure Container Registry, Azure Communication Services, GitHub Actions, Docker, KEDA  

### 7.5 `ai`

OpenAI, Google Gemini (Live API), Deepgram (STT/TTS), Microsoft Graph API  

### 7.6 `languages`

Java  

### 7.7 `tools`

Git & GitHub, VS Code, Vite, PostMan, IntelliJ, Docker, ngrok  

### 7.8 `telephony`

Twilio Voice, Twilio Media Streams, Twilio SMS  

### 7.9 `softSkills`

Problem Solving, Communication, Team Collaboration, Time Management, Adaptability, Attention to Detail  

---

## 8. Experience page — content (`app/about/experience/page.tsx`)

**Meta (comment-style lines):**

- **role:** Full Stack AI Engineer  
- **domain:** Industrial B2B Marketplace + AI Automation  

**Section title:** AEOS Labs — Full Stack AI Engineer — **Sept 2025 – Present**

**Hero image:** `public/icons/aeos.png` — **Next.js `Image`** with `priority`, `object-contain`, black background container.

**Bullets (verbatim topics; one item has sub-bullets):**

1. Production-grade B2B marketplace **Industrial Motion** — TypeScript monorepo, independently deployable **Auth + Sync** microservices on **Azure Container Apps**.  
2. **RFQ automation** — OpenAI + Google Gemini; quote time **48+ hours → minutes**.  
3. **Async jobs** — BullMQ + Redis + KEDA auto-scaling, handling:  
   - RFQ processing  
   - vendor sourcing  
   - email ingestion  
   - Microsoft Graph subscription lifecycle  
4. **Microsoft Business Central** — OData APIs; bidirectional sync of vendors, items, purchase quotes, conversations.  
5. **Email ingestion** — Microsoft Graph webhooks → parse/process RFQs from email.  
6. **Docker** multi-stage builds; **CI/CD** GitHub Actions → Azure Container Registry → Azure Container Apps.  
7. **Prisma + PostgreSQL**, shared **`@industrial/db`** package.  
8. **Document pipelines** — PDF, Word, Excel (pdf-parse, mammoth, xlsx).  
9. **Azure Communication Services (Email)** — transactional email flows.  
10. **Business Central customization** — align ERP with platform automation.  

---

## 9. About page — section outline (`app/about/page.tsx`)

1. **About Me** — Intro: **Full Stack AI Engineer at AEOS Labs** (Sept 2025 – Present); Azure, AI agents, voice, tooling.  
2. **Quote** — “Great software is the perfect harmony…”  
3. **Background** — BTech E&TC **VIIT**, **8.93 CGPA**, **May 2025**; path to AI-augmented systems, RFQs, enterprise APIs, voice.  
4. **What I focus on** — distributed backends/queues, AI pipelines, DX (monorepos, CI/CD, review tooling), fast accessible UIs (web + telephony).  
5. **Beyond the keyboard** — nature, cooking, engineering blogs.  
6. **Closing** — collaborations; contact page or AI chat.  

---

## 10. Projects — explorer order and navigation

### 10.1 Sidebar order (`components/vscode/sidebar.tsx`)

Under **Projects** (all **`text-yellow-400`** file icons except explorer semantics):

1. `voice-agent.tsx` → `/projects/voice-agent`  
2. `bugbot.tsx` → `/projects/bugbot`  
3. `convocloud.jsx` → `/projects/convocloud`  
4. `blockmind.jsx` → `/projects/blockmind`  
5. `bablue.jsx` → `/projects/bablue`  
6. `chatapp.jsx` → `/projects/chatwave` (label **ChatApp**, route still **`chatwave`**)  

**Jarvis** is **commented out** (route `/projects/jarvis` still exists if opened directly).

### 10.2 Circular “Previous / Next” project chain (implementation intent)

Projects link to each other in a ring (footer buttons vary by page):

**Voice Agent** ↔ **BugBot** ↔ **ConvoCloud** ↔ **BlockMind** ↔ **Bablue** ↔ **ChatWave** ↔ **Voice Agent**

### 10.3 Project detail summaries (marketing copy in code)

| Route | Highlights (from pages) |
|-------|-------------------------|
| **Bablue** | AI agent, Gemini, Clerk, MongoDB, task CRUD, Next.js; `/icons/bablue.png`; live + GitHub. |
| **ConvoCloud** | Next.js, Clerk, Stream, video; `/icons/convocloud.png`. |
| **ChatWave** | MERN, Socket.io, real-time chat; `/icons/chatwave.png`. |
| **BlockMind** | AI + Web3 task manager, Wagmi, RainbowKit, OpenAI, Solidity; `/icons/blockmind.png`. |
| **Jarvis** | WIP; LangChain, GPT-4, Gmail, Prisma/PostgreSQL; placeholder image. |
| **BugBot** | Category: AI Systems / Developer Tools / Distributed Systems; hero **bugbot.png**; bullets: Webhooks→Hono→BullMQ, multi-stage AI, diff chunking, @octokit/app, Prisma job tracking, retries/idempotency, monorepo; tech badges: Hono, BullMQ, Redis, OpenAI, Octokit, PostgreSQL, Prisma, TypeScript. |
| **Voice Agent** | Category: AI Systems / Real-Time / Telephony; hero **voice-agent.png**; Gemini Live, Twilio, Deepgram fallback, VAD, state machine, booking + SMS, Supabase, Redis; tech badges: Twilio, Gemini Live, Deepgram, Hono, WebSockets, Supabase, Redis, Node.js, TypeScript. |

---

## 11. Chat (`/chat`) and AI backend

### 11.1 Client — `lib/chatBot.ts`

- **`sendMessageToAI(message)`** → **`axios.post('/api/chat', { message })`** (same-origin; avoids cross-origin issues with `NEXT_PUBLIC_SITE_URL` in dev).

### 11.2 API — `app/api/chat/route.ts`

- **POST** `{ message }` → `chatWithAI(message)` from `controller/chatController.ts` → JSON `{ reply }`.  
- **GET** — JSON welcome string.  
- **OPTIONS** — CORS preflight.  
- **`getCorsHeaders`** uses `NEXT_PUBLIC_ALLOWED_ORIGINS` split by comma, or **`["*"]`**.

### 11.3 Controller — `controller/chatController.ts`

- **`@google/generative-ai`**: `GoogleGenerativeAI(apiKey)`.  
- **API key:** `GEMINI_API_KEY` **or** `GOOGLE_GENERATIVE_AI_API_KEY` (throws at import if missing).  
- **Model:** `process.env.GEMINI_MODEL` **or** default **`gemini-2.5-flash`** (see `GEMINI_MODEL` in `controller/chatController.ts`).  
- **`getGenerativeModel({ model, systemInstruction })`** — **`SYSTEM_PROMPT`** is long: persona **Crypto**, rules, AEOS/BugBot/Voice Agent summaries, skills buckets, portfolio project links, education, contact line.  
- **Chat:** `startChat({ history: conversationHistory })` + `sendMessage(message)`; then append user/model `parts` to `conversationHistory`; trim to **`MAX_HISTORY_TURNS` (10)** full turns (20 messages max).  
- **Note:** In-memory history **resets** on cold serverless instances.

### 11.4 UI — `app/chat/page.tsx`

- Assistant messages use **`TypingAnimation`** (`components/ui/typing-animation.tsx`) with **react-markdown** + **remark-gfm**.  
- **Hydration:** see §5 (timestamps + `timeReady`).

---

## 12. Contact (`/contact`) and email

- **Fields:** name, email, message (required).  
- **Submit:** `axios.post(\`${NEXT_PUBLIC_SITE_URL}/api/contact\`, formState)` — requires **`NEXT_PUBLIC_SITE_URL`** set to the site’s public origin (e.g. production URL).  
- **`app/api/contact/route.ts`:** builds HTML email, `sendMailRequest({ from: SMTP_MAIL, to: RECIPIENT_EMAIL, ... })`.  
- **`lib/email.config.ts`:** nodemailer with `SMTP_HOST`, `SMTP_PORT`, `SMTP_MAIL`, `SMTP_PASSWORD`.  
- **Displayed links:** `kadamabhijeet021@gmail.com`, github.com/abhijeet8080, linkedin.com/in/abhijeetkadam21.

---

## 13. Static assets (`public/icons/`)

Referenced in code (ensure files exist):

| File | Used on |
|------|---------|
| `aeos.png` | `/about/experience` |
| `bablue.png` | `/projects/bablue` |
| `convocloud.png` | `/projects/convocloud` |
| `chatwave.png` | `/projects/chatwave` |
| `blockmind.png` | `/projects/blockmind` |
| `bugbot.png` | `/projects/bugbot` |
| `voice-agent.png` | `/projects/voice-agent` |

---

## 14. Environment variables (reference)

| Variable | Purpose |
|----------|---------|
| **`GEMINI_API_KEY`** or **`GOOGLE_GENERATIVE_AI_API_KEY`** | Gemini API — **required** for chat. |
| **`GEMINI_MODEL`** | Optional override for model id. |
| **`NEXT_PUBLIC_SITE_URL`** | **Contact form** POST base URL; must match deployed origin when using absolute URL. |
| **`NEXT_PUBLIC_ALLOWED_ORIGINS`** | Optional CORS list for `/api/chat` (comma-separated). |
| **`SMTP_HOST`**, **`SMTP_PORT`**, **`SMTP_MAIL`**, **`SMTP_PASSWORD`** | SMTP. |
| **`RECIPIENT_EMAIL`** | Contact form recipient. |

Do **not** commit real secrets; use `.env.local` locally and Vercel/hosting env in production.

---

## 15. Known limitations / notes

- **README** may mention folders (e.g. blog) not present in this repo.  
- **Chat history** is in-memory on the server instance only.  
- **Jarvis** is hidden from explorer/tabs but **route remains**.  
- **Browser extensions** (e.g. Dark Reader) can inject styles into SVGs; **suppressHydrationWarning** on `<html>`/`<body>` mitigates some hydration warnings.  
- **`openai` / `openai-edge`** in `package.json` are **not** used by the current Gemini chat path.

---

## 16. Where to edit what

| Concern | Primary file(s) |
|---------|-------------------|
| Site title / viewport / fonts | `app/layout.tsx` |
| Home copy + terminal | `app/page.tsx`, `components/vscode/terminal.tsx` |
| About copy | `app/about/page.tsx` |
| Skills JSON | `app/about/skills/page.tsx` (`skills` + `SKILL_ORDER`) |
| Experience bullets + logo | `app/about/experience/page.tsx` |
| Project content + images | `app/projects/*/page.tsx` |
| Explorer tree | `components/vscode/sidebar.tsx` |
| Tab labels | `components/vscode/tabs.tsx` |
| Command palette | `components/vscode/command-palette.tsx` |
| Crypto persona + knowledge | `controller/chatController.ts` (`SYSTEM_PROMPT`) |
| Chat HTTP client | `lib/chatBot.ts` |
| Redirects | `next.config.ts` |
| Global CSS / tech-badge | `app/globals.css` |

---

*Last aligned with the repo’s implementation. Update this file when you add routes, env vars, or change copy/structure.*
