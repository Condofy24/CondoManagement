import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInfo, UserRolesEnum } from "../models/user";
import { login } from "../services/authService";

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

interface UserData {
  email: string;
  password: string;
}

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state: any) => {
      return initialState;
    },
    // logout: () => {
    //   return initialState;
    // },
    // login: (state, action: PayloadAction<UserData>) => {
    //   return {
    //     value: {
    //       loading: false,
    //       userInfo: {
    //         email: action.payload.email,
    //         name: "",
    //         role: UserRolesEnum.ACCOUNTANT,
    //       },
    //       userToken: null,
    //       error: null,
    //       success: false,
    //     },
    //   };
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.value.loading = true;
    }).addCase(login.fulfilled, (state, action) => {
      state.value.loading = false;
      state.value.userInfo = action.payload;
      state.value.userToken = action.payload.userToken;
      state.value.error = null;
      state.value.success = true;
    })
  }
});

//export const { login, logout } = auth.actions;
export default auth.reducer;
