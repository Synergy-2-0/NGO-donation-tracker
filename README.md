# TransFund: NGO Donation & Transparency Tracker

![TransFund Banner](https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=2400)

**TransFund** is an institutional-grade humanitarian platform designed to bridge the trust gap between global donors and NGOs. By integrating atomic financial transparency with real-time impact tracking, TransFund ensures that every contribution is verified, every mission is audited, and every cent is accounted for.

## 🚀 Vision
To create a high-trust philanthropic ecosystem through:
- **Financial Verifiability**: Direct integration with payment gateways and bank-grade auditing.
- **Radical Transparency**: Real-time public dashboards showcasing fund allocation and trust scores.
- **AI-Driven Impact**: Predictive analytics for donor matching and campaign health monitoring.

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
- **Intelligence**: Integrated AI heuristic service for impact analytics.
- **Security**: JWT Identity Hub + bcryptjs encryption.

### Frontend (The Interface)
- **Library**: React + Vite (Optimized production bundling)
- **Styling**: Vanilla CSS + Framer Motion (High-fidelity cinemations)
- **Visualization**: Recharts (Financial & Impact trend analysis)
- **Mapping**: Mapbox GL JS (Geospatial reach visualization)

---

## 📦 Project Structure

```bash
NGO-donation-tracker/
├── backend/             # Node.js Express Server
│   ├── src/             # Source code (Services, Repositories, Controllers)
│   └── server.js        # Entry point
├── frontend/            # React Client
│   ├── src/             # Source code (Pages, Components, Context)
│   └── vite.config.js   # Build optimization
└── README.md            # Project Master Documentation
```

---

## ⚙️ Quick Start

### 1. Prerequisite Environments
- Node.js v18+
- MongoDB Instance
- PayHere Merchant Account (Sandbox/Production)

### 2. Backend Orchestration
```bash
cd backend
npm install
# Configure .env with JWT_SECRET, MONGODB_URI, and PAYHERE_CREDENTIALS
npm run dev
```

### 3. Frontend Orchestration
```bash
cd frontend
npm install
npm run dev
```

---

## 📈 Security & Integrity
- **Role-Based Access Control (RBAC)**: Strict separation of privileges via `protect` and `restrictTo` middlewares.
- **Trust Scores**: Calculated dynamically via the ratio of `Total Allocated Funds` vs `Total Received Funds`.
- **Audit Logs**: Every financial transaction and status change is logged in an immutable archive for administrative oversight.

---

## 💎 Design Language
TransFund uses a professional **Blue/Orange/Red** palette with **Merriweather** (Institutional Serif) and **Inter** (Technical Sans) typography to balance warmth with geometric precision.

**TrustFund &copy; 2026 | Empowering Global Humanitarian Excellence**
