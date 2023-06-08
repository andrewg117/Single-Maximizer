import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import trackReducer from '../features/tracks/trackSlice';
import emailReducer from '../features/email/emailSlice';
import audioReducer from '../features/audio/audioSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tracks: trackReducer,
    email: emailReducer,
    audio: audioReducer,
  },
});
