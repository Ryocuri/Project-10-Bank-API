import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getUserProfile } from './authSlice';

const API_URL = import.meta.env.VITE_API_URL;

// Initial state
const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  isLoading: false,
  error: null,
};

// Async thunk for updating profile
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(
        `${API_URL}/user/profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      return response.data.body;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update profile'
      );
    }
  }
);

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.firstName = action.payload.firstName || '';
      state.lastName = action.payload.lastName || '';
      state.email = action.payload.email || '';
    },
    clearUserProfile: (state) => {
      state.firstName = '';
      state.lastName = '';
      state.email = '';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Listen to getUserProfile from authSlice
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.firstName = action.payload.firstName || '';
        state.lastName = action.payload.lastName || '';
        state.email = action.payload.email || '';
      })
      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setUserProfile, clearUserProfile } = userSlice.actions;
export default userSlice.reducer;