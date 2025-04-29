import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  amalgamations: [],
  currentAmalgamation: null,
  loading: true,
  error: {}
};

const amalgamationSlice = createSlice({
  name: 'amalgamation',
  initialState,
  reducers: {
    getAmalgamations: (state, action) => {
      state.amalgamations = action.payload;
      state.loading = false;
    },
    getAmalgamation: (state, action) => {
      state.currentAmalgamation = action.payload;
      state.loading = false;
    },
    createAmalgamation: (state, action) => {
      state.amalgamations = [action.payload, ...state.amalgamations];
      state.loading = false;
    },
    updateAmalgamation: (state, action) => {
      state.amalgamations = state.amalgamations.map(amalgamation => 
        amalgamation._id === action.payload._id ? action.payload : amalgamation
      );
      state.loading = false;
    },
    addContribution: (state, action) => {
      if (state.currentAmalgamation) {
        state.currentAmalgamation.contributions = [
          action.payload,
          ...state.currentAmalgamation.contributions
        ];
      }
    },
    setLoading: (state) => {
      state.loading = true;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = {};
    }
  }
});

export const { 
  getAmalgamations,
  getAmalgamation,
  createAmalgamation,
  updateAmalgamation,
  addContribution,
  setLoading,
  setError,
  clearError
} = amalgamationSlice.actions;

export default amalgamationSlice.reducer;
