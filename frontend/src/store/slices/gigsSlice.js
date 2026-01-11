import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Async thunks
export const fetchAllGigs = createAsyncThunk(
  'gigs/fetchAllGigs',
  async ({ title = '', page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (title) params.append('title', title);
      params.append('page', page);
      params.append('limit', limit);

      const response = await axios.get(
        `${API_URL}/gigs?${params.toString()}`,
        { withCredentials: true }
      );
      
      // Clean up gig IDs in case they have artifacts like `:1`
      if (response.data.gigs) {
        response.data.gigs = response.data.gigs.map(gig => ({
          ...gig,
          _id: gig._id?.split(':')[0] || gig._id,
        }));
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch gigs');
    }
  }
);

export const fetchGigById = createAsyncThunk(
  'gigs/fetchGigById',
  async (gigId, { rejectWithValue }) => {
    try {
      // Clean up gigId in case it has `:1` or other artifacts
      const cleanGigId = gigId?.split(':')[0] || gigId;
      
      const response = await axios.get(
        `${API_URL}/gigs/${cleanGigId}`,
        { withCredentials: true }
      );
      return response.data.gig;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch gig');
    }
  }
);

export const fetchMyGigs = createAsyncThunk(
  'gigs/fetchMyGigs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/gigs/user/my-gigs`,
        { withCredentials: true }
      );
      return response.data.gigs;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your gigs');
    }
  }
);

export const createGig = createAsyncThunk(
  'gigs/createGig',
  async ({ title, description, budget }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/gigs`,
        { title, description, budget },
        { withCredentials: true }
      );
      return response.data.gig;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create gig');
    }
  }
);

export const updateGig = createAsyncThunk(
  'gigs/updateGig',
  async ({ gigId, title, description, budget, status }, { rejectWithValue }) => {
    try {
      // Clean up gigId in case it has `:1` or other artifacts
      const cleanGigId = gigId?.split(':')[0] || gigId;
      
      const response = await axios.put(
        `${API_URL}/gigs/${cleanGigId}`,
        { title, description, budget, status },
        { withCredentials: true }
      );
      return response.data.gig;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update gig');
    }
  }
);

export const deleteGig = createAsyncThunk(
  'gigs/deleteGig',
  async (gigId, { rejectWithValue }) => {
    try {
      // Clean up gigId in case it has `:1` or other artifacts
      const cleanGigId = gigId?.split(':')[0] || gigId;
      
      await axios.delete(
        `${API_URL}/gigs/${cleanGigId}`,
        { withCredentials: true }
      );
      return cleanGigId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete gig');
    }
  }
);

const initialState = {
  allGigs: [],
  myGigs: [],
  currentGig: null,
  pagination: {
    page: 1,
    pages: 1,
    total: 0,
    count: 0,
  },
  loading: false,
  error: null,
};

const gigsSlice = createSlice({
  name: 'gigs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentGig: (state) => {
      state.currentGig = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all gigs
    builder
      .addCase(fetchAllGigs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllGigs.fulfilled, (state, action) => {
        state.loading = false;
        state.allGigs = action.payload.gigs;
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total,
          count: action.payload.count,
        };
      })
      .addCase(fetchAllGigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch gig by ID
    builder
      .addCase(fetchGigById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGigById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGig = action.payload;
      })
      .addCase(fetchGigById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch my gigs
    builder
      .addCase(fetchMyGigs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyGigs.fulfilled, (state, action) => {
        state.loading = false;
        state.myGigs = action.payload;
      })
      .addCase(fetchMyGigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create gig
    builder
      .addCase(createGig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGig.fulfilled, (state, action) => {
        state.loading = false;
        state.myGigs.push(action.payload);
      })
      .addCase(createGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update gig
    builder
      .addCase(updateGig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGig.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.myGigs.findIndex(g => g._id === action.payload._id);
        if (index !== -1) {
          state.myGigs[index] = action.payload;
        }
        if (state.currentGig?._id === action.payload._id) {
          state.currentGig = action.payload;
        }
      })
      .addCase(updateGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete gig
    builder
      .addCase(deleteGig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGig.fulfilled, (state, action) => {
        state.loading = false;
        state.myGigs = state.myGigs.filter(g => g._id !== action.payload);
        if (state.currentGig?._id === action.payload) {
          state.currentGig = null;
        }
      })
      .addCase(deleteGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentGig } = gigsSlice.actions;
export default gigsSlice.reducer;
