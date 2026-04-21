# GolfHero — Full Stack Application

> Play. Win. Give. — A subscription-based golf score tracking, monthly draw, and charity platform.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite + Bootstrap 5 |
| Backend | Node.js + Express |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT (stateless) |
| Payments | Razorpay |
| Cache | Redis (Upstash) |
| Email | Bervo (Gmail) |
| Deployment | Vercel (frontend) · Render (backend) |

---

## Project Structure

```
golfhero/
├── backend/
│   ├── config/          # DB + Redis
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth + error handler
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── services/        # Draw engine + email
│   ├── server.js
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/  # Navbar, Footer, Layouts
    │   ├── context/     # AuthContext
    │   ├── hooks/       # useRazorpay
    │   ├── pages/       # All pages (public + user + admin)
    │   └── services/    # Axios instance
    ├── index.html
    └── .env
```

---

## Local Setup

### 1. Backend

```bash
cd backend
npm install
```

Fill in `backend/.env`:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/golfhero

JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret

UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=noreply@golfhero.com

FRONTEND_URL=http://localhost:5173

MONTHLY_PLAN_AMOUNT=999
YEARLY_PLAN_AMOUNT=9999
CHARITY_MIN_PERCENTAGE=10
```

```bash
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
```

Fill in `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

```bash
npm run dev
```

---

## Create Admin User

There is no admin signup UI. After registering a user normally, update their role in MongoDB Atlas:

```js
db.users.updateOne({ email: "admin@yourdomain.com" }, { $set: { role: "admin" } })
```

---

## Deployment

### Backend → Render

1. Push `backend/` to a GitHub repo
2. Create a new **Web Service** on Render
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all env variables from `.env` in Render's environment settings

### Frontend → Vercel

1. Push `frontend/` to a GitHub repo
2. Import into Vercel
3. Framework preset: **Vite**
4. Add env variables:
   - `VITE_API_URL` → your Render backend URL + `/api`
   - `VITE_RAZORPAY_KEY_ID` → your Razorpay key

---

## API Routes

### Auth
| Method | Route | Access |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Private |
| PUT | /api/auth/profile | Private |
| PUT | /api/auth/password | Private |

### Scores
| Method | Route | Access |
|---|---|---|
| GET | /api/scores | Subscribed |
| POST | /api/scores | Subscribed |
| PUT | /api/scores/:id | Subscribed |
| DELETE | /api/scores/:id | Subscribed |

### Payments
| Method | Route | Access |
|---|---|---|
| POST | /api/payments/order | Private |
| POST | /api/payments/verify | Private |
| GET | /api/payments/history | Private |

### Charities
| Method | Route | Access |
|---|---|---|
| GET | /api/charities | Public |
| GET | /api/charities/:id | Public |
| POST | /api/charities/select | Private |
| POST | /api/charities | Admin |
| PUT | /api/charities/:id | Admin |
| DELETE | /api/charities/:id | Admin |

### Draws
| Method | Route | Access |
|---|---|---|
| GET | /api/draws | Public |
| GET | /api/draws/current | Public |
| GET | /api/draws/my-history | Private |
| POST | /api/draws/proof | Private |
| POST | /api/draws/configure | Admin |
| POST | /api/draws/:id/simulate | Admin |
| POST | /api/draws/:id/publish | Admin |
| POST | /api/draws/verify-winner | Admin |
| POST | /api/draws/mark-paid | Admin |

### Admin
| Method | Route | Access |
|---|---|---|
| GET | /api/admin/stats | Admin |
| GET | /api/admin/users | Admin |
| PUT | /api/admin/users/:id | Admin |
| GET | /api/admin/payments | Admin |

---

## Draw Logic

- **Random**: 5 unique numbers drawn from 1–45 using `Math.random()`
- **Algorithmic**: Weighted draw based on least-frequent scores across all active subscribers
- **Prize split**: 40% jackpot / 35% four-match / 25% three-match
- **Jackpot rollover**: If no 5-match winner, jackpot carries to next month
- **Multiple winners**: Prize pool split equally between all winners in the same tier

---

## Score Rules

- Format: Stableford (1–45)
- Max 5 scores stored at once
- One score per date (duplicates rejected)
- New score replaces oldest when at capacity
- Displayed in reverse chronological order

---

## Redis Caching

| Key | TTL | Data |
|---|---|---|
| `user:{id}` | 5 min | Authenticated user object |
| `charities:{search}:{cat}` | 10 min | Charity listing |
| `charity:{id}` | 10 min | Single charity |
| `draws:published` | 10 min | Published draws list |
| `admin:stats` | 2 min | Dashboard stats |

Cache is invalidated on write operations automatically.
