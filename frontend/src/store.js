// store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import bmrTabsReducer from "./bmrTabsSlice";

const store = configureStore({
  reducer: {
    users: userReducer,
    bmrTabs: bmrTabsReducer, //
  },
});

export default store;
