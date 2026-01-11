import http from 'http';
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { Server } from 'socket.io';
import setupSocketHandlers from './src/socket/socketHandlers.js';

connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  },
});

// Make io instance available to the app
app.set('io', io);

// Setup socket event handlers
setupSocketHandlers(io);

server.listen(5000, () => {
  console.log("Server running on port 5000 with WebSocket support");
});
