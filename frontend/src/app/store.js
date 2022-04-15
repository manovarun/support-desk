import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import ticketReducer from '../features/tickets/ticketSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketReducer,
  },
});
