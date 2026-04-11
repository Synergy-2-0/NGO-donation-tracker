# NGO Donation Tracker API Endpoint Documentation

Complete reference for the backend API exposed by this project.

## Overview

- Base API path: `/api`
- Local development base URL: `http://localhost:3000/api`
- Authentication: JWT Bearer token for protected endpoints
- Content types:
  - `application/json` for normal JSON requests
  - `multipart/form-data` for upload endpoints

## Common Response Shapes

### Success
```json
{
  "success": true,
  "message": "Operation completed successfully"
}
```

### Validation Error
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "\"email\" must be a valid email"
    }
  ]
}
```

### Not Found / Unauthorized
```json
{
  "message": "Resource not found"
}
```

## Users (`/api/users`)

### Register user
- Method: `POST`
- Auth: None
- Request body: `application/json`
- Endpoint: `/api/users/register`
- Roles: donor, ngo-admin, partner, admin

Example request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "donor",
  "phone": "+94 77 123 4567",
  "city": "Colombo",
  "country": "Sri Lanka",
  "preferredCauses": ["education"],
  "bio": "Supporter of local education programs"
}
```

Example response:
```json
{
  "token": "...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "donor"
  }
}
```

### Login user
- Method: `POST`
- Auth: None
- Request body: `application/json`
- Endpoint: `/api/users/login`

Example request:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Example response:
```json
{
  "token": "...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "donor"
  }
}
```

### Google auth
- Method: `POST`
- Auth: None
- Request body: `application/json`
- Endpoint: `/api/users/google-auth`

Example request:
```json
{
  "credential": "google-id-token"
}
```

Example response:
```json
{
  "token": "...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "donor"
  },
  "isNewUser": false
}
```

### Update current password
- Method: `PATCH`
- Auth: Required
- Endpoint: `/api/users/me/password`

Example request:
```json
{
  "currentPassword": "password123",
  "newPassword": "newPassword456"
}
```

Example response:
```json
{
  "message": "Password updated successfully"
}
```

## Donors (`/api/donors`)

### Create donor profile
- Method: `POST`
- Auth: `donor`
- Endpoint: `/api/donors`

Example request:
```json
{
  "bio": "Supporter of education and health causes",
  "csrPreferences": {
    "sectors": ["Education", "Health"]
  }
}
```

Example response:
```json
{
  "_id": "...",
  "userId": "...",
  "bio": "Supporter of education and health causes"
}
```

### List donor records
- Method: `GET`
- Auth: `admin`, `ngo-admin`
- Endpoint: `/api/donors`

Example response:
```json
[
  {
    "_id": "...",
    "userId": "..."
  }
]
```

### Get donor profile
- Method: `GET`
- Auth: `donor`
- Endpoint: `/api/donors/me`

Example response:
```json
{
  "_id": "...",
  "userId": "..."
}
```

### Donor lookup and updates
- `GET /api/donors/:id`
- `PUT /api/donors/:id`
- `DELETE /api/donors/:id`

Example delete response:
```json
{
  "message": "Donor profile deactivated"
}
```

### Pledges
- `GET /api/donors/:id/pledges`
- `GET /api/donors/:id/pledges/:pledgeId`
- `POST /api/donors/:id/pledges`
- `PUT /api/donors/:id/pledges/:pledgeId`
- `DELETE /api/donors/:id/pledges/:pledgeId`

Example create request:
```json
{
  "campaignId": "...",
  "amount": 1000,
  "frequency": "monthly"
}
```

Example response:
```json
{
  "_id": "...",
  "campaignId": "...",
  "amount": 1000,
  "frequency": "monthly"
}
```

Delete response:
```json
{
  "message": "Pledge deleted successfully"
}
```

### Interactions
- `POST /api/donors/:id/interactions`
- `DELETE /api/donors/:id/interactions/:interactionId`

Example create request:
```json
{
  "type": "meeting",
  "notes": "Discussed corporate sponsorship options"
}
```

### Analytics
- `GET /api/donors/:id/analytics`
- `PATCH /api/donors/:id/analytics/recalculate`
- `GET /api/donors/analytics/segments`
- `GET /api/donors/pledges`
- `GET /api/donors/pledgers`

`GET /api/donors/:id/analytics` requires authentication. 
`GET /api/donors/analytics/segments`, `GET /api/donors/pledges`, `GET /api/donors/pledgers`, and `PATCH /api/donors/:id/analytics/recalculate` require `admin` or `ngo-admin`.

Example response:
```json
{
  "totalDonated": 12500,
  "pledgeCount": 4,
  "activePledges": 2
}
```

## Campaigns (`/api/campaigns`)

### Create campaign
- Method: `POST`
- Auth: `admin`, `ngo-admin`
- Request type: `multipart/form-data`
- Endpoint: `/api/campaigns`

Form fields:
- `title`
- `description`
- `goalAmount`
- `targetBeneficiaries`
- `endDate`
- `category`
- `location` as JSON string
- `sdgAlignment` as JSON string
- `allowPledges`
- `pledgeConfig` as JSON string
- `image` file upload

Example form-data fields:
```json
{
  "title": "Clean Water Initiative",
  "description": "Providing clean water to rural communities.",
  "goalAmount": 50000,
  "targetBeneficiaries": 1200,
  "endDate": "2026-12-31",
  "category": "Health",
  "location": "{\"city\":\"Colombo\",\"country\":\"Sri Lanka\"}",
  "sdgAlignment": "[6, 3]",
  "allowPledges": "true"
}
```

Example response:
```json
{
  "_id": "...",
  "title": "Clean Water Initiative",
  "status": "draft",
  "goalAmount": 50000,
  "image": "uploads/campaigns/water.jpg"
}
```

### List campaigns
- Method: `GET`
- Auth: Public
- Endpoint: `/api/campaigns`
- Query params may include `status`, `category`, `lat`, `lng`, `radius`

Example response:
```json
[
  {
    "_id": "...",
    "title": "Clean Water Initiative",
    "status": "active",
    "goalAmount": 50000,
    "raisedAmount": 12000
  }
]
```

### Campaign detail
- Method: `GET`
- Auth: Public
- Endpoint: `/api/campaigns/:id`

Example response:
```json
{
  "_id": "...",
  "title": "Clean Water Initiative",
  "description": "Providing clean water to rural communities.",
  "status": "active"
}
```

### Update campaign
- Method: `PUT`
- Auth: `admin`, `ngo-admin`
- Endpoint: `/api/campaigns/:id`
- Business rule: only draft campaigns can be updated

Example request:
```json
{
  "description": "Updated description",
  "goalAmount": 60000
}
```

Example response:
```json
{
  "_id": "...",
  "title": "Clean Water Initiative",
  "goalAmount": 60000
}
```

### Delete campaign
- Method: `DELETE`
- Auth: `admin`
- Endpoint: `/api/campaigns/:id`

Example response:
```json
{
  "message": "Campaign archived successfully"
}
```

### Publish campaign
- Method: `PUT`
- Auth: `admin`
- Endpoint: `/api/campaigns/:id/publish`
- Business rule: only draft campaigns can be published

Example response:
```json
{
  "_id": "...",
  "status": "active"
}
```

### Progress logs
- `POST /api/campaigns/:id/progress`
- `GET /api/campaigns/:id/progress`
- `PUT /api/campaigns/:id/progress/:progressId`
- `DELETE /api/campaigns/:id/progress/:progressId`

Create, update, and delete require authentication with `admin` or `ngo-admin`. Listing progress logs is public.

Example create request:
```json
{
  "title": "Well completed",
  "description": "A new well was completed in the target village.",
  "amountRaised": 5000,
  "beneficiaries": 300
}
```

The uploaded `evidence` files are attached as an array.

Example response:
```json
{
  "_id": "...",
  "campaign": "...",
  "title": "Well completed",
  "amountRaised": 5000,
  "beneficiaries": 300,
  "evidence": ["uploads/evidence/file1.jpg"]
}
```

Delete response:
```json
{
  "message": "Progress log deleted successfully"
}
```

### Reports
- `POST /api/campaigns/:id/report`
- `GET /api/campaigns/:id/report`
- `GET /api/campaigns/report/:reportId`

Creating reports requires authentication with `admin` or `ngo-admin`. 

Example report request:
```json
{
  "title": "Monthly impact report",
  "summary": "Progress against targets and expenditure breakdown.",
  "status": "draft"
}
```

Example response:
```json
{
  "_id": "...",
  "campaignId": "...",
  "title": "Monthly impact report"
}
```

## Partners (`/api/partners`)

### Create partnership
- Method: `POST`
- Auth: `partner`
- Request body: `application/json`
- Endpoint: `/api/partners`

Validated request fields:
- `organizationName`
- `organizationType`
- `industry`
- `companySize`
- `contactPerson`
- `address`
- `csrFocus`
- `sdgGoals`
- `partnershipPreferences`
- `capabilities`
- `verificationDocuments`
- `logoUrl`

Example request:
```json
{
  "organizationName": "Global Corp",
  "organizationType": "corporate",
  "industry": "Technology",
  "companySize": "enterprise",
  "contactPerson": {
    "name": "Jane Smith",
    "email": "csr@globalcorp.com",
    "phone": "+1 555 0100",
    "position": "CSR Manager"
  },
  "address": {
    "street": "123 Main Street",
    "city": "Colombo",
    "state": null,
    "country": "Sri Lanka",
    "postalCode": "00100"
  },
  "csrFocus": ["education", "health"],
  "partnershipPreferences": {
    "budgetRange": { "min": 10000, "max": 50000 },
    "partnershipTypes": ["financial"],
    "duration": "long-term"
  },
  "capabilities": {
    "financialCapacity": 250000,
    "skillsAvailable": ["technology", "marketing"]
  }
}
```

Example response:
```json
{
  "_id": "...",
  "organizationName": "Global Corp",
  "status": "active"
}
```

### List partners
- Method: `GET`
- Auth: Optional
- Endpoint: `/api/partners`

Example response:
```json
[
  {
    "_id": "...",
    "organizationName": "Global Corp"
  }
]
```

### Partner detail and impact
- `GET /api/partners/:id`
- `GET /api/partners/:id/impact`
- Auth: Optional

Example impact response:
```json
{
  "partnerId": "...",
  "totalContributed": 25000,
  "campaignCount": 4
}
```

### Get partner profile
- Method: `GET`
- Auth: Required
- Endpoint: `/api/partners/me/profile`

### Update partner
- Method: `PUT`
- Auth: Required
- Endpoint: `/api/partners/:id`

Example update request:
```json
{
  "companySize": "large",
  "status": "active"
}
```

### Approve partner
- Method: `PATCH`
- Auth: `admin`, `ngo-admin`
- Endpoint: `/api/partners/:id/approve`

### Delete partner
- Method: `DELETE`
- Auth: Required
- Endpoint: `/api/partners/:id`
- Response: `204 No Content`

## Agreements (`/api/agreements`)

All agreement routes require authentication.

### Create agreement
- Method: `POST`
- Auth: Required
- Endpoint: `/api/agreements`

Validated request fields:
- `partnerId`
- `campaignId`
- `title`
- `description`
- `agreementType`
- `startDate`
- `endDate`
- `totalValue`
- `terms`
- `documents`
- `initialMilestones`
- `milestones`

Example request:
```json
{
  "partnerId": "...",
  "campaignId": "...",
  "title": "Corporate Education Partnership",
  "agreementType": "financial",
  "startDate": "2026-01-01",
  "endDate": "2026-12-31",
  "totalValue": 25000,
  "terms": "Funds will be released in quarterly tranches.",
  "documents": [
    {
      "name": "Signed agreement",
      "url": "https://example.com/agreement.pdf"
    }
  ]
}
```

Example response:
```json
{
  "_id": "...",
  "title": "Corporate Education Partnership",
  "status": "draft"
}
```

### List and retrieve agreements
- `GET /api/agreements`
- `GET /api/agreements/:id`
- `GET /api/agreements/partner/:partnerId`
- `GET /api/agreements/campaign/:campaignId`

Example response:
```json
[
  {
    "_id": "...",
    "title": "Corporate Education Partnership",
    "status": "signed"
  }
]
```

### Update agreement status
- Method: `PATCH`
- Auth: Required
- Endpoint: `/api/agreements/:id/status`

Example request:
```json
{
  "status": "active"
}
```

### Approve / accept agreement
- `PATCH /api/agreements/:id/approve`
- `PATCH /api/agreements/:id/accept`
- Auth: Required

### Delete agreement
- Method: `DELETE`
- Auth: Required
- Endpoint: `/api/agreements/:id`

## Milestones (`/api/milestones`)

All milestone routes require authentication.

### Create milestone
- Method: `POST`
- Auth: `admin`, `ngo-admin`, `partner`
- Endpoint: `/api/milestones`

Validated request fields:
- `agreementId`
- `campaignId`
- `title`
- `description`
- `dueDate`
- `status`
- `budget`
- `amount`
- `completedAt`
- `evidence`

Example request:
```json
{
  "agreementId": "...",
  "campaignId": "...",
  "title": "Install water tanks",
  "dueDate": "2026-06-30",
  "status": "pending",
  "budget": 5000
}
```

Example response:
```json
{
  "_id": "...",
  "title": "Install water tanks",
  "status": "pending"
}
```

### Upload milestone evidence
- Method: `POST`
- Auth: Required
- Endpoint: `/api/milestones/upload-evidence`
- Request type: `multipart/form-data`
- Upload field name: `evidence`

Example response:
```json
{
  "url": "https://res.cloudinary.com/.../evidence.jpg"
}
```

### List, retrieve, update, delete milestones
- `GET /api/milestones`
- `GET /api/milestones/:id`
- `PUT /api/milestones/:id`
- `DELETE /api/milestones/:id`

Example response:
```json
[
  {
    "_id": "...",
    "title": "Install water tanks",
    "status": "completed"
  }
]
```

## Finance (`/api/finance`)

### PayHere initialize payment
- Method: `POST`
- Auth: Public
- Endpoint: `/api/finance/payhere/init`

Validated request fields:
- `donorId`
- `ngoId`
- `campaignId`
- `amount`
- `currency`
- `firstName`
- `lastName`
- `email`
- `phone`
- `address`
- `city`
- `country`
- `type`
- `frequency`

Example request:
```json
{
  "donorId": "...",
  "ngoId": "...",
  "campaignId": "...",
  "amount": 1000,
  "currency": "LKR",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+94 77 123 4567",
  "type": "one-time"
}
```

Example response:
```json
{
  "success": true,
  "message": "Payment initialized successfully",
  "paymentUrl": "https://www.payhere.lk/pay/...",
  "orderId": "ORD-123456"
}
```

### PayHere callback
- Method: `POST`
- Auth: Public callback endpoint
- Endpoint: `/api/finance/payhere/callback`

Example response:
```json
{
  "success": true,
  "message": "Payment callback processed successfully",
  "transactionId": "..."
}
```

### PayHere config
- Method: `GET`
- Auth: Public
- Endpoint: `/api/finance/payhere/config`

Example response:
```json
{
  "success": true,
  "config": {
    "merchantId": "...",
    "currency": "LKR"
  }
}
```

### PayHere verify
- Method: `POST`
- Auth: Required
- Endpoint: `/api/finance/payhere/verify/:transactionId`

Example response:
```json
{
  "success": true,
  "transaction": {
    "_id": "...",
    "status": "completed"
  }
}
```

### Transactions
- `POST /api/finance/transactions`
  - Auth: `system`, `admin`
- `GET /api/finance/transactions`
  - Auth: `admin`
  - Optional query: `orderId`
- `GET /api/finance/transactions/:id`
  - Auth: Required
- `GET /api/finance/transactions/ngo/:id`
  - Auth: `ngo-admin`, `admin`
- `GET /api/finance/transactions/donor/:id`
  - Auth: Required
- `GET /api/finance/transactions/campaign/:id`
  - Auth: Required
- `PUT /api/finance/transactions/:id`
  - Auth: `ngo-admin`, `admin`
- `DELETE /api/finance/transactions/:id`
  - Auth: `admin`

Example create request:
```json
{
  "donorId": "...",
  "ngoId": "...",
  "campaignId": "...",
  "amount": 1000,
  "currency": "LKR",
  "paymentMethod": "PayHere",
  "notes": "Monthly contribution"
}
```

Example response:
```json
{
  "_id": "...",
  "amount": 1000,
  "status": "completed"
}
```

### Financial summary
- Method: `GET`
- Auth: Required
- Endpoint: `/api/finance/summary/ngo/:id`

Example response:
```json
{
  "totalIncome": 125000,
  "totalExpense": 54000,
  "balance": 71000
}
```

### Fund allocations
- `POST /api/finance/allocations`
  - Auth: `ngo-admin`, `admin`
- `GET /api/finance/allocations`
  - Auth: `admin`
- `GET /api/finance/allocations/:id`
  - Auth: Required
- `GET /api/finance/allocations/ngo/:id`
  - Auth: `ngo-admin`, `admin`
- `GET /api/finance/allocations/transaction/:id`
  - Auth: Required
- `GET /api/finance/allocations/category/ngo/:id`
  - Auth: `ngo-admin`, `admin`
- `PUT /api/finance/allocations/:id`
  - Auth: `ngo-admin`, `admin`
- `DELETE /api/finance/allocations/:id`
  - Auth: `admin`


Validated request fields:
- `transactionId`
- `ngoId`
- `category`
- `amount`
- `description`

Example request:
```json
{
  "transactionId": "...",
  "ngoId": "...",
  "category": "education",
  "amount": 400,
  "description": "School materials for two classrooms"
}
```

Example response:
```json
{
  "_id": "...",
  "category": "education",
  "amount": 400
}
```

### Trust score and transparency
- `GET /api/finance/trust-score/:ngoId`
- `GET /api/finance/transparency-report/:ngoId`
- `POST /api/finance/trust-score/compare`
- Auth: Public

Example trust score response:
```json
{
  "success": true,
  "data": {
    "trustScore": 84
  }
}
```

Example compare request:
```json
{
  "ngoIds": ["...", "..."]
}
```

Example compare response:
```json
{
  "success": true,
  "data": [
    {
      "ngoId": "...",
      "trustScore": 84
    }
  ]
}
```

### Audit logs
- `GET /api/finance/audits`
- `GET /api/finance/audits/:id`
- `GET /api/finance/audits/entity/:id`
- `GET /api/finance/audits/type/:type`
- `GET /api/finance/audits/user/:id`
- `GET /api/finance/audits/date-range`
- `DELETE /api/finance/audits/:id`
- Auth: `admin`

## Public transparency (`/api/public`)

### Dashboard and public metrics
- `GET /api/public/partnerships`
- `GET /api/public/agreements/:partnerId`
- `GET /api/public/impact-metrics`
- `GET /api/public/donor-stats`
- `GET /api/public/map-data`
- `GET /api/public/campaign-partners/:campaignId`
- Auth: Public

Example response:
```json
{
  "partnerships": 12,
  "impactMetrics": {
    "totalRaised": 250000,
    "activeCampaigns": 8
  },
  "leaderboard": []
}
```

## Geo (`/api/geo`)

### Partners geo search
- Method: `GET`
- Auth: Public
- Endpoint: `/api/geo/partners`
- Query params: provide either `lat`/`lng` together, or `city`/`state`
- Optional query param: `radius`

Example request:
`/api/geo/partners?lat=6.9271&lng=79.8612&radius=25`

Example response:
```json
[
  {
    "_id": "...",
    "organizationName": "Global Corp",
    "coordinates": [79.8612, 6.9271]
  }
]
```

## NGOs (`/api/ngos` and `/api/ngos/finance`)

### Upload NGO logo / document
- `POST /api/ngos/upload-logo`
- `POST /api/ngos/upload-document`
- Auth: Required
- Request type: `multipart/form-data`
- Upload fields: `logo`, `document`

Example response:
```json
{
  "url": "https://res.cloudinary.com/.../ngo-logo.png"
}
```

### Public NGO list
- Method: `GET`
- Auth: Public
- Endpoint: `/api/ngos/public`

### Register NGO profile
- Method: `POST`
- Auth: Required
- Endpoint: `/api/ngos/register`

Example request:
```json
{
  "name": "Helping Hands",
  "registrationNumber": "NGO-001",
  "country": "Sri Lanka",
  "mission": "Improve access to education and health services"
}
```

Example response:
```json
{
  "_id": "...",
  "name": "Helping Hands",
  "status": "pending"
}
```

### NGO profile
- `GET /api/ngos/profile`
- `PATCH /api/ngos/profile`
- Auth: Required

Example response:
```json
{
  "_id": "...",
  "name": "Helping Hands",
  "status": "approved"
}
```

### Admin NGO management
- `GET /api/ngos`
- `GET /api/ngos/all`
- `PATCH /api/ngos/:id/approve`
- `PATCH /api/ngos/:id/reject`
- Auth: `admin`

### NGO trust score
- Method: `GET`
- Auth: Public
- Endpoint: `/api/ngos/:id/trust-score`

Example response:
```json
{
  "trustScore": 92
}
```

### NGO finance dashboard
- `GET /api/ngos/finance/ledger`
- `POST /api/ngos/finance/allocate`
- `GET /api/ngos/finance/metrics`
- Auth: `ngo-admin`

Example metrics response:
```json
{
  "trustScore": 92,
  "status": "approved",
  "activeProjects": 3,
  "totalRaised": 125000,
  "availableFunds": 118750,
  "pendingApprovals": 1
}
```

## Postman Setup

1. Use `http://localhost:3000/api` as the base URL.
2. Log in and save the returned `token`.
3. Send `Authorization: Bearer {{token}}` for protected routes.
4. Use `multipart/form-data` for file upload routes.
