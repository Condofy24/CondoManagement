import { createSlice } from "@reduxjs/toolkit";
import { login } from "@/redux/services/auth-service";
import { UserInfo } from "@/types";

type InitialState = {
  value: AuthState;
};

type AuthState = {
  loading: boolean;
  userInfo: UserInfo;
  token: string | null;
  error: string | undefined;
  success: boolean;
};

const initialState = {
  value: {
    loading: false,
    userInfo: {},
    token: null,
    error: undefined,
    success: false,
  } as AuthState,
} as InitialState;

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.value.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.value.loading = false;
        state.value.userInfo = action.payload.userInfo;
        state.value.token = action.payload.token;
        state.value.error = undefined;
        state.value.success = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.value.loading = false;
        state.value.error = action.error.message;
        state.value.success = false;
      });
  },
});

export default auth.reducer;
