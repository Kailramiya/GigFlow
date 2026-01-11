# ServiceHive - Backend API

A full-featured Express.js API for a freelance gig marketplace platform with real-time notifications using Socket.io.

## Features

- **User Authentication**: JWT-based auth with HttpOnly cookies
- **Gig Management**: Create, read, update, delete gigs with status tracking
- **Bidding System**: Freelancers can bid on gigs with duplicate prevention
- **Atomic Hiring**: MongoDB transactions ensure only one bid is hired per gig
- **Real-time Notifications**: Socket.io integration for instant hiring alerts
- **Security**: CORS, password hashing with bcrypt, CSRF protection

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcryptjs
- **Real-time**: Socket.io
- **Middleware**: CORS, Cookie-parser, Body-parser

## Project Structure

```
backend/
├── src/
│   ├── app.js                 # Express app setup
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js # Auth logic
│   │   ├── gig.controller.js  # Gig CRUD
│   │   └── bid.controller.js  # Bid logic with atomic hire
│   ├── middleware/
│   │   └── auth.middleware.js # JWT protection
│   ├── models/
│   │   ├── User.js           # User schema with password hashing
│   │   ├── Gig.js            # Gig schema with enums
│   │   └── Bid.js            # Bid schema with unique constraint
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── gig.routes.js
│   │   └── bid.routes.js
│   └── socket/
│       └── socketHandlers.js  # Real-time event handlers
├── server.js                  # Entry point with Socket.io setup
├── package.json
├── .env.example
└── .gitignore
```

## Installation

### Prerequisites
- Node.js 16+
- MongoDB (local or cloud)

### Setup

1. **Clone and install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Create `.env` file** from `.env.example`
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   CLIENT_URL=http://localhost:3000
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Or production:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout (protected)
- `GET /api/auth/me` - Get current user (protected)

### Gigs
- `GET /api/gigs` - Get all open gigs (pagination, search)
- `GET /api/gigs/:id` - Get gig details
- `POST /api/gigs` - Create gig (protected)
- `GET /api/gigs/user/my-gigs` - Get user's gigs (protected)
- `PUT /api/gigs/:id` - Update gig (protected, owner only)
- `DELETE /api/gigs/:id` - Delete gig (protected, owner only)

### Bids
- `POST /api/bids` - Submit bid (protected)
- `GET /api/bids/my-bids` - Get user's bids (protected)
- `GET /api/bids/gig/:gigId` - Get gig's bids (protected, owner only)
- `GET /api/bids/:id` - Get bid details (protected)
- `POST /api/bids/:id/hire` - Accept bid & hire freelancer (protected, owner only, atomic)
- `PUT /api/bids/:id` - Update bid status (protected)
- `DELETE /api/bids/:id` - Delete bid (protected, owner only)

### Health
- `GET /health` - Health check

## Key Features

### Atomic Hiring with Transactions
The `/api/bids/:id/hire` endpoint uses MongoDB transactions to ensure:
- Only one bid per gig is accepted
- All other pending bids are rejected
- Gig status updates to "in-progress"
- All operations succeed or fail together

### Real-time Notifications
When a freelancer is hired:
1. Backend emits `bid_accepted` event via Socket.io
2. Freelancer receives instant notification if connected
3. Frontend shows toast notification

### Security
- Passwords hashed with bcrypt (10 salt rounds)
- JWT stored in HttpOnly cookies (XSS protection)
- CSRF protection with sameSite: strict
- Unique email constraint at database level
- Duplicate bid prevention with compound index

## Testing

```bash
# Health check
curl http://localhost:5000/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | development |
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | localhost |
| `CLIENT_URL` | Frontend URL for CORS | http://localhost:3000 |
| `JWT_SECRET` | JWT signing key | your_jwt_secret_key_here |

## Error Handling

All endpoints return standardized JSON responses:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Details (dev only)"
}
```

## Database Indexes

Optimized queries with indexes:
- Users: unique email
- Gigs: (ownerId, status), (status, createdAt)
- Bids: (gigId, status), (freelancerId, status), (gigId, freelancerId) unique

## Dependencies

- `express@^5.2.1` - Web framework
- `mongoose@^9.1.2` - MongoDB ODM
- `jsonwebtoken@^9.0.3` - JWT auth
- `bcryptjs@^3.0.3` - Password hashing
- `cors@^2.8.5` - CORS middleware
- `cookie-parser@^1.4.7` - Cookie parsing
- `dotenv@^17.2.3` - Environment variables
- `socket.io@^4.7.2` - Real-time communication

## License

ISC
