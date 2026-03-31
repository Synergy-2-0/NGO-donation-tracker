# TransFund - Frontend Platform

Institutional-grade humanitarian user interface for the **TransFund** ecosystem. Designed with a focus on mission-critical clarity, donor trust, and high-fidelity project oversight.

## 🚀 Experience Hubs

### 1. Public Transparency Portal (Guest)
- **Cinematic Landing**: High-contrast Hero section with strategic mission discovery.
- **Global Reach Map**: Mapbox integration for geospatial impact visualization.
- **Transparency Dashboard**: Public trust scores and verified NGO leaderboards.
- **Project Marketplace**: Intuitive mission catalog for immediate capital deployment.

### 2. Donor Influence Center (Donor)
- **Impact Registry**: Personal donor statistics (Total Donated, Mission Count).
- **Secure Handling**: Interactive multi-step donation modal with PayHere status sync.
- **AI Insights**: Personalized donor matching and project recommendations.

### 3. High-Trust Dashboard (NGO Admin)
- **Treasury Overview**: Financial summary charts (Income vs. Allocation).
- **Mission Management**: Full project lifecycle (Create, Edit, Publish, Milestones).
- **Audit Logs**: Capital deployment registry for verified fund distribution.

### 4. Strategic Partner Registry (Corporate)
- **Agreement Hub**: MOU and partnership tracking for high-volume contributors.
- **Corporate KPIs**: Impact-ready CSR reporting metrics.

---

## 🎨 Design System

### Typography
- **Heading 01 (Institutional)**: Merriweather (Bold & Italic)
- **Body & Data (Technical)**: Inter (Precision-tuned Sans-serif)

### Palette (Trust Index)
- **Primary (Strategic)**: `Dark Slate (#0f172a)`
- **Accent (Humanity)**: `Brand Orange (#ff8a00)`
- **Alert (Urgency)**: `Brand Red (#dc2626)`

### Components (Reusable Library)
- **Premium Surface**: Glassmorphic and depth-based UI containers.
- **Stat Cards**: Dynamic, animated numeric visualizers.
- **Interactive Modals**: Multi-step, context-aware functional overlays.

---

## 🛠️ Technical Implementation

### Core Stack
- **Framework**: React 18+ (Hook-based architecture)
- **Build**: Vite (Optimized production pipeline)
- **Styling**: Vanilla CSS + Utility-based layouts.
- **Motion**: Framer Motion (High-fidelity micro-interactions)
- **Charts**: Recharts (Financial and Impact visualization)

### Application Architecture
```bash
frontend/
├── src/
│   ├── api/             # Axios instance & Interceptors
│   ├── components/      # Global Layout, UI & Navigation components
│   ├── context/         # Auth, Finance, Partner, Campaign contexts
│   ├── pages/           # High-level Role-based Route components
│   │   ├── admin/       # Management & Oversight pages
│   │   └── ...          # Public & Donor pages
│   └── App.jsx          # React Router & Project Root
└── vite.config.js       # Production-ready bundling config
```

---

## ⚙️ Local Development

```bash
# 1. Install development dependencies
npm install

# 2. Configure environment
# VITE_API_URL=http://localhost:3001

# 3. Launch development server
npm run dev
```

**TransFund Interface | Version 2.0 (Verified)**
