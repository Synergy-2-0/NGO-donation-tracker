# ☁️ Deployment Report — TransFund NGO Donation Tracker

---

## Platform Overview

| Property | Value |
|---|---|
| **Cloud Provider** | DigitalOcean App Platform |
| **Region** | BLR1 — Bangalore, India |
| **App Name** | `trustfund` |
| **Architecture** | Multi-component App (Web Service + Static Site) |
| **Monthly Cost** | $5.00 / month |
| **Live URL** | [https://trustfund.axisdatatech.com](https://trustfund.axisdatatech.com) |
| **DigitalOcean URL** | [https://trustfund-qoxqw.ondigitalocean.app](https://trustfund-qoxqw.ondigitalocean.app) |

---

## Architecture Diagram

```
                 ┌──────────────────────────────────────────────┐
                 │         DigitalOcean App Platform            │
                 │                                              │
                 │   Domain: trustfund.axisdatatech.com         │
                 │                                              │
                 │   ┌─────────────────────────────────────┐   │
                 │   │   Routing Rules                     │   │
                 │   │  /api  → ngo-donation-tracker-backend│   │
                 │   │  /     → ngo-donation-tracker-frontend│  │
                 │   └────────────┬────────────────┬────────┘   │
                 │                │                │            │
                 │  ┌─────────────▼──┐   ┌─────────▼──────────┐ │
                 │  │  Web Service   │   │   Static Site      │ │
                 │  │  (Backend)     │   │   (Frontend)       │ │
                 │  │  Node.js/Express│  │   React + Vite     │ │
                 │  │  Port: 3000   │   │   Build Output     │ │
                 │  └───────────────┘   └────────────────────┘ │
                 └──────────────────────────────────────────────┘
                               │
                    ┌──────────▼───────────┐
                    │  MongoDB Atlas       │
                    │  (External DB)       │
                    └──────────────────────┘
```

---

## Component 1: Backend — `ngo-donation-tracker-backend`

| Property | Value |
|---|---|
| **Type** | Web Service |
| **Runtime** | Node.js (ESM Modules) |
| **Framework** | Express.js |
| **Port** | 3000 |
| **Resource** | 512 MB RAM, 1 Shared vCPU, 50 GB bandwidth |
| **Containers** | 1 |
| **Source Repo** | [https://github.com/SakithLiyanage/NGO-donation-tracker](https://github.com/SakithLiyanage/NGO-donation-tracker) |
| **Branch** | `staging` |
| **Source Directory** | `backend/` |

### Backend Build & Run Commands
```bash
# Build command (DigitalOcean)
npm install

# Run command (DigitalOcean)
node server.js
```

### Public Static Ingress IPs (DigitalOcean)
```
162.159.140.98
172.66.0.96
```

---

## Component 2: Frontend — `ngo-donation-tracker-frontend`

| Property | Value |
|---|---|
| **Type** | Static Site |
| **Framework** | React + Vite |
| **Source Repo** | [https://github.com/SakithLiyanage/NGO-donation-tracker](https://github.com/SakithLiyanage/NGO-donation-tracker) |
| **Branch** | `staging` |
| **Source Directory** | `frontend/` |

### Frontend Build Command
```bash
npm install && npm run build
```

### Output Directory
```
dist/
```

---

## Routing Configuration

Traffic is routed on the unified domain via DigitalOcean's component routing rules:

| Route | Target Component | Notes |
|---|---|---|
| `/api/*` | `ngo-donation-tracker-backend` | All REST API calls — path trimmed |
| `/` | `ngo-donation-tracker-frontend` | React SPA — path trimmed |

This allows both frontend and backend to share the same domain (`trustfund.axisdatatech.com`) with no CORS issues.

---

## CI/CD Pipeline

Deployments are fully automated via **GitHub → DigitalOcean App Platform**:

1. Developer pushes code to the `staging` branch on GitHub.
2. DigitalOcean detects the push via **web-flow webhook**.
3. DigitalOcean builds the backend (Node.js) and frontend (React/Vite) independently.
4. If the build passes, the new containers are swapped with zero downtime.
5. Deployment status is reflected in the DigitalOcean Activity Log.

> **Note:** Any commit to `main` or branches other than `staging` will NOT trigger a deployment.

---

## Environment Variables

The following environment variables are configured in the DigitalOcean App Platform dashboard under **Settings → Environment Variables**. **Never commit these to the repository.**

### Backend Environment Variables

| Variable | Description | Example |
|---|---|---|
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/ngo-tracker` |
| `JWT_SECRET` | Secret key for JWT token signing | `your-very-strong-secret-key` |
| `JWT_EXPIRES_IN` | JWT token expiry duration | `7d` |
| `PAYHERE_MERCHANT_ID` | PayHere payment gateway merchant ID | `1234567` |
| `PAYHERE_MERCHANT_SECRET` | PayHere secret for hash verification | `XXXXXXXXXXXXXXXX` |
| `PAYHERE_MODE` | `sandbox` or `production` | `production` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your-api-secret` |
| `OPENROUTER_API_KEY` | OpenRouter API key for AI features | `sk-or-xxxxxxxx` |
| `FRONTEND_URL` | Deployed frontend URL | `https://trustfund.axisdatatech.com` |
| `BACKEND_URL` | Deployed backend URL | `https://trustfund.axisdatatech.com` |
| `PORT` | Server listening port | `3000` |
| `NODE_ENV` | Environment mode | `production` |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | `https://trustfund.axisdatatech.com` |

### Frontend Environment Variables

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `https://trustfund.axisdatatech.com` |
| `VITE_MAPBOX_TOKEN` | Mapbox GL JS public token | `pk.eyJ1Ijoixxxxxx` |

> ⚠️ **Never expose secrets in client-side code or `.env` files committed to git.**

---

## Step-by-Step Deployment Setup

### Prerequisites
- GitHub account with access to [https://github.com/SakithLiyanage/NGO-donation-tracker](https://github.com/SakithLiyanage/NGO-donation-tracker)
- DigitalOcean account
- MongoDB Atlas cluster running
- Cloudinary account
- PayHere merchant account

### Steps

#### 1. Fork / Clone the Repository
```bash
git clone https://github.com/SakithLiyanage/NGO-donation-tracker.git
cd NGO-donation-tracker
git checkout staging
```

#### 2. Create a DigitalOcean App
1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Click **"Create App"**
3. Select **GitHub** as the source
4. Choose the repository and set branch to `staging`

#### 3. Configure Backend Component
1. DigitalOcean will detect the `backend/` directory
2. Set **Source Directory** to `backend`
3. Set **Type** to `Web Service`
4. Set **Run Command** to `node server.js`
5. Set **HTTP Port** to `3000`
6. Add all backend environment variables listed above

#### 4. Configure Frontend Component
1. Add a second component and select the same repo
2. Set **Source Directory** to `frontend`
3. Set **Type** to `Static Site`
4. Set **Build Command** to `npm install && npm run build`
5. Set **Output Directory** to `dist`
6. Add frontend environment variables

#### 5. Configure Routing Rules
In the App settings under **Networking → Component Routing Rules**:
- `/api` → `ngo-donation-tracker-backend` (path trimmed)
- `/` → `ngo-donation-tracker-frontend` (path trimmed)

#### 6. Attach a Custom Domain (Optional)
1. Go to **Settings → Domains**
2. Add your domain (e.g., `trustfund.axisdatatech.com`)
3. Update your DNS records with the provided values
4. SSL/TLS is provisioned automatically by DigitalOcean (Let's Encrypt)

#### 7. Deploy
Click **"Deploy"** — DigitalOcean will build and launch both components.

---

## Live URLs

| Resource | URL |
|---|---|
| 🌐 **Frontend Application** | [https://trustfund.axisdatatech.com](https://trustfund.axisdatatech.com) |
| 🔌 **Backend REST API** | [https://trustfund.axisdatatech.com/api](https://trustfund.axisdatatech.com/api) |
| 🔵 **DigitalOcean Default URL** | [https://trustfund-qoxqw.ondigitalocean.app](https://trustfund-qoxqw.ondigitalocean.app) |

---

## Deployment Evidence (Screenshots)

### App Platform Overview
![App Platform Overview](./screenshots/app_overview.png)
*The DigitalOcean App Platform showing both the Web Service (backend) and Static Site (frontend) components running at $5.00/month.*

### Backend Component Settings
![Backend Component Settings](./screenshots/backend_settings.png)
*Backend component `ngo-donation-tracker-backend` configured as a Web Service with 512 MB RAM and 1 Shared vCPU.*

### Frontend Component Settings
![Frontend Component Settings](./screenshots/frontend_settings.png)
*Frontend component `ngo-donation-tracker-frontend` configured as a Static Site, sourcing from the `frontend/` directory on the `staging` branch.*

### Routing & Domain Configuration
![Routing Configuration](./screenshots/routing_config.png)
*Routing rules directing `/api` traffic to the backend and `/` traffic to the frontend, both under `trustfund.axisdatatech.com`.*

---

## Health Status

The application is **Healthy** as confirmed by DigitalOcean's monitoring dashboard:
- Status: 🟢 **Healthy**
- Organization: `Axis_Datatech`
- Region: `BLR1`
- Backend CPU usage: ~2%, RAM: ~20% (efficient resource utilization)

---

*TransFund © 2026 | Deployed on DigitalOcean App Platform*
