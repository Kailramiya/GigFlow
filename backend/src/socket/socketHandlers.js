// Map to store user socket connections
const userSockets = new Map();

const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Register user socket connection
    socket.on('register_user', (userId) => {
      userSockets.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      // Remove user from map on disconnect
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

// Export function to emit hiring notification
export const emitHiringNotification = (io, freelancerId, bidData, gigData) => {
  const socketId = userSockets.get(freelancerId.toString());
  
  if (socketId) {
    io.to(socketId).emit('bid_accepted', {
      message: 'Congratulations! Your bid has been accepted!',
      gigTitle: gigData.title,
      budget: gigData.budget,
      bidId: bidData._id,
      bidPrice: bidData.price,
      timestamp: new Date(),
    });
    console.log(`Hiring notification sent to ${freelancerId}`);
  } else {
    console.log(`Freelancer ${freelancerId} not connected via socket`);
  }
};

export default setupSocketHandlers;
