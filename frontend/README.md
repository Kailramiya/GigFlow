# ServiceHive - Frontend

A modern React frontend for a freelance gig marketplace with real-time notifications and Redux state management.

## Features

- **Authentication**: Register, login, logout with JWT
- **Gig Feed**: Browse open gigs with search and pagination
- **Gig Details**: View detailed gig information
- **Bidding**: Submit bids on gigs (freelancer)
- **Dashboard**: Manage your gigs and bids
- **Real-time Notifications**: Socket.io for instant hiring alerts
- **Responsive UI**: Works on desktop and mobile

## Tech Stack

- **Framework**: React 18
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Real-time**: Socket.io-client
- **Build Tool**: Vite
- **Routing**: React Router 6
- **CSS**: Inline styles (easily replaceable with CSS modules/Tailwind)

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx                       # Main app component
│   ├── main.jsx                      # Entry point
│   ├── components/
│   │   ├── Navbar.jsx               # Navigation
│   │   └── NotificationCenter.jsx    # Toast notifications
│   ├── pages/
│   │   ├── AuthPage.jsx             # Login/Register
│   │   ├── GigFeedPage.jsx          # Browse gigs
│   │   ├── GigDetailPage.jsx        # Single gig view
│   │   └── DashboardPage.jsx        # User dashboard
│   ├── services/
│   │   └── socketService.js         # Socket.io client
│   ├── store/
│   │   ├── store.js                 # Redux store setup
│   │   └── slices/
│   │       ├── authSlice.js         # Auth state & thunks
│   │       ├── gigsSlice.js         # Gigs state & thunks
│   │       └── notificationsSlice.js # Notifications state
│   └── index.html
├── vite.config.js
├── package.json
├── .env.example
└── .gitignore
```

## Installation

### Prerequisites
- Node.js 16+
- Backend running on http://localhost:5000

### Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Create `.env` file** from `.env.example`
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables**
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Or build for production:
   ```bash
   npm run build
   npm run preview
   ```

## Key Features

### Authentication
- Register with name, email, password
- Login with email/password
- JWT stored in HttpOnly cookies (secure)
- Auto-logout on token expiry
- Protected routes

### Gig Management
- Browse all open gigs
- Search gigs by title (case-insensitive)
- Pagination support (10 per page)
- View gig details with owner info
- Create new gigs (dashboard)
- Edit own gigs
- Delete own gigs

### Bidding System
- Submit bids on open gigs
- View all bids (gig owner)
- View your bids (freelancer)
- Bid status tracking

### Real-time Features
- Socket.io integration
- Auto-reconnect with exponential backoff
- Instant notifications when hired
- Toast notifications with auto-dismiss

### Redux State Management

**Auth Slice**
- Register, login, logout, getCurrentUser thunks
- User state, authentication status
- Error handling

**Gigs Slice**
- fetchAllGigs, fetchGigById, fetchMyGigs thunks
- Create, update, delete gig thunks
- Pagination info
- Current gig details

**Notifications Slice**
- Add, remove, clear notifications
- Toast notification queue

## Usage Examples

### Register
1. Click "Login" button (top right)
2. Click "Register here"
3. Fill in name, email, password
4. Submit

### Create a Gig
1. Login as user
2. Go to Dashboard
3. Click "+ Create New Gig"
4. Fill in title, description, budget
5. Submit

### Browse & Bid on Gigs
1. Stay on home page (gig feed)
2. Search by title or scroll
3. Click gig to view details
4. Click "Submit Bid"
5. Fill in message and price
6. Submit

### Receive Hiring Notification
1. Submit a bid on a gig
2. Gig owner goes to their dashboard
3. Click "Bids" on the gig
4. Click "Hire" next to your bid
5. You'll see instant toast notification!

## API Integration

All API calls use axios with:
- `withCredentials: true` for cookie-based auth
- Error handling with Redux thunks
- Loading states
- Automatic error messages

Example from gigsSlice.js:
```javascript
export const fetchAllGigs = createAsyncThunk(
  'gigs/fetchAllGigs',
  async ({ title = '', page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/gigs?title=${title}&page=${page}&limit=${limit}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
```

## Socket.io Integration

Connection flow:
1. User logs in (App.jsx useEffect)
2. `connectSocket(user.id)` is called
3. Socket emits `register_user` event
4. Backend stores user socket mapping
5. On hiring, backend emits `bid_accepted`
6. Frontend shows notification toast

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | http://localhost:5000/api |
| `VITE_SOCKET_URL` | Socket.io URL | http://localhost:5000 |

## Components

### Navbar
- Shows current user name
- Login/Dashboard/Logout buttons
- Responsive

### NotificationCenter
- Fixed toast notifications (top right)
- Auto-dismiss after 5 seconds
- Close button
- Color-coded by type

### AuthPage
- Toggle between login/register
- Form validation
- Error messages
- Loading state

### GigFeedPage
- Grid layout of gigs
- Search input
- Pagination controls
- Loading/error states

### GigDetailPage
- Full gig information
- Owner details
- Bid button (if not owner)
- Edit/Bids buttons (if owner)
- Back navigation

### DashboardPage
- Welcome message
- Create gig button
- Grid of user's gigs
- Quick actions (View, Bids)

## Styling

Currently uses **inline styles** for rapid development. Easy to migrate to:
- CSS Modules
- Tailwind CSS
- styled-components
- Sass/SCSS

## Dependencies

- `react@^18.2.0` - UI library
- `react-dom@^18.2.0` - React DOM
- `react-router-dom@^6.20.0` - Routing
- `@reduxjs/toolkit@^1.9.7` - State management
- `react-redux@^8.1.3` - React-Redux bindings
- `axios@^1.6.2` - HTTP client
- `socket.io-client@^4.7.2` - Real-time client

## Dev Dependencies

- `vite@^5.0.8` - Build tool
- `@vitejs/plugin-react@^4.2.1` - React plugin

## Deployment

### Build
```bash
npm run build
```

Outputs to `dist/` folder.

### Serve
```bash
npm run preview
```

### Production Checklist
- [ ] Update `VITE_API_URL` to production backend
- [ ] Update `VITE_SOCKET_URL` to production server
- [ ] Set `NODE_ENV=production`
- [ ] Enable secure cookies (HTTPS only)
- [ ] Configure CORS origin in backend

## License

ISC
