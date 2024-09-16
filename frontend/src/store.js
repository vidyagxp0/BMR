import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import BMRRecords from './Pages/UserSide/pages/BMRRecords/BMRRecords';

const store = configureStore({
  reducer: {
    users: userReducer,
  },

});

export default store;
