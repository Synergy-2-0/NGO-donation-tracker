# NGO Donation Tracker - Frontend

React-based Donor Management Portal for the NGO Donation Tracker platform.

## Technology Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Context API | Global state management (Auth + Donor) |
| Axios | HTTP API communication |
| Tailwind CSS | Utility-first styling |
| Vite | Build tool and dev server |
| JWT + localStorage | Session persistence |

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file from the example:
```bash
cp .env.example .env
```

```env
# Point to backend
VITE_API_URL=http://localhost:3000

# Or hosted server
# VITE_API_URL=http://44.192.7.89:3000
```

3. Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Project Structure

```
frontend/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx          # Entry point
    ├── App.jsx           # Routes and providers
    ├── index.css         # Tailwind base styles
    ├── api/
    │   └── axios.js      # Axios instance with auth interceptor
    ├── context/
    │   ├── AuthContext.jsx   # Login, logout, JWT session
    │   └── DonorContext.jsx  # Donor profile, pledges, analytics, transactions
    ├── components/
    │   ├── Layout.jsx        # App shell (sidebar + navbar + outlet)
    │   ├── Navbar.jsx        # Top navigation bar
    │   ├── Sidebar.jsx       # Left navigation sidebar
    │   ├── ProtectedRoute.jsx # Auth guard
    │   ├── LoadingSpinner.jsx
    │   └── ErrorAlert.jsx
    └── pages/
        ├── LoginPage.jsx          # Email/password login
        ├── DashboardPage.jsx      # Overview: stats, recent pledges
        ├── ProfilePage.jsx        # Create / view / edit / delete donor profile
        ├── PledgesPage.jsx        # Full pledge CRUD with modals
        └── DonationHistoryPage.jsx # Transaction history with summary stats
```

## Pages and Features

| Page | Route | Description |
|---|---|---|
| Login | `/login` | Donor authentication |
| Dashboard | `/dashboard` | Analytics summary, recent pledges, quick actions |
| My Profile | `/profile` | Create, view, edit, delete donor profile |
| Pledges | `/pledges` | Create, edit, delete pledges with modal forms |
| Donation History | `/donations` | Full transaction history with totals |

## Backend API Integration

All API calls use the configured Axios instance (`src/api/axios.js`) which:
- Automatically attaches the JWT Bearer token from localStorage
- Redirects to `/login` on 401 responses

Key endpoints consumed:

| Feature | Method | Endpoint |
|---|---|---|
| Login | POST | `/api/users/login` |
| Get my profile | GET | `/api/donors/me` |
| Create profile | POST | `/api/donors` |
| Update profile | PUT | `/api/donors/:id` |
| Delete profile | DELETE | `/api/donors/:id` |
| Get pledges | GET | `/api/donors/:id/pledges` |
| Create pledge | POST | `/api/donors/:id/pledges` |
| Update pledge | PUT | `/api/donors/:id/pledges/:pledgeId` |
| Delete pledge | DELETE | `/api/donors/:id/pledges/:pledgeId` |
| Get analytics | GET | `/api/donors/:id/analytics` |
| Get transactions | GET | `/api/finance/transactions/donor/:id` |

## Build

```bash
npm run build
```

Output is in the `dist/` folder.
