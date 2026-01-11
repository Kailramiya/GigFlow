import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Async thunks
export const fetchBidsForGig = createAsyncThunk(
  'bids/fetchBidsForGig',
  async (gigId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/bids/gig/${gigId}`,
        { withCredentials: true }
      );
      return response.data.bids;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bids');
    }
  }
);

export const fetchMyBids = createAsyncThunk(
  'bids/fetchMyBids',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/bids/my-bids`,
        { withCredentials: true }
      );
      return response.data.bids;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your bids');
    }
  }
);

export const createBid = createAsyncThunk(
  'bids/createBid',
  async ({ gigId, price, message }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/bids`,
        { gigId, price, message },
        { withCredentials: true }
      );
      return response.data.bid;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit bid';
      const errors = error.response?.data?.errors || {};
      return rejectWithValue({ message, errors });
    }
  }
);

export const updateBidStatus = createAsyncThunk(
  'bids/updateBidStatus',
  async ({ bidId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/bids/${bidId}`,
        { status },
        { withCredentials: true }
      );
      return response.data.bid;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update bid');
    }
  }
);

export const hireBid = createAsyncThunk(
  'bids/hireBid',
  async (bidId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/bids/${bidId}/hire`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to hire freelancer');
    }
  }
);

const initialState = {
  bids: [],
  selectedGigBids: [],
  myBids: [],
  loading: false,
  error: null,
  selectedBid: null,
};

const bidsSlice = createSlice({
  name: 'bids',
  initialState,
  reducers: {
    clearBidsError: (state) => {
      state.error = null;
    },
    selectBid: (state, action) => {
      state.selectedBid = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchBidsForGig
    builder
      .addCase(fetchBidsForGig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBidsForGig.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedGigBids = action.payload;
      })
      .addCase(fetchBidsForGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch bids';
      });

    // fetchMyBids
    builder
      .addCase(fetchMyBids.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBids.fulfilled, (state, action) => {
        state.loading = false;
        state.myBids = action.payload;
      })
      .addCase(fetchMyBids.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch your bids';
      });

    // updateBidStatus
    builder
      .addCase(updateBidStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBidStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.selectedGigBids.findIndex(bid => bid._id === action.payload._id);
        if (index !== -1) {
          state.selectedGigBids[index] = action.payload;
        }
      })
      .addCase(updateBidStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update bid status';
      });

    // createBid
    builder
      .addCase(createBid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBid.fulfilled, (state, action) => {
        state.loading = false;
        state.myBids.push(action.payload);
      })
      .addCase(createBid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to submit bid';
      });

    // hireBid
    builder
      .addCase(hireBid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(hireBid.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.selectedGigBids.findIndex(bid => bid._id === action.payload.bid._id);
        if (index !== -1) {
          state.selectedGigBids[index] = action.payload.bid;
        }
      })
      .addCase(hireBid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to hire freelancer';
      });
  },
});

export const { clearBidsError, selectBid } = bidsSlice.actions;
export default bidsSlice.reducer;
