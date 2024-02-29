import { createSlice } from "@reduxjs/toolkit";
import { login } from "@/redux/services/auth-service";
import { User } from "@/types";
import { updateUserProfile } from "../services/user-service";

type InitialState = {
  value: AuthState;
};
type Admin = {
  role: number;
  companyId: string;
} | null;

type AuthState = {
  loading: boolean;
  user: User;
  admin: Admin;
  token: string | null;
  error: string | undefined;
  loggedIn: boolean;
};

const initialState = {
  value: {
    loading: false,
    user: {},
    admin: null,
    token: null,
    error: undefined,
    loggedIn: false,
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
        state.value.user = action.payload.user;
        state.value.token = action.payload.token;
        state.value.error = undefined;
        state.value.loggedIn = true;

        if (action.payload.user.role <= 2) {
          state.value.admin = {
            role: action.payload.user.role,
            companyId: action.payload.user.companyId as string,
          };
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.value.loading = false;
        state.value.error = action.error.message;
        state.value.loggedIn = false;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.value.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.value.loading = false;
        state.value.user = action.payload;
        state.value.error = undefined;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.value.loading = false;
        state.value.error = action.error.message;
      });
  },
});

export default auth.reducer;
