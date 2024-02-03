import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { UserRolesEnum } from "../models/user";

const API_URL = "http://127.0.0.1:4000/api";

interface LoginInput {
  email: string;
  password: string;
}

interface LoginResult {
  token: string;
  userInfo: {
    email: string;
    id: string;
    name: string;
    role: UserRolesEnum;
    phoneNumber: string;
    imageUrl: string;
    imageId: string;
  };
}

export const login = createAsyncThunk<LoginResult, LoginInput>(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    console.log(email, password);
    try {
      const { data } = await axios.post<LoginResult>(`${API_URL}/auth/login`, {
        email,
        password,
      });

      // store user's token in local storage
      localStorage.setItem("token", data.token);
      
      console.log(data);
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
