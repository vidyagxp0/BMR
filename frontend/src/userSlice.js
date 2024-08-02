import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get('http://192.168.1.14:7000/user/get-users', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("admin-token")}`
    }
  });
  return response.data;
});

export const fetchBmr = createAsyncThunk('bmr/fetchBmr', async () => {
  const response = await axios.get('http://192.168.1.14:7000/bmr/get-bmr', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("user-token")}`
    }
  });
  return response.data;
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
  },
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
    },
    addUser(state, action) {
      state.users.push(action.payload);
    },
    addBmr(state, action) {
      state.users.push(action.payload);
    },

    deleteBmr(state, action) {
      state.users = state.users.filter(user => user.bmr_id !== action.payload);
    },
    updateUser(state, action) {
      const index = state.users.findIndex(user => user.user_id === action.payload.id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload };
        console.log('Updated user:', state.users[index]); // Debug log
      }
    },
    updateBmr(state, action) {
      const index = state.users.findIndex(user => user.bmr_id === action.payload.id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload };
        console.log('Updated user:', state.users[index]); // Debug log
      }
    },
    deleteUser(state, action) {
      state.users = state.users.filter(user => user.user_id !== action.payload);
    },
  },
});

export const { setUsers, addUser, updateUser, deleteUser,addBmr,updateBmr,deleteBmr } = userSlice.actions;
export default userSlice.reducer; 
