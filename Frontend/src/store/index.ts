import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tokenReducer from './slices/tokenSlice';
import analyticsReducer from './slices/analyticsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    token: tokenReducer,
    analytics: analyticsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
