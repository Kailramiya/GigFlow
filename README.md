# ServiceHive - Freelance Gig Marketplace

A full-stack application for freelancers and gig creators to post, discover, and bid on projects with real-time notifications.

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure MONGODB_URI in .env
npm run dev
# Server runs on http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
# App runs on http://localhost:3000
```

## 📋 Project Overview

### Architecture

```
┌─────────────────────────────────────────────────────┐
│            React Frontend (Vite)                    │
│    Redux, Axios, Socket.io-client, React Router    │
└────────────┬────────────────────────────────────────┘
             │
    ┌────────┴────────┐
    │ HTTP/REST API   │ Socket.io (Real-time)
    │                 │
┌───▼─────────────────▼──────────────────────────────┐
│         Express.js Backend (Node.js)                │
│  Controllers, Middleware, Routes, Socket.io        │
└────────────┬──────────────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼─────────────────▼──────────────────────────────┐
│      MongoDB (Mongoose ODM)                         │
│  Users, Gigs, Bids collections with indexes         │
└─────────────────────────────────────────────────────┘
```

### Database Schema

**Users**
- `_id`: ObjectId (primary key)
- `name`: String (required)
- `email`: String (unique, required)
- `password`: String (hashed, required)
- `createdAt`, `updatedAt`: Timestamps

**Gigs**
- `_id`: ObjectId
- `title`: String (required, max 100 chars)
- `description`: String (required)
- `budget`: Number (required, >= 0)
- `ownerId`: Reference to User (required)
- `status`: Enum [open, in-progress, completed, cancelled]
- `createdAt`, `updatedAt`: Timestamps
- **Indexes**: (ownerId, status), (status, createdAt)

**Bids**
- `_id`: ObjectId
- `gigId`: Reference to Gig (required)
- `freelancerId`: Reference to User (required)
- `message`: String (required)
- `price`: Number (required, >= 0)
- `status`: Enum [pending, accepted, rejected, withdrawn]
- `createdAt`, `updatedAt`: Timestamps
- **Indexes**: (gigId, status), (freelancerId, status), (gigId, freelancerId) **unique**

## 🔐 Security Features

✅ **Authentication & Authorization**
- JWT-based authentication
- HttpOnly cookies (secure, XSS protection)
- CSRF protection (sameSite: strict)
- Protected routes with middleware
- Password hashing with bcrypt (10 salt rounds)

✅ **Data Validation**
- Server-side input validation
- Email format validation
- Schema validation with Mongoose
- Type checking in Redux thunks

✅ **Database Security**
- Unique constraints (email, compound bid index)
- Selective field projection (password not returned)
- MongoDB transactions for atomic operations
- Proper error handling without exposing internals

✅ **API Security**
- CORS with credentials
- Input sanitization
- Error boundaries
- Rate limiting ready (can be added)

## 💾 Atomic Transactions

The hiring logic uses MongoDB transactions to ensure:

```javascript
// All operations succeed together or fail together
1. Accept selected bid
2. Reject all other pending bids for the gig
3. Update gig status to "in-progress"

// Prevents race conditions:
- Only one bid hired per gig
- No duplicate hiring even under concurrent requests
- All changes rollback on any failure
```

## 🔔 Real-time Features

**Socket.io Integration:**
1. Frontend connects when user logs in
2. Registers user ID with socket server
3. Backend emits `bid_accepted` when freelancer is hired
4. Frontend receives event and shows toast notification
5. Auto-reconnect with exponential backoff

## 📁 File Organization

**Backend**
```
backend/
├── src/
│   ├── app.js                    # Express app
│   ├── config/db.js              # MongoDB connection
│   ├── controllers/               # Business logic
│   ├── middleware/               # Auth & error handling
│   ├── models/                   # Mongoose schemas
│   ├── routes/                   # API endpoints
│   └── socket/                   # Real-time handlers
├── server.js                     # Entry point with Socket.io
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

**Frontend**
```
frontend/
├── src/
│   ├── App.jsx                   # Main component
│   ├── main.jsx                  # Entry point
│   ├── components/               # Reusable UI components
│   ├── pages/                    # Page components
│   ├── services/                 # API & Socket services
│   ├── store/                    # Redux store & slices
│   └── index.html
├── vite.config.js
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 🔄 User Flows

### Registration & Login Flow
```
1. User clicks "Login" button
2. Enters email/password (or new user data)
3. Frontend sends POST to /api/auth/register or /api/auth/login
4. Backend validates, hashes password, generates JWT
5. JWT set in HttpOnly cookie
6. Frontend stores user in Redux
7. Socket.io connection established
8. Redirected to home page
```

### Posting a Gig
```
1. Logged-in user goes to Dashboard
2. Clicks "+ Create New Gig"
3. Fills title, description, budget
4. POST to /api/gigs
5. New gig appears in "My Gigs" list
6. Gig is listed on gig feed (status: open)
```

### Finding & Bidding
```
1. User browses gig feed (home page)
2. Searches by title or paginates
3. Clicks gig to see details
4. Clicks "Submit Bid"
5. Enters message & price
6. POST to /api/bids
7. Duplicate bids prevented by database
8. Bid appears in user's "My Bids"
```

### Hiring Freelancer
```
1. Gig owner goes to Dashboard
2. Clicks "Bids" on their gig
3. Sees all pending bids (owner only)
4. Clicks "Hire" next to selected bid
5. MongoDB transaction starts
6. Bid accepted, others rejected, gig updated
7. Socket.io emits bid_accepted to freelancer
8. Freelancer sees toast notification in real-time
```

## 🧪 Testing Workflow

### 1. Register Two Users
```bash
# User 1: Gig Creator
POST /api/auth/register
{ "name": "Alice", "email": "alice@test.com", "password": "pass123" }

# User 2: Freelancer
POST /api/auth/register
{ "name": "Bob", "email": "bob@test.com", "password": "pass123" }
```

### 2. Create a Gig (as Alice)
```bash
POST /api/gigs
{ "title": "Build Website", "description": "Need a responsive website", "budget": 500 }
```

### 3. Submit Bids (as Bob)
```bash
POST /api/bids
{ "gigId": "GIG_ID", "message": "I can do it!", "price": 400 }
```

### 4. Hire Freelancer (as Alice)
```bash
POST /api/bids/BID_ID/hire
```

### 5. See Real-time Notification (as Bob)
- If Bob is connected via Socket.io, he'll see the notification instantly!

## 📊 Database Queries (Example)

```javascript
// Get all open gigs by title
db.gigs.find({ status: "open", title: { $regex: "website", $options: "i" } })

// Get user's gigs
db.gigs.find({ ownerId: userId })

// Get bids for a gig (owner view)
db.bids.find({ gigId: gigId }).sort({ createdAt: -1 })

// Check for duplicate bid
db.bids.findOne({ gigId: gigId, freelancerId: freelancerId })
```

## 🚀 Deployment Checklist

### Backend (e.g., Heroku, Railway, Render)
- [ ] Update MONGODB_URI to production database
- [ ] Set NODE_ENV=production
- [ ] Generate strong JWT_SECRET
- [ ] Update CLIENT_URL to production frontend
- [ ] Enable HTTPS for Socket.io
- [ ] Set secure cookies

### Frontend (e.g., Vercel, Netlify)
- [ ] Update VITE_API_URL to production backend
- [ ] Update VITE_SOCKET_URL to production server
- [ ] Build: `npm run build`
- [ ] Deploy dist folder

## 📚 API Documentation

See [Backend README](./backend/README.md) for detailed API endpoints.

### Example API Calls

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123"}'
```

**Get Gigs with Search:**
```bash
curl "http://localhost:5000/api/gigs?title=website&page=1&limit=10"
```

**Submit Bid:**
```bash
curl -X POST http://localhost:5000/api/bids \
  -H "Content-Type: application/json" \
  -d '{"gigId":"GIG_ID","message":"Great project!","price":400}' \
  -b "token=YOUR_JWT"
```

## 🛠 Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Redux Toolkit, Axios, Socket.io, Vite |
| Backend | Express 5, Node.js, Socket.io |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs, HttpOnly Cookies |
| Real-time | Socket.io with transactions |

## 📝 Environment Variables

**Backend (.env)**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://...
CLIENT_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Check MONGODB_URI is correct
- Ensure IP address is whitelisted (if using MongoDB Atlas)
- Verify credentials

### Socket.io not connecting
- Check VITE_SOCKET_URL matches backend
- Ensure backend Socket.io server is running
- Check browser console for errors

### CORS errors
- Verify CLIENT_URL matches frontend origin
- Check credentials: true in both axios and Socket.io config

### Duplicate bid still allowed
- Ensure backend is restarted (schema indexes)
- Check bid status is 'pending' when checking duplicates

## 📖 Further Reading

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Guide](https://mongoosejs.com/)
- [React Documentation](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Socket.io Documentation](https://socket.io/docs/)
- [Vite Guide](https://vitejs.dev/)

## 📄 License

ISC

---

**Happy coding! 🎉**
