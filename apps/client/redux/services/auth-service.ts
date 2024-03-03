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
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      await axios.post(`${API_URL}/user`, userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
  "auth/registerManager",
  async (userData, { rejectWithValue }) => {
    try {
      const { profilePic, company, address, ...managerData } = userData as any;

      await axios.post(
        `${API_URL}/user/manager`,
        {
          companyName: company,
          companyLocation: address,
          image: profilePic,
          ...managerData,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
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
