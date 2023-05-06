import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import trackReducer from '../features/tracks/trackSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tracks: trackReducer
  },
});
