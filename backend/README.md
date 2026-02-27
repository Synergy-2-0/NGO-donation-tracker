# NGO Donation Tracker - Backend API

RESTful API for managing NGO donations, campaigns, partnerships, and financial transparency.

## Technology Stack
- **Framework**: Express.js (Node.js)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Validation**: Joi
- **Third-party APIs**: PayHere (Payment Gateway), Cloudinary (File Storage), SendGrid (Email)

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
npm run dev
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
| POST | `/api/campaigns` | Yes | admin, ngo-admin | Create campaign |
| GET | `/api/campaigns` | No | - | Get campaigns |
| GET | `/api/campaigns/:id` | No | - | Get campaign |
| PUT | `/api/campaigns/:id` | Yes | admin, ngo-admin | Update campaign |
| DELETE | `/api/campaigns/:id` | Yes | admin, ngo-admin | Delete campaign |
| PUT | `/api/campaigns/:id/publish` | Yes | admin, ngo-admin | Publish campaign |
| POST | `/api/campaigns/:id/progress` | Yes | admin, ngo-admin | Add progress |
| GET | `/api/campaigns/:id/progress` | No | - | Get progress |
| PUT | `/api/campaigns/:id/progress/:progressId` | Yes | admin, ngo-admin | Update progress |
| DELETE | `/api/campaigns/:id/progress/:progressId` | Yes | admin, ngo-admin | Delete progress |
| POST | `/api/campaigns/:id/report` | Yes | admin, ngo-admin | Create report |
| GET | `/api/campaigns/:id/report` | No | - | Get report |
| GET | `/api/campaigns/:id/metrics` | No | - | Get metrics |

### Finance Management
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/finance/payhere/init` | No | - | Initialize payment |
| POST | `/api/finance/payhere/callback` | No | - | Payment callback |
| GET | `/api/finance/payhere/config` | No | - | Get config |
| POST | `/api/finance/transactions` | Yes | system, admin | Create transaction |
| GET | `/api/finance/transactions` | Yes | admin | Get transactions |
| GET | `/api/finance/transactions/:id` | Yes | - | Get transaction |
| GET | `/api/finance/transactions/ngo/:id` | Yes | ngo-admin, admin | NGO transactions |
| GET | `/api/finance/transactions/donor/:id` | Yes | - | Donor transactions |
| GET | `/api/finance/transactions/campaign/:id` | Yes | - | Campaign transactions |
| PUT | `/api/finance/transactions/:id` | Yes | ngo-admin, admin | Update transaction |
| DELETE | `/api/finance/transactions/:id` | Yes | admin | Archive transaction |
| GET | `/api/finance/summary/ngo/:id` | Yes | - | Financial summary |
| POST | `/api/finance/allocations` | Yes | ngo-admin, admin | Create allocation |
| GET | `/api/finance/allocations` | Yes | admin | Get allocations |
| GET | `/api/finance/allocations/:id` | Yes | - | Get allocation |
| GET | `/api/finance/allocations/ngo/:id` | Yes | ngo-admin, admin | NGO allocations |
| PUT | `/api/finance/allocations/:id` | Yes | ngo-admin, admin | Update allocation |
| DELETE | `/api/finance/allocations/:id` | Yes | admin | Delete allocation |
| GET | `/api/finance/trust-score/:ngoId` | No | - | Get trust score |
| GET | `/api/finance/transparency-report/:ngoId` | No | - | Transparency report |
| POST | `/api/finance/trust-score/compare` | No | - | Compare scores |
| GET | `/api/finance/audits` | Yes | admin | Get audit logs |

### Partnership Management
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/partners` | Yes | partner | Create partnership |
| GET | `/api/partners` | Yes | - | Get partners |
| GET | `/api/partners/:id` | Yes | - | Get partner |
| PUT | `/api/partners/:id` | Yes | - | Update partner |
| PATCH | `/api/partners/:id/approve` | Yes | admin | Approve partner |
| DELETE | `/api/partners/:id` | Yes | - | Delete partner |

### Donor Management
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/donors` | Yes | - | Create donor |
| GET | `/api/donors` | Yes | admin | Get donors |
| GET | `/api/donors/:id` | Yes | - | Get donor |
| PUT | `/api/donors/:id` | Yes | - | Update donor |

### Agreement Management
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/agreements` | Yes | admin, ngo-admin | Create agreement |
| GET | `/api/agreements` | Yes | - | Get agreements |
| GET | `/api/agreements/:id` | Yes | - | Get agreement |
| PUT | `/api/agreements/:id` | Yes | admin, ngo-admin | Update agreement |

### Milestone Management
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/milestones` | Yes | admin, ngo-admin | Create milestone |
| GET | `/api/milestones` | Yes | - | Get milestones |
| GET | `/api/milestones/:id` | Yes | - | Get milestone |
| PUT | `/api/milestones/:id` | Yes | admin, ngo-admin | Update milestone |

## Authentication

Protected routes require JWT token:
```
Authorization: Bearer <token>
```

**Roles**: admin, ngo-admin, partner, donor

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
**Hosted URL**: 
```
http://44.192.7.89:3000/
```

Current status: 80% completed
