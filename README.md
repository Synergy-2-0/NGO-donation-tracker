# TransFund: NGO Donation & Transparency Tracker

<div align="center">
  <img src="frontend/public/heart-logo d.png" width="450" alt="TransFund Logo">
</div>

**TransFund** is an institutional-grade humanitarian platform designed to bridge the trust gap between global donors and NGOs. By integrating atomic financial transparency with real-time impact tracking, TransFund ensures that every contribution is verified, every mission is audited, and every cent is accounted for.

## 🚀 Vision
To create a high-trust philanthropic ecosystem through:
- **Financial Verifiability**: Direct integration with payment gateways and bank-grade auditing.
- **Radical Transparency**: Real-time public dashboards showcasing fund allocation and trust scores.
- **AI-Driven Impact**: Predictive analytics for donor matching and campaign health monitoring.
- **Global Inclusivity**: Comprehensive multi-language support (English, Sinhala, Tamil) to decentralize humanitarian access.

---

## 🏛️ Ecosystem Roles & Features

### 🌍 Guest / Public
- **Strategic Impact Map**: Interactive Mapbox integration showing global humanitarian reach.
- **Transparency Hub**: Real-time aggregation of active partnerships and trust leaderboards.
- **Campaign Discovery**: Verified mission registry for immediate contribution.

### 🛡️ Donor (Individual & Corporate)
- **Impact Dashboard**: personalized metrics showcasing direct beneficiary reach.
- **Secure Handling**: Backend-driven PayHere integration for LKR & global currency support.
- **AI Matching**: Automated NGO matching based on CSR preferences and sector alignment.
- **Pledge Management**: Support for recurring strategic commitments.

### 🏢 NGO Administrator
- **Treasury Registry**: Full financial visibility into gross income vs. capital deployment.
- **Mission Lifecycle**: Proposal creation, milestone tracking, and radical fund allocation.
- **Institutional Profile**: Showcase verification documents, SDG alignment, and geocoded reach.

### 🤝 Corporate Partner
- **Agreement Pipeline**: Managing high-volume strategic partnerships and MOU milestones.
- **CSR Reporting**: Automated, audit-ready reports on fund deployment and impact metrics.

---

## 🛠️ Technology Stack

### Backend (The Core)
- **Runtime**: Node.js (ESM Modules)
- **Framework**: Express.js (v5 Architecture)
- **Database**: MongoDB + Mongoose (Atomic Transactions)
- **Intelligence**: Integrated AI heuristic service (OpenRouter/Gemini) for impact analytics.
- **Security**: JWT Identity Hub + bcryptjs encryption.
- **Testing**: Playwright End-to-End Suite for API and UI consistency.

### Frontend (The Interface)
- **Library**: React + Vite (Optimized production bundling)
- **Styling**: Vanilla CSS + Tailwind + Framer Motion (High-fidelity cinemations)
- **Localization**: react-i18next (English, Sinhala, Tamil support)
- **Visualization**: Recharts (Financial & Impact trend analysis)
- **Mapping**: Mapbox GL JS (Geospatial reach visualization)

---

## 📦 Project Structure

```bash
NGO-donation-tracker/
├── backend/             # Node.js Express Server & E2E Tests
│   ├── src/             # API Core (Services, Repositories, Controllers)
│   ├── tests/           # Playwright Test Suite (.spec.js)
│   └── playwright.config.js # Global Testing Configuration
├── frontend/            # React Client
│   ├── src/             # UI Components (Pages, Context, Hooks)
│   └── vite.config.js   # Proxy & Build optimization
└── README.md            # Project Master Documentation
```

---

## ⚙️ Quick Start

### 1. Prerequisite Environments
- Node.js v18+
- MongoDB Instance
- OpenRouter API Key (for AI insights)
- PayHere Merchant Account (Sandbox/Production)

### 2. Backend Orchestration
```bash
cd backend
npm install
# Configure .env based on .env.example
npm run dev
```

### 3. Frontend Orchestration
```bash
cd frontend
npm install
npm run dev
```

### 4. Running Tests
```bash
cd backend
npx playwright install
npx playwright test
```

---

## 📈 Security & Integrity
- **Role-Based Access Control (RBAC)**: Strict separation of privileges (Donor, NGO, Admin, Corporate).
- **Trust Scores**: Calculated dynamically via the ratio of `Received Funds` vs `Allocated Impact`.
- **Audit Logs**: Immutable registry of all financial movements and status transitions.
- **CI/CD Integration**: Automated Playwright validation on every deployment pipeline.

---

## ☁️ Deployment Report

TransFund is deployed on **DigitalOcean App Platform** as a unified multi-component application, served under a single custom domain with automatic SSL/TLS.

| | Details |
|---|---|
| **Platform** | DigitalOcean App Platform |
| **Region** | BLR1 — Bangalore, India |
| **Architecture** | Web Service (Backend) + Static Site (Frontend) |
| **CI/CD** | Auto-deploy on push to `staging` branch via GitHub |
| **Monthly Cost** | $5.00 / month |

### 🔗 Live URLs

| Resource | URL |
|---|---|
| 🌐 **Frontend App** | [https://trustfund.axisdatatech.com](https://trustfund.axisdatatech.com) |
| 🔌 **REST API** | [https://trustfund.axisdatatech.com/api](https://trustfund.axisdatatech.com/api) |
| 🔵 **DigitalOcean URL** | [https://trustfund-qoxqw.ondigitalocean.app](https://trustfund-qoxqw.ondigitalocean.app) |

### 🔑 Key Environment Variables (no secrets exposed)

`MONGO_URI` · `JWT_SECRET` · `PAYHERE_MERCHANT_ID` · `PAYHERE_MERCHANT_SECRET` · `PAYHERE_MODE` · `CLOUDINARY_URL` · `OPENROUTER_API_KEY` · `FRONTEND_URL` · `BACKEND_URL` · `VITE_API_URL` · `VITE_MAPBOX_TOKEN`

### 📄 Full Deployment Documentation

> For step-by-step setup instructions, routing configuration, environment variable reference, architecture diagram, and deployment screenshots, see:
> **[📖 DEPLOYMENT.md](./docs/deployment/DEPLOYMENT.md)**

---

## 🧪 Testing Instruction Report

TransFund implements a triple-tier testing strategy to ensure reliability and performance.

### **1. Unit Testing (Jest)**
Validates individual services and core logic in isolation.
- **Run Command**: `cd backend && npm run test:unit`
- **Coverage**: Donor Service, Campaign Service, Transaction Service, Partner Service.

### **2. Integration Testing (Jest/Supertest)**
Ensures API endpoints correctly communicate with the MongoDB database.
- **Run Command**: `cd backend && npm run test:int`
- **Coverage**: Auth flows, Campaign lifecycle, Partner approvals.

### **3. Performance Testing (Artillery.io)**
Evaluates API stability and latency under high concurrent load.
- **Setup**: Ensure the backend server is running locally on port 3000.
- **Run Command**: `cd backend && npm run test:perf`
- **Expectation**: Server should handle up to 50 concurrent virtual users with < 200ms latency.

### **4. End-to-End Testing (Playwright)**
Simulates real user journeys across the frontend and backend.
- **Run Command**: `cd backend && npx playwright test`

---

## 📖 API Documentation
A detailed API breakdown for **Postman** testing is available in the [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) file.
- **Methods**: GET, POST, PUT, PATCH, DELETE
- **Auth**: JWT Bearer Tokens
- **Base URL**: `http://localhost:3000/api`

---

## 💎 Design Language
TransFund uses a professional **Deep Slate/Impact Orange** palette with **Open Sans** typography to ensure accessibility and project authority.

**TrustFund &copy; 2026 | Empowering Global Humanitarian Excellence**
