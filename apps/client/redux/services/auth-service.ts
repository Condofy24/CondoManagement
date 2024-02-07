import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { UserInfo } from "@/types";
import { TSignupSchema } from "@/lib/validation-schemas";

const API_URL = "http://127.0.0.1:4000/api";

interface LoginInput {
  email: string;
  password: string;
}

interface LoginResult {
  token: string;
  userInfo: UserInfo;
}

export const login = createAsyncThunk<LoginResult, LoginInput>(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post<LoginResult>(`${API_URL}/auth/login`, {
        email,
        password,
      });

      // store user's token in local storage
      localStorage.setItem("token", data.token);

      return data;
    } catch (error: any) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const registerUser = createAsyncThunk<
  void,
  TSignupSchema | { profilePic: File; role: string }
>("user", async (userData, { rejectWithValue }) => {
  try {
    console.log("data", userData);
    await axios.post(`${API_URL}/user`, userData);
  } catch (error: any) {
    // return custom error message from API if any
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});
