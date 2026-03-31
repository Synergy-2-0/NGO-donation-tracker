# TransFund - Backend API Architecture

Institutional-grade RESTful API for managing high-trust humanitarian workflows, financial transparency, and AI-driven impact metrics.

## 🚀 Key Modules

### 1. Finance & Transparency (Atomic Registry)
- **PayHere Integration**: Secure transaction initialization and webhook-based status synchronization.
- **Trust Score Engine**: Dynamic formula-based scoring: `(Total Allocated / Total Received) * 100`.
- **Fund Allocation**: Multi-category fund distribution with strict balance verification against completed transactions.

### 2. AI & Impact Analytics (Heuristic Layer)
- **Donor Matching**: Heuristic scoring based on NGO CSR focus areas and trust ratings.
- **Campaign Health**: Simulated sentiment analysis of mission descriptions and milestone completion rates.
- **Impact Metrics**: Aggregated real-time data across global geocoded reach.

### 3. Mission & Milestone Management
- **Lifecycle Ops**: Draft → Published → Completed → Archived.
- **Evidence Logs**: Documentation-backed milestones for verified field work.
- **Geocoding Hub**: Geocoded campaign locations for geospatial transparency.

---

## 🛠️ Technical Specifications

### Core Stack
- **Runtime**: Node.js (Full ESM support)
- **Framework**: Express.js (v5 structure)
- **Persistence**: MongoDB + Mongoose (Schema-based modeling)
- **Identity**: JWT Identity Hub (7-day duration default)
- **Security**: bcryptjs + Role-based access control (RBAC) middleware.

### Folder Architecture
```bash
backend/
├── src/
│   ├── config/          # Environment & Database connections
│   ├── controllers/     # HTTP Request/Response handlers
│   ├── middlewares/     # Auth (JWT), Validation, Roles, Upload
│   ├── models/          # Data schemas (TransFund schemas)
│   ├── repository/      # High-performance DB query layer
│   ├── routes/          # Express endpoint registry
│   ├── services/        # Atomic business logic layer
│   └── utils/           # Shared utility helpers (Email, Cache)
└── server.js            # Unified orchestrator
```

---

## 📦 API Catalog (Institutional Endpoints)

### Auth & User Hub
- `POST /api/users/register`: Direct role-based registration.
- `POST /api/users/login`: Secure access grant.

### Finance & Treasury registry
- `POST /api/finance/payhere/init`: Initiate philanthropic capital intake.
- `POST /api/finance/payhere/callback`: Asynchronous payment synchronization.
- `GET /api/finance/summary/ngo/:id`: NGO gross performance data.
- `GET /api/finance/trust-score/:ngoId`: Real-time transparency ranking.

### Mission Control
- `POST /api/campaigns`: Initialize new humanitarian project.
- `PUT /api/campaigns/:id/publish`: Deploy project to public network.
- `GET /api/campaigns/metrics`: Global network impact aggregation.

---

## ⚙️ Environment Configuration

```env
PORT=3001
MONGODB_URI=mongodb://...
JWT_SECRET=...
PAYHERE_MERCHANT_ID=...
PAYHERE_MERCHANT_SECRET=...
ALLOWED_ORIGINS=http://localhost:5173
```

**TransFund Backend Node | Version 2.0 (Stable)**
