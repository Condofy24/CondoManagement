import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInfo } from "../models/user";

type InitialState = {
  value: AuthState;
};

type AuthState = {
  loading: boolean;
  userInfo: UserInfo;
  userToken: string | null;
  error: string | null;
  success: boolean;
};

const initialState = {
  value: {
    loading: false,
    userInfo: {},
    userToken: null,
    error: null,
    success: false,
  } as AuthState,
} as InitialState;

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: () => {
      return initialState;
    },
    logIn: (state, action: PayloadAction<string>) => {
      return initialState;
    },
  },
});

export const { logIn, logOut } = auth.actions;
export default auth.reducer;
