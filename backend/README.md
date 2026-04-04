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
- **Lifecycle Ops**: Draft → Pending → Active → Completed → Archived.
- **Evidence Logs**: Documentation-backed milestones for verified field work.
- **Geocoding Hub**: Geocoded campaign locations for geospatial transparency.

---

## 🧪 Automated Testing (E2E)

TransFund uses **Playwright** for comprehensive end-to-end testing of both the API and core navigation flows.

### Running Tests
```bash
# Install browsers (first time only)
npx playwright install

# Run all tests (spec files)
npx playwright test

# Run a specific suite
npx playwright test tests/fixtures-lifecycle.spec.js
```

### Test Structure
- **Assertions**: Web-first verification of API responses and UI visibility.
- **BDD**: Multi-step user journeys (e.g., Donor viewing campaign metrics).
- **Fixtures**: Automated state management (creating/cleaning up test admins, NGOs, and campaigns).
- **Mocking**: Strategic intercepting of third-party payment gateways (PayHere).

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
│   ├── controllers/     # HTTP Request/Response handlers
│   ├── middlewares/     # Auth (JWT), Validation, Roles, Upload
│   ├── models/          # Data schemas (TransFund schemas)
│   ├── repository/      # High-performance DB query layer
│   ├── routes/          # Express endpoint registry
│   └── services/        # Atomic business logic layer
├── tests/               # Playwright specs (.spec.js)
└── server.js            # Unified orchestrator
```

---

## 📦 API Catalog (Institutional Endpoints)

### Auth & User Hub
- `POST /api/users/register`: Direct role-based registration.
- `POST /api/users/login`: Secure access grant.

### NGO Onboarding & Management
- `POST /api/ngos/register`: Submit an organization for verification.
- `PATCH /api/ngos/:id/approve`: (Admin Only) Approve an NGO for platform operations.
- `GET /api/ngos/public`: List of all verified humanitarian partners.

### Finance & Treasury registry
- `POST /api/finance/payhere/init`: Initiate philanthropic capital intake.
- `POST /api/finance/payhere/callback`: Asynchronous payment synchronization.
- `GET /api/finance/summary/ngo/:id`: NGO gross performance data.

### Mission Control
- `POST /api/campaigns`: Initialize new humanitarian project.
- `PUT /api/campaigns/:id/publish`: (Admin Only) Deploy project to public network.
- `PUT /api/campaigns/:id/submit`: (NGO Admin) Submit proposal for review.

---

## ⚙️ Environment Configuration

```env
PORT=3001 # Falls back to 3000 if unset
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
OPENROUTER_API_KEY=...
PAYHERE_MERCHANT_ID=...
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

**TransFund Backend Node | Version 2.1 (Verified)**
