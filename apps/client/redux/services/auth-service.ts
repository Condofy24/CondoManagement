import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { User, UserRolesEnum } from "@/types";
import { TManagerSignupSchema, TSignupSchema } from "@/lib/validation-schemas";
import toast from "react-hot-toast";
import { API_URL } from "@/global";

interface LoginInput {
  email: string;
  password: string;
}

interface LoginResult {
  token: string;
  user: User;
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
      localStorage.setItem("user", JSON.stringify(data.user));

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

type UserRegistationData =
  | TSignupSchema
  | { profilePic: File; role: UserRolesEnum };

export const registerUser = createAsyncThunk<void, UserRegistationData>(
  "",
  async (userData, { rejectWithValue }) => {
    try {
      await axios.post(`${API_URL}/user`, userData);
    } catch (error: any) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        toast.error(
          "An error occured when creating your account. Please try again!",
        );
        return rejectWithValue(error.response.data.message);
      } else {
        toast.error(
          "An error occured when creating your account. Please try again!",
        );
        return rejectWithValue(error.message);
      }
    }
    toast.success("Registered successfully");
  },
);

type ManagerRegistrationData =
  | TManagerSignupSchema
  | { profilePic: File; role: string };

export const registerManager = createAsyncThunk<void, ManagerRegistrationData>(
  "",
  async (userData, { rejectWithValue }) => {
    try {
      const { company, address, ...managerData } =
        userData as TManagerSignupSchema;

      await axios.post(`${API_URL}/company`, { company, address });
      await axios.post(`${API_URL}/user/manager`, managerData);
    } catch (error: any) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        toast.error(
          "An error occured when creating your account. Please try again!",
        );
        return rejectWithValue(error.response.data.message);
      } else {
        toast.error(
          "An error occured when creating your account. Please try again!",
        );
        return rejectWithValue(error.message);
      }
    }
    toast.success("Registered successfully");
  },
);
