import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { UserInfo} from "@/types";
import toast from "react-hot-toast";
import { API_URL } from "../store";


interface UpdateUserData {
    id: string;
    name: string;
    email: string;
    newPassword: string;
    phoneNumber: string;
    profilePic: File;
  }
  
  export const updateUserProfile = createAsyncThunk<UserInfo, UpdateUserData>(
    "auth/updateUserProfile",
    async ({id, name, email, newPassword, phoneNumber, profilePic}, { rejectWithValue }) => {
      try {
        const { data } = await axios.patch<UserInfo>(`${API_URL}/user/${id}`, {
          id,
          name,
          email,
          newPassword,
          phoneNumber,
          profilePic
        });
        
  
        // Handle the response accordingly
        toast.success("Profile updated successfully!");
        return data;
      } catch (error: any) {
        if (error.response && error.response.data.message) {
          toast.error(error.response.data.message);
          return rejectWithValue(error.response.data.message);
        } else {
          toast.error("An error occurred while updating the profile.");
          return rejectWithValue(error.message);
        }
      }
    }
  );