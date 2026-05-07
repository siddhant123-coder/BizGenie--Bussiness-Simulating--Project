# BizGenie - Business Simulation Game

> **Start with ₹10,000. Navigate 10 real business scenarios. Learn what it actually takes.**

A full-stack business simulation game where players make real financial decisions, face consequences, and unlock business concepts — all through gameplay, not lectures. Built as a BTech CSE final-year project on the topic: *Gaming Built Around Business Simulation*.

---

## Preview

```
Landing Screen  →  Game Screen (10 Scenarios)  →  Final Results  →  Leaderboard
```

Scenarios are inspired by real companies: **Amazon · Netflix · Zomato · Flipkart · Airbnb · Apple · Mamaearth**

---

## Project Structure

```
bizgenie/
├── frontend/                    # React + Vite + Tailwind + Three.js
│   ├── src/
│   │   ├── components/
│   │   │   ├── LandingScreen.jsx     # Hero page with 3D animation + CTA
│   │   │   ├── GameScreen.jsx        # Main gameplay — scenarios + choices
│   │   │   ├── FinalScreen.jsx       # Results — grade, journal, concepts
│   │   │   ├── LeaderboardScreen.jsx # Global rankings with sort + medals
│   │   │   ├── GameHUD.jsx           # Fixed top bar — live cash/score/streak
│   │   │   ├── ThreeBackground.jsx   # Three.js WebGL 3D background
│   │   │   └── CustomCursor.jsx      # Gold dot cursor with lagging ring
│   │   ├── data/
│   │   │   └── scenarios.js          # All 10 scenario objects + concept glossary
│   │   ├── hooks/
│   │   │   └── useGameStore.js       # Zustand global state + leaderboard persist
│   │   ├── App.jsx                   # Screen router (landing/game/final/leaderboard)
│   │   ├── main.jsx                  # React entry point
│   │   └── index.css                 # Tailwind + custom animations
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/                     # Node.js + Express + Prisma + PostgreSQL
    ├── src/
    │   ├── server.js                 # App entry — middleware + routes + listen
    │   ├── lib/
    │   │   └── prisma.js             # PrismaClient singleton
    │   ├── middleware/
    │   │   ├── authenticate.js       # JWT verification middleware
    │   │   ├── errorHandler.js       # Global error catch-all
    │   │   └── validate.js           # Zod request body validation
    │   └── routes/
    │       ├── auth.js               # Register / Login / Refresh / Logout
    │       ├── game.js               # Save sessions + fetch history
    │       └── leaderboard.js        # Global top-20 rankings
    ├── prisma/
    │   └── schema.prisma             # DB models: User, GameSession, ScenarioAnswer
    ├── .env.example                  # Environment variables template
    ├── render.yaml                   # One-click Render.com deployment config
    └── package.json
```

---

## Features

### Gameplay
- **₹10,000 starting capital** — real money, real consequences every round
- **10 real business scenarios** — each based on an actual company decision
- **4 choices per scenario** — only one is the best strategic move
- **Live cash tracker** — balance updates after every decision
- **Business concept unlock** — learn MVP, Blue Ocean, D2C, Equity etc. as rewards
- **Streak system** — consecutive correct answers build a multiplier
- **Decision journal** — full log of every choice and its cash impact
- **Final grade** — from Business Apprentice to Business Genius

### Frontend
- **Three.js 3D landing** — 600 gold particles, 2 wireframe tori, 40 floating cubes, mouse parallax at 60fps
- **Shimmer gold text** — CSS animated gradient on the BizGenie title
- **Custom cursor** — gold dot + lagging ring follower
- **Scrolling ticker tape** — business concepts scroll across the bottom
- **Leaderboard screen** — global rankings with gold/silver/bronze medals, sort by score/accuracy/ROI
- **Grain overlay + grid pattern** — premium dark aesthetic
- **Fully responsive** — works on mobile and desktop

### Backend
- **JWT authentication** — access token (15 min) + refresh token (7 days) via HttpOnly cookie
- **Refresh token rotation** — replay attack prevention baked in
- **bcrypt password hashing** — 12 salt rounds
- **Prisma ORM** — type-safe DB queries, no raw SQL
- **Zod validation** — every request body validated before touching the DB
- **7 security layers** — Helmet, CORS, rate limiting, bcrypt, JWT, rotation, Zod
- **Global error handler** — consistent error responses across all routes
- **One-command deployment** — render.yaml handles everything on Render.com

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend framework | React 18 + Vite 5 | Component architecture + instant HMR |
| 3D animation | Three.js | WebGL particles, tori, mouse parallax |
| Styling | Tailwind CSS 3 | Utility-first, dark gold design system |
| State management | Zustand | Tiny (1kb), no boilerplate, localStorage persist |
| Backend runtime | Node.js 18+ | Non-blocking, LTS stable |
| Web framework | Express 4 | Minimal, middleware-composable |
| ORM | Prisma 5 | Type-safe queries from schema |
| Database | PostgreSQL | Relational, ACID, free on Render |
| Auth | JWT (jsonwebtoken) | Stateless, short-lived access tokens |
| Password hashing | bcrypt | Slow hash, brute-force resistant |
| Validation | Zod | Schema-first, strips unknown fields |
| Security headers | Helmet | 11 headers in one line |
| Deployment | Render.com | Free tier, auto-deploy from GitHub |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL (local) or a Render.com account (for cloud)

---

### Frontend Setup

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

**Build for production:**
```bash
npm run build
npm run preview
```

---

### Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Copy env template and fill in values
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/bizgenie_db
JWT_SECRET=your_64_byte_random_hex_here
JWT_REFRESH_SECRET=your_different_64_byte_random_hex_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Generate JWT secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Run this twice — use one for `JWT_SECRET` and the other for `JWT_REFRESH_SECRET`.

```bash
# 4. Generate Prisma client + push schema to DB
npm run build        # runs: prisma generate
npm run db:push      # runs: prisma db push

# 5. Start dev server
npm run dev

# API running at:
# http://localhost:4000
```

---

## 🗄️ Database Schema

Three models, two one-to-many relations:

```
User  ──────────────────────────────────────────────────────────
  id            String    uuid, PK
  name          String
  email         String    unique
  passwordHash  String    bcrypt
  refreshToken  String?   rotated on every refresh
  createdAt     DateTime  auto
  lastLogin     DateTime? updated on login

  └── GameSession[]   (one-to-many)

GameSession  ────────────────────────────────────────────────────
  id              String    uuid, PK
  userId          String    FK → User (cascade delete)
  businessType    String
  businessLabel   String    e.g. "Organic Soap Business"
  businessEmoji   String   
  finalCash       Int       ₹ balance at game end
  score           Int       total points
  correctCount    Int
  totalAnswered   Int
  maxStreak       Int
  accuracyPct     Int       0–100
  grade           String    e.g. "Business Genius"
  journal         Json      array of all decisions
  conceptsLearned Json      array of concept names
  completedAt     DateTime  auto

  └── ScenarioAnswer[]   (one-to-many)

ScenarioAnswer  ─────────────────────────────────────────────────
  id            String    uuid, PK
  sessionId     String    FK → GameSession (cascade delete)
  scenarioIndex Int       0–9
  choiceIndex   Int       0–3
  isCorrect     Boolean
  moneyDelta    Int       ₹ change from this answer
  answeredAt    DateTime  auto
```

---

## 🔌 API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | ❌ | Create account — returns accessToken + sets refresh cookie |
| POST | `/login` | ❌ | Login — returns accessToken + sets refresh cookie |
| POST | `/refresh` |Cookie | Rotate refresh token — returns new accessToken |
| POST | `/logout` |JWT | Invalidate refresh token + clear cookie |

**Register / Login request body:**
```json
{
  "name": "aakriti",
  "email": "aakriti@example.com",
  "password": "securepassword123"
}
```

**Register / Login response:**
```json
{
  "accessToken": "eyJhbGci...",
  "user": { "id": "uuid", "name": "aakriti", "email": "aakriti@example.com" }
}
```

---

### Game Routes — `/api/game`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/sessions` |JWT | Save a completed game session |
| GET | `/sessions` |JWT | Get current player's last 20 sessions |

**POST /sessions request body (14 fields validated by Zod):**
```json
{
  "businessType": "soap",
  "businessLabel": "Organic Soap Business",
  "businessEmoji": "🧴",
  "finalCash": 65000,
  "score": 800,
  "correctCount": 7,
  "totalAnswered": 10,
  "maxStreak": 5,
  "accuracyPct": 70,
  "grade": "Strategic Thinker",
  "journal": [...],
  "conceptsLearned": ["Lean Startup & MVP", "Blue Ocean Strategy"],
  "answers": [
    { "scenarioIndex": 0, "choiceIndex": 1, "isCorrect": true, "moneyDelta": 4500 }
  ]
}
```

---

### Leaderboard Route — `/api/leaderboard`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Public | Top 20 sessions ordered by score |

**Response:**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "name": "aakriti",
      "businessEmoji": "🧴",
      "businessLabel": "Organic Soap Business",
      "score": 800,
      "finalCash": 65000,
      "accuracy": 80,
      "maxStreak": 5,
      "date": "24 Apr 25"
    }
  ]
}
```

---

### Health Check

```
GET /api/health  →  { "status": "ok", "ts": 1714000000000 }
```

---

##  Security

| Layer | Implementation | What it prevents |
|---|---|---|
| Helmet.js | 11 security headers on every response | Clickjacking, MIME sniffing, XSS via CSP |
| bcrypt (12 rounds) | Password hashing ~250ms per attempt | Brute-force even with DB leak |
| JWT access token (15 min) | Short-lived, stateless auth | Stolen token damage window is minimal |
| HttpOnly cookie | Refresh token stored server-side | XSS cannot steal refresh token |
| Token rotation | New refresh token issued on every `/refresh` | Replay attacks immediately detected |
| Rate limiting | 100 req/15min global, 10 req/15min auth | Brute-force and DDoS |
| Zod validation | All request bodies schema-validated | Injection via malformed input |

---

## Deployment

### Backend — Render.com (automatic via render.yaml)

The `render.yaml` file at the repo root tells Render exactly what to do:

```yaml
services:
  - type: web
    name: bizgenie-backend
    runtime: node
    rootDir: backend
    buildCommand: npm install && npx prisma generate && npx prisma db push
    startCommand: node src/server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: bizgenie-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: JWT_REFRESH_SECRET
        generateValue: true
      - key: FRONTEND_URL
        value: https://your-app.vercel.app

databases:
  - name: bizgenie-db
    databaseName: bizgenie
    user: bizgenie
    plan: free
```

**Steps:**
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New → Blueprint
3. Connect your GitHub repo — Render auto-reads `render.yaml`
4. Update `FRONTEND_URL` to your actual Vercel deployment URL
5. Click Deploy — Render handles the database, secrets and everything else

---

### Frontend — Vercel (recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel

# Set environment variable in Vercel dashboard:
# VITE_API_URL = https://your-backend.onrender.com
```

Update your API base URL in the frontend store:
```js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'
```

---

## The 10 Business Scenarios

| # | Scenario | Business Concept | Real Inspiration |
|---|---|---|---|
| 1 | Your First Product | Lean Startup & MVP | Airbnb |
| 2 | The Competitor Strikes | Blue Ocean Strategy | Jio vs Small Telcos |
| 3 | Viral Moment | Pre-order Model & Cash Flow | OnePlus / Apple |
| 4 | Hiring Your First Employee | Fixed vs Variable Costs | Uber / Zomato |
| 5 | The Loan Offer | Leverage & Revenue-Share | Big Bazaar |
| 6 | Product Gone Wrong | Crisis Management & Brand Trust | Maggi / J&J Tylenol |
| 7 | Expand or Focus? | Focus Strategy vs Diversification | Haldiram's |
| 8 | Digital vs Physical | D2C Model & Distribution | Mamaearth |
| 9 | The Investor Arrives | Equity, Valuation & Negotiation | Shark Tank India |
| 10 | Exit or Keep Going? | Exit Strategy & M&A | Flipkart / Walmart |

---

## Business Concepts Taught

Players unlock these concepts through gameplay — not reading:

`Lean Startup & MVP` · `Blue Ocean Strategy` · `Pre-order Model` · `Fixed vs Variable Costs` · `Leverage & Revenue-Share` · `Crisis Management` · `Focus Strategy` · `D2C Model` · `Equity Negotiation` · `Exit Strategy & M&A`

---

## Scripts Reference

### Frontend
```bash
npm run dev        # Start Vite dev server on :5173
npm run build      # Production build → dist/
npm run preview    # Preview production build
```

### Backend
```bash
npm run dev        # nodemon — auto-restart on file change
npm run start      # node src/server.js (production)
npm run build      # prisma generate — creates typed client
npm run db:push    # prisma db push — sync schema to DB
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Add your scenario to `src/data/scenarios.js` following the existing schema
4. Commit: `git commit -m 'feat: add scenario X'`
5. Push and open a Pull Request

### Adding a New Scenario

```js
// In src/data/scenarios.js
{
  id: 11,
  title: 'Your Scenario Title',
  difficulty: 'easy' | 'med' | 'hard',
  icon: '🎯',
  category: 'STRATEGY',
  context: 'Brief setup — what situation is the player in?',
  situation: 'Full detail of the dilemma with all option contexts...',
  question: 'What do you do?',
  choices: [
    { label: 'Option A', cost: 5000, effect: 'What happens if chosen...' },
    { label: 'Option B', cost: 0,    effect: '...' },
    { label: 'Option C', cost: 2000, effect: '...' },
    { label: 'Option D', cost: 8000, effect: '...' },
  ],
  correct: 1,                            // index of best choice (0-based)
  moneyChange: { 0: -2000, 1: 5000, 2: 1000, 3: -3000 },
  reveal: {
    win: 'Explanation when player picks the correct choice...',
    lose: 'Lesson when player picks a wrong choice...',
  },
  concept: {
    title: 'Concept Name',
    body: 'Explanation of the business concept unlocked...',
  },
  realExample: 'Real company or person who faced this exact situation...',
}
```

---

##  License

MIT — free to use, modify and distribute.

---

##  Academic Context

**Project Topic:** Gaming Built Around Business Simulation — Development of a game focused on simulating business scenarios for learning purposes.

**Course:** BTech Computer Science and Engineering

**Learning Outcomes:** Players who complete BizGenie absorb 10 real business strategy concepts through consequence-driven gameplay. Every wrong answer is a memorable lesson backed by a real-world Indian company case study. The game proves that active learning through simulation is more effective than passive reading of theory.

---

*Built with React + Vite + Three.js + Node.js + Express + Prisma + PostgreSQL*
