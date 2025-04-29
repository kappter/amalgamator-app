import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import amalgamationReducer from './slices/amalgamationSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    amalgamation: amalgamationReducer
  }
});

export default store;
