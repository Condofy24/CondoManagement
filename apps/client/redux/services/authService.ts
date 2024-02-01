import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://127.0.0.1:5000";

interface LogInInput {
  email: string;
  password: string;
}

export const logIn = createAsyncThunk(
  "auth/login",
  async ({ email, password }: LogInInput, { rejectWithValue }) => {
    console.log(email, password);
    try {
      const { data } = await axios.post(`${API_URL}/api/user/login`, {
        email,
        password,
      });

      // store user's token in local storage
      localStorage.setItem("userToken", data.userToken);

      return data;
    } catch (error: any) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
