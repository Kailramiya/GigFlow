import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import gigsReducer from './slices/gigsSlice.js';
import notificationsReducer from './slices/notificationsSlice.js';
import bidsReducer from './slices/bidsSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    gigs: gigsReducer,
    notifications: notificationsReducer,
    bids: bidsReducer,
  },
});

export default store;
