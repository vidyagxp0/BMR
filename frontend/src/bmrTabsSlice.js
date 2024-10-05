import { createSlice } from "@reduxjs/toolkit";

const bmrTabsSlice = createSlice({
  name: "bmrTabs",
  initialState: {
    tabs: [], // Ensure this is initialized as an array
  },
  reducers: {
    addTab(state, action) {
      state.tabs.push(action.payload); // Push new tab into the array
    },
    clearTabs(state) {
      state.tabs = []; // Optional: to clear all tabs
    },
  },
});

export const { addTab, clearTabs } = bmrTabsSlice.actions;
export default bmrTabsSlice.reducer;
