# 📖 TransFund API Documentation

This document provides a comprehensive overview of the TransFund RESTful API. 

## 🔐 Authentication
Most endpoints require a **JSON Web Token (JWT)**.
- **Header**: `Authorization: Bearer <your_token>`
- **Cookie**: The API also supports HTTP-only cookies for session management.

---

## 🏛️ 1. User & Auth Endpoints (`/api/users`)

### Register User
`POST /api/users/register`
- **Body**: `{ "name": "John Doe", "email": "john@example.com", "password": "password123", "role": "donor" }`
- **Roles**: `donor`, `ngo-admin`, `partner`, `admin`

### Login User
`POST /api/users/login`
- **Body**: `{ "email": "john@example.com", "password": "password123" }`
- **Response**: `{ "token": "...", "user": { ... } }`

---

## 📢 2. Campaign Endpoints (`/api/campaigns`)

### Create Campaign
`POST /api/campaigns`
- **Auth**: Required (`ngo-admin` or `admin`)
- **Body**: 
  ```json
  {
    "title": "Clean Water Initiative",
    "description": "Providing clean water to rural areas.",
    "goalAmount": 50000,
    "endDate": "2026-12-31",
    "category": "Health",
    "location": { "city": "Colombo", "country": "Sri Lanka" }
  }
  ```

### Get All Campaigns (Public)
`GET /api/campaigns`
- **Query Params**: `status`, `category`, `lat`, `lng`, `radius`

### Get Campaign Metrics
`GET /api/campaigns/:id/metrics`
- **Response**: Returns raised amount, goal, completion rate, and beneficiary count.

---

## 🛡️ 3. Donor Endpoints (`/api/donors`)

### Create Donor Profile
`POST /api/donors`
- **Auth**: Required (`donor`)
- **Body**: `{ "bio": "Passionate about education", "csrPreferences": { "sectors": ["Education"] } }`

### Create Pledge
`POST /api/donors/pledges`
- **Auth**: Required (`donor`)
- **Body**: `{ "campaignId": "...", "amount": 1000, "frequency": "monthly" }`

---

## 🤝 4. Corporate Partner Endpoints (`/api/partners`)

### Request Partnership
`POST /api/partners`
- **Auth**: Required (`partner`)
- **Body**: `{ "organizationName": "Global Corp", "businessRegNumber": "BR12345", "contactEmail": "csr@corp.com" }`

### Get Partner Impact
`GET /api/partners/:id/impact`
- **Response**: Aggregated impact data for a corporate partner.

---

## 💰 5. Finance & Transparency (`/api/finance` & `/api/public`)

### Process Payment (Webhook/Callback)
`POST /api/finance/payment/complete`
- **Auth**: Required (PayHere Secret)
- **Processes**: Updates campaign totals and donor analytics.

### Get Public Stats (Transparency Hub)
`GET /api/public/stats`
- **Response**: Total funds raised platform-wide, total donors, and active missions.

---

## 🤖 6. AI & Insights (`/api/ai`)

### Get Donor Insights
`GET /api/ai/donor-insights`
- **Auth**: Required (`donor`)
- **Feature**: Uses Gemini AI to predict donation trends and recommend NGOs.

### Analyze Campaign Health
`GET /api/ai/campaign-health/:id`
- **Auth**: Required (`ngo-admin`, `admin`)
- **Feature**: Provides sentiment analysis on campaign progress.

---

## 🛠️ Testing with Postman
1. Import the base URL: `http://localhost:3000`
2. Set Environment variable `token` after login.
3. Use `{{token}}` in the Authorization tab of subsequent requests.
