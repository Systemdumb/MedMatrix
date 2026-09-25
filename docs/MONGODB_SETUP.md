# MongoDB Atlas Setup & Backend Guide for MedMatrix

This guide details how to set up MongoDB Atlas, configure environment variables, run the Node.js + Express backend, seed initial fictional data, and test the `/api/health` endpoint.

---

## 1. MongoDB Atlas Setup

### Step 1: Create a Cluster & Database
1. Sign in to your [MongoDB Atlas Console](https://www.mongodb.com/cloud/atlas).
2. Create a new deployment or select an existing cluster.
3. Under **Database**, create a database named `MedMatrix`.

### Step 2: Database Access User
1. Go to **Database Access** -> **Add New Database User**.
2. Set Authentication Method: **Password**.
3. Choose a username and a strong password.
4. Grant the user `Read and write to any database` or target the `MedMatrix` database.

### Step 3: Network Access
1. Go to **Network Access** -> **Add IP Address**.
2. For local development, select **Add Current IP Address** or `0.0.0.0/0` (Allow Access from Anywhere).

### Step 4: Obtain Connection String
1. Return to **Database** and click **Connect**.
2. Select **Drivers** (Node.js).
3. Copy the URI string formatted like:
   ```
   mongodb+srv://<username>:<password>@<cluster-url>/MedMatrix?retryWrites=true&w=majority
   ```

---

## 2. Environment Configuration

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/MedMatrix?retryWrites=true&w=majority
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

> [!CAUTION]
> Never commit `.env` to Git. The `.env` file is already listed in `.gitignore`.

---

## 3. Starting the Backend & Seeding Data

### Install Dependencies
From the root directory or inside `/server`:

```bash
cd server
npm install
```

### Build & Seed Database
Populate fictional demo patient data and adherence evidence:

```bash
npm run seed
```

### Start Server in Development Mode
```bash
npm run dev
```
Output:
```
🚀 Initializing MedMatrix Backend Server...
✅ MongoDB connected successfully to database: "MedMatrix"
📡 MedMatrix API Server running on port 5000
🏥 Healthcheck: http://localhost:5000/api/health
```

---

## 4. API Endpoints

| Resource | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Health** | GET | `/api/health` | Returns `{ "status": "ok" }` |
| **Patients** | GET | `/api/patients` | Retrieve all patients |
| **Patients** | POST | `/api/patients` | Create or upsert patient |
| **Medications** | GET | `/api/medications?patientId=p1` | List medications |
| **Medications** | POST | `/api/medications` | Create or update medication |
| **Schedules** | GET | `/api/schedules?patientId=p1` | List medication schedules |
| **Events** | GET / POST | `/api/events` | Log/fetch medication events |
| **Barriers** | GET / POST | `/api/barriers` | Store/fetch inferred barriers |
| **Interventions** | GET / POST | `/api/interventions` | Store/fetch interventions |
| **Responses** | GET / POST | `/api/intervention-responses` | Log intervention learning feedback |

---

## 5. Offline Fallback Behavior

If the backend server or MongoDB Atlas is offline or unreachable:
1. The React app detects server status via `apiClient.checkHealth()`.
2. The UI transparently uses local state & `localStorage` without crashing.
3. Intelligence engines (`EventStateMachine`, `AdherenceAnalyticsEngine`, `BarrierIdentificationEngine`, etc.) execute continuously on local state.
