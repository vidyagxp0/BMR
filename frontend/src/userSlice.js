import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunks
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get("http://195.35.6.197:7000/user/get-users", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
    },
  });
  return response.data;
});

export const fetchBmr = createAsyncThunk("bmr/fetchBmr", async () => {
  const response = await axios.get(
    "http://195.35.6.197:7000/bmr-form/get-bmr",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
      },
    }
  );
  return response.data;
});

// Slice
const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    bmrList: [],
  },
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
    },
    addUser(state, action) {
      state.users.push(action.payload);
    },
    addBmr(state, action) {
      state.bmrList.push(action.payload);
    },
    deleteBmr(state, action) {
      state.bmrList = state.bmrList.filter(
        (bmr) => bmr.bmr_id !== action.payload
      );
    },
    updateUser(state, action) {
      const index = state.users.findIndex(
        (user) => user.user_id === action.payload.id
      );
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload };
        console.log("Updated user:", state.users[index]);
      }
    },
    updateBmr(state, action) {
      const index = state.bmrList.findIndex(
        (bmr) => bmr.bmr_id === action.payload.id
      );
      if (index !== -1) {
        state.bmrList[index] = { ...state.bmrList[index], ...action.payload };
        console.log("Updated BMR:", state.bmrList[index]);
      }
    },
    deleteUser(state, action) {
      state.users = state.users.filter(
        (user) => user.user_id !== action.payload
      );
    },
  },
});

export const {
  setUsers,
  addUser,
  updateUser,
  deleteUser,
  addBmr,
  updateBmr,
  deleteBmr,
} = userSlice.actions;
export default userSlice.reducer;
