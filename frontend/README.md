# TransFund - Frontend Platform

Institutional-grade humanitarian user interface for the **TransFund** ecosystem. Designed with a focus on mission-critical clarity, donor trust, and high-fidelity project oversight.

## 🚀 Experience Hubs

### 1. Multi-Language Inclusivity
- **Localization Suite**: Integrated `react-i18next` for seamless switching between **English**, **Sinhala**, and **Tamil**.
- **Contextual Translation**: Dynamic content and UI labels optimized for regional philanthropic accessibility.

### 2. Public Transparency Portal
- **Cinematic Landing**: High-contrast Hero section with strategic mission discovery and glassmorphic UI.
- **Global Reach Map**: Mapbox GL integration for geospatial impact visualization.
- **Transparency Dashboard**: Public trust scores and verified NGO leaderboards.

### 3. Donor Influence Center (Donor)
- **Impact Registry**: Personal donor statistics (Total Donated, Mission Count, Active Pledges).
- **AI Intelligence**: Personalized project recommendations (OpenRouter integration) and predictive impact analytics.
- **Strategic Pledges**: Lifecycle management for recurring humanitarian commitments.

### 4. High-Trust Dashboard (NGO Admin)
- **Treasury Overview**: Real-time financial analytics (Total Raised, Available Funds, Allocation trends).
- **Mission Lifecycle**: Comprehensive project management (Drafting, Submission for Review, Milestone Tracking).
- **Organization Onboarding**: Institutional registration and verification document management.

---

## 🎨 Design System

### Typography
- **Core Font**: **Open Sans** (Standardized for high legibility across all weights/italics).
- **Sizing**: Atomic scale for technical precision and data-heavy interfaces.

### Palette (Trust Index)
- **Impact Orange**: `#F97316` (Action-oriented accent)
- **Trust Navy**: `#0F172A` (Stability and authority)
- **Clean Neutral**: `#FBFBFE` (Accessibility-first surfaces)

### Interactive Elements
- **Glassmorphic Cards**: Depth-layered containers with `backdrop-blur` for a premium, modern feel.
- **Animated States**: Micro-interactions powered by `Framer Motion` and custom CSS keyframes.

---

## 🛠️ Technical Implementation

### Core Stack
- **Framework**: React 18+ (Vite-optimized)
- **Styling**: Vanilla CSS + Tailwind Utility Layer.
- **Localization**: i18next + react-i18next.
- **Visualization**: Recharts (Financial and Impact analytics).

### Application Architecture
```bash
frontend/
├── src/
│   ├── components/      # Global Layout & Reusable UI modules
│   ├── context/         # Auth, Donor, & Theme state providers
│   ├── i18n/            # Localization registry (EN, SI, TA)
│   ├── pages/           # Role-based route components (Admin, Donor, Guest)
│   └── hooks/           # Custom functional logic (useAuth, useDonor, etc.)
└── vite.config.js       # Strategic proxy and production bundling
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

**TransFund Interface | Version 2.2 (Institutional Tech)**
