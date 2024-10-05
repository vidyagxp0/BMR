// userSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {BASE_URL} from "../src/config.json"

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get(`${BASE_URL}/user/get-users`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
    },
  });
  return response.data;
});

export const fetchBmr = createAsyncThunk("bmr/fetchBmr", async () => {
  const response = await axios.get(
    `${BASE_URL}/bmr-form/get-bmr`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
      },
    }
  );
  return response.data;
});

export const fetchUserRoles = createAsyncThunk('users/fetchUserRoles', async () => {
  const token = localStorage.getItem('user-token');
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  try {
    // Fetch reviewers
    const reviewerResponse = await axios.post(
      `${BASE_URL}/bmr-form/get-user-roles`,
      { role_id: 3 },
      { headers }
    );

    const reviewers = [
      { value: 'select-all', label: 'Select All' },
      ...new Map(
        reviewerResponse.data.message.map((role) => [
          role.user_id,
          { value: role.user_id, label: `${role.User.name}` },
        ])
      ).values(),
    ];

    // Fetch approvers
    const approverResponse = await axios.post(
      `${BASE_URL}/bmr-form/get-user-roles`,
      { role_id: 4 },
      { headers }
    );

    const approvers = [
      { value: 'select-all', label: 'Select All' },
      ...new Map(
        approverResponse.data.message.map((role) => [
          role.user_id,
          { value: role.user_id, label: `${role.User.name}` },
        ])
      ).values(),
    ];

    return { reviewers, approvers };
  } catch (error) {
    throw new Error(error);
  }
});


const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    bmrList: [],
    formData: {},
    selectedBMR: {},
    loading: false,
    error: null,
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
      }
    },
    updateBmr(state, action) {
      const index = state.bmrList.findIndex(
        (bmr) => bmr.bmr_id === action.payload.id
      );
      if (index !== -1) {
        state.bmrList[index] = { ...state.bmrList[index], ...action.payload };
      }
    },
    deleteUser(state, action) {
      state.users = state.users.filter(
        (user) => user.user_id !== action.payload
      );
    },
    setFormData(state, action) {
      state.formData = action.payload;
    },
    setSelectedBMR(state, action) {
      state.selectedBMR = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Added extraReducers for fetchUserRoles
      .addCase(fetchUserRoles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.reviewers = action.payload.reviewers;
        state.approvers = action.payload.approvers;
      })
      .addCase(fetchUserRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
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
  setFormData,
  setSelectedBMR,
} = userSlice.actions;
export default userSlice.reducer;
