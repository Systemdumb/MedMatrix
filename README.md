# MedMatrix — Adaptive Medication Adherence Intelligence System

MedMatrix is a digital health platform designed for personalized medication adherence intelligence, combining sensor evidence, patient behavior analytics, barrier identification, multilingual voice interventions, and closed-loop learning.

---

## 🏛️ Architecture Overview

```
React / Vite Frontend (Port 5173)
        │
        │ REST API calls (/api/...)
        ▼
Node.js + Express Backend (Port 5000)
        │
        ▼
Repository Abstractions (server/src/repositories/)
        │
        ▼
Mongoose ORM Models (server/src/models/)
        │
        ▼
MongoDB Atlas ("MedMatrix" Database)
```

### Core Intelligence Engines
1. `EventStateMachine` — Tracks medication states (`SCHEDULED`, `READY`, `DISPENSING`, `COLLECTED`, `COMPLETED`, `DELAYED`, `MISSED`, `FAILED`, `UNCERTAIN`).
2. `AdherenceAnalyticsEngine` — Calculates adherence trends and vulnerability windows.
3. `BarrierIdentificationEngine` — Identifies probable barriers (forgetfulness, availability, routine disruption, etc.).
4. `PersonalizedInterventionEngine` — Generates tailored interventions (e.g., Hindi voice reminders, caregiver notifications).
5. `InterventionLearningEngine` — Evaluates intervention effectiveness and learns optimal response patterns.

---

## 📁 Repository Structure

```
Project/
├── .env.example                # Template for environment variables
├── .env                        # Local environment secrets (git-ignored)
├── docs/
│   └── MONGODB_SETUP.md        # Detailed MongoDB Atlas setup guide
├── server/                     # Express REST API Backend
│   ├── src/
│   │   ├── config/database.ts  # Mongoose connection & graceful shutdown
│   │   ├── models/             # Mongoose schemas (Patient, Medication, Event, etc.)
│   │   ├── repositories/       # Mongo Repository Layer
│   │   ├── routes/             # Express REST routes (/api/...)
│   │   ├── app.ts              # Express application setup with Helmet & CORS
│   │   ├── server.ts           # Server entry point
│   │   └── seed.ts             # Fictional demo dataset seed script
│   ├── package.json
│   └── tsconfig.json
├── src/                        # React / Vite Frontend
│   ├── components/             # Patient-friendly healthcare components
│   ├── context/                # MedicationContext with fail-safe API sync
│   ├── services/
│   │   ├── api/apiClient.ts    # REST API client with offline fallback
│   │   └── ... (Engines, Hardware Adapter, Scenario Runner)
│   └── types/                  # Shared TypeScript interfaces
├── package.json
└── vite.config.ts
```

---

## ⚡ Quick Start

### 1. Environment Setup
Copy `.env.example` to `.env` and fill in your MongoDB Atlas connection string:
```bash
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/MedMatrix
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 2. Install Dependencies & Build
```bash
# Frontend dependencies
npm install

# Server dependencies
cd server && npm install && cd ..
```

### 3. Seed Database & Run Server
```bash
# Seed development database with fictional demo patient
cd server && npm run seed && cd ..

# Start backend server
cd server && npm run dev
```

### 4. Run Frontend App
In a separate terminal:
```bash
npm run dev
```

Visit `http://localhost:5173`.

---

## 🏥 Verification & Health Check

Test backend health endpoint:
```bash
curl http://localhost:5000/api/health
# Response: { "status": "ok" }
```

Run test suite:
```bash
npx tsx src/testRunner.ts
```

---

## 🔒 Security & Data Hygiene
- Credentials are strictly managed server-side via `.env` (git-ignored).
- Centralized error handling prevents exposure of database tracebacks or raw errors to clients.
- Cors restricted to `CLIENT_URL`.
- Only fictional demo data is included in dev seed scripts.