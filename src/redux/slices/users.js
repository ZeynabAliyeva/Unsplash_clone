import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const { data } = await axios.get("/users");
  return data;
});

const initialState = {
  users: {
    users: [],
    status: "loading",
  },
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  extraReducers: {
    [fetchUsers.pending]: (state) => {
      state.users.items = [];
      state.users.status = "loading";
    },
    [fetchUsers.fulfilled]: (state, action) => {
      state.users.items = action.payload;
      state.users.status = "loaded";
    },
    [fetchUsers.rejected]: (state) => {
      state.users.items = [];
      state.users.status = "error";
    },
  },
});

export const usersReducer = usersSlice.reducer;

export const selectUsers = (state) => state.auth.status;
