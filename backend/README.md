# NGO Donation Tracker - Backend API

RESTful API for managing NGO donations, campaigns, partnerships, and financial transparency.

## Technology Stack
- **Runtime**: Node.js (ESM modules)
- **Framework**: Express.js v5
- **Database**: MongoDB with Mongoose v9
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Joi
- **File Upload**: Multer + Cloudinary (multer-storage-cloudinary)
- **Email**: Nodemailer / SendGrid (@sendgrid/mail, sib-api-v3-sdk)
- **HTTP Client**: Axios
- **Password Hashing**: bcryptjs
- **Third-party APIs**: PayHere (Payment Gateway), Cloudinary (File Storage)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/ngo-donation-tracker
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SENDGRID_API_KEY=your_sendgrid_key
PAYHERE_MERCHANT_ID=your_merchant_id
PAYHERE_MERCHANT_SECRET=your_merchant_secret
```

3. Run:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### User Management
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/users/register` | No | - | Register user |
| POST | `/api/users/login` | No | - | Login |
| GET | `/api/users` | Yes | admin | Get all users |
| PUT | `/api/users/:id` | Yes | admin | Update user |
| DELETE | `/api/users/:id` | Yes | admin | Deactivate user |

### Campaign Management
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/campaigns` | Yes | admin, ngo-admin | Create campaign (draft) |
| GET | `/api/campaigns` | No | - | Get all campaigns |
| GET | `/api/campaigns/:id` | No | - | Get campaign by ID |
| PUT | `/api/campaigns/:id` | Yes | admin, ngo-admin | Update campaign |
| DELETE | `/api/campaigns/:id` | Yes | admin, ngo-admin | Delete campaign |
| PUT | `/api/campaigns/:id/publish` | Yes | admin, ngo-admin | Publish campaign |
| POST | `/api/campaigns/:id/progress` | Yes | admin, ngo-admin | Add progress log (with evidence images) |
| GET | `/api/campaigns/:id/progress` | No | - | Get all progress logs |
| PUT | `/api/campaigns/:id/progress/:progressId` | Yes | admin, ngo-admin | Update progress log |
| DELETE | `/api/campaigns/:id/progress/:progressId` | Yes | admin, ngo-admin | Delete progress log |
| POST | `/api/campaigns/:id/report` | Yes | admin, ngo-admin | Create final campaign report |
| GET | `/api/campaigns/:id/report` | No | - | Get report by campaign |
| GET | `/api/campaigns/report/:reportId` | No | - | Get report by ID |
| GET | `/api/campaigns/:id/metrics` | No | - | Get campaign metrics |

### Finance Management
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/finance/payhere/init` | No | - | Initialize PayHere payment |
| POST | `/api/finance/payhere/callback` | No | - | PayHere payment callback |
| GET | `/api/finance/payhere/config` | No | - | Get PayHere config |
| POST | `/api/finance/transactions` | Yes | system, admin | Create transaction |
| GET | `/api/finance/transactions` | Yes | admin | Get all transactions |
| GET | `/api/finance/transactions/:id` | Yes | - | Get transaction by ID |
| GET | `/api/finance/transactions/ngo/:id` | Yes | ngo-admin, admin | Get NGO transactions |
| GET | `/api/finance/transactions/donor/:id` | Yes | - | Get donor transactions |
| GET | `/api/finance/transactions/campaign/:id` | Yes | - | Get campaign transactions |
| PUT | `/api/finance/transactions/:id` | Yes | ngo-admin, admin | Update transaction |
| DELETE | `/api/finance/transactions/:id` | Yes | admin | Archive transaction |
| GET | `/api/finance/summary/ngo/:id` | Yes | - | Get financial summary |
| POST | `/api/finance/allocations` | Yes | ngo-admin, admin | Create fund allocation |
| GET | `/api/finance/allocations` | Yes | admin | Get all allocations |
| GET | `/api/finance/allocations/:id` | Yes | - | Get allocation by ID |
| GET | `/api/finance/allocations/ngo/:id` | Yes | ngo-admin, admin | Get NGO allocations |
| PUT | `/api/finance/allocations/:id` | Yes | ngo-admin, admin | Update allocation |
| DELETE | `/api/finance/allocations/:id` | Yes | admin | Delete allocation |
| GET | `/api/finance/trust-score/:ngoId` | No | - | Get NGO trust score |
| GET | `/api/finance/transparency-report/:ngoId` | No | - | Get transparency report |
| POST | `/api/finance/trust-score/compare` | No | - | Compare NGO trust scores |
| GET | `/api/finance/audits` | Yes | admin | Get audit logs |

### Partnership Management
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/partners` | Yes | partner | Create partnership |
| GET | `/api/partners` | Yes | - | Get all partners |
| GET | `/api/partners/:id` | Yes | - | Get partner by ID |
| PUT | `/api/partners/:id` | Yes | - | Update partner |
| PATCH | `/api/partners/:id/approve` | Yes | admin | Approve partner |
| DELETE | `/api/partners/:id` | Yes | - | Delete partner |

### Donor Management
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/donors` | Yes | donor | Create donor profile |
| GET | `/api/donors` | Yes | admin, ngo-admin | Get all donors |
| GET | `/api/donors/pledgers` | Yes | admin, ngo-admin | Get all pledgers |
| GET | `/api/donors/pledges` | Yes | admin, ngo-admin | Get all pledges |
| GET | `/api/donors/me` | Yes | donor | Get own donor profile |
| GET | `/api/donors/analytics/segments` | Yes | admin, ngo-admin | Get donor segment analytics |
| GET | `/api/donors/:id` | Yes | - | Get donor by ID |
| PUT | `/api/donors/:id` | Yes | - | Update donor |
| DELETE | `/api/donors/:id` | Yes | admin | Delete donor |
| GET | `/api/donors/:id/pledges` | Yes | - | Get donor pledges |
| GET | `/api/donors/:id/pledges/:pledgeId` | Yes | - | Get pledge by ID |
| POST | `/api/donors/:id/pledges` | Yes | - | Create pledge |
| PUT | `/api/donors/:id/pledges/:pledgeId` | Yes | - | Update pledge |
| DELETE | `/api/donors/:id/pledges/:pledgeId` | Yes | - | Delete pledge |
| POST | `/api/donors/:id/interactions` | Yes | admin, ngo-admin | Create donor interaction |
| DELETE | `/api/donors/:id/interactions/:interactionId` | Yes | admin | Delete interaction |
| GET | `/api/donors/:id/analytics` | Yes | - | Get donor analytics |
| PATCH | `/api/donors/:id/analytics/recalculate` | Yes | admin, ngo-admin | Recalculate donor analytics |

### Agreement Management
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/agreements` | Yes | admin, partner | Create agreement |
| GET | `/api/agreements` | Yes | - | Get all agreements |
| GET | `/api/agreements/partner/:partnerId` | Yes | - | Get agreements by partner |
| GET | `/api/agreements/:id` | Yes | - | Get agreement by ID |
| PUT | `/api/agreements/:id` | Yes | - | Update agreement |
| PATCH | `/api/agreements/:id/status` | Yes | - | Update agreement status |
| DELETE | `/api/agreements/:id` | Yes | - | Delete agreement |

### Milestone Management
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/milestones` | Yes | - | Create milestone |
| GET | `/api/milestones` | Yes | - | Get all milestones |
| GET | `/api/milestones/:id` | Yes | - | Get milestone by ID |
| PUT | `/api/milestones/:id` | Yes | - | Update milestone |
| DELETE | `/api/milestones/:id` | Yes | - | Delete milestone |

## Authentication

Protected routes require a JWT Bearer token:
```
Authorization: Bearer <token>
```

**Roles**: `admin`, `ngo-admin`, `partner`, `donor`

## Request Examples

**Register:**
```json
POST /api/users/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "donor"
}
```

**Create Campaign:**
```json
POST /api/campaigns
Authorization: Bearer <token>
{
  "title": "Clean Water Initiative",
  "description": "Providing clean water",
  "goalAmount": 50000,
  "startDate": "2024-02-01",
  "endDate": "2024-12-31"
}
```

**Initialize Payment:**
```json
POST /api/finance/payhere/init
{
  "amount": 1000,
  "campaignId": "65f1a2b3c4d5e6f7g8h9i0j2",
  "donorId": "65f1a2b3c4d5e6f7g8h9i0j1",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+94771234567"
}
```

**Create Pledge:**
```json
POST /api/donors/:id/pledges
Authorization: Bearer <token>
{
  "amount": 500,
  "frequency": "monthly",
  "campaignId": "65f1a2b3c4d5e6f7g8h9i0j2",
  "startDate": "2026-03-01"
}
```

## Project Structure

```
backend/
├── server.js
└── src/
    ├── config/          # DB and Cloudinary configuration
    ├── controllers/     # Route handler logic
    ├── middlewares/     # Auth, role, and upload middlewares
    ├── models/          # Mongoose schemas
    ├── repository/      # Database query layer
    ├── routes/          # Express route definitions
    ├── services/        # Business logic layer
    ├── utils/           # Utility helpers (email, etc.)
    └── validators/      # Joi request validation schemas
```

**Hosted URL**:
```
http://44.192.7.89:3000/
```
